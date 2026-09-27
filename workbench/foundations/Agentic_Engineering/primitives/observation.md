# 🔭 Observation

A bounded recording of **work being performed**, kept so that a workflow can later be derived from what actually happened rather than from what anyone remembers happening.

Its subject is the process, not the code. Every other primitive here describes something the system does; this one describes something the system **watches** -- and the thing being watched is usually a person, whose actions the recorder did not perform and mostly cannot reproduce.

## Must hold

**On the observation itself**, written once when it opens:

- **An identity, formed from the subject and a discriminator.** The subject half makes a recording findable by the work it belongs to; the discriminator half is what stops **two recorders watching the same subject** from writing into one record. Everything the observation produces is addressed by the whole, which is what makes the raw material removable later without hunting.
- **The subject** -- what is being worked on, named the way the workgroup names it.
- **The attribution that explains behaviour**: the model and the harness in use, and the workspace observed. Behaviour attributed to a process that was actually a property of the model or the harness is the most expensive kind of wrong conclusion, because it survives the change that would have disproved it.
- **When it opened.**

**On every entry**: sequence, time, kind, and what was done.

**On close**, written once: when, and **why it stopped** -- completed, abandoned, or interrupted. An observation with no terminator cannot be distinguished from one still running, and a record of only completed observations measures nothing.

## Kinds, ordered by how reproducible they are

The kind is not decoration. **It is the estimate of what it would cost to make this step deterministic**, which is the question the whole recording exists to answer.

| Kind | Is | Reproducible |
|---|---|---|
| `command` | An invocation with arguments in a working directory | **Verbatim.** Carry the command, the directory and the exit code |
| `ui` | An interface was driven | By hand. Carry the surface and the intent, because an interface action is often an API call nobody has written yet |
| `handoff` | Control passed to something that finishes later -- the recorded form of a `deferral`, where the recorder yields rather than executing or calling | Only with the other side's record. Carry a pointer to the entry where the result landed, which is the continuation stated as evidence |
| `prompt` | An actor was asked for something | **No.** The ask does not determine the result, so carry **what actually happened** as well as what was asked |
| `decision` | A judgement, with no external effect | Not an action. This is where the non-deterministic half of a workflow actually lives |

Alongside the kind, record whether the entry **changed anything**. A step that only reads is a step a workflow may repeat freely, and that is a different thing to know than how it was performed.

## Rules

- **Several may be open at once, and none of them owns a global "current" slot.** A single pointer naming the open recording cannot represent two, and a recorder that writes to "the open one" will silently append another's work to its own. Openness is a property **derived from each record** -- it has no terminator yet -- not state held beside them. Where more than one is open, an instruction that does not name which **refuses rather than guesses**.
- **A recorder is handed a reference, never a transcription.** Instructions retyped into each caller go stale the first time the recording contract changes, and **nothing announces that they have** -- the caller keeps issuing an instruction that is now refused, or worse, one that is accepted and means something else. The instructions must be obtainable *from the thing that enforces them*, so the two cannot drift.
- **It is off unless deliberately opened.** Recording everything continuously produces a volume nobody triages, and an untriaged recording is indistinguishable from none. The explicit open is the cost control; the explicit close is what makes the stopping point a fact.
- **Labels are applied by the recorder, after the fact -- never requested from the subject.** Asking someone to declare which step they are on makes them work in steps, and the recording then measures itself. Grouping entries into steps is a second pass over the record, and it is revisable.
- **An interruption is part of the process.** Work is not linear, and entries that belong to something else are **marked, not deleted.** How often the work is interrupted is itself a finding, and a record with the digressions removed describes a flow that never occurred.
- **Record what could not be seen, and say why it could not be seen.** A recorder sees only what passes through it; anything else -- another terminal, an interface it is not driving, thinking never said aloud -- is invisible. Where a gap is noticed it is written down as a gap.

  **A gap carries two things beyond its description: the instrument, and the disposition.** Naming the instrument says *what* was unable to look, which is the difference between a limit of the process and a limit of one tool that may be replaced tomorrow. The disposition says what kind of absence it is, and there are three that behave differently:

  - **deferred** -- a later phase can see it. The gap is an agenda item, and it is the cheapest input that phase will get.
  - **unobservable** -- nothing available can see it. This is a finding about the workflow's reach, and it is what justifies building a new instrument.
  - **not permitted** -- the instrument declined rather than failed. **This is the one that masquerades as data**: a value refused looks identical to a value absent, so a check that reads it and finds nothing concludes the wrong thing with full confidence.

  A recording that silently omits part of the work yields a workflow with missing steps and no way to discover which. One that records gaps without their disposition yields a workflow that cannot tell which gaps it should try to close.
- **Attribution travels with the entries, and changes are entries.** When the model or the harness changes mid-recording, that is a recorded event, because every conclusion drawn after it has a different provenance from every conclusion before it.
- **No secrets and no payloads.** References to evidence, never the evidence.

## The lifecycle that keeps it from becoming cruft

Raw recordings are bulky, and most of what they hold is worth nothing once it has been read. **What outlives a recording is what was distilled out of it**, not the recording itself.

So a recording is disposable, and anything worth keeping is **promoted before the sweep that deletes it** -- a candidate step, a repeated sequence, a check that turned out to be mechanical. The identity is what makes this safe to automate: when the workflow a recording produced is finished, everything still addressed by that identity is removable.

**Promotion is where judgement belongs, and capture is not.** Deciding that a prompt would be better as three commands -- more deterministic, and more to maintain -- is a real trade and it is made against the distilled candidate, with more than one recording in view. Made during capture it is a guess, and it is one that has already discarded the evidence for the alternative.

## Why it earns a place

**A workflow derived from what someone was asked to describe encodes the description.** People reconstruct their own process smoothed: the false start disappears, the check done twice becomes once, the step skipped deliberately looks like a step never needed. Those are exactly the details a workflow must contain to be able to recover, and they are the first casualties of recall.

**It is the only instrument that can separate the deterministic half from the agentic half by measurement rather than by opinion.** Within one recording, that split is a judgement call. Across several recordings of similar work, **what stays the same is mechanical and what varies is judgement** -- and that is a reading, not an argument.

## Common failure

**Recording continuously because it is cheap to start.** The cost is never in the capture; it is in the triage, which is manual, and which does not scale with the volume. A recording nobody distils is a folder that grows until someone deletes all of it, including the one hour that was worth keeping.
