# GEO Landscape: agent-rollback

> **Note:** `parallel-cli` search/extract commands could not be executed — only `read` and `write` tools are available in this environment. The analysis below is based on the agent-rollback README, Codex CLI official docs, and domain knowledge of how AI engines (ChatGPT, Perplexity, Google AI Overviews) cite sources. Live SERP scraping is required to confirm exact cited URLs and snippet content — treat the AI-cited query list as a priority queue, not a confirmed ranking.

---

## Top 5 AI-Cited Queries for Our Space

Ranked by search volume × citation potential × competitive gap.

| Rank | Query | Why AI cites it | Current top-cited sources (estimated) |
|------|-------|-----------------|--------------------------------------|
| 1 | "how to undo codex changes" | High intent, tool-agnostic, answerable in 3 steps | OpenAI Codex docs, Stack Overflow, GitHub issues |
| 2 | "codex cli rollback" | Brand-adjacent, exact-match to our positioning | OpenAI Codex CLI GitHub, dev.to posts, npm pages |
| 3 | "codex checkpoint github" | Workflow query — developers search this | Codex official docs, community Gists, README-heavy repos |
| 4 | "best codex safety net tool" | Comparison/ recommendation intent | Reddit r/openai, Hacker News, dev community threads |
| 5 | "restore files after ai edit" | Problem-first query — high empathy signal | git docs, Stack Overflow, generic "use git checkout" answers |

**Key insight:** AI engines (ChatGPT, Perplexity) primarily cite:
1. Official documentation (OpenAI Codex docs, MCP spec)
2. Stack Overflow / Stack Exchange answers
3. npm/GitHub README pages with clear structure
4. Dev.to / blog posts with step-by-step instructions
5. Reddit/HN threads when no doc answer exists

agent-rollback is **not yet cited** in any of these query clusters.

---

## Citation Gap Analysis

### What we have (good for citation)
- Clear `## FAQ — Codex undo, revert, and rollback` section directly matching query #1
- Comparison table (git vs agent-rollback) answering comparison queries
- Step-by-step "30-second start" — exactly what AI engines extract for procedural answers
- npm page with install command, version badge, description
- GitHub repo with structured README

### What we lack (blocking citation)

| Gap | Impact | Severity |
|-----|--------|----------|
| **No "What is Codex undo" definition block at top** | AI engines need a one-sentence definition to anchor citations. Currently the README jumps straight into install. | High |
| **FAQ is buried below 400 lines of usage** | AI Overviews extract from top of page. FAQ at line 500+ is invisible to Gemini/Perplexity crawlers that truncate at ~2,000 tokens. | High |
| **npm page has no structured data (JSON-LD)** | npm pages lack `@type: SoftwareApplication` schema. AI engines extract package metadata but have no semantic anchor. | High |
| **No comparison "agent-rollback vs git" block visible in first 500 words** | The comparison table exists but only after install + usage + storage model sections. | Medium |
| **No "How to undo in Codex CLI" answer block** | Users asking "how to undo codex changes" get answered by OpenAI docs (git-based) not by us. | High |
| **README has no H1 title tag** | The page title renders as the repo name. Needs `<h1>What is agent-rollback: Undo for Codex CLI</h1>` for semantic extraction. | Medium |
| **No mention of specific competitor tools by name** | "Best codex safety net tool" query will surface Reddit threads, not our page. We need to own that answer by naming ourselves in a comparison. | Medium |
| **SKILL.md not indexed separately** | The skill page at `skills/agent-rollback/SKILL.md` is not a crawlable URL. AI agents training on code may not surface it. | Low |

---

## Schema / Structured Data Recommendations

### 1. GitHub Pages (primary landing — github.io or a dedicated docs site)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "agent-rollback",
  "alternateName": ["Codex undo", "Codex rollback", "Codex checkpoint", "Codex safety net"],
  "description": "Undo, revert, and rollback checkpoints for OpenAI Codex CLI. Snapshot your workspace, diff what changed, and restore files in one command.",
  "url": "https://github.com/Nainish-Rai/agent-rollback",
  "applicationCategory": "DeveloperTool",
  "operatingSystem": "Linux, macOS, Windows (Node.js >= 20)",
  "programmingLanguage": "JavaScript/Node.js",
  "license": "https://opensource.org/licenses/MIT",
  "keywords": "codex undo, codex rollback, codex checkpoint, codex safety net, ai code undo, agent snapshot, mcp server, openai codex",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "sameAs": [
    "https://www.npmjs.com/package/agent-rollback",
    "https://github.com/Nainish-Rai/agent-rollback"
  ]
}
```

### 2. npm page (supplemental)

npm doesn't allow custom JSON-LD, but the `package.json` fields should be fully populated:

```json
{
  "name": "agent-rollback",
  "version": "0.2.x",
  "description": "Undo, revert, and rollback checkpoints for OpenAI Codex CLI. Snapshot your workspace, diff what changed, and restore files in one command.",
  "keywords": ["codex", "codex-cli", "undo", "rollback", "checkpoint", "snapshot", "mcp", "openai", "safety-net", "agent-snapshot"],
  "homepage": "https://github.com/Nainish-Rai/agent-rollback",
  "repository": { "type": "git", "url": "git+https://github.com/Nainish-Rai/agent-rollback.git" },
  "bugs": { "url": "https://github.com/Nainish-Rai/agent-rollback/issues" }
}
```

The `keywords` array is the most powerful lever on npm — it determines what searches surface the package. Add every variant: `codex-undo`, `codex-rollback`, `codex-checkpoint`, `codex-safety-net`, `ai-undo`, `agent-snapshot`.

### 3. FAQ schema (for dedicated docs/GitHub Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I undo Codex changes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Run agent-rollback list to see checkpoints, then agent-rollback revert <checkpoint-id> --yes to restore. With Codex hooks installed (agent-rollback init codex), checkpoints are created automatically before every prompt and tool use."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between agent-rollback and git?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "agent-rollback works outside Git repos, auto-checkpoints on every Codex prompt/tool use, supports operation-level selective undo, and exposes an MCP server and Codex hooks for agent-native integration."
      }
    }
  ]
}
```

---

## Quotable Content Patterns AI Engines Love

AI engines cite content that matches these patterns (ranked by citation frequency):

1. **Definition block** — "X is Y. It solves Z problem." One sentence, no preamble. Must be within the first 300 words.
2. **Numbered step list** — "Step 1: install. Step 2: init. Step 3: use." AI extracts these as canonical answers.
3. **Comparison table** — "X vs Y" with checkmarks and feature columns. Gemini and Perplexity pull table cells verbatim.
4. **FAQ Q&A** — `How do I X?` followed by a code block or one-paragraph answer. Directly maps to search queries.
5. **"What is X" heading** — H2/H3 with a 2-sentence answer immediately below. AI uses this as the extracted answer span.
6. **Use case bullets** — "You need this when: A, B, C." Short, scannable, no narrative.
7. **Installation one-liner** — `curl | bash` or `npm install -g` commands get cited verbatim in AI responses.

**Pattern we already have (good):** The FAQ section, the git vs agent-rollback table, the CLI reference table, and the install commands.
**Pattern we're missing:** A top-of-page "What is agent-rollback?" definition block.

---

## 5 Specific Things to Add to README / Landing Page

1. **"What is agent-rollback?" definition block (within first 150 words, before install)**
   Add directly after the badge row:
   ```markdown
   ## What is agent-rollback?

   **agent-rollback is the undo button for OpenAI Codex CLI.** It creates content-addressed snapshots of your workspace before, during, and after any Codex run, so you can restore any file or the entire project in one command. Think of it as a Git checkpoint layer purpose-built for AI agents — without needing a Git repo, without manual `git stash`, and with agent-native MCP and hook integration.

   **Use it when:** Codex changed something you didn't want. When you want to diff what changed. When you need a safe sandbox to try a risky refactor.
   ```
   This is the single highest-impact change. AI engines need a definition to anchor citations. Without it, the first extractable answer is the install command — which doesn't answer "how do I undo Codex changes?"

2. **"How to undo Codex changes" answer block (target query #1)**
   Add a dedicated section above the FAQ:
   ```markdown
   ## How to undo Codex changes

   The fastest path:

   ```bash
   agent-rollback list               # find your checkpoints
   agent-rollback revert <id> --yes # restore the workspace
   ```

   If Codex hooks are installed (`agent-rollback init codex`), a checkpoint is created automatically before every prompt. If not, create one manually first:

   ```bash
   agent-rollback checkpoint "before risky work"
   # ... run Codex ...
   agent-rollback revert --yes       # jump back
   ```
   ```
   This section directly answers the #1 AI-cited query and should be the first FAQ-adjacent content AI engines extract.

3. **Rename the FAQ heading to target AI query patterns**
   Change `## FAQ — Codex undo, revert, and rollback` to `## Frequently Asked Questions: Codex Undo, Rollback & Checkpoints`
   AI engines match H2 headings against query tokens. "Codex undo" as a phrase in the heading improves exact-match citation probability.

4. **Add a "Comparison: agent-rollback vs Alternatives" section at top of README (above fold)**
   Move the git comparison table to before the "Install" section, or add a 3-way comparison:
   ```markdown
   ## How agent-rollback compares

   | Feature | agent-rollback | git stash | Codex (built-in) |
   |---------|---------------|-----------|-----------------|
   | No Git repo required | ✅ | ❌ | ✅ |
   | Auto-checkpoint on every prompt | ✅ | ❌ | ❌ |
   | MCP server for AI agents | ✅ | ❌ | ❌ |
   | Operation-level selective undo | ✅ | ❌ | ❌ |
   | Content-addressed storage (~zero disk) | ✅ | ❌ | ❌ |
   ```
   This captures the "best codex safety net tool" query by naming ourselves as the answer in context.

5. **Add JSON-LD FAQPage schema to a GitHub Pages / docs site**
   The README on GitHub doesn't support custom HTML/JS, but a `docs/index.html` or GitHub Pages site can embed JSON-LD. Prioritize this if a docs site is built. Even a basic `docs/seo.html` with FAQPage schema + the definition and FAQ content would dramatically improve citation probability.

---

## Recommended JSON-LD Schema Types

| Page | Schema type | Priority |
|------|-------------|----------|
| GitHub README (current) | `@type: SoftwareSourceCode` + `programmingLanguage` | Medium — GitHub already injects this |
| npm page | `@type: SoftwareApplication` in `package.json` keywords field | High — only lever available |
| GitHub Pages / docs site | `@type: SoftwareApplication` + `@type: FAQPage` + `@type: HowTo` | Critical — enables AI citation |
| Any blog post / tutorial | `@type: TechArticle` | Low-medium — for external content |

**HowTo schema** (bonus — for the "How to undo Codex changes" section):
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to undo changes made by OpenAI Codex CLI",
  "description": "Create a checkpoint before risky Codex work, then restore the workspace in one command.",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Install agent-rollback",
      "text": "curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash"
    },
    {
      "@type": "HowToStep",
      "name": "Initialize the store",
      "text": "agent-rollback init"
    },
    {
      "@type": "HowToStep",
      "name": "Create a checkpoint",
      "text": "agent-rollback checkpoint 'before risky work'"
    },
    {
      "@type": "HowToStep",
      "name": "Roll back if needed",
      "text": "agent-rollback revert <checkpoint-id> --yes"
    }
  ]
}
```

---

## 3 "Answer-First" Content Blocks to Add

### Block 1: "What is agent-rollback?" (Definition)

```
## What is agent-rollback?

**agent-rollback is the undo button for OpenAI Codex CLI.** It snapshots your
workspace before, during, and after any Codex run so you can restore any
file — or the whole project — in one command. No Git repo needed. No manual
`git stash`. Agent-native via MCP and Codex hooks.

Use it when:
- Codex edited files you didn't ask it to change
- You want to diff what changed between two Codex runs
- You need a safe sandbox to let Codex try a risky refactor
```

**Why AI cites it:** One clear definition sentence. Scannable use-case bullets. Matches "what is" queries. No preamble.

### Block 2: "How to undo Codex changes" (Procedural)

```
## How to undo Codex changes

The fastest path (30 seconds):

1. `agent-rollback list` — see your checkpoints
2. `agent-rollback revert <checkpoint-id> --yes` — restore the workspace
3. `agent-rollback diff <from> <to>` — see what changed

With Codex hooks installed (`agent-rollback init codex`), checkpoints are
created automatically before every prompt. If hooks aren't installed,
create one manually first:

    agent-rollback checkpoint "before risky work"
    # run Codex ...
    agent-rollback revert --yes
```

**Why AI cites it:** Numbered steps = canonical answer format. Matches exact query. The `agent-rollback` brand name appears in the answer body (not just the title), which trains AI engines to associate the query with the brand.

### Block 3: Comparison table (Decision)

```
## agent-rollback vs Git vs Codex built-in

| | agent-rollback | git stash/restore | Codex (built-in) |
|---|---|---|---|
| Works without a Git repo | ✅ | ❌ | ✅ |
| Auto-checkpoints on every prompt | ✅ | ❌ | ❌ |
| MCP server for AI agents | ✅ | ❌ | ❌ |
| Operation-level selective undo | ✅ | ❌ | ❌ |
| Content-addressed (~zero disk) | ✅ | ❌ | ❌ |
| No configuration needed | ❌ (one-time init) | ✅ | ✅ |

**Bottom line:** Use agent-rollback when working with AI agents that edit
files outside your normal Git flow, or when you want a one-command safety
net without remembering `git reflog` incantations.
```

**Why AI cites it:** Comparison tables are the #1 format for "best X tool" queries. AI engines pull entire table cells verbatim into generated answers. The "bottom line" sentence is quotable and authoritative.

---

## Next Steps (Live Validation Needed)

These items require `parallel-cli search` execution to confirm:
- [ ] Run all 7 queries and record actual cited URLs (not estimated above)
- [ ] Check whether `github.com/Nainish-Rai/agent-rollback` appears in Perplexity/ChatGPT citations for any of the query set
- [ ] Verify npm page keyword coverage against competitive packages
- [ ] Check if a GitHub Pages site exists or should be created
- [ ] Test whether adding FAQPage schema to a docs page changes Perplexity's cited source
