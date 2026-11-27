# Tailnet DNS and NAS documentation update

**Status: COMPLETE — documentation only; live verification remains pending.**

Date: November 23, 2026. Baseline: `133aac1` on canonical `main`; the working tree
was clean before these edits. The operator subsequently authorized committing
these documentation changes and pushing to GitHub. Identify their revision with
`git log -1 -- setup/TAILNET-RENAME-REPORT.md`.

## DNS name and evidence

- Current and prior tailnet DNS names remain in private operator records.
- The operator confirmed the rename in the Tailscale Admin Console on November 23.
- The expected NAS HTTPS URL is private and was **not tested**.
- Current NAS runtime, SSH-key access, SMB shares and Serve mapping are
  operator-reported configuration, not independently validated by this task.
- Earlier failed SSH probes remain explicitly historical. No new authentication,
  certificate readiness, DNS resolution or endpoint availability is claimed.

## Changed files

| File | Change |
|---|---|
| [SETUP.md](../SETUP.md) | Discoverable tailnet rename status and NAS reference |
| [HOME-LAB.md](HOME-LAB.md) | Updated NAS/Tailscale status, evidence boundaries and outstanding checks |
| [NAS-SSH.md](NAS-SSH.md) | Single detailed inventory/access guide; LAN vs Tailscale, SSH/SMB, Compose/Serve, rename and certificate checklist; preserved historical evidence |
| [REX-RECOVERY.md](REX-RECOVERY.md) | Rename/certificate and saved-client-record follow-ups without session disruption |
| This report | Requested completion record, search scope and outstanding work |

## Search and validation

- Before editing, a case-sensitive literal-domain repository search included
  hidden and ignored files, excluding `.git` internals and `node_modules`.
  Neither old nor new suffix occurred in the searched tree; no repository scripts,
  configuration examples or machine-specific records required domain replacement.
- Existing historical/retirement records were not rewritten. Literal names are omitted from the current documentation.
- Bounded local nonsecret client checks found three old-suffix references in the
  Mini's private `~/.ssh/config.local` and an old-suffix Rex saved-host label.
  A label match alone does not prove the saved connection URL is stale.
  Neither file/record was changed, and private mappings were not copied here.
- No password-manager vault, authentication file, private key, Tailscale state,
  session token or Docker secret was opened/copied/published.
- **Validation passed:** `git diff --check`; five Markdown files and 41 relative
  links/heading anchors checked; key-payload marker check; original rename history retained in private records. No runtime
  code changed; application/network tests were not run.

## Remaining verification and manual follow-ups

1. Confirm new-name DNS, HTTPS certificate reissuance/readiness and the NAS Serve
   endpoint from Mini and Air, including permitted off-LAN access. Verify the
   reported HTTPS 443 → loopback HTTP 9999 mapping and actual UGOS UI behavior.
   Never bypass TLS checks. The new URL must not be described as working until tested.
2. The later [NAS diagnosis](NAS-SSH-DIAGNOSIS-REPORT.md) verifies SSH on both Macs.
   Neither that result nor HTTPS establishes SMB readiness. Preserve existing LAN access.
3. Review the observed private SSH references and Rex label; verify each actual
   advertised Rex URL/host identity before any separately approved change.
   Check app bookmarks and CLI hosts on both Macs separately, preserving sessions.
4. Manually review LastPass URL matching fields, browser bookmarks, Finder favorites
   and login mounts, Shortcuts and external scripts. Air-local records and these
   services were not comprehensively inspected. Do not alter LAN/IP-based records
   merely because the tailnet suffix changed.

**Safety:** no live NAS, Tailscale, SSH, Docker or network configuration was modified;
no external-service update or endpoint test was performed. No setup tooling was
introduced. Legacy dotfiles work/history and unrelated repository files are untouched.
