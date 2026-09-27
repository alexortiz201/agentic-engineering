# 🔬 Verification

Checking work is engineering, and most of it did not change: the check ladder, the order to spend checks in, the evidence record, the gate rules, and how a flaky failure is adjudicated are in [`Software_Engineering/02_TESTING_AND_EVIDENCE.md`](../Software_Engineering/02_TESTING_AND_EVIDENCE.md); what a review inspects and what a finding carries are in [`Software_Engineering/03_CODE_REVIEW.md`](../Software_Engineering/03_CODE_REVIEW.md). What follows is only what changes because the thing making the claim can produce a fluent, well-formed report of work it did not do.

## Provenance -- what actually produced the claim

Every evidence record carries a `source` alongside its result: `executed` (the command ran here), `inspected` (read the code or diff), `documented` (a document claims it), `asserted` (an agent says so). These match evidence-hierarchy tiers 2, 3, 5 and 6.

**A check record that is `passed` with `source: asserted` is not a passed check; it is an assertion that a check passed.** The result field and the provenance field are answering different questions, and reading only the first is how a run that never executed anything reports green.

Gates read `source`: a required mechanical check satisfies its gate only with `source: executed`; a review gate accepts `inspected` for findings; `documented` and `asserted` never satisfy a required check, only inform one.

## A gate must find its subject

A gate whose subject is a change must record its diff base and changed-file count and must decide `blocked` when the count is `0` -- **an empty diff means the gate did not find its subject**, which is not the same as finding nothing wrong with it. See "A gate must bind to a non-empty diff" in [gates](08_GATES.md).

## What an agent produces that is not output

**Agent completion, populated state, an existing directory and a path-looking string do not prove correct output.** Each of them is a side effect of the attempt rather than a property of the result, and each is produced just as readily by an attempt that did nothing. Validate identity, containment, content and freshness.

**Keep required mechanical gates in the controller and outside builder control.** A check the builder can run, interpret and report on is a check the builder can satisfy by reporting. In supervised sessions, label agent-only checks honestly -- `agent-checked` is not `code-enforced`, and calling it one does not make it one.

## Verify the permission-shaped claim the same way as the artifact-shaped ones

"This action was permitted" is established by consulting the independent policy, never by the proposer asserting it. That is the claim most often taken on trust, and it is the one where trusting the proposer defeats the entire separation between proposing and authorizing.

## A finding a gate can act on

Findings carry `disposition`, `severity` and `risk_accepted`, defined in [`Software_Engineering/03_CODE_REVIEW.md`](../Software_Engineering/03_CODE_REVIEW.md). Only one of them is machine-consumed: **`disposition` is the field a gate reads.** A gate that has to interpret `severity` is a gate that can be handed a value it cannot act on -- a human-facing vocabulary has no obligation to stay inside the set some gate was written against.

Test for a conformant review record: a gate can decide using `disposition` alone, without reading `severity`, and an approval listing any unresolved `blocker` with `risk_accepted: false` is rejected.

## The reviewer is frequently an agent

**Reviewer output is advisory until an independent gate accepts it** -- the rule is in [`Software_Engineering/03_CODE_REVIEW.md`](../Software_Engineering/03_CODE_REVIEW.md), and agents are what make it a live risk rather than a formality. An agent review returns on every run, returns quickly, and returns something that reads like a decision; at that volume an approval consumed as a gate result is the path of least resistance, and approval quietly becomes authorization. The reviewing agent cannot authorize its own findings any more than the building agent can authorize its own work.

## An inherited claim is a hypothesis, not an input

Everything above governs claims a run **emits**. The symmetric case is more common and has no rule: a phase reads what a work item, a predecessor phase or a prior agent said, and reasons from it. No gate is involved and no rule is broken, and every conclusion downstream now rests on a claim nobody tested.

**A claim arrives at the provenance it was recorded with** -- usually `asserted` or `documented`. A phase that acts on it either promotes it by observing independently and records that, or carries it forward still marked unverified. Reading a predecessor's prose and treating it as established is promoting a weaker claim into a stronger one, which is prohibited everywhere else and is easy to miss here because it happens by reading rather than by writing.

Agentic work makes this acute: every phase boundary hands over fluent, confident prose, and compact handoffs deliberately strip the context a reader would need in order to doubt it.

- **Enumerate the distinct claims before testing any of them.** A report naming a symptom, a cause, and the link between them is three claims, not one, and they fail independently.
- **Say which claims remain unexplained.** A pass where every stated claim resolved but a symptom is still unaccounted for is not finished, and reporting it as finished is how a wrong diagnosis survives into the fix.

### A claim under test has three verdicts, and the third is the common one

Testing an inherited claim looks binary -- it holds or it does not -- and reporting it that way loses the outcome that occurs most often. The contract is **`confirmed` / `refuted` / `partial`**, where `partial` means *the mechanism is real, and the claim describes it incorrectly*. Forced into a binary, that outcome goes to whichever neighbour is wrong: called `confirmed`, it carries a wrong description into the fix; called `refuted`, it throws away a real mechanism. This is the same argument that makes `partially_verified` a handoff outcome rather than a rounding of one, applied to a single claim rather than to a run.

`partial` obliges a statement of **exactly which part is wrong**, or it is a hedge. Four shapes account for most of them, and each is worth checking by name:

- **The wrong field, reference or variable named.** The symptom is real and the thing blamed is a neighbour that is in fact untouched. Check that the thing blamed is the thing written.
- **An inverted or over-specified branch mapping.** The claim says one condition produces one outcome and another produces a second, when one branch produces both depending on something the claim never mentions. Read the selector and state what it is keyed on.
- **A second mechanism invented to explain a second symptom.** It is frequently the half that is wrong, and it inherits credibility from the half that is right. Test it separately and with equal suspicion.
- **A timing-dependent mechanism described as deterministic**, or the reverse. If a race is involved, name the window.

## Verify by prediction, not by observation

Everything this document asks for is retrospective -- it validates records of things that already ran. That is exactly the gap a fluent post-hoc account walks through, because the actor writing the record is the one that chose what to put in it.

**State a falsifiable prediction before the run, then run it.** This configuration fails, that one passes, and the discriminator is the named thing. A diagnosis that only explains results after seeing them is not a diagnosis yet; it is a story that fits. The finding is confirmed when one variable separates every pass from every fail with no exceptions, and a single exception is the whole result.

This is the one instrument that structurally prevents narrating a conclusion into place, and it costs one sentence written down before the evidence exists.

## A wrong reason is worse than no reason

Every record here demands a reason -- why a check is inapplicable, why a gap exists, why a claim changed. The rule that is missing beside it is what to do when the reason is not known, and the default in that situation is to supply a plausible one, because a blank field reads as carelessness while an explanation reads as work.

**It is the worse of the two, and the mechanism is specific: an explanation closes the question.** Nobody re-opens a gap that already has a cause written next to it, so a wrong reason does not merely fail to inform -- it removes the conditions under which anyone would find out. A blank one is at least legible as an open question.

So `cause unknown` and `not covered` are acceptable entries, and preferable to a guess written in the register of a finding. The same applies to a correction: where the original claim carried a justification and that justification was also wrong, **correct both**, and where the true reason cannot be identified, say it is unknown rather than leaving the refuted one standing as the explanation of record.

## Test the control plane, not the files

For workflow implementation, also test the [control-plane failure cases](09_CONTROL_PLANE_TESTS.md) before unattended adoption. **Static file/link validation is not an end-to-end ADW test** -- it establishes that the workflow is well-formed, not that it runs, and the failures that matter unattended are the ones that only appear when it does.
