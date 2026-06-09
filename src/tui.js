import readline from 'node:readline/promises';

import { formatUnifiedDiff } from './diff.js';
import { diffCheckpoints, listCheckpoints, pinCheckpoint, restoreCheckpoint } from './snapshot.js';
import { UserError } from './errors.js';

export async function runCheckpointBrowser({ io = process, noInput = false, query = '', runtime }) {
  const allCheckpoints = await listCheckpoints(runtime);
  const checkpoints = filterCheckpoints(allCheckpoints, query);
  io.stdout.write(formatBrowser({ checkpoints, query }));

  if (noInput || !io.stdin?.isTTY) {
    return { checkpoints };
  }

  await runInteractiveLoop({ checkpoints, io, runtime });
  return { checkpoints };
}

export function formatBrowser({ checkpoints, query = '' }) {
  const lines = [
    'agent-rollback - checkpoints',
    query ? `Filter: ${query}` : 'Filter: none',
    '',
    'No.  Pin  Files  Created At                 Label',
  ];

  if (checkpoints.length === 0) {
    lines.push('No checkpoints match.');
  }

  checkpoints.forEach((checkpoint, index) => {
    const pin = checkpoint.metadata?.pinned ? '*' : ' ';
    const label = checkpoint.metadata?.label || checkpoint.metadata?.command || checkpoint.id;
    lines.push(
      `${String(index + 1).padStart(2, ' ')}.  ${pin}    ${String(checkpoint.fileCount).padStart(5, ' ')}  ${checkpoint.createdAt}  ${label}`,
    );
  });

  lines.push('');
  lines.push('Commands: show <n>, diff <n>, pin <n> <label>, revert <n> --yes, q');
  return `${lines.join('\n')}\n`;
}

function filterCheckpoints(checkpoints, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return checkpoints;
  }

  return checkpoints.filter((checkpoint) =>
    [
      checkpoint.id,
      checkpoint.metadata?.label || '',
      checkpoint.metadata?.command || '',
      checkpoint.metadata?.source || '',
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

async function runInteractiveLoop({ checkpoints, io, runtime }) {
  const terminal = readline.createInterface({ input: io.stdin, output: io.stdout });

  try {
    while (true) {
      const answer = (await terminal.question('agent-rollback> ')).trim();
      if (answer === 'q' || answer === 'quit' || answer === 'exit') {
        return;
      }

      await runBrowserCommand({ answer, checkpoints, io, runtime });
    }
  } finally {
    terminal.close();
  }
}

async function runBrowserCommand({ answer, checkpoints, io, runtime }) {
  const [command, indexText, ...rest] = answer.split(/\s+/).filter(Boolean);
  if (!command) {
    return;
  }

  const checkpoint = getCheckpointByIndex(checkpoints, indexText);

  if (command === 'show') {
    io.stdout.write(`${JSON.stringify(checkpoint, null, 2)}\n`);
    return;
  }

  if (command === 'diff') {
    const previous = checkpoints[Number(indexText) - 2];
    if (!previous) {
      throw new UserError('diff needs a previous checkpoint');
    }
    const diff = await diffCheckpoints({ ...runtime, fromId: previous.id, toId: checkpoint.id });
    io.stdout.write(`${diff.map((entry) => `${entry.status}\t${entry.path}`).join('\n') || 'No changes.'}\n`);
    io.stdout.write(await formatUnifiedDiff({ ...runtime, fromId: previous.id, toId: checkpoint.id }));
    return;
  }

  if (command === 'pin') {
    const label = rest.join(' ');
    await pinCheckpoint({ ...runtime, checkpointId: checkpoint.id, label });
    io.stdout.write(`Pinned ${checkpoint.id}\n`);
    return;
  }

  if (command === 'revert') {
    if (!rest.includes('--yes')) {
      throw new UserError('interactive revert requires --yes');
    }
    await restoreCheckpoint({ ...runtime, checkpointId: checkpoint.id });
    io.stdout.write(`Restored workspace to ${checkpoint.id}\n`);
    return;
  }

  throw new UserError(`unknown browser command: ${command}`);
}

function getCheckpointByIndex(checkpoints, indexText) {
  const index = Number.parseInt(indexText, 10) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= checkpoints.length) {
    throw new UserError(`checkpoint number not found: ${indexText || ''}`.trim());
  }

  return checkpoints[index];
}
