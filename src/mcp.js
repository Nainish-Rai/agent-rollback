import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import path from 'node:path';

import {
  createCheckpoint,
  deleteCheckpoint,
  diffCheckpoints,
  listCheckpoints,
  pinCheckpoint,
  restoreCheckpoint,
  showCheckpoint,
} from './snapshot.js';
import { UserError } from './errors.js';

export function createMcpHandlers(runtime) {
  return {
    async create_checkpoint({ message = '', name = '' } = {}) {
      const checkpoint = await createCheckpoint({
        ...runtime,
        metadata: { label: name, message, source: 'mcp' },
      });
      return { checkpoint };
    },

    async diff_checkpoints({ from, to }) {
      const diff = await diffCheckpoints({ ...runtime, fromId: from, toId: to });
      return { diff, from, to };
    },

    async list_checkpoints({ limit = 20, query = '' } = {}) {
      const checkpoints = filterCheckpoints(await listCheckpoints(runtime), query).slice(-limit).reverse();
      return { checkpoints };
    },

    async pin_checkpoint({ id, name }) {
      const checkpoint = await pinCheckpoint({ ...runtime, checkpointId: id, label: name });
      return { checkpoint };
    },

    async prune_checkpoints({ dryRun = true, keepLast = 20, keepPinned = true } = {}) {
      const checkpoints = await listCheckpoints(runtime);
      const deleted = checkpoints.filter((checkpoint, index) => {
        const isProtectedByAge = index >= checkpoints.length - keepLast;
        const isProtectedByPin = keepPinned && checkpoint.metadata?.pinned;
        return !isProtectedByAge && !isProtectedByPin;
      });

      if (!dryRun) {
        await Promise.all(
          deleted.map((checkpoint) => deleteCheckpoint({ ...runtime, checkpointId: checkpoint.id })),
        );
      }

      return { applied: !dryRun, deleted };
    },

    async restore_checkpoint({ force = false, id, mode = 'dry-run' }) {
      const checkpoint = await showCheckpoint({ ...runtime, checkpointId: id });
      if (mode === 'dry-run') {
        return { applied: false, checkpoint };
      }

      if (!force) {
        throw new UserError('restore_checkpoint apply mode requires force: true');
      }

      await restoreCheckpoint({ ...runtime, checkpointId: id });
      return { applied: true, checkpoint };
    },

    async search_checkpoints({ query }) {
      const checkpoints = filterCheckpoints(await listCheckpoints(runtime), query);
      return { checkpoints };
    },

    async show_checkpoint({ id }) {
      const checkpoint = await showCheckpoint({ ...runtime, checkpointId: id });
      return { checkpoint };
    },

    async undo({ count = 1, force = false } = {}) {
      if (!force) {
        throw new UserError('undo requires force: true');
      }
      const checkpoints = await listCheckpoints(runtime);
      const targetIndex = checkpoints.length - count - 1;
      if (targetIndex < 0) {
        throw new UserError(`cannot undo ${count} steps`);
      }
      const checkpoint = checkpoints[targetIndex];
      await restoreCheckpoint({ ...runtime, checkpointId: checkpoint.id });
      return { checkpoint, count };
    },
  };
}

export function createAgentRollbackMcpServer(runtime) {
  const server = new McpServer(
    {
      name: 'agent-rollback',
      version: '0.1.0',
    },
    {
      instructions:
        'Create checkpoints before risky edits. Use restore_checkpoint in dry-run mode first; apply only when the user explicitly wants rollback.',
    },
  );
  const handlers = createMcpHandlers(runtime);

  registerTools(server, handlers);
  registerResources(server, handlers);
  registerPrompts(server);

  return server;
}

export async function startMcpServer({ storeRoot, workspaceRoot }) {
  const runtime = {
    storeRoot: path.resolve(storeRoot || path.join(workspaceRoot, '.agent-rollback')),
    workspaceRoot: path.resolve(workspaceRoot),
  };
  const server = createAgentRollbackMcpServer(runtime);
  await server.connect(new StdioServerTransport());
}

function registerTools(server, handlers) {
  server.tool(
    'create_checkpoint',
    'Snapshot the current workspace before a risky operation.',
    { message: z.string().optional(), name: z.string().optional() },
    async (input) => toMcpText(await handlers.create_checkpoint(input)),
  );

  server.tool(
    'list_checkpoints',
    'List recent checkpoints, newest first.',
    { limit: z.number().int().positive().optional(), query: z.string().optional() },
    async (input) => toMcpText(await handlers.list_checkpoints(input)),
  );

  server.tool(
    'show_checkpoint',
    'Show one checkpoint manifest.',
    { id: z.string() },
    async (input) => toMcpText(await handlers.show_checkpoint(input)),
  );

  server.tool(
    'diff_checkpoints',
    'Show changed paths between two checkpoints.',
    { from: z.string(), to: z.string() },
    async (input) => toMcpText(await handlers.diff_checkpoints(input)),
  );

  server.tool(
    'restore_checkpoint',
    'Restore workspace to a checkpoint. Dry-run by default.',
    {
      force: z.boolean().optional(),
      id: z.string(),
      mode: z.enum(['dry-run', 'apply']).optional(),
    },
    async (input) => toMcpText(await handlers.restore_checkpoint(input)),
  );

  server.tool(
    'prune_checkpoints',
    'Delete old unpinned checkpoints.',
    {
      dryRun: z.boolean().optional(),
      keepLast: z.number().int().positive().optional(),
      keepPinned: z.boolean().optional(),
    },
    async (input) => toMcpText(await handlers.prune_checkpoints(input)),
  );

  server.tool(
    'search_checkpoints',
    'Search checkpoints by id, label, message, command, or source.',
    { query: z.string() },
    async (input) => toMcpText(await handlers.search_checkpoints(input)),
  );

  server.tool(
    'pin_checkpoint',
    'Pin a checkpoint with a durable name.',
    { id: z.string(), name: z.string() },
    async (input) => toMcpText(await handlers.pin_checkpoint(input)),
  );

  server.tool(
    'undo',
    'Restore the workspace to the checkpoint before the last N checkpoint steps.',
    { count: z.number().int().positive().optional(), force: z.boolean().optional() },
    async (input) => toMcpText(await handlers.undo(input)),
  );
}

function registerResources(server, handlers) {
  server.resource(
    'checkpoint',
    new ResourceTemplate('checkpoint://{id}', { list: undefined }),
    async (uri, { id }) => ({
      contents: [
        {
          mimeType: 'application/json',
          text: JSON.stringify(await handlers.show_checkpoint({ id }), null, 2),
          uri: uri.href,
        },
      ],
    }),
  );

  server.resource(
    'checkpoint-diff',
    new ResourceTemplate('checkpoint://{from}/diff/{to}', { list: undefined }),
    async (uri, { from, to }) => ({
      contents: [
        {
          mimeType: 'application/json',
          text: JSON.stringify(await handlers.diff_checkpoints({ from, to }), null, 2),
          uri: uri.href,
        },
      ],
    }),
  );
}

function registerPrompts(server) {
  server.prompt('safe-experiment', 'Create a checkpoint before an experiment and roll back if it fails.', () => ({
    messages: [
      {
        content: {
          text: 'Create a checkpoint, perform the requested experiment, verify the result, and restore the checkpoint if verification fails.',
          type: 'text',
        },
        role: 'user',
      },
    ],
  }));

  server.prompt('emergency-rollback', 'Restore a known-good checkpoint and summarize the impact.', () => ({
    messages: [
      {
        content: {
          text: 'List checkpoints, identify the most relevant known-good state, run restore_checkpoint in dry-run mode, then ask before applying the rollback.',
          type: 'text',
        },
        role: 'user',
      },
    ],
  }));
}

function filterCheckpoints(checkpoints, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return checkpoints;
  }

  return checkpoints.filter((checkpoint) =>
    [
      checkpoint.id,
      checkpoint.metadata?.command || '',
      checkpoint.metadata?.label || '',
      checkpoint.metadata?.message || '',
      checkpoint.metadata?.source || '',
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

function toMcpText(value) {
  return {
    content: [
      {
        text: JSON.stringify(value, null, 2),
        type: 'text',
      },
    ],
  };
}
