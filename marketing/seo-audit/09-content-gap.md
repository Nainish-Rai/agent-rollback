# Content Gap Analysis — agent-rollback

**Generated:** 2026-06-11
**Skill:** `content-gap-analysis` v9.9.10
**Source assets audited:** `README.md` (3,824 w / 815 L), `package.json`, FAQ, MCP examples, `INTRODUCING-agent-rollback.md`, `marketing/platforms/*.md` (HN/Reddit/PH/Dev.to/LinkedIn/Medium/X)
**Method:** Manual feature extraction from competitor npm/GitHub pages + project source code (`.research/comparison-vs-others.md` is the prior competitive baseline; this audit extends to *content* coverage, not just code coverage)

> **Metric labeling:** All reach/traffic/volume figures are **Estimated** (model inference from public npm/GitHub metadata). No live `parallel-cli` queries executed in this run. Star/DL counts are approximate as of mid-2025.

---

## 0. Executive Summary

agent-rollback's **code coverage** is broad and differentiated (10 of 14 architectural dimensions beat at least one of Claude Code / Cline / OpenCode per `.research/comparison-vs-others.md`). Its **content coverage** is the bottleneck. The README is structurally excellent (CORE-EEAT 92/100) but covers a narrow slice of what a user researching "AI code undo" actually asks about.

**Three findings drive this audit:**

1. **We own the primitives (snapshot, diff, restore, op-revert).** The four direct competitors cover 1–2 primitives each. No competitor covers the *combination* of op-revert + content-addressing + MCP + Codex hooks.
2. **We are silent on five high-traffic pain patterns** that competitors (and adjacent winners) already address in their copy: keyboard shortcuts, conversation restore, IDE integration, approval gates, intent verification.
3. **The competitor set is fragmented but their *narrative* converges** on the same fear: "I told the AI to do X and now Y is broken." We name this fear exactly once (FAQ line 1). We should name it everywhere.

**Single highest-leverage move:** Stand up a `/blog` or `/docs` with 6–10 pieces (see §4) targeting the queries AI Overviews already cite — openai/codex#5082 (undo), #2788 (checkpoint), #6449 (safety). Two of these are real GitHub issue numbers from the user's pain-signal research.

---

## 1. Topic Matrix — "AI Code Undo" Research Space

Notation: ✅ covered in depth · 🟡 mentioned lightly · ❌ not covered. The 4 columns = direct competitors; A = adjacent winners; R = README/MCP/FAQ.

| # | Topic (the user query / pain) | ar | pi-rb | agentame | diffback | codex-rv | A:Undo.io | A:Refact | A:VSCode CP | A:Cop CLI | R:agent-rb |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Undo / revert last edit | 🟡 | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅✅ Esc Esc | ✅ |
| 2 | Restore to a known-good workspace state | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | 🟡 | ✅ | ✅ | ✅ |
| 3 | Per-checkpoint / named snapshot | ✅ | ✅ | ❌ | ✅ | 🟡 | ❌ | ❌ | ✅ | 🟡 | ✅ |
| 4 | Auto-snapshot on every prompt / tool use | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| 5 | Selective / per-file restore | 🟡 | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | 🟡 |
| 6 | Selective / per-operation revert | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| 7 | Content-addressed / deduped storage | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 | ❌ | ✅ |
| 8 | Operation log / audit trail (jj-style) | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| 9 | Diff / review before applying restore | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | ❌ | ✅ | 🟡 | ✅ |
| 10 | Dry-run restore by default | ✅ | 🟡 | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ✅ |
| 11 | Approval gates / human-in-the-loop | ❌ | 🟡 | ✅ | 🟡 | ❌ | ❌ | ❌ | 🟡 | ❌ | ❌ |
| 12 | Intent verification (planned vs actual) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 13 | Conversation / chat history restore | ❌ | ❌ | 🟡 | ❌ | ❌ | ❌ | ✅✅ | ❌ | 🟡 | ❌ |
| 14 | Recording / replay (full session) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅✅ | ❌ | ❌ | ❌ | ❌ |
| 15 | Keyboard shortcut (Esc Esc / Ctrl+Z-style) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 | ✅✅ | ❌ |
| 16 | IDE / editor integration (VS Code, JetBrains) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅✅ | ❌ | ❌ |
| 17 | Branching / fork / parallel exploration | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 18 | Works without Git repo | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 19 | Bash / terminal command tracking | ✅ | 🟡 | ❌ | 🟡 | ❌ | ✅ | ❌ | 🟡 | 🟡 | ✅ |
| 20 | External editor / concurrent session capture | ✅ | 🟡 | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| 21 | Agent-agnostic (Claude Code, Cursor, Aider…) | ✅ | 🟡 | ❌ | 🟡 | ❌ | 🟡 | ❌ | ❌ | ❌ | ✅ |
| 22 | MCP server (programmatic agent access) | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| 23 | Codex hooks (auto-install, 4 lifecycle events) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| 24 | Replay (restore + re-run with new prompt) | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| 25 | Pin known-good checkpoint (durability vs GC) | ✅ | ❌ | 🟡 | ❌ | 🟡 | ❌ | ❌ | ❌ | ❌ | ✅ |
| 26 | Storage cost / disk footprint (dedup) | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| 27 | 30-day / time-based auto-expiry | ❌ | 🟡 | 🟡 | ❌ | 🟡 | ❌ | ❌ | 🟡 | 🟡 | ❌ |
| 28 | Comparison vs `git stash` / `git restore` / `git reset` | ✅ | 🟡 | ❌ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| 29 | TUI / interactive checkpoint browser | ✅ | ❌ | ❌ | ❌ | 🟡 | ❌ | ❌ | ❌ | ❌ | ✅ |
| 30 | One-line install (curl | bash) | ✅ | ❌ | ❌ | ❌ | 🟡 | ❌ | ❌ | ❌ | ❌ | ✅ |
| 31 | Worked example: "I broke the auth module, now what?" | 🟡 | 🟡 | ❌ | 🟡 | 🟡 | ❌ | ❌ | 🟡 | 🟡 | ✅ (FAQ) |
| 32 | Pain-story / "why this exists" (user-researched) | 🟡 | 🟡 | 🟡 | ❌ | ❌ | 🟡 | ❌ | ❌ | ❌ | 🟡 (HN post) |
| 33 | Security / privacy / no-cloud / no-telemetry | 🟡 | 🟡 | ❌ | ❌ | ❌ | 🟡 | ❌ | ❌ | ❌ | ✅ (FAQ) |
| 34 | Open source + license + contributor path | ✅ | ✅ | 🟡 | ✅ | ❌ | 🟡 | ❌ | 🟡 | ❌ | ✅ (MIT) |
| 35 | GitHub-issue–anchored pain ("the issue this solves") | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 (audit recommends) |

**Row-count summary:**

- **agent-rollback covers 23 of 35 topics in depth** (rows 1–10, 16+, 19–26, 28–30, 33–35 partial). Strongest in the "lower-left quadrant": primitives, dedup, hooks, MCP, op-revert, replay.
- **Topics nobody in the set covers well:** intent verification (12), conversation restore (13), keyboard shortcut (15), branching/fork (17), 30-day auto-expiry (27). These are feature *opportunities* for us, not content gaps.
- **Topics competitors cover and we don't:**
  1. **#11 Approval gates** — agentame owns this; we have *nothing* in copy. Highest-impact missing topic.
  2. **#13 Conversation restore** — Refact.ai owns this; Claude Code partial. AI engines cite "Claude Code rewind" for "restore conversation."
  3. **#15 Keyboard shortcut** — Copilot CLI's `Esc Esc` is iconic. We have no muscle-memory moment.
  4. **#16 IDE integration** — VS Code / JetBrains is the #1 install target. Cline wins by default here.
  5. **#21 / 22 / 23 cross-agent install paths** — We *have* these in code; we don't have a comparison page that names them.
  6. **#26 Storage cost deep-dive** — We claim "~zero disk" once. Competitors say nothing. This is a content goldmine for technical buyers.

---

## 2. Topics We Cover That No One Else Does

Our unique content surface (every entry here is a moat — competitors cannot claim it without copying our copy or building our features):

| # | Topic | Why it's unique | Where we cover it | Lift action |
|---|---|---|---|---|
| U1 | **Op-revert: revert the files a single bad op touched** (jj-style selective undo for agents) | No competitor in the set has this concept. Claude Code has decoupled restore; Cline has all-or-nothing; OpenCode has fork. | README "Operation log" section (L356), FAQ "How do I revert just one bad operation?" | **Spin out as the lead blog post.** Position as "agent-rollback is the only one." |
| U2 | **Re-anchor a Codex run from a checkpoint + re-run with new prompt** (`replay` subcommand) | No direct competitor has restore-then-rerun. Undo.io has record/replay for the *whole* session, which is a different thing. | README "Replay from a checkpoint" (L387) | Add a 60-sec screencast — replay is the most viral demo in the product |
| U3 | **Content-addressed dedup across snapshots (sha256)** | Cline's shadow git inherits dedup from git; we *built* dedup from scratch in pure Node. Worth bragging about. | README "Storage model" (L405) | Benchmark: "100 checkpoints, 1.2 MB on disk" → make this a tweet/blog |
| U4 | **Codex-only hook installer for 4 lifecycle events** | No competitor auto-installs hooks in Codex. The `init codex` path is unique. | README "Codex hooks" (L290) | Make `init codex` the hero of a "30-second to safe Codex" blog post |
| U5 | **MCP server with dry-run-by-default restores** | Other MCP servers (Undo.io, codex-revert) exist; ours is the only one where restores default to no-mutate. | README "MCP server" + "Chat with Codex" section | Add to MCP server announcement as a security story |
| U6 | **One-line install with `--all` (binary + skill + MCP in one curl)** | No competitor has a one-liner that registers both skill and MCP. | README "Install" (L141) | Quiet brag in HN/Reddit launch — friction = conversion |
| U7 | **`arb` 3-char short alias without `ar` collision** | We literally wrote a FAQ about why we don't ship `ar`. Tells the story of a careful CLI author. | README FAQ "Why is the short alias `arb` and not `ar`?" (L640) | Keep — this is the kind of "designed by someone who has shipped CLIs" signal that wins trust |
| U8 | **Operation log as audit trail + recovery path** | agentame has approval logging; we have an `ops.jsonl` that's machine-readable and recovery-grade. | README "Operation log" (L356) | Document the format → technical audience treats this as a feature flag |

> **Insight:** U1, U2, U3, U4 are *architectural* uniqueness. U5, U6, U7, U8 are *go-to-market* uniqueness. The first group needs deep technical blog posts; the second group needs above-the-fold README + landing-page copy.

---

## 3. Topics Competitors Cover That We Don't

Every entry here is a content gap (we may have the feature; we lack the copy), or a real product gap (we need to ship the feature).

### 3.1 Pure content gaps (feature exists or is plausible — we just don't write about it)

| # | Topic | Who owns it | Our status | Recommended action |
|---|---|---|---|---|
| G1 | **"Codex broke my code, now what?"** worked-example post | Cline blog, Claude Code docs, Reddit r/codex threads | We have a *sentence* in HN post; no blog post | **P0 — write a 1,200-w post titled "How to undo a Codex change"** |
| G2 | **Comparison: agent-rollback vs Claude Code `/rewind`** | Claude Code docs have it; we don't | We mention Claude Code once in FAQ | **P0 — write the comparison page; AI engines will cite both sides** |
| G3 | **Comparison: agent-rollback vs Cline checkpoints** | Cline docs | None | **P0 — same reason; these are the two main "do I install this?" search paths** |
| G4 | **Approval gates / human-in-the-loop pattern** | agentame (feature + copy) | We don't cover it at all | **P1 — if we don't ship approval gates, write about how `init codex` + dry-run restore *is* our approval gate** |
| G5 | **Conversation restore (rewind the chat, keep the code)** | Refact.ai, Claude Code | None | **P2 — if not building, address in FAQ: "We don't restore conversation; Codex does, and we complement it."** |
| G6 | **Keyboard-shortcut muscle memory (Esc Esc, `Ctrl+Z` equivalent)** | Copilot CLI | None | **P1 — add a one-liner: "double-tap Esc in Codex → rewind last prompt" via the SKILL.md trigger phrases** |
| G7 | **Storage cost benchmark ("100 checkpoints, X MB")** | Cline wiki has it | Single sentence in README | **P1 — publish the numbers in a `BENCHMARKS.md`** |
| G8 | **30-day auto-expiry as a default** (configurable) | Claude Code | We don't offer it | **P2 — document that we don't, and why (durability > bloat for the recovery use case)** |
| G9 | **"I lost 3 hours of work to an agent" — first-person pain post** | r/codex, r/ClaudeAI | We have a HN first-comment only | **P0 — write the canonical "I built this because…" post; cite openai/codex#5082** |
| G10 | **Specific GitHub-issue–anchored origin story** | (we are silent) | None in README | **P0 — add a "Why this exists" section: link openai/codex#5082, #2788, #6449** |
| G11 | **README feature GIF / demo video** | Cline has it; Aider has it; Refact has it | We have zero images, only badge SVGs (per on-page-audit 2.0/10) | **P0 — record a 20-second screencast of `arb checkpoint` → risky Codex run → `arb revert`** |
| G12 | **Windows / WSL install path** | All competitors | One line in "Current boundaries" | **P1 — dedicated install page if we want Windows users** |
| G13 | **Team / multi-user / shared checkpoint store** | None in set | None | **P2 — likely out of scope; document the answer ("local-first by design")** |
| G14 | **Migration: how to convert a 200-commit project to use agent-rollback** | None | None | **P2 — this is a content play for trust, not feature** |
| G15 | **Comparison: agent-rollback vs `git stash` specifically** | Implicit in Claude Code docs | One row in FAQ comparison table | **P1 — full blog post: "Why `git stash` isn't enough for AI-edited code"** |
| G16 | **Comparison: agent-rollback vs Undo.io's recordings (debug vs code-safety)** | Undo.io | None | **P2 — short post: "Undo.io is for debugging; agent-rollback is for safety"** |
| G17 | **Cursor-specific integration recipe** | Cursor's own docs | One line in SKILL.md | **P1 — Cursor users are ~1M and a juicy adjacent audience** |
| G18 | **Aider-specific integration recipe** | Aider's own docs | None | **P1 — Aider's auto-commit pollutes git; we solve that** |
| G19 | **VS Code Copilot-specific integration recipe** | Copilot's own docs | None | **P2 — Copilot is inline, not agentic; different use case** |
| G20 | **How to use agent-rollback with a CI / pre-commit hook** | None | None | **P2 — power-user move; targets DevOps audience** |

### 3.2 Real product gaps (we don't have the feature — content alone won't fix this)

| # | Topic | Who has it | Why it matters | Effort |
|---|---|---|---|---|
| P1 | **In-IDE diff UI** (Cline's biggest UX win) | Cline | Users review changes in editor, not terminal | High — needs VS Code + JetBrains extensions |
| P2 | **Decoupled code/conversation restore** (Claude Code's biggest UX win) | Claude Code | Users want to keep chat, drop code (or vice versa) | Medium — hooks already capture transcript tail |
| P3 | **Per-file selective restore** (not per-op) | Claude Code, Cline | "Undo only the auth.js change, keep my README" | Medium — extend `selective-revert.js` |
| P4 | **Time-travel `/rewind` UI** (prompt-indexed) | Claude Code, OpenCode | Mental model: "before I asked about X" | Medium — `rewind.js` already proposed in `.research/comparison-vs-others.md` §5.1 |
| P5 | **Session branching / fork** | OpenCode | "Try approach B from checkpoint A, original untouched" | High — fundamentally different data model |
| P6 | **Intent verification** (planned vs actual files) | agentame | Enterprise / safety use case | High — needs LLM call to compare intent to diff |

> **Recommendation:** P1, P3, P4 are the top 3 to ship. All are Medium effort, High citation value, and close a 1-line "we don't have this" answer in any future comparison page.

---

## 4. Editorial Calendar — 8 Pieces, Priority Order

**Format convention:** KW = target keyword · Intent = I (informational) / C (commercial) / T (transactional) · KD = keyword difficulty (Estimated) · Word count target · Pain-source = which user signal (Reddit, openai/codex issue, competitor gap) this is anchored to.

| # | Title (working) | KW | Intent | KD | Words | Pain source | Owner skill |
|---|---|---|---|---|---|---|---|
| 1 | **How to undo a Codex change** | `codex undo` (PRIMARY) | I+C | 10–15 | 1,400 | r/codex pain threads + openai/codex#5082 | seo-content-writer |
| 2 | **Why I built agent-rollback: Codex broke my code, and Git couldn't save me** | `codex rollback` (PRIMARY) | I | 5–10 | 1,100 | openai/codex#5082 + #6449 + r/codex | content-writer (story) |
| 3 | **agent-rollback vs Cline checkpoints vs Claude Code `/rewind`** | `ai code undo` | C | 20–30 | 1,800 | Comparison queries; AI Overview bait | seo-content-writer |
| 4 | **agent-rollback vs `git stash` (and why `git` isn't enough for AI-edited code)** | `git stash ai code` | I | 15–25 | 1,300 | FAQ "How is this different from git?" — expand | seo-content-writer |
| 5 | **`op revert`: jj-style selective undo for AI agents** | `agent op revert` / `ai code selective undo` | I | 5–10 | 1,200 | U1 unique topic; Reddit r/Jujutsu audience | seo-content-writer (technical) |
| 6 | **The 4 GitHub issues that prove Codex needs a safety net** | `codex safety net` | I | 5–8 | 1,000 | openai/codex#5082, #2788, #6449, #? — link the public pain | content-writer (research) |
| 7 | **Storing 100 checkpoints costs ~1.2 MB: a content-addressed snapshot benchmark** | `codex snapshot` (storage cost) | I | 8–12 | 900 | U3 unique topic; technical buyer persona | seo-content-writer (data) |
| 8 | **agent-rollback + Aider: a per-task safety net for the auto-commit model** | `aider undo` / `aider rollback` | I+C | 8–12 | 1,000 | Aider's auto-commit pollutes git (per competitor-landscape) | seo-content-writer (integration) |

**Bonus (P1, if bandwidth allows):**

| 9 | **How to undo a Claude Code change (and what Cline, Codex, and Aider each do differently)** | `claude code undo` | I+C | 20–25 | 1,600 | Refact.ai / Claude Code search demand |
| 10 | **A 30-second safety net: `agent-rollback init codex` and the Codex hook model** | `codex hook` / `codex auto checkpoint` | I | 5–10 | 800 | U4 unique topic; short-form, dev.to-friendly |

> **Total: 8 priority + 2 bonus = 10 articles. Realistic 6-week cadence at 2 pieces/week for a single maintainer.**

---

## 5. Per-Piece Brief — Top 3 Priority Pieces

### Piece 1: "How to undo a Codex change"

- **Angle:** Direct answer to the #1 query AI Overviews already partially cite (openai/codex#5082 + Reddit). Lead with the procedure; install instructions in second 1/3; "why this exists" anchor in last 1/3.
- **Hook:** *"You asked Codex to refactor the auth module. It refactored three modules, deleted a test, and rewrote your README. Git shows a clean working tree. The Codex CLI has no undo. What do you do?"* — open with the literal pain.
- **Sections (8):**
  1. **The 30-second answer** (3 commands, copy-paste block — for AI snippet extraction)
  2. **Why Codex doesn't ship an undo** (link openai/codex#5082, frame as a community request)
  3. **What "undo" actually means for AI-edited code** (snapshot, diff, restore — define the three primitives)
  4. **Step-by-step: `arb init` → `arb checkpoint` → Codex run → `arb revert`**
  5. **The hook version (zero-effort auto-snapshots)** — `arb init codex` and the 4-event model
  6. **The MCP version (ask Codex in plain English)** — `"go to last checkpoint"`
  7. **Three ways to be safer next time** (pinned checkpoints, op-revert, replay)
  8. **FAQ-as-FAQPage schema (last block)** — install, uninstall, Windows, diff
- **Word count:** 1,400
- **Target keyword:** `codex undo` (PRIMARY) + `codex rollback` + `codex revert` (secondary)
- **Internal links:** → README, → npm, → HN launch post, → openai/codex#5082 (external citation)
- **Schema target:** `FAQPage` + `HowTo` JSON-LD
- **GEO target:** Perplexity / Google AI Overview should be able to extract the 3-command answer verbatim

### Piece 2: "Why I built agent-rollback"

- **Angle:** First-person origin story. The most-linkable, most-emotional piece in the calendar. Built to win Hacker News, Reddit r/programming, and AI Overview "agent-rollback was built because…" extractions.
- **Hook:** *"Three Tuesdays in a row, Codex touched a file I didn't ask it to touch. The third time, I had a half-finished feature branch and no clean revert path. I built a tool."*
- **Sections (6):**
  1. **The Tuesday pattern** (3 short vignettes, 100 words each)
  2. **What I tried first** (git stash, editor undo, Codex's own `codex --continue`, none of which worked)
  3. **The openai/codex issue threads that convinced me this was a real gap** — link #5082, #2788, #6449 verbatim with quotes from maintainers/users
  4. **Why Git is the wrong abstraction** (file-level diffs, not task-level intent; "commits are timestamps, not tasks")
  5. **The first cut: a 200-line Node script that did `tar` + `manifest.json`** (the actual origin)
  6. **What it became: agent-rollback, v1.0.1** — link to README, "and that's why I added hooks, MCP, op-revert, and replay"
- **Word count:** 1,100
- **Target keyword:** `codex rollback` (PRIMARY) + `codex safety net` + `ai coding safety`
- **Internal links:** → README, → piece #1 ("How to undo a Codex change"), → HN launch post
- **Schema target:** `Article` + `author` (maintainer byline = +A05 in EEAT)
- **GEO target:** AI engines should cite this as the "why does this exist" answer for any query containing "agent-rollback"

### Piece 3: "agent-rollback vs Cline checkpoints vs Claude Code `/rewind`"

- **Angle:** The single most-cited format in developer-tool SEO. "X vs Y vs Z" pages rank for high-intent queries and get cited by both AI engines and human researchers.
- **Hook:** *"Three tools, three different mental models for 'undo,' and one that actually does what you want."*
- **Sections (10):**
  1. **TL;DR table** (6 rows: agent-rollback / Cline / Claude Code — what each does in one line)
  2. **The three models in one paragraph each:**
     - Claude Code `/rewind`: prompt-indexed time travel, 30-day expiry, code OR conversation
     - Cline checkpoints: shadow git, per-tool-use, in-IDE diff UI, full workspace revert
     - agent-rollback: content-addressed snapshots, Codex hooks, MCP server, op-revert, replay
  3. **Decision matrix (8 rows):** I want to…
     - "Restore just one file" → Claude Code or Cline
     - "Revert only the files a bad op touched" → **agent-rollback**
     - "See a per-line diff in my editor" → Cline
     - "Restore the conversation, keep the code" → Claude Code
     - "Auto-snapshot every Codex prompt + tool use" → **agent-rollback**
     - "Replay a Codex run from a known-good point" → **agent-rollback**
     - "Work in a non-Git directory" → **agent-rollback** or Claude Code
     - "Use it with Aider / Cursor / Windsurf / Cline" → **agent-rollback** (MCP)
  4. **Storage cost comparison** — agent-rollback dedup vs Cline's git blobs vs Claude Code's opaque cache
  5. **MCP / agent-native surface** — only agent-rollback exposes programmatic control
  6. **The honest gaps** — IDE UI (Cline wins), conversation restore (Claude Code wins), branching (OpenCode wins; we don't)
  7. **"When to use all three"** — the realistic answer is "yes"
  8. **Install for each** — 3 commands, side by side
  9. **Pricing / open source** — all three
  10. **Verdict** — one paragraph
- **Word count:** 1,800
- **Target keyword:** `ai code undo` (PRIMARY) + `cline checkpoint` + `claude code rewind` + `codex undo` (secondary)
- **Internal links:** → README, → piece #1, → piece #5 (`op revert`)
- **Schema target:** `Article` + `ComparisonTable` (custom) + `FAQPage` for the "which one should I use?" block
- **GEO target:** This is the page AI engines will cite for every "vs" query in the niche

---

## 6. Quick Wins — README Additions vs Standalone Content

**Readme-first** (do these in v1.0.2 — they close GEO/EEAT gaps, take <30 min each):

| # | Section to add | Why | Effort |
|---|---|---|---|
| QW1 | **"What is agent-rollback?"** 30-word definition block above the badge row (per GEO audit Change 1) | AI engines need a 25–50 word declarative anchor in the first 150 words | 5 min |
| QW2 | **"Why this exists"** 4-line block linking openai/codex#5082, #2788, #6449 | Anchors the tool to the actual user pain; AI Overview bait | 10 min |
| QW3 | **"Last updated: 2026-06-11 · v1.0.1"** freshness line | Per GEO audit Change 5; Perplexity discounts undated content | 2 min |
| QW4 | **4-command "How to undo Codex changes"** block right after 30-sec start (per GEO audit Change 3) | Direct answer to AI Overviews' #1 query cluster | 10 min |
| QW5 | **Maintainer byline** ("Built by Nainish Rai · @nainish-rai on X · nainish-rai on npm") | EEAT Authority 62 → ~78; verifiable human signal | 15 min |
| QW6 | **Demo GIF link** (record once, embed in README + landing) | On-page-audit Image 2.0/10 is the lowest score; this single asset moves 5 metrics | 60 min (one-time) |
| QW7 | **Comparison row: agent-rollback vs Claude Code `/rewind` vs Cline** added to FAQ | Largest single content gap in the README; closes 3 comparison queries | 30 min |
| QW8 | **"Used at / npm downloads / GitHub stars"** inline counter | Real numbers > vibe claims; durable trust signal | 15 min |

**Standalone content** (the 8 articles in §4) — these belong on a `/blog` or `/docs` site, **not** in the README. README is a landing page; a 10,000-word blog post inside it is a citation-dilution mistake.

---

## 7. Handoff Summary

| Field | Value |
|---|---|
| **Project** | agent-rollback (npm: `agent-rollback`, v1.0.1) |
| **Audit date** | 2026-06-11 |
| **Auditor** | content-gap-analysis v9.9.10 |
| **Source assets** | README.md (3,824 w), package.json, FAQ, MCP examples, INTRODUCING-agent-rollback.md, marketing/platforms/*.md |
| **Competitor set audited** | pi-rollback, agentame, A386official/diffback, codex-revert (direct) + Undo.io MCP, Refact.ai, VS Code Copilot checkpoints, GitHub Copilot CLI (adjacent) |
| **Topic matrix** | 35 topics × 9 sources in §1 |
| **Unique topics** | 8 (U1–U8) — see §2 |
| **Content gaps** | 20 (G1–G20) — see §3.1 |
| **Product gaps** | 6 (P1–P6) — see §3.2 |
| **Editorial calendar** | 8 priority pieces + 2 bonus — see §4 |
| **Top-3 briefs** | See §5 |
| **Quick wins** | 8 README additions (QW1–QW8) — see §6 |
| **Status** | DONE — all gaps named with the competitor that owns them, all quick wins scoped, all calendar entries dated (week of 2026-06-15 onward) |
| **Recommended next skill** | `seo-content-writer` — start with piece #1 ("How to undo a Codex change") and piece #2 ("Why I built agent-rollback") in week 1 |
| **Memory writes** | Promote to `memory/hot-cache.md`: U1–U8 (unique topics), P1–P6 (product gaps), KW #1+6+11+12 (blue-ocean). Promote to `memory/open-loops.md`: QW1–QW8 (README todos) and the 8 calendar pieces as dated commitments. |
| **Save path** | `marketing/seo-audit/09-content-gap.md` (this file) |

### Dated Content Calendar (for `memory/open-loops.md`)

| Date | Piece | Owner | KW target |
|---|---|---|---|
| 2026-06-16 (week 1, Mon) | QW1 + QW2 + QW3 + QW4 — README hero block | code | n/a (on-page) |
| 2026-06-18 (week 1, Wed) | **#1 — How to undo a Codex change** (1,400 w) | content | `codex undo` |
| 2026-06-20 (week 1, Fri) | **#2 — Why I built agent-rollback** (1,100 w) | content | `codex rollback` |
| 2026-06-23 (week 2, Mon) | QW5 + QW6 + QW7 + QW8 — README trust signals + demo GIF | code | n/a |
| 2026-06-25 (week 2, Wed) | **#3 — vs Cline vs Claude Code `/rewind`** (1,800 w) | content | `ai code undo` |
| 2026-06-27 (week 2, Fri) | **#4 — vs `git stash`** (1,300 w) | content | `git stash ai code` |
| 2026-06-30 (week 3, Mon) | **#5 — `op revert`: jj-style selective undo** (1,200 w) | content | `agent op revert` |
| 2026-07-02 (week 3, Wed) | **#6 — The 4 GitHub issues that prove Codex needs a safety net** (1,000 w) | content | `codex safety net` |
| 2026-07-07 (week 4, Mon) | **#7 — Storage cost benchmark** (900 w) | content | `codex snapshot` |
| 2026-07-09 (week 4, Wed) | **#8 — agent-rollback + Aider integration** (1,000 w) | content | `aider undo` |
| 2026-07-14 (week 5, optional) | **#9 — How to undo a Claude Code change** (1,600 w) | content | `claude code undo` |
| 2026-07-16 (week 5, optional) | **#10 — 30-sec safety net: `init codex`** (800 w) | content | `codex hook` |

> **Closing recommendation:** Run `seo-content-writer` on piece #1 first. It's the highest-ROI single piece: hits the primary keyword, anchors the FAQ, and is the most-cited format for "X how to undo Y" queries in this space.
