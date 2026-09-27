# 📐 The capability surface

What a workflow is allowed to assume of a harness. Everything on this list must be satisfiable by every harness the workflow claims to run on; everything off it is a convenience the workflow must not depend on.

The surface is deliberately small. **Each capability added is a harness excluded**, and a surface drawn around one product's feature list is not a contract, it is that product's documentation with the name removed.

## Required -- a workflow may assume all of these

| Capability | What a workflow needs | Why it is required |
|---|---|---|
| **Bounded invocation** | Send one prompt and get one result, with the call scoped to a working directory | Without it there is no unit to sequence, and no way to say where work happened |
| **Model selection per call** | Choose the model for this invocation from outside the prompt | Phases have different cost and capability needs; a fixed model makes the workflow's economics someone else's decision |
| **Tool constraint per call** | Restrict what the agent may do on this invocation | An unconstrained call has no blast radius, so nothing downstream can be bounded |
| **Structured return** | Get output that can be validated rather than parsed out of prose | A regex over prose is a missing output channel; the consuming phase must validate, not interpret |
| **Distinguishable failure** | Tell "the work failed" apart from "the harness failed" | These route differently. Conflating them sends a broken environment into a repair loop that cannot fix it |
| **Retained transcript** | Persist what was sent and returned | Without it a run produces claims and no evidence, and cannot be reconstructed by anyone who was not watching |
| **Standing-instruction control** | Replace or extend what the agent is told before the conversation starts | A harness whose standing instruction cannot be changed has decided the agent's role on your behalf, and no per-call prompt fully overrides it. This is the capability that makes specialization possible at all |

## Not required -- and therefore not to be depended on

A harness may offer any of these and they may be worth using. A workflow that **requires** one has narrowed itself to the harnesses that have it, and should say so out loud rather than discovering it later.

- **Sub-agents.** Spawning a nested agent may be a first-class feature, an extension, or absent. A workflow that needs concurrency should express it in the controller, where it is the controller's concurrency.
- **Lifecycle hooks.** Where they exist they are excellent, and they are the natural place for a gate. Where they do not, the same gate is a step in the controller. **A gate must not exist only as a hook**, or it disappears on a harness without them.
- **A tool protocol.** Integration with external systems may be built in or may be a command-line program the agent calls. The second is available everywhere.
- **Packaged capabilities.** Named bundles of instruction and tooling, loaded on demand, go by different names and different formats. The instruction inside one is portable; the packaging is not.
- **Configuration file conventions.** Which file a harness reads for project instructions, and from which directories, is a per-harness fact. Two harnesses agreeing on a filename is convenient and is not a contract.
- **Interactive affordances.** Permission prompts, approval dialogs and status displays assume a human is watching. An unattended run has no one to ask, so anything that depends on being asked is not available to it.
- **Dynamic injection.** Rewriting the prompt or filtering history mid-run is powerful where it exists and absent where it does not. A workflow that is only correct because something was injected mid-run has an unwritten requirement -- see [injection points](03_INJECTION_POINTS.md).

## The rule that makes the surface load-bearing

**A capability the workflow requires goes on the surface, or the workflow is not portable -- state it either way.** The failure this prevents is silent: a workflow accumulates dependencies on conveniences, each reasonable on its own, and nobody notices until it is asked to run somewhere else and fails for six unrelated reasons at once.

So the surface is not a wish list. It is the answer to one question asked before each new dependency: **is this something every harness I claim to support can do?** If yes, it may be depended on. If no, either it goes behind the adapter with a fallback, or the claim of support gets narrower.

## Where a capability is missing

Three honest responses, in order of preference.

1. **Build it on top.** A missing capability that can be supplied by the controller is not really missing. Gating is the common case: a harness without hooks can still be gated, because the controller decides what runs next.
2. **Design around it.** Some absences change the shape of the workflow rather than blocking it. No sub-agents means concurrency moves to the controller, which is usually where it belonged.
3. **Narrow the claim.** If neither works, the workflow does not run there. Record that, with the capability that caused it, so the next person does not rediscover it.

**Never the fourth response**, which is to depend on it anyway and let the second harness fail at runtime. That converts a design decision into an incident.
