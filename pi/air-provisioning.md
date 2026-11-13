# MacBook Air: native Pi handoff

**Prepared, not activated.** `agentic-engineering` is authoritative; Mini is the primary development host, not the source-of-truth filesystem. Air and future Macs may also experiment and promote accepted changes through the same repository. No Air files, credentials, packages, services or sessions were changed by preparation. This procedure is for Pi only, not authorization for the existing whole-home/SMB migration. The [per-path migration manifest](air-migration-manifest.md) defines exact destinations, guards and rollback; current Air before-state must be recorded before approval.

## Ownership and accepted inputs

| Owner | Input / local output |
|---|---|
| `agentic-engineering` | `pi/` resources and settings seed; full `workbench/`, including Foundations; `scripts/install-pi` |
| Official Pi installer | Managed Pi **1.5.2**, official shim and receipt; accepted host lock in `pi/managed-lock/1.5.2/` |
| Pi package manager | **`npm:@arhen/pi-core-todo@1.1.0`**, no runtime dependencies; host-provided Pi/typebox peers |
| dotfiles | Git/Stow/Node/Herdr prerequisites and thin `.no-stow/scripts/pi-resources`; no active portable Pi resource fork |
| Herdr | Local generated Pi reporter and Herdr Skill; Mini evidence is Herdr 0.9.5 / reporter v9 |
| Each Mac | Private regular settings, auth, device identity, sessions, trust, caches and generated integration files |
| Each project | Instructions, `.pi/settings.json`, prompt bodies and development dependencies |

Do not copy Mini's `~/.pi`, V2 state, npm tree, identity or credentials to Air. Do not install a second global npm/pnpm Pi. V2 and dotfiles' legacy Pi source remain reference/rollback material, not runtime dependencies.

## 1. Prepare reviewed local sources (approval before Air execution)

Use the reviewed canonical consolidation/synchronization commits reported with this handoff as the initial accepted baseline, not an arbitrary host's branch tip. Set `ACCEPTED_COMMIT` to the approved full commit and `ACCEPTED_BRANCH` to the shared reviewed remote branch containing it. Unrelated work remains uncommitted and is not part of deployment. Select the separately reported dotfiles commit too if using its thin resource entrypoint. No push has been performed by this handoff; ensure the chosen remote has the commits before cloning. The accepted deployment contains the complete portable `pi/` package, not unrelated Workbench WIP.

Use a normal local clone from the trusted shared repository remote (set `CANONICAL_GIT_URL` to its reviewed GitHub/SSH URL):

```sh
# Run on Air only after approval; destination must be absent.
mkdir -p "$HOME/Github"
git clone --no-checkout "$CANONICAL_GIT_URL" "$HOME/Github/agentic-engineering" || exit 1
A="$HOME/Github/agentic-engineering"
git -C "$A" switch --create pi-environment "$ACCEPTED_COMMIT" || exit 1
git -C "$A" branch --set-upstream-to="origin/$ACCEPTED_BRANCH" pi-environment || exit 1
git -C "$A" rev-parse HEAD
```

The branch is a local working copy of the **same canonical repository**, not an Air-specific configuration fork. Air may create proposal branches and push accepted improvements through normal review just like Mini. An existing checkout must be clean/conflict-free before selection; never reset or auto-stash it. If Git/SSH to Mini or SMB is used for initial transfer, use an independent clone (`git clone --no-local` for a filesystem source), then configure `origin` to the trusted shared remote before normal bidirectional work. The Mini filesystem is only transport, never authority.

Use physically local APFS storage. Do not use `--shared`, Git alternates, linked worktrees, symlinked source directories, or resource links into SMB. Keep the complete local checkout at a stable path; the Workbench Skill resolves into its `workbench/` tree. Follow [experiment → promote → sync/apply](README.md#experiment-promote-sync--from-either-mac) on either Mac after initial activation.

## 2. Inspect Air and approve the exact mutation plan

Before changes, record actual command resolution, Pi version/receipt, profile overrides, local settings, per-leaf link targets and the local source checkout. Review active sessions and coordinate only affected ones. Protect local auth/session trees and private settings without printing or transferring credentials. Preserve the original Air clone and V2 references. Use the existing Mini activation/rollback evidence as a pattern, **not as Air's topology manifest**.

Classify each collision under `~/.pi/agent` and the command entrypoint. Detach only explicitly approved, exact legacy links; do not recursively remove directories, adopt foreign files, overwrite existing settings or bulk-restore state. A dangling link still counts as an occupied destination. Stop on unknown ownership or changed leaves.

Do **not** run dotfiles `bootstrap`, `stow-all`, `air-snapshot` or `install-air-home` as this Pi handoff. The first two are Mini-only; the existing Air transaction still includes legacy Pi resources. It must not run after this handoff without a separately reviewed exclusion/reconciliation of those leaves. That broader shell/SMB transaction is outside this Pi task.

## 3. Install runtime and integrations online (separate approval)

Use existing Command Line Tools/Homebrew plus Git, GNU Stow, Herdr, and Node >=22.19 with npm. The dotfiles Shared Brewfile declares Git/Stow/Herdr and the existing Node-manager tooling; install only missing approved prerequisites, not every GUI package for a Pi-only migration. The official Pi installer can supply Node. Mini currently uses Node 24.15.0 and Stow 2.4.1; those are observations, not additional exact-version requirements.

Download and review `https://pi.dev/install.sh` before execution. Check `https://pi.dev/api/installer/releases/latest` first: the reviewed installer selects **latest**, not an evidenced historical-version option. Proceed only if the offered version is the accepted **1.5.2**, then verify the managed receipt, `current-version`, package and lock against `pi/managed-lock/1.5.2/`. If latest differs, **stop for a version/installation decision before running it**; do not invent `--version`, redirect installer metadata, reconstruct a managed install, or use npm global as a fallback. This gate is the remaining limit on provisioning the old accepted version at a future date.

Use `~/.pi/agent/bin/pi` and the installer's `~/.local/bin/pi` symlink. Remove reviewed V2 overrides from Air's intended startup path; the resulting shell must have neither `PI_CODING_AGENT_DIR` nor `PI_SELF_UPDATE_COMMAND` set. No custom launcher. Do not upgrade as a test.

Plan portable resource installation first:

```sh
A="$HOME/Github/agentic-engineering"
"$A/scripts/install-pi" --target "$HOME"
# After reviewed collisions are resolved and activation is approved:
"$A/scripts/install-pi" --target "$HOME" --apply
```

Alternatively use dotfiles' existing thin entrypoint with explicit `--source "$A" --target "$HOME"` (plan), adding `--apply` only for approved activation. It verifies a local source filesystem and delegates to the same installer; do not run both as independent installations. Stow is repeatable and refuses conflicts. It never writes settings, auth, sessions, caches or the Herdr reporter.

For **absent** settings only, initialize a private mode-0600 regular `~/.pi/agent/settings.json` from `pi/settings.example.json`; refuse even dangling symlinks. For existing settings, approve a per-key reconciliation retaining Air's identity/preferences and accepting the seed defaults/package pin. Never symlink mutable settings or copy Mini's local file.

Then install the exact accepted todo package through native Pi (writes local settings/cache; approval required):

```sh
env -u PI_CODING_AGENT_DIR -u PI_SELF_UPDATE_COMMAND \
  "$HOME/.pi/agent/bin/pi" install npm:@arhen/pi-core-todo@1.1.0
```

Do not retain a second floating or V2 todo entry, enable Herdsman/subagents/lifecycle, uninstall unrelated cached packages, or exclude built-in extensions. Pi deduplicates npm declarations by package name, but the reviewed local settings should have one exact declaration.

For Herdr, inspect `herdr integration status`, then use `herdr integration install pi` only when needed and approved. This generates the local reporter, not a Stow resource. The installed binary exposes the Herdr Skill via `herdr --skill`; after approval, save that output at `~/.agents/skills/herdr/SKILL.md` **only if absent**, with a no-clobber redirect. If already present, compare/review rather than overwrite. Native Pi discovers that Agents skill location; no legacy dotfiles Pi npm script or extra skills framework is needed.

Authenticate locally once, only if Air's native profile needs it:

```sh
env -u PI_CODING_AGENT_DIR -u PI_SELF_UPDATE_COMMAND \
  "$HOME/.pi/agent/bin/pi" auth login openai-codex
```

Keep auth on Air; never reuse Mini/V2 credential files. Use `auth check --provider openai-codex --json --no-refresh` for read-only readiness; a refresh-enabled check can mutate OAuth state and requires deliberate use.

## 4. Project resources, offline operation and updates

Clone projects needed offline onto Air, at reviewed revisions, including their own instructions and prompt bodies. A trusted project's `.pi/settings.json` can include `{"prompts":["../.claude/commands"]}`; resolve from `.pi` and reconcile an existing file, not replace it. Native `.pi/prompts/` also works. Review/trust projects individually; do not install global symlinks to project prompts or automatically trust everything.

Install required project dependencies while online. Pi, todo, Herdr, the theme, Workbench and Foundations must resolve entirely from local storage. Complete npm package installation before disconnecting; no SMB-mounted cache or package directory. `pi --offline` suppresses automatic network activity, but **does not provide offline Codex inference**. Offline model work needs a separately configured local provider; this migration does not add one. Authentication may need network renewal later.

After approved activation, use `/reload` in an existing affected native session to rediscover resources/todo. Existing evidence already covers native project-prompt expansion, Sol/Medium, fullscreen, quiet startup and Foundations retrieval; do not repeat model probes. Perform deterministic Air checks: command/profile resolution, version/receipt/lock, strict theme load, exact todo version and `pi list`, skill realpaths and Foundations existence, reporter status, settings defaults and local session preservation. Confirm cold offline resource resolution with SMB unavailable, then reconnect and confirm no duplicate configuration/mount dependency. Rendering and actual offline/reconnect behavior remain **Air acceptance**, not claims from Mini fixtures.

Updates are bidirectional and explicit: either host may test locally, promote portable pins/resources/defaults to `agentic-engineering`, and commit/push for acceptance. The other host fetches/reviews, refuses dirty/conflicted/divergent Git state, fast-forwards to the accepted commit and uses the existing installer/native Pi. Because Stow links point into the checkout, approve fetched source changes before merging. Apply only reviewed local-default keys from the canonical seed; preserve local preferences/identity and experimental declarations. Skip matching installed package versions, `/reload`, then record the applied baseline. Exact commands, selected-key settings propagation and the local revision receipt are in the [shared workflow](README.md#experiment-promote-sync--from-either-mac). Native Pi/runtime or blanket extension updates are not synchronization; no daemon, host-specific fork or new apply script is introduced.

## Rollback and handoff boundary

Retain the Air before-manifest, old local sources and previous accepted source revision. Roll back only exact installed leaves/settings that still match the approved transaction, refusing conflicts; preserve subsequent edits. Do not restore auth or sessions from a snapshot. If source paths move, remove only known Stow links before relocation/re-stow. No session or service teardown is authorized by this guide.

**Remaining approvals:** select/commit/publish the reviewed source revisions; authorize the Air read-only inventory and exact per-leaf migration/backup plan; authorize missing prerequisites/runtime/package/integration installation and local settings reconciliation; authenticate interactively if needed; then approve Air activation and offline/reconnect acceptance. If native Pi 1.5.2 is no longer offered, approve a supported runtime/version decision first. No Air execution has been performed. Mini's one-key local todo pin to installed 1.1.0 is approved and completed without upgrade or reinstall; no Mini follow-up is needed.
