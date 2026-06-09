import { spawn } from 'node:child_process';

import { UserError } from './errors.js';
import { createCheckpoint } from './snapshot.js';

export async function runCodex({ args, io = process, storeRoot, workspaceRoot }) {
  const { codexBin, codexArgs } = parseRunArgs(args);
  const commandForMetadata = [codexBin, ...codexArgs].join(' ');

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
      args: codexArgs,
      command: codexBin,
      cwd: workspaceRoot,
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

function spawnCommand({ args, command, cwd, io }) {
  return new Promise((resolve, reject) => {
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
    });

    child.stderr.on('data', (chunk) => {
      io.stderr.write(chunk);
    });

    child.on('close', (code, signal) => {
      if (signal) {
        resolve(1);
        return;
      }
      resolve(code ?? 1);
    });
  });
}
