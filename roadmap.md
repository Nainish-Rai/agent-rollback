# agent-rollback — Feature Roadmap

> Generated from 5 deep-research reports (HackerNews, Reddit, OpenAI Codex docs,
> OpenAI Codex GitHub, Aider docs, jj docs, Cline docs, Cursor docs, Claude Code
> docs, MCP spec, NPM library trends, etc.). Research files live in
> `/tmp/agent-rollback-research/` for raw evidence.

**TL;DR**: The MVP is right to wrap `codex exec` with before/after snapshots,
but the next unlock is **hooks-based auto-snapshots** + **hybrid
auto/manual** + **an interactive TUI** + **MCP server mode**. Every major
competitor (Cursor, Cline, Claude Code, Aider) is moving toward automatic,
frequent, fine-grained checkpoints; the winning CLI tool will combine
deterministic pre-mutation hooks, user-pinnable milestones, and an
agent-callable MCP surface so Codex can roll itself back during a long task.

## Implementation Status — June 9, 2026

Implemented first-pass roadmap coverage:

- **P1 Auto + Hybrid**: `init codex` installs repo-local hooks; hook handler
  snapshots `SessionStart`, `UserPromptSubmit`, `PreToolUse`, and `PostToolUse`;
  dedup skips unchanged states; `pin`, `unpin`, `prune`, `undo`, and `--json`
  are implemented.
- **P2 Interactive CLI/TUI**: `tui` renders a terminal checkpoint browser with
  query filtering, interactive commands, `--no-input`, and JSON mode. This is a
  lightweight terminal browser, not a full-screen Ink implementation.
- **P3 MCP server**: `mcp` starts a stdio MCP server with 9 tools, 2 resource
  templates, and 2 prompts. Restore tools default to dry-run and require force
  for mutation.
- **P4 Operation log + replay**: checkpoint creation/restores append to
  `ops.jsonl`; `log`, `op revert`, and `replay` are implemented; hook
  checkpoints capture a bounded Codex transcript tail when `transcript_path` is
  provided.
- **Selective operation revert**: `op revert` now reverts only paths touched by
  the operation, preserves unrelated later files, saves a safety checkpoint, and
  requires `--force` for conflicts.
- **Unified diff previews**: `diff --patch` and interactive `tui` diff commands
  show line-level unified diffs from checkpoint objects.
- **Storage retention**: `prune` runs object garbage collection after deleting
  checkpoint manifests.
- **Codex JSON fallback**: `run --event-stream` and `replay --event-stream`
  add Codex's `--json` flag and create deduped checkpoints from tool-like JSONL
  events.

Future UI polish:

- Replace the lightweight terminal browser with full-screen Ink/fzf/delta UI.

---

## 0. Where the MVP sits today

| Strength | Weakness vs. competitors |
|---|---|
| CLI-first (works for Codex, Claude Code, Aider) | Manual-only; no per-tool-call auto |
| Explicit `diff` and `prune` | No TUI; only plain text output |
| `run codex <args>` wrapper | No MCP server (agent can't trigger rollback) |
| Local content-addressed store | No checkpoint naming / pinning / labels |
| Git-aware (uses `git ls-files`) | No conversation capture (no `/rewind` equivalent) |

---

## 1. Six integration surfaces Codex exposes (use them all)

| Surface | Stable? | How agent-rollback should use it |
|---|---|---|
| **hooks.json** | Yes (documented, JSON-Schema typed) | Install `session-start` + `before/after-tool-call` hooks for deterministic auto-snapshots |
| **codex exec --sandbox** | Yes | Default wrap with `--sandbox workspace-write`; warn loudly if user passes `--dangerously-bypass-approvals-and-sandbox` |
| **codex exec --json** | Yes (event stream) | Parse `tool_call` events as a hooks-independent fallback |
| **config.toml** (`~/.codex/config.toml`, `.codex/config.toml`) | Yes | Add `[checkpoint]` section with `enabled`, `backend`, `auto_snapshot`, `max_snapshots`, `snapshot_dir`, `rollback_guarantee` |
| **AGENTS.md** | Yes (open spec, 60k+ projects) | Read a `## Safety` section; let teams commit policy in repo |
| **Environment variables** (`CODEX_HOME`, `CODEX_DEBUG`, etc.) | Yes | Add `CODEX_CHECKPOINT_DIR`, `CODEX_CHECKPOINT_AUTO` |
| **MCP servers** (`[mcp_servers]` in config.toml) | Yes | Ship an MCP server so Codex can call `create_checkpoint` / `restore_checkpoint` mid-task |
| **Session JSONL files** (`$CODEX_HOME/sessions/`) | Yes | Read after the fact to label checkpoints with the prompt that created them |

Sources: `developers.openai.com/codex/cli`, `developers.openai.com/codex/noninteractive`, `openai/codex` issues #17501, #16732.

---

## 2. Auto vs Manual vs Hybrid — the winning pattern

Across Aider, Cursor, Cline, Claude Code, jj, undo-mcp, and HN/Reddit opinions:

- **Fully automatic dominates** (Cursor, Cline, Claude Code all default to per-tool or per-turn checkpoints). Users hate having to remember to commit.
- **Pure manual loses** — Aider's `/undo` works because Aider auto-commits; without the auto layer, manual discipline is rare.
- **The winning pattern is hybrid**: auto-checkpoint every tool call + let users **pin** a checkpoint with a name + auto-expire unpinned after a retention window + dedup unchanged states.
- **No tool supports user-named milestones natively** (research finding) — this is an open gap and a clean differentiator for agent-rollback.
- **Cursor checkpoints are session-scoped and ephemeral** (auto-cleaned on session end). Cline uses shadow git and pays a "significant storage" cost in big repos. Claude Code stores under `~/.claude/file-history/{sessionId}/`.
- **jj's operation log** is the only system that supports **non-linear selective undo** — `jj op revert <id>` reverts a specific past operation without undoing everything after. This is the most powerful model for "agent did 12 things, undo only the 3rd one."

**Concrete UX for the hybrid mode** (drafted from research):

```bash
# Default: every tool call → auto-checkpoint (cheap, dedup, expire after 7d)
$ agent-rollback run codex "refactor auth"
✓ Session cp-s-001 started
✓ Auto-checkpoint cp-001 (after shell: npm test)
✓ Auto-checkpoint cp-002 (after apply_patch: src/auth.ts)
# User realizes the 3rd edit was wrong, but wants to keep #1 and #2
$ agent-rollback pin cp-001 "keep these"

# Now the user can:
$ agent-rollback revert cp-002      # unpin → auto-expires, but workspace rewinds
$ agent-rollback undo               # alias for revert --last
$ agent-rollback undo 3             # alias for revert --count 3
$ agent-rollback log                # operation log (jj-style)
$ agent-rollback op revert op-0042  # selective revert
```

---

## 3. Interactive CLI / TUI — recommended stack

| Concern | Library | Why |
|---|---|---|
| Subcommand parsing | **Commander.js** (already in) | Most adopted; you already use it |
| Single-shot prompts (y/N, "name this checkpoint?") | **@clack/prompts** | 8,256 npm dependents; opinionated intro→prompt→outro flow; `isCancel()` built-in |
| Full-screen TUI (browser, diff viewer) | **Ink** | React reconciler + Yoga Flexbox; `useInput` hook; **screen-reader render path** via ARIA-like roles |
| Fuzzy-find checkpoint selector | **fzf** pattern (split list + preview) | Canonical; use child-process to system fzf or build with Ink |
| Side-by-side diff | Custom Ink + **`highlight.js`** or shell out to `delta` | Delta is the gold standard; cli's `--pager delta` is fine |
| Progress / multi-step tasks | **listr2** | Per-task spinners, concurrent vs serial, verbose renderer for CI |
| Spinner (single op) | **ora** | Minimal API, silent mode |
| Colors | **chalk** | 35M+ weekly downloads, NO_COLOR + FORCE_COLOR levels 0-3 support |
| Argument parsing for single commands | **meow** | Lighter than commander if needed |
| Accessibility | Ink's `internal_accessibility` property | Only Node TUI lib with screen-reader path |

**Six flows every rollback tool needs** (all from research):

1. **Fuzzy-find checkpoint selector** (left = list, right = live preview of diff)
2. **Side-by-side / unified diff viewer** (paging, syntax highlight, line numbers)
3. **Confirm-before-revert with impact summary** (3 files modified, 1 created, 0 deleted, +50/-12)
4. **listr2 progress during long restore** (validate → diff → restore → verify)
5. **Keyboard-driven power-user shortcuts** (vim-style hjkl, magit's `?` transient for help)
6. **Color/no-color + accessibility** (NO_COLOR, FORCE_COLOR levels, TERM=dumb, screen reader)

**Dual-mode dispatch** (per research recommendation): every interactive command also has a `--json` and a `--no-input` flag so it works in CI and for agents.

---

## 4. MCP server — YES, ship one (and it's cheap)

**Verdict**: Build the MCP server. It unlocks a unique capability that no competitor has cleanly solved — **the agent can call its own rollback mid-task** without the user intervening.

### Tool surface (proposed)

| Tool | Description | Input schema (Zod) |
|---|---|---|
| `create_checkpoint` | Snapshot the current workspace | `{ name?: string, message?: string, paths?: string[] }` |
| `list_checkpoints` | List checkpoints, newest first | `{ limit?: number, since?: string, query?: string }` |
| `show_checkpoint` | Show manifest + per-file diff stats | `{ id: string }` |
| `diff_checkpoints` | Structured diff between two checkpoints | `{ from: string, to: string }` |
| `restore_checkpoint` | Restore workspace to a checkpoint (dry-run by default) | `{ id: string, mode: 'dry-run'\|'apply', force?: boolean }` |
| `prune_checkpoints` | Delete old or unpinned checkpoints | `{ olderThan?: string, keepPinned?: boolean, dryRun?: boolean }` |
| `search_checkpoints` | Fuzzy find by name / message / path | `{ query: string }` |
| `pin_checkpoint` | Convert ephemeral auto-checkpoint to persistent | `{ id: string, name: string }` |
| `undo` | Revert the last N operations (jj-style) | `{ count?: number }` |

### Optional MCP resources

- `checkpoint://<id>` → manifest JSON
- `checkpoint://<id>/diff` → unified diff text

### Optional MCP prompts

- `emergency-rollback` — "Restore the workspace to a known good state and explain what you changed"
- `safe-experiment` — "Create a checkpoint, do X, and if anything looks wrong, restore and tell the user"

### TypeScript skeleton (from research, ~30 lines)

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "agent-rollback", version: "1.0.0" });

server.tool(
  "create_checkpoint",
  "Create a checkpoint of the current workspace. Call BEFORE risky operations.",
  { name: z.string().optional(), message: z.string().optional() },
  async ({ name, message }) => { /* delegate to core Snapshotter */ }
);

// ... list_checkpoints, restore_checkpoint, etc.

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Architecture (shared core, two surfaces)

```
        ┌─────────────────────┐
        │   core (Snapshotter,│
        │   Store, EventRouter)│
        └──────────┬──────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   ┌────▼─────┐         ┌─────▼──────┐
   │   CLI    │         │ MCP server │
   │ (human)  │         │  (agent)   │
   └──────────┘         └────────────┘
```

This is exactly the pattern `codex-mcp-server` already uses for wrapping Codex itself — proven to compose.

### Caveats

- **stdio transport only** for v1 (local file system, no network).
- **Every restore is dry-run by default** — agent must pass `mode: 'apply'` and `force: true`. Codex's existing approval flow gates the apply.
- **Elicitation** (MCP primitive) is a clean fit: server can ask the user "this restore will delete 4 files. Continue?" via the client.

---

## 5. Other gaps worth closing (prioritized)

### High value (differentiation)

1. **Operation log (jj-style)** — record every tool call as an op; enable selective `op revert` so users can undo one bad decision out of many. **(No competitor does this in the agent-rollback space.)**
2. **Conversation capture (Claude Code /rewind tier)** — store the agent prompt + tool I/O alongside each checkpoint so a `restore` also rewinds context. Codex's session JSONL is a natural source.
3. **Pin/label + retention** — `pin cp-001 "working state"`, `prune --older-than 7d --keep-pinned`.
4. **Replay** — re-run a past Codex session from a checkpoint. Useful for "agent did the right thing 2 days ago, can it do that again?"
5. **`undo` alias** for `revert --last` and `undo N` for the last N operations.
6. **Storage backend selection** — git (default for git repos), git-stash (cheap for big repos), copy-tree (no git), btrfs/zfs COW (when on btrfs root).
7. **Search** — `find "auth"` matches checkpoint name, message, and affected paths.
8. **Sandbox-aware guarantee** — refuse `--dangerously-bypass-approvals-and-sandbox` or warn loudly; check that `rollback_guarantee` config ≤ the active sandbox scope.
9. **Deduplication by content hash** — already content-addressed; extend to dedup consecutive identical states.
10. **Stat mode** — `agent-rollback list --stat` shows storage growth, retention hit-rate, prune candidates.

### Medium value

11. **JSON output on every command** (`--json`) for agent and CI consumption.
12. **`--no-input` flag** for scripting; respects env defaults.
13. **Webhook / event emit** (e.g., on new checkpoint) for shell pipelines.
14. **Multi-agent support** — Claude Code adapter using its `/rewind` and `claude-code-sdk` API; Aider adapter reading its `aider: ` prefixed commits.
15. **Test fixtures library** — sample `codex exec` outputs (JSON streams) for offline hook testing without real Codex.

### Low value / post-MVP

16. Cloud sync, team features, RBAC, Windows native, TUI web frontend, A/B testing, custom prompt templates.

---

## 6. Library choices (new deps to add)

All zero-cost, all stable, all used by the research-recommended leaders:

| Package | Reason | Approx size |
|---|---|---|
| `ink` + `react` | Full TUI | ~1MB |
| `@clack/prompts` | Sequential prompts | ~50KB |
| `listr2` | Multi-step progress | ~80KB |
| `ora` | Spinners | ~30KB |
| `chalk` | Colors (NO_COLOR / FORCE_COLOR) | ~100KB |
| `fuse.js` | Fuzzy search (if not shelling out to fzf) | ~25KB |
| `highlight.js` | Syntax highlight in diff viewer | ~500KB (tree-shakeable) |
| `@modelcontextprotocol/sdk` | MCP server | ~200KB |
| `zod` | Schema validation (likely already needed for MCP) | ~150KB |
| `ink-select-input` + `ink-text-input` | Form components inside Ink | ~30KB |

All run on Node ≥20 (your engines field is already `>=20`).

---

## 7. Suggested 4-phase roadmap

| Phase | Scope | Effort | Outcome |
|---|---|---|---|
| **P0 — MVP** ✅ | before/after `codex exec`, 7 commands, content-addressed store | done | Shipped |
| **P1 — Auto + Hybrid** | Codex hooks.json install; auto-checkpoint on every tool call; `pin`/`unpin`; `prune --keep-pinned`; `undo`/`undo N`; `--json` everywhere | 2-3 wks | Matches Cursor/Cline baseline |
| **P2 — Interactive TUI** | Ink + clack; `agent-rollback tui` opens fuzzy checkpoint browser with diff preview; `revert --interactive` for impact summary; side-by-side diff; NO_COLOR + a11y | 2-3 wks | Matches lazygit / jj-tui polish |
| **P3 — MCP server** | `@modelcontextprotocol/sdk`; 9 tools + 2 resources + 2 prompts; shared core with CLI; ship as `npx agent-rollback mcp` for direct Codex config | 2-3 wks | Unique: agent can roll itself back |
| **P4 — Operation log + replay** | jj-style op log; selective `op revert`; conversation capture from Codex session JSONL; `replay` to re-run a past Codex session | 3-4 wks | Unique: non-linear undo + replay |

Total to v1.0: ~10-13 weeks of focused work on top of MVP.

---

## 8. Sample screen mockups (from research, ported to your tool)

### 8.1 `agent-rollback tui` (fuzzy browser)

```
+------------------------------------------------------------------+
| agent-rollback — checkpoints                       [p=pin] [q=quit]
| > cp-0012  "Added auth middleware"  2m ago   3 files +50 -12
|   cp-0011  "Fixed CORS headers"     5m ago   1 file  +3  -0
|   cp-0010  "Updated package.json"   8m ago   1 file  +2  -0
|   cp-0009  "Initial scaffolding"    12m ago  12 files +340 -0
|                                                                  |
| Filter: ____________                       src/auth.ts  | +45   |
|                                            src/cors.ts  |  +3   |
| [Tab=multi] [Enter=show] [d=diff] [r=restore]   pkg.json  |  +2   |
+------------------------------------------------------------------+
```

### 8.2 `agent-rollback revert cp-0012 --interactive`

```
+------------------------------------------------------------------+
| Restore checkpoint cp-0012 "Added auth middleware"?             |
|                                                                  |
| Impact Summary:                                                  |
|   3 files will be modified                                       |
|   1 file will be created (src/auth.ts)                           |
|   0 files will be deleted                                        |
|   +50 / -12 lines changed                                        |
|                                                                  |
| Uncommitted changes in src/cors.ts will be overwritten.         |
| Stash copy saved to: .agent-rollback/stash/cp-0012-safety.json  |
|                                                                  |
| ? Proceed with restore? (y/N)                                    |
| [d=dry-run] [v=view full diff] [a=abort]                        |
+------------------------------------------------------------------+
```

### 8.3 `agent-rollback list` (plain CLI, default)

```
ID          WHEN        MESSAGE                          FILES  +/-   PINNED
cp-0012     2m ago      Added auth middleware             3    +50 -12   ★
cp-0011     5m ago      Fixed CORS headers                1     +3  -0
cp-0010     8m ago      Updated package.json              1     +2  -0
cp-0009     12m ago     Initial scaffolding              12   +340 -0   ★
```

---

## 9. Open questions to answer before building P1

1. **Hook JSON stability** — openai/codex#16732 says `apply_patch` hook is unreliable. Do we (a) hooks + FS watcher (PRD §5 hybrid) or (b) `codex exec --json` stream consumer only?
2. **Pin storage** — pinned checkpoints are persistent; do we cap at N pinned (e.g. 50)? Or unlimited?
3. **Conversation capture** — does Codex's session JSONL include tool I/O we can replay? Or just the model transcript?
4. **MCP server naming** — `agent-rollback` (matches CLI) or `codex-rollback` (matches the integration context)? Ship both?
5. **MCP transport** — stdio only for v1, or do we also support SSE for remote Codex deployments?
6. **License + npm scope** — keep as `agent-rollback` (matches the repo) or split `agent-rollback` (CLI) + `agent-rollback-mcp` (server)?

---

## 10. References (sampled; full list in research files)

- Aider: https://aider.chat/docs/git.html, https://aider.chat/docs/usage/commands.html
- Cline checkpoints: https://docs.cline.bot/, https://roocodeinc.github.io/Roo-Code/features/checkpoints
- Cursor checkpoints: https://stevekinney.com/courses/ai-development/cursor-checkpoints, https://forum.cursor.com/t/restore-checkpoint-disappeared-in-cursor/160382
- Claude Code /rewind: https://www.getmrq.com/blog/undo-claude-code
- jj / Jujutsu: https://github.com/jj-vcs/jj, https://docs.jj-vcs.dev/latest/config
- Codex docs: https://developers.openai.com/codex/cli, /noninteractive, /learn/best-practices
- Codex GitHub issues: #17501 (json events), #16732 (apply_patch hook), #xxx (no-rollback feature request)
- MCP spec: https://modelcontextprotocol.io, https://github.com/modelcontextprotocol
- MCP servers: @modelcontextprotocol/server-filesystem, /server-git, DesktopCommanderMCP
- Libraries: Ink, @clack/prompts, listr2, ora, chalk, fzf, delta, commander.js
- HN/Reddit: "SafeSandbox — infinite undo for AI coding agents", r/LocalLLaMA undo discussions, r/ClaudeCode rewind threads

Raw reports (full evidence + source URLs):
- `/tmp/agent-rollback-research/codex-integration.md`
- `/tmp/agent-rollback-research/auto-vs-manual.md`
- `/tmp/agent-rollback-research/interactive-cli.md`
- `/tmp/agent-rollback-research/mcp-feasibility.md`
- `/tmp/agent-rollback-research/competitive-landscape.md`
