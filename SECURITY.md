# Security Policy

## Supported versions

`agent-rollback` is currently in active development. Security updates
are released for the latest minor version.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a vulnerability

Please **do not** file a public GitHub issue for security
vulnerabilities. Email `nraibackup1@gmail.com` (or use GitHub's
[private vulnerability reporting](https://github.com/Nainish-Rai/agent-rollback/security/advisories/new))
instead.

Include:

- A description of the vulnerability
- Steps to reproduce
- The impact (what an attacker could do)
- Any known mitigations

We aim to acknowledge reports within 3 business days and ship a fix
within 14 days for high-severity issues.

## Threat model

`agent-rollback` is a **local-only** CLI and MCP server. It:

- Reads and writes files only inside the workspace you point it at
  (or inside `.agent-rollback/` by default).
- Does not open network sockets, except for the optional `npm install`
  the installer runs.
- Does not collect or send telemetry.
- Runs the Codex hook scripts with the same privileges as the Codex
  CLI process.

Things `agent-rollback` does **not** protect against:

- Malicious Codex output that has been approved by the user
- Supply-chain attacks against npm dependencies (`@modelcontextprotocol/sdk`, `zod`)
- Privilege escalation in the workspace

## Best practices for users

- Keep Node.js up to date (we require >= 20).
- Use `npm audit` to check for known issues in dependencies.
- Pin the version when installing for production: `npm install -g agent-rollback@1.0.1`.
- Review Codex's diffs before approving any file write.
- Back up your `.agent-rollback/` directory if it contains valuable
  checkpoints (it is yours, not your repo's).

## Disclosure policy

We follow [coordinated disclosure](https://en.wikipedia.org/wiki/Coordinated_vulnerability_disclosure).
Please give us a reasonable window to fix before public disclosure.
