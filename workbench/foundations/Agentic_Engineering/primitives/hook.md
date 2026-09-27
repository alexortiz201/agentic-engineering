# 🪝 Hook

Code that runs at a lifecycle event. Most **observe**. A few can **block**. Confusing the two is how a logging layer gets described as a security boundary.

## Must contain

- **One file per event**, named for it.
- **Guards first**, as named predicates rather than inline conditions.
- **Then observation.**
- **Never raise.** A hook that crashes must not take the run with it.

## Observing and blocking are different jobs

Only an event that fires **before** the action can prevent it. After-the-fact events can complain, record, and alert -- the thing already happened. Know which kind you are writing, and do not describe one as the other.

## Blocking guards fail closed

An observing hook should fail open: a broken logger must not stop work. **A guard must not.** If a guard cannot evaluate its condition, it has not established that the action is safe, and allowing it is a decision it was not authorized to make.

## Log before you guard

The blocked action is the one you most need a record of. A guard that returns before the logging step produces no record of exactly the events that matter.

## Record metadata, never payloads

Allow only: validated run, phase and event identifiers; a timestamp; normalized in-scope file references; the operation category; the result status; and references to evidence held elsewhere.

Exclude raw prompts, tool arguments and results, environment values, transcripts, and file contents. **Even a path or an identifier can be sensitive** -- omit anything not approved for retention, and never let an untrusted identifier choose an output path.

Prefer a local record. Sending events anywhere else is a separate authorization with an authenticated destination and a named retention owner.

**Do not add a model call to summarize every event.** It puts a paid, latent, failure-prone dependency on the hot path of something that fires constantly.

## Acceptance cases

1. A valid event records exactly the permitted fields, at the permitted destination.
2. A missing, oversized or malformed event fails within bounds, with no raw payload in the error.
3. A synthetic secret-bearing payload leaves no value retained or transmitted. **Never use a real secret in a fixture.**
4. Path traversal, a symlink escape, or an untrusted identifier is rejected.
5. Duplicate and concurrent events behave in a documented, consistent way.
6. When the destination is unavailable, degradation is declared -- **never reported as a passing gate**.
7. A blocking guard prevents the action at the real boundary under denial, crash, timeout, and via an alternate tool that reaches the same effect.
8. Invoked from a different working directory, it still resolves the correct paths.

Also settle before implementing: reentrancy and deduplication, concurrent writes, cancellation, **how it is uninstalled**, and the known bypass paths of its enforcement boundary.

## A guard is not a sandbox

Pattern-matching a command string stops the obvious case and nothing else -- another tool, an interpreter, or trivial obfuscation goes straight past. Guards are defence in depth. **The boundary is what capability was granted in the first place**, which is a decision made before the hook runs.

## Common failure

A guard that got in the way of a workflow and was deleted rather than narrowed. Guards die by convenience, not by argument -- when one obstructs, change its scope and record why.
