# 📦 Module

Shared code a phase depends on. **Earning a place here is the whole question** -- most things that feel shared are not.

## Earns its place by meeting at least two

1. **Used by two or more phases.** One consumer means it stays where it is used.
2. **It wraps a foreign boundary** -- an agent runtime, a version control system, a tracker, storage, the filesystem. Adapters are the natural shape of a module.
3. **It returns a typed result and never prints or exits.** Terminating belongs to the phase.
4. **It takes its working context as a parameter** rather than reading a global. This is what makes isolation a mechanical change instead of a rewrite.

## Rules

- **No phase logic in a module.** If it knows which phase is calling, it is not shared code.
- **Layer strictly**, and break a genuine cycle explicitly rather than letting imports tangle.
- **Two copies of one helper is a fork, not reuse.** They diverge silently, and the caller cannot tell which behaviour it got.

## Common failure

Writing a shared module in anticipation of a second caller that never arrives. Observed repeatedly: presentation helpers, logging setup and re-derived utilities get written, imported, and never called, while the things that genuinely earned a place were narrower -- **normalizing an agent's output, and typing the contract that crosses the agent boundary.**
