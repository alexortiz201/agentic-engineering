# Legacy dotfiles retirement checkpoint

November 2026 focused reconciliation. **Retirement is blocked. No archive move or live ownership switch was performed.** Agentic Engineering is the single authored setup authority; legacy deployment dependencies do not make dotfiles a second authoring source.

See [ownership map](OWNERSHIP.md), [migration gates](MIGRATION.md), [home lab](HOME-LAB.md), and [NAS status](NAS-SSH.md). Historical statements about active dotfiles development do not override this checkpoint.

## Consolidation checkpoint

**Canonical ownership is settled; archival is not approved.** `setup/` owns
workstation provisioning and configuration sources, `cli/` owns the setup
workflow, and `harness/pi/` owns the portable Pi resource leaves. Legacy dotfiles
remains a compatibility and recovery source. Keep host identities, credentials,
preferences, runtime state, and exact recovery receipts outside Git.

- **Completed:** selective Pi handoffs and Air offline resource loading; live
  and isolated shell/Ghostty handoffs on both Macs; Mini's GitHub CLI handoff
  to a real local configuration directory; and verified cross-Mac SSH, Rex CLI
  over SSH, and [NAS SSH](NAS-SSH-DIAGNOSIS-REPORT.md). Both Macs retained their
  already-working palettes; do not apply the portable palette over those local
  preferences. Exact link receipts and original bytes are retained privately.
- **Connectivity boundaries:** strict, fresh cross-Mac SSH passed both ways;
  this does not attest unrelated devices. Direct Rex HTTPS timed out; the
  [verified SSH fallback](REX-RECOVERY.md#verified-ssh-transport-fallback) does
  not prove native GUI Remote Hosts or HTTPS acceptance. Air's nonsecret GH
  configuration is canonical; the last scoped Air GH CLI authentication check
  returned HTTP 401. If needed, reauthenticate in a trusted terminal as the
  operator and verify from a fresh shell. Do not transfer credentials.
- **Package acceptance:** the tested setup/recovery path used Git, Node/npm,
  Homebrew and native Stow. Shared and host-additive Brew declarations matched
  legacy; npm/Bun inventories were retained, not replayed. App presence can
  differ from receipt presence; a missing receipt does not justify reinstalling
  an application or changing its owner. `ripgrep`, App Store tooling and other
  optional declarations were not required for this recovery path. Full clean-Mac
  reproduction of optional apps and third-party accounts was not attempted.
  Preserve the [accepted developer-tool ownership](DEVELOPER-TOOLS.md).

### Air independent file recovery

**File recovery passed without access to the original source.** Staging used
local APFS, an alternate HOME, and a sandbox denying network, the shared and
legacy/live source roots, and writes outside staging. Negative controls confirmed
source access was denied. No live mount, Finder action or LaunchAgent activation
was part of the rehearsal.

1. Verify the private receipt's archive checksums. Extract the runtime archive
   into an empty staged runtime directory. Check the relative `current` link,
   both retained release manifests and the preserved FIFO. In the rehearsal,
   the existing verifier passed in isolated mode; a separate private history
   copy matched all 77 manifest paths, modes and blob digests for each release.
   Do not bypass the production source guard or rely on the offline clone alone
   for historical objects it does not contain.
2. Restore the saved helper/plist pair into the alternate HOME **for inspection
   only**. Check owner, group, mode, `bash -n` on the helper and `plutil -lint`
   on the plist. Compare literal links, bytes, flags, ACLs, and extended
   attributes. The rehearsal matched 362 runtime entries and both boot files.
   The plist's installed home path is an intentional host binding; never load
   it in the alternate HOME or convert it into a portable template.
3. Use the physically local [canonical setup](../SETUP.md), not the old
   whole-home installer. In a separately staged HOME the six computer packages
   and five selective Pi resource packages installed with native Stow and
   `--no-folding`. The recreated cmux link matched the retained local release.
   This was not a repeat of the live handoffs or runtime acceptance.

**Live recovery not yet accepted:** an approved console rehearsal must verify
cold remount of both expected SMB shares using the existing local GUI context,
including a second trigger without duplicate mountpoints. Do not load jobs,
force unmounts, inspect credentials, or invoke the legacy installer under this
checkpoint. Keep the local runtime, the verified private recovery artifacts and
the original compatibility source available until the separate gate is closed.

### Remaining legacy consumers and rollback

| Consumer | Disposition |
|---|---|
| Air cmux local configuration and the retained runtime releases | Keep the verified local release and private archive. The live cmux leaf does not require the original shared checkout. Do not replay an old whole-home transaction over migrated leaves. |
| Legacy `air-snapshot`, `install-air-home --release` and `install-air-smb` | Production staging/activation still has original-path and history assumptions. Decide explicitly whether fresh legacy-format releases or whole-home activation are still supported; replace and test that route or retire it by approval. Keep `host-role` with the historical tooling. |
| Legacy `bootstrap`, `stow-all`, `pi-resources` and their documented callers | Normal provisioning uses the canonical selective path. Retain frozen root `pi/` and `scripts/install-pi` for remaining callers and tests. Do not replay old global npm or prefix mutations. |
| Historical Pi/OMP links and manual readers | Resolving links are not proof of runtime loading; dangling links are not permission to delete. Identify actual manual readers, preserve necessary material privately, and disposition links explicitly before moving their sources. |

Both hosts had private source/history preservation verified. Mini's checkout
copy agreed on path inventory, Git integrity, refs and dirty status; provenance
metadata differences prevented claiming byte-for-byte filesystem metadata
fidelity. Air's local source copy passed Git/index checks but did not establish
full-tree equality. The separate Air runtime/boot-file comparison above passed.
Refresh private backups and restore checks before archival, including required
metadata. A Git bundle alone does not capture a dirty checkout or ignored data.
For rollback, use verified private before-state receipts to restore only the
approved leaf/record if its after-state still matches. Never overwrite newer
private edits or restore an entire HOME to undo a selective handoff.

Close the independent Air recovery and remaining-consumer gates first. Then
verify no required reader uses the original path, refresh the private restore
evidence, and obtain separate approval for the exact archive move and rollback.
No archive move or live migration is authorized by this report.

## Resume report — verified cross-device recovery; archival blocked

The earlier resume checkpoint verified fresh, strict SSH in both directions,
separate Rex CLI SSH checks, and a bounded remote command. It did not change the
Rex server, unrelated devices, or live sessions. Its older shell/Ghostty and
Mini GH dependencies were superseded by the completed handoffs above. Exact
configuration changes and rollback strings stay in the private per-host receipts.

## Further verified handoffs — November 23, 2026

This supersedes the earlier checkpoint's pending SSH/Air-GH statements.

- **Mini SSH:** `~/.ssh/config` now links into canonical `setup/computer/ssh/.ssh/config`;
  private host blocks are preserved in 0600 `~/.ssh/config.local`. Exact receipt details stay private.
- **Air SSH:** the same relative canonical target is in Air's physically local
  checkout, with its own private include and private receipt.
- **Air GH:** `~/.config/gh/config.yml` now links into Air-local canonical
  `setup/computer/gh/.config/gh/config.yml`; its receipt stays private.
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
was made at that checkpoint; the later [NAS diagnosis](NAS-SSH-DIAGNOSIS-REPORT.md) records the successful independent validation.

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
No failure rollback was needed. Exact receipts stay in each host’s private handoff storage.

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
