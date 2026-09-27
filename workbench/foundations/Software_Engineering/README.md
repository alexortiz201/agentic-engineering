# 🏗️ Software Engineering -- the practice underneath

Proper engineering. The part that was true before agents existed and is still true now.

The agentic side rests on this area rather than restating it. Where a rule here is amplified by agents -- and several are -- the amplification is noted where it applies, and the rule itself stays here.

## What is in here

| File | Answers |
|---|---|
| 📐 [`01_SDLC_SOFTWARE_DEVELOPMENT_LIFECYCLE.md`](01_SDLC_SOFTWARE_DEVELOPMENT_LIFECYCLE.md) | What the software development life cycle is, what each phase is *for*, and why naming it correctly matters |
| ⚖️ [`02_TESTING_AND_EVIDENCE.md`](02_TESTING_AND_EVIDENCE.md) | Which checks establish what, what order to spend them in, what a record of a check has to contain, and how a failure that may not be about the code is adjudicated |
| 🔭 [`04_OBSERVABILITY.md`](04_OBSERVABILITY.md) | Answering questions about a running system from what it already emits |
| 📝 [`05_CONTRIBUTING_A_CHANGE.md`](05_CONTRIBUTING_A_CHANGE.md) | What a change publishes about itself -- message form, what must never appear in one, and why history is not editable |
| 🔎 [`03_CODE_REVIEW.md`](03_CODE_REVIEW.md) | What a review inspects, what a finding carries, and why an approving review is a finding rather than a decision |

## What belongs here

The test is a single question: **would this still be true if you removed agents from the picture?**

If yes, it is engineering and it belongs here. If it concerns the environment the code runs in and the path it takes to get there, it belongs in [`DevOps/`](../DevOps/README.md). If neither, it belongs in [`Agentic_Engineering/`](../Agentic_Engineering/README.md).

Topics in scope but **not yet written**: interface design, coupling and cohesion, separation of concerns. They are named so a reader can tell missing from hidden -- if you want one of them, it is not here yet.

Two things follow from that test, and both are easy to get wrong:

- **A practice does not move here just because agents happen to use it.** Agents run linters; linting is engineering. Agents are handed a bounded scope; *bounding an agent's scope* is agentic. The question is about the statement, not about who executes it.
- **A practice does not stay out just because agents made it more important.** Several classical concerns got *sharper* under agents rather than being replaced. They still belong here, with the amplification noted rather than used as a reason to relocate them.

## Why this matters more under agents, not less

A practice a person performs runs once per occasion, and a human absorbs the cost of a rough edge each time. A practice encoded into a workflow runs every time that workflow runs, which is the point of encoding it -- and the same multiplication applies to its defects. A leaky interface that cost one engineer ten minutes now costs that ten minutes on every execution, silently, with nobody watching the step closely enough to notice.

So the classical qualities -- isolatable, decoupled, single clear interface -- are not legacy concerns to be carried along out of habit. They are the properties that decide whether a workflow can be tested at all. A phase you cannot invoke on its own cannot be verified on its own, and a workflow made of phases that cannot be verified on their own can only be verified end to end, which is the most expensive and least informative way to find out something is wrong.
