# Workbench construction boundary and dependency decision

Architecture gate: **APPLIES** — a bounded construction artifact and deterministic tool, not a portable execution controller. Constructor implementation and Lead checks pass (19 tests, Node syntax and strict JSDoc types); managed fixture delivery independently verifies (6/6 tests, exact nonempty granted diff); fresh independent architecture review **PASS**, no material findings. This bounded slice is engineering-complete; task state **acceptance_pending**, not human-accepted or shipped. See [review evidence](../plans/evidence/workbench-slice/architecture-review.json). Authoritative context: [composition review](adw-composition-review.md), [workflow/state](../workbench/foundations/Agentic_Engineering/02_WORKFLOW.md), [composition blueprint](../workbench/foundations/Agentic_Engineering/primitives/composition.md) and [state blueprint](../workbench/foundations/Agentic_Engineering/primitives/state.md).

## Declarative edges are not completion evidence

`tasks.depends_on` declares dependency relationships in the construction brief. It does **not** assert that any predecessor has completed. The constructor must:

1. Validate unique task identities and referenced task IDs; reject duplicate/self edges and dangling references.
2. Detect cycles across the complete graph. Forward references in a valid DAG are allowed; array ordering is not dependency truth.
3. Preserve relationships in the emitted packet and inspectable bounded assignments.
4. Keep construction validity separate from task execution readiness. Do not add dependency-completion fields or a second workflow-state store to the brief.

A successful construction operation means the selected inputs and artifact contract passed deterministic validation. It does not prove semantic requirement quality, agent capability, permission enforcement, dependency completion, or execution success.

## Execution readiness belongs to the authoritative workflow state

A consuming composition/Lead may execute a task only after reading authoritative workflow state and verifying completion evidence for **every** dependency of that task. Evidence must correspond to the correct run/task/artifact identity and satisfy the workflow's independent completion gates. Agent settlement text, static packet order and the presence of another task are insufficient.

When authoritative workflow state or verified completion evidence is unavailable, the dependent task is **NOT READY**. A constructor with no state access reports that unavailability instead of assuming success. A dependency-free task has no predecessor evidence requirement, but still must pass scope, authority, environment and invocation gates. A consumer must re-evaluate readiness at execution, not cache a static packet declaration as a live permit.

`NOT READY` is a dependency-readiness label, **not** an added task-lifecycle enum value. Canonical task state remains separate, with `blocked`/`return_to` orthogonal where needed. This decision adds neither a DAG scheduler nor automatic execution, completion-state persistence, retry, claim or permission mechanisms.

## Existing architecture retained

Resources → Workbench → Project Artifacts remains the product direction. An explicit construction packet is a supporting project artifact: objective, targeted context with provenance, requirements/check mapping, bounded plan, invocation requirements and authority/stop boundaries. Core Four remain **Context, Model, Prompt, Tools**; role/model, capability/permission, agent/task identities and construction/execution stay separate.

A project workflow owns execution order, run identity, authoritative state, independent gates and failure policy. Pi owns model execution and context maintenance; Herdsman owns managed assignment and agent lifecycle. Workbench construction must not modify either runtime, invent hidden completion state, infer effective routing or replace their ownership. The synthetic slice uses existing managed ownership and independently checks a nonempty allowed file change and behavior; no generic controller is implied.

## Implementation and data-flow map

Authored source is [`construct.mjs`](../workbench/tools/construct/construct.mjs); tests and full contract are in its [tool directory](../workbench/tools/construct/README.md). Node built-ins only, no build/generated source or runtime package dependency.

```text
CLI main → parseArgs → explicit JSON brief read
  → constructPacket → validateBrief (schema, maps, ownership, Kahn DAG check)
  → unresolved-question guard → canonical workspace identity
  → inspectPath (write ancestors and selected files)
  → retrieve (bounded UTF-8 read, inode/metadata checks, SHA-256)
  → assignment (Core Four + grant + dependency gate + inert checks)
  → strict JSON packet / self-contained assignment text
```

Failures are typed exit codes: `1` invalid usage/brief/graph/path syntax; `9` readiness/workspace/context boundary failure. No partial packet is printed on failure. This operation reads files and writes no state; packet persistence belongs to the caller. Supplied argv stays inert; requested model/tools are recorded with effective values unobserved.

The fixture consumer is [project-owned evidence tooling](../plans/evidence/workbench-slice/verify-fixture.mjs), not a portable controller. Lead explicitly selects the brief/context, verifies seeded fixture hashes, delegates one exact module file through existing Herdsman, then (after ownership resolves) compares complete file snapshots and reruns two fixed Node checks. Its [gate controls](../plans/evidence/workbench-slice/verify-fixture.test.mjs) independently establish no-op/scope/check-failure rejection. `snapshot`/`verify` observe actual files; passing tests alone never establish an in-scope nonempty subject or acceptance. No workflow-state completion reader is implemented in this consumer because the fixture has no predecessors.

## Status and limits

- **IMPLEMENTED AND VERIFIED:** explicit construction CLI/schema/DAG/context/assignment boundaries; Lead reran 19 tests and available strict types; fixture gate controls 5/5 after retained nested-test-context repair.
- **IMPLEMENTED BUT NOT RUNTIME-VERIFIED:** concurrent/hostile filesystem behavior; other Node/OS versions; comprehensive live lifecycle health.
- **DEFERRED:** comprehensive live lifecycle acceptance, restoration and upstream changes remain outside authority. Optional AE-19: put canonical workspace/run/task identity directly into the project-owned verifier JSON; current identity reconciliation is separate, so that JSON alone is not a standalone cwd attestation.
- **PLANNED:** any consumer reading authoritative multi-task completion state. No automatic scheduling, dependency-state inference, routing resolution or completion reader is present.

Path checks assume a stable caller-controlled workspace and are not a sandbox; aliases/hard links/case variants and replaced ancestors are not isolated. Context privacy/semantic adequacy/command safety/tool availability remain the consumer's responsibility. Packet size/task count are not globally bounded beyond explicit context-byte limits; use bounded briefs. Exact repository identity is not inferred: Lead checks fixture identity before dispatch; generic checkout-identity attestation is not implemented.

## How to trace the system

Start at `main`/`constructPacket`, follow pure `validateBrief`, then inspectPath/retrieve. For a graph failure inspect declared edges; for a NOT READY dependency inspect authoritative workflow state. For a delivery failure inspect fixture snapshots, fixed-command verification and the managed assignment identity. Read the [slice plan](../plans/WORKBENCH_CONSTRUCTION_SLICE.md) for authority/acceptance, then the [handoff](../plans/AUTONOMOUS_WORKBENCH_HANDOFF.md) for current ownership and evidence. No implicit retry or acceptance follows a pass.

## Decision provenance and validation

- `documented`: explicit operator clarification resolved the builder's owner question; reply sent on the existing pending ownership channel.
- `documented`: [construction plan](../plans/WORKBENCH_CONSTRUCTION_SLICE.md) supersedes earlier-only edges and prerequisite-completion-at-construction wording.
- `executed`: 19 constructor tests cover DAG reference/cycle/forward-edge validation, dependency preservation and dependent NOT READY evidence-unavailable behavior.
- `inspected` by fresh independent reviewer: current source, tests, generated artifacts, granted subject diff, recorded checks and documentation; **ARCHITECTURE REVIEW: PASS**, no material findings. Reviewer executed scoped Git whitespace/diff checks but did not rerun Node/full structural checks (role restriction); Lead ran those independently. Review remains scoped to the hashed implementation; later material changes reopen affected gates.
- End-to-end fixture has one dependency-free task. Existing managed implementation returned the exact run/task/workspace and one granted file; Lead independently reproduced 6/6 behavioral tests and syntax, confirmed protected-file hashes and canonical workspace identity, and checked nonempty granted diff. See [verification](../plans/evidence/workbench-slice/final-verification.json). This validates bounded construction/delivery without claiming authoritative multi-task runtime readiness. Multi-task readiness integration remains unimplemented.
- No Pi/Herdsman/upstream changes, commits or pushes are authorized by this decision.

## Debugging / rollback

For construction errors, inspect the explicit brief and tool validation result before delegating; for dependent execution blockage, inspect the workflow state and missing completion evidence, not the brief for invented completion flags. Do not widen authority or reroute models to clear a readiness failure. Roll back only mission-owned tooling/docs/artifacts; preserve unrelated dirty work and operator configuration.
