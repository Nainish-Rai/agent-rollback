---
title: "How to Undo Codex Changes: A 30-Second Safety Net"
description: "Step-by-step guide to installing agent-rollback, creating your first checkpoint, and rolling back any Codex change in one command. Real terminal output. CLI fallback at every step."
target_keywords: ["how to undo codex changes", "codex safety net", "codex undo", "codex rollback"]
funnel_stage: BOFU (action-intent, ready to install)
audience: developers who have already lost work to Codex and want a one-command fix
word_count_target: 1200
last_updated: 2026-06-11
---

# How to Undo Codex Changes: A 30-Second Safety Net

> Codex doesn't have a built-in undo for multi-file runs. `git stash`
> won't help because there's nothing to stash from. Editor undo is
> per-buffer. This guide installs a **30-second safety net** — one
> command before risky work, one command to roll back, zero commits
> required.

The tool is `agent-rollback` (short alias `arb`). It is MIT, Node 20+,
and works with any agent that edits files: Codex, Claude Code, Cursor,
Copilot, Cline, and 12+ others.

## Prerequisites

- **Node.js 20+** (`node --version`)
- A Codex CLI install (any recent version)
- A throwaway repo to test on first (recommended)

```bash
node --version
# v20.x.x or higher
```

## Step 1 — Install (one line)

```bash
$ curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --all
[install] Detected macOS, arm64
[install] Node 20.11.0 OK
[install] Installing agent-rollback globally...
[install] Linking agent-rollback and arb
[install] Registering MCP server in ~/.codex/config.toml
[install] Installing agent skill for 18+ agents
[install] Done. Run 'agent-rollback --help' to verify.
```

Verify it worked:

```bash
$ agent-rollback --help
Usage: agent-rollback <command> [options]

Commands:
  init [codex]         Initialize .agent-rollback/ in the current repo (optionally install Codex hooks)
  checkpoint [label]   Create a checkpoint of the current workspace
  list                 List checkpoints, newest first
  show <id>            Show a checkpoint manifest
  diff <from> [to]     Show changed paths (and optionally a unified diff) between checkpoints
  revert <id>          Restore workspace to a checkpoint (dry-run by default)
  undo [count]         Restore to the checkpoint before the last N
  pin <id> [label]     Pin a checkpoint so it survives prune
  unpin <id>           Unpin a checkpoint
  prune                Delete old unpinned checkpoints and run GC
  log                  Show the operation log
  op revert <op-id>    Revert a single operation (path-selective)
  replay <id>          Restore to a checkpoint and re-run Codex
  tui                  Open the terminal browser
  mcp                  Start the MCP server (stdio)
  run                  Wrap a Codex invocation with before/after checkpoints
  --help, -h           Show this help
  --version, -V        Print version
```

**CLI fallback for this step:** `npm install -g agent-rollback` — same
binary, no MCP, no skill.

## Step 2 — Initialize a repo

```bash
$ mkdir demo-rollback && cd demo-rollback
$ git init
Initialized empty Git repository in /Users/you/demo-rollback/.git/

$ agent-rollback init
Initialized .agent-rollback/ in /Users/you/demo-rollback
  store: /Users/you/demo-rollback/.agent-rollback
  excludes: .git, .agent-rollback, node_modules, .hg, .svn
  scanner: git-aware with filesystem fallback
```

Add `.agent-rollback/` to your `.gitignore` (recommended):

```bash
$ echo '.agent-rollback/' >> .gitignore
```

**Codex chat equivalent:** none — `init` is a one-time setup, not
something you'd ask the agent to do.

**Optional but recommended — install Codex hooks:**

```bash
$ agent-rollback init codex
Wrote .codex/hooks.json
  SessionStart       → create deduped checkpoint
  UserPromptSubmit   → create deduped checkpoint
  PreToolUse         → create deduped checkpoint
  PostToolUse        → create deduped checkpoint
Run /hooks inside Codex and trust the repo-local hooks to enable.
```

Once trusted, every Codex prompt and tool use creates a deduped
auto-checkpoint. You never have to remember to snapshot manually
again.

## Step 3 — Create a checkpoint before risky work

Write something worth protecting:

```bash
$ cat > app.js <<'EOF'
function add(a, b) { return a + b; }
module.exports = { add };
EOF

$ agent-rollback checkpoint "baseline add"
Created cp-183544-baseline-add-ed96 (1 file, ~32 B on disk)
```

The checkpoint ID encodes the timestamp and a short hash, so it is
unique and stable.

**Codex chat equivalent:** open Codex and say:

> **You:** *"make a checkpoint called baseline add"*
> **Codex:** *"Created cp-183544-baseline-add-ed96. Say 'go back' if I make a mess."*

**CLI fallback:** `agent-rollback checkpoint "baseline add"` (same
thing the agent would do).

## Step 4 — Let Codex change things (intentionally badly)

```bash
$ cat > app.js <<'EOF'
function add(a, b) {
  // "refactored" — broke the export, added a typo
  retrun a + b
}
module.exports = { sub: (a, b) => a - b };
EOF
```

Pretend Codex did this. (You can also run the real thing:
`agent-rollback run codex "refactor app.js"` — see Step 7.)

**Codex chat equivalent:** whatever you would normally say to Codex
that touches files.

## Step 5 — Roll it back

```bash
$ agent-rollback list
  • cp-183544-baseline-add-ed96   12 sec ago   baseline add
  1 checkpoint, ~32 B on disk.

$ agent-rollback revert cp-183544-baseline-add-ed96 --force --yes
Reading manifest cp-183544-baseline-add-ed96 (1 file)
Safety checkpoint created: cp-183545-pre-revert-a1b2
Restoring workspace...
  app.js   (32 B)
Reverted to cp-183544-baseline-add-ed96. 1 file restored.

$ cat app.js
function add(a, b) { return a + b; }
module.exports = { add };
```

The original file is back. A **safety checkpoint** is automatically
created before the revert, so the revert itself is undoable in one
more command.

**Codex chat equivalent:**

> **You:** *"go back to baseline add"*
> **Codex:** *"Reverted to cp-183544-baseline-add-ed96. 1 file restored, safety checkpoint cp-183545-pre-revert-a1b2 created."*

**CLI fallback:** `agent-rollback revert <cp-id> --force --yes`.

## Step 6 — See what changed (diff)

If you want to *look* at the damage before rolling it back:

```bash
$ agent-rollback diff cp-183544-baseline-add-ed96
Changed paths vs current workspace:
  app.js   (+2, -1)
$ agent-rollback diff cp-183544-baseline-add-ed96 --patch
--- cp-183544-baseline-add-ed96/app.js
+++ current/app.js
@@ -1,2 +1,5 @@
-function add(a, b) { return a + b; }
-module.exports = { add };
+function add(a, b) {
+  // "refactored" — broke the export, added a typo
+  retrun a + b
+}
+module.exports = { sub: (a, b) => a - b };
```

**Codex chat equivalent:**

> **You:** *"what changed vs baseline add?"*
> **Codex:** *"app.js (+2, -1). The export was changed from `add` to `sub` and the function body now has a typo `retrun`. Want me to revert just that file, or roll back the whole checkpoint?"*

**CLI fallback:** `agent-rollback diff <cp-id>` or
`agent-rollback diff <cp-id> --patch` for the full unified diff.

## Step 7 — Auto-snapshot every Codex run (the `run` wrapper)

If you don't want to remember to snapshot manually, wrap Codex:

```bash
$ agent-rollback run codex "refactor app.js to use BigInt"
[arb] Creating pre-run checkpoint...
Created cp-183601-pre-run-a1b2
[codex] Refactoring app.js to use BigInt...
[codex] Done.
[arb] Creating post-run checkpoint...
Created cp-183612-post-run-c0de
2 checkpoints created, ~96 B on disk.
```

`run` creates a "before" checkpoint, runs
`codex exec --sandbox workspace-write`, and creates an "after"
checkpoint — three points of capture for every Codex invocation.

For JSONL-level tool event checkpoints (fallback when hooks are not
installed), pass `--event-stream`:

```bash
$ agent-rollback run --event-stream codex "refactor app.js to use BigInt"
```

**Codex chat equivalent:** not applicable — `run` is a CLI wrapper
around the Codex binary, used outside the chat loop.

**CLI fallback:** `agent-rollback run codex "<prompt>"` is already
the CLI; the Codex chat version of this is just talking to Codex
directly while a hook or another process is auto-snapshotting.

## Step 8 — Pin known-good checkpoints

Once you have a checkpoint you trust, pin it so it survives
`prune`:

```bash
$ agent-rollback pin cp-183544-baseline-add-ed96 "v0.1 known good"
Pinned cp-183544-baseline-add-ed96 as "v0.1 known good"
```

**Codex chat equivalent:**

> **You:** *"pin baseline add as v0.1 known good"*
> **Codex:** *"Pinned. It'll survive any prune."*

**CLI fallback:** `agent-rollback pin <cp-id> "<label>"`.

## Step 9 — Clean up old checkpoints (optional)

```bash
$ agent-rollback prune --keep-last 10 --keep-pinned --yes
Dry run: 0 unpinned, non-last-10 checkpoints found. Nothing to delete.
Pinned (1) and last 10 (2) are protected.
```

`prune` deletes unpinned, non-protected checkpoint manifests and
garbage-collects the orphaned file blobs.

**Codex chat equivalent:**

> **You:** *"prune old checkpoints but keep the last 10 and any pinned"*
> **Codex:** *"0 would be deleted. Pinned (1) and last 10 (2) are protected. Say 'go ahead' to apply."*

**CLI fallback:** `agent-rollback prune --keep-last <n> --keep-pinned --yes`.

## FAQ — how to undo codex changes

### Is there a built-in undo in Codex?

For a single in-file edit, yes — Codex's TUI shows an "Undo" button.
For a multi-file run, no. The button is also reported to stage
changes into git (see `openai/codex#5082`), which most users do not
expect. For workspace-level recovery you need an external tool.

### Will this slow down Codex?

No. The hook path adds 10–50 ms per tool call. The content-addressed
dedupe means a read-only tool use creates zero new blobs. In
practice, you will not notice it.

### What if I don't have Node 20?

`agent-rollback` requires Node 20+. If you are on an older Node, the
installer will tell you. Update Node first
(`nvm install 20 && nvm use 20`) or use the npm-only path with a
modern npm that bundles its own Node (`nvm` makes this easy).

### Can I use this with Claude Code, Cursor, or Cline?

Yes. The CLI works anywhere. The agent side is provided by a
`SKILL.md` installable for 18+ agents:

```bash
npx skills add Nainish-Rai/agent-rollback --skill agent-rollback -g -y
```

The MCP server is officially supported by Codex CLI and any
MCP-compatible agent. The CLI fallback works regardless.

### What happens if Codex is running when I revert?

`revert` takes a safety checkpoint first, then restores the files
in the snapshot. If Codex is mid-write, the partial file stays
partial for that one file. Run `agent-rollback undo 1 --yes` to
roll back the safety snapshot's view if you want to revert the
revert. The store is always consistent.

### Is this safe to run on a real repo?

Yes. The store is `.agent-rollback/` inside your project, fully
local, no telemetry, no cloud sync. The default install
recommends adding `.agent-rollback/` to `.gitignore`. The
checkpoints never touch your real git history.

### How do I uninstall?

```bash
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --uninstall
# or, for the binary only
npm uninstall -g agent-rollback
```

## Recap

```text
Install      → curl -fsSL .../install.sh | bash -s -- --all
Init         → agent-rollback init           (or: init codex for hooks)
Checkpoint   → agent-rollback checkpoint "label"
List         → agent-rollback list
Diff         → agent-rollback diff <from> [to] [--patch]
Revert       → agent-rollback revert <id> --force --yes
Undo last N  → agent-rollback undo 1 --yes
Pin          → agent-rollback pin <id> "label"
Prune        → agent-rollback prune --keep-last 10 --keep-pinned --yes
Wrap Codex   → agent-rollback run codex "prompt"
MCP server   → agent-rollback mcp
```

Or in a Codex chat, in plain English: *"make a checkpoint,"*
*"show me checkpoints,"* *"go back to the last one,"* *"what changed
vs the auth checkpoint?"*

The pre-commit window where Codex actually lives is the window
neither Git nor editor undo was designed to cover. `agent-rollback`
covers it.

- Repo: <https://github.com/Nainish-Rai/agent-rollback>
- npm: <https://www.npmjs.com/package/agent-rollback>
- 30-second start: <https://github.com/Nainish-Rai/agent-rollback#30-second-start>
