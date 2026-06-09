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
  const [command] = args;

  if (!command || command === '--help' || command === '-h') {
    io.stdout.write(HELP_TEXT);
    return;
  }

  throw new Error(`unknown command: ${command}. Run agent-rollback --help.`);
}

export { HELP_TEXT };
