# Legacy dotfiles retirement checkpoint

November 2026 focused reconciliation. **Retirement is blocked. No archive move or live ownership switch was performed.** Agentic Engineering is the single authored setup authority; legacy deployment dependencies do not make dotfiles a second authoring source.

See [ownership map](OWNERSHIP.md), [migration gates](MIGRATION.md), [home lab](HOME-LAB.md), and [NAS status](NAS-SSH.md). Historical statements about active dotfiles development do not override this checkpoint.

## Further verified handoffs — November 23, 2026

This supersedes the earlier checkpoint's pending SSH/Air-GH statements.

- **Mini SSH:** `~/.ssh/config` now links into canonical `setup/computer/ssh/.ssh/config`;
  private host blocks are preserved in 0600 `~/.ssh/config.local`. Receipt
  `~/.local/state/ae/handoffs/mini-ssh-20261123T160352Z/manifest.json`.
- **Air SSH:** the same relative canonical target is in Air's physically local
  checkout, with its own private include. Receipt `air-ssh-PwJoME` under Air's
  `~/.local/state/ae/handoffs/`.
- **Air GH:** `~/.config/gh/config.yml` now links into Air-local canonical
  `setup/computer/gh/.config/gh/config.yml`; receipt `air-gh-6dIt2r`.
  `hosts.yml` remains at its original local path and inode. Only filesystem metadata
  was inspected before/after: no credential contents were read, hashed, copied,
  published or relocated.
- **Air Herdr:** a local regular `~/.config/herdr/config.toml`, not legacy-owned.
  Bounded content inspection found no legacy source reference. Its existing local
  preferences are intentionally retained; no adoption, restart or session change
  is needed for legacy retirement.

Each SSH handoff checked seven complete effective option dumps (including Mini's
NAS alias) against the old configuration, prepared a temporary candidate include,
rehearsed native Stow install/delete, and tested restoring the exact old link then
reapplying canonical ownership. All comparisons passed independently. The initial
Mini fixture check caught a Stow argument-order issue before any live write; the
corrected `--delete`-before-package fixture passed. Private receipts record exact
old/new targets, hashes, source revision and created-include metadata. Independent
Rex access was verified before SSH mutation. No NAS-side connection test or change
was made, and NAS authentication remains unverified/previously denied.

### Ghostty: exact preference decision

Git history establishes the newer authored version: canonical commit `e838453`
(`fix(theme): refine Purple Dreams brand palette on plum background`, authored
November 17). Both Macs still use the same older legacy palette (May-era history).
Canonical changes are intentional, not evidence that the live theme file is corrupt.
The current request requires a clear preference decision before changing appearance;
**neither palette has been overwritten and neither Ghostty handoff has occurred**.

| Entry | Current live, both Macs | Newer canonical |
|---|---|---|
| palette 0 | `#12333f` | `#0d2630` |
| palette 1 | `#ee5f5b` | `#d84c48` |
| palette 2 | `#bada55` | `#99b73b` |
| palette 3 | `#dfb626` | `#ad6f17` |
| palette 4 | `#19b5fe` | `#178cc3` |
| palette 5 | `#fe57a1` | `#e73182` |
| palette 6 | `#33ccba` | `#328f84` |
| palette 7 | `#d4d4d4` | `#b2aab3` |
| palette 8 | `#0c2732` | `#7a7483` |
| palette 9 | `#bc5329` | `#ee5f5b` |
| palette 10 | `#5c6d74` | `#bada55` |
| palette 11 | `#697a81` | `#f89406` |
| palette 12 | `#7fdbff` | `#19b5fe` |
| palette 13 | `#9b72cf` | `#fe57a1` |
| palette 14 | `#95a0a0` | `#33ccba` |
| background | `#1b1224` | `#160d1b` |

Palette 15 (`#fbf6e4`), foreground and the other inspected theme content are unchanged.
The source of intended portable defaults is canonical; adopting its newer look on
live hosts or retaining the older look as a local preference needs the operator's
choice. Do not silently roll canonical back to legacy to satisfy byte equality.

### Exact remaining dependencies and required dispositions

- **Mini GH:** `~/.config/gh` still points to legacy `gh/.config/gh`. Its `config.yml`
  is nonsecret, but `hosts.yml` is a 0600 regular file physically inside that legacy
  directory. Path/mode metadata only was inspected. It cannot remain at that exact
  physical location if the directory is archived, and this task prohibits relocating
  or reading credentials. Operator action/separate authorization is required for a
  secure locally owned authentication transition; do not introduce a path shim.
- **Mini Ghostty:** folded `~/.config/ghostty` and Application Support config still
  resolve through legacy `ghostty/`; Air Ghostty uses its local legacy release.
- **Mini shell:** `~/.zshrc`, custom env/theme/plugins and `~/.local/bin/aircopy`
  still consume legacy `zsh/`; canonical differs in identity/navigation handling.
  Selected plugin inspection also found differing docker-compose README/git plugin
  content. Preserve those customizations rather than force whole-package Stow.
  The existing local `.zshenv` is not automatically adopted. Air's shell/resource
  release links still require its own exact preservation review.
- **Historical resource links:** Mini `~/.pi/{core,agents,docs,design,optional,packages,rules}`
  and Air historical Pi/OMP links still reference old sources/checkout names.
  Discovery/link presence is not proof of loading or approval to delete them.
- **Supported legacy recovery:** `dotfiles/.no-stow/scripts/air-snapshot` requires
  the original shared source path and Git revision history; whole-home release/SMB
  procedures and `pi-resources` retain compatibility consumers. Canonical setup CLI,
  selective Stow and the bounded Rex procedure now cover the migrated packages;
  **do not use whole-home legacy recovery to undo these new owners**. Original
  sources remain solely for unmigrated resources and targeted receipt rollback.
  No unverified wholesale replacement of Air network/release recovery was made.

No full legacy snapshot or archive move was attempted while these dependencies
remain. The original dirty repository/history is preserved. Neither new tooling nor
Workbench changes were introduced.

## Earlier live implementation checkpoint — November 23, 2026

This checkpoint supersedes the Git/Herdr rows in the earlier inventory below;
other consumers remain unresolved. The migration performed real bounded handoffs,
not just source copying. No NAS authentication/settings or private credentials changed.

| Host / exact home leaf | Previous owner | Current canonical target |
|---|---|---|
| Mini `~/.gitconfig` | legacy `git/.gitconfig` | local checkout `setup/computer/git/.gitconfig` |
| Mini `~/.gitignore_global` | legacy `git/.gitignore_global` | local checkout `setup/computer/git/.gitignore_global` |
| Mini `~/.config/herdr/config.toml` | legacy `herdr/.config/herdr/config.toml` | local checkout `setup/computer/herdr/.config/herdr/config.toml` |
| Air `~/.gitconfig` | local legacy release `git/.gitconfig` | **Air-local** checkout `setup/computer/git/.gitconfig` |
| Air `~/.gitignore_global` | local legacy release `git/.gitignore_global` | **Air-local** checkout `setup/computer/git/.gitignore_global` |

Both hosts preserve their own Git identity in private `~/.gitconfig.local`.
All effective Git values were compared before/after, excluding only the new include
directive. Herdr non-comment content is unchanged. No application reload/restart
was required or performed; Herdr UI acceptance was not independently exercised.
Native Stow install/remove rehearsals ran in temporary homes before live handoff;
new realpaths/hashes passed. Private 0700 receipt directories contain 0600 manifests
with exact old link literals, source revision, hashes, new targets and created-include
metadata. Failed live transactions were guarded to restore only matching resources.
No failure rollback was needed. Receipts: Mini `mini-git-herdr-20261123T152650Z`;
Air `air-git-LwJ5Tu`, under each host's `~/.local/state/ae/handoffs/`.

Air execution used the installed Rex skill: verified remote identity, explicit
remote session and separate unfocused blocks, no input into existing panes. The
working tools are Homebrew Git/Stow and the existing user-local Node. System Git
hits an existing Xcode library error; the first attempted Homebrew Node path did
not exist and the command did not launch. The corrected user-local Node route passed.
No Xcode repair, package installation or session restart was performed. Air source
was clean at `bdcbc167b62052e22e726eaeab0f1a78d4671e97`; migrated Git bytes match
reviewed canonical files. Sources remain physically local, not SMB-backed.

Remaining current → proposed package ownership:
- Mini SSH: legacy `ssh/.ssh/config` → canonical `setup/computer/ssh/.ssh/config`
  plus private host include; **not changed**, preserve current NAS behavior and
  verify independent recovery before switching SSH.
- Mini shell/custom resources: legacy `zsh/` → canonical `setup/computer/zsh/`
  plus private shell overrides; **not changed**. Host-aware navigation and identity
  must be preserved explicitly; occupied `.zshenv` is not automatically adopted.
- Mini Ghostty: legacy folded `.config/ghostty` plus Application Support leaf →
  canonical `setup/computer/ghostty/` leaves. **Preflight stopped before writes**:
  the live palette/background differs from canonical. Do not overwrite either
  version or change appearance implicitly. Two child paths were enumerated.
- Mini GH: legacy folded `.config/gh` → canonical config leaf plus local private
  credential file. **Not changed**: `hosts.yml` is present and credentials must
  not be modified or dropped during parent conversion.
- Air SSH/shell/GH/Ghostty: existing local release → corresponding **Air-local**
  canonical packages/private overrides, pending exact per-resource preservation.
- Air Herdr: unmanaged regular config → no automatic adoption; preserve it until
  its ownership/customizations are explicitly reconciled.
- Historical Pi/OMP links and legacy Air release/SMB/recovery callers still need
  explicit disposition. A successful Git handoff does not retire these consumers.

**Archival remains blocked.** No full legacy recovery snapshot or archive move was
performed because live/recovery dependencies still require the original location.
The canonical Rex instructions now recognize Rex rather than demanding Herdr context.
See [bounded Rex checks](REX-RECOVERY.md#bounded-checks-during-setup-migration).

## Earlier observed consumers (before the implementation checkpoint)

Read-only, depth-bounded link inspection on both Macs and selected recovery entry-point inspection found:

| Consumer | Observed ownership | Consequence |
|---|---|---|
| Mini SSH | `~/.ssh/config` links into legacy `ssh/.ssh/config` | Moving the original repository would break current SSH configuration, including NAS |
| Mini shell/Git | `~/.zshrc`, `~/.gitconfig`, `~/.gitignore_global`, custom environment/theme/plugins | Live direct legacy links require reviewed migration |
| Mini application configs | GH/Ghostty folded parents, Herdr config, aircopy | Exact children and private data must be preserved before conversion |
| Mini historical Pi resources | `~/.pi/{core,agents,docs,design,optional,packages,rules}` links into legacy source | Link existence does not prove active loading; audit/retire consumers explicitly, never delete on that assumption |
| Air SSH/shell/Git/GH/Ghostty/aircopy | Links to physically local versioned `dotfiles-runtime/releases/...` payload | Not direct dependence on shared Mini source for every runtime read; still a legacy deployment/recovery consumer |
| Air historical Pi/OMP resources | Sampled links target old local dotfiles checkout paths | Loading/validity of all historical links not proven; do not remove blindly |
| Legacy Air recovery | `air-snapshot` requires the original shared dotfiles source path and Git revision history; whole-home installer has protected historical resources | Moving original source breaks supported staging/verification assumptions even where runtime payload is local |
| Legacy resource caller | `pi-resources` delegates to frozen compatibility installer/root paths in canonical repository | Retire/reconcile caller before removing compatibility inputs |

Evidence commands: `find "$HOME" -maxdepth 4 -type l ...` on both hosts; selected `ls -ld`; Mini `ssh -G nas`; Air read-only `ssh -G nas`; bounded inspection of `air-snapshot`, `install-air-home`, `stow-all`, `pi-resources`. Raw private paths/hostnames are not published here. This is sufficient to reject retirement, not a comprehensive migration acceptance report.

Canonical `setup/computer/ssh/.ssh/config` already supplies the intended portable replacement, including private `config.local`, but it is **not the active owner** on either inspected host. File copying and accepted Pi resource handoffs did not complete general computer configuration handoff.

## Preservation and documentation reconciliation

The newly authored home-lab/NAS documents were integrated as public-safe references under `setup/`; exact private network/account data is excluded. Original detailed files and the full associated dirty legacy README/diff were copied to a private directory outside either repository, with restrictive permissions and byte comparisons before redundant document removal. This preserves their exact contents without publishing sensitive inventory. README navigation now points to canonical docs; unrelated README changes remain intact.

That narrow preservation is **not a full recovery snapshot** of the dirty legacy repository. Original Git history, all unrelated uncommitted/untracked content, live configuration, release tooling and compatibility inputs remain in place. No NAS operations, credential changes, source relinks, commits in legacy, or forced deployment were performed.

## Gates before formal archival

1. Inventory/approve exact per-host leaves, folded parents, private overrides and supported recovery consumers; classify historical links explicitly.
2. Migrate approved computer components into canonical ownership with private host/identity data kept local, preserve NAS/existing aliases, and verify both hosts online/offline. This checkpoint does not authorize such mutations.
3. Replace/retire the original-path legacy Air staging/verification/recovery dependency and any legacy Pi callers using the existing reviewed processes. Preserve existing offline recovery until replacement is accepted.
4. Preserve **all** legacy Git history, dirty tracked content, ignored/untracked/private content and needed release artifacts in a private recovery snapshot outside the active workspace; verify content/manifests and actual restoreability. Do not publish secrets or mistake `git bundle` alone for a complete dirty snapshot.
5. Reinspect for direct legacy-source and recovery dependencies on both hosts. Only when none remain, select a labeled archive location outside active Projects, move with approval, verify both hosts, and record that actual location.

**Final archive location: none.** The repository remains at its original path because verified live consumers still require it. No second active source is created by leaving those consumers intact. New setup changes must be authored here; legacy changes are restricted to explicitly scoped compatibility, migration or recovery needs.
