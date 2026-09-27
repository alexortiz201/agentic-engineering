# 🧠 Memory

**An agent's working context is a cache, not a store.** It is fast, it is expensive, it holds the most detail of anything in the system, and it is dropped in full at the end of every run. Memory management is the discipline of deciding what survives that drop, where it goes, and how it is kept from going quietly wrong.

This is an engineering concern and not a convenience. A system with a volatile fast tier, a durable slow tier and an external source of truth has a memory hierarchy, and a memory hierarchy brings the same three problems it always has: **what to admit, what to evict, and how to stay coherent with the source.** Those problems do not become softer because the fast tier is a language model's context rather than a processor's cache. They become harder, because this cache can rewrite what it holds and will not report having done so.

Read [`05_RECOVERY_AND_HANDOFF.md`](05_RECOVERY_AND_HANDOFF.md) for what a handoff must carry, and the [`record`](primitives/record.md), [`state`](primitives/state.md) and [`run_history`](primitives/run_history.md) primitives for the shapes a durable write takes. This file is about the policy governing them.

## The three tiers, and the one rule that spans them

| Tier | Lives for | Holds | Fails by |
|---|---|---|---|
| **Working context** | One run | Everything the run has read, done and inferred, at full detail | Vanishing without warning, and compacting silently before it does |
| **Durable store** | Across runs | What the next run needs in order to start without re-deriving it | Going stale while still reading as current |
| **Source of truth** | Independently of the system | What is actually true -- the code, the tracker, the forge, the running application | Being assumed rather than queried |

**The rule that spans all three: a durable store is a cache of the source, never the source.** Every fact in it was true when written and is unverified now. Nothing notifies a store when the thing it describes changes -- a ticket closes, a branch merges, a file moves, a customer support team disables the job that was causing the incident -- and the store keeps asserting the old value in the same confident voice as the new ones around it.

This produces the failure mode that matters most, because it is silent and it compounds: **a stale record is not clutter, it is a false premise.** Clutter is ignored. A premise is reasoned from. The next run opens the store, treats it as current because that is what it is for, and builds a plan on top of a fact that stopped being true days ago. Nothing in the run will contradict it, because the whole point of writing it down was to avoid going back to the source.

The remedy is **reconciliation against the source, not against the notes.** A ticket closes against the tracker. A branch closes against the forge. A "not built yet" closes against the tree. A "the service is running" closes against the port. Reading one's own record and finding it internally consistent establishes nothing -- it is the same method that wrote the error, run twice.

## What earns a durable write

Most of what a run learns should die with it, and a store that accepts everything becomes a log, which is a thing nobody reads and therefore a thing that is never corrected. Three tests, all of which must pass:

- **Would it change what a future run does?** A preference, a constraint, a correction, a decision and its reasoning all qualify. Narration of what happened does not. The test is behavioural: if no future run acts differently for having read it, it is a diary entry.
- **Does it outlive the task that produced it?** Standing constraints and settled decisions survive. The state of a half-finished job does not -- that belongs in a handoff, which is deliberately short-lived and deliberately deleted when the job ends.
- **Is it legible cold?** The writer has the whole session in context and the reader has none of it. "The fix" and "that issue" resolve to nothing a week later. A durable write names its subject, states the reason and not only the conclusion, and survives being read by someone who was not there.

**A rule the runtime could fire does not earn the slot.** A standing rule of the form "whenever Y happens, do X" can pass all three tests and still be in the wrong place, because what it actually needs from the store is the one thing a store cannot supply -- the noticing. Where the event is one a runtime can observe, the rule belongs in the runtime, and the slot stays free for the rules only a reader can recognise. The split is in [`Harness_Engineering/04_MECHANIZED_TRIGGERS.md`](../Harness_Engineering/04_MECHANIZED_TRIGGERS.md).

**Write it in the same act that learns it.** A correction recorded at the end of a run is recalled in order of memorability rather than of importance, and the item nobody thinks of is exactly the one nothing else will catch.

## Eviction

- **A completed item is deleted, not marked complete.** A list of ticked boxes is a changelog wearing a list's clothing -- it grows without bound, and every read pays for the finished work again. If completed work is worth keeping, it belongs in a separate record that is never swept and never consulted for what to do next.
- **A superseded fact is corrected in place, not appended beneath.** Two contradictory statements in one file force the reader to adjudicate, and the reader has less context than the writer did. Append-only is right for an event log and wrong for a statement of current state.

  **Which one a document is, is the discriminator -- and it decides the motion, so settle it before correcting anything.** A **record store** holds what is true *now*, so a superseded fact in it is noise and the correction is made in place. An **audit-bearing record** -- a ticket, a review, a pull request -- *is* the trail, so the correction is appended: deleting what was believed destroys what a reader needs in order to judge the current claim, and that reader is usually deciding whether to trust it. Neither is the exception; they are different artifacts with different jobs, and applying either rule to the other artifact loses exactly what that artifact existed to hold.

  **The instinct is not a reliable guide to which is which.** In one session the same impulse was applied in both directions and was wrong both times: corrections were appended inside a running-context file, where in-place was correct, while the same session appended corrections to tracker tickets rather than rewriting them, which was correct. The judgement that feels identical from the inside produces opposite results, so read the artifact rather than the instinct.
- **Two stores holding one fact will diverge**, and the divergence surfaces when someone acts on the stale copy. One fact, one home, and a reference from anywhere else that needs it.

### Restore reachability before collapsing duplicates

The rule above says one fact, one home. Applying it to a store that has already duplicated is where it goes wrong, because **the choice of which copy survives is made on which one looks canonical, and the one that looks canonical is frequently the one nothing reads.** A duplicate in a well-named, well-structured, entirely unreferenced file presents as the original; the copy that actually fires may sit somewhere ad hoc precisely *because* the tidy location was unreachable and someone needed the fact to load.

So a de-duplication pass has a precondition, and it is not optional: **every candidate home must be reachable by a path that something actually traverses, before any copy is removed.** Deduplicating first inverts the intended outcome -- it deletes the working copy, keeps the orphan, and leaves a store that is now consistent and silent. The failure is invisible at the moment it is committed, because the store afterwards looks strictly better than the store before.

Two consequences worth stating separately. **Reachability is a property of the path, not of the file** -- a file linked only from another unreachable file is unreachable, so the check runs from the entry point outward rather than per-file. And **"unconditionally loaded" is a stronger claim than "documented"**: a copy is safe to delete only against a home that loads without anyone choosing to traverse to it. Against a home that is merely reachable, the duplicate is demoted to a pointer, not removed.

## Queue discipline

Open work is a queue, and treating it as one imports a set of answers that message-queue practice settled a long time ago. The vocabulary below is the standard one from queueing systems and the protocols that specify them; the value is not the naming but the fact that each name carries a **policy** with it, and a single flat list of open items has none.

**Three queues, because they are consumed under different rules.**

### The work queue

Ordinary open work, consumed in order. Its defining property is that **order is a decision already made**, so the consumer does not re-litigate priority on every read. A flat list invites exactly that re-litigation, which is how a backlog comes to be worked in order of what was most recently discussed.

### The priority queue

Work that pre-empts whatever is in progress. The whole difficulty is admission: **a priority queue with a soft admission rule degrades into the work queue with extra steps**, because every item feels urgent to whoever filed it and recency is the easiest signal to mistake for importance.

So admission must be a **stated, checkable condition**, not a judgement: the system is unavailable or degrading, data is being lost, a deadline is externally imposed and near, a customer-facing commitment is breaking. The condition is written next to the item, which makes two things possible that a bare "urgent" label does not -- someone else can check whether it still holds, and the item can be **demoted to the work queue when it stops holding.** An urgent item that nobody can demote is a permanent pre-emption.

Note what mitigation does here. When something outside the system stops the bleeding -- a job disabled, a feature flagged off, traffic drained -- **the incident's severity drops but the defect's does not.** The item should be re-examined against the admission condition rather than left at the head of the queue on the strength of how it arrived, and equally it should not be dropped to the bottom just because the alarm stopped.

### The dead-letter queue

Items that could not be processed. **The purpose of a dead-letter queue is to make failure visible instead of letting it become a loop** -- without one, an item that cannot be completed is either retried forever or silently dropped, and both look like progress from the outside.

What belongs here: work blocked on a decision only a person can make, work waiting on another party, work whose premise did not survive checking, work that was attempted and stalled. **Each one is parked with the reason it failed**, because the reason is the only thing that makes re-queueing possible later. "Blocked" is not a reason; "blocked on whether we may create test data in a shared environment" is, and it names the event that would release it.

Two policies belong to this queue specifically:

- **Bounded retry, then dead-letter.** Repeating a failing approach costs more than it can return. A small fixed number of genuinely *different* attempts, then the item is parked with what was tried, rather than ground at until the run ends.
- **A poison item is the consumer's problem, not the queue's.** An item that returns and fails the same way each time is not unlucky. Re-queueing it unchanged is the defect -- either the item is wrong, or the thing consuming it cannot do this kind of work, and one of the two has to change before it goes back in.

### Acknowledgement is where the discipline actually lives

A queue must decide when an item leaves it. Acknowledging on *delivery* means an item disappears the moment a worker picks it up, so anything that goes wrong afterwards is lost without trace. Acknowledging on *confirmed completion* keeps the item until the work is externally confirmed done.

Applied here, that is exactly the reconciliation rule stated above, and it is worth seeing that they are the same rule: **an item is removed when its source confirms the work, not when the worker believes it finished.** Deleting a todo because the run thinks it is done is acknowledging on delivery. Deleting it because the tracker, the forge or the tree says so is acknowledging on completion.

The corollary is the familiar one from any at-least-once system: **an item may legitimately be picked up twice**, so the work behind it should be safe to repeat. Where it is not -- where re-running it would duplicate an effect in the outside world -- that is a property worth writing next to the item, because the next consumer cannot infer it.

## How memory management fails in practice

- **The unbounded store.** It accepted everything, so it is long; it is long, so it is skimmed; it is skimmed, so its errors are never found. Size is not a cosmetic problem, it is what disables the correction mechanism.
- **The write-only store.** Faithfully updated, never read, because nothing in the run's path forces a read. A store that is not read at a specific moment by a specific rule is not memory, it is archaeology.
- **The confident stale fact.** Covered above, and the reason every other rule here exists.
- **The store that describes itself.** Records about the state of the records, reconciliations of reconciliations. When the memory system becomes its own main subject, the work it was supposed to serve has stopped being the subject.
