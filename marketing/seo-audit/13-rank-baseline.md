# Rank Baseline — `agent-rollback` v1.0.1

**Domain**: `github.com/Nainish-Rai/agent-rollback` (primary landing) · `npmjs.com/package/agent-rollback` (secondary)
**Market**: Global · **Device**: Desktop + Mobile · **Language**: en-US · **Date**: 2026-06-11
**Status**: **BASELINE** — first snapshot, no prior data. All positions labeled "First snapshot" with movement column = N/A.
**Source labels used below**: **Measured** = tool/export · **User-provided** = parallel-cli data from prior audits · **Estimated** = model inference

> **Data note**: Live `parallel-cli search` could not be executed in this subagent environment. SERP data below is sourced from `01-on-page-audit.md` and `02-serp-analysis.md` (user-provided parallel-cli results, dated 2026-06-11). All volume + difficulty figures are **Estimated** unless otherwise marked.

---

## 1. Setup

| Field | Value |
|---|---|
| Tracked keywords | 13 (12 product/BR + 1 brand) |
| Market | Global / en-US |
| Device | Both (Google default = mobile-first) |
| Update frequency | Weekly (default); daily for BOFU group for first 30 days |
| Competitor watchlist | `openai/codex` GitHub (Issues + README), `reddit.com/r/ChatGPT`, `stackoverflow.com`, `pi-rollback` npm, `agentame` npm, `A386official/diffback` GH, `codex-revert` (mcpmarket MCP skill) |
| Priority groups | **P0 Brand** (must hold #1) · **P0 BOFU** (high-intent, ~0 competition) · **P1 MOFU** (informational, low comp) · **P2 TOFU/head** (broader, slower) |

---

## 2. Keyword Ranking Table (Baseline)

| # | Keyword | Priority | Current Position | Source | URL Ranking | What's #1 Today | AI Overview | Featured Snippet | Est. Volume (mo) | Difficulty (KD) | Source |
|---|---|---|---:|---|---|---|---|---|---:|---:|---|
| 1 | `codex undo` | P1 MOFU | **Not ranking (first snapshot)** | User-provided parallel-cli | n/a | `github.com/openai/codex` README + Issues (#5082) | Likely (N/A) | None observed | 50–150 | 10–15 (⬛ Low) | Estimated |
| 2 | `codex cli undo` | P1 MOFU | **Not ranking (first snapshot)** | User-provided parallel-cli | n/a | `github.com/openai/codex` README | Likely (N/A) | None observed | 30–80 | 12–18 (⬛ Low) | Estimated |
| 3 | `codex checkpoint` | P1 MOFU | **Not ranking (first snapshot)** | User-provided parallel-cli | n/a | `github.com/openai/codex` Issue #2788 | Possible (N/A) | None observed | 80–200 | 10–15 (⬛ Low) | Estimated |
| 4 | `codex rollback` | **P0 BOFU** | **Not ranking (first snapshot)** | User-provided parallel-cli | n/a | `github.com/openai/codex` Issue #6449 | Unlikely (N/A) | None | 20–60 | 5–10 (⬛⬜ Very Low) | Estimated |
| 5 | `codex revert` | P1 MOFU | **Not ranking (first snapshot)** | User-provided parallel-cli | n/a | `stackoverflow.com` + Reddit | Possible (N/A) | None observed | 50–150 | 12–16 (⬛ Low) | Estimated |
| 6 | `codex safety net` | **P0 BOFU** | **Not ranking (first snapshot)** | User-provided parallel-cli | n/a | n/a (zero content) | No | None | 5–20 | 5–8 (⬛⬜ Very Low) | Estimated |
| 7 | `agent snapshot layer` | **P0 BOFU** | **Not ranking (first snapshot)** | User-provided parallel-cli | n/a | n/a (zero competitors) | No | None | 0–10 | 3–5 (⬛⬜ Very Low) | Estimated |
| 8 | `ai agent checkpoint` | P2 TOFU | **Not ranking (first snapshot)** | User-provided parallel-cli | n/a | Generic AI blog posts | Likely (N/A) | None observed | 30–100 | 8–12 (⬛⬜ Very Low) | Estimated |
| 9 | `codex mcp server` | P2 TOFU | **Not ranking (first snapshot)** | User-provided parallel-cli | n/a | `modelcontextprotocol.com` (MCP spec) | Unlikely (N/A) | None | 30–80 | 15–20 (⬛ Low) | Estimated |
| 10 | `snapshot ai edited code` | P1 MOFU | **Not ranking (first snapshot)** | User-provided parallel-cli | n/a | `stackoverflow.com` (Q&A) | Likely (N/A) | None observed | 20–60 | 5–10 (⬛⬜ Very Low) | Estimated |
| 11 | `npm codex undo` | **P0 BOFU** | **Not ranking (first snapshot)** | User-provided parallel-cli | n/a | n/a (zero npm results) | No | None | 0–10 | 3–7 (⬛⬜ Very Low) | Estimated |
| 12 | `agent-rollback npm` | **P0 Brand** | **Not ranking in Google organic, but `npmjs.com/package/agent-rollback` exists** | User-provided | n/a (npm page indexed) | `npmjs.com/package/agent-rollback` (likely self-link canonical) | No | None | 0–10 (too new) | 0–3 (Brand) | Estimated |
| 13 | `agent-rollback github` | **P0 Brand** | **Likely #1 — our own GH repo** | User-provided | `github.com/Nainish-Rai/agent-rollback` | `github.com/Nainish-Rai/agent-rollback` (self) | No | None | 0–10 (too new) | 0 (Brand) | Estimated |

### Position Distribution (first snapshot)

| Bucket | Count | Share | Action |
|---|---:|---:|---|
| #1 | 1 (likely) | 7.7% | Hold (Brand) |
| #2–10 | 0 | 0% | 90-day target |
| #11–20 | 0 | 0% | 90-day target |
| #21–50 | 0 | 0% | 30-day target |
| #51–100 | 0 | 0% | — |
| Not ranking | 12 | 92.3% | First snapshot, expected |

**Average position**: N/A (no rankings to average). Will populate after first weekly check.

---

## 3. 3-Month Target Ranking (per keyword)

Targets are gated by **priority tier**, not uniform 90-day goals. Realistic for v1.0.1 + 460 weekly dl + 1 strong landing page + 1 GH Pages docs site (deferred to 500 dl).

| # | Keyword | 30-day | 90-day | 6-month | Stretch (12-mo) | Why |
|---|---|---|---|---|---|---|
| 1 | `codex undo` | Top 50 | Top 20 | Top 10 | Top 5 (featured snippet) | High volume; competing with openai/codex#5082 (GitHub authority). Need backlinks + H1/H2 keyword fix (see 01-on-page-audit). |
| 2 | `codex cli undo` | Top 30 | Top 10 | Top 5 | Top 3 | Slightly less competitive than #1. Long-tail win. |
| 3 | `codex checkpoint` | Top 50 | Top 20 | Top 10 | Top 5 | Competing with openai/codex#2788 (the canonical issue). Bridge via linking the issue. |
| 4 | `codex rollback` | **Top 10** | **#1–3** | **#1** | #1 (defend) | **PRIMARY target.** Near-zero competition. P0 BOFU. 30-day #1 is realistic. |
| 5 | `codex revert` | Top 30 | Top 10 | Top 5 | Top 3 | Synonym traffic. Will rank when #4 ranks. |
| 6 | `codex safety net` | **#1** | **#1** | **#1** | #1 (defend) | **Blue ocean.** Zero content exists. Just need the words on the page + 1–2 backlinks. |
| 7 | `agent snapshot layer` | **#1** | **#1** | **#1** | #1 (defend) | **Our brand positioning term.** Should rank #1 the day it gets indexed. |
| 8 | `ai agent checkpoint` | Top 30 | Top 10 | Top 5 | Top 3 | Cross-tool; benefits once we add Claude Code / Cline support docs. |
| 9 | `codex mcp server` | Top 50 | Top 20 | Top 10 | Top 5 | Anthropic owns MCP docs. Need FAQ schema + 1–2 backlinks. |
| 10 | `snapshot ai edited code` | **Top 10** | **#1–5** | **#1** | #1 (defend) | Pain-point keyword. Zero dedicated content. Write one blog post → #1 within 90 days. |
| 11 | `npm codex undo` | **#1** | **#1** | **#1** | #1 (defend) | The day npm indexes our `keywords` + `description`, we win. Verify with site:npmjs.com. |
| 12 | `agent-rollback npm` | **#1** | **#1** | **#1** | #1 (defend) | Brand. The npm page is result #1 once Google indexes it. Verify. |
| 13 | `agent-rollback github` | **#1** | **#1** | **#1** | #1 (defend) | Brand. Self-canonical. Will be #1 day-of-index. |

### Target Summary

| Window | "Wins" (top 10 or #1) | "Stretch" (top 3 or #1) | "Aspirational" (top 5) |
|---|---:|---:|---:|
| **30 days** | 6 of 13 (#4, 6, 7, 10, 11, 12, 13) | 6 of 13 | 0 |
| **90 days** | 11 of 13 | 9 of 13 | 2 (codex undo, codex checkpoint) |
| **6 months** | 13 of 13 | 13 of 13 | 13 of 13 |

**Realistic top-1 count at 30 days: 6.** At 90 days: **9 of 13**. All 13 should rank in top 10 by 6 months with consistent execution of on-page fixes + 5–10 backlinks.

---

## 4. AI Overview / Perplexity / ChatGPT Citation Status

Baseline = first snapshot, **all currently 0** (Confirmed via 05-entity-audit P3 signals #28–30).

| Query | Engine | Currently Cited? | Citation Position | Source URL | Trend | Source |
|---|---|:---:|---|---|---|---|
| "How do I undo a Codex change?" | **ChatGPT** | ❌ Not cited | n/a | n/a | First snapshot | 05-entity-audit P3 #28 |
| "How do I undo a Codex change?" | **Perplexity** | ❌ Not cited | n/a | n/a | First snapshot | 05-entity-audit P3 #29 |
| "How do I undo a Codex change?" | **Google AI Overview** | ❌ Not mentioned | n/a | n/a | First snapshot | 05-entity-audit P3 #30 |
| "What's the best Codex safety net?" | **ChatGPT** | ❌ Not cited | n/a | n/a | First snapshot | 05-entity-audit P3 #28 |
| "What's the best Codex safety net?" | **Perplexity** | ❌ Not cited | n/a | n/a | First snapshot | 05-entity-audit P3 #29 |
| "agent-rollback" (brand) | **ChatGPT** | ❌ "No return" (entity unrecognized) | n/a | n/a | First snapshot | 05-entity-audit §1.3 + P3 #28 |
| "agent-rollback" (brand) | **Perplexity** | ❌ "No return" (entity unrecognized) | n/a | n/a | First snapshot | 05-entity-audit P3 #29 |
| "agent-rollback" (brand) | **Google AI Overview** | ❌ Not mentioned | n/a | n/a | First snapshot | 05-entity-audit P3 #30 |

**Citation rate today**: 0% (0 of 8 monitored queries return agent-rollback as a source).

**Cited sources today (estimated)**: openai/codex README, openai/codex#5082, Stack Overflow "how to undo AI-generated code" threads, Reddit r/ChatGPT, dev.to indie posts. (User-provided parallel-cli; verify in GEO re-test.)

### AI-Citation Targets (90-day)

| Query | Engine | Target | Levers |
|---|---|---|---|
| "How do I undo a Codex change?" | ChatGPT + Perplexity | **Cited #1** | Add "What is agent-rollback?" definition + "How to undo Codex changes" answer block at top of README (per 04-geo-audit §3 blocks 1 + 2). |
| "What's the best Codex safety net?" | Perplexity | **Cited (any position)** | Comparison table moved above the fold; explicit naming of self as the answer. |
| "agent-rollback" (brand) | ChatGPT | **Recognized entity** | Wikidata entry (per 05-entity-audit §4.1) + 3+ authoritative mentions (Show HN + dev.to + Product Hunt). |
| "agent-rollback" (brand) | Perplexity | **Cited (any position)** | Same as ChatGPT; Perplexity is retrieval-heavy — needs indexed pages. |

---

## 5. Recommended Alerts (alert-manager skill)

Threshold tuning: today = baseline. All thresholds labeled **Estimated**; tighten after first 2-3 weekly checks.

| Alert | Trigger | Threshold | Priority | Cadence | Source |
|---|---|---|---|---|---|
| **BOFU #1 lost** | `codex rollback` / `codex safety net` / `npm codex undo` / `agent-rollback npm` drops from top 10 | Position > 10 for any BOFU keyword | **Critical** | Daily (first 30d), then weekly | Estimated (alert-manager Quick Ref) |
| **Brand #1 lost** | `agent-rollback github` or `agent-rollback npm` drops from #1 | Position > 1 | **Critical** | Weekly | Estimated |
| **MOFU top-20 loss** | `codex undo` / `codex cli undo` / `codex checkpoint` / `codex revert` drops out of top 20 | Position > 20 | **High** | Weekly | Estimated |
| **TOFU drop** | `codex mcp server` / `ai agent checkpoint` drops > 5 positions | Delta ≤ -5 | **Medium** | Weekly | Estimated |
| **AI citation loss** | ChatGPT/Perplexity/GAIOverview previously cited us for a target query, now returns 0 | Any regression | **High** | Monthly | Estimated |
| **Competitor enters SERP** | Any new domain (not in watchlist) appears in top 10 for `codex undo` / `codex rollback` | Any new entrant | **High** | Weekly | Estimated |
| **AI Overview ownership** | Google's AI Overview snippet pulls a competitor URL for our 5 priority queries | Any non-openai/codex URL | **High** | Weekly | Estimated |
| **Featured snippet loss** | We owned featured snippet for any tracked query, now don't | Any loss | **Medium** | Weekly | Estimated |

**Response plan (per alert-manager)**:
- **Critical** (BOFU #1 lost, Brand #1 lost): respond within 24h — full on-page diagnostic + content push.
- **High** (MOFU loss, AI citation loss, competitor enters): respond within 1 week — content refresh + backlink audit.
- **Medium** (TOFU drop, snippet loss): respond within 2 weeks — schedule for next sprint.

---

## 6. Tracking Cadence

| Keyword Group | Cadence | Tool | Reason |
|---|---|---|---|
| **P0 Brand** (kw #12, #13) | Weekly | GSC + manual incognito | Position is #1-or-bust; rare changes; cheap to check. |
| **P0 BOFU** (kw #4, #6, #7, #10, #11) | **Daily for 30 days**, then weekly | GSC + rank tracker | High-value, ~0 competition → first to rank, first to defend. |
| **P1 MOFU** (kw #1, #2, #3, #5) | Weekly | GSC + rank tracker | Slower movement expected. |
| **P2 TOFU** (kw #8, #9) | Bi-weekly | GSC + rank tracker | Slower movers; saves noise. |
| **AI citations** (8 queries) | Monthly | Manual ChatGPT/Perplexity/GAIOverview checks | LLM responses stable month-to-month unless content changes. |
| **Competitor SERP** (4 watchlist URLs) | Weekly | Manual SERP scrape (5-10 min) | Watch for new entrants on BOFU terms. |

**Total weekly check time budget**: 30 min (10 keywords × 2 min + 8 AI queries × 1 min + 5 min SERP scan).

---

## 7. Tools (No Paid Rank Tracker)

We have **no paid rank tracker**. Stack to use:

| Tool | Use | Cost | Notes |
|---|---|---|---|
| **Google Search Console** (GSC) | Daily impression + position + CTR for all 13 keywords | Free | **The single most important tool.** Tells us exact Google position for queries that already show our page. Set up 13 query filters in "Performance". |
| **Bing Webmaster Tools** | Bing position (smaller audience, but free data) | Free | Lower priority but free. |
| **SerpBear** (self-hosted) | Daily rank tracking for 13 keywords across 1 location | Free, open-source | Runs on a $5/mo VPS or fly.io. Best free option. https://github.com/torvalds/serpbear (verify URL). |
| **Google Incognito** (`site:github.com/Nainish-Rai/agent-rollback`) | Manual SERP audit | Free | Branded queries only — verifies we're #1. |
| **Manual SERP check** (incognito, no VPN) | Weekly BOFU spot check | Free | 5 min for the 7 BOFU/brand keywords. |
| **npm download trends** (`npmtrends.com/agent-rollback`) | Demand proxy | Free | Volume of installs ≈ interest signal. |
| **Google Alerts** | Brand mention + "codex undo" mentions | Free | Citation check. Set up 3 alerts: "agent-rollback", "codex undo", "codex safety net". |
| **Ahrefs/SEMrush free tier** | Backlink + KD spot check | Free (limited) | Use 1×/month for KD validation. |

**Stack recommendation**: GSC (primary) + SerpBear (daily ranks) + Google Alerts (citation) + manual weekly check. **Total cost: $0 + 1 hr setup.**

---

## 8. Biggest Movers & Likely Causes (Hypothesis)

Since this is the **first snapshot**, no "movement" exists. The hypothesis section is for what to expect:

| Hypothesis | Trigger | Expected Impact |
|---|---|---|
| H1: Brand queries (`agent-rollback github`, `agent-rollback npm`) will be #1 within 7 days of GSC indexing | Google crawl of repo + npm page | +2 top-1 keywords |
| H2: `codex safety net` will hit #1 in 30 days | Zero competition + title/body match | +1 top-1 keyword |
| H3: `agent snapshot layer` will hit #1 in 30 days | Zero competition + we own the term | +1 top-1 keyword |
| H4: `npm codex undo` will hit #1 in 30 days | `package.json` keywords array + npm SERP monopoly | +1 top-1 keyword |
| H5: `codex rollback` will reach top 10 in 30 days, top 3 in 90 days | Open Issue #6449 has low DR; once we outrank with our npm page + README | +1 BOFU win |
| H6: `codex undo` and `codex checkpoint` will plateau at top 10–20 for 6 months | GitHub authority of openai/codex#5082 + #2788 | Slow burn; need backlinks |
| H7: AI citations will not start until Wikidata + Show HN | Need 3+ authoritative mentions (per 05-entity-audit P3) | 90-day inflection |

---

## 9. Recommendations (immediate, this month, next quarter)

| When | Action | Expected Impact | Source |
|---|---|---|---|
| **Immediate (today)** | Verify `agent-rollback github` is #1 in incognito Google; verify `agent-rollback npm` is #1 | Confirms brand baseline | 01-on-page-audit |
| **Immediate (today)** | Install Google Search Console on `github.com/Nainish-Rai/agent-rollback` (use "URL Inspection" → request indexing) | Starts position data flowing | — |
| **Immediate (today)** | Set up Google Alerts for 3 terms: `agent-rollback`, `codex undo`, `codex safety net` | Citation monitoring | — |
| **This week** | Fix H1 to `# agent-rollback — codex undo, revert, and rollback checkpoints` | +5 to P0/1 rankings | 01-on-page-audit Fix #1 |
| **This week** | Rewrite `package.json` `description` to lead with "codex undo, revert, and rollback CLI" | +3 to npm SERP | 01-on-page-audit Fix #4 |
| **This week** | Move FAQ + "What is agent-rollback?" + "How to undo Codex changes" block to top of README | Unlocks ChatGPT/Perplexity citation | 04-geo-audit Changes #1, #2 |
| **This month** | Submit PR to 3 awesome-lists (awesome-ai-agents, awesome-claude-code, awesome-cli-apps) | 3 backlinks → P1 keywords start moving | 03-competitor-landscape §"Where to List" |
| **This month** | Publish 1 dev.to post: "How to undo Codex CLI changes" (target `codex undo` + `codex cli undo`) | Long-tail content wins | 04-geo-landscape |
| **This month** | Deploy SerpBear on free tier; set up daily tracking for 7 BOFU/brand keywords | Daily visibility | §7 above |
| **Next quarter** | Submit Show HN: "agent-rollback — undo for Codex CLI" | 1 link from HN → biggest single authority boost; +20 to P1 keywords | 03-competitor-landscape |
| **Next quarter** | Create Wikidata Q-item for agent-rollback (per 05-entity-audit §4.1) | Unlocks AI entity recognition → citations start | 05-entity-audit |
| **Next quarter** | Cross-post canonical URL across: npm, GH, awesome-lists, dev.to, HN, Product Hunt, Wikidata, schema.org | Cross-platform entity graph | 05-entity-audit §4 |
| **At 500 weekly dl** (deferred) | Build docs site (Astro + GitHub Pages) with `SoftwareApplication` + `FAQPage` + `HowTo` JSON-LD | +10-15 ranking boost + featured snippet eligibility | 06-technical-audit §3 |

---

## 10. Open Loops (to `memory/open-loops.md`)

> Standard handoff per skill contract.

- [ ] **No `memory/` directory in this project** — promoting to `marketing/seo-audit/open-loops.md` (project-local equivalent) for visibility with the rest of the marketing stack. Confirm with user whether to create a project-level `memory/` tree or stick with `marketing/seo-audit/`.
- [ ] **Live SERP validation pending** — once `parallel-cli search` is available, re-run all 13 queries and update the table with Measured positions. Estimate: <1 hr.
- [ ] **Live AI citation re-test pending** — run 8 entity queries in ChatGPT + Perplexity + Google AI Mode and record results in `marketing/ai-recognition-log.md` (per 05-entity-audit §1.3). Estimate: 30 min.
- [ ] **Brand #1 verification pending** — confirm `agent-rollback github` and `agent-rollback npm` are #1 in incognito Google for both brand queries. 5-min check.
- [ ] **Decide on docs site trigger** — confirmed threshold: 500 weekly dl OR competitor in SERP for `codex undo`. Tracked in 06-technical-audit. No action now.
- [ ] **Decide on `memory/monitoring/` directory** — skill expects writes there; project has none. Decision: write next snapshot to `marketing/seo-audit/14-rank-week-1.md` (project-local) until user confirms otherwise.

---

## 11. Next Snapshot

**Date**: 2026-06-18 (7 days from baseline)
**Focus**: Verify brand #1 hold; record first BOFU movements; confirm GSC position data exists.
**Owner**: rank-tracker (this skill)
**Hand off to**: [alert-manager](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/monitor/alert-manager/SKILL.md) (next-best per skill contract) — to wire up the §5 alerts to actual monitoring once cadence is validated.

---

*Generated 2026-06-11 · Source files: `marketing/seo-research/01-keyword-landscape.md`, `02-serp-analysis.md`, `03-competitor-landscape.md`, `04-geo-landscape.md`; `marketing/seo-audit/01-on-page-audit.md`, `04-geo-audit.md`, `05-entity-audit.md`, `06-technical-audit.md`, `07-content-quality-audit.md`. SERP rankings are user-provided (parallel-cli) from prior audits; volumes + difficulty are Estimated (model inference, not measured).*
