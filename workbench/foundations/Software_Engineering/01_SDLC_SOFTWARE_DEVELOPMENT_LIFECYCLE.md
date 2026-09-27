# 📐 The software development life cycle

## Name it correctly, because the name decides where you look

**Plan, build, test, review, ship.** That is the software development life cycle, and it is what engineers did by hand long before any of this was automated. Someone decided whether a request was a feature, a defect or a chore. Someone wrote the plan. Someone implemented it. Someone tested it. A second person reviewed it. Then it shipped.

Nothing in that sequence has been replaced. A new kind of actor was added to it, and the phases each actor performs can now be executed by an agent, by deterministic code, or by a person. **That is the entire change.** The lifecycle is the thing being automated; it is not the thing being invented.

Getting this wrong is expensive in a specific way: it sends attention to the wrong layer. If the lifecycle is understood as a familiar process now partly performed by agents, the design questions are the ones engineering already knows how to ask -- what is the interface between these two phases, what does this phase require of its input, how is its output checked, what happens when it fails. If it is understood as something new, those questions get skipped, and are rediscovered later as defects.

## Why "loop engineering" is the wrong name for it

A name has appeared for this work: *loop engineering*. It is a rebrand of the software development life cycle, and it is worth dismantling rather than adopting, because it is both unclear and smaller than the thing it claims to describe.

The loop it refers to is real but tiny. A check runs. If it fails, its output routes back to the step that produced the code; if it passes, execution proceeds. That is a condition and an edge -- **one control-flow construct, inside one phase, of a lifecycle with many.** Naming the whole discipline after it mistakes a part for the whole.

**The reductio is the fastest way to see it.** If the loop earns its own named engineering discipline, so does every other construct in the lifecycle. Condition engineering. Function engineering. If engineering. Throw engineering. Exception engineering. The list is as long as the language, and nothing is learned by extending it. A name that generalizes into absurdity was not describing a real category.

What it obscures is the part that actually carries the difficulty. The loop is easy; routing a failure back to its producer is a few lines. The hard parts are everywhere else: deciding which workflow a piece of work belongs to, what each phase requires of its predecessor, where a human is genuinely required, what evidence a transition demands, what happens to a run that dies halfway. None of that is a loop, and a vocabulary built around loops has no word for any of it.

The correct framing is the one the lifecycle already gives. **Work enters, a defined workflow runs, results come out.** Each phase is some combination of deterministic code, bounded agent calls, and deferrals to workflows the author does not own. Design the workflow, not the loop.

## The three actors, and what each is actually good for

Value in engineering work is now created by three actors, and knowing where to place each is most of the skill.

| Actor | Good at | Cost | Reliability |
|---|---|---|---|
| **Code** | Sequencing, checks, transformation, routing, enforcement | None per execution | Highest by a wide margin -- deterministic, and identical on every run |
| **Engineer** | Intent, tradeoffs, risk acceptance, judgment on ambiguity | Highest, and not scalable | High, and the only actor that can authorize |
| **Agent** | Research, synthesis, planning, scoped implementation, diagnosis, review | Per invocation, in tokens and latency | Lowest -- capable, and non-deterministic |

**There is also an ownership asymmetry, and it is easy to miss.** Code is owned: it can be read, changed, pinned and relied on to behave the same next year. A model is rented -- it is versioned by someone else, deprecated on someone else's schedule, and changes behaviour without asking. Work expressed as code is durable in a way work expressed as a dependence on a particular model's judgement is not.

**Code is the underweighted one.** It is free per execution, it cannot hallucinate, it behaves identically every time, and it runs at a speed neither other actor approaches. When a step can be expressed as code, expressing it as an agent call buys nothing and costs reliability. The habit worth building is to ask of every step: *does this require judgment?* If it does not, it is code.

This is also why "use an agent for it" is not an architecture. A workflow made entirely of agents is slower, more expensive, and less predictable than the same workflow with its mechanical steps written as code -- and it is harder to test, because a deterministic step can be asserted on and a probabilistic one can only be sampled.

## The engineer shows up at the ends

In a well-built workflow the engineer appears at the **beginning** and the **end**: stating the intent, and accepting the result. Planning and review. Everything between them is performed by code and agents.

That shape is the measure of whether the work is scaling. As a workflow grows, it should absorb more code and more agent calls, and **not** more engineering time spent inside the run. Engineering time that grows with each execution has been spent in the wrong place; the work that compounds is the work spent on the workflow itself, which pays out on every subsequent execution.

The two ends are not symmetric and neither is optional. The beginning is where ambiguity gets resolved, and ambiguity that survives into a run gets amplified by everything downstream. The end is where the result is accepted, and acceptance is an authority decision that no other actor can make for itself.

## The practices that survive, and matter more

Encoding a lifecycle does not retire classical engineering practice. It multiplies whatever practice is already there, good and bad, by the number of times the workflow runs.

- **Separate the code from the agent.** A mechanical step invoked from inside an agent's own instructions is still the agent running it, which means nothing independent observed the result. Run the check as code, read its exit status as code, and hand the failure back as input. The distinction sounds pedantic until something needs testing: a step that only exists inside a prompt has no interface to test against.
- **Open to extension, closed to modification.** The rate of change around this work is high and rising -- models, tools, interfaces and conventions all move -- and the way to survive that is to make adding the cheap operation and rewriting the expensive one. A system whose behaviour lives in a long chain of conditionals has to be *modified* for every new case, and every modification risks the cases that already worked. One whose behaviour lives in pluggable parts is *extended* instead. This was always good design; what changed is that the thing navigating your structure is now frequently an agent, and a structure that is expensive for a person to reason about is expensive for an agent too, on every run.
- **Isolatable, decoupled, one clear interface.** These decide whether a phase can be verified on its own. A phase that can only be exercised by running the whole workflow can only be debugged by running the whole workflow.
- **Walk it by hand before encoding it.** Run the lifecycle end to end yourself first -- step into each phase, watch what each one actually needs from the one before, do the review, do the ship. A workflow designed from an imagined process encodes the imagination. This is also the cheapest time to discover that two phases disagree about their interface.
- **Start simple and let pressure add the parts.** The smallest useful workflow is a step that does work and a check that grades it. Add a phase when something forces it, not in anticipation.

## Knowing, rather than not looking

There is a failure mode worth naming because it is easy to mistake for this discipline: shipping work without understanding how the system produced it, on the strength of it appearing to work.

The distinction is not how much of the work a person performed by hand. It is **whether the system's behavior is known**. Not looking because the mechanism is understood, the checks are real, and the failure modes have been exercised is the goal. Not looking because nobody has looked is the failure. The two are indistinguishable from the outside and identical right up until the first failure, which is exactly why the difference has to be established in advance, by construction and by evidence, rather than inferred from a run that happened to go well.

---

How this lifecycle is executed when agents and code perform its phases -- the states, the gates that guard each transition, and the evidence a transition requires -- is in [`Agentic_Engineering/02_WORKFLOW.md`](../Agentic_Engineering/02_WORKFLOW.md). How workflows are composed and sized is in [`Agentic_Engineering/06_ADW_COMPOSITION.md`](../Agentic_Engineering/06_ADW_COMPOSITION.md).
