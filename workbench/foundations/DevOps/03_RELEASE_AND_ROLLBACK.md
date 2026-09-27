# 🚢 Release and rollback

## Reversibility is an evidenced property, not an implied one

**Version control does not make a change reversible**, and neither does using a write tool rather than a shell. An overwrite can reach untracked files, secrets, generated state, external systems and committed history -- none of which a commit restores. Prove the rollback path before relying on it; **an untested one is a plan, not a recovery**, and the difference between the two is only ever discovered at the moment the recovery is needed.

Plan rollback before high-risk changes, not after them. Prefer reversible edits and additive migrations, which keep the old shape readable while the new one is proven. Preserve unrelated work: a recovery that restores the intended state by discarding everything that happened alongside it has traded one incident for another.

## The rollback ladder, in order

The order is least destructive first, and each rung is tried before the one below it.

1. **Regenerate artifacts from their source.** Anything derived is recoverable by re-deriving it, which touches nothing else.
2. **Revert only agent-owned changes.** Scope the revert to what this run produced, so that concurrent and pre-existing work survives it.
3. **Use a tested application or database rollback.** Tested is the operative word -- an application or database rollback that has never been exercised is the same assumption this file opened by refusing.
4. **Ask a human to choose among destructive alternatives.** Once every non-destructive option is exhausted, what remains is a tradeoff between losses, and choosing which loss to accept is an authority decision rather than an execution one.

## Push, merge, publish, release and deploy are distinct effects

Each of them requires its own authority, named as the specific action and scope rather than as a general permission to ship. They differ in who sees the result, how quickly, and how hard it is to take back: a push is visible to reviewers and to continuous integration, a merge changes what the shared branch means, a publish hands an artifact to consumers who now depend on it, and a deploy changes what a running system does to real traffic.

**Merge is not deployment.** Treating the two as one effect is how a change that was approved for integration arrives in production without anyone having approved that, and it is the single most common way shipping authority gets granted by accident. Automatic shipping is off by default and is approved separately from every other form of autonomy.

---

How that authority is recorded as a state transition rather than as prose, and what evidence a handoff must carry before it can be requested, is in [`Agentic_Engineering/05_RECOVERY_AND_HANDOFF.md`](../Agentic_Engineering/05_RECOVERY_AND_HANDOFF.md). What requires approval before execution at all is in [`Agentic_Engineering/03_AUTHORITY_AND_SAFETY.md`](../Agentic_Engineering/03_AUTHORITY_AND_SAFETY.md).
