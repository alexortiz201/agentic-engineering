# 🚪 Adopting a repository

How this package arrives somewhere it has not been. Five stages, in order, each earning the next. **The order is the safety property** -- every stage is reversible, and each one exists to make the following one informed rather than speculative.

Some repositories have no agentic layer yet; others already use framework agents, instructions, prompts, plugins, or informal conventions. **Adoption is learning the application's actual boundaries, not installing over them.** The stages below describe how this package meets an existing repository; they are not prerequisites for designing a useful first agent or a mandate to build a factory.

## Route from application need to agentic design

1. **Orient and ask.** Inspect the application's entry points, architecture, manifests, dependencies, existing agent/framework facilities, instructions, and checks within the authorized scope. Ask the engineer what problem should change, what success looks like, and for representative inputs and failure cases. Report unknowns rather than assuming the host has no agentic layer.
2. **Choose the smallest useful boundary.** Separate deterministic operations and checks from bounded agent judgment and human approval. For each candidate responsibility, name its purpose, inputs, outputs, failure/defer behavior, and owner. A focused prompt or existing host facility may suffice; do not require an ADW or a new controller. Use the [principles and Core Four](../foundations/Agentic_Engineering/01_PRINCIPLES.md) to choose context, model, prompt, and tools only for the calls needed.
3. **Design and test in the host.** If a repeatable workflow earns its cost, follow [building an ADW](06_BUILDING_AN_ADW.md) for phases and evidence gates; use [evaluations](../foundations/Agentic_Engineering/12_EVALUATIONS.md) and [validating a workflow](07_VALIDATING_A_WORKFLOW.md) for representative fixtures, deterministic assertions, and semantic judgments. Reuse the application's framework for invocation, state, and tool integration; keep authority and side effects with the host. Review whether removing a proposed layer leaves the application intact, simplify, and document what is verified versus still proposed.

For example, in an application already using Mastra to run a support agent, first inspect its existing agent definitions, tools, state and evaluation hooks. For a requested response-quality improvement, agree on sample support requests and acceptance evidence; adjust that agent's bounded context/prompt/tools and add host-owned fixtures or checks. Keep Mastra's execution path and existing deterministic checks. Introduce an ADW only if repeated work demonstrates a need for explicit phases; do not scaffold a Workbench tool runtime around Mastra.

## 1. Observe

**Read what is there. Change nothing.** This stage is safe in any repository, needs nothing built, and is where most of the value is.

What to establish:

- **The instruction surface.** Which files are loaded, from where, and at what point in a run. A rule in a file nothing loads is not in force, and finding that out is usually the first surprise.
- **What already executes.** Hooks, scripts, CI, a plugin. Anything that runs without being asked is part of the layer whether or not it is documented as such.
- **The de-facto workflow.** What people actually do, in what order, and where they hand off. Not what a document says they do.
- **What is deferred.** Every step that invokes a workflow this repository does not own. Each is a dependency you inherit the defects of, and the list is the specification for anything later replacing it.
- **What enforces what.** Run the [gate enforcement census](08_GATE_ENFORCEMENT_CENSUS.md). A repository can look thoroughly governed and have nothing that would stop a confident wrong answer.

**Report what you did not read.** A survey that quietly stops is worse than a short one, because the gaps are invisible in the result.

**Earns the next stage:** you can name the layer's entry points, its conventions and its unknowns.

## 2. Scaffold

**Only where nothing exists.** Add the local folders and the record conventions; never overwrite an instruction file, a prompt, or a convention that is already in use.

The test before writing anything: **would this change what an existing run does?** If yes, it is not scaffolding, it is stage 4, and it has not been earned yet.

Start with the smallest set that makes the next run legible -- somewhere for notes, somewhere for run artifacts, and one honest record of what was observed. Not a framework. [`templates/layout/`](../templates/layout/README.md) is the starting point, and it is deliberately near-empty, because a template arriving pre-populated with someone else's facts reads as true.

**Earns the next stage:** a run produces records somebody can read afterwards.

## 3. Wrangle

**Work with the existing layer, non-destructively.** Wrap what is there rather than reaching inside it. A deferral that names its dependency at the call site is the whole technique: the borrowed mechanism keeps working, and the boundary is now visible.

This is where the inherited defects surface, because you are finally running the thing deliberately rather than incidentally. **Record them where the team can see them**, not in a local folder that dies with the machine.

Two rules hold this stage together:

- **Gate on the side effect, never on the report.** A wrapped workflow returns whatever it chose to say. Read back the artifact, the record, the state that changed.
- **Do not improve what you are wrapping.** The moment a wrapper starts correcting its callee, two definitions of the same behaviour exist and they drift.

**Earns the next stage:** the wrapped mechanism has been read, its defects are written down, and a real run has depended on it more than once.

## 4. Replace

**Extract the wrapped mechanism into code this repository owns.** Only now -- this is the stage the previous three exist to inform.

A deferral costs a typed return, a caller-chosen model, per-call overhead, and **the capability to build the thing yourself**. What is deferred is not learned, and what is not learned cannot later be extracted, so a deferral left alone quietly removes the condition for its own removal. Stage 3's defect list is what a replacement has to satisfy; without it, replacement is a rewrite from imagination.

Replace **one** thing, keep the old path runnable, and compare them on real work before removing anything. A replacement that has never been run beside the thing it replaces is a hypothesis.

**Earns the next stage:** something meaningful runs on code this repository owns, and its results have been compared against what it replaced.

## 5. Factory

**Compose what now exists into workflows, and make them operable by an agent rather than only by a person.**

The [software factory](../foundations/Agentic_Engineering/10_THE_SOFTWARE_FACTORY.md) has the substance; what belongs here is the entry condition. A factory built before stages 1 through 4 is an architecture built against a guess, and the tell is that its abstractions describe the tool rather than the work.

**This stage is never finished and does not need to be.** A repository sitting permanently at stage 3 with a clear-eyed defect list is in better shape than one at stage 5 whose gates nothing enforces.

## Stopping early is a legitimate outcome

**Every stage is a place to stop.** The stages are not a maturity ladder to climb, and treating them as one produces exactly the speculative architecture this package argues against.

Stop when the next stage costs more than the problem it would solve. Record which stage the repository is at and why it stopped there -- so the next person inherits a decision rather than an apparent abandonment.
