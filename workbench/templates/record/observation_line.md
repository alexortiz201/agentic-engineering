# Observation line

One line per thing observed, appended as it happens. Sibling of [`action_line.md`](action_line.md) and deliberately not the same record: an action line is what **this run did**, and an observation line is what **someone else did** -- including steps the recorder did not perform and cannot repeat.

Obeys [`primitives/observation.md`](../../foundations/Agentic_Engineering/primitives/observation.md).

## Open, once

```json
{ "schema_version": 1, "obs_id": "<subject>_<discriminator>", "event": "open", "at": "<iso8601>", "subject": "<what is being worked on>", "model": "<model>", "harness": "<harness>", "workspace": "<observed path>" }
```

## Entries

```json
{ "schema_version": 1, "obs_id": "<identity>", "seq": 0, "at": "<iso8601>", "kind": "<kind>", "effect": "read|write", "step": "<label, or null>", "in_band": true, "what": "<what was done>", "...": "kind-specific fields" }
```

| `kind` | Carry, beyond `what` |
|---|---|
| `command` | `cmd`, `cwd`, `exit` — reproducible verbatim |
| `ui` | `surface`, and the intent in `what`, because this is often an API nobody has written |
| `handoff` | `to`, and `reconciled_by` — the `seq` of the entry where the result landed, or null while outstanding |
| `prompt` | `asked`, and **`outcome`** — the ask does not determine the result, so the result is the fact |
| `decision` | `among` and `chose`. No external effect; this is where the agentic half lives |
| `gap` | `why`, plus **`tool`** (what was unable to look) and **`disposition`** — `deferred` (a later phase can see it), `unobservable` (nothing available can), or `not_permitted` (the instrument declined). The last is the dangerous one: a refused value reads exactly like an absent one |
| `meta_change` | what changed, from and to. Model and harness changes are events |

## Close, once

```json
{ "schema_version": 1, "obs_id": "<identity>", "event": "close", "at": "<iso8601>", "why": "completed|abandoned|interrupted", "entries": 0 }
```

## Why each field is not optional

- **`obs_id` on every line**, formed as `<subject>_<discriminator>` — the subject half makes a recording findable by the work it belongs to and removable when that work ends; the discriminator half keeps two recorders on the same subject out of each other's file. Without it, cleanup means reading.
- **`model` and `harness`** — behaviour credited to a process that was really a property of the model or the harness is the most durable kind of wrong conclusion, because the change that would disprove it never gets made.
- **`in_band`** — work is interrupted, and the interruptions are part of it. `false` marks a digression so it can be excluded from the flow **without being deleted from the record**.
- **`step` is nullable, and assigned later** — it is the recorder's label from a second pass, not something the subject was asked for. Asking makes the subject work in steps and the recording measures itself.
- **`effect`** — a step that only reads may be repeated freely by a workflow, which is a different thing to know from how it was performed.
- **`outcome` on `prompt`** — without it the record holds the request and not the result, which is the half that is actually a fact.
- **`why` on close** — an observation with no terminator cannot be told from one still running.
- **`tool` and `disposition` on a gap** — without them a gap says only that something was missed. With them it says whether the next phase should look, whether an instrument needs building, or whether the silence was a refusal rather than an answer.

## Rules

- **Append only**, compact JSONL, one object per line. The reader is code.
- **`seq` is scoped to the observation** and stamped on every line; global ordering comes from `at`.
- **No secrets and no payloads.** A prompt's `asked` and `outcome` are summaries, not transcripts.
