# 🏭 The software factory

A **Factory** is a higher-order composition of primitives, ADWs, deterministic machinery, intelligent invocations, knowledge, state, integrations, gates and/or other capabilities that can repeatedly produce a meaningful class of outcomes. Not every factory needs every component. Composition and repeatable production define it; it retains the contracts and authority boundaries of the units it composes.

**Composition/capability and scope/reusability are independent axes:** Primitive → ADW → Factory describes composition; project-specific → reusable → portable/generalized describes scope. A project-specific software factory is valid. It may later be generalized, but cross-project portability is not required.

**Supersession:** the former requirement that a factory must deploy into another subject is superseded by explicit human architecture disposition. Repeated production within one project is sufficient; cross-project portability is a separate property of an artifact or its construction tooling. A factory is not merely a multi-agent system, a large ADW, a portable template, a cross-project abstraction or a particular runtime. Use a primitive or ADW instead whenever it meets the need.

## What it is for

**Leverage on intent.** A system carries work through steps that would otherwise be typed, watched and corrected repeatedly. A prompt can express that intent, but prompt shape and number of agents do not define a factory.

Judge the investment across repeated useful outcomes, including runs within the same project, rather than the run in front of you. **Design for repeatable production**, not a successful demo. More composition or autonomy is not inherently more value.

## Engineering qualities

Observability, customization and reuse support reliable production and improvement. They are engineering guidance, not a requirement to transcend a project.

**Observable**, in the sense [defined here](11_OBSERVABILITY.md). Every run exposes what it did: effective model, prompt and tools for each intelligent invocation; commands/results for deterministic work; what each phase cost and produced; and what each gate decided. **What is not measured cannot be improved**, and a system whose behaviour can only be inferred from its output is one whose defects can only be found by suffering them. Observability is not a dashboard; it is the precondition for the improvement loop existing at all -- and the loop only closes if the observations **accumulate somewhere**, which is what a [run history](primitives/run_history.md) is for. Retained per-run artifacts provide the detail; history makes runs comparable.

**Customizable.** Resolve Core Four for each intelligent invocation, not for purely deterministic steps. Honor the owning project's tests, thresholds, quality bars and conventions. Reusable construction tooling can supply starting points, not impose another project's solution.

**Reusable.** Repeated production within one subject earns the investment. Cross-project reuse or portable construction templates may be valuable later; neither changes the composition level nor qualifies a system as a factory on its own.

## Agentic access

Where agent operation is useful, expose discoverable bounded operations so an agent can select and invoke the right capability without a person translating each request. Agent-operability is a construction choice, not the defining criterion for a factory.

**Agents only command what they can reach.** A capability that exists but is not exposed programmatically does not exist as far as the factory is concerned, and the gap shows up as a specific, diagnosable waste: work an agent performs **only because** it lacks direct access to the thing it needs. Re-deriving state nothing exposes, driving an interface built for a person because no programmatic one exists, reconstructing by inference what could have been read. Every one of those is effort spent on the absence of an interface rather than on the task, and it is paid again on every run.

The reason is the same reason the factory exists. If a person must drive it, the factory's throughput is bounded by that person's typing, and the leverage stops at whatever they can personally supervise. **Anything routinely done by hand is a candidate for being encoded**, but keep human intent, risk acceptance and consequential approvals where authority requires them. Use intelligence for judgment and code for specified behavior.

The practical shape is progressive disclosure: a small always-loaded description of what the factory is and what it can do, plus a routing table from a stated request to the detailed procedure for it, with the detail loaded only when that path is taken. That is the same context discipline applied to operating the system rather than to doing the work -- and it matters more here, because the operating surface is loaded on every single run.

**The same test applies to what the factory chooses to depend on.** A capability reachable only through an interface built for a person is one the factory pays a driver for -- on every run, indefinitely, in a form that breaks whenever that interface is restyled. That cost belongs in the selection decision, where it is cheap to act on, rather than surfacing after the dependency is load-bearing, where it is not: a programmatic surface can be wrapped, narrowed and defaulted from outside, and an absent one can only be simulated.

**The absolute form of that rule is wrong, and is worth refusing explicitly.** Discarding every candidate without a programmatic surface assumes a substitute always exists, and sometimes the capability is available nowhere else. The honest move there is to take the dependency, record the driver as a standing per-run cost rather than a one-off integration, and hold it behind a single boundary -- so that the day a programmatic surface appears, adopting it is a local change instead of an excavation.

## For software delivery, output is shippable work, not merely working code

A factory that emits functionally-correct output which somebody then has to rewrite has not produced output. It has produced **rework**, and rework is worse than nothing, because the reviewer now pays the cost of reading it as well as the cost of redoing it. The leverage argued for above is a claim about work that lands, and output that does not land is not a smaller amount of leverage -- it is negative.

So the conventions a subject already holds are a **first-class constraint on generation, not a polish pass applied afterwards.** Stated where it is most visible, on generated interface work:

- **Compose what already exists before authoring anything new.** A factory that reaches for a fresh component whenever one is not immediately to hand grows a second, parallel vocabulary next to the design system -- each piece defensible alone, the set incoherent.
- **Take styling from the declared tokens rather than from literal values.** A hard-coded colour is not a small deviation; it is a value that will not move when the system moves, and it is invisible until the day the system does.
- **A genuinely new shared component arrives with the artifacts the subject expects of one** -- its stories, its coverage, its documentation entry. Arriving without them puts it *beside* the system rather than *in* it, which is how a design system acquires a shadow.
- **Written copy is governed too.** Voice and product vocabulary constrain the words a factory emits exactly as code conventions constrain its syntax, and copy is the output most often treated as exempt.

The same logic runs well past interface work: the factory honours the codebase's conventions, the team's delivery gates and the shape its tracker expects. **Whatever a reviewer would have sent back is a constraint on generation**, and the question to ask of any convention is not whether it is important but whether its absence would cause the work to be returned.

**This is why the constraint belongs in the factory rather than in a review gate.** A gate that rejects off-convention output is correct and arrives too late: the work is already made, the run is already paid for, and the repair is a second pass that the first pass could have avoided by loading the convention as a [context asset](../../LANGUAGE.md) before generating. Catching it later is strictly more expensive than not producing it, and at a thousand runs the difference is the whole argument.

**The honest limit.** Conventions loaded as standing context are weighted, not enforced -- the same limit every instruction carries. Where a convention genuinely must hold, it is a gate as well, and the two are complements: the context asset is what makes the gate rarely fire, and the gate is what makes the context asset's failures visible instead of silent.

## Running it unattended is an economic decision, not only a safety one

The autonomy ladder governs whether a factory is *safe* to run without supervision. A second question governs whether it is *worth* it, and skipping it produces systems that are trusted, harmless and pointless.

Three levels, in order, and each is a bad place to stop:

1. **Spend.** Run enough work through it to learn anything at all. Necessary, and on its own it is just consumption.
2. **Make the spending useful.** Establish that what comes out is worth having -- work that would otherwise have been done by hand, done at a standard that holds.
3. **Attribute the value.** Know what that output is worth, well enough that more spending is a decision rather than a hope.

The attribution is **recorded**, in the append-only record described at [`primitives/run_history.md`](primitives/run_history.md) -- authored by whoever can make the judgement, naming its basis, and coarser than a single run. A condition with nowhere to record its satisfaction can only ever be claimed.

**Only after the third does continuous running make sense.** A factory that runs on a schedule without producing attributable value is a cost with a timetable, and it will be discovered as one eventually, by someone who cancels it along with everything next to it.

The inversion is worth stating because it reads as counterintuitive: once value is attributed, **a rising bill is a signal of throughput rather than a problem to be managed.** Before it is attributed, the same rising bill is only a rising bill. Spending more is not a strategy; spending more *on work whose value is known* is.

## What a factory is not

**It is not a rung on the autonomy ladder.** The factory is the thing; the rungs describe how much of it has earned the right to run unattended. A factory can be excellent and still correctly sit at the lowest rung because nothing about it has been proven yet, and conflating the two produces a system whose maturity is asserted from its architecture rather than from its record.

**It is not a multi-agent orchestration.** Parallel agents are one technique inside it. A factory that is only agents has declined the cheapest, fastest and most reliable actor available to it, for no reason but fashion.

**It is not finished.** A factory is the thing that is improved, which is why observability is listed first: the loop that improves it is fed by what it reports about itself.
