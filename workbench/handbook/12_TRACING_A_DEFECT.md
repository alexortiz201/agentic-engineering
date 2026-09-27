# 🧵 Tracing a defect across boundaries

What to do when a defect does **not** reproduce under test, or reproduces and nobody can say where it goes wrong. The subject is a write that appears to succeed while the thing a person looks at does not change, and the output is **the first boundary that disagrees with the one before it**, named with a file and a line -- or an explicit *does not reproduce*, which is a finding rather than a failure to find one.

[Working a defect](README.md#working-a-defect) says to reproduce before proposing a cause. This is the procedure for the case where that instruction is the hard part. [`11_VERIFYING_IN_A_BROWSER.md`](11_VERIFYING_IN_A_BROWSER.md) names *debugging* as one of the three jobs a running application is driven for, and gives its done-condition as *the broken boundary is named*; this file is how that condition is met.

**Reach for it when** a write returns success and the view does not update; a reload "fixes" it, which is the tell for a stale read path rather than a failed write; a diagnosis is rated *likely* rather than confirmed, or admits a link nobody observed; a fix has been approved for the symptom and must be checked before the record is closed; or reports say *sometimes it works*, which is usually a varying environment or a race.

**Do not reach for it when** there is a visible exception with a stack trace -- read it -- or when the write genuinely fails, which is a different investigation, or when nobody has reproduced the symptom at first hand. Its most valuable mode is **verifying a diagnosis before building on it**, because a confident diagnosis drawn only from reading source is the failure this exists to catch.

## 0. Trust the ground

Interpret no observation until the tree under test is proven to be the tree being served. The mechanical chain is in [`11_VERIFYING_IN_A_BROWSER.md`](11_VERIFYING_IN_A_BROWSER.md) under *Proving the tree under test*, and it is not repeated here.

**Everything lost in the session this procedure is drawn from was lost before this gate.** A run that skips it does not fail; it produces confident findings about a different checkout.

## 1. Separate environment failure from product failure

A degraded machine produces symptoms indistinguishable from the defect -- slow responses, dropped work, requests that time out where they used to complete. The cheap checks are worth doing first because they are cheap: scan the service log **from the most recent boot marker** for durations, timeouts, kills and suspensions; read swap rather than free memory; and look at the resident size of the process under test, where an unexpectedly tiny figure on a busy service means it has been paged out.

Two rules follow, and the second is the one that gets broken.

- **If the environment is degraded, rebuild it cleanly. Do not tune it mid-diagnosis.** An incremental adjustment adds a variable at the exact moment the work is trying to remove them, and the adjustment that "helpfully" shrinks a pool can turn a degraded stack into a dead one.
- **A result gathered from a degraded environment is void.** Discard it and re-measure; do not reinterpret it. Reinterpretation keeps the number and changes only the story attached to it, which is how a measurement of the machine becomes a claim about the code. This is the runtime form of the [environment-induced failure](../foundations/Software_Engineering/02_TESTING_AND_EVIDENCE.md) rule, which governs what may be re-evaluated and on what evidence.

## 2. Establish ground truth at the system of record

**Never judge a write by what the interface shows.** Go to the store the write is supposed to reach and read it directly.

**Take the baseline first**, before performing the action, so that *nothing changed* is provable rather than inferred. A count and a maximum identifier over the scope in question is usually enough. Perform the action, re-read, and read the **response body** -- not the request payload, which only confirms what was sent.

That yields a two-by-two, and each cell routes somewhere different:

| Persisted? | Rendered? | Verdict |
|---|---|---|
| No | No | A write-path defect. **Stop** -- the read path is innocent and tracing it is wasted work |
| Yes | Yes | Not reproducing. Return to steps 0 and 1 before concluding anything about the report |
| **Yes** | **No** | A read or render-path defect. **Continue** |

The value of the table is the first row. Without ground truth, a write-path defect and a render-path defect present identically, and the instinct is to trace the longer of the two paths.

## 3. Invalidate the trivial explanations

Before believing in a subtle defect, eliminate the boring ones. Four account for most of them, and each is cheap to check against source:

- **The operation was a no-op** because the subject was already in the target state, and the write silently ignored a duplicate while returning success.
- **A documented cap or quota truncated it**, again while returning success.
- **A known adjacent defect produces the same surface symptom.** The record's own notes usually say so.
- **The scope is wrong** -- wrong tenant, wrong team, wrong feature flag, wrong environment, wrong record.

Cite the file and line for whichever applies. Only a **confirmed write with a missing render**, re-run against an input proven eligible, justifies the expense of the next step.

## 4. Instrument at the boundaries

**Prefer the instrument that requires no source change**, which is [`11_VERIFYING_IN_A_BROWSER.md`](11_VERIFYING_IN_A_BROWSER.md) under *Instrument from outside the application* -- it dirties no workspace, needs no rebuild, and sees transient states that sampling misses.

Where the state genuinely cannot be reached from outside -- held in a closure, a hook reference, or anything the runtime does not expose -- instrument inside, and **log at the edges where data changes hands rather than inside the logic.** The chain below is the general shape; the names differ per system and the sequence does not:

| | Boundary | The question it answers |
|---|---|---|
| B1 | Response received | Did the payload arrive carrying the fields the consumer needs? |
| B2 | Deserialization or model mapping | Did those fields survive hydration and renaming? |
| B3 | Derived keys | What keys were computed from the payload, and are they the ones the read side looks up? |
| B4 | State after the write | Did the store actually change -- by count, by membership, not by assumption? |
| B5 | Read layer or selector output | Given that state, what does the read path return? |
| B6 | Final rendered collection | What did the view receive *after* filtering, sorting and grouping? |

Rules that make the trace readable, and each one is a mistake that has been paid for:

- **Tag every probe** with the record identifier and a removal marker, so step 7 can find them all mechanically.
- **Log on change, not continuously**, or the signal drowns.
- **Log identity and counts, not only values.** A collection with the right shape and the wrong members is indistinguishable from the correct one when only values are printed.
- **Include the type of anything a loop depends on.** Iterating an absent collection is a silent no-op that reads as *the branch did not run*.
- **Wrap, never rewrite**, so the behaviour under measurement is the behaviour under test. The observer-effect rule is in [`02_TESTING_AND_EVIDENCE.md`](../foundations/Software_Engineering/02_TESTING_AND_EVIDENCE.md); the two instrumentation traps that cost the most time are in [`11`](11_VERIFYING_IN_A_BROWSER.md).
- **Emit where the tooling already collects output**, so the trace can be read from a log rather than pasted out of a screen by hand.

## 5. Read the first broken link

Walk the chain in order. **The first probe that disagrees with its predecessor is the defect**; everything downstream of it is a consequence, and chasing a downstream symptom produces a fix at the wrong layer that passes its own test.

Three checks before proposing anything:

- **Ask why the existing tests pass.** A green regression suite over a live defect almost always asserts against hand-constructed inputs that enter the chain *after* the broken boundary. **That gap is itself a finding, and it is frequently the more important one** -- it says the suite cannot see this class of defect at all, which outlives the individual fix.
- **Re-check the fix's premise.** A correct fix at the wrong layer is still broken, and it is harder to remove later than a wrong one.
- **If the symptom appears in more than one scenario, check whether they travel different paths.** One fix must cover both, or half of it ships.

## 6. Verify by prediction

State a falsifiable prediction before each run, build the results matrix, and confirm only when a single column separates every pass from every fail with no exceptions. The rule is in [`04_VERIFICATION.md`](../foundations/Agentic_Engineering/04_VERIFICATION.md) under *Verify by prediction, not by observation*, and this procedure is one of its heaviest consumers.

## 7. Close out

Remove every probe -- **find them by the marker, not by memory** -- and confirm the working tree is clean before anything is handed on. Record the verdict with the evidence trail it rests on: the identifiers read, the durations measured, the boundary named.

**If an approved or merged fix does not resolve the symptom, say so explicitly and before anyone merges on a green run.** A fix that passes its checks and does not fix the defect is the one failure this whole procedure exists to be able to report.

## Anti-patterns, each drawn from a real run

- **Theorizing from partial evidence.** Four consecutive wrong causes were proposed from suggestive-but-incomplete signals. When a decisive artifact is one request away -- the response body, the stored row, the state container -- **go and get it instead of reasoning toward it.**
- **Reading the request payload and calling it the response.** It confirms only that the right thing was sent.
- **Trusting an alarming log line that has not been traced to its source.** One warning drove an entire theory about the wrong subsystem; the data it supposedly corrupted had been correct throughout.
- **Treating a green regression test as proof.** Read what the test actually constructs before believing what its result implies.
- **Accepting "the code path exists" as confirmation.** Reachability confirms plumbing; only tracing the failing input shows whether the plumbing can produce the symptom.
- **Testing with default state.** A view that already shows the default cannot reveal a reset-to-default defect. Diverge the state first, then act.
- **Changing the running environment mid-diagnosis.** See step 1.

## Running several diagnoses at once

For a report claiming more than one mechanism, run one actor per claimed mechanism plus one checking for overlap with adjacent recent changes, and **brief each to refute rather than to confirm** -- the falsification framing in [`04_VERIFICATION.md`](../foundations/Agentic_Engineering/04_VERIFICATION.md) applies per mechanism, not once over the report. Each returns a per-boundary verdict with a file and a line.

The independence rules, and what a synthesis owes, are in [`06_ADW_COMPOSITION.md`](../foundations/Agentic_Engineering/06_ADW_COMPOSITION.md) under *Several agents against one question*. The one thing worth repeating here: when two actors disagree, **check the depth each worked at before deciding either is wrong.**
