# 11 — Backlink Strategy

> **Domain**: `github.com/Nainish-Rai/agent-rollback` (npm: `agent-rollback`, bin: `agent-rollback` / `arb`)
> **Positioning**: "undo for Codex CLI" / agent snapshot layer
> **Date**: 2026-06-11
> **Skill**: `backlink-analyzer` (see `.agents/skills/backlink-analyzer/SKILL.md`)
> **Data caveat**: no ~~link database connected. All figures below are **User-provided** unless tagged otherwise. Nothing is **Measured** from a tool export. All velocity targets are **Estimated** by category benchmarks for a brand-new OSS dev tool.

---

## 1. Current Backlink Profile

**Bottom line: effectively zero inbound links.** Source: User-provided.

| Metric | Value | Source | Note |
|---|---|---|---|
| Referring domains | 0 (User-provided) | 0 expected | New repo. No blog coverage yet. |
| Total backlinks | 0 (User-provided) | 0 expected | No press, no awesome-list inclusion. |
| GitHub stars | 0 (User-provided) | weak signal | Stars ≠ backlinks; GitHub profile link to the repo is the only "dofollow" we have. |
| Watchers / forks | 0 / 0 (User-provided) | — | — |
| DA / DR | N/A | no tool export | Domain is brand-new, sub-10 expected. |
| Dofollow ratio | N/A | no links to ratio | — |
| Net velocity | 0 | 0 | — |
| Toxic link share | 0% (computed: 0/0) | vacuous | Trivially healthy because empty. |
| Topical relevance | N/A | no links | — |
| **Profile health score** | N/A | — | Cannot score an empty profile. Re-score at 20+ RDs. |

**What we *do* have, link-wise (User-provided):**
- 1 self-controlled link: npm package page → GitHub repo (`homepage` field).
- 1 self-controlled link: GitHub repo → README anchors.
- 0 inbound editorial links. 0 inbound directory entries.

**Authority mix, geo, anchor mix:** all N/A.

---

## 2. Target Backlink List (24 prospects, prioritized)

> Categorized by *channel type*, not just DR. A DR-30 list inclusion beats a DR-70 one-off blog mention for OSS discovery. Sources: User-provided ecosystem research (parallel-cli doc in `marketing/seo-research/`).

### P0 — Foundational ecosystem (do first; convert to real link profile fast)

| # | URL | Type | Est. DR | Why it matters | Approach |
|---|---|---|---|---|---|
| 1 | `github.com/sindresorhus/awesome` (issue) | Awesome list | 100+ | Master hub; everything points here. | Open issue/PR requesting addition to "Node.js" or "CLI" sections. |
| 2 | `github.com/openai/codex` (discussions/issues) | Vendor forum | 95+ | "Safety / undo" thread; we are the answer. | Comment with non-promotional solution to a "how do I undo Codex" question. |
| 3 | `modelcontextprotocol.io/inspector` and MCP server registries | MCP registry | 70+ | We ship an MCP server. Must be registered. | Submit to official MCP server registry / awesome-mcp-servers. |
| 4 | `github.com/punkpeye/awesome-mcp-servers` | Awesome list | 60+ | Active weekly; ours fits "Developer Tools" / "Safety" categories. | PR with one-line description, MIT license note, install snippet. |
| 5 | `github.com/wong2/awesome-mcp` | Awesome list | 50+ | Same approach. | PR. |
| 6 | `awesomelist.dev` / `awesome.libhunt.com` | Auto-aggregator | 50+ | Crawl awesome-* lists; high DR. | Ensure inclusion in any awesome-mcp-servers once indexed. |
| 7 | `npmjs.com/package/agent-rollback` | Package directory | 95+ | Already exists; ensure README renders + keywords surface "codex-undo", "codex-rollback". | Update package description, keywords, repository URL. Free. |
| 8 | `socket.dev` / `snyk.io/advisor` / `npm.trend` | Security/analytics | 70+ | Auto-indexed from npm. Verify claim and description. | Re-publish to trigger re-crawl. |
| 9 | `libraries.io` / `sourcegraph.com` | Code discovery | 75+ | Auto-indexed. | Confirm. |

### P1 — Niche lists & communities

| # | URL | Type | Est. DR | Approach |
|---|---|---|---|---|
| 10 | `github.com/jamesmurdza/awesome-ai-coding-tools` (or similar) | Awesome list | 40+ | PR with short value prop. |
| 11 | `github.com/ksaitor/awesome-codex` (if exists; otherwise awesome-openai) | Awesome list | 30+ | PR. |
| 12 | `github.com/e2b-dev/awesome-ai-agents` | Awesome list | 50+ | PR — agents category. |
| 13 | `github.com/aimerou/awesome-ai-safety` (or similar) | Awesome list | 30+ | Frame as AI-coding safety tool. |
| 14 | `github.com/awesome-claude-code` (if/when it exists) | Awesome list | 40+ | Frame as "works with Claude Code." |

### P2 — Distribution channels that *can* link (not guaranteed)

| # | URL | Type | Est. DR | Notes |
|---|---|---|---|---|
| 15 | `news.ycombinator.com` (Show HN) | Forum | 95+ | Quality of post drives link pickup. Best 1-day link burst. |
| 16 | `producthunt.com` | Launch | 90+ | Page = persistent dofollow link. |
| 17 | `dev.to` (own blog cross-posted) | Blog | 80+ | First-party; high DR, but counts as "self-control." Useful for anchor variety. |
| 18 | `medium.com` (own publication) | Blog | 95+ | Same as dev.to. Useful for anchor. |
| 19 | `hashnode.com` (own blog) | Blog | 75+ | Same. |
| 20 | `reddit.com/r/LocalLLaMA`, `/r/ClaudeCode`, `/r/OpenAI`, `/r/cursor`, `/r/programming`, `/r/singularity` | Forum | 95+ | Profile links (nofollow) on posts/comments; not SEO-juice but referral/brand. |
| 21 | `community.openai.com` | Vendor forum | 75+ | Profile + signature links (often nofollow but high trust). |
| 22 | `forum.cursor.com` | Vendor forum | 60+ | Same. |
| 23 | `github.com/cline/cline` (README) | Direct competitor | 65+ | Pitch integration: "Cline + agent-rollback = safe autonomous coding." |
| 24 | `github.com/continuedev/continue` (integrations docs) | Direct competitor | 55+ | MCP-native; request integrations-page listing. |

**Bonus reciprocal prospects (estimate +5 RDs):** `pi-rollback` (npm) — request cross-link in readmes if friendly; `aider.chat` integrations; `dive.dev` / Hacker Newsletter; Lobsters.

---

## 3. Outreach Template (terse, helpful, not spammy)

**Channel**: GitHub issue / PR comment / email — pick the channel the maintainer actually reads.

```
Subject: Add agent-rollback to <awesome-list> — undo/snapshot for Codex CLI

Hi <name>,

Thanks for maintaining <list> — I use it weekly.

Built a small tool I think fits: agent-rollback (MIT, npm).
It snapshots your workspace before Codex CLI / Claude Code / Cline
edits and lets you restore via `arb undo` or `arb diff <id>`.
MCP server included. ~7 GitHub releases, zero deps beyond
@modelcontextprotocol/sdk + zod.

- npm: https://www.npmjs.com/package/agent-rollback
- repo: https://github.com/Nainish-Rai/agent-rollback
- one-liner: npx agent-rollback snapshot
- license: MIT

If it's a fit, suggested entry under "Codex CLI" or "AI Agent Safety":

- [agent-rollback](...) — Snapshot/undo layer for Codex CLI
  and other CLI agents. MCP server + hooks for automatic safety net.

Happy to rework the blurb / move to a different section.

— Nainish
```

**Why it works:** short, named maintainer, value-first (says "I use it"), concrete install command, MIT, no marketing fluff, no "I'd love to" filler, gives the maintainer the exact diff they need.

**DO NOT** use the same template across 20 lists — vary 1–2 lines per target. Track replies in a spreadsheet.

---

## 4. Content That Earns Links (Link Magnets)

Three assets, ranked by estimated link-attraction:

### A. **"The AI Coding Safety Benchmark"** — `marketing/benchmark-ai-coding-safety.md` (Estimated impact: HIGH)
A reproducible test: take 5 popular agents (Codex, Claude Code, Cline, Roo, Continue), run 20 destructive prompt scenarios, measure "can the user recover the file?" Score them 0–5. Publish raw JSON + a leaderboard. **Link-attraction reason:** journalists and awesome-list maintainers cite benchmarks. Update quarterly → recurring links. **Effort:** M. **Anchor we'll earn:** "AI coding safety benchmark", "codex undo benchmark", "agent rollback benchmark".

### B. **"Codex CLI Undo: The Definitive Guide"** — `docs/codex-undo-guide.md` (Estimated impact: HIGH)
One-page canonical doc: every method to undo in Codex, ranked. Git revert, agent-rollback snapshot, filesystem snapshots, none. Includes a flow chart and a CLI transcript. **Link-attraction reason:** definitive guides are the #1 link target. **Effort:** S. **Anchors:** "how to undo codex cli", "codex cli undo", "codex rollback".

### C. **Comparison: agent-rollback vs git vs editor undo vs jj** — `.research/comparison-vs-others.md` (already drafted) → republish to blog (Estimated impact: MED)
A decision matrix with the 4–5 alternatives. Link-attraction reason: "X vs Y" content earns editorial links from awesome lists, vendor docs, newsletters. **Effort:** S (already drafted). **Anchors:** "agent-rollback vs jj", "codex snapshot tool", "agent safety net".

### D. (Bonus) **Stats post: "We tested 100 Codex sessions for recoverable errors"**
Tweet/blog with 1 chart → 30+ social shares → several blog citations. **Effort:** S. **Risk:** overstated stats will be challenged. Only ship if real.

### E. (Bonus) **MCP server: `mcp-codex-safety` listing on official registry**
Free permanent dofollow from `modelcontextprotocol.io`. **Effort:** S (server exists).

---

## 5. Distribution Channels Ranked by Expected Link Value

| Rank | Channel | Est. RDs earned in 90d | Link type | Notes |
|---|---|---|---|---|
| 1 | Hacker News Show HN | 5–20 | editorial, dofollow | High-variance. Quality of post is everything. Title matters more than domain. |
| 2 | GitHub awesome-* lists (10 PRs) | 8–15 | editorial, mostly dofollow | Highest ROI for a new OSS tool. **Do this first week.** |
| 3 | Product Hunt launch | 1 persistent page (DR 90) + 1–3 secondary | profile, dofollow | Anchor variety. Schedule same week as HN. |
| 4 | dev.to / Hashnode / Medium long-form | 3 (self-controlled but high DR) | self, dofollow | Useful for anchor mix; not third-party RDs. |
| 5 | Reddit r/LocalLLaMA, r/ClaudeCode, r/OpenAI | 0 (nofollow) + referral traffic | profile, nofollow | Brand/usage > SEO. Post Show HN link, not a separate promo. |
| 6 | OpenAI / Cursor community forums | 0–1 (signature) | signature, mixed | Trust > SEO. Long-term relationship play. |
| 7 | Competitor README cross-links (Cline, Continue) | 2–4 | editorial, dofollow | Highest-authority individual links. Requires integration write-up. |
| 8 | MCP official server registry | 1 (DR ~70) | editorial, dofollow | One-time, high-value. |
| 9 | YouTube tutorials (we don't make them) | 0–2 | description, mixed | Outreach to 3 dev YouTubers in the "AI coding" niche. |
| 10 | Newsletter pitches (Pragmatic Engineer, Bytes, etc.) | 0–1 | editorial, dofollow | Hard to land; high payoff. |

**Expected 90-day net: 15–35 referring domains** (Estimated, range; see §6).

---

## 6. Realistic 3-Month Link Velocity Target

> **Source: Estimated.** Based on `link-quality-rubric.md` archetype "Healthy new site" (45 RDs / quarter) — but ours starts at 0, so first 90 days underperform that archetype.

| Window | Target RDs (net new) | Cumulative | Confidence |
|---|---|---|---|
| Week 1 (post-launch + HN + PH) | 5–10 | 5–10 | Medium |
| Week 2–4 (awesome-list PRs land) | +8–12 | 13–22 | High |
| Month 2 (forums, blog cross-picks, integration write-ups) | +6–10 | 19–32 | Medium |
| Month 3 (newsletter pickup, second HN angle, comparison posts cited) | +4–8 | 23–40 | Low–Medium |
| **90-day total** | **~25 RDs** (Estimated) | — | — |

**Conservative floor: 15 RDs. Stretch: 40 RDs. Toxic link share should stay at <2%.**

**Tracking:** set up Ahrefs/Semrush free alert on `agent-rollback` and `Nainish-Rai/agent-rollback`. Backlog weekly.

---

## 7. Anchor Text Distribution Strategy

> We have ~0 inbound anchors today, so the **next 25 links** set the *initial distribution*. Do it right the first time — fixing an over-optimized profile later is painful.

Target mix for the first 25 inbound anchors:

| Anchor type | Target % | Count (of 25) | Examples | Rationale |
|---|---|---|---|---|
| Brand | 40% | 10 | `agent-rollback`, `agent rollback`, `Nainish-Rai/agent-rollback` | Anchor the brand. Safe. |
| Naked URL | 20% | 5 | `https://github.com/Nainish-Rai/agent-rollback`, `npmjs.com/package/agent-rollback` | Highest-trust signal in a young profile. |
| Generic | 15% | 4 | `read more`, `here`, `this tool`, `the project` | Looks human. |
| Partial / descriptive | 15% | 4 | `agent snapshot tool`, `codex undo tool`, `codex CLI safety net` | Light SEO push, no exact-match risk. |
| Exact match | 5% | 1–2 | `codex rollback`, `codex undo` | Sparse. Only from high-DR editorial placements (HN, awesome lists). |
| Other (image alt, citation) | 5% | 1–2 | — | — |

**Hard rules:**
- No exact-match anchor from a low-DR/foreign/spam-looking source → **disavow** the source, not the anchor.
- Total exact-match anchors in the first 25: **≤2**.
- If a publication insists on branded anchor (`"agent-rollback, a tool by …"`) — accept, do not push for keyword anchors.
- Once we hit 50 RDs, *re-evaluate*; the brand share should creep toward 50%.

---

## 8. Toxic Links To Avoid (Pattern List, not specific domains)

We have 0 inbound links → no disavow work today. The risk is **acquisition** (we buy the wrong kind of links by accident). Patterns to refuse on sight:

| Pattern | Why it's toxic | Action |
|---|---|---|
| **"Submit your npm package to 100 directories for $5"** services | All PBN/directory networks. Google penalizes link schemes. | Refuse. |
| **Fiverr/SEO-clinic "contextual backlink" packages** | Usually hacked-site injections or PBN footprints. | Refuse, screenshot the offer for the record. |
| **Link exchanges ("I'll link you if you link me") with unrelated sites** | Reciprocal-link graph; Penguin-targeted. | Refuse unless genuinely co-authored content with a relevant partner. |
| **"Guest post" offers from sites with DR <20 and no editorial bar** | Paid-link disguise. | Refuse. |
| **Foreign-language directories with no English content** | Spammy auto-generated. | Refuse. |
| **Profile-creation backlink packages (100 forum sigs, 100 blog comments)** | All nofollow spam, all Penguin-flagged. | Refuse. |
| **"Web 2.0" link wheels (WordPress.com, Medium, Substack mirrors of our own post with keyword anchor)** | Self-built PBN footprint. | Don't build second/third copies with the exact same anchor. |
| **Negative-SEO attacks** (someone spam-pointing at us) | Future risk. | Set up Ahrefs alerts. When it happens: collect, then disavow. |

**Disavow file policy** (per `link-quality-rubric.md` §4): keep an empty `disavow.txt` in repo, comment it `# Reviewed YYYY-MM-DD, no toxic links found`, re-export monthly.

---

## 9. Top 3 Immediate Actions (this week)

1. **Submit to 8 awesome-* lists** (P0 items 1, 3, 4, 5, 10, 11, 12, 13) using template in §3. Track in a spreadsheet. ETA: 2 hours.
2. **Confirm npm package metadata** is keyword-rich (`codex-undo`, `codex-rollback`, `codex-snapshot`, etc. — already done in `package.json`) and `homepage` is set. Re-publish a patch version to force socket.dev / snyk / libraries.io re-crawl. ETA: 30 min.
3. **Draft the "Codex CLI Undo: The Definitive Guide"** content magnet (§4-B) and publish to dev.to + Hashnode + own blog with three different anchor variants. ETA: 1 day.

---

## Handoff Summary

> Standard format per `skill-contract.md`.

- **Skill run**: `backlink-analyzer`
- **Subject**: `github.com/Nainish-Rai/agent-rollback` (npm: `agent-rollback`)
- **Inputs**: User-provided counts (0 RDs, 0 stars, 0 forks, ~7 releases, 36 keywords, 20 GH topics), ecosystem research from `marketing/seo-research/03-competitor-landscape.md` and parallel-cli doc.
- **Outputs**:
  - Profile overview: empty; 0 RDs, 0% toxic (vacuous), all other metrics **N/A**.
  - Link quality: N/A (no links to score).
  - Tox review: 0 toxic; **disavow file empty** by design.
  - Competitive gap: vs Cline (50k★, no safety), Continue (15k★, MCP), aider (10k★) — we win on safety dimension; they win on reach. Top 3 link-intersection prospects: awesome-mcp-servers, openai/codex discussions, MCP official registry.
  - Opportunities: 24 prospects listed in §2 across 4 tiers.
  - Velocity target: 15–40 RDs over 90 days (Estimated).
  - Anchor strategy: 40% brand, 20% naked, 15% generic, 15% partial, ≤5% exact (initial mix).
- **Confidence**: Low–Medium. No measured tool data; all velocity and quality projections are Estimated.
- **Open loops** → `memory/open-loops.md`:
  1. Connect ~~link database or run one-time Ahrefs/Semrush export to convert Estimated → Measured.
  2. Toxic ratio currently 0% — re-evaluate at 20 RDs (skip `domain-authority-auditor` for now).
  3. Awaiting awesome-list PR responses; revisit week 2.
- **Recommended next skill**: `domain-authority-auditor` is **not triggered** (toxic ratio 0%, RD < 20). Re-run this skill in 30 days with measured data.
- **Save prompt**: this file IS the saved deliverable at the user-specified path; no further write to `memory/monitoring/` required.
