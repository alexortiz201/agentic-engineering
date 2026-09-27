# 🧱 Primitives

Blueprints. Each file answers one question: **what must this thing contain when I create one?**

They are requirements, not tutorials -- the reasoning lives in the rest of `foundations/`, and the step-by-step construction lives in the handbook. If a blueprint needs a paragraph to justify a line, the justification belongs elsewhere.

| Primitive | Is |
|---|---|
| ⌨️ [`command.md`](command.md) | A named, reusable prompt with a declared output contract |
| 📋 [`spec.md`](spec.md) | The detail a command is deliberately missing -- one task, machine-generated |
| 🪜 [`phase.md`](phase.md) | One step of a workflow, as code that invokes agents |
| 🔗 [`composition.md`](composition.md) | Phases in sequence, with a failure policy |
| 📦 [`module.md`](module.md) | Shared code a phase depends on |
| 🧾 [`record.md`](record.md) | What every durable artifact carries, and how versioning works |
| 🚦 [`gate.md`](gate.md) | An independent check on whether a transition may happen |
| 💾 [`state.md`](state.md) | What a run persists so it can be resumed or handed off |
| 📒 [`run_history.md`](run_history.md) | The append-only record of every run, and the only thing that makes behaviour visible over time |
| ⚡ [`trigger.md`](trigger.md) | How a run starts without a person |
| 🪝 [`hook.md`](hook.md) | Code that observes or blocks at a lifecycle event |
| 📌 [`pinned_reference.md`](pinned_reference.md) | External documentation frozen in the repository |
| 📐 [`design_document.md`](design_document.md) | Why the system is shaped this way -- outlives any run |
| 🔭 [`observation.md`](observation.md) | A bounded recording of work being performed, from which a workflow can be derived |

## Prove it at the consuming interface

Before a primitive is used by anything, exercise **six cases** -- not at its own boundary, but at the interface of whatever calls it:

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
