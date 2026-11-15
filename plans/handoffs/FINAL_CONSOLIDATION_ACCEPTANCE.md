# Final consolidation acceptance

**Decision: READY for the first bounded Salon Expo workflow, within the supported boundaries below.** Published source acceptance baseline: **`3d6bb9f15fba69e45b6956f316cbf75ae9d2b79a`**, tree **`f47c753b5cda3e8f43262caf412505839043bf5e`**, independently verified by fresh fetch, `ls-remote`, ancestry and exact tree equality. This closing report/receipts are a documentation-only descendant; Main's final handoff names their exact published tip. This closes the concrete findings in the [original audit](FINAL_READINESS_RECOVERY_AUDIT.md), not the deferred factory/AIDD roadmap. Main alone integrates and publishes. No Salon Expo changes, runtime relinks, migrations, secrets/session copying, destructive cleanup or history rewriting.

## Source and recovery

- Accepted executable commit: **`e6b42ab448c5c8bc2faf59785795c8ab4758ea80`**. Subsequent closure changes are documentation/evidence only. Normal fast-forward publication from `b87deaf8` to `3d6bb9f` succeeded; fresh remote refs and exact tree comparison matched. Final receipt publication uses the same checks, never force.
- Original 52-path audit allowlist reconciled byte-for-byte before edits. All 52 were integrated: Workbench source/doctrine/evidence in `f8c8fe8`; closing receipts in `aa1df2b`. Root navigation was subsequently extended for the supported project command without dropping its retained doctrine. Initial failed fixtures and review results are intentional reproducibility/recovery evidence, not discarded artifacts.
- Scoped bootstrap repair `90ad754`: installed npm 12 rejected `npm --prefix cli ci`; running `npm ci` from `cli/` succeeds. Bootstrap and docs now use that proven directory-scoped invocation; regression verifies its working directory. No dependency/lock change.
- The active DevDrive branch remains intentionally at its original `8656a797` with an empty index; only reviewed published file overlays were applied. Do not mistake that preserved branch position for unpublished source, or reset/bulk-stage it. Final acceptance compares actual nonignored file blobs/modes/symlinks to GitHub main. Retained task branches/worker worktrees contain published history or copies of published source, not a hidden feature branch.
- New vertical `06d6914`, reviewed repairs `e6b42ab`. Source locations: [catalog](../../cli/src/components/catalog.ts), [project implementation](../../cli/src/project/), [tests](../../cli/tests/project.test.ts), [architecture](../../architecture/project-capabilities.md). No second registry, workflow engine or copied capability implementations.

### Backup verified before any closure edits

`/Volumes/DevDrive/Projects/backup-v1/consolidation-20261115T013947Z/`

Contains `repository.bundle` (all referenced Git history), `current-source.tar.gz`, `pre-overlay-head.tar`, `published-main.tar`, source/hash/symlink/absent-path manifests, refs/status/worktree/stash records, `SHA256SUMS`, `recovery-test.json`, and `RESTORE.md`. Existing backup contents were not overwritten.

Executed: verified bundle, isolated bundle clone plus `git fsck --full`, restored **280 regular files + 2 literal symlinks**, checked every manifest digest/target, recorded the one absent tracked generator, and recovered that retired `setup/stage-pi.mjs` from the pre-overlay Git archive. All snapshot checksums pass. The backup captures current WIP and retained pre-cleanup Git/frozen source; it cannot fabricate an unavailable earlier snapshot or unknown already-deleted uncommitted data.

Private HOME/settings/auth/sessions, private overlays, local runtime receipts and generated dependencies/builds were excluded. Known secret signatures and sensitive filenames were screened before copying history/source. The snapshot is **on the same DevDrive**, not protection against drive failure. Independent physical backup remains an operator responsibility, not a reason to upload private state or backup-v1 wholesale.

## Executable composability and acceptance

The existing catalog owns both project-applicable leaves and composition edges:

- `workbench-skill`: canonical Workbench Skill referenced at `<project>/.pi/skills/workbench/SKILL.md`.
- `study-skill`: canonical study Skill referenced at `<project>/.pi/skills/agentic-engineering/SKILL.md`.
- `project-engineering-skills`: composition referencing both leaves.

Recursive resolver tests execute nested compositions/diamond reuse/cycle rejection. The shipped composition itself references the two real leaves; no nested-ADW execution is claimed. Home setup and project integration are separate: project commands neither install nor check advisory machine requirements such as Pi, and never invoke Homebrew/Stow.

Main independently executed:

- CLI strict typecheck/build and **144/144 tests, zero failures/skips**.
- Existing **5/5 setup PTY scenarios**, legacy Stow preservation fixtures.
- Constructor **19/19**, gate controls **5/5**, existing delivered fixture **6/6**, syntax and strict constructor JSDoc typecheck.
- Real external `git init` repository + isolated HOME: list/inspect requirements, deterministic read-only plan twice, missing/wrong approval refusal, leaf install with study untouched, verify, exact no-op rerun, composition dependency expansion, preserved project `AGENTS.md`/`CLAUDE.md`/existing Skill, other resources absent, HOME empty.
- Installed native Pi **1.5.2** project `loadSkills`: discovered both installed Skills and existing sentinel, **zero diagnostics**. Prompt formatting emitted only metadata (**1,389 bytes** for three Skills), not their bodies or Foundations library. No session/auth/settings APIs or inference used in this loader check.
- Workbench structural check: **114 files, 6 JSON, 462 internal links**. Closure navigation/source-symbol/JSON checks also run; no Mermaid renderer is installed, so diagrams receive structural/source-flow checks only.

[Sanitized executed external-project evidence](../evidence/project-capabilities/acceptance.json). Temporary acceptance projects/homes and worker `closure-brief.md`/`review-findings.md` copies are disposable tests/briefs, not uncommitted product source.

### Independent architecture gate

Fresh reviewer reproduced **two material defects** in the initial candidate: nested payload receipt ordering and case-alias canonical-target exclusion. Both were fixed in two owned files, with focused regressions that fail against the old implementation. Reviewer independently reran check/build/**144 tests**, original adversarial cases and mutation controls: **PASS**, no remaining material findings. The [review record](PROJECT_CAPABILITY_REVIEW.md) retains both the original FAIL and passing delta re-review. No waiver or weakened check.

IMPLEMENTATION / TESTS / VALIDATION / ARCHITECTURE REVIEW / ARCHITECTURE DOCUMENTATION / DOCUMENTATION VALIDATION: **PASS** for this bounded vertical. Human shipping authority comes from the closure request, not the reviewer. Ordinary project trust/permissions remain with the harness/operator.

## Supported external-project example

Run from the canonical checkout with Node >=22.19 (24.15 used). If dependencies are absent: `(cd cli && npm ci --ignore-scripts)`. Set `TARGET` to an existing **absolute native-realpath Git root outside this checkout**. Commands below were exercised against a disposable repository; do not use Salon Expo until its own onboarding/scope is approved.

```sh
AE=/Volumes/DevDrive/Projects/agentic-engineering
node "$AE/cli/src/index.ts" project list --json
node "$AE/cli/src/index.ts" project inspect project-engineering-skills --json
# Select one leaf, or replace this ID with project-engineering-skills:
node "$AE/cli/src/index.ts" project plan --target "$TARGET" --select workbench-skill
# Review the exact operations/conflicts, then use the printed fingerprint:
node "$AE/cli/src/index.ts" project apply --target "$TARGET" --select workbench-skill --approve FINGERPRINT
node "$AE/cli/src/index.ts" project verify --target "$TARGET" --json
# Rerun plan: all operations should be noop; applying that new fingerprint changes nothing.
```

To test safely yourself, create a disposable root with `mktemp -d`, canonicalize it with `cd "$TEST_ROOT" && pwd -P`, create `project` and `home` beneath it, `git init "$TEST_ROOT/project"`, set `TARGET` to that project, and run the commands with `HOME="$TEST_ROOT/home"`. The CLI has no project `--home` flag and no machine-level setup substitution. Full syntax and supported boundaries are in [CLI usage](../../cli/README.md#project-capabilities).

For the first Salon Expo workflow: open its existing checkout, inspect its Git status and own `AGENTS.md`/`CLAUDE.md`/README/manifests/checks, agree on one bounded outcome and verification, then use Pi or independent Claude. Do not automatically install either Skill or load the full Workbench; project discovery is metadata-only and installation is explicitly selected.

## Machine readiness

- **Mini:** Pi 1.5.2 / Claude Code 2.1.325; Herdr 0.9.5 compatible client/server. Live five resource literals/bytes and private metadata retained; current session appends normally. New CLI edits do not change resource targets or installed payloads. The actual active checkout initially lacked generated Clack dependencies; directory-scoped locked `npm ci --ignore-scripts` restored only the nine declared packages, with no lock/source change. The actual canonical DevDrive CLI then passed external-project installation/native discovery, not just a worker copy.
- **Air:** [fresh read-only evidence](AIR_CLOSURE_VERIFICATION.md) verifies Pi 1.5.2 / Claude 2.1.325, all five physically local resource targets/hashes and native loading under network/Volumes-read/all-write denial, shared DevDrive visibility, and absent `SSH_CLIENT`/`SSH_CONNECTION`/`SSH_TTY` in the existing Local environment. Both-way Herdr report/acknowledgment completed. No fresh interactive-shell UI or physical network outage was injected.
- **Air exact source alignment PASS:** clean local `main` fast-forwarded from accepted `b87deaf8` to exact published **`3d6bb9f15fba69e45b6956f316cbf75ae9d2b79a`**, tree **`f47c753b5cda3e8f43262caf412505839043bf5e`**. Fresh fetched ref, ancestry, zero harness/frozen-Pi/installer delta, unchanged five resource targets/hashes, versions and local `project list --json` all pass. No installs, relinks, settings/auth/session reads or restarts. The final closing commit changes documentation/evidence only.

## Readiness scorecard

| Area | Result | Evidence |
|---|---|---|
| GitHub source recovery | PASS | Published source baseline includes all 52 paths and real vertical; exact fetched/advertised commit and tree match. |
| External cleanup backup | PASS | New source-only snapshot, all-file/symlink restoration and bundle/fsck/checksums verified; same-drive limitation explicit. |
| Mini runtime | PASS | Current Pi/Claude/Herdr, unchanged resources, canonical CLI external acceptance. |
| Air runtime and offline capability | PASS | Fresh sandboxed native loading and physically local sources; clean exact published-source alignment. |
| Herdr cross-machine coordination | PASS | Durable shared report, both-way notification and Main acknowledgment. |
| Pi and Claude harness availability | PASS | Both hosts: Pi 1.5.2 and independent Claude Code 2.1.325; no authentication-content inspection. |
| Capability discovery | PASS | Actual metadata list/selected requirements; no payload-library eager loading. |
| Recursive composability | PASS | Real leaf/composition installation plus executable nested/diamond/cycle contracts; not nested-ADW execution. |
| Selective setup and installation | PASS | External leaf/composition, verified no-op reruns, conflicts/ownership refusal; existing home setup retained. |
| Documentation and lazy loading | PASS | Routed instructions, authoritative Foundations, checked links/symbols, native metadata-only prompt. |
| Workbench WIP preservation | PASS | All audited paths retained in Git history/backup and integrated; 11 original reviewed-subject hashes matched. |
| Next-project onboarding | PASS | Supported commands documented above are exercised; Salon Expo remains untouched. |

**Remaining material blockers: none for the first supervised, project-scoped workflow.** This is not acceptance of autonomous factories, historical destructive cleanup, private whole-machine recovery or independent physical backup.

## Supported limitations — not hidden completion claims

- Project integration is POSIX/macOS canonical-file symlinking with a small local receipt, **not** portable copying, uninstall, a Claude project installer, workflow execution or a software factory.
- Links depend on a stable local source checkout and are live. Source drift is reported by verification; receipt refresh requires a new approved plan. There is no TOCTOU-proof transaction/concurrent-writer lock/automatic rollback. Foreign resources are never replaced.
- Receipt integrity detects accidental corruption, not a deliberate re-signer; actual link ownership remains authoritative. Keep links and receipt out of project commits (e.g. project-local Git excludes); the tool deliberately does not edit existing ignore files.
- Symlinked payload directories fail closed with raw `EISDIR`; a failed receipt rename may leave a temporary file. Real nested regular-file payloads are tested.
- Native discovery is verified; a new interactive trust dialog/full Pi session was not launched in a test project. The full optional Workbench boot still requests its standing documents; none is eagerly injected by `project list` or ordinary Skill metadata startup.
- Independent physical backup, unrelated legacy retirement and the AIDD correction gate remain outside this closure. No broader cleanup/factory work was started.
