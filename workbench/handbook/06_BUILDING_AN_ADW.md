# 🛠️ Building an ADW

The process. Blueprints for each piece are in [`foundations/Agentic_Engineering/primitives/`](../foundations/Agentic_Engineering/primitives/README.md).

## 1. Do it by hand first

Run the workflow yourself, end to end, with an agent in the terminal. Step into every node: run the check, watch the condition, do the review. **You cannot decompose a workflow you have not performed** -- and the failure routes, which are most of the work, only show up when something actually fails.

Write it out before encoding it. Any notation works.

## 2. Name the phases

One phase per thing you did that had a distinct input, output and failure mode. The sequence becomes the composition's name.

Resist specializing early. Start with the smallest workflow that does something real, and split a phase only when it has two failure modes you need to handle differently.

## 3. Decide what is code, what is an agent, and what is deferred

For each step: **does this require judgment?**

- **No** -> deterministic code. It is faster, free, and does the same thing every time.
- **Yes** -> an agent, with a bounded prompt and a declared output contract.
- **It already exists elsewhere** -> a **deferral**: hand off to it, and say so at the call site. The controller yields here rather than executing or calling, so write down what resumes the run and what it does if control never comes back -- and gate on the side effect, never on what the callee says it did.

The test that matters: *if I gave this step to two different people, would they produce the same result?* If yes, it is code.

## 4. Write the commands

One responsibility each, short, with the output contract stated twice and the artifact written somewhere derivable. The detail goes in the spec the command produces, not in the command.

## 5. Write the phases as code

The agent is invoked *by* the phase; the phase owns its internal sequencing and state writes and invokes the required independent gates. Every invocation gets a deadline. Every material fact is written to state immediately. Every failure path reports before it exits.

## 6. Compose

The composition owns identity, order, and **a failure policy per phase** -- decided by what follows each one, and recorded with its reason.

Reuse owned work at contracted phase entry points. Yield to an external workflow as a deferral and resume from its independently observed side effect. Do not insert an owned ADW as if it were a phase: the current portable contract has no child-run identity, state namespace, authority, budget, gate, cancellation, retry, or evidence-import semantics. Flatten the owned sequence until a real consumer justifies that separate typed boundary.

## 7. Prove the transitions, not just the nodes

Test plan->build, build->test, and every failure route. **The transitions are where the defects are**: argument contracts that do not match, a claim that is not atomic, a timeout handler with no timeout set. A node that works in isolation tells you nothing about the handoff.

## 8. Only then automate the start

A trigger is the last step, not the first. Before adding one: claims are atomic and expire, concurrency is bounded by live work, external input is authenticated, and every path writes a terminal status.

**Once a trigger owns the start, the workflow may no longer abort** -- it owes its queue an outcome.

## Throughout

**Reuse must be earned.** Build for this project. Extract a primitive on the second real use, not the first -- and record what you chose not to extract, because that is the note that keeps the rule honest.
