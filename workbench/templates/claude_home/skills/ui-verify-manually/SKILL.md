---
name: ui-verify-manually
description: Verify a change in the operator's real, logged-in browser — the manual path. Use when a check needs a human-driven session: a real login, a tenant only that profile can reach, or evidence the operator will watch being produced. Serialises, because the real browser is one shared session. For automated checks prefer ui-verify, which drives a headless browser and can run in parallel.
---

# 🖥️ Verify in the real browser — the manual path

Act as a careful tester whose subject is a **running application** rather than a repository, and who leaves the operator's browser exactly as it was found.

**This is the manual path, and it is the exception.** It drives the operator's own browser — their profile, their logins, their windows — which is why it serialises and why it is not the default. **`ui-verify` drives a headless browser instead**: isolated sessions, parallel runs, no contention with a person's workspace. Reach for this one only when the check genuinely needs a real human-driven session — an identity only that profile holds, or evidence the operator wants to watch being produced.

The discipline is [`handbook/11_VERIFYING_IN_A_BROWSER.md`](__STATE_ROOT__/handbook/11_VERIFYING_IN_A_BROWSER.md); the observed limits of the instrument are [`.memory/tools/browser.md`](__STATE_ROOT__/.memory/tools/browser.md). Read the second before designing a check — several obvious checks cannot be written.

Competencies {
  reproducing a defect from a written report
  binding a claim to what the interface renders rather than to state that cannot be read
  evidence capture at the moment of the claim
  unconditional teardown
}

## Written against the capability, not one tool

**The browser driver is replaceable and is expected to be replaced.** Everything below that is true of *driving a browser* is discipline and stays here. Everything true only of the driver currently installed is a **dated tool fact** and lives in the tool notes, not in this flow.

The test when adding a rule: *would this still hold with a different driver?* If not, it is a tool fact.

This matters because the current driver's restrictions are load-bearing: **its single shared session is the only reason this phase serialises**, and its blocked credential access is why checks bind to rendered output. A less restrictive driver may lift either — and when one does, **the flow should stop paying for a constraint that no longer exists.** Re-read the tool notes before assuming the serialisation still applies.

## The constraint that shapes everything — while the current driver is in use

**The browser is one resource.** One instance, one storage partition, one logged-in identity. Tab groups organise pages; they do not isolate state. *(Observed 2026-09-14; re-verify against whatever driver is in use.)*

Constraints {
  **This phase serialises.** Never run two browser verifications concurrently -- they share a session, and one run's navigation lands in the other's page.
  (a check needs a second identity) => log out and back in; never assume isolation
  (another verification is already running) => wait, do not open a second
  Everything that is not the browser may still run in parallel.
}

## Before the browser

Constraints {
  **Prove the tree being served is the tree under test.** Ask which tree, never whether a port answers -- a server left from earlier work responds exactly like the real thing, and the change gets verified against code that does not contain it.
  (the stack is not up) => start it from where the stack is defined, which is usually not the directory the work is in
  Load the browser tools in **one** call before starting, and get tab context before acting.
  Create a new tab for this task. Do not reuse a tab the operator was using.
}

## Driving

Constraints {
  **Drive the real interface -- click through it.** Do not jump to a URL to reach a state a user reaches by clicking.
  (the application renders on the client) => a URL navigation is a hard page load that destroys in-memory state, so it can reproduce a "bug" that is actually the fix working. Click-through preserves it; jumping does not.
  Bind every claim to **what the interface renders**. Some values are unreadable by policy rather than absent -- a check that reads one and finds nothing concludes the wrong thing with full confidence.
  (something cannot be read) => report that it could not be looked at, never that it was empty
  Do not trigger alerts, confirms or other modal dialogs -- they block every subsequent command.
  Add logging to confirm a mechanism rather than inferring it from behaviour, and read it back from the console.
}

## Capture

Constraints {
  **A reproduced defect is captured twice — before and after — and both go on the ticket.** Neither half stands alone: a broken screen does not show that anything fixed it, and a working screen does not show that anything was wrong.
  **Take the before while the defect still reproduces**, which means before the fix exists. Afterwards it costs a revert to get back to it.
  Same view, same data, same position in both. A pair from two different states proves nothing and buries the difference the reader is meant to see.
  (the defect is in motion — shifting, flickering, reordering, animating) => record it; otherwise a still is easier to read and harder to misread
  (the mechanism needs real timing, load or data to appear) => **skip the pair**, put the weight on a test that forces the condition, and say in the ticket why there is no capture. A widened window is not the defect, and a faked symptom is worse than no picture.
  **Capture at the moment of the claim.** A running application's state is gone when the run ends; a description written afterwards is a recollection.
  Capture on passes as well as failures -- a trail kept only for failures cannot establish what a pass looked like when the next one disagrees.
  Name the instrument beside the result. A claim read off a screen is not interchangeable with one from an exit code.
  (the defect depends on real-environment timing, load or data) => skip the recording and put the weight on a test that forces the condition; a recording of that class either shows nothing or requires faking the window
}

## Teardown — unconditional

Constraints {
  **Write the evidence into the records first, then release** -- and release whether the run passed or failed. Once the evidence is written the resource holds nothing that is not already recorded.
  Close every tab this run opened, and the group with them.
  Release from this run's own record of what it started, not from what happens to be listening.
  (a resource was not started by this run) => leave it alone
}

## Steps

```sudolang
prepare(change) => ground {
  confirm which tree is served, and that it is the one under test
  (not up) => start the stack from where it is defined
  load browser tools in one call |> get tab context |> create this task's tab
}

reproduce(ground, report) => observed {
  click the path a user would take
  (the stated symptom appears) => capture it
  (it does not) => the report or the environment is wrong, and that is the finding -- say so rather than hunting for a way to make it appear
}

verify(observed, change) => verdict {
  exercise the same path against the change
  bind the verdict to rendered output
  capture the after state
}

release(verdict) => report {
  write evidence into the records
  close every tab opened |> report what was released and what could not be
}

check = prepare |> reproduce |> verify |> release
```

Commands {
  🖥️ /ui-verify-manually — reproduce, verify, capture, tear down, in the real browser
  📋 /ui-verify-manually reproduce — confirm the defect only, and stop
}
