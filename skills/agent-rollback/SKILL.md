---
name: agent-rollback
description: Use the agent-rollback MCP server or `ar` CLI to snapshot the workspace, list/show/diff checkpoints, and roll back unwanted changes. Use this skill whenever the user mentions checkpoints, rollback, undo, revert, restore, "go back to", "what changed", "I broke something", "this isn't working", or asks to inspect or recover workspace state — even if they don't name the tool. Also trigger before any risky edit (refactor, mass rename, dependency upgrade, schema migration, agent-driven file changes) so a checkpoint exists if the work goes wrong. Defaults to dry-run / read-only inspection; only applies destructive operations after the user explicitly confirms.
---

# agent-rollback

Snapshot the workspace, inspect checkpoint history, and roll back unwanted changes.

Two interfaces share one store at `.agent-rollback/`:

- **MCP server** (`agent-rollback mcp`) — exposes structured tools, ideal when the agent needs checkpoint state in its own reasoning.
- **`ar` CLI** (or full `agent-rollback`) — raw shell, no LLM tokens, good for inspection and pipelines.

Pick by context. Both read and write the same checkpoint IDs.

## When to use this skill

Trigger phrases (use it if the user says any of these, even casually):

- "rollback", "roll back", "undo", "revert", "restore"
- "checkpoint", "snapshot", "save state"
- "what changed", "what did I break", "show diff", "show patch"
- "I broke something", "this isn't working", "go back to before"
- "list checkpoints", "show cp-…"
- "pin this", "prune old checkpoints", "clean up"
- "I want to try X but be able to undo it"
- "this is risky", "before I refactor", "before I run migrations"

Also trigger **proactively** before any risky edit if the user hasn't asked for rollback — create a labeled checkpoint first so a restore is possible.

## Decision tree: MCP vs `ar`

| You need to… | MCP tool | CLI form |
|---|---|---|
| Snapshot before risky work | `create_checkpoint({name})` | `ar checkpoint "label"` |
| List recent checkpoints | `list_checkpoints({limit})` | `ar list [--json]` |
| Show a checkpoint's files | `show_checkpoint({id})` | `ar show <id>` |
| Compare two checkpoints | `diff_checkpoints({from, to})` | `ar diff <from> <to> [--patch]` |
| Roll back N steps | `undo({count, force:true})` | `ar undo N --yes` |
| Restore a specific checkpoint | `restore_checkpoint({id, mode:"apply", force:true})` | `ar revert <id> --yes` |
| Mark a known-good state | `pin_checkpoint({id, name})` | `ar pin <id> "name"` |
| Clean up old checkpoints | `prune_checkpoints({keepLast, keepPinned, dryRun:false})` | `ar prune --keep-last N --keep-pinned --yes` |
| Search by label/message | `search_checkpoints({query})` | (filter `ar list --json` in shell) |
| Run Codex with checkpoints | (use the `run` subcommand) | `ar run codex "prompt"` |
| Replay Codex from a checkpoint | (use the `replay` subcommand) | `ar replay <id> --yes codex "prompt"` |
| Revert a single logged operation | (use `op revert`) | `ar op revert <op-id> --yes` |

**Default to MCP** when the result feeds back into your reasoning (decide whether to undo, summarize diffs, plan next steps).
**Default to `ar`** when the user is asking for a quick read, piping into another tool, or running inside another agent's shell.

## Safety rules

**Destructive operations require explicit user confirmation.** Workflow:

1. Identify the target checkpoint or step count.
2. Show the user the affected files (`diff_checkpoints` or `ar diff … --patch`).
3. Run a dry-run / preview if the tool supports it (`restore_checkpoint` with `mode:"dry-run"`, `prune_checkpoints` with `dryRun:true`, or `ar … --dry-run`).
4. Ask the user to confirm with the literal word "apply" or "yes".
5. Then call apply mode with `force: true` / `--yes`.

**Destructive operations that need `force: true` or `--yes`:**

| Op | MCP | CLI |
|---|---|---|
| Restore one checkpoint | `restore_checkpoint({id, mode:"apply", force:true})` | `ar revert <id> --yes` |
| Undo N steps | `undo({count, force:true})` | `ar undo N --yes` |
| Prune | `prune_checkpoints({keepLast, keepPinned, dryRun:false})` | `ar prune --keep-last N --keep-pinned --yes` |
| Op revert | `op_revert({id, force:true})` if exposed | `ar op revert <op-id> --yes` |

**Read-only operations need no confirmation:** `create_checkpoint`, `list_checkpoints`, `show_checkpoint`, `diff_checkpoints`, `search_checkpoints`, `log`, `pin_checkpoint` (pinning is reversible via `unpin_checkpoint`).

The MCP tools throw a clear `UserError` if you forget `force: true` on an apply-mode call. Don't paper over that error — go through the confirmation flow.

## Patterns

### "Before I try this risky thing"

1. Create a labeled checkpoint:
   - MCP: `create_checkpoint({name: "before refactor auth"})`
   - CLI: `ar checkpoint "before refactor auth"`
2. Do the work.
3. If it goes wrong, restore (see below).

### "Undo what I just did"

1. List recent checkpoints: `list_checkpoints({limit: 5})` or `ar list`.
2. Identify the most recent *good* checkpoint. If one is pinned, prefer it.
3. Show the user the affected files: `diff_checkpoints({from: <good>, to: latest})` or `ar diff <good> latest --patch`.
4. Ask to confirm.
5. Apply: `undo({count: <N>, force:true})` or `ar undo <N> --yes`.

### "What changed in this file since yesterday?"

1. Search by label or message: `search_checkpoints({query: "yesterday"})` or `ar log` to scan `ops.jsonl`.
2. Diff the two checkpoints: `ar diff <earlier> <later> --patch` (CLI is best for a real unified diff).

### Emergency rollback

1. `list_checkpoints({query: ""})` to see all.
2. Prefer a pinned one: `search_checkpoints({query: "known-good"})` or grep `ar list` for the "pinned" column.
3. `restore_checkpoint({id, mode:"dry-run"})` to preview the manifest.
4. Ask before applying.

### Selective op revert

`ar op revert <op-id> --yes` is path-selective — it only rewinds files touched by that operation, leaves later unrelated edits alone, and creates a safety checkpoint first. Use it when an op was wrong but later work in unrelated files should stay. Rerun with `--force` if you intentionally want to overwrite later changes.

## Hooks vs `ar run` vs MCP

- **Hooks (Path B):** `agent-rollback init codex` installs Codex lifecycle hooks (`session_start`, `user_prompt_submit`, `pre_tool_use`, `post_tool_use`) so deduped auto-checkpoints happen with zero agent involvement. Best for long sessions where you want history.
- **CLI `run`:** `ar run codex "prompt"` wraps `codex exec --sandbox workspace-write <prompt>` with explicit before/after checkpoints. Use when hooks aren't installed or not trusted yet, or for one-shot scripts.
- **MCP tools:** Best when *this agent* is doing the work and needs checkpoint state in its reasoning (e.g., "look at checkpoints, decide whether to undo, then continue").

## Storage

- Default store: `.agent-rollback/` inside the workspace.
- Override: `--store <dir>` on the CLI; `storeRoot` in the runtime passed to the MCP server.
- Contents: `checkpoints/<id>/manifest.json`, content-addressed `objects/<sha-prefix>/<sha>`, and `ops.jsonl`.
- The scanner uses `git ls-files -co --exclude-standard` in git repos, falls back to a filesystem walk. It excludes `.git`, `.agent-rollback`, `node_modules`, and standard VCS metadata.

## Don'ts

- Don't call `undo` or `restore_checkpoint` in apply mode without `force: true` — they throw on purpose so you go through confirmation.
- Don't trust checkpoint IDs across workspaces. Each workspace has its own store.
- Don't `prune` with `dryRun:false, keepLast:0` unless you really mean "delete everything unpinned."
- Don't snapshot the `.agent-rollback/` directory itself — the scanner already excludes it.
- Don't assume the user wants a checkpoint *named* something specific. If they didn't say, just snapshot with no label or a short auto-label.
- Don't silently re-checkpoint the same content. The store dedupes by content hash, so an unchanged tree won't grow the store.

## Quick reference

```bash
# Read-only
ar list
ar list --json
ar show <id>
ar diff <from> <to> --patch
ar log
ar search "label"

# Create
ar checkpoint "label"
ar run codex "prompt"
ar replay <id> --yes codex "prompt"

# Destructive (always confirm first)
ar undo --yes            # 1 step
ar undo 2 --yes          # N steps
ar revert <id> --yes
ar prune --keep-last 20 --keep-pinned --yes
ar op revert <op-id> --yes
```

```js
// MCP — read-only
list_checkpoints({ limit: 5 })
show_checkpoint({ id })
diff_checkpoints({ from, to })
search_checkpoints({ query })
create_checkpoint({ name: "before refactor" })

// MCP — apply mode (always force: true after user confirms)
restore_checkpoint({ id, mode: "apply", force: true })
undo({ count: 1, force: true })
prune_checkpoints({ keepLast: 20, keepPinned: true, dryRun: false })
pin_checkpoint({ id, name: "known-good" })
```
