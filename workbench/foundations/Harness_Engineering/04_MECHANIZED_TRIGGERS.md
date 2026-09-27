# ⏱️ Mechanized triggers

A standing rule of the form **"whenever Y happens, do X"** has two possible homes. It can be written into what the agent is told and left to the agent to notice, or it can be executed by the runtime that runs the agent. The two look equivalent while there is one rule. They are not equivalent, and the gap between them widens with every rule added.

**A remembered trigger fires with a probability. A mechanized one fires.** Everything below is the consequence of that one difference.

## The entry to this is a count, not a failure

The observation that leads here is almost always the same: *there are now too many of these to keep in mind.* That observation is accurate and worth taking at face value.

Below some small number, remembering works. The rules are few, each is distinctive, and the moment one applies is often the moment it was written about. **Above that number recall is the bottleneck, and better writing does not move it** -- remembered triggers compete for the same attention, so each one added lowers the odds of every other one firing. Nothing else in this discipline degrades that way: a gate does not become less reliable because a second gate was added next to it.

So the first signal to act on is arithmetic rather than incident. **When the set of standing rules is larger than can be held at once, the set has outgrown its substrate**, and the individual rules are not the thing that is wrong.

## Why this is a precondition and not an optimization

The recall framing undersells it, because the cost is not paid once per rule. It is paid once per run, indefinitely.

A [factory](../Agentic_Engineering/10_THE_SOFTWARE_FACTORY.md) is designed for its thousandth execution rather than its first, and its leverage comes from steps that run at multiplied scale with nobody supervising each one. **A step that depends on an agent noticing a trigger is not a repeatable step.** It has a hit rate, the hit rate is unmeasured, and its failures are silent -- the run where the rule did not fire looks exactly like the run where the rule did not apply, so nothing in the output distinguishes them and nothing downstream complains.

That makes moving the mechanizable triggers into the runtime **a condition of factory-grade execution**, not a convenience collected along the way. A workflow whose steps include "and then the agent remembers to do this" cannot be multiplied, however good the rest of it is.

## The failure is not forgetting the rule

Two distinct failures hide under "the rule did not happen", and they have different remedies.

- **Not knowing the rule.** Fixed by writing it down, and genuinely fixed. This is what standing instruction is for.
- **Not noticing that the moment arrived.** Not fixed by writing it down, and not fixed by writing it more emphatically either.

Nearly every miss of a well-established rule is the second kind, and the tell is that the rule can be recited correctly straight afterwards. **Rewriting is the visible remedy and it treats the wrong failure.** A rule restated more than once is not badly written; it is badly placed, and the second rewrite is the signal to change substrate rather than wording.

**A worked case.** A rule requiring every local record to be reconciled at a declared stopping point was written, restated after being missed, widened to name more stopping points, and finally moved into the always-loaded standing instruction. It was still missed, and a person had to ask for it out loud. By then its own text contained the diagnosis -- that the failure was not forgetting the rule but not noticing the trigger -- and that diagnosis sat there, correct and unacted on, through every one of those rewrites. **A correct diagnosis pointing at the substrate was read, repeatedly, as an argument for writing it better.**

## What can be mechanized, and what cannot

Not every trigger is an event a runtime can observe, and pretending otherwise produces mechanisms that fire on the wrong thing.

| A runtime can observe | Only a reader can recognise |
|---|---|
| A session starting or ending | A unit of work actually finished |
| A turn ending | A question actually answered |
| A tool about to run, or having run | A premise having stopped being true |
| A command matching a pattern | A claim now due for reconciliation against its source |
| A file changing, or an interval elapsing | A decision having been made rather than discussed |

**The two columns are complements, not alternatives.** The right-hand column is what cannot be delegated to a mechanism, which is exactly what makes it the right occupant of the always-loaded budget -- and mechanizing the left-hand column is what leaves room for it. Spending a scarce standing slot on a rule the runtime could have fired spends the one irreplaceable resource on the one case that did not need it. The costs of that slot are in [injection points](03_INJECTION_POINTS.md); what earns a durable write at all is in [memory](../Agentic_Engineering/13_MEMORY.md).

**Where a semantic trigger has an observable proxy, mechanize the proxy** -- not to perform the action, but to make the moment arrive. A rule that should fire when work is genuinely finished cannot be observed; a turn ending can, and a turn ending is where finishing usually happens. The proxy fires more often than the action is wanted, which is a real cost and a bounded one: **over-firing is recoverable and missing is not**, because a fire that turns out not to apply is discarded in a line while a miss leaves nothing behind to notice.

## Three strengths, and most of the gain is in the first move

Mechanizing a trigger does not make the agent do the right thing. It makes the moment arrive. Those are different guarantees and worth separating.

| Shape | What is deterministic | What is not |
|---|---|---|
| **The runtime performs the action** | Both the noticing and the doing | Nothing -- this is the strong form, and only some actions are expressible as code |
| **The runtime prompts at the moment** | The noticing | The doing, which remains an instruction like any other |
| **The agent notices and acts** | Nothing | Both, and the reliability of both falls as more rules are added |

**The move from the third row to the second is cheap and available for almost any rule**, and it collects most of the benefit, because the second row removes the failure that actually occurs. The move to the first row is the real one and is bounded by whether the action can be written as code at all.

**The limit, stated so the claim is not over-read:** the middle row is still text, and [text is not enforcement](03_INJECTION_POINTS.md). Mechanizing a trigger fixes recall, not compliance. If the action must hold rather than be considered, it is a gate, and a gate is code that refuses.

## Where a mechanized trigger lives

**The runtime is not only the harness**, and conflating the two is what makes this look like a harness-specific technique. Two substrates:

- **A controller step.** The controller decides what runs next, so anything expressible as "before or after this phase, do that" is a mechanized trigger with no harness involvement at all. It travels everywhere the controller runs and is testable with no harness present.
- **A harness lifecycle event.** Richer, closer to the model, and able to fire on things a controller never sees -- an individual tool call, a prompt being submitted, a compaction. It exists only where that harness does.

The rule already established for gates applies unchanged: [lifecycle hooks are off the capability surface](01_THE_CAPABILITY_SURFACE.md), so **a trigger that exists only as a harness lifecycle event disappears on a harness without them**, silently, in the same way a gate would. Where the trigger matters, the controller is the home and the harness-native version is an addition. Where it is a convenience, the harness-native version alone is fine, and saying which one it is out loud is the whole discipline.

Porting one asks the same question as porting anything else: not what the other harness's equivalent feature is, but [what the trigger was achieving](02_PORTABILITY.md) and how that runtime achieves it.

The shapes these take are already specified. Code that runs at a lifecycle event is a [hook](../Agentic_Engineering/primitives/hook.md); machinery that starts a run with no person present is a [trigger](../Agentic_Engineering/primitives/trigger.md).

## Building one so that it cannot fail quietly

A mechanized trigger replaces a failure that is visible -- a person noticing the rule did not fire -- with one that is not. Nobody watches a mechanism that is working, so nobody notices the day it stops. Four properties are what make that acceptable, and each was learned by getting it wrong.

**Filter twice, in different substrates.** Where a runtime offers a declarative way to narrow which events reach a mechanism, use it *and* re-check the same condition inside the mechanism itself. The inner check is the guarantee: declarative narrowing is a property of a version, and when it is unsupported or its shape changes, the mechanism either fires on everything or on nothing -- both silently. The redundancy costs one cheap evaluation per event and removes a whole class of version coupling.

**Degrade to silence, never to breakage.** Every dependency a mechanism has -- a parser, a helper binary, a file of patterns -- is a thing that can be absent. Check for it and do nothing, rather than erroring. The failure mode to engineer for is *"the triggers stopped firing"*, which is recoverable; the one to avoid is *"nothing works and the reason is a logging component"*, because that is how a mechanism gets deleted rather than repaired, and its deletion takes the true firings with it.

**Debounce on the unit of meaning, not the unit of event.** Two events that constitute one occurrence should produce one firing. A mechanism that fires per event trains its reader to ignore it, and an ignored mechanism has the reliability of a remembered one at greater cost. Debouncing is a choice about what counts as one thing happening, so it belongs in the design rather than being added after the noise is complained about.

**Whatever detects an absence must not depend on the thing that may be absent.** A guard that reports a missing configuration file cannot itself live behind that file; a check for a broken link cannot be reached through the link. This is the property that is easiest to violate while tidying, because consolidating the detector next to the thing it watches looks like good organisation and quietly makes the detector share its fate.

**Make the triggers editable where they are read.** Where the firing condition is data -- a list of patterns, a set of paths -- keep it in its own file that the mechanism reads on each evaluation, rather than compiled into configuration that must be edited and reloaded. The set of triggers is the part that changes most often, and a set that is expensive to extend stops being extended.

## When not to mechanize

- **Nobody has run the rule by hand yet.** Reuse must be earned, and a mechanism built before the rule has ever executed encodes a guess about when it should fire -- which is the expensive half to get wrong, because a trigger firing on the wrong event is harder to notice than one not firing at all.
- **It would fire far more often than the action is wanted.** A mechanism that interrupts constantly is deleted rather than narrowed, and its deletion takes the true firings with it. That is the same way a guard dies, and it is a failure of scope rather than of the idea.
- **The action is expensive on every fire.** Putting a model call on an event that fires constantly buys reliability with a paid, latent, failure-prone dependency on a hot path. Mechanize the noticing; keep the expensive part behind a cheap check.

## Choosing, in one pass

- **Can the runtime observe the event?** Mechanize it.
- **Can it observe something that reliably precedes the event?** Mechanize that, and let it prompt the check rather than perform the action.
- **Neither?** Standing instruction, and it has earned the slot -- which is what the slot is scarce for.
- **Must the action hold rather than be considered?** Then it is a gate, and mechanizing the trigger does not substitute for one.
- **Has the rule been rewritten more than once?** The wording was never the problem.
