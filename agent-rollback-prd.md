# PRD: agent-rollback — Codex-Only MVP

> **Design philosophy applied**: Every section below fights complexity by investing design effort where it's touched most (the hook hot path), hiding information aggressively, and treating non-essentials as non-essentials.

## 0. Implementation Note: Shipped MVP

The first working MVP uses the official Codex CLI automation surface:
`codex exec`. The original hook-heavy design below remains the product
direction, but public Codex docs currently document `codex exec`, sandbox flags,
and Git-repo safety checks as the stable automation path. A wrapper around
`codex exec` gives users the core rollback value today without depending on an
undocumented hook JSON contract.

Current implemented behavior:

- Snapshot workspace before a Codex run.
- Run `codex exec --sandbox workspace-write` unless the caller supplied sandbox
  flags.
- Optionally run `codex exec --json` via `run --event-stream` and checkpoint
  tool-like JSONL events.
- Snapshot workspace after the run, even when Codex exits nonzero.
- Install repo-local Codex hooks with `init codex` for session, prompt,
  pre-tool, and post-tool auto-checkpoints.
- Provide `init`, `checkpoint`, `list`, `show`, `diff`, `pin`, `unpin`,
  `prune`, `undo`, `log`, `op revert`, `replay`, `tui`, `mcp`, `revert`, and
  `run`.
- Store snapshots locally with content-addressed file blobs under
  `.agent-rollback`.
- Store operation history in `.agent-rollback/ops.jsonl`.
- Revert individual operations path-selectively while preserving unrelated later
  files and saving a safety checkpoint.
- Render unified line diffs from checkpoint objects with `diff --patch` and TUI
  diff commands.
- Garbage-collect unreferenced content objects after pruning checkpoint
  manifests.
- Expose a stdio MCP server so agents can create, list, diff, pin, dry-run
  restore, apply restore, prune, search, and undo checkpoints.

Reference docs checked on June 9, 2026:

- OpenAI Codex CLI: https://developers.openai.com/codex/cli
- OpenAI Codex non-interactive mode: https://developers.openai.com/codex/noninteractive
- OpenAI Codex best practices: https://developers.openai.com/codex/learn/best-practices
- OpenAI Codex GitHub repo: https://github.com/openai/codex
- Git restore/reset/revert docs: https://git-scm.com/docs/git-restore,
  https://git-scm.com/docs/git-reset, https://git-scm.com/docs/git-revert

---

## 1. Mission

> **A safety net for Codex CLI. Run it, get checkpoints. Break something, roll it back.**

**One-sentence positioning**: `agent-rollback` records every Codex action and lets you rewind the workspace to any previous state, perfectly.

**What success looks like (the 30-second demo)**:

```bash
$ npx agent-rollback init codex          # install hooks
$ agent-rollback run codex "refactor auth"
# Codex makes 12 file edits, 3 npm installs
$ agent-rollback list                    # show 15 checkpoints
$ agent-rollback revert cp-12            # restore workspace to start
# Workspace exactly as before. Done.
```

---

## 2. Strategic Positioning (philosophy lens)

### What we are optimizing for

**Complexity = Σ(cp × tp)**. Our hot path:

| Touchpoint | Frequency (tp) | Where we invest design effort |
|------------|----------------|------------------------------|
| Hook handler (called per Codex tool) | **Daily, dozens of times** | ⭐⭐⭐ MAX |
| `revert` command | Weekly | ⭐⭐ |
| `list`/`show` | Daily | ⭐ |
| CLI startup, install | Once | (no design effort) |

**The hook handler IS the product.** Every other command is a thin wrapper. We will spend 80% of design effort on the hook handler.

### What we are NOT optimizing for

- **Performance for large codebases** — Codex works in single workspaces; assume <50k files. chokidar handles this fine.
- **Multi-agent support** — Codex only for MVP. Adding Claude Code later requires ZERO refactor of the core.
- **Cross-platform parity in MVP** — macOS first (where 80% of AI dev happens), Linux best-effort, Windows "doesn't crash."
- **Beautiful UX** — CLI is enough. No TUI. No web UI.
- **Cloud sync, team features, RBAC** — explicitly anti-features for MVP.

### What matters vs. what doesn't

| Matters (visible, loud) | Doesn't matter (silent, default) |
|-------------------------|----------------------------------|
| **Correctness of `revert`** — must restore EXACTLY. Data loss risk. | Log formatting |
| **Hook performance** — adds 10–50ms per tool call. Add up: real cost. | Color output |
| **Storage strategy** — must be fast + space-efficient | File watching ignore patterns (chokidar defaults are fine) |
| **Conflict-free operation** — Codex may exit, we may crash, workspace may be deleted | Config file format |
| **JSON contract correctness** — Codex sends JSON; we must parse it | Plugin system |

---

## 3. Scope: Codex-Only MVP

### In scope (the product)

- Install Codex hook (`~/.codex/hooks.json`)
- Per-tool checkpoint creation (shell, apply_patch via FS watcher, MCP)
- Per-file snapshot storage
- `revert`, `list`, `show`, `diff`, `init` commands
- One-command run wrapper: `agent-rollback run codex <args>`
- Local-only storage (no cloud)
- macOS + Linux (best-effort)
- Git-aware: uses git stash as fallback, plain files otherwise

### Out of scope (anti-features)

- ❌ Claude Code adapter
- ❌ Aider, Cline, Cursor, Continue
- ❌ Network/IO tracking (eBPF)
- ❌ TUI / web UI
- ❌ Cloud sync
- ❌ Team / multi-user
- ❌ Windows native (WSL only)
- ❌ "What if" dry-run (post-MVP)
- ❌ Plain-English diff explanations (post-MVP)
- ❌ TUI / interactive browser
- ❌ Replay (re-run from checkpoint)
- ❌ A/B testing prompts
- ❌ Custom checkpoint grouping rules

**Discipline**: every "could we also..." gets cut. Ship the minimum that makes the demo work.

---

## 4. Architecture (Deep Modules Principle)

The architecture has **three layers**, each with a deep interface that hides substantial complexity:

```
┌─────────────────────────────────────────────────────────┐
│ Layer 3: CLI (thin)                                     │
│   • Commands: init, list, show, diff, revert, run       │
│   • Each command is a 30-50 line script                 │
│   • Imports core + storage; knows nothing else          │
└─────────────────────────────────────────────────────────┘
                          ↓ uses
┌─────────────────────────────────────────────────────────┐
│ Layer 2: Core (the "deep" layer — most logic here)      │
│   • Snapshotter:    files → storage, restore storage→fs │
│   • EventRouter:    tool events → checkpoint actions    │
│   • Store:          CRUD for checkpoints                │
│   • GitAdapter:     git fallback (1 method deep)        │
│   • FsWatcher:      chokidar wrapper (1 method deep)    │
│   • V4aParser:      apply_patch V4A → file ops          │
└─────────────────────────────────────────────────────────┘
                          ↓ uses
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Primitives (single-purpose, deep)              │
│   • Storage:   local disk I/O (copy, link, read, write) │
│   • Process:   spawn, pipe, env                         │
│   • Path:      resolve, normalize, check                │
└─────────────────────────────────────────────────────────┘
```

### The depth test (drawn for each module)

```
INTERFACE COMPLEXITY (width)
   ↓
   ┌────────────────────────────────────────┐
   │ Snapshotter                            │ ← 3 methods: snapshot, restore, diff
   │   • snapshot(paths) → Checkpoint       │   Hides: chokidar + COW + git + hash
   │   • restore(checkpoint) → void         │   ~600 lines impl
   │   • diff(a, b) → FileDiff[]           │
   └────────────────────────────────────────┘
   ↑ (tall = deep, lots of complexity hidden)
```

**If the interface rectangle is wider than tall, the module is shallow and must be redesigned.** We apply this test to every module.

---

## 5. The Hot Path: Hook Handler (the only thing that needs to be great)

Codex calls our hook ~10-50 times per agent run. **This code runs constantly. It must be:**

- Fast (< 50ms p99, ideally < 10ms)
- Never throws
- Always idempotent
- Always correct (no data loss)

### The Codex hook contract (what we receive)

```json
{
  "event": "PreToolUse" | "PostToolUse" | "UserPromptSubmit" | "SessionStart" | "SessionEnd",
  "tool": "shell" | "apply_patch" | "<mcp_tool>" | "...",
  "input":  { /* tool-specific */ },
  "output": { /* tool-specific, may be absent in PreToolUse */ }
}
```

### The hook handler (target: < 50 lines)

```typescript
// packages/adapters/codex/hook.ts

export async function handle(event: CodexHookEvent): Promise<HookResponse> {
  // 1. Determine action (single decision, no branching spaghetti)
  const action = routeEvent(event);

  // 2. Execute action (delegates everything to deep modules)
  await action.execute();

  // 3. Return empty success (we never block Codex)
  return { decision: 'allow' };
}
```

**Information hidden inside `routeEvent`**:

- Which tools need snapshots
- Which tools are tracked via hooks vs FS watcher
- What counts as a "checkpoint boundary"
- How to extract file paths from each tool's input format

### The five events we handle

| Event | What we do | Why |
|-------|------------|-----|
| `SessionStart` | Snapshot workspace baseline (cheap if git, full if not) | Establish the "0" point for `revert all` |
| `UserPromptSubmit` | Mark a logical checkpoint boundary | User intent = natural grouping point |
| `PreToolUse` (shell) | Snapshot files that exist + capture command | Allow diff/revert of shell effects |
| `PostToolUse` (shell) | Diff workspace, store as checkpoint | The actual delta |
| `PostToolUse` (apply_patch) | Detect via FS watcher (not hook!) + capture V4A | Hooks miss apply_patch upstream |

**Anti-feature: we don't try to handle `apply_patch` via hooks.** Codex's hook for it is unreliable ([openai/codex#16732](https://github.com/openai/codex/issues/16732)). Instead, our always-on FS watcher detects file changes after every tool call and pairs them with the hook's reported tool via timestamp correlation.

This is the **"designed it twice"** alternative: pure hooks (brittle) vs. hybrid (resilient). We chose hybrid.

---

## 6. Module APIs (concrete interfaces)

Every interface is written as a **comment-first** spec, then code. If the comment is hard to write, the design is wrong.

### Module: `Snapshotter`

```typescript
/**
 * Captures and restores workspace file state.
 *
 * Hides: storage backend (git vs COW vs flat), hash strategy,
 *        incremental vs full snapshot, debouncing.
 *
 * `snapshot()` is incremental — only files that changed since
 * the last snapshot are stored. Storage size scales with delta,
 * not with workspace size.
 *
 * `restore()` is atomic — either all files are restored or none
 * are. Partial restore is a bug, not a feature.
 *
 * `diff()` returns a structured list of {path, before, after}
 * suitable for display, VCS commit messages, or LLM summarization.
 */
interface Snapshotter {
  /**
   * Capture the current state of the given files.
   * Idempotent: calling twice with no changes returns the same checkpoint.
   */
  snapshot(paths: string[], metadata: CheckpointMeta): Promise<Checkpoint>;

  /**
   * Restore files to the state at the given checkpoint.
   * Files that didn't exist at that checkpoint are deleted.
   * Throws SnapshotCorruptError if the checkpoint is unreadable.
   */
  restore(checkpointId: string): Promise<void>;

  /**
   * Compute the file-level diff between two checkpoints.
   * Does not touch disk; pure computation.
   */
  diff(fromId: string, toId: string): Promise<FileDiff[]>;
}
```

**Depth**: 3 methods, ~600 lines of impl. ✅ Deep.

### Module: `EventRouter`

```typescript
/**
 * Decides what to do for each Codex hook event.
 *
 * Hides: which tools to track, how to group events into checkpoints,
 *        the V4A parsing, the path extraction per tool type.
 *
 * This is the ONLY module that knows about Codex's hook JSON format.
 * Everywhere else deals with our own internal `Checkpoint` type.
 */
interface EventRouter {
  /**
   * Returns the action to take for an event, or null to ignore.
   * Pure function: no I/O, no side effects.
   */
  route(event: CodexHookEvent): CheckpointAction | null;
}
```

**Information hiding**: Only this module imports `CodexHookEvent`. The CLI and core never see it. ✅

### Module: `Store`

```typescript
/**
 * Persistent storage for checkpoints and their metadata.
 *
 * Hides: SQLite schema, indexing, pruning, on-disk layout.
 *
 * Storage is append-mostly: checkpoints are written once and
 * occasionally deleted (by `prune()`). Updates are not supported
 * because they would invalidate hash references.
 */
interface Store {
  put(checkpoint: Checkpoint): Promise<void>;
  get(id: string): Promise<Checkpoint>;
  list(filter?: CheckpointFilter): Promise<Checkpoint[]>;
  prune(before: Date): Promise<number>;  // returns # deleted
}
```

**Error strategy**:

- "Checkpoint not found" → return null (not throw). Callers check.
- "Store corrupt" → throw `StoreCorruptError`. Caller decides.

This is **"define out of existence"** for the common case (not found) and **"crash"** for the unrecoverable case (corrupt).

### Module: `FsWatcher`

```typescript
/**
 * Watches a directory tree for file changes and emits events.
 *
 * Hides: chokidar/FSEvents/inotify differences, debouncing,
 *        editor atomic-write patterns (vim swap, .swp files).
 *
 * Emits one event per logical change, debounced at 100ms.
 * Editors that write-then-rename are collapsed into one event.
 */
interface FsWatcher {
  watch(root: string, onChange: (event: FsEvent) => void): Disposable;
}
```

**One method. Three events emitted. ~80 lines impl. ✅ Very deep.**

### Module: `GitAdapter`

```typescript
/**
 * Git integration for storing checkpoints as stashes.
 *
 * Hides: git CLI quirks, branch management, reflog, worktrees.
 *
 * If the workspace is not a git repo, all methods are no-ops
 * and the caller falls back to Snapshotter's file-based storage.
 */
interface GitAdapter {
  isRepo(path: string): boolean;
  stash(message: string): string | null;  // returns stash ref or null if no changes
  applyStash(ref: string): void;
  popStash(ref: string): void;
}
```

**"Designed twice" alternative considered**: libgit2 bindings. Rejected because:

- Adds Rust native dependency (we just argued against this)
- More complex install (binary download, version compat)
- git CLI is universally available, simple, well-tested

---

## 7. The 5-Question Design Audit (per module)

| Module | Deep? | Hides what? | Somewhat general? | Errors defined out? | Designed twice? |
|--------|-------|-------------|-------------------|---------------------|-----------------|
| `Snapshotter` | ✅ 3 methods, 600 lines | Storage backend, hashing, incremental vs full | ✅ Used by hook, CLI, future Claude adapter | ✅ `not found` returns null | ✅ vs libgit2 |
| `EventRouter` | ✅ 1 method, 100 lines | Codex JSON, V4A, tool-to-checkpoint mapping | ✅ Swappable per adapter (codex/claude/aider) | n/a (pure function) | ✅ vs in-line if-else |
| `Store` | ✅ 4 methods, 200 lines | SQLite, schema, indexing | ✅ Used by CLI, hook, future sync | ✅ `not found` → null | ✅ vs JSON file |
| `FsWatcher` | ✅ 1 method, 80 lines | chokidar, debounce, editor patterns | ✅ Used for any FS watching need | ✅ Cleanup is silent | ✅ vs raw chokidar |
| `GitAdapter` | ✅ 5 methods, 50 lines | git CLI, reflog, worktrees | ✅ Any git fallback need | ✅ `not a repo` → return false | ✅ vs libgit2 |

All five modules pass the audit. ✅

---

## 8. Error Strategy (Define Out, Mask, Aggregate, Crash)

| Error class | Strategy | Justification |
|-------------|----------|---------------|
| Checkpoint not found | **Define out**: return null | Common case, callers check, not exceptional |
| File unchanged between snapshots | **Define out**: skip silently | Optimization, not error |
| Workspace deleted between snapshots | **Crash loudly** | Data loss risk; user must know |
| Store DB corrupt | **Crash loudly** | Unrecoverable; silent would lose data |
| Hook JSON malformed | **Crash loudly** with clear message | Indicates Codex version mismatch; actionable |
| Snapshot storage full | **Aggregate** + **crash** | Check disk usage, suggest `prune`, then crash |
| `git stash` fails (conflict) | **Mask**: fall back to file-based snapshot | User doesn't need to know about git |
| FS watcher misses event (debounce race) | **Define out**: rely on next event | Self-healing; eventually consistent |
| Hook handler takes >100ms | **Log warning**, don't block Codex | We are a sidecar; never the bottleneck |

**Key principle**: errors that affect data integrity (workspace state, checkpoint storage) **crash loudly**. Errors that affect performance or UX **mask or define out**.

**NEVER throw exceptions for normal conditions**. Missing file, empty workspace, no git repo — these are normal, not exceptional.

---

## 9. The CLI (thin layer, 30–50 lines per command)

```typescript
// packages/cli/src/commands/revert.ts

export async function revert(id: string): Promise<void> {
  const store = new Store();
  const snap = new Snapshotter(store);
  const targetId = id === 'last' ? (await store.list()).slice(-1)[0]?.id : id;
  if (!targetId) throw new CLIError('no checkpoint to revert to');
  await snap.restore(targetId);
  console.log(`✓ restored to ${targetId}`);
}
```

That's it. The CLI knows nothing about hooks, V4A, FS events. It just orchestrates `Store` + `Snapshotter`. **If the CLI gets complex, that's a sign the core API is wrong.**

### CLI command surface (deliberately small)

```bash
agent-rollback init codex              # install Codex hook
agent-rollback run codex <args>        # wrapper that ensures hook is installed
agent-rollback list                    # list checkpoints
agent-rollback show <id>               # show what changed
agent-rollback diff <a> <b>            # diff between checkpoints
agent-rollback revert <id|last>        # restore workspace
agent-rollback prune --older-than 30d  # cleanup
```

**That's 7 commands.** Anything more is a sign we're over-scoping. The "right" number of commands for a tool is the minimum that supports the demo.

---

## 10. Storage Layout (information hiding in the filesystem)

```
~/.agent-rollback/
├── store.db              # SQLite: checkpoint metadata
├── snapshots/            # Per-file content (content-addressed)
│   ├── ab/               # First 2 chars of sha256
│   │   └── c3/.../ab3f   # Full hash
│   └── ...
└── git/                  # Git stash backups (when applicable)
    └── stash@{0}.patch
```

**Information hidden**:

- File hashing strategy (callers just say "snapshot these paths")
- Storage format (callers don't see files)
- Deduplication (same content stored once, referenced many times)

**Why content-addressed**: identical files across checkpoints share storage. 12 edits to one file = 1 copy in the store, not 12.

---

## 11. What "Deep" Means Visually (the depth diagram)

```
                Snapshotter interface
                ───────────────────
                snapshot(paths, meta)
                restore(id)
                diff(a, b)

              ┌──────────────────────────┐
              │                          │
              │   • chokidar (200 lines) │
              │   • content-hash (50)    │
              │   • COW cp -c (30)       │
              │   • git stash (100)      │
              │   • incremental diff     │
              │   • debounce + coalesce  │
              │   • dedup by hash        │
              │   • atomic restore       │
              │   • error recovery       │
              │                          │
              └──────────────────────────┘
              ~600 lines, 3-method interface
```

The interface is **3 methods** wide. The implementation is **~600 lines, ~10 distinct concerns** tall. **Deep.** ✅

Compare to a shallow alternative:

```typescript
// SHALLOW — DO NOT DO THIS
class SnapshotManager {
  startWatching(path): void
  stopWatching(): void
  captureFile(path): void
  captureDirectory(path): void
  hashFile(path): string
  compareHashes(a, b): boolean
  copyFile(src, dest): void
  removeFile(path): void
  // ... 20 more methods
}
```

This is what you write when you don't have a deep design. The interface exposes every implementation detail. **Never write this.**

---

## 12. The Test Plan (validates DESIGN, not just behavior)

Per Ousterhout: tests should validate design, not just behavior. We write tests for the **invariants** of each module:

```typescript
// Test: Snapshotter invariants
test('snapshot is idempotent — same input → same output hash', ...);
test('restore is atomic — never leaves half-restored state', ...);
test('storage is content-addressed — same content shares storage', ...);
test('deleted-then-restored files have their content preserved', ...);

// Test: EventRouter invariants
test('route is a pure function — no I/O, no side effects', ...);
test('unknown event types return null (not error)', ...);
test('every Codex tool type has a defined routing rule', ...);

// Test: CLI command invariants
test('each command is < 100 lines (shallow CLI = good)', ...);
test('CLI never imports Codex-specific types', ...);

// Test: Integration scenarios
test('Codex makes 3 file edits → 3 checkpoints → revert cp-2 restores exactly', ...);
test('Codex deletes a file → snapshot preserves content → revert restores it', ...);
test('Codex runs rm -rf node_modules → git stash captures → revert is fast', ...);
test('Crash mid-snapshot → next session detects partial and recovers', ...);
test('Workspace is git repo → snapshots use git stash', ...);
test('Workspace is not git repo → snapshots use file-based storage', ...);
```

**Test count target**: ~30 tests for MVP. Enough to catch the design mistakes; not so many that we're testing implementation.

---

## 13. The "Decide What Matters" Trade-off Table

| Decision | What matters (do the work) | What doesn't (default) |
|----------|----------------------------|------------------------|
| **Storage backend** | Correct atomic restore (data loss risk) | Which DB engine (SQLite is fine) |
| **Hook performance** | p99 < 50ms (hot path) | Cold start time |
| **Snapshot strategy** | O(changed files), not O(workspace) | In-memory caching |
| **V4A parsing** | Correctness on edge cases (context anchors) | Speed of parse |
| **CLI UX** | `revert last` works without remembering IDs | Color output, progress bars |
| **Error messages** | "Workspace state may be lost, run `arb doctor`" | Stack traces in production |
| **Cross-platform** | macOS first, Linux best-effort, Windows "doesn't crash" | Pixel-perfect UI everywhere |
| **Dependencies** | chokidar, simple-git, better-sqlite3, commander, zod, globby | tsup, vite, esbuild, prettier (use defaults) |

---

## 14. Ship Criteria (when is MVP done?)

The MVP is done when **all five of these work, in this order of priority**:

1. ✅ `npx agent-rollback init codex` writes `~/.codex/hooks.json` correctly
2. ✅ Running Codex under `agent-rollback run` creates checkpoints on every tool call
3. ✅ `agent-rollback list` shows the checkpoints in order
4. ✅ `agent-rollback revert last` restores the workspace to clean state
5. ✅ The 30-second demo works without crashing

**Anything else is a "nice to have"** for MVP. If it doesn't make the demo better, cut it.

---

## 15. Open Questions (designed twice — alternatives I considered)

### Q1: Hooks-only vs. hybrid (hooks + FS watcher)?

| Approach | Pro | Con |
|----------|-----|-----|
| **Hooks only** | Simple, fast | Misses `apply_patch`, MCP tools (openai/codex#16732) |
| **Hybrid (chosen)** | Full coverage | Two paths, more code |
| **JSONL tail only** | Source of truth | Too late — damage already done |
| **Wrap Codex source** | Complete coverage | Fragile, breaks every Codex release |

**Chose hybrid.** Hooks for shell + MCP. FS watcher for apply_patch + safety net.

### Q2: SQLite vs. JSON file for store?

| Approach | Pro | Con |
|----------|-----|-----|
| **SQLite (chosen)** | Indexed queries, atomic writes, zero-config | Native binding |
| **JSON file** | Pure JS, no native | Slower, no indexing, race conditions |
| **NDJSON (append-only)** | Crash-safe, simple | Slow queries as it grows |

**Chose SQLite via `better-sqlite3`**. Synchronous API = no async overhead in the hot path.

### Q3: One package or monorepo?

| Approach | Pro | Con |
|----------|-----|-----|
| **Monorepo (chosen)** | Clean module boundaries, future SDK extraction | Slightly more setup |
| **Single package** | Simpler | Hard to extract SDK later |

**Chose monorepo with pnpm workspaces.** Modules are clean; SDK is just re-exporting `core`.

### Q4: Sync or async API?

| Approach | Pro | Con |
|----------|-----|-----|
| **Sync (chosen)** | Simpler reasoning, no event loop overhead | Blocks event loop (mitigated: hot path is small) |
| **Async** | Non-blocking | More complex, can lead to "fire and forget" bugs |

**Chose sync** for the hot path (`Snapshotter` operations). Async only for CLI command orchestration where it doesn't matter.

### Q5: Ship as npm or as binary?

| Approach | Pro | Con |
|----------|-----|-----|
| **npm (chosen)** | One command, works for everyone, easy install | Requires Node.js |
| **Binary** | No runtime needed | More build complexity |

**Chose npm** via `npx` (no install needed for first try) and `npm i -g` (for permanent).

---

## 16. What's NOT in the PRD (deliberate cuts)

| Cut | Why |
|-----|-----|
| TUI / Ink interface | CLI is sufficient for the demo |
| "What if" dry-run | Post-MVP, adds significant complexity to route events |
| Plain-English diff (LLM) | Post-MVP, requires API key management |
| Replay (re-run from checkpoint) | Different product (an agent debugger, not a rollback tool) |
| Cross-session checkpoint sharing | Local-only is the contract |
| Cloud sync | Local-first; sync adds auth, billing, GDPR concerns |
| Aider/Cline adapters | They don't have hooks; requires different design |
| Performance benchmarks | "Fast enough" = <50ms p99. Benchmarking is over-engineering. |
| TypeScript strict mode beyond `strict: true` | Diminishing returns; not where complexity lives |
| Custom config file format | Use TOML, defaults, computed values — no `arb.toml` |
| Plugin system | The 4 modules ARE the plugin points. No need for more. |

---

## 17. The "When to Stop" Signal

Stop designing when:

- ✅ The 5-second demo works in your head
- ✅ Every module passes the depth test (interface width < implementation height)
- ✅ No information is leaked across module boundaries
- ✅ The hot path is fast enough to add to the cold path's complexity
- ✅ You've considered one alternative and rejected it for clear reasons

Start coding.

---

## 18. First 7 Days (concrete)

| Day | Deliverable | Module |
|-----|-------------|--------|
| 1 | Repo scaffold, pnpm workspaces, tsconfig | (setup) |
| 2 | `Store` (SQLite, 4 methods, ~200 lines) | core |
| 3 | `Snapshotter` (incremental, content-addressed) | core |
| 4 | `FsWatcher` + `EventRouter` for shell | core + codex adapter |
| 5 | `init codex` (writes hooks.json) + `hook` endpoint | cli + codex adapter |
| 6 | `list`, `show`, `revert` CLI commands | cli |
| 7 | Manual e2e test with real Codex + README | (integration) |

By end of week 1: working `init` + `run` + `revert` on macOS.
By end of week 2: polish, edge cases, Show HN draft.

---

## 19. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Codex changes hook JSON schema | Med | High (breaks install) | Pin Codex version in test; document version requirement |
| `apply_patch` race condition (FS watcher misses) | Med | High (lost checkpoint) | Combine FS watcher with hash-based reconciliation post-tool |
| Snapshot storage grows unbounded | High | Med | Auto-prune: keep last 50 checkpoints + all labeled ones |
| `revert` partially fails (disk full mid-restore) | Low | **CRITICAL** (data loss) | Write restore plan first, then atomic move; verify after |
| Hook handler adds noticeable latency | Med | Med (UX) | Profile p99; budget < 50ms; warn if exceeded |
| User confused about what got snapshotted | Med | Low | `list` shows clear "files affected" column |

---

## 20. Resume Bullet This Generates

> **Built `agent-rollback` MVP** — npm-installable safety net for OpenAI Codex CLI. Wraps `codex exec` with before/after workspace checkpoints, stores file contents in a local content-addressed object store, and supports `list`, `show`, `diff`, and `revert` commands for Git-like rollback. Verified with Node integration tests that mutate and restore temporary workspaces.

---

## Appendix A: Anti-Patterns This PRD Explicitly Avoids

| Anti-pattern | What we did instead |
|--------------|---------------------|
| **Classitis**: `FileHasher`, `PathResolver`, `StorageBackend`, `EventEmitterWrapper` | Single `Store` class with 4 deep methods |
| **Pass-through methods**: `getCheckpoint(id)` → `store.get(id)` | CLI calls `Store` directly; no wrapper layer |
| **Temporal decomposition**: `Watcher` → `Detector` → `Recorder` → `Persister` | Single `EventRouter` + `Snapshotter` |
| **Vague names**: `Manager`, `Handler`, `Processor`, `Helper` | `Snapshotter`, `EventRouter`, `Store`, `FsWatcher` — names create mental images |
| **Configuration exposure**: `arb.toml` with 20 options | Zero config; everything computed; CLI flags for the 2 things users need |
| **Special cases**: `if tool === 'shell'` everywhere | `EventRouter` maps tool → strategy in one place |

---

## Appendix B: The "Why This Design" One-Pager

**Three sentences**:

1. **The hook handler is the product** — it's called dozens of times per agent run, so all design effort goes there.
2. **Three deep modules hide everything** — `Snapshotter` (state), `EventRouter` (intent), `Store` (persistence); each has a 1–4 method interface hiding 100–600 lines of impl.
3. **Everything else is thin** — CLI commands are < 50 lines each, adapters are minimal glue, no plugin system, no config file, no TUI.

**Read this PRD and ask**: could I cut any of the 5 design questions, the 3 deep modules, the 7 CLI commands? If yes, cut. If no, ship.

---

**Next steps**: Want me to write the `Store` module as the first code commit (smallest, no dependencies), then the `Snapshotter` module, generate failing tests first, or build the `init codex` flow end-to-end?
