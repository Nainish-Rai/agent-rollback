---
title: "agent-rollback: A Git-like Undo Layer for Codex CLI"
description: "A snapshot layer for OpenAI Codex CLI. Roll back any Codex edit in one command. Natural-language interface, MCP server, MIT, Node 20+."
target_keywords: ["codex undo", "agent snapshot layer", "codex rollback", "codex revert"]
funnel_stage: TOFU → MOFU (definitional + how-it-works)
audience: developers using OpenAI Codex CLI for multi-file edits
word_count_target: 2000
last_updated: 2026-06-11
---

# agent-rollback: A Git-like Undo Layer for Codex CLI

> A snapshot layer for AI-edited code. Roll back any Codex change in one
> command. Natural-language interface, MCP server, Codex hooks. MIT,
> Node 20+.

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "agent-rollback",
  "alternateName": "arb",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "macOS, Linux, Windows (WSL)",
  "description": "A Git-like undo and snapshot layer for OpenAI Codex CLI. Captures content-addressed workspace snapshots, dedupes them to ~zero disk, and restores files in one command. Ships as a CLI, an MCP server, and a Codex hook.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "license": "https://opensource.org/licenses/MIT",
  "softwareVersion": "1.0.1",
  "downloadUrl": "https://www.npmjs.com/package/agent-rollback",
  "url": "https://github.com/Nainish-Rai/agent-rollback",
  "keywords": [
    "codex undo",
    "codex revert",
    "codex checkpoint",
    "codex rollback",
    "agent snapshot layer",
    "codex safety net"
  ]
}
```

## The 30-second version

You just ran Codex across a feature and three files went sideways. The
"Undo" button Codex shows you is for in-file edits, not for a multi-file
session. `git stash` won't help — there's nothing to stash from.
`git restore` works file-by-file but you have to know exactly which
files Codex touched. You are staring at a diff you didn't author and
there's no obvious way back.

**`agent-rollback` is the missing undo layer.** It is a CLI
(`agent-rollback`, short alias `arb`), an MCP server, and a Codex hook
that together give you a Git-like safety net for AI-edited code:

```bash
npm install -g agent-rollback          # install
agent-rollback init                    # one-time, per repo
agent-rollback checkpoint "green"      # take a snapshot
# ...let Codex do its thing...
agent-rollback list                    # see what changed
agent-rollback revert <cp-id> --yes    # roll back
```

Or, in a Codex chat:

> **You:** *"make a checkpoint called green and refactor the auth module"*
> **Codex:** *"Created cp-183544-green-ed96. Refactoring auth module now. If I make a mess, just say 'go back'."*

> **You:** *"go back"*
> **Codex:** *"Reverted to cp-183544-green-ed96. 4 files restored, safety checkpoint created."*

That's the whole loop. Everything below is depth.

## The user pain is real, dated, and on the record

If you have ever searched "codex undo" and found more complaints than
tools, you are not alone. Multiple high-signal threads on `r/codex` and
`openai/codex` document the gap:

- `r/codex`: *"Is there a revert/undo?"* — top-voted question from
  users who discovered Codex has no built-in way to roll back a
  multi-file run.
- `openai/codex#5082` — *"Clicking Undo on file changes should
  absolutely not be staging changes into git"*. Users expect a UI-level
  undo; the current behavior is to silently stage. This is a UX bug and
  a data-integrity risk in the same ticket.
- `openai/codex#6449` — *"Code and context rollback"*. The single most
  upvoted feature request for a workspace-wide rollback in Codex.
- `openai/codex#11626` — *"CLI: Add /rewind checkpoint restore"*. The
  CLI equivalent of Claude Code's `/rewind`. Still open.
- `openai/codex#2788` — *"History-linked checkpoints and file state
  restore"*. The canonical long-form feature request that defines what
  a Codex checkpoint should be.

Five years of Git, three years of editor undo, and Codex still ships
without a snapshot layer. `agent-rollback` fills that gap with three
small primitives: **checkpoint, diff, restore**.

## What "agent snapshot layer" actually means

An **agent snapshot layer** is a content-addressed checkpoint store
that sits *below* the agent's edits and *above* your real version
control. It has three properties that Git and editor undo do not have:

1. **It is workspace-scoped, not commit-scoped.** A checkpoint
   captures the state of the working tree as it is *right now* — files
   tracked by Git, files Git ignores, files that have never been
   committed, and files the agent created five seconds ago. You don't
   need a clean tree to take a checkpoint, and you don't need a commit
   to roll back from one.
2. **It is content-addressed and deduped.** Every file is stored as a
   SHA-256 blob. Two checkpoints that share 95% of their contents
   share 95% of their disk. A 50-checkpoint history of a 20k-file
   repo typically costs **under 5 MB**.
3. **It is agent-aware.** The store knows that checkpoint `cp-X` was
   taken before prompt *"refactor the auth module"* and checkpoint
   `cp-Y` was taken after Codex finished. The MCP server exposes that
   to any agent that can call a tool, so the same agent that broke
   things can roll them back.

Concretely, the store looks like this:

```text
.agent-rollback/
├── checkpoints/<id>/manifest.json   # paths, hashes, metadata, source
├── objects/<sha-prefix>/<sha>       # content-addressed file blobs
└── ops.jsonl                        # append-only operation log
```

`.agent-rollback/` is yours. Add it to `.gitignore` or commit it —
your call. The store never phones home.

## What it looks like in practice

### 1. Install (one line)

```bash
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --all
```

That installs the binary, the agent skill for 18+ agents, and
registers the MCP server in `~/.codex/config.toml`. If you just want
the CLI:

```bash
npm install -g agent-rollback
```

Verify:

```bash
$ agent-rollback --help
$ arb --help              # short alias, identical output
```

### 2. Initialize a repo

```bash
$ mkdir demo && cd demo && git init
$ agent-rollback init
Initialized .agent-rollback/ in /Users/you/demo
```

### 3. Create a checkpoint before risky work

```bash
$ agent-rollback checkpoint "green tests"
Created cp-183544-green-tests-ed96 (47 files, ~0.4 MB on disk)
```

### 4. Let Codex do its thing

```bash
$ agent-rollback run codex "refactor task service"
[codex] Refactoring task service...
[codex] Done. 6 files changed, all tests green.
```

`run` wraps `codex exec --sandbox workspace-write`, snapshots
**before** Codex starts, and snapshots **after** it exits. You have
two checkpoints: pre- and post-run.

### 5. List, diff, and restore

```bash
$ agent-rollback list
  • cp-183544-after-task-service-refactor-a1b2   2 sec ago    after task service refactor
  • cp-183544-green-tests-ed96                  1 min ago   green tests
  2 checkpoints, ~0.8 MB on disk.

$ agent-rollback diff cp-183544-green-tests-ed96 cp-183544-after-task-service-refactor-a1b2
  3 files changed in src/services/task/:
    src/services/task/index.js  (+42, -18)
    src/services/task/queue.js  (+12, -4)
    src/services/task/types.js (+3, -0)

$ agent-rollback revert cp-183544-green-tests-ed96 --yes
Reverted to cp-183544-green-tests-ed96. 3 files restored, safety checkpoint cp-...-safety-... created.
```

`revert` is **dry-run by default**. Pass `--force --yes` to apply. A
safety checkpoint is taken before every restore so a restore itself is
always undoable.

### 6. Or just ask the agent

If the MCP server is registered (the install script does this
automatically), you can talk to Codex in plain English:

> **You:** *"find my checkpoint about the mongodb migration"*
> **Codex:** *"Found 2: cp-153012-before-mongodb-migration-c0de (pinned), cp-153045-after-migration-b33f."*

> **You:** *"show me what changed in the auth refactor vs the green
> tests checkpoint"*
> **Codex:** *"3 files changed in src/auth/: login.js (+42, -18),
> token.js (+12, -4), index.js (+3, -0). Want me to revert just those,
> or roll back the whole checkpoint?"*

> **You:** *"pin the v0.4 release checkpoint as v0.4 release"*
> **Codex:** *"Pinned. It'll survive any prune."*

This natural-language interface is the killer feature. The agent that
broke things can be the agent that fixes them, without you leaving the
chat.

## Why not just `git`?

Git is the durable history layer. `agent-rollback` is the recovery
layer for the messy **pre-commit window** — the place where Codex
actually spends its time. The two complement each other.

|                          | `git`                                                | `agent-rollback`                                                                |
| ------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| Needs a Git repo         | Yes                                                  | No — works in any directory                                                     |
| Tracks Codex prompts     | No                                                   | Yes — auto-checkpoints on every prompt and tool use                             |
| Operation-level undo     | No                                                   | Yes — `op revert` rolls back exactly the files a bad op touched                 |
| Content-addressed        | No (full-tree blobs)                                 | Yes — identical files share one blob, ~zero disk                               |
| AI-agent integration     | None                                                 | MCP server + Codex hooks + `SKILL.md` for 18+ agents                            |
| Selectable by the agent  | No                                                   | Yes — agent calls `create_checkpoint`, `restore_checkpoint`, `undo`             |
| Lifecycle                | Commits, branches, pushes                            | Snapshots, diffs, reverts, pins, prunes                                         |

The most common reaction from people who try it for a week is: *"I
stopped using `git stash` entirely."* Stash requires something to
stash from. A checkpoint doesn't.

## The storage model in 60 seconds

- **Content-addressed**: every file blob is named by its SHA-256 hash
  at `objects/<sha.slice(0,2)>/<sha>`. Identical file contents across
  checkpoints share one blob. Cost is proportional to *changes*, not
  to *checkpoints*.
- **State-hash dedupe**: before writing a new checkpoint, the tool
  hashes the sorted list of `(path, fileIdentity)` pairs. If it
  matches the previous checkpoint's state hash, **no new manifest or
  blobs are written**. Auto-checkpointing on every Codex tool call
  stays free when the tool was read-only.
- **Append-only operation log**: every `checkpoint`, `revert`, and
  `op revert` writes one line to `ops.jsonl`. The log is
  machine-readable, audit-trail-grade, and survives manifest deletion.
- **Git-aware scanner**: when the workspace is a Git repo, the
  scanner uses `git ls-files -co --exclude-standard` and respects
  `.gitignore` and `.git/info/exclude` for free. Outside Git, it falls
  back to a filesystem walk.
- **Pinned checkpoints survive GC**: `agent-rollback pin <cp-id> "v0.4
  release"` makes a checkpoint immune to `prune`. Pruning runs object
  garbage collection afterward.

## What's *not* in scope (yet)

The current MVP is honest about what it is and is not:

- **No cloud sync.** Everything is local. There is no telemetry.
- **No full-screen TUI.** The `tui` command is a lightweight
  arrow-key terminal browser for checkpoints, not an IDE.
- **`op revert` is path-selective** and refuses to overwrite
  later edits unless you pass `--force`. That default is intentional.
- **Restore is file-content atomic per file**, not a full-workspace
  transaction. If Codex is mid-edit when you revert, the partial file
  stays partial. A safety checkpoint is always taken first, so this
  is recoverable in one more command.
- **Windows path handling** is whatever Node 20 gives you. WSL is
  fine; native Windows is best-effort.

## FAQ — codex undo and the agent snapshot layer

### How do I undo a Codex change?

The fastest path:

```bash
agent-rollback list                        # find the checkpoint before the bad edit
agent-rollback revert <cp-id> --force --yes
```

If you have hooks installed (`agent-rollback init codex`), Codex
auto-snapshots on every prompt and tool use, so there is always a
checkpoint to roll back to.

### Is this the same as Git?

No. Git is your durable history. `agent-rollback` is the recovery
layer for the **pre-commit window** where agents actually live. Use
both. Many users `agent-rollback checkpoint` before risky work and
`git commit` after the work passes review.

### Does it work with Claude Code, Cursor, Windsurf, Copilot, Cline?

Yes. The CLI works anywhere. The agent side is provided by a
`SKILL.md` installable for 18+ agents:

```bash
npx skills add Nainish-Rai/agent-rollback --skill agent-rollback -g -y
```

The MCP server is officially supported by Codex CLI and any
MCP-compatible agent.

### What happens to my data?

Nothing leaves your machine. There is no telemetry, no cloud sync, no
analytics. The store is `.agent-rollback/` in your project (or
wherever `--store` points). The CLI and MCP server are 100% local.

### How is this different from `git stash`?

`git stash` requires something to stash from — a commit, a clean
working tree, both. `agent-rollback checkpoint` works on a dirty
working tree, on untracked files, and on files the agent created.
Snapshots are content-addressed, so 50 snapshots of a 20k-file repo
typically cost under 5 MB.

### Can the agent roll itself back?

Yes. The MCP server exposes `create_checkpoint`, `list_checkpoints`,
`show_checkpoint`, `diff_checkpoints`, `restore_checkpoint`,
`prune_checkpoints`, `search_checkpoints`, `pin_checkpoint`, and
`undo`. Restore is dry-run by default and requires `mode: "apply"`
plus `force: true` to mutate files — a deliberate safety default.

### How do I uninstall?

```bash
# global binary + Codex MCP config
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --uninstall

# or just the binary
npm uninstall -g agent-rollback

# remove the agent skill
npx skills remove agent-rollback -g -y
```

## Conclusion — pick your surface

You don't have to commit to a workflow. Most people start with one
command and grow from there:

- **Just the CLI**: `npm install -g agent-rollback` — works in any
  directory, no setup, no hooks, no config. `agent-rollback
  checkpoint` before risky work, `agent-rollback revert` if things go
  sideways.
- **CLI + auto-snapshots**: add `agent-rollback init codex` to
  register the Codex hooks. Now every prompt and tool use creates a
  deduped auto-checkpoint.
- **Full agent loop**: the install script's `--all` flag adds the
  MCP server and the agent skill. Now your Codex chat can do
  checkpoints, restores, diffs, and pins by talking in plain English.

The pre-commit window where agents live is the window Git was never
designed to cover. `agent-rollback` is that coverage.

Install it, break something on purpose, restore it, and decide.

- npm: <https://www.npmjs.com/package/agent-rollback>
- Repo: <https://github.com/Nainish-Rai/agent-rollback>
- 30-second start: <https://github.com/Nainish-Rai/agent-rollback#30-second-start>
