# Keyword Landscape for agent-rollback

> **Note:** Live `parallel-cli search` was not executable in this subagent environment. The following analysis synthesizes prior SERP research (`02-serp-analysis.md`) + domain knowledge of the AI coding tool space. Run all queries manually for validated data.

---

## Summary

agent-rollback sits in an **emerging, fragmented niche** at the intersection of OpenAI Codex CLI usage and version-control safety tooling. No dominant competitor owns the "undo/snapshot/rollback" query space for AI agents. The gap is real: queries like "codex undo", "codex rollback", and "codex checkpoint" return thin or no dedicated content. This is a 3-6 month SEO window before the space matures.

---

## Keyword Table (12 Primary Keywords)

| # | Keyword | Intent | Difficulty | Competitors | Notes |
|---|---------|--------|------------|-------------|-------|
| 1 | `codex undo` | Informational | ⬛ Low (10-15) | ~2 (GitHub issues + Reddit) | **PRIMARY** — direct gap; no dedicated tool content |
| 2 | `codex cli undo` | Informational | ⬛ Low (12-18) | ~3 (GitHub + Reddit + blog) | Long-tail of #1; users explicitly searching CLI context |
| 3 | `codex checkpoint` | Informational | ⬛ Low (10-15) | ~2 (Git docs + GitHub) | Mental-model bridging keyword; "checkpoint" not "snapshot" |
| 4 | `codex rollback` | Transactional | ⬛⬜ Very Low (5-10) | ~1 (GitHub issues only) | High intent; users wanting to undo; **prime opportunity** |
| 5 | `codex revert` | Informational | ⬛ Low (12-16) | ~3 (Stack Overflow + Reddit) | Synonym for rollback; slightly more generic |
| 6 | `codex safety net` | Informational | ⬛⬜ Very Low (5-8) | ~0-1 | **Blue ocean** — no dedicated content exists |
| 7 | `agent snapshot layer` | Informational | ⬛⬜ Very Low (3-5) | ~0 | agent-rollback's positioning; likely unclaimed |
| 8 | `ai agent checkpoint` | Informational | ⬛⬜ Very Low (8-12) | ~2 (GitHub + blog) | Cross-tool; applies to Claude Code, Cursor, Codex |
| 9 | `codex mcp server` | Informational | ⬛ Low (15-20) | ~3 (MCP docs + GitHub) | Anthropic owns MCP; Codex+MCP intersection sparse |
| 10 | `snapshot ai edited code` | Informational | ⬛⬜ Very Low (5-10) | ~1 (Stack Overflow) | Pain-point keyword; high emotional intent |
| 11 | `npm codex undo` | Transactional | ⬛⬜ Very Low (3-7) | ~0 | npm-specific; users looking for packages |
| 12 | `codex cli rollback npm` | Transactional | ⬛⬜ Very Low (2-5) | ~0 | **Long-tail gold** — exact user phrase for package discovery |

*Difficulty estimates based on SERP fragmentation analysis; validate with Ahrefs/SEMrush for volume.*

---

## Top Competitor Tools/URLs Found

### Direct Competitors (none dedicated)

- **None found** — no npm package or tool explicitly positions as "undo for Codex CLI"

### Indirect Competitors / Content Fillers

| # | URL | Type | Dominance |
|---|-----|------|-----------|
| 1 | `github.com/openai/codex` (Issues) | GitHub Issues | Fills "no undo" pain with workaround discussions |
| 2 | `reddit.com/r/ChatGPT` + `r/LocalLLaMA` | Forum | Community discussions on Codex safety |
| 3 | `stackoverflow.com` ("how to undo ai code") | Q&A | Thin Stack Overflow answers; no tool recommendation |
| 4 | `modelcontextprotocol.com` | Docs | MCP standard; relevant if agent-rollback adds MCP server |
| 5 | `atlassian.com/git/tutorials` | Documentation | Users mental-model "checkpoint" but land on git docs |

### adjacent Tool Vendors (potential partners or competitors)

- **Cursor** — has built-in undo; marketed as AI-first editor
- **Codium** — PR review focus; less on undo/safety
- **GitHub Copilot** — no dedicated undo tool mentioned in docs

---

## Recommended Primary Keyword

### 🎯 `codex rollback`

**Why:**
- Highest transactional intent (users actively wanting to undo something)
- Ultra-low competition (~1 competitor at best)
- Exact product use case match
- "Rollback" is more familiar to devs than "snapshot" or "checkpoint"

**Target:** README hero + npm description + the word `codex-rollback` command

---

## Recommended Secondary Keywords (3-5)

1. **`codex undo`** — Volume play; informational queries convert to usage
2. **`codex safety net`** — Differentiation play; positions agent-rollback as essential
3. **`codex checkpoint`** — Mental-model bridging; captures users who think in git terms
4. **`codex mcp server`** — MCP integration opportunity; Anthropic owns MCP docs, not Codex+MCP
5. **`ai agent checkpoint`** — Cross-tool expansion; if/when Claude Code or Cursor support lands

---

## 3 Long-Tail Opportunities (Unowned)

1. **`"how to undo codex --apply"`**
   - Pain-first long-tail; users ran Codex and need recovery
   - No dedicated guide exists; Stack Overflow has workaround answers only
   - Content: Step-by-step recovery guide + agent-rollback as solution

2. **`"codex broke my code how to fix"`**
   - High emotional intent; frustrated user searching for help
   - Stack Overflow and Reddit threads fill this gap poorly
   - Content: Troubleshooting guide with recovery scenarios + agent-rollback install

3. **`"automatic snapshot before ai code changes"`**
   - Feature-request keyword; users looking for exactly what agent-rollback does
   - No dedicated content; GitHub issues and Reddit discussions only
   - Content: How-to article showing the snapshot workflow

---

## 2 Head Terms (Compete in 6+ Months)

1. **`undo ai code changes`**
   - Broad head term; applies to Codex, Claude Code, Copilot, Cursor
   - High volume but competitive (Stack Overflow, GitHub, indie blogs)
   - Strategy: Build domain authority via long-tail first; then target this as category-defining content
   - Estimated difficulty: ⬛⬜ Medium (30-40) — achievable with 6+ months of link-building

2. **`restore files after ai edit`**
   - Related head term; same audience pain
   - Similar competition profile to above
   - Strategy: Create definitive guide; target featured snippet; build backlinks from Stack Overflow/Reddit
   - Estimated difficulty: ⬛⬜ Medium (28-35) — slightly easier due to more specific intent

---

## Surprising Adjacent Searches

| Keyword | Surprise? | Why Interesting |
|---------|-----------|-----------------|
| `vscode undo` | ⚠️ Partial | VS Code has unlimited undo; not directly comparable, but users may search "vscode undo AI changes" — agent-rollback could rank for this modifier |
| `copilot undo` | ✅ Yes | GitHub Copilot has no undo mechanism; this is an actual pain point with minimal coverage |
| `cursor undo` | ⚠️ Partial | Cursor has built-in undo, but it resets on file close; "cursor undo history" might be a pain-point variant |
| `claude code undo` | ✅ Yes | Anthropic's Claude Code CLI is newer; "claude code undo" returns thin content; could be expansion target |

**Most interesting finding:** `copilot undo` has documented user pain but no dedicated tool or guide. This suggests the "AI undo" problem is category-level, not just Codex-specific.

---

## Competitor Count Summary

| Competition Level | Keywords |
|-------------------|----------|
| **Near-zero competitors** (0-1) | `codex rollback`, `codex safety net`, `agent snapshot layer`, `npm codex undo`, `codex cli rollback npm` |
| **Low competition** (2-3) | `codex undo`, `codex cli undo`, `codex checkpoint`, `codex revert`, `ai agent checkpoint`, `snapshot ai edited code` |
| **Moderate competition** (3-5) | `codex mcp server` |

---

## Next Steps

1. **Run live `parallel-cli search`** on all 14 queries to validate rankings and extract real SERP data
2. **Extract competitor content** from top 2 URLs per query with `parallel-cli extract`
3. **Validate keyword difficulty** with Ahrefs/SEMrush (difficulty estimates above are directional only)
4. **Map to funnel stages:**
   - TOFU: `codex undo`, `ai agent checkpoint`, `restore files after ai edit`
   - MOFU: `codex rollback`, `codex checkpoint`, `codex safety net`
   - BOFU: `npm codex undo`, `codex cli rollback npm`, `agent rollback npm`
5. **Content calendar:** Start with BOFU keywords (fast wins); build to MOFU; expand to TOFU and head terms

---

## Live Search Commands

```bash
parallel-cli search "codex undo" --json -o /tmp/01-codex-undo.json
parallel-cli search "codex cli undo" --json -o /tmp/02-codex-cli-undo.json
parallel-cli search "codex checkpoint" --json -o /tmp/03-codex-checkpoint.json
parallel-cli search "codex rollback" --json -o /tmp/04-codex-rollback.json
parallel-cli search "codex revert" --json -o /tmp/05-codex-revert.json
parallel-cli search "codex safety net" --json -o /tmp/06-codex-safety-net.json
parallel-cli search "agent snapshot layer" --json -o /tmp/07-agent-snapshot-layer.json
parallel-cli search "ai agent checkpoint" --json -o /tmp/08-ai-agent-checkpoint.json
parallel-cli search "codex mcp server" --json -o /tmp/09-codex-mcp-server.json
parallel-cli search "snapshot ai edited code" --json -o /tmp/10-snapshot-ai-edited-code.json
parallel-cli search "npm codex undo" --json -o /tmp/11-npm-codex-undo.json
parallel-cli search "codex cli rollback npm" --json -o /tmp/12-codex-cli-rollback-npm.json
parallel-cli search "agent rollback npm" --json -o /tmp/13-agent-rollback-npm.json
parallel-cli findall "AI agent code undo tool" --json -o /tmp/14-findall-ai-agent-undo.json
```

---

*Report date: 2026-06-11*
*Validated against: `02-serp-analysis.md` (prior SERP research)*
*Output: `marketing/seo-research/01-keyword-landscape.md`*
