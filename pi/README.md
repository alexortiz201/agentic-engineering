# Native Pi resources

The approved Mini activation is now applied; see [targeted cleanup evidence](acceptance.md#targeted-cleanup-and-reactivation). **This Git repository, not the Mini or DevDrive filesystem, is the canonical source of truth.** Either Mac (and future Macs) may experiment and promote reviewed changes here. Other-machine activation remains separately gated.

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

## Experiment, promote, sync — from either Mac

### What changes, and what does not

Existing Git, Stow and native Pi are sufficient. No installer change, sync command, launcher, daemon or settings framework is needed. The installer intentionally applies resource links only; it never merges mutable settings. Native `pi config` selects resources, not arbitrary portable defaults. Propagating a default is therefore an **explicit reviewed edit of selected local keys**, reading values from this repository rather than maintaining another shared configuration file.

Pi 1.5.2's installed package resolver compares configured npm ranges with installed versions on startup/reload, installing only missing/mismatched packages; exact pins prevent drifting beyond the accepted version. Native `pi install` is still the explicit way to add/change a package declaration. Do not run `pi update`, `pi update --all` or blanket `pi update --extensions` as sync: local experiments may be unpinned, and runtime updates have separate approval gates.

Each machine uses one complete physically local checkout at a stable path. On Mini `A=/Volumes/DevDrive/Projects/agentic-engineering` is physically local; on Air `A=$HOME/Github/agentic-engineering` is local. The different paths do not create different authorities. Both exchange reviewed commits with the same trusted Git remote. SMB may transport a Git clone but is never a runtime or synchronization authority.

**Live-link warning:** Stow links point into the checkout. Editing or checking out theme/instruction/skill files changes their live source immediately, before re-stowing or `/reload`. Review fetched changes and approve the change boundary **before** checkout/merge. Do not automatically switch branches in a dirty active checkout.

### 1. Install locally — not promotion

Run on either Mac, using a reviewed exact experimental version:

```sh
pi install npm:@scope/capability@X.Y.Z
# In the existing Pi UI: /reload, then test that capability locally.
pi list
```

For a temporary test instead, native `pi -e npm:@scope/capability@X.Y.Z` does not persist the package declaration (it launches Pi; not part of this handoff's verification). Installing/testing changes only that Mac's local settings/cache. It does not edit `pi/settings.example.json`, commit, push or affect the other Mac. Keep experiments distinct from the accepted baseline. Do not copy package caches, auth or sessions into Git.

### 2. Promote — only after acceptance

Use the local checkout on **either** host. If it has unrelated work, stop and reconcile it deliberately; never auto-stash, force-reset or bulk-stage it. Commit only selected completed changes; do not use this task to sweep in the current Workbench WIP.

```sh
cd "$A"
git status --short
test -z "$(git status --porcelain)" || { printf 'Stop: preserve/reconcile local Git work first.\n'; exit 1; }
git ls-files -u                 # must be empty; resolve Git conflicts first
# From a clean reviewed base, create a normal proposal branch:
git switch -c pi/describe-capability
# Edit pi/settings.example.json: add/change only the accepted exact package pin
# and reviewed portable defaults. Author reusable resources under pi/.pi/agent/.
git diff -- pi/settings.example.json pi/.pi/agent
git add -- pi/settings.example.json  # add other accepted resource paths explicitly
git diff --cached --check
git diff --cached
git commit -m "feat(pi): retain reviewed capability and pinned version"
git push -u origin HEAD
```

Review/integrate that proposal into the agreed shared branch through normal Git review; designate the accepted full commit. A proposal branch is not automatically an accepted baseline. Push only when authorized and only to the trusted configured remote; publishing this handoff has not been performed. Authored extension code, reusable skills/themes/prompts and portable defaults belong here; project/company prompts and instructions remain with their owning projects. Generated Herdr files and all private state remain local.

### 3. Sync/apply — explicit, on either Mac

Set `ACCEPTED_COMMIT` to the reviewed full commit reachable from the shared remote. Do not equate an arbitrary remote tip with approval. These commands intentionally refuse dirty worktrees, untracked files or divergent history:

```sh
cd "$A"
test -z "$(git status --porcelain)" || { printf 'Stop: preserve/reconcile local Git work first.\n'; exit 1; }
test -z "$(git ls-files -u)" || exit 1
PREVIOUS=$(git rev-parse HEAD)
git fetch origin || exit 1
git show --stat "$ACCEPTED_COMMIT" || exit 1
git diff "$PREVIOUS" "$ACCEPTED_COMMIT" -- pi scripts/install-pi || exit 1
# Review/approve fetched changes BEFORE changing the live-linked checkout.
git merge-base --is-ancestor HEAD "$ACCEPTED_COMMIT" || { printf 'Stop: reconcile divergence; do not reset.\n'; exit 1; }
git merge --ff-only "$ACCEPTED_COMMIT" || exit 1
# If the tracked upstream tip is exactly the reviewed commit, ordinary
# git pull --ff-only is the equivalent shortcut; never blind-pull or force-push.
"$A/scripts/install-pi" --target "$HOME" || exit 1         # plan, conflict refusal
"$A/scripts/install-pi" --target "$HOME" --apply || exit 1 # only after approval
```

The dotfiles `pi-resources --source "$A" --target "$HOME" [--apply]` entrypoint is an alternative to that same installer, not another sync system. No-op Stow runs are safe. An already-present exact version must not be reinstalled just to sync.

Inspect `git diff "$PREVIOUS" HEAD -- pi/settings.example.json` for **changed** package declarations and defaults. For each approved new/changed package, read the pin from the canonical seed; for example the current todo package:

```sh
SPEC=$(node -p 'require(process.argv[1]).packages.find(s => typeof s === "string" && s.startsWith("npm:@arhen/pi-core-todo@"))' "$A/pi/settings.example.json")
pi list
node -p 'require(process.env.HOME + "/.pi/agent/npm/node_modules/@arhen/pi-core-todo/package.json").version'
# Only if missing or different from the accepted pin:
pi install "$SPEC"
```

Skip that install if declaration/version already match. If the installed version matches but its local declaration floats, make the reviewed one-key pin edit (as on Mini), then `/reload`; do not reinstall. Do not wholesale replace `packages` from the seed: preserve unrelated local experiments or explicitly decide their disposition. Canonically removed packages need a reviewed declaration removal; cached files need not be deleted. Do not automatically run `pi remove` on another Mac.

For an approved portable-default change, preserve local preferences by selecting only the keys intended for this machine. **No full-seed merge or copy over existing settings.** Example: adopt only the canonical `theme` value, without retyping/duplicating it. This uses the already-required Node runtime as a one-off JSON edit, not a new sync command:

```sh
S="$HOME/.pi/agent/settings.json"
test -f "$S" && test ! -L "$S" || { printf 'Stop: reconcile settings ownership.\n'; exit 1; }
umask 077
B=$(mktemp -d "$HOME/.pi/agent/settings-review.XXXXXX")
cp -p "$S" "$B/before.json"       # private local rollback, never commit
node -e 'const fs=require("node:fs"); const [d,s]=process.argv.slice(1).map(p=>JSON.parse(fs.readFileSync(p,"utf8"))); console.log(JSON.stringify({...s,theme:d.theme},null,2))' "$A/pi/settings.example.json" "$S" > "$B/candidate.json"
diff -u "$B/before.json" "$B/candidate.json" # exit 1 means differences, not failure
# STOP and review/approve the diff. For other defaults, select those exact keys
# from d in the expression above; never spread all of d over local settings.
# If local theme is an intentional preference, retain it instead; no apply.
test -f "$S" && test ! -L "$S" && cmp -s "$S" "$B/before.json" || { printf 'Stop: settings changed during review.\n'; exit 1; }
cp "$B/candidate.json" "$S"       # apply only the approved candidate
chmod 600 "$S"
# In the existing Pi UI: /reload
```

This propagates repository values without duplicating them in a second manifest. Review nested objects per subkey too; do not replace an entire local `compaction` object merely to change one approved field. An explicit local override wins until its owner chooses otherwise. Reapplying the same approved keys is value-idempotent; other keys, identity, auth and sessions are untouched. Backups/candidates stay local. A changed source revision alone does **not** mean settings and packages have been reconciled.

### Know the applied version; offline and rollback

After the approved resource/default/package steps succeed and local exceptions are understood, record the accepted baseline locally (plain provenance, not a second manifest):

```sh
test "$(git -C "$A" rev-parse HEAD)" = "$ACCEPTED_COMMIT" || exit 1
mkdir -p "$HOME/.local/state/pi"
printf '%s\n' "$ACCEPTED_COMMIT" > "$HOME/.local/state/pi/applied-revision"
git -C "$A" rev-parse HEAD                     # source revision
IFS= read -r APPLIED < "$HOME/.local/state/pi/applied-revision"
printf 'Applied baseline: %s\n' "$APPLIED"
git -C "$A" status --short                    # dirty source is not that exact revision
pi list                                       # local package declarations, including experiments
```

Record only after completing apply; leave the old receipt on interruption. It identifies the accepted baseline plus deliberately retained local overrides/experiments, not byte-identical mutable settings. Inspect local settings/package differences when diagnosing drift. No receipt has been created by this documentation-only change.

Between explicit syncs, local Git/resources/cached exact packages work without SMB. Fetch/install need network; `pi --offline` does not provide offline Codex inference or OAuth renewal. Do not silently upgrade Pi beyond the accepted host baseline.

On failure, stop. Keep the previous applied receipt, previous Git revision and private settings backup. Restore only matching changed resource leaves/defaults; preserve subsequent edits and all auth/sessions. Selecting the previous source revision requires a clean checkout and explicit rollback approval; never `reset --hard`. A package-version rollback is an explicit native install of the previously accepted exact version only if needed and approved. No filesystem replication or automatic rollback over HOME.

## Evidence and limits

See [acceptance notes](acceptance.md). Stow fixtures are not runtime acceptance. A bounded real Herdr TUI/pane probe, theme selection and Foundations retrieval were observed; exhaustive terminal rendering, all historical sessions/extensions and Air deployment remain separate acceptance gates.
