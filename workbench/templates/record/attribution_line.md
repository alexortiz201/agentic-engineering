# Attribution line

One line per judgement of what some work was **worth**. The counterpart to [`history_entry.md`](history_entry.md), which records what it **cost**.

Obeys [`primitives/record.md`](../../foundations/Agentic_Engineering/primitives/record.md), and is described at [`primitives/run_history.md`](../../foundations/Agentic_Engineering/primitives/run_history.md).

```json
{
  "schema_version": 1,
  "subject": "<workflow, or a named batch of work>",
  "workflow_version": 1,
  "window": { "from": "<iso8601>", "to": "<iso8601>" },
  "runs": 0,
  "basis": "<what the judgement rests on>",
  "judgement": "<the finding, in the adopter's own units>",
  "attributed_by": "<who made it>",
  "at": "<iso8601>",
  "supersedes": null
}
```

## Why each field is not optional

- **`basis`** — the field that decides whether this record is worth keeping. **A judgement with no stated basis is a claim wearing a measurement**, and it ends the conversation it was supposed to start. If the basis is "an impression after watching it for a week", write that; an honest weak basis is usable and a missing one is not.
- **`attributed_by`** — this record is **authored**, unlike everything else in the run history, which is derived. That inversion is deliberate: value is a claim by somebody who can make it, and it is only honest if it is attributable to them.
- **`window` and `runs`** — value belongs to a workflow over a period, not to one execution. These say what was actually in view, which is what lets a later reader tell a judgement drawn from four runs from one drawn from four hundred.
- **`supersedes`** — a revised judgement is a **new entry naming the old one**, never an edit. The sequence of judgements over time is itself the most interesting thing here, and rewriting destroys it.

## Rules

- **Never written by a run.** A run knows its cost and cannot know its worth. A value field the run fills in is a number nobody had at write time.
- **Coarser than a run, deliberately.** Forcing one of these per execution produces a column of guesses.
- **Absence is a finding.** A workflow running unattended with no attribution record has not met the condition for running unattended — it has only not been asked.
