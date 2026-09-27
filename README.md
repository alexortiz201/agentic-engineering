# Agentic Engineering

The Agentic Engineering workspace and portable Workbench tool. The Workbench tool helps engineers design and improve an application's agentic layer—whether the application is new, has no agents yet, or already uses agents—without replacing its host framework or owning its runtime. Start with the [Workbench tool guide](workbench/README.md) and its [repository-adoption route](workbench/handbook/09_ADOPTING_A_REPOSITORY.md).

## Layout

- [`workbench/`](workbench/) — portable Workbench doctrine, contracts, templates, and harness documentation.
- [`plans/`](plans/) — active migration and Pi-integration plans.
- [`architecture/`](architecture/) — workspace-level boundary and navigation documentation.

Read [`AGENTS.md`](AGENTS.md) before working. For Workbench work, then follow [`workbench/AGENTS.md`](workbench/AGENTS.md) and its documented boot sequence.

## External boundary

Pi operator configuration remains in the external sibling dotfiles repository at `../dotfiles/pi/`. The owned Pi/Claude AIDD port is `pi/packages/aidd-pi/` there. Upstream AIDD is disposable reference material at `pi/upstreams/aidd/` when needed; it is not part of this repository.

The AIDD migration remains gated by the `CORRECTION REQUIRED` checkpoint recorded in [`plans/MIGRATE_AIDD_PLAN.md`](plans/MIGRATE_AIDD_PLAN.md). This workspace migration preserves that status and does not complete it.
