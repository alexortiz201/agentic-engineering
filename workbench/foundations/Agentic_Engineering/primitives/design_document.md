# 📐 Design document

Why the system is shaped the way it is. **It outlives every run**, which is what separates it from a spec.

## Not a spec

A spec says what one task did. It is machine-generated, consumed once, and then dead. A design document is written by a person, describes the whole system, and is read repeatedly -- by people deciding what to change, and by agents needing context a single task cannot supply.

## Must contain

- **The shape** -- components and how they relate.
- **The contracts** -- what crosses each boundary.
- **The execution flow**, including what happens when a step fails.
- **A phased plan with explicit checkboxes**, so unbuilt parts stay visible rather than being forgotten.
- **What was deliberately not built**, and why.
- **How it will be verified.**
- **Risks, and what is done about each.**

## The composition table

The one artifact that makes a workflow reviewable before it is built. One row per phase:

| Phase | Actor | Input / prerequisite | Output contract | Independent gate | Failure route |
|---|---|---|---|---|---|

- **Actor** is code, agent, or human -- naming it is what forces the judgment-versus-mechanism question.
- **Independent gate** must be something other than the actor that produced the output. A blank cell here means the phase approves itself.
- **Failure route** names where control goes, not that it fails.

Answer alongside it: **why a workflow rather than one prompt?** If there is no answer, there is no workflow -- there is a prompt with extra machinery.

## Rules

- **Commit it.** Its whole value is being available later, to someone who was not there.
- **Keep the unchecked boxes.** An unbuilt phase still marked open is the cheapest audit available -- reading the plan against the code is how you discover what was planned and quietly dropped.
- **Where the document and the code disagree, the document is usually the intent and the code the current state.** Treat the gap as a to-do, not as an error in the document -- but date it, or the distinction stops being recoverable.
