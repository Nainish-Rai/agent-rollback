# X / Twitter Launch Posts

## Platform Notes

Tone: sharp, specific, slightly contrarian. No generic launch language. Use screenshots or 20-30 second clips where possible.

Best times: Monday-Thursday, 8-10 AM or 4-6 PM in the target audience timezone. Stay online for the first 30 minutes.

## Post 1: Introduction

```text
Introducing Agent Rollback - an open-source checkpoint layer for Codex.

The idea is simple:

Before Codex does something risky, it creates a checkpoint.

If Codex edits the wrong files, you restore instead of manually untangling the mess.
```

CTA reply:

```text
Git handles commits.
Editor undo handles buffers.
Agent Rollback handles the messy pre-commit Codex session.

What is the worst thing Codex has done to your repo?
```

Visual: before/after terminal screenshot showing checkpoint created, bad edit, restored baseline.

## Post 2: The Contrarian Take

```text
Unpopular opinion:

The next big Codex feature is not a smarter model.

It's undo that actually works across the files Codex touched.

Git handles commits.
Editor undo handles buffers.
Codex needs workspace checkpoints.
```

CTA reply:

```text
I'm building the experiment here: Agent Rollback.

Would you use this as an MCP tool, editor feature, or CLI?
```

## Post 3: The Experiment

```text
Try this experiment:

1. Create a checkpoint
2. Ask Codex for a risky refactor
3. Inspect the changed paths
4. Restore the checkpoint

If that flow feels boring, it's working.

Codex recovery should feel boring.
```

CTA reply:

```text
Looking for people to run this on real Codex mistakes and tell me where it breaks.
```

## Post 4: The Codex Angle

```text
The scary Codex moment is not when it fails.

It's when it succeeds at the wrong task:

- refactors too much
- edits unrelated files
- overwrites a local draft
- "cleans up" code you needed

Agent Rollback is the missing checkpoint before that moment.
```

CTA reply:

```text
Not a Git replacement. More like Cmd+Z for the pre-commit Codex mess.
```

## Post 5: The Comparison

```text
Git: great after you commit.

Editor undo: great inside one buffer.

Codex changes files, runs tools, generates artifacts, and keeps moving.

That needs a different recovery primitive:

named workspace checkpoints.
```

CTA reply:

```text
If you use Codex daily, I want your blunt feedback on this workflow.
```

## Post 6: The Feedback Loop

```text
I don't want Codex to be "trusted."

I want it to be recoverable.

Trust comes after:

- checkpoint before risky work
- visible diff after edits
- one-step restore when scope drifts

That's the Agent Rollback bet.
```

CTA reply:

```text
Reply with the Codex workflow you'd checkpoint first. I'll turn the best ones into demo scenarios.
```
