# 🖥️ Verifying in a browser

How to check that a change does what it claims **in the running application**, and how to leave nothing behind. The subject here is not a repository — it is a live system, and almost everything that makes this hard follows from that.

The blueprint for what a check must bind to is [`primitives/gate.md`](../foundations/Agentic_Engineering/primitives/gate.md); what the instrument can and cannot do is [`foundations/Software_Engineering/02`](../foundations/Software_Engineering/02_TESTING_AND_EVIDENCE.md), whose probabilistic-instrument section governs every claim made from a screen.

## Two paths, and the default is the automated one

**A headless browser is the default.** It gives an isolated session per run, so checks fan out like anything else, and it contends with nobody's workspace.

**Driving a person's real browser is the exception**, reserved for checks that genuinely need a human-driven session — an identity only that profile holds, or evidence someone wants to watch being produced. Everything in the next section is a property of *that* path, and none of it should be paid for on the automated one.

Keep the two separated by name as well as by rule. A single flow that silently switches between them inherits the strictest constraints of both and nobody can tell which applies.

## The real browser is one resource, and that decides the manual path

**One instance, one storage partition, one logged-in identity.** Tabs and tab groups organise a run's pages; they do not isolate its state. Two runs driving the browser at the same time are driving one session — one run's navigation lands in the other's page, and a login performed by one changes what the other sees.

So: **the manual path serialises, and everything else does not.** Reading code, forming a hypothesis, writing a test, running a suite — all of that fans out freely. Only the phase that touches the live application is a single resource, and a workflow that treats it as anything else produces interference indistinguishable from a product defect.

A step needing two identities — two roles, two tenants, signed-in versus anonymous — **logs out and back in between them**. It does not assume isolation that is not there.

**What the path buys, and the one thing it costs the operator.** Inheriting a real profile means inheriting its logged-in identity, so there is no authentication to script — which is most of why the exception exists, and worth stating because it is easy to reach for the manual path for reasons that the automated one would also satisfy. The cost is not technical: driving that browser typically opens a **separate window the operator is not looking at**, so a run that says nothing appears to be doing nothing. **Say which window to watch, at the moment it opens.** Evidence somebody asked to watch being produced is not evidence if they cannot find it, and this is the one failure here that is entirely avoidable by saying a sentence.

## Before touching the application

**Prove the tree being served is the tree under test.** A development server left running from earlier work answers a port exactly like the real thing, and the result is that a change is verified against code that does not contain it. Ask which tree is being served, not whether something responds.

**The stack is started from where the stack is defined**, which is not necessarily the directory the work is in. A workflow carries both: the workspace it edits, and the working directory that brings services up.

## Proving the tree under test, mechanically

The rule above is stated as a question to ask. Asking it is not a procedure, and a requirement with no mechanism behind it is satisfied by whoever is most confident. The chain below answers it deterministically and costs about a second; every part of it is portable, and the only bindings are the port and the paths of the change being verified.

```bash
PORT=<the port the application under test is served on>
APP_URL=<the URL a person would actually open, including any path prefix>

# 1. What process is serving that port, and out of which directory?
PID="$(lsof -nP -iTCP:"$PORT" -sTCP:LISTEN -t | head -1)"
[ -n "$PID" ] || { echo "nothing is listening on $PORT"; exit 1; }
CWD="$(lsof -a -p "$PID" -d cwd -Fn | sed -n 's/^n//p')"
echo "port $PORT -> pid $PID -> cwd $CWD"

# 2. What revision is that directory on, and is it clean?
git -C "$CWD" branch --show-current && git -C "$CWD" status --short

# 3. Is the change actually on disk there? Grep the changed symbol.
#    Never infer this from the branch name -- the branch is a label, the symbol is the fact.
rg -n '<changed-symbol>' "$CWD/<changed-file>"

# 4. Is the artifact being served the one just built? A 200 does not mean the right page.
curl -s "$APP_URL" | rg -n '<entry script or known marker>'
```

**The output is one sentence, and a check that cannot produce it has not passed:** *port P is served by pid X out of directory C, which is on revision B and contains the change, and the client has loaded that build.*

Three things about this are worth stating separately, because each is a distinct failure it closes:

- **The directory is resolved from the listening process, not assumed.** The workspace being edited and the workspace being served are different facts, and a workflow that conflates them verifies the wrong tree while reporting success. This is the same requirement a [gate](../foundations/Agentic_Engineering/primitives/gate.md) records as `workspace`, arriving from the runtime side.
- **The symbol is grepped rather than inferred.** A branch name says what someone intended; the symbol says what is there. A checkout that was switched but not rebuilt satisfies every check except this one.
- **Then hard-reload the client exactly once, and stop reloading.** A tab left open survives a server restart and keeps serving the previous build from memory. The single reload is necessary; repeated reloading is actively harmful, because in any defect involving a stale read the reload is also what *hides* it.

## Driving the interface without invalidating the run

The instrument is part of the observation, and three of its properties routinely produce results that look like product defects.

- **Match elements by test id or by target, never by visible text.** Visible text is not unique, it is not stable, and it is shared across navigation chrome and content. A run that matched on text once selected a sidebar navigation item instead of the content tab with the same label, and every observation made afterwards was against the wrong screen -- with nothing in the transcript indicating it.
- **Click through the interface; do not navigate to URLs.** A browser-level navigation is a hard page load, which destroys in-memory client state. Any change whose whole claim is that state now *persists* across an interaction will look broken when it is not, and the check will have disproved something nobody was asserting.
- **Screenshot coordinates are scaled relative to the document's own coordinates.** Clicking at a position read off an image lands somewhere else. Act through the document, or through an instrument that owns the mapping itself; do not arithmetic your way between the two.

**Do not run a full test suite while driving a browser.** Load climbs, the browser's script evaluation crosses its timeout -- on the order of forty-five seconds -- and the failure presents as an application fault. The suite and the browser are both legitimate instruments and they are not simultaneous ones. The related tell: two consecutive full-suite runs failing *different, non-overlapping* sets is the signature of resource starvation rather than of a regression, and the remedy is re-running the named suites in isolation before believing either verdict.

## Instrument from outside the application before editing it

Where the question is about state rather than about pixels, the reflex is to add logging to the source. Prefer the instrument that requires no source change at all: **subscribe to the application's own state container from the page**, rather than polling the document or reading a devtools panel.

It is better on three counts and the third is the one that decides it. It dirties no workspace, so it cannot collide with a delivery run or leave instrumentation behind. It needs no rebuild. And **a subscriber fires on every change, where polling samples** -- so it sees transient states that nothing else does. A frame lasting tens of milliseconds is invisible to document polling and to a person watching; in the run this is drawn from, a 33-millisecond empty frame was the entire defect.

**Measure the duration of any transient state that appears.** If reproduction correlates with that duration, the defect is a race, and that changes both the fix and the shape of the regression test -- a race cannot be covered by a test that does not force the ordering.

Two warnings that cost real time:

- **Never add a dependency to a memoization or effect while instrumenting.** Doing so changes the behaviour under measurement, and in the direction that *fixes* the thing being measured. This invalidated three consecutive runs in the session this is taken from before it was noticed.
- **Confirm which request mechanism the application actually uses before patching one.** Instrumenting the wrong transport is silent -- it does not error, it simply never fires, which reads as "the hypothesis was wrong" rather than as "the probe was never installed."

Wrap rather than rewrite, log on change rather than continuously, and log identities and counts rather than only values -- a count that is right and a collection that is the wrong one are indistinguishable from the values alone.

## Three different jobs, and they want different done-conditions

"Driving the application" covers three activities that a single flow tends to conflate, and each has a different trigger and a different definition of done:

| Job | Trigger | Done when |
|---|---|---|
| **Planning** | A change to existing interface behaviour is being scoped | Current behaviour is described from observation rather than from the code |
| **Verification** | An implementation is complete and not yet delivered | The claim holds in the running application, with the pair captured |
| **Debugging** | A symptom does not reproduce under test | The broken boundary is named, or non-reproduction is recorded as the finding |

They are separated because the done-condition is what a workflow gates on, and a flow that shares one across all three either stops too early on the hardest or grinds on the simplest. Planning is the one most often left undocumented, because it survives as a habit rather than as a step.

## Capture before and after, as a pair

**A defect that reproduces in the browser is captured twice: once showing the defect, once showing it gone.** The pair is the evidence, and neither half is worth much alone — a picture of a broken screen does not establish that anything fixed it, and a picture of a working screen does not establish that anything was ever wrong.

Both go on the ticket. The reason is that **the people who most need them are not in the conversation where they were produced**: whoever reviews the change, whoever tests it afterwards, and whoever reads the ticket in a year trying to work out what the symptom actually looked like. A description of a visual defect is a poor substitute for the defect, and it is the first thing to go stale.

Capture the *before* while the defect is still reproducible — which in practice means **before the fix exists**, during the investigation, because afterwards it costs a revert to get back to it.

**Two rules about what to capture:**

- **The same view, the same data, the same position.** A pair taken from two different states proves nothing, and the difference a reader is meant to see gets lost among differences nobody meant.
- **A recording rather than a still, only when the defect is in the motion** — something that shifts, flickers, reorders or animates. A still is easier to read and harder to misinterpret, and most defects are visible in one.

**When to skip the pair entirely.** Where the mechanism only manifests under real timing, load or data conditions, a recording either shows nothing or requires artificially widening the window to make it visible — and a widened window is no longer the defect. **Put the weight on a test that forces the condition deterministically**, and say in the ticket why there is no recording. An absent capture with a stated reason is honest; one that quietly shows a faked symptom is worse than none.

## Capture as you go, because the state does not survive

A running application's state is gone the moment the run ends. **A screenshot taken at the moment of the claim is the evidence; a description written afterwards is a recollection.**

Capture on passes as well as failures. A trail kept only for failures cannot establish what a pass looked like when the next one disagrees with it.

**Name the instrument beside the result.** A claim sourced from reading a screen is not interchangeable with one sourced from an exit code, and nothing but the record can say which it was.

## What an empty result means here

**An instrument that cannot look reports the same silence as one that looked and found nothing.** Some values are unreadable by policy rather than absent — a check that reads one and finds it missing will conclude the wrong thing with complete confidence.

So a browser check binds to **what the interface renders**, which is observable, rather than to state it is not permitted to read. Where a check must consult something it cannot see, it reports that it could not look.

## Tear down unconditionally

Everything opened is the run's to close: tabs, the tab group, any server it started, any session it authenticated.

**Capture into the records first, then release — and release whether the run passed or failed.** The only reason to hold a failed run's resources is the evidence inside them; once that is written down the resource holds nothing that is not already recorded, and teardown stops being conditional. That removes the failure mode where cleanup only happens on the happy path.

Release from the run's own action log rather than from what happens to be listening. Guessing in that direction eventually closes something a person deliberately left open, which is indistinguishable from a crash to whoever was using it.
