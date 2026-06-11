# Hacker News Launch Posts

## Platform Notes

Tone: factual, plain, non-hype. Submit once as Show HN, then engage. Do not cross-post the same copy repeatedly.

## Post 1: Show HN

Title:

```text
Show HN: Agent Rollback - open-source checkpoints for Codex changes
```

URL:

```text
GitHub repo or demo URL
```

First comment:

```text
Introducing Agent Rollback - an open-source checkpoint layer for Codex.

Hi HN,

I built it because I kept running into a specific Codex workflow problem: Git is great once I have a commit, and editor undo is fine for one buffer, but Codex sessions often sit in the messy middle. Codex touches several files, maybe creates artifacts, maybe drifts outside scope, and then I want to get back to the last known-good workspace state.

The tool exposes a small set of checkpoint primitives:

- create_checkpoint
- list_checkpoints
- show_checkpoint
- diff_checkpoints
- restore_checkpoint
- undo

The intended Codex behavior is boring: before risky edits, create a checkpoint; after edits, show changed paths; if the result is wrong, restore.

This is not meant to replace Git. It is a recovery layer for pre-commit Codex work.

I would like feedback on three things:

1. Does this belong as an MCP server, editor feature, CLI, or Git-adjacent tool?
2. What failure modes would make you distrust this approach?
3. What metadata would you want captured before restoring a workspace?

Known limitation: I do not yet have broad public proof from real-world repos, so I am looking for testers and failure stories rather than claiming this is production-hardened.
```

## Post 2: Technical Discussion

Title:

```text
What should "undo" mean for Codex?
```

Body:

```text
Codex can change multiple files, run tools, generate artifacts, and keep context in a conversation. Traditional undo models do not map neatly onto that.

I am working on a small checkpointing tool for this problem and would like to understand how other people think about the model.

Possible semantics:

- restore the full workspace to a named checkpoint
- undo only files attributed to the agent
- allow selective restore by path
- preserve untracked files unless explicitly included
- tie restore points to conversation turns or tool calls

My current bias is that full named checkpoints are easiest to reason about, but selective restore may be safer for mixed human/agent work.

For people using Codex: what would you expect "undo Codex's last change" to do?
```

## Post 3: Lessons Learned

Title:

```text
Lessons from adding checkpointing to a Codex workflow
```

Body:

```text
I have been experimenting with local checkpoints around Codex edits. The main lesson so far is that the useful primitive is not "make the model safer"; it is "make bad actions recoverable."

The workflow that seems promising:

1. checkpoint before risky work
2. track provenance when possible
3. show changed paths after edits
4. restore by checkpoint ID when scope drifts

The design questions are less obvious:

- Should checkpointing be automatic or explicitly requested by the agent?
- Should restores require a force flag?
- Should the tool preserve unrelated untracked files?
- How much conversation metadata should be stored?
- How do you make restore safe enough that the recovery tool does not become another footgun?

I am curious how others are solving this. Are you using Git worktrees, manual commits, editor history, custom scripts, or something else?
```
