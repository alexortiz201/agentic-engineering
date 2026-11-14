# Shared DevDrive alignment and scoped GitHub publication

Status: **operator approved exactly the two scoped commits and normal publication to `origin/setup/consolidation`; Mini Pi is sole Git operator. Air updates/live ownership and legacy retirement remain unapproved.** Earlier proposal/read-only statements below record the preparation phase; the execution record at the end governs this approved window. This is the current direction; it supersedes earlier advice to make independent local checkouts the day-to-day workspaces, treat SMB-run warnings as proof of foreign Air ownership, or repeat accepted Air runtime/offline checks.

## Ownership and file-based coordination

- **Pi lead:** owns this document, setup/topology documentation and integration. Sole proposed Git writer, only in a separately approved coordinated window. No staging/commit/fetch/merge/push has occurred for this task.
- **Existing Claude agent:** read this actual file from DevDrive. Independently review the proposed migration allowlist/dependencies/publication safety. You may create/update **only** `plans/handoffs/PUBLICATION_SCOPE_REVIEW.md`; everything else and all Git metadata are read-only. Do not stage/commit, inspect private HOME state, edit Workbench, start agents or change installations. Report file names/counts and redacted findings, not secret values. End with a verdict, concrete scope corrections and verification performed. Communicate your reply **file path** through Herdr.
- **Existing Air agent (when addressable):** read this actual shared file, then follow the read-only task below. Only shared writable output is `plans/handoffs/AIR_LOCAL_CHECKOUT_EVIDENCE.md`. Do not manipulate Git or live resources. Keep raw private inventory local; publish only the sanitized summary requested below. Reply with the file path through Herdr. Pi will read that file, not infer results from pane history.
- Do not invent another transport, auto-sync system, mount helper, service or scheduler. Cross-machine requests/replies are ordinary Markdown files on DevDrive. Herdr carries paths, not the authoritative report body.

## Accepted topology and constraints

| Purpose | Mini | Air |
|---|---|---|
| Active development when DevDrive is available | `/Volumes/DevDrive/Projects/agentic-engineering` | **The same shared working repository/path**, intentionally SMB-accessible on Air |
| Pi resource ownership | Accepted five leaves into shared checkout `harness/pi/packages/` | Accepted five leaves into `/Users/alexanderortiz/Github/agentic-engineering/pi/`; keep local and offline-capable |
| Offline fallback | Existing local runtime unchanged | Retain complete local checkout and its accepted Pi resource links |

The Air already passed accepted runtime and cold resource loading with network and `/Volumes` access denied. **Do not reinstall Pi or repeat those checks.** A diagnostic run from the SMB checkout compares against that checkout's targets and is not an ownership verdict about a different accepted local checkout. The local Air links are neither broken nor unmanaged on that basis.

Using DevDrive as CWD does not require changing Pi HOME links. No Air relink is necessary just to share active development. Local fallback is the same Git repository at an explicitly recorded accepted revision, not a second independently authored source. Git synchronization, if needed, is manual, approved and versioned; no filesystem synchronization is proposed.

## Observed Git state (local read-only snapshot)

- Shared branch: `workbench/construction-slice`; HEAD `e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354`.
- Cached `origin/main` and `origin/HEAD` point to that HEAD. These are cached refs, **not** a live GitHub freshness check.
- Local `main` remains `f1fc7e88e2b292187856176f5dccbdf41a927649`, three commits behind cached `origin/main`. Do not switch/reset it.
- Recent accepted commits: `e9c0a62` Air study/composer, `7a7fdb4` bidirectional promotion/local apply, `bdb76ca` Mini profile/Air handoff. No new migration commit exists yet.
- Index is empty. Tracked dirty files include `.gitignore`, `AGENTS.md`, root README, architecture and Workbench. New CLI/setup/harness and migration handoffs are untracked.
- Reviewed `.gitignore` delta is only `.bootstrap/`; reviewed `AGENTS.md` delta is only three setup ownership bullets plus accepted-host/shared-workspace/local-resource/source-handoff wording. These are migration changes, unlike unrelated root README/architecture/Workbench edits.
- Fetch and push destination: `origin = git@github.com:alexortiz201/agentic-engineering.git`.
- **Air observed:** clean local `main` at the same `e9c0a625`, empty index, local Data filesystem, all five accepted local root-Pi source hashes match canonical accepted bytes. New harness/setup/CLI paths are absent both at HEAD and untracked. Canonical Workbench source is present. Source: [actual shared-file report](AIR_LOCAL_CHECKOUT_EVIDENCE.md), read by Mini after Air verified it on DevDrive.

Shared development is safe only with nonoverlapping file ownership and one Git writer at a time. All machines see the same dirty tree/index/branch. It is **not** safe for independent checkout/reset/stash/clean/staging/commit operations. Before any approved Git-write window, acknowledge current owners, recheck the index/HEAD/file list and stop on unexpected changes. No custom locking system is required.

## Air read-only task — completed; retained as inspection scope, not a repeat request

**Completed:** Air read this actual shared artifact, inspected with shared DevDrive as tool CWD, wrote `AIR_LOCAL_CHECKOUT_EVIDENCE.md`, verified/read it back; Mini then read the file directly. Its existing agent process was launched in the local checkout and was not restarted/relocated. For future ordinary project sessions, start from DevDrive when connected; bounded existing-agent commands can explicitly `cd` there. No change to the Pi resource owner or session files is required.

The following records the completed task's scope; do not rerun accepted runtime tests or repeat this inventory just to acknowledge the final plan.

Use DevDrive for the active agent/project CWD. Inspect the retained local checkout separately:

```sh
L=/Users/alexanderortiz/Github/agentic-engineering
GIT_OPTIONAL_LOCKS=0 git -C "$L" rev-parse --show-toplevel
GIT_OPTIONAL_LOCKS=0 git -C "$L" rev-parse HEAD
GIT_OPTIONAL_LOCKS=0 git -C "$L" branch --show-current
GIT_OPTIONAL_LOCKS=0 git -C "$L" status --short --branch
GIT_OPTIONAL_LOCKS=0 git -C "$L" diff --cached --name-only
GIT_OPTIONAL_LOCKS=0 git -C "$L" log -3 --oneline
# Filesystem evidence only; do not launch Pi, bootstrap, Stow or install dependencies.
df -P "$L"
```

Then use existing Node and filesystem APIs **read-only**, with local root L and actual HOME, for the following five mappings. Do not run the SMB-root inspector and call its cross-checkout warning unmanaged ownership. If the local checkout already has `setup/inspect-links.mjs` and `harness/pi/accepted.json`, its own `node "$L/setup/inspect-links.mjs" --pi` is useful metadata evidence, **not** a request for runtime acceptance; otherwise inspect leaves directly without copying scripts into L.

| Package | HOME leaf / source suffix after `.pi/agent/` |
|---|---|
| `pi-instructions` | `AGENTS.md` |
| `pi-theme` | `themes/purple-dreams.json` |
| `workbench-skill` | `skills/workbench/SKILL.md` |
| `study-skill` | `skills/agentic-engineering/SKILL.md` |
| `composer` | `extensions/composer-highlight.ts` |

For each: record exact `readlink` privately; inspect HOME parents top-down without following directory symlinks; confirm resolution is `L/pi/.pi/agent/<suffix>` or already `L/harness/pi/packages/<package>/.pi/agent/<suffix>`. Report which approved local ownership applies. Hash only those known source files; do not follow arbitrary targets. Check whether the new candidate is a regular local file, its SHA-256 equals old/live accepted bytes, and its package contains exactly the one expected leaf. Record absence explicitly; absence is not a reason to regenerate staging or reinstall anything.

Also report presence of local `harness/pi/accepted.json`, `setup/inspect-links.mjs`, `setup/bootstrap/setup`, `cli/package.json`, canonical `workbench/README.md` and `workbench/foundations/`. Determine whether candidate/setup files are committed at local HEAD or merely untracked using scoped `git ls-tree -r --name-only HEAD -- harness/pi setup cli` plus scoped status. A matching version number alone is not proof that setup changes are in Git.

Write sanitized results to `plans/handoffs/AIR_LOCAL_CHECKOUT_EVIDENCE.md` **on shared DevDrive**: ownership/task, local Git SHA/branch/dirty-scope summary, source filesystem local/nonlocal, per-package local old/new presence and source hashes/equality, setup files committed/present/absent, blockers and next action. Do not publish raw HOME inventory, credentials, settings/session/Todo data, machine identifiers or unrelated personal filenames. The already operator-provided repository path may be referenced. No Git fetch/pull/checkout/reset, no source/link writes, no runtime/PATH/settings/default/Todo operation.

Transport verified by operator and rediscovered by Mini: enabled existing Herdr machine **`Air`**, Pi agent **`w4:p1`**, idle in the retained local checkout. Earlier empty-machine observations are historical, not a current blocker. Mini will communicate this file path using `herdr --machine Air agent prompt w4:p1`; Air must verify shared-file accessibility and read it before acting. No connection/profile/server changes are needed. Its durable reply is the missing source evidence, not a request to repeat runtime acceptance.

## Proposed commits — not executed

Commit boundaries must include the earlier untracked implementation, not just the latest inspector/tests: publishing only recent files would omit their CLI/source dependencies.

1. **`feat(setup): consolidate selective provisioning and portable Pi packages`** — `.gitignore` (only `.bootstrap/`), the reviewed migration-only `AGENTS.md` delta, `SETUP.md`, authored `cli/` including lockfile/tests/docs, authored `setup/` including computer sources/manifests/provenance/bootstrap/inspector/stager/approval docs, and all eight accepted `harness/pi/` files. Retain staging/old root support; this commit installs nothing. The exact 81-file staging proposal is below (27 CLI + 43 setup + 8 harness + 3 root files); review contents before any approved Git writes. No generated CLI output/dependencies/bootstrap cache.
2. **`docs(setup): record shared workspace and durable publication handoff`** — `plans/SETUP_CLI_CLAUDE_HANDOFF.md`, this document, sanitized `plans/handoffs/PUBLICATION_SCOPE_REVIEW.md` and `plans/handoffs/AIR_LOCAL_CHECKOUT_EVIDENCE.md`. The Air source report contains approved repository paths, public-source hashes and Git state, not raw HOME/runtime state; remove the unnecessary disk-device identifier before approval/publication. Exactly four handoff files, subject to final privacy review; no private receipts/raw inventories.

Excluded in full: root `README.md`, `architecture/**`, `workbench/**`, other existing plan/evidence WIP, private overlays, `.env*`, auth/settings/session/Todo state, generated build/cache/runtime output. Root `pi/` (all 13 files), `scripts/install-pi` and fixture are unchanged and not part of either commit. Do not use `git add .`, `git add -A`, blanket `git commit -a` or a directory-only allowlist without reviewing every included file.

Proposed destination is a **review branch**, not main:

```sh
# Only after exact content/commit approval, one coordinated Git writer and a clean reviewed index:
# create the two scoped commits on the existing branch without checkout/reset;
# inspect each commit's file list and final approved commit C.
# Read-only live-ref check in the approved publication window (not executed here):
git ls-remote --heads origin refs/heads/main refs/heads/setup/consolidation
# Review availability/fast-forward eligibility first; stop on any unexpected tip. Do not force.
git push origin "$C":refs/heads/setup/consolidation
```

`C` must be the exact reviewed second commit, not a later moving HEAD. Check live GitHub refs before publishing; none were fetched/queried in this snapshot. Existing `setup/consolidation` must be absent or accept the approved ordinary fast-forward; otherwise stop for a new destination decision. No force push or direct main publication. Review/merge to main is a later explicit approval.

## Exact proposed staging and commit boundaries

**Not executed; require content/Git-write approval and coordinated owners first.** Recheck HEAD remains the reviewed base and index is empty. This native Git heredoc enumerates exactly C1's 81 paths; do not replace it with blanket directory staging. Symlinks are committed as symlinks, not dereferenced copies. Specifically `setup/resources/foundations/.local/share/ae/foundations` → `../../../../../../workbench/foundations` resolves to the already committed canonical library within the same checkout, not an absolute HOME path or new Workbench copy. The other source symlink is Ghostty's existing relative config mapping. Review the staged patch/file modes and names before the separate commit command.

```sh
git add --pathspec-from-file=- <<'MIGRATION_PATHS'
.gitignore
AGENTS.md
SETUP.md
cli/AGENTS.md
cli/DEVELOPMENT.md
cli/README.md
cli/package-lock.json
cli/package.json
cli/src/commands/setup.ts
cli/src/components/catalog.ts
cli/src/index.ts
cli/src/profiles/index.ts
cli/src/prompts/choices.ts
cli/src/prompts/controls.ts
cli/src/prompts/setup.ts
cli/src/setup/detect.ts
cli/src/setup/execute.ts
cli/src/setup/files.ts
cli/src/setup/migration.ts
cli/src/setup/plan.ts
cli/src/setup/theme.ts
cli/src/setup/types.ts
cli/tests/computer.test.ts
cli/tests/entrypoints.test.ts
cli/tests/pi-inspection.test.ts
cli/tests/setup.test.ts
cli/tests/sources.test.ts
cli/tests/terminal-probe.py
cli/tests/ux.test.ts
cli/tsconfig.json
harness/pi/README.md
harness/pi/accepted.json
harness/pi/packages/composer/.pi/agent/extensions/composer-highlight.ts
harness/pi/packages/pi-instructions/.pi/agent/AGENTS.md
harness/pi/packages/pi-theme/.pi/agent/themes/purple-dreams.json
harness/pi/packages/study-skill/.pi/agent/skills/agentic-engineering/SKILL.md
harness/pi/packages/workbench-skill/.pi/agent/skills/workbench/SKILL.md
harness/pi/settings.example.json
setup/ACCEPTANCE.md
setup/MIGRATION.md
setup/OWNERSHIP.md
setup/bootstrap/setup
setup/computer/gh/.config/gh/config.yml
setup/computer/ghostty/.config/ghostty/config
setup/computer/ghostty/.config/ghostty/themes/purpledreams
setup/computer/ghostty/Library/Application Support/com.mitchellh.ghostty/config
setup/computer/git/.gitconfig
setup/computer/git/.gitignore_global
setup/computer/herdr/.config/herdr/config.toml
setup/computer/manifests/brew/Brewfile.air
setup/computer/manifests/brew/Brewfile.mini
setup/computer/manifests/brew/Brewfile.shared
setup/computer/manifests/bun/global-packages.txt
setup/computer/manifests/npm/global-packages.txt
setup/computer/source-provenance.json
setup/computer/ssh/.ssh/config
setup/computer/zsh/.local/bin/aircopy
setup/computer/zsh/.oh-my-zsh/custom/env.sh
setup/computer/zsh/.oh-my-zsh/custom/plugins/colored-man-pages/README.md
setup/computer/zsh/.oh-my-zsh/custom/plugins/colored-man-pages/colored-man-pages.plugin.zsh
setup/computer/zsh/.oh-my-zsh/custom/plugins/colored-man-pages/nroff
setup/computer/zsh/.oh-my-zsh/custom/plugins/docker-compose/README.md
setup/computer/zsh/.oh-my-zsh/custom/plugins/docker-compose/_docker-compose
setup/computer/zsh/.oh-my-zsh/custom/plugins/docker-compose/docker-compose.plugin.zsh
setup/computer/zsh/.oh-my-zsh/custom/plugins/docker/README.md
setup/computer/zsh/.oh-my-zsh/custom/plugins/docker/completions/_docker
setup/computer/zsh/.oh-my-zsh/custom/plugins/docker/docker.plugin.zsh
setup/computer/zsh/.oh-my-zsh/custom/plugins/gh/README.md
setup/computer/zsh/.oh-my-zsh/custom/plugins/gh/gh.plugin.zsh
setup/computer/zsh/.oh-my-zsh/custom/plugins/git/README.md
setup/computer/zsh/.oh-my-zsh/custom/plugins/git/git.plugin.zsh
setup/computer/zsh/.oh-my-zsh/custom/plugins/ssh-agent/README.md
setup/computer/zsh/.oh-my-zsh/custom/plugins/ssh-agent/ssh-agent.plugin.zsh
setup/computer/zsh/.oh-my-zsh/custom/plugins/vscode/README.md
setup/computer/zsh/.oh-my-zsh/custom/plugins/vscode/vscode.plugin.zsh
setup/computer/zsh/.oh-my-zsh/custom/themes/purpledreams.zsh-theme
setup/computer/zsh/.stow-local-ignore
setup/computer/zsh/.zshrc
setup/inspect-links.mjs
setup/resources/foundations/.local/share/ae/foundations
setup/stage-pi.mjs
MIGRATION_PATHS
git diff --cached --name-only
git diff --cached --check
# Stop to inspect the complete staged patch; exactly the 81 approved paths, no extras.
```

Only after matching staged-content review, proposed commit command:

```sh
git commit -m "feat(setup): consolidate selective provisioning and portable Pi packages"
```

C2 then stages exactly four sanitized, reviewed handoff documents; no other plan/evidence WIP:

```sh
git add -- plans/SETUP_CLI_CLAUDE_HANDOFF.md \
  plans/handoffs/SHARED_DEVDRIVE_PUBLICATION.md \
  plans/handoffs/PUBLICATION_SCOPE_REVIEW.md \
  plans/handoffs/AIR_LOCAL_CHECKOUT_EVIDENCE.md
git diff --cached --name-only
git diff --cached --check
# Stop to inspect the four-file staged patch before the approved commit.
```

```sh
git commit -m "docs(setup): record shared workspace and durable publication handoff"
```

If any step fails or unexpected paths are staged, stop without automatic reset/stash/cleanup. No hook bypass, force, extra commit or unrelated-index repair is authorized. Inspect each resulting commit and name approved C before the separately approved push above. The existing local branch need not be switched or renamed; the explicit remote ref maps only the reviewed commits to the review branch. Current unrelated dirty files stay unstaged in place.

## Conditional local fallback update and source-layout handoff

After publication approval and actual Air report, if local L is behind, clean for affected paths and an ancestor of approved C:

```sh
# Proposal only, on Air, after approval naming C and unchanged local before-state:
git -C "$L" fetch origin refs/heads/setup/consolidation:refs/remotes/origin/setup/consolidation
# Verify fetched identity/ancestry and the reviewed migration-only changed paths first.
git -C "$L" merge --ff-only "$C"
```

No pull/checkout/reset/clean, no dependency/bootstrap install. Abort on local changes, divergence, unexpected remote identity or changed old resource bytes. This source-only update adds accepted resources/tools; it must not modify/delete the five old root files that live Air links still need. If L already contains the exact reviewed committed candidates, no synchronization or relink is implied. Active development remains on DevDrive, not L.

Only if a source-layout handoff is still desired/necessary after the report: propose a **separate Air approval** for exactly five local old-to-local new leaves, using L in both source roots. The subsequent scope-matching Stow proposal (only after verified, approved old-leaf detachment; **not executable now**) is:

```sh
stow --dir="$L/harness/pi/packages" --target="$HOME" --no-folding --simulate --restow \
  pi-instructions pi-theme workbench-skill study-skill composer
```

Only a successful identical-scope preflight and explicit handoff approval permit the same command without `--simulate`; no unlink/apply command is run by this document. Reverify real parents/operator ownership, exact old literals and one-file packages; preserve private link-only receipt; detach only matching leaves; native selective Stow `--no-folding` simulate then identical approved apply; verify five new literals/realpaths/hashes remain under local L and equal accepted bytes. Already-selective leaves are no-ops. No runtime/loading/offline reacceptance, settings/Todos or model probes. Keep accepted runtime/private state unchanged.

Rollback only recorded affected leaf links, only if still matching approved new links; restore exact old local literals into absent destinations after source-hash checks. Never restore HOME snapshots, remove source trees, force overwrite or use SMB targets. Do not execute unlink/apply commands from this proposal.

## Remaining legacy dependencies and stop boundary

1. Shared DevDrive project CWD and accepted local Air Pi can coexist **now**, with no relink or installer.
2. Get sanitized Air Git/candidate report; approve/publish scoped Git commits; optionally fast-forward local fallback to approved C. No automatic synchronization.
3. Separately approve local-to-local Air resource handoff only if needed for final source authority. If declined, keep old local ownership and retain corresponding canonical old sources/support paths; source cleanup is still blocked, not a reason to break offline Pi.
4. After actual consumers permit it, separately transition old `scripts/install-pi`, `setup/stage-pi.mjs`/source tests, managed locks/recovery docs and dotfiles `pi-resources`. All root Pi files remain intact meanwhile. Never update Air fallback to a later cleanup commit that deletes the old files while its links still use them.
5. Six dotfiles computer packages, `bootstrap`/`stow-all`, and Air snapshot/home/SMB recovery/service owners remain explicit independent disposition gates. Use existing selective CLI/Stow for supported config/package behavior; do not create replacement wrappers/services. Do not retire dotfiles, local releases or backups in this task.

## Verification and changes in this task

- Prior implementation: strict check/build, **63 tests**, five PTY scenarios at both widths, existing Pi fixtures pass; Mini five resources/old sources protected unchanged. This task does not repeat Mini acceptance or Air runtime acceptance.
- Current task: read-only branch/ref/index/status and migration dependency inspection; Air's actual shared-file source report; topology/acceptance/ownership documentation corrections and durable publication plan. Source isolation check: exported tracked baseline with `git archive HEAD` into an OS temporary directory, overlaid **only the 81 proposed C1 files**, reused already installed locked development dependencies, then passed strict check/build and **63/63 tests**. No unrelated Workbench/README/architecture WIP was included. This disposable test fixture is not an Air copy/deployment mechanism; no nested `.git` or shared index was created. Independent review and final checks are recorded below.
- No staging, commits, checkout/reset, fetch/pull/merge, push, live Air action, link change or legacy retirement authorized/executed.

### Air final file acknowledgment — completed (no new inspection)

When Mini sends this updated shared path after integration, read the actual final document. In your exclusively owned `AIR_LOCAL_CHECKOUT_EVIDENCE.md`, replace the unnecessary device-specific `df` identifier with a simple verified local Data-filesystem description; do not rerun inventory/runtime checks. Preserve all substantive findings. Verify the reply file still exists on DevDrive and acknowledge this final proposal's stop boundary via Herdr. Do not stage/commit/update the local checkout or change the agent/runtime owner. The lead will read the corrected report file before considering it in proposed C2.

### Claude final report-only corrections — completed (no new audit)

The bounded review is complete and Pi has read the file. For the final report revision, only update your owned `PUBLICATION_SCOPE_REVIEW.md` to align these facts; do not rerun an audit or change source/Git metadata:

- Final C2 is **four** paths, because Pi reviewed the sanitized Air source report and proposes including it. Raw literals/private HOME/runtime data remain excluded. Mark the initial three-file/default-exclusion count as historical or update it consistently.
- `setup/computer/` contains **36** entries: **30** package leaves, **5** manifest files and **1** provenance file (not 37 package files). C1 remains exactly 81 paths.
- The Air OS username in the operator-provided path is **not** the repository GitHub account (`alexortiz201`). Do not assert they are the same or justify privacy that way; these are explicitly operator-provided topology paths, not credentials. Publication still requires approval.
- The live remote-ref check is `git ls-remote`, not a fetch or a Pi runtime check. Accepted Pi runtime/offline checks are not repeated.
- All three scope recommendations are now reflected above: explicit 81-file manifest including both approval docs and each harness leaf; relative Foundations symlink annotated. Record their disposition in the verdict.

Verify the report exists/read it back and return only its path. Pi owns this document and all source; no overlapping edit is requested.

### Final integration evidence

- Air's shared-file report was read and its unnecessary device identifier removed by its owner. All five accepted old/live hashes equal both canonical root and harness resources. Candidates are absent locally; no comparison failure or runtime defect is implied.
- Claude independently confirmed C1's 81-file scope, dependency closure, migration-only tracked deltas and no credential material; its three concrete recommendations are implemented in the exact staging proposal and symlink annotation. Final report-only metadata corrections above do not reopen source review.
- Scoped baseline-export check/build and **63 tests pass** with unrelated WIP omitted. No application-level Mini/Air acceptance was repeated.
- Final checks passed: exact C1 allowlist is **81 unique actual files**; C2 is four reviewed files. All nine task-edited documents are whitespace-clean and documented shell blocks parse without execution. Index remains empty, HEAD remains `e9c0a625`. All 13 root Pi files, eight harness files, old installer/generator and five live Mini literals remain unchanged. Original unrelated tracked diff fingerprint is unchanged after accounting only for the intentional migration-only root AGENTS sentence update.
- Air verified accessibility, read the actual shared request and sanitized/verified its reply file. Claude read the actual handoff, wrote/verified its independent review, and completed bounded factual corrections. Pi read both files directly. No pane-history/clipboard transfer was treated as evidence.
- **Ready for operator review of proposed commits/publication; not approved to execute.** No consequential live/Git action is authorized by this report. Both agents have finished their bounded tasks; no source/Git-write work is running on their behalf. Exact path to this artifact: `/Volumes/DevDrive/Projects/agentic-engineering/plans/handoffs/SHARED_DEVDRIVE_PUBLICATION.md`.

## Approved publication execution window

The operator explicitly approved the two exact reviewed messages, 81 implementation paths and four handoff paths, with normal publication only to `origin/setup/consolidation`. Mini Pi is the **sole Git operator**. Claude and Air Pi: read this actual shared section, hold all Git/source/report writes, acknowledge only, and wait for the publication-result notification. No further inspections or private/runtime operations are requested.

Execute on existing `workbench/construction-slice` without checkout/reset/stash or touching unrelated dirty files. Reverify clean index, base/remote ancestry, exact staged objects and full resulting trees. Stop on unexpected files, hooks, ancestry or external changes; never force or silently repair them.

Live preflight observed GitHub `main` at accepted `e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354`; `setup/consolidation` did not exist. Existing local `main` stays unchanged. GitHub freshness will be checked again before normal push. No new local branch is required.

Strict staged precommit validation first stopped before creating any commit: `git diff --cached --check` found four inherited trailing-whitespace lines (one in `setup/computer/zsh/.oh-my-zsh/custom/plugins/docker-compose/README.md`, three blank lines in `setup/computer/zsh/.oh-my-zsh/custom/plugins/git/git.plugin.zsh`). Only those four line endings were normalized within the existing 81-path scope. No semantic/source-identity/runtime change or manifest expansion; original dotfiles and its import-provenance hashes remain untouched. The strict staged check, targeted Zsh syntax and source tests must pass before resuming; no whitespace rule or hook is bypassed.

**C1 created and independently verified:** `1578c7e265d2398e315ccd1550a4d1720c1378d6`, message `feat(setup): consolidate selective provisioning and portable Pi packages`; parent `e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354`; tree `56cdff503cef3078ca38de270bf8d6a5535eff13`. Exactly 81 approved paths. The entire tree equals the accepted base plus only the approved file blobs/modes, including the documented whitespace-only normalization. Strict staged whitespace, targeted Zsh syntax/typecheck and **63 tests** pass. All 50 unrelated changed/untracked files and protected Pi sources/live literals are unchanged.

After publication, append the actual C1/C2 IDs, remote verification and outstanding host steps here. The final self-referencing C2/result receipt necessarily follows C2 and remains a shared working-tree documentation update unless separately approved for a later commit; do not invent a third commit or amend the two approved commits. Air must not fetch/pull/update its local checkout or change links merely because publication completes.
