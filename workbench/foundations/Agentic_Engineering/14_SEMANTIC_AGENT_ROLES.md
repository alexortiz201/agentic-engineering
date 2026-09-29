# 🎭 Semantic agent Roles and bounded invocations

Workbench owns portable semantic responsibilities, evidence expectations and authority boundaries. A **Role** is a conditional responsibility/evidence contract for bounded agent judgment, not a workflow phase, permanent agent, model, skill, permission grant, Library resource, prompt nickname or harness-native subagent definition. The name must be faithful to the actual composition: an invocation called “Researcher” that makes Developer changes misrepresents its Role.

The six accepted conditional Roles are:

| Role | Responsibility and evidence boundary |
|---|---|
| **Product** | Frame value, user needs, behavior and tradeoffs with stated assumptions; do not take the human owner's priority or acceptance authority. |
| **Researcher** | Acquire, evaluate and refresh relevant evidence with sources, provenance, uncertainty and limitations; do not present speculation as observation. |
| **Planner** | Propose a bounded approach linked to requirements, evidence, dependencies, gates and alternatives; proposal is not authorization. |
| **Developer** | Implement within approved scope and report changed artifacts and checks actually performed, including failures; do not approve the result. |
| **Reviewer** | Independently scrutinize semantics, design, scope and risk with actionable findings and evidence; do not approve one's own findings. |
| **Verifier** | Test claims and, where warranted, seek counterexamples/falsification; do not claim unrun checks passed or implement the fix being verified. |

These are neither a mandatory six-step sequence nor a requirement to create six agents. A deterministic check or human decision does not need an invented Role. Project Manager is not an accepted seventh Role. Jev / Jev AI remains an unclassified future pressure test, not a Role or any other decided category.

## Contract, specialization and composition

A reusable Role describes purpose, responsibility, semantic reasoning needs, context and evidence requirements, prompt/return expectations, mutation posture, authority ceiling, tool capability needs and stop conditions. It cannot name a permanent provider/model or reasoning effort, grant a Tool, expand access, waive a gate or accept its own result. A Tool is an executable fact-producing or authorized operation; a Capability is selectively applicable knowledge, method, procedure or reference, possibly mixed. Neither creates authority.

A **Domain** names expertise. Optional **Specialization** supplies at least Domain, Lens and relevant current Resources; a general Role requires no `General` specialization. Material domain claims need sufficiently current resources or accountable human/domain expertise, not a model's implied certification. Compatible responsibilities and lenses can be composed within a bounded invocation: obligations conjoin, ordering conveys no precedence, conflicts surface, and composition cannot enlarge authority. Separate fresh invocations may be needed for independent review or falsifying verification of a producer's work.

Initial knowledge selection is intentionally simple: **Role configuration → explicit resource reference/path → selected knowledge resource/package.** This is a prose relationship, not a file format, field, schema, path convention or resolver. Choose only relevant resources, including Domain resources and selectively useful Capabilities, without making them the Role. Preserve package/source identity, provenance, attribution and replaceability. AIDD is one current knowledge package/source, not the universal capability layer; Library knowledge spans engineering domains beyond agentic engineering. Sophisticated discovery, resolution and version selection are deferred until dogfood evidence warrants them.

## Core Four and concrete execution

**Context, Model, Prompt, Tools** are exactly the Core Four composed for each concrete Agent invocation according to task, faithful Role, Domain/Specialization as relevant, selected knowledge/resources, authority, evidence requirements and current harness realization:

- **Context:** lean relevant facts and selected Library/package resources, with provenance, freshness, limitations and deliberate exclusions; do not preload a whole corpus.
- **Model:** provider/model and reasoning effort selected for this invocation's judgment and constraints, not fixed to a Role; no automatic router is required.
- **Prompt:** task, Role responsibility, specialization lens, constraints, evidence and return obligations, authority ceiling and stop/defer conditions. Prompt text does not enforce permission.
- **Tools:** bounded executable mechanisms appropriate to the task and actual grant; availability alone does not authorize their use.

Actual permission is explicit and runtime-constrained; intersect task need, Role ceiling, human/operator grant and harness limits. Pi currently realizes concrete agents/subagents, provider/model calls, tool enforcement, lifecycle and state. None is intrinsic to portable Workbench semantics. Another harness could in principle realize the same contracts, but this chapter specifies no future adapter. The host application's framework continues to own its execution, state and integration.

## Workflows and possible realizations

An ADW phase may require a Role's judgment, but phase, Role and invocation are distinct. One bounded invocation may cover compatible duties; another workflow may use several. Phase ordering, deterministic validation, gates, retries, state and accounting belong to the authorized workflow realization, not to the Role. No universal Workbench controller is presumed.

For example, **one possible ADW/controller implementation** can resolve phase requirements, apply operator routing policy, fix an invocation's Core Four and authority, then call a harness adapter. Its operator policy may map requirements to a model and effort, or an authorized caller may explicitly select them; fallback is acceptable only when permitted. Requested and effective values and the selection basis must remain distinguishable. An override records actor, reason and scope and cannot change authority, gates or acceptance. This is a concrete option, not the sole Workbench architecture or a mandate to build a router, adapter or controller.

A controller-spawned process and a harness-native subagent are different possible execution mechanisms. Neither defines a portable Role. A harness-native subagent cannot own workflow gates or grant its parent authority; combined effects and budgets stay within its invocation's envelope. A claim of portability must state which mechanisms are assumed and how the same semantic responsibilities and evidence are preserved, not assert that only controller spawning is portable.

## Evidence-bearing handoffs

Downstream work receives bounded, validated artifacts rather than relying on an inherited transcript. Preserve subject and version, observation versus inference/decision, provenance and limitations, approved envelope, decisions and unresolved questions, owned artifacts, checks actually run and their status, and next gate. Where applicable retain run/phase/attempt and changed paths. Independence may require fresh context and a separate producer/reviewer invocation. No universal Role-result schema is implied; introduce typed fields only when a real consumer needs them.

## Representation boundary

Do **not** create runtime Role files before a real consumer exists. For now the portable contract belongs in reviewed documentation and bounded task/workflow design. A future consumer may justify the smallest representation and validation it actually needs after architecture review and explicit approval; no schema, registry, resolver or Role file is authorized here. Harness-native definition files and operator-owned model choices are concrete artifacts, not the semantic Role.

**Agents propose; validation and human authority decide.** Roles do not move intent, permissions, risk acceptance or release authority into an agent. Observability, evidence, gates, bounded authority and human intervention remain necessary even as future autonomy grows.
