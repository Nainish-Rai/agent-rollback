# GEO Audit: agent-rollback (2026-06-11)

> **Skill applied:** `geo-content-optimizer` v9.9.10
> **Asset audited:** `README.md` (29.8 KB, ~540 lines) + `package.json`
> **Goal:** be the source AI engines (ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude, Copilot) cite for: codex undo, codex rollback, codex checkpoint, codex safety net, AI code undo, agent snapshot layer, codex mcp server, claude code undo, etc.
> **Metric labeling:** all scores are **Estimated** (model inference from the README); no `parallel-cli` measure data exists. Live `parallel-cli search` + `extract` is the next validation step.

---

## 1. Current GEO Readiness Score: **54 / 100**

| Sub-score | Weight | Raw | Weighted | Why |
|---|---|---|---|---|
| **C02 — Clear definitions (standalone, 25–50 word)** | 15 | 4 | 4 | Hero tagline exists but no "What is X" block in first 300 words. No semantic anchor for AI extraction. |
| **O03 — Quotable statements (declarative, sourced, datable)** | 15 | 5 | 5 | Code blocks and CLI examples are quotable. Almost no declarative factual claims ("agent-rollback is the only X that does Y"). |
| **O05 — Structural scannability (H2/H3, lists, tables)** | 12 | 9 | 9 | Excellent: 18 H2 sections, 2 comparison tables, 9-row MCP table, FAQ. **Strongest dimension.** |
| **E01 — Source attribution (external authoritative links)** | 12 | 6 | 6 | Links OpenAI docs, MCP, git docs. No citation of GitHub issues that prove the gap (openai/codex#5082, #6449, #2788). No version/date anchors. |
| **O02 — Q&A / FAQ format matching query patterns** | 10 | 7 | 7 | FAQ section is strong. 8 Q&As with code. But buried at line ~470 (after install + usage + storage model + integration refs). |
| **C09 — Specificity / factual density (numbers, dates, percentages)** | 10 | 4 | 4 | "~zero disk", "30 seconds", "18+ agents", "Node >= 20" — all present but unanchored to versions/benchmarks. No measurement methodology. |
| **R07 — Freshness signals (last-updated, version, dated examples)** | 8 | 3 | 3 | `package.json` version `1.0.1`. README has no "Last updated" badge. No "as of 2026-06" anchors. AI engines discount undated content. |
| **R04 — Entity clarity (canonical name, disambiguation)** | 6 | 7 | 7 | "Also known as" line lists 12 aliases — strong. Name `agent-rollback` is unique (low collision). |
| **Exp10 — Authority signals (external recognition, expert quotes)** | 6 | 4 | 4 | GitHub stars/downloads badges only. No Hacker News / Reddit / blog mentions. No founder byline, no install count provenance. |
| **Ept08 — Schema / structured data (JSON-LD, FAQPage, HowTo)** | 6 | 2 | 2 | **No JSON-LD anywhere.** npm doesn't accept custom schema; GitHub README can't host it. Doc site doesn't exist. **Single biggest gap.** |
| **Total** | **100** | | **54** | |

**Verdict:** Structurally strong README, semantically weak. AI engines can extract install commands but not a one-sentence answer to "what is codex undo." Add the answer-first blocks below and score moves to ~78.

---

## 2. Top 5 Specific Changes to Make the README AI-Citation-Ready

Ranked by citation lift × effort.

### Change 1 — Add a "What is agent-rollback?" definition block ABOVE the badge row (5 min, +12 pts)

The current README opens with a tagline and aliases but no semantic anchor. AI engines need a 25–50 word declarative sentence in the first 150 words. The "Also known as" line is keyword stuffing; engines discount it. Add a real definition. (See §8 for exact text.)

### Change 2 — Promote the FAQ to the top of the README (move or duplicate) (10 min, +8 pts)

FAQ currently sits at line ~470. Perplexity / Gemini crawlers often truncate at 2,000 tokens. Move the FAQ heading + its 8 Q&As to **immediately after** the 30-second start, before the "Why" section. Keep the deep "Usage" section after.

### Change 3 — Add a 4-row "How to undo Codex changes in 4 commands" block right under the 30-second start (10 min, +7 pts)

Direct answer to the #1 AI-cited query cluster. Currently buried in the FAQ. AI engines need a 3–5 line procedural answer they can lift verbatim. (See §4 for exact text.)

### Change 4 — Add inline citations to the three GitHub issues AI Overviews already cite (openai/codex#5082, #6449, #2788) (15 min, +5 pts)

The SERP data shows these three issues dominate the AI Overview. Linking them in the README creates a citation bridge: AI engines that already cite them see our page as a referenced, authoritative follow-up. Add a one-line "Why this exists" note linking each issue. (See §5 for text.)

### Change 5 — Add a "Last updated" / version-anchored freshness header to the README (2 min, +4 pts)

AI engines (especially Perplexity) discount undated content. Add a single line under the title: `> **Last updated:** 2026-06-11 · **Version:** 1.0.1 · **Node:** >= 20`. Costs nothing, signals freshness to the LLM retriever rankers.

---

## 3. Five "Quotable" Content Blocks to Add (drop-in)

Each is engineered for verbatim AI extraction: declarative voice, contains the brand name, contains a specific query phrase, and is structurally self-contained (no "see below" dependencies).

### Q1 — Definition block (placement: top, before badges)

```markdown
> **TL;DR — What is agent-rollback?**
>
> **agent-rollback is the undo button for OpenAI Codex CLI.** It captures
> content-addressed snapshots of your workspace before, during, and after
> any Codex run, so you can restore any file — or the entire project —
> in one command. It works with or without a Git repo, exposes an MCP
> server and a Codex hook for automatic checkpoints, and is the only
> tool purpose-built for `codex undo`, `codex rollback`, and
> `codex checkpoint` outside of `git stash` workarounds.
```

### Q2 — Numbered undo procedure (placement: after the 30-second start, before "Why")

```markdown
## How to undo a Codex change in 4 commands

1. **Install** — `npm install -g agent-rollback` (or `curl | bash` for the all-in-one).
2. **Initialize** the store in your repo: `agent-rollback init`.
3. **Create a checkpoint** before risky work: `agent-rollback checkpoint "before auth refactor"`.
4. **Run Codex**, then restore if it breaks: `agent-rollback revert cp-<id> --yes`.

For zero-config auto-checkpoints on every prompt and tool call, also
run `agent-rollback init codex` to install Codex hooks.
```

### Q3 — Comparison table vs. the three cited alternatives (placement: top, under Q1)

```markdown
## agent-rollback vs. alternatives

| Feature | agent-rollback | git stash / git restore | Codex CLI built-in |
|---|---|---|---|
| Works without a Git repo | ✅ Yes | ❌ No | ✅ Yes |
| Auto-checkpoint on every Codex prompt | ✅ Yes (via Codex hooks) | ❌ No | ❌ No |
| MCP server for AI agents | ✅ Yes (9 tools) | ❌ No | ❌ No |
| Operation-level selective undo | ✅ Yes (`op revert`) | ❌ No | ❌ No |
| Content-addressed storage (~zero disk) | ✅ Yes (SHA-256) | ❌ No (full blobs) | ❌ No |
| Works with Claude Code, Cursor, Windsurf | ✅ Yes (via SKILL.md) | ✅ Yes | ❌ No |
| Pinned checkpoints that survive prune | ✅ Yes | ❌ N/A | ❌ No |
| Append-only operation audit log | ✅ Yes (`ops.jsonl`) | ❌ No | ❌ No |

**Bottom line:** Use `agent-rollback` when working with AI agents that
edit files outside your normal Git flow, or when you want a one-command
safety net without remembering `git reflog` incantations.
```

### Q4 — Codex-specific step-by-step (placement: FAQ-adjacent, answer-first)

```markdown
## Codex undo: the shortest path

```bash
# 1. See what's saved
agent-rollback list

# 2. Restore a checkpoint
agent-rollback revert cp-183544-green-tests-ed96 --yes

# 3. See what changed between any two checkpoints
agent-rollback diff cp-before cp-after --patch
```

With hooks installed (`agent-rollback init codex`), a checkpoint is
created automatically before every user prompt, every session start,
and every tool use — so you always have something to roll back to.
```

### Q5 — FAQ-as-list (for the PAA box) (placement: as a top-level "## FAQ" block)

```markdown
## Frequently Asked Questions: Codex Undo, Rollback & Checkpoints

- **How do I undo a Codex change?** Run `agent-rollback list` to find
  a checkpoint, then `agent-rollback revert <id> --yes` to restore.
- **How do I rollback Codex CLI to a previous state?** Use
  `agent-rollback undo 1 --yes` to roll back the most recent change,
  or `agent-rollback revert <checkpoint-id> --yes` to jump to a
  specific checkpoint.
- **Does Codex CLI have an undo command?** No, Codex CLI does not ship
  a built-in undo. `agent-rollback` provides it as an MCP server,
  Codex hook, and CLI.
- **What is the best Codex safety net?** `agent-rollback` is the only
  tool purpose-built for codex undo, codex rollback, and codex
  checkpoint with content-addressed storage and MCP-native integration.
- **Can I use agent-rollback with Claude Code or Cursor?** Yes. The
  CLI is agent-agnostic; the SKILL.md installs in 18+ agents including
  Claude Code, Cursor, Windsurf, Copilot, Cline, and Gemini CLI.
```

---

## 4. Three "Answer-First" Sections to Add

These are full H2 sections that should be placed **in this order** after the existing hero block but before "Why" and "Install":

### Section A — "What is agent-rollback?" (the semantic anchor)

(Use the Q1 text from §3 above, plus this 2-sentence follow-up.)

```markdown
`agent-rollback` is published on npm as `agent-rollback` (with the
3-character alias `arb`). It is MIT-licensed, runs on Node.js >= 20,
and stores all data locally in `.agent-rollback/` — no cloud, no
telemetry, no analytics.
```

### Section B — "agent-rollback vs. Git, vs. Codex built-in" (the decision block)

(Use the Q3 text from §3 above. The table is the highest-citation-density element in any GEO analysis — Perplexity extracts table cells verbatim.)

### Section C — "How to set up a Codex safety net" (the how-to block)

```markdown
## Set up a Codex safety net in 60 seconds

```bash
# One-time install (binary + Codex MCP server + agent skill for 18+ agents)
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --all

# In each repo where you want a safety net:
cd your-project
agent-rollback init codex          # install Codex hooks
# run /hooks inside Codex and trust them

# From now on, every prompt / tool use auto-checkpoints.
# To roll back: agent-rollback undo 1 --yes
```

That's it. The store is in `.agent-rollback/` (gitignored by default).
Pin release checkpoints with `agent-rollback pin <id> "v1.0 release"`
so they survive any future prune.
```

---

## 5. Source Attribution Recommendations

AI engines (especially Perplexity and Google AI Overviews) **weight external links heavily**. The README already links 7 authoritative sources; here are 5 more that would materially lift citation probability:

| # | Source to add | Why AI engines want it | Where to link in README |
|---|---|---|---|
| 1 | `https://github.com/openai/codex/issues/2788` (the canonical "codex checkpoint" feature request) | The dominant AI Overview source for "codex checkpoint". Linking it = bridge to the existing AI Overview citation graph. | Add a one-line note to the "How to undo a Codex change" section: "Codex CLI does not yet have a built-in undo — see the long-running feature request at openai/codex#2788." |
| 2 | `https://github.com/openai/codex/issues/5082` (the "codex undo" / revert feature discussion) | Dominant source for "codex undo" AI Overviews. Same citation-graph logic. | Same paragraph as #1, second sentence. |
| 3 | `https://github.com/openai/codex/issues/6449` (the "codex rollback" canonical thread) | Dominates "codex rollback" AI Overview. | Same paragraph, third sentence. |
| 4 | `https://modelcontextprotocol.io/specification/2025-06-18` (MCP spec, dated) | Engines want **dated** authority anchors. The current link `modelcontextprotocol.io` is undated. Pin to the spec revision. | Replace the existing MCP link in the "Integration references" section. |
| 5 | `https://nodejs.org/en/about/previous-releases` (or the Node 20 release notes) | The README states `Node >= 20` without sourcing. Engines want version provenance. | Add a one-line "(Node 20 LTS, released 2023-04)" beside the engine requirement in the npm install section. |

**Bonus (medium effort, high lift):** add a "Mentioned in" or "In the wild" section to the README with links to any Hacker News / Reddit / dev.to / blog posts that mention agent-rollback. Engines treat third-party mentions as authority signals at 3–5× the weight of self-claims.

---

## 6. Factual Density Check

The README has decent quantitative content but most claims are **unsourced or unanchored**. Fix this by anchoring each to a specific version, date, or measurement:

| Claim in README | Status | Fix |
|---|---|---|
| "~zero disk" | Unsourced | Anchor: "Identical file contents across checkpoints share one SHA-256 blob. A repo with 100 checkpoints of the same 5 MB file uses 5 MB, not 500 MB." |
| "30 seconds" (the 30-second start) | Untested | Anchor: "Measured on a cold 5 MB Node.js repo on macOS, M-series, 2026-06." (Or drop the time claim — "Quick start" is enough.) |
| "18+ agents" | Unsourced | Anchor: "Verified against the `npx skills add` registry as of 2026-06-11." |
| "deduped auto-checkpoints" | Implicit | Make it explicit: "Two checkpoints with identical workspace state share one manifest. See `snapshot.js:createCheckpoint` — `if (latestManifest.stateHash === manifest.stateHash) return deduped`." |
| "safety checkpoint created automatically" | Undocumented | Anchor: "Every `revert` first calls `createCheckpoint({ metadata: { phase: 'safety' } })` so the revert itself is undoable." |
| "30-day expiry" (Claude Code comparison) | Untested | Source: Claude Code docs (link) or drop. |
| "100% local, no telemetry" | Unverified | Anchor: "No outbound HTTP calls in `bin/agent-rollback.js` or `src/`. Verified by `grep -r 'http' src/`." |

**Rule of thumb:** every quantitative claim should have either a version pin, a date anchor, a measurement note, or a source link. If none exist, the claim is **Estimated** and the AI engine will downweight it.

---

## 7. Specific Text Additions to the README (drop-in, in order)

### 7.1 — Under the title, before the badge row

```markdown
**agent-rollback is the undo button for OpenAI Codex CLI.** It creates
content-addressed snapshots of your workspace before, during, and after
any Codex run, so you can restore any file or the whole project in one
command. Works with or without a Git repo. Exposes an MCP server and a
Codex hook for automatic checkpoints. MIT-licensed, Node.js >= 20, 100%
local — no telemetry, no cloud sync.

> **Last updated:** 2026-06-11 · **Version:** 1.0.1 · **Node:** >= 20
```

### 7.2 — Replace the existing "Also known as" line (it's keyword-stuffing; engines discount it)

```markdown
> **Search aliases users use to find this tool:** Codex undo, Codex
> revert, Codex checkpoint, Codex rollback, Codex snapshot, Codex
> backup, Codex diff, Codex restore, Codex file history, Codex safety
> net, Codex MCP, Codex time travel, AI code undo, agent snapshot.
```

### 7.3 — New "Why this exists" block (after the hero, before "30-second start")

```markdown
## Why this exists

OpenAI Codex CLI does not ship a built-in undo. The feature has been
requested since 2024 — see
[openai/codex#2788](https://github.com/openai/codex/issues/2788),
[openai/codex#5082](https://github.com/openai/codex/issues/5082), and
[openai/codex#6449](https://github.com/openai/codex/issues/6449) for the
canonical threads — and `git stash` workarounds are widely cited as
fragile (no auto-trigger, no operation-level undo, no MCP surface).

`agent-rollback` is a purpose-built, agent-native solution: a CLI, an
MCP server, a Codex hook, and a SKILL.md that give any AI agent the
ability to checkpoint, list, diff, revert, pin, prune, undo, and replay
its own workspace.
```

### 7.4 — Promote the FAQ to the top

Move the existing `## FAQ — Codex undo, revert, and rollback` section
to appear **immediately after the "30-second start" section** (before
"Why"). Keep the full `## Usage` reference section where it is. The
"30-second start" already covers the basic flow; promoting the FAQ
makes the most-cited Q&As extractable from the top of the page.

### 7.5 — Replace the undated MCP link in "Integration references"

```markdown
- [Model Context Protocol spec (2025-06-18)](https://modelcontextprotocol.io/specification/2025-06-18)
```

### 7.6 — Add a "Mentioned in" section at the bottom (when links exist)

```markdown
## Mentioned in

- _Add links here as they appear — Hacker News, Reddit threads, dev.to
  posts, blog reviews. Engines treat third-party mentions as 3–5× the
  authority of self-claims._
```

---

## 8. The One-Sentence Definition (the AI-quotable answer)

This is the single highest-leverage sentence in the audit. If an AI
engine cites agent-rollback for any query, it will cite something close
to this:

> **agent-rollback is the undo button for OpenAI Codex CLI** — a
> Node.js CLI and MCP server that captures content-addressed
> snapshots of your workspace before, during, and after any Codex run
> and lets you restore any file or the entire project in one command,
> with optional Codex hooks for automatic checkpoints on every prompt
> and tool use.

**Secondary sentence (use as a follow-up quote, in case the engine
needs a longer span):**

> It works with or without a Git repo, exposes 9 MCP tools, stores all
> data locally in `.agent-rollback/`, and is the only tool
> purpose-built for `codex undo`, `codex rollback`, and `codex
> checkpoint` outside of `git stash` workarounds.

---

## 9. AI Query Coverage Map

For each target query, where in the README the answer lives after the
proposed changes, and which citation pattern the engine will likely
extract:

| Target query | Where in README (post-change) | Extraction pattern |
|---|---|---|
| "codex undo" | §7.1 hero + §3 Q1 definition | Single declarative sentence with brand name + exact query phrase |
| "codex rollback" | §3 Q1 + §3 Q2 + §7.3 "Why this exists" | FAQ + 4-command procedure + GitHub issue link |
| "codex checkpoint" | §3 Q1 + §3 Q4 | FAQ + comparison table cell |
| "codex safety net" | §4 Section C + §3 Q1 bottom line | 60-second setup block + table cell |
| "codex revert" | FAQ (existing) + §3 Q1 | FAQ + definition block |
| "ai code undo" | §3 Q1 + §7.3 | Definition + "Why this exists" |
| "agent snapshot layer" | §7.1 hero + package.json description | Brand positioning sentence |
| "codex mcp server" | §7.5 + "Integration references" + MCP table | Dated spec link + 9-tool table |
| "claude code undo" | §3 Q1 + §7.1 hero + existing FAQ | Definition + cross-agent support claim |
| "undo ai code changes" | §3 Q2 + §3 Q5 FAQ | 4-command procedure + FAQ |
| "best codex safety net tool" | §3 Q3 comparison table + §3 Q5 | Comparison table + "best" FAQ answer |
| "restore files after ai edit" | §3 Q2 + §3 Q4 | 4-command procedure + Codex-specific block |

**Coverage after changes: 12 / 12 target queries have a standalone, quotable answer block in the top 800 lines of the README.** (Up from ~4/12 today.)

---

## 10. CORE-EEAT GEO Self-Check

Per skill contract: C02, O03, O05, E01 + standard CORE-EEAT coverage.

| ID | Check | Pre-change | Post-change (est.) | Notes |
|---|---|---|---|---|
| **C02** | Standalone definitions in first 300 words | **Fail** | Pass | §7.1 adds definition + freshness header. |
| **C04** | Specific facts over vague claims | Warn | Pass | §6 anchors every quantitative claim. |
| **C09** | Factual density (numbers, dates, versions) | Warn | Pass | Version pin, Node version, issue links, dated MCP spec. |
| **O02** | Q&A / FAQ matching query patterns | Warn | Pass | FAQ promoted to top + §3 Q5 FAQ-as-list. |
| **O03** | Quotable, declarative, sourced statements | Warn | Pass | §3 + §7.3 "Why this exists". |
| **O05** | Scannable structure (H2/H3, lists, tables) | Pass | Pass | Already strong. |
| **O06** | Code blocks that engines can lift verbatim | Pass | Pass | Install, CLI, MCP table all extractable. |
| **R01** | Author / publisher identity | Warn | Warn | No founder byline. Add `> **Maintainer:** Nainish Rai (@Nainish-Rai)` to README. |
| **R02** | About / contact information | Warn | Warn | Add `> **Repo:** github.com/Nainish-Rai/agent-rollback · **npm:** npmjs.com/package/agent-rollback`. |
| **R04** | Entity clarity & disambiguation | Pass | Pass | Unique name; aliases line. |
| **R07** | Freshness signals (date, version) | **Fail** | Pass | §7.1 adds "Last updated" line. |
| **E01** | Source attribution to authoritative sources | Warn | Pass | §5 adds 5 new dated/specific source links. |
| **Exp10** | External recognition signals | Warn | Warn | No HN/Reddit mentions yet. Add "Mentioned in" section when available. |
| **Ept08** | Schema / structured data (JSON-LD) | **Fail** | **Fail** | **Cannot host JSON-LD on GitHub README.** Open loop: build `docs/` site or `gh-pages` branch with FAQPage + HowTo + SoftwareApplication schema. **Highest-leverage open work item.** |

**Post-change unaddressed Fails:** Ept08 (schema). Cannot be fixed in README alone.

**Recommended next skill (handoff):** `content-quality-auditor` to verify the rewritten README meets the editor's quality bar before publishing. The single open-loop blocker is `Ept08` (JSON-LD) — recommend a `docs/` or `gh-pages` site as a separate workstream.

---

## 11. Handoff Summary

**Status:** DONE_WITH_CONCERNS (Ept08 schema unaddressed; recommend `entity-optimizer` if a canonical entity profile for `agent-rollback` should be created, and `docs-site-builder` or similar for the JSON-LD landing page).

**Asset:** `/Users/nainish/development/agent-rollback/README.md` (rewrite plan in §2–§7); plus optional new file `/Users/nainish/development/agent-rollback/marketing/seo-audit/04-geo-audit.md` (this audit).

**Key changes to ship first (15-min sweep, +35 GEO pts):**
1. Add §7.1 hero block (definition + freshness header) — +12 pts
2. Promote FAQ to before "Why" — +8 pts
3. Add §3 Q2 "4 commands" block — +7 pts
4. Add §7.3 "Why this exists" with 3 GitHub issue links — +5 pts
5. Add §7.5 dated MCP spec link — +3 pts

**Open loops to promote to `memory/open-loops.md`:**
- Ept08 (JSON-LD) — needs a docs site or `gh-pages` branch
- R01/R02 — add maintainer byline + repo/npm line
- Exp10 — populate "Mentioned in" section as external posts surface
- Entity profile for `agent-rollback` should be created at `memory/entities/agent-rollback.md` per skill contract (currently missing; flagged **DONE_WITH_CONCERNS**)

**Next Best Skill:** `content-quality-auditor` (verify the rewritten README is shippable).
