# 💾 State

What a run persists so it can be resumed, inspected, or handed to another phase. **The handoff mechanism** -- phases do not pass data to each other, they pass an identifier and re-read state.

## Must hold

- **The run identifier**, and enough identity to reconstruct what the run is about.
- **Where the work is happening** -- the workspace, and any resources reserved for it.
- **What has been produced so far** -- the artifacts later phases depend on.
- **Which phases have run**, in order.
- **Configuration chosen for this run** that later phases must honour.

Keep the set small and closed. A state record that accepts anything is a log.

## The run identifier is the spine

One short identifier, minted once, that appears in **everything the run touches** -- the workspace it created, the resources it reserved, the artifacts it wrote, the messages it posted, the commits it made. It is what makes a run reconstructable afterwards by someone who was not watching.

Phases do not pass data to each other. **They pass this identifier and re-read state.** That is what lets a phase be run alone, resumed after a failure, or debugged in isolation.

## Minimum field set

Beyond the fields every [record](record.md) carries:

| Field | Holds |
|---|---|
| `run_id` | The identifier that ties the whole run together |
| `task_ref` | What this run is about, in the tracker's terms |
| `task_state` | One value from the lifecycle |
| `blocked` / `repairing` / `return_to` | The orthogonal flags, and which state owns the failure |
| `workspace` | Where the work is happening |
| `reserved` | Resources held for this run -- ports, slots, locks |
| `artifacts` | Paths to what has been produced, by kind |
| `phases_run` | In order, so the path taken is visible |
| `attempts` | Per retry kind, plus the shared total |
| `config` | Choices later phases must honour -- model set, engagement mode, operating level, and the `descent_reason` and `return_condition` that justify a level movement |
| `total_budget` | The shared cap across all retry kinds |

Keep it closed. If something does not need to survive the process that wrote it, it is not state.

**This table is the authority for the field set.** A task-level run adds fields on top of it -- acceptance criteria, scope, granted authority, retained failures, the next action awaited -- and those are additions, not replacements. Anything showing a state record elsewhere is an example of this shape, not a second definition of it; where the two disagree, this one is right.

## Rules

- **Validate on write and on read.** A malformed record found at read time has already cost you the run.
- **Reject unknown fields loudly.** Silently dropping a write, then reporting success, is the worst available behaviour -- the caller believes something was recorded that was not.
- **Store it outside the disposable workspace.** State must outlive the thing it describes.
- **Write after every material fact**, not at the end.
- **Write-then-rename** so a reader never sees a partial record.
- **No secrets.**

## Common failure

Building two handoff mechanisms -- a state file *and* a piping channel -- and leaving one dead. Pick one. The dead one will be re-enabled years later by someone who does not know it was abandoned.
