# agent-rollback

Git-like rollback checkpoints for Codex CLI runs.

`agent-rollback` snapshots a workspace before and after Codex work, stores file
contents locally, and restores the workspace to any checkpoint on demand. It now
supports manual checkpoints, Codex hooks, JSON output, pin/prune/undo workflows,
a terminal checkpoint browser, an MCP server, and replay from a checkpoint.

## Install

```bash
npm install -g .
```

From the project root you can also run it directly:

```bash
node ./bin/agent-rollback.js --help
```

## Usage

Initialize local checkpoint storage:

```bash
agent-rollback init
```

Install Codex hooks in the current repo:

```bash
agent-rollback init codex
```

Run `/hooks` inside Codex after installation to review and trust the generated
repo-local hooks.

Create a manual checkpoint:

```bash
agent-rollback checkpoint "before refactor"
```

Run Codex with rollback checkpoints:

```bash
agent-rollback run codex "refactor the auth module"
agent-rollback run --event-stream codex "refactor the auth module"
```

The wrapper executes:

```bash
codex exec --sandbox workspace-write "refactor the auth module"
```

If you pass your own sandbox option, `agent-rollback` preserves it.

Codex hooks installed by `init codex` create deduped auto-checkpoints for
session start, user prompt, before tool use, and after tool use events. If Codex
passes a transcript path, `agent-rollback` stores a bounded transcript tail in
checkpoint metadata.

`run --event-stream` adds Codex's `--json` flag and creates deduped fallback
checkpoints from tool-like JSONL events. Use it when hooks are not installed or
not trusted yet.

List checkpoints:

```bash
agent-rollback list
agent-rollback list --json
```

Show a checkpoint manifest:

```bash
agent-rollback show cp-20260609-120000-ab12cd
```

Diff two checkpoints:

```bash
agent-rollback diff cp-before cp-after
```

Restore a checkpoint:

```bash
agent-rollback revert cp-before --yes
```

Pin, prune, and undo:

```bash
agent-rollback pin cp-good "known good"
agent-rollback prune --keep-last 20 --keep-pinned --yes
agent-rollback undo --yes
```

Browse checkpoints in the terminal:

```bash
agent-rollback tui
agent-rollback tui --query auth --no-input
```

Inspect operation history and revert an operation to its prior checkpoint:

```bash
agent-rollback log
agent-rollback op revert op-20260609-abcdef --dry-run
agent-rollback op revert op-20260609-abcdef --yes
```

Applied operation reverts create a safety checkpoint first.

Replay Codex from a previous checkpoint:

```bash
agent-rollback replay cp-good --yes codex "try the refactor again"
```

Run the MCP server over stdio:

```bash
agent-rollback mcp
```

Example Codex MCP config:

```toml
[mcp_servers.agent-rollback]
command = "agent-rollback"
args = ["mcp"]
```

The MCP server exposes `create_checkpoint`, `list_checkpoints`,
`show_checkpoint`, `diff_checkpoints`, `restore_checkpoint`,
`prune_checkpoints`, `search_checkpoints`, `pin_checkpoint`, and `undo`.
Restores are dry-run by default and require `mode: "apply"` plus `force: true`
to mutate files.

## Storage Model

The store lives in `.agent-rollback` by default:

- `checkpoints/<id>/manifest.json` records paths, metadata, modes, and hashes.
- `objects/<sha-prefix>/<sha>` stores content-addressed file blobs.
- `ops.jsonl` stores an append-only operation log.
- Pruning runs object garbage collection after deleting checkpoint manifests.
- The scanner uses `git ls-files -co --exclude-standard` in Git repos, then falls
  back to a filesystem walk outside Git.

The MVP restores regular files and symlinks. It excludes `.git`,
`.agent-rollback`, `node_modules`, and standard VCS metadata directories.

## Integration References

The implementation is based on current official docs for Codex non-interactive
mode, Codex hooks, and MCP stdio servers. The wrapper still uses
`codex exec --sandbox workspace-write` as the baseline automation path, while
`init codex` adds hook-based auto-checkpoints.

Reference docs:

- OpenAI Codex CLI docs: https://developers.openai.com/codex/cli
- OpenAI Codex non-interactive mode: https://developers.openai.com/codex/noninteractive
- OpenAI Codex hooks docs: https://developers.openai.com/codex/hooks
- OpenAI Codex best practices: https://developers.openai.com/codex/learn/best-practices
- OpenAI Codex GitHub repo: https://github.com/openai/codex
- Model Context Protocol docs: https://modelcontextprotocol.io
- Git restore docs: https://git-scm.com/docs/git-restore
- Git reset docs: https://git-scm.com/docs/git-reset
- Git revert docs: https://git-scm.com/docs/git-revert

## Development

```bash
npm test
npm run check
```

## Current Boundaries

- No cloud sync.
- TUI is a lightweight terminal browser, not a full-screen Ink app.
- `op revert` restores the checkpoint before an operation and saves a safety
  checkpoint first; it is not yet a patch-level selective revert that preserves
  all later edits.
- No Windows-specific path behavior beyond Node's standard APIs.
- Restore is file-content atomic per file, not a full workspace transaction.
