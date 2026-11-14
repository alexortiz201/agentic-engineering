# Live handoff execution — 2026-11-14

Owner: Main Orchestrator, Mini Pi (`w7:p0`). User mission authorizes bounded implementation, host handoff, validation and normal publication to main; earlier document approval holds are historical except safety gates requiring exact inspection. No destructive retirement without verified consumers/recovery.

## Observed starting state
- Shared active checkout: branch workbench/construction-slice at 8656a79767b2ef67aedd462b1081a2e0b0ed509f; unrelated dirty Workbench/architecture/root README/plans preserved. Only orchestrator writes integration Git metadata.
- Live GitHub main: e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354; setup/consolidation: 8656a79767b2ef67aedd462b1081a2e0b0ed509f (live ls-remote).
- Mini: arm64 Mac-mini.local, Pi 1.5.2 canonical ~/.pi/agent/bin/pi, Node 24.15.0, pnpm 12.18.0, Claude 2.1.325; no reinstall indicated. Herdr 0.9.5 client/server compatible, Pi reporter v9 and Claude reporter v11 current.
- Dotfiles main ef260a2; extensively dirty historical work preserved, no reset or bulk staging. Existing worktree only.
- Requested /Volumes/DevDrive/Projects/backup-v1 absent. Investigate bounded documented recovery locations; absence blocks destructive retirement, not independent read-only/source checks.
- Air reachable through existing enabled Herdr machine Air; Pi w4:p1 and Claude w4:p4 idle. Fresh briefs required, no inherited assignments.

## Execution graph and ownership
1. Reconstruct current evidence and recovery, create isolated worktrees (done).
2. Mini Pi worker w7:p28: source-transition implementation in /tmp/ae-source-transition, migration/source-transition, base 8656a79. Deliver canonical harness/source consumer transition proposal and safe repository implementation; no live writes/deletions or dotfiles writes. Report plans/handoffs/SOURCE_TRANSITION_RESULT.md in its worktree. Await explicit detailed brief.
3. Mini Claude worker w7:p2B: independent setup review/checks in /tmp/ae-setup-review, migration/setup-review, same base. Report plans/handoffs/SETUP_REVIEW_RESULT.md; no live mutations. Await detailed brief.
4. Air Pi w4:p1: read-only host validation and precise five-local-link handoff readiness; shared output plans/handoffs/AIR_LIVE_HANDOFF_RESULT.md only. No source/runtime/settings mutation until orchestrator approves exact verified transaction.
5. Main integrates in /tmp/ae-migration-main, migration/live-handoff. Validate candidate, approve bounded Air source update and selective links if safe, reconcile canonical ownership and legacy consumers; publish only reviewed passing work.

## Decisions
- Preserve shared dirty tree and all dotfiles WIP. Isolated worktrees are outside repository. No Git branch switch/reset/stash in shared checkout.
- Existing setup implementation is reused, not rewritten; full deferred software factory and lifecycle systems remain out of scope.
- Keep auth/settings/sessions local; do not log values or restore snapshots. No runtime upgrade, command/PATH migration, general computer config conversion, SMB service change or fault injection implied.
- Retain root Pi/legacy consumers until source transition is verified on both hosts and rollback exists. Absent external backup is not permission to delete historical sources.
- Evidence labels: documented historical acceptance is not new verification; loader tests, actual filesystem inspection, interactive observations and publication refs must be distinguished.

## Progress / additional decisions
- Source candidate `1a6f62d55c12543328d72ec5a7827f209d51d4ae` is implemented and reviewed; integration remains held until Air's actual selective handoff. It retires overwrite-prone generation, promotes only `harness/pi/` authorship and preserves all 13 legacy root files/installer/locks for named consumers. No destructive source retirement is needed for coherent authorship.
- Air source-only update to exact C2 succeeded after explicit scoped approval; local inspector has zero blockers and local candidate equality. Separate exact five-leaf transaction approved with immediate rechecks, 0700/0600 link-only receipt and guarded leaf rollback. No general configuration/runtime operation.
- Initial Claude reviewer paused at an outside-launch-directory read approval. Main cancelled, stopped the session and relaunched Claude in its assigned worktree as `setup-reviewer` with Sonnet/medium; no permission setting widened and no rejected read bypassed. Draft test preserved. Fresh worker received a full brief.
- Mini Pi worker reassigned to `/tmp/ae-setup-repeatability`, branch `migration/setup-repeatability`, for fixture reproduction and minimal fix of provisional defaults/theme receipt lifecycle failures. Source-transition ownership released; no overlapping files with composer reviewer. Preservation backups are intentionally not pruned.

## Settled validation and next gate
- Main reviewed/cherry-picked source candidate as `8d60736`, composer test as `653265b`, receipt fix as `3e7e02c`, independent receipt review as `f782e32`; original worker commits remain on retained branches. Source and receipt implementation assignments settled; reviewer verdict ACCEPT.
- Main strict check/build, **129/129 tests with zero skips**, five PTYs and legacy fixtures pass. Actual Mini five-resource preview: 5 noops/53 skips/zero conflicts. Native resource loading/schema checks pass; local credentials/settings unchanged and 369 original session files preserved.
- Air five-link handoff, full-schema/native composer loader/render/submission, and process-local offline/SMB/private-state denial passed, including EPERM negative controls. Local C2 wizard check/build/63 tests/five PTYs and repeated five-noop previews passed with private settings equality and 127 session metadata entries preserved.
- AIR-CONTINUITY-1: durable checkpoint, clean native worker exit at idle, shell-only foreground verified, Mini's 129-test suite passed while Air worker absent; canonical Pi restarted with `--offline --session` exact same file. Air verified same session inode/nondecreasing size, explicit fresh role brief and durable pending action, then reported through Herdr. No physical network/host outage claimed.
- Exact integrated candidate **3de15bce2c1d39aecf7bf5c05bfbbeddc011a5b1** accepted on Air after approved ordinary Git transport from shared committed objects (not dirty files): strict check/build, 129 tests zero skips, five PTYs, legacy fixtures, stable no-op previews, zero inspector blockers. Candidate normally pushed to `origin/main` from prior `e9c0a625`; fresh live ref verified exact C. No failing/partial implementation was published.
- After publication, applied only accepted migration-owned working-file hunks to shared active checkout, plus exact Pi ownership sentence in dirty README. Shared branch/HEAD C2 and empty index preserved. All 51 original WIP fingerprints unchanged after accounting only for that sentence; accepted source files match C (README WIP/current Air report deliberately excepted). Actual shared wizard passes strict check/build and 129 tests zero skips. No resource bytes/links/private settings changed. A first overlay-verification assertion mistakenly included the two deliberate exceptions; corrected explicit exclusions verify zero source mismatches.
- Final readiness documentation is documentation-only after C; normal publication and exact Air docs-only fast-forward are closing actions. [Readiness report](MIGRATION_READINESS.md) records accepted code, evidence, retained owners and actual limitations.

## Intentional retained boundaries
External `backup-v1` is absent; existing private link receipts and native recovery material are preserved, so no destructive cleanup is attempted. General computer configs/dirty dotfiles/SMB services/legacy root support readers remain retained owners. Cosmetic selected-but-unrun `skipped` labeling remains documented. Prior visual operator acceptance is retained; fresh tests exercise native renderers rather than replacing it with a fake visual claim. Implementation publication C is verified; final documentation-only tip/update must be checked by exact commit before closure. Worker implementation/review processes are released and clean temporary worker worktrees removed; source branch history retained.
