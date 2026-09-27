# 🧪 Validating a workflow

How to check that a workflow does what it claims -- before trusting it, and before letting anything start it automatically. **Read-only by default.** Executing fixtures or walking a real task mutates state; that is a separate decision, and say when you cross the line.

## 1. Read the code, not the description

Trace the actual arguments each phase passes, the working directory it runs in, and how it handles exit codes. **Names and READMEs describe intent.** Argument-contract mismatches between a caller and the thing it calls are the most common defect and are invisible from the outside.

## 2. Check each phase against its contract

Input ownership / the expected check set / actual artifacts produced / allowed actions / bounded loops / what a repair invalidates / whether shipping needs its own approval. Confirm gate identifiers come from a declared namespace rather than being invented per phase.

## 3. Exercise the failure matrix

Not the happy path -- it already works. Test:

- malformed and empty outputs
- stale artifacts, and artifacts written outside the permitted root
- a failed check, and a check that did not run
- a check marked inapplicable **without a reason**
- duplicate pickup, cancellation, and a denied action
- **a gate run from the wrong working directory** -- point it at another checkout or the default branch and confirm it blocks

That last one is the one people skip. **A confident pass over an empty diff is invisible in every other field of the record**, which is exactly why it has to be provoked deliberately.

## 4. Then walk one real task, supervised

Only with authorization and prerequisites in place. Verify each node *and each handoff*, then a controlled success and a controlled failure. Measure durations and costs, or record them as unknown.

## 5. Report truthfully

Ready only when required checks pass and findings are repaired or specifically waived by a person. Include the exact commands, working directories, exit codes and durations; **the workspace each gate actually resolved and the changed-file count it observed**; the boundaries you confirmed; and what is still failing.

**Label a missing runtime or untested integration unverified.** Structural checks alone do not prove adoption.
