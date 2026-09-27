# 🛟 Recovery and Handoff

## Record failures

Preserve the state, failed step, command/tool, exit status, concise output, changed artifacts, cause hypothesis, retry safety, next action, and approval needed. Record `return_to` -- the state responsible for the failure -- and the retry kind the next attempt will consume. Never overwrite the only failure evidence.

## Retry deliberately

Retry only after something changes: input, code, configuration, dependency, scope, justified timeout, or a bounded transient backoff.

Retries are counted **per kind**, not as one scalar. Persist before implementation:

```json
"attempts": {
  "invocation_retry": 0,
  "output_correction": 0,
  "gate_repair": 0,
  "test_fix": 0,
  "review_revision": 0,
  "restart": 0
},
"total_budget": 2
```

Each kind carries its own cap; `total_budget` caps their sum (default: two repair attempts, a supervised starting point). A single counter cannot express this: a run that burns two output corrections and two test fixes is at attempt 4 of 2, or 2 of 2 twice, depending on who is counting -- and both readings are defensible, which is the defect.

Increment the counter for the kind actually performed, before the retry. Exhaustion of any kind's cap, exhaustion of `total_budget`, or a repeated identical failure sets `blocked` with `return_to`. Budget changes require human approval and are recorded as such.

**Caps are per task, not per session.** Do not evade a cap by starting a new session, a new subagent, a fresh worktree, or a new run ID for the same task. Attempt accounting carries across the task's whole life; a retry delegated to a subagent increments the same counter as one performed inline. Resetting the count by changing who is counting is manufacturing budget, in the same way that re-running a suite until it passes is manufacturing a pass.

## Repairing

1. **Preserve prior evidence**, then inspect current files and possible partial effects before retrying. Do not assume a failed attempt did nothing.
2. **Reproduce the failure**, or mark it unverified and name the evidence that would settle it.
3. **Change the hypothesis before the next attempt.** Re-running the same attempt against the same hypothesis is not a repair, it is a retry wearing one's clothes.
4. **Make the smallest in-scope fix.** A missing requirement returns to planning -- it is not a defect.
5. **Re-run the reproducer**, then hand back the changed paths and the list of gates that must re-evaluate. **Narrow success is not sufficient**; a fix invalidates evidence beyond the one test.
6. **Record each attempt without overwriting prior failures.**

**Stop** on: the same failure twice, an exhausted budget, newly discovered risk, or side effects you cannot characterize. Each of those is a decision for a person, not a reason to try again.

## Stopping obliges a clean environment

A run that stops owes more than a report. **Whatever it touched is either finished or reverted** -- no half-applied changes, no orphaned processes, no instrumentation left in the tree, no resource held open because the path that would have closed it was the path not taken.

This is separate from resumability and is frequently confused with it. A resumable run can be picked up; a clean stop means the next actor is not picking up someone else's debris first, and it means the thing that stopped did not quietly become the reason the next attempt fails.

**The exit is not a failure mode to minimize.** It is the property that makes running the system unattended a reasonable thing to do, because it bounds what an abandoned run can leave behind.

### Reverse what you changed in something you did not create

Teardown releases what the run **started**, and that rule is deliberately narrow: a run that stops a shared service because it happened to be listening has broken someone else's work. But the narrowness leaves a real case uncovered, because **a run routinely changes state it did not create** -- consuming a shared fixture, flipping a flag, leaving a record in a state a later run will read as the starting one. Nothing about that is released by not releasing it.

So the obligation is a reversal rather than a teardown, and it has three parts:

- **Record each mutation at the moment it is made.** A reversal can only cover what was written down, and the end of a run is precisely when the earliest changes are least recoverable.
- **Re-read the state afterwards and confirm the original values are back.** Issuing the reversing action is not evidence that it took effect, which is the same distinction drawn everywhere else between an action and its result.
- **Where the reversal cannot be verified, say so.** A shared fixture left in an unknown state is a finding the next run needs, and silence about it is what turns one run's leftovers into another run's irreproducible defect.

The scarcer the shared state, the more this matters: where only one record in an environment exercises a boundary, every run is using the same one, and the first run that consumes it without restoring it removes the ability to test that boundary at all.

## Make runs resumable

Another agent must be able to identify:

- outcome and approved scope;
- engagement mode, and current operating level with any `descent_reason` and unmet `return_condition`;
- current state and last successful step, plus whether `blocked` or `repairing` is set and the `return_to` state;
- branch/worktree and Git status;
- changed files and completed checks, with each check's result, applicability and `source`;
- attempt counters per retry kind and remaining `total_budget`;
- unresolved failures/findings with their dispositions;
- next action and required authority.

Keep a per-run copy of the run-state record and the handoff record. Before resuming, recheck Git status and current files against recorded evidence, confirm approvals still cover the next action, and inspect possible partial side effects before retrying. Do not assume a timed-out action did nothing.

## Rollback

A run states its rollback path as part of its handoff, and the path itself -- evidenced reversibility, the ordered ladder, and the authority each shipping effect requires -- is in [`DevOps/03_RELEASE_AND_ROLLBACK.md`](../DevOps/03_RELEASE_AND_ROLLBACK.md).

## Permission and isolation failures

When an action is denied, or a boundary turns out not to hold: **stop the action, preserve the evidence, and escalate.** Do not widen credentials, disable the safeguard, or retry around it.

This is the moment the wrong instinct is strongest, because the obstacle looks like a configuration problem and the fix looks one flag away. A denied action is information about the boundary. Removing the boundary destroys the information and the protection together.

## Documenting

**Document actual changed behaviour. The plan is intent, never proof of delivery.**

Cover what changed, how to use it, prerequisites and configuration *names*, limitations, how it was verified, and how to roll it back. Never include secret values, raw transcripts or unapproved payloads.

**Label an illustration as an illustration.** A diagram of how something is supposed to work and a capture of it actually working are different claims. **Mark an example that was not run as unverified.**

Add the discovery links that cause this to be found later. A trivial change may use the handoff itself rather than a separate document.

## Correcting a claim that has already travelled

A wrong claim is rarely still in one place by the time it is found. It was read, summarised into a handoff, written into a document, quoted in a work item, and acted on -- and every one of those is now a copy that will outlive the correction unless it is found deliberately.

**Enumerate every surface the claim reached before correcting any of them.** Correcting as you go feels like progress and stops when it feels done, which is reliably before the list is finished: the surfaces are fixed in the order they come to mind, that order is the order of memorability rather than of reach, and the last one is never missed noisily.

The surfaces worth walking, roughly in the order a claim travels:

- The record that first asserted it, and its provenance.
- Every downstream phase record that read it, including ones that never quote it.
- Documents changed on the strength of it.
- The work item, the review, and anything said to a person.
- The run history entry, corrected as a **new entry referencing the old one** -- never by rewriting, for the reasons in [run history](primitives/run_history.md).

**The blast radius is what read the claim, not what mentions it.** This is the part that searching cannot find: a phase that consumed a wrong claim, reasoned from it and wrote something new never contains the original words, so it survives every grep for the text and is exactly where the error is now load-bearing. Trace consumption, not phrasing.

**A half-propagated correction is worse than none.** Before, one source was wrong. After, two sources disagree and both look authoritative, and the reader has no way to tell which is the correction. If the full list cannot be walked now, say which surfaces are known-stale and where the correct version lives, rather than fixing the reachable half silently.

## Handoff

Report:

1. requested and delivered outcome, and the handoff outcome value;
2. run state and branch/worktree, plus `blocked` / `repairing` and `return_to` if set;
3. files and behavioral impact;
4. verification commands and results, each with its `source`;
5. checks recorded `not_run`, `error`, or `applicable: false`, and any gate decided `blocked` or `human_waived`;
6. review findings with `disposition`, `severity`, and any `risk_accepted`;
7. plan deviations;
8. meaningful operating-level movement: each descent with its reason, each return with the check that satisfied its `return_condition`;
9. residual risk and `UNVERIFIED` claims;
10. rollback instructions;
11. decision required from the human.

The handoff outcome is one of `accepted`, `acceptance_pending`, `partially_verified`, `blocked`, `failed`. `partially_verified` is the honest result for a run with real but incomplete verification; without it, such a run must claim readiness it does not have or a block it is not under.

## The handoff record

Carries the common [record](primitives/record.md) fields plus:

| Field | Holds |
|---|---|
| `outcome` | One of the five handoff values |
| `delivered` / `requested` | What was asked for, and what actually arrived |
| `checks` | Each with command, working directory, result, provenance and evidence reference |
| `findings` | With disposition, severity, and whether risk was accepted |
| `not_run` / `inapplicable` | Explicitly, with reasons -- absence is not a pass |
| `waivers` | Who, what, scope, expiry |
| `residual_risk` | What is still true and unresolved |
| `rollback` | How to undo this |
| `level_movement` | Operating level held, and the condition for returning |
| `decision_needed` | The one thing a person must now decide |

## Escalation

> **Blocked on:** specific condition **Evidence:** concise facts **Options:** choices and consequences **Recommendation:** choice and rationale **Approval needed:** exact action and scope **Safe work remaining:** work that can proceed without this decision, and work that cannot

All six fields are required. **Safe work remaining** is what keeps a blocked run productive instead of idle, and it is also a check on the block itself: a block that stops everything is either correctly total or scoped too widely, and stating the remaining work is what distinguishes the two. Name the work, not a reassurance -- "documentation for the delivered interface; no further edits to the module under review" is the shape. If nothing is safe to proceed with, say so explicitly and why; an empty field reads as an unanswered question.
