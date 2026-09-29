# Agentic Engineering

The Agentic Engineering workspace and the current documentation package for **Workbench**, a composed engineering utility/product. Workbench owns portable semantic contracts and draws selectively on an independently useful **Library** of durable knowledge across engineering domains. This package primarily documents engineering an application's agentic layer; it is not the whole Workbench, the Library, or an application runtime. The application's framework owns its execution and integration. Start with the [Workbench documentation guide](workbench/README.md), [canonical vocabulary](workbench/LANGUAGE.md), and [repository-adoption route](workbench/handbook/09_ADOPTING_A_REPOSITORY.md).

## Layout

- [`workbench/`](workbench/) — current portable Workbench documentation/package: doctrine, semantic contracts, templates, and harness-specific documentation; not the whole product or the Library.
- [`plans/`](plans/) — active migration and Pi-integration plans.
- [`architecture/`](architecture/) — workspace-level boundary and navigation documentation.

Read [`AGENTS.md`](AGENTS.md) before working. For Workbench work, then follow [`workbench/AGENTS.md`](workbench/AGENTS.md) and its documented boot sequence.

## External boundary

Pi is the current concrete harness/runtime realization, not intrinsic to portable Workbench semantics. Its operator configuration remains in the external sibling dotfiles repository at `../dotfiles/pi/`. The owned Pi/Claude AIDD port is `pi/packages/aidd-pi/` there. AIDD is one identifiable, attributed and replaceable knowledge package/source, not a universal capability layer. Upstream AIDD is disposable reference material at `pi/upstreams/aidd/` when needed; it is not part of this repository.

The AIDD migration remains gated by the `CORRECTION REQUIRED` checkpoint recorded in [`plans/MIGRATE_AIDD_PLAN.md`](plans/MIGRATE_AIDD_PLAN.md). This workspace migration preserves that status and does not complete it.
