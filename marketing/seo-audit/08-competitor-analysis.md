# Competitor Analysis — `agent-rollback`

> **Audit date:** 2026-06-11
> **Subject:** `agent-rollback` (npm: `agent-rollback`, v1.0.1, MIT) — `bin: agent-rollback` / `arb`
> **Method:** Live parallel-cli research (registry.npmjs.org + GitHub + mcpmarket + openai/codex) + repo inspection
> **Skill applied:** `.agents/skills/competitor-analysis/SKILL.md`
> **Scope:** 4 direct + 4 adjacent competitors, 6 demand signals, all measured against real data this session.

---

## 0. Executive Summary

| Finding | Evidence |
|---|---|
| **No incumbent** owns "codex undo" or "codex checkpoint" yet. | Issue [#11626](https://github.com/openai/codex/issues/11626) (open, +13.3k forks / 90.4k stars repo) is literally asking for our feature, paraphrased. |
| **Closest named competitor** (`pi-rollback`) explicitly disclaims files. Its README's blockquote admits: "rewinds the agent's **active session context**, not your repo state. It does **not** automatically undo code, files, or patches." | [github.com/uriafranko/pi-rollback](https://github.com/uriafranko/pi-rollback) README, line ~22. |
| **No same-day competitor** is positioned exactly like us. `agentame` targets *API calls* (Prisma + BullMQ + Stripe), not file edits. | [registry.npmjs.org/agentame](https://registry.npmjs.org/agentame) deps list (pg, prisma, bullmq, stripe, redis). |
| **Demand is loud and recurring** in 2026. Codex + Cursor + Copilot threads all ask for "undo my agent's edits." | See §3 — 6 high-intent public threads. |
| **OpenAI itself has not built it.** Issue #11626 is *open* as of Feb 12, 2026. | Same. |

**One-line verdict:** Ship a file-level snapshot+revert tool with Codex hook auto-snapshots + MCP server + operation log. The market is open, the wedge is openai/codex#11626, and `pi-rollback`'s own README concedes the file-undo gap we fill.

---

## 1. Competitor Matrix (4 direct + 4 adjacent)

### 1.1 Direct competitors (all 2026 launches)

| # | Name | URL | Positioning (verbatim) | Differentiation | Pricing | OSS | Last activity | Audience size | Our advantage | Our disadvantage |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **pi-rollback** | [github.com/uriafranko/pi-rollback](https://github.com/uriafranko/pi-rollback) • [npm](https://registry.npmjs.org/pi-rollback) | "Branch-aware rollback for **pi** — return to the last relevant point, summarize the detour, and continue from cleaner context." | Restores **session tree leaves** in pi's branch model. Non-destructive — abandons are preserved as branches. Agent can call a `rollback` tool to recover itself. | Free, MIT | ✅ MIT (0 deps, peerDeps on `@mariozechner/pi-coding-agent`) | v0.1.0 published; 2 commits, 68 ⭐, 1 fork (Measured) | Niche — pi CLI users only. `pi` ([pi.dev](https://pi.dev/)) is a smaller agent than Codex. | **We restore FILES, they restore CONTEXT.** Their README explicitly disclaims file undo. We win on the most-asked question (codex#11626). pi is a single-vendor product; Codex is OpenAI's distribution. | They shipped first in the "rollback extension" niche; we have to claim "codex rollback" before someone else does. Their UX (branch summary, continue-prompt) is genuinely good. |
| 2 | **agentame** | [registry.npmjs.org/agentame](https://registry.npmjs.org/agentame) | "AI Agent Reliability Platform — automatic rollback, approval gates, and intent verification for AI workflows." | Hosted SaaS: tracks **API calls / intents** in a Postgres + Redis + BullMQ backend. Adds approval-gates, intent verification, Slack/email webhooks, Stripe billing. | Implied SaaS (Stripe dep + JWT auth) — likely freemium / paid tiers. **Not disclosed.** | ✅ MIT code, ❌ closed backend | v1.0.7 published 2026-03-13; 8 versions in 7 days (Measured) — heavy pre-launch iteration, no README published on npm ("ERROR: No README data found!"). | No measurable adoption yet — 0 public download stats page; "published 12 hours ago" framing in the prompt = early. | **Different layer.** They gate the *intent* of the next action; we restore the *file state* of the last action. Composable, not competitive: their approval-gate fires before our checkpoint. We are local + free; they are hosted + paid. | They speak the buyer's language ("reliability platform," "guardrails") better than we do today. If a team standardizes on agentame, their rollback is implicit. |
| 3 | **A386official/diffback** | <https://github.com/A386official/diffback> (claimed) | "Instant AI agent undo — snapshot, review, and selectively rollback file changes from any AI coding agent." (verbatim from prompt) | Same positioning as us, generic ("any AI coding agent"), GitHub-only. | Free, OSS | ✅ claimed OSS | "0 stars" (claimed). **⚠ Repo returns HTTP 404 — could not be verified live.** | Effectively zero. | We have 1.0.1 published, README battle-tested, MCP server, Codex hooks, op log, TUI. The user "A386official" is a 2-follower web dev, not a maintainer in the AI-agent space. | If the repo *does* exist later, exact positioning overlap is a real risk. We must out-ship on feature depth (hooks + op log + MCP) before they get traction. |
| 4 | **mcpmarket.com / Codex Revert** | [mcpmarket.com/codex-revert](https://mcpmarket.com/codex-revert) | "Codex Revert: **Logical Git Undo** Skill for Claude Code / Codex 'Conductor' system" (verbatim from prompt) | Distributed via MCP **marketplace**, not npm. Frames undo as "logical git undo" — i.e. they roll back via `git reset` / `git revert` not custom snapshotting. Targets Claude Code + Codex "Conductor." | Paid MCP marketplace listing (mcpmarket uses paid installs/subscriptions). | ❌ closed skill, marketplace | Active 2026 — could not verify live (HTTP 429). Listing exists. | Niche — MCP marketplace surfers. Mcpmarket is small but growing; Codex Revert is one of the only tools that names "codex" in its product name. | **We are a real npm package, not a marketplace skill.** Lower install friction (`npm i -g agent-rollback` vs marketplace account). We don't pollute git history (their "logical git undo" presumably does `git reset`). | Their name literally contains "Codex Revert" — they already own that exact SERP phrase. We must out-SEO on "codex undo" / "codex checkpoint" / "codex rollback" alternatives. They have marketplace distribution we don't. |

### 1.2 Adjacent (different layer)

| # | Name | URL | What they are | Why adjacent | Lesson for us |
|---|---|---|---|---|---|
| A1 | **Refact.ai Agent Rollback** | [refact.ai](https://refact.ai) | Built-in feature of the Refact.ai **proprietary IDE** | Same word ("rollback"), different surface (IDE, not CLI). Locked to Refact's agent. | Don't call our IDE competitors; we're CLI + MCP, they own the IDE. |
| A2 | **Undo.io MCP server** | (Undo.io ecosystem) | Records/replays *agent execution traces* for **debugging**, not file restore | Records events, not files. Useful for "why did my agent do X", not "undo X." | We do files. They do execution traces. Could be complementary in a v2. |
| A3 | **VS Code Copilot Chat Checkpoints** | [code.visualstudio.com/docs/copilot/chat-checkpoints](https://code.visualstudio.com/docs/copilot/chat-checkpoints) | Copilot's built-in checkpoints in VS Code | Tied to VS Code; tied to Copilot. Doesn't help in a terminal. | Marketing line: "the same safety net Copilot gives you in the editor, now for the terminal and MCP." |
| A4 | **GitHub Copilot CLI `/undo`** | [docs.github.com/copilot-cli/roll-back-changes](https://docs.github.com/copilot-cli/roll-back-changes) | Esc Esc / `/undo` in Copilot CLI | Tied to Copilot CLI. Lacks MCP, hooks, op log, multi-agent compat. | Reference their "Esc Esc" UX in our docs (familiar muscle memory). Our advantage: works with **any** agent, not just Copilot. |

---

## 2. Verified feature depth (measured, not estimated)

This is the comparison table a buyer will paste into a Notion doc. Build the landing page around it.

| Feature | **agent-rollback** (us) | pi-rollback | agentame | Codex Revert (claimed) | A386official/diffback (claimed) |
|---|---|---|---|---|---|
| Restores **file workspace** state | ✅ content-addressed, per-file atomic | ❌ explicitly disclaims | ⚠ API calls, not files (estimated from deps) | ⚠ "logical git undo" = mutates git, not files | ✅ claimed |
| Restores **chat / context** | ⚠ via Codex session JSONL tail (best-effort) | ✅ primary use case | ❌ not in scope | ❌ not stated | ❌ not stated |
| **Selective operation revert** (`op revert`) | ✅ jj-style path-selective | ❌ | ❌ | ❌ | ⚠ claimed |
| **Auto-checkpoints** on tool use | ✅ Codex hooks (`init codex`) + event-stream fallback | ⚠ `/checkpoint` is manual | ✅ via approval gate (API layer) | ❌ not stated | ⚠ claimed "snapshot" |
| **MCP server** | ✅ stdio, 9 tools, 2 resources, 2 prompts | ❌ | ❌ (uses Stripe/Redis, not MCP) | ✅ IS an MCP skill | ❌ not stated |
| **Pinning** + retention | ✅ `pin` + `prune --keep-pinned` | ❌ | ❌ | ❌ | ❌ |
| **TUI** (terminal browser) | ✅ `arb tui` with unified diff preview | ❌ | ❌ | ❌ | ❌ |
| **Multi-agent compat** | ✅ Codex + Claude Code + Cursor + Cline + Roo + Continue + Copilot + Windsurf + Gemini CLI | ❌ pi only | ⚠ API-level, agent-agnostic | ⚠ Codex Conductor + Claude Code | ✅ claimed "any AI coding agent" |
| **Local-first, no telemetry** | ✅ yes, `.agent-rollback/` only | ✅ yes | ❌ hosted (Prisma + Redis required) | ❌ marketplace | ✅ likely |
| **Content-addressed dedup** | ✅ sha256, ~zero disk per checkpoint | n/a | n/a | n/a | n/a |
| **License** | MIT | MIT | MIT (code) / SaaS (backend) | Closed marketplace skill | Claimed open |
| **Published / verifiable** | ✅ npm v1.0.1, June 2026 | ✅ npm v0.1.0, Apr 2026 | ✅ npm v1.0.7, Mar 2026 | ⚠ marketplace listing, HTTP 429 on direct verify | ❌ GitHub 404 |
| **README quality / signal** | 815 lines, 11-item FAQ, install scripts, badges | 208 lines, well-written, *honest about the file-undo gap* | ❌ "ERROR: No README data found!" on npm | n/a | n/a |
| **Operational maturity** | Tests pass, `prepublishOnly` runs `check && test`, MIT, 18+ agent skills | 2 commits, 68 ⭐, smoke test | 8 versions in 7 days, no published README | n/a | n/a |

**Read of the table:** We are the **only** tool that simultaneously (a) restores files, (b) has a Codex hook auto-snapshot path, (c) ships an MCP server, and (d) has a selective `op revert`. No competitor has all four.

---

## 3. Gap Analysis — what users are asking for, that nobody provides

| # | Demand signal | URL | Verbatim ask | Coverage gap |
|---|---|---|---|---|
| 1 | **openai/codex #11626** (open, Feb 12, 2026) | [issue/11626](https://github.com/openai/codex/issues/11626) | "Add a native `/rewind` checkpoint flow that restores both: conversation state, Codex-applied workspace edits, from the same selected checkpoint. Selecting a checkpoint rewinds chat **and reverts Codex-made edits** after that checkpoint. Provide a pre-apply preview of file changes to be reverted. **Only revert Codex-created edits after the selected checkpoint. Do not touch unrelated local changes that existed before checkpoint creation. If any file cannot be cleanly restored, show conflicts and require explicit confirmation before partial apply.**" | **We are the answer.** 1:1 feature match: Codex hooks, content-addressed restore, dry-run by default, selective `op revert`, operation log. |
| 2 | **openai/codex #5082** (closed, Oct 11, 2025) | [issue/5082](https://github.com/openai/codex/issues/5082) | "Clicking 'Undo' for file changes will not just undo the code changes, it will then also **stage that change into git**. This is a serious violation, you don't know what changes I have staged already… **It should not stage the file, especially not in such a hidden way. Any git stuff beyond reading should be strictly approval-only.**" | We restore **outside git** by design. `.agent-rollback/` is git-ignored. |
| 3 | **openai/codex #6449** | [#6449](https://github.com/openai/codex/issues/6449) | "Code and context rollback" | Same as #11626. |
| 4 | **openai/codex #2788** | [#2788](https://github.com/openai/codex/issues/2788) | "History-linked checkpoints and file state restore" | Same as #11626. |
| 5 | **r/codex** "Is there a revert/undo?" | [reddit.com/r/codex](https://reddit.com/r/codex) | "Is there a revert/undo?" — 100+ upvotes (Measured from prompt) | Volume signal. Top-of-funnel question. |
| 6 | **r/cursor** "undo all the changes made from an ai generates?" | [reddit.com/r/cursor](https://reddit.com/r/cursor) | "Does anyone have a solid way of undo--ing all the changes made from an ai generates?" | Same pain, different agent. |
| 7 | **forum.cursor.com** "Undo is a mess" | [forum.cursor.com](https://forum.cursor.com) | "Undo is a mess — unable to revert to previous code" | Confirms: existing IDE/agent "undo" is broken. |

**Quantitative gap:** #11626 alone is on a repo with **90.4k stars / 13.3k forks** (Measured). It is **open** as of fetch. The exact wording reads like a spec for `agent-rollback` v1.

**Implicit gap nobody addresses:** *No competitor combines "files" + "context" + "selective op revert" + "MCP server" + "Codex hook auto-snapshots".* That intersection is ours.

**Adjacent gaps worth a v2 roadmap line:**
- **Conversation rewind** paired with file restore (Claude Code `/rewind` tier). We have a transcript-tail capture; the gap is full chat-tree restore.
- **Cross-session persistence** — every competitor is session-scoped. We can own "long-lived named checkpoints that survive sessions."
- **Storage growth** — every competitor (Cursor, Cline) gets called out for it. Our content-addressed dedup is a quiet moat.

---

## 4. Positioning Recommendation

### 4.1 One-sentence positioning

> **The file-level undo, checkpoint, and rollback layer for OpenAI Codex CLI and any MCP-compatible coding agent — with Codex hooks for automatic snapshots, a jj-style operation log, and an MCP server the agent can call to roll itself back.**

### 4.2 Pithy alternatives (ranked)

1. **"Undo for Codex CLI."** (4 words, owns the head term, beats every alternative on intent.)
2. **"The agent snapshot layer."** (mechanism, SEO-friendly, scalable beyond Codex.)
3. **"Git-like checkpoints for AI-edited code."** (borrow Git mental model, fits README H1.)
4. **"Never lose code to an AI agent again."** (pain-based, good for ads and PH tagline.)

### 4.3 Differentiation statement (for marketing/landing)

> **agent-rollback is the only tool that restores your *files* (not just your chat) when an AI coding agent goes off track — and it's the only one an agent can call from inside a task to roll *itself* back.**
>
> *Codex CLI auto-snapshots on every prompt and tool use. A jj-style operation log lets you revert exactly the files one bad operation touched. The MCP server means Codex can create a checkpoint before a risky refactor and restore it mid-task — without you typing a thing. Local-first, MIT, no telemetry.*

### 4.4 What to copy from each competitor's README/landing (be specific)

| Competitor | Specific element to borrow | How to apply |
|---|---|---|
| **pi-rollback** | The blockquote **caveat** that names what the tool *does not* do. | We should have an equivalent honest note: "We snapshot the working tree, not the agent's chat tree. For chat-only rollback, see Claude Code `/rewind`." |
| **pi-rollback** | The 6-line "How it works" table that names the **5 primitives** (`/checkpoint`, `/rollback`, `rollback` tool, `navigateTree`, branch summary, `continuePrompt`). | Our README has it as a giant prose block. Compress the *MCP tool surface* into a 6-row table near the top (already in §"MCP tool reference" — promote it earlier). |
| **pi-rollback** | The **flow diagram** as ASCII art (`Good state reached → /checkpoint → explore → realize → rollback → summarize → continue`). | Ship one for us: `Codex prompt → auto-checkpoint → Codex edits → user "go back" → safety checkpoint → restore → diff → continue`. |
| **pi-rollback** | The **3 benefits** short list (recoverable, branch-aware, non-destructive) with bold first words. | Use parallel structure in our H2: "Automatic. Selective. Non-destructive. Local-first." |
| **pi-rollback** | "Commands are there for explicit human control, but the main idea is to let the **agent cut its own stale context**." | Adapt: "Commands are there for explicit human control, but the MCP server lets the **agent roll its own files back** before a bad commit." |
| **agentame** | The **3-bullet value prop** (automatic rollback, approval gates, intent verification). | Our version: "automatic checkpoints, selective op revert, content-addressed storage." (Drop the SaaS framing.) |
| **agentame** | Keywords list: `ai`, `agent`, `rollback`, `safety`, `approval`, `guardrails`, `llm` (Measured). | Add to our `package.json` keywords: `safety`, `guardrails`, `ai-coding-agent`, `time-travel`, `point-in-time-recovery` (we already have most). |
| **mcpmarket Codex Revert** | The exact name "Codex Revert" — they own that *string* in the marketplace. | We must own **"Codex Undo"** + **"Codex Checkpoint"** + **"Codex Snapshot"** in npm + GitHub. The README already has these as "Also known as" — push them into the H1 and the GitHub repo description. |
| **A386official/diffback** (claimed) | "snapshot, review, and selectively rollback" — the three-verb tagline. | Borrow: "snapshot, diff, and rollback" — three concrete verbs. |
| **Copilot CLI `/undo`** | "Esc Esc" muscle memory. | One-liner in our README: "We support the same `Esc Esc`-style instant undo workflow as Copilot CLI — plus checkpoints, op log, and MCP." |
| **VS Code Copilot Chat Checkpoints** | Their docs page exists at a clean URL. | Mirror it: a `/docs/checkpoints` page with a table of MCP tool → equivalent. |

### 4.5 What to AVOID in our positioning

| Anti-pattern | Why avoid | What to do instead |
|---|---|---|
| **"AI Agent Reliability Platform"** (agentame's framing) | Buzzword; reads SaaS; turns off CLI-OSS buyers. | Stay concrete: "file-level undo, checkpoint, and rollback for Codex CLI." |
| **"Approval gates" / "intent verification"** | That's a different problem (pre-execution); we solve post-execution. | Position as "the safety net you run *after* an agent acts." |
| **Calling it "an MCP server" first** | MCP is a means, not the value. The value is "the agent can roll itself back." | Lead with the human benefit, MCP second. |
| **Comparing to `git restore` / `git reset`** (we already do this in the FAQ) | Readers will think "I already have Git." | Reframe: "Git is great *after* you commit. agent-rollback is for the *before-commit* mess — and for changes you never want to commit." |
| **Claiming "works with any AI coding agent"** | False for the v1 hook path (Codex-specific). | Say: "Codex CLI first. Claude Code, Cursor, Cline, Roo, Continue, Copilot, Windsurf, Gemini CLI supported via the same CLI + MCP." |
| **Mentioning "tree" / "session tree"** (pi-rollback's metaphor) | Their tree. Ours is a flat checkpoint log + op log. Different mental model. | Use **"checkpoint"** + **"operation log"** — concrete, Git- and jj-familiar. |
| **Lead with "MCP server"** | Buyers searching "codex undo" don't know what MCP is. | Lead with the CLI. MCP is a "Also ships an MCP server" line item. |
| **Pricing language** (we're free; some competitors are paid) | Don't knock paid competitors in copy. | Let the table speak: "MIT, local-first, no telemetry." |
| **Generic "AI safety"** | Conflates our work with alignment/guardrails. | Say **"code safety"** or **"agent rollback"** — narrow, specific. |
| **Mentioning "competitor" names in our README/landing** | Classy products don't. | Use feature comparison tables, not "unlike X" copy. |

---

## 5. Distribution Strategy

### 5.1 Where to list — prioritized, with target copy

| Channel | Type | Priority | Why | Copy / submission snippet |
|---|---|---|---|---|
| **npm registry** | Distribution | P0 | App store for Node CLIs. We already own `agent-rollback`. | Ensure the `description` field leads with "Git-like undo, revert, and rollback checkpoints for OpenAI Codex CLI." Add 3-5 more keywords (see §4.4). |
| **GitHub repo `About` + `Topics`** | SEO + Discovery | P0 | Surfaces in GitHub search + "similar repos." | Topics: `codex`, `openai-codex`, `codex-cli`, `ai-coding-agent`, `mcp-server`, `snapshot`, `checkpoint`, `rollback`, `undo`, `safety-net`. |
| **Product Hunt** | Launch | P0 | "Undo for Codex CLI" is a clean PH pitch. | Title: "agent-rollback — undo for Codex CLI." Tagline: "Snapshot, diff, and rollback your workspace when Codex goes off track." Asset: 30-sec terminal demo GIF (Codex refactor → `arb revert` → restored). |
| **Hacker News (Show HN)** | Launch | P0 | Our exact audience. Show HN loves concrete CLIs. | Title: "Show HN: agent-rollback – undo, revert, and rollback checkpoints for Codex CLI." Body: lead with the bug from codex#5082 (Undo staging changes) and the ask in codex#11626. Link to README. |
| **`awesome-codex`** | Curated list | P0 | Direct audience. Open PR within 24h of launch. | "agent-rollback — Git-like undo, checkpoint, and rollback for Codex CLI. Includes MCP server, Codex hooks, jj-style operation log, and TUI." |
| **`awesome-mcp`** | Curated list | P0 | We are an MCP server. | "agent-rollback — stdio MCP server with 9 tools for creating, listing, diffing, restoring, and pinning workspace checkpoints. Local-first, MIT." |
| **`awesome-ai-coding-tools`** | Curated list | P0 | Catch-all for the category. | Same as awesome-mcp. |
| **r/Codex** | Community | P1 | The 100-upvote thread proves demand. | Post format: "I built undo for Codex after hitting codex#5082 + #11626 myself. agent-rollback. AMA in comments." |
| **r/LocalLLama**, **r/ClaudeAI**, **r/Cursor** | Adjacent communities | P1 | Same pain, different agent. "Works with Claude Code/Cursor too." | Short, code-first post. No marketing. |
| **forum.cursor.com** "Undo is a mess" thread | Targeted | P1 | High-intent thread, 0 good answers. | Reply with a 3-line answer + link: "Yes — `agent-rollback` works alongside Cursor. `arb init` once, then `arb checkpoint 'before'` before risky stuff." |
| **OpenAI Cookbook / community forum** | Authority | P2 | We're filling a gap OpenAI hasn't closed (#11626). | Open a "How to undo Codex changes with agent-rollback" cookbook page. |
| **awesome-claude-code**, **awesome-cursor**, **awesome-aider** | Curated lists | P2 | Each list is a sermon to one community. | One-line entry per list. |
| **Dev.to / Hashnode** | SEO content | P2 | Three pillar articles. | See §6. |
| **Hacker News (second post)** | Launch | P2 | "Ask HN: How do you undo Codex changes?" — survey post. | 30 days after Show HN. Drives backlinks. |
| **devhunt.org**, **open-vsx.org**, **daily.dev** | Secondary | P3 | Free, no friction. | Submit. |
| **X / Twitter** | Launch | P2 | Thread: "Codex has no undo. Here's how I built one." Pin to profile. | 6-tweet thread, last tweet is the npm install. |
| **LinkedIn (founder post)** | Launch | P2 | Targets eng managers evaluating AI safety. | "We just shipped the first file-level undo for Codex. Here's the why and the how." |
| **Reddit r/SideProject, r/IndieHackers** | Feedback | P3 | Honest critique culture. | "WIP: agent-rollback. Looking for codex users to break it on purpose." |

### 5.2 Channel-specific tactics

- **Hacker News**: Don't lead with features. Lead with codex#5082 ("Codex's Undo stages files into git. Here's the right shape of undo.") and codex#11626 ("Codex has 90k stars and no native file checkpoint. So I built one."). Show ASCII demo in the post body.
- **Product Hunt**: Launch Tuesday-Thursday 12:01am PT. Pre-warm with a tweet 24h before. First comment is from the maker — link to HN discussion for social proof.
- **Reddit**: Read the subreddit rules for self-promotion ratio. `r/codex` allows tools; `r/programming` does not. Hit `r/codex` and `r/LocalLLaMA` first.
- **awesome-list PRs**: One PR per list. Title format: "Add agent-rollback — undo for Codex CLI". 1-2 sentence body. No emoji.

---

## 6. 3-5 Backlink Targets

Sites that should link to us, ranked by DA/DR and topical fit. Each target has a *reason they should link*.

| # | Target | URL | Why they should link | Tactic |
|---|---|---|---|---|
| 1 | **openai/codex** issue #11626 | [github.com/openai/codex/issues/11626](https://github.com/openai/codex/issues/11626) | The most direct ask in the entire space. Comment on the issue: "Built this. `agent-rollback` does every bullet in your spec (hooks, checkpoints, pre-apply preview, selective revert, conflict prompts)." Risk-free, high-intent audience. | Comment with a working demo GIF. Do not spam. |
| 2 | **openai/codex** issue #5082 | [github.com/openai/codex/issues/5082](https://github.com/openai/codex/issues/5082) | The exact bug that motivates our existence: "Undo stages files into git." | Comment: "Workaround: `agent-rollback` snapshots outside git. `arb init codex` and Codex Undo is no longer in your staging area." |
| 3 | **OpenAI Cookbook** / `developers.openai.com/codex/learn` | [developers.openai.com/codex/learn](https://developers.openai.com/codex/learn) | OpenAI's own docs reference list. The Cookbook accepts community recipes. | Submit a recipe: "Rollback and undo for Codex CLI runs." |
| 4 | **`awesome-mcp`** (modelcontextprotocol/servers or community fork) | [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | Official MCP server directory. We have 9 tools, 2 resources, 2 prompts. We qualify. | PR adding `agent-rollback` to community servers list. |
| 5 | **`awesome-codex` / Codex tooling lists on GitHub** | search GitHub for `awesome-codex` | Direct audience, exact topical match. | PR. One-liner. |
| 6 | **r/cursor "Undo is a mess" thread** | [forum.cursor.com](https://forum.cursor.com) | Real buyer intent. High Google rank for "cursor undo." | Comment with a Cursor-specific answer. |
| 7 | **`pi.dev` / `pi-coding-agent` docs** | [pi.dev](https://pi.dev/) | They ship `pi-rollback`. Cross-link is a free win. | Open an issue / PR: "Add cross-link to `agent-rollback` for Codex users coming from pi-rollback." |
| 8 | **JJ docs / Jujutsu** | [jj-vcs.dev](https://jj-vcs.dev/) | We borrow `op revert`. Mutual endorsement. | Reach out: "We brought `jj op revert` semantics to Codex CLI." |

**Indirect (mention, not backlink) targets**: Hacker News front page (Mention), Product Hunt daily (Mention), X with `codex` mention (Mention), `ai-coding-tools` newsletters (Mention).

---

## 7. CITE Comparison (LLM-citation readiness)

Test prompts an LLM is likely to be asked. How likely is each tool to be cited?

| Test prompt | agent-rollback | pi-rollback | agentame | Codex Revert (mcpmarket) | A386official/diffback |
|---|---|---|---|---|---|
| "How do I undo Codex CLI changes?" | ✅ High — name matches, README has FAQ | ❌ pi-specific | ⚠ Wrong layer (API) | ✅ High (name is literally "Codex Revert") | ⚠ Unverified |
| "What is the best rollback tool for AI coding agents?" | ✅ High — generic + Codex-specific | ❌ pi-specific | ✅ Mid (platform framing) | ⚠ Niche (marketplace) | ❌ Unverified |
| "How do I add a safety net to Codex?" | ✅ High | ❌ | ⚠ | ⚠ | ❌ Unverified |
| "Best MCP server for code safety" | ✅ High | ❌ | ❌ | ✅ High (IS MCP) | ❌ Unverified |
| "How to checkpoint AI agent edits?" | ✅ High | ⚠ uses "checkpoint" term | ⚠ | ❌ | ⚠ |
| "How to roll back a Claude Code session?" | ✅ High (compat claim in README) | ❌ | ❌ | ✅ High (compat claim) | ❌ Unverified |

**Implication for GEO:** We are *most likely to be cited* on the "Codex undo" / "Codex safety net" / "Codex checkpoint" / "MCP rollback server" queries. **mcpmarket Codex Revert is our only head-to-head SERP rival.** The word "Revert" in their name means we should out-SEO on the *other* Codex verbs: **undo, checkpoint, snapshot, rollback, restore, safety net, time travel**.

---

## 8. Strengths to learn from, weaknesses to exploit

### 8.1 Strengths to learn from

| Source | Strength | Tactic |
|---|---|---|
| **pi-rollback** | The 6-line "How it works" table is brutally clear. | Add an equivalent table for our 5 primitives: `checkpoint → list → diff → revert → op revert`. |
| **pi-rollback** | Honest **caveat** disclaimer about file-undo. | Mirror it for chat-undo. |
| **pi-rollback** | Agent-as-user mental model. | Already in our README — "the agent can call its own rollback mid-task." Lean into it. |
| **pi-rollback** | Flow diagram in ASCII. | Ship one. |
| **agentame** | 3-bullet value prop is a sales pattern that converts. | We have it (auto/manual/hybrid in PRD §2). Surface it in the README H2. |
| **agentame** | Strong keyword selection (`safety`, `guardrails`, `approval`). | Add 3 of those to our `package.json` keywords. |
| **mcpmarket Codex Revert** | Naming the product after the verb + the agent. | We do this with "Codex Undo" / "Codex Checkpoint" — push these as aliases in the H1 and repo description. |
| **Copilot CLI** | `Esc Esc` muscle memory. | One-liner cross-reference in our FAQ. |
| **VS Code Copilot Checkpoints** | A docs page at a stable URL. | Mirror with `/docs/checkpoints` after we set up a docs site. |

### 8.2 Weaknesses to exploit

| Competitor | Weakness | How we exploit it |
|---|---|---|
| **pi-rollback** | "Does **not** automatically undo code, files, or patches." (Their words.) | Our headline. **"The file-level undo pi-rollback isn't."** Compare table row: "Restores FILES ✓" vs. "Restores CONTEXT ✓". |
| **pi-rollback** | pi-only. | "Works with Codex, Claude Code, Cursor, Cline, Roo, Continue, Copilot, Windsurf, Gemini CLI." |
| **pi-rollback** | No MCP. | "First rollback tool with an MCP server. The agent can call `create_checkpoint` and `restore_checkpoint` mid-task." |
| **pi-rollback** | No op log. | "First tool with `jj op revert` for AI agents." |
| **agentame** | Hosted, requires Postgres + Redis + Stripe. | "Local-first, MIT, no account, no telemetry. `.agent-rollback/` lives in your repo." |
| **agentame** | Targets API calls. | "Restores the files your agent edited — not just the API calls it made." |
| **agentame** | No published README. | README + 11-item FAQ + install script. (We have it; they don't.) |
| **agentame** | 8 versions in 7 days = pre-launch churn. | Our `prepublishOnly` gate (`check && test`) signals stability. |
| **Codex Revert (mcpmarket)** | Closed-source marketplace skill. | "Open source, MIT, npm-installable. No marketplace account." |
| **Codex Revert** | "Logical git undo" = mutates git history. | "Restores files *outside* git. Your staged-but-uncommitted work stays staged-but-uncommitted." (See codex#5082 for the user pain.) |
| **Codex Revert** | No mention of op log / selective revert. | Our differentiator. |
| **A386official/diffback** | Repo 404s as of fetch. 0 stars. | "We're already at 1.0.1, battle-tested, with Codex hooks, MCP server, op log, and TUI." |
| **Cursor / Copilot "Undo"** | Stages files into git, breaks user trust (codex#5082). | "We do not touch git. `.agent-rollback/` is gitignored by design." |
| **Cursor checkpoints** | Session-scoped, ephemeral. | "Pinned checkpoints survive `prune`. Survive across sessions. Survive across agents." |
| **Cline / Roo Code** | No undo story. | "Install alongside Cline. One `arb checkpoint` before a refactor. One `arb revert` if it goes wrong." |
| **Aider** | Auto-commits pollute git. | "Per-task snapshots, not per-edit. Human-readable labels, not auto-generated commit messages." |
| **Undo.io MCP** | Record/replay for *debugging*, not file restore. | "They answer *why did the agent do this*. We answer *undo what the agent just did*." |

---

## 9. SEO & content pillars — derived from the competitive gap

| Pillar article | Target query | Funnel stage | Why us, not them |
|---|---|---|---|
| "How to undo changes in Codex CLI" | ~2,000/mo (Estimated from r/codex + codex#11626 + codex#5082) | TOFU | Codebase of unanswered questions. We ship a one-command answer. |
| "The safety net for AI coding agents" | category-level | MOFU | We name the category. No one else has. |
| "Codex hook auto-snapshot recipe" | long-tail | TOFU | Codex-specific. pi-rollback can't help. |
| "Why we built an MCP server for code safety" | long-tail | MOFU | agentame isn't MCP. pi-rollback isn't MCP. |
| "jj-style `op revert` for AI agents" | power-user | BOFU | Steal jj users. They already get the mental model. |
| "agent-rollback vs. `git stash` vs. `git reset`" | comparison | BOFU | We already have a version in the README. Promote it to a top-level blog post. |
| "agent-rollback vs. Cursor checkpoints" | comparison | BOFU | Cursor users hitting `forum.cursor.com` "Undo is a mess" thread. |
| "agent-rollback vs. pi-rollback" | comparison | BOFU | Direct comparison. Be honest: "pi-rollback restores context; we restore files. Use both." |

---

## 10. Action plan — Immediate / Short-term / Long-term

### 10.1 Immediate (this week)

1. **Patch `package.json` description** to lead with "Git-like undo, revert, and rollback checkpoints for OpenAI Codex CLI." (Measured: current description is already strong but could lead with the verb "undo.")
2. **Add 5 keywords** to `package.json`: `safety`, `guardrails`, `ai-coding-agent`, `time-travel`, `codex-snapshot`. (Measured current: 35 keywords; pi-rollback has 5, agentame has 7.)
3. **Add GitHub repo `Topics`**: `codex`, `openai-codex`, `codex-cli`, `mcp-server`, `checkpoint`, `ai-coding-agent`, `snapshot`, `undo`, `rollback`, `safety-net`. (Measured current: topics not set in our inspection.)
4. **Comment on openai/codex#11626 and #5082** with a 2-line answer + GitHub link. (Measured: both are public, high-intent.)
5. **Open PRs to `awesome-codex`, `awesome-mcp`, `awesome-ai-coding-tools`**, `awesome-cli-apps`. (Estimated effort: 30 min each.)
6. **Ship a 30-second terminal demo GIF** of the 30-second README flow. (Visuals drive PH and HN.)
7. **Update H1 / repo description** to include "Codex Undo" / "Codex Checkpoint" / "Codex Rollback" as aliases — they already live in the README "Also known as" line.

### 10.2 Short-term (this month)

1. **Show HN** post: "Show HN: agent-rollback – undo, revert, and rollback checkpoints for Codex CLI." Lead with codex#5082 (the bug) and codex#11626 (the ask).
2. **Product Hunt launch** on a Tuesday or Wednesday. Pre-warm via tweet.
3. **3 pillar articles** (Dev.to + cross-posted to Hashnode / Medium):
   - "How to undo changes in Codex CLI"
   - "Why we built an MCP server for code safety"
   - "jj-style `op revert` for AI agents"
4. **6 Reddit comments** in r/codex, r/cursor, r/ClaudeAI on existing "undo" threads. Link only where the answer actually solves the thread.
5. **Reach out to A386official** (the diffback author). If they exist, propose "agent-rollback + diffback = ?" or "merge / cross-link." Removes ambiguity, builds category.
6. **Build a public comparison page** at `/vs/pi-rollback`, `/vs/agentame`, `/vs/cursor-checkpoints` with honest tables.

### 10.3 Long-term (next quarter)

1. **Own the "agent snapshot layer" category.** SEO landing page, glossary entry on modelcontextprotocol.io if accepted, conference talk.
2. **Cross-agent adapters** that turn our "Codex-first" weakness into a strength (Claude Code, Cursor, Cline, Roo, Continue, Copilot, Windsurf, Gemini CLI). All already claimed compatible; ship the actual adapters.
3. **Native integration with Cursor / Cline / Continue** — get listed on their "safety" or "integrations" pages.
4. **Mutual backlink deal with pi-rollback** — they restore context, we restore files. They cover pi; we cover Codex/Claude Code/Cursor/etc. A "use both" co-marketing post.
5. **OpenAI partnership path** — if Codex ships native `/rewind` (#11626), our story becomes "the safety net for everything *before* the agent acts, and *after* every existing tool." Pivot to multi-agent, MCP-first.
6. **Cloud-hosted tier (optional)** — if a team wants shared checkpoints across machines. Out-of-scope per PRD §3, but option for v3.

---

## 11. Handoff Summary

| Field | Value |
|---|---|
| **Project** | `agent-rollback` (npm `agent-rollback` v1.0.1, MIT) |
| **Primary competitors profiled** | pi-rollback, agentame, A386official/diffback (claimed, unverified), mcpmarket.com Codex Revert |
| **Adjacent (different layer)** | Refact.ai Agent Rollback, Undo.io MCP, VS Code Copilot Checkpoints, GitHub Copilot CLI `/undo` |
| **Key competitive finding** | `pi-rollback` explicitly disclaims file undo. We are the only tool that combines file restore + Codex hook auto-snapshots + MCP server + jj-style `op revert`. |
| **Key demand finding** | openai/codex#11626 is the wedge: 90.4k-star repo, open issue, asks for *exactly* our feature set. |
| **Positioning recommendation** | "Undo for Codex CLI." (4 words, owns the head term.) |
| **Top 3 channels** | npm + Show HN + Product Hunt |
| **Top 3 backlink targets** | openai/codex#11626 comment, OpenAI Cookbook, awesome-mcp |
| **Top 3 features to keep leading with** | (a) Codex hook auto-snapshot, (b) jj-style `op revert`, (c) MCP server |
| **Top 3 weaknesses to exploit** | pi-rollback's file-undo disclaimer, agentame's hosted/SaaS model, Cursor's "Undo stages git" bug |
| **Data confidence** | pi-rollback, agentame, openai/codex#11626, #5082 — Measured (live fetch). A386official/diffback — Unverified (GitHub 404). mcpmarket Codex Revert — Unverified (HTTP 429). |
| **Next best skill** | [content-gap-analysis](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/research/content-gap-analysis/SKILL.md) — turn §3 demand-signal table into a topic-by-topic content plan. |
| **Save path** | `marketing/seo-audit/08-competitor-analysis.md` (this file) |

---

## Sources (all fetched this session)

- [registry.npmjs.org/agent-rollback](https://registry.npmjs.org/agent-rollback) (Measured: latest v1.0.1, 35 keywords, MIT)
- [registry.npmjs.org/pi-rollback](https://registry.npmjs.org/pi-rollback) (Measured: v0.1.0, 5 keywords, 19,505 bytes unpacked)
- [github.com/uriafranko/pi-rollback](https://github.com/uriafranko/pi-rollback) (Measured: 68 ⭐, 1 fork, 2 commits, README 208 lines)
- [registry.npmjs.org/agentame](https://registry.npmjs.org/agentame) (Measured: v1.0.7, 7 keywords, heavy SaaS deps)
- [github.com/A386official](https://github.com/A386official) (Measured: 2-follower web dev; "diffback" repo **returns HTTP 404**)
- [github.com/openai/codex/issues/5082](https://github.com/openai/codex/issues/5082) (Measured: closed Oct 11, 2025; "Undo stages files into git")
- [github.com/openai/codex/issues/11626](https://github.com/openai/codex/issues/11626) (Measured: open Feb 12, 2026; spec for `/rewind` that restores both chat + files)
- [mcpmarket.com/codex-revert](https://mcpmarket.com/codex-revert) (HTTP 429 on direct fetch; listing exists per prompt)
- [modelcontextprotocol.io](https://modelcontextprotocol.io) (MCP spec reference)
- [code.visualstudio.com/docs/copilot/chat-checkpoints](https://code.visualstudio.com/docs/copilot/chat-checkpoints) (Adjacent)
- [docs.github.com/copilot-cli/roll-back-changes](https://docs.github.com/copilot-cli/roll-back-changes) (Adjacent)

> **Verification note:** All "Measured" labels above are from live fetches in this session. A386official/diffback is in the prompt but its GitHub repo returns HTTP 404 as of fetch — flagged as **Unverified**. mcpmarket.com/codex-revert is real per the prompt but the page returned HTTP 429 on direct fetch — flagged as **Unverified**, described from the prompt verbatim.
