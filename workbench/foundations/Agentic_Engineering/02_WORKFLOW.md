# 🔄 Workflow

## Choose the smallest safe flow

| Task | Flow |
|---|---|
| Read-only question | discover -> answer with evidence |
| Tiny low-risk edit | discover -> implement -> verify -> review -> handoff |
| Feature, bug, or chore | intake -> discover -> plan -> approve -> implement -> verify -> review -> repair -> document -> handoff |
| Independent parallel work | decompose -> isolate workers -> verify each -> integrate -> full verify |
| External/high-risk action | plan -> explicit approval -> one bounded action -> verify -> pause |
| Create/compose an ADW | discover primitives -> contract phases/gates -> approve -> build vertical slice -> test failures -> supervised walkthrough -> handoff |

## Lifecycle

Each step names the task state it holds and the gate that must pass before the next step consumes its output. Gate IDs use the `G0`-`G7` namespace defined in [gates](08_GATES.md).

1. **Intake** (`requested`, gate `G0`) -- assign a run ID; capture outcome, scope, constraints, risks, and acceptance criteria. Declare the engagement mode (`delivery` / `coaching` / `audit` / `design`) and the entry operating level `L1`-`L5`. Clarify ambiguity.
2. **Discovery** (`scoped`, gate `G0`) -- read instructions/manifests; inspect Git state, relevant code/tests/scripts/CI, dependencies, data, and services. Separate tooling that is *configured* from tooling that is *active*, and mark unknowns `UNVERIFIED`. Descend a level when evidence is weak and record `descent_reason`.
3. **Planning** (`ready`, gate `G1`) -- map every criterion to changes and checks; identify files, interfaces, risks, rollback, and optional follow-up. Obtain plan approval for non-trivial work; tiny low-risk edits require explicit task scope only.
4. **Implementation** (`building`, gate `G3`) -- use a branch/worktree for non-trivial or parallel work; make the smallest coherent change; add tests; record deviations; preserve unrelated work.
5. **Verification** (`validating`, gate `G4`) -- run focused then broader checks; capture command, directory, result, exit code, scope, duration, provenance, and caveats. Required failures set `repairing` or `blocked` with `return_to` unless explicitly waived by a human; failed results remain failed.
6. **Review** (`reviewing`, gate `G5`) -- independently inspect correctness, security, regressions, maintainability, and scope. Classify every finding with a `disposition` and a `severity`; an approval that lists an unresolved `blocker` disposition is rejected.
7. **Repair** (orthogonal to state) -- use concrete failures/findings, change the hypothesis before retrying, and re-run affected checks. Re-enter the state named in `return_to`. Stop when the retry budget for that retry kind is exhausted.
8. **Documentation** (`documenting`, gate `G6`) -- update the documentation the change invalidates: interfaces, run instructions, configuration, and any recipe or README that now describes behavior that no longer exists. Record which documents were inspected and which were changed. "No documentation impact" is a finding that must be stated, not an omission.
9. **Handoff** (`acceptance_pending` -> `accepted` -> `authorized_handoff`, gate `G7`) -- report changes, evidence, gaps, risks, and recovery. A human accepts or requests repair. Acceptance does not authorize shipping; that is a separate human transition to `authorized_handoff`.

### Invocation and handoff (`G2`) applies to supervised sessions, not only ADWs

Every delegated invocation passes `G2` before its output is used, whether a controller issued it or you did by hand in a supervised session. Before delegating, fix the Core Four, the working directory, the allowed mutations, and the output contract. On return, validate that the result matches the invocation that was issued -- same run/phase/attempt identity, same workspace, artifacts inside the authorized root -- before any downstream step reads it. A subagent's report is an `asserted` claim until `G2` checks it against what it was actually asked to do; a result whose workspace does not match the one delegated is `blocked`, not a finding to interpret.

## State

Task state is exactly one value from the lifecycle enum in the canonical vocabulary, and it tracks this agent's task. Generated ADWs define separate phase execution records using [composition contracts](06_ADW_COMPOSITION.md) and gate records using [gates](08_GATES.md); do not overload task state with check outcomes.

`blocked` and `repairing` are **orthogonal** to that enum, not members of it. A run is always at one of the ten states; it may additionally be blocked or repairing, and when it is, `return_to` names the state responsible for the failure. Keeping them orthogonal is what makes the return address representable: a run blocked while `validating` on a requirement that was never planned returns to `ready`, and a state machine that overwrites `validating` with `blocked` has already lost the information needed to route it.

Persist at least the following. **The field set is defined by [state](primitives/state.md); this is an example of that shape, not a second definition of it.** The fields below `config` are task-level additions on top of the blueprint's minimum.

```json
{
  "run_id": "task-YYYYMMDD-name",
  "task_ref": "bounded outcome",
  "task_state": "ready",
  "blocked": false,
  "repairing": false,
  "return_to": null,
  "workspace": null,
  "reserved": {},
  "artifacts": {"plan": null, "evidence": [], "handoff": null},
  "phases_run": [],
  "attempts": {
    "invocation_retry": 0,
    "output_correction": 0,
    "gate_repair": 0,
    "test_fix": 0,
    "review_revision": 0,
    "restart": 0
  },
  "total_budget": 2,
  "config": {
    "engagement_mode": "delivery",
    "operating_level": "L3",
    "descent_reason": null,
    "return_condition": null
  },
  "acceptance_criteria": [],
  "scope": {"allowed": [], "excluded": []},
  "authority": {"approved": [], "requires_approval": []},
  "failures": [],
  "next_action": "human approves plan"
}
```

Record operating-level movement as it happens, not at the end: on descent write `descent_reason` (what evidence was too weak) and `return_condition` (the concrete check that would justify returning); on return, record which check satisfied it. A return with no satisfied `return_condition` is a level claim without evidence.

Keep one state record per run, in a location authorized for artifact writes, without overwriting another run's. Update state after each step and before yielding, and retain failure evidence. The durability rules -- validate on write and on read, reject unknown fields loudly, write-then-rename, store it outside the disposable workspace, no secrets -- belong to [state](primitives/state.md) and [record](primitives/record.md) and are not restated here.

Transitions normally run the enum in order. Tiny edits may skip `ready`; read-only answers stop after `scoped`. `accepted -> authorized_handoff` requires a separate explicit human authorization naming the action and scope; a run may legitimately terminate at `accepted`.

**Repair returns to the state responsible for the failure, not to verification.** Set `repairing` or `blocked` alongside the current state, and set `return_to` to the state whose phase produced the defect. The test is: which phase, had it been done correctly, would have prevented this failure?

| Failure | `return_to` | Why not verification |
|---|---|---|
| A requirement was never discovered | `scoped` | The plan is faithful to a scope that was wrong; re-planning the same scope reproduces the gap |
| A discovered criterion was never mapped to a change and a check | `ready` | Repairing forward from `validating` ships an unplanned change; re-planning is the work |
| The change does not implement the approved plan | `building` | The plan is correct; the edit is not |
| The check command, scope, or environment was wrong | `validating` | The change is untested, not wrong |
| Review found a defect in the delivered behavior | `building` | Review classified it; building introduced it |
| Documentation contradicts the shipped interface | `documenting` | Nothing about the code is in question |

Re-entering `return_to` replays every gate downstream of it; a phase reached by repair does not inherit the evidence of the run that reached it the first time. Resume a blocked run only after checking current Git state, evidence, scope, and authority, then recording the chosen next state. `failed` is a check result, not a task state; `blocked` on a check result is a gate decision, not a task state either.

Before `acceptance_pending`, every required failure and every finding with `disposition: blocker` must be repaired or explicitly human-waived. Record who approved, when, the exact failure/finding, evidence reference, scope, and accepted consequences. Destructive next actions require separate explicit authorization describing loss and recovery limits. Human acceptance never changes a failed check into a pass.

## Stop rather than broaden

While building, **stop before changing scope, acceptance criteria, permissions or gate policy.** Request a new decision instead. Each of those belongs to someone else, and a plan that quietly grew is a plan nobody approved.

Committing, pushing, updating a tracker and shipping each need their own authority. Doing the work does not carry permission to publish it.

## Role separation

Planning does not edit target code; authorized task artifacts may be written. Implementation follows the approved plan or explicitly authorized tiny-edit scope. Verification checks observable behavior. Review searches for defects. Repair receives specific findings and the `return_to` state. Documentation reads the final diff and the delivered interface, not the plan. These may be separate agents or deliberately separate passes.

## Parallel work

Parallelize only when tasks have independent criteria, explicit ownership, isolated branches/worktrees, safe shared resources, an integration order, and a combined test plan. Enforce one active writer per workspace, atomic task claims, duplicate protection and live-worker accounting before unattended pickup. A queue shows status; it does not guarantee correctness. Cancellation must account for detached workers; port probes are not reservations.
