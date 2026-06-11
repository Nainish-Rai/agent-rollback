# Dev.to Launch Posts

## Platform Notes

Tone: practical, helpful, beginner-friendly. Avoid pure promotion. Include runnable scenarios and common issues.

## Post 1: Tutorial

```markdown
---
title: Introducing Agent Rollback - Open-Source Checkpoints for Codex
published: false
description: A practical workflow for recovering when Codex changes the wrong files.
tags: ai, productivity, tutorial, devtools
---

## What We're Building

Introducing Agent Rollback - an open-source checkpoint layer for Codex.

We are building a safer workflow for Codex:

1. Create a checkpoint before risky work
2. Let Codex edit
3. Inspect changed paths
4. Restore if the result is wrong

This is useful when Codex touches more files than expected or changes local work you were not ready to lose.

## Why Git Alone Is Not Always Enough

Git is still the durable history layer.

But Codex work often happens before a clean commit exists:

- untracked files
- generated artifacts
- local drafts
- half-reviewed refactors
- multi-file tool changes

That pre-commit window needs a recovery habit.

## The Agent Instruction

Add this to your Codex instructions:

```text
Before risky edits, create a checkpoint.
After edits, summarize changed paths.
If the result is wrong or too broad, restore the checkpoint instead of manually guessing how to revert.
```

## A Simple Scenario

```text
1. Checkpoint: before-refactor
2. Codex refactors src/main.py
3. Codex accidentally changes unrelated config
4. You inspect the diff
5. Restore before-refactor
```

## What This Changes

Without checkpoints, a bad Codex edit creates cleanup work.

With checkpoints, you can reject the whole attempt and start again.

That makes it easier to let Codex try risky work without trusting every generated edit.

## Common Issues

**Problem**: "Why not just commit before every agent task?"

**Solution**: You can. But checkpoints are lighter for exploratory work and can include untracked local state depending on your setup.

**Problem**: "What if restore removes work I wanted?"

**Solution**: Inspect the checkpoint diff first. For serious use, selective restore should be part of the workflow.

**Problem**: "Does this make agents safe?"

**Solution**: No. It makes some bad actions recoverable. That is still valuable.

## What We Learned

- Codex safety is partly a recovery problem
- Checkpoints are easiest to understand when named
- Restore should be explicit and reviewable
- The best workflow is boring

Questions? Drop a comment with your worst Codex undo story. I'm using real failure modes to improve the workflow.
```

## Post 2: Practical Guide

```markdown
---
title: The Codex Rollback Checklist I Wish I Had Earlier
published: false
description: A short checklist for avoiding painful cleanup after Codex edits your workspace.
tags: ai, beginners, git, productivity
---

## The Checklist

Before asking Codex to do risky work:

- Is my current workspace worth preserving?
- Are there untracked files?
- Could this task touch more than one file?
- Would I be annoyed if I had to manually undo it?
- Did I create a checkpoint?

If the answer to the fourth question is yes, create the checkpoint.

## Risky Agent Tasks

Checkpoint before:

- refactors
- migrations
- dependency upgrades
- codegen
- formatter runs
- search-and-replace
- "cleanup" tasks

These tasks are useful, but they can spread.

## The Prompt

Use this:

```text
Create a checkpoint before making changes. Keep the edit scoped. Afterward, list every changed path. If the change crosses scope, restore the checkpoint.
```

## Why This Helps

The checkpoint changes the emotional cost of experimenting.

You can let the agent try, review the result, and reject the whole attempt if needed.

That is much better than manually untangling five files.

## Next Steps

Try this on a toy repo first. Then try it on a real workflow where you normally feel nervous letting the agent touch files.

If you find a case where checkpointing fails or feels unsafe, share it. Those edge cases matter.
```

## Post 3: Comparison

```markdown
---
title: Git vs Editor Undo vs Agent Rollback for Codex
published: false
description: Understanding which recovery tool fits each part of a Codex workflow.
tags: git, ai, devtools, productivity
---

## The Short Version

Use all three:

- Git for durable history
- Editor undo for one buffer
- Agent rollback for pre-commit multi-file workspace recovery

## Why This Distinction Matters

Codex does not always operate like a human editing one file.

They can touch multiple files, generate new files, run commands, and continue through several steps. If the output is wrong, "undo" needs to mean more than reversing the last keystroke.

## Comparison

| Tool | Best for | Weakness |
| --- | --- | --- |
| Git | committed history | manual setup before exploratory work |
| Editor undo | current buffer | weak for multi-file agent changes |
| Agent rollback | named workspace states | needs careful restore semantics |

## A Good Workflow

```text
1. Use Git for real versions.
2. Use checkpoints before risky agent actions.
3. Use diffs to review what happened.
4. Restore when the agent crosses scope.
5. Commit only the result you trust.
```

## Final Thought

The goal is not to avoid all bad agent output.

The goal is to make bad output cheap to reject.
```
