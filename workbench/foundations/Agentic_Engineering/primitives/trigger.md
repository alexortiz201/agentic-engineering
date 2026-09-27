# ⚡ Trigger

How a run starts without a person. It selects work, **claims it**, and dispatches -- and the claim is the part that is usually wrong.

## Must contain

**Why this item was selected**, recorded alongside the claim. Work a system originates for itself with no stated rationale is unreviewable, and unreviewable autonomy is the kind that gets switched off after the first surprise. The selector's reasoning is cheap to record at the moment of selection and impossible to reconstruct afterwards.


- **A cheap check before an expensive one.** Decide whether there is *possibly* work using deterministic code, and only then spend an agent call. A poller that invokes a model every interval whether or not there is work is paying to be told "nothing".
- **Claim before processing.** Mark the item taken *first*, and **abort that item if the claim fails**. Work started before a successful claim is work that can be done twice.
- **A claimed state that is outside the selection filter**, so the lock and the query are one mechanism rather than two that can disagree.
- **A terminal write on every path** -- success, failure, and error all record an outcome.
- **Concurrency bounded by live work**, counted by what is currently running. A counter of lifetime starts stops the trigger permanently once it reaches the limit.
- **Dispatch detached**, so in-flight work survives a restart of the trigger.
- **Dry-run and run-once**, with dry-run threaded through every mutating call rather than checked once at the top. Those two flags are what make a trigger testable.

## If it accepts external input

- **Verify the request is authentic before acting on it** -- a signature, checked in constant time, with unsigned requests rejected. A trigger that runs code on unauthenticated input is a remote execution endpoint.
- **Acknowledge fast, work asynchronously.** Senders time out; the claim must already be durable.
- **Refuse to start a dependent workflow** that requires prior state it was not given.
- **Ignore your own output.** Anything that both reads and writes a shared surface needs a marker that identifies its own writes, or it will respond to itself.

## Claims need an expiry

A claim without a lease is permanent. When the worker dies, the item stays claimed, sits outside the selection filter, and becomes invisible. Something must notice and release it.

## Rules

- **Distinguish "no work" from "cannot reach the source."** Identical handling of both means an outage looks like a quiet day.
- **Hold no credentials the agent could reach.** Where an external system needs one, let the tool the agent calls hold it.
