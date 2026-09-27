# 🔎 Code review

A second pass over a finished change by someone who did not write it. What it looks at, what a finding has to carry so the next step can act on it, and the boundary that makes review useful at all: **a review produces findings, not decisions.** What changes when the reviewer is an agent is in [`Agentic_Engineering/04_VERIFICATION.md`](../Agentic_Engineering/04_VERIFICATION.md); what counts as evidence for the claims a review consumes is in [`02_TESTING_AND_EVIDENCE.md`](02_TESTING_AND_EVIDENCE.md).

## What a review inspects

Correctness / regressions / authorization / input handling / data and migration safety / cleanup / concurrency / compatibility / maintainability / **changes unrelated to the task**.

Map each acceptance criterion to code, behaviour and check evidence. **Missing required evidence is a finding, not implied success**, and the builder's claims are not evidence.

### One condition deciding two things

A finding pattern worth naming, because it reads as a style note and is frequently a defect.

**A single boolean governing more than one concern is a bug waiting for the concerns to diverge.** While the two happen to move together the code is correct, and the day one of them should change without the other, the condition silently applies to both. Nothing in the diff announces it, because nothing is wrong yet.

A worked case. A branch tested a compound condition -- roughly *"this is the special group, and a sort order applies"* -- and then replaced the group's membership with the sorted set. Two concerns, one branch: which items belong in the group, and what order they appear in. The defect was that a *sort* condition was also deciding *membership*, so when a sort order existed the group silently lost every item the sort had not covered.

The repair is to name each concern as its own predicate and let the call site state what it is deciding. **The naming is what produces the finding** -- once the ordering predicate has a name that says it is about ordering, it is obvious that membership is not its business. Before it was named, the same expression read as one condition about one thing.

**The heuristic a reviewer can apply without understanding the domain: if naming the predicate requires writing "and" into the name, it is two predicates.** That is checkable from the diff alone, and it does not depend on knowing what the code is for.

Note the direction of the fix. Extracting the predicates did not fix the bug; it *revealed* it, and the revelation was the whole value. A review finding here is therefore worth raising even where no defect is yet demonstrable -- the cost is one rename, and the thing it buys is that the next divergence errors visibly instead of silently.

## Review checklist

Inspect the final diff for criteria coverage, invalid inputs, error cleanup, injection and authorization, secret handling, transaction/migration safety, concurrency, compatibility, UI states, performance, sensitive logging, meaningful tests, documentation impact, and unrelated files.

### One pass searches the repository, not the diff

Everything above is diff-scoped, and a diff-scoped review is structurally blind to what a change broke **outside itself**. A renamed symbol, a moved module, a changed signature and a relaxed invariant are all correct within the diff and wrong everywhere that still expects the old one, and no amount of care reading the changed lines surfaces a caller that was not changed.

So one pass searches the whole repository rather than the change: every symbol renamed, moved or re-signatured, every invariant other modules rely on, and the fallout in configuration, documentation and links. It is a different question from the checklist above -- *what else assumed this?* rather than *is this right?* -- and asking it inside a per-file pass is what makes it get skipped.

**Where the pass runs a counting checker, run it against the base as well and report the difference.** A raw count over the current tree includes everything that was already there, and filing a pre-existing count as this change's finding makes the reviewer's output unusable at exactly the moment a number made it look rigorous.

## Every finding carries two orthogonal fields, plus a flag

- `disposition`: `blocker` | `tech_debt` | `skippable` -- machine-consumed, and the only field a gate reads.
- `severity`: `Blocker` | `High` | `Medium` | `Low` | `Note` -- human-facing, for triage and communication.
- `risk_accepted`: `true` | `false` -- set only by a human, naming who accepted what.

A finding that means "repair this, or have someone accept the risk in writing" is not tech debt -- tech debt carries no acceptance requirement -- and it is not a plain blocker either. It is `disposition: blocker` with `risk_accepted` available.

| Severity | Disposition | Required handling |
|---|---|---|
| Blocker | `blocker` | Repair, or obtain an explicit human waiver before `acceptance_pending`; blocked handoff is allowed |
| High | `blocker` | Repair, or a human sets `risk_accepted: true` with named consequences. Until then it blocks |
| Medium | `tech_debt` | Repair in scope or record a follow-up item; does not block |
| Low | `tech_debt` | Optional documented improvement |
| Note | `skippable` | No action required |

Why the two fields are kept apart, and the conformance test a review record has to pass before a gate can consume it, are in [`Agentic_Engineering/04_VERIFICATION.md`](../Agentic_Engineering/04_VERIFICATION.md).

## Approval is not authorization

**Reviewer output is advisory until an independent gate accepts it.** An approving review is a finding, not a decision -- reading it as a gate result is how approval quietly becomes authorization. The reviewer's job is to say what is wrong with the change; deciding that the change may now proceed is a separate act, performed by whatever holds that authority, on the strength of the evidence rather than on the strength of the approval.

## After a repair, run it again -- and review it again

After a repair, the affected checks run again **and the review runs again against the current diff**.

Invalidate affected downstream evidence, re-run the reproducing check and affected required gates, then review the current diff. **A later successful phase cannot clear an earlier failure**, and a review of a superseded diff is a review of code that is no longer the code.
