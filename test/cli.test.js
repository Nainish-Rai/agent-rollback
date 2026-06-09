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
      ['--cwd', workspaceRoot, 'run', '--codex-bin', fakeCodexPath, 'codex', 'edit the app'],
      output,
    );

    const beforeCheckpointId = extractLabeledCheckpointId(output.stdoutText, 'before');
    assert.match(output.stdoutText, new RegExp(`after: ${checkpointIdPattern()}`));
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
