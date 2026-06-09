# Agent Instructions

## Project Shape

- `bin/agent-rollback.js` is the executable entry point.
- `src/cli.js` owns command parsing and user-facing output.
- `src/snapshot.js` owns checkpoint creation, diffing, listing, and restore.
- `src/workspace.js` owns workspace file discovery and path safety.
- `src/runner.js` owns the `codex exec` wrapper behavior.
- `test/*.test.js` uses Node's built-in test runner.

## Commands

Run before committing:

```bash
npm test
npm run check
```

## Engineering Rules

- Keep runtime dependencies at zero unless a dependency clearly removes more risk
  than it adds.
- Prefer small, focused functions with clear names.
- Do not add undocumented Codex hook assumptions without linking to official
  OpenAI docs or a stable upstream source.
- Storage changes need integration tests that create, mutate, diff, and restore a
  temporary workspace.
- Preserve content-addressed object storage unless replacing it with a simpler
  tested design.
