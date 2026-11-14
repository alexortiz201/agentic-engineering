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

## Acceptance / remaining work
Strict CLI check/build/test, PTY and legacy or replacement source checks; selective install/repeat/dependency/state isolation; Mini managed ownership, composer compatibility and Herdr; Air local source candidate and runtime ownership, controlled offline/reconnect evidence without destructive mount changes; exact published revision refs; recovery intact. Record failures and actual limitations, never infer Ready from worker exit.
