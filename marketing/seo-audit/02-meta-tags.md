# agent-rollback — Meta Tags Audit

**Skill applied:** meta-tags-optimizer v9.9.10
**Source brief:** user-provided current state + SERP intel (Measured: real SERP returned 4 query patterns as described)
**Date:** 2026-06-11
**Target pages:** `npmjs.com/package/agent-rollback`, `github.com/Nainish-Rai/agent-rollback`

---

## 1. npm title tag candidates (5 variations, 60-char limit)

Treated as the H1 / package-card headline that npm and search snippets surface. Keyword front-loaded; each fits within 60 chars.

| # | Title | Chars | Formula |
|---|-------|-------|---------|
| T1 | `Codex Undo & Rollback CLI - Snapshot, Diff, Restore` | 51 | Keyword + Benefit + Action |
| T2 | `Codex CLI Undo: Snapshot, Diff, Roll Back in 1 Cmd` | 49 | Keyword + Action + Speed |
| T3 | `agent-rollback: Undo for Codex CLI (Snapshot+Diff)` | 49 | Brand + Keyword + Parenthetical |
| T4 | `Codex Undo MCP: Auto-Snapshot AI Edits & Restore` | 46 | Keyword + Mechanism + Benefit |
| T5 | `Codex Rollback Checkpoints - Undo AI Edits Instantly` | 50 | Keyword + Speed |

**Recommendation:** **T1** for SERP (intent match: "codex undo", "codex rollback"), **T3** for README/badge use (brand-led). A/B test T1 vs T4 in the README H1; T4 surfaces "MCP" which matches the Reddit/GitHub-issue user vocabulary.

---

## 2. npm description candidates (3 variations, 140-160 char)

| # | Description | Chars |
|---|-------------|-------|
| D1 | `Git-like undo, revert, and rollback checkpoints for OpenAI Codex CLI. MCP server + hooks snapshot every edit. Restore in one cmd. Free, MIT licensed.` | 149 |
| D2 | `Codex undo in one command. Snapshot, diff, and restore files. Auto MCP + Codex hooks. Works with Cursor, Claude, Copilot, Cline, Windsurf, Gemini. Free, MIT.` | 157 |
| D3 | `Codex CLI undo layer. Snapshot, diff, and restore in one cmd. MCP + Codex hooks. Free, MIT. Works with Claude Code, Cursor, Windsurf, Copilot, Cline, Gemini CLI` | 160 |

**Recommendation:** **D1** for `package.json` (keyword density wins on "undo", "revert", "rollback", "codex", "MCP"). **D2** for OG/secondary (mention of 6 agents matches SERP intent). **D3** if you want the full agent list visible up front.

---

## 3. GitHub repo description candidates (3 variations, 350-char limit, link-included)

| # | Description | Chars |
|---|-------------|-------|
| G1 | `Undo, revert, and rollback checkpoints for OpenAI Codex CLI. Snapshot, diff, and restore files in one command (`arb`). MCP server + Codex hooks auto-capture every edit. Works with Claude Code, Cursor, Windsurf, Copilot, Cline, Gemini CLI. Free, MIT. github.com/Nainish-Rai/agent-rollback` | 287 |
| G2 | `Git-like safety net for AI-edited code. Snapshot, diff, and rollback Codex CLI edits in one command. MCP server + hooks checkpoint every run. Zero Git, zero cloud, ~zero disk (content-addressed dedupe). Alias `arb`. Works with Claude Code, Cursor, Windsurf, Copilot, Cline, Gemini. github.com/Nainish-Rai/agent-rollback` | 319 |
| G3 | `Codex undo, revert, checkpoint, rollback, snapshot, and restore - all in one CLI (`agent-rollback` / `arb`). MCP server + Codex hooks give you a Git-like safety net for AI-edited code. Free, MIT, no Git required. Works with Claude Code, Cursor, Windsurf, Copilot, Cline, Gemini CLI. github.com/Nainish-Rai/agent-rollback` | 320 |

**Recommendation:** **G2** - it surfaces three differentiators ("zero Git, zero cloud, ~zero disk") that competitors (`pi-rollback`, generic SO answers) cannot claim, and front-loads the SERP-winning phrase "Git-like safety net for AI-edited code."

---

## 4. Open Graph title/description pairs (5 for Twitter/LinkedIn shares)

```html
<!-- OG Pair 1 (default, SERP-aligned) -->
<meta property="og:title" content="Codex Undo & Rollback - Snapshot, Diff, Restore in 1 Command" />
<meta property="og:description" content="Git-like safety net for OpenAI Codex CLI. Auto-snapshot every AI edit, diff changes, and restore files in one command. MCP + Codex hooks. Free, MIT." />
<!-- og:title 60 chars | og:description 199 chars -->

<!-- OG Pair 2 (MCP-led, targets #6449 / Revert MCP SERP) -->
<meta property="og:title" content="Codex Undo MCP: Auto-Snapshot AI Edits & Restore" />
<meta property="og:description" content="Run Codex with a built-in undo layer. MCP server + Codex hooks checkpoint every run; restore in one command. Works with Cursor, Claude Code, Windsurf, Copilot." />
<!-- og:title 46 chars | og:description 159 chars -->

<!-- OG Pair 3 (social-proof angle) -->
<meta property="og:title" content="The Undo Button Codex CLI Is Missing" />
<meta property="og:description" content="agent-rollback gives Codex CLI a Git-like safety net: snapshot, diff, and rollback any AI edit. MCP + hooks, free, MIT, zero Git required. npm i -g agent-rollback." />
<!-- og:title 36 chars | og:description 163 chars -->

<!-- OG Pair 4 (use-case, 1-line) -->
<meta property="og:title" content="Bad Codex Edit? Roll Back in 1 Command" />
<meta property="og:description" content="Snapshot your workspace before Codex runs, diff what it changed, and restore files instantly. `arb` is the alias. Free, MIT, ~zero disk via content-addressed dedupe." />
<!-- og:title 38 chars | og:description 165 chars -->

<!-- OG Pair 5 (CLI-positioning, brand-led) -->
<meta property="og:title" content="agent-rollback - Undo, Revert, Rollback for Codex CLI" />
<meta property="og:description" content="The CLI + MCP server + Codex hook for checkpointing AI-edited code. `arb` snapshots, diffs, and restores. Works with Claude Code, Cursor, Windsurf, Copilot, Cline, Gemini." />
<!-- og:title 53 chars | og:description 171 chars -->
```

---

## 5. Twitter Card variations (5, 70-char title / 200-char desc)

```html
<!-- TW 1 (question hook) -->
<meta name="twitter:title" content="Codex Undo: Snapshot, Diff, and Roll Back in 1 Command" />
<meta name="twitter:description" content="Bad Codex edit? `arb` snapshots before/after every run, diffs what changed, restores in 1 cmd. MCP + hooks auto-capture. Free, MIT. Works with Cursor, Claude, Copilot, Cline, Windsurf, Gemini." />
<!-- title 54 chars | desc 192 chars -->

<!-- TW 2 (bug-fix angle, targets #5082 / #6449 searchers) -->
<meta name="twitter:title" content="Reopen Codex, Hit Undo. The Rollback Layer You Wanted." />
<meta name="twitter:description" content="agent-rollback is a CLI + MCP server + Codex hook that gives you Git-like undo for AI edits. Snapshot, diff, restore. Zero Git. Free, MIT. npm i -g agent-rollback." />
<!-- title 54 chars | desc 163 chars -->

<!-- TW 3 (commands-first) -->
<meta name="twitter:title" content="arb snapshot / arb diff / arb restore" />
<meta name="twitter:description" content="Three commands: snapshot, diff, restore. The Codex CLI undo layer. MCP + hooks auto-checkpoint. Free, MIT. Cursor, Claude Code, Windsurf, Copilot, Cline, Gemini CLI." />
<!-- title 35 chars | desc 165 chars -->

<!-- TW 4 (one-liner for retweets) -->
<meta name="twitter:title" content="Undo for Codex CLI" />
<meta name="twitter:description" content="Git-like rollback checkpoints for OpenAI Codex CLI. Snapshot, diff, restore files. MCP server + Codex hooks. Works with Claude Code, Cursor, Windsurf, Copilot, Cline, Gemini CLI. Free, MIT." />
<!-- title 19 chars | desc 189 chars -->

<!-- TW 5 (curiosity gap) -->
<meta name="twitter:title" content="The Codex Undo Button Git Doesn't Give You" />
<meta name="twitter:description" content="agent-rollback checkpoints every Codex run via MCP + hooks. Snapshot, diff, rollback. Zero cloud, zero Git, ~zero disk. Alias `arb`. Free, MIT. npm i -g agent-rollback." />
<!-- title 42 chars | desc 168 chars -->
```

---

## 6. Current vs recommended (package.json description)

| Field | Current | Recommended | Why |
|-------|---------|-------------|-----|
| `description` (chars) | 156 | 149 (D1) | Same length, but current buries the SERP-winning keywords inside two long clauses. D1 front-loads "undo, revert, rollback checkpoints" - the exact 3-word set that appears in real queries for "codex undo" / "codex rollback" intent. |
| Keyword in first 60 chars | "Git-like undo and rollback checkpoints for OpenAI" (current: yes, but verbose with "&") | "Git-like undo, revert, and rollback checkpoints for OpenAI" | Three explicit intent keywords vs one hyphenated phrase. |
| Specificity | Lists 6 agents at the end, after the value prop | Drops the agent list (move to keywords array) | Search snippets truncate; "Works with X" appears in D2/OG. The description is the wrong place to enumerate agents. |
| Action verb first | "Git-like..." (adjective first) | "Git-like undo..." (adjective + noun + verb) | Both start with qualifier, but D1 leads with the action class ("undo, revert, rollback") that matches user queries. |
| Free/MIT signal | Absent | "Free, MIT licensed" | Helps click conversion for dev-tools; matches competitor disclosure norm. |
| "MCP" placement | Mid-string | Front of second sentence | Reddit/GitHub-issue searchers use "MCP" as a discoverability term. |
| "before and after" framing | "before and after Codex edits" | "every edit" (D1) / "before/after every Codex run" (TW1) | "Before/after every run" is a clearer mental model and matches hook semantics. |

**Verdict:** the current description is decent for an internal README, but the keyword order and density under-perform for SERP. Swap to D1 (150 chars) for the npm-visible description; keep a longer version for the README H1.

---

## 7. Copy-paste replacement strings for package.json

### 7a. `description` field (D1, 150 chars)

Replace the current `description` value with:

```json
"description": "Git-like undo, revert, and rollback checkpoints for OpenAI Codex CLI. MCP server + hooks snapshot every edit. Restore in one cmd. Free, MIT licensed."
```

### 7b. Drop-in JSON snippet (top of package.json)

```json
{
  "name": "agent-rollback",
  "version": "1.0.1",
  "description": "Git-like undo, revert, and rollback checkpoints for OpenAI Codex CLI. MCP server + hooks snapshot every edit. Restore in one cmd. Free, MIT licensed.",
  ...
}
```

### 7c. `keywords` array - reorder + add (helps npm search + `agent-rollback npm` SERP disambiguation)

Move SERP-winning keywords to the top, add brand + disambiguators that fight the "pi-rollback / SO rollback-npm" SERP pollution:

```json
"keywords": [
  "agent-rollback",
  "codex-undo",
  "codex-revert",
  "codex-checkpoint",
  "codex-rollback",
  "codex-snapshot",
  "codex-backup",
  "codex-safety-net",
  "codex-mcp",
  "codex-restore",
  "codex-diff",
  "codex-file-history",
  "openai-codex",
  "codex-cli",
  "ai-rollback",
  "agent-snapshot",
  "ai-undo",
  "ai-revert",
  "ai-checkpoint",
  "ai-safety-net",
  "mcp-server",
  "model-context-protocol",
  "claude-code",
  "cursor",
  "windsurf",
  "copilot",
  "cline",
  "gemini-cli",
  "undo",
  "revert",
  "rollback",
  "checkpoint",
  "snapshot",
  "diff",
  "restore",
  "safety-net",
  "ai-agent",
  "agent",
  "cli",
  "mcp",
  "dev-tools",
  "developer-tools"
]
```

Added terms: `agent-rollback`, `codex-restore`, `codex-diff`, `codex-file-history`, `ai-rollback`, `agent-snapshot`, `ai-undo`, `ai-revert`, `ai-checkpoint`, `ai-safety-net`. These directly counter the SERP pollution for "agent-rollback npm" (where pi-rollback + Stack Overflow `npm rollback` currently rank).

### 7d. `homepage` field (add UTM-less npm link for clarity)

```json
"homepage": "https://github.com/Nainish-Rai/agent-rollback#readme"
```
(unchanged - already correct)

---

## 8. CORE-EEAT alignment check

| Check | Status | Notes |
|-------|--------|-------|
| **C01 Intent Alignment** | PASS | D1 / G2 / T1 all front-load the exact phrases ("codex undo", "codex rollback", "git-like safety net for AI-edited code") that the Reddit r/codex "Is there a revert/undo?" thread and openai/codex#5082 / #6449 issue titles contain. |
| **C02 Direct Answer** | PASS | Each meta string answers "what is this?" in one line: CLI + MCP + hook, snapshot/diff/restore, free, MIT. No filler. |

**C03-C08** (Experience, Expertise, Authoritativeness, Trust, Schema coverage, Source provenance) belong to schema-markup-generator and on-page content - flag as next-skill handoff (see below).

---

## 9. CTR optimization notes

- **Front-load the action class, not the brand.** "agent-rollback" alone wins no clicks; "Codex Undo & Rollback" wins the "codex undo" / "codex rollback" SERP. Brand goes second.
- **Number + command = curiosity.** "1 Command" / "1 cmd" reliably lifts CTR on dev-tools SERPs; T2 and OG1 both use it.
- **Em-dash vs colon vs pipe:** stick with ASCII (`-`, `:`, `,`) to avoid character-count surprises across npm/web crawlers that count em-dash as 2 or 3 bytes.
- **Disambiguate from "npm rollback".** The "agent-rollback npm" SERP currently returns `pi-rollback` and SO "how to rollback operation npm" - both off-intent. Including "Codex CLI" + "MCP" + "AI-edited" in the first 100 chars steers the disambiguation right.
- **Free + MIT in description** lifts click conversion for dev-tools by ~5-10% (industry norm; no Measured data for this package - **Estimated**).
- **A/B test plan:** T1 vs T4 as README H1; D1 vs D2 in package.json (requires re-publish); G2 vs G1 on the GitHub repo About box (Settings -> General -> Description).
- **Tradeoff:** D1 (recommended) drops the explicit agent list to gain keyword density. Keep the list in `keywords[]` (7c) so search engines still surface it for "cursor rollback" / "windsurf undo" / "cline revert" long-tail queries.

---

## 10. Handoff summary

| Field | Value |
|-------|-------|
| Skill | meta-tags-optimizer v9.9.10 |
| Skill contract done when | 5 titles + 3 npm descs + 3 GH descs + 5 OG pairs + 5 Twitter cards delivered, all within char limits, keyword front-loaded, C01/C02 pass. **All met.** |
| Primary next skill | `schema-markup-generator` - add `SoftwareApplication` + `Code/SoftwareSourceCode` JSON-LD to the GitHub Pages site so the npm + repo pair gets rich-result eligibility. |
| Save path | `marketing/seo-audit/02-meta-tags.md` (this file) |
| Promote to `memory/hot-cache.md` | Approved angles: "Git-like safety net for AI-edited code" (G2 lead), "1 command" framing, "zero Git / zero cloud / ~zero disk" differentiator. |
| Promote to `memory/open-loops.md` | A/B test data not yet collected (Measured: N/A); revisit after 30 days of npm traffic. |
| Publish blockers | None. D1 is publish-ready. G2 is publish-ready in the GitHub About box. |
| Pending decisions | (a) Whether to keep "Codex CLI" or "OpenAI Codex CLI" in first 60 chars (current D1 uses "OpenAI Codex CLI" - 8 chars longer than "Codex CLI" but more specific). (b) Whether to A/B T1 vs T4 in the README H1 this week. |
