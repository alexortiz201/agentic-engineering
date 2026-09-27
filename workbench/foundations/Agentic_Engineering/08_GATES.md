# 🛡️ Gates

A gate is the independent check that decides whether a transition may happen. This file holds what is shared across every gate in every workflow: the ID namespace that makes decisions comparable, the record vocabularies a gate reads, what it must validate in code, and the rule that a gate may not pass without having observed its subject. Where gates are designed into a workflow is step 6 of the authoring process in [composition](06_ADW_COMPOSITION.md); what a single gate record must contain is [`primitives/gate.md`](primitives/gate.md).

## The record vocabularies a gate reads

Phase and gate records carry four status-like vocabularies, deliberately disjoint:

| Axis | Values |
|---|---|
| Task state | The lifecycle enum, with `blocked` / `repairing` as orthogonal flags plus `return_to` |
| Execution status | `completed`, `failed`, `blocked`, `cancelled` |
| Check result | The check-status enum, plus a separate `applicable` (`true` / `false`) with reason, and a `source` provenance |
| Gate decision | `pass`, `blocked`, `human_waived` |

`blocked` appears on three of these axes and means a different thing on each; never move a `blocked` value between them without re-deciding it. There is no `skipped` check result: an authorized exclusion is `applicable: false`, and a check prevented from running is `not_run`. An agent completion is not a passing check, human acceptance, or shipping permission.

## Gate ID namespace

`gate_id` draws from `G0`-`G7` by default, so gate records compare across projects. A project may extend the namespace; it may not renumber it. **The IDs and their names are policy** -- a locally-improved name is how two gate records stop comparing, which is the whole point of a shared namespace.

| ID | Gate | Blocks |
|---|---|---|
| `G0` | Scope and authority -- bounded outcome, criteria, scope, engagement mode, operating level, approvals present | Starting work on an unbounded or unauthorized task |
| `G1` | Research and readiness -- interfaces, data flows, dependencies, baseline failures and required inputs identified; **a bug reproduced, or the blocker stated with what supports the hypothesis**; every acceptance criterion mapped to a change and a named check | Building against an unmapped criterion, or against a defect nobody has reproduced |
| `G2` | Invocation and handoff -- Core Four, cwd, allowed mutations and output contract fixed before the call; on return, identity, workspace and artifact containment validated | Consuming a result from an invocation that was not the one issued |
| `G3` | Build and scope integrity -- diff bounded to approved scope; unrelated work preserved | Advancing on an out-of-scope or unreviewable diff |
| `G4` | Closed-loop validation -- expected check set compared to actual; partial verification reported truthfully | Claiming coverage that was not executed |
| `G5` | Spec review and revision -- every finding carries a `disposition`; approval may not contradict an unresolved `blocker` | Readiness with an open blocker |
| `G6` | Documentation and future context -- documentation invalidated by the change is updated or explicitly found to need no change | Handing off an interface whose documentation describes behavior that no longer exists |
| `G7` | Acceptance and authorized handoff -- acceptance recorded, and any external effect separately authorized | Push, merge, publish, release, or deploy on acceptance alone |

`G2` and `G6` are not ADW-only. A supervised session delegating to a subagent runs `G2` by hand; a supervised session that changed an interface runs `G6` in the `documenting` state. A gate with no phase to run in is a gate that does not exist.

## When a gate is authored, and by whom

Keeping a gate in the controller and outside builder control protects it from being *edited*. It does nothing about a gate that was written to fit work already done, because that gate was never independent to begin with. **Custody is not independence.** A check authored by whoever produced the thing it checks is a self-graded exam with a lock on the answer sheet.

So the gate is authored **from the task statement, before the work exists, by an actor that is not the one doing the work.** That inverts what the builder is doing: rather than producing a result and having a check written around it, it is making an existing check pass. The criterion gets fixed while it can still be argued on its merits, instead of against a result someone is now attached to.

**Then run it, before the work starts, and require it to fail.** A gate that passes against a workspace where the work has not happened is not checking the thing it names, and executing it early is the cheapest possible way to find that out. This is the counterfactual from [`Software_Engineering/02_TESTING_AND_EVIDENCE.md`](../Software_Engineering/02_TESTING_AND_EVIDENCE.md) -- *if this were not done, would the check report differently?* -- **executed rather than reasoned about**, which is exactly the distance between `inspected` and `executed` on the evidence hierarchy. The reasoned version is an opinion about a check; the executed version is an observation of one.

Authoring in advance is also the only moment when **writing each failure for its consumer is free.** The author has the task statement in front of them and no result to be distracted by, so a failure can say what is missing and what would satisfy it rather than reporting that an assertion did not hold. Downstream that is the difference between a red that routes and a red that has to be investigated before anyone knows who owns it.

**The limit is real and it bounds the practice.** This works where success has a mechanical consequence -- a command exits zero, an artifact appears, a schema validates, a count moves. Where it does not, a gate authored in advance will be either so loose it cannot fail or so tight it fails on acceptable work. Say so in that case and reach for [measurement](12_EVALUATIONS.md) instead: an unfalsifiable gate written to satisfy the procedure is worse than admitting the procedure does not apply here.

## A run may hold several workspaces

Each gate records **which workspace it observed**. In a single-workspace run that field is bookkeeping. In a run spanning several components it is the thing that separates a real pass from a confident pass over the wrong tree, and the wrong tree is no longer an unlikely accident -- it is one resolution mistake away, every time.

## An exit code is the typed failure value a gate routes on

A deterministic step returns an exit code, and the usual allocation -- `0` for success and `1` for everything else -- throws away the only structured thing the step produced. The gate above it then has two bad options: treat every failure identically, or recover the distinction by matching strings in the step's output, which couples the gate to wording nobody versioned.

**Allocate a distinct non-zero code per failure class, and the exit code becomes a typed return.** The gate reads *which* thing went wrong and routes accordingly, with no parsing and nothing to drift. This is the same discipline the package applies to records, arriving at the one boundary where a record is not available: a process can only answer in an integer, so the integer carries the vocabulary.

What makes an allocation good is that its classes correspond to **different routes**, not to different messages:

- A failure the run can retry, versus one that will recur identically until something outside the run changes.
- A failure of the subject, versus a failure of the instrument -- a suite that ran and found a real defect is a different event from a suite that could not run, and a gate that conflates them reports a defect that does not exist.
- A precondition that was not met, versus a check that was performed and failed. The first routes back to setup; the second routes to repair. `return_to` names the state responsible for the failure, and the exit code is frequently the only evidence of which state that was.
- Usage error, which is a defect in the *workflow* rather than in the subject, and should never be reported as a failing check.

**Allocate the codes once, across the whole tool set, and write the allocation down where the tools are indexed.** Per-tool numbering means `3` means something different in every step, which is the string-matching problem with extra steps. A shared table is what makes several tools composable into one workflow rather than several tools that happen to sit in one directory.

**An allocation a tool has never returned is a comment, not a contract.** This is the same status-claim rule the package applies everywhere else, and it bites hardest here because the declaration is so cheap to write and so easy to read as a fact. A gate branching on code `6` from a script that has never once exited `6` is an `agent_checked` gate wearing a `code_enforced` costume: the branch is real code, and nothing has ever established that the condition it tests can occur. Record which codes have actually been observed, separately from which are declared, and treat the first real run as the test -- **a script that has not been run is a hypothesis**, however carefully its header documents it.

The corollary for the census: a tool with a real exit-code allocation is the cheapest available upgrade from `agent_checked` to `code_enforced`, because the mechanism is already there and only the gate's willingness to refuse is missing.

## A deferral is gated on its side effect, never on its report

**A deferral's return value is not a contract.** When a phase invokes a workflow it does not own, the thing that comes back is whatever that workflow chose to say -- frequently model-generated prose, shaped by nothing the caller declared. For a prompt you authored the fix is an output contract; for a deferral there is no contract to declare, because you do not own the callee.

So the gate binds to **the side effect the deferral was invoked to produce** -- the artifact on disk, the record in the system, the state that changed -- read back independently, and never to the callee's own account of having produced it. **A deferral with no independent read of its side effect has no gate at all**, however confident the text it returned.

This is the same rule as refusing to parse a path out of arbitrary prose, applied one level up: there, the defect is trusting the shape of the output; here, it is trusting that the output describes reality.

## Validate handoffs in code

- Match schema version, task/run/phase/attempt, configured model/tools/cwd and expected artifact kinds.
- Resolve paths against authorized roots; reject traversal, symlink escape, wrong ownership, missing/empty content and stale artifacts. Never select the first matching plan from another run.
- Compare all expected checks against actual records. Reject missing, duplicate, unknown, malformed, empty or contradictory results; zero failures alone is not success.
- Retain timestamp, argv/cwd, timeout, exit, scope, measured duration or null, revision, diff base, changed-file count, diff identity and non-sensitive evidence references.
- **A gate whose subject is a change MUST record its observed workspace, `diff_base` and `changed_file_count`, and MUST decide `blocked` when `changed_file_count == 0`. It may never decide `pass` on an empty diff.** The gate reports what it observed rather than what it expected; a count of zero is evidence the gate never found its subject, not an observation that the subject is clean.
- Verify review criteria coverage and `disposition` consistency, not merely `success: true`. A record whose `severity` and `disposition` disagree with the table in [`Software_Engineering/03_CODE_REVIEW.md`](../Software_Engineering/03_CODE_REVIEW.md) is malformed.
- If a human waives a failure, independently record approver, approval reference/time, exact failure and evidence, allowed scope, consequences and validity limit. Only that human decision can unblock it; original failed results stay failed. Destructive next actions need their own explicit approval.

## A gate must bind to a non-empty diff, and prove which one it read

`revision` and `diff_identity` are necessary and **not sufficient**. A gate that resolved its working directory to the wrong checkout records a correct-looking revision *of the wrong tree*, and an empty diff has a perfectly valid identity. Both fields can be fully populated by a gate that never saw the change it certified. On a real run two gates delegated to subagents did exactly this -- resolved to the main checkout on the default branch instead of the feature worktree, inspected an empty diff, and returned a confident `pass` -- and nothing in either record distinguished them from a genuine pass.

The rule is therefore about what emptiness means. Treat `changed_file_count == 0` as evidence the gate did not find its subject, never as the observation that the subject contains nothing. Required behavior:

- Resolve and record the workspace actually inspected, not the workspace configured.
- Record `diff_base` and the resulting `changed_file_count` on every gate result whose subject is a change.
- Decide `blocked` on zero, and report observed workspace, base and count in the block so the mismatch is diagnosable without re-running.
- A gate that cannot determine its own workspace is `blocked`, not `not_run`, and not `error`.

**Why this outranks every other rule here.** The [evidence hierarchy](01_PRINCIPLES.md) ranks *enforced gate with retained output* first. That ranking is sound only if a gate cannot pass without having observed its subject. Without this rule the strongest evidence class carries a silent null case -- a confident pass produced by observing nothing -- which makes it the **most** dangerous class rather than the safest, precisely because everything downstream trusts it most and stops looking. Every weaker tier is checked by something; tier 1 is what does the checking. Do not promote the evidence hierarchy anywhere, or rely on it to license reduced scrutiny, until this rule is enforced in code.

The mirror-image failure is the same root error and equally real: a readiness check that read the full history of check runs rather than the latest per context counted five superseded failures as current and returned a confident `fail` on a passing subject. Trusting a payload's shape without checking what it represents fails in both directions, so the gate-side test is "did I observe my subject", not "did I get a plausible payload".

The injections that prove these rules are enforced rather than merely written down are in [control-plane tests](09_CONTROL_PLANE_TESTS.md).
