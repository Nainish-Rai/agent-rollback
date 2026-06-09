import path from 'node:path';

import {
  collectGarbage,
  createCheckpoint,
  deleteCheckpoint,
  diffCheckpoints,
  initializeStore,
  listCheckpoints,
  pinCheckpoint,
  restoreCheckpoint,
  showCheckpoint,
  unpinCheckpoint,
} from './snapshot.js';
import { UserError } from './errors.js';
import { handleCodexHook, installCodexHooks } from './hooks.js';
import { startMcpServer } from './mcp.js';
import { getOperation, listOperations } from './ops.js';
import { replayFromCheckpoint } from './replay.js';
import { runCodex } from './runner.js';
import { runCheckpointBrowser } from './tui.js';

const HELP_TEXT = `agent-rollback

Git-like rollback checkpoints for Codex CLI runs.

Usage:
  agent-rollback init
  agent-rollback init codex
  agent-rollback checkpoint [label]
  agent-rollback list
  agent-rollback show <checkpoint-id>
  agent-rollback diff <from-id> [to-id]
  agent-rollback pin <checkpoint-id> [label]
  agent-rollback unpin <checkpoint-id>
  agent-rollback prune [--older-than <duration>] [--keep-last <count>] --yes
  agent-rollback undo [count] --yes
  agent-rollback log
  agent-rollback op revert <operation-id> --yes
  agent-rollback replay <checkpoint-id> --yes [--event-stream] codex <prompt-or-codex-args...>
  agent-rollback tui [--query <text>] [--no-input]
  agent-rollback mcp
  agent-rollback revert <checkpoint-id> --yes
  agent-rollback run [--event-stream] [--codex-bin <path>] codex <prompt-or-codex-args...>

Options:
  --cwd <dir>          Workspace directory. Defaults to the current directory.
  --store <dir>        Checkpoint store directory. Defaults to .agent-rollback.
  --json              Print JSON for automation and agent workflows.
  --no-input          Do not prompt; render once and exit.
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
    if (commandArgs[0] === 'codex') {
      const installation = await installCodexHooks(runtime);
      writeResult({
        data: installation,
        io,
        options,
        text: `Installed Codex hooks at ${installation.hookConfigPath}\nRun /hooks in Codex to review and trust them.\n`,
      });
      return;
    }

    await initializeStore(runtime);
    writeResult({
      data: { storeRoot: runtime.storeRoot, workspaceRoot: runtime.workspaceRoot },
      io,
      options,
      text: `Initialized agent-rollback store at ${runtime.storeRoot}\n`,
    });
    return;
  }

  if (command === 'hook') {
    const event = await readHookEvent(io);
    await handleCodexHook({ event, ...getRuntimeOptions(options) });
    return;
  }

  if (command === 'checkpoint') {
    const { positionalArgs, json } = parseCommandFlags(commandArgs);
    const commandOptions = { ...options, json: options.json || json };
    const runtime = getRuntimeOptions(options);
    const label = positionalArgs.join(' ').trim();
    const checkpoint = await createCheckpoint({
      ...runtime,
      metadata: { label, source: 'manual' },
    });
    writeResult({
      data: { checkpoint },
      io,
      options: commandOptions,
      text: `Created ${checkpoint.id} (${checkpoint.fileCount} files)\n`,
    });
    return;
  }

  if (command === 'list') {
    const { json } = parseCommandFlags(commandArgs);
    const commandOptions = { ...options, json: options.json || json };
    const checkpoints = await listCheckpoints(getRuntimeOptions(options));
    writeResult({
      data: { checkpoints },
      io,
      options: commandOptions,
      text: formatCheckpointList(checkpoints),
    });
    return;
  }

  if (command === 'show') {
    const { positionalArgs, json } = parseCommandFlags(commandArgs);
    const checkpointId = requireArgument(positionalArgs[0], 'checkpoint id is required');
    const checkpoint = await showCheckpoint({ ...getRuntimeOptions(options), checkpointId });
    writeResult({
      data: { checkpoint },
      io,
      options: { ...options, json: options.json || json },
      text: `${JSON.stringify(checkpoint, null, 2)}\n`,
    });
    return;
  }

  if (command === 'diff') {
    const { positionalArgs, json } = parseCommandFlags(commandArgs);
    const commandOptions = { ...options, json: options.json || json };
    const runtime = getRuntimeOptions(options);
    const fromId = requireArgument(positionalArgs[0], 'from checkpoint id is required');
    const toId = positionalArgs[1] || (await getLatestCheckpointId(runtime));
    const diff = await diffCheckpoints({ ...runtime, fromId, toId });
    writeResult({
      data: { diff, fromId, toId },
      io,
      options: commandOptions,
      text: formatDiff(diff),
    });
    return;
  }

  if (command === 'pin') {
    const { positionalArgs, json } = parseCommandFlags(commandArgs);
    const checkpointId = requireArgument(positionalArgs[0], 'checkpoint id is required');
    const label = positionalArgs.slice(1).join(' ').trim();
    const checkpoint = await pinCheckpoint({ ...getRuntimeOptions(options), checkpointId, label });
    writeResult({
      data: { checkpoint },
      io,
      options: { ...options, json: options.json || json },
      text: `Pinned ${checkpoint.id}${checkpoint.metadata.label ? ` as "${checkpoint.metadata.label}"` : ''}\n`,
    });
    return;
  }

  if (command === 'unpin') {
    const { positionalArgs, json } = parseCommandFlags(commandArgs);
    const checkpointId = requireArgument(positionalArgs[0], 'checkpoint id is required');
    const checkpoint = await unpinCheckpoint({ ...getRuntimeOptions(options), checkpointId });
    writeResult({
      data: { checkpoint },
      io,
      options: { ...options, json: options.json || json },
      text: `Unpinned ${checkpoint.id}\n`,
    });
    return;
  }

  if (command === 'prune') {
    const flags = parseCommandFlags(commandArgs);
    const prunePlan = await planPrune({
      ...getRuntimeOptions(options),
      keepLast: flags.keepLast,
      olderThan: flags.olderThan,
      protectPinned: flags.keepPinned,
    });
    const shouldApply = !flags.dryRun && (options.yes || flags.yes);
    if (!flags.dryRun && !shouldApply && prunePlan.deleted.length > 0) {
      throw new UserError('prune deletes checkpoint manifests; rerun with --yes to confirm');
    }
    if (shouldApply) {
      await Promise.all(
        prunePlan.deleted.map((checkpoint) =>
          deleteCheckpoint({ ...getRuntimeOptions(options), checkpointId: checkpoint.id }),
        ),
      );
      prunePlan.garbageCollection = await collectGarbage(getRuntimeOptions(options));
    }
    writeResult({
      data: { ...prunePlan, applied: shouldApply },
      io,
      options: { ...options, json: options.json || flags.json },
      text: formatPrunePlan(prunePlan, shouldApply),
    });
    return;
  }

  if (command === 'undo') {
    const { positionalArgs, yes, json } = parseCommandFlags(commandArgs);
    const count = parsePositiveInteger(positionalArgs[0] || '1', 'undo count must be a positive integer');
    const runtime = getRuntimeOptions(options);
    const target = await getUndoTarget(runtime, count);
    if (!yes && !options.yes) {
      throw new UserError('undo changes files; rerun with --yes to confirm');
    }
    await restoreCheckpoint({ ...runtime, checkpointId: target.id });
    writeResult({
      data: { count, restoredCheckpoint: target },
      io,
      options: { ...options, json: options.json || json },
      text: `Undid ${count} step${count === 1 ? '' : 's'}; restored workspace to ${target.id}\n`,
    });
    return;
  }

  if (command === 'log') {
    const { json } = parseCommandFlags(commandArgs);
    const operations = await listOperations(getRuntimeOptions(options));
    writeResult({
      data: { operations },
      io,
      options: { ...options, json: options.json || json },
      text: formatOperationLog(operations),
    });
    return;
  }

  if (command === 'op') {
    const subcommand = requireArgument(commandArgs[0], 'operation subcommand is required');
    if (subcommand !== 'revert') {
      throw new UserError(`unknown operation subcommand: ${subcommand}`);
    }
    const flags = parseCommandFlags(commandArgs.slice(1));
    const operationId = requireArgument(flags.positionalArgs[0], 'operation id is required');
    const runtime = getRuntimeOptions(options);
    const operation = await getOperation({ ...runtime, operationId });
    const checkpointId = operation.details?.previousCheckpointId;
    if (!checkpointId) {
      throw new UserError(`operation ${operation.id} has no previous checkpoint to restore`);
    }
    if (!flags.dryRun && !flags.yes && !options.yes) {
      throw new UserError('op revert changes files; rerun with --yes to confirm');
    }
    const safetyCheckpoint = flags.dryRun
      ? null
      : await createCheckpoint({
          ...runtime,
          metadata: { operationId, source: 'op-revert-safety' },
        });
    if (!flags.dryRun) {
      await restoreCheckpoint({ ...runtime, checkpointId });
    }
    writeResult({
      data: {
        applied: !flags.dryRun,
        operation,
        restoredCheckpointId: checkpointId,
        safetyCheckpoint,
      },
      io,
      options: { ...options, json: options.json || flags.json },
      text: flags.dryRun
        ? `Would revert ${operation.id}; target checkpoint ${checkpointId}\n`
        : `Reverted ${operation.id}; restored workspace to ${checkpointId}; safety checkpoint ${safetyCheckpoint.id}\n`,
    });
    return;
  }

  if (command === 'replay') {
    const replayArgs = parseReplayArgs(commandArgs);
    const outputAsJson = options.json || replayArgs.json;
    const result = await replayFromCheckpoint({
      args: replayArgs.args,
      checkpointId: replayArgs.checkpointId,
      eventStream: replayArgs.eventStream,
      force: options.yes || replayArgs.yes,
      io: outputAsJson ? { stderr: io.stderr, stdout: io.stderr } : io,
      runtime: getRuntimeOptions(options),
    });
    writeResult({
      data: result,
      io,
      options: { ...options, json: outputAsJson },
      text: `Replayed ${replayArgs.checkpointId}\nbefore: ${result.before.id}\nafter: ${result.after.id}\nexit: ${result.exitCode}\n`,
    });
    if (result.exitCode !== 0) {
      io.exitCode = result.exitCode;
    }
    return;
  }

  if (command === 'tui') {
    const flags = parseCommandFlags(commandArgs);
    const outputAsJson = options.json || flags.json;
    const result = await runCheckpointBrowser({
      io: outputAsJson ? { ...io, stdout: io.stderr } : io,
      noInput: options.noInput || flags.noInput,
      query: flags.query || '',
      runtime: getRuntimeOptions(options),
    });
    if (outputAsJson) {
      writeResult({
        data: result,
        io,
        options: { ...options, json: true },
        text: '',
      });
    }
    return;
  }

  if (command === 'mcp') {
    await startMcpServer(getRuntimeOptions(options));
    return;
  }

  if (command === 'revert') {
    const { json, positionalArgs, yes } = parseCommandFlags(commandArgs);
    const checkpointId = requireArgument(positionalArgs[0], 'checkpoint id is required');
    if (!yes && !options.yes) {
      throw new UserError('revert changes files; rerun with --yes to confirm');
    }
    await restoreCheckpoint({ ...getRuntimeOptions(options), checkpointId });
    writeResult({
      data: { restoredCheckpointId: checkpointId },
      io,
      options: { ...options, json: options.json || json },
      text: `Restored workspace to ${checkpointId}\n`,
    });
    return;
  }

  if (command === 'run') {
    const runFlags = parseRunCommandFlags(commandArgs);
    const outputAsJson = options.json || runFlags.json;
    const result = await runCodex({
      args: runFlags.args,
      eventStream: runFlags.eventStream,
      io: outputAsJson ? { stderr: io.stderr, stdout: io.stderr } : io,
      ...getRuntimeOptions(options),
    });
    writeResult({
      data: result,
      io,
      options: { ...options, json: outputAsJson },
      text: `Codex run checkpoints:\nbefore: ${result.before.id}\nafter: ${result.after.id}\nexit: ${result.exitCode}\n`,
    });
    if (result.exitCode !== 0) {
      io.exitCode = result.exitCode;
    }
    return;
  }

  throw new UserError(`unknown command: ${command}. Run agent-rollback --help.`);
}

export { HELP_TEXT };

function parseCommand(args) {
  const options = { cwd: process.cwd(), json: false, noInput: false, store: null, yes: false };
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

    if (arg === '--json') {
      options.json = true;
      continue;
    }

    if (arg === '--no-input') {
      options.noInput = true;
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
  let dryRun = false;
  let json = false;
  let keepLast = 0;
  let keepPinned = true;
  let noInput = false;
  let olderThan = null;
  let query = '';
  let yes = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--yes') {
      yes = true;
      continue;
    }
    if (arg === '--json') {
      json = true;
      continue;
    }
    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }
    if (arg === '--no-input') {
      noInput = true;
      continue;
    }
    if (arg === '--keep-pinned') {
      keepPinned = true;
      continue;
    }
    if (arg === '--no-keep-pinned') {
      keepPinned = false;
      continue;
    }
    if (arg === '--keep-last') {
      keepLast = parsePositiveInteger(args[index + 1], '--keep-last requires a positive integer');
      index += 1;
      continue;
    }
    if (arg === '--older-than') {
      olderThan = parseDuration(args[index + 1]);
      index += 1;
      continue;
    }
    if (arg === '--query') {
      query = requireArgument(args[index + 1], '--query requires text');
      index += 1;
      continue;
    }
    positionalArgs.push(arg);
  }

  return { dryRun, json, keepLast, keepPinned, noInput, olderThan, positionalArgs, query, yes };
}

function parseRunCommandFlags(args) {
  const runArgs = [];
  let eventStream = false;
  let json = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--json' && runArgs.length === 0) {
      json = true;
      continue;
    }
    if (arg === '--event-stream' && runArgs.length === 0) {
      eventStream = true;
      continue;
    }

    runArgs.push(...args.slice(index));
    break;
  }

  return { args: runArgs, eventStream, json };
}

function parseReplayArgs(args) {
  const checkpointId = requireArgument(args[0], 'checkpoint id is required');
  const replayArgs = [];
  let eventStream = false;
  let json = false;
  let yes = false;

  for (let index = 1; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--yes') {
      yes = true;
      continue;
    }
    if (arg === '--json') {
      json = true;
      continue;
    }
    if (arg === '--event-stream') {
      eventStream = true;
      continue;
    }
    replayArgs.push(...args.slice(index));
    break;
  }

  return { args: replayArgs, checkpointId, eventStream, json, yes };
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
    const pin = checkpoint.metadata?.pinned ? 'pinned' : '';
    return `${checkpoint.id}\t${checkpoint.createdAt}\t${checkpoint.fileCount} files\t${pin}\t${label}`;
  });

  return `${lines.join('\n')}\n`;
}

function formatDiff(diff) {
  if (diff.length === 0) {
    return 'No changes.\n';
  }

  return `${diff.map((entry) => `${entry.status}\t${entry.path}`).join('\n')}\n`;
}

function writeResult({ data, io, options, text }) {
  if (options.json) {
    io.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
    return;
  }

  io.stdout.write(text);
}

async function readHookEvent(io) {
  if (typeof io.stdinText === 'string') {
    return JSON.parse(io.stdinText || '{}');
  }

  if (!io.stdin) {
    return {};
  }

  const chunks = [];
  for await (const chunk of io.stdin) {
    chunks.push(Buffer.from(chunk));
  }

  const input = Buffer.concat(chunks).toString('utf8').trim();
  return input ? JSON.parse(input) : {};
}

async function getUndoTarget(runtime, count) {
  const checkpoints = await listCheckpoints(runtime);
  if (checkpoints.length < 2) {
    throw new UserError('undo needs at least two checkpoints');
  }

  const targetIndex = checkpoints.length - count - 1;
  if (targetIndex < 0) {
    throw new UserError(`cannot undo ${count} steps; only ${checkpoints.length - 1} undo steps exist`);
  }

  return checkpoints[targetIndex];
}

async function planPrune({ keepLast, olderThan, protectPinned, storeRoot }) {
  const checkpoints = await listCheckpoints({ storeRoot });
  const keepIds = new Set(checkpoints.slice(Math.max(0, checkpoints.length - keepLast)).map((checkpoint) => checkpoint.id));
  const cutoff = olderThan ? Date.now() - olderThan : null;
  const hasRetentionRule = cutoff !== null || keepLast > 0;
  const deleted = [];
  const kept = [];

  for (const checkpoint of checkpoints) {
    const isPinned = Boolean(checkpoint.metadata?.pinned);
    const isRecentEnough = cutoff !== null && Date.parse(checkpoint.createdAt) >= cutoff;
    const shouldKeep =
      !hasRetentionRule || keepIds.has(checkpoint.id) || isRecentEnough || (protectPinned && isPinned);

    if (shouldKeep) {
      kept.push(checkpoint);
      continue;
    }

    deleted.push(checkpoint);
  }

  return { deleted, kept };
}

function formatPrunePlan(prunePlan, applied) {
  if (prunePlan.deleted.length === 0) {
    return 'No checkpoints to prune.\n';
  }

  const action = applied ? 'Pruned' : 'Would prune';
  const lines = prunePlan.deleted.map((checkpoint) => `${checkpoint.id}\t${checkpoint.createdAt}`);
  return `${action} ${prunePlan.deleted.length} checkpoint${prunePlan.deleted.length === 1 ? '' : 's'}:\n${lines.join('\n')}\n`;
}

function formatOperationLog(operations) {
  if (operations.length === 0) {
    return 'No operations.\n';
  }

  return `${operations
    .map((operation) => {
      const checkpointId = operation.details?.checkpointId || operation.details?.previousCheckpointId || '';
      return `${operation.id}\t${operation.createdAt}\t${operation.type}\t${checkpointId}`;
    })
    .join('\n')}\n`;
}

function parsePositiveInteger(value, message) {
  const parsedValue = Number.parseInt(value, 10);
  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new UserError(message);
  }
  return parsedValue;
}

function parseDuration(value) {
  if (!value) {
    throw new UserError('--older-than requires a duration like 7d, 12h, or 30m');
  }

  const match = value.match(/^(\d+)(m|h|d)$/);
  if (!match) {
    throw new UserError(`invalid duration: ${value}. Use m, h, or d, for example 30m, 12h, 7d.`);
  }

  const amount = Number.parseInt(match[1], 10);
  const unit = match[2];
  const multipliers = { d: 24 * 60 * 60 * 1000, h: 60 * 60 * 1000, m: 60 * 1000 };
  return amount * multipliers[unit];
}
