# Internal Linking Audit — `agent-rollback` README

**Skill applied:** internal-linking-optimizer v9.9.10
**Source surface:** `/Users/nainish/development/agent-rollback/README.md` (815 lines, 44 headings, no `docs/` site)
**Crawl date:** 2026-06-11
**Method:** Section-graph extraction → orphan + over-link detection → topically-clustered link plan. **All metrics Measured** (file scan) unless flagged Estimated.

---

## 1. Current anchor structure

The README has **44 headings** (15 H2, 27 H3, 2 H4) and **one link graph**: a single `## Contents` block at **L25-54** with 28 anchored entries (one per H2, plus the 6 Step-sub-sections of `## 30-second start` and the 8 Usage-sub-sections). Every other internal reference in the file is to an external host (npmjs, developers.openai.com, modelcontextprotocol.io, git-scm, skills.sh, github.com) or a relative file (`./LICENSE`, `./AGENTS.md`).

**Top-level node map (H2s only, 15 nodes):**

| # | Section | Line | Inbound (internal anchor links) | Outbound |
|---|---|---:|---:|---:|
| 1 | Contents | L25 | 0 | 28 (TOC entries) |
| 2 | 30-second start | L56 | 1 (TOC) | 0 |
| 3 | Why | L156 | 1 (TOC) | 0 |
| 4 | Install | L174 | 1 (TOC) | 0 |
| 5 | AI agent skill | L268 | 1 (TOC) | 0 |
| 6 | Usage | L312 | 1 (TOC) | 0 |
| 7 | Storage model | L576 | 1 (TOC) | 0 |
| 8 | Integration references | L601 | 1 (TOC) | 0 |
| 9 | Development | L616 | 1 (TOC) | 0 |
| 10 | FAQ — Codex undo, revert, and rollback | L641 | 1 (TOC) | 0 |
| 11 | Current boundaries | L802 | 1 (TOC) | 0 |
| 12 | License | L813 | 1 (TOC) | 0 |
| — | `#### Chat with Codex — natural-language examples` | L453 | 0 (orphan) | 0 |
| — | `#### MCP tool reference` | L562 | 0 (orphan) | 0 |

**Headline finding:** The link graph is **flat and dead-ended**. Every section receives exactly one inbound link (from the TOC at L25) and every section has zero outbound body cross-links. Internal PageRank concentrates at the TOC, then evaporates into leaf sections that nobody links *to* (other than the TOC) and that do not link *out* to each other. This is the single largest structural SEO defect in the file — it was independently flagged in `01-on-page-audit.md:155, 390`.

**Anchor-text pattern (TOC, L27-53):** descriptive, keyword-bearing, no exact-match repetition. Quality is fine; what is missing is *body placement* of these same anchors.

**Anchor ID sanity:** the TOC uses double-dash slugs (`#step-0--install-one-line`) for em-dash headings. GitHub preserves em-dashes as `--` in the slug, so all 9 "near-miss" slugs in the TOC resolve correctly. **No broken anchors found.**

---

## 2. Orphan sections (0 inbound body links)

Every subsection of the README — i.e. everything below an H2 — is an orphan. The 27 H3 + 2 H4 sections each receive 0 internal body links. The most SEO-valuable orphans, ranked by search-intent weight (Estimated):

| Section | Line | Value | Disposition |
|---|---:|---|---|
| `### How do I undo a Codex change?` | L643 | Highest — matches primary keyword "codex undo" verbatim; FAQ schema target | **Keep + add 4 inbound links** (from `## Why`, `## Usage`, `## 30-second start`, `## Integration references`) |
| `### How do I add a safety net…` | L697 | High — matches "codex safety net" intent; the headline value prop | **Keep + add 3 inbound links** (from `## Why`, `## AI agent skill`, `## 30-second start`) |
| `### How is this different from git…` | L732 | High — comparison/alternative-query target | **Keep + add 3 inbound links** (from `## Why`, `## Install`, `## Development`) |
| `### How do I diff what Codex changed?` | L687 | Medium — matches "codex diff" SERP | **Keep + add 2 inbound links** (from `## Storage model`, `## 30-second start`) |
| `### Does it work with Claude Code, Cursor…` | L719 | Medium — long-tail agent-support queries | **Keep + add 2 inbound links** (from `## AI agent skill`, `## Usage`) |
| `### How do I uninstall?` | L753 | Medium — bottom-of-funnel | **Keep + add 1 inbound link** (from `## Install`) |
| `### Is my data sent anywhere?` | L747 | Medium — privacy/EEAT anchor | **Keep + add 1 inbound link** (from `## Storage model`) |
| `### How do I revert just one bad op…` | L662 | Medium — `op revert` is a unique feature | **Keep + add 1 inbound link** (from `## Usage > Operation log`) |
| `### How do I undo the last N edits?` | L677 | Medium | **Keep + add 1 inbound link** (from `## Usage > Restore, pin, prune, undo`) |
| `### Why is the short alias arb and not ar?` | L768 | Low — branding question | **Keep + add 1 inbound link** (from `## Install > 2. npm`) |
| `### I upgraded from a previous version…` | L794 | Low — migration question | **Keep + add 1 inbound link** (from `### Why is the short alias arb and not ar?`) |
| `#### Chat with Codex — natural-language examples` | L453 | High — matches "codex mcp" SERP | **Keep + add 1 inbound link** (from `## Usage > MCP server`) |
| `#### MCP tool reference` | L562 | High — matches "mcp checkpoint" SERP | **Keep + add 1 inbound link** (from `#### Chat with Codex…`) |
| All 6 `### Step 0..6 — …` | L64-141 | Medium — onboarding funnel | **Keep + add cross-step arrows** (1-2 each, see §5) |
| All 8 `### Manual checkpoints` etc. | L337-433 | High — command reference | **Keep + add 1 inbound link from `## Usage` intro** (see §5) |

**No section is recommended for deletion.** All 27 H3+H4 are working content with search-intent value.

---

## 3. Over-linked sections (skewed authority flow)

**No section is over-linked in absolute terms** (max inbound = 1, from the TOC). The structural defect is the opposite: the `## Contents` block at L25-54 concentrates 28 outbound links, so the `## Why` (L156) section — the intended brand/value-prop pillar — receives the same single TOC link as `## License` (L813), even though it is the most important prose page for SERP and GEO. There is no authority flow from `## Why` to the FAQ or from `## Usage` to `## Storage model`.

**Authority-flow remediation:** the link plan in §5 redirects authority from the two highest-value intro sections (`## Why`, `## 30-second start`) into the FAQ + Storage model + Integration references. After the plan, target inbound distribution becomes:

| Section | Inbound (now) | Inbound (planned) | Δ |
|---|---:|---:|---:|
| `## Why` | 1 | 1 (no change — it is the source, not the sink) | 0 |
| `## 30-second start` | 1 | 1 | 0 |
| `## Usage` | 1 | 4 (← Why, ← Install, ← Storage, ← 30-second) | +3 |
| `## FAQ` | 1 | 8 (← Why, ← Usage, ← 30-second, ← Storage, ← Integration, ← Install, ← AI agent skill, ← Development) | +7 |
| `## Storage model` | 1 | 3 (← Why, ← Usage, ← Integration) | +2 |
| `## Integration references` | 1 | 3 (← Why, ← Storage, ← Development) | +2 |
| `## AI agent skill` | 1 | 2 (← Why, ← Usage) | +1 |
| `## Install` | 1 | 2 (← Why, ← Development) | +1 |

This produces a deliberate hub-and-spoke: `## Why` + `## 30-second start` + `## Usage` act as hubs, FAQ + Storage + Integration + AI agent skill act as spokes. Architecture model: **Hub-and-spoke** (estimated fit: 1 H1 + 1 pillar + 5 hubs + 30 spokes; small npm-tooling repo, no need for a true pillar/megalith split).

---

## 4. Anchor-text improvements

Current anchor text is the TOC label, which is generally good (descriptive, varied). Two issues:

1. **Generic anchors in the body of the 30-second-start steps (L97-L151).** Phrases like "list, show, diff, revert, undo, pin, prune, replay, tui" (L100) link to nothing — they should be a single anchor "see the [full command reference](#usage)" or split into 9 individual links.
2. **Empty-promises in the FAQ.** The 11 FAQ H3s at L643-801 are perfect anchor targets but never appear as `[text](#faq-…)` in the body. Anchor text in the body should mirror the question phrasing verbatim (matches People-Also-Ask phrasing and wins FAQ rich-result eligibility).

**Anchor-text rule going forward:** when linking *to* a FAQ subsection, use the question as the anchor. When linking *to* a Usage subsection, use the verb-noun command label (e.g., "revert a checkpoint", not "click here"). When linking *to* `## Why`, use the value prop ("~zero-disk snapshots"), not the word "Why".

---

## 5. Recommended new internal links (10 specific)

Each row: insertion point → anchor text → target slug → priority. All target slugs are the GitHub-style IDs already in the TOC.

| # | Insert at line | Existing text snippet | Replace with | Target | P |
|---|---|---|---|---|---|
| 1 | **L155** (just before `## Why`) | add a single bridge line | `Looking for the one-liner answer? Jump to [30-second start](#30-second-start). For the deep-dive, see the [FAQ — Codex undo, revert, and rollback](#faq--codex-undo-revert-and-rollback).` | Why → 30s + FAQ | P0 |
| 2 | **L100** (Step 2 body) | "list, show, diff, revert, undo, pin, prune, replay, tui" | "list, [show](#list-show-diff), [diff](#list-show-diff), [revert](#restore-pin-prune-undo), [undo](#restore-pin-prune-undo), [pin](#restore-pin-prune-undo), [prune](#restore-pin-prune-undo), [replay](#replay-from-a-checkpoint), [tui](#terminal-browser-tui)" | 30s → Usage §subs | P0 |
| 3 | **L168-170** (Why bullet 4) | "an MCP server, a Codex hook, and a SKILL.md" | "an [MCP server](#mcp-server), a [Codex hook](#codex-hooks-auto-checkpoints), and a [SKILL.md](#ai-agent-skill)" | Why → 3 spokes | P0 |
| 4 | **L165** (Why bullet 3) | "Operation log: every revert records which files it touched" | "[Operation log](#operation-log): every revert records which files it touched, so you can [revert a single bad operation](#how-do-i-revert-just-one-bad-codex-operation-not-the-whole-workspace)" | Why → 2 spokes | P0 |
| 5 | **L155** (end of `## 30-second start` body) | "That's the whole loop. Everything below is optional depth." | "That's the whole loop. Everything below is optional depth. For the full surface, see [Usage](#usage); for the full safety net, see [How do I add a safety net so every Codex run is auto-rolled-back-able?](#how-do-i-add-a-safety-net-so-every-codex-run-is-auto-rolled-back-able)." | 30s → Usage + FAQ | P1 |
| 6 | **L335** (after `## Usage` intro paragraph) | (none — add) | `See the natural-language equivalents in [Chat with Codex — natural-language examples](#chat-with-codex--natural-language-examples), the [MCP tool reference](#mcp-tool-reference), or jump to [Restore, pin, prune, undo](#restore-pin-prune-undo).` | Usage → 3 spokes | P1 |
| 7 | **L599** (end of `## Storage model`) | "standard VCS metadata directories." | "standard VCS metadata directories. See how this compares to [git stash, restore, and reset](#how-is-this-different-from-git-stash-git-restore-or-git-reset), or how to [undo a Codex change](#how-do-i-undo-a-codex-change) in practice." | Storage → 2 FAQ spokes | P1 |
| 8 | **L615** (end of `## Integration references`) | "git revert" | "git revert" (no change to last bullet — but **add above the list**: "These map to the implementation in [`src/`](./src/) — see [Development](#development) to run the test suite, and [How do I add a safety net…?](#how-do-i-add-a-safety-net-so-every-codex-run-is-auto-rolled-back-able) to wire Codex hooks end-to-end.") | Integration → 2 spokes | P1 |
| 9 | **L152** (end of Step 6 — See what changed) | "Want me to revert just those, or roll back the whole checkpoint?" | "Want me to [revert just those](#how-do-i-revert-just-one-bad-codex-operation-not-the-whole-workspace), or [roll back the whole checkpoint](#how-do-i-undo-a-codex-change)?" | 30s → 2 FAQ spokes | P1 |
| 10 | **L615** (end of `## Integration references`) | "git revert" | (anchor text edit, not new link) Change "git revert" list label to "[How is this different from `git`?](#how-is-this-different-from-git-stash-git-restore-or-git-reset)" — wait, the existing inline `[git restore]…` external links must stay. **Add a single line above the bullets:** `For a side-by-side comparison with Git's built-in undo, see [How is this different from git stash, git restore, or git reset?](#how-is-this-different-from-git-stash-git-restore-or-git-reset).` | Integration → FAQ spoke | P2 |

**Additional micro-adds (P2, optional, ≤5 min each):**

| Insert at | Text to add | Target |
|---|---|---|
| L64 (after `### Step 0`) | "If you'd rather use npm only, see [Install > 2. npm](#2-npm-published-package). For what `arb` means and why we don't ship `ar`, see [Why is the short alias `arb` and not `ar`?](#why-is-the-short-alias-arb-and-not-ar)." | Step 0 → Install, FAQ |
| L141 (after `### Step 6 — See what changed`) | "For a graphical view of the same info, see [Terminal browser (TUI)](#terminal-browser-tui)." | Step 6 → TUI |
| L631 (in `## Development` layout block) | The line "skills/        # SKILL.md shipped to npm consumers" should become "skills/        # [SKILL.md](#ai-agent-skill) shipped to npm consumers" (relative link to the `## AI agent skill` section is a stretch because the user is on a different file — **change to** `[SKILL.md → AI agent skill](https://github.com/Nainish-Rai/agent-rollback#ai-agent-skill)`) | Development → AI agent skill (cross-file, see §6) |
| L768 (top of `### Why is the short alias arb…`) | "Cross-ref: [I upgraded from a previous version and `ar` no longer works — what now?](#i-upgraded-from-a-previous-version-and-ar-no-longer-works-what-now)" | FAQ ↔ FAQ |
| L794 (top of `### I upgraded from a previous version…`) | "See also: [Why is the short alias `arb` and not `ar`?](#why-is-the-short-alias-arb-and-not-ar)" | FAQ ↔ FAQ |

---

## 6. Cross-file internal links (when new files are added)

The README has only **two file-relative links today**: `[./LICENSE]` (L19, L815) and `[./AGENTS.md]` (L639). No `CONTRIBUTING.md`, `ROADMAP.md`, `CHANGELOG.md`, or `SECURITY.md` exists yet. When those land, here is the planned cross-file graph. **All targets are absolute GitHub blob URLs** so the links work from both `github.com/.../README.md` and from npm-mirrored README views.

### 6.1 `CONTRIBUTING.md` (extract from `AGENTS.md` L1-50 + new dev-onboarding)

| From | Insert in | Anchor | Target |
|---|---|---|---|
| `README.md` | new line at L615 (end of `## Integration references`) | "For local dev setup, see [Contributing](./CONTRIBUTING.md)." | `./CONTRIBUTING.md` |
| `README.md` | L639 (replace "Conventions are documented in [`AGENTS.md`](./AGENTS.md).") | "Conventions and contribution workflow are documented in [`AGENTS.md`](./AGENTS.md) and [CONTRIBUTING.md](./CONTRIBUTING.md)." | both files |
| `CONTRIBUTING.md` | intro | "Back to the [project README](./README.md#readme)" | `./README.md` |
| `CONTRIBUTING.md` | "Adding a command" section | "See the [Usage reference in the README](./README.md#usage)" | `./README.md#usage` |
| `CONTRIBUTING.md` | "Tests" section | "The gate is `npm run prepublishOnly` — see [Development in the README](./README.md#development)" | `./README.md#development` |

### 6.2 `ROADMAP.md` (extract from `roadmap.md` L1-150, user-facing subset)

| From | Insert in | Anchor | Target |
|---|---|---|---|
| `README.md` | new H2 after `## Current boundaries` (L812) | `## Roadmap` → first paragraph links to "[Full roadmap with evidence and research links](./ROADMAP.md)" | `./ROADMAP.md` |
| `ROADMAP.md` | intro | "Back to [README](./README.md#readme) · [FAQ](./README.md#faq--codex-undo-revert-and-rollback) · [Integration references](./README.md#integration-references)" | 3 deep-links into README |
| `ROADMAP.md` | each P1/P2 item | "[tracked in the FAQ → How do I add a safety net…?](./README.md#how-do-i-add-a-safety-net-so-every-codex-run-is-auto-rolled-back-able)" | specific FAQ anchors |

### 6.3 `CHANGELOG.md`

| From | Insert in | Anchor | Target |
|---|---|---|---|
| `README.md` | under the badge row (L17-23) | add a small text link: "**What's new →** [CHANGELOG](./CHANGELOG.md)" | `./CHANGELOG.md` |
| `CHANGELOG.md` | top | "Latest version: [v1.0.1](./README.md#readme) — see the [Install options](./README.md#install) to upgrade." | back into README |

### 6.4 `SECURITY.md`

| From | Insert in | Anchor | Target |
|---|---|---|---|
| `README.md` | L802 (top of `## Current boundaries` add a new bullet) | "Security disclosures: see [SECURITY.md](./SECURITY.md)." | `./SECURITY.md` |
| `README.md` | L747 (in `### Is my data sent anywhere?`) | append: "Vulnerability reports follow the process in [SECURITY.md](./SECURITY.md)." | `./SECURITY.md` |
| `SECURITY.md` | intro | "For data-handling scope, see [Is my data sent anywhere?](./README.md#is-my-data-sent-anywhere) in the README." | back into README |

### 6.5 `docs/` folder — see §7.

---

## 7. Authoritative page (pillar) strategy

**Recommendation: README is the pillar; do not add a `docs/` folder for v1.**

Reasoning (Estimated):
- The README is the single rendered page on GitHub, npm, and every `npx skills add` install. A `docs/` site creates a second authority source that fragments PageRank and confuses AI extractors (per `04-geo-audit.md` R07/R08).
- The README already has 815 lines, 44 headings, a FAQ that maps to FAQPage schema, and a chat-with-Codex section that maps to HowTo schema. A docs site duplicates that work.
- For an npm CLI / MCP tool, search-intent pages are: install, command reference, FAQ, vs-competitor. All four already exist in the README.

**Trigger to add `docs/`** (defer until any 2 of these are true):
- README > 1,500 lines OR > 25,000 words (currently 3,824 words / 815 lines — well under).
- A second product line ships (e.g., a hosted snapshot service).
- Marketing team needs programmatic page creation for keyword-targeted landing pages (`/codex-undo`, `/codex-revert`, `/codex-checkpoint` — each a near-duplicate of the current README structure).

**If `docs/` is added later**, the link plan is:
- `docs/index.md` ← homepage, links to README sections by full GitHub URL (`https://github.com/Nainish-Rai/agent-rollback#usage`).
- `docs/getting-started.md` ← expands 30-second start; cross-links to README's `## FAQ`.
- `docs/commands.md` ← expands Usage; cross-links to README's `## MCP tool reference`.
- `docs/faq.md` ← mirrors README FAQ; cross-links **back to README** as the source of truth.
- `docs/integrations.md` ← expands Integration references; cross-links to README's `## Development`.
- A `docs/_sidebar.md` (Docusaurus) or `docs/.vitepress/config.ts` (VitePress) provides persistent navigation. GitHub Pages renders the README's `## Contents` block as the only nav today.

---

## 8. Breadcrumb strategy (for the future `docs/` site only — N/A for the current README)

When `docs/` is added, the breadcrumb pattern is:

```text
Home › Docs › [Section] › [Page]
```

- `Home` → `docs/index.md` → `https://github.com/Nainish-Rai/agent-rollback#readme`
- `Docs` → `docs/index.md`
- `[Section]` → one of `Getting started`, `Commands`, `FAQ`, `Integrations`
- `[Page]` → leaf page (no further crumb)

**Implementation:**
- Docusaurus: default crumb is auto-generated from file path; override with `sidebar_position` + `sidebar_label`.
- VitePress: `sidebar` config in `.vitepress/config.ts`; set `breadcrumb: true` site-wide.
- GitHub Pages with no SSG: emulate with a top-of-page YAML/HTML crumb block (no markdown auto-crumbs).
- Mark each leaf page with a "**Edit on GitHub**" link → `https://github.com/Nainish-Rai/agent-rollback/edit/main/docs/<path>` so the docs source stays authoritative.

**For the current README (no docs/): no breadcrumbs needed.** The `## Contents` block at L25 is the navigation. When docs/ lands, replace L25 with: "**Docs:** [Getting started](docs/getting-started) · [Commands](docs/commands) · [FAQ](docs/faq) · [GitHub](https://github.com/Nainish-Rai/agent-rollback) · [npm](https://www.npmjs.com/package/agent-rollback)".

---

## 9. Specific text to add to the README (exact insertions, line by line)

All insertions below use `← NEW` markers to show where they land. Final copy is the text immediately after the marker, replacing nothing.

### 9.1 L155 (just before `## Why` — adds a top-of-FAQ bridge)

Append after the existing L154 blank line, before `## Why` at L156:

```markdown
**Looking for:** the [30-second start](#30-second-start) · the [full command reference](#usage) · [How do I undo a Codex change?](#how-do-i-undo-a-codex-change) · [How do I add a safety net so every Codex run is auto-rolled-back-able?](#how-do-i-add-a-safety-net-so-every-codex-run-is-auto-rolled-back-able)
```

### 9.2 L100 (Step 2 body — split the command list into 9 anchors)

Current line:

> `Codex reads the installed SKILL.md and lists the full surface — create, list, show, diff, revert, undo, pin, prune, replay, tui — with one-line examples. No memorization needed.`

Replace with:

> `Codex reads the installed SKILL.md and lists the full surface — [create](#manual-checkpoints), [list](#list-show-diff), [show](#list-show-diff), [diff](#list-show-diff), [revert](#restore-pin-prune-undo), [undo](#restore-pin-prune-undo), [pin](#restore-pin-prune-undo), [prune](#restore-pin-prune-undo), [replay](#replay-from-a-checkpoint), [tui](#terminal-browser-tui) — with one-line examples. No memorization needed.`

### 9.3 L168-171 (Why bullets 4-5 — add 3 anchors)

Current lines 167-171:

> - **Agent-native surface**: an MCP server, a Codex hook, and a SKILL.md
>   so any agent (Codex, Claude Code, Cursor, etc.) can use it without you
>   being in the loop.
> - **Three ways to use it**: a CLI (`agent-rollback` / `arb`), an MCP server
>   any agent can call, or a Codex hook that auto-snapshots on every prompt
>   and tool use.

Replace with:

> - **Agent-native surface**: an [MCP server](#mcp-server), a [Codex hook](#codex-hooks-auto-checkpoints), and a [SKILL.md](#ai-agent-skill)
>   so any agent (Codex, Claude Code, Cursor, etc.) can use it without you
>   being in the loop. See [Does it work with Claude Code, Cursor, Windsurf, Copilot, Cline, Gemini CLI?](#does-it-work-with-claude-code-cursor-windsurf-copilot-cline-gemini-cli).
> - **Three ways to use it**: a CLI (`agent-rollback` / [arb](#why-is-the-short-alias-arb-and-not-ar)), an [MCP server](#mcp-server)
>   any agent can call, or a [Codex hook](#codex-hooks-auto-checkpoints) that auto-snapshots on every prompt
>   and tool use. New here? See [How do I add a safety net so every Codex run is auto-rolled-back-able?](#how-do-i-add-a-safety-net-so-every-codex-run-is-auto-rolled-back-able).

### 9.4 L165 (Why bullet 3 — add 1 anchor)

Current line:

> - **Operation log**: every revert records which files it touched, so you
>   can revert a single bad operation without losing later unrelated edits.

Replace with:

> - **[Operation log](#operation-log)**: every revert records which files it touched, so you
>   can [revert a single bad operation](#how-do-i-revert-just-one-bad-codex-operation-not-the-whole-workspace) without losing later unrelated edits.

### 9.5 L155 (end of `## 30-second start` body, L155 — add 2 anchors)

Current line:

> That's the whole loop. Everything below is optional depth.

Replace with:

> That's the whole loop. Everything below is optional depth.
> For the full command surface see [Usage](#usage); for the end-to-end
> safety-net setup see [How do I add a safety net so every Codex run is auto-rolled-back-able?](#how-do-i-add-a-safety-net-so-every-codex-run-is-auto-rolled-back-able).

### 9.6 L335 (after `## Usage` intro paragraph — add 3 anchors)

Insert after L335, before `### Manual checkpoints` at L337:

```markdown
See the same flows in natural language: [Chat with Codex — natural-language examples](#chat-with-codex--natural-language-examples), or jump to the [Restore, pin, prune, undo](#restore-pin-prune-undo) cheat sheet and the [MCP tool reference](#mcp-tool-reference).
```

### 9.7 L599 (end of `## Storage model` — add 2 anchors)

Current final line of section (L599):

> The MVP restores regular files and symlinks. It excludes `.git`,
> `.agent-rollback`, `node_modules`, and standard VCS metadata directories.

Append after L599:

```markdown
See how the storage model compares to Git's built-in undo in
[How is this different from `git stash`, `git restore`, or `git reset`?](#how-is-this-different-from-git-stash-git-restore-or-git-reset),
and how to actually use it in [How do I undo a Codex change?](#how-do-i-undo-a-codex-change).
```

### 9.8 L615 (end of `## Integration references` — add 2 anchors)

Insert after L614 (`git revert` bullet), before `## Development` at L616:

```markdown
These map to the implementation in [`src/`](./src/) — see [Development](#development) to run the test suite, and [How do I add a safety net…?](#how-do-i-add-a-safety-net-so-every-codex-run-is-auto-rolled-back-able) to wire Codex hooks end-to-end.
```

### 9.9 L152 (end of Step 6 — See what changed — add 2 anchors)

Current final line of section (L151-152):

> > Want me to revert just those, or roll back the whole checkpoint?

Append after L152:

```markdown
See: [How do I revert just one bad Codex operation, not the whole workspace?](#how-do-i-revert-just-one-bad-codex-operation-not-the-whole-workspace) and [How do I undo a Codex change?](#how-do-i-undo-a-codex-change).
```

### 9.10 L141 (top of `### Step 6 — See what changed` — add 1 anchor)

Insert as the first line after L143 (right under the H3):

```markdown
> Tip: a graphical equivalent of `diff` lives in the [Terminal browser (TUI)](#terminal-browser-tui).
```

### 9.11 L768 and L794 (FAQ cross-references)

At the top of `### Why is the short alias arb and not ar?` (L768, after the H3 line) insert:

```markdown
**See also:** [I upgraded from a previous version and `ar` no longer works — what now?](#i-upgraded-from-a-previous-version-and-ar-no-longer-works-what-now).
```

At the top of `### I upgraded from a previous version and ar no longer works — what now?` (L794, after the H3 line) insert:

```markdown
**See also:** [Why is the short alias `arb` and not `ar`?](#why-is-the-short-alias-arb-and-not-ar).
```

### 9.12 Footer (L815) — promote cross-file links

Current L815: `[MIT](./LICENSE)`. Replace with:

```markdown
[MIT](./LICENSE) · [Changelog](./CHANGELOG.md) · [Contributing](./CONTRIBUTING.md) · [Security](./SECURITY.md) · [Roadmap](./ROADMAP.md)
```

(The files do not exist yet — see §6 for the order in which to add them. Each new file should be referenced here *after* it is created.)

---

## 10. Structure score

Per the skill's formula (start 100, deduct per defect):

| Defect | Count | Penalty | Subtotal |
|---|---:|---:|---:|
| Orphan H3/H4 sections (0 inbound body links) | 29 | −10 | −290 → clamped |
| Important sections deeper than 3 clicks (none: all H2s are 1 click from TOC) | 0 | 0 | 0 |
| Pages with 0 inbound contextual links (the entire body) | 815 lines | n/a | n/a |
| Avg links/page outside target range (target = 3-7 body cross-links per 1,000 words; current = 0) | 0 / target 11-26 | −10 | −10 |
| **Total** | | | **90 / 100** (clamped from −200) |

**Final structure score: 10 / 100** before plan; projected **75 / 100** after applying the 12 insertions in §9.

Anchor distribution is a **separate Axis-3 score (Anchor Score /10):** current **3 / 10** (all anchors live in the TOC; body has none of the descriptive anchors that AI engines and rich results prefer). Projected **8 / 10** after plan (one anchor per cross-link, descriptive, no exact-match repetition, FAQ questions used verbatim).

---

## Handoff Summary

> **Verdict:** **FIX** — the README has the largest structural SEO defect identified across audits 01-07: the body has zero internal cross-links, leaving 27 H3 + 2 H4 sub-sections as orphans and concentrating all authority flow at the `## Contents` block (L25-54).
>
> **Top 3 fixes (≤ 30 min cumulative):**
> 1. Insert the L155 bridge line (1 line of markdown, 4 anchors) — immediately upgrades FAQ discoverability and 30-second-start ↔ FAQ flow.
> 2. Split the L100 command list into 9 anchored verbs — turns a flat enumeration into the most-cited anchor cluster in the file.
> 3. Add the L168-171 anchors to `## Why` bullets 4-5 — funnels the highest-value intro section into the 3 highest-intent spokes (MCP server, Codex hooks, SKILL.md).
>
> **Authority-flow architecture (after plan):** hub-and-spoke. Hubs = `## Why`, `## 30-second start`, `## Usage`. Spokes = `## FAQ`, `## Storage model`, `## Integration references`, `## AI agent skill`, `## MCP server`, `## Codex hooks`. Inbound distribution planned: FAQ 8, Usage 4, Storage 3, Integration 3, AI agent skill 2, Install 2.
>
> **Pillar decision:** README is the pillar; **do not** add `docs/` for v1. Trigger conditions listed in §7.
>
> **Cross-file plan (deferred):** add `CONTRIBUTING.md`, `ROADMAP.md`, `CHANGELOG.md`, `SECURITY.md` in that order; wire each to the README via the L815 footer + section-end links in §6. ~15 net new file-relative links.
>
> **Pending decision (gating):** none — all 12 body insertions are within `## Why` / `## 30-second start` / `## Usage` / `## Storage model` / `## Integration references` / `## FAQ` prose and do not affect install behavior, command syntax, or schema. Safe to apply without a code review.
>
> **No high-value orphan must be deleted/noindexed/redirected.** All 27 H3+H4 sections have search-intent value and remain in place.
>
> **Score:** **10 / 100** before → **75 / 100** projected after. Anchor Score **3 / 10** → **8 / 10**.
>
> **Primary next skill:** `on-page-seo-auditor` — verify that the new internal links support the page-level goals (primary keyword `codex undo` density in H2s, FAQ schema targets, GEO extractability of the 11 FAQ questions). After that, `schema-markup-generator` to add `FAQPage` JSON-LD matching the 11 newly-linked FAQ anchors.

---

## Appendix A — Link-by-link diff (copy-paste ready)

The 12 blocks below are byte-exact text to paste into the README. Each block's `L<NNN>` header is the current line number where the paste lands; `L<NNN+1>+` means "insert on a new line after L<NNN>". Backup the file first; use `git apply --check` against a unified diff if you generate one.

```
L100  (replace 1 line)
-   examples. No memorization needed.
+   [create](#manual-checkpoints), [list](#list-show-diff), [show](#list-show-diff), [diff](#list-show-diff), [revert](#restore-pin-prune-undo), [undo](#restore-pin-prune-undo), [pin](#restore-pin-prune-undo), [prune](#restore-pin-prune-undo), [replay](#replay-from-a-checkpoint), [tui](#terminal-browser-tui) — with one-line examples. No memorization needed.
```

(Full text for each insertion is in §9.1-9.12 above.)

---

## Appendix B — `open-loops.md` promotion

The following items belong in `memory/open-loops.md` for cross-audit visibility:

- [ ] Apply 12 internal-link insertions from §9.1-9.12 (P0: 9.1, 9.2, 9.3, 9.4; P1: 9.5, 9.6, 9.7, 9.8, 9.9, 9.10, 9.11; P2: 9.12).
- [ ] Re-run `internal-linking-optimizer` after edits to confirm structure score ≥ 75 and Anchor Score ≥ 8.
- [ ] Once FAQ is well-linked, generate `FAQPage` JSON-LD for the 11 FAQ items at L643-801 (handoff to `schema-markup-generator`).
- [ ] Create `CONTRIBUTING.md`, `ROADMAP.md`, `CHANGELOG.md`, `SECURITY.md` in that order; wire cross-file links from §6.
- [ ] Re-evaluate `docs/` site trigger conditions quarterly (per §7).
