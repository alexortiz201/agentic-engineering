# workflow

Skeletons for the two things a workflow is made of: a **phase** and the **prompt payload** a phase hands to an agent.

Earned rather than assumed — these come from having written the same shapes twice, on a deterministic phase and an agentic one, and keeping what was identical. Anything that differed between them is not here.

**Markdown with fenced code, never importable.** Copy the block, do not link to it. A copy that drifts from this template is the copy being right about its own situation.

| File | For |
|---|---|
| [`phase.md`](phase.md) | One step of a workflow, as code |
| [`prompt.md`](prompt.md) | The payload a phase hands to an agent |

`composition.md` is deliberately absent: a composition is a sequence of phases run in order with failure propagated, and nothing has been written twice yet that a template would capture. It is earned by the second real composition.
