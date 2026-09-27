# 🔗 Composition

Phases in a declared sequence. It owns exactly three things: **run identity, order, and a failure policy per phase.** Nothing else -- if it reaches into a phase, the boundary is wrong.

## Must contain

- **Identity minting**, once for a composed run, passed to each phase. A phase run independently may mint an entry identity; a phase invoked by a composition may not replace the composition's identity.
- **The sequence**, named so the name *is* the documentation: the phases in execution order.
- **A failure policy per phase**, not one policy for the whole run.

## Failure policy is a per-phase decision

The same phase failing means different things depending on what follows it. A failed verification step may be survivable before a review, and fatal before a merge. **Record the reason beside the policy** -- a bare `continue` reads as an oversight a year later.

A bounded correction may use the typed outcome and `return_to` to select an earlier phase. That does not make the composition a general graph runtime. Express an evidenced conditional in ordinary code; do not invent a workflow syntax for it.

**A workflow started by a person may abort. A workflow started by a trigger may not** -- it owes its queue a terminal status on every path, or the work is lost in a claimed state forever.

## The phase boundary has one handoff mechanism

**Phases are separate processes.** Fresh start, state reloaded, no shared memory. That is what makes a phase independently runnable and a failure independently resumable.

The composition passes the **run identifier**. The phase uses it to load closed, validated state, including configuration and predecessor artifact references. The phase persists its typed result and material facts to state/run history before returning an execution status. The composition may use that typed status and independent gate decisions to route control; it may not parse arbitrary phase prose or inspect phase internals.

A command report crosses the **command-to-phase** boundary. It does not create a second phase-to-phase channel: the phase validates and persists it before another phase consumes it. Do not combine state handoff with piping, transcript inheritance, or an ambient shared-memory convention.

## Composition boundary

- **Reuse contracted phase entry points** when composing owned work.
- **Use a deferral** when yielding to an external workflow the caller does not own; resume on an independently observed side effect.
- **Do not insert an owned ADW as a child phase under the current contract.** Typed child-workflow invocation is not yet a portable primitive. It would first need explicit child input/output schemas, parent/child identity and state namespaces, authority and budget derivation, gate ownership, cancellation and retry propagation, and evidence import.

Neither sharing the parent run identifier nor minting an untracked child identifier supplies those semantics. Flatten current owned compositions to phases. Add a child-workflow boundary only after a real consumer proves that phase reuse is insufficient.

## Rules

- **Forward options deliberately.** Passing a flag through unconditionally when the composition means to force it is a silent override.
- **When compositions differ only in sequence and policy, they are data, not files.** Several near-identical variants is the signal to replace them with a table and one runner.
- **Keep orchestration in one owner.** A phase may invoke deterministic code, a bounded agent, or an external deferral; it may not conceal a second owned composition whose order and failure policy the parent cannot observe.
