---
name: Bug report
about: Report a bug in agent-rollback (CLI, MCP server, or Codex hook)
title: "[bug] "
labels: ["bug"]
assignees: []
---

## Describe the bug

A clear and concise description of what the bug is.

## Reproduction

```bash
# minimal steps to reproduce
agent-rollback init
agent-rollback checkpoint "test"
# ...
```

## Expected behavior

What you expected to happen.

## Actual behavior

What actually happened. Include any error output.

## Environment

- agent-rollback version: `agent-rollback --version` (or `npm list -g agent-rollback`)
- Node.js version: `node --version`
- OS: macOS / Linux / WSL — which?
- Codex CLI version (if relevant): `codex --version`

## Additional context

Add any other context (screenshots, terminal recordings, related
issues, etc.) here.
