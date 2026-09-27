# Phase result

What a phase emits for the next one. Written once, at the end, on the success path and the failure path alike.

```json
{
  "schema_version": 1,
  "run_id": "<run identity>",
  "phase": "<phase>",
  "status": "completed | failed | blocked | cancelled",
  "workspace": "<the checkout this phase actually observed>",
  "revision": "<short sha, or null>",
  "started": "<iso8601>",
  "ended": "<iso8601>",
  "duration_ms": 0,
  "summary": "<compact, for a human scanning a run>",
  "artifacts": ["<path>"],
  "findings": ["<anything the next actor must weigh>"],
  "next_action": "<proposed, never authorized>",
  "gates": [{ "gate_id": "G1", "decision": "pass | blocked | human_waived", "reason": "<why>" }]
}
```

## The distinctions that carry the weight

- **`status` is execution, not acceptance.** A phase that completed says nothing about whether its output was any good — that is a gate's decision, in the `gates` array.
- **`workspace` is what was *observed*, not what was configured.** A gate that resolved to the wrong checkout records a perfectly valid revision of the wrong tree, and nothing else in the record distinguishes it from a real pass.
- **`next_action` is proposed.** The caller decides whether to act on it. A phase that authorizes its own next step has removed the gate between proposing and doing.
- **`blocked` means the phase recognised the work was not its kind, or could not establish its subject.** Pair it with a `return_to` naming the step that classified wrongly.
