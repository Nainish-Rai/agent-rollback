# Reddit Launch Posts

## Platform Notes

Tone: honest, humble, feedback-first. Read each subreddit rule before posting. Do not post the same copy to multiple subreddits on the same day.

Candidate subreddits:

- r/SideProject
- r/indiehackers
- r/programming
- r/LocalLLaMA, only if the discussion is agent workflow specific and allowed
- r/coding

## Post 1: r/SideProject Feedback

Title:

```text
Introducing Agent Rollback - an open-source checkpoint tool for Codex changes
```

Body:

```markdown
Introducing Agent Rollback - an open-source checkpoint/restore workflow for Codex.

**TL;DR**: checkpoint before risky edits, restore if Codex goes off track.

---

I use Codex a lot, and the failure mode that bothers me most is not "the code is bad."

It is:

- Codex touched more files than expected
- I had uncommitted local work
- editor undo does not map cleanly to the whole workspace
- Git only helps if I made the right commit/stash first
- now I'm manually reconstructing state

So I built a small checkpoint workflow around Codex edits.

The intended behavior:

1. Codex creates a checkpoint before risky work
2. Codex edits files
3. I inspect what changed
4. If it drifted, I restore the checkpoint

I'm not claiming this solves AI coding safety. I'm trying to make one annoying failure mode less expensive.

What I'd like feedback on:

- Would you trust a tool like this in a real repo?
- Should checkpointing be automatic before every tool write, or only before risky tasks?
- What would make restore feel unsafe?
- Is this better as an MCP server, CLI, or editor feature?

Happy to answer questions, and I'd especially like to hear your worst Codex undo story.
```

## Post 2: r/programming Discussion

Title:

```text
What should undo look like for Codex?
```

Body:

```markdown
**TL;DR**: I'm exploring local checkpoints for Codex and want opinions on the right semantics.

---

Traditional undo feels underdefined once Codex is involved.

Codex can:

- edit multiple files
- create new files
- run formatters
- trigger codegen
- touch untracked local work
- continue across several conversation turns

So when a user says "undo what Codex did," what should happen?

Options I'm considering:

1. Restore the full workspace to a named checkpoint
2. Restore only files attributed to the agent
3. Offer a selective path-by-path restore
4. Snapshot at every tool call
5. Snapshot only when the agent marks a task as risky

My current prototype favors named checkpoints because they are easy to reason about. But I can see selective restore being important when human and Codex edits are interleaved.

If you use Codex in a real codebase, how are you handling this today?
```

## Post 3: r/indiehackers Build-in-Public

Title:

```text
I'm positioning my devtool around one pain: Codex needs undo before developers trust it
```

Body:

```markdown
**TL;DR**: Building Agent Rollback as "checkpoints for Codex." Looking for positioning feedback, not just technical feedback.

---

The pain point:

Developers want the speed of Codex, but they get nervous when Codex starts changing multiple files and there is no clean way back.

The positioning I'm testing:

> Codex does not need blind trust. It needs rollback.

The workflow:

- checkpoint before risky work
- inspect changed paths
- restore if the agent goes out of scope

I'm deliberately avoiding big claims like "safe autonomous coding." That sounds too broad and not very believable. The sharper promise is: make bad Codex edits recoverable.

Questions:

- Is "Ctrl-Z for Codex" clear or too cute?
- Would you lead with "no undo in Codex" or with broader "agent rollback" positioning?
- Is the buyer/user an individual developer, team lead, or AI-tool builder?
- What proof would make this trustworthy?

I'm collecting blunt feedback before pushing harder on launch channels.
```

## Post 4: Lessons Learned Follow-up

Title:

```text
What I learned asking developers about undo for Codex
```

Body:

```markdown
**TL;DR**: Developers seem less worried about "AI made bad code" and more worried about "AI changed local state in ways I cannot easily recover."

---

After testing the Agent Rollback positioning, the most useful feedback has been around trust.

People do not want another tool claiming agents are safe.

They want:

- visible diffs
- boring restore semantics
- no fake magic
- compatibility with Git
- clear handling of untracked files
- a recovery path before risky multi-file changes

The biggest objection is also fair:

"Why not just use Git?"

My current answer: you should. This is for the pre-commit window where the agent is still exploring and you have not decided the work deserves a commit.

Curious if others see the same gap, or if your Git workflow already covers this well enough.
```
