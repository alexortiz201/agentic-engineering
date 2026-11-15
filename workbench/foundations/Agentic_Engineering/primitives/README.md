# 🧱 Construction blueprints

The historical `primitives/` path is preserved for existing readers. This is a **Resources catalogue**, not a homogeneous set of project Primitives. Each blueprint answers: **what must this thing contain when I create one?** The blueprint is knowledge about construction; the resulting capability, workflow or supporting artifact belongs to its project.

A **Primitive** is the smallest useful contracted compositional unit in a project's agentic system. It can be deterministic or intelligent, not necessarily an agent. State inputs/preconditions, outputs/effects, authority, expected evidence, failure and stop behavior appropriate to the unit. Do not label an entire workflow, a pattern or passive knowledge as a Primitive merely because it can be reused.

They are requirements, not tutorials -- the reasoning lives in the rest of `foundations/`, and the step-by-step construction lives in the handbook. If a blueprint needs a paragraph to justify a line, the justification belongs elsewhere.

| Blueprint | Result / compositional kind |
|---|---|
| ⌨️ [`command.md`](command.md) | Prompt/report contract; an invocation using it can be an intelligent Primitive when bounded by the surrounding contract, not just prompt text |
| 📋 [`spec.md`](spec.md) | Supporting task artifact, not executable capability |
| 🪜 [`phase.md`](phase.md) | Code-owned execution boundary for deterministic, intelligent or deferred work; may contain one Primitive or several, not automatically minimal |
| 🔗 [`composition.md`](composition.md) | Sequence and failure policy; a workflow composition, not a minimal Primitive |
| 📦 [`module.md`](module.md) | Shared code; a bounded exported operation may realize a deterministic Primitive, not every module as a whole |
| 🧾 [`record.md`](record.md) | Supporting durable-artifact/versioning contract |
| 🚦 [`gate.md`](gate.md) | Independent transition check; an objective code-enforced check can be a deterministic Primitive, approval/review is a different control |
| 💾 [`state.md`](state.md) | Supporting persisted run facts and handoff contract, not the executable operations that store/load them |
| 📒 [`run_history.md`](run_history.md) | Supporting append-only record across runs |
| ⚡ [`trigger.md`](trigger.md) | Optional ingress/claim/dispatch pattern; contracted operations may be Primitives, the whole pattern need not be minimal |
| 🪝 [`hook.md`](hook.md) | Event-driven code; a bounded observing/guarding operation can realize a deterministic Primitive, with project or harness ownership determined by purpose |
| 📌 [`pinned_reference.md`](pinned_reference.md) | Supporting knowledge/reference artifact, not executable capability |
| 📐 [`design_document.md`](design_document.md) | Supporting architecture/decision artifact, not executable capability |
| 🔭 [`observation.md`](observation.md) | Supporting process recording; the recorder is a separate executable capability |

These distinctions supersede defining Primitive by membership in this catalogue. No paths, blueprints or consumer record formats are renamed. Reuse the construction guidance without assuming all entries occupy the same composition level.

## Prove it at the consuming interface

For executable units (including Primitives and compositions), exercise **six cases** at the consuming interface, not merely the unit's own boundary. For passive artifacts, test the corresponding producer/consumer validation and record which execution cases do not apply:

| Case | Must |
|---|---|
| valid | do the thing |
| missing input | refuse, and say what was missing |
| malformed input | refuse without partially applying |
| unauthorized | refuse, and not leak what it would have done |
| timeout | end, and report ending rather than hanging |
| **wrong workspace** | **detect the mismatch and report it, rather than operating on whatever it found** |

The last one is the cheapest place to catch a whole defect class. A primitive invoked from the wrong directory, or against a workspace that is not the one under test, must report the workspace it observed and the one it expected -- and fail. **Silently succeeding there is the primitive-level form of a gate certifying an empty diff.**

Check argument order, output shape, path containment and actual side effects. Verify a generated artifact **as an artifact** before executing it.

## Label what is true

**A status only a run may change.** Where these labels are recorded in an index, the execution column is writable by execution alone: editing an artifact does not change whether it has run, and only running it does. A label a reader can upgrade by improving the prose is not a label.


Four different claims, routinely collapsed into one: **authored** / **configured** / **tested** / **actually used**. Say which. A thing that exists is not a thing that runs, and a thing that runs is not a thing anyone depends on.

## Two rules across all of them

**State the contract in the prompt; validate it in code.** Every blueprint that crosses the agent boundary says this in some form. A prompt asking for JSON is a request, not a guarantee.

**Name what a thing must contain, never where it lives.** Directory layout, filenames and language are the adopter's choice and belong in their handbook.
