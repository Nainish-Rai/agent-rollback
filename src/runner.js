import { spawn } from 'node:child_process';

import { UserError } from './errors.js';
import { createCheckpoint } from './snapshot.js';

export async function runCodex({ args, eventStream = false, io = process, storeRoot, workspaceRoot }) {
  const { codexBin, codexArgs } = parseRunArgs(args);
  const finalCodexArgs = eventStream ? ensureCodexJsonArgs(codexArgs) : codexArgs;
  const commandForMetadata = [codexBin, ...finalCodexArgs].join(' ');

  const before = await createCheckpoint({
    workspaceRoot,
    storeRoot,
    metadata: {
      command: commandForMetadata,
      phase: 'before',
      source: 'codex-run',
    },
  });

  let exitCode = 1;
  let after;

  try {
    exitCode = await spawnCommand({
      args: finalCodexArgs,
      command: codexBin,
      cwd: workspaceRoot,
      onJsonEvent: eventStream
        ? (event) =>
            createEventCheckpoint({
              event,
              storeRoot,
              workspaceRoot,
            })
        : null,
      io,
    });
  } finally {
    after = await createCheckpoint({
      workspaceRoot,
      storeRoot,
      metadata: {
        command: commandForMetadata,
        exitCode,
        phase: 'after',
        source: 'codex-run',
      },
    });
  }

  return { after, before, exitCode };
}

export function buildCodexExecArgs(args) {
  const codexArgs = args[0] === 'exec' ? [...args] : ['exec', ...args];
  if (hasSandboxOption(codexArgs)) {
    return codexArgs;
  }

  return ['exec', '--sandbox', 'workspace-write', ...codexArgs.slice(1)];
}

export function ensureCodexJsonArgs(args) {
  if (args.includes('--json')) {
    return args;
  }

  if (args[0] === 'exec') {
    return ['exec', '--json', ...args.slice(1)];
  }

  return ['--json', ...args];
}

function parseRunArgs(args) {
  let codexBin = 'codex';
  const remainingArgs = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--codex-bin') {
      codexBin = args[index + 1];
      if (!codexBin) {
        throw new UserError('--codex-bin requires a command path');
      }
      index += 1;
      continue;
    }

    remainingArgs.push(...args.slice(index));
    break;
  }

  if (remainingArgs[0] !== 'codex') {
    throw new UserError('run currently supports: agent-rollback run codex <prompt-or-args...>');
  }

  const userCodexArgs = remainingArgs.slice(1);
  if (userCodexArgs.length === 0) {
    throw new UserError('codex run requires a prompt or codex exec arguments');
  }

  return {
    codexArgs: buildCodexExecArgs(userCodexArgs),
    codexBin,
  };
}

function hasSandboxOption(args) {
  return args.some(
    (arg) =>
      arg === '--sandbox' ||
      arg.startsWith('--sandbox=') ||
      arg === '--dangerously-bypass-approvals-and-sandbox',
  );
}

async function createEventCheckpoint({ event, storeRoot, workspaceRoot }) {
  if (!shouldCheckpointEvent(event)) {
    return null;
  }

  return createCheckpoint({
    dedupe: true,
    storeRoot,
    workspaceRoot,
    metadata: {
      eventType: event.type || event.event || '',
      itemType: event.item?.type || '',
      source: 'codex-json-event',
    },
  });
}

function shouldCheckpointEvent(event) {
  const eventText = JSON.stringify({
    event: event.event || '',
    itemType: event.item?.type || '',
    kind: event.kind || '',
    type: event.type || '',
  }).toLowerCase();
  return eventText.includes('tool') || eventText.includes('exec') || eventText.includes('patch');
}

function spawnCommand({ args, command, cwd, io, onJsonEvent = null }) {
  return new Promise((resolve, reject) => {
    const pendingJsonEvents = [];
    let stdoutBuffer = '';
    const trackJsonEvent = onJsonEvent
      ? (event) => {
          pendingJsonEvents.push(Promise.resolve(onJsonEvent(event)));
        }
      : null;
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    child.on('error', (error) => {
      reject(new UserError(`failed to start ${command}: ${error.message}`));
    });

    child.stdout.on('data', (chunk) => {
      io.stdout.write(chunk);
      if (trackJsonEvent) {
        stdoutBuffer = parseJsonLines({
          chunk: chunk.toString('utf8'),
          onJsonEvent: trackJsonEvent,
          previousBuffer: stdoutBuffer,
        });
      }
    });

    child.stderr.on('data', (chunk) => {
      io.stderr.write(chunk);
    });

    child.on('close', async (code, signal) => {
      if (trackJsonEvent && stdoutBuffer.trim()) {
        parseJsonLine(stdoutBuffer, trackJsonEvent);
      }
      await Promise.all(pendingJsonEvents);
      if (signal) {
        resolve(1);
        return;
      }
      resolve(code ?? 1);
    });
  });
}

function parseJsonLines({ chunk, onJsonEvent, previousBuffer }) {
  const lines = `${previousBuffer}${chunk}`.split('\n');
  const incompleteLine = lines.pop() || '';

  for (const line of lines) {
    parseJsonLine(line, onJsonEvent);
  }

  return incompleteLine;
}

function parseJsonLine(line, onJsonEvent) {
  const trimmedLine = line.trim();
  if (!trimmedLine) {
    return;
  }

  try {
    const event = JSON.parse(trimmedLine);
    void onJsonEvent(event);
  } catch {
    // Codex may print non-JSON diagnostics even in JSON mode; ignore them.
  }
}
