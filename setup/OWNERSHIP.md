# Consolidation ownership and safety gate

**Authoring authority is exclusively this repository.** The current-owner column below describes deployed dependencies, not a second place to maintain setup sources. New computer setup and documentation changes belong under `setup/`. Legacy dotfiles may be touched only for explicitly required migration, compatibility or recovery. See the [verified retirement blockers](LEGACY-RETIREMENT.md), [public-safe home-lab reference](HOME-LAB.md), and [NAS access status](NAS-SSH.md). Copying templates did not transfer live ownership; do not remove the old source until both hosts and recovery consumers are verified.

Baseline: `e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354` (portable Pi); both Macs' Pi runtime migrations are accepted, including Air cold offline loading. **Both use shared DevDrive for active development; Air retains its local checkout for offline Pi resources.** The existing Air agent's [local source report](../plans/handoffs/AIR_LOCAL_CHECKOUT_EVIDENCE.md) confirms clean local `main` at this baseline and five accepted root-Pi links; new harness/setup sources are absent there. No deployment was performed. Current [publication/handoff plan](../plans/handoffs/SHARED_DEVDRIVE_PUBLICATION.md) supersedes historical topology assumptions.

**Current verified ownership:** both hosts' five selective leaves are verified; [Air execution evidence](../plans/handoffs/AIR_LIVE_HANDOFF_RESULT.md) supersedes the historical before-state above. `harness/pi/` is now the sole authored source; generation is retired, not compatibility/recovery consumers or dotfiles. See [execution decisions](../plans/handoffs/LIVE_HANDOFF_EXECUTION.md).

## Ownership map

| Resource | Current owner / installation | Replacement | Portability / reuse / migration |
|---|---|---|---|
| Shell, custom plugins/theme, aircopy | dotfiles `zsh/`, Stow | `setup/computer/zsh/` | Portable except local identity/navigation; reuse Stow. Live ownership handoff required. Oh My Zsh itself stays upstream-owned and must already exist. |
| Git | dotfiles `git/`, Stow | `setup/computer/git/` | Portable defaults; identity moves to local `~/.gitconfig.local`. Stow handoff required. |
| GH | dotfiles `gh/`, Stow | `setup/computer/gh/` | Only tracked config, never hosts/tokens. Stow handoff required. |
| SSH | dotfiles `ssh/`, Stow | `setup/computer/ssh/` | Portable defaults; hosts remain local in `~/.ssh/config.local`; keys never copied. Stow handoff required. |
| Ghostty | dotfiles `ghostty/`, Stow | `setup/computer/ghostty/` | Preserve XDG-to-Application Support source link and palette. Reuse Stow. |
| Herdr configuration | dotfiles `herdr/`, Stow | `setup/computer/herdr/` | Independent of Pi; runtime/socket/state remain local. Reuse Stow. |
| Homebrew declarations | dotfiles `.no-stow/brew/` | `setup/computer/manifests/brew/` | Preserve useful shared/additive organization. Wizard selects individual declarations, never runs whole Bundle or cleanup. Old host files are reference inventories, not identity-based profiles. |
| npm / Bun globals | dotfiles `.no-stow/{npm,bun}/` | `setup/computer/manifests/{npm,bun}/` | Inventory preserved; bulk global installation deferred (competing ownership). |
| Pi executable | Official managed local 1.5.2 | Same local owner | No reinstallation/migration. Wizard detects receipt and shim; installer/update/uninstall remain manual pending an approved exact-version official route. |
| Pi portable resources | Mini: accepted `harness/pi/packages/` links in DevDrive. Air: verified local checkout `harness/pi/packages/` links with local/offline ownership preserved | Same Git codebase; optional Air **local-to-local** selective layout handoff after approved publication/local update | `harness/pi/` is the sole authored source after both host handoffs; the overwrite-prone generator is retired. All 13 root `pi/` files remain unchanged, frozen for recovery, dotfiles `pi-resources`, legacy installer/fixture, diagnostics and audit/recovery. DevDrive is active workspace, **not** Air runtime source. No live change is authorized; root/support cleanup remains separately gated. |
| Pi defaults / todo | `harness/pi/settings.example.json`, local settings, native package commands | Authored portable seed; selected-key defaults / exact native todo command | Mutable settings, unrelated package declarations and preferences preserved. Seed is never Stowed. |
| Pi reporter | Herdr-generated local extension | Same local owner | No portable reporter copy. Generation/removal requires reviewed local integration ownership; wizard reports unsupported. |
| Workbench Skill / Foundations | `workbench/`, Pi Skill leaf | Same Workbench source; optional Skill leaf | Selecting Pi does not install the Skill. Foundations remain available in checkout; selecting their independent component installs only a local reference link, never a Pi discovery path. No Workbench edits. |
| Study Skill / composer / Purple Dreams | authored `harness/pi/packages/`; frozen legacy copies retained | Independent selective packages | Independent selections; notes remain local. No legacy lifecycle/subagent stack. |
| Air SMB and release transactions | dotfiles `air-smb/`, `.no-stow/scripts/` | Retained old ownership pending separate review | Machine-bound launchd/network behavior; intentionally not activated or blindly copied into provisioning. Not a dependency of fresh setup. |
| Credentials, sessions, caches, identity, notes | Machine-local | Machine-local | Never imported, synchronized, adopted or bulk-cleaned. |
| Legacy Pi/V2 orchestration | Historical references | No active replacement | Not installed. Historical source/snapshots retained; retirement needs approval. |

Computer configuration components (`config-git`, `config-gh`, `config-ghostty`, `config-herdr`, `config-ssh`, `config-zsh`) appear as `Migration required` only when exact legacy targets and imported source digests verify; changed/unknown ownership stays conflict. This is a recognized but blocked state; the wizard never auto-detaches or replaces legacy ownership. Local override prerequisites (Git identity in `~/.gitconfig.local`, SSH hosts in `~/.ssh/config.local`, optional `~/.config/ae/shell.local.zsh`) and exact occupied links/parents must be reviewed before a separately approved handoff. GH/Ghostty and shell plugins may be folded parents; no package is assumed leaf-only on an uninspected host. Creating private overrides alone does not clear migration ownership. Detachment/conversion and source apply require explicit per-host approval. See [SETUP.md](../SETUP.md) and [MIGRATION.md](MIGRATION.md#approved-handoff-transaction-one-host-at-a-time).

## Source provenance

Computer sources are a tracked-file-only import from the dirty dotfiles checkout at `ef260a2363d72b7ddc092665dfa9220a83dd998b`. The source checkout is untouched. `source-provenance.json` records imported byte digests (before portable-template adjustments) and dirty status; it is evidence, not a second package manifest. No Git history is rewritten or nested repository introduced.

Portable templates deliberately exclude personal Git identity, SSH hosts and machine-specific navigation. Existing live files are unchanged. Transfer these values privately to the documented local includes before approval. General shell helpers/plugins are retained; automatic credential loading is not enabled.

## Architecture decision

Setup is a standalone CLI subsystem: detect → deterministic plan → approved execution → verification. Terminal prompts are separate. Components use a few concrete adapters (Stow, selected JSON defaults, native todo and Homebrew); there is no plugin runtime, scheduler, daemon, harness dependency or Workbench construction tooling. Architecture scope is this setup subsystem only. Local receipt files are provenance, not proof of ownership: actual filesystem/package state is always inspected.

Available, installed, enabled, loaded and selected are separate. Resource links prove installation/discovery eligibility, not actual runtime loading. Loaded state is always unknown without application evidence. Homebrew unversioned declarations are not accepted version pins: fresh installation is explicit, upstream updates are unsupported rather than silently promoted.
