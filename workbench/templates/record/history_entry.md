# History entry

One line appended to the run history per run-phase, **including when it ends badly**. A history containing only successes measures nothing, and the failure rate is the number most worth knowing.

```json
{
  "schema_version": 1,
  "run_id": "<run identity>",
  "workflow": "<workflow>",
  "workflow_version": 1,
  "phase": "<phase>",
  "revision": "<short sha, or null>",
  "started": "<iso8601>",
  "ended": "<iso8601>",
  "duration_ms": 0,
  "outcome": "<from the handoff vocabulary>",
  "gates": [{ "gate_id": "G1", "decision": "pass", "reason": "<why>" }],
  "human_interventions": 0,
  "cost_usd": null,
  "run_artifacts": "<path to this run's directory>"
}
```

## Why each field is not optional

- **`workflow_version`** — a history that cannot tell two versions of a workflow apart measures nothing the moment the workflow changes.
- **`human_interventions`** — the number that says whether autonomy is real. A workflow that succeeds unattended and a workflow rescued twice per run look identical without it.
- **`cost_usd`** and **`duration_ms`** — the improvement loop has no input without them, and they are quantities over many runs rather than facts about one.
- **`gates`** — an empty array is a statement (this phase runs no gates), and omitting the field is not.

## Rules

- **Append only. Never rewrite an entry.** A corrected outcome is a **new entry referencing the old one**; a run that can edit its own past result can manufacture a pass across time.
- **Derived, never authored.** A run writes its own entry as it ends. An entry written by hand is a claim about a run rather than a record of one.
- **A format that must be rewritten in order to append is not append-only in practice.**
