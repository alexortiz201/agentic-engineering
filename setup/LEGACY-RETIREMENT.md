# Legacy dotfiles retirement checkpoint

November 2026 focused reconciliation. **Retirement is blocked. No archive move or live ownership switch was performed.** Agentic Engineering is the single authored setup authority; legacy deployment dependencies do not make dotfiles a second authoring source.

See [ownership map](OWNERSHIP.md), [migration gates](MIGRATION.md), [home lab](HOME-LAB.md), and [NAS status](NAS-SSH.md). Historical statements about active dotfiles development do not override this checkpoint.

## Live implementation checkpoint — November 23, 2026

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
