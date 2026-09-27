# 🪜 Phase

One step of a workflow, **as code**. It owns its internal sequencing and state writes and invokes the required independent gates; the agents it invokes own judgment, and each gate owns its transition decision. A phase that only forwards a prompt is a command with extra steps.

## Must handle

**A bail condition, distinct from its preconditions.** Preconditions ask whether the phase *can* run -- state loads, workspace resolves, environment answers. A bail condition asks whether it *should*: whether the work handed to it is the kind of work it is for. Misclassification upstream is inevitable, and a phase that recognises "this is not mine" and stops is safe where one that proceeds anyway is not. It needs no new vocabulary -- that is `blocked`, with `return_to` naming the step that classified wrongly.


1. **Identity.** A phase that is the standalone entry to an uncomposed run mints the run identifier. A phase invoked by a composition or following another phase **requires** the composition's identifier and refuses to run without it; it never replaces that identity. Say which mode the entry point supports, with the reason.
2. **Preconditions.** Load state, verify the workspace, confirm the environment. Exit with a remediation message naming what to run, not just what failed.
3. **Invocation, with its kind declared.** Build a typed request; never assemble a raw prompt string inline. Say at the call site which of the three kinds the step is -- `deterministic`, `agentic` or `deferral` -- because each carries different obligations. A `deferral` carries one the other two do not: the controller yields rather than executing or calling, so the phase declares **the continuation** -- what resumes the run, on what evidence, and what it does if control never comes back.
4. **Deadline.** Every invocation carries one. A timeout handler with no timeout set is dead code.
5. **Result handling.** Parse against a schema. **Degrade to a typed failure value rather than raising** -- a phase that throws loses the state write it owed.
6. **State writes after every material fact**, immediately, not at the end.
7. **Report on every path.** A failure exits only *after* recording why, somewhere durable enough to read later. This is what makes an unattended run debuggable.
8. **Verify the agent's claim.** If it says it wrote a file, confirm the file exists where it said.

## The result record

What a phase emits for the next one, beyond the common [record](record.md) fields:

| Field | Holds |
|---|---|
| `phase` | Which phase produced this |
| `status` | `completed` / `failed` / `blocked` / `cancelled` -- execution, **kept separate from any gate outcome** |
| `summary` | Compact, for a human scanning a run |
| `artifacts` | What it produced, by path |
| `changed_files` | What it touched |
| `findings` | Anything the next actor must weigh |
| `attempt_kind` | Which retry budget this consumed |
| `next_action` | Proposed, not authorized |

**Execution status is not acceptance.** A phase that completed says nothing about whether its output was any good -- that is a gate's decision, in a different record.

## Exit codes

`0` success / `1` the work failed / `2` the harness failed. Distinguishing the last two is what tells you whether to retry.

## Rules

- **Phase-local constants stay local** -- agent names, retry ceilings. They are not shared vocabulary.
- **Retries are not free.** An agent run is rarely idempotent; re-running an implementation can apply an edit twice. Retry transport failures, not semantic ones.
- The tail is usually identical across phases. When it is, that tail is a module.
