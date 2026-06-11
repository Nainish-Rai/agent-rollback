# LinkedIn Launch Posts

## Platform Notes

Tone: professional, direct, lesson-led. Do not put links in the main post. Add the link in the first comment.

Best times: Tuesday-Thursday, 7-9 AM or noon. Engage for one hour after posting.

## Post 1: Introduction

```text
Introducing Agent Rollback - an open-source checkpoint layer for Codex.

The pain is specific:

Codex can make a change that looks small in the chat but spans files, generated artifacts, and uncommitted work. By the time you notice scope drift, you are no longer reviewing code. You are reconstructing your workspace.

The behavior I want Codex to learn:

- checkpoint before risky edits
- show changed paths after edits
- restore when scope drifts
- never make rollback a human archaeology task

That is the idea behind Agent Rollback.

It is not a replacement for Git. Git is durable history. This is a recovery layer for the messy pre-commit window where Codex operates.

Question for teams adopting Codex:

Do you already have a rollback habit for Codex-generated changes, or are you relying on manual diff cleanup?

#Codex #DeveloperTools #SoftwareEngineering #MCP
```

First comment:

```text
Link to the repo/demo goes here. I'm especially looking for failure stories from real Codex workflows.
```

## Post 2: Team Adoption Angle

```text
If I were rolling out Codex to an engineering team, I would not start with productivity metrics.

I would start with reversibility.

Before asking "how much faster are we shipping?", I would ask:

- Can we see exactly what Codex changed?
- Can we restore the workspace if the change crosses scope?
- Can Codex checkpoint before migrations, refactors, and codegen?
- Can a junior engineer recover safely without knowing every touched file?

Speed without rollback creates fear.

Rollback creates room to experiment.

Agent Rollback is my attempt to make that workflow explicit: local checkpoints, diffs, manifests, and restore tools that Codex can use before risky work.

What would your team require before trusting Codex with multi-file edits?

#EngineeringLeadership #Codex #DevTools #SoftwareTeams
```

## Post 3: Builder Story

```text
I watched Codex make a tiny change, then had to ask a very human question:

"Can I get back to where I was?"

That question should not be hard.

Codex is increasingly good at generating code. But the recovery workflow around it still feels underbuilt. Git helps when work is committed. Editor undo helps in one buffer. Codex work often happens between those layers.

That is why I am exploring checkpointing as a default Codex behavior.

The workflow:

1. Create checkpoint before risky work
2. Let Codex operate
3. Inspect changed paths
4. Restore if the result is wrong

Simple. Boring. Necessary.

I'm looking for developers using Codex on real repos:

What was your last "I wish I had undo for this Codex session" moment?

#Codex #DeveloperExperience #OpenSource #Engineering
```

## Post 4: Skeptical Audience

```text
"Why not just use Git?"

That is the right first objection to Agent Rollback.

My answer: use Git. Always.

But Git is not optimized for every moment in a Codex session:

- untracked files
- generated scratch work
- local drafts
- half-reviewed Codex edits
- multi-step tool changes before a commit exists

Agent Rollback is for that pre-commit mess.

It gives Codex a safer operating habit: checkpoint first, then act.

I do not think this solves AI coding safety. I think it makes one failure mode less expensive.

Where do you think this should live: Git extension, editor feature, CLI, or MCP server?

#Git #Codex #DeveloperTools #MCP
```
