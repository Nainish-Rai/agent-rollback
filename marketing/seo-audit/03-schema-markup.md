# Schema Markup — agent-rollback

> Source values come from `package.json` (v1.0.1), `LICENSE` (MIT, © 2026 Nainish Rai), and the README. Dates are flagged as placeholders where a real value is not known; the `aggregateRating` block is a placeholder per spec (no real reviews yet).
>
> **Rich-result deprecation flags (skill SOP):**
> - `FAQPage` and `HowTo` are emitted for **semantic / AEO** value and entity understanding. Google retired generic FAQ rich results on 2026-05-07 and deprecated HowTo on desktop (2023). Do not promise SERP accordions from these blocks.
> - `SoftwareApplication` is the highest-ROI block here — it can power the npm "package" knowledge panel and `aggregateRating` star snippets once real ratings exist.
>
> **Validate before deploy:** Schema.org Validator + Google Rich Results Test. Keep `dateModified` accurate on every README change.

---

## 1. SoftwareApplication (npm page header)

### SoftwareApplication — paste into the npm package page header / docs site head

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "agent-rollback",
  "alternateName": "arb",
  "description": "Git-like undo and rollback checkpoints for OpenAI Codex CLI. Snapshot, diff, and restore files before and after Codex edits. MCP server + Codex hooks for automatic safety net. Works with Claude Code, Cursor, Windsurf, Copilot, Cline, Gemini CLI.",
  "url": "https://www.npmjs.com/package/agent-rollback",
  "downloadUrl": "https://registry.npmjs.org/agent-rollback/-/agent-rollback-1.0.1.tgz",
  "softwareVersion": "1.0.1",
  "applicationCategory": "DeveloperApplication",
  "applicationSubCategory": "AI Agent Safety Net / Snapshot Tool",
  "operatingSystem": [
    "macOS",
    "Linux",
    "Windows (via WSL)"
  ],
  "programmingLanguage": "JavaScript",
  "runtimePlatform": "Node.js >= 20",
  "license": "https://opensource.org/licenses/MIT",
  "isAccessibleForFree": true,
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "PLACEHOLDER_rating_value",
    "ratingCount": "PLACEHOLDER_rating_count",
    "bestRating": "5",
    "worstRating": "1"
  },
  "author": {
    "@type": "Person",
    "name": "Nainish Rai",
    "alternateName": "nainish-rai",
    "url": "https://github.com/Nainish-Rai"
  },
  "publisher": {
    "@type": "Person",
    "name": "Nainish Rai",
    "url": "https://github.com/Nainish-Rai"
  },
  "maintainer": {
    "@type": "Person",
    "name": "Nainish Rai",
    "alternateName": "nainish-rai",
    "url": "https://github.com/Nainish-Rai"
  },
  "codeRepository": "https://github.com/Nainish-Rai/agent-rollback",
  "softwareRequirements": "Node.js >= 20",
  "featureList": [
    "CLI (agent-rollback / short alias arb)",
    "MCP stdio server for Codex, Claude Code, Cursor",
    "Codex hooks for auto-checkpoints on every prompt and tool use",
    "Content-addressed snapshots with ~zero disk overhead",
    "Operation-level undo via append-only ops.jsonl",
    "Terminal browser (TUI) with diff preview",
    "100% local — no telemetry, no cloud sync"
  ],
  "screenshot": "https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/.agent-rollback/screenshot.png"
}
```


**Visible-content alignment:** every field traces to `package.json` or the README. `aggregateRating.ratingValue` and `ratingCount` are flagged `PLACEHOLDER_*` and must be replaced (or the block removed) when the first real review lands — do not ship fabricated ratings.

---

## 2. TechArticle (README as tutorial)

### TechArticle — paste into the docs site <head> on the rendered README page

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "agent-rollback — Codex CLI undo, revert, and rollback checkpoints",
  "description": "Tutorial: install agent-rollback in one line, create a checkpoint, run Codex, browse snapshots, diff what changed, and roll back a bad edit. Includes MCP server and Codex hook setup for 18+ AI agents.",
  "url": "https://github.com/Nainish-Rai/agent-rollback#readme",
  "author": {
    "@type": "Person",
    "name": "Nainish Rai",
    "alternateName": "nainish-rai",
    "url": "https://github.com/Nainish-Rai"
  },
  "publisher": {
    "@type": "Person",
    "name": "Nainish Rai",
    "url": "https://github.com/Nainish-Rai"
  },
  "datePublished": "2026-06-11",
  "dateModified": "2026-06-11",
  "inLanguage": "en",
  "proficiencyLevel": "Beginner",
  "dependencies": "Node.js >= 20",
  "keywords": "codex, codex-cli, openai, codex-undo, codex-revert, codex-checkpoint, codex-rollback, codex-snapshot, mcp, model-context-protocol, ai-agent, claude-code, cursor, windsurf, copilot, cline, gemini-cli, snapshot, undo, revert, rollback, checkpoint, dev-tools",
  "about": [
    {
      "@type": "SoftwareApplication",
      "name": "agent-rollback",
      "url": "https://www.npmjs.com/package/agent-rollback"
    },
    {
      "@type": "SoftwareApplication",
      "name": "OpenAI Codex CLI",
      "url": "https://developers.openai.com/codex/cli"
    },
    {
      "@type": "SoftwareApplication",
      "name": "Model Context Protocol",
      "url": "https://modelcontextprotocol.io"
    }
  ],
  "mainEntity": {
    "@type": "SoftwareApplication",
    "name": "agent-rollback",
    "softwareVersion": "1.0.1"
  },
  "isPartOf": {
    "@type": "WebSite",
    "name": "agent-rollback",
    "url": "https://github.com/Nainish-Rai/agent-rollback"
  }
}
```


**Visible-content alignment:** `headline` mirrors the README H1 + tagline; `keywords` mirror `package.json` `keywords`; `dependencies: "Node.js >= 20"` matches `engines.node`. `datePublished` / `dateModified` are placeholders — backfill from `git log --follow README.md` (first commit / latest commit) before going live.

---

## 3. SoftwareSourceCode (GitHub repo)

### SoftwareSourceCode — paste into the repo's <head> if you serve a static site, or the docs landing

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "agent-rollback",
  "description": "Git-like undo and rollback checkpoints for OpenAI Codex CLI — CLI, MCP server, and Codex hook.",
  "codeRepository": "https://github.com/Nainish-Rai/agent-rollback",
  "url": "https://github.com/Nainish-Rai/agent-rollback",
  "codeSampleType": "https://schema.org/FullCodeSample",
  "programmingLanguage": {
    "@type": "ComputerLanguage",
    "name": "JavaScript",
    "alternateName": "node"
  },
  "runtimePlatform": "Node.js >= 20",
  "license": "https://opensource.org/licenses/MIT",
  "creator": {
    "@type": "Person",
    "name": "Nainish Rai",
    "alternateName": "nainish-rai",
    "url": "https://github.com/Nainish-Rai"
  },
  "maintainer": {
    "@type": "Person",
    "name": "Nainish Rai",
    "url": "https://github.com/Nainish-Rai"
  },
  "version": "1.0.1",
  "dateCreated": "2026-06-11",
  "dateModified": "2026-06-11",
  "contributor": [
    {
      "@type": "Person",
      "name": "Nainish Rai",
      "url": "https://github.com/Nainish-Rai"
    }
  ],
  "keywords": "codex, codex-cli, openai, mcp, mcp-server, snapshot, undo, rollback, checkpoint, ai-agent, javascript, nodejs",
  "isBasedOn": "https://modelcontextprotocol.io",
  "targetProduct": {
    "@type": "SoftwareApplication",
    "name": "OpenAI Codex CLI",
    "url": "https://developers.openai.com/codex/cli"
  }
}
```


**Visible-content alignment:** `programmingLanguage: JavaScript` + `runtimePlatform: Node.js >= 20` trace to `package.json` (`"type": "module"` + `engines.node`). `license: https://opensource.org/licenses/MIT` traces to `LICENSE`. `codeRepository` is the canonical GitHub URL.

---

## 4. FAQPage (8 questions)

### FAQPage — paste into the FAQ section of the docs site / rendered README

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I undo a Codex change?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "List checkpoints, then revert the one taken before the bad edit: `agent-rollback list` to find the id, then `agent-rollback revert cp-<id> --yes`. With hooks installed (`agent-rollback init codex`), Codex auto-snapshots before every prompt and tool use, so there is always a checkpoint to roll back to. Without hooks, create one manually before risky work: `agent-rollback checkpoint \"before refactor\"`, then `agent-rollback run codex \"refactor the auth module\"`, then `agent-rollback revert cp-before-refactor-ed96 --yes`."
      }
    },
    {
      "@type": "Question",
      "name": "How do I revert just one bad Codex operation, not the whole workspace?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use the operation log. Every revert records which files it touched, and `op revert <op-id>` undoes that exact operation while leaving later unrelated edits in place. Run `agent-rollback log` to list recent operations, then `agent-rollback op revert op-20260609-abcdef --dry-run` to preview, and `agent-rollback op revert op-20260609-abcdef --yes` to apply. Applied operation reverts create a safety checkpoint first, so the undo is itself undoable."
      }
    },
    {
      "@type": "Question",
      "name": "How do I undo the last Codex edit (or the last N edits)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Run `agent-rollback undo 1 --yes` to revert the most recent checkpoint, or `agent-rollback undo 3 --yes` to revert the last three. `undo` walks the most recent checkpoints in reverse order and creates a safety checkpoint automatically, so it is always safe to try."
      }
    },
    {
      "@type": "Question",
      "name": "How do I diff what Codex changed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Run `agent-rollback diff cp-before cp-after` to see changed paths and a per-file summary, or add `--patch` for a full unified diff. From the terminal browser, run `agent-rollback tui` and use `diff <n>` inside it to render a diff preview for the selected checkpoint."
      }
    },
    {
      "@type": "Question",
      "name": "How do I add a safety net so every Codex run is auto-rolled-back-able?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Install the Codex hooks once per repo with `agent-rollback init codex`, then run `/hooks` inside Codex and trust the generated repo-local hooks. From then on, every session start, user prompt, before-tool-use, and after-tool-use event creates a deduped auto-checkpoint. If you cannot install hooks, wrap the run with `agent-rollback run --event-stream codex \"your prompt here\"` — it adds Codex's `--json` flag and creates deduped fallback checkpoints from tool-like JSONL events in the output."
      }
    },
    {
      "@type": "Question",
      "name": "Does it work with Claude Code, Cursor, Windsurf, Copilot, Cline, Gemini CLI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The `agent-rollback` CLI works anywhere. The agent-side integration is provided by the shipped SKILL.md, installable globally for 18+ agents via `npx skills add Nainish-Rai/agent-rollback --skill agent-rollback -g -y`. The MCP server is officially documented for Codex CLI and any MCP-compatible agent (Claude Code, Cursor, etc.). For other agents, the CLI is the universal fallback."
      }
    },
    {
      "@type": "Question",
      "name": "How is agent-rollback different from git stash, git restore, or git reset?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "agent-rollback does not require a Git repo (it works in any directory), tracks Codex prompts via auto-checkpoints, supports operation-level undo (`op revert` rolls back exactly the files a bad op touched), is content-addressed (identical files share one blob, ~zero disk), and exposes an MCP server, Codex hooks, and a SKILL.md so any agent can use it. Reach for agent-rollback when working with AI agents that edit files outside your normal Git flow, or when you want a one-command safety net without remembering git reflog incantations."
      }
    },
    {
      "@type": "Question",
      "name": "Is my data sent anywhere?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Everything lives in `.agent-rollback/` inside your project (or wherever `--store` points). There is no telemetry, no cloud sync, no analytics. The CLI and MCP server are 100% local."
      }
    }
  ]
}
```


**Selected 8 of 11 README FAQ questions** (excluded: *uninstall*, *why `arb` not `ar`*, *upgraded from previous version* — these are post-install/operational, lower search demand). All answers are drawn verbatim from the README. Re-flagged: Google retired generic FAQ rich results on 2026-05-07 — keep this for AEO (ChatGPT / Perplexity / SGE citations), not for SERP accordions.

---

## 5. HowTo (30-second start, 7 steps)

### HowTo — paste into the 30-second start section / docs landing

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Roll back a bad Codex edit in 30 seconds",
  "description": "Install agent-rollback, create a checkpoint before a risky Codex run, and restore your workspace in one command.",
  "totalTime": "PT30S",
  "tool": [
    {
      "@type": "HowToTool",
      "name": "agent-rollback CLI (or short alias `arb`)"
    },
    {
      "@type": "HowToTool",
      "name": "OpenAI Codex CLI"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Install (one line)",
      "text": "Run the one-click installer with --all to install the binary, register the MCP server in ~/.codex/config.toml, and install the agent skill: `curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --all`. Verify with `agent-rollback --help` and `arb --help` (both identical). For npm-only install: `npm install -g agent-rollback` (requires Node.js >= 20).",
      "url": "https://github.com/Nainish-Rai/agent-rollback#step-0--install-one-line"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Initialize a repo",
      "text": "Create a project directory and initialize the agent-rollback store: `mkdir demo && cd demo && git init && agent-rollback init` (or `arb init`). This creates `.agent-rollback/` in the project where all snapshots will live. You can ignore it in `.gitignore`.",
      "url": "https://github.com/Nainish-Rai/agent-rollback#step-1--initialize-a-repo"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Ask the agent what it can do",
      "text": "Open Codex in this repo and say: \"what can you do for checkpoints?\". Codex reads the installed SKILL.md and lists the full surface — create, list, show, diff, revert, undo, pin, prune, replay, tui — with one-line examples. No memorization needed.",
      "url": "https://github.com/Nainish-Rai/agent-rollback#step-2--ask-the-agent-what-it-can-do"
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Create a checkpoint, then do something risky",
      "text": "Tell Codex: \"make a checkpoint called 'green tests' and refactor the auth module\". Codex creates `cp-183544-green-tests-ed96` and refactors. If it makes a mess, just say 'go back'.",
      "url": "https://github.com/Nainish-Rai/agent-rollback#step-3--create-a-checkpoint-then-do-something-risky"
    },
    {
      "@type": "HowToStep",
      "position": 5,
      "name": "Browse checkpoints",
      "text": "Tell Codex \"show me checkpoints\" to list them in chat, or from the CLI run `agent-rollback list` (or `agent-rollback list --json` for machine-readable output, or `agent-rollback tui` for the interactive terminal browser).",
      "url": "https://github.com/Nainish-Rai/agent-rollback#step-4--browse-checkpoints"
    },
    {
      "@type": "HowToStep",
      "position": 6,
      "name": "Made a mess? Roll back",
      "text": "Tell Codex \"go to the last checkpoint\", or from the CLI run `agent-rollback revert cp-183544-green-tests-ed96 --yes` (or `agent-rollback undo 1 --yes` to undo the last N). A safety checkpoint is created automatically so the revert is itself undoable.",
      "url": "https://github.com/Nainish-Rai/agent-rollback#step-5--made-a-mess-roll-back"
    },
    {
      "@type": "HowToStep",
      "position": 7,
      "name": "See what changed",
      "text": "Tell Codex \"what did the refactor change vs the green tests checkpoint?\" to see a per-file summary, or from the CLI run `agent-rollback diff cp-before cp-after` (add `--patch` for a full unified diff).",
      "url": "https://github.com/Nainish-Rai/agent-rollback#step-6--see-what-changed"
    }
  ]
}
```


The README's "30-second start" is actually 7 steps (numbered 0-6), not 6 — included all 7 to match the source. Re-flagged: HowTo desktop rich results were deprecated in 2023; keep this for AEO and content structure.

---

## 6. BreadcrumbList (docs structure)

### BreadcrumbList — paste into the docs site <head>

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://github.com/Nainish-Rai"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "agent-rollback",
      "item": "https://github.com/Nainish-Rai/agent-rollback"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Docs",
      "item": "https://github.com/Nainish-Rai/agent-rollback#contents"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "30-second start",
      "item": "https://github.com/Nainish-Rai/agent-rollback#30-second-start"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Usage",
      "item": "https://github.com/Nainish-Rai/agent-rollback#usage"
    },
    {
      "@type": "ListItem",
      "position": 6,
      "name": "MCP server",
      "item": "https://github.com/Nainish-Rai/agent-rollback#mcp-server"
    },
    {
      "@type": "ListItem",
      "position": 7,
      "name": "FAQ",
      "item": "https://github.com/Nainish-Rai/agent-rollback#faq--codex-undo-revert-and-rollback"
    }
  ]
}
```


Maps the README table-of-contents to a docs-site URL hierarchy. Adapt `item` URLs when the docs site has real slugs (e.g. `/docs/usage/mcp`).

---

## 7. Organization (maintainer)

### Organization — paste into the docs site <head> / GitHub org page

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://github.com/Nainish-Rai#organization",
  "name": "Nainish Rai",
  "alternateName": "nainish-rai",
  "url": "https://github.com/Nainish-Rai",
  "logo": "https://github.com/Nainish-Rai.png",
  "sameAs": [
    "https://github.com/Nainish-Rai",
    "https://www.npmjs.com/~nainish-rai"
  ],
  "knowsAbout": [
    "OpenAI Codex CLI",
    "Model Context Protocol",
    "AI agent safety",
    "Developer tools",
    "Snapshot and rollback systems",
    "Content-addressed storage"
  ],
  "founder": {
    "@type": "Person",
    "name": "Nainish Rai",
    "url": "https://github.com/Nainish-Rai"
  }
}
```


Solo-maintainer project. If you'd rather mark it as a `Person`, swap `@type` to `Person` and use `givenName: "Nainish"`, `familyName: "Rai"`. The user brief said `Organization`, so this is the `Organization` form.

---

## 8. Combined `<script>` block (paste into docs site `<head>` or rendered README HTML)

```html
<!-- agent-rollback: combined JSON-LD — paste into <head> -->

<!-- 1/7 Organization -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://github.com/Nainish-Rai#organization",
  "name": "Nainish Rai",
  "alternateName": "nainish-rai",
  "url": "https://github.com/Nainish-Rai",
  "logo": "https://github.com/Nainish-Rai.png",
  "sameAs": [
    "https://github.com/Nainish-Rai",
    "https://www.npmjs.com/~nainish-rai"
  ],
  "knowsAbout": [
    "OpenAI Codex CLI",
    "Model Context Protocol",
    "AI agent safety",
    "Developer tools",
    "Snapshot and rollback systems",
    "Content-addressed storage"
  ],
  "founder": {
    "@type": "Person",
    "name": "Nainish Rai",
    "url": "https://github.com/Nainish-Rai"
  }
}
</script>


<!-- 2/7 SoftwareApplication (npm) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "agent-rollback",
  "alternateName": "arb",
  "description": "Git-like undo and rollback checkpoints for OpenAI Codex CLI. Snapshot, diff, and restore files before and after Codex edits. MCP server + Codex hooks for automatic safety net. Works with Claude Code, Cursor, Windsurf, Copilot, Cline, Gemini CLI.",
  "url": "https://www.npmjs.com/package/agent-rollback",
  "downloadUrl": "https://registry.npmjs.org/agent-rollback/-/agent-rollback-1.0.1.tgz",
  "softwareVersion": "1.0.1",
  "applicationCategory": "DeveloperApplication",
  "applicationSubCategory": "AI Agent Safety Net / Snapshot Tool",
  "operatingSystem": [
    "macOS",
    "Linux",
    "Windows (via WSL)"
  ],
  "programmingLanguage": "JavaScript",
  "runtimePlatform": "Node.js >= 20",
  "license": "https://opensource.org/licenses/MIT",
  "isAccessibleForFree": true,
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "PLACEHOLDER_rating_value",
    "ratingCount": "PLACEHOLDER_rating_count",
    "bestRating": "5",
    "worstRating": "1"
  },
  "author": {
    "@type": "Person",
    "name": "Nainish Rai",
    "alternateName": "nainish-rai",
    "url": "https://github.com/Nainish-Rai"
  },
  "publisher": {
    "@type": "Person",
    "name": "Nainish Rai",
    "url": "https://github.com/Nainish-Rai"
  },
  "maintainer": {
    "@type": "Person",
    "name": "Nainish Rai",
    "alternateName": "nainish-rai",
    "url": "https://github.com/Nainish-Rai"
  },
  "codeRepository": "https://github.com/Nainish-Rai/agent-rollback",
  "softwareRequirements": "Node.js >= 20",
  "featureList": [
    "CLI (agent-rollback / short alias arb)",
    "MCP stdio server for Codex, Claude Code, Cursor",
    "Codex hooks for auto-checkpoints on every prompt and tool use",
    "Content-addressed snapshots with ~zero disk overhead",
    "Operation-level undo via append-only ops.jsonl",
    "Terminal browser (TUI) with diff preview",
    "100% local — no telemetry, no cloud sync"
  ],
  "screenshot": "https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/.agent-rollback/screenshot.png"
}
</script>


<!-- 3/7 SoftwareSourceCode (GitHub) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "agent-rollback",
  "description": "Git-like undo and rollback checkpoints for OpenAI Codex CLI — CLI, MCP server, and Codex hook.",
  "codeRepository": "https://github.com/Nainish-Rai/agent-rollback",
  "url": "https://github.com/Nainish-Rai/agent-rollback",
  "codeSampleType": "https://schema.org/FullCodeSample",
  "programmingLanguage": {
    "@type": "ComputerLanguage",
    "name": "JavaScript",
    "alternateName": "node"
  },
  "runtimePlatform": "Node.js >= 20",
  "license": "https://opensource.org/licenses/MIT",
  "creator": {
    "@type": "Person",
    "name": "Nainish Rai",
    "alternateName": "nainish-rai",
    "url": "https://github.com/Nainish-Rai"
  },
  "maintainer": {
    "@type": "Person",
    "name": "Nainish Rai",
    "url": "https://github.com/Nainish-Rai"
  },
  "version": "1.0.1",
  "dateCreated": "2026-06-11",
  "dateModified": "2026-06-11",
  "contributor": [
    {
      "@type": "Person",
      "name": "Nainish Rai",
      "url": "https://github.com/Nainish-Rai"
    }
  ],
  "keywords": "codex, codex-cli, openai, mcp, mcp-server, snapshot, undo, rollback, checkpoint, ai-agent, javascript, nodejs",
  "isBasedOn": "https://modelcontextprotocol.io",
  "targetProduct": {
    "@type": "SoftwareApplication",
    "name": "OpenAI Codex CLI",
    "url": "https://developers.openai.com/codex/cli"
  }
}
</script>


<!-- 4/7 TechArticle (README tutorial) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "agent-rollback — Codex CLI undo, revert, and rollback checkpoints",
  "description": "Tutorial: install agent-rollback in one line, create a checkpoint, run Codex, browse snapshots, diff what changed, and roll back a bad edit. Includes MCP server and Codex hook setup for 18+ AI agents.",
  "url": "https://github.com/Nainish-Rai/agent-rollback#readme",
  "author": {
    "@type": "Person",
    "name": "Nainish Rai",
    "alternateName": "nainish-rai",
    "url": "https://github.com/Nainish-Rai"
  },
  "publisher": {
    "@type": "Person",
    "name": "Nainish Rai",
    "url": "https://github.com/Nainish-Rai"
  },
  "datePublished": "2026-06-11",
  "dateModified": "2026-06-11",
  "inLanguage": "en",
  "proficiencyLevel": "Beginner",
  "dependencies": "Node.js >= 20",
  "keywords": "codex, codex-cli, openai, codex-undo, codex-revert, codex-checkpoint, codex-rollback, codex-snapshot, mcp, model-context-protocol, ai-agent, claude-code, cursor, windsurf, copilot, cline, gemini-cli, snapshot, undo, revert, rollback, checkpoint, dev-tools",
  "about": [
    {
      "@type": "SoftwareApplication",
      "name": "agent-rollback",
      "url": "https://www.npmjs.com/package/agent-rollback"
    },
    {
      "@type": "SoftwareApplication",
      "name": "OpenAI Codex CLI",
      "url": "https://developers.openai.com/codex/cli"
    },
    {
      "@type": "SoftwareApplication",
      "name": "Model Context Protocol",
      "url": "https://modelcontextprotocol.io"
    }
  ],
  "mainEntity": {
    "@type": "SoftwareApplication",
    "name": "agent-rollback",
    "softwareVersion": "1.0.1"
  },
  "isPartOf": {
    "@type": "WebSite",
    "name": "agent-rollback",
    "url": "https://github.com/Nainish-Rai/agent-rollback"
  }
}
</script>


<!-- 5/7 BreadcrumbList (docs) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://github.com/Nainish-Rai"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "agent-rollback",
      "item": "https://github.com/Nainish-Rai/agent-rollback"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Docs",
      "item": "https://github.com/Nainish-Rai/agent-rollback#contents"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "30-second start",
      "item": "https://github.com/Nainish-Rai/agent-rollback#30-second-start"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Usage",
      "item": "https://github.com/Nainish-Rai/agent-rollback#usage"
    },
    {
      "@type": "ListItem",
      "position": 6,
      "name": "MCP server",
      "item": "https://github.com/Nainish-Rai/agent-rollback#mcp-server"
    },
    {
      "@type": "ListItem",
      "position": 7,
      "name": "FAQ",
      "item": "https://github.com/Nainish-Rai/agent-rollback#faq--codex-undo-revert-and-rollback"
    }
  ]
}
</script>


<!-- 6/7 FAQPage (AEO; FAQ rich result retired 2026-05-07) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I undo a Codex change?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "List checkpoints, then revert the one taken before the bad edit: `agent-rollback list` to find the id, then `agent-rollback revert cp-<id> --yes`. With hooks installed (`agent-rollback init codex`), Codex auto-snapshots before every prompt and tool use, so there is always a checkpoint to roll back to. Without hooks, create one manually before risky work: `agent-rollback checkpoint \"before refactor\"`, then `agent-rollback run codex \"refactor the auth module\"`, then `agent-rollback revert cp-before-refactor-ed96 --yes`."
      }
    },
    {
      "@type": "Question",
      "name": "How do I revert just one bad Codex operation, not the whole workspace?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use the operation log. Every revert records which files it touched, and `op revert <op-id>` undoes that exact operation while leaving later unrelated edits in place. Run `agent-rollback log` to list recent operations, then `agent-rollback op revert op-20260609-abcdef --dry-run` to preview, and `agent-rollback op revert op-20260609-abcdef --yes` to apply. Applied operation reverts create a safety checkpoint first, so the undo is itself undoable."
      }
    },
    {
      "@type": "Question",
      "name": "How do I undo the last Codex edit (or the last N edits)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Run `agent-rollback undo 1 --yes` to revert the most recent checkpoint, or `agent-rollback undo 3 --yes` to revert the last three. `undo` walks the most recent checkpoints in reverse order and creates a safety checkpoint automatically, so it is always safe to try."
      }
    },
    {
      "@type": "Question",
      "name": "How do I diff what Codex changed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Run `agent-rollback diff cp-before cp-after` to see changed paths and a per-file summary, or add `--patch` for a full unified diff. From the terminal browser, run `agent-rollback tui` and use `diff <n>` inside it to render a diff preview for the selected checkpoint."
      }
    },
    {
      "@type": "Question",
      "name": "How do I add a safety net so every Codex run is auto-rolled-back-able?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Install the Codex hooks once per repo with `agent-rollback init codex`, then run `/hooks` inside Codex and trust the generated repo-local hooks. From then on, every session start, user prompt, before-tool-use, and after-tool-use event creates a deduped auto-checkpoint. If you cannot install hooks, wrap the run with `agent-rollback run --event-stream codex \"your prompt here\"` — it adds Codex's `--json` flag and creates deduped fallback checkpoints from tool-like JSONL events in the output."
      }
    },
    {
      "@type": "Question",
      "name": "Does it work with Claude Code, Cursor, Windsurf, Copilot, Cline, Gemini CLI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The `agent-rollback` CLI works anywhere. The agent-side integration is provided by the shipped SKILL.md, installable globally for 18+ agents via `npx skills add Nainish-Rai/agent-rollback --skill agent-rollback -g -y`. The MCP server is officially documented for Codex CLI and any MCP-compatible agent (Claude Code, Cursor, etc.). For other agents, the CLI is the universal fallback."
      }
    },
    {
      "@type": "Question",
      "name": "How is agent-rollback different from git stash, git restore, or git reset?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "agent-rollback does not require a Git repo (it works in any directory), tracks Codex prompts via auto-checkpoints, supports operation-level undo (`op revert` rolls back exactly the files a bad op touched), is content-addressed (identical files share one blob, ~zero disk), and exposes an MCP server, Codex hooks, and a SKILL.md so any agent can use it. Reach for agent-rollback when working with AI agents that edit files outside your normal Git flow, or when you want a one-command safety net without remembering git reflog incantations."
      }
    },
    {
      "@type": "Question",
      "name": "Is my data sent anywhere?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Everything lives in `.agent-rollback/` inside your project (or wherever `--store` points). There is no telemetry, no cloud sync, no analytics. The CLI and MCP server are 100% local."
      }
    }
  ]
}
</script>


<!-- 7/7 HowTo (AEO; desktop rich result deprecated 2023) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Roll back a bad Codex edit in 30 seconds",
  "description": "Install agent-rollback, create a checkpoint before a risky Codex run, and restore your workspace in one command.",
  "totalTime": "PT30S",
  "tool": [
    {
      "@type": "HowToTool",
      "name": "agent-rollback CLI (or short alias `arb`)"
    },
    {
      "@type": "HowToTool",
      "name": "OpenAI Codex CLI"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Install (one line)",
      "text": "Run the one-click installer with --all to install the binary, register the MCP server in ~/.codex/config.toml, and install the agent skill: `curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --all`. Verify with `agent-rollback --help` and `arb --help` (both identical). For npm-only install: `npm install -g agent-rollback` (requires Node.js >= 20).",
      "url": "https://github.com/Nainish-Rai/agent-rollback#step-0--install-one-line"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Initialize a repo",
      "text": "Create a project directory and initialize the agent-rollback store: `mkdir demo && cd demo && git init && agent-rollback init` (or `arb init`). This creates `.agent-rollback/` in the project where all snapshots will live. You can ignore it in `.gitignore`.",
      "url": "https://github.com/Nainish-Rai/agent-rollback#step-1--initialize-a-repo"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Ask the agent what it can do",
      "text": "Open Codex in this repo and say: \"what can you do for checkpoints?\". Codex reads the installed SKILL.md and lists the full surface — create, list, show, diff, revert, undo, pin, prune, replay, tui — with one-line examples. No memorization needed.",
      "url": "https://github.com/Nainish-Rai/agent-rollback#step-2--ask-the-agent-what-it-can-do"
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Create a checkpoint, then do something risky",
      "text": "Tell Codex: \"make a checkpoint called 'green tests' and refactor the auth module\". Codex creates `cp-183544-green-tests-ed96` and refactors. If it makes a mess, just say 'go back'.",
      "url": "https://github.com/Nainish-Rai/agent-rollback#step-3--create-a-checkpoint-then-do-something-risky"
    },
    {
      "@type": "HowToStep",
      "position": 5,
      "name": "Browse checkpoints",
      "text": "Tell Codex \"show me checkpoints\" to list them in chat, or from the CLI run `agent-rollback list` (or `agent-rollback list --json` for machine-readable output, or `agent-rollback tui` for the interactive terminal browser).",
      "url": "https://github.com/Nainish-Rai/agent-rollback#step-4--browse-checkpoints"
    },
    {
      "@type": "HowToStep",
      "position": 6,
      "name": "Made a mess? Roll back",
      "text": "Tell Codex \"go to the last checkpoint\", or from the CLI run `agent-rollback revert cp-183544-green-tests-ed96 --yes` (or `agent-rollback undo 1 --yes` to undo the last N). A safety checkpoint is created automatically so the revert is itself undoable.",
      "url": "https://github.com/Nainish-Rai/agent-rollback#step-5--made-a-mess-roll-back"
    },
    {
      "@type": "HowToStep",
      "position": 7,
      "name": "See what changed",
      "text": "Tell Codex \"what did the refactor change vs the green tests checkpoint?\" to see a per-file summary, or from the CLI run `agent-rollback diff cp-before cp-after` (add `--patch` for a full unified diff).",
      "url": "https://github.com/Nainish-Rai/agent-rollback#step-6--see-what-changed"
    }
  ]
}
</script>

```

---

## 9. Where each block lives

| Block | Surface | Why |
|---|---|---|
| `Organization` | docs site `<head>`; optional GitHub Pages landing | Establishes the maintainer as a known entity for the knowledge graph. |
| `SoftwareApplication` | **npm package page header** (via npm CDN if it ever supports it, or a docs site that mirrors the npm page); GitHub Pages landing | Powers the npm/AI-tool knowledge panel; the `offers` + `aggregateRating` slots are the highest-ROI once a real rating exists. |
| `SoftwareSourceCode` | **GitHub repo `<head>`** (via a static site / GitHub Pages — GitHub.com itself does not inject user JSON-LD into repo pages) | Lets search engines tie the code repo to the npm package. |
| `TechArticle` | **rendered README page on docs site** (the raw `README.md` on github.com cannot host `<script>`) | Earns "Article" rich-result eligibility for the rendered tutorial. |
| `BreadcrumbList` | docs site `<head>` (every page) | Breadcrumb rich results on docs subpages. |
| `FAQPage` | rendered FAQ section on docs site | **AEO only** — Google retired generic FAQ rich results 2026-05-07; still useful for ChatGPT / Perplexity / SGE citations. |
| `HowTo` | rendered 30-second start section on docs site | **AEO + content structure only** — desktop HowTo rich results were deprecated 2023. |

**GitHub.com caveat:** the `github.com/Nainish-Rai/agent-rollback` repo page does NOT honor user-injected JSON-LD in the README. To actually surface these blocks in SERP, host a docs site (e.g. GitHub Pages from `/docs` or a Vercel deploy) and paste the combined block from §8 into its `<head>`. The npm page similarly renders server-side; the JSON-LD should live on a mirror docs page that links to npm.

---

## 10. Pre-deploy checklist

- [ ] Replace `PLACEHOLDER_rating_value` and `PLACEHOLDER_rating_count` in `SoftwareApplication.aggregateRating` (or delete the block) before going live — do not ship fake ratings.
- [ ] Backfill `datePublished` and `dateModified` in `TechArticle` and `SoftwareSourceCode` from `git log`.
- [ ] Update `BreadcrumbList.item[*].item` URLs once docs slugs are final.
- [ ] Update `dateModified` on the `TechArticle` block every time the README changes materially.
- [ ] Validate with [Schema.org Validator](https://validator.schema.org/) and [Google Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Submit the docs sitemap to Google Search Console; monitor "Enhancements" for `SoftwareApplication` and `BreadcrumbList`.
- [ ] Do NOT promise FAQ accordions or HowTo carousels in marketing copy — both are deprecated for non-government/health sites.
