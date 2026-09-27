# 📌 Pinned reference

External documentation frozen inside the repository, so a workflow can cite it deterministically.

## Why it exists

A model's recall of a fast-moving tool is stale and unfalsifiable, and fetching at runtime is slow, non-deterministic and requires the network. Pinning makes the reference **a fact of the repository** rather than a property of the run.

## Must contain

- **One file per source**, named for the tool rather than the URL.
- **Verbatim content.** Summarizing removes exactly the detail that made the reference worth pinning.
- **A manifest** listing each source and where it came from -- which doubles as the refresh procedure: the list *is* the configuration, and re-reading it *is* the update.
- **Committed.** A reference nobody else receives is not pinned.

## How it is consumed

One planning task, one pinned reference, named where that task lists what to read. **This is what keeps a command short** -- the framework knowledge lives in the reference, not in the prompt.

## Rules

- **Record when it was captured.** A pin without a date cannot be judged stale.
- **Pin the reference, not your summary of it.**
- A whole prior codebase flattened into one file is a legitimate reference -- *here is a worked example of this shape of thing* -- but it is a shelf a person reaches for, not something to load by default.
