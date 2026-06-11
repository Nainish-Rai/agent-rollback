---
title: "Codex Checkpoint Tools Compared: agent-rollback vs Codex Revert vs Claude Code /rewind vs Git Worktrees"
description: "A side-by-side comparison of every tool that promises to roll back Codex CLI changes — Codex's built-in revert, Claude Code's /rewind, git worktrees, and agent-rollback. Honest 'when to use what' guidance."
target_keywords: ["codex checkpoint", "codex rollback", "codex revert", "codex undo"]
funnel_stage: MOFU (comparison-intent, evaluating options)
audience: developers deciding which undo/recovery tool to install
word_count_target: 1500
last_updated: 2026-06-11
---

# Codex Checkpoint Tools Compared: agent-rollback vs Codex Revert vs Claude Code /rewind vs Git Worktrees

> "How do I roll back what Codex just did?" is one of the top questions
> in the Codex CLI community. There are four real answers in 2026. Here
> is the side-by-side.

## TL;DR

| If you want… | Use |
| --- | --- |
| A checkpoint created by the agent *while you watch*, in plain English, with one-command restore | **agent-rollback** |
| The official Codex slash command to roll back the last assistant turn | **Codex Revert** (experimental) |
| A prompt-indexed timeline with code-and-conversation decoupling, inside Claude Code only | **Claude Code `/rewind`** |
| A full worktree-isolated branch you can throw away with no recovery tool required | **Git worktrees** |

If you want one tool that works across Codex, Claude Code, Cursor, and
the terminal, is content-addressed, and doesn't pollute your real git
history, **agent-rollback** is currently the only option.

## The comparison table

| Tool | License | MCP server | Codex hook | Install one-liner | Link |
| --- | --- | --- | --- | --- | --- |
| **agent-rollback** | MIT | ✅ (`agent-rollback mcp`) | ✅ (`agent-rollback init codex`) | `curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh \| bash -s -- --all` | [github.com/Nainish-Rai/agent-rollback](https://github.com/Nainish-Rai/agent-rollback) |
| **Codex Revert** (built-in) | OpenAI (proprietary) | n/a | n/a — built into `codex` | ships with `codex` | [developers.openai.com/codex/cli](https://developers.openai.com/codex/cli) |
| **Claude Code `/rewind`** | Anthropic (proprietary) | n/a | n/a — built into `claude` | ships with `claude` | [code.claude.com/docs/en/checkpointing](https://code.claude.com/docs/en/checkpointing) |
| **Git worktrees** | GPL v2 (git) | n/a | n/a | ships with `git` | [git-scm.com/docs/git-worktree](https://git-scm.com/docs/git-worktree) |

## What each one actually does

### agent-rollback (the subject of this blog)

A CLI, an MCP server, and a Codex hook. Captures content-addressed
snapshots of the working tree, dedupes them by SHA-256, and lets you
restore in one command. Pairs with Codex, Claude Code, Cursor,
Windsurf, Copilot, Cline, and any MCP-compatible agent.

**Strengths**

- **Workspace-scoped, not commit-scoped.** Works on a dirty tree, on
  untracked files, on files the agent created. No commit required.
- **Content-addressed dedupe.** 50 checkpoints of a 20k-file repo
  typically cost under 5 MB.
- **MCP server.** The agent can call `create_checkpoint`,
  `restore_checkpoint`, `undo`, etc. Restore is dry-run by default
  and requires `force: true` to mutate files.
- **Operation log.** Every revert records which files it touched.
  `op revert <op-id>` rolls back *just* those files and leaves
  later unrelated edits in place. No other tool in this comparison
  does this.
- **Cross-agent.** Same CLI works in any repo with any agent.
- **Pinned checkpoints survive GC.** `pin <cp-id> "v0.4 release"` and
  the snapshot is immune to `prune`.

**Weaknesses**

- The natural-language interface is Codex-MCP-aware; for non-MCP
  agents the CLI is the fallback.
- No IDE diff UI yet — the `tui` and `diff` subcommands are
  terminal-only.
- Restore is file-content atomic per file, not a full-workspace
  transaction.

**Best for:** developers who want a checkpoint store that any
agent can call, that doesn't pollute git history, and that survives
between sessions.

### Codex Revert (the official slash command)

The Codex CLI ships with an experimental slash command that reverts
the last assistant turn. It is the closest thing to a built-in
"undo" Codex has.

**Strengths**

- Ships with Codex. No install.
- Works on the assistant turn as a whole — fast for the common
  "Codex just generated 12 lines, I want to back out" case.

**Weaknesses**

- **It is not a multi-file workspace checkpoint.** It rolls back
  the last turn. If Codex took two turns to refactor a module, a
  single `/revert` will not get you to the pre-refactor state.
- **It does not work for the pre-commit window.** If Codex edited
  files outside of its normal turn boundary (or if you ran
  `codex exec` non-interactively), `/revert` is not a recovery
  tool.
- **It is tied to a single session.** There is no export, no
  cross-session restore, no "go back to the pre-Codex state from
  yesterday."
- **It is still labeled experimental** in the upstream docs and
  feature requests (#6449, #2788, #11626) document the gaps the
  community wants filled.

**Best for:** quick in-session "that last response was wrong" recovery
when you are actively chatting with Codex.

### Claude Code `/rewind` (Anthropic's checkpointing)

Anthropic's Claude Code ships with a prompt-indexed checkpoint system
accessible via `/rewind` or `Esc Esc`. The documentation is explicit
that this is a Claude Code feature, not a portable layer.

**Strengths**

- **Decoupled restore modes.** Claude Code uniquely offers three:
  restore code only, restore conversation only, or restore both.
  Useful if you want to keep the conversation context but throw
  away the file changes.
- **30 days of history** by default (configurable).
- **Prompt-indexed timeline.** Users think in terms of "before I
  asked about the auth refactor," and the menu matches.

**Weaknesses**

- **Session-scoped only.** Checkpoints do not survive between
  sessions or across different Claude Code installations.
- **Tracks only files edited by Claude's tools.** Files modified by
  bash commands (`rm`, `git checkout`, `mv`) are invisible to the
  checkpoint system. If your workflow involves terminal-driven
  state changes, this is a blind spot.
- **30-day auto-cleanup is a timer-based data-loss risk.** Long
  recovery windows are impossible without external git commits.
- **No MCP, no cross-agent.** Claude Code only. It does not work
  with Codex.
- **No operation-level undo.** Restore is per-checkpoint, not
  per-operation.

**Best for:** Claude Code users who want prompt-indexed time travel
and decoupled code/conversation restore, and who do not run bash
between agent turns.

### Git worktrees (the always-available answer)

`git worktree add ../project-fix main` creates a parallel working
directory on a new branch. It is the only tool in this comparison
that has been around for 20 years.

**Strengths**

- **No new dependency.** Ships with every git install since 2.5
  (2015).
- **True isolation.** A worktree is a real branch with a real
  working tree. You can `rm -rf` the whole thing and your main
  checkout is untouched.
- **Long history.** Worktrees do not auto-expire.

**Weaknesses**

- **It is a branch, not a checkpoint.** Two worktrees of the same
  repo can drift in opposite directions; that is the *point*, but
  it is not "undo."
- **It does not help inside a single worktree.** If Codex
  refactored 12 files in `/project`, a worktree does not give you
  a one-command restore to the pre-Codex state of `/project`.
- **It does not know about agent prompts.** There is no
  "before I asked Codex to refactor the auth module" marker on a
  worktree.
- **It does pollute your real git history** if you commit the
  worktree, or sit on it forever if you do not.
- **It does not integrate with the agent.** Codex does not know
  that worktrees exist; you have to manage them yourself.

**Best for:** "I want to try a big agent-driven refactor on a side
branch and throw the whole thing away if I hate it." It is a
*containment* tool, not a *recovery* tool.

## When to use what

The honest answer is that these four tools are not interchangeable.
They sit at different points in the workflow:

```text
┌──────────────────────────────────────────────────────────────────┐
│  Pre-work          In-work              Post-work               │
│                                                                  │
│  git worktree ──►  Codex /revert ──►    git commit              │
│  (containment)     (last turn)          (durable history)        │
│                                                                  │
│  agent-rollback ──►  /rewind (Claude) ──► agent-rollback pin     │
│  checkpoint        code/conv           (mark known-good)         │
│  (recovery)        decoupling                                     │
└──────────────────────────────────────────────────────────────────┘
```

A robust workflow for Codex CLI in 2026 looks like:

1. **Before risky work**: `agent-rollback checkpoint "green"` — cheap,
   instant, no commit required.
2. **Inside the session**: use Codex's `/revert` for the "wrong
   response" case.
3. **After the run**: if it looks good, `git add -p && git commit` as
   normal. If it looks bad, `agent-rollback revert <cp-id> --force --yes`.
4. **For long experiments**: open a worktree
   (`git worktree add ../sandbox`) and let Codex go wild. Throw the
   whole worktree away with `git worktree remove --force` if it
   spirals.

You do not need all four. Most people need two: a recovery tool
(`agent-rollback`) and durable history (`git`). Add the others when
the use case shows up.

## What is missing from this comparison?

Two real categories I am leaving out, intentionally:

- **Cline (shadow git)** — Cline's checkpointing is real and works
  well *inside the Cline IDE extension*. It is git-based, it is
  workspace-level, and it has an in-IDE diff UI. But it is bound to
  Cline; it does not help Codex CLI users. If you are choosing
  between agents, Cline's shadow git is the closest competitor to
  agent-rollback's "workspace coverage" claim — but it is an agent,
  not a recovery layer.
- **OpenCode + witlox/opencode-checkpoint plugin** — the
  third-party plugin adds named checkpoints to OpenCode, but it
  stores them in a project-local JSON file (no dedupe, no
  content-addressing) and is maintained by a single contributor
  outside the OpenCode core team.

Both are real, both are useful, both are out of scope for a
*Codex* CLI comparison.

## FAQ — codex checkpoint and rollback

### Is there a built-in undo in Codex CLI?

Not for the multi-file case. The `/revert` slash command rolls back
the last assistant turn, and the file-level "Undo" button Codex shows
in the TUI stages changes into git (a behavior the community has
flagged as risky in `openai/codex#5082`). For workspace-level
recovery you need an external tool. `agent-rollback` is the
purpose-built option.

### What is the difference between a checkpoint and a commit?

A commit is a durable, immutable, content-tracked event in your
version-control history. A checkpoint is an ephemeral, named
snapshot of a workspace state, used for recovery. You can have
hundreds of checkpoints per commit. Most people use `agent-rollback`
checkpoints for in-progress work and `git commit` for work that has
passed review.

### Can I use both git worktrees and agent-rollback at the same time?

Yes. They solve different problems. Worktrees give you a parallel
checkout for big experiments; checkpoints give you fine-grained
recovery *inside* a single checkout. The recommended pattern is
worktree for "let Codex try a big rewrite" and checkpoint for "let
Codex edit three files in place."

### Does Codex checkpoint work without git?

`agent-rollback` works in any directory. The scanner uses
`git ls-files` when a git repo is present and falls back to a
filesystem walk otherwise. The store is never git-based; the
content-addressed `.agent-rollback/objects/` directory is yours
and is independent of any version control.

### Is Codex revert the same as agent-rollback revert?

No. Codex's `/revert` is a slash command that rolls back the last
assistant turn. `agent-rollback revert` is a CLI that restores the
workspace to any named checkpoint. They are different operations on
different objects.

### What about `git stash`?

`git stash` requires a clean working tree or a commit to stash
from. Codex's pre-commit workflow is *not* a clean working tree.
A checkpoint does not have that requirement.

## Conclusion

There is no "best" tool. There is the right tool for the gap you
actually have:

- **Need a session-aware, cross-agent, content-addressed recovery
  layer?** `agent-rollback`.
- **Need to roll back the last Codex turn in-chat?** Codex `/revert`.
- **Need prompt-indexed time travel inside Claude Code with
  decoupled code/conversation restore?** Claude Code `/rewind`.
- **Need to isolate a big agent experiment on a side branch?** Git
  worktrees.

If you have not picked a recovery tool yet and you are using Codex
CLI for real work, start with `agent-rollback`. It is the only one
in this list that covers the pre-commit window where Codex actually
lives.

```bash
curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash -s -- --all
```

- Repo: <https://github.com/Nainish-Rai/agent-rollback>
- npm: <https://www.npmjs.com/package/agent-rollback>
- 30-second start: <https://github.com/Nainish-Rai/agent-rollback#30-second-start>
