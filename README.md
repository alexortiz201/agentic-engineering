# Agentic Engineering

This README is the **canonical top-level direction** for Agentic Engineering / Workbench. The [canonical vocabulary](workbench/LANGUAGE.md) supplies supporting definitions; the [Workbench documentation guide](workbench/README.md) routes construction work.

## Mission and ownership

**Workbench contains construction capability, not project solutions.** It is a portable construction toolkit brought into an existing or new project to discover what exists, determine what agentic capabilities are needed, organize existing work, and construct and evolve missing units. It applies reusable knowledge to design, compose, generate, validate and observe project-specific systems, with explicit contracts, authority, evidence, safety and acceptance.

```text
RESOURCES — reusable knowledge about constructing reliable agentic systems
    │ informs
    ▼
WORKBENCH — portable construction vocabulary, tooling and process
    │ creates / organizes / validates / evolves
    ▼
PROJECT ARTIFACTS — the agentic system for this project
    ├── primitives
    ├── ADWs
    └── factories
        Primitive → ADW → Factory (composition only as needed)
```

- **Resources** answer “How do we construct reliable agentic systems correctly?” Knowledge, practices, patterns, skills, references, examples, dogfood lessons and relevant external architecture knowledge belong here, not a particular project's resulting system. The independently useful cross-domain **Library** and identifiable knowledge packages contribute resources; neither is another mandatory product stage. The existing [blueprint catalogue](workbench/foundations/Agentic_Engineering/primitives/README.md) is construction knowledge, not a collection of installed project Primitives.
- **Workbench** answers “Given this project, its existing system and an objective, what should we construct or evolve?” It owns construction capability and vocabulary, not every prompt, primitive, ADW or factory it helps create.
- **Project Artifacts** answer “What agentic system exists for THIS project?” Their owning project controls their contracts, changes and execution. The host application's framework retains execution, state and integration ownership; Workbench is not a replacement runtime.

**Ownership test:** generally useful HOW-to-construct knowledge/capability belongs to Resources/Workbench; something needed for THIS project's work belongs to Project Artifacts; a mechanism needed for a particular harness to execute agents reliably belongs to that harness/runtime realization. A reusable project artifact can later contribute a resource/template without transferring ownership of every project instance.

## Compose only as far as necessary

A **Primitive** is the smallest useful contracted compositional unit in the project's agentic system, deterministic or intelligent, not necessarily an agent. An **ADW** is a repeatable workflow composing bounded capabilities/phases toward a developer or engineering outcome. A **Factory** is a higher-order composition repeatedly producing a meaningful class of outcomes; it can compose primitives, ADWs, deterministic machinery, intelligent invocations, knowledge, state, integrations, gates and other capabilities as needed, without requiring all of them. It preserves constituent contracts and is not merely a multi-agent system or a large ADW.

A primitive may be enough; an ADW may be enough. A factory is not every project's destination. These are independent axes:

| Axis | Distinction |
|---|---|
| Composition / capability | Primitive → ADW → Factory |
| Scope / reusability | project-specific → reusable → portable/generalized |

A project-specific software factory is valid; cross-project portability is optional. The [Factory doctrine](workbench/foundations/Agentic_Engineering/10_THE_SOFTWARE_FACTORY.md) explicitly supersedes the former cross-project requirement. Conceptual composition does not claim a nested-ADW runtime: the [current ADW contract](workbench/foundations/Agentic_Engineering/06_ADW_COMPOSITION.md) still limits execution reuse to supported boundaries.

## Judgment versus specified behavior

**Intelligence where judgment is required. Deterministic machinery where behavior can be specified.** Choose code, a bounded model invocation, or a composition of both; do not use an agent merely because it can perform the operation.

Known test commands, typechecking, linting, JSON/schema validation, artifact verification, diff checking and authorized repository operations (including commits under an explicit deterministic policy) generally belong to code. Interpretation, reading for meaning, reasoning, synthesis, planning, implementation decisions and semantic review justify intelligent invocations. Code should own sequencing, deterministic gates, policy-driven bounded retries/corrections, persistence and acceptance predicates where practical; predicates do not replace human intent, risk acceptance or shipping authority.

**Core Four remain exactly Context, Model, Prompt, Tools** and configure the intelligent invocation. Model includes invocation-specific reasoning effort, never a permanent Role assignment. Role, Domain/Specialization, Knowledge, Authority, Expected Evidence, Stop Conditions, Runtime Behaviors and Harness Realization govern the surrounding contract/composition; they are not extra Core Four members. Reusable configuration defines what a unit is/can do; the composition call site defines how it is used here.

**Tools describe capability; Authority describes permission.** Shell/write availability does not authorize arbitrary repository mutation. Mechanically enforce authority and deterministic stop conditions where practical, and independently verify objectively checkable evidence: actual test results, artifacts, parseable JSON, declared versus actual diffs, protected files unchanged. Agent reports are proposals/claims, not proof. Semantic review and human approval remain distinct from deterministic evidence gates.

## Harness execution underneath, not a fourth product layer

```text
Project Artifacts / Workbench invocations
    ▼
Harness / runtime — Pi today (default for running agents)
    └── harness-native mechanisms such as context lifecycle

Workbench semantic behavior → Harness → Harness-native realization
context lifecycle          → Pi      → native compaction
```

Pi supports execution; its mechanisms do not redefine Workbench semantics. The practical lifecycle goal is substantial bounded work to completion without monotonically bloating context, unnecessary token usage/inference cost, or routine human context management:

```text
agent starts → bounded work → context grows → Pi safely compacts
    → same semantic task continues → repeat as needed → task completes
```

Compaction manages context, not task identity, scope or authority. Same-session correction can preserve useful context within a bounded invocation when appropriate; it is not transcript inheritance across workflow seams or an independent review, and retries remain policy-driven and task-budgeted. The [Pi realization document](workbench/harnesses/pi.md) separates this goal from version-specific mechanisms and verified observations. This direction is not a claim of live extension health or authorization to change lifecycle code.

## Layout

- [`workbench/`](workbench/) — current portable Workbench documentation/package: doctrine, semantic contracts, templates, and harness-specific documentation; not the whole product or the Library.
- [`plans/`](plans/) — active migration and Pi-integration plans; [`plans/BACKLOG.md`](plans/BACKLOG.md) is the canonical status, roadmap and ideas index.
- [`architecture/`](architecture/) — workspace-level boundary and navigation documentation.

Read [`AGENTS.md`](AGENTS.md) before working. For Workbench work, then follow [`workbench/AGENTS.md`](workbench/AGENTS.md) and its documented boot sequence.

## External boundary

Pi is the current concrete harness/runtime realization, not intrinsic to portable Workbench semantics. Portable Pi resources and accepted metadata are authored in [`harness/pi/`](harness/pi/README.md) after the [verified selective ownership handoffs](plans/handoffs/AIR_LIVE_HANDOFF_RESULT.md); both Macs retain physically local runtime resource targets. Root [`pi/`](pi/README.md) remains unchanged, frozen compatibility/recovery material for retained legacy consumers, not a second authored source. Dotfiles provides machine prerequisites and thin bootstrap integration; its old Pi configuration is retained as reference. The repository is canonical, not the Mini filesystem: either Mac can experiment, promote and sync accepted changes through the [shared Git/native-Pi workflow](pi/README.md#experiment-promote-sync--from-either-mac). [Air provisioning](pi/air-provisioning.md) consumes a reviewed local checkout and remains approval-gated. The historical Pi/Claude AIDD port is `../dotfiles/pi/packages/aidd-pi/`. AIDD is one identifiable, attributed and replaceable knowledge package/source, not a universal capability layer. Upstream AIDD is disposable reference material at `pi/upstreams/aidd/` when needed; it is not part of this repository.

The AIDD migration remains gated by the `CORRECTION REQUIRED` checkpoint recorded in [`plans/MIGRATE_AIDD_PLAN.md`](plans/MIGRATE_AIDD_PLAN.md). This workspace migration preserves that status and does not complete it.
