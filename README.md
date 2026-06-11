# agent-rollback

> **Undo, revert, and rollback checkpoints for OpenAI Codex CLI.** Snapshot
> your workspace, diff what changed, and restore files in one command —
> before, during, and after any Codex run.

`agent-rollback` is a CLI (`agent-rollback` / short alias `arb`), an MCP
server, and a Codex hook that gives you a Git-like safety net for
AI-edited code. It captures content-addressed snapshots of the working
tree, dedupes them so they cost ~zero disk, and lets you jump back to
any point with a single command.

**Also known as:** Codex undo, Codex revert, Codex checkpoint, Codex
rollback, Codex snapshot, Codex backup, Codex diff, Codex restore,
Codex file history, Codex safety net, Codex MCP, Codex time travel.

[![npm](https://img.shields.io/npm/v/agent-rollback.svg)](https://www.npmjs.com/package/agent-rollback)
[![node](https://img.shields.io/node/v/agent-rollback.svg)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/agent-rollback.svg)](./LICENSE)
[![downloads](https://img.shields.io/npm/dm/agent-rollback.svg)](https://www.npmjs.com/package/agent-rollback)
[![stars](https://img.shields.io/github/stars/Nainish-Rai/agent-rollback.svg)](https://github.com/Nainish-Rai/agent-rollback/stargazers)
[![Codex CLI](https://img.shields.io/badge/OpenAI-Codex%20CLI-blue.svg)](https://developers.openai.com/codex/cli)
[![MCP](https://img.shields.io/badge/MCP-server-green.svg)](https://modelcontextprotocol.io)

## Contents

- [30-second start](#30-second-start)
  - [Step 0 — Install (one line)](#step-0--install-one-line)
  - [Step 1 — Initialize a repo](#step-1--initialize-a-repo)
  - [Step 2 — Ask the agent what it can do](#step-2--ask-the-agent-what-it-can-do)
  - [Step 3 — Create a checkpoint, then do something risky](#step-3--create-a-checkpoint-then-do-something-risky)
  - [Step 4 — Browse checkpoints](#step-4--browse-checkpoints)
  - [Step 5 — Made a mess? Roll back](#step-5--made-a-mess-roll-back)
  - [Step 6 — See what changed](#step-6--see-what-changed)
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
- [Chat with Codex — MCP usage examples](#chat-with-codex--natural-language-examples)
- [Integration references](#integration-references)
- [FAQ — Codex undo, revert, and rollback](#faq--codex-undo-revert-and-rollback)
- [Development](#development)
- [Current boundaries](#current-boundaries)
- [License](#license)

## 30-second start

The full user flow, in order. From "never heard of it" to "rolled back a
bad Codex edit" in about 30 seconds of typing.

`agent-rollback` is the full command. `arb` is a 3-char alias for
when you're in a hurry. They do exactly the same thing.

### Step 0 — Install (one line)

```bash
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --all
```

This installs the `agent-rollback` (and `arb`) binary globally,
registers the MCP server in `~/.codex/config.toml`, and installs the
agent skill for 18+ agents. Verify it worked:

```bash
agent-rollback --help   # see all subcommands
arb --help              # short alias, same output
```

If you'd rather use npm only (no MCP, no skill), drop the `--all` flag —
or run `npm install -g agent-rollback` instead.

### Step 1 — Initialize a repo

```bash
mkdir demo && cd demo && git init
agent-rollback init         # or: arb init
```

This creates `.agent-rollback/` in the project. All your snapshots will
live here. (You can ignore it in your `.gitignore`; it's yours, not your
repo's.)

### Step 2 — Ask the agent what it can do

Open Codex in this repo and just say:

> **You:** *"what can you do for checkpoints?"*

Codex reads the installed `SKILL.md` and lists the full surface — create,
list, show, diff, revert, undo, pin, prune, replay, tui — with one-line
examples. No memorization needed.

### Step 3 — Create a checkpoint, then do something risky

> **You:** *"make a checkpoint called 'green tests' and refactor the auth module"*

> **Codex:** *"Created cp-183544-green-tests-ed96. Refactoring auth module now. If I make a mess, just say 'go back'."*

### Step 4 — Browse checkpoints

> **You:** *"show me checkpoints"*

> **Codex:**
> ```
>   • cp-183544-green-tests-ed96   12 sec ago   green tests
>   • cp-cold-start-deadbeef       1 min ago    cold start
>   2 checkpoints, ~0.4 MB on disk.
> ```

Or from the CLI:

```bash
agent-rollback list              # or: arb list
agent-rollback list --json       # machine-readable
agent-rollback tui               # interactive terminal browser
```

### Step 5 — Made a mess? Roll back

> **You:** *"go to the last checkpoint"*

> **Codex:** *"Reverted to cp-183544-green-tests-ed96. 4 files restored, safety checkpoint cp-...-safety-... created automatically."*

Or from the CLI:

```bash
agent-rollback revert cp-183544-green-tests-ed96 --yes   # or: arb revert ...
agent-rollback undo 1 --yes                              # undo the last N
```

### Step 6 — See what changed

> **You:** *"what did the refactor change vs the green tests checkpoint?"*

> **Codex:**
> ```
>   3 files changed in src/auth/:
>     src/auth/login.js   (+42, -18)
>     src/auth/token.js   (+12, -4)
>     src/auth/index.js  (+3, -0)
>   Want me to revert just those, or roll back the whole checkpoint?
> ```

That's the whole loop. Everything below is optional depth.

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
- **Three ways to use it**: a CLI (`agent-rollback` / `arb`), an MCP server
  any agent can call, or a Codex hook that auto-snapshots on every prompt
  and tool use.

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

Requires **Node.js >= 20**. Adds two commands to your `PATH`:

- `agent-rollback` — the full name, what you'll see in docs and code
- `arb` — a 3-char short alias, perfect for muscle memory and tight loops

Both are identical; pick whichever you type faster.

> **Why `arb` and not `ar`?**
>
> `ar` is the BSD/GNU archive tool that ships with every Unix-like
> system at `/usr/bin/ar`. On any shell where `/usr/bin` is searched
> before npm's global bin (cloud shells, cron, some terminal emulators,
> shells launched without nvm initialized), the system `ar` shadows our
> binary and `ar --help` shows the archive tool's usage instead of ours.
> `arb` (agent-rollback) is a 3-char name that doesn't collide with
> anything. The installer detects the shadow and prints a note.

### 3. From source

```bash
git clone https://github.com/Nainish-Rai/agent-rollback.git
cd agent-rollback
npm install
npm link        # exposes `agent-rollback` / `arb` globally
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

#### Chat with Codex — natural-language examples

Once the MCP server is registered, you can talk to Codex in plain
English and it'll do the right thing. Same prompts work with any
MCP-compatible agent (Claude Code, Cursor, etc.). The `agent-rollback`
binary is always there as a fallback — every flow has a CLI equivalent.

**Checkpoint, then do something risky**

> **You:** *"make a checkpoint and refactor task service"*

> **Codex:** *"Created checkpoint cp-183544-before-task-service-refactor-ed96. Refactoring task service now. If I make a mess, just say 'go back'."*

```bash
# CLI equivalent
agent-rollback checkpoint "before task service refactor"
arb checkpoint "before task service refactor"
```

**Show me my checkpoints**

> **You:** *"show me checkpoints"*

> **Codex:**
> ```
>   • cp-183544-before-task-service-refactor-ed96   2 min ago   before task service refactor
>   • cp-170221-after-auth-rewrite-a1b2              14 min ago  after auth rewrite
>   • cp-091833-cold-start-deadbeef                  1 hr ago     cold start
>   3 checkpoints, ~1.2 MB on disk.
> ```

```bash
agent-rollback list            # or: arb list
agent-rollback list --json
agent-rollback tui
```

**Roll back to the last checkpoint**

> **You:** *"go to last checkpoint"*

> **Codex:** *"Reverted to cp-183544-before-task-service-refactor-ed96. 4 files restored, safety checkpoint cp-...-safety-... created."*

```bash
agent-rollback undo 1 --yes    # or: arb undo 1 --yes
```

**Diff between two checkpoints**

> **You:** *"what changed between the auth checkpoint and now?"*

> **Codex:** *"3 files changed in src/services/auth/: login.js (+42, -18), token.js (+12, -4), index.js (+3, -0). Want me to revert just those, or roll back the whole checkpoint?"*

```bash
agent-rollback diff cp-170221-after-auth-rewrite-a1b2 cp-183544-before-task-service-refactor-ed96
agent-rollback diff cp-170221-after-auth-rewrite-a1b2 cp-183544-before-task-service-refactor-ed96 --patch
```

**Search checkpoints by what they were about**

> **You:** *"find my checkpoint about the mongodb migration"*

> **Codex:** *"Found 2: cp-153012-before-mongodb-migration-c0de (pinned), cp-153045-after-migration-b33f."*

```bash
agent-rollback search "mongodb"   # or: arb search "mongodb"
```

**Pin a known-good checkpoint so it never gets pruned**

> **You:** *"pin the v0.4 release checkpoint as 'v0.4 release'"*

> **Codex:** *"Pinned. It'll survive any prune."*

```bash
agent-rollback pin cp-... "v0.4 release"
```

**Preview a restore before committing**

> **You:** *"dry-run restore to the auth checkpoint"*

> **Codex:** *"Dry run would restore 3 files in src/services/auth/. No conflicts. Say 'apply' to do it for real."*

```bash
agent-rollback revert cp-170221-after-auth-rewrite-a1b2 --yes   # dry-run is the default
```

**Apply a restore**

> **You:** *"apply it"*

> **Codex:** *"Restored. Workspace now matches cp-170221-after-auth-rewrite-a1b2. Safety checkpoint created."*

```bash
agent-rollback revert cp-170221-after-auth-rewrite-a1b2 --force --yes
```

**Clean up old checkpoints**

> **You:** *"prune old checkpoints but keep the last 10 and any pinned ones"*

> **Codex:** *"Dry run: 4 checkpoints would be deleted (cp-..., cp-..., cp-..., cp-...). Pinned (1) and last 10 (10) are protected. Say 'go ahead' to apply."*

```bash
agent-rollback prune --keep-last 10 --keep-pinned --dry-run
agent-rollback prune --keep-last 10 --keep-pinned --yes
```

#### MCP tool reference

| Tool                  | What it does                                              | Required args           | Optional args                       |
| --------------------- | --------------------------------------------------------- | ----------------------- | ----------------------------------- |
| `create_checkpoint`   | Snapshot the current workspace                            | —                       | `name`, `message`                   |
| `list_checkpoints`    | List recent checkpoints, newest first                    | —                       | `limit`, `query`                    |
| `show_checkpoint`     | Show one checkpoint manifest                              | `id`                    | —                                   |
| `diff_checkpoints`    | Show changed paths between two checkpoints                | `from`, `to`            | —                                   |
| `restore_checkpoint`  | Restore workspace to a checkpoint (dry-run by default)   | `id`                    | `mode` (`"apply"` to mutate), `force` |
| `prune_checkpoints`   | Delete old unpinned checkpoints                          | —                       | `dryRun`, `keepLast`, `keepPinned` |
| `search_checkpoints`  | Search by id, label, message, command, or source          | `query`                 | —                                   |
| `pin_checkpoint`      | Pin a checkpoint with a durable name                      | `id`, `name`            | —                                   |
| `undo`                | Restore to the checkpoint before the last N steps         | —                       | `count`, `force`                    |

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
bin/           # agent-rollback.js, arb.js (short alias; arb = agent-rollback)
src/           # cli.js, snapshot.js, runner.js, mcp.js, hooks.js, ...
skills/        # SKILL.md shipped to npm consumers
test/          # *.test.js — node --test
scripts/       # install.sh — one-click installer
```

Conventions are documented in [`AGENTS.md`](./AGENTS.md).

## FAQ — Codex undo, revert, and rollback

### How do I undo a Codex change?

The fastest path:

```bash
agent-rollback list                      # find the checkpoint taken before the bad edit
agent-rollback revert cp-<id> --yes      # restore the workspace to that checkpoint
```

If you have hooks installed (`agent-rollback init codex`), Codex auto-snapshots
before every prompt and tool use, so there's always a checkpoint to roll back
to. If you don't, create one manually before risky work:

```bash
agent-rollback checkpoint "before refactor"
agent-rollback run codex "refactor the auth module"
agent-rollback revert cp-before-refactor-ed96 --yes
```

### How do I revert just one bad Codex operation, not the whole workspace?

Use the **operation log**. Every `revert` records which files it touched;
`op revert <op-id>` undoes that exact operation and leaves later unrelated
edits alone.

```bash
agent-rollback log                                  # list recent operations
agent-rollback op revert op-20260609-abcdef --dry-run  # preview
agent-rollback op revert op-20260609-abcdef --yes      # apply
```

Applied operation reverts create a safety checkpoint first, so it's always
undoable.

### How do I undo the last Codex edit (or the last N edits)?

```bash
agent-rollback undo 1 --yes   # undo the most recent checkpoint
agent-rollback undo 3 --yes   # undo the last 3
```

`undo` walks the most recent checkpoints and reverts them in reverse order,
with a safety checkpoint created automatically.

### How do I diff what Codex changed?

```bash
agent-rollback diff cp-before cp-after           # changed paths + summary
agent-rollback diff cp-before cp-after --patch   # full unified diff
```

You can also `cd` into a project, run `agent-rollback tui`, and use
`diff <n>` from inside the browser to see a diff preview for any checkpoint.

### How do I add a safety net so every Codex run is auto-rolled-back-able?

Install the Codex hooks once per repo:

```bash
agent-rollback init codex
```

Then run `/hooks` inside Codex and trust the generated repo-local hooks.
From then on, every session start, user prompt, before-tool-use, and
after-tool-use event creates a deduped auto-checkpoint. You'll never lose
work to a bad Codex edit again.

If you can't install hooks, wrap the run:

```bash
agent-rollback run --event-stream codex "your prompt here"
```

This adds Codex's `--json` flag and creates deduped fallback checkpoints
from tool-like JSONL events in the output.

### Does it work with Claude Code, Cursor, Windsurf, Copilot, Cline, Gemini CLI?

Yes. The `agent-rollback` CLI works anywhere. The agent-side integration is
provided by the SKILL.md, installable globally for 18+ agents:

```bash
npx skills add Nainish-Rai/agent-rollback --skill agent-rollback -g -y
```

The MCP server is officially documented for Codex CLI and any MCP-compatible
agent (Claude Code, Cursor, etc.). For other agents, the CLI is the
universal fallback.

### How is this different from `git stash`, `git restore`, or `git reset`?

|                       | `git`                       | `agent-rollback`                                            |
| --------------------- | --------------------------- | ----------------------------------------------------------- |
| Needs a Git repo      | Yes                         | No — works in any directory                                 |
| Tracks Codex prompts  | No                          | Yes — auto-checkpoints on every prompt / tool use           |
| Operation-level undo  | No                          | Yes — `op revert` rolls back exactly the files a bad op touched |
| Content-addressed     | No (full-tree blobs)        | Yes — identical files share one blob, ~zero disk           |
| AI-agent integration  | None                        | MCP server + Codex hooks + SKILL.md                         |
| Selectable by agent   | No                          | Yes — agent can call `create_checkpoint`, `restore_checkpoint`, etc. |

Use `agent-rollback` when working with AI agents that edit files outside
your normal Git flow, or when you want a one-command safety net without
remembering `git reflog` incantations.

### Is my data sent anywhere?

No. Everything lives in `.agent-rollback/` inside your project (or wherever
`--store` points). There's no telemetry, no cloud sync, no analytics. The
CLI and MCP server are 100% local.

### How do I uninstall?

```bash
# global binary + Codex MCP config
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --uninstall

# or just the binary
npm uninstall -g agent-rollback

# remove the agent skill
npx skills remove agent-rollback -g -y
```

The store directory (`.agent-rollback/`) is yours to keep or delete.

### Why is the short alias `arb` and not `ar`?

Because `ar` is already taken on every Unix system. The BSD/GNU `ar`
archive tool lives at `/usr/bin/ar` on macOS and Linux, and on any shell
where `/usr/bin` is searched before npm's global bin, our old short alias
got shadowed — `ar --help` would print the archive tool's usage instead
of ours.

`arb` is the same 3-letter feel, doesn't collide with anything, and the
installer detects the shadow and prints a one-line note if you happen to
be in a shell where the system `ar` would win.

If you've been using `ar` from a previous install, run a quick check:

```bash
type ar    # should report /usr/bin/ar (the system archive tool)
type arb   # should report /Users/<you>/.nvm/.../bin/arb (our binary)
```

If you want a one-letter-ish alias of your own, drop this in your
`~/.zshrc` or `~/.bashrc`:

```bash
alias rbk='agent-rollback'   # or 'arb' if you prefer
```

### I upgraded from a previous version and `ar` no longer works — what now?

The 0.2.0 release renamed the short alias from `ar` to `arb` to fix the
system-tool shadow. Just use `arb` (or the full `agent-rollback`) from
now on. If you have old muscle memory for `ar`, see the alias snippet
above. The full `agent-rollback` name has always worked and continues to
work.

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
