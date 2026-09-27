# 🏭 The software factory

The composed set of workflows, together with the code and agents that run them, for one subject.

## What it is for

**Leverage on a prompt.** That is the whole purpose, and stating it plainly is what keeps a factory from becoming an end in itself. One sentence of intent enters, and a system of code and agents carries it through work that would otherwise be typed, watched and corrected step by step.

**How much leverage is proportional to what has been invested in it.** At the low end, a few agents chained with some configuration do slightly more than one would. At the high end, code and agents together carry work through end to end without a person in the loop, as well as that person would and sometimes better. There is no threshold between those; there is a continuum, and where a factory sits on it is a function of the work put into its workflows.

This also gives the honest answer to "is this worth building yet". A factory is worth what it saves across every future run, so the calculation is never about the run in front of you. **Design for the thousandth execution, not the first or the tenth.** A workflow that is barely worth the effort once is obviously worth it a thousand times, and one that cannot survive a thousand runs was never a factory, only a long prompt.

## The three properties

A factory that lacks any one of these stops being a factory and becomes a workflow that happened to work once.

**Observable**, in the sense [defined here](11_OBSERVABILITY.md). Every run exposes what it did: which model ran each phase, the prompts as they were actually compiled, the tools that were available, what each phase cost, what it produced, and what each gate decided. **What is not measured cannot be improved**, and a system whose behaviour can only be inferred from its output is one whose defects can only be found by suffering them. Observability is not a dashboard; it is the precondition for the improvement loop existing at all -- and the loop only closes if the observations **accumulate somewhere**, which is what a [run history](primitives/run_history.md) is for. Every other artifact a run writes dies with that run.

**Customizable.** Every phase resolves its own context, model, prompt and tools. The defaults shipped with a factory are the author's, and the author's tests, thresholds and quality bars are not the adopter's -- so a factory that cannot be re-specified per phase forces its origin's judgement onto every subject it touches.

**Reusable.** It deploys into another subject. A factory that only works where it was born is not a factory; it is one project's workflow, and the investment argument above never pays back because there is no second use to amortise it against.

## Agentic access

A factory must be operable **by an agent**, not only by a person. That means its operations are discoverable, its inputs are stateable in a sentence, and an agent can select and run the right workflow without a human translating intent into invocations.

**Agents only command what they can reach.** A capability that exists but is not exposed programmatically does not exist as far as the factory is concerned, and the gap shows up as a specific, diagnosable waste: work an agent performs **only because** it lacks direct access to the thing it needs. Re-deriving state nothing exposes, driving an interface built for a person because no programmatic one exists, reconstructing by inference what could have been read. Every one of those is effort spent on the absence of an interface rather than on the task, and it is paid again on every run.

The reason is the same reason the factory exists. If a person must drive it, the factory's throughput is bounded by that person's typing, and the leverage stops at whatever they can personally supervise. **Anything routinely done by hand is a candidate for being taught**, and the only work that should remain manual is building the system that does the rest.

The practical shape is progressive disclosure: a small always-loaded description of what the factory is and what it can do, plus a routing table from a stated request to the detailed procedure for it, with the detail loaded only when that path is taken. That is the same context discipline applied to operating the system rather than to doing the work -- and it matters more here, because the operating surface is loaded on every single run.

**The same test applies to what the factory chooses to depend on.** A capability reachable only through an interface built for a person is one the factory pays a driver for -- on every run, indefinitely, in a form that breaks whenever that interface is restyled. That cost belongs in the selection decision, where it is cheap to act on, rather than surfacing after the dependency is load-bearing, where it is not: a programmatic surface can be wrapped, narrowed and defaulted from outside, and an absent one can only be simulated.

**The absolute form of that rule is wrong, and is worth refusing explicitly.** Discarding every candidate without a programmatic surface assumes a substitute always exists, and sometimes the capability is available nowhere else. The honest move there is to take the dependency, record the driver as a standing per-run cost rather than a one-off integration, and hold it behind a single boundary -- so that the day a programmatic surface appears, adopting it is a local change instead of an excavation.

## Its output is shippable work, not merely working code

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
