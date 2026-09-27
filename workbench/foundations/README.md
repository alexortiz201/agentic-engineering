# 🏛️ Foundations -- the discipline

Five areas, in the order they depend on each other. Read the one the task needs; that is the point of the split.

| | Holds | Read it when |
|---|---|---|
| 🏗️ [`Software_Engineering/`](Software_Engineering/README.md) | Proper engineering -- the practice agentic work is built on top of and does not replace | You need the substrate: what the lifecycle is, what a good interface is, why a seam matters |
| 🚀 [`DevOps/`](DevOps/README.md) | The environment the code runs in and the path it takes to get there -- isolation, credentials, release, rollback | You are sandboxing an agent, touching an environment, or shipping |
| 🤖 [`Agentic_Engineering/`](Agentic_Engineering/README.md) | What changes when agents and deterministic code perform the work | You are designing, running, or verifying agentic work |
| 🔌 [`Harness_Engineering/`](Harness_Engineering/README.md) | Treating the runtime that executes agents as a variable rather than as ground | You are deciding what a workflow may assume of its harness, or making one run on two |
| 🎓 [`Coaching/`](Coaching/README.md) | How to teach this work, as distinct from how to do it | You are in `coaching` mode, or developing someone's judgment |

**Agentic Engineering is a superset of engineering, not a replacement for it.** Everything in `Agentic_Engineering/` assumes the practice in `Software_Engineering/` still holds, and says so where it leans on it. A workflow gets multiplied hundreds of times once it works, which makes a bad interface or a hidden coupling more expensive than it was when a person ran the step by hand -- so the classical concerns matter more here, not less.

## The rule that keeps this folder portable

Everything here is standalone: it describes how to run a bounded, observable, repairable software-delivery loop with agents, and it does so **without naming a company, a repository, a tracker, a model or a harness.**

That constraint is the point. Anything that touches a specific project, toolkit or filesystem layout lives outside this folder and is expected to change often. What is in here should change slowly, and only for reasons that would hold at any organization.

**No harness, product or vendor is named anywhere here** -- `Harness_Engineering/` included, and especially there. What a particular harness actually does lives in `harnesses/`, outside this folder, because it changes as often as those products do.

**This folder links inward, never outward.** A file here may reference another file here, including across areas -- that is what lets the agentic side name the engineering practice it rests on. What it may not do is reach outside `foundations/`. The discipline names *concepts* -- a run-state record, a gate-decision record, a design document -- and whatever adopts it decides which file is which. That mapping is the adopter's business, and keeping it out is what makes this folder liftable.

The canonical vocabulary is read before any of this, from the package root. Nothing here points back at it, because by the time these files are read the spelling is already in context.

## Evolving this folder

1. **Standalone or it does not belong.** If a statement can only be justified by one company's tooling, one repository's layout, or one vendor's product, it goes in that project's own docs and not here. A worked example drawn from real work is welcome -- the *rule* it illustrates has to generalize.
2. **Vocabulary changes land everywhere at once.** A term is renamed in the canonical vocabulary and in every place that reads or writes it, in the same change. A half-applied rename is worse than the original name, because it fails silently at the consuming phase.
3. **Two questions place anything.** First: would this still be true if you removed agents? If no, it is `Agentic_Engineering/` -- unless it is about the runtime that executes them rather than about the work, which is `Harness_Engineering/`. If yes, ask the second: does it concern the code itself, or the environment it runs in and the path it takes to get there? The code is `Software_Engineering/`; the environment and the path are `DevOps/`. Teaching method is `Coaching/` regardless of subject.
4. **A topic earns a file when it is worked in depth, not when it is mentioned.** Keep the first mention shallow where it comes up. When the work actually turns to that topic, extract it and leave the mention behind as a reference. Splitting early produces a thicket of stubs, and the reason to split at all is so a reader loads only what the task needs.

When a lesson arrives from real delivery, the question to ask is not "is this true?" but **"is this true anywhere?"** The specifics stay with the project; only what survives that question comes here.
