# Medium Article Drafts

## Platform Notes

Tone: narrative, thoughtful, story-led. Use one strong idea per article. Add screenshots or terminal snippets where possible.

## Article 1

Title:

```text
Introducing Agent Rollback - An Open-Source Checkpoint Layer for Codex
```

Subtitle:

```text
Codex can move fast across your repo. The missing habit is a checkpoint before it does.
```

Draft:

```markdown
Introducing Agent Rollback - an open-source checkpoint layer for Codex.

Codex did exactly what I asked.

That was the problem.

It made the change, touched a few files, cleaned up something nearby, and moved on with the confidence of a tool that does not know what a local draft feels like. Nothing dramatic happened. No production outage. No catastrophic deletion. Just the quiet realization that I no longer trusted the state of my own workspace.

That is the part of AI coding we do not talk about enough.

The obvious debate is about intelligence. Which model writes better code? Which Codex mode plans better? Which editor has the best autocomplete?

But the daily pain is often more mundane:

Can I get back to where I was?

## Git Is Not The Whole Answer

Git is excellent. I am not interested in replacing it.

But Git is strongest when you have already decided something is worth preserving. Codex work often happens before that moment. It lives in the experimental space: untracked files, local drafts, generated artifacts, half-reviewed diffs, and commands run because Codex thought they were helpful.

Editor undo is not the whole answer either. It works well inside a buffer. Agents do not stay inside one buffer.

The gap is the pre-commit workspace.

## The Behavior Change

The behavior I want from Codex is simple:

Before doing something risky, create a checkpoint.

After the edit, show me what changed.

If the work crossed scope, restore the checkpoint.

That is it. No grand promise that Codex is safe. No claim that models will stop making mistakes. Just a recovery layer for the mistakes we already know will happen.

## Why This Matters More As Agents Improve

Weak agents fail loudly.

Strong agents fail productively.

They make plausible edits. They touch the right neighborhood. They solve part of the problem while quietly changing something they should have left alone. The better the agent gets, the more important it becomes to recover from the edge cases where it is confidently wrong.

Trust is not just a model quality problem.

Trust is a reversibility problem.

## The Experiment

Agent Rollback is my experiment in making this Codex workflow explicit.

It gives agents simple primitives: create a checkpoint, list checkpoints, diff checkpoints, restore a checkpoint, undo recent checkpoint steps.

The goal is not excitement. The goal is boredom.

The best recovery workflow should feel uneventful:

The agent tried something. It went wrong. You restored. You moved on.

## What I Want To Learn

I am looking for failure stories more than praise.

When did Codex make a change you could not easily undo? Was Git enough? Was editor undo enough? Did you stash, reset, manually patch, or give up and recreate work?

The future of AI coding will not be built only on smarter agents.

It will be built on safer ways to let them try.
```

## Article 2

Title:

```text
AI Coding Agents Do Not Need Blind Trust. They Need Rollback.
```

Subtitle:

```text
The practical path to agent adoption is not pretending mistakes disappear. It is making mistakes recoverable.
```

Draft:

```markdown
Every team adopting AI coding tools eventually faces the same uncomfortable question:

What happens when the agent is wrong?

Not wrong in a clean, obvious way. Wrong in the way that costs time. Wrong across five files. Wrong after touching local work. Wrong after a refactor that looked reasonable until someone noticed the scope had drifted.

The easy answer is "review the diff."

The better answer starts before the diff exists.

## The Pre-Commit Problem

Software teams already have good tools for committed history. They have branches, pull requests, CI, code review, and release controls.

Codex increasingly operates before all of that.

They work in the local workspace, where state is messy and partially formed. That is exactly where recovery is weakest.

If a human developer is about to do something risky, they often create a branch, stash, commit, copy a file, or pause to think.

Agents need an equivalent habit.

## Checkpoint First

The simplest habit is checkpointing.

Before a risky operation, capture the workspace. Then let the agent work. Then inspect the result. If the agent crossed scope, restore.

This turns agent adoption from a trust fall into a controlled experiment.

You are not saying, "I believe the agent will be right."

You are saying, "I can recover if it is wrong."

## Why This Is Different From Git

Git remains the system of record. It is the right place for durable decisions.

Checkpointing is for temporary uncertainty.

It is for the moment before a change deserves a commit. The moment when an agent is exploring, generating, editing, and possibly making a mess.

That distinction matters because teams do not need another version-control religion. They need a small recovery primitive in the workflow they already have.

## The Adoption Argument

If you manage engineers, this is the AI productivity conversation I would have first:

Can your team recover from bad agent changes quickly?

If not, the productivity gains will be uneven. Senior engineers will build their own habits. Junior engineers will be more exposed to confusing local state. Everyone will become more cautious after a few painful mistakes.

Rollback is not a glamorous feature.

It is the thing that makes experimentation cheap enough to repeat.

## The Ask

I am testing Agent Rollback around this idea: local checkpoints for Codex.

I want skeptical feedback:

- What should restore do by default?
- Should checkpoints happen automatically?
- How should untracked files be handled?
- Should this live in the editor, CLI, MCP layer, or Git itself?

Codex will keep getting faster.

The recovery path has to keep up.
```

## Article 3

Title:

```text
The Cheapest Way To Trust An AI Coding Agent Is To Make It Reversible
```

Subtitle:

```text
A practical argument for checkpoints, restore points, and boring recovery workflows.
```

Draft:

```markdown
The first time Codex saves you an hour, you want to use it everywhere.

The first time it quietly changes the wrong file, you become cautious again.

That tension is the real adoption curve for AI coding. Not demos. Not benchmarks. Not leaderboard screenshots. The real question is whether developers can let an agent try meaningful work without feeling like they are gambling with local state.

The cheapest way to increase that trust is not blind confidence.

It is reversibility.

## A Small Failure Is Still Expensive

Most bad Codex edits are not dramatic. They are annoying.

The agent refactors too broadly. It formats files you did not want touched. It changes a config nearby. It rewrites a helper while solving a different problem. None of this is catastrophic, but all of it creates review drag.

Now the developer has to stop building and start separating intended changes from accidental ones.

That is the hidden cost.

## The Checkpoint Habit

Humans already do this informally.

We create branches. We stash. We copy a file. We make a quick commit before a risky migration. We pause because we know the next step might be messy.

Agents should learn the same habit:

Checkpoint before risky work.

That one step changes the interaction. You are no longer hoping the agent stays perfect. You are giving yourself a clean escape path if it does not.

## What Good Recovery Looks Like

A good recovery workflow should be:

- visible
- local
- explicit
- fast
- boring

Visible means you can inspect what changed.

Local means you do not need to publish broken work to preserve state.

Explicit means restore is a conscious action, not a hidden magic trick.

Fast means you use it before frustration builds.

Boring means it becomes routine.

## Why I Am Building Around This

Agent Rollback is an experiment in making this recovery layer agent-callable.

Instead of asking developers to remember every defensive step, the agent gets tools for checkpoints, diffs, manifests, restore, and undo.

The long-term question is bigger than one tool:

Should every AI coding workflow have a checkpoint before autonomy?

My answer is yes.

Not because Codex is bad.

Because Codex is powerful enough that recovery must be part of the interface.

## The Open Question

Where should this live?

Maybe in the editor. Maybe in Git. Maybe as an MCP server. Maybe as a local daemon every agent can call.

I care less about the packaging than the behavior.

Before an agent does something risky, it should create a way back.
```
