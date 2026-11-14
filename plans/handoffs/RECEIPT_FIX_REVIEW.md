# Receipt fix review (9f0a2d7)

Independent read-only review. Commit `9f0a2d7` was cherry-picked into this worktree's `migration/setup-review` branch as `39d3d55`. No live HOME or runtime was touched, and no source was edited.

**Verdict: ACCEPT. No actionable safety issue found.**

## Evidence

- `check` passes. `npm --prefix cli test` is 129/129 with 0 skipped; this includes the 21 added repeatability tests and the composer tests.
- Throwaway probes (deleted) drove both `pi-defaults` and `pi-theme` through drift, then reapply, with a tampered receipt:
  - **Stale approval fingerprint:** a receipt edited between preview and execute is refused with `State/source changed after preview`. The receipt content and mode are now part of the detect fingerprint for both components.
  - **Mode 0644, symlink and malformed receipts:** each is refused before any mutation (snapshot of HOME unchanged). This applies to defaults and theme, including on the reinstall path.
  - **Unmanaged key in defaults receipt:** refused with `Receipt contains unmanaged keys`.
  - **Write-order failure:** the settings write was forced to fail (EACCES) after the receipt was replaced.
    - Settings were left unchanged and the failure was reported as `partial`.
    - The new receipt held `before = current`.
    - Retry succeeded, and removal then restored the user's value.
    - Both archived receipts have mode 0600.

## Assessment of the rebase choice

Rebasing drifted keys to the current user value, while unchanged keys keep their original-before, is sound.

- Removal restores the last value the user held, not a pre-setup value they have since replaced. That is the least surprising result, and it never overwrites a user decision.
- Keys the user has not touched still roll back to their true original.
- The receipt remains per-key and validated.
- An explicit, approved reapply is the only path that rebases, and the prior receipt is archived at 0600 first.
- Preserving all original-before would have silently reverted deliberate user edits on removal. It is a valid alternative but not better.

## Known non-atomic behavior, not an invariant failure

- Receipt replacement and the settings write are two steps. A failure between them leaves a new receipt with `before = current` and unchanged settings. This is safe, and a retry converges.
- Removal in that window is refused as `changed since apply`, so manual review is needed. It is visible and non-destructive.

## Low display limitation

When one operation fails, selected-but-unrun operations are shown `skipped` next to an explicit failed component. It is cosmetic, previously noted, and not blocking.
