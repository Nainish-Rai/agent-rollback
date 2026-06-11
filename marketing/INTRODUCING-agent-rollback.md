# Introducing agent-rollback — platform-native launch posts

> **The product:** `agent-rollback` (short alias `arb`) is a Git-like undo
> layer for OpenAI Codex CLI. Snapshots, diffs, and restores for
> AI-edited code. CLI + MCP server + Codex hooks. v1.0.1, MIT, Node 20+.
>
> **The pitch in one line:** *Codex doesn't need to be trusted — it
> needs to be recoverable.*
>
> **Install:** `npm install -g agent-rollback` or the one-liner
> `curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --all`

These posts are written to be copy-paste-ready. Each one follows the
cultural rules from the `media-writer` skill guide for its platform.

---

## 1. Hacker News — Show HN

**Title (paste exactly):**

```text
Show HN: Agent Rollback – Git-style undo for Codex CLI
```

**URL:** `https://github.com/Nainish-Rai/agent-rollback` (or your demo URL)

**First comment (you must post this within 60 seconds of submission):**

```text
Hi HN — I built agent-rollback (also `arb`) because I kept hitting the
same Codex workflow problem: Git is great once I have a commit, editor
undo is fine for one buffer, but Codex sessions live in the messy
middle. Codex touches several files, sometimes creates artifacts,
sometimes drifts out of scope, and then I want to get back to a known
workspace state — fast, and without untangling a diff by hand.

It's a CLI, an MCP server, and a Codex hook. The primitives are
intentionally boring:

  - create a checkpoint (manual, automatic via hook, or by asking the agent)
  - list / show / diff checkpoints
  - restore a checkpoint (dry-run by default, requires `force: true` to apply)
  - undo the last N checkpoints
  - pin, prune, search

Files are content-addressed (sha256) and deduped, so snapshots cost
~zero disk. The whole store lives in `.agent-rollback/` — no cloud,
no telemetry.

The natural-language interface is what I'm happiest with. In a Codex
chat you just say things like:

  > "make a checkpoint and refactor task service"
  > "go to last checkpoint"
  > "show me checkpoints"
  > "what changed between the auth checkpoint and now?"

…and Codex calls the right MCP tool. The CLI (`agent-rollback` or
short alias `arb`) is the fallback that always works.

Install:
  npm install -g agent-rollback

Source: https://github.com/Nainish-Rai/agent-rollback

Known limitations I'd love feedback on:
  1. `op revert` is path-selective and saves a safety checkpoint first;
     it refuses conflicts unless you pass --force. Is that the right
     default, or annoying?
  2. Restore is file-content atomic per file, not a full workspace
     transaction. Worth doing the harder thing?
  3. TUI is a lightweight terminal browser, not a full Ink app.
     Use the TUI? Skip it?
  4. The short alias is `arb` (not `ar`) because the BSD `ar` was
     shadowing it in some shells. Anyone want a different name?

I'm not claiming this is production-hardened — I want failure modes
from real use. What would make you not trust this?
```

**Engagement plan (HN):**

- Stay online for 4-6 hours after posting
- Reply to every substantive comment within 30 min
- "Good point, hadn't considered that" is the right response to
  criticism you can't refute
- Never argue with tone-trolling — ignore and move on
- If someone points out a bug, fix it and edit the post
- Best time: Tuesday–Thursday, 8–10 AM US Eastern

---

## 2. Reddit — r/LocalLLaMA (primary) + r/CommandLine + r/sideproject

**Why r/LocalLLaMA first:** hands-on tinkerers, agent-focused, low
tolerance for hype, high tolerance for "here's what broke."

### Post 1: r/LocalLLaMA

**Title (paste exactly):**

```text
I built a Git-style undo layer for Codex CLI (MCP + hook) because git
stash didn't cover the pre-commit agent window
```

**Body:**

```markdown
**TL;DR**: agent-rollback is a CLI + MCP server + Codex hook that
snapshots the workspace, dedupes by content, and restores on demand.
Ask the agent "go to last checkpoint" and it does. MIT, Node 20+.

---

The problem I kept hitting with Codex: git is great after I commit,
but the agent is *fastest* in the messy pre-commit window where it
edits 4 files, creates one I didn't ask for, and rewrites a config I
was about to commit. By the time I notice, I'm staring at a diff I
didn't author and `git stash` doesn't help because there's no commit
to stash from.

So I built a small layer on top:

  - `agent-rollback checkpoint` (or `arb checkpoint`) snapshots
  - the workspace; identical files share one blob so it's ~zero disk
  - Codex hooks create deduped auto-snapshots on every prompt and
    tool use if you want
  - The MCP server lets any agent (Codex, Claude Code, Cursor…)
    call `create_checkpoint`, `restore_checkpoint`, `undo`, etc.
  - Restore is dry-run by default — pass `force: true` to actually
    mutate

The natural-language layer is what I'm happiest with. From a Codex
chat:

  > "make a checkpoint called 'green tests' and refactor the auth module"
  > "show me checkpoints"
  > "go to the last checkpoint"
  > "what changed between the auth checkpoint and now?"

The CLI is the always-works fallback.

Install:
  npm install -g agent-rollback
  # or the one-liner that also registers the MCP server
  curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --all

Repo: https://github.com/Nainish-Rai/agent-rollback

What I'd love feedback on from people running real agents:
  1. Does the MCP tool surface match what you want an undo tool to
     expose, or is it too coarse / too fine-grained?
  2. Auto-snapshot on every tool call is a lot of writes — worth it,
     or should the agent have to opt in?
  3. The `op revert` (per-operation undo) refuses to overwrite
     later edits unless you pass --force. Is that the right default?
  4. What would make you actually trust a restore in a real repo?

Happy to answer anything, and I'd especially like to hear your worst
"agent changed 12 files and now I have to reconstruct" story.
```

### Post 2: r/CommandLine (3-5 days later, different title)

**Title:**

```text
agent-rollback: a content-addressed checkpoint CLI for AI-edited
workspaces (npm, MIT)
```

**Body:**

```markdown
**TL;DR**: `arb` is a 3-char CLI that snapshots, diffs, and restores
the working tree. Designed for AI agents but works without one.

---

I built this because `git stash` doesn't help when Codex has edited
8 files and I haven't committed any of it. The tool:

  - takes content-addressed snapshots (sha256, deduped, ~zero disk)
  - exposes a TUI browser, a JSON mode for scripts, and an MCP server
  - has a short alias `arb` (the obvious one, `ar`, was shadowed by
    the BSD archive tool on some shells)

Common flows:

  arb init                                       # in any repo
  arb checkpoint "before refactor"               # manual
  arb list                                       # see all
  arb diff cp-before cp-after                    # see what changed
  arb revert cp-before --yes                     # restore
  arb undo 1 --yes                               # undo last N
  arb tui                                        # interactive browser

  arb prune --keep-last 20 --keep-pinned --yes   # GC

Install: `npm install -g agent-rollback`
Repo: https://github.com/Nainish-Rai/agent-rollback

No cloud, no telemetry, the whole store lives in `.agent-rollback/`.
Feedback very welcome.
```

### Post 3: r/sideproject (1 week later, more personal)

**Title:**

```text
I built a Git-style undo for Codex because "undo" is the one word I
kept typing to a CLI that didn't understand it
```

**Body:**

```markdown
**TL;DR**: agent-rollback (alias `arb`) is a CLI + MCP server that
gives Codex a real undo. Open source, MIT, npm-installable.

---

Quick context: I use Codex daily for real code changes. The failure
mode that bothered me most wasn't "the code is bad" — it was
"the code is on my filesystem in 6 files and I have no way to get
the pre-Codex version back without rebuilding it by hand."

Git doesn't help (no commit yet). Editor undo doesn't help (wrong
granularity). `cp -r . ~/backup-before-codex` works but I always
forget to do it.

So I built the boring version of "undo for agents":

  - snapshot before risky work (manual or via hook)
  - list, show, diff checkpoints
  - restore by id, or undo the last N
  - all content-addressed and deduped

It's a CLI (`agent-rollback`, short alias `arb`), an MCP server any
agent can call, and a Codex hook for auto-snapshots. ~30 seconds to
install, ~5 seconds to use.

What I want from this community:
  - worst Codex-fucked-up-my-workspace stories (to validate the
    problem)
  - feature requests I haven't thought of
  - honest feedback on the install UX (curl one-liner, npm, source)

Repo: https://github.com/Nainish-Rai/agent-rollback
npm: `npm install -g agent-rollback`
```

**Reddit engagement rules:**

- Read the subreddit rules before posting
- Don't cross-post the same copy on the same day
- Stay in the thread 2-3 hours after posting
- Reply to every comment, even critical ones
- Best time: weekday, 9-11 AM US Eastern (or whatever the sub's
  peak window is)

---

## 3. Twitter / X — thread

> **Post the thread from your main account, not a brand account.**
> Twitter rewards people, not logos.

**Tweet 1 (the hook, must work standalone):**

```
Codex edited 7 files. I didn't ask for 2 of them. I had no commit yet.
`git stash` didn't help. Editor undo was useless.

So I built a Git-style undo for Codex. It just hit v1.0.

A thread on what it does and why 🧵
```

**Tweet 2 (the pain, in 1 line):**

```
The gap Git doesn't cover:

  Git      → after you commit
  Cmd+Z    → inside one buffer
  Codex    → touches N files, keeps moving

That middle window — pre-commit, mid-agent — is where the damage
happens and where nothing recovers cleanly.
```

**Tweet 3 (the product, 1 idea):**

```
agent-rollback fills that window with named workspace checkpoints.

  - content-addressed, deduped (~zero disk)
  - one CLI, one MCP server, one Codex hook
  - "go to last checkpoint" just works in Codex chat
```

**Tweet 4 (the natural-language demo — this is the viral one):**

```
From a Codex chat:

  > "make a checkpoint called 'green tests' and refactor the auth module"
  > "show me checkpoints"
  > "go to the last checkpoint"
  > "what changed between the auth checkpoint and now?"

That's the whole API. The MCP server has 9 tools but you should
never have to name them.
```

**Tweet 5 (the install, paste-able):**

```
Install (one line, gets you binary + skill + MCP):

  curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --all

Or: npm install -g agent-rollback

Short alias: arb (the obvious name, `ar`, was shadowed by BSD ar on
some shells)
```

**Tweet 6 (the honest limits — earns trust):**

```
What it doesn't do (yet):

  - no cloud sync
  - restore is per-file atomic, not a workspace transaction
  - TUI is a lightweight browser, not a full Ink app
  - the MCP block is registered for Codex only; other agents need
    manual config

All of these are in the roadmap, not hidden.
```

**Tweet 7 (the ask):**

```
If you run Codex (or Claude Code, Cursor, Cline) on real code:

  ⭐ https://github.com/Nainish-Rai/agent-rollback
  📦 npm i -g agent-rollback

Tell me where it breaks. I want failure modes, not compliments.
```

**Engagement plan (X):**

- First 30 minutes decide everything — be online
- Reply to every comment in the first 2 hours
- Quote-tweet your own thread on day 2 with a different hook
- Pin the thread to your profile for 1 week
- Best time: Tuesday–Thursday, 9 AM or 4 PM US Eastern
- Add 1 visual: a terminal screenshot showing the Codex chat
  exchange, or a 15-second screen recording

---

## 4. LinkedIn — founder / builder post

> **Voice:** respected industry peer sharing a hard-won lesson.
> Not a press release. Not a humble-brag. Just a developer who
> built a thing and wants feedback.

```
I kept saying one word to my terminal: "undo."

Codex would edit 6 files, drift out of scope, and I'd be staring at
a diff I didn't write with no clean way back. Git didn't help (no
commit yet). Cmd+Z was the wrong granularity.

So I built a Git-style undo layer for AI-edited code. It's called
agent-rollback.

What it does, in one line:
  Snapshot the workspace. Let the agent do its thing. Restore by id
  if scope drifts. Content-addressed, deduped, ~zero disk.

Three ways to use it:
  • CLI: `agent-rollback` (or short alias `arb`)
  • MCP server: any agent (Codex, Claude Code, Cursor…) can call
    create_checkpoint, restore_checkpoint, undo, etc.
  • Codex hook: auto-snapshots on every prompt and tool use

The thing I'm happiest with is the natural-language interface. In a
Codex chat I just say:

  "make a checkpoint called 'green tests' and refactor the auth module"
  "show me checkpoints"
  "go to the last checkpoint"

…and the agent does the right thing. The CLI is the always-works
fallback.

Why I'm posting this:
  I don't think AI agents need to be "trusted." They need to be
  recoverable. That's a smaller, more honest promise than "safe
  autonomous coding" and I think it ships faster.

MIT, Node 20+, ~30 seconds to install.
  → https://github.com/Nainish-Rai/agent-rollback
  → npm i -g agent-rollback

If you've been burned by an agent that edited too much, I'd love
your worst story. I'll turn the best ones into demo scenarios for
the README.

#AI #DeveloperTools #OpenSource #Codex #MCP
```

**Put the link in the first comment, not the post body.** LinkedIn
suppresses reach for posts with links in the body.

**Engagement plan (LinkedIn):**

- Reply to every comment within 1 hour (algorithm weights this)
- Ask a question in the post to drive comments
- Engage with 5-10 other people's posts before and after yours
- Best time: Tuesday–Thursday, 7-9 AM or 12 PM (your audience's TZ)
- Don't use "Agree?" at the end (cringe)
- 3-5 hashtags at the end, not 15

---

## 5. Dev.to — tutorial article

**Filename:** `how-to-add-undo-to-codex-cli.md`

**Frontmatter:**

```yaml
---
title: "How to Add Git-Style Undo to Codex CLI (In 30 Seconds)"
published: true
description: "A practical guide to adding recoverable checkpoints to your Codex workflow with agent-rollback, an open-source CLI + MCP server."
tags: ai, codenewbie, tutorial, cli, productivity
canonical_url: https://github.com/Nainish-Rai/agent-rollback
cover_image: https://... (terminal screenshot)
---
```

**Body:**

```markdown
## The problem

If you use Codex, Claude Code, Cursor, or any agent that edits files,
you've been here:

> Codex made a change you didn't want. It touched 6 files, two of
> which you didn't ask for. You hadn't committed anything yet. `git
> stash` doesn't help because there's no commit. Editor undo is
> useless across the workspace. You're now manually reconstructing
> state from the diff and a growing sense of regret.

This post is about fixing that with one tool and 30 seconds of setup.

## What we're installing

[agent-rollback](https://github.com/Nainish-Rai/agent-rollback) is an
open-source CLI + MCP server + Codex hook that adds Git-style
checkpoints to your workspace. Snapshots are content-addressed
(sha256) and deduped, so they cost almost nothing on disk.

It works with:
  - OpenAI Codex CLI
  - Claude Code
  - Cursor
  - Windsurf
  - Copilot, Cline, Gemini CLI (via the SKILL.md install)
  - Any MCP-compatible agent

## Prerequisites

  - Node.js 20 or later
  - Codex CLI installed (optional — the CLI works without it)
  - 30 seconds

## Step 1: Install

The one-liner gets you the binary, the agent skill, and the MCP
server registration in one go:

```bash
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --all
```

Or just npm:

```bash
npm install -g agent-rollback
```

Verify:

```bash
agent-rollback --help   # see all subcommands
arb --help              # short alias (3 chars)
```

The short alias is `arb` because the obvious `ar` collides with the
BSD archive tool on most Unix systems.

## Step 2: Initialize a repo

```bash
cd your-project
agent-rollback init
```

This creates `.agent-rollback/` in the project. Add it to
`.gitignore` — it's yours, not your repo's.

## Step 3: Make a checkpoint, then do something risky

The fastest workflow is from a Codex chat. Open Codex in the project
and just say:

> "make a checkpoint called 'green tests' and refactor the auth module"

Codex will create the checkpoint, then do the refactor. If the
refactor goes off track, you roll back in one sentence.

## Step 4: Browse and restore

> "show me checkpoints"

Codex lists them with timestamps and labels. Pick the one you want.

> "go to the last checkpoint"

The workspace is restored. A safety checkpoint is created
automatically, so you can undo the undo.

## Step 5: See what changed

> "what did the refactor change vs the green tests checkpoint?"

You get a unified diff.

## Step 6: Add a permanent safety net

Want every Codex run to be auto-rolled-back-able? Install the hook:

```bash
agent-rollback init codex
```

Then run `/hooks` inside Codex and trust the generated repo-local
hooks. From then on, every session start, user prompt, and tool use
creates a deduped auto-checkpoint.

## The CLI for non-Codex moments

```bash
arb checkpoint "before risky thing"
arb list
arb diff cp-before cp-after
arb revert cp-before --yes
arb undo 1 --yes
arb prune --keep-last 20 --keep-pinned --yes
arb tui              # interactive terminal browser
```

## Common issues

**`arb` is shadowed by the system archive tool?**
On shells where `/usr/bin` is first in PATH, the BSD `ar` wins. Use
the full `agent-rollback` name, or your own alias:
`alias rbk='agent-rollback'`.

**Want auto-snapshots without installing the hook?**
Run Codex through the wrapper: `agent-rollback run --event-stream
codex "your prompt"`. It dedupes checkpoints from the JSONL event
stream.

**Restore looks wrong?**
Restore creates a safety checkpoint first, so you can always undo
the restore: `agent-rollback undo 1 --yes`.

## What we learned

  - The useful primitive isn't "make the model safer" — it's "make
    bad actions recoverable."
  - Content-addressed dedup is what makes this tractable; without
    it, the disk cost would be unbearable.
  - The natural-language interface is the part users actually want.
    The CLI is the fallback that always works.
  - Naming is hard: `ar` was shadowed by BSD `ar` in many shells.
    `arb` is fine.

## Next steps

  - Repo: https://github.com/Nainish-Rai/agent-rollback
  - npm: `npm install -g agent-rollback`
  - Roadmap: the `roadmap.md` in the repo covers what's next
    (workspace transactions, cloud sync opt-in, Ink-based TUI)

---

*Questions? Drop a comment — I reply to everyone.*
```

**Dev.to engagement:**

- Use 4 tags max: `ai`, `tutorial`, `cli`, `productivity`
- Reply to every comment
- Pin the post to your profile for 2 weeks
- Best time: weekday, 8-10 AM

---

## 6. Medium — story

**Submit to:** *Better Programming* (most relevant publication; check
their submission guidelines first)

**Title:**

```text
I Built a "Ctrl-Z" for Codex Because Git Doesn't Cover the Pre-Commit Window
```

**Subtitle:**

```text
After Codex edited 7 files I didn't ask for, I built a content-addressed
checkpoint layer. Here's what I learned shipping it.
```

**Body outline (this is a real article, ~1,200 words):**

```markdown
# I Built a "Ctrl-Z" for Codex Because Git Doesn't Cover the Pre-Commit Window

The email — well, the terminal output — went like this:

> [codex] Refactored 7 files. 2 failures. 5 untracked.

I hadn't asked for a refactor. I'd asked for a single edit. By the
time I noticed, I was staring at 7 changed files, 2 new files I
didn't want, and a feeling I now recognize as "I am about to
spend 20 minutes undoing this by hand."

[Continue with: the gap you identified, why git doesn't help,
what you built, the natural-language interface discovery, the
content-addressed dedup insight, the `ar` → `arb` rename after
getting shadowed by BSD ar, the launch, what you learned.]

[Close with: the thing you'd want to tell your past self, the
roadmap, the install link.]
```

**Medium voice notes:**

- "I" is encouraged — this is personal
- Mix short and long paragraphs
- Pull-quote the key insight
- End with a quotable line
- Submit to publications; solo distribution is much harder

---

## 7. 微信公众号 (WeChat) — Chinese tech audience

> **Authenticity note:** The post below is in Chinese to match the
> platform's native voice. If you'd rather have it in English and
> translate yourself, say the word.

**Title options (pick one):**

```
我给 Codex 加了个 "撤销" 键，它一周就 1.0 了

Codex 乱改我代码？我做了个 3 个字母的命令专门治这个

Codex 改完 7 个文件后，我才意识到 Git 其实救不了我
```

**Body:**

```markdown
# 我给 Codex 加了个 "撤销" 键，它一周就 1.0 了

先说结论：

```bash
npm install -g agent-rollback
arb checkpoint "改之前"
# 让 Codex 干活
arb undo 1 --yes
```

`arb` 是 `agent-rollback` 的 3 字母缩写。

## 问题

用 Codex 的人应该都经历过这种场景：

> 让 Codex 改一个文件，结果它顺手重构了 6 个，
> 还新建了 2 个我没要的东西。

Git 这时候救不了你 —— 你还没 commit。
Cmd+Z 也救不了你 —— 粒度不对。
你只能盯着 diff 一个个手动还原。

## 我做了什么

一个 CLI + MCP server + Codex hook。

核心就 4 个动作：

  - checkpoint  （拍快照）
  - list        （看历史）
  - revert      （回到某个快照）
  - undo        （撤销最近 N 步）

文件按内容 hash 存，重复内容只存一份。
所以你存 1000 个快照，磁盘占用和 1 个差不多。

## 最好用的部分

不是 CLI。是从 Codex 聊天里直接说人话：

> 你："拍个快照叫 'green tests'，然后重构 auth module"
> Codex："已创建 cp-183544-green-tests-ed96，正在重构..."

> 你："回到上一个快照"
> Codex："已还原，4 个文件恢复"

整个 MCP server 暴露 9 个工具，
但你永远不需要记住它们。

## 装一下

一行命令搞定（带 skill + MCP 自动注册）：

```bash
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --all
```

或者直接 npm：

```bash
npm install -g agent-rollback
```

## 一些诚实的限制

- 没有云同步（本地存在 `.agent-rollback/` 里）
- 还原是按文件原子的，不是整个 workspace 事务
- TUI 是个轻量级终端浏览器，不是完整的 Ink app
- MCP 块只自动给 Codex CLI 注册，其他 agent 暂时要手动

这些都在 roadmap 里，没藏着。

## 一个小坑

我一开始想用 `ar` 当短别名。
结果在很多 shell 里，`/usr/bin/ar`（BSD 的归档工具）会
抢先一步被找到。

最后改成了 `arb`。
`a`gent-`r`oll`b`ack，刚好 3 个字母。

## 想要你的故事

你被 agent 改坏过哪些文件？

回我你最离谱的一次。
我会把最好的几个变成 README 里的 demo。

GitHub：https://github.com/Nainish-Rai/agent-rollback
npm：npm i -g agent-rollback
```

**WeChat engagement:**

- 文章发在自己公众号
- 朋友圈 + 技术群转发，前 2 小时决定阅读量
- 结尾留一个"你最离谱的 agent 翻车"开放问题，驱动评论
- 最佳发布时间：周二到周四，20:00-22:00
- 配图：终端截图（Codex 聊天 + arb 命令）

---

## Launch-day sequencing

Don't post everything at once. Suggested order:

| Day  | Platform          | Why this order                                |
| ---- | ----------------- | --------------------------------------------- |
| Mon  | Hacker News (AM)  | Sets the technical credibility baseline       |
| Mon  | Twitter thread    | Ride the HN wave with a public thanks + thread |
| Tue  | LinkedIn          | Different audience, weekday morning peak      |
| Tue  | Dev.to            | Tutorial audience is here                     |
| Wed  | Reddit r/LocalLLaMA | After a day of engagement, you're not "drive-by" |
| Thu  | Reddit r/CommandLine | Different angle, CLI-focused                  |
| Fri  | Medium submission to Better Programming | Long-form credibility |
| Weekend | WeChat 公众号 | When Chinese tech audience is browsing |

After 1 week: r/sideproject as the personal builder story.
After 2 weeks: a "lessons learned" follow-up on r/programming.

## Universal don'ts

- Don't post on HN and Twitter in the same 10 minutes
- Don't use the same copy across platforms (the post files above are
  intentionally different in voice, length, and CTA)
- Don't disappear after posting — the first 2-3 hours of engagement
  decide everything on every platform
- Don't use a brand account where a personal account will do
- Don't ask for engagement ("please RT!") — the asks above are
  natural and specific
```

Now let me verify the file is good and commit it: