# 🛰️ Orchestrating a survey

Several actors survey one subject in parallel, an orchestrator assembles their findings into one ordered plan, the operator approves it, and execution actors carry it out. **Five stages, in order.** The approval gate between stage 3 and stage 5 is the safety property: this shape is reached for precisely when the subject is something a wrong change destroys, so the plan must become a decision before it becomes an edit.

This is the **Collaboration** shape in 🧩 [composition](../foundations/Agentic_Engineering/06_ADW_COMPOSITION.md) § *Several agents against one question* -- the most expensive of the three and the only one that produces a build rather than a judgment. The rules it rests on are there and are not repeated here: what independence buys and how it is lost, what the synthesizing seat owes (consensus, divergence, **discard list**), why the brief's own framing is part of what is under test, why a constraint must be verified before it is stated, and what each delegation tier costs in evidence fidelity. Claim discipline for parallel writers is in 🔄 [workflow](../foundations/Agentic_Engineering/02_WORKFLOW.md) § *Parallel work*; the precondition on any de-duplication is in 🧠 [memory](../foundations/Agentic_Engineering/13_MEMORY.md) § *Restore reachability before collapsing duplicates*.

**When this is worth its cost.** The subject is large enough that one actor reading it all would spend its whole context before judging anything; the change is broad; and some part of it is irreversible. Where any of those is absent, one competent actor and a real check is the better trade.

## 1. Frame the subject and establish what is recoverable

**Name the subject, its boundary, and its recoverability, in that order.**

- **What is in scope, by location** -- not by topic. A topic boundary is interpreted differently by each actor; a path is not.
- **What is explicitly out of scope, and who holds it.** Where another actor is already working somewhere, say so by path. Ambiguity here is what produces the double-dispatch in the anti-patterns below.
- **Which parts are version controlled.** This is the load-bearing question and it is usually skipped. Where the subject is uncommitted, **a wrong deletion is unrecoverable**, which is what makes the approval gate mandatory rather than polite, and what makes *demote* the default disposition and *delete* the exception.
- **Take a snapshot before anything runs.** Cheap, and it is the only thing that converts an unrecoverable subject into a recoverable one.

**Earns the next stage:** you can state the subject's extent in paths, say which of it can be restored if this goes wrong, and name what is held elsewhere.

## 2. Give each surveyor a different question

The split that matters is **by question, not by slice of the subject.** Handing four actors a quarter of the corpus each produces four partial inventories that no one can compare; handing them four different questions about the whole corpus produces four readings that disagree usefully.

- **One question per actor, stated in one sentence**, plus what evidence would settle it. The worked run used four: *what is the right organising principle*, *what is actually in here and what is stale*, *what does the configuration surface look like*, and *what does the derived corpus measure against its source*. Every one of them read the whole subject.
- **Say at what depth each must work** and require the evidence that proves it worked there. A depth left unspecified is chosen by whichever actor stopped first.
- **Brief them to argue, including with you.** Name which of your instructions are assumptions rather than constraints, and say plainly that returning *"the instruction was wrong, here is the evidence"* is a successful result. This is the stage's whole purpose -- see the composition rule above; it is not a courtesy and the discomfort of the result is the signal it worked.
- **State only constraints you have checked against the artifact.** An actor cannot distinguish a constraint from a task, so an unverified one becomes a false floor it will never think to test.

**Earns the next stage:** *n* surveys, each able to be read alone, each naming what it could not determine.

### One file per surveyor, and why the deviation was right

The instinct -- and the operator's own first suggestion on the worked run -- is one shared file the whole group writes into. **Take the deviation: one file per surveyor, in a folder named for the session, and one assembled file above it.**

Three reasons, and the second is the one that is not about mechanics. Concurrent writes to a single file clobber each other, so a shared file either serialises the actors or loses their work. A shared file also destroys attribution at exactly the moment it matters: when two surveys disagree, the synthesis needs to know *which* actor concluded what and on what evidence, and a merged stream cannot say. And it removes the one thing that makes a refutation legible -- a survey that overturns its own brief is only readable as a refutation while it is still a whole argument with its evidence attached; interleaved into a common file it becomes a contradictory paragraph among others.

**What is given up is real:** nobody reads the folder, and the surveys duplicate each other's groundwork because none of them can see the others. That duplication is the price of independence and should be paid knowingly -- it is the same trade the composition rules describe, and the assembled file above the folder is what makes it navigable afterwards.

## 3. Assemble a plan, do not merge the answers

The synthesizing seat's obligations are in the composition file. What this stage adds is the **ordering**.

- **Order by dependency, not by value.** The highest-value change is routinely the one that is only safe after a cheaper one has landed. Each step states what it makes safe for the next -- if it makes nothing safe, its position is free and it goes last.
- **Carry the refutations forward.** An instruction a survey overturned goes into the plan *as a finding with its evidence*, not silently dropped. Otherwise the next run is briefed from the same wrong premise.
- **Keep the open questions separate from the plan.** Anything the surveys could not settle, or that costs something the operator has not agreed to spend, is a question addressed to him -- not a step with a hedge in it.
- **Say what will be irreversible**, step by step. This is what the approval gate is actually approving.

**Earns the next stage:** an ordered list in which every step names its precondition, plus a short list of questions that are genuinely open.

## 4. Gate on the operator

**Nothing destructive executes unapproved.** The gate is the point of the whole shape, and it is the one stage that cannot be delegated.

What it needs in front of it: the ordered plan, the irreversible steps marked, the open questions, and the refutations. What it must not contain is a step phrased so that approving the plan approves something the operator did not see -- a step that says *"and tidy up whatever else looks stale"* has no approvable content.

**Earns the next stage:** an approved plan. A partial approval is a normal outcome and the unapproved steps stay unexecuted rather than being folded in.

## 5. Dispatch execution on disjoint claims

- **A claim is a named set of paths, not a topic.** Two actors given "the memory store" and "the duplicated rules" believe they hold different things and hold the same files. Write the claim as paths and hand each actor the other actors' claims so it can refuse an overlap it notices.
- **Never dispatch into a resource under migration or deletion.** A destination that is scheduled to be wiped is not a valid write target, however correct the write is -- the work lands and then vanishes with the container.
- **Retract a false constraint to the actor still holding it**, explicitly, saying what it invalidates. An actor cannot notice that its ground has moved.
- **Each actor reports what it deliberately did not do, and why.** A deliberate omission and a missed step are indistinguishable in a report that only lists what was done, and the omissions are where the next run's plan comes from.
- **Verify at the consuming interface, not at the edit.** The check is that the thing that reads the store now reads it correctly, not that the file was written.

**Earns completion:** every claim reports, the deliberate omissions are collected, and the store is checked from its entry point outward.

## Anti-patterns, each drawn from the first real run

- **Double dispatch on an overlapping claim.** Two execution actors were sent at the same nine files because their claims were written as subjects rather than as paths; one had to be retracted mid-flight. The claim is the fix, not the coordination.
- **A constraint asserted from a stale reading.** An actor was told that adding executables would contradict a stated boundary. The tree already held several, the boundary said something narrower, and the constraint had to be withdrawn while the actor was working. Anything stated as already-true gets checked against the artifact first.
- **Writing into a repository being deleted underneath the writer.** Correct work, valid destination at the time of the brief, gone by the end of the run. A migration in progress makes every path inside it provisional.
- **🔴 The survey inherits the orchestrator's frame, so nothing checks the frame.** Every surveyor on the worked run scoped itself to the uncommitted stores, because that was the framing. A pointer *into* those stores lived in a committed file, went unsurveyed by all four at once, and was left dangling by an execution step -- in the first instruction a cold session reads. **A spread of actors gives no coverage at all outside the boundary they share.** Assign one actor the frame itself, or state the frame as a question rather than as a given.
- **Collapsing duplicates before the destination is reachable.** Covered by the memory rule above; it is listed here because it is the step an execution actor will reach for first, and it is the one that has to wait.
- **A synthesis that emits only the merged plan.** The composition file names this; it recurs here because the assembled file is where it happens.

## Stopping early is a legitimate outcome

**Stages 1-3 are worth running on their own.** They produce a read of the subject, an ordered plan and a list of open questions, and they change nothing -- which is the entire value where the subject is unrecoverable and the operator is not ready to decide. On the worked run the first two steps of the approved plan were described as *"cheap, reversible and independently valuable"*, and that was accurate: had only those landed, the largest single defect in the subject would still have been closed.

The inverse is also a stopping point. Where stage 2 returns surveys that agree with the brief on every point, **suspect the brief rather than celebrating the consensus** -- see the composition rule. That is a reason to re-brief, not a reason to proceed.
