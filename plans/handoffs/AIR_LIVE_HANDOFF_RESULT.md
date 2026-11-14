# Air live handoff readiness — read-only phase

Observed 2026-11-14T17:22:22Z. Air Validation Worker only, assigned by Main Orchestrator Mini Pi `w7:p0`; no inherited deployment/publication authority. Read the actual shared `AGENTS.md` and `SHARED_DEVDRIVE_PUBLICATION.md`. This assignment authorizes only this report, superseding older hold/report-path instructions for this bounded phase.

## Identity and command evidence

- Actual hostname verified privately as Air; macOS 26.6.2 (25G83), arm64, operator UID 501. Herdr environment active, worker `w4:p1`. Hostname literal omitted from this shared sanitized report.
- Active project for bounded commands: `/Volumes/DevDrive/Projects/agentic-engineering` (SMB). Retained local resource owner `L=/Users/alexanderortiz/Github/agentic-engineering` is APFS/local.
- Tool shell resolves Pi first to `~/.pi/agent/bin/pi`, then `~/.local/bin/pi`. Fresh login Zsh resolves `~/.local/bin/pi` first, then the managed shim. Both paths are the same managed runtime; both version probes report **1.5.2**.
- Claude resolves `~/.n/bin/claude`, then `~/Library/pnpm/bin/claude`; direct and fresh-login version probes both succeed: **2.1.325 (Claude Code)**. No install/repair performed.
- GNU Stow **2.4.1** available at `/opt/homebrew/bin/stow`. Not invoked against live resources.
- No inherited `PI_CODING_AGENT_DIR` or `PI_SELF_UPDATE_COMMAND` override present (values not printed).

Managed metadata: current-version **1.5.2**; receipt kind `pi-managed-install`, schema 1, layout `releases-v1`, symlink entrypoint `~/.local/bin/pi`. Entrypoint literal is `../../.pi/agent/bin/pi`; shim is regular executable 0755, receipt/marker regular 0644, all UID 501. Installed release identity is `@earendil-works/pi-coding-agent@1.5.2`. Installed release `package.json` and `package-lock.json` match local accepted `pi/managed-lock/1.5.2/` byte-for-byte. No receipt/settings/auth/session contents published.

## Local Git and source readiness

- Branch `main`, HEAD **e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354**; clean working tree and empty index. Status tracks cached `origin/main`; this is not a live remote freshness assertion.
- Exactly one listed local worktree: L, same branch/revision. No alternate local worktree observed.
- Origin matches documented `git@github.com:alexortiz201/agentic-engineering.git`. No configured core.hooksPath observed; ordinary local hooks directory contains no active non-sample hooks. Recheck before execution.
- Exact target **8656a79767b2ef67aedd462b1081a2e0b0ed509f** is not available in local object storage. No fetch attempted.
- Read-only shared committed-object check confirms accepted base is an ancestor of that target and target changes **zero paths under `pi/`**. Publication/remote identity evidence is retained from lead's shared receipt, not freshly queried over network here.
- Local `harness/pi/accepted.json`, `setup/inspect-links.mjs`, `setup/bootstrap/setup`, `cli/package.json`, and all five local harness candidates are absent. Scoped local HEAD tree lists no harness/setup/CLI paths; clean status excludes untracked additions. Canonical local Workbench README and Foundations directory are present and local.

**Source-only update readiness: ready to request approval, not executed.** After approval: recheck exact before-state, ordinary hooks and origin, fetch the documented review ref into the local checkout only, require fetched tip exactly equal C2 above, verify ancestry/scope and unchanged old resource bytes, then `merge --ff-only` that exact SHA. Stop on drift/divergence/unexpected hooks. No shared Git writes, checkout/reset/stash/clean, dependencies, bootstrap, settings or runtime operation. The shared dirty tree is not a Git-write target.

## Five exact resources

Each HOME leaf below is relative to `~/.pi/agent/`. Every live leaf is a UID-501 symlink, lstat mode 0755, and its literal resolves directly to `L/pi/.pi/agent/<leaf>` with realpath equal to that exact local source. Literal strings were checked directly, not inferred from SMB diagnostics; they remain unchanged. Old sources are regular UID-501 mode-0644 files and equal local accepted HEAD blobs. Shared harness candidates are regular UID-501 mode-0644 files, equal those old/live bytes, with exactly one expected leaf in each package. Local candidates are absent in every row.

| Package | Exact HOME leaf | SHA-256: local old/live = accepted HEAD = shared candidate |
|---|---|---|
| pi-instructions | `AGENTS.md` | `04d5065fac818554a1326df9227254dc4d3b21c4674986172a393eb2200b763e` |
| pi-theme | `themes/purple-dreams.json` | `73d86db506f25164edf7c7266898f9c7d349778a8ca55f30b129267c7ef3805a` |
| workbench-skill | `skills/workbench/SKILL.md` | `f17a20f40d793552e61450478203244af34ea8ef3fcf4bc50c7409cc8d20662f` |
| study-skill | `skills/agentic-engineering/SKILL.md` | `0e76c36a8e1806164b33f23d668484f283bf5316e52d25d2373e71edb5545e9f` |
| composer | `extensions/composer-highlight.ts` | `cdfcd4ba722253d3fb9488b5a5833cac8f2f5dc14369aebe9a5161cb1eb595d1` |

Parents were inspected top-down using lstat: all HOME discovery parents and local source parents are real directories, not directory links. `/` and `/Users` are UID 0/0755; HOME UID 501/0750; all inspected descendants through the five leaf parents and local source parents UID 501/0755. Shared candidate parents are also real directories: `/Volumes` UID 0/0755, DevDrive mount UID 501/0700, subsequent inspected parents UID 501/0755. Shared ownership/hash equality does **not** authorize SMB runtime targets.

**Five-leaf handoff readiness: conditional, not executable yet.** Source synchronization must first supply local candidates at exact C2. Reverify their committed bytes, one-file package scopes, real parents/UID/modes and five unchanged old literals. Then obtain transaction approval, create a new private link-only receipt (directory 0700/files 0600), detach only verified old leaf links, native selective Stow `--no-folding` simulation and identical-scope approved apply for these five packages only. Verify new literals/realpaths remain under L and preserve accepted hashes. No broad CLI apply. Guarded rollback removes only matching new leaves and restores exact old literals into absent destinations after old-byte checks. No HOME snapshots or settings/auth/session restoration. No receipt or link was created in this phase.

## Recovery metadata and backup boundary

- Specified `/Volumes/DevDrive/Projects/backup-v1`: **not visible / existence check false from Air**. No contents inspected. Intended role is retained legacy backup/recovery material, not a runtime source or handoff destination; exact backup-v1-specific documentation was not located in the scoped repository Markdown search. Do not infer health or retire it. Lead should confirm documented role/visibility if required by the eventual transaction.
- Existing private Air migration rollback root exists, UID 501, real directory 0700. Observed prior transaction directory 0700, pointer file 0600; JSON/Markdown candidate/backup payload files generally 0600, two checkpoint/acceptance Markdown files 0644, preserved package subdirectories 0700. Only names/types/UID/modes inspected, **no receipt/backup/settings/acceptance contents read**; this is not verification of rollback payload integrity.
- `~/.local/state/pi/applied-revision` exists, regular UID 501/0644; content not read. Existing `~/.local/state/ae/handoffs` absent. No prior five-leaf layout receipt exists there. Prior Mini-specific recovery root and generic Pi backups directory absent on this host; no cleanup performed.

## Herdr and acceptance boundary

- Herdr client 0.9.5, running server 0.9.1; endpoint/private protocol compatible, no restart needed, server binary reported stale. No restart/upgrade authorized or attempted.
- `herdr integration status`: Pi reporter **current v9**; Claude hook **outdated v10 versus v11**. This is a reported integration delta, not a handoff blocker or authorization to modify it.
- Enabled existing machine profile **Mini** is available. Read-only remote discovery confirms Pi agent at supplied `w7:p0`; no agent/session contents were inspected. Reply transport uses that profile and carries this report path, not private inventory.
- **Retained prior acceptance:** lead's actual shared handoff records accepted Air cold resource loading with network and `/Volumes` denied. That prior accepted behavior is retained, not freshly reproduced here.
- **Fresh evidence here:** successful Pi/Claude version probes, managed receipt/lock identity, local ownership/real-parent/mode/hash equality, source completeness metadata, Stow availability and Herdr integration status. No new resource-loading, visual, offline/reconnect, model/auth or end-to-end runtime acceptance claimed.
- Safe controlled tests available for a separately scoped approval: disposable temporary-HOME native Stow conflict-refusal → simulated handoff → five fixture links → guarded rollback; no-write local inspector after synchronization; post-handoff exact local realpath/hash verification. These prove mechanics/metadata, not real offline runtime behavior. No live network outage, mount denial/unmount, fault injection, reload, new session or package resolver run was performed or proposed as necessary here.

## Result / stop

Read-only phase complete. No source/runtime/link/settings/Git mutations performed; the only durable authored output is this report. Source-only fetch+ff requires explicit transaction approval naming exact C2. Local-to-local five-leaf handoff additionally requires candidates and approved immediate preflight/receipt/detach/Stow/rollback scope. No other worker authority, publication, retirement or main merge is asserted.

## Approved source-only execution — 2026-11-14T17:25:07Z

Main explicitly approved local-only source synchronization from exact accepted base to exact C2; five-link handoff remains **unapproved**. This execution section supersedes the earlier source-update waiting status, not its preserved before-state.

1. Read-only local preflight passed: clean `main`/index at `e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354`, expected origin, no core.hooksPath or active non-sample hooks. All five exact old literals, local realpaths, top-down real parents, UID/modes and previously recorded SHA-256 values matched. No link mutation.
2. Executed only this fetch in L:
   ```sh
   GIT_TERMINAL_PROMPT=0 git -C "$L" fetch --no-tags --no-recurse-submodules origin refs/heads/setup/consolidation:refs/remotes/origin/setup/consolidation
   ```
   Success; new local remote-tracking ref exactly **8656a79767b2ef67aedd462b1081a2e0b0ed509f**. No shared Git operation.
3. Verified fetched C2 parent is exact C1 `1578c7e265d2398e315ccd1550a4d1720c1378d6`, C1 parent exact accepted base; accepted C1/C2 tree IDs match publication receipt. Ancestry passed. Parsed the explicit reviewed 81-path C1 allowlist from the actual shared publication document and matched fetched C1 path set; matched four exact C2 handoff paths and total **85** distinct changed paths. **Zero root `pi/` changes**. Local tree remained clean at base before merge.
4. Executed:
   ```sh
   git -C "$L" merge --ff-only 8656a79767b2ef67aedd462b1081a2e0b0ed509f
   GIT_OPTIONAL_LOCKS=0 node "$L/setup/inspect-links.mjs" --pi
   ```
   Fast-forward succeeded (85 reviewed paths). Inspector exited 0: source exact C2, APFS/local, `sourceChanges` empty, **zero blockers**, `readyForApproval: true`, `handoffNeeded: true`, `approvalRequired: true`. Managed 1.5.2 topology verified, no inherited override. All five remain `accepted-root-pi` links; local committed candidates now exist, equal accepted baseline hashes above, regular UID 501/0644, exactly one leaf per selected package. Local Workbench/Foundations present. Inspector did not load resources or read credentials/settings/sessions.
5. Final local status: clean `main`, empty index, HEAD **8656a79767b2ef67aedd462b1081a2e0b0ed509f**; ahead of cached `origin/main` by two commits (expected: review branch was fetched, main was not published). Old root sources retained. No dependency/bootstrap/runtime/settings/link operations, resets/stashes/checkouts/clean, publication or shared Git writes occurred.

### Proposed private exact manifest capture — not executed

After separate five-leaf transaction approval, run the **local** inspector again and require exact C2, zero blockers, the same five packages and current old literals. Validate receipt parents top-down with lstat (real operator-owned directories, no symlinks); create only missing private receipt directories with 0700 and a new unique `air-pi-five-<UTC>` directory under `~/.local/state/ae/handoffs/`, refusing occupied paths. Use exclusive creation (`O_CREAT|O_EXCL`, mode 0600) for `manifest.json`, not a shared report or settings backup.

Capture only: schema/time/source revision, five package names, HOME leaf paths, exact `readlink` old literals, proposed relative local literals, old/new resolved source paths, UID/modes and SHA-256. Derive these from fresh lstat/readlink/known-source hashing; require equality with accepted inspector evidence immediately before detachment. Do not save whole inspector host inventory, settings, credentials, sessions or backup payloads. Keep exact old literals private for guarded rollback. Record result metadata separately 0600 after approved apply/verification. No private receipt was created during source-only synchronization.

**Request to Main:** local candidate checks now pass. Approve or decline the separate Air-only five-leaf receipt → guarded detachment → native selective Stow simulation/apply → verification/targeted rollback transaction at exact C2. All targets must stay within L; no SMB targets. Awaiting approval without any live-link change.

## Approved Air five-leaf execution — 2026-11-14T17:27:16Z

Main explicitly approved the exact Air-only five-leaf transaction at C2. This section supersedes the prior waiting-for-handoff-approval status. No broader authority is implied.

**Preflight passed:** clean local C2, local APFS, local inspector zero blockers; exact five accepted hashes above, old ownership/literals, safe real parents, UID 501, regular source mode 0644 and exactly one expected leaf per selected package. Both old and new sources are entirely under L. No SMB resource target.

**Private link-only receipt:** `~/.local/state/ae/handoffs/air-pi-five-20261114T172716.735276Z/`. Newly created receipt directories 0700; `manifest.json` exclusively created 0600 and fsynced before detachment. Contains only revision/time and five-link old/new literals, local paths, hashes, UID/modes. Exact literals remain private, not reproduced here. Existing parent directories were validated, not chmodded. No settings/auth/session backup or whole inspector inventory was written.

**Scoped operations:** each old leaf was individually rechecked immediately before unlink (real parents, operator-owned symlink, exact old literal/realpath and old/new hashes). Unlinked only those five matching old symlinks. Retained both source trees. Executed native Stow with these arguments:

```sh
stow --dir="$L/harness/pi/packages" --target="$HOME" --no-folding --simulate --restow pi-instructions pi-theme workbench-skill study-skill composer
stow --dir="$L/harness/pi/packages" --target="$HOME" --no-folding --restow pi-instructions pi-theme workbench-skill study-skill composer
```

Simulation succeeded and all five destinations remained absent (no simulation writes); only then identical-scope apply succeeded. No broad CLI apply, forced replacement or parent-directory conversion.

**Postflight passed:** 5/5 exact proposed relative literals, realpaths into local `L/harness/pi/packages/`, accepted SHA-256 equality, symlink UID 501/mode 0755, regular source UID 501/mode 0644, safe real parents. Old sources remain present and hash-equal. Re-ran local `node "$L/setup/inspect-links.mjs" --pi`: exact C2, APFS/local, zero blockers, all five `selective-pi`, `readyForApproval: true`, **`handoffNeeded: false`**. Final local Git working tree/index clean at exact C2.

Private `result.json` exclusively created 0600, records `applied-and-verified`, five verified links, zero blockers, no rollback performed and no runtime loading tested. Receipt directory verified 0700. Guarded rollback was available during execution but unnecessary; it remains limited to matching new links and exact old literals restored only into absent destinations after old hash checks. No source removal or blanket HOME restoration.

**Preserved boundary:** no runtime/PATH/settings/auth/session/Todo/reporter changes, package/model calls, reloads, new Pi sessions, network/mount fault injection, dependency/bootstrap operation or Git writes in this phase. Shared report is the only shared authored change. Prior accepted offline behavior is retained; these are fresh metadata/linking checks, not fresh loader/offline acceptance.

**Request to Main:** handoff succeeded. Please specify and approve the next fresh isolated resource-loader/offline validation scope and safe controlled mechanism. No loader, offline-denial, mount/network manipulation or acceptance session will be invented or run without that scope.

## Approved isolated native-loader / process-offline validation — 2026-11-14T17:30:29Z

Main subsequently approved exactly the disposable native loader and process-local sandbox validation below. Both runs **passed**, without starting a Pi agent/session, reloading an agent, calling settings/model/package APIs or modifying runtime/configuration. This is fresh post-handoff loader/process-denial evidence, not a claim of physical SMB disconnection or fresh visual acceptance.

### Native functions and checks

Read installed extension API documentation and native skill/extension/theme/editor interfaces and implementation as needed. Used the actual installed Pi **1.5.2** JavaScript modules via absolute local release paths; no copied/mock loader. A disposable Node script ran with cwd **L only**, `JITI_FS_CACHE=0`, explicit live HOME resource paths, and skill default discovery disabled.

- Live `~/.pi/agent/AGENTS.md` readable/nonempty.
- Native `loadSkills({cwd:L, agentDir, includeDefaults:false, skillPaths:[two exact live selected Skill files]})`: exactly `workbench` and `agentic-engineering`, **zero diagnostics**.
- Installed `setThemeJsonValidator(validateThemeJson)` enabled **full schema validation**, then native `loadThemeFromPath` successfully loaded live Purple Dreams in truecolor mode; selected the theme only in disposable process memory.
- Native `loadExtensions([exact live composer path], L)`: **one extension, zero errors**. Invoked its registered `session_start` handler with a fake UI that captures the editor factory; **no real session created**. Factory produced a subclass of installed native `CustomEditor`.
- Compared composer against native `CustomEditor`, same installed theme/keybindings and fake TUI: Markdown/inline code, fenced TypeScript, Unicode including combining accent/CJK/emoji, each at widths **40/80/140** (**9 comparisons per run**). ANSI-stripped render lines and native visible widths equal; every line fits its width; text preserved; highlighting differs as expected. Native Enter (`handleInput("\r")`) submission callback returns identical original Unicode-containing text for both editors.
- No real terminal/visual interaction tested; fake UI proves loading/editor integration and deterministic behavior only. Prior operator visual acceptance remains separate and retained.

### Exact process commands and denial profile

`command -v sandbox-exec` resolved installed `/usr/bin/sandbox-exec`. Scratch directory created using `mktemp -d /private/tmp/air-native-validation.XXXXXX`, actual directory `/private/tmp/air-native-validation.pvh1mh`, outside HOME. Commands executed from L:

```sh
JITI_FS_CACHE=0 node /private/tmp/air-native-validation.pvh1mh/validate.mjs
JITI_FS_CACHE=0 /usr/bin/sandbox-exec -f /private/tmp/air-native-validation.pvh1mh/offline.sb /Users/alexanderortiz/.n/bin/node /private/tmp/air-native-validation.pvh1mh/validate.mjs --sandbox
```

Both exit **0**. Exact temporary sandbox profile:

```scheme
(version 1)
(allow default)
(deny network*)
(deny file-read* (subpath "/Volumes"))
(deny file-read* (literal "/Users/alexanderortiz/.pi/agent/auth.json"))
(deny file-read* (literal "/Users/alexanderortiz/.pi/agent/settings.json"))
(deny file-read* (subpath "/Users/alexanderortiz/.pi/agent/sessions"))
(deny file-write* (subpath "/Users/alexanderortiz"))
```

Sandbox script ran negative controls **before** importing/loading resources:

1. Read actual known `/Volumes/DevDrive/Projects/agentic-engineering/plans/handoffs/SHARED_DEVDRIVE_PUBLICATION.md` → **EPERM**, explicitly asserted EPERM/EACCES rather than ENOENT or assumed denial.
2. `net.connect({host:"127.0.0.1", port:9})` → **EPERM**, explicitly asserted EPERM/EACCES rather than connection refusal/timeout. No listener/server started.
3. The **same native-loader validation** then passed completely under those process-local restrictions, including both Skills, full theme schema, composer native load, nine render comparisons and submission.

Evidence fingerprints before cleanup: temporary `validate.mjs` SHA-256 `903c4c842af589b8139280bdbb0526bb6d4746ad61e19c9d02170fc5a9f7fe87`; profile SHA-256 `f99cc02f39611d62d10309bed38b1b700258909c17b4e66c07848ed1fdb2da43`. These identify observed scratch bytes, not retained source files. Deleted only these two owned files with individual unlink and removed their now-empty scratch directory with rmdir; absence verified. No HOME scratch files/cache were requested; JITI filesystem cache disabled for both runs.

### Recovery / final state and boundaries

After sandbox process exit, read the actual shared publication file successfully again using the read tool. Existing `herdr --machine Mini agent list` succeeds and confirms supplied Pi pane `w7:p0`; no session contents read/published. Herdr reply carries this shared report path. This is controlled **process-denial/recovery**, not actual network or SMB disconnect/reconnect. No mounts, network interfaces, services, servers, running agents, security preferences or runtime installations were changed.

Final local Git status clean at exact C2 (expected two commits ahead of cached origin/main). Local inspector again reports APFS/local, **zero blockers**, **handoffNeeded:false**. Both source trees retained. No private settings/auth/session copies or digests taken; no assertion of pre/post byte-comparison is made. Sandbox explicitly prohibited their reads and HOME writes; normal validation used only the specified resource functions, not settings/auth/session APIs. Existing report/receipts from approved earlier phases remain intact. Fresh bounded validation complete; no further authority or cleanup/publication inferred.

## Approved Air local wizard acceptance — 2026-11-14T17:34:04Z

Main approved locked checkout-local dependency installation and wizard acceptance at exact C2, plus a bounded native discovery inventory. Local cwd remained L; initial and final local tree/index **clean**, HEAD exact **8656a79767b2ef67aedd462b1081a2e0b0ed509f**. No shared Git operations or live wizard apply.

Existing Node **v24.16.0**, npm **12.2.2** reused. npm cache/logs isolated in an owned `/private/tmp/air-wizard-acceptance-*` temporary directory, removed on runner exit; `npm_config_fetch_retries=0`, `npm_config_audit=false`, `npm_config_fund=false`. No global install or bootstrap runtime download; dependencies/build outputs retained only as ignored checkout-local `cli/node_modules`/`cli/dist`. Lockfile digest unchanged. No network failure/retry occurred.

Exact commands from L and observed outputs:

```sh
npm --prefix "$L/cli" ci --ignore-scripts
# added 9 packages in 617ms; exit 0
npm --prefix "$L/cli" run check
# tsc --noEmit; exit 0
npm --prefix "$L/cli" run build
# tsc; exit 0
npm --prefix "$L/cli" test
# tests 63; suites 0; pass 63; fail 0; cancelled 0; skipped 0; todo 0
# duration_ms 8101.510708; exit 0
python3 cli/tests/terminal-probe.py
# five PTY PASS results; exit 0
```

All five PTY outcomes: 15 direct selections/plan/final confirmation with back/profile overrides and fixture current no-op apply; all three deliberate removal scopes/back navigation/dry-run preservation; existing-machine 13 recommendations preserved and Escape cancellation; unsafe-parent cleanup review blocked and safely returned; Ctrl+C cancellation. Fixtures use temporary homes and controlled managers; only fixture profile receipt written during the no-op-apply scenario. No real package mutation, Todo package command or general configuration apply.

Ran the **actual local bootstrap**, headless custom five-resource dry-run twice:

```sh
sh "$L/setup/bootstrap/setup" --dry-run --json --profile custom --select pi-instructions,pi-theme,workbench-skill,study-skill,composer
# Repeated identically once; both exit 0
```

Each JSON preview: **58 operations = 5 noops + 53 skips; 0 conflicts**. Exactly `pi-instructions`, `pi-theme`, `workbench-skill`, `study-skill`, `composer` are noops. Both complete plan objects equal. Only sanitized selected operation/count output captured here; unrelated detected state/private settings values not published. Bootstrap reused existing Node/dependencies and did not download anything.

**Private preservation checks across dependency install, all tests/PTYs and both real previews:** settings SHA-256 computed before/after only in orchestrator memory, equality **true**; digest bytes/values never printed or persisted. All five exact link literals, resolved paths, content hashes, UID/modes identical. Sessions inspected via filesystem metadata only, never contents: **127 pre-existing entries, 0 missing, 0 added, 0 file growth, 0 same-size mtime changes**; inode/UID/mode matched for all entries, and no file shrank. This proves observed metadata preservation, not an unperformed session content comparison. No auth/settings/session byte copies made. Local lockfile and tracked state unchanged.

### Bounded native discovery inventory addition

Inspected only direct entry names/types in native user `extensions/prompts/agents/skills/themes`; known selected Skill leaf targets classified without reading private resource bodies. All inspected discovery directories present are real directories.

| Directory | Actual Air entries / ownership |
|---|---|
| extensions | exactly `composer-highlight.ts` (local harness symlink), `herdr-agent-state.ts` (regular generated reporter) |
| prompts | absent |
| agents | absent |
| skills | exactly `workbench`, `agentic-engineering` (real directories; their selected SKILL.md leaves target local harness) |
| themes | exactly `purple-dreams.json` (local harness symlink) |

This matches Main's stated Mini inventory; no additional user-discovery legacy entry observed. Settings resource-declaration fields only (`packages`, `extensions`, `prompts`, `agents`, `skills`, `themes`, where present) checked privately for case-insensitive substrings; boolean results: **lifecycle false; Herdsman false; subagent false; Scout false**. No provider/private values printed; this bounded declaration/name check is not an exhaustive private-file/body audit. No retirement/removal implied.

Air Claude Herdr hook v10 remains retained; no integration install or server restart. No model calls, new agent sessions, live apply or source advancement beyond C2. Awaiting Main's separately authorized final exact published candidate source-only fast-forward/no-op scope.

## Durable idle checkpoint — AIR-CONTINUITY-1

**Task ID: AIR-CONTINUITY-1.** Air Validation Worker only, assigned pane `w4:p1`; Main Mini Pi `w7:p0` remains orchestrator. Local cwd/resource root `L=/Users/alexanderortiz/Github/agentic-engineering`; clean local HEAD **8656a79767b2ef67aedd462b1081a2e0b0ed509f** reverified. Five-leaf handoff complete, all five local selective targets verified, source trees retained. Bounded native loader/process-offline and local wizard acceptance passed as recorded above and accepted by Main. No current implementation/mutation task remains active after this checkpoint is reported.

**Authoritative handoff/report:** `/Volumes/DevDrive/Projects/agentic-engineering/plans/handoffs/AIR_LIVE_HANDOFF_RESULT.md` (this file). **Pending action:** wait for Main to supply and explicitly approve the **exact final published candidate SHA**, local-only source fetch/fast-forward scope and final no-op checks. Do not advance beyond C2 based on a moving ref or infer publication/cleanup authority. Preserve bounded Air role after recontact.

Current native session file exists, regular and operator-owned. Its exact existing path, inode, size, mode and timestamp were recorded privately without reading any session contents in `~/.local/state/ae/handoffs/air-pi-five-20261114T172716.735276Z/continuity-1.json` (exclusive 0600 creation, fsynced, under existing private 0700 receipt directory). Size is a checkpoint observation; this active turn can append afterward. No session/settings/auth copies or restoration. Exact session path/metadata values are intentionally not published in shared Markdown; Main may retrieve the current session path through existing Herdr agent metadata or the private receipt on Air.

**Supported native exit/resume verified:** installed `docs/keybindings.md` documents default **Ctrl+D when main editor is empty** (`app.exit`) and **Ctrl+C first clears / second exits** (`app.clear`). Installed interactive implementation confirms Ctrl+D invokes graceful shutdown, while two Ctrl+C calls must occur within **500 ms** for shutdown; `/quit` also follows native graceful shutdown. Prefer Ctrl+D at the **idle main editor**, not a session picker (where Ctrl+D is delete-session). Custom keybindings were not inspected; these are documented defaults. No exit key sent by this worker.

Installed CLI help source confirms `--session <path|id>` opens an existing file by exact path; do **not** use `--fork`, `--session-id`, `/new` or an inferred latest session. `--offline` disables startup network operations (`PI_OFFLINE=1`), and startup sets `PI_SKIP_VERSION_CHECK=1`; installed package-manager code also checks offline mode to skip network installs/updates. These are native startup controls, not a global network sandbox or permission to install missing resources.

Proposed orchestrator-only restart after cleanly stopping **only this worker Pi process**, leaving pane/Herdr/Claude intact:

```sh
cd /Users/alexanderortiz/Github/agentic-engineering
/Users/alexanderortiz/.pi/agent/bin/pi --offline --session "$EXACT_EXISTING_AIR_SESSION_FILE"
```

Require the path to match the existing session recorded privately; resume naturally reads/continues that same native transcript, not restores/copies files. No new prompt/model call is implied by startup. Stop on any installation/auth/security approval, missing/changed session identity, or evidence of unrelated state mutation; do not repair/reinstall or change preferences. Normal native shutdown/resume can update the resumed session/reporter's ordinary lifecycle state; no unrelated session or settings mutation is authorized. Runtime is already managed 1.5.2 and required resources/dependencies are present, but actual restart is **not performed or accepted by this worker yet**.

**Ready to settle idle and await orchestrator.** This planned interruption/recontact validates native worker continuation only, not physical SMB outage. No process exit, mount/network changes, server stop, restoration or runtime/configuration mutation executed while preparing this checkpoint.

## AIR-CONTINUITY-1 recovered — 2026-11-14T17:38:45Z

Resumed bounded assignment from Main Mini Pi `w7:p0`; current role is **Air Validation Worker only**, derived from the new brief, not inherited authority. Read the actual shared checkpoint above and retained its pending action: **STOP awaiting exact-final-revision source-only update authority**. No moving-ref update, publication, cleanup or broader runtime action authorized.

**Fresh recovery evidence:** current Herdr worker metadata identifies the exact existing session path captured privately before interruption; path matches, **inode unchanged**, **size nondecreasing**, regular operator-owned session file. Only lstat/metadata inspected, no session contents read or copied. Current cwd matches the recorded local L. Inherited `PI_OFFLINE=1` present. Clean local HEAD remains exact **8656a79767b2ef67aedd462b1081a2e0b0ed509f**.

Re-ran only local read-only `node "$L/setup/inspect-links.mjs" --pi`: APFS/local, **five selective-pi resources**, zero blockers, **handoffNeeded:false**. Compared all five exact new literals/realpaths and accepted hashes against the existing private handoff manifest; all match. No source/link/settings/runtime/package/Git mutation performed.

**Settings limitation:** prior wizard before/after digests were intentionally held only in the pre-interruption Python process memory and not persisted. No prior digest exists in the continuity metadata; therefore cross-interruption settings byte equality is **not claimed** and no settings contents were read for this recovery check. The prior bounded wizard equality evidence remains valid for its own earlier interval.

Private recovery result `~/.local/state/ae/handoffs/air-pi-five-20261114T172716.735276Z/continuity-1-result.json` exclusively created 0600 and fsynced under the existing private receipt directory; records continuity booleans and observed session metadata without session contents. Shared report omits exact session path/inode/size.

**Orchestrator-reported interruption evidence (not independently witnessed by absent worker):** Main reports graceful idle Ctrl+D shutdown of only this Pi worker, shell-only foreground verified, Mini retained authority and independently passed **129 tests / zero skips** at Mini commit `f782e32130e801728e84113c4b0890ac01d8f534`, then restarted canonical Pi with `--offline --session` exact existing file in the same local cwd. This worker did not rerun or claim independent observation of Mini's tests. Fresh local identity/metadata checks above establish same-session continuation and recontact after that reported restart. No installation/auth/security approval was encountered during this resumed assignment.

**Evidence boundary:** graceful worker stop/resume/recontact, **not physical host/network/SMB outage**. No server/Claude/network/mount changes or file restoration by this worker. Only this shared report and private continuity result were written. Returning this path through existing Herdr Mini profile and settling idle pending exact-final-update instructions.

## Approved exact prepublication candidate acceptance — 2026-11-14T17:42:25Z

Main explicitly approved Air source-only local transport/fast-forward to **3de15bce2c1d39aecf7bf5c05bfbbeddc011a5b1** before GitHub publication. This supersedes the earlier wait at C2 only for this exact candidate and bounded acceptance; no publication or live-apply authority inferred.

**Preflight:** local L clean on `main`, empty index, exact C2, expected unchanged GitHub origin, no configured core.hooksPath or active non-sample hooks. Ordinary local transport command executed:

```sh
git -C "$L" fetch --no-tags --no-recurse-submodules /Volumes/DevDrive/Projects/agentic-engineering refs/heads/migration/live-handoff:refs/remotes/migration-candidate/live-handoff
```

Fetched ref exactly matches approved C. C2 ancestor verified. No remote configuration created/changed and no shared Git writes. Exact **23-path** C2..C set verified against this allowlist:

```text
AGENTS.md
README.md
SETUP.md
cli/src/components/catalog.ts
cli/src/setup/detect.ts
cli/src/setup/execute.ts
cli/src/setup/files.ts
cli/src/setup/theme.ts
cli/tests/composer-compat.test.ts
cli/tests/repeatability.test.ts
cli/tests/sources.test.ts
harness/pi/README.md
plans/handoffs/AIR_LIVE_HANDOFF_RESULT.md
plans/handoffs/LIVE_HANDOFF_EXECUTION.md
plans/handoffs/MINI_LIVE_HANDOFF_RESULT.md
plans/handoffs/RECEIPT_FIX_REVIEW.md
plans/handoffs/SETUP_REPEATABILITY_RESULT.md
plans/handoffs/SETUP_REVIEW_RESULT.md
plans/handoffs/SOURCE_TRANSITION_RESULT.md
setup/ACCEPTANCE.md
setup/MIGRATION.md
setup/OWNERSHIP.md
setup/stage-pi.mjs
```

Only generator path deleted. Explicit protected-path diff is empty for all root `pi/` (resources/seed/lock/history), five harness resources/seed/accepted metadata, `workbench/`, legacy installer and fixture. After guards passed, `git -C "$L" merge --ff-only 3de15bce2c1d39aecf7bf5c05bfbbeddc011a5b1` succeeded. Source publication status is Main's responsibility; this local acceptance does not assert GitHub publication.

**Fresh actual Air acceptance at exact C:** commands ran from local L, with `JITI_FS_CACHE=0`, existing local dependencies, `npm_config_offline=true`, audit/fund disabled; no dependency install/update invoked.

```sh
npm --prefix "$L/cli" run check
npm --prefix "$L/cli" run build
JITI_FS_CACHE=0 npm --prefix "$L/cli" test
python3 cli/tests/terminal-probe.py
node scripts/install-pi.test.js
```

All exit **0**. Strict check/build pass. Native-composer/source/repeatability and complete CLI suite: **129 tests, 129 pass, 0 fail, 0 skipped, 0 cancelled, 0 todo**, duration **9216.401417 ms**. All **five PTY scenarios pass**. Legacy fixture output: `Stow fixtures passed: plan, repeat, relocation conflict/recovery, removal, foreign conflict and local state`. Test effects remain temporary-home/controlled-manager fixtures; no actual Todo/package/general-config mutation.

Repeated actual bootstrap preview twice:

```sh
sh "$L/setup/bootstrap/setup" --dry-run --json --profile custom --select pi-instructions,pi-theme,workbench-skill,study-skill,composer
```

Both exit **0**, each **5 noops / 53 skips / 0 conflicts**; complete plans equal. Local read-only inspector at C: **APFS/local, five selective-pi resources, zero blockers, handoffNeeded:false**.

**Preservation:** settings digest captured privately in one Python runner's memory before source merge/tests/previews and compared afterward: **equal**, no digest/value printed or persisted. Five live literal links, realpaths, hashes, UID/modes all unchanged before/after. No settings/auth/session copies/restoration, auth refresh, runtime/package mutation, model call, live wizard apply or new session. No checkout/reset/stash/clean/shared Git writes, server/Claude/network/mount changes. Final local working tree/index **clean**, exact HEAD **3de15bce2c1d39aecf7bf5c05bfbbeddc011a5b1**; ignored existing checkout-local dependencies/build output retained. Both old and new resource trees remain intact.

**Result:** exact prepublication candidate accepted by fresh Air checks. Stopped awaiting Main's separately approved final docs-only postpublication source update and final no-op scope.
