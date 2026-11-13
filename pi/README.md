# Native Pi resources

The approved Mini activation is now applied; see [targeted cleanup evidence](acceptance.md#targeted-cleanup-and-reactivation). Other-machine activation remains separately gated.

This package owns portable instructions, Workbench skill, theme and accepted package declarations, not the Pi executable or mutable state. V2 and dotfiles Pi sources remain protected references; existing sessions remain in place. `settings.example.json` is a seed **only for an absent local regular settings file**. Never Stow or overwrite mutable settings. Auth, sessions, caches, provider configuration and Herdr's generated reporter remain local. Existing settings/preferences must be reviewed, backed up and migrated explicitly, not silently merged.

## Runtime ownership and pin

The accepted managed baseline is **1.5.2**. `managed-lock/1.5.2/` is an exact copy of the official managed release's package and transitive lock, for reproducibility and auditing, **not** a second installation or Pi package. The official installer consumes its own published lock using `npm ci --ignore-scripts`; its `/latest` metadata determines the version. As of this preparation, registry and official release latest were independently checked as 1.5.2. On a new machine inspect the official installer and latest version first; run its documented installation only when latest is the accepted version, verify its managed receipt, version, package and lock against these references, and stop for review if they differ. The installer does not expose an evidenced historical-version option here; the archived lock is not permission to build a DIY managed installer or install a duplicate global npm Pi. Node >=22.19 and GNU Stow are prerequisites. Audit the owned managed lock only: in a temporary directory containing copies of these two files run `npm audit --package-lock-only --omit=dev --ignore-scripts`. Audit results are time-dependent.

### Accepted extension ownership

`settings.example.json` pins **`npm:@arhen/pi-core-todo@1.1.0`**, the installed and reloaded Mini version selected by the operator (not V2's 1.0.7). This is the sole accepted third-party Pi package. It has no runtime dependencies; its Pi/typebox peers are supplied by the host. The exact package version is pinned; the managed host's separate transitive lock remains under `managed-lock/1.5.2/`.

Herdr owns the generated local `extensions/herdr-agent-state.ts` and provides the Herdr Skill at the native-discovered `~/.agents/skills/herdr/SKILL.md`. Do not vendor either into a second Pi configuration. Workbench and Purple Dreams are canonical Stow leaves. Pi's built-in extensions remain enabled by default; an empty `extensions` array does not disable them. Herdsman, subagents and custom lifecycle/composer extensions remain inactive; preserve cached packages and legacy sources instead of uninstalling them.

Mini's local declaration and the portable seed both pin `npm:@arhen/pi-core-todo@1.1.0`. The approved one-key local edit preserved the existing installation and npm lock; no upgrade or reinstall was performed. Future updates must change the accepted version deliberately, not silently follow latest.

For the Air procedure, approval boundary and offline requirements see [Air provisioning](air-provisioning.md) and the [per-path migration manifest](air-migration-manifest.md).

Use the official managed shim `~/.pi/agent/bin/pi`, which reads `install/current-version`, sets `PI_MANAGED_INSTALL_ROOT`, and executes the release. The installer receipt identifies `~/.local/bin/pi` as its entrypoint. Do not point that entrypoint at a versioned bundle: that bypasses managed self-update ownership. `pi update --help` is safe inspection; `pi update` changes the installation and is not an acceptance test. Future updates require review of version/lock, compatibility and user authorization; native update remains native, not intercepted.

## Prepare resources

From a local checkout of this repository:

```sh
node scripts/install-pi.test.js
scripts/install-pi --target /absolute/path/to/existing/home
# Only after reviewing the plan and separate authorization:
scripts/install-pi --target /absolute/path/to/existing/home --apply
# Plan removal; add --apply only after review:
scripts/install-pi --target /absolute/path/to/existing/home --remove
```

Stow preflights and refuses conflicts; it does not adopt them. It links individual resource files, never settings or local runtime state. Remove links before moving the source, then Stow from its new location. If already moved, inspect and remove only verified stale links before re-stowing; do not remove foreign files. The Workbench skill resolves its own real path to this checkout's `workbench/`; deploy the whole repository locally, not only `pi/`. For Air use an independently reviewed local checkout or local deployment copy, including `workbench/`, so no live SMB mount is required. Existing dotfiles `air-snapshot` only snapshots dotfiles and its Air home transaction still owns legacy Pi links: it is not a migration of this repository. Do not run it as a Pi handoff. Air installation and offline/reconnect acceptance require separate authorization and a local-source/rollback plan.

Project prompt bodies remain with their projects. For a trusted project with `.claude/commands/`, add to that project's `.pi/settings.json`:

```json
{"prompts": ["../.claude/commands"]}
```

Paths resolve from `.pi`, not the shell's PWD. Pi loads direct Markdown prompt children; review trust and collisions. Use the project's existing settings instead of replacing them. Native `.pi/prompts/` also works. No launcher or automatic project edits are needed.

## Mini handoff procedure — approved and applied on Mini

1. Quiesce only sessions affected by the handoff after coordinating with the user; do not remove the V2 agent directory, auth or sessions. Capture current per-leaf link targets, files and settings, including generated reporter and installed package declarations; verify backups privately. A coordinator snapshot exists at `/Users/tailr.fit/.local/state/pi-native-consolidation/20261113T170838Z`; confirm completeness and account for subsequent changes before relying on it.
2. Inspect `~/.local/bin/pi`, the managed receipt, `~/.pi/agent/{AGENTS.md,skills,themes,prompts,extensions,settings.json}` and local state. Preserve the dotfiles sources. After explicit approval replace only the known V2 entrypoint symlink with a symlink to `~/.pi/agent/bin/pi`. Unset any inherited `PI_CODING_AGENT_DIR` or `PI_SELF_UPDATE_COMMAND` in the new shell; do not modify running sessions.
3. After backing up and confirming exact old links, apply the manifest below. Replace the settings symlink with a private regular local settings file initialized/reconciled from the reviewed seed while preserving desired machine-specific settings. Preflight and apply Stow only after legacy conflicts are resolved.
4. Verify shim version and `update --help`, native startup, selected resources/theme, project trust/prompt discovery, model and thinking, session continuation/compaction and real Herdr pane state; compare observed evidence, not just successful process exit. Verify V2 remains directly accessible through its own state. Do not upgrade as a test.

### Observed Mini activation manifest (recheck before any mutation)

Observed literal link values (not commands; recheck before acting):

```text
~/.local/bin/pi -> /Volumes/DevDrive/Projects/agentic-engineering-v2/bin/pi
~/.pi/agent/AGENTS.md -> ../../../../Volumes/DevDrive/Projects/dotfiles/pi/.pi/agent/AGENTS.md
~/.pi/agent/agents -> ../../../../Volumes/DevDrive/Projects/dotfiles/pi/.pi/agent/agents
~/.pi/agent/skills -> ../../../../Volumes/DevDrive/Projects/dotfiles/pi/.pi/agent/skills
~/.pi/agent/themes -> ../../../../Volumes/DevDrive/Projects/dotfiles/pi/.pi/agent/themes
~/.pi/agent/prompts -> ../../../../Volumes/DevDrive/Projects/dotfiles/pi/.pi/agent/prompts
~/.pi/agent/settings.json -> ../../../../Volumes/DevDrive/Projects/dotfiles/pi/.pi/agent/settings.json
~/.pi/agent/extensions/agent-lifecycle -> /Volumes/DevDrive/Projects/dotfiles/pi/.pi/agent/extensions/agent-lifecycle
~/.pi/agent/extensions/subagent -> ../../../../../Volumes/DevDrive/Projects/dotfiles/pi/.pi/agent/extensions/subagent
~/.pi/agent/extensions/composer-highlight.ts -> ../../../../../Volumes/DevDrive/Projects/dotfiles/pi/.pi/agent/extensions/composer-highlight.ts
```

The legacy settings target is itself a link to `../design/_settings.json`. All destinations below are under `~/.pi/agent/`; targets are in `dotfiles/pi/.pi/agent/` unless otherwise noted. Remove only after separately authorized compare-and-check:

| Destination | Current owner / proposed change |
|---|---|
| `AGENTS.md` | legacy `AGENTS.md` link → detach; Stow canonical leaf |
| `skills` | legacy `skills` directory link → detach; Stow `skills/workbench/SKILL.md` |
| `themes` | legacy `themes` directory link → detach; Stow `themes/purple-dreams.json` |
| `prompts` | legacy `prompts` directory link → detach; project prompts use project settings |
| `agents` | legacy `agents` directory link → detach, retain source as reference; subagent package/extension is not active in seed |
| `extensions/agent-lifecycle` | legacy extension link → detach |
| `extensions/subagent` | legacy extension link → detach |
| `extensions/composer-highlight.ts` | legacy extension link → detach |
| `settings.json` | legacy link → back up exact link and contents privately; create a regular local file using the explicit reconciliation below; do not edit the dirty dotfiles source |
| `extensions/herdr-agent-state.ts` | regular Herdr-generated file → **keep**, no installation needed; coordinator verified it is byte-identical to V2 v9; Herdr owns regeneration |

Settings reconciliation is a reviewed per-key operation, not a broad merge: start with canonical seed defaults, preserve the existing `deviceId`, `lastChangelogVersion`, and other identified local-state-only keys after review, and explicitly decide each retained user preference. Do not retain the old `packages` or legacy resource arrays implicitly. The interactive fixture had `lastChangelogVersion: "1.5.2"` by observation; the seed does not. Preserve the existing local changelog value rather than asserting that a fresh seed alone suppresses all changelog display. `quietStartup` suppresses the startup resource listing, not necessarily every first-run or changelog notice.

The historical preactivation settings declared `@arhen/pi-core-todo@1.0.7`, `pi-subagents@0.76.1`, `pi-web-access@0.37.0`, `pi-stats@0.2.0`, `@narumitw/pi-stamp@0.53.0`, and `pi-herdsman@0.22.0`. The initial approved activation used `packages: []`; the operator subsequently installed current todo 1.1.0. The current portable seed retains only pinned todo 1.1.0. Do not reactivate other legacy declarations or remove cached files. Preserve other local state, `npm/`, models, caches and installation receipt.

`~/.pi/agent/auth.json` and `~/.local/share/agentic-engineering-v2/agent/auth.json` stay exactly where they are; no credential migration is needed. Both session trees remain in place. A V2 session can be selected by its explicit file path with native `--session /absolute/path/to/session.jsonl`; test a disposable copy first because opening a real session appends to it, and its recorded cwd must exist. Access to a session file does not imply extension compatibility or automatic discovery across agent directories.

Rollback: stop newly started affected sessions, verify every current leaf against what the handoff installed, remove only matching new Stow links, restore the recorded legacy link targets and settings from the private backup, and restore `~/.local/bin/pi` to its recorded V2 target. Preserve new sessions/auth and any subsequent changes separately; never blindly restore the entire snapshot over them. Restore generated reporter only if actually changed and with Herdr ownership understood. If any leaf differs, stop and reconcile manually. The snapshot is sensitive; never publish it.

## Evidence and limits

See [acceptance notes](acceptance.md). Stow fixtures are not runtime acceptance. A bounded real Herdr TUI/pane probe, theme selection and Foundations retrieval were observed; exhaustive terminal rendering, all historical sessions/extensions and Air deployment remain separate acceptance gates.
