# Legacy dotfiles retirement checkpoint

November 2026 focused reconciliation. **Retirement is blocked. No archive move or live ownership switch was performed.** Agentic Engineering is the single authored setup authority; legacy deployment dependencies do not make dotfiles a second authoring source.

See [ownership map](OWNERSHIP.md), [migration gates](MIGRATION.md), [home lab](HOME-LAB.md), and [NAS status](NAS-SSH.md). Historical statements about active dotfiles development do not override this checkpoint.

## Observed consumers

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
