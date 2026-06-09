import { randomBytes, createHash } from 'node:crypto';
import {
  chmod,
  mkdir,
  readFile,
  readlink,
  readdir,
  rename,
  rm,
  rmdir,
  stat,
  symlink,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';

import { UserError, requireValue } from './errors.js';
import { appendOperation } from './ops.js';
import { listWorkspaceFiles, resolveWorkspacePath } from './workspace.js';

const SCHEMA_VERSION = 1;

export async function createCheckpoint({ dedupe = false, workspaceRoot, storeRoot, metadata = {} }) {
  const resolvedWorkspaceRoot = path.resolve(requireValue(workspaceRoot, 'workspaceRoot is required'));
  const resolvedStoreRoot = path.resolve(
    storeRoot || path.join(resolvedWorkspaceRoot, '.agent-rollback'),
  );

  await ensureStore(resolvedStoreRoot);

  const files = {};
  const workspaceFiles = await listWorkspaceFiles({
    workspaceRoot: resolvedWorkspaceRoot,
    storeRoot: resolvedStoreRoot,
  });

  for (const workspaceFile of workspaceFiles) {
    if (workspaceFile.type === 'file') {
      const content = await readFile(workspaceFile.absolutePath);
      const sha256 = hashBuffer(content);
      await writeObject(resolvedStoreRoot, sha256, content);
      files[workspaceFile.path] = {
        mode: workspaceFile.mode,
        sha256,
        size: workspaceFile.size,
        type: 'file',
      };
      continue;
    }

    if (workspaceFile.type === 'symlink') {
      files[workspaceFile.path] = {
        mode: workspaceFile.mode,
        target: await readlink(workspaceFile.absolutePath),
        type: 'symlink',
      };
    }
  }

  const manifest = {
    createdAt: new Date().toISOString(),
    files,
    id: createCheckpointId(resolveCheckpointSlug(metadata)),
    metadata,
    schemaVersion: SCHEMA_VERSION,
    stateHash: hashManifestFiles(files),
    workspaceRoot: resolvedWorkspaceRoot,
  };

  const latestManifest = await readLatestCheckpoint(resolvedStoreRoot);

  if (dedupe) {
    if (latestManifest?.stateHash === manifest.stateHash) {
      return { ...summarizeCheckpoint(latestManifest), deduped: true };
    }
  }

  const checkpointDirectory = path.join(resolvedStoreRoot, 'checkpoints', manifest.id);
  await mkdir(checkpointDirectory, { recursive: true });
  await writeJsonAtomic(path.join(checkpointDirectory, 'manifest.json'), manifest);

  await appendOperation({
    details: {
      checkpointId: manifest.id,
      metadata,
      previousCheckpointId: latestManifest?.id || null,
      stateHash: manifest.stateHash,
    },
    storeRoot: resolvedStoreRoot,
    type: 'checkpoint.created',
  });

  return { ...summarizeCheckpoint(manifest), deduped: false };
}

export async function initializeStore({ workspaceRoot, storeRoot }) {
  const resolvedWorkspaceRoot = path.resolve(requireValue(workspaceRoot, 'workspaceRoot is required'));
  const resolvedStoreRoot = path.resolve(
    storeRoot || path.join(resolvedWorkspaceRoot, '.agent-rollback'),
  );
  await ensureStore(resolvedStoreRoot);
  return { storeRoot: resolvedStoreRoot, workspaceRoot: resolvedWorkspaceRoot };
}

export async function listCheckpoints({ storeRoot }) {
  const checkpointRoot = path.join(path.resolve(storeRoot), 'checkpoints');
  let checkpointIds;

  try {
    checkpointIds = await readdir(checkpointRoot);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }

  const checkpoints = await Promise.all(
    checkpointIds.map(async (checkpointId) => summarizeCheckpoint(await readCheckpoint(storeRoot, checkpointId))),
  );

  return checkpoints.sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

export async function showCheckpoint({ storeRoot, checkpointId }) {
  return readCheckpoint(storeRoot, checkpointId);
}

export async function pinCheckpoint({ storeRoot, checkpointId, label }) {
  return updateCheckpointMetadata({
    checkpointId,
    storeRoot,
    updateMetadata(metadata) {
      return {
        ...metadata,
        label: label || metadata.label || '',
        pinned: true,
        pinnedAt: new Date().toISOString(),
      };
    },
  });
}

export async function unpinCheckpoint({ storeRoot, checkpointId }) {
  return updateCheckpointMetadata({
    checkpointId,
    storeRoot,
    updateMetadata(metadata) {
      const { pinnedAt, ...rest } = metadata;
      return {
        ...rest,
        pinned: false,
      };
    },
  });
}

export async function deleteCheckpoint({ storeRoot, checkpointId }) {
  const safeCheckpointId = requireSafeCheckpointId(checkpointId);
  await rm(getCheckpointDirectory(storeRoot, safeCheckpointId), { force: true, recursive: true });
}

export async function collectGarbage({ storeRoot }) {
  const referencedObjects = await listReferencedObjects(storeRoot);
  const objectRoot = path.join(path.resolve(storeRoot), 'objects');
  let deletedBytes = 0;
  let deletedObjects = 0;

  let prefixEntries;
  try {
    prefixEntries = await readdir(objectRoot, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return { deletedBytes, deletedObjects };
    }
    throw error;
  }

  for (const prefixEntry of prefixEntries) {
    if (!prefixEntry.isDirectory()) {
      continue;
    }

    const prefixDirectory = path.join(objectRoot, prefixEntry.name);
    const objectEntries = await readdir(prefixDirectory, { withFileTypes: true });
    for (const objectEntry of objectEntries) {
      if (!objectEntry.isFile() || referencedObjects.has(objectEntry.name)) {
        continue;
      }

      const objectPath = path.join(prefixDirectory, objectEntry.name);
      const objectStats = await stat(objectPath);
      await rm(objectPath, { force: true });
      deletedBytes += objectStats.size;
      deletedObjects += 1;
    }

    await rmdir(prefixDirectory).catch((error) => {
      if (!error || (error.code !== 'ENOTEMPTY' && error.code !== 'ENOENT')) {
        throw error;
      }
    });
  }

  return { deletedBytes, deletedObjects };
}

export async function diffCheckpoints({ storeRoot, fromId, toId }) {
  const fromCheckpoint = await readCheckpoint(storeRoot, fromId);
  const toCheckpoint = await readCheckpoint(storeRoot, toId);
  return diffManifests(fromCheckpoint, toCheckpoint);
}

export async function restoreCheckpoint({ workspaceRoot, storeRoot, checkpointId }) {
  const resolvedWorkspaceRoot = path.resolve(requireValue(workspaceRoot, 'workspaceRoot is required'));
  const resolvedStoreRoot = path.resolve(requireValue(storeRoot, 'storeRoot is required'));
  const checkpoint = await readCheckpoint(resolvedStoreRoot, checkpointId);
  const targetFiles = checkpoint.files || {};
  const currentFiles = await listWorkspaceFiles({
    workspaceRoot: resolvedWorkspaceRoot,
    storeRoot: resolvedStoreRoot,
  });

  for (const currentFile of currentFiles) {
    if (!targetFiles[currentFile.path]) {
      await rm(currentFile.absolutePath, { force: true, recursive: true });
    }
  }

  for (const [relativePath, targetFile] of Object.entries(targetFiles)) {
    await restoreFile({
      relativePath,
      storeRoot: resolvedStoreRoot,
      targetFile,
      workspaceRoot: resolvedWorkspaceRoot,
    });
  }

  await appendOperation({
    details: { checkpointId },
    storeRoot: resolvedStoreRoot,
    type: 'checkpoint.restored',
  });
}

export function diffManifests(fromCheckpoint, toCheckpoint) {
  const fromFiles = fromCheckpoint.files || {};
  const toFiles = toCheckpoint.files || {};
  const allPaths = [...new Set([...Object.keys(fromFiles), ...Object.keys(toFiles)])].sort((left, right) =>
    left.localeCompare(right),
  );

  return allPaths.flatMap((relativePath) => {
    const before = fromFiles[relativePath];
    const after = toFiles[relativePath];

    if (!before && after) {
      return [{ after, before: null, path: relativePath, status: 'added' }];
    }

    if (before && !after) {
      return [{ after: null, before, path: relativePath, status: 'deleted' }];
    }

    if (fileIdentity(before) !== fileIdentity(after)) {
      return [{ after, before, path: relativePath, status: 'modified' }];
    }

    return [];
  });
}

async function ensureStore(storeRoot) {
  await mkdir(path.join(storeRoot, 'checkpoints'), { recursive: true });
  await mkdir(path.join(storeRoot, 'objects'), { recursive: true });
}

function createCheckpointId(slug = '') {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(8, 14);
  const cleanedSlug = slugify(slug);
  if (cleanedSlug) {
    return `cp-${timestamp}-${cleanedSlug}-${randomBytes(2).toString('hex')}`;
  }
  return `cp-${timestamp}-${randomBytes(3).toString('hex')}`;
}

function resolveCheckpointSlug(metadata = {}) {
  return metadata.label || metadata.prompt || metadata.toolName || metadata.hookEvent || '';
}

function slugify(text, maxLength = 32) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/, '');
}

function hashBuffer(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function writeObject(storeRoot, sha256, content) {
  const objectDirectory = path.join(storeRoot, 'objects', sha256.slice(0, 2));
  const objectPath = path.join(objectDirectory, sha256);
  await mkdir(objectDirectory, { recursive: true });

  try {
    await writeFile(objectPath, content, { flag: 'wx' });
  } catch (error) {
    if (!error || error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function readObject(storeRoot, sha256) {
  return readFile(path.join(storeRoot, 'objects', sha256.slice(0, 2), sha256));
}

async function writeJsonAtomic(filePath, value) {
  const temporaryPath = `${filePath}.${process.pid}.${randomBytes(3).toString('hex')}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`);
  await rename(temporaryPath, filePath);
}

async function readCheckpoint(storeRoot, checkpointId) {
  const safeCheckpointId = requireSafeCheckpointId(checkpointId);
  const manifestPath = getCheckpointManifestPath(storeRoot, safeCheckpointId);
  let manifest;

  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      throw new UserError(`checkpoint not found: ${safeCheckpointId}`);
    }
    throw error;
  }

  if (manifest.schemaVersion !== SCHEMA_VERSION) {
    throw new UserError(
      `unsupported checkpoint schema ${manifest.schemaVersion}; expected ${SCHEMA_VERSION}`,
    );
  }

  return manifest;
}

async function readLatestCheckpoint(storeRoot) {
  const checkpointRoot = path.join(path.resolve(storeRoot), 'checkpoints');
  let checkpointIds;

  try {
    checkpointIds = await readdir(checkpointRoot);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }

  const checkpoints = await Promise.all(
    checkpointIds.map((checkpointId) => readCheckpoint(storeRoot, checkpointId)),
  );

  return checkpoints.sort((left, right) => left.createdAt.localeCompare(right.createdAt)).at(-1) || null;
}

async function listReferencedObjects(storeRoot) {
  const checkpointRoot = path.join(path.resolve(storeRoot), 'checkpoints');
  const referencedObjects = new Set();
  let checkpointIds;

  try {
    checkpointIds = await readdir(checkpointRoot);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return referencedObjects;
    }
    throw error;
  }

  for (const checkpointId of checkpointIds) {
    const checkpoint = await readCheckpoint(storeRoot, checkpointId);
    for (const fileEntry of Object.values(checkpoint.files || {})) {
      if (fileEntry.type === 'file') {
        referencedObjects.add(fileEntry.sha256);
      }
    }
  }

  return referencedObjects;
}

async function updateCheckpointMetadata({ storeRoot, checkpointId, updateMetadata }) {
  const safeCheckpointId = requireSafeCheckpointId(checkpointId);
  const manifest = await readCheckpoint(storeRoot, safeCheckpointId);
  const updatedManifest = {
    ...manifest,
    metadata: updateMetadata(manifest.metadata || {}),
    updatedAt: new Date().toISOString(),
  };
  await writeJsonAtomic(getCheckpointManifestPath(storeRoot, safeCheckpointId), updatedManifest);
  return summarizeCheckpoint(updatedManifest);
}

function getCheckpointDirectory(storeRoot, checkpointId) {
  return path.join(path.resolve(storeRoot), 'checkpoints', checkpointId);
}

function getCheckpointManifestPath(storeRoot, checkpointId) {
  return path.join(getCheckpointDirectory(storeRoot, checkpointId), 'manifest.json');
}

function requireSafeCheckpointId(checkpointId) {
  const value = requireValue(checkpointId, 'checkpoint id is required');
  if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
    throw new UserError(`unsafe checkpoint id: ${value}`);
  }
  return value;
}

function summarizeCheckpoint(manifest) {
  return {
    createdAt: manifest.createdAt,
    fileCount: Object.keys(manifest.files || {}).length,
    id: manifest.id,
    metadata: manifest.metadata || {},
    stateHash: manifest.stateHash || hashManifestFiles(manifest.files || {}),
    updatedAt: manifest.updatedAt || null,
    workspaceRoot: manifest.workspaceRoot,
  };
}

function hashManifestFiles(files) {
  const stableEntries = Object.entries(files)
    .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
    .map(([relativePath, fileEntry]) => [relativePath, fileIdentity(fileEntry)]);
  return createHash('sha256').update(JSON.stringify(stableEntries)).digest('hex');
}

function fileIdentity(fileEntry) {
  if (!fileEntry) {
    return '';
  }

  if (fileEntry.type === 'file') {
    return `file:${fileEntry.sha256}:${fileEntry.mode}`;
  }

  return `symlink:${fileEntry.target}:${fileEntry.mode}`;
}

async function restoreFile({ relativePath, storeRoot, targetFile, workspaceRoot }) {
  const destinationPath = resolveWorkspacePath(workspaceRoot, relativePath);
  await mkdir(path.dirname(destinationPath), { recursive: true });

  if (targetFile.type === 'file') {
    const content = await readObject(storeRoot, targetFile.sha256);
    const temporaryPath = path.join(
      path.dirname(destinationPath),
      `.agent-rollback-${path.basename(destinationPath)}-${process.pid}.tmp`,
    );
    await writeFile(temporaryPath, content);
    await chmod(temporaryPath, targetFile.mode);
    await rm(destinationPath, { force: true, recursive: true });
    await rename(temporaryPath, destinationPath);
    return;
  }

  if (targetFile.type === 'symlink') {
    await rm(destinationPath, { force: true, recursive: true });
    await symlink(targetFile.target, destinationPath);
    return;
  }

  throw new UserError(`unsupported checkpoint entry type for ${relativePath}: ${targetFile.type}`);
}
