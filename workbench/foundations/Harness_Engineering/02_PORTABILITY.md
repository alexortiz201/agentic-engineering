# 🔁 Portability

How one workflow comes to run on two harnesses.

## Write once, adapt twice

The shape that works: **one controller, one set of prompts, two adapters.** The controller sequences phases, holds state, enforces gates and routes failures, and it does none of that through harness features. The prompts are files. The adapter is the only code that knows which harness is present.

The shape that does not work is two copies of the workflow that are meant to stay in step. They do not stay in step. A fix lands in one, the other is remembered later or not at all, and the divergence is discovered when the second one fails -- which is exactly the defect a half-applied rename produces, in a larger form.

**Generating two artifacts from one definition is fine; maintaining two definitions is not.** If a workflow must be emitted per harness, emit it -- but the source of truth is the single definition, and the emitted artifacts are build output nobody edits by hand.

## Port the mechanism, not the configuration

The most common porting mistake is to look for the other harness's equivalent of a specific feature. That question often has no answer, and asking it makes the port look impossible when it is not.

**Ask what the feature was achieving, then ask how this harness achieves that.** A gate implemented as a lifecycle hook on one harness is a gate implemented as a controller step on another -- the mechanism is "nothing proceeds until this check passes", and both can do that. A packaged capability loaded on demand is, underneath, an instruction plus some tooling; both parts move even when the packaging does not.

This reframing also tells you what is genuinely lost. If the mechanism cannot be reproduced at all, that is a real gap for the [capability surface](01_THE_CAPABILITY_SURFACE.md) and a decision to make, rather than a translation to keep hunting for.

## Where the gate lives decides how much moves

A gate enforced by the harness is enforced only where that harness is. A gate enforced by the controller is enforced everywhere the controller runs, and it is testable without the harness present.

That argues for the controller as the default home for anything that must actually hold, with harness-native enforcement as an addition rather than the mechanism. **Two enforcement points are not redundant** when one of them is the only one that travels.

This is the same reasoning that puts required checks outside the thing being checked: a control that exists at the discretion of what it constrains is not a control.

## A workflow must not depend on the environment that authored it

The machine a workflow was written on carries things no other machine has: the author's local configuration, their personal preferences, their working notes, whatever they had installed. None of it travels, and a workflow that reads any of it is broken everywhere else.

**The failure is quiet, which is what makes it expensive.** An absent configuration file usually reads as *no preferences* rather than as an error, so the workflow does not fail -- it behaves differently, correctly in one place and wrongly everywhere else, with nothing reporting the difference.

Three honest homes for anything a workflow needs. It **travels with the workflow**, committed alongside it. It **lives in the target**, as a file the target owns, ignored if it is personal, with a committed example beside it. Or it is **discovered at runtime**, which is the only correct answer for facts about a machine the author has never seen -- a new environment's state is unknown by definition, and you cannot configure what you have not yet found.

The distinction that settles most cases is **preference against fact**. Which tool someone likes is a preference and belongs to them. Whether that tool is installed is a fact and must be probed.

## The cost, stated plainly

Portability is not free and pretending otherwise is how it gets abandoned halfway.

- **An adapter is indirection**, and indirection makes the simple case longer to read. It pays when there is a second implementation, and not before -- which is why an adapter written before the second harness is a guess, and an adapter written at the moment of the second harness is a refactor with a known target.
- **The surface constrains the first harness too.** Refusing a convenience that only one harness offers is a real cost paid immediately for a benefit collected later.
- **Two harnesses means testing on two**, or the second claim is untested. A workflow said to run somewhere it has never run is a documentation claim, which is near the bottom of the evidence ranking for good reason.

The honest position is that portability is worth its cost when there is a concrete second target, and premature when there is not. **The way to keep the option open cheaply is the three seams** -- controller in code, prompts in files, harness behind one boundary -- because those are good design regardless, and they are what makes the adapter a small job later instead of a rewrite.
