import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { diffCheckpoints, showCheckpoint } from './snapshot.js';

export async function formatUnifiedDiff({ fromId, storeRoot, toId }) {
  const [diff, fromCheckpoint, toCheckpoint] = await Promise.all([
    diffCheckpoints({ fromId, storeRoot, toId }),
    showCheckpoint({ checkpointId: fromId, storeRoot }),
    showCheckpoint({ checkpointId: toId, storeRoot }),
  ]);

  if (diff.length === 0) {
    return 'No changes.\n';
  }

  const sections = [];
  for (const entry of diff) {
    sections.push(
      await formatFileDiff({
        after: toCheckpoint.files[entry.path] || null,
        before: fromCheckpoint.files[entry.path] || null,
        relativePath: entry.path,
        storeRoot,
      }),
    );
  }

  return `${sections.join('\n')}\n`;
}

async function formatFileDiff({ after, before, relativePath, storeRoot }) {
  const beforeText = await readTextObject({ entry: before, storeRoot });
  const afterText = await readTextObject({ entry: after, storeRoot });

  if (beforeText === null || afterText === null) {
    return [`--- a/${relativePath}`, `+++ b/${relativePath}`, '@@ binary or symlink change @@'].join('\n');
  }

  return [
    `--- a/${relativePath}`,
    `+++ b/${relativePath}`,
    '@@',
    ...buildLineDiff(beforeText.split('\n'), afterText.split('\n')),
  ].join('\n');
}

async function readTextObject({ entry, storeRoot }) {
  if (!entry) {
    return '';
  }

  if (entry.type !== 'file') {
    return null;
  }

  const content = await readFile(path.join(storeRoot, 'objects', entry.sha256.slice(0, 2), entry.sha256));
  if (content.includes(0)) {
    return null;
  }

  return content.toString('utf8');
}

function buildLineDiff(beforeLines, afterLines) {
  const table = buildLongestCommonSubsequenceTable(beforeLines, afterLines);
  const lines = [];
  let beforeIndex = beforeLines.length;
  let afterIndex = afterLines.length;

  while (beforeIndex > 0 || afterIndex > 0) {
    if (
      beforeIndex > 0 &&
      afterIndex > 0 &&
      beforeLines[beforeIndex - 1] === afterLines[afterIndex - 1]
    ) {
      lines.push(` ${beforeLines[beforeIndex - 1]}`);
      beforeIndex -= 1;
      afterIndex -= 1;
      continue;
    }

    if (afterIndex > 0 && (beforeIndex === 0 || table[beforeIndex][afterIndex - 1] >= table[beforeIndex - 1][afterIndex])) {
      lines.push(`+${afterLines[afterIndex - 1]}`);
      afterIndex -= 1;
      continue;
    }

    lines.push(`-${beforeLines[beforeIndex - 1]}`);
    beforeIndex -= 1;
  }

  return lines.reverse();
}

function buildLongestCommonSubsequenceTable(beforeLines, afterLines) {
  const table = Array.from({ length: beforeLines.length + 1 }, () =>
    Array.from({ length: afterLines.length + 1 }, () => 0),
  );

  for (let beforeIndex = 1; beforeIndex <= beforeLines.length; beforeIndex += 1) {
    for (let afterIndex = 1; afterIndex <= afterLines.length; afterIndex += 1) {
      if (beforeLines[beforeIndex - 1] === afterLines[afterIndex - 1]) {
        table[beforeIndex][afterIndex] = table[beforeIndex - 1][afterIndex - 1] + 1;
      } else {
        table[beforeIndex][afterIndex] = Math.max(
          table[beforeIndex - 1][afterIndex],
          table[beforeIndex][afterIndex - 1],
        );
      }
    }
  }

  return table;
}
