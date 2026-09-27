# Phase template

One step of a workflow, as code. It owns sequencing, state and gates; the agents it invokes own judgment. A phase that only forwards a prompt is a command with extra steps.

Fill the four declarations at the top and the body follows from them. See [`primitives/phase.md`](../../foundations/Agentic_Engineering/primitives/phase.md) for what each obligation is and why.

```ts
#!/usr/bin/env bun
/**
 * <phase> -- phase N of <workflow>.
 *
 * ENTRY or DEPENDENT. Say which, and why. An entry phase mints the run identifier; a
 * dependent phase REQUIRES one and refuses to run without it, because a phase that
 * invented its own would be reasoning about state nothing else in the run can find.
 *
 * Exit codes: 0 the work succeeded · 1 the work failed · 2 the harness failed.
 * Distinguishing the last two is what tells a caller whether retrying could help.
 */

const WORKFLOW_VERSION = 1;   // bumped by hand; the history cannot compare versions without it
const PHASE = "<phase>";
const AGENT_TIMEOUT_MS = 120_000;

// 1. IDENTITY -- a dependent phase exits 2 here, naming the command to run first.
// 2. PRECONDITIONS -- load state, verify the workspace, confirm the environment.
//    Exit with a remediation message naming what to run, not just what failed.
// 3. OPEN THE ACTION LOG before doing anything, so a crash still has an account.

try {
  // 4. THE WORK.
  //    - Deterministic: execute, with a DEADLINE on every call. A timeout handler with
  //      no timeout set is dead code.
  //    - Agentic: build a TYPED request from a prompt file. Never assemble a prompt
  //      string inline. Parse the response against a schema; a shape that does not
  //      match is `malformed`, never a default.
  //    - Deferral: hand off to a workflow this phase does not own, and wait. Neither
  //      executing nor calling, so the CONTINUATION is what has to be written here:
  //      what resumes the run, on what evidence, and what it does if control never
  //      comes back. Gate on the side effect read back independently, never on the
  //      callee's report -- you do not own its output contract.
  //    - Write state after every material fact, not at the end. A phase that dies
  //      mid-step should leave everything observed so far on disk.
} catch (e) {
  // 5. REPORT ON EVERY PATH. Record why, durably, BEFORE exiting -- this is what makes
  //    an unattended run debuggable. Capture first, then tear down, then exit 2.
}

// 6. THE GATE. Check the actor's claim against the record; never accept it because it
//    reads like a decision. An actor cannot verify its own proposal.
//    Decide `pass` / `blocked` / `human_waived`. `human_waived` is never a pass, and a
//    gate that did not observe its subject is `blocked`, not a pass over nothing.

// 7. FINISH. One exit path, used by success and failure alike:
//    write the phase result -> tear down what this phase acquired -> append one history
//    entry -> report -> exit with the code above.
```

## What the phase result must carry

`schema_version`, run identity, `phase`, an execution `status` (`completed` / `failed` / `blocked` / `cancelled`) **kept separate from any check result or gate outcome**, the workspace observed, a compact `summary`, `artifacts`, `findings`, and a `next_action` that is **proposed, never authorized**.

**Execution status is not acceptance.** A phase that completed says nothing about whether its output was any good.

## The mistakes this template exists to prevent

- **Provenance set before the branch that skips the work.** A check that did not run has no execution provenance; spreading a base object that already says `executed` is how a dry run reports that it executed something.
- **State accumulated in memory and written once at the end.** A crash then records nothing at all.
- **Exit codes that conflate the work failing with the harness failing.** A caller cannot decide whether to retry.
