# Setup review result

Worktree `/private/tmp/ae-setup-review`, branch `migration/setup-review`, base `8656a79`. Mini, Node 24.15.0, Claude Code (Sonnet 5.5). No source changes; only `cli/tests/composer-compat.test.ts` and this report are added.

## Gates

| Gate | Result |
| --- | --- |
| `npm --prefix cli run check` | pass |
| `npm --prefix cli run build` | pass |
| `npm --prefix cli test` | 108 pass, 0 fail, **0 skipped** (includes the 45 composer tests) |
| `python3 cli/tests/terminal-probe.py` | all 5 PTY scenarios pass |
| `AE_PI_RELEASE=/nonexistent` on the composer test | 45 explicitly skipped, 0 fail (override and skip path work) |

## Composer compatibility test

The test loads the unmodified `composer-highlight.ts` through the installed Pi 1.5.2 loader (`~/.pi/agent/install/releases/1.5.2`, read-only, override with `AE_PI_RELEASE`). It makes no model, session or settings API calls, and its only filesystem writes are a temporary cwd. It has no added dependencies.

It covers:

- **Loading and registration:** the extension loads with no errors or warnings. It registers only a `session_start` handler. That handler registers one editor factory when the context has a UI and none when it is headless. The factory returns a `CustomEditor` subclass.
- **Renderer parity:** for 7 samples (Markdown, fenced TS, JSON, bash, tilde fence with unknown language, Unicode/CJK/emoji, long unbroken line) at 6 widths (80, 40, 20, 12, 8, 5), the output matches native `CustomEditor`. Compared per line: line count, ANSI-stripped visible text, visible width, width within the limit, and cursor marker.
- **Highlighting is applied:** guards against a vacuous parity pass.
- **Submission:** submit and edit behavior is identical to native, the submitted text carries no ANSI, and `disableSubmit` is honored.

**Fixture fix (the one failing assertion):** the Bash sample contained only `"$X"`. The composer colors a quoted string as one string token (256-color 114), which is intended, so the expected variable color (215) never appeared. The sample now also has an unquoted `echo $X`. The test asserts that the quoted form is string-colored and the unquoted form is variable-colored. The composer is unchanged.

**Evidence class:** this is host-runtime compatibility evidence from a fixture, driving the native renderer headlessly. It is **not** visual terminal acceptance. Real-terminal appearance still needs an operator eyeball.

## Setup review

I reproduced each provisional concern with throwaway tests built on the `setup.test.ts` fixture, then deleted them. All three are real but low severity: each fails visibly, and none mutates anything or loses data. The intentionally unpruned backups are not a finding.

1. **Defaults receipt blocks reapply after drift (confirmed, medium).**
   - **Reproduction:** apply `pi-defaults`, change `defaultModel` and `compaction` in settings, then select install again.
   - **What happens:** detect says `partial`, plan emits `configure`, and execute fails the component with `Existing defaults receipt requires reconciliation, not overwrite`.
   - **Why it sticks:** removal is also refused, with `Defaults key changed since apply`. Setup can never re-converge, so the user has to delete `~/.local/state/ae/defaults.json` by hand.
   - **Not affected:** remove then reinstall works, because removal deletes the receipt.
   - **Proposed fix:** on `configure` with an existing valid receipt, keep the original `before` and merge in the new `applied` values, with a plan-time warning. Alternatively, have `plan` or `preflight` surface this as a conflict with explicit instructions instead of a runtime failure.

2. **Theme receipt blocks reinstall after manual change (confirmed, medium).**
   - **Reproduction:** set theme to `dark`, install the theme, remove it, set the theme to `light` by hand, then install again.
   - **What happens:** `themePreflight` throws `Theme changed after setup; reconcile existing receipt manually`. The same refusal happens while links are still installed and the theme was changed (state `partial`).
   - **Why it sticks:** `removeTheme` intentionally keeps the receipt, so the receipt becomes a permanent block until it is deleted by hand.
   - **Proposed fix:** when removal restored the original theme, mark or delete the receipt as consumed. Alternatively, treat a receipt with no active `purple-dreams` theme as stale and refresh its `before` value from the current settings.

3. **Failure labeling (confirmed, low).**
   - **Reproduction:** force `brew-stow` to fail while theme, defaults and Todos are selected.
   - **What happens:** every later operation gets status `skipped` with `Stopped after failure…`. That includes operations the user never selected, such as `foundations`.
   - **Why it matters:** the status is the same as an intentional "No change requested" skip, so selected-but-not-run operations are only distinguishable by reading the detail text.
   - **Proposed fix:** report selected-but-unrun operations with a distinct status (for example `not-run`), and keep `skipped` for unselected ones.

Not reproduced as a defect:

- **Safety invariants held** in everything I exercised. Stale previews are refused up front, unmanaged destinations are never adopted, and removal refuses drifted settings.
- **Repeatability on unchanged state:** current states produce `noop`, and remove followed by reinstall works for defaults. The existing tests cover theme remove followed by reinstall.
- **Dependency order:** the failed Stow-prerequisite run above stopped all later mutations as designed.

Main is the sole integration authority. I proposed these fixes but did not implement any.
