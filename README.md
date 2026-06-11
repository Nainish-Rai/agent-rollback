# agent-rollback

> Git-like rollback checkpoints for Codex CLI runs.

`agent-rollback` snapshots a workspace before and after Codex work, stores
file contents locally, and restores the workspace to any checkpoint on
demand. Use it as a CLI (`agent-rollback`, short alias `ar`), an MCP server
for AI agents, or a Codex hook for automatic deduped auto-checkpoints.

[![npm](https://img.shields.io/npm/v/agent-rollback.svg)](https://www.npmjs.com/package/agent-rollback)
[![node](https://img.shields.io/node/v/agent-rollback.svg)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/agent-rollback.svg)](./LICENSE)
[![downloads](https://img.shields.io/npm/dm/agent-rollback.svg)](https://www.npmjs.com/package/agent-rollback)

## Contents

- [30-second start](#30-second-start)
- [Why](#why)
- [Install](#install)
- [AI agent skill](#ai-agent-skill)
- [Usage](#usage)
  - [Manual checkpoints](#manual-checkpoints)
  - [Run Codex with rollback](#run-codex-with-rollback)
  - [Codex hooks (auto-checkpoints)](#codex-hooks-auto-checkpoints)
  - [List, show, diff](#list-show-diff)
  - [Restore, pin, prune, undo](#restore-pin-prune-undo)
  - [Terminal browser (TUI)](#terminal-browser-tui)
  - [Operation log](#operation-log)
  - [Replay from a checkpoint](#replay-from-a-checkpoint)
  - [MCP server](#mcp-server)
- [Storage model](#storage-model)
- [Integration references](#integration-references)
- [Development](#development)
- [Current boundaries](#current-boundaries)

## 30-second start

```bash
# 1. one-line install (Node >= 20)
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash

# 2. inside any repo
agent-rollback init
agent-rollback checkpoint "before refactor"
agent-rollback run codex "refactor the auth module"

# 3. made a mess? roll back
agent-rollback list
agent-rollback revert cp-before-refactor-ed96 --yes
```

That's the whole loop. Everything below is optional depth.

Want the AI agent skill **and** the MCP server wired up in one go?

```bash
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --all
```

## Why

Codex (and any agent that edits files) will eventually make a change you
didn't want. `agent-rollback` gives you:

- **Before/after snapshots** of the working tree, content-addressed and
  deduped, so they cost ~zero disk.
- **Selective restore**: pin a known-good checkpoint, prune noise, and
  jump back in one command.
- **Operation log**: every revert records which files it touched, so you
  can revert a single bad operation without losing later unrelated edits.
- **Agent-native surface**: an MCP server, a Codex hook, and a SKILL.md
  so any agent (Codex, Claude Code, Cursor, etc.) can use it without you
  being in the loop.

## Install

Pick one of three paths.

### 1. One-click script (recommended)

Detects your platform, checks Node >= 20, installs globally, and verifies
the binary. Idempotent and safe to re-run.

```bash
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash
```

Options (append after `bash -s --`):

| Flag             | Effect                                                                  |
| ---------------- | ----------------------------------------------------------------------- |
| `--all`          | Install binary + agent skill + register MCP server in Codex (`--with-skill --with-mcp`). |
| `--with-skill`   | Also install the agent skill globally via `npx skills add`.             |
| `--with-mcp`     | Also register the MCP server in `~/.codex/config.toml` (auto-merged, idempotent, with backup). |
| `--version 0.1.2`| Pin a specific version instead of `latest`.                             |
| `--uninstall`    | Remove the global install and the MCP block from Codex config.          |
| `--dry-run`      | Print what would happen; make no changes.                               |
| `--no-color`     | Disable ANSI colors.                                                    |

What `--with-mcp` does:

- Adds this block to `~/.codex/config.toml` (respects `$CODEX_HOME` if set):
  ```toml
  [mcp_servers.agent-rollback]
  command = "agent-rollback"
  args = ["mcp"]
  ```
- Backs up any existing config to `config.toml.bak.<timestamp>` first.
- Skips silently if the block is already present (safe to re-run).
- `--uninstall` removes the same block as part of cleanup.

Examples:

```bash
# install + skill + MCP in one shot
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --all

# just the binary + skill
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --with-skill

# just the binary + MCP server registration
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --with-mcp

# preview only
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --dry-run

# remove later (also strips the MCP block)
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --uninstall
```

### 2. npm (published package)

```bash
npm install -g agent-rollback
```

Requires **Node.js >= 20**. Both `agent-rollback` and `ar` (short alias)
are added to your `PATH`.

### 3. From source

```bash
git clone https://github.com/Nainish-Rai/agent-rollback.git
cd agent-rollback
npm install
npm link        # exposes `agent-rollback` / `ar` globally
```

Or run it directly without linking:

```bash
node ./bin/agent-rollback.js --help
```

## AI agent skill

A `SKILL.md` ships in the package at `skills/agent-rollback/SKILL.md`. It
teaches AI agents (Codex CLI, Claude Code, Cursor, Gemini CLI, Windsurf,
Copilot, Cline, ...) how to use both the MCP server and the `ar` CLI.

**One-line install** (works for 18+ agents):

```bash
npx skills add Nainish-Rai/agent-rollback --skill agent-rollback -g -y
```

Manage afterwards:

```bash
npx skills list                 # what's installed
npx skills find "rollback"      # discover more
npx skills update               # pull latest
npx skills remove agent-rollback
```

After install the skill appears in the agent's slash menu and triggers
automatically on rollback / undo / revert / restore / "what changed" /
"I broke something" phrases — no need to name the tool.

The skill is also discoverable on [skills.sh](https://skills.sh) once at
least one user installs it.

**Manual install** (after `npm install -g agent-rollback`):

```bash
# Codex CLI
mkdir -p ~/.codex/skills
ln -s "$(npm root -g)/agent-rollback/skills/agent-rollback" ~/.codex/skills/

# Claude Code
mkdir -p ~/.claude/skills
ln -s "$(npm root -g)/agent-rollback/skills/agent-rollback" ~/.claude/skills/

# Cursor (project-only)
mkdir -p .cursor/skills
ln -s "$(npm root -g)/agent-rollback/skills/agent-rollback" .cursor/skills/
```

## Usage

All commands accept `--cwd <dir>`, `--store <dir>`, `--json` (for
agents/CI), `--no-input`, and `--yes` (skip confirmations).

```text
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
```

### Manual checkpoints

```bash
agent-rollback init                         # create .agent-rollback/
agent-rollback checkpoint "before refactor" # human-readable id
agent-rollback checkpoint                   # auto label = timestamp + short hash
```

### Run Codex with rollback

```bash
agent-rollback run codex "refactor the auth module"
agent-rollback run --event-stream codex "refactor the auth module"
```

The wrapper executes:

```bash
codex exec --sandbox workspace-write "refactor the auth module"
```

If you pass your own sandbox option, `agent-rollback` preserves it.
`run --event-stream` adds Codex's `--json` flag and creates deduped
fallback checkpoints from tool-like JSONL events. Use it when hooks are
not installed or not trusted yet.

### Codex hooks (auto-checkpoints)

```bash
agent-rollback init codex
```

Installs repo-local Codex hooks that create deduped auto-checkpoints for
session start, user prompt, before tool use, and after tool use events.
If Codex passes a transcript path, a bounded transcript tail is stored in
checkpoint metadata.

Run `/hooks` inside Codex after installation to review and trust the
generated repo-local hooks.

### List, show, diff

```bash
agent-rollback list
agent-rollback list --json
agent-rollback show cp-183544-before-refactor-ed96
agent-rollback diff cp-before cp-after
agent-rollback diff cp-before cp-after --patch
```

### Restore, pin, prune, undo

```bash
agent-rollback revert cp-before --yes
agent-rollback pin cp-good "known good"
agent-rollback prune --keep-last 20 --keep-pinned --yes
agent-rollback undo --yes
```

`prune` runs object garbage collection after deleting checkpoint
manifests. `undo` rolls back the last N checkpoints (default `1`).

### Terminal browser (TUI)

```bash
agent-rollback tui
agent-rollback tui --query auth --no-input
```

Inside interactive `tui`, `diff <n>` shows changed paths and a unified
diff preview for the selected checkpoint. On a TTY the browser opens as a
cleared terminal surface; `--no-input` renders once for CI and agents.

### Operation log

```bash
agent-rollback log
agent-rollback op revert op-20260609-abcdef --dry-run
agent-rollback op revert op-20260609-abcdef --yes
```

Applied operation reverts create a safety checkpoint first. Operation
reverts are **selective**: they revert paths touched by that operation
and leave later unrelated files in place. If touched files changed
again, rerun with `--force` only when overwriting those later edits is
intended.

### Replay from a checkpoint

```bash
agent-rollback replay cp-good --yes codex "try the refactor again"
```

Restores the workspace to `cp-good` and then runs Codex with the new
prompt, so the agent sees the same starting state as the original run.

### MCP server

```bash
agent-rollback mcp
```

Example Codex MCP config (`~/.codex/config.toml`):

```toml
[mcp_servers.agent-rollback]
command = "agent-rollback"
args = ["mcp"]
```

The MCP server exposes `create_checkpoint`, `list_checkpoints`,
`show_checkpoint`, `diff_checkpoints`, `restore_checkpoint`,
`prune_checkpoints`, `search_checkpoints`, `pin_checkpoint`, and `undo`.
Restores are dry-run by default and require `mode: "apply"` plus
`force: true` to mutate files.

## Storage model

The store lives in `.agent-rollback` by default (override with
`--store <dir>`):

```text
.agent-rollback/
├── checkpoints/<id>/manifest.json   # paths, metadata, modes, hashes
├── objects/<sha-prefix>/<sha>       # content-addressed file blobs
└── ops.jsonl                        # append-only operation log
```

Key properties:

- **Content-addressed**: identical file contents across checkpoints
  share one blob. The scanner dedupes by sha256.
- **Append-only history**: `ops.jsonl` records every mutating action.
- **GC after prune**: deleting manifests triggers object garbage
  collection.
- **Git-aware scanner**: uses `git ls-files -co --exclude-standard` in
  Git repos, then falls back to a filesystem walk outside Git.

The MVP restores regular files and symlinks. It excludes `.git`,
`.agent-rollback`, `node_modules`, and standard VCS metadata directories.

## Integration references

The implementation is based on current official docs for Codex
non-interactive mode, Codex hooks, and MCP stdio servers. The wrapper
uses `codex exec --sandbox workspace-write` as the baseline automation
path; `init codex` adds hook-based auto-checkpoints on top.

- [OpenAI Codex CLI docs](https://developers.openai.com/codex/cli)
- [OpenAI Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [OpenAI Codex hooks docs](https://developers.openai.com/codex/hooks)
- [OpenAI Codex best practices](https://developers.openai.com/codex/learn/best-practices)
- [OpenAI Codex GitHub repo](https://github.com/openai/codex)
- [Model Context Protocol docs](https://modelcontextprotocol.io)
- [`git restore`](https://git-scm.com/docs/git-restore), [`git reset`](https://git-scm.com/docs/git-reset), [`git revert`](https://git-scm.com/docs/git-revert)

## Development

```bash
npm test          # Node's built-in test runner
npm run check     # syntax-check every bin/src/test file
```

Pre-publish gate (runs automatically on `npm publish`):

```bash
npm run prepublishOnly   # = npm run check && npm test
```

Project layout:

```text
bin/           # agent-rollback.js, ar.js (short alias)
src/           # cli.js, snapshot.js, runner.js, mcp.js, hooks.js, ...
skills/        # SKILL.md shipped to npm consumers
test/          # *.test.js — node --test
scripts/       # install.sh — one-click installer
```

Conventions are documented in [`AGENTS.md`](./AGENTS.md).

## Current boundaries

- No cloud sync.
- TUI is a lightweight terminal browser, not a full-screen Ink app.
- `op revert` is path-selective and saves a safety checkpoint first. It
  refuses conflicts unless `--force` is supplied.
- No Windows-specific path behavior beyond Node's standard APIs. On
  Windows, use WSL or `npm install -g agent-rollback` directly.
- Restore is file-content atomic per file, not a full workspace
  transaction.

## License

[MIT](./LICENSE)
