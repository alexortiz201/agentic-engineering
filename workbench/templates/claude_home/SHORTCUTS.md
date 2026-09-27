# ⌨️ Shortcuts -- personal vocabulary

> **This file is a contract, not content.** It ships as a stub on purpose: the vocabulary itself is one operator's, and copying someone else's shortcut list onto a new bench installs their habits rather than the machinery that makes shortcuts work. Replace everything below the next heading with your own.

## Why this file exists as a file

The global instruction file carries a **trigger index** -- the short table of phrases, enough that a phrase is *recognised*. This file carries the **conventions and detail** for each one, read only when a trigger actually fires.

That split is the point, and it is an [injection-point decision](../../foundations/Harness_Engineering/03_INJECTION_POINTS.md) rather than a filing one. The index is small and always loaded; the detail is large and rarely relevant, so it is a pointer in the always-loaded budget and a fetch on demand. A bench that inlines the whole thing pays its full length on every model call, forever, for text that matters a few times a day.

**Keep the two in step.** A trigger in the index with no entry here fires and finds nothing; an entry here with no index row is never recognised at all, which is the quieter of the two failures.

## Your shortcuts

Replace this section. One heading per shortcut, each stating:

- **The trigger phrase or phrases**, exactly as they would be typed.
- **What it means**, in one line -- the same line that appears in the global file's index.
- **The convention**: what gets written, where, in what shape, and what does *not* happen. A shortcut that captures a note is not a shortcut that does the work, and saying so here is what stops it being read as one.
- **What it costs if it misfires**, where that is not obvious.

## Where this file lives, and why not somewhere nicer

**Beside the harness's own configuration, not inside a repository.** A harness configuration directory is typically not a git repository, so nothing in it is destroyed by re-cloning, a fresh worktree, or wiping a checkout -- and repository lifecycles churn far more often than a harness installation does.

The cost is stated plainly rather than waved at: **no version history and no off-machine backup.** The mitigation is a committed copy in a repository whose only job is to survive, refreshed deliberately. That is a different thing from making the repository canonical, and the difference is which one dangles when the repository moves.
