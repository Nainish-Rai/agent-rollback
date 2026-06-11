# Product Hunt Launch Assets

## Platform Notes

Product Hunt is not covered by the media-writer platform references, but it belongs in the GTM mix for developer-tool visibility. Keep it concrete, visual, and feedback-oriented.

## Tagline Options

```text
Open-source checkpoints for Codex
```

```text
Undo bad Codex edits before they become your problem
```

```text
Local rollback for Codex sessions
```

## Short Description

```text
Agent Rollback gives Codex a checkpoint habit: snapshot before risky edits, inspect changed paths, and restore when Codex goes off track.
```

## Maker Comment

```markdown
Introducing Agent Rollback - an open-source checkpoint layer for Codex.

Hey Product Hunt,

I built it around a very specific developer pain:

Codex can move fast across a local workspace, but recovery is still awkward when it touches the wrong files.

Git is great once a change deserves a commit. Editor undo is fine inside one buffer. Agent work often happens in the messy pre-commit space between those layers.

Agent Rollback gives Codex simple recovery primitives:

- create a checkpoint
- inspect checkpoint metadata
- diff checkpoint states
- restore a named checkpoint
- undo recent checkpoint steps

The intended workflow is boring:

1. Checkpoint before risky work
2. Let Codex edit
3. Review changed paths
4. Restore if it went too far

I am not claiming this makes Codex magically safe. I am trying to make bad Codex edits cheaper to reject.

I'd love feedback from people using Codex:

What would make you trust a rollback tool in your real workspace?
```

## Launch Day Update 1

```markdown
Launch experiment for today:

If you use Codex, try this mental model:

Do not ask, "Can I trust Codex?"

Ask, "Can I recover if Codex is wrong?"

Agent Rollback is built around that second question. Would love feedback on whether checkpointing belongs in the editor, CLI, MCP layer, or Git workflow.
```

## Launch Day Update 2

```markdown
The most useful objection so far is: "Why not just use Git?"

My current answer:

Use Git for durable history. Use checkpoints for the messy pre-commit space where an agent is exploring, changing files, and you have not decided the work deserves a commit.

Curious if that distinction matches how you work.
```

## Launch Day Update 3

```markdown
Question for people using Codex:

What should "undo Codex's last change" actually mean?

- restore the whole workspace
- restore only Codex-touched files
- selective path restore
- conversation-turn rollback
- something else

This is the design question I care about most.
```

## Gallery Script

Slide 1:

```text
Codex changed the wrong files.
Now what?
```

Slide 2:

```text
Checkpoint before risky edits.
```

Slide 3:

```text
Inspect what changed.
```

Slide 4:

```text
Restore the known-good workspace.
```

Slide 5:

```text
Agent Rollback: recovery primitives for Codex workflows.
```

## Product Hunt Comments To Seed

```text
What is the worst Codex change you had to manually undo?
```

```text
Should checkpointing happen automatically, or only when the agent marks a task risky?
```

```text
Would you want this in your editor, terminal, MCP server, or Git workflow?
```
