# layout

Copy these into the target, then fill them in. They are deliberately near-empty — a template that arrives pre-populated with someone else's facts is worse than an empty one, because the wrong facts read as true.

```bash
# `.profile/` is local to the package root. The other two belong at the configured
# local state root (shown as `$STATE_ROOT`); never copy an existing environment's state.
cp -R templates/layout/.profile .
mkdir -p "$STATE_ROOT"
cp -R templates/layout/.memory templates/layout/.workgroup "$STATE_ROOT"/
```

## Populate them by observing, not by asking

The important half. A walkthrough that checks whether each setup step is done is **already probing the machine** — it resolves repository paths to confirm they exist and runs the equivalent of `command -v` against the tools it expects. That probing *is* the data collection for `.profile/observed.json`, so those facts are written from what was seen rather than from what someone reports.

A profile assembled from questions records what a person believes about their machine. One derived from the same probes that gate the steps records what is actually there, and it stays honest for exactly the reason the step ledger does.

**Preferences are the exception and are asked for once.** "I prefer homebrew" cannot be observed; "homebrew is installed" must not be assumed.
