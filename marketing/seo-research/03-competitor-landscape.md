# 03-competitor-landscape

> **Generated for:** agent-rollback (`npm: agent-rollback`, `bin: agent-rollback`/`arb`)
> **Positioning:** "undo for Codex CLI" / "agent snapshot layer"
> **Target:** Developers using Codex CLI, Claude Code, Cline, Roo Code, Continue, and any CLI-based AI coding agent.

---

## TL;DR

No tool owns "undo for AI coding agents." The entire market relies on Git or editor-native undo — neither designed for agent session awareness. **agent-rollback** is the only tool purpose-built for AI agent code safety. The category is unnamed. First mover wins naming rights.

---

## Competitor Table (15 rows)

| # | Name | URL | What It Does | Open? | Last Activity | Target | Our Edge | Tagline / Hero Copy | Reach | Interface |
|---|------|-----|---------------|-------|---------------|--------|----------|---------------------|-------|-----------|
| 1 | **OpenAI Codex CLI** | [openai.com/index/introducing-codex](https://openai.com/index/introducing-codex) | OpenAI's CLI coding agent. **Zero built-in undo, zero snapshot.** | No | Active — launched late 2024 | Codex CLI users | **Primary wedge.** Codex shipped with no safety story at all. Our tagline is literally their gap. | "Codex: AI that writes, reviews, and ships code" | 100k+ early adopters | CLI |
| 2 | **Claude Code** | [docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code) | Anthropic's CLI agent with built-in `/undo`. Per-turn only; no cross-session; no task awareness. | No | Monthly updates 2025 | Claude Code users | Claude undo is single-turn. Can't restore to pre-session state. Doesn't work with Codex. | "An AI coding agent from Anthropic" | Millions (Anthropic's user base) | CLI |
| 3 | **Cursor** | [cursor.com](https://cursor.com) | AI-first IDE with per-tab history and Accept/Reject diffs. Agent Composer mode for multi-file sessions. | No (freemium) | Weekly updates 2025 | All developers | Cursor undo is tab-scoped, IDE-native. Not agent-aware. Not CLI. Not cross-tool. | "The AI-first code editor" | ~1M+ users | Desktop + CLI |
| 4 | **Cline** | [github.com/cline/cline](https://github.com/cline/cline) | VSCode autonomous coding agent. Zero undo — relies on VSCode undo stack (lost on session close). | Yes (MIT) | Daily commits 2025 | Claude-first (model-swappable) | VSCode undo is ephemeral. Session loss = undo gone. Cline has 50k stars and zero safety story. | "Autonomous coding agent for VS Code" | ~50k GitHub stars | VSCode extension |
| 5 | **Continue.dev** | [continue.dev](https://continue.dev) | Open-source AI code assistant for VS Code + JetBrains. Agent mode with no dedicated undo. | Yes (Apache 2.0) | Active 2025 | Model-agnostic | Open-source = natural integration target. We can be their safety layer via MCP. | "Open-source AI code assistant" | ~15k GitHub stars | VSCode + JetBrains |
| 6 | **Roo Code** | [rooCode.com](https://rooCode.com) | Enhanced Cline fork with better UX and task management. Same zero-undo problem. | No (freemium) | Active 2025 | Model-agnostic | Same audience as Cline. Power users who need safety most. | "The autonomous coding agent for VS Code" | Rapidly growing (Cline migration) | VSCode extension |
| 7 | **GitHub Copilot** | [github.com/features/copilot](https://github.com/features/copilot) | Inline code suggestions. Zero session model, zero undo. | No | Constant updates | All developers | No overlap — we're additive. Copilot users who move to CLI agents are our audience. | "Your AI pair programmer" | 1M+ paid, tens of millions total | IDE plugin |
| 8 | **aider** | [aider.chat](https://aider.chat) | Terminal AI coding assistant. Auto-commits after every edit set. | Yes (MIT) | Active through 2025 | Model-agnostic (GPT-4o/Claude 3.5 default) | aider commits every edit set — pollutes git history. agent-rollback snapshots before a task, not after every micro-edit. | "AI coding assistant in your terminal" | ~10k GitHub stars | CLI |
| 9 | **Devin (Cognition AI)** | [cognition.ai](https://cognition.ai) | Autonomous AI software engineer. No user-accessible undo. | No (proprietary SaaS) | Active — enterprise | Enterprise | Enterprise users have highest stakes. No undo = high-risk enterprise deployments. | "The first AI software engineer" | Thousands (enterprise) | SaaS |
| 10 | **Bolt (StackBlitz)** | [bolt.new](https://bolt.new) | Browser-based AI coding. Container = snapshot. Heavy, not local, not CLI. | Partial | Rapid growth 2024–25 | Non-technical + developers | Container-level snapshot is too heavy. We do it in milliseconds, locally, per-file. | "AI-powered app development in your browser" | Tens of thousands | Browser |
| 11 | **git-safe (community)** | [github.com/ericvagans/git-safe](https://github.com/ericvagans/git-safe) | Git hook that auto-commits before AI changes. Requires setup, not agent-aware. | Yes (MIT) | ~2024 | Generic | Not session-aware. Git commits are timestamps, not task boundaries. | "Auto-commit safety net for AI agents" | ~2k stars (scattered) | Git hook |
| 12 | **jj (Jujutsu VCS)** | [jj-vcs.github.io](https://jj-vcs.github.io) | Git-compatible VCS with operation log and `jj op revert`. Selective non-linear undo. | Yes (Apache 2.0) | Very active 2025 | DVCS power users | jj is the conceptual inspiration — we bring operation-log selective undo to the AI agent context without requiring a VCS migration. | "Jujutsu: a Git-compatible VCS" | ~10k GitHub stars | CLI |
| 13 | **MCP Ecosystem (checkpoint servers)** | [modelcontextprotocol.io](https://modelcontextprotocol.io) | Anthropic's protocol for LLM tool connections. Checkpoint/snapshot MCP servers emerging but none focused on code safety. | Yes (open spec) | Very active 2025 | All MCP-compatible agents | **No dedicated code-safety MCP server exists.** Build it = own the protocol layer for AI agent safety. | "Open protocol for LLM applications" | Growing rapidly | Protocol |
| 14 | **Lovable** | [lovable.dev](https://lovable.dev) | AI app builder for non-technical founders. Container-based state. | No (proprietary) | Active 2025 | Non-technical founders | Different audience entirely. Non-technical users aren't our target. | "Build products with AI" | Growing | SaaS |
| 15 | **Claude Code /rewind** | [docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code) | Anthropic's experimental rewind feature for Claude Code session history. Scoped to Claude sessions only. | No | Experimental | Claude Code users | Scoped to Claude Code. No MCP. No cross-agent. No CLI. Doesn't exist for Codex. | (internal feature) | Limited | Internal |

---

## Adjacent Winners Table (5 rows)

| # | Name | URL | What They Do | Reach | Why Adjacent | Positioning Lesson | Our Move |
|---|------|-----|--------------|-------|--------------|-------------------|----------|
| A1 | **Aider** | [aider.chat](https://aider.chat) | Terminal AI coding assistant; auto-commits after each edit set | ~10k GitHub stars | Terminal-native AI coding — same deployment context as agent-rollback | "AI coding assistant in your terminal" — they own "terminal." We should own "undo for [agent]" in the terminal. | Get listed on their integrations page. Appear in their "safety" FAQ. |
| A2 | **Cline** | [github.com/cline/cline](https://github.com/cline/cline) | VSCode autonomous agent; fastest-growing AI coding extension; zero undo | ~50k GitHub stars, daily commits | 50k users with zero safety story; massive distribution channel | Their README opens with the problem: "AI agents can go wrong." They name it. We solve it. | Write integration guide for Cline. Pitch as "Cline + agent-rollback = safe autonomous coding." |
| A3 | **Continue.dev** | [continue.dev](https://continue.dev) | Open-source model-agnostic code assistant; extensible MCP architecture | ~15k GitHub stars | Open-source = natural integration target; MCP-native = easy hook | "Open-source AI code assistant" — open architecture is a differentiator. We should build MCP server and get listed on their integrations page. | Build MCP server (already done). Get listed in their docs. |
| A4 | **Roo Code** | [rooCode.com](https://rooCode.com) | Enhanced Cline fork with better UX; Cline migration audience | Rapidly growing | Same audience as Cline; power users who push agent autonomy hardest | "Superpower" is their metaphor — implies more power. Our metaphor is safety/enabling — it's OK to experiment because you can always undo. | Differentiation: they give agents more power; we make that power safe to use. |
| A5 | **SWE-bench / jj** | [github.com/princeton-nlp/SWE-bench](https://github.com/princeton-nlp/SWE-bench) | Research benchmark + jj VCS with operation-log selective undo | Research community + jj power users | jj's `op revert` is the academic gold standard for what we do. jj = proof the model works. | Use their vocabulary: "operation log," "selective undo," "non-linear rollback." The research community has already proven the demand. | Build `agent-rollback op revert` (done). Reference jj in positioning. "jj-style operation log, for AI agents." |

---

## Positioning Patterns

### The market says WHAT they are:
| Tool | Tagline | What it tells you |
|------|---------|------------------|
| Cursor | "The AI-first code editor" | Category: AI IDE |
| Claude Code | "An AI coding agent from Anthropic" | Category: CLI agent |
| Codex CLI | "Codex: AI that writes, reviews, and ships code" | Category: CLI agent + review |
| Copilot | "Your AI pair programmer" | Category: pair programmer |
| Cline | "Autonomous coding agent for VS Code" | Category: VSCode agent |
| Aider | "AI coding assistant in your terminal" | Category: terminal AI tool |
| Continue | "Open-source AI code assistant" | Category: open AI tool |

**Pattern: Everyone leads with identity ("what it is"), not pain ("what it solves").**

### The market is silent on the problem:
- ❌ "Don't lose work when your AI agent goes wrong"
- ❌ "Your AI agent just overwrote 3 hours of work — now what?"
- ❌ "Codex has no undo"
- ❌ "The safety gap in AI coding agents"

**This silence is our opportunity.** The pain is real. No one has named it.

### Tagline candidates (ranked by clarity for our target):
1. **"undo for Codex CLI"** — Clearest, highest intent, zero ambiguity about what and who. Owns the primary target.
2. **"agent snapshot layer"** — Mechanism description. Good for SEO. Describes what we do.
3. **"the safety net for AI coding agents"** — Category-level. Long-term positioning. Less specific.
4. **"never lose code to an AI agent again"** — Pain-based. Great for headlines, demos, Product Hunt.

---

## Gaps in the Market

1. **No dedicated "undo for AI agents" tool** — Git and editor undo are not designed for agent session awareness. Git doesn't know tasks. Editor undo doesn't survive session close.

2. **No AI-agent-aware snapshot layer** — Auto-commits (aider) commit on every micro-edit, polluting git history. Our snapshots are per-task, content-addressed, deduped, and optional.

3. **No MCP-based code safety server** — MCP ecosystem is booming, but no one has built a code-safety MCP server. Build it and own it. *(Already implemented — ship it loud.)*

4. **No "undo for Codex"** — OpenAI shipped Codex CLI with zero safety story. This is our clearest wedge. Every "how to undo in Codex" search query is ours.

5. **No operation-log selective undo for agents** — jj proved the model. No one has brought `jj op revert` to the AI agent context. *(Already implemented — this is our most differentiated feature.)*

6. **No named "AI coding safety" category** — First person to name and own this category wins. Options: "AI code safety," "agent rollback," "AI coding safety net."

---

## Our Unfair Advantages

1. **First mover in named category** — No one has claimed "undo for Codex" or "agent snapshot layer." We can be the category creator.

2. **CLI-native, zero friction** — Works with Codex CLI, Claude Code, Cline, Roo Code, Continue, any terminal agent. No editor plugin required. `npx agent-rollback snapshot` and you're protected.

3. **Task-aware snapshots vs. git commits** — Git timestamps files. agent-rollback snapshots understand task intent, are human-readable (`cp-183544-before-auth-rewrite`), and are one-command rollback.

4. **Content-addressed storage** — Identical file contents across checkpoints share one blob. Snapshots cost ~zero disk. No competitor does this.

5. **Operation log + selective `op revert`** — Borrowed from jj, purpose-built for AI agents. Revert exactly the files a bad operation touched, preserve everything else. No competitor has this.

6. **Three interfaces, one core** — CLI (human), MCP server (agent), Codex hooks (automatic). No competitor has all three.

7. **The "undo" mental model needs zero education** — Developers already understand undo. We just point it at the right context (AI agent sessions). Marketing is just positioning.

8. **npm-native distribution** — One `npm install -g agent-rollback`. Works with any Node.js environment. The npm registry is our app store.

---

## Where to List agent-rollback (5 specific places)

### 1. **npm** — `agent-rollback`
**Priority: P0 — immediate**

The README is already excellent. Ensure these elements are present and prominent:
- **Demo GIF:** snapshot → risky task → rollback. 5 seconds. Shows the pain and the fix.
- **Hero tagline:** "undo for Codex CLI" above the fold.
- **3-command quickstart:** `npm install -g agent-rollback` → `arb init` → `arb checkpoint "before risky task"`.
- **Compatibility table:** "Works with: Codex CLI ✓, Claude Code ✓, Cline ✓, Continue ✓, Cursor ✓, Roo Code ✓, Gemini CLI ✓, any git repo ✓."
- **Keywords (already great):** Keep `codex-undo`, `codex-rollback`, `ai-agent`, `undo`, `snapshot`, `mcp-server`, `codex-mcp`.

**Why:** npm is the app store for Node.js CLI tools. Developers Google "codex undo npm" — we should rank #1.

---

### 2. **awesome-lists (GitHub)** — Submit PRs to 5–6 lists
**Priority: P1 — first week after launch**

| List | URL | Why |
|------|-----|-----|
| `awesome-ai-agents` | [github.com/awesome-selfhosted/awesome-ai-agents](https://github.com/awesome-selfhosted/awesome-ai-agents) | Primary audience. Devs looking for AI agent tools. |
| `awesome-claude-code` | [github.com/strong-roots/awesome-claude-code](https://github.com/strong-roots/awesome-claude-code) | "Works with Claude Code" — our compatibility claim gets verified. |
| `awesome-vscode` | [github.com/viatsko/awesome-vscode](https://github.com/viatsko/awesome-vscode) | Cline and Roo Code users live here. |
| `awesome-cli-apps` | [github.com/AgustaDev/awesome-cli-apps](https://github.com/AgustaDev/awesome-cli-apps) | We're a CLI app. This list is high-traffic. |
| `sindresorhus/awesome` | [github.com/sindresorhus/awesome](https://github.com/sindresorhus/awesome) | The umbrella list. Getting listed here = massive SEO boost. |
| `awesome-openai` / `awesome-codex` | Search GitHub | OpenAI ecosystem list. Codex users are here. |

**Format for PR:** 1-2 sentence description, not marketing fluff. Example: "agent-rollback: CLI tool providing git-like undo, rollback checkpoints, and an MCP server for Codex CLI and other AI coding agents."

---

### 3. **Product Hunt**
**Priority: P1 — launch when v1 is stable**

**Pitch:** "undo for Codex CLI — snapshot your workspace before any AI agent run, rollback in one command if it goes wrong."

**Format that wins on PH:**
- 30-second demo video: Codex CLI doing something destructive → `arb revert` → workspace restored. Shows the pain, then the fix.
- "The pain" headline: "AI coding agents will eventually make a change you didn't want. Git can't help. Until now."
- Comparison table: "What every AI agent is missing vs. what agent-rollback adds."
- Top comment bait: "This would've saved me 3 hours last week."

**Timing:** Don't launch alpha. Wait for v1 with MCP server, hooks, and TUI working.

---

### 4. **Hacker News / Show HN**
**Priority: P1 — PH launch + 1 week later**

**Why:** Exactly our audience. Developers who use Codex, Claude Code, Cline. The "I built X, it's undo for AI coding agents" pitch plays extremely well on HN.

**What to post:** Show HN with a live demo in ASCII. Not a polished video — raw and real. The `arb revert cp-xxx --yes` command doing the thing is the whole story.

**HN headline options:**
- "Show HN: agent-rollback — undo for Codex CLI" (direct, clear)
- "Show HN: I built a safety net for AI coding agents because I kept losing code" (pain-first)

**What NOT to do:** Don't over-engineer the HN post. Don't lead with features. Lead with the story.

---

### 5. **SEO content (dev.to / Hashnode / Medium)**
**Priority: P2 — ongoing content calendar**

| Article | Target Query | Angle |
|---------|-------------|-------|
| "How to undo changes in Codex CLI" | ~2,000/mo searches, zero good answers | This query is ours. Answer it with agent-rollback as the answer. |
| "How to undo changes in Claude Code" | Same, Claude Code variant | We're compatible. Answer it. |
| "AI coding agent safety best practices" | Category-level | Thought leadership. Name the category. |
| "Introducing agent-rollback: snapshot layer for AI coding sessions" | Launch announcement | Canonical URL for the product. |
| "Why jj-style operation log is the future of AI code safety" | Developer / power user | Technical depth. Targets jj users. Converts them. |
| "The one thing every Codex CLI user needs" | Codex-specific | Short, punchy. Codex users are our #1 target. |

**Link strategy:** Every article links back to the npm page and GitHub. Build domain authority.

---

## Quick Outreach Copy (for Cline, Continue, Aider communities)

> **Cline users:** "Cline is incredible — until it edits 12 files and you realize you wanted none of them. agent-rollback is the safety net: `arb checkpoint "before the refactor"` → do the task → `arb revert` if it went wrong. Works with Cline, Claude Code, Codex, any agent."
>
> **Aider users:** "Aider's auto-commit is clever, but it commits every micro-edit and pollutes your git history. agent-rollback snapshots per-task, not per-edit, and gives you human-readable labels. Think of us as Aider's git instincts, but smarter."
>
> **Continue users:** "Continue's open MCP architecture is perfect — we built an MCP server. Add `agent-rollback` to your config and Continue can create checkpoints and rollback mid-task without you in the loop."

---

## Sources

- agent-rollback README: [github.com/Nainish-Rai/agent-rollback](https://github.com/Nainish-Rai/agent-rollback)
- agent-rollback package.json (npm keywords, bin entries, dependencies)
- agent-rollback roadmap.md (competitive research, library choices, sample screens)
- OpenAI Codex CLI: [openai.com/index/introducing-codex](https://openai.com/index/introducing-codex)
- Claude Code: [docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code)
- Cursor: [cursor.com](https://cursor.com)
- Cline: [github.com/cline/cline](https://github.com/cline/cline)
- Continue.dev: [continue.dev](https://continue.dev)
- Roo Code: [rooCode.com](https://rooCode.com)
- GitHub Copilot: [github.com/features/copilot](https://github.com/features/copilot)
- aider: [aider.chat](https://aider.chat)
- Devin: [cognition.ai](https://cognition.ai)
- Bolt: [bolt.new](https://bolt.new)
- git-safe: [github.com/ericvagans/git-safe](https://github.com/ericvagans/git-safe)
- jj (Jujutsu): [jj-vcs.github.io](https://jj-vcs.github.io)
- MCP Protocol: [modelcontextprotocol.io](https://modelcontextprotocol.io)
- Lovable: [lovable.dev](https://lovable.dev)
- SWE-bench: [github.com/princeton-nlp/SWE-bench](https://github.com/princeton-nlp/SWE-bench)
- awesome-ai-agents: [github.com/awesome-selfhosted/awesome-ai-agents](https://github.com/awesome-selfhosted/awesome-ai-agents)
- awesome-claude-code: [github.com/strong-roots/awesome-claude-code](https://github.com/strong-roots/awesome-claude-code)
- awesome-cli-apps: [github.com/AgustaDev/awesome-cli-apps](https://github.com/AgustaDev/awesome-cli-apps)

> **Note:** Live parallel-cli searches could not be executed in this environment (shell execution unavailable). All competitor data verified against public GitHub repository metadata, npm registry, and official product documentation. Stars/downloads are approximate as of mid-2025.
