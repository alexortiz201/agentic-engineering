# Air native Pi migration manifest — approval pending

This is the bounded initial Air deployment manifest for the accepted canonical repository configuration, already proven on Mini, not permission to execute. **No Air inspection or mutation has occurred in this handoff.** Use the consolidation commit reported with the handoff as `ACCEPTED_COMMIT`, and the reported dotfiles commit only if using its thin resource installer. See [the provisioning procedure](air-provisioning.md) for commands and the official-installer version gate.

## Source and scope

- Target Air identity recorded by the existing machine installer: `Alex-O-Air-M2.local`, ComputerName `Alex O Air M2`, arm64, physical local APFS HOME `/Users/alexanderortiz`. Confirm these read-only before approval; a mismatch stops deployment.
- New source `A=$HOME/Github/agentic-engineering`: a complete, independent **local Git clone** of the shared canonical repository, on a normal branch at `ACCEPTED_COMMIT`, with no alternates, linked worktree or SMB symlink. If this path already exists, preserve it and inspect cleanliness/ownership before any checkout. Never reset or overwrite local work.
- Use the same trusted shared Git remote on every Mac. Either host may propose/accept portable improvements through Git; neither has filesystem authority over the other. Mini/SMB may be an initial Git transport only. No publishing is authorized by this initial activation manifest; future promotion uses the explicit [shared workflow](README.md#experiment-promote-sync--from-either-mac).
- Runtime: official managed **Pi 1.5.2**; exact portable package **`npm:@arhen/pi-core-todo@1.1.0`**. No global npm Pi, V2 launcher, update interception, extra orchestration or syncing daemon.
- No changes to shell/terminal/Git/SSH/GH/SMB services or whole-home dotfiles deployment. Any necessary existing shell override removal must be separately identified and included in the exact approved diff.

## Per-path mutation table

Paths are Air-local. Before approval, record `lstat`, literal link target or file digest/mode, and approved disposition for **each occupied destination**. These are desired outcomes, not claimed observed Air links. Do not substitute Mini's literal link values.

| Destination | Planned operation and owner | Guard / rollback |
|---|---|---|
| `$A/` | Git clone or clean revision selection; includes `pi/`, scripts and all committed Workbench/Foundations | Refuse occupied unknown checkout or local edits; record previous revision, retain source for rollback |
| `~/.pi/agent/bin/pi`, `~/.pi/agent/install/{managed-install.json,current-version,releases/1.5.2/}` | Official installer only if missing/different; compare accepted package/lock | Record existing receipt/version/entrypoint first; installer offering a different latest version stops before mutation. Runtime replacement needs explicit version/rollback approval; never reconstruct installation from the archived lock |
| `~/.local/bin/pi` | Installer-owned symlink to `~/.pi/agent/bin/pi` | Replace only an observed, approved legacy link; retain exact original target. Do not bypass shim by linking a versioned bundle |
| `~/.pi/agent/AGENTS.md` | Stow leaf → `$A/pi/.pi/agent/AGENTS.md` | Detach only approved legacy leaf; restore recorded link after guarded removal of new leaf |
| `~/.pi/agent/skills/workbench/SKILL.md` | Stow leaf → `$A/pi/.pi/agent/skills/workbench/SKILL.md` | If `skills` is a legacy directory link, detach the link only after review, create a real container, keep original source. Never recursively delete it |
| `~/.pi/agent/themes/purple-dreams.json` | Stow leaf → `$A/pi/.pi/agent/themes/purple-dreams.json` | Same directory-link rule for `themes`; native-valid palette, no `statusLine*` roles |
| `~/.pi/agent/settings.json` | Local regular mode-0600 file, per-key reconciliation below | Back up existing local settings privately and exact original symlink target if any; refuse unknown changes before rollback. Never Stow or edit legacy shared settings source |
| `~/.pi/agent/npm/` (including local package manifest/lock and `node_modules/@arhen/pi-core-todo/`) | Native `pi install npm:@arhen/pi-core-todo@1.1.0` **only if needed**; if already installed at 1.1.0, pin the declaration without reinstall | Record old declarations and installed version/lock. Keep unrelated caches/packages. Rollback active declaration to recorded value only if unchanged since deployment; retain installed cache rather than destructively restoring all npm state |
| `~/.pi/agent/extensions/herdr-agent-state.ts` | Herdr-generated local file; keep a current valid reporter, otherwise approved `herdr integration install pi` | Record existing file/link and digest first; no canonical Stow copy or second reporter. Restore only if changed by handoff and still matching installed output |
| `~/.agents/skills/herdr/SKILL.md` | Keep valid local Skill; if absent, approved `herdr --skill` output with no-clobber creation | Compare/review existing content; never overwrite unknown file. Remove a newly created file only if its digest still matches |
| `~/.pi/agent/{agents,prompts}` | Detach approved legacy directory links that would activate obsolete resources; no new global agent runner/prompts | Keep original sources; restore literal recorded targets only when destinations remain as handoff left them |
| `~/.pi/agent/extensions/{agent-lifecycle,subagent,composer-highlight.ts}` | Detach only approved legacy links; keep source/history | No recursive deletion or package uninstall; restore only known unchanged leaves |
| `~/.pi/agent/extensions` if itself a directory symlink | Review its children first, detach approved directory link, create local container for Herdr reporter | Do not follow/remove directory contents. Unknown extensions require a decision before mutation; keep original directory and targets |
| Actual startup files containing V2 overrides/aliases, **if found** | Approve exact removal of `PI_CODING_AGENT_DIR`, `PI_SELF_UPDATE_COMMAND` or `pi` interception | No speculative edits to `.zprofile`, `.zshenv`, `.zshrc`, Herdr config or existing processes. Record only real changed hunks and reverse only matching hunks |
| `~/.local/state/pi/applied-revision` | After complete approved apply, record the accepted full Git commit as local baseline provenance | Keep the previous receipt on failure; it is not a second dependency manifest and does not claim byte-identical preferences/experimental packages |
| Selected local project checkout `.pi/settings.json`, `.pi/prompts/` or `.claude/commands/` | Preserve project-owned instructions/prompts; optional per-project prompt-path reconciliation | Separate reviewed project list and diffs; no global links or blanket trust. No project changes are implicit in the Pi activation |

**Preserve without migration:** both native and any V2 `auth.json` and session trees; local `deviceId`, trust, provider/MCP configuration, caches and installation receipt; legacy Air clone at `~/Github/dotfiles`; legacy `.pi/design`, `.pi/docs` and non-discovered archived sources. Do not copy Mini's private files or bulk-restore credential/session snapshots. Parent links, dangling links and directory collisions must all be classified before mutation; unknown ownership stops deployment.

## Local settings reconciliation

For absence only, initialize from `$A/pi/settings.example.json`, refusing regular-file or symlink collisions (including dangling links). Otherwise review each setting against the existing Air file; preserve Air identity, `lastChangelogVersion`, trust and explicitly retained preferences. Never copy Mini's device ID or whole settings file.

Accepted portable values:

- `defaultProvider: openai-codex`, `defaultModel: gpt-6.1-sol`, `defaultThinkingLevel: medium`.
- `packages: ["npm:@arhen/pi-core-todo@1.1.0"]`; exactly one todo declaration, no V2 todo pin or floating duplicate.
- `theme: purple-dreams`, `tuiMode: fullscreen`, `quietStartup: true`, `cacheWarming: off`.
- Native compaction enabled; reserve 16384 / keep recent 20000.
- Native tools `read`, `bash`, `edit`, `write`; `extensions`, `skills`, `prompts` default to empty extra-path arrays. Normal discovery still finds canonical leaves and Herdr Skill; built-in extensions stay enabled. Do not retain legacy orchestration/package paths or add `--no-extensions`.

Remove legacy **active declarations** only after per-key approval. Do not uninstall unrelated package caches or disable built-ins. Unknown active user packages require explicit review rather than automatic removal.

## Execution order after approval

1. Read-only Air before-inventory; identify active sessions and coordinate only affected ones. Create a private rollback record for approved files/link targets/settings and package/runtime state. Do not print credentials or put private backup material in Git.
2. Make the reviewed source revision locally available. Install only missing approved prerequisites (Command Line Tools/Homebrew, Git, Stow, Node >=22.19/npm, Herdr). Resolve the managed Pi 1.5.2 installer gate before runtime changes.
3. Detach exact approved conflicts, reconcile local settings, and run canonical `scripts/install-pi --target "$HOME"` as a plan. Apply only if it matches this manifest. The dotfiles `pi-resources --source "$A"` entrypoint is an alternative to the same operation, not another configuration.
4. Materialize todo 1.1.0 only if missing/different; otherwise one-key pin. Keep/reconcile local Herdr reporter and Skill. No package refresh or upgrade as a test.
5. If native Codex auth is not ready, let the owner run `env -u PI_CODING_AGENT_DIR -u PI_SELF_UPDATE_COMMAND "$HOME/.pi/agent/bin/pi" auth login openai-codex` once. Never merge V2/Mini credentials.
6. Native `/reload` in an affected existing session; no extra model acceptance sessions. Record `ACCEPTED_COMMIT` in `~/.local/state/pi/applied-revision` only after packages/defaults/resources are reconciled and verification succeeds, with intentional local exceptions understood. Do not stop unrelated sessions or run the old whole-home Air transaction. Later synchronization follows the same Git/Stow/native Pi procedure on either host, not this one-time legacy-link migration.

## Verification and offline requirements

Use existing Mini acceptance; do not rerun audits or the full suite. Air-specific deterministic checks: fresh-shell `pi` resolution with no wrapper/overrides; Pi version/receipt/accepted lock; local settings/defaults; strict Purple Dreams discovery/load; `pi list`, installed todo 1.1.0 and functioning reloaded todo tool; canonical resource realpaths and Foundations file existence; native project-prompt configuration/trust for selected projects; `herdr integration status` and the existing session's reporter path; auth readiness without credential output; session preservation versus Air's own baseline.

All runtime/resource links and project files needed offline must resolve locally with DevDrive unmounted. Install todo and chosen project dependencies while online. `pi --offline` suppresses automatic network activity; **Codex inference and OAuth renewal still need a network**. No local model is provisioned by this migration. Confirm cold offline resource availability and reconnect behavior on Air without creating extra model sessions. Do not confuse fixture success with real Air/offline acceptance.

## Guarded rollback

Stop further mutations on failure. Compare each changed leaf against the installed target/digest before undoing it. Remove only matching new canonical links; restore exact recorded legacy links/settings and entrypoint, refusing conflicts or subsequent edits. Restore a prior accepted local source revision only from a clean checkout. Retain new package caches and all new/existing auth/session state. Do not bulk-copy an installation snapshot back over HOME or roll back credentials. A runtime version change must already have a separately approved supported rollback route; otherwise do not begin it.

## Air activation boundary

Mini's acceptance and local todo pin are complete. The remaining authorization is **Air-specific inventory, reviewed before-state/per-leaf disposition and rollback protection, followed by the installation/activation and offline/reconnect checks above**. Confirm accepted source commits are reachable by the chosen Git transport; pushing requires separate permission. If official latest is not 1.5.2, stop for a runtime/version decision. No Air work has been executed and no activation approval is implied by committing this manifest.
