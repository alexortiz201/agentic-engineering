# Final readiness closure — execution handoff

**Assignments closed.** See [final acceptance](FINAL_CONSOLIDATION_ACCEPTANCE.md). Briefs/authorizations below are retained execution history, not permission to repeat operations.

Main is sole integration/publication authority. User authorized source backup, scoped publication to main, one project capability vertical, and bounded Air verification. No Salon Expo changes, live relinking, destructive reset/cleanup, force push, runtime migration or secret/session publication.

## Recovery checkpoint — completed before edits

`/Volumes/DevDrive/Projects/backup-v1/consolidation-20261115T013947Z`: 283 source entries, 280 regular file SHA-256s, two literal symlinks, one absent tracked path (`setup/stage-pi.mjs`); 52-path audit allowlist reconciled unchanged. Verified all-ref Git bundle, isolated clone/fsck, complete current-source restore and retired generator restoration from HEAD archive, all archive checksums. Current source plus HEAD/published archives preserve retained WIP/history; unavailable original historical backup cannot be recreated. Private HOME/overlays/sessions/auth/settings and generated dependencies excluded. Same-drive, not independent physical protection.

## Ownership

- Main: `/tmp/ae-close-integration`, branch `closure/integration` from published `b87deaf8`; WIP privacy review/integration, final independent checks and GitHub publication. Active DevDrive dirty branch remains untouched except owned closure reports.
- Mini Claude `capability-builder`: `/tmp/ae-close-capabilities`, branch `closure/project-capabilities` from same tip. Own only project capability vertical in `cli/src`, focused `cli/tests/project*.test.ts`, `cli/README.md`, `cli/DEVELOPMENT.md` if needed, and `architecture/project-capabilities.md`. No source edits outside these paths, no commits/push/branch operations, no live HOME/runtime changes. Return report to Main; questions through Herdr. Main merges exact files after independent review.
- Air Pi: read-only current runtime/offline/local-shell/shared-file/Herdr checks; owns only `plans/handoffs/AIR_CLOSURE_VERIFICATION.md` on shared DevDrive. No local source advancement until Main supplies exact published commit and scope. No live relinking, migration, auth/session reads or server restart.

## Capability implementation brief

Implement the smallest real supported project-level vertical, not machine setup. Reuse `cli/src/components/catalog.ts` as the sole canonical capability definitions/dependency authority; extend it narrowly for explicit project applicability/compositions, not another registry. Existing home `setup` behavior must remain compatible. Reuse existing canonical leaf payloads (e.g. Workbench Skill) via project-owned explicit references/symlinks, without duplicated implementations. One composition must reference leaf dependencies, recursive graph resolution must permit a composition consumed by another composition (test this without building a workflow engine).

Expose documented CLI discovery/inspect/plan/apply/verify commands with explicit existing target repository; selected-only lazy source inspection. Plan deterministic/read-only; explicit apply approval; verification and reruns reconcile actual file/ownership state. No project AGENTS/CLAUDE overwrite; no machine installers or Stow prerequisite for project integration. Preserve unselected and existing files. Refuse symlink/unsafe target roots or parents, foreign ownership, tampered receipts, stale preview/replacement, traversal and dependency cycles; deterministic clear failures. No removal/update/autonomous nested-ADW engine required. Use a small local installation receipt if needed, not a new registry/controller; document dependence on stable canonical checkout and source version/digest behavior. Follow existing strict TypeScript/Node tests and instruction boundaries. Read Pi project Skill discovery docs before selecting `.pi` target paths; no harness code changes.

Architecture Gate APPLIES: scope/contract → implementation → tests/typecheck/build → fresh independent review by Main/another bounded reviewer → architecture documentation → link/symbol checks. `workbench/handbook/16_SUBSTANTIAL_SUBSYSTEM_LIFECYCLE.md` governs. Main owns final integration/acceptance. Implementation worker must run all CLI checks and add isolated target/home tests: discovery, requirements, leaf and composition selection, dependency expansion/nesting, deterministic dry run, safe apply, installed verification, no-op rerun, untouched unselected resources, existing-file conflicts, symlink/ownership/receipt tampering refusal. Use Node built-ins and existing dependencies only. No new framework/registry. Return exact modified paths, actual commands/results, supported commands and limitations; do not claim Main acceptance.

## Integrated execution checkpoint

Workbench 52-path WIP is preserved in scoped commits; all original reviewed subjects matched. New project vertical is implemented at `06d6914`, independently reviewed with two material findings, repaired at `e6b42ab448c5c8bc2faf59785795c8ab4758ea80`, and independently re-reviewed PASS with no material findings. Main and reviewer pass check/build/144 tests, zero skips. Original FAIL and passing delta review retained in [PROJECT_CAPABILITY_REVIEW.md](PROJECT_CAPABILITY_REVIEW.md). Main additionally verified a real external repository/isolated home, leaf selection/no-op rerun/composition install, and native Pi discovery with zero diagnostics and metadata-only prompt. Architecture and final report contain supported boundaries, not nested-ADW claims.

Fresh Air read-only checks and acknowledgment passed; [Air report](AIR_CLOSURE_VERIFICATION.md). Initial source publication is complete: exact **`3d6bb9f15fba69e45b6956f316cbf75ae9d2b79a`**, tree **`f47c753b5cda3e8f43262caf412505839043bf5e`**, normal fast-forward push to GitHub main; fresh fetch/ls-remote and exact tree comparison pass. Main applied only that published non-resource source overlay to the active DevDrive files, preserving its old branch/index and all original WIP in history/backup. No further worker implementation is authorized.

### Air exact source-only closing authorization

Air Pi may now advance only its accepted local checkout from clean `b87deaf8` to exact published **`3d6bb9f15fba69e45b6956f316cbf75ae9d2b79a`**. Require expected origin, clean index/worktree, unchanged five resource literals/hashes; fetch only origin main without tags/submodules, require the fetched main equals the exact approved SHA, inspect that `harness/pi/`, frozen `pi/` and installer bytes are unchanged, then ordinary `git merge --ff-only` to that exact SHA. Stop on any drift/conflict; no moving-ref inference, reset or checkout.

Afterward check clean local HEAD, unchanged five resources, Pi/Claude versions and `node cli/src/index.ts project list --json` from the local source. Use existing dependencies; no installs/auth/session reads/relinks/services. Append sanitized observed results to AIR_CLOSURE_VERIFICATION.md on shared DevDrive, send Main the path/ack through Herdr, then stop. Main will publish this closing receipt and final acceptance as documentation-only follow-up.

## Closing result

Air exact source-only alignment completed PASS at `3d6bb9f15fba69e45b6956f316cbf75ae9d2b79a`; Main read the actual durable append and received its Herdr acknowledgment. Source/resource delta and final clean checkout checks passed. Mini canonical CLI passed check/build/144 tests and repeated real external-project/native-discovery acceptance after restoring only locked generated CLI dependencies. Original private metadata and five native resources remain unchanged except normal active-session append.

No worker editing/review assignment remains. Main owns only final documentation receipt publication, fresh GitHub recovery/tree verification and a documentation-only Air fast-forward to that exact published closing tip. No new capability/factory/lifecycle work is authorized.
