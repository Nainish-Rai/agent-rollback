import assert from 'node:assert/strict';
import { chmod, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { runCli } from '../src/cli.js';

test('should create and restore checkpoints through the CLI', async () => {
  const workspaceRoot = await mkdtemp(path.join(os.tmpdir(), 'agent-rollback-cli-'));

  try {
    await writeFile(path.join(workspaceRoot, 'index.txt'), 'one\n');
    const first = createMemoryIo();
    await runCli(['--cwd', workspaceRoot, 'checkpoint', 'first'], first);
    const firstCheckpointId = extractCheckpointId(first.stdoutText);

    await writeFile(path.join(workspaceRoot, 'index.txt'), 'two\n');
    await runCli(['--cwd', workspaceRoot, 'checkpoint', 'second'], createMemoryIo());

    const list = createMemoryIo();
    await runCli(['--cwd', workspaceRoot, 'list'], list);
    assert.match(list.stdoutText, /first/);
    assert.match(list.stdoutText, /second/);

    await runCli(['--cwd', workspaceRoot, 'revert', firstCheckpointId, '--yes'], createMemoryIo());
    assert.equal(await readFile(path.join(workspaceRoot, 'index.txt'), 'utf8'), 'one\n');
  } finally {
    await rm(workspaceRoot, { recursive: true, force: true });
  }
});

test('should support JSON output, pin, prune, and undo workflows', async () => {
  const workspaceRoot = await mkdtemp(path.join(os.tmpdir(), 'agent-rollback-hybrid-'));

  try {
    await writeFile(path.join(workspaceRoot, 'index.txt'), 'one\n');
    const firstOutput = createMemoryIo();
    await runCli(['--cwd', workspaceRoot, 'checkpoint', '--json', 'stable'], firstOutput);
    const firstCheckpoint = JSON.parse(firstOutput.stdoutText).checkpoint;
    await wait(5);

    await writeFile(path.join(workspaceRoot, 'index.txt'), 'two\n');
    const secondOutput = createMemoryIo();
    await runCli(['--cwd', workspaceRoot, 'checkpoint', '--json', 'temporary'], secondOutput);
    const secondCheckpoint = JSON.parse(secondOutput.stdoutText).checkpoint;
    await wait(5);

    await writeFile(path.join(workspaceRoot, 'index.txt'), 'three\n');
    await runCli(['--cwd', workspaceRoot, 'checkpoint', 'latest'], createMemoryIo());

    await runCli(['--cwd', workspaceRoot, 'pin', firstCheckpoint.id, 'known good'], createMemoryIo());

    const dryRun = createMemoryIo();
    await runCli(['--cwd', workspaceRoot, 'prune', '--keep-last', '1', '--dry-run', '--json'], dryRun);
    const dryRunPlan = JSON.parse(dryRun.stdoutText);
    assert.deepEqual(
      dryRunPlan.deleted.map((checkpoint) => checkpoint.id),
      [secondCheckpoint.id],
    );
    assert.equal(dryRunPlan.applied, false);

    await runCli(['--cwd', workspaceRoot, 'prune', '--keep-last', '1', '--yes'], createMemoryIo());

    const list = createMemoryIo();
    await runCli(['--cwd', workspaceRoot, 'list', '--json'], list);
    const checkpoints = JSON.parse(list.stdoutText).checkpoints;
    assert.equal(checkpoints.length, 2);
    assert.equal(checkpoints.some((checkpoint) => checkpoint.id === secondCheckpoint.id), false);
    assert.deepEqual(
      checkpoints.map((checkpoint) => checkpoint.id),
      [firstCheckpoint.id, checkpoints.at(-1).id],
    );
    assert.equal(checkpoints[0].metadata.pinned, true);

    await runCli(['--cwd', workspaceRoot, 'undo', '--yes'], createMemoryIo());
    assert.equal(await readFile(path.join(workspaceRoot, 'index.txt'), 'utf8'), 'one\n');
  } finally {
    await rm(workspaceRoot, { recursive: true, force: true });
  }
});

test('should install Codex hooks and create deduped hook checkpoints', async () => {
  const workspaceRoot = await mkdtemp(path.join(os.tmpdir(), 'agent-rollback-hooks-'));

  try {
    const installOutput = createMemoryIo();
    await runCli(['--cwd', workspaceRoot, 'init', 'codex'], installOutput);

    const hookConfig = JSON.parse(await readFile(path.join(workspaceRoot, '.codex', 'hooks.json'), 'utf8'));
    assert.match(hookConfig.hooks.PostToolUse[0].hooks[0].command, /agent-rollback\.js" hook/);
    assert.equal(hookConfig.hooks.PreToolUse[0].matcher, '*');

    await writeFile(path.join(workspaceRoot, 'index.txt'), 'hooked\n');
    const transcriptPath = path.join(workspaceRoot, 'session.jsonl');
    await writeFile(transcriptPath, '{"type":"user","text":"refactor auth"}\n{"type":"tool","name":"Bash"}\n');
    const hookEvent = {
      cwd: workspaceRoot,
      hook_event_name: 'PostToolUse',
      session_id: 'session-1',
      transcript_path: transcriptPath,
      tool_name: 'Bash',
      tool_use_id: 'tool-1',
      turn_id: 'turn-1',
    };

    await runCli(['--cwd', workspaceRoot, 'hook'], {
      ...createMemoryIo(),
      stdinText: JSON.stringify(hookEvent),
    });
    await runCli(['--cwd', workspaceRoot, 'hook'], {
      ...createMemoryIo(),
      stdinText: JSON.stringify(hookEvent),
    });

    const list = createMemoryIo();
    await runCli(['--cwd', workspaceRoot, 'list', '--json'], list);
    const checkpoints = JSON.parse(list.stdoutText).checkpoints;
    assert.equal(checkpoints.length, 1);
    assert.equal(checkpoints[0].metadata.source, 'codex-hook');
    assert.equal(checkpoints[0].metadata.toolName, 'Bash');
    assert.deepEqual(checkpoints[0].metadata.transcriptTail, [
      '{"type":"user","text":"refactor auth"}',
      '{"type":"tool","name":"Bash"}',
    ]);
  } finally {
    await rm(workspaceRoot, { recursive: true, force: true });
  }
});

test('should render a no-input checkpoint browser and JSON browser output', async () => {
  const workspaceRoot = await mkdtemp(path.join(os.tmpdir(), 'agent-rollback-tui-'));

  try {
    await writeFile(path.join(workspaceRoot, 'index.txt'), 'one\n');
    await runCli(['--cwd', workspaceRoot, 'checkpoint', 'stable auth'], createMemoryIo());
    await writeFile(path.join(workspaceRoot, 'index.txt'), 'two\n');
    await runCli(['--cwd', workspaceRoot, 'checkpoint', 'latest billing'], createMemoryIo());

    const browser = createMemoryIo();
    await runCli(['--cwd', workspaceRoot, 'tui', '--query', 'billing', '--no-input'], browser);
    assert.match(browser.stdoutText, /agent-rollback - checkpoints/);
    assert.match(browser.stdoutText, /latest billing/);
    assert.doesNotMatch(browser.stdoutText, /stable auth/);

    const jsonBrowser = createMemoryIo();
    await runCli(['--cwd', workspaceRoot, 'tui', '--query', 'stable', '--no-input', '--json'], jsonBrowser);
    const browserData = JSON.parse(jsonBrowser.stdoutText);
    assert.equal(browserData.checkpoints.length, 1);
    assert.match(browserData.checkpoints[0].metadata.label, /stable/);
    assert.match(jsonBrowser.stderrText, /agent-rollback - checkpoints/);
  } finally {
    await rm(workspaceRoot, { recursive: true, force: true });
  }
});

test('should log operations, revert an operation, and replay from a checkpoint', async () => {
  const workspaceRoot = await mkdtemp(path.join(os.tmpdir(), 'agent-rollback-ops-'));
  const fakeCodexPath = path.join(workspaceRoot, 'fake-codex.mjs');

  try {
    await writeFile(
      fakeCodexPath,
      [
        '#!/usr/bin/env node',
        'import { writeFileSync } from "node:fs";',
        'import path from "node:path";',
        'writeFileSync(path.join(process.cwd(), "replayed.txt"), process.argv.slice(2).join(" "));',
        '',
      ].join('\n'),
    );
    await chmod(fakeCodexPath, 0o755);

    await writeFile(path.join(workspaceRoot, 'index.txt'), 'one\n');
    const firstOutput = createMemoryIo();
    await runCli(['--cwd', workspaceRoot, 'checkpoint', '--json', 'first'], firstOutput);
    const firstCheckpoint = JSON.parse(firstOutput.stdoutText).checkpoint;
    await wait(5);

    await writeFile(path.join(workspaceRoot, 'index.txt'), 'two\n');
    await runCli(['--cwd', workspaceRoot, 'checkpoint', 'second'], createMemoryIo());

    const log = createMemoryIo();
    await runCli(['--cwd', workspaceRoot, 'log', '--json'], log);
    const operations = JSON.parse(log.stdoutText).operations;
    const secondOperation = operations.find(
      (operation) => operation.details?.previousCheckpointId === firstCheckpoint.id,
    );
    assert.ok(secondOperation);

    const dryRun = createMemoryIo();
    await runCli(['--cwd', workspaceRoot, 'op', 'revert', secondOperation.id, '--dry-run', '--json'], dryRun);
    assert.equal(JSON.parse(dryRun.stdoutText).applied, false);
    assert.equal(await readFile(path.join(workspaceRoot, 'index.txt'), 'utf8'), 'two\n');

    const revertOutput = createMemoryIo();
    await runCli(['--cwd', workspaceRoot, 'op', 'revert', secondOperation.id, '--yes'], revertOutput);
    assert.match(revertOutput.stdoutText, /safety checkpoint/);
    assert.equal(await readFile(path.join(workspaceRoot, 'index.txt'), 'utf8'), 'one\n');

    const replay = createMemoryIo();
    await runCli(
      [
        '--cwd',
        workspaceRoot,
        'replay',
        firstCheckpoint.id,
        '--yes',
        '--json',
        '--codex-bin',
        fakeCodexPath,
        'codex',
        'try again',
      ],
      replay,
    );
    const replayResult = JSON.parse(replay.stdoutText);
    assert.match(replayResult.before.id, new RegExp(checkpointIdPattern()));
    assert.equal(
      await readFile(path.join(workspaceRoot, 'replayed.txt'), 'utf8'),
      'exec --sandbox workspace-write try again',
    );
  } finally {
    await rm(workspaceRoot, { recursive: true, force: true });
  }
});

test('should wrap a Codex run with before and after checkpoints', async () => {
  const workspaceRoot = await mkdtemp(path.join(os.tmpdir(), 'agent-rollback-run-'));
  const fakeCodexPath = path.join(workspaceRoot, 'fake-codex.mjs');

  try {
    await writeFile(
      fakeCodexPath,
      [
        '#!/usr/bin/env node',
        'import { writeFileSync } from "node:fs";',
        'import path from "node:path";',
        'writeFileSync(path.join(process.cwd(), "codex-output.txt"), process.argv.slice(2).join(" "));',
        '',
      ].join('\n'),
    );
    await chmod(fakeCodexPath, 0o755);

    const output = createMemoryIo();
    await runCli(
      ['--cwd', workspaceRoot, 'run', '--json', '--codex-bin', fakeCodexPath, 'codex', 'edit the app'],
      output,
    );

    const runResult = JSON.parse(output.stdoutText);
    const beforeCheckpointId = runResult.before.id;
    assert.match(runResult.after.id, new RegExp(checkpointIdPattern()));
    assert.equal(
      await readFile(path.join(workspaceRoot, 'codex-output.txt'), 'utf8'),
      'exec --sandbox workspace-write edit the app',
    );

    await runCli(['--cwd', workspaceRoot, 'revert', beforeCheckpointId, '--yes'], createMemoryIo());
    await assert.rejects(readFile(path.join(workspaceRoot, 'codex-output.txt'), 'utf8'), {
      code: 'ENOENT',
    });
  } finally {
    await rm(workspaceRoot, { recursive: true, force: true });
  }
});

test('should create checkpoints from Codex JSON event streams', async () => {
  const workspaceRoot = await mkdtemp(path.join(os.tmpdir(), 'agent-rollback-events-'));
  const fakeCodexPath = path.join(workspaceRoot, 'fake-codex-events.mjs');

  try {
    await writeFile(
      fakeCodexPath,
      [
        '#!/usr/bin/env node',
        'import { writeFileSync } from "node:fs";',
        'import path from "node:path";',
        'writeFileSync(path.join(process.cwd(), "event-output.txt"), process.argv.slice(2).join(" "));',
        'console.log(JSON.stringify({ type: "tool_call.completed", item: { type: "tool_call" } }));',
        '',
      ].join('\n'),
    );
    await chmod(fakeCodexPath, 0o755);

    const output = createMemoryIo();
    await runCli(
      [
        '--cwd',
        workspaceRoot,
        'run',
        '--event-stream',
        '--json',
        '--codex-bin',
        fakeCodexPath,
        'codex',
        'event mode',
      ],
      output,
    );
    const result = JSON.parse(output.stdoutText);
    assert.equal(result.exitCode, 0);
    assert.equal(
      await readFile(path.join(workspaceRoot, 'event-output.txt'), 'utf8'),
      'exec --json --sandbox workspace-write event mode',
    );

    const list = createMemoryIo();
    await runCli(['--cwd', workspaceRoot, 'list', '--json'], list);
    const checkpoints = JSON.parse(list.stdoutText).checkpoints;
    assert.equal(
      checkpoints.some((checkpoint) => checkpoint.metadata.source === 'codex-json-event'),
      true,
    );
  } finally {
    await rm(workspaceRoot, { recursive: true, force: true });
  }
});

function createMemoryIo() {
  const output = { stderr: '', stdout: '' };

  return {
    stderr: {
      write(chunk) {
        output.stderr += chunk;
      },
    },
    stdout: {
      write(chunk) {
        output.stdout += chunk;
      },
    },
    get stderrText() {
      return output.stderr;
    },
    get stdoutText() {
      return output.stdout;
    },
  };
}

function extractCheckpointId(output) {
  const match = output.match(/Created\s+([a-zA-Z0-9._-]+)/);
  assert.ok(match, `expected checkpoint id in output: ${output}`);
  return match[1];
}

function extractLabeledCheckpointId(output, label) {
  const match = output.match(new RegExp(`${label}:\\s+(${checkpointIdPattern()})`));
  assert.ok(match, `expected ${label} checkpoint id in output: ${output}`);
  return match[1];
}

function checkpointIdPattern() {
  return 'cp-[a-zA-Z0-9._-]+';
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
