# 📊 Evaluations

**A test asserts. An evaluation measures.** That single difference generates everything else in this document, and conflating the two produces either gates that flap or measurements nobody trusts.

A test has a binary answer and one run settles it: the assertion held or it did not, and running it again gives the same verdict. An evaluation scores, because the thing under evaluation does not return the same output twice. You cannot assert that a probabilistic step produced exactly the right answer; you can measure how often and how well it produces an acceptable one, across enough samples for the number to mean something.

Deterministic parts of a workflow are tested. **Probabilistic parts are evaluated.** A workflow with both needs both, and neither substitutes for the other.

## Why this is not optional

Without evaluations, every claim about a workflow's quality is an anecdote. A prompt change felt better. The new model seems sharper. A run went badly, so something regressed. None of those survive contact with a system whose output varies run to run -- the variance alone will produce all of those impressions from a system that has not changed at all.

**The moment this becomes unavoidable is the first model comparison**, because that is the first time a decision rests on the difference between two distributions rather than on whether something worked.

## The set is the work

An evaluation needs a fixed collection of cases with known-acceptable outcomes. Curating that collection is most of the effort, and it is the part that cannot be automated away, because deciding what a good result looks like is the judgment the whole apparatus exists to preserve.

- **Draw cases from real work**, not invented ones. A synthetic case tests the cases you imagined; real work contains the ones you did not.
- **Keep the failures.** A case that once went wrong is worth more than one that always went right -- it is the only kind that can catch the same failure returning.
- **Small and real beats large and plausible.** Twenty cases you trust the answers to are more useful than two hundred you cannot adjudicate.
- **Record why each case is in the set.** A case whose purpose is forgotten becomes a case nobody dares delete and nobody learns from.

## Scorers, in order of how much they can be trusted

How a result is scored matters more than how many cases are scored, because a bad scorer produces confident numbers about nothing.

1. **A deterministic consequence.** Did the change make the failing check pass? Does the output parse against its schema? Did the artifact appear where it was promised? This is the strongest available scorer and it is the reason to prefer work whose success has a mechanical consequence.
2. **Exact or structural match** against a known answer. Reliable where the output is structured, useless where it is prose.
3. **A human judgment**, recorded. The ground truth, and it does not scale. Its role is to calibrate the cheaper scorers, not to run every time.
4. **A model as judge.** Scales, and is the most dangerous.

**The model-as-judge trap.** Using a probabilistic system to score a probabilistic system means the scorer has its own failure modes, its own preferences about style and length, and -- when it shares a family with the thing it is scoring -- **errors that correlate with the errors it is supposed to catch**. The package's rule that an actor cannot verify its own proposals is not satisfied by swapping in a sibling.

Where a model judge is used anyway, and sometimes it is the only option: fix its prompt and model as carefully as the thing under test, calibrate it against human judgments on a subset, and re-calibrate whenever either model changes. **An uncalibrated judge is an opinion with a number attached.**

## Identity leaks, and it changes behaviour

When several actors see each other's work -- in a debate, a judgment, a review -- **do not reveal which model produced which output.** Name the participants neutrally and keep the mapping outside what they can see.

Identity is not inert information. Where a model can tell whose answer it is looking at, behaviour shifts in ways that have nothing to do with the content: deference to a name it recognises as stronger, contrarianism toward a name it treats as a rival, and agreement driven by provenance rather than by argument. The effect is a confound running through every comparison built on top of it, and it is invisible in the output, because a position stated for the wrong reason reads exactly like one stated for the right reason.

This is the same defect as an uncalibrated judge, arriving by a different route. There, the scorer's preferences contaminate the score; here, the participants' preferences about each other contaminate what is being scored.

**The practical rule: an actor sees the content and never the source.** That includes indirect leaks -- a house style, a signature preamble, a distinctive output shape. If the participants can identify each other from the text alone, the anonymisation is decorative.

## Convergence is evidence only when it is independent

Several actors reaching the same conclusion is worth something, and worth **much less** once they have seen each other. Independent agreement is corroboration: no shared influence explains it, so the explanation is likely the thing itself. Agreement after exposure may be nothing more than the first confident answer propagating.

So record which regime produced the agreement, and prefer the independent pass when the question is *what is true*. Reserve the shared pass for *what survives challenge*, which is a different and also useful question.

**Persistent disagreement is a result, not a failure of the method.** Actors that hold their positions under challenge have located a genuine ambiguity, and reporting it as unresolved is more useful than forcing a consensus the evidence does not support.

## One run is not a sample

A single execution of a non-deterministic step tells you very little, and the instinct carried over from testing -- run it, read the result -- is wrong here in a way that produces confident nonsense.

- **Report the spread, not only the average.** A step that usually succeeds and occasionally fails catastrophically and a step that is mediocre every time can share a mean.
- **A difference smaller than the run-to-run variance is not a difference.** This is the single most common way an evaluation misleads: two configurations are compared once each, one scores higher, and the noise is read as a result.
- **Record the sample size with every score.** A number without an *n* cannot be argued with, which is not the same as being right.

## Comparison requires holding everything else still

This is where evaluation meets the reason for deterministic assembly. **Swap the model and change nothing else, or the comparison measures the change you forgot.**

That means the prompt as compiled, the tools available, the context loaded, the case set, the scorer and its configuration are all pinned across both arms. A comparison run against a prompt that was also improved says only that the pair is better than the pair, which is rarely the question.

The corollary: **a workflow that cannot reproduce its own effective configuration cannot be evaluated at all.** Its results are not comparable to anything, including to itself last week.

## How an evaluation meets a gate

An evaluation produces a measurement. A gate produces a decision. **Do not collapse them**, and in particular do not extend the check-status vocabulary with scores -- a score is not `passed`.

The conversion is a threshold, and a threshold is a **policy choice that gets recorded like any other**: what number, chosen when, by whom, and on what evidence. Held that way, three things stay visible that otherwise vanish -- that the bar was set by a person, what it was set against, and when it was last revisited.

A gate that consults an evaluation must also account for its variance, or it will block on noise. A threshold with no margin over the measured spread is a flaky gate, and a flaky gate is worse than no gate, because it teaches everyone to re-run until it passes.

## The set rots

Two ways, both slow enough to go unnoticed.

**Tuning against the set stops it measuring anything but the set.** Once prompts have been adjusted until the cases pass, the score describes fit to those cases rather than capability on new work. Holding some cases back and looking at them rarely is the usual defence, and it only works if the discipline holds.

**The world moves and the answers do not.** A case whose known-good answer was correct against last quarter's codebase will quietly start failing correct behaviour. An evaluation that has not been re-adjudicated in a long time is measuring history.

## What to evaluate

**Your workflow on your work** -- not a model on a public benchmark. A published score says something about a model in general and very little about whether it can carry one phase of one workflow against your codebase. The purpose here is choosing between options for a specific job, and only your own cases answer that.

The unit is a **phase**, usually, rather than a whole workflow. Phases have different demands, and the model that wins at planning may lose at mechanical transformation -- which is the entire argument for holding a stack rather than picking a model, and it is unanswerable without per-phase measurement.

**Start with the regression question, which is cheaper and often enough:** did this change make things worse? Detecting degradation needs less rigor than ranking options, and it is the question asked far more often.
