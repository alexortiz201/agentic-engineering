# 🗂️ Run artifacts -- `runs/<run_id>/`

Where this package writes what a run produces. Four files previously stated a fragment of this each; it lives here now.

## The convention

```
runs/<run_id>/
  TASK_BRIEF.md     the bounded outcome and acceptance criteria
  PLAN.md           for non-trivial work
  TASK_STATE.json   updated after each step and before yielding
  actions.jsonl     append-only, one line per action the run took
  HANDOFF.md        the result, including failures and waivers
  ...               gate and phase records, evidence, as the run produces them
```

**Subdivide by the agent that produced it once a run invokes more than one.** `runs/<run_id>/<agent_name>/` keeps each agent's raw stream, its parsed form and its final object together, so a wrong answer can be traced to the invocation that produced it rather than to the run as a whole. A run with one agent does not need the extra level; a run with six is unreadable without it, and **the agent name is what makes the directory listing a map of what the workflow actually did**.

**Keep the raw stream as well as the parsed result.** The parsed form is what the workflow consumed; the raw stream is the only thing that can answer *why the parse produced that*. Discarding it saves little and removes the one artifact that distinguishes a bad response from a bad parser.

Write **only the records the run actually needs**. Workflow-authoring work adds a design document; defect work adds a reproduction record before build; coaching adds a session record. What each must contain is in [`foundations/Agentic_Engineering/primitives/`](../foundations/Agentic_Engineering/primitives/README.md).

## Rules

- **Writing here is a mutation.** Obtain artifact-write approval first. It is not exempt because the files are "just notes".
- **Never overwrite a template, and never overwrite another run.** A run directory is append-only from the perspective of every other run.
- **Update state after each step and before yielding**, not at the end. A run that dies mid-step should leave enough to resume from.
- **Write-then-rename within the same directory** where practical, so a reader never sees a half-written record.
- **No secrets, ever** -- not in state, not in evidence, not in a handoff.
- **Retain failure evidence.** A failed result stays in the run directory alongside whatever superseded it. Deleting it is how a repair becomes indistinguishable from a pass.

## `actions.jsonl` -- what the run did

One line per action, appended as it happens. Not what the run *checked* and not what it *concluded* -- what it **did**: a command executed, a file written, an agent invoked, a service started, a browser session opened, a worktree created.

It earns its place twice over, and the second reason is the one that is easy to miss.

**It is the account a failure needs.** When something goes wrong the useful question is what had already happened, in what order, and the conclusion-shaped records cannot answer it. A handoff says where the run ended up; this says how it got there.

**It is the inventory of what this run started.** Every action that acquires a resource is already written down here, which means teardown does not have to guess. That distinction is the whole difference between releasing your own resources and killing whatever happens to be listening on a port -- and guessing wrong in that direction stops something a person deliberately left running.

Compact JSONL, because the reader is code. Identifiers, categories and references -- never payloads, never secrets, under the same rules as every other record here.

## `tear_down_hook` -- capture, then release

**Whatever a run starts in order to observe something gets stopped when the observing is done.** Processes and the ports they hold, browser sessions and tabs, containers, fixtures and temporary data, worktrees and branches created to do the work.

The question this seems to raise is whether a **failed** run should tear down or hold its resources so the failure can still be inspected. That question dissolves once the sequence is right.

**Capture first, then release, unconditionally.** The only reason to keep a failed run's browser tab or dev server alive is that the evidence is inside it. Write that evidence into the records -- the error with its detail, the state of each live resource, and the action log that is already accumulating -- and the resource now holds nothing that is not written down. Keeping it alive after that buys nothing and costs everything teardown exists to prevent.

Two consequences follow, and both are improvements on holding:

- **Teardown stops being conditional**, which removes the failure mode where it only ever runs on the happy path -- exactly the runs that leave the most behind.
- **A held resource is a forgotten resource**, and a forgotten process is not inert. It goes on answering probes and making later checks pass for conditions that stopped being true, silently, for as long as it stays up.

**Release only what this run started**, read from `actions.jsonl`. A teardown that works from what is currently listening will eventually stop something a person deliberately left running, and that failure is indistinguishable from a crash to whoever was using it.

**Record the teardown itself**, including what it could not release. A resource that outlived its run is a fact the next run needs, and a teardown that quietly failed is worse than one that never ran, because it is reported as complete.

## Generated workflows may differ

A workflow this package *generates* runs in its target project and may use that project's own artifact convention rather than this one. When it does, **record the mapping once** where the workflow is defined -- which of its artifacts corresponds to the brief, the state, the gate record, the handoff. The mapping is what keeps a generated workflow inspectable by someone who only knows this package.
