# Action line

One line per action, appended as it happens. Not what the run *checked* and not what it *concluded* — what it **did**.

```json
{ "schema_version": 1, "phase": "<phase>", "seq": 0, "at": "<iso8601>", "kind": "<kind>", "...": "kind-specific fields" }
```

| `kind` | Means |
|---|---|
| `command` | Something was executed. Carry the command and its exit code |
| `agent` | An actor was invoked. Carry the prompt path, model, timeout — then a second line with the result and cost |
| `write` | An artifact was produced. Carry its path |
| `acquire` | A resource was created and must be released |
| `release` / `release_failed` | What teardown did, and what it could not do |
| `intervention` | A person changed the run while it was running. Carry **who**, the step, **what was changed**, and **what the run was about to do instead** |

**A `deferral` step writes `agent`, and then a second line for what came back.** This enum is the action vocabulary, not the step-kind axis, and it deliberately stays at six values -- but a deferral is the one step kind whose action is easy to record wrongly. The first line carries what was handed off to and when the controller yielded; the line that closes it carries **the side effect read back independently**, never the callee's account of having produced it, because the callee's output contract is not yours to declare. A deferral whose only closing line is the callee's report has logged a claim, not an action.

## It earns its place twice

**It is the account a failure needs.** A phase result says where a run ended up; this says how it got there, in order. No conclusion-shaped record can answer that.

**It is the inventory of what this run started.** Every `acquire` is already written down, so teardown releases its own resources rather than guessing from what happens to be listening on a port. Guessing in that direction eventually stops something a person deliberately left running, and that is indistinguishable from a crash to whoever was using it.

## An intervention is an event, not a statistic

**A run that was rescued and a run that needed no help are indistinguishable without this.** The history carries a count of interventions because that number says whether autonomy is real; **the count is derived from these entries**, so the two cannot drift apart the way a separately-maintained tally would.

The fourth field is the one that makes an intervention analysable rather than merely logged. **What the run was about to do instead** is the counterfactual -- it is what tells a later reader whether the intervention prevented a failure, or prevented a success nobody waited for. Without it the record says a person touched the run and nothing about why that mattered.

**A run that can be corrected mid-flight is no longer the run its configuration describes**, and an unrecorded correction transfers the credit for a workflow's reliability to whoever kept quietly rescuing it.

## The defect to avoid

**Phases of one run append to the same file, so `seq` must be scoped to the phase and stamped on every line.** A second phase that restarts `seq` at zero silently collides with the first phase's ordering key, and nothing afterwards can tell the two apart. Global ordering comes from `at`.
