# Final readiness and GitHub recovery audit

**Historical checkpoint.** Closure evidence and the current decision are in [Final consolidation acceptance](FINAL_CONSOLIDATION_ACCEPTANCE.md). The original findings/52-path allowlist below are retained, not current operational instructions.

**Decision: NOT READY for full recovery/composability acceptance.** The Mini can begin ordinary project engineering, but intended Workbench source remains unpublished, the requested backup is absent, and project capability installation is unsupported. No redesign is required or proposed.

Audit: 2026-11-15, Mini; engagement `audit`, L4 → L3 for executable acceptance checks, returned to L4 after checks. Architecture gate NOT APPLICABLE: no subsystem changes. Only this shared report was added; authorized tests used disposable repositories/homes. No publication, live relinking, reset, checkout, cleanup, Salon Expo access, authentication-content reads, model calls, or server/agent restarts. `source: executed` below means this audit ran the check; `inspected` means retained evidence, not a fresh remote-machine observation.

## Scorecard

| Area | Result | Evidence / limit |
|---|---|---|
| GitHub source recovery | **PARTIAL** | Fresh fetch + `ls-remote` agree on `b87deaf8`; migration published, 52 intended working-source paths differ. |
| External cleanup backup | **BLOCKED** | `/Volumes/DevDrive/Projects/backup-v1` does not exist. No manifests/checksums/backup restore could be verified. |
| Mini runtime | **PASS** | Running Pi session; Pi 1.5.2; five exact canonical leaf targets/bytes; native composer tests pass. |
| Air runtime and offline capability | **PARTIAL** | Final local/offline acceptance retained in Air handoff; no existing Air agent available for a current check. |
| Herdr cross-machine coordination | **PARTIAL** | Mini 0.9.5 client/server compatible; Air remote agent/pane inventory works. No Air agent for bidirectional agent messaging. |
| Pi and Claude harness availability | **PARTIAL** | Mini Pi 1.5.2 / Claude Code 2.1.325 executable; reporters current v9/v11. Air versions previously accepted, not freshly checked. No Claude authentication/inference claim. |
| Capability discovery | **PARTIAL** | Setup catalog/dependencies, Workbench routing/tool/blueprint indexes work; no unified executable project capability/composition catalog. |
| Recursive composability | **PARTIAL** | Reusable code exports and packet construction tested; typed nested ADWs and authoritative multi-task completion reader explicitly unimplemented. |
| Selective setup and installation | **PARTIAL** | Machine/home setup passes real isolated Stow install and rerun; project-level capability install unsupported. |
| Documentation and lazy context loading | **PARTIAL** | 462 Workbench links and entry-point file links resolve; startup Skills are selective, but full Workbench boot mandates 64,769 bytes before task routing. |
| Workbench WIP preservation | **PARTIAL** | Constructor/evidence exist; all 11 reviewed-subject hashes still match; tests pass. WIP not committed/integrated into published main. |
| Next-project onboarding | **PARTIAL** | Supported read-only onboarding and ordinary Pi/Claude engineering available; requested discover/select/preview/install project workflow not implemented. |

## A. GitHub verdict

Intended origin verified: `git@github.com:alexortiz201/agentic-engineering.git`.

| Ref / artifact | Exact identity / publication |
|---|---|
| GitHub `main`, fresh `origin/main`, local `migration/live-handoff` | **`b87deaf8cc2591bb617ba33433ee0c8c370ad6c1`**, tree **`2865a6d1c07f43ce2a288b92ad96503dbb8991ed`** |
| Accepted executable migration | `3de15bce2c1d39aecf7bf5c05bfbbeddc011a5b1`, ancestor of published main; later tip is documentation-only |
| GitHub `setup/consolidation`; active DevDrive `workbench/construction-slice` HEAD | `8656a79767b2ef67aedd462b1081a2e0b0ed509f`, tree `bbd88a478748eb1f734533b072cf14c7e5061a6c`; main contains it and seven later commits |
| Local `main` | `f1fc7e88e2b292187856176f5dccbdf41a927649`, tree `c54e64ccfad857fa2466ac39593432158beefe59`; 12 commits behind remote, no unique commits |
| Active nonignored source tree before adding this report | Computed Git tree ID **`3e7af304a9b42697bbff744510444fe46e25f2d1`**; NOT a commit or stored/published Git object. Includes tracked + nonignored untracked source, modes/links, excludes absent files. Does not equal GitHub main. |

Executed: `git fetch origin`, `git ls-remote --heads origin`, ancestry and blob/tree comparisons. Remote advertises only `main` and `setup/consolidation`. One registered worktree, the authoritative DevDrive checkout; no surviving registered integration worktrees. Retained handoff describes their removal after integration, not abandonment. No `/tmp/ae-*` integration directories appeared in the bounded check before this audit's scratch was created. No stashes. `git fsck --full --no-reflogs --unreachable` found 23 unreachable blobs, **zero unreachable commits**; these local recovery objects are not a backup or published history. Their arbitrary contents were not exposed.

Relevant task branches all inspected:

- `migration/source-transition` `1a6f62d`: patch-equivalent published `8d60736`.
- `migration/setup-repeatability` `9f0a2d7`: patch-equivalent published `3e7e02c`.
- `migration/setup-review` `95a8769`, containing `1c277da` and `39d3d55`: patch-equivalent published composer/review/fix commits `653265b`, `3e7e02c`, `f782e32`.
- `migration/live-handoff` equals remote main; active construction branch's committed history is already on main.

Thus local-only commit *identities* on task branches do not represent missing implementation. No unique unpublished committed feature was found. **The recovery gap is working files.** Initial index empty; 37 tracked modifications/deletion and 37 untracked files. Many migration-owned changes merely overlay already-published commits on the older active HEAD. Comparing actual file bytes, including untracked overlays, leaves **52 differences from GitHub main: 27 absent remotely, 25 changed**. An ordinary `git diff origin/main` alone misleadingly reports some present untracked overlays as deleted.

Missing content, exactly scoped in the appendix:

- Workbench constructor source/tests/docs, construction architecture/plan/handoff/backlog, and 20 evidence/fixture files.
- Root/Workbench doctrine and navigation changes, including Factory/Primitive distinctions and supporting Foundations/handbook/harness updates.
- Later Air closing receipt and publication-result receipt. Their earlier versions are published; these additions are not.

**Workbench preservation:** all 11 SHA-256 subjects in `plans/evidence/workbench-slice/architecture-review.json` match current files, including constructor, tests, delivery, packet and brief. Fresh constructor/gate/delivery checks pass. The earlier 148-path preservation comparator and migration's 51-file preservation claim were inspected as historical evidence; their complete original baselines were not independently reconstructed here. Present, hash-matching WIP is not GitHub recovery and is not human acceptance of that slice.

Ignored inventory: generated `cli/dist/`, `cli/node_modules/`, OS metadata; five environment-local `.profile/` files deliberately excluded, not copied/read/published. `workbench/skills/` contains only ignored `.DS_Store`, not a lost capability library. Ignore rules also exclude local memory, runs, specs and secrets: do not bulk-stage ignored content. Private HOME credentials/settings/sessions/Todos and rollback receipts are intentionally outside source recovery.

**Can GitHub recover the intended repository? No, not the complete current intended tree.** It can recover the published migration/setup and older Workbench source at exact `b87deaf8…`. Three representative files exported from that freshly fetched ref into isolated storage matched their Git blob IDs: Foundations README `fbf0beef…`, accepted Pi metadata `0ef123d6…`, Workbench Skill `1afbf006…`. This is Git-source recovery, NOT backup-v1 recovery or a whole-machine restore.

### Smallest scoped publication procedure — proposed, NOT executed

First accept/review the Workbench WIP and privacy-review the exact 52 paths, especially packet/assignment/evidence and handoff metadata. Do not copy HOME state or actual session files. Coordinate one Git writer; leave the active dirty branch untouched. The appendix is a file allowlist, not permission to publish. After explicit authorization:

```sh
S=/Volumes/DevDrive/Projects/agentic-engineering
I=/tmp/ae-workbench-publication    # must not exist
LIST=/tmp/ae-workbench-publication.paths  # copy ONLY appendix paths, one per line
# Verify list against fresh actual content; stop on drift or newly discovered files.
git -C "$S" fetch origin
git -C "$S" worktree add -b recovery/workbench-readiness "$I" origin/main
while IFS= read -r p; do
  mkdir -p "$I/$(dirname "$p")"
  cp -p "$S/$p" "$I/$p"
done < "$LIST"
# Review privacy and exact diff; install only isolated checkout dev dependencies.
npm --prefix "$I/cli" ci --ignore-scripts
npm --prefix "$I/cli" run check
npm --prefix "$I/cli" run build
npm --prefix "$I/cli" test
(cd "$I" && node --test workbench/tools/construct/construct.test.mjs \
  && node --test plans/evidence/workbench-slice/verify-fixture.test.mjs \
  && node scripts/install-pi.test.js && python3 cli/tests/terminal-probe.py)
# Also rerun documented link/JSON checks. Stop on any failure.
git -C "$I" add --pathspec-from-file="$LIST"
git -C "$I" diff --cached --check
git -C "$I" diff --cached --stat
# Inspect full staged contents, then explicitly approved scoped commit(s), e.g.:
git -C "$I" commit -m 'feat(workbench): preserve construction tooling and doctrine' \
  -m '- Retain bounded construction sources, contracts and verification evidence.'
C=$(git -C "$I" rev-parse HEAD)
git -C "$I" ls-remote --heads origin refs/heads/main refs/heads/recovery/workbench-readiness
# Stop if refs moved incompatibly. Only if exact C is approved for publication:
git -C "$I" push origin "$C":refs/heads/recovery/workbench-readiness
```

Then separately approve/review an ordinary merge of that exact commit into GitHub main; publication on the recovery branch alone is not main recovery. Fetch again, verify `ls-remote` matches fetched main, require `git merge-base --is-ancestor "$C" origin/main`, and compare `git rev-parse "$C^{tree}" origin/main^{tree}` (equal absent separately reviewed additional main changes). Do not fast-forward/reset the dirty DevDrive checkout during this operation. Do not cherry-pick already-integrated migration fixes over it. This audit report itself is one additional uncommitted report, outside the pre-audit 52-path allowlist; separately review it if publication is desired.

## Backup-v1 verdict

Executed exact-path existence/symlink check: absent. Expected consolidation archive, deleted-file manifests, checksum files and recovery records cannot be inspected, and a representative restore **from that backup was not run because its input does not exist**. Previous Mini/Air handoffs already record this absence; no evidence supports calling cleanup recovery complete.

Mini's private native checkpoint at `~/.local/state/pi-native-consolidation/20261113T170838Z/` exists (0700), with project patch/untracked archive records (0600) and private runtime recovery directories. Mini's five-link handoff receipt also exists. Only names/types/modes were inspected; payload integrity, full WIP coverage and whole-home restoration are **unverified**. The native checkpoint predates the later construction handoff; it cannot be presumed to cover that work. Air's private link-only receipt is historical inspected evidence. These are local recovery artifacts, not independently protected external storage.

GitHub intentionally does not preserve ignored overlays, credentials, settings, sessions, installed package caches, Todos runtime state, private receipts, or uncommitted Workbench source. Find/reconcile the expected backup before destructive retirement, and separately approve an independent-device/location backup of source WIP and appropriately private state. Even if backup-v1 is found on DevDrive, it shares the primary drive's failure domain. Do not upload it wholesale.

## B. Environment verdict

**Mini operational; both-machine acceptance only partially current.** Executed Pi/Claude version/help checks, current Pi session, all five native source-link realpaths/byte comparisons and current Herdr integrations. Todos cache metadata is 1.1.0; no Todo content was read. Native composer loader/render/submission coverage ran within the 129-test suite, zero skips. Available tools are the harness's real tool list, not inferred from Workbench prose.

Mini private metadata checks cover 374 existing auth/settings/session/reporter entries: only the running audit session changed, with the same inode and nondecreasing size. Other watched metadata unchanged. No credential/session bodies were read or copied. This establishes audit noninterference, not an independent reconstruction of every pre-consolidation session.

Air Herdr server currently answers forwarded `agent list` and `pane list`, but reports **no agents** (one shell pane). Therefore no bounded task could be delegated to an *existing* agent as authorized; none was started. Current Air Pi launch, non-SSH Local-shell variables, SMB visibility and offline resource targets were not independently checked. Do not infer shell cleanliness from a label or a successful SSH API call.

Retained final Air evidence in `AIR_LIVE_HANDOFF_RESULT.md` records local clean checkout at exact `b87deaf8…`, five physically local canonical resources, zero-blocker inspector, 5 no-ops/53 skips preview, earlier 129 tests and controlled process-denial/offline acceptance. Physical network/SMB outage was not tested. Current bidirectional agent messaging is **not verified**; cross-machine Herdr API reachability is verified. Durable handoffs already use `plans/handoffs/` on DevDrive; this audit adds no messaging framework. When an Air agent is naturally available, delegate only version/link/Local-shell SSH-variable-presence/shared-report-visibility checks and one acknowledgment back through Mini. No relink or migration rerun.

## Capability / onboarding findings

Authoritative implemented locations are clear: `cli/src/components/catalog.ts` and profiles for home provisioning; `setup/computer/` for portable computer sources; `harness/pi/` for five Pi resource packages/seed/accepted pins; `workbench/foundations/` for Foundations; Workbench `README.md`, `tools/README.md` and blueprint/artifact indexes for task-specific knowledge/tools. Herdr owns generated reporters, Pi owns execution, projects own their resulting workflows. Frozen root `pi/` duplication is explicitly compatibility/recovery, not another authored authority.

Actual setup components expose owners/dependencies and reuse common detect/plan/execute/files/theme modules. Constructor exports `validateBrief`, `constructPacket`, `main`; library import/CLI behavior is tested without duplicating implementation. It constructs an inspectable packet; it does not install project capabilities, execute checks, dispatch agents or verify predecessor completion. Composed ADW execution is expressly limited to phase reuse/deferral; a typed nested ADW is PLANNED, not implemented. There is no demonstrated general composition-as-capability project installer. Therefore the requested **Recursive Composable Capabilities architecture is only partially realized**, not proven complete by the current directory layout or doctrine. No missing framework is invented by this audit.

Discovery works through scoped Markdown and a concrete setup catalog, not `ae capabilities`, `ae inspect`, `ae compose` or `ae install` commands. `ae` is only a declared package bin; the documented checkout entry point works. `cli/src/index.ts` implements **only `setup`**, and `setup --json` requires dry-run. No project target option, project installer or headless apply exists. Installing a home-level Skill/reference is not installing a project capability.

Executed documentation check: **114 files / 6 JSON / 462 internal Workbench links**, no failures; root README/AGENTS/SETUP and CLI/harness/architecture navigation file links also resolve. Payload configuration links and external websites are intentionally outside that check; they were not claimed validated. Root README/AGENTS are 85/34 lines. No blocking entry-point dead link found. Foundations have one canonical home and remain optional reference-only on installation.

Lazy-context limit: Pi starts with small global instructions and Skill metadata, not all Foundations. However, invoking the full Workbench boot mandates five documents totaling **64,769 bytes** before task routing, and its cold-start instructions request broad local memory traversal. This is concrete context overhead, not a secret leak or runtime failure. Target-project onboarding can remain scoped; do not automatically inject this entire package into every Salon Expo task. No documentation rewrites were made.

## Isolated acceptance results

All checks below `source: executed`, status `passed`:

- `npm --prefix cli run check`; `npm --prefix cli run build`; `npm --prefix cli test`: **129/129**, zero failures/skips.
- `python3 cli/tests/terminal-probe.py`: **5/5** PTY scenarios.
- `node scripts/install-pi.test.js`: legacy Stow preservation fixtures pass; no live legacy installer apply.
- Constructor `node --test`: **19/19**; evidence gate controls **5/5**; recovered delivery fixture **6/6** plus Node syntax.
- Constructor/test strict JSDoc typecheck using existing `cli/node_modules/@types`; syntax checks pass.
- Scoped source whitespace check and link/JSON checks pass.

Disposable repository and isolated HOME: `/tmp/ae-readiness-Pfc9Bu/disposable-project` and `test-home`. CLI discovery/requirements inspected via documented `setup --dry-run --json --profile custom --select foundations --home …`; no target files created by preview. A real PTY ran the documented interactive setup from the disposable repository, custom profile, selected **Git configuration only**, reviewed and explicitly applied. Actual GNU Stow created exactly `.gitconfig`, `.gitignore_global`, plus the profile receipt. Unselected Pi/resources/other configs remained absent. Rerun produced identical file bytes/link targets; existing native managers were reused, no package installation. This proves **machine/home setup**, not project setup. Existing broader fixture tests cover independent optional resources, dependency expansion, receipts and refusal paths.

Project-owned construction: documented constructor CLI used the explicit synthetic brief and copied fixture in the disposable repository, under isolated HOME. Two invocations yielded identical JSON packets and no workspace changes. This proves discovery/requirements/selected-context/packet preview, **not project capability installation**. Unsupported project install/verify-installed/rerun-installed-composition steps remain unsupported; no substitute operation was presented as a pass.

Temporary test logs/source-delta metadata are in `/tmp/ae-readiness-Pfc9Bu`; they are disposable, not a recovery backup. Final comparison confirmed all 52 pre-audit source-delta blob IDs unchanged, appendix exactly matches that delta, index still empty, and live GitHub main still exact `b87deaf8…`. This report retains the substantive verdict and exact missing-file scope.

## C. Actual next-project steps

No Salon Expo path was assumed or inspected. Set `SALON` to its existing checkout; use its own instructions and checks first:

```sh
AE=/Volumes/DevDrive/Projects/agentic-engineering
cd "$SALON"  # operator supplies the actual existing project path
git status --short --branch
ls -la  # locate AGENTS.md / CLAUDE.md / README / manifests / checks
pi      # optional independent alternative: claude
```

Initial agent task: “Read this project's instructions and manifests. Read only the Workbench adoption guide at `$AE/workbench/handbook/09_ADOPTING_A_REPOSITORY.md` and follow applicable routing. Inventory the existing agentic layer and checks, identify the smallest useful task and selected resources, propose exact changes/verification, then await approval. Do not install or scaffold.” Preserve any project's SDLC plugin profiles/specification links and existing harness conventions.

To discover **home setup** options, not project capabilities:

```sh
node "$AE/cli/src/index.ts" setup --help
node "$AE/cli/src/index.ts" setup --dry-run --json --profile custom
# Optional selected-resource preview only; accepted machines should be no-ops:
node "$AE/cli/src/index.ts" setup --dry-run --json --profile custom \
  --select workbench-skill,study-skill,composer,pi-instructions,pi-theme
```

Only if a separately needed machine change is approved: `node "$AE/cli/src/index.ts" setup` → custom profile → select → review → explicit apply. No live install is necessary simply to open Salon Expo. Optional Foundations remain unselected unless wanted.

For a bounded, explicitly authored project brief, the locally present but unpublished constructor supports:

```sh
node "$AE/workbench/tools/construct/construct.mjs" --help
node "$AE/workbench/tools/construct/construct.mjs" --brief /absolute/reviewed-brief.json --workspace "$SALON"
```

That is a read-only assignment preview, **not an installation/apply command**. Actual implementation begins only after project-specific scope/authority approval using its native workflow/check commands. There are no supported project capability select/install commands to provide.

## D–E. Material blockers and recommendation

**NOT READY** for the full requested acceptance; no automatic corrective work authorized.

1. **Recovery blocker:** accept/privacy-review and publish the 52-path Workbench/receipt delta through a scoped branch and separately approved main integration; verify exact remote commit/tree afterward. Do not reset the dirty active checkout.
2. **Backup blocker:** locate/reconcile missing backup-v1 and test its manifests/checksums/sample restoration, or explicitly accept that it is unavailable and authorize a new independent backup. Existing files cannot recreate an absent historical pre-cleanup snapshot.
3. **Both-machine evidence gap:** when an existing Air agent is available, obtain the bounded current local/offline/SSH-variable/shared-file and acknowledgment checks. No new infrastructure or migration rerun.
4. **Functional boundary:** project capability installation/typed recursive workflow execution is unsupported. Ordinary Salon Expo development can proceed with explicit manual resource selection and native project workflows if that limitation is accepted; do not advertise the absent workflow as completed.

No cosmetic refactor, library reorganization, runtime upgrade or broad investigation is a prerequisite.

## Appendix — exact pre-audit unpublished-source allowlist (52 paths)

Paths below are actual byte differences from freshly fetched GitHub main, not every dirty path relative to old HEAD. Contains no ignored HOME state. Review before copying/staging. This audit report is additional and not included.

```text
README.md
architecture/README.md
architecture/adw-composition-review.md
architecture/workbench-construction.md
plans/AUTONOMOUS_WORKBENCH_HANDOFF.md
plans/BACKLOG.md
plans/WORKBENCH_CONSTRUCTION_SLICE.md
plans/evidence/workbench-slice/README.md
plans/evidence/workbench-slice/architecture-review.json
plans/evidence/workbench-slice/assignment.md
plans/evidence/workbench-slice/brief.json
plans/evidence/workbench-slice/completion.json
plans/evidence/workbench-slice/delivery/slug.mjs
plans/evidence/workbench-slice/final-verification.json
plans/evidence/workbench-slice/fixture/README.md
plans/evidence/workbench-slice/fixture/slug.mjs
plans/evidence/workbench-slice/fixture/slug.test.mjs
plans/evidence/workbench-slice/gate-controls.json
plans/evidence/workbench-slice/initial-snapshot.json
plans/evidence/workbench-slice/initial-verification.json
plans/evidence/workbench-slice/managed-delivery.json
plans/evidence/workbench-slice/packet.json
plans/evidence/workbench-slice/preservation.json
plans/evidence/workbench-slice/review-dispatch.json
plans/evidence/workbench-slice/runtime-readiness.md
plans/evidence/workbench-slice/verify-fixture.mjs
plans/evidence/workbench-slice/verify-fixture.test.mjs
plans/handoffs/AIR_LIVE_HANDOFF_RESULT.md
plans/handoffs/SHARED_DEVDRIVE_PUBLICATION.md
workbench/LANGUAGE.md
workbench/README.md
workbench/foundations/Agentic_Engineering/01_PRINCIPLES.md
workbench/foundations/Agentic_Engineering/06_ADW_COMPOSITION.md
workbench/foundations/Agentic_Engineering/07_COACHING.md
workbench/foundations/Agentic_Engineering/10_THE_SOFTWARE_FACTORY.md
workbench/foundations/Agentic_Engineering/12_EVALUATIONS.md
workbench/foundations/Agentic_Engineering/13_MEMORY.md
workbench/foundations/Agentic_Engineering/14_SEMANTIC_AGENT_ROLES.md
workbench/foundations/Agentic_Engineering/README.md
workbench/foundations/Agentic_Engineering/primitives/README.md
workbench/foundations/Agentic_Engineering/primitives/observation.md
workbench/foundations/Agentic_Engineering/primitives/record.md
workbench/handbook/03_STRUCTURAL_CHECK.md
workbench/handbook/04_ARTIFACT_MAP.md
workbench/handbook/05_AGENTIC_LAYER_LAYOUT.md
workbench/handbook/06_BUILDING_AN_ADW.md
workbench/harnesses/pi.md
workbench/tools/README.md
workbench/tools/construct/README.md
workbench/tools/construct/construct.mjs
workbench/tools/construct/construct.test.mjs
workbench/tools/observe/README.md
```
