import { randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { UserError } from './errors.js';

const OPERATION_LOG_FILE = 'ops.jsonl';

export async function appendOperation({ details = {}, storeRoot, type }) {
  const operation = {
    createdAt: new Date().toISOString(),
    details,
    id: createOperationId(),
    type,
  };
  const logPath = getOperationLogPath(storeRoot);
  await mkdir(path.dirname(logPath), { recursive: true });
  await writeFile(logPath, `${JSON.stringify(operation)}\n`, { flag: 'a' });
  return operation;
}

export async function listOperations({ storeRoot }) {
  const logPath = getOperationLogPath(storeRoot);
  let text;

  try {
    text = await readFile(logPath, 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }

  return text
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

export async function getOperation({ operationId, storeRoot }) {
  const operation = (await listOperations({ storeRoot })).find((entry) => entry.id === operationId);
  if (!operation) {
    throw new UserError(`operation not found: ${operationId}`);
  }
  return operation;
}

function getOperationLogPath(storeRoot) {
  return path.join(path.resolve(storeRoot), OPERATION_LOG_FILE);
}

function createOperationId() {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  return `op-${timestamp}-${randomBytes(3).toString('hex')}`;
}
