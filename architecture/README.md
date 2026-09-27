# Workspace architecture

This directory documents workspace-level navigation and ownership. It does not replace the portable doctrine in [`../workbench/`](../workbench/).

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
- The current [ADW composition review](adw-composition-review.md) reconstructs the execution model, names the minimum kernel, and records why typed child-workflow invocation remains planned rather than implicit.
- Pi is one harness realization. Operator Pi configuration and the Pi-specific AIDD adaptation remain in dotfiles.
- Canonical authored resources remain authoritative. Generated harness material is regenerated from its canonical inputs.
- `.profile/`, `.memory/`, and `.workgroup/` are local overlays/state with distinct lifecycles; only their sanitized contracts/templates are tracked.
- Upstream AIDD is comparison and migration-reference material, never an owned workspace component or runtime dependency.
