# 🗺️ Artifact map -- concept -> where it is defined

`foundations/` names concepts and reaches nothing outside itself. This is the mapping it leaves out.

**The blueprint is the definition** -- it says what each artifact must contain. If concrete starting files are ever added, this table gains a column for them.

| Concept in `foundations/` | Defined by |
|---|---|
| Command | ⌨️ [`Agentic_Engineering/primitives/command.md`](../foundations/Agentic_Engineering/primitives/command.md) |
| Spec | 📋 [`Agentic_Engineering/primitives/spec.md`](../foundations/Agentic_Engineering/primitives/spec.md) |
| Phase | 🪜 [`Agentic_Engineering/primitives/phase.md`](../foundations/Agentic_Engineering/primitives/phase.md) |
| Composition | 🔗 [`Agentic_Engineering/primitives/composition.md`](../foundations/Agentic_Engineering/primitives/composition.md) |
| Shared module | 📦 [`Agentic_Engineering/primitives/module.md`](../foundations/Agentic_Engineering/primitives/module.md) |
| Gate | 🚦 [`Agentic_Engineering/primitives/gate.md`](../foundations/Agentic_Engineering/primitives/gate.md) |
| Durable record envelope | 🧾 [`Agentic_Engineering/primitives/record.md`](../foundations/Agentic_Engineering/primitives/record.md) |
| Run state | 💾 [`Agentic_Engineering/primitives/state.md`](../foundations/Agentic_Engineering/primitives/state.md) |
| Trigger | ⚡ [`Agentic_Engineering/primitives/trigger.md`](../foundations/Agentic_Engineering/primitives/trigger.md) |
| Hook | 🪝 [`Agentic_Engineering/primitives/hook.md`](../foundations/Agentic_Engineering/primitives/hook.md) |
| Pinned reference | 📌 [`Agentic_Engineering/primitives/pinned_reference.md`](../foundations/Agentic_Engineering/primitives/pinned_reference.md) |
| Design document | 📐 [`Agentic_Engineering/primitives/design_document.md`](../foundations/Agentic_Engineering/primitives/design_document.md) |
| Semantic role contract | 🎭 [`Agentic_Engineering/14_SEMANTIC_AGENT_ROLES.md`](../foundations/Agentic_Engineering/14_SEMANTIC_AGENT_ROLES.md); concrete representation belongs to the adopting controller/operator layer once consumed |
| Where a run writes | 🗂️ [`02_RUN_ARTIFACTS.md`](02_RUN_ARTIFACTS.md) |
| Where each lives in a project | 🏗️ [`05_AGENTIC_LAYER_LAYOUT.md`](05_AGENTIC_LAYER_LAYOUT.md) |
| How to build one | 🛠️ [`06_BUILDING_AN_ADW.md`](06_BUILDING_AN_ADW.md) |

## Rules

- **A new concept in `foundations/` earns a row here**, not a link there. A link in the discipline is the leak returning.
- **A blueprint is not a schema.** It states what must be present and why; it validates nothing.
- **A target project may use its own convention.** Record that mapping where its workflow is defined.


