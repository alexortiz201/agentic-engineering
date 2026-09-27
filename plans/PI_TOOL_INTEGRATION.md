# Pi + Workbench Tool — Integration Direction

## Current objective

We are configuring Pi locally as part of the operator's dotfiles.

The Pi configuration should make Pi an effective harness for the **workbench tool**, while preserving the workbench tool's portability and existing architectural boundaries.

Do not treat this as "integrate the workbench tool into Pi" or "make the workbench tool depend on Pi."

The architectural question is:

> How should Pi act as a first-class harness for the workbench tool while keeping portable workflow behavior in the workbench/controller and harness-specific behavior in the Pi adapter/configuration?

The Pi folder in dotfiles should be built with this boundary in mind.

---

## What the workbench tool is

The workbench tool is a self-contained package for bounded, observable, and repairable software delivery.

It is the public, portable half of a larger bench. The private half is the workbench home at `~/.workbench`.

The workbench tool contains the portable discipline:

- vocabulary;
- software-engineering foundations;
- agentic-engineering foundations;
- DevOps foundations;
- harness-engineering foundations;
- handbook procedures;
- primitives;
- templates;
- defaults;
- harness capability/adaptation knowledge.

It deliberately does **not** contain an organization's workflows or become a general agent runtime.

The workbench tool currently has no orchestration runtime of its own. The host/harness supplies models, tools, permissions, execution facilities, and any real runtime gates.

That separation is intentional and should be preserved unless investigation produces strong evidence that an abstraction is currently misplaced.

---

## The central abstraction: Core Four

Every agent invocation resolves four things:

**context, model, prompt, tools**

These are the workbench tool's **Core Four**.

They are selected per invocation rather than globally configured once.

This is important for the Pi work.

Pi should provide mechanisms capable of realizing the Core Four. Pi should not become the place where the portable meaning of the Core Four is defined.

Conceptually:

```text
work item / ADW phase
        |
        v
portable workbench/controller logic
        |
        | resolves
        v
+-------------------+
| Core Four         |
|                   |
| context           |
| model             |
| prompt             |
| tools             |
+-------------------+
        |
        v
Pi harness adapter/configuration
        |
        v
Pi runtime
```

---

## Pi is a harness

Treat Pi as one implementation of the harness capability surface.

Claude Code is another.

Other harnesses may exist later.

The desired architecture is therefore approximately:

```text
                  Workbench Tool
             portable discipline/contracts
                        |
              harness capability surface
                        |
          +-------------+-------------+
          |                           |
          v                           v
   Claude adaptation             Pi adaptation
          |                           |
          v                           v
    Claude runtime                 Pi runtime
```

Portable workflows should not require knowledge of Pi unless the workflow explicitly chooses to depend on a Pi-specific capability.

Likewise, Pi-specific configuration should not redefine portable Agentic Engineering concepts merely because Pi exposes a convenient feature.

---

## Controller behavior vs harness behavior

This distinction is critical.

The workbench vocabulary already distinguishes two ways multiple agents can exist:

1. The controller spawns a process per unit of work.
2. A harness spawns a native subagent inside a session.

The first is portable controller behavior.

The second is a harness capability.

Do not move portable orchestration into Pi simply because Pi can implement it conveniently.

In particular, concurrency that belongs to a workflow should normally remain controller concurrency. A Pi-native subagent may be useful, but workflows should not silently become dependent on it.

The same test should be applied to every Pi feature:

> Is this behavior intrinsic to the workflow, or merely one harness's mechanism for executing it?

If intrinsic to the workflow, prefer a portable controller abstraction.

If intrinsic to Pi, keep it in the Pi adaptation.

If both layers need to participate, define a thin capability boundary rather than duplicating behavior.

---

## Model and reasoning-effort routing

Model selection belongs to the Core Four and is therefore resolved per invocation.

The current OpenAI capability ladder being explored is approximately:

```text
Luna Low
    ->
Luna Medium
    ->
Terra Medium
    ->
Terra High
    ->
Sol Medium
    ->
Sol High
```

The intended semantics are roughly:

```text
mechanical / bounded
    -> Luna Low

well-specified routine implementation
    -> Luna Medium

normal semantic engineering work
    -> Terra Medium

difficult diagnosis / ambiguity / integration
    -> Terra High

architecture / cross-system reasoning
    -> Sol Medium

exceptional unresolved architecture, safety,
security, or other high-consequence reasoning
    -> Sol High
```

This is currently an operating hypothesis, not portable doctrine.

Do not hard-code OpenAI model names into portable foundations.

The durable abstraction is closer to:

> Select model capability and reasoning effort per invocation according to the work required, available evidence, risk, and cost.

The concrete mapping from those requirements to Luna/Terra/Sol belongs in an appropriate configuration/default/harness/operator layer.

The repository should be inspected before deciding exactly where that mapping lives.

---

## Generic Pi auto-routing vs workbench routing

We are currently experimenting with automatic model selection in interactive Pi.

That solves a legitimate problem:

```text
operator
   |
   v
unknown interactive request
   |
   v
Pi classifier/router
   |
   +--> Luna
   +--> Terra
   +--> Sol
```

Pi receives an unclassified human request and may need to determine how much capability it requires.

That is different from an ADW/controller invoking an agent.

An ADW may already know:

- lifecycle phase;
- task type;
- engagement mode;
- operating level;
- expected output;
- required evidence;
- available tools;
- dependencies;
- risk;
- whether work is deterministic or semantic;
- whether the invocation performs implementation, diagnosis, review, documentation, etc.

That information can be more useful than a generic classifier looking only at the resulting prompt.

Therefore, avoid blindly doing this:

```text
ADW chooses work
      |
      v
construct prompt
      |
      v
generic Pi classifier
      |
      v
choose model
```

when the controller already possesses enough structured information to make the decision.

Prefer investigating whether the architecture should become:

```text
ADW / controller
      |
      | understands invocation semantics
      |
      +--> context
      +--> model + effort
      +--> prompt
      +--> tools
              |
              v
         Pi executes
```

A generic Pi auto-router may remain useful for **interactive Pi sessions** without becoming part of the portable ADW execution contract.

Do not assume one routing mechanism must serve both use cases.

---

## Routing tags

The workbench vocabulary already defines a `routing tag` as a selector carried inside a request that chooses a workflow and model.

Do not create a competing Pi-specific routing abstraction without first determining how it relates to this existing concept.

At the same time, do not prematurely turn the current Luna/Terra/Sol ladder into a large routing framework.

The workbench's existing rule applies: a routing system should grow because real traffic requires distinctions, not because possible distinctions can be imagined.

Prefer the smallest routing mechanism supported by observed workflows.

---

## Pi configuration should expose capabilities, not policy leakage

The Pi dotfiles configuration will likely need to provide things such as:

- model/provider availability;
- reasoning-effort controls;
- extension configuration;
- tool configuration;
- instructions;
- context-loading mechanisms;
- session behavior;
- hooks;
- structured-output support;
- invocation mechanisms;
- possibly subagent definitions;
- possibly sandbox/isolation integration;
- logging/evidence integration.

Those are candidate implementation details, not a predetermined checklist.

Inspect Pi and the workbench tool before deciding which are actually required.

Where possible, Pi configuration should expose a capability that the workbench/controller can invoke rather than embedding workflow policy directly into Pi.

---

## Do not confuse instructions with enforcement

The workbench distinguishes:

- `code-enforced`;
- `human-approved`;
- `agent-checked`.

Pi prompts, instruction files, model behavior, allowlists, branch names, and similar mechanisms must not be represented as hard security boundaries unless something external actually enforces them.

When adapting workbench workflows to Pi, record honestly which controls Pi can deterministically enforce and which remain agent-checked.

Do not upgrade an instruction into an enforcement claim merely because Pi follows it reliably during testing.

---

## Evidence remains evidence

A Pi adaptation must preserve the workbench evidence hierarchy.

An agent saying that a check passed is not equivalent to executed evidence.

A Pi subagent agreeing with another Pi agent is still agent assertion.

Harness convenience must not collapse distinctions between:

- executed;
- inspected;
- documented;
- asserted.

Where a workflow requires mechanical verification, the Pi implementation must make the actual executed evidence available to the controller/run artifacts.

---

## Context discipline

Do not solve Pi integration by loading the entire workbench tool into every Pi session.

The workbench explicitly uses selective context loading.

The boot sequence establishes the core vocabulary and discipline. Additional material is loaded according to the task.

Pi should preserve this property.

Investigate how Pi can efficiently support:

```text
minimum boot context
       +
task-specific workbench context
       +
target-project context
       +
invocation-specific context
```

Model context windows are not permission to abandon context engineering.

Also consider prompt caching and session continuity when designing model switching. Optimizing each invocation independently can be worse globally if unnecessary switching destroys useful cached/session context.

---

## Workbench boundaries remain authoritative during this work

Do not casually move Pi-specific observations into `foundations/`.

`foundations/` is intended to remain standalone and portable. It should not name particular companies, repositories, trackers, models, or harnesses.

If investigation of Pi reveals a generally true Agentic Engineering principle, that principle may eventually justify a foundations change.

If the finding is true specifically because Pi behaves a certain way, it belongs in the harness-specific layer.

If it represents this operator's chosen Pi configuration, it belongs in the appropriate configuration/default/operator layer.

Keep these three categories separate:

```text
generally true
    -> foundations

true of Pi
    -> harness adaptation/documentation

chosen for this installation
    -> configuration/default/operator state
```

---

## Relationship to the dotfiles repository

The Pi folder in dotfiles represents the operator's real Pi installation.

It is not the portable definition of Agentic Engineering.

It should configure Pi so that:

1. interactive Pi is useful on its own;
2. Pi can act as a capable workbench harness;
3. workbench-controlled invocations can specify the Core Four cleanly;
4. Pi-specific capabilities remain available without contaminating portable workflows;
5. the configuration remains understandable and reproducible;
6. automatic conveniences do not hide architectural responsibility.

The dotfiles Pi configuration may therefore contain stronger opinions than the portable workbench tool.

That is acceptable.

The important requirement is that those opinions remain identifiable as installation/harness choices rather than silently becoming universal workbench rules.

---

## Immediate investigation

Before making substantial Pi configuration changes, inspect both:

1. the existing Pi configuration in dotfiles; and
2. the relevant workbench tool material.

For the workbench tool, follow its own boot sequence rather than loading the repository indiscriminately.

Then inspect the relevant harness-engineering and harness-specific material.

Determine Pi's actual capability surface rather than assuming equivalence with Claude Code.

For each relevant capability, establish:

- what the workbench requires;
- what Pi provides natively;
- what Pi provides through an extension;
- what requires a thin adapter;
- what belongs in portable controller code;
- what Pi cannot currently provide;
- what would become non-portable if implemented using a Pi-specific feature.

---

## Questions the Pi work must answer

The investigation should eventually resolve at least these questions:

**Invocation**

How does portable controller code invoke Pi with an explicitly chosen model, reasoning effort, context, prompt, tools, working directory, and authority envelope?

**Model routing**

Can the caller explicitly choose model and effort reliably?

When should Pi classify an unknown interactive request versus accept a model decision already made upstream?

**Context**

How should Pi receive the minimum required workbench and project context without loading everything?

**Sessions**

When should work reuse a Pi session versus start a fresh bounded invocation?

How do model switching and session reuse affect caching, context integrity, cost, and reproducibility?

**Concurrency**

Which parallelism belongs to controller-spawned processes and which, if any, should use Pi-native subagents?

**Tools**

How are tools constrained per invocation?

Can the controller reliably express the intended tool surface?

**Structured returns**

How should an agent invocation return machine-consumable results that can be validated rather than interpreted loosely?

**Evidence**

How are command output, validation results, failures, and other evidence returned to the workbench run?

**Authority**

Which restrictions are actually enforced externally and which remain instructions?

**Isolation**

What isolation can Pi itself provide, and what must be supplied by worktrees, containers, sandboxes, filesystem boundaries, or other external mechanisms?

**Hooks and lifecycle**

Which Pi hooks are useful implementations of workbench lifecycle concepts without making those concepts Pi-dependent?

**Failure and recovery**

What happens when Pi fails, returns malformed output, exhausts context, hits quota, loses a session, or cannot use the requested model?

---

## Desired outcome

Do not optimize for "lots of clever Pi configuration."

Optimize for a small, comprehensible Pi harness surface that lets the workbench discipline remain in control.

The ideal direction is:

```text
                HUMAN INTENT
                     |
                     v
              WORKBENCH / ADW
                     |
          deterministic controller
                     |
       resolves invocation contract
                     |
        +------------+------------+
        |            |            |
     context       model         tools
                    +
                  effort
        |            |            |
        +------------+------------+
                     |
                   prompt
                     |
                     v
              HARNESS ADAPTER
                     |
          +----------+----------+
          |                     |
       Claude                  Pi
          |                     |
          v                     v
       runtime               runtime
          |                     |
          +----------+----------+
                     |
                     v
             validated return
                     |
                     v
             gates / evidence /
             repair / handoff
```

The workbench owns the **meaning of the workflow**.

The controller owns **sequencing, state, deterministic validation, gates, retries, accounting, and portable concurrency**.

The agent owns **research, synthesis, planning, scoped implementation, diagnosis, semantic review, and documentation** within the authority it was given.

The harness owns **the mechanisms by which an agent invocation actually runs**.

Pi configuration should make those mechanisms excellent without absorbing responsibilities belonging to the other layers.

---

## Implementation posture

Do not begin by installing extensions or copying Claude configuration into Pi.

First map capabilities and boundaries.

Reuse Pi-native functionality when it cleanly implements a harness capability.

Use extensions when they fill a real capability gap.

Write custom Pi configuration or adapters only when neither provides the required contract cleanly.

Do not reproduce a workbench/controller feature merely because implementing it inside Pi looks easy.

Do not force parity with Claude Code where Pi has a different but equally valid mechanism.

Conversely, do not make portable workflows depend on a Pi-specific convenience merely because it is superior.

Prefer:

**portable contract + harness-specific implementation**

over:

**lowest-common-denominator workflow**

and over:

**workflow coupled to the favorite harness**.

---

## Current working model policy

Until investigation produces a better evidence-backed policy, use the following as the working OpenAI escalation concept:

```text
Luna Low
    -> cheap bounded/mechanical work

Luna Medium
    -> well-specified routine implementation

Terra Medium
    -> normal engineering default

Terra High
    -> difficult implementation, diagnosis, integration

Sol Medium
    -> architecture and substantial cross-system reasoning

Sol High
    -> exceptional escalation only
```

For interactive Pi, an automatic classifier/router may select among these capabilities.

For workbench-controlled invocations, prefer explicit caller selection when the workflow already possesses enough information to make that decision.

Do not allow automatic routing to erase an explicit upstream model decision.

Do not spend Sol simply because a task is important. Model capability should correspond to the reasoning required by the invocation.

This mapping is provisional. Measure actual outcomes and revise it from evidence.

### Semantic roles and central operator routing

Portable specialization is defined by the Workbench [`semantic role` contract](../workbench/foundations/Agentic_Engineering/14_SEMANTIC_AGENT_ROLES.md). A role records purpose, context/reasoning/tool requirements, authority ceiling, prompt contract, return contract, and freshness/isolation requirements. It never names Luna, Terra, Sol, Pi, or another provider/harness choice.

This operator's mutable role-to-model/effort mappings belong in operator-owned routing configuration. A future controller resolver will combine the ADW phase's explicit semantic requirements with the role contract, apply that operator policy, and issue a fully resolved invocation to the existing adapter. A policy-resolved model/effort pair is `explicit` at the adapter boundary because the controller supplied it; the controller separately retains the policy version/rule or manual-override basis. `fallback` remains reserved for a deliberately unresolved invocation with neither requested value.

The current interactive auto-model configuration is not that resolver. It classifies an initially unknown interactive prompt, is currently disabled, and has no semantic-role mapping. The existing Pi `scout`, `planner`, `reviewer`, and `worker` definitions are harness-native subagent assets: useful implementation references, but not portable role definitions or workflow-state owners. Current controlled invocations therefore still require a caller to provide model/effort explicitly or opt into fallback. Role-based automatic resolution is planned controller work, not an implemented adapter capability.

---

## Guiding principle

The goal is not:

> Make the workbench tool work like Pi.

Nor is it:

> Make Pi work like Claude Code.

The goal is:

> Give the workbench tool a clean, first-class Pi harness while learning from Pi where the workbench's portable abstractions need to become clearer.

Pi may reveal missing abstractions in the workbench tool.

When that happens, determine whether the discovery is:

1. a general Agentic Engineering principle;
2. a missing portable harness capability;
3. a Pi-specific adaptation requirement; or
4. merely an operator configuration preference.

Put the solution at the corresponding layer.

That boundary is part of the architecture, not documentation cleanup after the implementation.