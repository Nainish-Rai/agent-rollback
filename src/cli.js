import path from 'node:path';

import {
  createCheckpoint,
  diffCheckpoints,
  initializeStore,
  listCheckpoints,
  restoreCheckpoint,
  showCheckpoint,
} from './snapshot.js';
import { UserError } from './errors.js';

const HELP_TEXT = `agent-rollback

Git-like rollback checkpoints for Codex CLI runs.

Usage:
  agent-rollback init
  agent-rollback checkpoint [label]
  agent-rollback list
  agent-rollback show <checkpoint-id>
  agent-rollback diff <from-id> [to-id]
  agent-rollback revert <checkpoint-id> --yes
  agent-rollback run codex <prompt-or-codex-args...>

Options:
  --cwd <dir>          Workspace directory. Defaults to the current directory.
  --store <dir>        Checkpoint store directory. Defaults to .agent-rollback.
  --yes               Confirm destructive operations.
  --help              Show this help.
`;

export async function runCli(args, io = process) {
  const parsedCommand = parseCommand(args);
  const { command, commandArgs, options } = parsedCommand;

  if (!command || command === '--help' || command === '-h') {
    io.stdout.write(HELP_TEXT);
    return;
  }

  if (command === 'init') {
    const runtime = getRuntimeOptions(options);
    await initializeStore(runtime);
    io.stdout.write(`Initialized agent-rollback store at ${runtime.storeRoot}\n`);
    return;
  }

  if (command === 'checkpoint') {
    const runtime = getRuntimeOptions(options);
    const label = commandArgs.join(' ').trim();
    const checkpoint = await createCheckpoint({
      ...runtime,
      metadata: { label, source: 'manual' },
    });
    io.stdout.write(`Created ${checkpoint.id} (${checkpoint.fileCount} files)\n`);
    return;
  }

  if (command === 'list') {
    const checkpoints = await listCheckpoints(getRuntimeOptions(options));
    io.stdout.write(formatCheckpointList(checkpoints));
    return;
  }

  if (command === 'show') {
    const checkpointId = requireArgument(commandArgs[0], 'checkpoint id is required');
    const checkpoint = await showCheckpoint({ ...getRuntimeOptions(options), checkpointId });
    io.stdout.write(`${JSON.stringify(checkpoint, null, 2)}\n`);
    return;
  }

  if (command === 'diff') {
    const runtime = getRuntimeOptions(options);
    const fromId = requireArgument(commandArgs[0], 'from checkpoint id is required');
    const toId = commandArgs[1] || (await getLatestCheckpointId(runtime));
    const diff = await diffCheckpoints({ ...runtime, fromId, toId });
    io.stdout.write(formatDiff(diff));
    return;
  }

  if (command === 'revert') {
    const { positionalArgs, yes } = parseCommandFlags(commandArgs);
    const checkpointId = requireArgument(positionalArgs[0], 'checkpoint id is required');
    if (!yes && !options.yes) {
      throw new UserError('revert changes files; rerun with --yes to confirm');
    }
    await restoreCheckpoint({ ...getRuntimeOptions(options), checkpointId });
    io.stdout.write(`Restored workspace to ${checkpointId}\n`);
    return;
  }

  throw new UserError(`unknown command: ${command}. Run agent-rollback --help.`);
}

export { HELP_TEXT };

function parseCommand(args) {
  const options = { cwd: process.cwd(), store: null, yes: false };
  const remainingArgs = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--cwd') {
      options.cwd = requireArgument(args[index + 1], '--cwd requires a directory');
      index += 1;
      continue;
    }

    if (arg === '--store') {
      options.store = requireArgument(args[index + 1], '--store requires a directory');
      index += 1;
      continue;
    }

    if (arg === '--yes') {
      options.yes = true;
      continue;
    }

    remainingArgs.push(...args.slice(index));
    break;
  }

  return {
    command: remainingArgs[0],
    commandArgs: remainingArgs.slice(1),
    options,
  };
}

function parseCommandFlags(args) {
  const positionalArgs = [];
  let yes = false;

  for (const arg of args) {
    if (arg === '--yes') {
      yes = true;
      continue;
    }
    positionalArgs.push(arg);
  }

  return { positionalArgs, yes };
}

function getRuntimeOptions(options) {
  const workspaceRoot = path.resolve(options.cwd || process.cwd());
  return {
    storeRoot: path.resolve(options.store || path.join(workspaceRoot, '.agent-rollback')),
    workspaceRoot,
  };
}

function requireArgument(value, message) {
  if (!value) {
    throw new UserError(message);
  }
  return value;
}

async function getLatestCheckpointId(runtime) {
  const checkpoints = await listCheckpoints(runtime);
  const latestCheckpoint = checkpoints.at(-1);
  if (!latestCheckpoint) {
    throw new UserError('no checkpoints exist yet');
  }
  return latestCheckpoint.id;
}

function formatCheckpointList(checkpoints) {
  if (checkpoints.length === 0) {
    return 'No checkpoints.\n';
  }

  const lines = checkpoints.map((checkpoint) => {
    const label = checkpoint.metadata?.label || checkpoint.metadata?.command || '';
    return `${checkpoint.id}\t${checkpoint.createdAt}\t${checkpoint.fileCount} files\t${label}`;
  });

  return `${lines.join('\n')}\n`;
}

function formatDiff(diff) {
  if (diff.length === 0) {
    return 'No changes.\n';
  }

  return `${diff.map((entry) => `${entry.status}\t${entry.path}`).join('\n')}\n`;
}
