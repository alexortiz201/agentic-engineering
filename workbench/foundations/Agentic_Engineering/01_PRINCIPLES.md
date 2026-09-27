# 🧭 Principles

## Operating model

**Agentic Engineering = engineer judgment + deterministic orchestration + bounded agent reasoning + evidence.**

The goal is not maximum autonomy. Make work explicit, observable, composable, and repairable.

- **Engineer:** owns intent, authority, trade-offs, and acceptance.
- **Code:** owns schemas, state, transitions, gates, timeouts, retries, and artifacts.
- **Agent:** explores, plans, implements, reviews, and repairs within declared bounds.
- **Evidence:** determines confidence.

## The two layers

**The agentic layer wraps the application layer and gives it a programmatic interface.** The application is the product and the validation ground. The agentic layer is how work gets done to it.

The move this discipline asks for: **template your engineering and teach agents to operate the codebase, rather than operating it yourself each time.** A fix applied by hand solves one instance. The same fix encoded as a workflow solves the class -- and can then be inspected, gated and improved.

That is also the test of where something belongs. **If deleting the agentic layer would take the product with it, it was built in the wrong place.**

**A workflow is validated by the thing it operates on.** That subject may be a codebase, a running system, a set of external services, or a machine -- what it may not be is nothing. A layer built at a distance from its own subject can be read and not run, and every assumption it encoded is tested at once on first contact with the real thing, which is the most expensive moment to discover them. Note that the subject need not be an application: a workflow whose subject is a set of external services is validated by those services, on the same terms.

## The twelve leverage points

A diagnostic checklist, not twelve services to build.

**In the agent -- the Core Four**, chosen per invocation: context / model / prompt / tools.

**Through the agent**, built around it and reused across runs: standard output / types / docs / tests / architecture / plans / templates / workflows.

When a run disappoints, walk the list before reaching for a stronger model. Most failures are a context, contract or check problem, and **a stronger model cannot supply a check that does not exist.**

## Improve the agentic layer first

Before adding infrastructure, improve context, task specificity, tool interfaces, state, feedback, and observability. Progress from focused prompt/skill -> bounded role -> ADW -> composition only when the work warrants it. A repeated correction is a reuse signal, not a mandate for a platform.

Move down into code/data/product details when understanding or evidence is weak; return to delegation when concrete checks support it. More autonomy never expands authority.

## Priming is selection, not ingestion

Loading everything contradicts loading only what is relevant, and stops working at the first repository too large to hold.

**Stop when you can name the task's entry points, its conventions and its unknowns** -- not when you have read everything. Then **say what you did not read**, so the next actor knows where the gaps are rather than inheriting false coverage.

## Context by role

Give each role only what it needs. These responsibility labels illustrate
context shaping; they are not a mandatory roster. A reusable
[semantic role](14_SEMANTIC_AGENT_ROLES.md) adds a portable purpose, capability,
authority-ceiling, prompt, and return contract without selecting a concrete
model.

| Role | Context |
|---|---|
| Explorer | Task, repository instructions, read-only tools |
| Planner | Constraints, relevant code/tests, acceptance criteria |
| Implementer | Approved plan, scope, conventions, allowed tools |
| Verifier | Criteria, diff, check commands--not confidence claims |
| Reviewer | Task, plan, diff, evidence, risk checklist |
| Repairer | Concrete failures/findings and bounded scope |

**Return failures, not successes.** When a deterministic check passes, the agent that produced the work has nothing to do with that result -- feeding a green suite back into its context spends tokens and attention to communicate that nothing is required. Route the failure back, with enough of the output to act on, and let a pass simply advance the workflow. The same holds for any check whose only interesting outcome is the negative one.

Store stable knowledge in versioned files and run-specific facts in task state. Prime context by task; give each agent one purpose and compact artifact handoffs rather than whole transcripts. Load tools/MCP only when needed. Context bundles are validated indexes, not exact memory.

Each invocation resolves context, model/provider, prompt and tools (Core Four), plus workspace, output contract, permissions and limits. Record effective configuration. Select models by observed capability, privacy, cost and latency--not fixed rankings. Diagnose intent/context/tools/contracts/gates/state before upgrading a model.

## Deterministic shell, probabilistic core

Use code to validate inputs, track state, invoke tools, capture results, enforce gates, and bound retries. Use agents where interpretation and judgment are needed. Do not rely on conversational memory for workflow state.

## Determinism buys measurement, not only safety

The usual argument for deterministic orchestration is control: gates hold, state survives, failures route. There is a second argument that is easy to miss and is often the one that matters more.

**A workflow whose context, prompts and tooling are assembled deterministically can be measured.** Swap the model and the only thing that changed is the model, so the comparison means something. Version the prompt and the diff is reviewable, because the prompt is a file rather than a thing that was typed once. Replay the run and it replays, because nothing load-bearing lived in a conversation nobody kept.

The instrument that turns that property into an actual number is an [evaluation](12_EVALUATIONS.md); deterministic assembly is what makes one possible.

None of that is available to a workflow assembled by hand each time. Two runs differ in ways nobody recorded, so a better result proves nothing and a worse one diagnoses nothing. **Reproducibility is what turns an opinion about a workflow into a finding about it.**

## Bounded autonomy

Bound work by paths, tools, network targets, time, cost, retries, branch/worktree, stop conditions, and approvals. Parallelize only independent tasks with explicit ownership and isolation.

## Human understandability is part of completion

Agent-produced systems must remain understandable to the human who owns them. For a substantial subsystem, architectural comprehension and traceability are completion evidence: the owner should be able to locate the entry point, follow calls and data, identify responsibility and authority boundaries, understand failure propagation, distinguish verified behavior from deferred or planned behavior, and know where debugging begins without commissioning another reconstruction of the system.

This does not require documenting every line. It requires preserving the architectural understanding needed to review, operate, change, and repair the subsystem. A material architectural change invalidates the affected understanding and must refresh it.

## Evidence hierarchy

Six ranks, defined once in the canonical vocabulary. **Never promote a weaker claim into a stronger one.**

The rank that matters most here is the first, and it is conditional: an enforced gate outranks everything **only if it observed a non-empty subject**. A gate that ran against nothing returns a confident pass with no evidence in it, which makes the strongest rank the most dangerous one when that condition is dropped. Read the qualifier with the rank; a copy of this list without it is wrong.

## Control labels

Three values, defined in the canonical vocabulary. What matters when deciding: **actor and control are different axes.** A step performed by an agent may still sit behind a code-enforced gate, and labelling a step human-approved says nothing about who performs it.

Prompts, allowlists, branch names, and logging hooks are not isolation unless an external mechanism enforces them.

## Repair, do not perform success

Use `plan -> implement -> verify -> review -> repair -> re-verify -> human accept`. Human waivers may unblock delivery but never change a failed result into a pass. Measure accepted outcomes, total attempts/cost/time, human interventions and escaped defects; unknown measurements remain unknown.
