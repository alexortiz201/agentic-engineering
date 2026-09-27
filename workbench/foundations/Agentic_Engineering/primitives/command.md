# ⌨️ Command

A named, reusable prompt invoked by name and composed by workflows. **Short by default** -- the detail belongs in a spec, not here.

## Must contain

| Section | Required | Holds |
|---|---|---|
| Title | yes | 2-4 words, what it does |
| Purpose line | yes | One or two sentences that **name the other sections**, so the agent knows the shape before reading them |
| Variables | when it takes arguments | One binding per line, by name. Never reference a positional inline |
| Instructions | yes | Imperative steps. **A precondition guard first** -- stop and ask if a required argument is missing |
| Scope fence | when it reads the repository | Which files are relevant, ending by excluding everything else |
| Format block | when it emits a structured artifact | The output template or schema, given literally with placeholders |
| **Report** | **yes, always last** | **The output contract** |

## The report is the contract

Exactly two shapes, and choosing a third means the caller cannot parse it:

- **One scalar, nothing else** -- a path, an identifier, a name.
- **Strict structured data** -- stated as such, because it will be parsed immediately.

State the contract **twice**: once in the instructions, once in the report. Then **write the artifact to a derivable location**, so a caller that fails to parse can still find it.

**This is what makes a [`composition`](composition.md) possible at all.** The report is the command-to-phase channel: the invoking phase validates it and persists the material result in run state/history. A later phase receives the run identifier and reloads that validated state; it does not inherit the raw report as a second handoff channel. A command with a vague report is not merely untidy; it is uncomposable, because its phase cannot persist a trustworthy result for whatever follows.

## Rules

- **One responsibility.** If it does two things, it is two commands.
- **Length is bimodal and that is correct.** A handoff command is a dozen lines. A long one is long only because it inlines a format -- the instruction body stays short either way.
- **Set the reasoning budget explicitly** when the task needs it.
- Compose by reference: a command may instruct that another be read and executed.

## Common failure

The caller parses prose with a regex, the regex is patched, then patched again. That is a missing output channel, not a parsing problem -- declare a structured result or a known artifact path.
