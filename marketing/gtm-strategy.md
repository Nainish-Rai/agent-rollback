# Agent Rollback GTM Strategy

## Context

The core pain point is simple: developers get stuck when Codex does something stupid across a local workspace. Git is excellent after commits. Agent Rollback targets the messy pre-commit window where Codex edits fast and humans need recovery.

## Decision

Position Agent Rollback as **"open-source checkpointing for Codex"** and sell the behavior change, not just the tool:

> Before Codex does something risky, it creates a checkpoint. If Codex goes off track, restore instead of manually untangling the diff.

## Audience

- Developers using Codex for real local code changes.
- AI tool builders who need safer autonomous workflows.
- Engineering leads evaluating AI coding in serious codebases.
- Open-source maintainers worried about generated changes crossing scope.

## Offer Design

Current score: 8/10.

The pain is urgent and specific. The promise is clear. The missing pieces are public proof, packaged install docs, and testimonials from real agent failures.

Value equation:

| Lever | Messaging |
| --- | --- |
| Dream outcome | "Use Codex without fearing irreversible local damage." |
| Likelihood | "Checkpoints, diffs, manifests, and restore tools prove the recovery path." |
| Time delay | "Create a checkpoint in seconds before risky edits." |
| Effort | "Give Codex one instruction: checkpoint before risky work." |

Risk reversal:

- "Try it on a throwaway branch."
- "Break something on purpose, restore it, then decide if it belongs in your workflow."
- "No fabricated promise of perfect safety. It gives you a recovery layer."

Ethical persuasion matrix:

| Principle | Evidence | Allowed claim |
| --- | --- | --- |
| Authority | Concrete MCP-style tools: checkpoint, diff, restore, undo | "Built around explicit recovery primitives." |
| Social proof | Not yet verified | Do not claim user counts, stars, or production adoption. Ask for testers instead. |
| Reciprocity | Publish scripts, scenarios, and failure templates | "Use this experiment even if you do not adopt the tool." |
| Commitment | Ask users to run one checkpoint experiment | "Try one risky-agent workflow and report what happened." |
| Scarcity | None | Do not fake urgency. Use time-boxed feedback windows only if real. |

## STEPPS Virality Plan

| STEPPS | Execution |
| --- | --- |
| Social Currency | Let users share "Codex horror story -> recovered in one command" posts. |
| Triggers | Tie content to daily Codex moments: before refactor, before migration, before codegen. |
| Emotion | Use controlled anxiety: "What happens when your agent touches the wrong file?" |
| Public | Encourage screenshots of checkpoint logs and before/after diffs. |
| Practical Value | Provide exact prompts, workflows, and restore scenarios. |
| Stories | Anchor every post in the same narrative: Codex made a bad change, checkpoint saved the session. |

Virality score: 8/10. To reach 10/10, collect public recovery screenshots, short demo clips, and community quotes.

## Posting Schedule

Run this as a 3-week launch experiment.

| Day | Platform | Asset | Goal |
| --- | --- | --- | --- |
| Monday, Week 1 | X | Intro post, Post 2 | Codex pain-point awareness and replies |
| Tuesday, Week 1 | LinkedIn | Intro post | Professional credibility |
| Wednesday, Week 1 | Hacker News | Show HN | Technical feedback |
| Thursday, Week 1 | Reddit | r/SideProject or r/indiehackers feedback post | Honest builder feedback |
| Friday, Week 1 | Dev.to | Tutorial post | Practical education |
| Monday, Week 2 | X | Post 3, Post 4 | Experiments and comparisons |
| Tuesday, Week 2 | LinkedIn | Post 2 | Team/process angle |
| Wednesday, Week 2 | Reddit | r/programming discussion if rules allow | Technical debate |
| Thursday, Week 2 | Medium | Story article | Narrative depth |
| Friday, Week 2 | Product Hunt | Launch page | Public launch |
| Monday, Week 3 | X | Post 5, Post 6 | Feedback loop and demo clip |
| Tuesday, Week 3 | LinkedIn | Post 3 | Lessons learned |
| Wednesday, Week 3 | Hacker News | Technical article, not duplicate Show HN | Architecture discussion |
| Thursday, Week 3 | Dev.to | Follow-up tutorial | Use-case expansion |
| Friday, Week 3 | Reddit | Lessons learned post | Community recap |

## Demo Scenarios

Use these scripts for screenshots, short videos, and comments.

### Scenario 1: The Bad Refactor

```text
1. Create checkpoint: before-refactor.
2. Ask agent to refactor one file.
3. Let it touch an unrelated file.
4. Show checkpoint diff.
5. Restore checkpoint.
6. Ask: "Would you trust agents more if this was automatic?"
```

### Scenario 2: The No-Undo Codex Moment

```text
1. Start with uncommitted local work.
2. Ask Codex to make a multi-file change.
3. Reject the result.
4. Show manual cleanup pain.
5. Repeat with Agent Rollback checkpoint.
6. Restore in one step.
```

### Scenario 3: The Migration Safety Net

```text
1. Checkpoint before generated migration.
2. Run the agent.
3. Inspect generated files.
4. Restore if scope is too broad.
5. Keep only the version that passes review.
```

### Scenario 4: The Skeptic Test

```text
1. Invite a skeptical developer to intentionally break a toy repo.
2. Ask them to restore from checkpoint.
3. Record what felt trustworthy and what felt scary.
4. Publish the critique.
```

## Engagement Prompts

- "What is the worst thing an AI agent has done to your repo?"
- "Do you checkpoint before letting agents do multi-file edits?"
- "Would you rather have smarter agents or better rollback?"
- "What would make you trust Codex with multi-file edits in a real codebase?"
- "Where should checkpointing live: editor, CLI, MCP server, or Git layer?"

## Comment Response Playbook

Skeptic: "Why not just use Git?"

Response:

```text
Git is still the durable history layer. This is for the messy pre-commit window: untracked files, local drafts, generated edits, and agent steps that happen before you know whether the change deserves a commit.
```

Skeptic: "This sounds dangerous."

Response:

```text
Agreed. The point is not to make agents magically safe. It is to make risky agent actions recoverable and visible enough that humans can reject bad work quickly.
```

Skeptic: "My editor already has undo."

Response:

```text
Editor undo is fine for a single buffer. Agent changes often span files, tools, and generated artifacts. The question is whether you can restore a named workspace state after the agent has moved across the repo.
```

Supporter: "I need this."

Response:

```text
The best test is to run it on a real agent mistake. Create a checkpoint, ask the agent for a risky multi-file task, inspect the diff, restore, and tell us where the flow felt weak.
```

## Measurement

Track:

- GitHub stars and forks
- README click-through from social posts
- comments mentioning "Git", "undo", "checkpoint", "Codex", "MCP"
- number of real failure stories submitted
- number of install attempts or MCP integration questions
- HN/Reddit objections that become README improvements

## Risks

- Overclaiming safety. Fix by saying "recovery layer," not "agent safety solved."
- Looking like a Git replacement. Fix by contrasting pre-commit checkpointing with committed version history.
- Community backlash against AI hype. Fix by leading with concrete failure modes and limitations.
- Weak proof. Fix by collecting reproducible demo scenarios and user recovery stories.

## Assumptions

- The repo is being marketed as an Agent Rollback / Codex checkpointing tool.
- The initial best audience is developers already using Codex for multi-file edits.
- Public proof is not available yet, so posts ask for feedback instead of claiming traction.
