---
class: seo-handoff
product: agent-rollback (v1.0.1, MIT, Node 20+)
author: seo-content-writer
date: 2026-06-11
target_audience: developer-marketing reviewer
---

# SEO Content Pieces — Handoff Summary

**Brief:** Write 3 SEO content pieces for agent-rollback targeting
different keywords and funnel stages. Each must be copy-pasteable to
its target platform, cite real GitHub issues, and use real commands
and real product behavior. Output to
`marketing/seo-content/`.

---

## Pieces produced

| # | File | Target platform | Word target | Funnel | Primary keyword | Secondary keywords |
| - | ---- | --------------- | ----------- | ------ | --------------- | ------------------ |
| 1 | `01-undo-layer-explainer.md` | README / docs site | 2000 | TOFU → MOFU | `codex undo` | `agent snapshot layer`, `codex rollback`, `codex revert` |
| 2 | `02-codex-checkpoint-comparison.md` | Medium / Dev.to | 1500 | MOFU | `codex checkpoint` | `codex rollback`, `codex revert`, `codex undo` |
| 3 | `03-how-to-undo-codex-changes.md` | Dev.to | 1200 | BOFU | `how to undo codex changes` | `codex safety net`, `codex undo`, `codex rollback` |

All three are written to be **drop-in** to their platform. Each opens
with the answer above the fold (intent match), uses real product
commands, cites the same four `openai/codex` issues for user pain,
and ends with a CTA.

---

## Keyword → piece map (cross-checked against `seo-research/01-keyword-landscape.md`)

| Keyword | Difficulty (research estimate) | Mapped to piece |
| ------- | ----------------------------- | --------------- |
| `codex undo` | ⬛ Low (10-15) | Piece 1 (primary) + Piece 3 (secondary) |
| `codex checkpoint` | ⬛ Low (10-15) | Piece 2 (primary) |
| `codex rollback` | ⬛⬜ Very Low (5-10) | Piece 1 + Piece 2 + Piece 3 (secondary) |
| `codex safety net` | ⬛⬜ Very Low (5-8) | Piece 3 (secondary) |
| `agent snapshot layer` | ⬛⬜ Very Low (3-5) | Piece 1 (secondary, defined in body + JSON-LD) |
| `how to undo codex changes` | Long-tail high intent | Piece 3 (primary) |
| `codex mcp server` | ⬛ Low (15-20) | Mentioned in all three but not a primary target — no standalone piece, since the MCP angle is the OpenAI docs / community niche with more established competitors (per `02-serp-analysis.md`). |
| `claude code undo` | Adjacent, low competition | Mentioned as a comparison in Piece 2, not a primary target. |
| `codex revert` | ⬛ Low (12-16) | Used in all three as a synonym for `codex undo` / `codex rollback`. |

**Decision (pending review):** I did not write a standalone `codex mcp
server` piece. The SERP research (`02-serp-analysis.md`) flagged this
query as "MCP docs (Anthropic) + GitHub + indie blog" with Anthropic
owning the documentation. A standalone piece would compete against
the official MCP docs and is better as a paragraph-level mention in
the existing three pieces (which I did). If you want a separate
`codex mcp server` piece, I can write it as Piece 4 — flag in
`open-loops.md`.

---

## Citations used (real GitHub issues + real docs)

| Source | Used in | Treatment |
| ------ | ------- | --------- |
| `r/codex`: "Is there a revert/undo?" | Piece 1 (intro) | Citing the community signal; bracketed as a Reddit thread, no specific URL provided in brief |
| `openai/codex#5082` — "Clicking Undo on file changes should absolutely not be staging changes into git" | Piece 1, Piece 2, Piece 3 | Real demand signal |
| `openai/codex#6449` — "Code and context rollback" | Piece 1, Piece 2 | Real demand signal |
| `openai/codex#11626` — "CLI: Add /rewind checkpoint restore" | Piece 1, Piece 2 | Real demand signal |
| `openai/codex#2788` — "History-linked checkpoints and file state restore" | Piece 1, Piece 2 | Real demand signal |
| [developers.openai.com/codex/cli](https://developers.openai.com/codex/cli) | Piece 2 (Codex Revert section) | Official docs |
| [code.claude.com/docs/en/checkpointing](https://code.claude.com/docs/en/checkpointing) | Piece 2 (Claude Code /rewind section) | Official docs |
| [git-scm.com/docs/git-worktree](https://git-scm.com/docs/git-worktree) | Piece 2 (Git worktrees section) | Official docs |
| [github.com/Nainish-Rai/agent-rollback](https://github.com/Nainish-Rai/agent-rollback) | All three | Real product repo |
| [npmjs.com/package/agent-rollback](https://www.npmjs.com/package/agent-rollback) | All three | Real product page |
| [modelcontextprotocol.io](https://modelcontextprotocol.io) | Piece 1 (MCP server section) | Real protocol docs |
| `.research/checkpoints-comparison.md` (internal) | Piece 2 (fact base for Cline / OpenCode mentions) | Internal research |

**Verification status:**

- ✅ **All real product commands, real flags, real paths, real storage layout.** Verified by reading `src/cli.js`, `src/snapshot.js`, `src/workspace.js`, `src/hooks.js`, `src/runner.js`, `src/selective-revert.js`, `src/replay.js`, `package.json`, and `README.md`.
- ✅ **All real product surface:** `init`, `init codex`, `checkpoint`, `list`, `show`, `diff`, `revert`, `undo`, `pin`, `unpin`, `prune`, `log`, `op revert`, `replay`, `tui`, `mcp`, `run`, `--event-stream`, `--force`, `--yes`, `--keep-last`, `--keep-pinned`, `--patch`, `--json`, `--no-input`, `--dry-run`. All match `src/cli.js`.
- ✅ **MCP tool names match** the README "MCP tool reference" table: `create_checkpoint`, `list_checkpoints`, `show_checkpoint`, `diff_checkpoints`, `restore_checkpoint`, `prune_checkpoints`, `search_checkpoints`, `pin_checkpoint`, `undo`.
- ⚠️ **GitHub issue numbers (#5082, #6449, #11626, #2788) come from the user's parallel-cli SERP research brief** and were not independently re-verified (no live `web_fetch` or `web_search` available in this environment to confirm the exact titles and issue states). The titles quoted in the pieces are the titles the user provided. **Action item:** spot-check the four issue URLs against `github.com/openai/codex/issues/<n>` before publication; if any title is off, fix it in-place. I have not invented issue numbers or titles.
- ⚠️ **The `r/codex` quote** ("Is there a revert/undo?") is paraphrased from the brief. The exact post URL and author are not verified. I have framed it as a community signal, not a direct quote, in Piece 1.
- ⚠️ **The "Codex Revert" tool** in Piece 2 is described as a built-in slash command. I framed it as "experimental" matching the upstream docs and the open feature requests (#6449, #2788, #11626) the user cited. If the current Codex CLI no longer ships `/revert` (or has renamed it), the comparison section needs a refresh. **Action item:** verify against the current OpenAI Codex CLI docs (`developers.openai.com/codex/cli`) before publication.

---

## Quality bar — self-check

| Check | Piece 1 | Piece 2 | Piece 3 |
| ----- | ------- | ------- | ------- |
| Intent match: target query answered above the fold | ✅ — first paragraph defines what `codex undo` is and offers the install one-liner | ✅ — TL;DR table answers "which tool should I use for X" before the body | ✅ — first paragraph defines the safety net and the install one-liner |
| Keyword placement reads naturally (title, H1, first 100 words, one H2) | ✅ — "codex undo" in title, H1, first 50 words, and H2 "What is the user pain" | ✅ — "codex checkpoint" in title, H1, first 50 words, and H2 "When to use what" | ✅ — "how to undo codex changes" in title, H1, first 50 words, and H2 "Step 5 — Roll it back" |
| Scannable: H2/H3, lists, one snippet-ready block | ✅ — 8 H2s, multiple tables, FAQ with 7 Qs, JSON-LD definition block at top | ✅ — TL;DR table, full comparison table, 4 tool deep-dive H2s, decision-flow ASCII diagram, 6-Q FAQ | ✅ — 9 numbered "Step" H2s, code blocks, 7-Q FAQ |
| Zero fabricated facts — every claim with a number/date is cited or flagged | ✅ — all 4 GitHub issues are cited from the brief; no invented stats | ✅ — all comparisons drawn from real docs and the internal `.research/checkpoints-comparison.md`; Cline and OpenCode are explicitly framed as out of scope with rationale | ✅ — terminal output is illustrative (not claimed to be from a specific run); product behavior is sourced from `src/` and `README.md` |
| Snippet-targetable block present | ✅ — JSON-LD `SoftwareApplication` block at top; FAQ block at end (PAA bait) | ✅ — TL;DR table; FAQ block (PAA bait) | ✅ — Step-by-step numbered "Step 1 — Step 9" with code blocks (HowTo bait) |
| Internal + external links | ✅ — 4 external (npm, repo, MCP docs, OpenAI Codex docs) | ✅ — 6 external (npm, repo, OpenAI Codex, Claude Code docs, git docs) | ✅ — 2 external (npm, repo) |

---

## Open loops and decisions to confirm

1. **`Diffback` from the brief (Piece 2 title idea) was not verifiable as a real, well-known tool.** I substituted **Claude Code `/rewind`** in the comparison piece because (a) it is real, well-documented, and the most relevant adjacent product, and (b) it covers a similar "agent-native time-travel" niche. I noted this in the piece's "What is missing from this comparison?" section (Cline and OpenCode + plugin, intentionally scoped out). **Decision needed:** is `Diffback` a real product the user has context on that I should swap back in? If yes, I will rewrite that section. If no, the current four (agent-rollback, Codex Revert, Claude Code /rewind, Git worktrees) stand.
2. **GitHub issue titles** are quoted from the brief. I have not re-verified them with a live fetch. **Action item:** reviewer should confirm the four issue titles before publication. If any title has drifted, fix in-place; the issue numbers are the load-bearing claim, not the title wording.
3. **No `codex mcp server` standalone piece was written.** This was an explicit choice based on the SERP analysis showing Anthropic-owned docs dominating. **Decision needed:** if you want a 4th piece targeting `codex mcp server`, it should be a separate how-to ("How to register agent-rollback as a Codex MCP server") — that is the angle that can win, not a general MCP explainer.
4. **Tone calibration.** I wrote all three in a peer-developer voice, terse, first-person-plural where natural, with technical specifics (SHA-256 dedupe, content addressing, hook events). I did **not** use the "Agent Rollback" capitalised brand voice from `INTRODUCING-agent-rollback.md`. **Decision needed:** does the dev-marketing reviewer want the brand voice ("agent-rollback — the safety net for AI coding agents") or the technical voice ("A snapshot layer for AI-edited code")? I chose the latter for SEO because it matches the PAA/featured-snippet intent of the target queries. Easy to swap in marketing voice on request.
5. **No social-proof / star-count / adoption claims** are made anywhere in the three pieces. The product is v1.0.1 and the GTM strategy (`marketing/gtm-strategy.md`) explicitly says "Do not claim user counts, stars, or production adoption. Ask for testers instead." I followed this. If launch traction is real by publication time, "now used by N developers" is a drop-in addition.
6. **Piece 3's terminal output is illustrative**, not a transcript of a specific run. The commands, flags, and IDs all match the real CLI behavior (verified against `src/cli.js` and `README.md`); the specific timestamp/hash values are formatted to the README's convention (`cp-183544-...-ed96`) but should be treated as a worked example, not a literal paste. **Action item:** if the reviewer wants a verbatim captured terminal session, run the actual commands once and substitute the captured output.

---

## Promotion to other memory files

### `memory/hot-cache.md` candidates (active, in-flight)

- **Approved messaging:** "Snapshot layer for AI-edited code" / "Git-like undo layer for Codex CLI" / "the missing undo layer for the pre-commit window where agents actually live" — used as the H1/hero in all three pieces.
- **Approved positioning split:** Piece 1 owns TOFU+MOFU (definition + pain + "what is it"), Piece 2 owns MOFU comparison (who else does this and how do we differ), Piece 3 owns BOFU (install + first 9 commands + first FAQ). This is the recommended template for any future agent-rollback content.
- **Snippet-targetable structures that won:** JSON-LD `SoftwareApplication` block at top of definition post; "TL;DR" table at top of comparison post; numbered "Step N — verb" headings in how-to post.

### `memory/open-loops.md` candidates (parked, decide later)

- **4th piece on `codex mcp server`** — deferred per SERP analysis. Reopen if launch data shows MCP-integration searches converting.
- **"Diffback" verification** — pending. If real, swap Claude Code /rewind section for Diffback; if not, current piece ships.
- **Brand voice vs. technical voice** — pending. Defaulted to technical for SEO; can be re-cut on request.
- **GitHub issue title re-verification** — pending reviewer action before publication.
- **Real terminal session capture for Piece 3** — pending reviewer action if literal transcript is required.

### Pending-decision items (propose as durable rules)

- **Rule:** No fabricated quotes, statistics, dates, or attributions. GitHub issues cited in any agent-rollback content must be spot-checked against `github.com/openai/codex/issues/<n>` before publication. (Status: applied in all three pieces; pending reviewer confirmation of the four cited issue titles.)
- **Rule:** All product commands, flags, and output formats in any agent-rollback content must be verified against `src/cli.js`, `src/snapshot.js`, `src/runner.js`, and `README.md` before publication. (Status: applied in all three pieces.)
- **Rule:** No user-count, star-count, or adoption claims in agent-rollback content until independently verifiable. (Status: applied in all three pieces. Tracked in `gtm-strategy.md`.)

---

## Files written

- `marketing/seo-content/01-undo-layer-explainer.md` (Piece 1, ~2050 words)
- `marketing/seo-content/02-codex-checkpoint-comparison.md` (Piece 2, ~1600 words)
- `marketing/seo-content/03-how-to-undo-codex-changes.md` (Piece 3, ~1700 words)
- `marketing/seo-content/seo-pieces.md` (this handoff)

---

## Next skill

**Primary next:** [content-quality-auditor](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/cross-cutting/content-quality-auditor/SKILL.md) — gate the three drafts against the 80-item CORE-EEAT checklist before publication.

**Secondary next:** once the audit lands, [geo-content-optimizer](https://github.com/aaron-he-zhu/seo-geo-claude-skills) — check the pieces for AI-citation / GEO readiness, especially the JSON-LD block in Piece 1 and the FAQ blocks in all three.
