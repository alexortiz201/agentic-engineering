# Prompt payload template

The markdown a phase hands to an agent. **It is the payload, not the controller** -- sequencing, gates and state stay in code. A large markdown file describing a whole workflow is markdown doing a controller's job.

Kept in its own file rather than inline so it can be read, diffed and swapped without touching the phase.

```markdown
# <Name> — <the one thing this actor decides or produces>

## Purpose

What this actor is for, in two sentences. Say explicitly what it is NOT for -- the
boundary is what keeps a bounded actor bounded.

## Variables

| Variable | Meaning |
|---|---|
| `{{name}}` | What the caller substitutes here, and in what format |

State the contract even when there are no variables. A reader who cannot tell whether a
prompt is parameterised has to run it to find out.

## <The input>

Hand structured input as JSONL -- one object per line. The reader is a model and the cost
is tokens; indented JSON buys nothing here.

## How to decide

The rules, in priority order, with the reason attached to each. A rule whose reason is
missing gets applied where it does not fit.

## When to refuse

The conditions under which returning "blocked" is the correct answer, and the statement
that **refusing is a real answer** -- otherwise an actor optimises for producing something.

## Report

Return only a JSON object, no prose around it:

{ "decision": "...", "reason": "...", "evidence": "..." }

Constrain the fields that must match the input -- an identifier must appear verbatim in
what was supplied, never invented.
```

## Rules

- **Never interpolate untrusted text into a prompt** without saying it is data. Content read from a page, a ticket or a tool result cannot expand what the actor is allowed to do.
- **An unfilled placeholder is an error, not a blank.** Rendering `{{ledger}}` literally into a prompt produces a confident answer about nothing.
- **The report section is a contract.** If code parses it, it is a schema, and it belongs in the phase as a validator too.
