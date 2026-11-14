# Bounded Claude Code handoff — setup CLI UX completion

> **Current direction:** [Shared DevDrive alignment/publication handoff](handoffs/SHARED_DEVDRIVE_PUBLICATION.md). Both Macs share DevDrive for active development; Air keeps accepted local offline Pi resources. [Air's actual local source report](handoffs/AIR_LOCAL_CHECKOUT_EVIDENCE.md) confirms clean `main` at `e9c0a625`, five accepted local root links and absent new candidates. Runtime/offline acceptance is closed. Historical pending/unobserved statements below are not current instructions. Cross-machine handoffs now use verified shared files; Herdr carries their paths. Publication and optional local Git update/local-to-local handoff remain separately unapproved.

## Authority and stop boundary

User requested this handoff because Pi's OpenAI allowance is low. Pi remains lead and will review after reset; Claude is the existing adjacent harness, not a second coordinator. Once Claude acknowledges, Pi stops implementation calls and does not edit in parallel. No further agents, panes, recursive delegation or coordination infrastructure. Do not commit/push or change live installations.

Checkout: `/Volumes/DevDrive/Projects/agentic-engineering`, branch `workbench/construction-slice`, accepted portable Pi baseline `e9c0a625`. Existing Workbench/root README/architecture/plans WIP is unrelated and must remain intact. Both Macs' completed Pi installations are accepted; historical Air inventory is not current evidence.

Read root `AGENTS.md`, `cli/AGENTS.md`, and relevant `cli/README.md`/`setup/MIGRATION.md`. All setup implementation is still uncommitted/untracked; do not treat untracked files as disposable. Root `pi/` and old dotfiles live targets remain intact. `harness/pi/` is a generated migration candidate, not a second authored authority.

## Current UX implementation (atomic change complete)

- One direct `@clack/core` tri-state component control: Space cycles `[ ] → [x] → [−]`; `x` install/update, `-`/`r` removal, `0` no change. No per-component action prompt.
- `[x]` goes directly to existing pure planner: missing install, accepted older update, current no-op, migration/conflict/unknown blocked. Only deliberate `[−]` selections enter guided scope/cleanup/confirmation prompts.
- Backspace navigates component → profile, review → components, confirmation → review, and backward within guided uninstall. Escape/Ctrl+C cancels. No provisioning effects while navigating.
- Recommendations visibly preselected even on existing machines. Explicit edits, including touches equal to today's recommendation, survive profile changes; untouched recommendations recalculate. Cursor and scopes/confirmations survive back navigation; changing an action invalidates removal consent.
- `Migration required` recognizes exact sibling-dotfiles link targets plus imported original source digests, including folded parent links; accepted root-Pi leaves require byte equality. Candidates remain blocked—never detached/adopted. Unknown/changed ownership remains conflict.
- Application installed version, config ownership and requested action have separate labels. Mini read-only preview confirmed Git/Ghostty config as migration-required while the Ghostty app receipt/version and managed Pi runtime were separately current.

## Files changed for this UX fix

- `cli/package.json`, `cli/package-lock.json`: direct pinned `@clack/core@1.2.0` (already transitive; no extra framework).
- `cli/src/prompts/{controls,choices}.ts` (new): small core controls/navigation and pure choice/profile helpers.
- `cli/src/prompts/setup.ts`: removed per-component install questions; guided uninstall only.
- `cli/src/commands/setup.ts`: sequential typed profile/components/review loop; explicit reviewed plan execution unchanged.
- `cli/src/profiles/index.ts`: visible initial recommendations on existing machines (review/approval still required).
- `cli/src/setup/{types,files,detect,plan}.ts`, new `migration.ts`: observational migration candidates/version labels; planner blocks them. Execution ownership protections are unchanged.
- `cli/tests/setup.test.ts`: updated two expectations for new explicit UX requirements, retaining safety assertions.
- `cli/tests/ux.test.ts` (new), `cli/tests/terminal-probe.py`: focused bulk/planning/navigation/migration tests and real terminal acceptance.

Other `cli/`, `setup/`, `harness/`, `SETUP.md`, root `.gitignore`/`AGENTS.md` changes are the preceding setup implementation. Do not undo them or modify unrelated Workbench changes.

## Latest executed evidence (all pass)

```sh
npm --prefix cli run check
npm --prefix cli run build
npm --prefix cli test                 # 45 passed, 0 failed/skipped
python3 cli/tests/terminal-probe.py    # four scenarios below
node scripts/install-pi.test.js       # existing accepted Pi fixture regression
 git diff --check
```

PTY evidence uses temporary homes, fixture metadata, and real Clack at 140 columns:
1. Select **15** components directly → automatic no-op plan → final confirmation; navigate back through review/profile, preserve overrides, then explicitly apply only current/no-op fixture selections (only fixture profile receipt written).
2. Deliberate removal only → all three scopes, cleanup/back navigation → dry-run; links/auth/session fixture unchanged.
3. Existing-machine workstation recommendations visibly preselected (13), preserved by Backspace; Escape cancels.
4. Ctrl+C cancels safely.

No live package/source ownership changes. Tests invoke actual Stow only in temporary homes; native package mutations are fixtures. Last atomic addition tracks touched IDs so explicit selections equal to an inherited recommendation also survive switching profiles; all checks above were rerun after it.

## Next bounded task for Claude

**Complete UX documentation alignment and a focused final UX/safety review**, not a redesign:

1. Fix stale docs: `cli/README.md` still describes per-component action prompts and fresh-only recommendations; `cli/DEVELOPMENT.md` still calls removed `selectActions`. Record why this specific small core control is justified. `setup/MIGRATION.md` still calls all known old links foreign conflicts; explain the new blocked `Migration required` candidate label. Update `setup/ACCEPTANCE.md` to latest observed counts/evidence without erasing prior failure history or claiming live acceptance.
2. Review focused UX paths, especially preserving choices through navigation, explicit removal confirmation and no side effects. Investigate full-cleanup review of a migration/unsafe-parent component: `cleanupReview` may throw instead of presenting a navigable blocked explanation. If demonstrated, make a minimal UX-only fix and add a focused regression test; do not automate migration.
3. Run/reuse the 15-component PTY test at a realistic narrower width (the adjacent panes currently have ~106 columns; current fixture uses 140). If rendering actually breaks, fix only the small control/rendering and add evidence. No visual redesign or new libraries.
4. Rerun checks above; report actual changed files, commands/results, findings and residual limitations. Stop for Pi/user review. Do not deploy.

### Exclusive file ownership while Pi is paused

Claude may edit only:
- `cli/README.md`, `cli/DEVELOPMENT.md`, `cli/AGENTS.md`;
- `setup/ACCEPTANCE.md`, `setup/MIGRATION.md`;
- focused fixes in `cli/src/prompts/{controls,choices,setup}.ts`, `cli/src/commands/setup.ts`;
- corresponding tests under `cli/tests/`;
- this handoff artifact's **Claude completion** section below.

Other source files are read-only for this bounded step (including detect/plan/migration semantics). If a material issue requires broader ownership, document it and request approval rather than widening scope. No edits to root README/AGENTS, Workbench, dotfiles, root Pi, source staging or live HOME. No commits/pushes/resets/stashes/global installs.

### Acceptance

- No `requested action` or equivalent question per selected install/update component.
- At least 10 (existing test: 15) selections reach plan/final confirmation with only genuinely exceptional prompts.
- Backspace preserves user edits/profile overrides; Escape/Ctrl+C safe.
- Migration/unknown ownership never reported as verified new-owner current or replaced automatically.
- All tests pass; no loss of original safety tests, no live changes, no unrelated WIP edits.

## Claude completion

### Files changed

- `cli/src/prompts/setup.ts`: wrapped `cleanupReview(ctx, c)` call in a try-catch; on throw (unsafe parent path / migration component), displays a blocked-explanation note and loops back to scope selection instead of propagating the unhandled error.
- `cli/tests/ux.test.ts`: added import of `cleanupReview`; added regression test `'cleanupReview throws for stow component with unsafe parent symlink — guideRemovals must catch this'` — creates a stow source with a leaf under a symlinked parent directory, confirms `cleanupReview` throws `Unsafe parent`, documenting the scenario the try-catch handles.
- `cli/AGENTS.md`: added justification for the direct `@clack/core` tri-state Prompt — the per-component in-place key dispatch (Space/x/-/0) with inline scrolling cannot be satisfied by standard `selectPrompt`/`multiSelectPrompt`; `@clack/core` was already a transitive dependency.
- `cli/DEVELOPMENT.md`: replaced stale `selectActions` pseudocode with accurate `componentChoices` / `rememberChoices` / `guideRemovals` flow.
- `cli/README.md`: replaced "fresh-only recommendations" paragraph with accurate text (recommendations visible on existing machines; plan as no-op for current/blocked); replaced "standard Clack multiselect" description with accurate single-screen tri-state control description; removed "per-component action prompt" implication.
- `setup/MIGRATION.md`: updated step 4 to explain `Migration required` blocked-candidate label (recognized ownership, never auto-detached) instead of "foreign conflicts".
- `setup/ACCEPTANCE.md`: updated test count (38 → 46), PTY description (120-col single scenario → 140-col four scenarios), added 106-col PTY evidence row.

### Additional files changed (second pass)

- `cli/tests/terminal-probe.py`: added `cleanup_blocked` PTY scenario — converts `config-ghostty` to a parent-symlink conflict state after `prepare()`, navigates to "Full cleanup review", asserts "Cleanup inspection blocked" note appears and scope selection is restored without crash; added to the final scenario loop (now 5 scenarios).
- `plans/SETUP_CLI_CLAUDE_HANDOFF.md`: updated completion section (this file).

### Executed checks (final)

```
npm --prefix cli run check   # Exit 0
npm --prefix cli run build   # Exit 0
npm --prefix cli test        # 46 passed, 0 failed/skipped
python3 cli/tests/terminal-probe.py  # 5 PTY scenarios, all PASS at 140 cols
manual 106-column PTY inline script  # PASS — no rendering breakage
node scripts/install-pi.test.js      # PASS — Pi fixture regressions unchanged
git diff --check             # Exit 0
```

### Root AGENTS.md compliance check

Root `AGENTS.md` governs workspace topology and cross-repository boundaries. All changes are within OWNED subtrees (`cli/`, `setup/`, `plans/`). No commits, pushes, nested repositories, live installation changes, root/Workbench/dotfiles edits, or cross-repository boundary violations. Closest applicable instruction wins per precedence rule; nothing in the nested instructions weakens the workspace contract. No conflicts found.

### Findings

- `cleanupReview` throws `Unsafe parent: ...` for any stow component whose leaf's parent directory is a symlink (migration/conflict-status components like `config-ghostty` with `~/.config/ghostty` as a folded parent symlink). This was an unhandled propagation path in `guideRemovals`. Fixed with a try-catch that navigates back to scope selection with an explanation. No execution-layer changes.
- 106-column PTY rendering: no breakage. The `fit()` helper in `controls.ts` already clips to `getColumns(process.stdout) - 2`, so narrow widths truncate gracefully without wrapping or overflow. No rendering fix was needed.
- PTY gap closed: `cleanup_blocked` scenario in `terminal-probe.py` now exercises the full interactive path — parent-symlink fixture → Full cleanup review selection → blocked note → scope restored — confirming the try-catch fix works end-to-end, not just at the unit level.

### Residual limitations

- `setup/ACCEPTANCE.md` 106-col evidence is from an inline script, not a named scenario in `terminal-probe.py`. Adding it as a named scenario would make it reproducible; deferred to Pi/user decision.
- No live deployment, commits, pushes, or root/Workbench/dotfiles edits were made.

---

## Claude Code harness task (second bounded task)

### Goal
Add Claude Code as an optional, independently managed harness in the setup wizard alongside Pi.

### Design decisions

**Why a separate `claude-code` harness component (not just `brew-claude-code`):**
Claude Code is installed via Homebrew (`brew-claude-code` cask, already in `Brewfile.shared`). `brew-claude-code` detects via Homebrew receipt only. A separate `claude-code` manual-adapter component (like the `pi` component) detects the actual CLI binary and version via `which claude` + `--version`, independent of the Homebrew receipt. This surfaces:
- Whether the CLI is usable in PATH (not just whether the cask is receipted)
- The installed version from the CLI itself
- A clear "installation is managed by brew-claude-code" message for any install/remove attempt

**Why no profile recommendations:**
"No automatic enablement" per task constraint. Neither `claude-code` nor `brew-claude-code` is added to any profile's recommendations array.

**Why no accepted version pin:**
The Homebrew cask handles version management. Pinning an accepted version in the wizard would create maintenance burden and false 'update' statuses. The `claude-code` component reports what's installed without enforcing a pin.

**Why no credentials/settings scope:**
Claude Code's `~/.claude/settings.json` (global), `.claude/settings.json` (project), and credentials are project/machine-specific and private. CLAUDE.md files are per-project and already in the repository. No setup-managed configuration needed.

### Files changed (new task)

- `cli/src/components/catalog.ts`: Added `claude-code` manual component (detect-only; installation via `brew-claude-code`)
- `cli/src/setup/detect.ts`: Added `claude-code` detection case — `which claude` → `claude --version` → semver extract; states: `missing`/`current`/`unknown`; evidence explicitly states settings/auth not read
- `cli/tests/setup.test.ts`: Fixed `which` fixture to handle per-argument (`which pi` vs `which claude`); added `claude-code` detection test with three scenarios (absent, found with version, found with failed version)
- `cli/tests/ux.test.ts`: Added `claude-code` planning test — verifies not in any profile recommendations, plans correctly for all status/action combinations
- `cli/README.md`: Added `Claude Code` row to supported operations table
- `setup/ACCEPTANCE.md`: Updated test count (46→48)
- `plans/SETUP_CLI_CLAUDE_HANDOFF.md`: This file

### Executed checks (new task)

```
npm --prefix cli run check   # Exit 0
npm --prefix cli test        # 48 passed, 0 failed/skipped
python3 cli/tests/terminal-probe.py  # 5 PTY scenarios, all PASS
node scripts/install-pi.test.js      # PASS
git diff --check             # Exit 0
```

### Verification

- Claude Code is not in any profile recommendation (confirmed by test) → no automatic enablement
- Existing Pi components, fixture, and all 5 PTY scenarios unchanged → independent coexistence verified
- `brew-claude-code` Homebrew cask exists as the installation mechanism (confirmed by test)
- `which` fixture fixed: `which pi` still resolves Pi when managed; `which claude` returns not-found in fixtures → Claude Code shows as 'missing' by default in all existing tests

### Unresolved questions requiring approval

1. **Starter profile opt-in**: Adding `brew-claude-code` to workstation/laptop profile recommendations would let users opt-in with a single selection. Currently it stays unselected. This is intentional per "no automatic enablement" but could be relaxed to "optional recommendation" if desired.
2. **Accepted version**: No version is pinned. If a specific accepted Claude Code version is desired for the workspace, an `accepted.json` file (like `harness/pi/accepted.json`) could be added. Not implemented without that requirement.
3. **Non-Homebrew detection**: If Claude Code is installed via npm global (`npm install -g @anthropic-ai/claude-code`), `which claude` finds it and shows 'current'. `brew-claude-code` shows 'not installed'. This non-uniform state is reported to the user as separate visible components but not treated as a conflict (no receipt for the Homebrew cask doesn't mean the CLI is "wrong"). Document this as an acknowledged limitation.

### Limitations

- `claude --version` is called with the binary path returned by `which`. If a different binary named `claude` exists in PATH (unrelated tool), it would be detected with that version. No receipt-based identity verification is performed.
- `brew-claude-code` and `claude-code` are independent components that can show different states (Homebrew not installed vs CLI found). Users see both in the component list.
- No live Claude Code installation was tested; detection is verified via controlled test runners only.

## Pi engineering lead acceptance review (after allowance reset)

- Recovered root/scoped instructions, actual Git history/status and current untracked source. HEAD remains `e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354`; no Claude commits were present. Unrelated Workbench/root README/architecture WIP was left intact.
- Reviewed direct controls, session overrides/back navigation, guided cleanup, pure planning, approval/preflight execution, exact legacy detection and the optional Claude detector/profile declarations. No acceptance-blocking code defect found; no implementation changes made in this review.
- Independently reran strict check, build, **48 tests (0 failed/skipped)**, **all five PTY scenarios at both 140 and 106 columns**, existing Pi fixtures and bootstrap syntax checks. The narrower rerun substituted `struct.pack('HHHH', 50, 140, 0, 0)` with 106 columns via an inline runtime override and asserted five substitutions; test source was not changed.
- Ran actual Mini `sh setup/bootstrap/setup --dry-run --json --profile mac-workstation`: 13 selected, 9 no-ops, 4 migration conflicts, 45 skipped. Before/after read-only known-link/config inventory was identical. Six computer packages and five Pi resources are correctly recognized as old-owner migration candidates, never new-owner current.
- Important host finding: `which claude` returns `~/.n/bin/claude`; direct `--version` fails **ENOEXEC**. The detector correctly reports unknown/blocked; `brew-claude-code` has no receipt. This is a separate existing launcher/manager issue, not evidence that a second installation is needed. No live repair attempted. Neither Claude entry is profile-recommended; no pin/manager policy added.
- Updated existing CLI docs to remove remaining custom-control/no-effect contradictions and describe Claude's independent receipt/PATH limitations. Updated `setup/ACCEPTANCE.md` with independent evidence and `setup/MIGRATION.md` with exact Ghostty dry-run steps, observed topology, proposed five-leaf Pi-first slice and later per-package computer handoffs.
- **Accepted:** inspected implementation and isolated UX/safety evidence. **Pending:** operator Ghostty visual acceptance; separately approved Mini source-only handoff; fresh independent Air inventory/approval; both-host acceptance before physical Pi source relocation; complete dependency disposition before dotfiles retirement. Setup source still needs an explicitly authorized selected commit/publication before deployment against a stable reviewed revision.
- No commits, pushes, live installation/link/settings/credential changes, physical relocation or legacy retirement were performed by Pi. Stop at the host-acceptance decision documented in `setup/MIGRATION.md`.

## Overnight consolidation workstreams — 2026-11-14

### Current accepted baseline (supersedes old pending-host statements above)

Mini wizard UX, five-link selective source handoff, native loading and operator fresh-session/composer acceptance are complete. Five live literals and resource bytes are protected, not being migrated again. Air has not had this source-layout handoff; source sharing is not evidence of its actual targets or offline availability. Root Pi's 13 files, old installer/generator and all eight harness files remain unchanged. Physical relocation proposal was withdrawn and stays unapproved.

### Explicit ownership and Claude completion

Pi verified existing Claude pane `w7:p28` ready and obtained explicit ownership acknowledgment. Claude's exclusive writable list was bootstrap, detect/execute, entrypoint/optional computer tests, CLI README, SETUP and OWNERSHIP; all Pi inspector/tests/migration/acceptance/handoff files, root sources, Workbench and dotfiles were read-only. Claude changed only:

- `cli/tests/computer.test.ts`: three provenance fallback/ownership regression cases; no new installer/adapter/framework.
- `SETUP.md`: future private overrides, parent-link review and inspector/approval guidance.
- `setup/OWNERSHIP.md`: accepted Mini/new-source status and computer migration prerequisites.

Claude ran checks/build/full suite and old Pi fixture, reported no live/source moves or commits, then explicitly released ownership. Pi read the actual changes, corrected misleading statements about migration clearing and shell leaf-only assumptions, clarified current versus new template includes and made the command copy/paste-safe. No concurrent overlapping edits or additional agents. No general computer adapter fix was necessary; do not claim Claude implemented new provisioning support.

### Pi implementation

- Added fixed-five, no-effects `--pi` mode to existing `setup/inspect-links.mjs`; default inventory remains compatible. Exact old/new paths, candidate/accepted Git hashes, UID/modes, real parent safety, package scope, managed runtime metadata/PATH resolution, private-value-free profile override checks, canonical Workbench and local-source readiness. No settings/auth/session read, package/Stow/Pi execution or auto-written receipt.
- Added `cli/tests/pi-inspection.test.ts`, 12 cases including real selective Stow in temporary homes and guarded rollback, foreign/unsafe/missing/changed-resource blockers, incomplete Workbench, source permissions, mocked network filesystem and private-state/argument boundaries. Canonical verification remains functional after deleting only a disposable fixture's root source tree; no new old-filesystem dependency for already-migrated leaves.
- Added exact Air evidence/dry-run commands and the dependency-ordered legacy-entrypoint transition/retention matrix to `setup/MIGRATION.md`. Updated `setup/ACCEPTANCE.md` with current evidence, limits and remaining decisions.

### Independent integration results

- Strict check/build: pass. **63 tests**, 0 failed/cancelled/skipped (48 prior + 12 Pi inspection + 3 computer provenance).
- All five actual PTY scenarios pass at 140 and 106 columns; five narrower sizes asserted. Existing `node scripts/install-pi.test.js` passes.
- Actual read-only inspector smoke on Mini: APFS/local, managed 1.5.2 topology, five selective leaves, no handoff needed/blockers. Loading is deliberately `not-tested` by the inspector; existing operator/native loading acceptance is retained rather than repeated.
- Actual canonical bootstrap JSON dry-run for exactly five Pi selections: **5 no-ops, 53 skips, no conflicts**; local settings digest unchanged.
- Start/end protected hashes: all 13 root Pi + 8 harness files and old installer/generator unchanged; five exact live literals unchanged. Unrelated tracked Workbench/architecture/root README/AGENTS/.gitignore binary-diff fingerprint unchanged.

### Next concrete decision and limits

No configured remote Herdr machine exists, so current Air links cannot be honestly reported from this environment. Run `node setup/inspect-links.mjs --pi` and the focused five-selection dry-run physically on Air, as documented. Network/unknown source blocks simple readiness: choose an actually available complete local source through a separately reviewed source/revision action before any Air relink. Code remains uncommitted/unpublished, so old HEAD alone does not contain the new utility.

Air handoff, canonical source promotion/old installer+generator+lock/docs consumer transition, per-package computer ownership and retained SMB/recovery disposition are separate gates. No source relocation/deletion, live Stow/software/settings/Todo/private-override/credential operation, Air change, Workbench edit, commit or push was performed overnight. Do not run the generator against active shared sources or manufacture a compatibility wrapper. Only those host/consumer decisions remain; see the finite completion matrix rather than starting another audit.
