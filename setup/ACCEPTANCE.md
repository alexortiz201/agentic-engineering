# Setup implementation evidence and remaining gates

## Current mission validation — 2026-11-14

This current addendum supersedes historical absent-Air/uncommitted/staged-only statements below. The approved completion mission reused published setup baseline `8656a797` rather than rebuilding it. Main integrated the canonical-source transition only after actual Air selective handoff verification; `harness/pi/` is the sole authored resource source, and the overwrite generator is retired. Root `pi/`, exact managed locks, old installer and dirty dotfiles remain frozen compatibility/recovery consumers, not deleted or independently authored.

- Fresh Mini actual managed/version/link checks and private-state preservation baseline: [Mini report](../plans/handoffs/MINI_LIVE_HANDOFF_RESULT.md).
- Fresh Air actual runtime identity, approved source-only update, exact five-leaf transaction, local inspector and private rollback receipt: [Air report](../plans/handoffs/AIR_LIVE_HANDOFF_RESULT.md). Later loader/offline results and publication identities live in that report and the [execution record](../plans/handoffs/LIVE_HANDOFF_EXECUTION.md).
- Main independently reran strict check/build, **108/108 CLI tests with zero skips**, five real PTY scenarios and legacy Stow fixtures on the integrated source/composer candidate. Composer native Pi 1.5.2 compatibility covers loading/UI registration, 42 renderer parity cases, actual coloring, Unicode/narrow widths and native submission; [independent review](../plans/handoffs/SETUP_REVIEW_RESULT.md). This is native-renderer evidence, not a new visual eyeball acceptance; prior operator-confirmed fresh-session appearance remains retained evidence.
- Review found and reproduced defaults/theme receipt lifecycle failures; the bounded fix is integrated after independent adversarial review. Drifted keys deliberately rebase rollback to the latest user preference, unchanged keys retain original rollback, and earlier receipts are archived privately. Main reran **129/129 tests, zero failures/skips**, strict check/build, five PTYs and legacy fixtures; [fix evidence](../plans/handoffs/SETUP_REPEATABILITY_RESULT.md), [independent ACCEPT verdict](../plans/handoffs/RECEIPT_FIX_REVIEW.md). Selected-but-unrun operations retain the low-severity `skipped` display label after an explicit failure; no execution continues.
- External `backup-v1` is absent on both hosts. Existing local private rollback receipts and native recovery material are retained. No destructive source/computer/backup retirement is authorized by this observation.

The remaining sections are preserved chronological evidence. Their historical “do not repeat” acceptance boundaries do not erase the fresh controlled checks explicitly authorized by the current mission. No broad HOME restore, runtime upgrade or general computer-config transition occurred.

## Current topology and Air evidence — supersedes earlier preparation assumptions

Both Macs intentionally use `/Volumes/DevDrive/Projects/agentic-engineering` as the shared active development workspace. Air's separate local checkout remains the accepted offline Pi resource owner. The operator has already accepted Air runtime/cold resource loading with network and `/Volumes` denied; **do not repeat those checks or reinstall**.

The existing Air agent read the shared handoff file and wrote [local checkout evidence](../plans/handoffs/AIR_LOCAL_CHECKOUT_EVIDENCE.md), which Mini read from DevDrive. Local `main` is clean at `e9c0a625`, local filesystem, all five links resolve into its local `pi/` and hashes match the accepted resources. Harness/setup/CLI files are absent both at HEAD and untracked. An SMB-root inspector warning was a cross-checkout comparison, not broken/unmanaged ownership. No live change occurred.

The [current publication plan](../plans/handoffs/SHARED_DEVDRIVE_PUBLICATION.md) records Git scope and separate approvals for publication, optional local source fast-forward and optional local-to-local five-leaf handoff. Earlier unobserved-Air/empty-remote/fresh-runtime-check statements below are historical preparation, not remaining acceptance gates.

## Delivered source scope

- `cli/`: functional standalone TypeScript/Clack setup, three data-driven profiles, per-component three-state actions, removal scopes/review, revise/preview/approval, deterministic plan and bounded execution/verification.
- `setup/computer/`: tracked-file-only portable import of six existing Stow packages plus existing Brew/npm/Bun inventories, with explicit local identity/host overrides and source provenance. No old dotfiles files changed.
- `harness/pi/`: generated, selective, byte-identical portable Pi resource candidate. Root `pi/` and `scripts/install-pi` are unchanged; final move is deliberately deferred while live targets depend on them.
- `setup/resources/foundations/`: optional harness-independent reference link to canonical knowledge, not a copied Workbench or harness discovery collection.
- `setup/bootstrap/setup`: checkout-local Node/npm bootstrap; no Pi/Herdr/Homebrew dependency.
- `SETUP.md`, ownership/CLI/migration documentation, and updated root ownership instructions. Existing README/architecture/Workbench development was not edited by this work.

## Executed checks

| Source | Check | Observed result |
|---|---|---|
| executed | `npm --prefix cli run check` | Exit 0; strict TypeScript checks |
| executed | `npm --prefix cli run build` | Exit 0; compiled standalone entrypoint |
| latest independent integration rerun | `npm --prefix cli test` | Exit 0; **63 tests passed**, zero failures/skips (48 existing + 12 Pi inspection + 3 computer provenance) |
| independently rerun by Pi | `python3 cli/tests/terminal-probe.py` | Exit 0; five real 140-column PTY scenarios: 15-selection bulk/back/profile, guided removal all scopes/back, existing-machine recommendations/Escape, blocked unsafe-parent cleanup, Ctrl+C. Bulk applies only fixture no-ops plus an approved fixture profile receipt; other scenarios preserve fixture state. |
| independently rerun by Pi | all five PTY scenarios at 106 columns (inline `struct.pack` override) | Exit 0; asserted all five terminal sizes were changed from 140 to 106 columns; same navigation/safety assertions pass. No source/control changes required. |
| executed | `node scripts/install-pi.test.js` | Exit 0; existing accepted whole-package Stow regressions unchanged |
| executed | `sh -n setup/bootstrap/setup` | Exit 0 |
| executed | Zsh syntax checks and all six computer Stow packages | Exit 0, included in source tests |
| executed | `git diff --check` | Exit 0 for tracked changes; new authored text separately checked for trailing whitespace |
| inspected | `command -v ae` before implementation | No command on this Mini; other hosts must recheck |
| inspected, before handoff | Mini Pi/config symlink topology | Pi resources resolved into root `pi/`; computer links resolved into old dotfiles. Five Pi resource leaves subsequently handed off as recorded below; computer ownership unchanged. |
| asserted | Both Macs' completed Pi migrations are accepted at `e9c0a625` | Operator clarification; older Air before-state is not current evidence |

The tests cover fresh and existing profiles, overrides/profile persistence, selective discovery leaves, genuinely missing components, repeat/no-op behavior, exact Todo cache pin/update, defaults/theme rollback receipts, actual Stow installation/removal, paired application/configuration removal, dependency protection/order, ambiguous/dangling/parent symlinks, package identity checks, missing authorization, stale previews, partial failures, private settings/auth/session/note preservation, fixture source handoff/rollback, local offline resource resolution, deterministic staging and bootstrap success/cancellation/checksum failure.

Homebrew and native Pi **mutations** use isolated command fixtures. Actual GNU Stow runs against temporary homes. Bootstrap's full download/extraction path uses a local fixture archive and real SHA-256/tar, not a real Node download or privileged install. Real command entrypoints and PTY prompts run without launching Pi, extra agents or Herdr panes. Python is an optional development PTY probe dependency, not a setup runtime dependency.

## Failures found and repaired

Initial tests caught a missing optional reference Brewfile, macOS `/var` versus `/private/var` source comparisons, removal dependency order and a partial-failure test's incorrect execution-order assumption. Follow-up checks caught a strict environment typing error and Homebrew's incidental cache creation even during metadata inspection. These were repaired; metadata runs now use disposable HOME/cache/log paths. A first raw PTY probe had zero terminal columns and could not match rendered prompts; a configured 120-column PTY passed, and the reproducible optional probe now sets its dimensions. No failure was waived or hidden by disabling a supported safety check.

The engineering addendum was applied without restarting the implementation: explicit typed `SetupSession`, concise CLI-local conventions and extension examples, and direct frozen-input planner-purity and skipped-no-effects tests. No state framework, test-runner migration or extra dependency was introduced.

A separate local safety review tightened Todo identity matching (similarly named packages are not owned), verified managed Pi receipt/release identity/permissions, preserved executable imported helpers, aligned the shell package's explicit Stow ignore contract, and added actual source-only rollback and independent Foundations tests. No second agent/reviewer invocation was used.

## Engineering lead review and current Mini preview

Pi independently inspected the handoff against the current files, rather than accepting the report as evidence. HEAD is still `e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354`: Claude did not create a new commit. The new setup/CLI/harness source is untracked; unrelated tracked Workbench/README/architecture changes remain separate. Review applies to this inspected working tree, **not** a published deployment revision.

Independent rerun: strict check, build, **48/48 tests**, five PTYs at both 140 and 106 columns, existing Pi fixtures, bootstrap shell syntax and tracked whitespace checks passed. Code review confirms visible recommendations, separate observed/action labels, direct tri-state selection, persistent Backspace/profile overrides, current→no-op planning, verified legacy ownership distinct from unknown conflicts, explicit removal consent and final apply approval. The blocked cleanup catch returns to scope selection; no execution ownership check was relaxed. No acceptance-blocking CLI defect was found.

Actual Mini read-only command:

```sh
sh setup/bootstrap/setup --dry-run --json --profile mac-workstation
```

Observed: **13 selections; 9 no-ops, 4 conflicts, 45 skips**. All six computer configurations are verified legacy-dotfiles migration candidates; all five Pi resource packages are accepted-root-Pi migration candidates. Pi runtime **1.5.2**, defaults and native Todos **1.1.0** remain current. `node setup/inspect-links.mjs` output was identical before/after preview (known link targets, regular configuration digests/modes and absence records). This is bounded inventory evidence, not a claim of a complete HOME/credential audit. No apply, prerequisite download or dependency installation was performed.

Claude Code: the detector only runs `which claude` and that path's `--version`; it does not read settings/auth/sessions. Missing/failed-version and safe manual planning are tested. Neither `claude-code` nor `brew-claude-code` is recommended by a profile. On this Mini, PATH resolves `~/.n/bin/claude`, but direct execution of `--version` returns **ENOEXEC**; status is correctly **unknown**, not verified current. Its Homebrew receipt is absent. The existing running Claude pane does not establish the health of a new PATH invocation. Do not install a second copy or repair the live launcher as part of wizard acceptance. No credential refresh is needed or authorized. Version pinning, optional profile recommendations and manager reconciliation remain separate decisions, not prerequisites for this dry-run.

**Decision:** implementation/fixture acceptance passes. The operator has now confirmed Mini Ghostty interactive acceptance below; all live ownership changes remain separately approval-gated. Existing accepted Mini/Air Pi installations are not being remigrated.

## Mac mini interactive host acceptance — confirmed

Operator confirmation received **2026-11-14**: both workstation-profile and 15-component bulk-selection dry-runs passed in Ghostty. Confirmed visible profile recommendations, direct tri-state actions, Backspace navigation, preserved selections, bulk review without per-component action prompts, conflict explanations and **no live changes**. This accepts the wizard's Mini interactive behavior, not a source handoff, runtime/package operation, Air deployment, physical Pi relocation or dotfiles retirement.

Preparation record, **before subsequent explicit approval**: the five existing Pi resource leaves only. Read-only revalidation found each live link owned by operator UID 501, all parents real directories, root/staged bytes identical to accepted HEAD `e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354`, equal source modes 0644, and exactly one file per selected package. Both Workbench Skill source locations identify the same repository and existing canonical Workbench paths. A native-Stow temporary-home rehearsal passed old-owner conflict refusal, explicit fixture detachment, no-write simulation, exactly five new links and guarded rollback restoring original literal links/content. No live links were detached.

See the [exact approval manifest and rollback](MIGRATION.md#mini-five-link-approval-manifest-prepared-not-executed). Target candidates remain untracked; their recorded content digests, not HEAD alone, identify the working-tree source. The operator subsequently explicitly approved this exact Mini-only five-link transaction; execution evidence follows.

## Mac mini five-link Pi source handoff — applied and verified

**Explicit operator approval received and executed 2026-11-14 at 04:20 UTC.** Scope: only the five Pi resource leaf links in the approved manifest, plus a private link-metadata rollback receipt. No broader CLI apply was run.

- Immediately before mutation, rechecked all five old literal targets/realpaths, operator UID 501, real parent directories, regular root/staged source files, mode 0644, exactly one file per selected package, and recorded SHA-256s against accepted HEAD blobs. Rechecked each leaf again immediately before unlinking it. All conditions matched.
- Native Stow simulation **exit 0**; selective `--no-folding --restow` for `pi-instructions pi-theme workbench-skill study-skill composer` **exit 0**. All five live literals now point into their approved `harness/pi/packages/<package>/` sources. Post-apply source/link hashes, realpaths, ownership and modes all match the manifest. Both source trees remain intact.
- Native Pi **1.5.2** loader checks passed before and after: global AGENTS context content; both Skills discovered with zero diagnostics; Purple Dreams loaded with Pi's full theme-schema validation; composer imported through Pi's extension loader and its startup handler registered the editor factory against an isolated UI receiver. Workbench Skill resolves the same repository and canonical Workbench paths.
- Loading verification used the existing runtime's resource functions in a short-lived Node process, **not a new agent/session**. Jiti disk cache was disabled. No model calls, settings/session APIs, application reload or live UI replacement. This proves resource loading/registration; separate operator fresh-session acceptance is recorded below.
- Unselected known link/config inventory—including settings digest and computer config links—was identical before detachment, after apply and after loading verification. Credentials/sessions were not read, copied or restored. No Todos, private overrides, Workbench source/overlays, general computer config, runtime/PATH, reporter, Claude executable or Air operations were performed. Active sessions may append their own records independently.
- Private rollback receipt: `~/.local/state/ae/handoffs/mini-pi-five-20261114T042028.825620Z/manifest.json`; accompanying `result.json` records successful verification. Receipt directory mode **0700**, both metadata files **0600**. Original literal targets and hashes are retained. **No rollback needed.** The targeted five-leaf rollback remains available; no blanket Stow delete or HOME snapshot restore.

**Fresh-session host acceptance confirmed by the operator, 2026-11-14:** the operator opened a fresh Pi session in a separate Herdr pane and successfully tested the migrated resources, including the composer extension. Combined with the earlier native loader and target/content checks, **five of five approved symlinks are migrated and Mini runtime acceptance is complete**. No rollback was required. Credentials, settings, existing sessions, Todos, private overrides and unrelated configuration were preserved; the user's acceptance session is a deliberate new session, not migration-driven restoration or rewriting of existing session files.

**Stop for review:** this approved Mini slice is complete. No source relocation, staging regeneration, legacy retirement, Air migration, commit or push occurred. Root `pi/` remains authored authority; the untracked staged files are now live Mini dependencies and must not be removed/cleaned/regenerated casually. Keep checkout/source paths stable. Further configuration/Air/source-layout actions require separate approval.

## Overnight safe implementation and integration — 2026-11-14

### Implemented, not merely planned

- **Pi:** extended the existing `setup/inspect-links.mjs` with additive `--pi [--home EXISTING_HOME]` mode. Fixed five-leaf evidence includes actual/prospective literals, operator ownership, modes/hashes, accepted Git-blob equality, package scope, native managed metadata/PATH resolution, inherited profile-override presence (values never disclosed), canonical Workbench completeness and source filesystem locality. Parent checks proceed top-down and never follow an unknown discovery parent. The mode does not read settings/auth/sessions or launch Pi/Stow/package resolution; it writes no report/receipt automatically and accepts no apply flag. Diagnostic exit 0 is not approval; JSON readiness/blockers are explicit.
- **Pi:** added `cli/tests/pi-inspection.test.ts`, **12 tests**: old/new/foreign ownership, missing/unsafe parents, content/baseline/permissions/package-scope failures, metadata mismatch, absent/redirected Workbench, mocked SMB locality blocking, no-private-state/no-effects boundaries, argument refusal, native selective Stow fixture handoff/legacy re-adoption refusal/targeted rollback, and canonical verification after removing only the disposable fixture's root `pi/`. That last case removes a future old-filesystem dependency from the new verification mechanism; real root sources remain intact.
- **Claude, existing pane `w7:p28`:** accepted exclusive file ownership, added `cli/tests/computer.test.ts` with three controlled computer provenance cases (verified legacy migration, missing provenance/missing target, mismatched provenance/conflict), updated `SETUP.md` private-include/parent-conversion guidance and `setup/OWNERSHIP.md` current host state. No adapter/runtime/source-file changes or dotfiles writes were needed or made. Claude released ownership before Pi integration; no additional agents or overlapping edits.
- **Pi integration review:** corrected documentation that incorrectly implied local includes clear migration ownership or shell paths are always leaf-only. Clarified that new portable templates, not necessarily existing live files, include the private override paths. No private override is created for a dry-run. Added exact Air commands, the host-specific/offline gate and finite dependency-ordered legacy entrypoint dispositions to `setup/MIGRATION.md`. Existing handoff artifact records the actual split and result.

### Independent executed evidence

| Check | Observed result |
|---|---|
| Strict TypeScript / build | Both exit 0 |
| Full CLI suite | **63/63 pass**, zero failed/cancelled/skipped |
| Real terminal regression | All five scenarios pass at **140 and 106 columns**; all five narrower dimensions asserted |
| `node scripts/install-pi.test.js` | Existing legacy Stow fixture passes unchanged |
| Actual `node setup/inspect-links.mjs --pi` on Mini | APFS/local, managed 1.5.2 topology verified, **5 selective leaves, `handoffNeeded: false`, zero blockers**. No new loading/visual claim; prior accepted fresh-session evidence reused |
| Actual bootstrap headless five-resource dry-run | Exactly **5 no-ops / 53 skips / zero conflicts**; settings digest unchanged |
| Protected source baseline | All **13 root Pi + 8 harness Pi files**, legacy installer and generator hashes unchanged; five exact live literals unchanged |
| Unrelated tracked work | Binary-diff fingerprint for Workbench, architecture, root README/AGENTS and `.gitignore` unchanged from start of this overnight slice |

The inspector's first targeted run exposed a bottom-up parent-check defect; it was fixed to top-down checks, and the unsafe-parent regression now passes. No failure was waived. Tests use disposable homes and controlled Git/package boundaries; no test commits in the real repository or source staging generation against active packages.

### Actual remaining boundary

- **Air:** no configured remote Herdr machine was available; exact current Air targets, source mount type and offline behavior remain **unobserved**. The implemented read-only report and five-selection dry-run are ready to run physically on Air. Do not infer its state from Mini/shared source availability. Network/unknown source prevents simple readiness; local complete source selection and host approval come first.
- **Root Pi authority/cleanup:** all 13 files, legacy installer, generator and old support paths remain unchanged. Known staging/lock/recovery/dotfiles readers still require one approved coordinated consumer transition after Air evidence, not unilateral source moves or duplicate lock archives. New canonical verification itself does not require root files once the links are selective.
- **Computer/dotfiles:** supported six-package/selected Brew mechanisms already live in canonical setup. Actual private includes, folded parents, config ownership and retained SMB/recovery artifacts require named host/disposition approvals. No obsolete whole-home bootstrap or wrapper was invoked/added. Unknown/unsupported global npm/Bun/MAS/VS Code/service behavior is not claimed implemented.

**Only repository-local implementation/tests/docs changed overnight.** No live Stow, symlink/runtime/package/default/Todo/private-override change, Air execution, Workbench edit, old-source relocation/deletion, commit or push. Active Pi/Claude harnesses may naturally append their own session records; no migration command reads/restores/rewrites those private trees. All work remains uncommitted on the original branch. Proceed with the [Air evidence gate](MIGRATION.md#next-host-decision--air-five-link-readiness); do not repeat Mini acceptance.

## Not accepted or not implemented

This is **not full definition-of-done acceptance** for unattended end-to-end fresh-Mac provisioning or repository retirement. Remaining boundaries are explicit in the CLI operation matrix:

- New/changed official Pi runtime installation/removal, Homebrew bootstrap and Oh My Zsh installation remain manual. Existing accepted installations are reused. Missing dependencies block affected plans, not faked as installed.
- Homebrew fresh selections are unversioned manifest installs; upstream upgrade/adoption and exact accepted-version Homebrew updates are not implemented. Privileged/interactive or long-running package installs may need separately approved manual preparation.
- Herdr Pi reporter generation/removal remains manual ownership review; presence does not prove generator identity/runtime loading.
- Full cleanup is an evidence-based review with owned-leaf removal, **not recursive purge**. Ambiguous caches/data, credentials, sessions, personal notes and shared dependencies stay intact. Unsupported artifacts are reported.
- MAS/VS Code/global npm/Bun bulk provisioning, tap bootstrap, Node-manager ownership reconciliation and Air SMB services are not wizard mutations.
- Final physical `pi/` relocation, old installer/caller retirement, mixed parent-directory link conversion, general computer configuration handoff and Air source handoff are not performed. Only the explicitly approved Mini five-resource slice above is applied. Generated staging is temporary, never a second authored authority.
- Current Air source topology, cold offline/reconnect operation, Air application loading/rendering, privileged package execution and Air's new source-layout acceptance require separate approval and observations on that host. Mini's five-link native loading and fresh-session resource acceptance are complete; older Air preparation reports do not supersede the operator's accepted baseline.

Before the separately approved five-link slice above, implementation made no live symlink changes. The complete work has performed no commits, pushes, branch changes, resets/stashes, credential/session mutations, unrelated upgrades, active installer relocations or old-repository retirement. Project-local CLI dependencies and ignored build output remain the only actual dependency/build installation; the later authorized deployment changed exactly five resource links plus private receipt metadata.

Read-only physical-relocation preparation subsequently confirmed all 13 old root-Pi files remain unchanged from accepted HEAD; six have exact staged counterparts, while documentation/locks and the old Stow ignore contract are not redundant. All five Mini links remain correct. Two targeted staging/source tests and the existing old-installer fixture pass. The known external dotfiles entrypoint and unverified Air source-layout dependencies prevent declaring the old tree safe to remove. See the [relocation dependency hold](MIGRATION.md#physical-pi-source-relocation-proposal-not-approved).

**Shared-source clarification and narrow dependency check:** the operator confirmed Mini/Air share DevDrive sources; earlier independent-clone descriptions are not evidence of current topology. The previously proposed six metadata moves and generator retirement are withdrawn. A disposable seven-file source passed direct legacy installer and actual dotfiles-entrypoint plan/apply/repeat/removal checks, proving linking mechanics only. The generator still reads the old managed `package.json` and fails after copying five resources if it is absent; current instructions/tests still support that workflow. Both managed files remain documented verification/audit inputs, and old README/Air/recovery paths have known cross-repository links. All 13 root files, the generator, installer and current authority classification are therefore retained unchanged; no extra copies/authoritative sources were created. Two targeted staging tests pass, and 5/5 live Mini literals/hashes remain unchanged. No Air execution, live regeneration, relocation, deletion, Workbench edit, commit or push. No physical relocation subset is cleared for approval until these named support/shared-source dependencies are resolved.

See [`MIGRATION.md`](MIGRATION.md) for exact destinations, per-host inventory, guarded handoff/rollback and retirement conditions. Approval must name the host, reviewed revision, selected paths and actions; source implementation alone grants no deployment authority.
