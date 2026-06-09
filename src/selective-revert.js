import { createHash } from 'node:crypto';
import { chmod, lstat, mkdir, readFile, readlink, rm, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { UserError } from './errors.js';
import { diffManifests, showCheckpoint } from './snapshot.js';
import { resolveWorkspacePath } from './workspace.js';

export async function selectivelyRevertOperation({ force = false, operation, runtime }) {
  const afterId = operation.details?.checkpointId;
  const beforeId = operation.details?.previousCheckpointId;
  if (!afterId || !beforeId) {
    throw new UserError(`operation ${operation.id} cannot be selectively reverted`);
  }

  const before = await showCheckpoint({ ...runtime, checkpointId: beforeId });
  const after = await showCheckpoint({ ...runtime, checkpointId: afterId });
  const diff = diffManifests(before, after);
  const conflicts = [];

  for (const entry of diff) {
    const current = await readCurrentFileEntry({
      relativePath: entry.path,
      workspaceRoot: runtime.workspaceRoot,
    });
    if (!force && fileIdentity(current) !== fileIdentity(entry.after)) {
      conflicts.push(entry.path);
    }
  }

  if (conflicts.length > 0) {
    throw new UserError(
      `selective revert has conflicts in ${conflicts.join(', ')}; rerun with --force to overwrite`,
    );
  }

  for (const entry of diff) {
    await applyCheckpointEntry({
      entry: entry.before,
      relativePath: entry.path,
      storeRoot: runtime.storeRoot,
      workspaceRoot: runtime.workspaceRoot,
    });
  }

  return { revertedPaths: diff.map((entry) => entry.path) };
}

async function readCurrentFileEntry({ relativePath, workspaceRoot }) {
  const absolutePath = resolveWorkspacePath(workspaceRoot, relativePath);
  let stats;

  try {
    stats = await lstat(absolutePath);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }

  if (stats.isSymbolicLink()) {
    return {
      mode: 0,
      target: await readlink(absolutePath),
      type: 'symlink',
    };
  }

  if (!stats.isFile()) {
    return null;
  }

  const content = await readFile(absolutePath);
  return {
    mode: 0,
    sha256: createHash('sha256').update(content).digest('hex'),
    size: content.length,
    type: 'file',
  };
}

async function applyCheckpointEntry({ entry, relativePath, storeRoot, workspaceRoot }) {
  const destinationPath = resolveWorkspacePath(workspaceRoot, relativePath);

  if (!entry) {
    await rm(destinationPath, { force: true, recursive: true });
    return;
  }

  await mkdir(path.dirname(destinationPath), { recursive: true });
  await rm(destinationPath, { force: true, recursive: true });

  if (entry.type === 'file') {
    const content = await readFile(path.join(storeRoot, 'objects', entry.sha256.slice(0, 2), entry.sha256));
    await writeFile(destinationPath, content);
    await chmod(destinationPath, entry.mode);
    return;
  }

  if (entry.type === 'symlink') {
    await symlink(entry.target, destinationPath);
    return;
  }

  throw new UserError(`unsupported checkpoint entry type for ${relativePath}: ${entry.type}`);
}

function fileIdentity(fileEntry) {
  if (!fileEntry) {
    return '';
  }

  if (fileEntry.type === 'file') {
    return `file:${fileEntry.sha256}`;
  }

  return `symlink:${fileEntry.target}`;
}
