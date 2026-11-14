# Prepared canonical Pi source transition

## Decision and integration gate

**SETTLED BY MAIN — integrated after verifying actual Air selective handoff.** See [Air execution evidence](AIR_LIVE_HANDOFF_RESULT.md) and [current execution record](LIVE_HANDOFF_EXECUTION.md). The preparation and pending-gate statements below are preserved assignment history, not current blockers.

Assignment: Main Orchestrator `w7:p0`; host `Mac-mini.local`, Pi agent; isolated worktree `/tmp/ae-source-transition`, branch `migration/source-transition`, base `8656a79767b2ef67aedd462b1081a2e0b0ed509f`.

Main explicitly authorized preparing canonical ownership in isolation, contingent on verifying Air's actual selective ownership handoff before integration. This is not permission to edit active shared resources. Main owns cross-host synchronization, host execution/acceptance reports and the `setup/ACCEPTANCE.md` current-status addendum. This report does not assert Air handoff completion.

The smallest safe transition separates **authorship/workflow** from **legacy path retirement**: author only `harness/pi/`, retire overwrite-prone generation and its regeneration/equality tests, retain every old root/support path unchanged. No source move, duplicate authored authority, forwarding wrapper or copied lock archive is required.

## Implemented scope

- `harness/pi/README.md`: canonical direct-edit workflow, authored metadata semantics, stable acceptance baseline and retained legacy consumers. Package bytes, seed and metadata unchanged.
- `setup/stage-pi.mjs`: deleted, not redirected or retained as a runnable overwrite path. Historical references remain evidence, not supported regeneration instructions.
- `cli/tests/sources.test.ts`: replace root-equality/generation assertions with exact five-package regular-leaf inventory, accepted pins/baseline and seed agreement; test actual selective Stow install, repeat/no-op, removal and source preservation in a temporary source/home containing no legacy root or generator. Assert retired generator is absent from the real candidate tree. Other safety/legacy tests remain.
- `cli/src/components/catalog.ts`: remove stale `(staged)` owner label only.
- `AGENTS.md`, `setup/OWNERSHIP.md`, `setup/MIGRATION.md`, `SETUP.md`, root `README.md`: narrow current ownership/workflow corrections and explicit integration/retirement gates. Migration execution evidence and historical path statements are preserved; the leading current amendment narrowly supersedes old authority/generator holds. Root README change is limited to its current Pi ownership sentence.

No `workbench/`, `pi/`, installer, inspector, live HOME, dotfiles, runtime, package declaration or active shared-worktree changes. CLI dependency installation/build occurred only in this isolated worktree, with npm cache `/tmp/ae-source-transition-npm-cache`; ignored output is not part of the commit. No push/publication.

## Frozen consumers and recovery

All **13** root Pi files remain byte-identical: five resources, seed, `.stow-local-ignore`, four historical Markdown files and both exact managed-lock files. `scripts/install-pi` and `scripts/install-pi.test.js` also remain byte-identical. Frozen copies are not to receive backported authored edits.

Retained users/support routes:

1. Air's accepted old local links until Main verifies the separately authorized selective handoff. No Air action was performed here.
2. Dirty dotfiles `.no-stow/scripts/pi-resources`, which still requires the old installer and root Workbench Skill. It was not inspected or modified in this task; documented dependencies are retained, not declared retired.
3. Legacy installer and regression fixture, old-root conflict/ownership diagnostics and existing selective handoff/rollback fixtures.
4. Existing root README/Air/acceptance navigation and official-runtime comparison/audit/recovery instructions using both managed-lock files. These paths remain intact; authored acceptance metadata is not a substitute for an exact runtime lock.

Even after Air handoff, root removal requires separately approved named-consumer/support disposition. This candidate does not retire dotfiles or prove no external/private readers remain. Existing link-only receipts and recovery paths remain available; no settings/auth/sessions/Todos restoration or runtime reacceptance is needed for this patch.

## Observed checks

All commands ran from `/tmp/ae-source-transition`, never against active shared resources:

- `npm --prefix cli ci --ignore-scripts --cache /tmp/ae-source-transition-npm-cache` — passed (9 packages; local isolated dependencies only).
- `npm --prefix cli run check` — passed.
- `npm --prefix cli run build` — passed.
- `node --experimental-strip-types --test cli/tests/sources.test.ts` — 4/4 passed; then final full suite below includes the added retired-generator assertion.
- `npm --prefix cli test` — **63/63 passed**.
- `node scripts/install-pi.test.js` — passed: plan/repeat, relocation conflict/recovery, removal, foreign conflict and local-state preservation in fixtures.
- Git-blob byte comparison against assigned base — **22/22 protected files unchanged**: 13 root files + five canonical resources + canonical seed/metadata + installer/fixture.
- `git diff --check` — passed.

Five unchanged canonical SHA-256s:

| Package | SHA-256 |
|---|---|
| pi-instructions | `04d5065fac818554a1326df9227254dc4d3b21c4674986172a393eb2200b763e` |
| pi-theme | `73d86db506f25164edf7c7266898f9c7d349778a8ca55f30b129267c7ef3805a` |
| workbench-skill | `f17a20f40d793552e61450478203244af34ea8ef3fcf4bc50c7409cc8d20662f` |
| study-skill | `0e76c36a8e1806164b33f23d668484f283bf5316e52d25d2373e71edb5545e9f` |
| composer | `cdfcd4ba722253d3fb9488b5a5833cac8f2f5dc14369aebe9a5161cb1eb595d1` |

Fixtures are not host/runtime acceptance. No generator was executed, no real Pi/Stow target was changed, and no host loading/session/offline tests were repeated.

## Main's remaining gate and rollback

1. Verify and record actual Air selective ownership; retain accepted runtime/offline evidence without redundant reacceptance. **Pending Main.**
2. Review this isolated commit and integrate only after that gate. Synchronization, live paths and publication remain Main/operator decisions; none is implicit here.
3. Keep root files/installer frozen until dotfiles and other support consumers have approved disposition. Future authored resource/pin changes require separate review and inspector-baseline acceptance; this transition changes no bytes or pins.

Before integration, rollback is to decline the candidate. After approved integration, inspect intervening changes and revert only this patch's matching policy/test/catalog/generator-retirement changes. Do not regenerate resources, mirror edits into legacy files, restore HOME or undo accepted host links. Integration/deployment acceptance is deliberately **not** claimed by this implementation completion report.

Commit identity is supplied with this report path in the final Herdr message (avoids a self-referential commit hash).
