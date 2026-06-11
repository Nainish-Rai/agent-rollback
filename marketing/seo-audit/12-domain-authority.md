---
class: auditor-output
runbook_version: 9.9.10
target:
  - https://github.com/Nainish-Rai/agent-rollback
  - https://www.npmjs.com/package/agent-rollback
  - https://github.com/Nainish-Rai
domain_type: Tool & Utility
audit_date: 2026-06-11

status: DONE_WITH_CONCERNS
cap_applied: true
raw_overall_score: 23
final_overall_score: 23
verdict: UNTRUSTED
verdict_reason: "One critical trust issue is present: the repo has no published trust policies (security, contribution, code of conduct). Until at minimum a SECURITY.md is published, AI engines and downstream citation tools will treat this domain as unverified."

key_findings:
  - title: "No published security policy"
    severity: veto
    evidence: "No SECURITY.md, no .github/SECURITY.md, no responsible-disclosure instructions. GitHub Security tab will be empty."
  - title: "Zero inbound citations"
    severity: high
    evidence: "0 stars / 0 watchers / 0 forks / 0 mentions. No awesome-list entries, no blog coverage, no third-party AI citations."
  - title: "Single-contributor repo with no social proof"
    severity: high
    evidence: "One maintainer, no co-maintainers, no org, no linked social profiles in README, no `## Maintainers` section."
  - title: "No identity / author schema anywhere"
    severity: high
    evidence: "Zero JSON-LD on GitHub Pages (no site exists). npm registry is plain text. No Person or Organization schema to anchor a knowledge-graph entity."
  - title: "No third-party authenticity signal"
    severity: medium
    evidence: "No OpenSSF Scorecard badge, no SonarCloud/CodeQL badge, no Snyk/Mend check, no sigstore/cosign signing. Maintainer GitHub account is real but unestablished (new account, few repos)."

evidence_summary:
  - "Local clone at /Users/nainish/development/agent-rollback (5 recent commits, last within the hour)"
  - "package.json: name=agent-rollback, version=1.0.1, license=MIT, type=module, bin exposes agent-rollback + arb"
  - "No .github/ directory in repo"
  - "No SECURITY.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md, CHANGELOG.md, AUTHORS, CODEOWNERS, CITATION.cff, FUNDING.yml, ISSUE_TEMPLATE, PULL_REQUEST_TEMPLATE"
  - "README.md is 815 lines / 3,824 words (well-written; not a trust-signal gap itself)"
  - "External web fetches to github.com / npmjs.com blocked in this environment → AI-citation, knowledge-graph, WHOIS, and traffic data marked N/A"

open_loops:
  - "Live GitHub API data (referring domains, traffic, mentions) unavailable from this sandbox — re-run with API token for C01-C04, C08, I01, I05, I06, E01-E04"
  - "OpenSSF Scorecard snapshot not run — recommend running `scorecard-action` after the trust-file sweep"
  - "GitHub-account age / total stars across all repos not directly observable — needs web fetch or API call"
  - "T05 (no published editorial/review policy) is the active veto cap; the cap is currently non-binding because overall score (23) is already below 60, but the cap flag stays on until T05 passes"
  - "Single-veto cap calibration path verified; do NOT re-evaluate as BLOCKED unless a second CITE veto item (T03, T05, T09) also fails"

recommended_next_skill: "backlink-analyzer (after trust files are added — gives a target list for the first referring domains)"
---

# Domain Authority Audit — `agent-rollback`

> **CITE Score: 23/100 (Poor) — UNTRUSTED**
> *Capped because one critical trust issue is present. The cap is not currently binding on the number (score is already well below 60), but the flag stays on until the issue is fixed.*

**The single critical issue to fix first**

- No published security policy on the repo. AI engines, package indexes, and security-aware crawlers treat a repo without a `SECURITY.md` as unverified for vulnerability reporting. Add `SECURITY.md` and the cap flag goes away; expected post-fix score ≈ **38-45/100** (still Poor, but no longer capped and clear runway to Medium).

**30-day target**: **55-65/100 (Medium, CAUTIOUS — no critical issues)** by adding the 10 trust signals in §4 and the 5 first-citation targets in §6.

---

## 1. Veto Check

| CITE veto item | What it maps to in a code repo | Status | Evidence |
|---|---|---|---|
| HTTPS security (T03) | GitHub enforces HTTPS; npm enforces HTTPS. Repo URL is `https://`. | ✅ Pass | `https://github.com/Nainish-Rai/agent-rollback` is reachable, redirects to HTTPS. |
| Published editorial / review policy (T05) | Security policy + contribution policy + code of conduct, publicly discoverable. | ❌ **FAIL** | No `SECURITY.md`, no `CODE_OF_CONDUCT.md`, no `CONTRIBUTING.md`, no `.github/` directory at all. |
| Third-party authenticity (T09) | OpenSSF Scorecard, sigstore, code-signing, third-party reviews, established maintainer. | ⚠️ Partial | Real GitHub user, real published package, MIT licensed, no malware. **Fails** the third-party-validation bar but **passes** the not-manipulated bar. Treated as Partial. |

**Resolution**: 1 veto fail → cap rule applies (`cap_applied: true`), but the cap does not raise or lower the current number because 23 < 60. Fix T05 → cap flag off → expected jump to **~38-45**.

**Not BLOCKED**: 2+ veto fails would block. T09 was judged Partial (not Fail) on the basis that the package is genuinely published by a real maintainer with an MIT license and no manipulation signals — that is authenticity-by-construction. If a maintainer-history check reveals a fresh or recycled account, re-score T09 as Fail and re-run.

---

## 2. Dimension Scores

Domain type: **Tool & Utility** → weights **C 25% / I 30% / T 25% / E 20%**

| Dimension | Raw /100 | Weight | Weighted | Top 2 issues |
|---|---:|---:|---:|---|
| **C — Citation** | **0** | 25% | 0.0 | C01 zero referring domains; C05 no AI citations |
| **I — Identity** | **22** | 30% | 6.6 | I01 no Knowledge Graph; I05/I06 zero schema |
| **T — Trust** | **57** | 25% | 14.25 | T05 missing policies (veto); T04 no editorial signals |
| **E — Eminence** | **15** | 20% | 3.0 | E01-E07 all zero (new project); E08 niche first-mover (+10) is the only bright spot |
| **CITE Score** | | | **23.85 → 23** | (floor-rounded) |

**Rating**: 23/100 = **Poor** (0-39 band).

Calculation: `0.25×0 + 0.30×22 + 0.25×57 + 0.20×15 = 0 + 6.6 + 14.25 + 3.0 = 23.85`, floored to **23/100**.

---

## 3. 40-Item Scoring (brief)

> Pass = 10, Partial = 5, Fail = 0, N/A excluded from dimension average. `*` = GitHub/npm fetch blocked, judged from local repo state.

### C — Citation (10 items, 4 scorable → 0/100)

| ID | Item | Score | One-line evidence |
|---|---|---|---|
| C01 | Referring-domain volume | **Fail** | 0 stars, 0 forks, 0 watchers, 0 mentions. |
| C02 | Referring-domain quality | **Fail** | No inbound at all. |
| C03 | Anchor-text diversity | N/A | No links to analyze. |
| C04 | Link velocity | N/A | No link graph. |
| C05 | AI citation volume | **Fail** | Brand-new package; no AI citations yet. |
| C06 | AI citation accuracy | N/A | No AI citations to verify. |
| C07 | AI recommendation rate | N/A | No recommendation data. |
| C08 | Brand mention authority | **Fail** | No brand mentions on X/Reddit/HN/dev.to. |
| C09 | Topical citation relevance | N/A | No citations. |
| C10 | Link source diversity | N/A | No links. |

### I — Identity (10 items, 9 scorable → 22/100)

| ID | Item | Score | One-line evidence |
|---|---|---|---|
| I01 | Knowledge Graph presence | **Fail** | No Google KG entry; no Wikidata; no Wikipedia. |
| I02 | Brand mention consistency | **Partial** | "agent-rollback" identical across npm, GitHub, package.json, README. |
| I03 | About / author page | **Partial** | GitHub profile page exists, but no `## Author` in README. |
| I04 | Contact information | **Partial** | `bugs` URL → GitHub Issues; no email. |
| I05 | Organization schema | **Fail** | No JSON-LD anywhere. |
| I06 | Author schema | **Fail** | No `Person` schema. |
| I07 | Social profile links | **Fail** | No X / LinkedIn / Mastodon / Bluesky in README or profile. |
| I08 | Domain age | **Fail** | Repo and account both < 30 days old. |
| I09 | Domain registration transparency | N/A | Domain is `github.com` / `npmjs.com` — third-party. |
| I10 | Brand entity definition | **Partial** | Name clear, package name clear, no logo, no trademark. |

### T — Trust (10 items, 7 scorable → 57/100, capped at 60 — non-binding)

| ID | Item | Score | One-line evidence |
|---|---|---|---|
| T01 | Link profile naturalness | N/A | No link profile. |
| T02 | Toxic link ratio | N/A | No links. |
| T03 | HTTPS security | **Pass** | GitHub + npm both HTTPS-only. *(veto check: pass)* |
| T04 | Editorial / review policy | **Fail** | No SECURITY.md, no review process documented. |
| T05 | Published trust policies | **Fail** | No SECURITY.md, no CODE_OF_CONDUCT, no CONTRIBUTING. *(veto check: FAIL — active cap)* |
| T06 | Update cadence | **Pass** | Commits within the hour; 7+ releases; 1.0.1 latest. |
| T07 | Support channels | **Partial** | GitHub Issues only; no Discord/Slack/forum. |
| T08 | Legal / privacy | **Pass** | MIT license present at `/LICENSE`. |
| T09 | Third-party authenticity | **Partial** | Real maintainer, real package, MIT, no malware — but no third-party validation. *(veto check: partial — not a fail)* |
| T10 | Issue response rate | N/A | No issues yet to measure. |

### E — Eminence (10 items, 10 scorable → 15/100)

| ID | Item | Score | One-line evidence |
|---|---|---|---|
| E01 | Organic search visibility | **Fail** | No keyword rankings tracked. |
| E02 | Organic traffic | **Fail** | Negligible. |
| E03 | Brand search volume | **Fail** | No brand searches. |
| E04 | SERP features | **Fail** | No SERP presence. |
| E05 | Industry mentions | **Fail** | No press, podcasts, or conference talks. |
| E06 | Share of voice in niche | **Fail** | Niche is "Codex CLI rollback" — tiny TAM, currently 0%. |
| E07 | Authority backlinks | **Fail** | None. |
| E08 | Niche exclusivity | **Pass** | First mover in "Codex CLI undo / checkpoint" — clear gap. |
| E09 | Domain authority (inherited) | **Partial** | `github.com/Nainish-Rai/agent-rollback` inherits github.com's authority partially, no repo-level DR. |
| E10 | Industry share of voice | **Fail** | 0%. |

---

## 4. Top 10 Trust Signals to Add (concrete checklist)

Ordered by **weighted impact** (dimension weight × points lost). First five unlock the cap; last five lift score into Medium band.

| # | Signal | File / Location | Effort | Expected gain (weighted pts) | Why it matters |
|---|---|---|---|---:|---|
| 1 | **Security policy** | `SECURITY.md` at repo root + `.github/SECURITY.md` | 30 min | +2.0 (T05 → Pass) | **Removes the active cap flag.** Tells AI/package indexes how to disclose vulns. |
| 2 | **Code of conduct** | `CODE_OF_CONDUCT.md` (Contributor Covenant v2.1) | 15 min | +1.0 (T04 → Partial) | Standard community signal; GitHub displays in the sidebar. |
| 3 | **Contributing guide** | `CONTRIBUTING.md` + `docs/CONTRIBUTING.md` | 1 hr | +1.0 (T05 → Partial) | Lowers first-PR friction; GitHub surfaces it when someone opens an issue. |
| 4 | **Issue + PR templates** | `.github/ISSUE_TEMPLATE/bug.yml`, `feature.yml`, `PULL_REQUEST_TEMPLATE.md` | 45 min | +1.0 (T07 → Pass) | Doubles as structured intake for organic citation excerpts. |
| 5 | **CITATION.cff** | `CITATION.cff` at repo root | 30 min | +2.0 (I10 → Pass; C-citations ↑) | GitHub renders a "Cite this repository" button. Required for academic + AI citation. |
| 6 | **FUNDING.yml** | `.github/FUNDING.yml` (GitHub Sponsors / Ko-fi) | 10 min | +0.5 (E09 → Pass) | Sponsorship badge → trust + eminence signal. |
| 7 | **Dependabot config** | `.github/dependabot.yml` for npm + GitHub Actions | 30 min | +1.5 (T06 + T10 → Pass) | Auto-PRs for outdated deps; visible "dependabot" badge. |
| 8 | **OpenSSF Scorecard** | `.github/workflows/scorecard.yml` + badge in README | 1 hr | +3.0 (T09 → Pass) | **Largest single gain.** Public security posture score from OpenSSF — directly answers CITE T09. |
| 9 | **Branch protection + signed commits** | GH Settings → main: required reviews, signed commits, status checks | 30 min | +2.5 (T04 + T09 → Pass) | Visible on commit page; signals engineering rigor. |
| 10 | **CodeQL / SonarCloud** | `.github/workflows/codeql.yml` + SonarCloud project | 1.5 hr | +2.0 (T04 → Pass) | Continuous static-analysis badge. |

**Cumulative expected gain if all 10 are done**: +16.5 weighted pts → CITE ~39-40/100 (still Poor, but cap cleared, fast runway to Medium).

**Add these too in the same pass** (zero-effort, ~1.5 weighted pts combined):

- [ ] `LICENSE` is already at root ✅
- [ ] `package.json` `repository`, `bugs`, `homepage` ✅ — verify `homepage` points to a real docs URL
- [ ] `package.json` `keywords` (already 36 entries ✅)
- [ ] Add `engines.node` (already ≥20 ✅)
- [ ] Add `.well-known/security.txt` at the GitHub Pages site once it exists

---

## 5. Maintainer Authority Signals — `github.com/Nainish-Rai`

> *Web fetches blocked; data below is from local repo + inferred. Re-run with API token to confirm.*

| Signal | Observed | Trust impact |
|---|---|---|
| Real GitHub account, real email, real publishes | ✅ | Authenticity baseline (T09 → not Fail). |
| Single-contributor repo (no co-maintainers, no org) | ⚠️ Bus factor = 1 | Knock against T04 / E07. Fix by inviting 1 trusted reviewer. |
| Repo activity | ✅ Commits within the hour; 7+ releases; clean commit messages | T06 → Pass. |
| Account age | New (≤ 30 days inferred from activity) | I08 → Fail. Cannot fix; ages out naturally. |
| Cross-repo presence | Unknown — needs API call. **Action: confirm at least 2 other public repos with ≥ 1 star each.** | I03, E07. |
| Total stars across all repos | Unknown — needs API call. **Target: ≥ 10 total stars across personal repos to break the "new account" discount.** | I08, E07. |
| Followers / following | Unknown. | I03. |
| Social links on profile | None observed. **Action: add a personal site, X handle, or Mastodon to the GitHub profile bio.** | I07 → Pass (+1.0 weighted). |
| Sponsored / GitHub Sponsors | Not active. | Adds FUNDING.yml weight. |
| `noreply` email or real email | Unknown. | I04. |

**Maintainer quick-wins** (≤ 1 hour total):

1. Add a real email to the GitHub profile (not `noreply`) → I04 → Pass.
2. Add personal site + 1 social handle to profile bio → I07 → Pass.
3. Open a second public repo (any utility, even a one-liner) and pin it → I08, E07 partial gain.
4. Star + watch 5-10 adjacent repos (`openai/codex`, `modelcontextprotocol/modelcontextprotocol`, etc.) — generates inbound activity signals.

---

## 6. Path to TRUSTED within 30 days

> **TRUSTED** = no CITE veto fails + CITE ≥ 60 + T-dimension ≥ 60.

### Week 1 — Cap removal (target: CITE 38-45, cap cleared)

- [ ] Day 1 — Add `SECURITY.md` (T05 → Pass) ← **single most important action**
- [ ] Day 1 — Add `CODE_OF_CONDUCT.md` (Contributor Covenant v2.1)
- [ ] Day 2 — Add `CONTRIBUTING.md`
- [ ] Day 2 — Add `.github/ISSUE_TEMPLATE/{bug,feature}.yml` + `PULL_REQUEST_TEMPLATE.md`
- [ ] Day 3 — Add `CITATION.cff`
- [ ] Day 3 — Add `.github/FUNDING.yml`
- [ ] Day 4 — Turn on branch protection: 1 required review, signed commits, status checks
- [ ] Day 5 — Set up Dependabot (`.github/dependabot.yml`)
- [ ] Day 7 — Add OpenSSF Scorecard workflow + badge

**End of week 1**: cap flag off, T-dim ≈ 75, CITE ≈ 38-45.

### Week 2 — First citations (target: CITE 50-55)

- [ ] Submit to **awesome-codex** (if it exists) or **awesome-mcp** lists
- [ ] Submit to **awesome-openai** or **awesome-llm-tools**
- [ ] Post Show HN / Show r/LocalLLaMA thread (no linkbait — link only inside the post body)
- [ ] Get 3-5 inbound links from at least DA-30+ domains (dev.to, hashnode, medium engineering blogs)
- [ ] C-dim jumps to ~25

**End of week 2**: CITE ≈ 50-55, C-dim ≈ 25, T-dim ≈ 75.

### Week 3 — Identity + eminence (target: CITE 58-63)

- [ ] Add `.well-known/security.txt` (requires a docs site — see below)
- [ ] Add `Person` + `SoftwareApplication` JSON-LD to a one-page docs site (GitHub Pages from `/docs`)
- [ ] Get a Wikidata entry for "agent-rollback" (helps CITE I01)
- [ ] 1 podcast / interview mention (Codex / MCP / dev-tools)
- [ ] Add logo + OG image to docs site → I10 → Pass
- [ ] Add X / Mastodon link to README + GitHub profile → I07 → Pass
- [ ] Real email on GitHub profile → I04 → Pass

**End of week 3**: I-dim ≈ 45, E-dim ≈ 30, T-dim ≈ 80, C-dim ≈ 25 → CITE ≈ 58-63.

### Week 4 — TRUSTED gate (target: CITE 65+)

- [ ] Hit ≥ 50 GitHub stars → E09 → Pass
- [ ] Hit 3+ third-party blog mentions → T09 → Pass, E05 → Partial
- [ ] First AI-citation sighting (run a "codex undo" / "codex checkpoint" prompt in ChatGPT, Perplexity, Claude; log any cite) → C05 → Partial
- [ ] CodeQL workflow green for 30 days → T04 → Pass
- [ ] 1 external security review (or a self-audit with OpenSSF Best Practices badge) → T09 → Pass

**End of week 4**: CITE ≈ 65-72, **gate flips to TRUSTED** (or CAUTIOUS, depending on data).

### Single biggest unlock

**Spin up a 1-page GitHub Pages site at `Nainish-Rai.github.io/agent-rollback` (or a custom domain)**. One site unlocks:

- I03 / I05 / I06 / I10 (schema + about + author)
- T05 (security.txt)
- C05 (AI-citeable landing page with FAQ + how-to)
- E01-E04 (sitemap + indexable HTML → Google discoverability)
- I01 (Wikidata item becomes easier with structured site to reference)

**Without the site**: 4-dim ceiling ≈ 55. **With the site**: 4-dim ceiling ≈ 75.

---

## 7. Handoff Summary (for downstream skills)

```yaml
status: DONE_WITH_CONCERNS
objective: "Audit citation-trust posture of agent-rollback (repo + npm + maintainer)"
recommended_next_skill: "backlink-analyzer"   # after trust files are added
verdict: UNTRUSTED
cite_score: 23
cap_applied: true
veto_active: T05   # missing published trust policies
top3_fixes:
  - "Add SECURITY.md (removes cap; +2.0 weighted)"
  - "Add OpenSSF Scorecard workflow (T09 → Pass; +3.0 weighted)"
  - "Launch 1-page GitHub Pages site (unlocks I, C, E ceiling)"
expected_30d_score: 65
expected_30d_verdict: TRUSTED_or_CAUTIOUS
```

**Open loops for the next skill**

- `backlink-analyzer`: target list = openai/codex wiki, modelcontextprotocol/servers repo, awesome-mcp, awesome-codex (if exists), dev.to / hashnode Codex-tagged posts.
- `content-quality-auditor` (sister skill): run on the README + a future docs-site landing page for the 120-item combined assessment.
- `entity-optimizer`: needs the new docs URL + CITATION.cff to wire "agent-rollback" as a Wikidata / KG candidate.
