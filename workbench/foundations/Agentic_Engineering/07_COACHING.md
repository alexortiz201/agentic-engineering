# 🎓 Coaching -- the agentic curriculum

What to teach someone learning to build agentic systems: the questions that expose whether they understand it, the distinctions that most confusion reduces to, and the order the work is handed to them in. **This is the subject, not the method.** How a session is run, how mastery is scored, and what a session leaves behind are in [`Coaching/`](../Coaching/README.md) and are not restated here.

## The mode relaxes no rule

`coaching` is one of the declared engagement modes: the engineer proposes and defends decisions, and the coach reaches for questions and hints before doing it for them. **It does not relax any rule.** Everything produced under it is subject to the same authority boundaries, the same gates and the same evidence discipline as delivery work -- a gate that did not observe its subject still reports `blocked`, an agent still cannot approve itself, and a failure is still preserved as state rather than narrated away.

What changes is **who decides and who explains**, not what is permitted. The distinction matters because the opposite reading is the natural one: a session framed as learning invites a lowered bar, and a lowered bar teaches the wrong discipline more effectively than any explanation teaches the right one. Work produced in coaching mode ships or is discarded on the same terms as any other work.

## The questions that do the teaching

When a proposal arrives, the question is the response. These are the ones that carry this subject matter:

| When they propose | Ask |
|---|---|
| an agent | why an agent is required here |
| deterministic code | what invariant it protects |
| a phase | what evidence permits the transition out of it |
| an abstraction | what repeated, real evidence justifies it |
| autonomy | what authority and blast radius it actually carries |

Each row targets the decision that is usually made by default rather than on purpose. An agent gets reached for because it is the available instrument, not because the step requires judgment. A phase boundary gets drawn where the narrative breaks, not where evidence changes hands. An abstraction gets extracted from one occurrence. Autonomy gets described as a capability the workflow has rather than an authority it was granted, which is the collapse that produces the worst outcomes on this list.

Why the question is preferred to the answer, and what a wrong answer is worth, is in [`Coaching/01_THE_SESSION_LOOP.md`](../Coaching/01_THE_SESSION_LOOP.md).

## Distinctions worth forcing

Most confusion in this discipline reduces to one of these being collapsed:

- agent vs. code vs. human
- proposal vs. execution
- capability vs. authorization
- phase completion vs. outcome acceptance
- output structure vs. verified meaning
- retry vs. repair vs. workflow loop
- project-specific implementation vs. reusable primitive

When an explanation sounds right but lands wrong, check whether two sides of one of these pairs have been treated as the same thing. The symptom is consistent: the reasoning is internally sound and the conclusion is unsafe, because a step in it silently swapped one side for the other. Forcing the distinction out loud -- *which of those two is this* -- resolves it faster than arguing with the conclusion.

## Practice progression

Roughly ordered by what each one requires the previous to be in place:

problem modeling -> workflow decomposition -> a deterministic quality adapter -> a typed handoff -> an evidence-producing gate -> a bounded repair loop -> explicit acceptance -> execution trace and observability -> isolation and permissions -> reuse across a second real project -> extracting proven primitives -> composing larger workflows

The ordering is a dependency claim, not a syllabus. A bounded repair loop cannot be built by someone who has not yet made a gate produce evidence, because the loop's exit condition is that evidence; extracting primitives before running the same thing on a second real project encodes a guess. Each rung is a candidate for the next exercise, and the rung chosen is the difficulty set at the start of a session -- **on progressively harder real work, never on a constructed exercise**, for the reasons in [`Coaching/01_THE_SESSION_LOOP.md`](../Coaching/01_THE_SESSION_LOOP.md).

---

Scoring a named capability from this ladder, and what to record at the end of a session, is in [`Coaching/02_MASTERY.md`](../Coaching/02_MASTERY.md). The concepts being taught are the rest of this folder: [`01_PRINCIPLES.md`](01_PRINCIPLES.md), [`02_WORKFLOW.md`](02_WORKFLOW.md), [`03_AUTHORITY_AND_SAFETY.md`](03_AUTHORITY_AND_SAFETY.md), [`04_VERIFICATION.md`](04_VERIFICATION.md), [`05_RECOVERY_AND_HANDOFF.md`](05_RECOVERY_AND_HANDOFF.md), [`06_ADW_COMPOSITION.md`](06_ADW_COMPOSITION.md), [`08_GATES.md`](08_GATES.md), [`09_CONTROL_PLANE_TESTS.md`](09_CONTROL_PLANE_TESTS.md) and [`primitives/`](primitives/README.md).
