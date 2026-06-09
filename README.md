# agent-rollback

Git-like rollback checkpoints for Codex CLI runs.

`agent-rollback` snapshots a workspace before and after a Codex run, stores file
contents locally, and restores the workspace to any checkpoint on demand.

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

Create a manual checkpoint:

```bash
agent-rollback checkpoint "before refactor"
```

Run Codex with rollback checkpoints:

```bash
agent-rollback run codex "refactor the auth module"
```

The wrapper executes:

```bash
codex exec --sandbox workspace-write "refactor the auth module"
```

If you pass your own sandbox option, `agent-rollback` preserves it.

List checkpoints:

```bash
agent-rollback list
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

## Storage Model

The store lives in `.agent-rollback` by default:

- `checkpoints/<id>/manifest.json` records paths, metadata, modes, and hashes.
- `objects/<sha-prefix>/<sha>` stores content-addressed file blobs.
- The scanner uses `git ls-files -co --exclude-standard` in Git repos, then falls
  back to a filesystem walk outside Git.

The MVP restores regular files and symlinks. It excludes `.git`,
`.agent-rollback`, `node_modules`, and standard VCS metadata directories.

## Codex Integration

This MVP uses Codex's documented non-interactive mode instead of private hook
contracts. Current official docs say `codex exec` is the automation path for CI,
pipelines, explicit sandbox settings, JSON output, and resumable workflows.

Reference docs:

- OpenAI Codex CLI docs: https://developers.openai.com/codex/cli
- OpenAI Codex non-interactive mode: https://developers.openai.com/codex/noninteractive
- OpenAI Codex best practices: https://developers.openai.com/codex/learn/best-practices
- OpenAI Codex GitHub repo: https://github.com/openai/codex
- Git restore docs: https://git-scm.com/docs/git-restore
- Git reset docs: https://git-scm.com/docs/git-reset
- Git revert docs: https://git-scm.com/docs/git-revert

## Development

```bash
npm test
npm run check
```

## MVP Boundaries

- No cloud sync.
- No TUI.
- No live per-tool Codex hook integration.
- No Windows-specific path behavior beyond Node's standard APIs.
- Restore is file-content atomic per file, not a full workspace transaction.
