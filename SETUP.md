# Developer environment setup

## Home lab and setup authority

This repository is the single authored setup authority. For network/storage/access
work or onboarding a home computer, read the public-safe [home-lab guide](setup/HOME-LAB.md)
and [NAS SSH status](setup/NAS-SSH.md). Private network/account inventory stays outside Git.
Legacy dotfiles remains only for verified live migration/compatibility/recovery
consumers; [retirement is currently blocked](setup/LEGACY-RETIREMENT.md). Do not
interpret deployed legacy links as permission to author new setup material there.

The standalone setup wizard lives in [`cli/`](cli/README.md). Clone this repository, then run:

```sh
sh setup/bootstrap/setup
```

This page covers **computer/home provisioning**. For explicit capability discovery, preview, linking and verification in an existing project, use the separate project commands in [`cli/README.md`](cli/README.md); they never invoke this machine setup flow.

Nothing installs on clone. Bootstrap asks before fetching a checkout-local Node runtime or locked CLI dependencies; it does not install Pi, Herdr, Homebrew or the whole workstation.

For manual Rex beta recovery, native CLI setup, bidirectional Tailscale HTTPS hosts and verification, see [Rex workstation recovery](setup/REX-RECOVERY.md). It distinguishes portable shell source from private enrollment/host records and live session state; these are not additional automated wizard operations.

Choose a profile, choose components, set `[x]` install/update, `[−]` guided removal or `[ ]` no change, review dependencies/conflicts, then explicitly approve. For preview only:

```sh
sh setup/bootstrap/setup --dry-run
```

**Selective Pi ownership handoffs are verified on both Macs** ([Mini](plans/handoffs/MINI_LIVE_HANDOFF_RESULT.md), [Air](plans/handoffs/AIR_LIVE_HANDOFF_RESULT.md)). Portable Pi source is authored only under `harness/pi/`; frozen root `pi/` paths remain for compatibility/recovery. Existing configurations/private state are preserved. General computer configuration ownership remains transitional; this implementation is not blanket deployment authorization. See [ownership](setup/OWNERSHIP.md), [supported operations](cli/README.md#supported-operations), and [migration/retirement gates](setup/MIGRATION.md). The complete fresh-Mac Pi/runtime and Homebrew installation paths still require the manual official-install steps documented there; do not mistake this release for full end-to-end provisioning acceptance.

## Portable Pi source workflow

The [canonical source workflow](harness/pi/README.md) edits selective packages, portable seed and acceptance metadata directly under `harness/pi/`; no regeneration command is supported. `setup/stage-pi.mjs` is retired to prevent overwriting active resources. Validate with the [CLI checks](cli/AGENTS.md#paved-road), using isolated dependencies and temporary homes, not a live apply.

All 13 root `pi/` files, historical docs/managed locks and `scripts/install-pi` remain frozen compatibility/recovery inputs for old links, the dirty dotfiles `pi-resources` caller, diagnostics and legacy fixtures. Do not edit them as a second source, run legacy setup over selective ownership, or infer that dotfiles/root cleanup is approved. Main owns host synchronization and live actions; see the [source integration gate](setup/MIGRATION.md#prepared-canonical-source-transition).

## Shared development and offline Pi

Use `/Volumes/DevDrive/Projects/agentic-engineering` as the active project workspace on both Macs when connected. This intentionally shared working tree requires nonoverlapping edits and one Git writer; it does not require Air to load Pi resources from SMB.

Air's accepted local checkout `/Users/alexanderortiz/Github/agentic-engineering` remains its offline resource owner. Its source-only fast-forward to `8656a797` and five local-to-local selective links are now verified; exact subsequent accepted revisions are recorded in the [execution report](plans/handoffs/LIVE_HANDOFF_EXECUTION.md). Do not reinstall accepted runtimes or automatically synchronize. Future source updates and link changes remain explicitly reviewed operations.

Read the [durable status/publication plan](plans/handoffs/SHARED_DEVDRIVE_PUBLICATION.md). Cross-machine handoffs are files on DevDrive; pass their paths through Herdr and have the receiver read the files. Do not rely on clipboard/pane history, auto-sync, or new services.

## Computer configuration handoff prerequisites

The six computer configuration components (`config-git`, `config-gh`, `config-ghostty`, `config-herdr`, `config-ssh`, `config-zsh`) appear as `Migration required` only when exact old link targets and imported provenance digests verify. Unknown/changed sources remain conflicts. Neither state is automatically detached or adopted.

For a later **separately approved** computer handoff, review these private local prerequisites (never committed to this repository). Do not create/change them merely to run a dry-run:

1. **Git identity** — create `~/.gitconfig.local`:
   ```
   [user]
     name  = Your Name
     email = you@example.com
   ```
   The new portable Git template includes this file; the currently installed legacy config may not.

2. **SSH hosts** — create `~/.ssh/config.local` with `Host` entries for personal hosts. The new portable SSH template includes it; inspect existing private hosts before any approved transition.

3. **Shell overrides** — optionally create `~/.config/ae/shell.local.zsh` to export `USER_EMAIL`, `USER_NAME`, or `AE_PROJECT_HOME`.

4. **Parent-directory symlinks** — if `~/.config/ghostty` or `~/.config/gh` are folded parent symlinks into old dotfiles, their conversion to real local containers with individual leaf links requires a [per-host approved transaction](setup/MIGRATION.md#approved-handoff-transaction-one-host-at-a-time). This is intentionally not automated; enumerate and approve every affected child explicitly before detaching the parent symlink.

Private overrides do **not** clear legacy link ownership. After reviewing prerequisites, obtain a per-host approval naming the exact old leaves/parents and rollback record. Only then detach matching approved links, preflight every selected package, and apply source-only Stow or the narrowly reviewed CLI plan. GH/Ghostty and shell-plugin paths may have folded parent links; inspect every package rather than assuming Git/Herdr/SSH/shell are leaf-only on every host. Dry-run alone never authorizes detachment.

For a read-only inventory of current Pi resource link topology, runtime metadata and Workbench source locality (useful pre-flight before any handoff):

```sh
node setup/inspect-links.mjs --pi
# Optional existing fixture/other target: add --home /absolute/existing/home
```

This reports targets **relative to the checkout containing the script**, hashes, managed-runtime ownership and Workbench path resolution without reading settings, credentials or sessions, and without calling Pi or Stow. A report from SMB cannot establish ownership of Air's accepted separate local checkout. The local Air script is present after its approved source update. Use the local script, never the SMB checkout's source root, to inspect Air runtime ownership.

## Operations requiring separate approval

The wizard does not perform these without explicit per-host authorization:

- Detachment of old legacy symlinks and parent-directory link conversion
- Root `pi/` physical relocation and old installer/fixture retirement
- Air-side computer configuration inventory and handoff (Air needs its own fresh inventory)
- Homebrew installation, Oh My Zsh installation, Pi runtime install/upgrade/removal
- Air SMB services, Air reconnect testing, offline operation acceptance
- Any commit, push, branch/index operation or destructive source relocation
