import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createCheckpoint, initializeStore } from './snapshot.js';

const HOOK_EVENTS = ['SessionStart', 'UserPromptSubmit', 'PreToolUse', 'PostToolUse'];

export async function installCodexHooks({ workspaceRoot }) {
  const codexDirectory = path.join(workspaceRoot, '.codex');
  const hookConfigPath = path.join(codexDirectory, 'hooks.json');
  const command = buildHookCommand();
  const existingConfig = await readExistingHookConfig(hookConfigPath);
  const nextConfig = mergeAgentRollbackHooks(existingConfig, command);

  await mkdir(codexDirectory, { recursive: true });
  await writeFile(hookConfigPath, `${JSON.stringify(nextConfig, null, 2)}\n`);
  await initializeStore({ workspaceRoot, storeRoot: path.join(workspaceRoot, '.agent-rollback') });

  return { command, hookConfigPath };
}

export async function handleCodexHook({ event, storeRoot }) {
  const workspaceRoot = path.resolve(event.cwd || process.cwd());
  const transcriptTail = await readTranscriptTail(event.transcript_path);
  const checkpoint = await createCheckpoint({
    dedupe: true,
    storeRoot: storeRoot || path.join(workspaceRoot, '.agent-rollback'),
    workspaceRoot,
    metadata: {
      hookEvent: event.hook_event_name || 'unknown',
      permissionMode: event.permission_mode || '',
      prompt: truncateText(event.prompt || '', 240),
      sessionId: event.session_id || '',
      source: 'codex-hook',
      toolName: event.tool_name || '',
      toolUseId: event.tool_use_id || '',
      transcriptTail,
      transcriptPath: event.transcript_path || '',
      turnId: event.turn_id || '',
    },
  });

  return { checkpoint };
}

function buildHookCommand() {
  const binPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'agent-rollback.js');
  return `node ${JSON.stringify(binPath)} hook`;
}

async function readExistingHookConfig(hookConfigPath) {
  try {
    return JSON.parse(await readFile(hookConfigPath, 'utf8'));
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return { hooks: {} };
    }
    throw error;
  }
}

function mergeAgentRollbackHooks(existingConfig, command) {
  const nextConfig = {
    ...existingConfig,
    description: existingConfig.description || 'Codex lifecycle hooks.',
    hooks: { ...(existingConfig.hooks || {}) },
  };

  for (const eventName of HOOK_EVENTS) {
    nextConfig.hooks[eventName] = withoutAgentRollbackHooks(nextConfig.hooks[eventName] || []);
    nextConfig.hooks[eventName].push(buildMatcherGroup(eventName, command));
  }

  return nextConfig;
}

function withoutAgentRollbackHooks(matcherGroups) {
  return matcherGroups
    .map((matcherGroup) => ({
      ...matcherGroup,
      hooks: (matcherGroup.hooks || []).filter(
        (hook) => !(hook.type === 'command' && hook.command?.includes('agent-rollback.js')),
      ),
    }))
    .filter((matcherGroup) => (matcherGroup.hooks || []).length > 0);
}

function buildMatcherGroup(eventName, command) {
  const matcherByEvent = {
    PostToolUse: '*',
    PreToolUse: '*',
    SessionStart: 'startup|resume|clear|compact',
    UserPromptSubmit: undefined,
  };
  const matcher = matcherByEvent[eventName];
  const matcherGroup = {
    hooks: [
      {
        command,
        statusMessage: 'Saving rollback checkpoint',
        timeout: 30,
        type: 'command',
      },
    ],
  };

  if (matcher) {
    matcherGroup.matcher = matcher;
  }

  return matcherGroup;
}

function truncateText(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength - 3)}...`;
}

async function readTranscriptTail(transcriptPath) {
  if (!transcriptPath) {
    return [];
  }

  try {
    const transcript = await readFile(transcriptPath, 'utf8');
    return transcript.split('\n').filter(Boolean).slice(-20).map((line) => truncateText(line, 1000));
  } catch {
    return [];
  }
}
