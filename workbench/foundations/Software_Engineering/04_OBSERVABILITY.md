# 🔭 Observability

**The ability to answer questions about a running system from what it already emits, without shipping new code to ask.**

That is the whole definition, and the second clause is the part that does the work. A system you have to modify in order to investigate is not observable; it is debuggable, eventually, by whoever is willing to deploy. The test is not whether output exists -- it is whether the question you have *now* can be answered by the output you captured *then*.

## The subject is a long-lived system

A service runs continuously and serves many requests. You cannot keep everything it produces, so observability is always a **selection problem**: what is worth retaining, at what volume, for how long. Every answer trades cost against the questions you will be able to answer later.

Three signals, answering different questions:

- **Events** -- discrete records of things that happened. Answer *what occurred, in what order*.
- **Measurements** -- aggregates over time. Answer *how much, how often, how slow*, and are the only signal that shows a trend.
- **Causal chains** -- one unit of work followed across component boundaries. Answer *where the time went* and *which component failed first*, which neither of the other two can.

A system with events and no aggregates can explain a single incident and cannot see a degradation. One with aggregates and no events can see something is wrong and not what.

## What makes output worth keeping

- **Correlatable.** One identifier carried through every component a request touches. Without it, output from separate components cannot be joined, and the most expensive failures are the ones that cross a boundary.
- **Structured.** A field that can be queried beats a sentence that must be parsed. Prose is written for a reader who already knows what happened.
- **Attributable.** Which version, which instance, which configuration. Output that cannot be tied to a deployment cannot explain a regression.
- **Retained past the moment of panic.** The question usually arrives after the window closed.

## Introspection

A related and narrower thing: the system reporting on **its own** state rather than being watched from outside. A health endpoint, a readiness probe, a dump of effective configuration, a runtime view of what version is actually loaded.

It is worth having for the same reason as everything above -- a system that cannot say what configuration it is running under cannot be asked why it is behaving differently from its sibling. And it carries the same caveat: a component reporting itself healthy is making a claim about itself, which is weaker evidence than an independent check that it is serving correctly.

## What it is not

**It is not proof.** A dashboard, a tracker update and a logging hook observe and report -- they do not grant acceptance. A green dashboard is evidence that nothing being watched went wrong, which is a weaker claim than it appears.

**Configured is not running.** A signal that was set up and never emitted looks identical to a system with nothing to report. Verify a signal arrives before relying on its silence.

**Volume is not coverage.** More output raises cost and lowers the chance the relevant line is found. The question to ask of every signal is which question it answers; one that answers none is cost.
