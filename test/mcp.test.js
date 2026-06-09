import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { createAgentRollbackMcpServer, createMcpHandlers } from '../src/mcp.js';

test('should expose MCP handlers for checkpoint rollback workflows', async () => {
  const workspaceRoot = await mkdtemp(path.join(os.tmpdir(), 'agent-rollback-mcp-'));
  const runtime = {
    storeRoot: path.join(workspaceRoot, '.agent-rollback'),
    workspaceRoot,
  };
  const handlers = createMcpHandlers(runtime);

  try {
    await writeFile(path.join(workspaceRoot, 'index.txt'), 'one\n');
    const first = await handlers.create_checkpoint({ name: 'stable', message: 'known good' });

    await writeFile(path.join(workspaceRoot, 'index.txt'), 'two\n');
    const second = await handlers.create_checkpoint({ name: 'experiment' });

    const list = await handlers.list_checkpoints({ limit: 10 });
    assert.deepEqual(
      list.checkpoints.map((checkpoint) => checkpoint.id),
      [second.checkpoint.id, first.checkpoint.id],
    );

    const search = await handlers.search_checkpoints({ query: 'known good' });
    assert.equal(search.checkpoints[0].id, first.checkpoint.id);

    const diff = await handlers.diff_checkpoints({
      from: first.checkpoint.id,
      to: second.checkpoint.id,
    });
    assert.deepEqual(
      diff.diff.map((entry) => [entry.path, entry.status]),
      [['index.txt', 'modified']],
    );

    const dryRun = await handlers.restore_checkpoint({ id: first.checkpoint.id });
    assert.equal(dryRun.applied, false);
    assert.equal(await readFile(path.join(workspaceRoot, 'index.txt'), 'utf8'), 'two\n');

    await assert.rejects(
      handlers.restore_checkpoint({ id: first.checkpoint.id, mode: 'apply' }),
      /force: true/,
    );

    await handlers.restore_checkpoint({ force: true, id: first.checkpoint.id, mode: 'apply' });
    assert.equal(await readFile(path.join(workspaceRoot, 'index.txt'), 'utf8'), 'one\n');
    await handlers.create_checkpoint({ name: 'post restore stable' });

    const pinned = await handlers.pin_checkpoint({ id: first.checkpoint.id, name: 'keep' });
    assert.equal(pinned.checkpoint.metadata.pinned, true);

    const prune = await handlers.prune_checkpoints({ dryRun: true, keepLast: 1 });
    assert.equal(prune.applied, false);

    await writeFile(path.join(workspaceRoot, 'index.txt'), 'three\n');
    await handlers.create_checkpoint({ name: 'bad edit' });
    await handlers.undo({ count: 1, force: true });
    assert.equal(await readFile(path.join(workspaceRoot, 'index.txt'), 'utf8'), 'one\n');

    assert.equal(typeof createAgentRollbackMcpServer(runtime).connect, 'function');
  } finally {
    await rm(workspaceRoot, { recursive: true, force: true });
  }
});
