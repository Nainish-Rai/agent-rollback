# Contributing to agent-rollback

Thanks for your interest in `agent-rollback` — the undo button for OpenAI
Codex CLI. We welcome bug reports, feature requests, documentation
improvements, and code.

## Project shape

- `bin/agent-rollback.js` and `bin/arb.js` — CLI entry points
- `src/cli.js` — command parsing and user-facing output
- `src/snapshot.js` — checkpoint creation, diffing, listing, restore
- `src/workspace.js` — workspace file discovery and path safety
- `src/runner.js` — `codex exec` wrapper
- `src/mcp.js` — MCP server (stdio)
- `src/hooks.js` — Codex hook generation
- `test/*.test.js` — Node's built-in test runner
- `scripts/install.sh` — one-click installer

## Engineering rules (from `AGENTS.md`)

- Keep runtime dependencies at zero unless a dependency clearly removes
  more risk than it adds.
- Prefer small, focused functions with clear names.
- Do not add undocumented Codex hook assumptions without linking to
  official OpenAI docs or a stable upstream source.
- Storage changes need integration tests that create, mutate, diff, and
  restore a temporary workspace.
- Preserve content-addressed object storage unless replacing it with a
  simpler tested design.

## Commands

Run before committing:

```bash
npm test
npm run check
```

Both must pass.

## How to contribute

### Bug reports

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).
Include:

- `agent-rollback --version` output
- The exact command that failed
- Expected vs actual behavior
- A minimal reproduction if possible

### Feature requests

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md).
Explain the problem first, then the solution you have in mind. We
strongly prefer solutions that fit the existing CLI surface and don't
add a dependency.

### Pull requests

1. Fork the repo and create a branch from `main`.
2. Make your changes. Add a test under `test/` if you change behavior.
3. Run `npm test` and `npm run check` — both must pass.
4. Open a PR with a clear title and description. Reference any related
   issue.
5. A maintainer will review within 3-5 days.

### Code style

- ESM (`type: "module"` in `package.json`)
- Two-space indent
- Single quotes
- `const` over `let` where possible
- No `console.log` outside the CLI layer; use the existing helpers
  (`info`, `ok`, `warn`, `err`) in `src/cli.js`

### Documentation

- Doc fixes are very welcome — README, comments, JSDoc.
- For new user-facing commands, add an example to the "Usage" section
  and the "30-second start" if it's part of the common flow.
- For new MCP tools, add a row to the "MCP tool reference" table.

## Commit messages

Use short, present-tense imperatives:

- `add --with-mcp flag to installer`
- `fix undo safety-checkpoint order`
- `docs: clarify Codex hook install`

## Release process

Maintainers cut releases via `npm version <major|minor|patch>` and
`npm publish`. The tag is pushed automatically. See
[CHANGELOG](#changelog) (generated from git history).

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By
participating, you agree to uphold it.

## License

By contributing, you agree that your contributions will be licensed
under the [MIT License](LICENSE).
