# Agentic Engineering setup CLI

Standalone TypeScript + `@clack/prompts`; no Pi, Herdr or Workbench runtime dependency. Only `setup` is implemented. No daemon, orchestration framework, model calls or global launcher is installed.

## Start

```sh
# From repository root; safe on existing machines, asks before prerequisite downloads:
sh setup/bootstrap/setup
# Or with Node >=22.19 (24.x recommended) and npm already available:
npm --prefix cli ci --ignore-scripts
npm --prefix cli run setup
# Read-only interactive review:
npm --prefix cli run setup -- --dry-run
```

`ae` was not present in this Mini's PATH at implementation inspection. It is only this package's declared bin, not installed globally. Recheck `command -v ae` on each host before choosing to link/install that name. `npm --prefix cli run build` produces `cli/dist/index.js`; `node cli/dist/index.js setup` needs no global command. Do not modify PATH as part of source review.

Fresh machines need Apple's command-line tools/Git to clone (run `xcode-select --install` manually if necessary). Bootstrap can download official Node **24.15.0**, verifies the archive against the exact release's HTTPS `SHASUMS256.txt`, and extracts under ignored `.bootstrap/`. Existing Node >=22.19 is reused. It never changes shell startup, global Node managers or installed system packages. Node downloads and `npm ci --ignore-scripts` are explicitly confirmed. Network/download, unsupported-architecture and checksum failures stop. The checksum file and archive share the official HTTPS origin; this is not independent signed-build provenance. Install a separately verified runtime yourself if required by work policy.

Bootstrap does not install Homebrew. Review [brew.sh](https://brew.sh) and organizational policy separately, then rerun. Likewise the accepted official managed Pi installer/version ownership is reused, not recreated. Missing/incorrect Pi appears as a blocking manual dependency for selected Pi capabilities. Non-Pi provisioning can run without Pi. Selecting Homebrew `n` installs the manager, **not a Node runtime or global npm packages**.

## Profiles and actions

Profiles in `src/profiles/index.ts` are data, independent of hardware identity:

- `mac-workstation`: development CLI, terminal, optional Pi and selected lightweight capabilities. Heavy services/model downloads/VPNs are not preselected.
- `mac-laptop`: mobile essentials, no Herdr/server/tunnel/model recommendations by default.
- `custom`: no requested changes.

Recommendations are **visibly preselected** as install/update on both fresh and existing machines. Current selections plan as no-ops; blocked (migration/conflict/unknown) components stay blocked. Explicit edits survive profile changes; untouched recommendations recalculate when you switch profiles. The bootstrap prerequisites and checkout knowledge alone do not count as installed capabilities. You can override every recommendation. Changing profiles never removes anything. A successfully applied run remembers the profile privately in `~/.local/state/ae/profile.json`; dry-run does not save it.

A single-screen component list with a tri-state control (`[x]` install/update, `[−]` remove, `[ ]` no change) lets you cycle or set actions directly with Space/x/-/0, alongside observed state and evidence. No per-component action prompt appears; `[x]` selections go straight to the planner. Only deliberate `[−]` selections enter guided scope/cleanup/confirmation prompts. Plans list installs, accepted updates, configuration changes, no-ops, removals, dependencies, conflicts and skipped components. Revise or exit before approval. No headless apply or implicit `--yes` is provided.

Headless preview (after local dependencies are available):

```sh
node cli/src/index.ts setup --dry-run --json --profile custom \
  --select config-git,pi-theme,todos --home /absolute/existing/test-home
# Pending removal confirmation is deliberately a conflict in headless preview:
node cli/src/index.ts setup --dry-run --json --remove config-git:configuration
```

Targets must exist and not be symlinked. No `~` expansion is performed inside JSON/options; use `$HOME` in the shell. Preview may create disposable Homebrew metadata scratch directories under the OS temp directory, never target links/settings. No upstream update checks are inferred from profile selection.

## Supported operations

| Capability | Detect / install or accepted update | Configuration removal | Application removal / full cleanup |
|---|---|---|---|
| Git, GH, Ghostty, SSH, Herdr, shell configuration | Exact leaf ownership; selected GNU Stow package, conflict refusal; repeat is a no-op | Exact owned links only; retains containers, sources and private includes | No app embedded in config component. Review enumerates owned leaves; unknown artifacts retained. Shell needs existing Oh My Zsh. |
| Pi instructions, Workbench Skill, Study Skill, composer | Separate Stow packages; no broad discovery directories | Exact owned leaf only | Not applications. Does not remove notes, Foundations, credentials or other resources. |
| Purple Dreams (Pi) | Separate Stow leaf **and** selected theme key with private rollback receipt | Restore previous theme before removing owned leaf; refuse ambiguous/unreceipted active selection | No application uninstall. |
| Pi defaults | Accepted seed's portable keys, selected-key merge; theme/packages/extra discovery paths excluded | Restore exact prior selected keys only with an unchanged setup receipt | No runtime uninstall; existing unreceipted settings need manual review. |
| Todos | Exact accepted 1.1.0 declaration/cache comparison; pin accepted installed cache without reinstall; native `pi install` for missing/mismatched cache | Remove exact declaration only; retain cache | Native `pi remove` for exact declaration/package. Unrelated packages, auth/sessions and notes retained. Native package mutation is fixture-stubbed, not live runtime acceptance. |
| Homebrew formulae/casks from existing Brewfiles | Inspect installed package metadata; explicit selected fresh install; managed receipt required for remove | Owned paired config removed for Git/GH/Ghostty/Herdr; app kept | Supported `brew uninstall` without `--zap`/force/cleanup. App+config scope includes owned paired config visibly in plan. Homebrew dependency protections still apply. No recursive personal/cache purge. |
| Pi executable 1.5.2 | Detect official shim/receipt/version/entrypoint/PATH, reuse current | Unsupported | Missing/other runtime requires separately reviewed exact-version official installer/update/removal. Never installs global npm Pi or wraps launch. |
| Claude Code | `claude-code` detects CLI binary and version via PATH; `brew-claude-code` Homebrew cask installs/removes the application. Both harnesses coexist independently in the same repository. | Unsupported; global settings, project configurations, authentication and sessions are never read or modified. | Homebrew `brew-claude-code` uninstall. Authentication, sessions, notes, project CLAUDE.md files and local settings are always retained. |
| Homebrew itself / Oh My Zsh | Detect/reuse | Unsupported | Official installation/removal remains manual; work policy/privilege boundary. |
| Herdr Pi reporter | Presence only; ownership/version/loading unknown until local integration inspection | Unsupported | Review/generation via approved Herdr integration command is manual; no portable generated reporter. |
| Foundations reference | Available in complete repository but uninstalled until selected; optional Stow reference at `~/.local/share/ae/foundations` | Remove the owned reference link only | Source knowledge stays canonical in `workbench/foundations`; never a Pi discovery path or full Workbench install. |

**Claude Code boundary:** neither Claude component is profile-recommended. A readable CLI version means detected, not authenticated, identity-verified, pinned or latest upstream; no accepted Claude version is enforced. `claude-code` PATH detection and `brew-claude-code` receipts are independent. An npm/native installation can coexist with an absent Homebrew receipt; do not install a second copy or migrate managers merely to make those labels agree. A failed version probe remains unknown/blocked. Any launcher repair or installation-manager transition needs separate approval.

**Homebrew version boundary:** imported declarations are unversioned. `current` means a receipt satisfies that declaration, not latest upstream. Explicit fresh installation resolves the declared formula/cask using Homebrew; exact package artifacts/transitive versions are not pinned. There is deliberately no blind `brew upgrade`, `bundle`, `cleanup`, app adoption, model download, service start, VPN setup, or package-manager ownership migration. This release does not implement accepted Homebrew version updates without reviewed pins. MAS/VS Code entries, taps requiring external setup, npm/Bun global inventories and Air SMB services remain reference declarations, not implemented wizard operations. Formula installs needing an unavailable external tap may fail honestly; the CLI does not invent tap authority.

## Safety and uninstall

- Available, installed, enabled, loaded and selected are different fields. Link/package evidence never proves runtime loading; `loaded` remains `unknown`. Enabled means discovery eligibility or selected declaration/key, not observed application execution.
- Ownership is verified from actual literal leaf links, package metadata and selected-key receipts, never from a profile or similar filename. Foreign/dangling links and symlinked target parents are conflicts. No adoption or recursive directory deletion.
- Configuration-only keeps the application; application-and-configuration removes the supported app and owned paired config, with separate visible operations. To retain paired config, choose no change/cancel app removal and perform a separately reviewed package-manager action.
- Full cleanup review displays actual known paths, evidence and selectable owned leaves. A Stow package is all-or-none; select all its owned leaves or choose configuration scope. Unknown caches/application data, personal notes, shell framework, credential/session trees and shared dependencies are preserved and reported. **This is not exhaustive full purge support**, and no purge of private/sensitive data is implemented.
- Defaults/settings backups are local mode 0600 under a private state directory. No auth/session backup/copy is performed. Existing settings symlinks are refused. Private identity/provider/trust keys and unrelated declarations survive selected-key changes. Existing values can intentionally change only for explicitly selected defaults/theme.
- All active operations are preflighted against the preview fingerprints before first mutation. Execution stops at the first failure; changed partial state is reported. There is no blanket rollback, pretend progress or success based only on exit code. Inspect local backups and retry after reconciliation.
- Do not edit source resources or settings concurrently with apply. Filesystem preflight is not an OS sandbox or race-proof transaction. Read-only Homebrew metadata runs use isolated temporary HOME/cache/log paths. Installation commands may need an interactive supported external authorization route; the bounded subprocess runner captures output and stops after three minutes rather than prompting for sudo. Privileged/long-running installs require manual preparation.
- No Git reset/stash/checkout/fetch/push occurs. Moving or updating linked sources changes live behavior: review Git changes and keep local checkout paths stable. Follow experiment → review/promote → commit/push (separate approval) → retrieve → explicit apply on either Mac. No host is the authority.

## Development

Follow [CLI-local conventions](AGENTS.md) and [short extension/testing examples](DEVELOPMENT.md). User decisions live in a small typed `SetupSession`; detected facts and reviewed plans stay separate. Sequential prompts collect intent, the planner is pure, and only approved execution performs provisioning effects. These are validated setup patterns, not a framework for future products.

```sh
npm --prefix cli run check
npm --prefix cli run build
npm --prefix cli test
node scripts/install-pi.test.js
```

`src/components/catalog.ts` defines meaningful capabilities and reads the existing Brewfiles/accepted Pi seed. `detect.ts` inspects; `plan.ts` is deterministic and terminal-independent; `execute.ts` applies approved operations and verifies actual final state; `prompts/` owns presentation. Add data-driven profiles without machine identity. For a new component, document ownership, real supported installer/uninstaller, dependencies, exact acceptance/version policy, detection and verification; add isolated tests before exposing mutations. Do not add a generic plugin registry. Add future actual CLI commands to `src/index.ts` when needed; no future-command framework is present.

Tests use temporary homes and actual GNU Stow. Homebrew/package mutations are command fixtures, not live installs. Node's test runner requires no Pi. Source checks use Zsh/GNU Stow as development test prerequisites. Application rendering, actual Air current topology, fresh official runtime installation, privileged Homebrew installs and offline/reconnect acceptance remain deployment gates. See [migration](../setup/MIGRATION.md).
