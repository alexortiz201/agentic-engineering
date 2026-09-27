# 🧾 Record

Any durable artifact a run writes for something else to read -- state, a phase result, a gate decision, a handoff. The rules here apply to all of them; each primitive states its own fields.

## Every record carries

| Field | Why |
|---|---|
| `schema_version` | So a reader can tell whether it understands this record |
| Run identity | The identifier that ties this to everything else the run touched |
| What produced it | The phase or actor, so a surprising value has an address |
| When | A timestamp, so staleness is decidable rather than assumed |

Everything else is the record's own business.

## Versioning

**Start at `1` and bump on any change a reader could get wrong.** Adding an optional field is not one; removing a field, renaming one, changing a type, or narrowing an allowed set all are.

**A consumer validates the version before the content** and **refuses a version it does not know** rather than reading what it recognizes and ignoring the rest. Partial understanding of a record is how a changed meaning passes silently -- the field is still there, still parses, and no longer means what the reader thinks.

Keep a changelog of what each version changed. A version number nobody can decode is a number, not a version.

## Rules

- **Validate on write and on read.** A malformed record discovered at read time has already cost the run that produced it.
- **Reject unknown fields loudly.** Silently dropping a write and reporting success is the worst available behaviour.
- **Write-then-rename**, so a reader never sees half a record.
- **Closed field sets.** A record that accepts anything is a log.
- **No secrets**, and no raw payloads -- references to evidence, not the evidence itself.
- **A terminal record claiming success carries the artifact that proves it**, and is malformed without it -- a commit identifier, a changed-file count, an output path. Enforce it in the schema rather than in the phase that writes it: made a validation rule, "succeeded but produced nothing" becomes unrepresentable, which is strictly cheaper than detecting it later in a gate.
