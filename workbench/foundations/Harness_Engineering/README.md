# 🔌 Harness Engineering -- treating the runtime as a variable

What a harness is, what a workflow may assume of one, and how to keep the two separable.

**A harness is the thing that actually runs an agent** -- it resolves a model, holds a conversation, exposes tools, applies whatever permissions it has, and hands back a result. It is not the agent and it is not the workflow. Confusing the three is what produces work that cannot move.

**This area names no harness.** The rule that keeps `foundations/` portable bars naming a company, repository, tracker, model or harness, and a document about harnesses is exactly where that rule is most likely to be broken and most important to keep. What each product actually does belongs outside `foundations/`, in `harnesses/` at the package root, where it can change as often as those products do.

## What is in here

| File | Answers |
|---|---|
| 📐 [`01_THE_CAPABILITY_SURFACE.md`](01_THE_CAPABILITY_SURFACE.md) | What a workflow may assume of any harness, and what it must not |
| 🔁 [`02_PORTABILITY.md`](02_PORTABILITY.md) | How one workflow comes to run on two harnesses, and what that costs |
| 💉 [`03_INJECTION_POINTS.md`](03_INJECTION_POINTS.md) | Where text can enter a run, what each position costs, and which choices fail silently |
| ⏱️ [`04_MECHANIZED_TRIGGERS.md`](04_MECHANIZED_TRIGGERS.md) | Which standing rules the runtime should fire, which ones only a reader can notice, and why the split is a precondition for repeatable execution |

## The argument for taking this seriously

A workflow that assumes its harness is a workflow that dies with it. That sounds like a distant risk and is not: harnesses are young, they change quickly, and the one an organization has standardized on is rarely the one an individual would choose. Portability is what lets those two facts coexist.

The cost of ignoring it is not paid at porting time, which is the intuition that makes it easy to ignore. It is paid continuously, because a workflow built against one harness's conveniences **encodes assumptions nobody wrote down** -- that a hook exists, that a configuration file is read, that a sub-agent can be spawned. Those surface as failures on the second harness, long after the decision that caused them.

## The three seams

Almost all of portability is holding three things apart, and almost all of the difficulty is that a harness will happily let you merge them.

- **The controller is code, and code is portable.** Sequencing, state, gates and failure routing belong in a program that runs anywhere a runtime does. A controller expressed as harness configuration is not a controller, it is a feature request.
- **The prompt is a file, and files are portable.** What an agent is asked to do is text. Text moves. A prompt that only exists inside a harness-specific construct has been made unportable for no gain.
- **The harness sits behind one adapter.** Every call into it goes through a single named boundary -- which is a [module](../Agentic_Engineering/primitives/module.md) in the ordinary sense, wrapping a foreign system. Two harnesses means two implementations of one interface, not two workflows.

**The test for whether the seams are real:** can you name the file you would have to change to run on a different harness? If the answer is "several, and I would have to look", the adapter does not exist yet.

## Control over the harness is a ceiling on specialization

A harness you cannot modify decides, on your behalf, what your agents are able to do. Everything you might specialize -- a purpose-built agent for one domain, a verification pass that always runs, a delegation shape, a fallback when a model is unavailable -- exists only if the harness admits it. **The degree of control you hold over the harness therefore bounds the ceiling of what you can build, regardless of how good your workflows are.**

That is not an argument for building one. It is an argument for knowing which ceiling you are under, because the cost of the constraint is invisible until you try to exceed it and discover the attempt was never possible. A harness that cannot be extended is a fine place to start and a poor place to finish, and the honest question is whether the thing you cannot do yet is a thing you will need.

**Specialization is where the advantage is.** A general-purpose agent is available to everyone; an agent shaped around one domain's failure modes, conventions and checks is not. Where the harness permits it, that shaping is the highest-return investment available -- and where it does not, the [capability surface](01_THE_CAPABILITY_SURFACE.md) is how you find out before committing to it.

## Harness control substitutes for model capability

The package already says a stronger model cannot supply a check that does not exist. The inverse is also true and is the more actionable half: **a better harness can make a weaker model sufficient.**

A model that would wander, skip steps or declare victory early can be held to a task by structure around it -- a gate that refuses to let the next tool run until the work is recorded, a loop that will not exit while an item is open, a tool set narrow enough that the wrong move is unavailable. None of that changes the model. It changes what the model is *able* to do next, which is frequently the same outcome at a fraction of the cost.

The practical consequence is a purchasing decision most people make backwards. Reaching for a stronger model is the expensive fix and the first one tried; tightening the harness is the cheap fix and the last. **When a run disappoints, the question is not which model to upgrade to but which constraint was missing** -- and the answer is often something that costs nothing per run, forever.

The limit is worth stating too, because the claim is easy to over-read. Structure cannot supply capability the model does not have; it can only prevent capability it does have from being wasted. A task genuinely beyond a model stays beyond it however well the harness is built.

## What conformance means here

A harness is not evaluated on its feature list. It is evaluated against [the capability surface](01_THE_CAPABILITY_SURFACE.md) -- the set of things a workflow is allowed to depend on. A harness either satisfies a capability, satisfies it differently, or does not satisfy it.

**The gaps are the useful output.** A feature comparison produces admiration; a conformance report produces a work list. Where a harness fails to satisfy a capability, that is either something to build on top of it, or a constraint the workflow must be designed around -- and both are decisions worth making deliberately rather than discovering at runtime.
