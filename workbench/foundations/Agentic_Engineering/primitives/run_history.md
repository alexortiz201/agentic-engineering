# 📒 Run history

One durable, append-only record of every run a workflow has performed. It outlives each run, and it is the only artifact that makes a workflow's behaviour visible **over time** rather than once.

Everything else a run writes is scoped to that run and dies with it. Without this, a workflow can be perfectly observable and still unimprovable, because there is nowhere for the observations to accumulate.

## Must hold, one entry per run

- **The run identifier**, so the entry joins to that run's retained artifacts.
- **What ran, and at what version.** A history that cannot distinguish two versions of a workflow measures nothing when the workflow changes.
- **When it started and ended.**
- **The outcome**, from the handoff vocabulary.
- **What it cost**, in whatever units the harness reports, and how long it took.
- **What each gate decided.**
- **How many human interventions it required**, since that is the number that says whether autonomy is real. **This count is derived from the run's action log rather than tracked separately** -- the detail of each intervention lives there, where it is written as it happens, and a count kept independently of the events it counts will eventually disagree with them.

Keep it narrow. This is an index over runs, not a copy of them -- the detail stays in the run's own artifacts and the entry points at it.

## Rules

- **Append only, and never rewrite an entry.** A corrected outcome is a **new entry referencing the old one**. Rewriting history is how a record stops being evidence, and a run that can edit its own past result can manufacture a pass across time rather than within a run.
- **A format that requires rewriting the file in order to append is not append-only in practice.** Appending must not cost more as the file grows, and must not be able to leave the file unreadable if it is interrupted partway. The specific format is the adopter's choice; this property is not.
- **One entry per run, readable without opening that run's artifacts.** If answering "how often does this fail" means opening a hundred run directories, the history is not doing its job.
- **It is derived, never authored.** A run writes its own entry as it ends, including when it ends badly. An entry written by hand is a claim about a run rather than a record of one.
- **A failed, blocked or abandoned run still gets an entry.** A history containing only successes measures nothing, and the failure rate is the number most worth knowing.
- **No secrets and no payloads.** Identifiers, outcomes and measurements -- not content.

## Value is attributed separately, and never by the run

A run can report what it cost. **It cannot report what it was worth**, and a field asking it to would be filled with a number nobody had at write time.

So value lives in a **second append-only record**, written by a person or a deliberate review, referencing the runs it judges. It carries what was judged, over what window, **the basis of the judgement**, and the judgement itself.

Three properties make it worth having rather than decorative:

- **It is authored, where the history is derived.** That inverts the usual rule here and it is the point: attribution is a claim by somebody who can make it, and it is honest only if it is attributable to them.
- **It names its basis.** A number with no stated basis is a claim wearing a measurement, and it is worse than an admission that value is unknown -- it ends the conversation the attribution was supposed to start.
- **It is coarser than a run.** Value is rarely a property of one execution; it belongs to a workflow over a period, or to a batch of work someone can actually evaluate. Forcing it per-run produces a column of guesses.

**Why it must exist at all:** the discipline holds that continuous unattended running is only justified once value is attributed. Without a place to record the attribution, that condition can never be evidenced -- only claimed -- and a gate nothing can satisfy is not a gate.

## Why it earns a place

Three things the discipline already asks for have nowhere to land without it.

**Measurement.** Accepted outcomes, attempts, cost, time and interventions are all quantities over many runs. Recording them per run and discarding them leaves the improvement loop with no input.

**Watching a ratio move.** Whether a workflow's gates are getting stronger or weaker, whether its repair rate is climbing, whether a model change helped -- none of these are visible in a single run, and all of them are cheap to see in a list.

**The economic question.** Whether a workflow is worth running unattended cannot be answered from one execution, because the whole argument is about what happens across a thousand.

## Common failure

Treating it as a log to read when something goes wrong, rather than as a dataset to query. A history nobody aggregates is a slower way to read the run directories, and it will be deleted by someone tidying up -- correctly, because in that form it was not earning its cost.
