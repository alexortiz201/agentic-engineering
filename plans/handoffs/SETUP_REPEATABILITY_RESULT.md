# Setup receipt repeatability — bounded implementation result

**Settled: Main accepted/integrated after independent adversarial ACCEPT review and 129-test integrated runs on both Macs.** Published implementation is `3de15bce2c1d39aecf7bf5c05bfbbeddc011a5b1`; no live defaults/theme apply was needed. Preparation/pending statements below are retained assignment history. See [review](RECEIPT_FIX_REVIEW.md) and [readiness](MIGRATION_READINESS.md).

Identity: `Mac-mini.local`, Pi coding agent. Isolated worktree `/tmp/ae-setup-repeatability`, branch `migration/setup-repeatability`, base `8656a79767b2ef67aedd462b1081a2e0b0ed509f`. Source/canonical inventory work remains Main-owned and is untouched here.

## Verified reproductions on the assigned base

Both initial regression tests used temporary homes, the actual `detectAll` → `plan` → `execute` path, and actual GNU Stow for the theme leaf. Runtime/Brew/package commands are refused by the fixture runner; component dependencies are intentionally excluded to isolate receipt behavior, not simulate runtime acceptance.

1. **Defaults reapply after drift:** install defaults; manually change `defaultModel`; explicitly select install again. Planner allows configure, but executor returns `failed` with `Existing defaults receipt requires reconciliation, not overwrite`. Removal also refuses drift by design. Initial regression failed with that exact executor result before implementation. Final regression covers drift in both `defaultModel` and nested `compaction`.
2. **Theme remove/change/reinstall:** start with a personal theme, install Purple Dreams, remove it, manually select another theme, explicitly reinstall. Preflight throws `Theme changed after setup; reconcile existing receipt manually` because removal retained the old receipt. Initial regression failed with that exact exception before implementation. Final tests also cover explicit reconfigure while the owned theme link remains installed.

The independent reviewer report at `/tmp/ae-setup-review/plans/handoffs/SETUP_REVIEW_RESULT.md` confirms both findings. This implementation independently reproduced them before edits; it does not rely solely on that report.

## Rollback semantics and approval boundary

**Defaults use per-key continuity, not blanket original-state preservation or blanket rebase.**

- If a managed top-level key still equals the previous receipt's `applied` value, retain its original `before` record. Reconfiguring another key must not lose the rollback history of unchanged keys, including original absence.
- If a key has drifted, an explicitly selected and approved install/configure may overwrite that selected default. Its **current user value/presence becomes the new `before`**. Later removal restores that deliberate pre-reapply preference, not an older value from before the user's independent edit. Nested settings such as `compaction` remain one selected top-level value, consistent with the existing portable-default merge contract.
- Example: original model A → setup model B → user model C → approved reapply B → removal restores C. A different key that remained at B throughout still restores its original pre-setup value/absence.
- This deliberate rebase differs from the reviewer's suggested original-before alternative: restoring A would erase a later personal preference that the user had only temporarily replaced by explicitly reapplying defaults. Prior receipts are archived, so the original evidence remains available without claiming it is the active removal baseline.

**Theme reinstall/reconfigure records the current non-Purple-Dreams preference/presence** as its new before-state. Previously retained receipts are archived rather than discarded. This works after removal, after preference drift with the link still installed, and when the new preference is absent. A currently satisfied selection remains a no-op and does not rewrite receipts/backups.

Explicit component selection plus existing plan approval authorizes only those managed defaults or the theme preference; it is not consent to alter unrelated fields, other resources or private state. No force mode or implicit receipt adoption is added.

**Later independent edits remain protected:** defaults removal still refuses if any managed key differs from its active receipt's applied value, including after reapply. Unrelated later settings edits survive successful removal. Theme removal retains the existing behavior: restore only when the active preference is still `purple-dreams`; if the user independently chose a different theme, leave that preference unchanged while removing only the owned resource link. Unreceipted active Purple Dreams removal and foreign resource paths remain refused.

## Implementation scope and safety

- `cli/src/setup/files.ts`: narrow receipt replacement helper archives existing bytes to unique mode-0600 files in the existing private backups directory, writes the replacement to a unique mode-0600 temporary file, then renames it. No backup pruning or arbitrary cleanup. A read-only receipt fingerprint helper hashes content and records file mode without following symlinks.
- `cli/src/setup/theme.ts`: validate retained receipt before approved refresh; archive/replace before changing preference. Preserve removal behavior and retained recovery evidence.
- `cli/src/setup/execute.ts` — justified narrow extension because defaults receipt ownership already lives here: validate before-state/managed keys before reapply, preserve/rebase before-values per key, then use the shared receipt replacement helper. Existing default-removal drift refusal, settings backup and stop-on-failure paths remain.
- `cli/src/setup/detect.ts` — justified narrow extension: fingerprint theme/defaults receipts so a receipt changed after preview cannot be consumed or replaced under old approval. Defaults fingerprints also include expected portable values, keeping source changes inside stale-preview protection.
- `cli/tests/repeatability.test.ts`: 21 focused regression/safety tests. No existing source/composer tests, catalog, canonical resources, source workflow docs, live configuration or external repository changes.

Malformed JSON/schema, missing before-state, unmanaged receipt keys, symlink/non-regular receipts and non-private receipt modes are not reconciled automatically. They require manual review and are refused before target mutation. Existing settings/path/foreign-leaf checks still apply. Retained prior receipt bytes are validated before rollover; this is evidence-preserving replacement of trusted setup records, not adoption of an arbitrary file.

As with the existing settings workflow, receipt and settings writes are ordered, **not a multi-file atomic transaction**. Receipt evidence is published before settings mutation. A failure may leave explicit recovery evidence/partial state and requires fresh inspection/replanning; no automatic rollback or deletion of backups is introduced.

## Observed checks

All checks ran in the isolated worktree; all target mutations were temporary-home fixtures.

- Before fix: 2 focused reproductions, **2 failed** with the exact errors recorded above.
- `npm --prefix cli ci --ignore-scripts --cache /tmp/ae-setup-repeatability-npm-cache` — passed; dependencies only in this isolated checkout.
- `npm --prefix cli run check` — passed.
- `npm --prefix cli run build` — passed.
- `node --experimental-strip-types --test cli/tests/repeatability.test.ts` — **21 passed, 0 failed, 0 skipped**.
- `npm --prefix cli test` — **84 passed, 0 failed, 0 skipped** (63 base tests + 21 focused tests).
- `git diff --check` — passed.

Focused coverage includes both repaired reproductions; multi-cycle defaults reapply; rollback preservation for unchanged/absent keys; rollback rebasing for drifted keys; missing-theme restoration; receipt archive byte equality and private modes; unchanged-state no-op without any file/backup changes; explicit approval refusal; stale settings and stale receipts for both components; malformed, symlinked and public-mode receipt refusal for both install/removal; unmanaged keys; later managed drift refusal and unrelated edit preservation; unreceipted active theme and foreign leaf refusal.

No Pi loading/session/runtime validation is claimed. No live HOME/runtime/dotfiles/shared worktree mutation, no source generation against active resources, no backup pruning, no publication/integration.

## Deferred low-severity display finding

The confirmed reviewer finding remains unchanged: after a failure, subsequent operations return `skipped` with `Stopped after failure; no automatic rollback or further mutations`, while intentional skips use their plan reason. The CLI summarizes skipped/no-op together and suppresses individual skipped rows. The failure itself is surfaced; execution stops. This display distinction is low-severity and out of this bounded receipt fix; no result/status/UI widening was made.

## Handoff

Main alone decides acceptance and integration. Review the per-key rebase semantics above deliberately. Commit identity accompanies this report path in the Herdr completion message; no self-referential commit hash is embedded here. Existing private receipts/backups remain recovery material; rollback of source changes must not restore HOME or discard subsequent user edits.
