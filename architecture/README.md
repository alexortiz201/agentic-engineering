# Workspace architecture

This directory documents workspace-level navigation and ownership. The [repository README](../README.md) is the canonical top-level direction: Resources → Workbench → Project Artifacts; composition (Primitive → ADW → Factory) is independent of project scope/reusability. This navigation does not replace that direction or the portable doctrine in [`../workbench/`](../workbench/).

```text
agentic-engineering/       owned workspace and portable Workbench tool
├── workbench/             portable contracts; no runtime/controller
├── plans/                 migration and Pi integration records
└── architecture/          workspace-level boundaries

../dotfiles/pi/            external operator configuration
├── packages/aidd-pi/      owned Pi/Claude adaptation
└── upstreams/aidd/        ignored, disposable upstream AIDD reference
```

- Workbench defines portable discipline and contracts. Substantial subsystem work follows the canonical [`Substantial Subsystem Lifecycle`](../workbench/handbook/16_SUBSTANTIAL_SUBSYSTEM_LIFECYCLE.md).
- ADWs express semantic requirements; [portable semantic roles](../workbench/foundations/Agentic_Engineering/14_SEMANTIC_AGENT_ROLES.md) define specialized agent work, operator policy resolves current model/effort, and harnesses realize the resolved invocation.
- [Project capability integration](project-capabilities.md) maps the implemented selective CLI, recursive dependency resolution, ownership/approval boundaries and isolated/native-Pi verification. This is resource linking, not nested-ADW execution.
- The [ADW composition review](adw-composition-review.md) records the current contracted execution model and why typed child-workflow invocation remains planned rather than implicit. Its workflow responsibilities are not another product layer or a universal Workbench controller requirement.
- The [construction boundary and dependency decision](workbench-construction.md) separates declarative task edges and packet validation from execution readiness based on authoritative verified workflow state. No completion state is invented in a brief, and a dependent task with unavailable evidence is NOT READY.
- Pi is the current default supporting harness realization; mechanisms such as lifecycle compaction do not redefine Workbench semantics. Operator Pi configuration and the Pi-specific AIDD adaptation remain in dotfiles.
- Canonical authored resources remain authoritative. Generated harness material is regenerated from its canonical inputs.
- `.profile/`, `.memory/`, and `.workgroup/` are local overlays/state with distinct lifecycles; only their sanitized contracts/templates are tracked.
- Upstream AIDD is comparison and migration-reference material, never an owned workspace component or runtime dependency.
