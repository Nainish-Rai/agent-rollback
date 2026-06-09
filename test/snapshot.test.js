import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  collectGarbage,
  createCheckpoint,
  deleteCheckpoint,
  diffCheckpoints,
  restoreCheckpoint,
} from '../src/snapshot.js';

test('should restore files to a previous checkpoint', async () => {
  const workspaceRoot = await mkdtemp(path.join(os.tmpdir(), 'agent-rollback-workspace-'));
  const storeRoot = path.join(workspaceRoot, '.agent-rollback');

  try {
    await writeFile(path.join(workspaceRoot, 'app.js'), 'console.log("v1");\n');
    await writeFile(path.join(workspaceRoot, 'notes.md'), 'keep me\n');

    const before = await createCheckpoint({
      workspaceRoot,
      storeRoot,
      metadata: { label: 'before' },
    });

    await writeFile(path.join(workspaceRoot, 'app.js'), 'console.log("v2");\n');
    await rm(path.join(workspaceRoot, 'notes.md'));
    await writeFile(path.join(workspaceRoot, 'new-file.txt'), 'new\n');

    const after = await createCheckpoint({
      workspaceRoot,
      storeRoot,
      metadata: { label: 'after' },
    });

    const diff = await diffCheckpoints({ storeRoot, fromId: before.id, toId: after.id });
    assert.deepEqual(
      diff.map((entry) => [entry.path, entry.status]),
      [
        ['app.js', 'modified'],
        ['new-file.txt', 'added'],
        ['notes.md', 'deleted'],
      ],
    );

    await restoreCheckpoint({ workspaceRoot, storeRoot, checkpointId: before.id });

    assert.equal(await readFile(path.join(workspaceRoot, 'app.js'), 'utf8'), 'console.log("v1");\n');
    assert.equal(await readFile(path.join(workspaceRoot, 'notes.md'), 'utf8'), 'keep me\n');
    await assert.rejects(readFile(path.join(workspaceRoot, 'new-file.txt'), 'utf8'), {
      code: 'ENOENT',
    });
  } finally {
    await rm(workspaceRoot, { recursive: true, force: true });
  }
});

test('should garbage collect unreferenced content objects', async () => {
  const workspaceRoot = await mkdtemp(path.join(os.tmpdir(), 'agent-rollback-gc-'));
  const storeRoot = path.join(workspaceRoot, '.agent-rollback');

  try {
    await writeFile(path.join(workspaceRoot, 'app.js'), 'v1\n');
    const first = await createCheckpoint({ storeRoot, workspaceRoot });

    await writeFile(path.join(workspaceRoot, 'app.js'), 'v2\n');
    await createCheckpoint({ storeRoot, workspaceRoot });

    await deleteCheckpoint({ checkpointId: first.id, storeRoot });
    const result = await collectGarbage({ storeRoot });
    assert.equal(result.deletedObjects, 1);
    assert.ok(result.deletedBytes > 0);
  } finally {
    await rm(workspaceRoot, { recursive: true, force: true });
  }
});
