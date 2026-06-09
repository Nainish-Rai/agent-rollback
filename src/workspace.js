import { lstat, readdir } from 'node:fs/promises';
import path from 'node:path';

import { isGitRepository, listGitFiles } from './git.js';
import { UserError } from './errors.js';

const DEFAULT_IGNORED_DIRS = new Set([
  '.agent-rollback',
  '.git',
  '.hg',
  '.svn',
  'node_modules',
]);

export function normalizeRelativePath(relativePath) {
  return relativePath.split(path.sep).join('/');
}

export function resolveWorkspacePath(workspaceRoot, relativePath) {
  const normalized = normalizeRelativePath(relativePath);
  if (!normalized || normalized.startsWith('../') || path.isAbsolute(normalized)) {
    throw new UserError(`unsafe workspace path in checkpoint: ${relativePath}`);
  }

  const absolutePath = path.resolve(workspaceRoot, ...normalized.split('/'));
  const rootWithSeparator = path.resolve(workspaceRoot) + path.sep;
  if (absolutePath !== path.resolve(workspaceRoot) && !absolutePath.startsWith(rootWithSeparator)) {
    throw new UserError(`checkpoint path escapes workspace: ${relativePath}`);
  }

  return absolutePath;
}

export async function listWorkspaceFiles({ workspaceRoot, storeRoot }) {
  const root = path.resolve(workspaceRoot);
  const storeRelativePath = normalizeRelativePath(path.relative(root, path.resolve(storeRoot)));
  const relativePaths = (await isGitRepository(root))
    ? await listGitFiles(root)
    : await walkWorkspace(root, root);

  const uniquePaths = [...new Set(relativePaths.map(normalizeRelativePath))]
    .filter((relativePath) => shouldSnapshotPath(relativePath, storeRelativePath))
    .sort((left, right) => left.localeCompare(right));

  const entries = [];

  for (const relativePath of uniquePaths) {
    const absolutePath = resolveWorkspacePath(root, relativePath);
    let stats;
    try {
      stats = await lstat(absolutePath);
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        continue;
      }
      throw error;
    }

    if (stats.isFile()) {
      entries.push({
        absolutePath,
        mode: stats.mode & 0o777,
        path: relativePath,
        size: stats.size,
        type: 'file',
      });
      continue;
    }

    if (stats.isSymbolicLink()) {
      entries.push({
        absolutePath,
        mode: stats.mode & 0o777,
        path: relativePath,
        size: 0,
        type: 'symlink',
      });
    }
  }

  return entries;
}

async function walkWorkspace(root, currentDirectory) {
  const directoryEntries = await readdir(currentDirectory, { withFileTypes: true });
  const relativePaths = [];

  for (const directoryEntry of directoryEntries) {
    const absolutePath = path.join(currentDirectory, directoryEntry.name);
    const relativePath = normalizeRelativePath(path.relative(root, absolutePath));

    if (directoryEntry.isDirectory()) {
      if (!DEFAULT_IGNORED_DIRS.has(directoryEntry.name)) {
        relativePaths.push(...(await walkWorkspace(root, absolutePath)));
      }
      continue;
    }

    relativePaths.push(relativePath);
  }

  return relativePaths;
}

function shouldSnapshotPath(relativePath, storeRelativePath) {
  if (!relativePath || relativePath.startsWith('../') || path.isAbsolute(relativePath)) {
    return false;
  }

  if (relativePath === storeRelativePath || relativePath.startsWith(`${storeRelativePath}/`)) {
    return false;
  }

  const [topLevelDirectory] = relativePath.split('/');
  return !DEFAULT_IGNORED_DIRS.has(topLevelDirectory);
}
