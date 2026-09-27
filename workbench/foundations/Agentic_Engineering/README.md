# 🤖 Agentic Engineering -- what changes when agents do the work

What is different once agents and deterministic code perform the phases of the lifecycle. The lifecycle itself, and the engineering practice it rests on, are in [`Software_Engineering/`](../Software_Engineering/README.md) -- read that first if the question is *what is this process*, and read here if the question is *how is it run by agents*.

Everything here is standalone in the sense the [`foundations/` index](../README.md) defines: it names no company, repository, tracker, model or harness, and it reaches nothing outside `foundations/`. Anything that touches a specific project, toolkit or filesystem layout lives outside and is expected to change often. What is in here should change slowly, and only for reasons that would hold at any organization.

**Nothing here reaches outside `foundations/`.** The discipline names *concepts* -- a run-state record, a gate-decision record, a design document -- and whatever adopts it decides which file is which. That mapping is the adopter's business, not the discipline's, and keeping it out is what makes this liftable. References to [`Software_Engineering/`](../Software_Engineering/README.md) are inward and allowed; they are how the agentic side names the practice it rests on.

## What is in here

| File | Answers |
|---|---|
| 🧭 [`01_PRINCIPLES.md`](01_PRINCIPLES.md) | How to decide -- evidence ranking, control labels, repair over performed success |
| 🔄 [`02_WORKFLOW.md`](02_WORKFLOW.md) | The task lifecycle, its states, and which gate guards each transition |
| 🔐 [`03_AUTHORITY_AND_SAFETY.md`](03_AUTHORITY_AND_SAFETY.md) | What may be done without asking, what may not, and what an allowlisted agent can still reach |
| 🔬 [`04_VERIFICATION.md`](04_VERIFICATION.md) | Whether a claimed check is a check -- provenance, gates that found no subject, and the reviewer that is itself an agent |
| 🛟 [`05_RECOVERY_AND_HANDOFF.md`](05_RECOVERY_AND_HANDOFF.md) | Bounded repair, resumable runs, and reporting a result truthfully |
| 🧩 [`06_ADW_COMPOSITION.md`](06_ADW_COMPOSITION.md) | Primitives, how they compose into a workflow, and how much machinery a given job actually justifies |
| 🎓 [`07_COACHING.md`](07_COACHING.md) | What to teach about this discipline -- the questions, the distinctions worth forcing, the practice ladder |
| 🛡️ [`08_GATES.md`](08_GATES.md) | The `G0`-`G7` namespace, what a gate validates in code, and why an empty diff is `blocked` rather than `pass` |
| 🎛️ [`09_CONTROL_PLANE_TESTS.md`](09_CONTROL_PLANE_TESTS.md) | The faults a composition must survive before anything runs it unattended |
| 📊 [`12_EVALUATIONS.md`](12_EVALUATIONS.md) | Measuring what cannot be asserted, and comparing two models honestly |
| 🔬 [`11_OBSERVABILITY.md`](11_OBSERVABILITY.md) | What changes when the subject is a run, and when the observer is the run itself |
| 🏭 [`10_THE_SOFTWARE_FACTORY.md`](10_THE_SOFTWARE_FACTORY.md) | What a factory is, what it is for, and the three properties without which it is only a workflow |
| 🧠 [`13_MEMORY.md`](13_MEMORY.md) | What survives a run ending -- the tiers, what earns a write, eviction, and queue discipline for open work |
| 🎭 [`14_SEMANTIC_AGENT_ROLES.md`](14_SEMANTIC_AGENT_ROLES.md) | How an ADW names specialized agent work without coupling workflow phases to models, routing policy, or harness-native subagents |
| 🧱 [`primitives/`](primitives/README.md) | Blueprints -- what each primitive must contain when you create one |

## The ideas the rest of it rests on

- **Agents propose; code disposes.** Keep proposal, authorization and mutation separate. An agent may ask; it cannot approve itself. Autonomy does not increase authority.
- **Evidence has a rank, and provenance is a separate axis from confidence.** Never promote a weaker claim into a stronger one. A summary of a check is weaker than the check.
- **A check that cannot fail is worse than no check**, because it reads as coverage. A gate that did not observe its subject reports `blocked`, never `pass`.
- **Failures become state.** Preserve enough to resume or repair. Never narratively smooth over a failure, and never relabel a waived failure as a pass.
- **Reuse must be earned.** Learn, apply, then extract -- in that order. A pattern extracted before it has been executed encodes a guess.
- **Move down a level when evidence is weak; return on a named condition**, not on a feeling of readiness.

How this folder is evolved is in the [`foundations/` index](../README.md).
