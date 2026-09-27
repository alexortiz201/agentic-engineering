# 🔭 Observing a process

How to record work as it happens so that a workflow can be derived from it. The blueprint is [`primitives/observation.md`](../foundations/Agentic_Engineering/primitives/observation.md); the line shape is [`templates/record/observation_line.md`](../templates/record/observation_line.md); one implementation is [`tools/observe/`](../tools/observe/README.md).

**This is how a workflow gets its content.** [`06_BUILDING_AN_ADW.md`](06_BUILDING_AN_ADW.md) says to encode the workflow the engineer would perform themselves. That file assumes you know what that workflow is. This one is how you find out.

It is the **Capture** stage of [how material becomes a workflow](../foundations/Agentic_Engineering/06_ADW_COMPOSITION.md) -- capture, decompose, compose. Capture is a recording rather than a note written afterwards, because the things the stage exists to collect stop being available the moment the work ends.

## The rule that makes the recording worth anything

**Do not lead.** A workflow derived from the recorder's suggestions encodes the recorder. If the subject is about to do something, let them do it and write down what they did; answer what is asked and propose nothing unasked.

This extends further than it first appears. **Asking someone which step they are on makes them work in steps.** So the recording carries no prompt to segment, no checklist to follow, and no question shaped like *"is this the part where you reproduce it?"* Grouping into steps happens afterwards, by the recorder, over the finished record -- and it is revisable, which is why the labels are appended rather than written into the entries.

The general form of this is already stated in [`Software_Engineering/02`](../foundations/Software_Engineering/02_TESTING_AND_EVIDENCE.md): instrumentation changes what it measures. Wrap, do not rewrite.

## Open it deliberately, and close it

**Off unless opened.** The cost of a recording is never the capture -- it is the triage, which is manual and does not scale with volume. A recorder left running produces a folder that grows until somebody deletes all of it, including the hour that was worth keeping.

**Close it with a reason**, and the reason is the finding when it is not `completed`. An abandoned recording says the work was abandoned; an interrupted one says where the interruption landed. A record of only completed observations measures nothing, for the same reason a run history of only successes does.

## What to write down

The things that look too small to matter, especially:

- **Every discrete action, in order.** Commands verbatim, because those are the ones that are free to reproduce.
- **Each decision, and what was in front of them when they made it.** That is a step's input contract, and it is invisible afterwards.
- **Where they pause.** Pauses are where judgement lives; the unpaused stretches are the candidates for code.
- **What they do twice.** Repetition is the strongest available signal that something is a step rather than an incident.
- **What they deliberately skip.** A step not taken is part of the process.
- **Dead ends, in full.** A record of only the successful path yields a workflow that cannot recover, which is the most common way these fail.
- **What you could not see.** Another terminal, an interface you are not driving, thinking never said aloud. Write the gap down as a gap; a recording that silently omits part of the work yields a workflow with missing steps and no way to find out which.

## Mark the digressions rather than dropping them

Work is interrupted, and the interruptions are part of it. An entry that belongs to something else is **marked out of band, never deleted.** Two reasons: the flow reconstructs correctly by filtering, and **how often the work is interrupted is itself a finding** -- one that a clean record silently destroys.

## Reading it afterwards

The kind of each entry is the estimate of what it would cost to make that step deterministic, and that is the question the recording exists to answer.

- A `command` is already reproducible. It is a candidate for code as it stands.
- A `ui` action is an interface call that nobody has written an interface for yet.
- A `prompt` is not reproducible, and the record's fact is its **outcome**, not its text.
- A `decision` is where the agentic half actually lives.

**Within one recording, the deterministic/agentic split is a judgement.** Across several recordings of similar work it is a reading: **what stays the same is mechanical, what varies is judgement.** This is the argument for keeping more than one, and it is the only reason the identity and the attribution matter.

**Attribution decides what a conclusion is about.** Behaviour credited to a process that was really a property of the model or the harness survives the change that would have disproved it -- which is why those are recorded at the open, and why a change to either is an entry rather than a silent shift.

## Promote, then delete

Recordings are bulky and most of what they hold is worth nothing once read. **What outlives a recording is what was distilled out of it.**

So: promote candidates into the durable notes -- a repeated sequence, a check that turned out to be mechanical, a step whose absence broke something -- and then let the sweep take the raw material. Everything a recording produced is addressed by its identity, which is what makes that deletion safe to perform without reading.

**Promotion is where judgement belongs, and capture is not.** Deciding that a prompt would be better as three commands buys determinism and costs maintenance; that trade is made against a distilled candidate with several recordings in view. Made during capture it is a guess that has already thrown away the evidence for the alternative.
