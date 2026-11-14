# Agentic Engineering consolidation — readiness

**Status: Ready for the approved selective Pi/setup migration.** Verified 2026-11-14. This does not accept unattended fresh-Mac provisioning, general computer ownership transfer, destructive legacy retirement, or the deferred software-factory CLI.

## Published implementation

Accepted implementation **`3de15bce2c1d39aecf7bf5c05bfbbeddc011a5b1`** was normally fast-forward-pushed to `origin/main` and independently verified with live `git ls-remote`. Previous main was `e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354`; reviewed setup baseline was `8656a79767b2ef67aedd462b1081a2e0b0ed509f`. This subsequent readiness commit changes documentation only; the accepted executable code/resource tree is unchanged. Obtain the current published documentation tip with `git ls-remote --heads origin refs/heads/main`.

## Architecture and ownership

- `cli/`: standalone TypeScript/Clack setup, explicit capability selection/profiles/dependencies, detect → pure plan → approval → bounded execution → verification. No factory loader, scheduler or control plane.
- `harness/pi/`: sole authored portable resource/seed/acceptance-metadata owner. Available is not installed, installed is not enabled, and enabled is not loaded. The CLI honestly reports runtime loading as unknown; native loading evidence is separate.
- Both hosts retain official managed **Pi 1.5.2**, exact Todo **1.1.0**, and functioning **Claude Code 2.1.325**. No upgrade/reinstall/manager/PATH migration.
- Mini resource leaves use its physically local DevDrive checkout. Air's five leaves now use its complete local checkout `harness/pi/packages/`; SMB is a project workspace, never Air's runtime source.
- User-owned settings/auth/sessions/caches/identity remain local. Herdr owns its generated reporter. Workbench remains portable guidance/construction knowledge, not runtime ownership.
- All 13 root `pi/` files, exact managed locks, old installer/fixtures and dirty dotfiles remain frozen compatibility/recovery consumers. No second editable resource authority. The overwrite-prone staging generator is retired.

## Completed implementation and coordination

| Owner | Settled deliverable / original branch commit |
|---|---|
| Mini Pi worker | Canonical-source transition `migration/source-transition`, `1a6f62d`; integrated as `8d60736` only after Air handoff |
| Mini Claude reviewer | Native composer compatibility + setup review, `migration/setup-review`, `1c277da`; integrated as `653265b` |
| Mini Pi worker | Reproduced/fixed defaults/theme receipt repeatability, `migration/setup-repeatability`, `9f0a2d7`; integrated as `3e7e02c` |
| Mini Claude reviewer | Independent adversarial receipt review **ACCEPT**, `95a8769`; integrated report `f782e32` |
| Air Pi worker | Actual installation/source/link/native-loading/offline-process/wizard/continuity validation; [durable report](AIR_LIVE_HANDOFF_RESULT.md) |
| Main Mini Pi | Architecture, exact approvals, integration, independent reruns, publication and preservation |

Every task used explicit ownership and fresh briefs. Implementation/review workers used isolated worktrees outside the repository; their clean temporary worktrees were removed after integration, branch history retained, and worker processes gracefully released. No worker published or integrated into main. Herdr carried paths; Main read actual report files. No custom coordination machinery was introduced.

## Acceptance evidence

- **Both Macs, exact accepted implementation:** strict TypeScript check/build, **129/129 tests, zero failures/skips**, all **5 PTY scenarios**, legacy Stow preservation fixtures. [Mini](MINI_LIVE_HANDOFF_RESULT.md), [Air](AIR_LIVE_HANDOFF_RESULT.md).
- Actual five-selected-resource previews: **5 no-ops / 53 skips / zero conflicts**; repeated Air plans identical. Native Stow performed the exact approved five-local-leaf Air handoff with fresh checks and private rollback metadata. Dependencies, selective installs/removals, repeatability, foreign ownership/stale approval refusal and private-state safety are additionally covered in temporary-home fixtures, not misrepresented as privileged live installs.
- Composer source unchanged: native Pi **45 compatibility tests**, including **42** Markdown/code/Unicode/narrow-width parity cases plus loading/UI registration, real highlighting and native submission. [Review](SETUP_REVIEW_RESULT.md). Both hosts also loaded actual instructions, both Skills with zero diagnostics, and Purple Dreams with explicit full-schema validation.
- Air process-offline validation denied network, `/Volumes`, private-state reads and HOME writes. EPERM negative controls passed; local native resources/render/submission still passed. Shared reads and Herdr worked after process exit. This is controlled process-denial/recovery, **not physical SMB/network disconnection**.
- AIR-CONTINUITY-1: durable checkpoint → graceful assigned-worker stop → Mini **129-test** run while Air worker absent → canonical `pi --offline --session` exact existing file → same inode/nondecreasing size and explicit fresh role briefing. No authority transfer, session restoration or second coordinator.
- Mini settings/auth digests unchanged; **369** original session files present with same inode/nondecreasing size. Air wizard phase settings digest unchanged; **127** session metadata entries preserved before controlled native continuation (normal append thereafter). No credentials/session bodies copied into handoffs.
- Mini Herdr client/server **0.9.5**, Pi reporter v9 / Claude v11 current. Air client **0.9.5**, compatible retained server **0.9.1**, Pi reporter v9 current; retained Claude hook v10 is older than v11 but existing reporting/CLI works. No server restart/hook migration was needed.
- Prior operator-confirmed visual/fresh-session appearance acceptance is retained; new deterministic/native-renderer tests do not falsely claim a new visual eyeball test.

## Shared workspace and Git safety

The shared dirty `workbench/construction-slice` branch remains at **C2 `8656a797` with an empty index**; no checkout/reset/stash/branch rewrite. After main publication, Main applied only accepted migration-owned working-file hunks so the actual shared wizard runs the accepted code. A narrowly targeted Pi ownership sentence was updated in dirty root README without incorporating its unrelated Workbench additions into publication. **All 51 original changed/untracked-file fingerprints match after accounting only for that exact migration sentence.** Existing publication-result WIP is untouched. The active shared tree independently passes check/build/**129 tests, zero skips**. All migration-owned source files match published code; current Air report and README intentionally contain later evidence/unrelated WIP.

This is a deliberate published-source overlay in a pre-existing WIP tree, not a claim that shared HEAD equals main. Keep one Git writer. Do not blindly reset, checkout main, bulk-stage, or reapply migration commits over it. Future Workbench integration must preserve this overlay and its unrelated work. Air's separate local checkout is clean at the accepted implementation; its final documentation-only fast-forward is a separately scoped closing action.

## Recovery and cleanup

- Specified external `/Volumes/DevDrive/Projects/backup-v1` is **absent on both hosts**. Its contents/recovery integrity cannot be verified. Nothing there was deleted or overwritten, and no destructive cleanup depended on it.
- Mini private rollback: `~/.local/state/ae/handoffs/mini-pi-five-20261114T042028.825620Z/`; native recovery checkpoint `~/.local/state/pi-native-consolidation/20261113T170838Z/` retained.
- Air private link-only rollback: `~/.local/state/ae/handoffs/air-pi-five-20261114T172716.735276Z/`. New directories **0700**, manifests/results **0600**, exact old literals and hashes retained; no rollback required. Restore only matching changed leaves into absent destinations, never whole HOME/auth/session snapshots.
- Both source trees, historical material and branch commits retained. Only obsolete overwrite generation was removed. Temporary workers/worktrees/scratch were cleaned up only after settlement; existing panes/servers, SMB services and recovery stores were not destroyed.

## Actual limitations / next actions

1. General computer configuration/private includes/folded-parent ownership, dirty dotfiles retirement and root-Pi support-consumer retirement remain intentionally separate transactions. Do not run old whole-home installers over accepted selective links.
2. Fresh Pi/Homebrew/Oh My Zsh prerequisite installation and privileged/unpinned package updates remain documented manual boundaries, not unattended wizard guarantees. No blanket capability activation.
3. Failed plans still label later unrun operations `skipped`, with an explicit failure/stop detail; low-severity display limitation, no further mutation. Receipt/settings updates are ordered rather than multi-file atomic; private archived evidence and fresh replan preserve safe recovery.
4. Physical host sleep/network/SMB outage and new visual eyeball acceptance were not injected. Controlled sandbox and native-worker interruption tests provide the requested safe bounded continuity evidence.
5. Locate/reconcile external `backup-v1` before any future destructive retirement. Existing narrow link receipts and protected source/history support the completed reversible handoffs; they are not a verified whole-machine backup.

The AIDD `CORRECTION REQUIRED` checkpoint and unrelated Workbench construction work remain unchanged. The broader utility-belt vision is preserved; deferred factory/lifecycle systems were not built.
