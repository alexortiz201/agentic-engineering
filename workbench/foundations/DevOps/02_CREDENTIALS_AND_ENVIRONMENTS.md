# 🔑 Credentials and environments

## A secret that is read is a secret that has travelled

Handling a credential is not the same as needing one. **Inspect names and file existence rather than values**, unless reading the value is both approved and necessary -- the question a run almost always has is whether a credential is configured, and that is answerable without ever opening it.

- **Redact secrets from commands, logs, URLs, screenshots, state and handoffs.** Every one of those is a durable surface that outlives the run and is read by people and systems the run never enumerated. A secret in a URL is a secret in a proxy log.
- **Never persist secrets in source, task artifacts or version control.** History is the worst place to put one, because removing it later requires rewriting the history rather than deleting a line, and every copy taken in the interim is already gone.
- **A commit message, a pull request body and a changelog entry are each such a surface**, and none of them is covered by whatever guards the files -- ignore rules and fenced directories operate on content, not on what is said about it. See [`Software_Engineering/05`](../Software_Engineering/05_CONTRIBUTING_A_CHANGE.md).

## Moving data between environments

**Prefer synthetic or minimized fixtures.** Real production data is not automatically necessary to reproduce a problem, and the burden is on showing it is. Most requests for it are requests for convenience wearing a reproduction's clothes.

Where a transfer is genuinely required, **authorize the source read, the destination write and the transfer itself as separate decisions.** They have different blast radii and different approvers, and collapsing them into one yes hides which of the three was actually being agreed to. Enforce read-only source access and an approved transformation boundary mechanically, by a control that would refuse the write rather than by an instruction asking for it.

**Validate before the data moves, not after**: allowed fields, free text, identifiers and what they can be linked to, logs, artifacts and payloads. Validation after the fact reports a disclosure; it does not prevent one.

Block on uncertainty. **Redaction is not proof of anonymization**, and preserving the relationships that make a reproduction faithful is a separate check from preserving privacy -- both have to pass, and the two pull against each other, which is why each is decided on its own.

## External services

Verify authentication and target authorization before acting: being able to reach a service is not evidence of being authorized against *that* account, project or environment, and the most expensive mistakes are correctly authenticated actions against the wrong target. Use least privilege, and validate IDs rather than trusting an identifier assembled from context.

**Separate reads from writes.** A read that is wrong is a wasted call; a write that is wrong is an effect, and the two do not deserve the same level of confidence before execution. Retain non-sensitive receipts, so what was done is recoverable from something other than a transcript, and **fail closed on ambiguity** -- an unresolved question about scope or target is a stop, not a default.

---

Short-lived credentials scoped to a run, their revocation and its verification are in [`01_ISOLATION_AND_SANDBOXING.md`](01_ISOLATION_AND_SANDBOXING.md). Why an agent is never given a credential in the first place -- and why the same data rules apply to a model call, which is itself a transfer -- is in [`Agentic_Engineering/03_AUTHORITY_AND_SAFETY.md`](../Agentic_Engineering/03_AUTHORITY_AND_SAFETY.md).
