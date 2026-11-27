# Approval-gated source handoff and dotfiles retirement

## Latest resume checkpoint

[Current consolidation report](LEGACY-RETIREMENT.md#consolidation-checkpoint):
`setup/` is the canonical workstation source; dotfiles is temporary compatibility
and recovery material pending archival. Air's saved release, canonical Stow
payload, and local SMB boot files were restored with legacy-source and network
access denied. Launchd/Finder/Keychain remount recovery and the disposition of
fresh legacy release staging are not yet accepted. Finish the remaining gates
before any approved archive move. The dated sections below preserve earlier
decisions and are not current deployment instructions.

## Earlier execution status — 2026-11-14

The current mission explicitly authorized bounded completion and main publication after validation. Both Macs' five selective leaf handoffs are now verified: [Mini evidence](../plans/handoffs/MINI_LIVE_HANDOFF_RESULT.md), [Air execution](../plans/handoffs/AIR_LIVE_HANDOFF_RESULT.md). Air's local source-only update and link transaction preserved old bytes/private state and require no runtime reinstall. Main verified the source-transition gate and integrated the canonical `harness/pi/` workflow; overwrite-prone generation is retired. All 13 root files and the old installer remain frozen for named compatibility/recovery consumers, **not** independently authored source. General computer configuration, dirty dotfiles, SMB services and destructive source retirement remain untouched. Older pending/unapproved statements below describe prior checkpoints, not the current handoff outcome. New live changes still require exact scope and immediate checks. See [current execution decisions](../plans/handoffs/LIVE_HANDOFF_EXECUTION.md).

**Do not execute live mutation steps without approval for that host and exact paths.** Both Macs' Pi migrations are completed and accepted at baseline `e9c0a625`. Do not repeat them. Root Pi and dotfiles sources remain in place. Initial implementation prepared replacement source and a setup CLI; the subsequently approved Mini five-link resource ownership slice below is now applied and verified. Other handoffs, physical Pi relocation and dotfiles retirement remain separately gated.

## Prepared canonical source transition

**Source-policy amendment, now integrated after Main verified Air's selective ownership handoff.** The preparation below records its bounded scope; integration does not authorize automatic live changes, synchronization, packages or dotfiles operations. The earlier staging/authority holds and relocation proposals below are historical checkpoints, superseded **only** for this bounded source-workflow transition.

- `harness/pi/` becomes the sole authored resource/seed/acceptance-metadata source. Five package files, seed and accepted pins/baseline remain byte-identical. Edit canonical sources directly in future separately reviewed work; never mirror them into root `pi/`.
- Retire `setup/stage-pi.mjs` and its regeneration/equality tests together. Canonical source tests instead validate exact selective inventories, metadata/seed agreement and isolated Stow install/repeat/remove without legacy root sources. No generator may overwrite active resources.
- Retain **all 13 root Pi files unchanged**, including old resource/seed/ignore paths, all four historical Markdown files and both exact managed-lock files. Retain `scripts/install-pi`, its regression fixture, old-root conflict diagnostics and handoff/rollback fixtures. These are frozen compatibility/recovery inputs, not independently authored duplicates.
- Named retained consumers: Air's local old links until its independently verified handoff; dirty dotfiles `.no-stow/scripts/pi-resources` and its delegated installer; old-root ownership diagnostics/fixtures; documented official-runtime comparison/audit and historical setup/recovery navigation. No dotfiles consumer is declared retired. A completed Air link handoff alone does not clear these support consumers.
- Root source/installer/docs/lock removal or relocation still needs separate exact approval, named consumer disposition and retained recovery. No wrapper, copied lock authority, new deployment mechanism or runtime reacceptance is introduced.

Checks use isolated dependencies and temporary homes; existing Mini resources and accepted runtime/offline behavior remain untouched. Rollback before integration is simply to decline this candidate. After any approved integration, revert only this source-policy/test/generator-retirement patch after checking intervening changes; do not regenerate resources or restore HOME. All legacy paths and existing private link receipts remain available. Main owns cross-host synchronization and exact live actions. See [candidate implementation and evidence](../plans/handoffs/SOURCE_TRANSITION_RESULT.md).

## Next host decision — Air five-link readiness

Mini acceptance is **closed**. The operator also confirms Air runtime and cold loading with network and `/Volumes` denied are **accepted**; do not repeat or reinstall. Current direction and exact publication proposal: [shared DevDrive handoff](../plans/handoffs/SHARED_DEVDRIVE_PUBLICATION.md). Both machines intentionally use DevDrive as the active project workspace; Air keeps its local checkout as offline Pi resource owner. These are distinct roles.

The existing Herdr **Air** Pi agent read the shared handoff and produced [actual local-checkout evidence](../plans/handoffs/AIR_LOCAL_CHECKOUT_EVIDENCE.md). Local root `L=$HOME/Github/agentic-engineering` is clean on `main` at `e9c0a625`; all five accepted links resolve into `L/pi/`, with the accepted hashes below. Its filesystem is local. No local harness/setup/CLI files exist at HEAD or untracked. SMB-root inspector warnings were cross-checkout comparisons, **not** evidence of unmanaged/broken Air resources. Publication and optional local Git synchronization—not runtime acceptance—are the next decisions.

### Recorded Air evidence and later source-only verification

The completed Air report already covers revision/status, local storage, real parents, five current resolved targets/hashes and candidate absence. Do not repeat it merely to reconfirm accepted runtime behavior. After an **approved Git update** has actually added the source files to L, a local metadata-only source check may use:

```sh
L=$HOME/Github/agentic-engineering
node "$L/setup/inspect-links.mjs" --pi
```

Do not run that command before the absent local script/manifest have arrived via reviewed Git. Do not use the SMB script's own root as Air's runtime owner.

`--pi` is now implemented on the **existing read-only inventory entrypoint**. It reports exactly five current literals, prospective literals/paths, UID/modes/SHA-256, accepted Git-blob equality, unexpected package leaves, managed runtime metadata/PATH resolution, inherited profile-override presence (without revealing values), canonical Workbench/Foundations presence and source filesystem locality. It does **not** load Pi, read settings/auth/sessions, refresh packages, execute Stow or write a receipt. Exit 0 means a diagnostic report was produced, **not** acceptance: inspect `blockers`, `readyForApproval`, `handoffNeeded` and each resource row. Unknown/foreign targets, unsafe parents, absent leaves, changed content, writable/unowned sources, incomplete Workbench or a network/unknown source block a simple handoff. Already-selective leaves are reported without requesting a relink; their accepted-content verification uses Git blobs and does not depend on retaining the old root resource copies. Root files are read only for currently old-owned leaves. Other old checkout targets are recorded but deliberately require explicit ownership reconciliation.

No bootstrap/dependency installation or repeated wizard/runtime acceptance is required for this source-only alignment. Review the scoped commit/publication plan first. The optional later five-link handoff uses native selective Stow, not broad CLI apply; keep defaults, preferences, Todos and all private state unchanged. Do not unlink, Stow, run a legacy installer or regenerate staging without its separate exact approval.

### Shared DevDrive/offline gate

Shared DevDrive is intentionally the active development tree on both Macs; SMB on Air is acceptable **for project work**, not a proposed Pi resource target. Air's existing complete local checkout and cold offline behavior are verified/accepted. Keep its links local. `--pi` conservatively blocks network-backed runtime-source proposals; it does not invalidate an accepted separate local owner.

New CLI/harness changes are uncommitted in DevDrive and absent from the local Air checkout. Publish only approved migration files through Git; then, if separately approved, fast-forward L to the exact reviewed commit while retaining all old root files. No new clone, copy/deployment wrapper, synchronization service, mount change or runtime operation is needed. An optional local-to-local path handoff requires only migration-specific filesystem/content verification; **do not repeat accepted runtime, fresh-session or cold-loading tests**.

### Five paths for the later exact Air approval manifest

For Air resource ownership, `A=L=$HOME/Github/agentic-engineering`, **never DevDrive**. Current resolved targets are known: `L/pi/.pi/agent/<suffix>`. New local packages are absent until approved Git synchronization. Exact old literal strings remain private and must be captured/reverified immediately before any separately approved handoff; do not guess their relative spelling.

| Air destination under its actual HOME | Proposed source under approved A |
|---|---|
| `.pi/agent/AGENTS.md` | `harness/pi/packages/pi-instructions/.pi/agent/AGENTS.md` |
| `.pi/agent/themes/purple-dreams.json` | `harness/pi/packages/pi-theme/.pi/agent/themes/purple-dreams.json` |
| `.pi/agent/skills/workbench/SKILL.md` | `harness/pi/packages/workbench-skill/.pi/agent/skills/workbench/SKILL.md` |
| `.pi/agent/skills/agentic-engineering/SKILL.md` | `harness/pi/packages/study-skill/.pi/agent/skills/agentic-engineering/SKILL.md` |
| `.pi/agent/extensions/composer-highlight.ts` | `harness/pi/packages/composer/.pi/agent/extensions/composer-highlight.ts` |

Only after approved Git synchronization has supplied the local candidates, reviewing their equality and obtaining **Air-specific five-leaf approval**: create a new private Air receipt (0700 directory/0600 link metadata), reverify the five exact literals/UIDs/real parents/source hashes immediately, detach only matching old leaves, and preflight all selected packages together. Parent-directory links or different ownership require a separate exact conversion/reconciliation plan, not the simple five-leaf process. The existing command, **not authorized to run now**, is:

```sh
# A is the approved actual Air source root; only after approved, verified old-leaf detachment.
stow --dir="$A/harness/pi/packages" --target="$HOME" --no-folding --simulate --restow \
  pi-instructions pi-theme workbench-skill study-skill composer
# Remove --simulate only after successful scope-matching preflight and explicit host approval.
```

Use source-only Stow, not broad CLI apply: no defaults/theme-key/Todo/profile receipt or runtime operation. Verify only the five new literals/realpaths/locality/hashes against the accepted bytes; retain existing runtime/offline acceptance without a new loading/session/model test. Rollback uses **Air's own** recorded old literals: remove only matching new leaves, restore only into absent destinations, refuse changed/unknown paths, keep source trees and private receipt. No credentials/settings/sessions/Todos restoration or unrelated process teardown. Mini's completed links are never part of Air rollback.

## Dependency-ordered consumer completion

Air evidence is now recorded. The next action is approval of the scoped publication proposal, followed by optional approved local fallback synchronization. No runtime reacceptance, root-source move, generator invocation or dotfiles mutation is required. Keep all 13 root Pi files, legacy installer and generator intact until the approved consumer transition.

| Order / dependency | Existing consumer and required disposition | Existing canonical mechanism / approval boundary |
|---|---|---|
| 1. Air evidence — complete | Clean local `main` at `e9c0a625`, five accepted local old targets/hashes, absent new packages; runtime/offline acceptance retained | Durable Air report, no repeated bootstrap/runtime checks. General computer configuration is **not** a prerequisite |
| 2. Scoped publication and optional local source update | Commit/push only approved migration allowlist; then exact reviewed-commit fast-forward into clean L, if approved | [Publication handoff](../plans/handoffs/SHARED_DEVDRIVE_PUBLICATION.md); one shared Git writer, no checkout/reset/automatic pull. No live link change |
| 2a. Optional Air source-layout handoff | Only after local candidates exist, equal accepted bytes and exact five-leaf approval is given | Local-to-local selective Stow and private link-only receipt/rollback. Already accepted runtime/offline behavior is not retested |
| 3. Final Pi-consumer transition, not an Air-link prerequisite | dotfiles `.no-stow/scripts/pi-resources` → canonical selected setup/Stow instructions; `scripts/install-pi` and fixture → existing selective tests; generator and its source tests → canonical source validation; old managed-lock/docs → preserved new paths with supported verification/recovery references updated in the same approved change | Retire obsolete entrypoints rather than add forwarding shims. Keep them functional until their named users/docs/tests move. Root files cannot be removed merely because Air's links pass |
| 4. General computer ownership, independently gated | dotfiles `.no-stow/scripts/stow-all` and its six packages; `.no-stow/scripts/bootstrap` package/global-prefix actions | Existing `setup/computer/{git,gh,ghostty,herdr,ssh,zsh}` and selective CLI adapters replace supported Stow/Brew operations. Private includes, folded parents and per-package live ownership need exact host approvals. Homebrew/Oh My Zsh/runtime prerequisites and unsupported global npm/Bun bulk actions stay explicit manual/disposition items—not a new bootstrap framework |
| 5. Retained Air machine-specific consumers, not Pi prerequisites | `.no-stow/scripts/air-snapshot`, `install-air-home`, `install-air-smb` and `host-role` helper | Snapshot/home transaction still includes old Pi resources, settings/docs and SMB services; it must not be rerun over accepted Pi. Replace general-config use with canonical selected setup after approval. Existing release/recovery artifacts and SMB helper/LaunchAgent behavior stay locally owned until explicitly retained, migrated or declared obsolete; the wizard does not implement their service/recovery behavior. No automatic port/service wrapper |
| 6. Once-only source/repository retirement | Root Pi layout, old caller/docs/lock references, legacy dotfiles source/releases/backups | After both-host source acceptance **and** named consumer/support-path disposition: one scoped, reviewed relocation/cleanup; move preserved evidence/locks, promote existing unchanged harness paths, retire obsolete generator/installers together with references/tests. Rehearse rollback and retain recovery for agreed period. Root cleanup and dotfiles retirement each need separate approval; no commit/push implicit |

Do not turn step 5 into a new infrastructure project: capture the actual approved local ownership/disposition of those existing service/recovery artifacts. **No new runtime dependency on dotfiles is introduced by Air's Pi handoff.** Remaining old-repository dependencies are the explicitly retained computer/service/recovery owners above and the final Pi-support transition. This plan does not claim those owners have already been transferred.

## Mini Ghostty acceptance (no live changes)

**Operator-confirmed complete on Mini, 2026-11-14:** workstation-profile and 15-component dry-runs passed, including direct tri-state actions, Backspace/preserved choices, conflict explanations and no live changes. See [acceptance](ACCEPTANCE.md#mac-mini-interactive-host-acceptance--confirmed). The checklist below is retained as evidence/retest guidance, **not authorization to deploy**. Use a new Ghostty tab in the existing local checkout, not an agent input field:

```sh
cd /Volumes/<shared-volume>/Projects/agentic-engineering
sh setup/bootstrap/setup --dry-run
```

1. If bootstrap unexpectedly offers a Node download or dependency installation, answer **No** and report it. This Mini's reviewed run reused its existing Node/dependencies.
2. Choose **mac-workstation**. Confirm **13 recommendations** are visibly `[x]`, with requested action separate from observed status. Pi runtime/Todos and installed packages should show no-op; Git/Ghostty configuration, Pi theme and Workbench Skill should show **Migration required / blocked**, not newly owned/current. Neither Claude Code entry should be preselected.
3. Use Space to cycle `[ ] → [x] → [−]`; use `x`, `-`, `0` for direct action. Backspace from components must return to profile without losing explicit edits. Switching profiles may recompute untouched recommendations, never discard explicit choices. Escape/Ctrl+C cancels; do not approve installation/download prompts.
4. For the exact bulk check, cancel and start a fresh run:

   ```sh
   sh setup/bootstrap/setup --dry-run --profile custom
   ```

   Accept the custom profile. Starting at Git configuration, press **x then Down** on each of the first **15 rows** (through Todos). Confirm `15 selected`, then Enter. It must reach the plan without 15 action questions. Expect migration conflicts for existing legacy resource/config links and no-ops for current components; dry-run must offer **no Apply option**. Backspace returns to the list with all 15 choices intact; Backspace again returns to profile. No repeated installation is authorized by `[x]`.
5. Optionally exercise guided removal in another custom dry-run: select only Ghostty configuration with `-`, Enter, choose **Full cleanup review**. Its folded legacy parent must produce a blocked-inspection explanation and return to removal scope, not crash or detach anything. Cancel with Escape. Scope/consent and final approval behavior also have isolated PTY coverage; do not perform a live removal to prove it.
6. Exit without changes. Report profile/choice persistence, label clarity, plan readability, cancellation and any clipping at your normal Ghostty size. Keep screenshots/inventory private if they contain machine paths. This completes **wizard visual acceptance only**; it does not accept a live source handoff or repair Claude's launcher.

Current independent Mini preview: 13 requested, 9 no-ops, 4 blocked migration conflicts; known configuration/link inventory unchanged before/after. Claude's PATH entry is found but its direct version probe returns ENOEXEC, so `claude-code` correctly shows unknown/blocked; the Homebrew cask receipt is absent. Diagnose that separately only if wanted. Do not infer from the running Claude pane that the PATH command is verified, or install a duplicate Homebrew copy to clear this label.

## Mini ownership decision and remaining scope

**Status: the five-link Pi-only slice was explicitly approved, applied and verified on 2026-11-14; see the execution record below.** The broader table retains its reviewed before/after proposal; computer configuration and Air remain untouched and unauthorized. After visual acceptance, each further slice still needs a **separate, narrowly scoped transaction**. Recommended first slice: only the five byte-identical Pi resource leaf links listed in the destination table below. Name the reviewed source revision/tree, stable local checkout, exact links, backup location and rollback route. Setup source is currently uncommitted/untracked on HEAD `e9c0a625`; it has not become a published reviewed revision. Committing/publishing a selected change set requires separate approval and must exclude unrelated WIP.

| Scope | Observed Mini before | Proposed after, only when approved |
|---|---|---|
| Five portable Pi resource leaves | `A/pi/.pi/agent/...` | Corresponding selective leaves in `A/harness/pi/packages/...`; no settings/defaults/package operation |
| Git/GH/Ghostty/Herdr/SSH/shell config | `../dotfiles/{git,gh,ghostty,herdr,ssh,zsh}/...` | Corresponding `A/setup/computer/<package>/...`, in later individually approved slices with private override review |
| Folded GH/Ghostty and shell-plugin parents | `.config/gh`, `.config/ghostty`, several `.oh-my-zsh/custom/plugins/*` point into dotfiles | Real local containers plus selected owned leaf links, **only after enumerating and approving every affected child**; not covered by leaf-only approval |
| Pi runtime, defaults/theme preference, Todos, reporter, credentials/sessions/notes | Accepted machine-local owners | Unchanged; no reinstall/login/package refresh, service changes or PATH edit |
| Claude Code executable/settings | Existing local installation; version probe unresolved; no Brew receipt | Unchanged. Optional detector is not manager migration or automatic enablement |
| Canonical Pi source layout | Root `pi/` authoritative; `harness/pi/` generated candidate | Remains staged until both host handoffs pass, then a separately reviewed physical source relocation |

`A` is this host's approved local checkout. Current Mini GH/Ghostty parents and shell plugin directories are **not** ordinary leaf links; do not apply blanket `unlink`/Stow instructions to them. Private Git identity, SSH hosts and shell overrides must be reconciled before their configuration slices. Rollback retains old literal targets and both source trees; details below. Air needs a fresh local inventory and independent approval, not a repeat of its already accepted Pi migration.

## Mini five-link approval manifest (prepared, not executed)

Historical pre-execution manifest, reverified **2026-11-14** against accepted HEAD `e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354` and the staged working tree. The heading/anchor is retained for approval references. **The operator subsequently explicitly approved this exact Mini-only manifest; all five proposed targets are now applied and verified.** Do not rerun the old-link detachment procedure as if this remained pending.

The historical table below uses a redacted volume-name placeholder. For recovery, use the exact literals from the private before-state receipt, not these examples.

| Exact live path under H | Current literal target | Proposed literal target |
|---|---|---|
| `.pi/agent/AGENTS.md` | `../../../../Volumes/<shared-volume>/Projects/agentic-engineering/pi/.pi/agent/AGENTS.md` | `../../../../Volumes/<shared-volume>/Projects/agentic-engineering/harness/pi/packages/pi-instructions/.pi/agent/AGENTS.md` |
| `.pi/agent/themes/purple-dreams.json` | `../../../../../Volumes/<shared-volume>/Projects/agentic-engineering/pi/.pi/agent/themes/purple-dreams.json` | `../../../../../Volumes/<shared-volume>/Projects/agentic-engineering/harness/pi/packages/pi-theme/.pi/agent/themes/purple-dreams.json` |
| `.pi/agent/skills/workbench/SKILL.md` | `../../../../../../Volumes/<shared-volume>/Projects/agentic-engineering/pi/.pi/agent/skills/workbench/SKILL.md` | `../../../../../../Volumes/<shared-volume>/Projects/agentic-engineering/harness/pi/packages/workbench-skill/.pi/agent/skills/workbench/SKILL.md` |
| `.pi/agent/skills/agentic-engineering/SKILL.md` | `../../../../../../Volumes/<shared-volume>/Projects/agentic-engineering/pi/.pi/agent/skills/agentic-engineering/SKILL.md` | `../../../../../../Volumes/<shared-volume>/Projects/agentic-engineering/harness/pi/packages/study-skill/.pi/agent/skills/agentic-engineering/SKILL.md` |
| `.pi/agent/extensions/composer-highlight.ts` | `../../../../../Volumes/<shared-volume>/Projects/agentic-engineering/pi/.pi/agent/extensions/composer-highlight.ts` | `../../../../../Volumes/<shared-volume>/Projects/agentic-engineering/harness/pi/packages/composer/.pi/agent/extensions/composer-highlight.ts` |

All five live links and both source copies are owned by operator UID **501**. All traversed parents are real directories, not parent links; both source copies are regular files with mode **0644**. Each selected package has exactly its one listed file. Root source bytes, staged source bytes and accepted Git blob bytes all match:

| Package | SHA-256 (same old / new / accepted blob) |
|---|---|
| `pi-instructions` | `04d5065fac818554a1326df9227254dc4d3b21c4674986172a393eb2200b763e` |
| `pi-theme` | `73d86db506f25164edf7c7266898f9c7d349778a8ca55f30b129267c7ef3805a` |
| `workbench-skill` | `f17a20f40d793552e61450478203244af34ea8ef3fcf4bc50c7409cc8d20662f` |
| `study-skill` | `0e76c36a8e1806164b33f23d668484f283bf5316e52d25d2373e71edb5545e9f` |
| `composer` | `cdfcd4ba722253d3fb9488b5a5833cac8f2f5dc14369aebe9a5161cb1eb595d1` |

Native Stow was rehearsed **only in a temporary home**: existing root-source links refused adoption; after explicit fixture-only detachment, simulation wrote nothing, installation created exactly five expected links, and leaf-only rollback restored the old literal targets and readable content.

### Exact approved write set and transaction proposal

Only after explicit approval naming this Mini manifest and source digests:

1. Recheck all five original literals/UIDs/real parents, source digests/modes, and the one-file package inventories. Stop on any difference. Keep these resources stable during handoff; no editing/regeneration or application reload during the short link transition.
2. Create a new private metadata receipt at `H/.local/state/ae/handoffs/mini-pi-five-<UTC>/manifest.json` (new private directories 0700, manifest 0600; refuse symlinked parents/occupied receipt). Record the five old/new literal targets, hashes and source revision. This is link metadata only: **no settings/auth/session backup or copy**. Receipt creation is itself gated; it has not happened yet.
3. Recheck and unlink **only** the five matching old leaf symlinks, never their target files. Existing real containers stay in place. Do not run broad CLI apply, which could reconcile theme/settings or save a profile.
4. Preflight all five packages together with native Stow, then apply the identical command without `--simulate` only if it matches the manifest:

   ```sh
   stow --dir="$A/harness/pi/packages" --target="$H" --no-folding --simulate --restow \
     pi-instructions pi-theme workbench-skill study-skill composer
   ```

   The transaction has a brief detached-link window; it is **not atomic across five links**. On any simulation/apply failure, stop and use the targeted rollback below. No application restart/reload, service command or package-manager operation is part of this approval.
5. Verify exactly the five proposed literals/realpaths and their recorded hashes. Retain both source trees and the private receipt. Root `pi/` remains authored authority; do not regenerate/edit either resource copy during the handoff. Source relocation/staging retirement still waits for both-host acceptance and separate approval.

**Untouched:** credentials; Pi/Claude settings and private overrides; active sessions and notes; Todo declarations/cache/version; Pi shim/runtime/version/PATH; Herdr reporter/Skill/state; Claude executable; general computer configuration; all legacy dotfiles; Air. No backups/restores of those private trees, no `pi install/remove`, no Brew/npm install, no Git commit/reset/stash/checkout/push or source move.

**Workbench isolation:** no write under `A/workbench/`, its local overlays, or its ongoing plans/implementation. Both old/new Workbench Skill files are byte-identical, and Git root discovery from either gives the same A; `A/workbench/README.md` and Foundations remain the same canonical paths. This is a discovery-link change, not a Workbench source or state migration. It cannot overwrite the ongoing Workbench changes within this exact write set. No agent/session is restarted; active sessions may naturally append their own records independently of this operation. If the resources or affected destinations change concurrently, abort rather than forcing the handoff.

### Five-link targeted rollback

Do not invoke blanket Stow deletion or restore a HOME snapshot.

1. Stop further operations; keep the receipt and both source trees. Reverify old source content against the recorded hashes before relinking it.
2. For each of the five paths, if it is still the recorded old link, leave it alone. If it is exactly the recorded new symlink (and new source hash matches), unlink **that leaf only**. If it is absent after a failed detach/apply, proceed to restoration. Any other file/link or changed source means **stop for manual review**, never overwrite.
3. Only into an absent destination (`lstat`/`lexists`, including dangling links), recreate the exact **old literal string** from the table/receipt using `symlink`/`ln -s` **without force**. Do not remove containers or follow/delete any source. Repeat only for affected approved leaves.
4. Verify all five old literals, old resolved paths and resource hashes. No settings/theme preference/Todos/auth/session restoration is needed because none was changed. Workbench source/WIP and both source trees stay intact.

**Approval status:** the operator explicitly approved and Pi executed this Mini-only five-resource-link handoff and private metadata receipt against the exact digests above. The staged destination is still untracked; approval does not authorize commit/publication or imply HEAD contains it. No general configuration migration, Air handoff, physical Pi relocation or legacy retirement is included.

### Mini execution record — 2026-11-14

- Final all-five precheck and per-leaf immediate recheck matched the manifest: exact old literals, UID 501 ownership, real parents, source modes 0644, package inventories and accepted SHA-256s. Only those five old symlinks were unlinked; source files/containers stayed intact.
- Native Stow simulation and selective apply both exited **0**. All five new literal targets, resolved sources, hashes, modes and ownership verified after apply and again after loading checks.
- Native Pi 1.5.2 resource loading passed before/after: AGENTS context, both Skills with zero diagnostics, full-schema Purple Dreams validation and composer extension import/startup editor-factory registration. Workbench Skill still identifies the same canonical checkout/Foundations. These were isolated loader checks, not a new agent session or live UI reload; Jiti disk cache disabled, no settings/session/model APIs invoked.
- Unselected known config/link inventory, including settings digest and general computer links, stayed identical across handoff/loading verification. No credentials/sessions were read or backed up. No Todos/private overrides/Workbench source/Air operation.
- Private rollback receipt records `applied-and-verified`, five verified links and no rollback. Do not copy over later changes; no rollback was necessary.

**Mini slice complete; stop for review.** All five proposed literals in the table are now the current Mini literals. Root `pi/` stays authored authority; both trees are retained. The staged untracked files are now live Mini dependencies: do not remove/regenerate/move them or change checkout paths casually. No physical relocation, legacy retirement, Air migration, commit or push was performed. Future actions need separate approval.

## Preparation (read-only on each host)

1. **Both machines use the same DevDrive active working tree; Air additionally retains its accepted local checkout as offline Pi resource owner.** Shared file edits affect both developers, but do not retarget Air's local links. Current topology is recorded in the durable Air report, not inferred from old inventories. Inspect source revisions without reset/stash/overwrite. Preserve local fallback and all old root files while their consumers remain; no source removal or live topology change is authorized here.
2. Run `node setup/inspect-links.mjs` locally. Save stdout to a private per-host inventory, not Git. It records literal link targets, parent links, occupied files/digests/modes and absent paths without printing settings or credentials. Also inspect fresh-shell command resolution/version/managed receipt for Pi, package declarations and installed Todo version, and `herdr integration status` with owner permission. Never refresh auth as inventory. Current Air targets must come from this new observation.
3. Confirm this exact source matches the accepted portable resources: `npm --prefix cli ci --ignore-scripts`, `npm --prefix cli run check`, `npm --prefix cli test`, `node scripts/install-pi.test.js`. These are fixtures, not live acceptance. Review imported dirty-dotfiles source provenance separately; no dirty source is automatically promoted by the CLI.
4. Inspect the new plan with `npm --prefix cli run setup -- --dry-run`. Verified legacy links into root `pi/` or dotfiles deliberately appear as `Migration required` blocked candidates — the CLI recognizes their source ownership (old dotfiles / accepted root `pi/`) but blocks any replacement. They are **not** reported as unknown foreign conflicts; they are never detached or adopted automatically. **Do not resolve those candidates by moving source directories, adopting links or forcing Stow.**
5. Back up only the approved configuration/link metadata privately (0700 directory; private regular settings backup 0600), and record exact source revisions and per-file digests. Leave auth/sessions/caches/notes/generated reporters untouched. Existing snapshots/releases and the old Air checkout remain recovery material.

## Exact destination mapping

`A` is the approved local agentic-engineering checkout. Every new Stow target is a leaf; directories remain local real containers. Actual old literals must be filled from each host's inventory, not copied from Mini.

| Destination under HOME | New source under A |
|---|---|
| `.pi/agent/AGENTS.md` | `harness/pi/packages/pi-instructions/.pi/agent/AGENTS.md` |
| `.pi/agent/themes/purple-dreams.json` | `harness/pi/packages/pi-theme/.pi/agent/themes/purple-dreams.json` |
| `.pi/agent/skills/workbench/SKILL.md` | `harness/pi/packages/workbench-skill/.pi/agent/skills/workbench/SKILL.md` |
| `.pi/agent/skills/agentic-engineering/SKILL.md` | `harness/pi/packages/study-skill/.pi/agent/skills/agentic-engineering/SKILL.md` |
| `.pi/agent/extensions/composer-highlight.ts` | `harness/pi/packages/composer/.pi/agent/extensions/composer-highlight.ts` |
| Paths mirrored by `setup/computer/{gh,ghostty,git,herdr,ssh,zsh}/` | The corresponding package leaf, preserving existing layout |

**Unchanged owners:** official managed Pi shim/entrypoint/runtime/version 1.5.2; local mutable settings; exact native Todo 1.1.0; generated Herdr reporter/Skill; auth/session/note trees. The new source layout handoff does **not** need runtime reinstall, package refresh, credential login, Pi migration, new acceptance sessions, service reloads or PATH edits.

## Approved handoff transaction, one host at a time

Terminal transport is context-dependent, not Herdr-only. From Rex use the installed Rex skill and the [bounded remote-check procedure](REX-RECOVERY.md#bounded-checks-during-setup-migration), verify the remote host/session, and preserve active panes. Herdr commands require actual Herdr context; its absence does not block Rex checks. Neither transport relaxes source, locality, preservation or rollback gates below.

This is an operator-run transaction, not an automatic CLI migration. First rehearse it with temporary homes (as in tests). Obtain approval naming the chosen source commit, selected packages, exact occupied leaves/parent links, private backup locations and rollback route.

1. Coordinate affected sessions only; do not stop unrelated processes. Do not edit a resource while its live target is being transferred.
2. Review portable-template differences before computer configuration handoff: put Git identity privately in `~/.gitconfig.local`, SSH hosts in `~/.ssh/config.local`, optional `USER_EMAIL`, `USER_NAME`, `AE_PROJECT_HOME` in `~/.config/ae/shell.local.zsh`. These are **manual, approved local changes**, never copied into Git. Preserve organizational restrictions. The old host-aware navigation has intentionally become a local override; no network mounting is provisioned by setup.
3. For each selected existing **leaf symlink**, verify `lstat`, its exact recorded `readlink` and the source digest still match. Unlink only that symlink, never its target. Refuse any regular file, foreign leaf or changed link. Keep old sources at the same path. Mini's five approved Pi resource leaves now resolve into `harness/pi/packages/`; their original root `pi/` literals are retained in the manifest/receipt above. Any further host handoff needs its own freshly verified before-state.
4. For a selected **parent directory symlink** (such as old Stow-folded `~/.config/ghostty`), enumerate its source and affected children privately first. Approve the entire exact parent conversion and disposition of every existing child. Detach only the verified parent link, create a real local container, then install selected leaves. Do not follow/remove the old directory or silently drop unselected contents. Mixed/private parent contents require manual reconciliation and separate approval. If uncertain, stop before detachment. This conversion is intentionally not automated.
5. Preflight **all selected** new packages before installing any. For example, after authorized Pi leaf detachment:

   ```sh
   # Examples only, A must be the approved stable local checkout.
   stow --dir="$A/harness/pi/packages" --target="$HOME" --no-folding --simulate --restow \
     pi-instructions pi-theme workbench-skill study-skill composer
   stow --dir="$A/setup/computer" --target="$HOME" --no-folding --simulate --restow git ghostty
   ```

   Only approved selected packages belong in these commands. Never Stow `harness/pi/` wholesale or run old dotfiles `stow-all`/`bootstrap`/Air-home transactions after the handoff.
6. After the plan matches, run the same exact selected Stow command without `--simulate`, or use the CLI's selected config/resource operations after conflicts are cleared. For an already-accepted Pi, preserve settings and native package declarations: use Stow for the source-only handoff, not defaults/Todo install. Preserve Herdr's local reporter. If any destination changed since preview, stop.
7. Verify literal targets/realpaths for each installed leaf; read resources with the network/SMB unavailable on Air; confirm the Workbench Skill still resolves the repository and Foundations. Existing accepted defaults/theme/Todo/compaction must remain unchanged. Reload only the affected application through its native mechanism if needed and approved. Check normal Pi command resolution/version, existing session/auth preservation (private digests, active sessions may append), composer/theme and Herdr reporting in the existing UI. Fixtures do not prove these runtime facts.
8. Reconnect Air and confirm no source or runtime depends on mounted Mini volumes. Record host acceptance privately, including source full commit, literal links, intentional local overrides, checks and residual risks. Then seek acceptance for the second host independently.

### Guarded rollback

On failure, stop further mutations. Compare every newly installed leaf against the exact new target/digest; remove only matching new links, using selected `stow --delete --no-folding` after simulation where applicable. Do not delete unknown files or overwrite subsequent edits. Restore each recorded old literal symlink only into an absent destination. Restore a detached parent directory link only after every newly created child was individually verified/removed and its local container is truly empty (`rmdir`, never recursive deletion). Restore selected settings only if the current file matches the handoff-written candidate; keep subsequent changes separately. Never restore auth/sessions from a snapshot. Keep both source trees/revisions available throughout rollback.

Stow/source tests cover owned installs, relocation conflicts, foreign links, removal and source preservation. Parent-directory conversion, private overrides, actual Mini/Air sessions and offline/reconnect behavior still need host-specific approval and observed evidence.

## Physical Pi source relocation proposal (not approved)

### Accepted before-state and bounded inspection

Mini's five-link handoff is complete; the operator additionally confirmed a fresh Pi session in a separate Herdr pane, including working composer, on **2026-11-14**. Native loader checks and target/content verification passed; no rollback needed. Read-only reinspection still finds 5/5 exact new literals and recorded hashes. No new agent/session, reload, source move or live write was performed during this preparation.

HEAD remains `e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354`. All **13** files under root `pi/` are tracked regular files, operator UID 501, mode 0644, byte-identical to HEAD; no symlinks, private files or untracked additions were found in that subtree. `harness/pi/` remains untracked and contains the five active packages, equal seed, derived `accepted.json`, and a different staging README. These source candidates are real Mini runtime dependencies, not disposable build output.

| Old root file(s) | Representation / equivalence | Ownership and disposition |
|---|---|---|
| `pi/.pi/agent/AGENTS.md` | `harness/pi/packages/pi-instructions/.pi/agent/AGENTS.md`, identical | Portable resource; new Mini link already accepted; old copy retained pending consumer gate |
| `pi/.pi/agent/themes/purple-dreams.json` | `harness/pi/packages/pi-theme/.pi/agent/themes/purple-dreams.json`, identical | Same; no theme preference change |
| `pi/.pi/agent/skills/workbench/SKILL.md` | `harness/pi/packages/workbench-skill/.pi/agent/skills/workbench/SKILL.md`, identical | Same canonical Workbench root; no Workbench source/state move |
| `pi/.pi/agent/skills/agentic-engineering/SKILL.md` | `harness/pi/packages/study-skill/.pi/agent/skills/agentic-engineering/SKILL.md`, identical | Portable instructions only; notes remain private/local |
| `pi/.pi/agent/extensions/composer-highlight.ts` | `harness/pi/packages/composer/.pi/agent/extensions/composer-highlight.ts`, identical | Operator-confirmed fresh-session loading; no new link needed |
| `pi/settings.example.json` | `harness/pi/settings.example.json`, identical | Portable seed, **not** local settings; retain old seed while old installer fixture/callers remain |
| `pi/README.md` | Staging `harness/pi/README.md` differs substantially | Contains unique workflow/safety/history, not redundant; preserve rather than overwrite either blindly |
| `pi/acceptance.md` | No equivalent in new tree | Historical acceptance/rollback evidence; preserve body and historical path statements |
| `pi/air-provisioning.md`, `pi/air-migration-manifest.md` | No equivalents in new tree | Historical preparation, not current Air topology/instructions to rerun activation |
| `pi/managed-lock/1.5.2/package.json`, `package-lock.json` | No full counterparts; `harness/pi/accepted.json` is only a derived version/pin/baseline summary | Exact archived official installer manifest/lock, **not** redundant with the three-field summary. Both files still match the installed managed release byte-for-byte |
| `pi/.stow-local-ignore` | No replacement needed inside one-file selective packages | Active exclusion contract for the retained old whole-package Stow installer; retain until that installer retires |

Observed SHA-256s for the six unique files proposed for a later move (all UID 501 / 0644):

| Source | SHA-256 |
|---|---|
| `pi/README.md` | `6024dc6953b1de262be09cb0f0e915236b42d7db9c3ad26cfe2ab12cbce6a39b` |
| `pi/acceptance.md` | `61da290c95ad370c68713ed3b2bf4141fee884cc3040033cb4c901107d22d8da` |
| `pi/air-provisioning.md` | `8057cc6c44fe7a3b96ff5e42ee86a03e78429fc6caa3bc5611b657f5957226fc` |
| `pi/air-migration-manifest.md` | `3ce28afd4777b99b52ffe50ea88ca95d74a45a0821ffbd89413517eeccbd1f46` |
| `pi/managed-lock/1.5.2/package.json` | `6c433244d03aa280f1aa298035ba59f54afd0c486566771ef83cc5aef318c4cc` |
| `pi/managed-lock/1.5.2/package-lock.json` | `57e3b475e52f630cf903f73b0d2a02c405875af61ce4a845f481dcc798f58005` |

The six identical resource/seed files are redundant **content**, not proof their old paths are unused. The six unique README/evidence/Air/lock files need preservation; the thirteenth file is the old Stow contract. Nothing here is a credential, session, generated reporter, Todo cache or private override.

### Consumers and runtime dependencies

- **Live Mini:** resource links already use `harness/pi/packages/`. Official `~/.local/bin/pi → ~/.pi/agent/bin/pi` resolves releases through local `install/current-version`, not repository `pi/`. The local managed receipt and `skills`/`extensions`/`prompts`/`packages` settings were checked for this checkout's old root path without printing private settings; none was found. Bounded discovery/bin link inspection found no remaining root-Pi target. This is not an exhaustive scan of private scripts or session history, and does not authorize touching them.
- **Active repository consumers:** `setup/stage-pi.mjs` copies root resources/seed and reads the old lock; running it now could overwrite active staged source. `cli/tests/sources.test.ts` has two explicit staging/equality tests. `scripts/install-pi` still Stows the root `pi` package; `scripts/install-pi.test.js` copies it and reads its seed. `cli/tests/setup.test.ts` has a root→selective handoff/rollback fixture. `cli/src/setup/migration.ts` intentionally recognizes exact old-root ownership, using its existing files as evidence. These are real consumers, not stale prose.
- **Already new-layout consumers:** `cli/src/components/catalog.ts` and `cli/src/setup/files.ts` read `harness/pi/accepted.json`, its seed and selective package paths; `setup/inspect-links.mjs` and terminal fixtures already use those package paths. No runtime path change is required there; only catalog ownership wording is staged.
- **Known external caller, read-only inspected:** `../dotfiles/.no-stow/scripts/pi-resources` requires both `scripts/install-pi` and `pi/.pi/agent/skills/workbench/SKILL.md`, verifies local source containment, and delegates to that installer. Removing either breaks this entrypoint. Do not edit dotfiles or replace it with a new wrapper in this task. Its approved retirement/update is a separate consumer decision.
- **Current navigation/policy:** root `AGENTS.md`, the Pi paragraph in dirty root `README.md`, `harness/pi/README.md`, `setup/OWNERSHIP.md`, this migration document and current acceptance scope statements refer to old authority/staging. Update only those exact ownership/path statements in an approved implementation; preserve all unrelated root README WIP.
- **Historical material:** root Pi acceptance/Air/README bodies, `plans/SETUP_CLI_CLAUDE_HANDOFF.md` and its reported commands, accepted hashes and private handoff receipts describe actual old paths. Preserve that evidence rather than mass-replacing `pi/` strings. `plans/BACKLOG.md` is ongoing plan material, not authorization for edits. References to dotfiles Pi/AIDD or to the installed native `.pi/agent` tree are different owners, not relocation targets.
- **Workbench:** no required old-root operational reference was found in its harness navigation. Skill content resolves the same Git root from either old/new path. No changes under `workbench/`, its overlays, construction plans or implementation are required. Do not use this source cleanup to reconcile their dirty state.
- **Air/private consumers — updated by actual report:** both machines share DevDrive for active development, while all five Air Pi links use its accepted local fallback. That clean local checkout is at `e9c0a625` with no new candidates. Shared source edits do not directly retarget those links, but a later Git update deleting local old files would break them; hold cleanup until local ownership/disposition is approved. Existing Air runtime/offline acceptance is closed. The legacy dotfiles entrypoint rejects non-local sources; do not use SMB as Air Pi ownership. Other setup/recovery/private readers remain explicit unresolved consumers, not presumed absent. No mount/service/live-source change is authorized.

Non-destructive checks: all 13 old files versus HEAD; six duplicate byte comparisons; both archived/native managed-lock files equal; accepted five-link receipt/hash comparison; two targeted staging/source tests pass; old installer/Stow regression passes; root `pi/` has no diff. No network audit or repeated broad suite.

### Shared-source dependency resolution — previous phase A withdrawn

The earlier six-file move/generator-retirement proposal is **withdrawn, not awaiting blanket approval**. Its seven-file legacy subset preserves linking mechanics, but not the entire documented setup/recovery workflow. No authority-ordering amendment is requested now.

| Consumer | What it actually reads / requires | Safe disposition now |
|---|---|---|
| `scripts/install-pi` | GNU Stow root `pi` package, `.stow-local-ignore`, five resource leaves; does not parse the managed manifests or use the proposed documentation moves | Retain installer and root resource/ignore paths unchanged. Metadata absence alone does not break its resource operations |
| dotfiles `.no-stow/scripts/pi-resources` | Requires the installer, root Workbench Skill and canonical `workbench/README.md`, verifies source containment/local filesystem, then delegates | Retain all those paths. It does not directly parse either managed manifest or call the staging generator. Do not change its filesystem guard or dotfiles ownership |
| `setup/stage-pi.mjs` | Copies five root resources/seed, then reads **`pi/managed-lock/1.5.2/package.json`** to generate accepted metadata; does not read `package-lock.json` | Keep generator **and manifest at their original paths**. Removing either breaks the currently documented/tested regeneration workflow. Retiring it requires an explicitly approved workflow/test/reference transition, not isolated deletion |
| Documented official-runtime verification/audit/recovery | `pi/README.md` and `pi/air-provisioning.md` reference **both** archived managed files for comparison/audit; official runtime uses its own installed lock, not these source files | Keep **both** original managed files; absence of a direct installer read is not proof these supported inputs are unused. No lock copies or new authoritative archive |
| Current recovery/setup navigation | Root README plus dotfiles `README.md`, `.no-stow/docs/pi.md` and `.no-stow/docs/set-up.md` link old `pi/README.md` / `pi/air-provisioning.md`; root README/Air guides link acceptance and per-path rollback evidence | Keep all four original Pi Markdown files. Calling their bodies historical does not make the navigation/recovery paths redundant |
| CLI staging/source tests and ownership instructions | `cli/tests/sources.test.ts` executes the generator in copied fixtures; `harness/pi/README.md` / `setup/OWNERSHIP.md` describe regeneration | Keep these unchanged pending one approved supported-workflow transition. Existing canonical/staged equality continues to be verified; do not invoke the generator against active sources |
| Air local fallback and shared project/private readers | Five accepted local old targets are now verified; DevDrive is shared active project source. Other recovery/private readers remain unresolved | Preserve both source roles. Do not fast-forward Air to a cleanup commit deleting files still used by its local links. Other readers still require named disposition |

**Observed isolated evidence:** a disposable source containing exactly the proposed seven root files, the unchanged installer, a fixture Workbench README and the actual dotfiles entrypoint passed direct/delegated plan, apply, repeat, removal-plan and removal checks. All five fixture resource links and local-state sentinels behaved correctly. This establishes the seven-file subset for **link operations only**, on Mini's local filesystem—not full recovery support or Air/SMB acceptance.

A second disposable check retained the generator but omitted the old managed manifest: it failed with the expected missing `pi/managed-lock/1.5.2/package.json` **after copying all five resources**. This is a real partial-write hazard if someone runs it against live staged sources during a move. No such run occurred in the shared checkout. Two current staging/source tests also pass unchanged.

**Precise safe subset at this gate:** documentation-only correction in `setup/MIGRATION.md` and the status note in `setup/ACCEPTANCE.md`; **zero physical moves, zero removals, zero resource rewrites and no authority promotion**. Keep all **13 root Pi files**, the existing installer/fixtures, generator and existing eight-file `harness/pi/` candidate intact. No additional source copies, compatibility links, wrapper or duplicated authoritative lock archive. Existing authority classification remains unchanged until the supported-workflow/consumer transition is approved.

The earlier claim that seven retained root files were sufficient for the whole transition was too broad. They are sufficient for the verified linking mechanism, not for every supported setup, audit, recovery or shared-source reader.

### Proposed phase B — eventual legacy root and installer cleanup

Only after a separately approved Air **local source-layout** handoff or explicitly reviewed no-consumer disposition, resolution of the known dotfiles entrypoint/other approved callers, and a retained recovery route. Existing Air runtime/offline acceptance is reused, not repeated:

1. Approve exact removal of the five frozen `pi/.pi/agent/...` files, `pi/settings.example.json` and `pi/.stow-local-ignore`; verify hashes/no local additions and no live links first. Remove only those known files and truly empty containers, never recursive unknown deletion.
2. Retire `scripts/install-pi` after callers no longer require it. Port its still-useful relocation/conflict/preservation cases from `scripts/install-pi.test.js` into existing selective CLI tests, then retire the redundant fixture rather than adding another installer/wrapper.
3. Update current test-command references in `cli/README.md`, `cli/AGENTS.md` and `setup/MIGRATION.md`; keep historical executed-command evidence unchanged. Decide `cli/src/setup/migration.ts` old-root recognition and its fixture deliberately: retaining safe conflict refusal or historical ownership diagnostics must not falsely grant setup ownership. Do not delete safety tests just because their former implementation moved.
4. Finish current navigation/ownership statements so no supported workflow requires root `pi/`. Do not change dotfiles, Air or private callers under this Mini preparation approval; their disposition is a separate prerequisite.

**Phase B is not currently ready for execution.** Mini's links alone cannot establish safety for Air or the known external entrypoint. Moving docs/locks or promoting authority is not proof old resource paths are dead.

### Verification and narrowly targeted rollback for approved relocation

No physical relocation is proposed as executable now, so no live rollback is needed for this documentation-only correction. All original source/recovery paths stay present. Mini's five accepted live literals/hashes were rechecked unchanged; private state, Workbench source and Air were not touched.

For a later approved source transition: first resolve the named shared-source readers and supported generator/recovery workflow, capture exact selected file preimages/hashes and current live link literals, then rehearse only that reviewed patch on disposable copies. Moves must refuse destination collisions and changed sources; resource bytes and current Mini symlinks stay unchanged. Recheck direct/delegated legacy behavior as long as it remains supported, lock-verification/recovery references, tests and named Air consumers. Never use a successful seven-file linking fixture as proof that setup/recovery dependencies disappeared.

Targeted rollback for any later approved moves must restore only matching moved files to absent original paths and only matching reference-file hunks/preimages, preserving intervening edits and Workbench WIP. No checkout/reset/stash, blanket HOME restore, resource regeneration or credential/session/settings restoration. The existing private five-link receipt remains intact and is not a reason to undo the accepted Mini handoff.

**Approval status:** previous phase-A relocation request withdrawn. No source move/deletion/promotion is cleared by this check; a later proposal must resolve the specific remaining readers first. No Air reconfiguration, dotfiles edits, commit or push is authorized.

## Final Pi source relocation gate

The prior phase-A authority-ordering amendment is withdrawn. Complete old-root/installer retirement still requires the no-consumer and both-host safeguards, now explicitly accounting for the shared DevDrive tree. This narrow dependency check does not waive them.

Once **both** hosts' links are accepted under `harness/pi/packages/`, scan known consumers for root `pi/` references (including private external scripts) and resolve them deliberately. In a separate reviewed commit:

- The [prepared source transition](#prepared-canonical-source-transition) separates canonical authorship/generator retirement from physical cleanup; integrate that candidate only after Main verifies Air selective ownership.
- Relocate accepted lock/history documentation and update repository-local links/instructions and installation fixtures.
- Retire the old whole-package `scripts/install-pi`/root source only after all approved callers use selective packages and no live link resolves there.
- Preserve historical acceptance evidence as history, not current operational instructions. Do not introduce a compatibility wrapper or two authored source trees.

No destructive source move is authorized. The prepared canonical-source candidate above changes authorship/workflow only after its integration gate; it does not claim that the root/support cleanup gate has passed. Retained legacy consumers and recovery paths remain supported and frozen.

## Dotfiles retirement gate

Do not delete/archive/rename the old repository, releases, backups or old Air clone now. Retirement requires:

1. Reviewed/committed/published replacement source (publication separately authorized), provenance and complete local checkout on each Mac.
2. Fresh provisioning test independent of old dotfiles; remaining manual Homebrew/official Pi/Oh My Zsh prerequisites accepted, or separately implemented and tested. End-to-end fresh runtime provisioning is **not yet accepted** by these fixtures.
3. Every useful old resource classified: migrated, explicitly retained local, intentionally unsupported, or approved obsolete. Resolve Air SMB/release tooling separately; do not silently orphan a live launchd/network dependency. npm/Bun globals, MAS/VS Code entries and private identity need explicit disposition.
4. No live shell/config/LaunchAgent/bin link, script include, recovery command, runtime discovery path or source resource still depends on dotfiles. Inventory both hosts anew and test Air cold offline/reconnect.
5. Approved source-only Pi handoff on both Macs, normal working functionality preserved, rollback rehearsed and private recovery material retained for the agreed period.
6. Explicit human authorization of the exact old-repository retirement action and recovery retention policy. Preserve Git history via the original repository/archive; do not rewrite history, create nested repositories, push or remove remotes automatically.

Until those conditions hold, the result is a safe staged consolidation and working bounded setup wizard, not completed retirement or deployment acceptance.
