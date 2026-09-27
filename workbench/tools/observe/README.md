# observe

Records work as it happens, so a workflow can be derived from what occurred rather than from what anyone recalls occurring.

**This is a reference implementation, not the standard.** The portable statement is [`primitives/observation.md`](../../foundations/Agentic_Engineering/primitives/observation.md); this is one adopter's answer in one language. Where the two disagree, the primitive is right and this is behind. How to actually run a recording is [`handbook/10_OBSERVING_A_PROCESS.md`](../../handbook/10_OBSERVING_A_PROCESS.md).

It is the first executable code in this package. Everything else here states what a thing must contain; this one does it, which is why it is fenced into `tools/` rather than sitting beside the discipline it implements.

## Use

```
bun tools/observe/observe.ts open   --subject <s> [--model <m>] [--harness <h>] [--workspace <p>]
bun tools/observe/observe.ts add    --kind <kind> --what <text> [--effect read|write] [--step <s>] [--out-of-band] [--<field> <v> ...]
bun tools/observe/observe.ts label  --seq <n> --step <s>
bun tools/observe/observe.ts gap    --seq <n> --status open|corrected|worked_around|escalated|resolved [--note <t>]
bun tools/observe/observe.ts close  [--why completed|abandoned|interrupted] [--note <text>]
bun tools/observe/observe.ts status [--obs <id>]
bun tools/observe/observe.ts brief  [--subject <ticket>]
```

`OBSERVE_DIR` sets where recordings land -- point it at the subject's own workgroup folder, since the subject owns its recordings. Default is `./observations`.

Unrecognised flags ride along as kind-specific fields, so `--cmd`, `--exit`, `--surface`, `--asked`, `--outcome`, `--to` and `--reconciled_by` need no special casing. `exit` and `reconciled_by` are coerced to numbers; nothing else is, because blanket coercion turns a version like `1.20` into `1.2`.

**`brief` is how a caller instructs a recorder.** It prints the current recording instructions, so a prompt references this command instead of pasting its own copy. The copy is the failure mode: three prompts were once written with the instructions typed in, and the first change to the gap contract made all three wrong without any of them noticing.

## What a gap carries, and why it is three fields rather than two

**`disposition` and `status` answer different questions, and one slot could not hold both.** Measured over the first eleven recordings, 12 of 27 gaps carried no usable disposition: six sat outside the enum -- `worked-around`, `accepted`, `corrected -- used command cp -f ...`, `STOPPED and escalated to the operator ...` -- and six were absent entirely. **The off-enum values were more informative than the enum**, which is the finding. Recorders were not being sloppy; they needed to say what *became* of a gap and the only field available was the one that says why it was invisible.

The cost is mechanical, not aesthetic. `INT-38-review#7` records `disposition: "unobservable"` on a gap whose text begins `RESOLVED` -- **a consumer that trusts the field counts a closed gap as an open one**, with full confidence and no way to notice.

So the two axes are separated:

- **`--disposition`** -- *why the instrument could not look*: `deferred` (a later phase can see it), `unobservable` (nothing available can), `not_permitted` (the instrument declined -- the one that reads exactly like an absent value). Fixed at the moment the gap is noticed, and never revised.
- **`--status`** -- *what has become of it*: `open` (the default), `corrected`, `worked_around`, `escalated`, `resolved`. Known later than the gap itself, which is why `observe gap --seq <n> --status <s>` exists: it **appends** a new opinion about an earlier entry rather than patching it, the same shape `label` uses and for the same reason. Overwriting would destroy the fact that the status ever moved.

The refusal on an off-enum `--disposition` names `--status` in its message, because a recorder reaching for `corrected` there is not making a mistake -- they are reaching for a field that did not used to exist.

## `meta_change` is attribution; `instrument_fault` is the recorder

`meta_change` exists because a conclusion drawn after the model or harness changed has a different provenance from one drawn before it. **Both of its recorded uses were instead a failure of the recorder** -- an entry describing the instrument rather than the work. They are not the same event and averaging them makes neither countable.

`meta_change` now **requires `--field` (`model`|`harness`|`workspace`) and `--to`**, which is what makes the misuse impossible rather than merely discouraged: you cannot name an attribution change that did not happen. Recorder failures -- a recording opened late, entries backfilled, a brief that was corrected mid-run -- go to **`instrument_fault`**, the one kind whose subject is the instrument.

## `close.why` keeps its enum, and gains a note beside it

**Decision: enforce the enum, and add `--note`.** The drift was real and pointed at something true -- one recording closed with *"built, gated and committed; stopped at the reproduction gap for an operator decision"*, which says more than any of three words -- but the remedy is a slot for the prose, not an open field. **An enum is the only form a close reason can be counted in**, and a corpus that cannot be counted cannot answer whether recordings are finishing or being abandoned, which is the one question the terminator exists to serve.

`--note` is **required whenever `--why` is not `completed`**. A recording that stopped without saying what stopped it is precisely the case three words cannot cover.

This is the same principle as the gap split, applied twice: **the enum carries the axis a machine counts, a free-text field carries what the enum cannot say, and neither is asked to do the other's job.**

## Reading records written under the older shape

`SCHEMA_VERSION` is **2**. Nothing was renamed or removed, every field added is optional on read, and the eleven existing recordings are read without migration. `status` prints a gap ledger, and against an older record it shows the `disposition` **verbatim including values outside today's enum** -- the drift is evidence -- and reports the status as `unrecorded` rather than defaulting it to `open`. Assuming a gap is open when nothing says so is the same unearned confidence the split was made to remove.

## Two behaviours worth knowing

**Several recordings at once, addressed by `<ticket>_<id>`.** Two agents on the same ticket each get their own record, which is the collision this naming exists to prevent. There is **no global "currently open" pointer** -- openness is derived by reading each record for a terminator, so nothing beside the records can go stale or be corrupted by a concurrent writer. `--obs` is optional while exactly one is open and **required once more than one is**: where the answer is ambiguous the tool refuses rather than guessing, because guessing appends one agent's work to another's file.

**A label is appended, never patched in.** `label` writes a new line assigning a step to an earlier entry, because the record is append-only and a step assignment is a later opinion about an earlier fact. Both belong in the file, in that order.

## Exercised at the consuming interface

Per [`primitives/README.md`](../../foundations/Agentic_Engineering/primitives/README.md): valid; missing input refuses and names what was missing; malformed `--kind` refuses without appending; labelling a non-existent entry refuses; adding to a closed or unknown recording refuses; **two recordings opened on one ticket receive distinct identities and neither sees the other's entries**; and **an unqualified instruction with two recordings open refuses and lists them** rather than picking one -- the collision case, which is the one worth having.

Added with the field split: a gap missing `--tool` or `--disposition` refuses and names which; an **off-enum `--disposition` refuses and routes the recorder to `--status`**; an off-enum `--status` refuses; a `meta_change` without `--field`/`--to` refuses and names `instrument_fault`; `gap --seq` **on an entry that is not a gap refuses**; `close --why abandoned` without `--note` refuses; an off-enum `--why` refuses and routes to `--note`. Every refusal leaves the record byte-identical. And the one that is not a refusal at all: **a real schema-1 recording carrying six off-enum dispositions is read by the new tool without migration**, which is the case that would otherwise be discovered by losing a record.

Not exercised, because the surface does not exist: authorization and timeout. There is nothing to authorize and nothing long-running to time out. Recorded here rather than left as an apparent omission.
