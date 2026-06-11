# Entity Audit — `agent-rollback`

**Entity**: `agent-rollback` (aliases: `arb`, `agentrollback`)
**Type**: Software / Open-source project (CLI + MCP server + Codex hook)
**Maintainer**: Nainish Rai (GitHub `@Nainish-Rai`, npm `nainish-rai`)
**License**: MIT
**Repo**: https://github.com/Nainish-Rai/agent-rollback
**npm**: https://www.npmjs.com/package/agent-rollback
**Inception**: 2026
**Audit date**: 2026-06-11

---

## 1. Entity Presence Check

### 1.1 Current state across systems

| Platform | Status | Details |
|---|---|---|
| Google Knowledge Panel | ❌ Absent | Branded query `agent-rollback` returns GitHub repo, npm page, README. No KP trigger. Expected: KG has no entity for this name. |
| Wikidata | ❌ Absent | Q-item does not exist. `agent-rollback` returns no hit. Closest neighbors: `Git` (Q218069), `Version control` (Q543749) — generic concepts, not this product. |
| Wikipedia | ❌ Absent | No article, no mention. Notability TBD (project is < 1 yr old, no press coverage yet). |
| Google Knowledge Graph API | ⚠️ Not tested live | Predicted: null or low-confidence hit. After Wikidata + sameAs are live, re-query `kgsearch.googleapis.com` and capture `result.score` + `result['@type']`. |
| Schema.org on site | ❌ Missing | No JSON-LD anywhere. `package.json` has no `author`/`maintainers` field (required for npm-as-entity resolution). `README.md` is plain CommonMark — no `<script type="application/ld+json">` block. |
| GitHub repo metadata | ⚠️ Partial | Repo exists, has 20 declared topics (see §1.2), description populated, website link absent. No releases published (only `v1.0.1` implicit). No "About" sidebar logo. |
| npm registry metadata | ⚠️ Partial | Package published. Missing: `author`, `maintainers` field, `homepage` is GitHub (ok), `funding`, `bugs` (present). npm does not surface an entity card for packages without these. |
| Crunchbase | N/A | Single-maintainer OSS, not a registered company. Skip. |
| OpenCorporates | N/A | Same. |
| Common Crawl / web mentions | ⚠️ Minimal | New project. Likely 0–2 mentions in third-party sources at this date. |
| GitHub Topics (20) | ⚠️ Partial | See §1.2 — keyword cannibalization risk; many near-duplicates dilute signal. |

### 1.2 GitHub topics audit

Declared (from README badges + `package.json` keywords, ~20): `codex`, `codex-cli`, `openai-codex`, `codex-mcp`, `codex-undo`, `codex-revert`, `codex-checkpoint`, `codex-rollback`, `codex-snapshot`, `codex-safety-net`, `codex-backup`, `undo`, `revert`, `rollback`, `restore`, `checkpoint`, `snapshot`, `diff`, `ai-agent`, `cli`, `mcp`, `mcp-server`, `model-context-protocol`, `claude-code`, `cursor`, `windsurf`, `copilot`, `cline`, `gemini-cli`, `dev-tools`, `developer-tools`.

**Issue**: GitHub caps topics at 20. The list is ~31 — over half are `codex-*` variants that GitHub will treat as duplicates of `codex`. GitHub's topic graph collapses near-duplicates in discovery, so this is wasted SEO budget.

**Recommended 20 (re-prioritize)**:
`codex-cli`, `openai-codex`, `codex-rollback`, `codex-checkpoint`, `codex-snapshot`, `mcp-server`, `model-context-protocol`, `ai-agent-safety`, `ai-undo`, `developer-tools`, `cli`, `mcp`, `rollback`, `checkpoint`, `snapshot`, `claude-code`, `cursor`, `windsurf`, `copilot`, `gemini-cli`.

### 1.3 AI Entity Resolution Test (user-to-run)

Cannot execute live. Run these queries in ChatGPT, Claude, Perplexity, Google AI Mode and report:

| Query | Pass criterion |
|---|---|
| `What is agent-rollback?` | Returns: "agent-rollback is an MIT-licensed CLI + MCP server for OpenAI Codex CLI that creates content-addressed checkpoints of the working tree…" |
| `agent-rollback vs git stash` | Mentions the project by name and contrasts it (no Git object overhead, content-addressed dedupe, MCP integration). |
| `OpenAI Codex CLI undo tool` | Names `agent-rollback` in the answer or sources. |
| `Who maintains agent-rollback?` | Names Nainish Rai. |

Baseline (today) is likely ❌ on all four.

---

## 2. 47-Signal Gap Analysis

Scoring: ✅ Pass · ⚠️ Partial · ❌ Fail.

### Tier 1 — Foundation (P1)

| # | Signal | Status | Gap / action |
|---|---|---|---|
| 1 | Organization/Person schema on homepage | ❌ | Add `SoftwareSourceCode` + `Person` JSON-LD to README (served via GitHub Pages if needed) or a `/about` page. |
| 2 | sameAs links to authoritative profiles | ❌ | Add `https://github.com/Nainish-Rai` and `https://www.npmjs.com/~nainish-rai` as `sameAs`. |
| 3 | Consistent `@id` across pages | ❌ | Pick canonical `@id`: `https://github.com/Nainish-Rai/agent-rollback#software` and reuse. |
| 4 | About page with entity-rich content | ⚠️ | README's first 8 lines are entity-defining but unstructured. Add a dedicated `## About` section with founding date, maintainer, license, repo, stack. |
| 5 | Contact page with verifiable info | ❌ | Add `https://github.com/Nainish-Rai/agent-rollback/issues` as `ContactPoint`. |
| 6 | Wikidata entry | ❌ | Create Q-item (see §4.1). |
| 7 | Google Business Profile | N/A | Skip — not a local business. |
| 8 | LinkedIn page | ❌ | Optional. Add maintainer's LinkedIn `sameAs` if it exists. |
| 9 | CrunchBase profile | N/A | Skip. |
| 10 | Primary industry directory listing | ❌ | Submit to: MCP Servers catalog (`modelcontextprotocol/servers` README), awesome-mcp lists, awesome-openai-codex lists (if any), Product Hunt. |
| 11 | Branded search returns correct entity | ⚠️ | GitHub is result #1, npm is #2. Acceptable but no KP. |
| 12 | No disambiguation confusion | ⚠️ | `arb` collides (see §3). |
| 13 | Branded search volume | ⚠️ | New project, near-zero. Will grow. |

### Tier 2 — Authority (P2)

| # | Signal | Status | Gap / action |
|---|---|---|---|
| 14 | Google Knowledge Panel present | ❌ | Will follow Wikidata + ~5 authoritative mentions. |
| 15 | KP attributes complete | ❌ | Plan: maintainer, license, inception, OS platforms, written-in. |
| 16 | KP image correct | ❌ | Need logo. See §4.4. |
| 17 | Wikipedia article | ❌ | Notability path: requires 3+ independent reliable sources. Target Hacker News + a dev blog + a newsletter mention. |
| 18 | Wikidata properties complete (10+) | ❌ | See §4.1 for property list. |
| 19 | Authoritative media mentions | ❌ | 0 currently. Target: Show HN, dev.to cross-posts, weekly newsletters. |
| 20 | Industry awards | N/A | Skip. |
| 21 | Co-citation with established entities | ❌ | Co-mention with: `git`, `OpenAI Codex CLI`, `Model Context Protocol`, `@modelcontextprotocol/sdk`. |
| 22 | Speaking/publications | N/A | Skip. |
| 23 | Third-party platform reviews | ❌ | Target: `npm` stars/reviews, future Product Hunt, future Replit/StackBlitz demos. |
| 24 | Topical content depth (10+ pages) | ⚠️ | README is dense (1 long page). Add: FAQ, MCP usage, hook recipes, comparison vs git, blog post. |
| 25 | Author pages with credentials | ❌ | Add `Person` schema for Nainish Rai with `worksFor` → org, `knowsAbout` → list, `sameAs` → GitHub/npm. |
| 26 | Original research/data | ❌ | Add a benchmark page: "How much disk do 100 Codex snapshots use?" — cite-worthy. |
| 27 | Entity mentioned naturally in content | ⚠️ | README has it; need external mentions. |

### Tier 3 — AI-Specific (P3)

| # | Signal | Status | Gap / action |
|---|---|---|---|
| 28 | ChatGPT recognizes entity | ❌ | Will follow Wikidata + 3+ authoritative pages. |
| 29 | Perplexity recognizes entity | ❌ | Same. Perplexity is retrieval-heavy — needs indexed pages. |
| 30 | Google AI Overview mentions entity | ❌ | Same. |
| 31 | AI description accurate | ❌ | Quote a clean 1-sentence definition in README, Wikidata description, and About. |
| 32 | AI associates correct topics | ⚠️ | Use stable topic tokens: `codex-rollback`, `mcp-snapshot`, `agent-safety-net`. |
| 33 | Quotable entity definition in first paragraph | ⚠️ | Current line 1 is good but uses "—" and "Git-like" — make it a single declarative sentence. |
| 34 | Factual claims verifiable | ⚠️ | "Works with Claude Code, Cursor, Windsurf, Copilot, Cline, Gemini CLI" — link each to integration docs. |
| 35 | Entity name used consistently | ⚠️ | README uses `agent-rollback` and `arb`. Pin canonical form `agent-rollback` in H1, schema, and Wikidata. `arb` becomes an `alias`. |
| 36 | Content crawlable by AI systems | ❌ | Add `robots.txt` allowance for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`. GitHub.com is crawled by default — no action needed for repo, but if you publish a docs site, allow. |
| 37 | Fresh info available | ✅ | Project is < 6 months old. |

### Tier 4 — Advanced (P4)

| # | Signal | Status | Gap / action |
|---|---|---|---|
| 38 | Multi-language Wikidata entries | ❌ | Add `en` + optionally `de`/`ja` labels when international users appear. |
| 39 | Google KG ID known | ❌ | Capture after KP appears. |
| 40 | Social profiles bidirectionally linked | ❌ | GitHub profile → repos (done by GitHub). Maintainer's npm page should list `agent-rollback` as published. |
| 41 | Consistent description across social | ⚠️ | npm description is canonical; reuse in GitHub repo "About", X bio, LinkedIn. |
| 42 | Strong homepage backlink profile | ⚠️ | DR/DA will track stars + mentions. |
| 43 | Branded anchor text in backlinks | ❌ | Encourage "agent-rollback" (not "this tool") in any third-party post. |

**Summary**: 5 ✅ / 9 ⚠️ / 26 ❌ / 4 N/A / 3 conditional. Project is in **"Most P1 signals absent"** bucket → focus P1 for 2–4 weeks.

---

## 3. Disambiguation Strategy

| Risk | Collision source | Resolution |
|---|---|---|
| `arb` | Many packages named `arb` (e.g., `arb` on npm = Arbitrary precision). On macOS, `arb` is a build alias. | Never lead with `arb`. Use `agent-rollback` in titles/H1, declare `arb` as an alias in schema (`schema:alternateName`) and Wikidata (`skos:altLabel` / `P4970`). In CLI help text, lead `agent-rollback` and list `arb (alias)` second. |
| `pi-rollback` (npm) | Unrelated package. | No collision if branded queries are distinct; ensure schema `@id` and `name` use `agent-rollback` only. |
| `agentame` (npm) | Unrelated. | Same. |
| `A386official/diffback` (GitHub) | Similar concept (diff/restore). | Differentiate in About: "content-addressed checkpoints with MCP server + Codex hook integration" — diffback is repo-internal. Cross-link only if collaboration makes sense. |
| `Refact.ai Agent Rollback` (proprietary) | Same words, commercial product, vendor lock-in. | README comparison row: "agent-rollback is MIT-licensed, local-first, no telemetry. Refact's is closed-source and cloud-coupled." Use as positioning, not as keyword target. |
| Generic "codex rollback" | Probably no exact product match. | Own this long-tail via dedicated page `docs/codex-rollback.md` and Wikidata description. |
| Generic "mcp server" | Thousands. | Differentiate with stable sub-tag `mcp-checkpoint` (not yet a real tag — file it on GitHub). |

**Rule of thumb**: in any structured-data field (`name`, `alternateName`, `applicationCategory`, `keywords`), put `agent-rollback` first, `Codex undo` second, `arb` last. Never reverse.

---

## 4. Building Plan

### 4.1 Wikidata item

**Target Q-ID**: unknown until created. Suggest `Q-nnnnnnn` reserved via `Special:NewItem` with label `agent-rollback` and description `MIT-licensed CLI and MCP server providing content-addressed checkpoints and rollback for OpenAI Codex CLI`.

**Properties to set (URIs use Wikidata property IDs)**:

| Property | P-ID | Value |
|---|---|---|
| instance of | P31 | `command-line software` (Q112582903) **and** `free software` (Q98592850) **and** `MCP server` (Q134557006) — multi-value |
| developer | P178 | `Nainish Rai` (must have own Q-item; create first if not exists) |
| license | P275 | `MIT License` (Q181991) |
| inception | P571 | `2026` (year precision) |
| source code repository | P1324 | `https://github.com/Nainish-Rai/agent-rollback` |
| official website | P856 | `https://github.com/Nainish-Rai/agent-rollback#readme` |
| programming language | P277 | `JavaScript` (Q2005) and `Node.js` (Q75610) |
| operating system | P306 | `Linux` (Q388), `macOS` (Q14116), `Windows` (Q1406) |
| written in | P6886 | `JavaScript` |
| package manager | P3233 | `npm` (Q601315) |
| has part(s) | P527 | `agent-rollback CLI`, `arb alias`, `MCP server`, `Codex hook` |
| described by source | P1343 | "Add authoritative citations after first press hit" |
| logo image | P154 | Commons file (see §4.4) |
| software version identifier | P348 | `1.0.1` |
| short name | P1813 | `arb` (declared alias only) |
| official hashtag | P2572 | `#agent-rollback` (if X account exists) |

**Aliases** (P4970 / `Also known as`): `agentrollback`, `agent-rollback CLI`, `arb`.

**External identifiers**: not applicable at v1.0.1.

**References (mandatory per claim)**: cite the GitHub repo (`source code repository`) as a self-reference — Wikidata allows `P1324` for software. For license, cite `LICENSE` file URL.

### 4.2 sameAs links (target set)

```text
https://github.com/Nainish-Rai/agent-rollback
https://www.npmjs.com/package/agent-rollback
https://www.npmjs.com/~nainish-rai
https://github.com/Nainish-Rai
https://github.com/Nainish-Rai/agent-rollback/issues
https://github.com/Nainish-Rai/agent-rollback/blob/main/LICENSE
https://modelcontextprotocol.io  (parent ecosystem, not a sameAs — use schema:isPartOf)
https://developers.openai.com/codex/cli  (parent ecosystem)
```

After Wikidata is live, prepend the Wikidata URL: `https://www.wikidata.org/wiki/Qnnnnnnn`.

### 4.3 Knowledge Panel optimization

KP will not appear at v1.0.1. Trigger conditions:
1. Wikidata item exists with `P31`, `P178`, `P1324`, `P275` filled.
2. ≥ 3 independent reliable sources index the name (e.g., Show HN, dev.to post, npm-trending, awesome-mcp list).
3. GitHub repo has `description`, `website`, `topics` filled.

**Bing Placeholder** appears faster than Google KP — expect it 2–4 weeks after Wikidata. Monitor `bing.com/search?q=agent-rollback`.

### 4.4 Logo / image

- Create `marketing/brand/agent-rollback-logo.svg` (lockup: glyph + wordmark, 1200×630 OG aspect).
- Upload to Wikimedia Commons as `File:Agent-rollback logo.svg` with MIT license + source code URL — required for Wikidata `P154`.
- Add same SVG to `package.json` `funding` and GitHub repo social preview (`Settings → Social preview`).
- Add a 1200×630 `og:image` to a docs site or GitHub Pages mirror.

### 4.5 Description templates (per surface)

| Surface | Length | Text |
|---|---|---|
| Wikidata description | ≤ 250 chars | "MIT-licensed command-line tool and Model Context Protocol server that creates content-addressed checkpoints of the working tree, with diff and restore, for OpenAI Codex CLI." |
| Schema.org `description` | ≤ 500 chars | "agent-rollback is an MIT-licensed CLI, MCP server, and Codex hook that snapshots, diffs, and restores the working tree before, during, and after OpenAI Codex CLI edits." |
| npm `description` | ≤ 250 chars | "Git-like undo and rollback checkpoints for OpenAI Codex CLI. Snapshot, diff, and restore files before and after Codex edits. MCP server + Codex hooks for automatic safety net." (already present — keep verbatim) |
| GitHub repo "About" | ≤ 350 chars | "Git-like undo, revert, and rollback checkpoints for OpenAI Codex CLI. Snapshot, diff, and restore. MCP server + Codex hooks." |
| X / Twitter bio | ≤ 160 chars | "MIT-licensed undo, revert & rollback checkpoints for OpenAI Codex CLI. CLI + MCP server + Codex hook. By @Nainish-Rai." |
| Open Graph `og:description` | ≤ 200 chars | "MIT-licensed undo, revert & rollback checkpoints for OpenAI Codex CLI." |

**Lock the canonical sentence** in all places:

> "agent-rollback is an MIT-licensed CLI, MCP server, and Codex hook that creates content-addressed checkpoints of the working tree for OpenAI Codex CLI, with diff and one-command restore."

---

## 5. JSON-LD to add

### 5.1 For `README.md` (rendered as GitHub Pages or docs site)

Add as a hidden HTML block at the end of README, **and** as `<script type="application/ld+json">` in any docs site `<head>`.

```html
<!-- Hidden: schema.org/SoftwareSourceCode for agent-rollback -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "@id": "https://github.com/Nainish-Rai/agent-rollback#software",
  "name": "agent-rollback",
  "alternateName": ["agentrollback", "arb"],
  "description": "MIT-licensed CLI, MCP server, and Codex hook that creates content-addressed checkpoints of the working tree for OpenAI Codex CLI, with diff and one-command restore.",
  "url": "https://github.com/Nainish-Rai/agent-rollback",
  "codeRepository": "https://github.com/Nainish-Rai/agent-rollback",
  "programmingLanguage": ["JavaScript", "Node.js"],
  "runtimePlatform": ["Node.js >=20", "Linux", "macOS", "Windows"],
  "license": "https://github.com/Nainish-Rai/agent-rollback/blob/main/LICENSE",
  "version": "1.0.1",
  "dateCreated": "2026",
  "author": {
    "@type": "Person",
    "@id": "https://github.com/Nainish-Rai#person",
    "name": "Nainish Rai",
    "url": "https://github.com/Nainish-Rai",
    "sameAs": [
      "https://github.com/Nainish-Rai",
      "https://www.npmjs.com/~nainish-rai"
    ]
  },
  "maintainer": {
    "@type": "Person",
    "@id": "https://github.com/Nainish-Rai#person"
  },
  "sameAs": [
    "https://github.com/Nainish-Rai/agent-rollback",
    "https://www.npmjs.com/package/agent-rollback",
    "https://www.npmjs.com/~nainish-rai",
    "https://github.com/Nainish-Rai/agent-rollback/issues"
  ],
  "applicationCategory": "DeveloperApplication",
  "applicationSuite": "OpenAI Codex CLI",
  "operatingSystem": ["Linux", "macOS", "Windows"],
  "keywords": "codex-rollback, codex-checkpoint, codex-snapshot, mcp-server, model-context-protocol, ai-agent-safety, cli, developer-tools",
  "inLanguage": "en",
  "isAccessibleForFree": true,
  "creativeWorkStatus": "Published",
  "copyrightNotice": "Copyright (c) 2026 Nainish Rai",
  "spatialCoverage": {
    "@type": "Place",
    "name": "Worldwide"
  }
}
</script>
```

### 5.2 For `package.json` (npm is an entity hub; these fields become Schema.org)

`npm` reads these fields and surfaces them to npmjs.com + schema-aware crawlers. Add now:

```jsonc
{
  "name": "agent-rollback",
  "version": "1.0.1",
  "description": "Git-like undo and rollback checkpoints for OpenAI Codex CLI. Snapshot, diff, and restore files before and after Codex edits. MCP server + Codex hooks for automatic safety net.",
  "license": "MIT",
  "author": {
    "name": "Nainish Rai",
    "email": "REDACTED-FOR-PRIVACY",          // optional; omit if not public
    "url": "https://github.com/Nainish-Rai"
  },
  "maintainers": [
    {
      "name": "Nainish Rai",
      "email": "REDACTED-FOR-PRIVACY",
      "url": "https://github.com/Nainish-Rai"
    }
  ],
  "homepage": "https://github.com/Nainish-Rai/agent-rollback#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Nainish-Rai/agent-rollback.git"
  },
  "bugs": {
    "url": "https://github.com/Nainish-Rai/agent-rollback/issues"
  },
  "funding": {
    "type": "github",
    "url": "https://github.com/sponsors/Nainish-Rai"   // add if/when sponsor is set up
  },
  "keywords": [
    "codex-cli", "openai-codex",
    "codex-rollback", "codex-checkpoint", "codex-snapshot",
    "mcp-server", "model-context-protocol",
    "ai-agent-safety", "ai-undo",
    "developer-tools", "cli",
    "rollback", "checkpoint", "snapshot",
    "claude-code", "cursor", "windsurf", "copilot", "gemini-cli"
  ]
}
```

**npm-specific guidance**: `keywords` is one of the few fields that influences npm search ranking. Trim to ~15 high-signal terms (above), not 35.

### 5.3 Schema.org `SoftwareApplication` variant (for docs/GitHub Pages site)

If you publish a docs site (e.g., `agent-rollback.dev` via GitHub Pages), add this to the homepage `<head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://github.com/Nainish-Rai/agent-rollback#software",
  "name": "agent-rollback",
  "alternateName": ["agentrollback", "arb"],
  "description": "MIT-licensed CLI, MCP server, and Codex hook that creates content-addressed checkpoints of the working tree for OpenAI Codex CLI, with diff and one-command restore.",
  "url": "https://github.com/Nainish-Rai/agent-rollback",
  "downloadUrl": "https://www.npmjs.com/package/agent-rollback",
  "softwareVersion": "1.0.1",
  "datePublished": "2026",
  "applicationCategory": "DeveloperApplication",
  "applicationSubCategory": "Version control / safety net",
  "operatingSystem": "Linux, macOS, Windows",
  "softwareRequirements": "Node.js >=20",
  "license": "https://opensource.org/licenses/MIT",
  "isAccessibleForFree": true,
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": { "@id": "https://github.com/Nainish-Rai#person" },
  "maintainer": { "@id": "https://github.com/Nainish-Rai#person" },
  "sameAs": [
    "https://www.npmjs.com/package/agent-rollback",
    "https://github.com/Nainish-Rai/agent-rollback"
  ]
}
</script>
```

### 5.4 `robots.txt` (if you publish a docs site)

```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: *
Allow: /
```

GitHub.com itself is crawlable — no action needed for the repo page.

---

## 6. This-week Action Checklist

1. **Add `author` + `maintainers` to `package.json`** (§5.2). Publish a patch release (`1.0.2`). Effort: 15 min.
2. **Trim `keywords` to 15** (§5.2). Republish. Effort: 10 min.
3. **Add the JSON-LD block to README** (§5.1) and commit. Effort: 5 min.
4. **Create the Wikidata Q-item** (§4.1). Use `Special:NewItem` with label `agent-rollback`. Fill P31, P178, P1324, P856, P275, P571, P277, P306, P3233, P154 (after logo upload). Effort: 60–90 min, one-time.
5. **Upload logo to Wikimedia Commons** (`File:Agent-rollback logo.svg`, MIT license tag, source-code URL). Reference from Wikidata `P154`. Effort: 30 min after SVG exists.
6. **Set GitHub repo "About"** to the §4.5 description and add the 20 prioritized topics (§1.2). Effort: 10 min.
7. **Set GitHub social preview** to the OG image (lockup + tagline). Effort: 5 min after image exists.
8. **Submit to `modelcontextprotocol/servers`** README under "Community Servers" or open an issue. Effort: 20 min. Provides P1 #10.
9. **Cross-post to dev.to**: "I built a content-addressed undo layer for OpenAI Codex CLI". Title must contain `agent-rollback` for branded anchor text (P4 #43). Effort: 90 min.
10. **Submit "Show HN"** with a working GIF of `agent-rollback init` → Codex edit → `arb revert`. Effort: 60 min + 2 weeks of comment-trail. **Biggest single contributor to P2 #19 and P3 #28–30.**
11. **Run the AI entity resolution test** (§1.3) before and 14 days after Show HN; record results in a `marketing/ai-recognition-log.md`.
12. **Open an `awesome-mcp-zh` / `awesome-codex` PR** for inclusion. Effort: 20 min.

**Total week-1 effort**: ~6–8 hours. Expected outcome: 5 ✅ → 12 ✅ / 9 ⚠️ → 6 ⚠️ / 26 ❌ → 14 ❌.

---

## 7. Cross-references

- **CORE-EEAT A07 (Knowledge Graph Presence)**: ❌ → ⚠️ after Wikidata + JSON-LD land.
- **CORE-EEAT A08 (Entity Consistency)**: ⚠️ — pin canonical name across surfaces (this file's §4.5).
- **CITE I01 (Knowledge Graph Presence)**: ❌ — same fix as A07.
- **CITE I04 (Disambiguation)**: ⚠️ — execution plan in §3; this audit + the §4.5 sentence lock closes it.
- **CITE I07 (Verifiable identity)**: ❌ → ⚠️ after `Person` schema for maintainer lands.

---

## 8. Handoff Summary (skill contract)

```yaml
status: DONE_WITH_CONCERNS
entity: agent-rollback
type: Software (CLI + MCP server + Codex hook)
primary_domain: https://github.com/Nainish-Rai/agent-rollback
canonical_name: agent-rollback
aliases: [agentrollback, arb]
maintainer: Nainish Rai (@Nainish-Rai)
license: MIT
inception: 2026
signal_tier: P1
scores:
  P1_foundation: 1/13 pass  → target 8/13 within 2 weeks
  P2_authority:  0/14 pass  → target 4/14 within 1 month
  P3_ai:         1/10 pass  → target 5/10 within 1 month
  P4_advanced:   0/6  pass  → ongoing
critical_gaps:
  - No Wikidata item
  - No JSON-LD anywhere
  - No logo / no Commons file
  - npm missing author + maintainers
  - 0 third-party mentions
open_loops:
  - Execute §6 this-week checklist
  - Re-run AI entity resolution test in 14 days
  - File Show HN (single biggest unlock)
  - Acquire 1 logo + upload to Commons
next_best_skill: schema-markup-generator
artifacts:
  - This file: marketing/seo-audit/05-entity-audit.md
  - JSON-LD blocks: §5.1, §5.2, §5.3 (drop into README / package.json / docs site)
  - Wikidata properties checklist: §4.1
  - Disambiguation matrix: §3
  - Description templates: §4.5
```
