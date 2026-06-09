import { UserError } from './errors.js';
import { runCodex } from './runner.js';
import { restoreCheckpoint } from './snapshot.js';

export async function replayFromCheckpoint({ args, checkpointId, force = false, io = process, runtime }) {
  if (!force) {
    throw new UserError('replay restores files before running Codex; rerun with --yes');
  }

  await restoreCheckpoint({ ...runtime, checkpointId });
  return runCodex({ args, io, ...runtime });
}
