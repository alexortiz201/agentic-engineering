# 🎭 Semantic agent roles and routing

A **semantic role** states what kind of bounded agent judgment a phase needs. It
is upstream of model selection and harness execution. A role is not a model
alias, prompt nickname, permission grant, subagent definition, or workflow
phase.

The separation is:

```text
ADW phase
  -> semantic role and phase requirements
  -> operator routing policy
  -> resolved typed invocation
  -> harness adapter
  -> harness/model/tools
```

Each layer has one decision to make:

- the ADW decides what semantic work the phase requires;
- the role supplies reusable requirements for that kind of work;
- operator policy maps those requirements to currently available execution;
- invocation resolution fixes the exact Core Four and authority envelope;
- the adapter translates that fixed request without reinterpreting it;
- the harness executes and reports what was effective.

**Workflow phase is not model, and workflow phase is not necessarily the parent
agent.** One parent may perform a small flow, while a larger flow may use
separate bounded invocations. The lifecycle still defines what must happen;
role selection decides who is asked to perform its agentic work.

## The minimum role contract

A reusable role describes only distinctions a caller or consumer needs:

- purpose and responsibilities;
- required semantic and reasoning capabilities;
- expected context shape, freshness, and isolation;
- prompt contract;
- tool capability classes needed to attempt the work;
- mutation posture and authority ceiling;
- structured return contract and required evidence references;
- relevant workflow constraints and stop conditions.

A role may say that architectural reasoning, fresh context, read-only access,
or a particular return contract is required. It may not name a provider or
model, grant itself a tool, expand a path or network boundary, waive a gate, or
decide that its own result is accepted.

Role names are earned by recurring responsibility, not invented as a roster in
advance. Exploration, planning, implementation, diagnosis, review, and
documentation are common responsibilities, but a workflow creates a named role
only when the distinction changes context, authority, prompt, tools, return, or
routing. Two labels with the same contract are one role.

## Resolution and routing authority

The highest layer with sufficient semantic information decides, and a lower
layer does not silently revisit that decision.

Resolution proceeds in two parts:

1. **Resolve semantic requirements.** Phase-specific requirements or an
   authorized exact override refine the role's reusable defaults. Refinement
   cannot expand authority beyond the human- or workflow-approved envelope.
2. **Resolve execution.** Operator policy maps the resulting semantic
   requirements to an available provider/model and reasoning effort. The
   invocation module receives those exact values. A harness fallback is used
   only when the caller deliberately left routing unresolved and the workflow
   permits fallback.

An exact provider/model requirement inside a portable ADW narrows portability
and must be identified as such. Normally the ADW names a role and requirements,
while operator policy owns the mutable concrete mapping.

Manual override remains possible, but it is an explicit input with its actor,
reason, scope, and requested values recorded. An override changes routing; it
does not change authority, gates, or acceptance criteria.

At the harness boundary, a model/effort pair selected by either operator policy
or an authorized override is **explicit caller routing**: the adapter was given
resolved values. `fallback` means the caller supplied neither value. Keep the
upstream basis of an explicit selection separately so `operator_policy` and
`manual_override` do not collapse into the harness-facing
`explicit`/`fallback` distinction.

Routing evidence therefore retains, as applicable:

- semantic role identity and contract version;
- phase-specific semantic requirements;
- policy identity/version and matched rule;
- manual override actor/reason/scope;
- requested provider/model and reasoning effort;
- effective provider/model and reasoning effort observed from the harness;
- harness-facing routing source and any mismatch or rejection.

Requested and effective values remain separate. Automatic harness behavior may
fill an allowed fallback; it may not erase or silently replace explicit caller
routing.

## Core Four and authority

A role contributes requirements to the Core Four; it does not fully determine
them.

| Core Four member | Role contributes | Resolver/controller owns |
|---|---|---|
| Context | required kinds, freshness, isolation, exclusions | bounded files/artifacts, provenance, size, and delivery |
| Model | semantic capability and reasoning requirements | concrete provider/model and effort from operator policy or override |
| Prompt | purpose, standing role contract, return contract | task-specific prompt, variables, version, and original intent |
| Tools | capability classes needed | exact allowlist after capability preflight and authority intersection |

The operational envelope also fixes cwd, mutation boundaries, permissions,
limits, timeout, output path/schema, evidence requirements, and failure
semantics. Effective tools and authority are the intersection of phase need,
role ceiling, operator/human grant, environment capability, and any stricter
harness constraint. A role definition is never an authority source.

## Specialized invocations in an ADW

The composition and controller own phase order, prerequisites, state,
validation, gates, retries, budgets, and failure routing. They may invoke a
specialized role for agentic judgment inside a phase. Deterministic phases still
run as code and do not acquire a role merely for symmetry.

A substantial-subsystem flow might use separate exploration, planning,
implementation, architecture-review, and documentation invocations. That is a
possible composition, not a universal roster. The required invariant is that
all lifecycle work and gates occur with valid evidence, regardless of whether
one or several agents performed the semantic phases.

Fresh context is selected when independence or compression requires it,
especially for review. The controller supplies the minimum bounded context and
validated predecessor artifacts rather than forwarding an entire conversation.
This makes each invocation a context-isolation and compression boundary, not
merely a concurrency unit.

## Controller-spawned invocations and harness-native subagents

A portable specialized agent is a controller-spawned bounded invocation. It has
its own typed request, cwd, Core Four, authority envelope, result, provenance,
and gate validation.

A harness-native subagent is a nested execution mechanism inside an invocation.
It may help an authorized role perform bounded exploration or synthesis, but:

- it is not the controller and does not own workflow state or transitions;
- it does not decide completion gates or deterministic validation;
- it cannot grant itself or its parent additional authority;
- its combined effects, retries, and budgets remain inside the parent
  invocation's envelope;
- its report remains agent assertion until the owning invocation and controller
  validate the relevant contract and evidence.

A workflow requiring several portable actors expresses those invocations in the
controller. A harness-native subagent may be an optional realization only when
the workflow contract permits it and an equivalent fallback exists or the
portability claim is narrowed explicitly.

## Structured handoffs

A downstream role receives validated artifacts, not an inherited transcript.
A handoff should carry only what its consumer requires, with provenance:

- run, phase, attempt, workspace, and role identity;
- concise decisions and unresolved findings;
- owned artifact and evidence references;
- changed paths when mutation was authorized;
- validation status and failure classification;
- the bounded input needed by the next role.

There is no universal role-result schema. A shared invocation envelope carries
common identity, provenance, execution, and artifact references; each role's
consumer-tested return contract carries its semantic payload. Add fields when a
real consumer parses them, not to anticipate every future role.

## Representation and implementation boundary

Semantic roles should eventually be declarative, inspectable, versioned, and
controller-consumable. Ordinary configuration plus deterministic schema and
reference validation is sufficient; a bespoke role language is not.

Do not create role files before an executable consumer exists. Until then, the
portable contract belongs in workflow/phase design and reviewed documentation.
When a controller consumes roles, introduce the smallest representation needed
by the first real role set, validate it before invocation, and keep concrete
model mappings in separate operator-owned policy.

Harness-native agent definition files are adapter or operator artifacts. Their
content may implement part of a semantic role, but their frontmatter, model
inheritance, and tool syntax do not define the portable role contract.

**Agents propose; code disposes.** Roles improve repeatability of agent judgment.
They do not move sequencing, validation, routing resolution, authority,
accounting, or gate decisions out of deterministic code, and they do not move
human-owned intent, permission, risk acceptance, or release authority into an
agent.
