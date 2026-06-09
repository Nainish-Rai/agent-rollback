import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
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
