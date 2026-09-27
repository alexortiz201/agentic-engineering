# 🏝️ Isolation and sandboxing

## An agent is contained by the machine, not by its instructions

Sandboxing an agent is the reason this area exists. Everything an agent is told about what it may not touch is a request; what actually holds is the set of mechanisms outside the run that would refuse the action whether or not the thing inside them cooperated. **Isolation is a property of the environment, never of the prompt** -- and the gap between those two is where a contained run turns out to have been an uncontained one all along.

Prefer worktrees, containers, OS permissions, scoped credentials and ephemeral databases. Each of those is external to the run and can be configured, tested and shown to deny something. What matters is knowing which of them isolates what, because they are routinely credited with containment they do not provide.

- **Branch names are organization, not isolation.** A name separates work in the history and nothing else; two runs on two branches share every file, port, credential and database the machine has.
- **Worktrees isolate files and Git state, not credentials, network, ports or databases.** The second run reaches the same environment the first one did, and a destructive command inside a worktree is destructive outside it.
- **Prompt restrictions are agent-checked.** They express intent to whatever reads them and enforce nothing against anything that does not.
- **Logging hooks observe unless blocking is implemented and tested.** Watching an action happen is not preventing it, and a hook that records is frequently mistaken for a hook that refuses.
- **Localhost reduces exposure but is not authentication.** It narrows who can reach a service; it does not decide what a reacher is allowed to do once connected.
- **Container, VM and OS controls can be code-enforced** -- when configured and tested. Untested, they are in the same category as the prompt.

## A sandbox is a tested boundary, not a label

A container or a VM proves neither isolation nor zero blast radius on its own. The word describes an intent; what a reader needs is the boundary that was actually configured and the evidence that it holds.

- **Declare the actual boundary before relying on it**: host mounts, privileges, network egress, credentials, data reachable, services exposed. Then **verify a denied action is actually denied** in a safe test. An untested boundary is an assumption, and an assumption is discovered to be wrong by the first run that depends on it.
- **Provision least-privilege, short-lived credentials scoped to the run.** Revoke on completion or cancellation, and **verify the revocation**. Deleting the machine is not revocation -- anything the credential reached may outlive it, and the credential itself remains valid wherever it was already presented.
- **Spend caps do not prevent exfiltration.** A budget limits cost, not disclosure. They are unrelated controls, and one does not substitute for the other.
- **Export and verify evidence before teardown.** Patches, artifacts and records must be in authorized durable storage *and confirmed there* before anything is destroyed. A run whose evidence died with its sandbox produced nothing.

The credential half of this is a lifecycle, not a step, and is in [`02_CREDENTIALS_AND_ENVIRONMENTS.md`](02_CREDENTIALS_AND_ENVIRONMENTS.md).

---

What an agent may do inside a boundary, and why an allowlist limits what it can name rather than what it can reach, is in [`Agentic_Engineering/03_AUTHORITY_AND_SAFETY.md`](../Agentic_Engineering/03_AUTHORITY_AND_SAFETY.md). What to do when a boundary turns out not to hold -- stop, preserve, escalate, and do not widen the credential -- is in [`Agentic_Engineering/05_RECOVERY_AND_HANDOFF.md`](../Agentic_Engineering/05_RECOVERY_AND_HANDOFF.md).
