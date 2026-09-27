# 🎛️ The agent invocation module

**The one module every workflow rebuilds.** It is the adapter between a controller and an agent runtime: it takes a typed request, runs the agent, and returns a typed result. Everything else in a workflow is composition on top of it, which is why getting it wrong is expensive and why it is worth building deliberately rather than growing.

Read this when writing the first phase that calls an agent, or when judging one that already exists. The blueprint for what makes something a module at all is 📦 [`module.md`](../foundations/Agentic_Engineering/primitives/module.md); this is the checklist for the specific module that wraps the agent boundary.

## The pieces, in the order they run

Each row is a part that must exist somewhere. **A part missing is not a gap in tidiness -- the failure column is what you get instead.**

| # | Part | What it does | Missing it costs |
|---|---|---|---|
| 1 | **Identity** | Mint the run identifier once, at the top, and thread it through every call | Artifacts that cannot be grouped, and no way to join a result back to the request |
| 2 | **Typed request** | One object carrying semantic-role provenance, prompt, requested model and reasoning effort, working directory, permission posture, output path/contract, limits, and routing source | Arguments drift per call site, and the `Core Four` become implicit |
| 3 | **Typed response** | Output, a success boolean, the runtime's session identifier, and a retry classification -- **all four, separately** | Callers re-derive success by reading prose |
| 4 | **Environment allowlist** | Build the subprocess environment by naming the variables that are passed, never by inheriting | The agent inherits every credential in the operator's shell |
| 5 | **Preflight** | Assert the runtime binary exists before building anything | A missing runtime is reported as a failed task |
| 6 | **Input capture** | Write the exact prompt to disk **before** invoking | A crashed run cannot be reproduced, because the input is gone |
| 7 | **Streaming sink** | Point the child's stdout at a file descriptor; capture stderr separately | Output is buffered in the parent, and a long run looks dead |
| 8 | **Result extraction** | Scan the stream in reverse for the terminal record; treat its absence as its own failure | A run that produced no result is reported as an empty success |
| 9 | **Derived views** | Keep the raw stream, and derive the parsed and final forms beside it | Either the detail is lost, or every reader re-parses |
| 10 | **Error taxonomy** | An enum saying *what kind* of failure, separate from *whether it succeeded* | Retry policy becomes string matching on error text |
| 11 | **Retry policy** | Attempt count, backoff, and the **subset of the taxonomy that is retryable** | Non-retryable failures are retried, and the budget is spent on hopeless work |
| 12 | **Tolerant parse** | Strip code fences before parsing structured output | A correct response fails because the runtime wrapped it in markdown |
| 13 | **Display truncation** | Truncate for humans at the presentation edge only | A raw stream lands in a terminal, or worse, in a record |
| 14 | **Run logger** | A logger named by the run identifier, file at debug and console at info | Concurrent runs interleave into one unreadable stream |

**Parts 8 and 10 are the two most often collapsed into the success boolean, and they are the two that decide behaviour.** *Did it finish*, *did it produce a result*, and *is this worth retrying* are three questions, and a single boolean answers none of them well.

## Resolve before adapting

The module receives a resolved request; it does not decide what kind of agent work is needed or which current model should do it. The phase selects a [semantic role](../foundations/Agentic_Engineering/14_SEMANTIC_AGENT_ROLES.md), the controller combines its requirements with phase constraints and the authority envelope, and operator routing policy resolves the concrete provider/model and reasoning effort. The module then validates, captures, and executes that exact request through one harness adapter.

Manual exact override and operator-policy selection are different upstream reasons that both become `explicit` at the harness boundary because the caller supplied resolved values. Preserve the upstream basis separately: role and contract version, policy version/matched rule or override actor/reason/scope, and any nonportable exact requirement. `fallback` is allowed only when the caller supplied neither model nor effort and the workflow permits harness fallback.

**Requested is not effective.** Record the requested model and reasoning effort beside the effective values observed from the harness, plus harness-facing routing source: `explicit` when the caller supplied the resolved decision and `fallback` only when it deliberately did not. A harness may reject or resolve a request differently; an explicit caller selection must not be silently replaced by downstream automatic routing. This is invocation provenance, not permission for the module or adapter to route.

Role requirements do not grant authority. The exact tool set and mutation/permission posture are resolved by intersecting role need and ceiling with phase scope, human/operator grant, available capabilities, and stricter environment constraints before the request reaches this module.

**A typed agent return is not runtime success.** Validate its schema, then separately validate the harness terminal state and stream integrity. A returned result is absent on cancellation, provider failure, and some malformed streams; a process status alone may not distinguish those cases.

## What the module must not decide

- **Semantic role and concrete routing are upstream decisions.** The module rejects an incomplete or contradictory request; it does not infer a role from prompt prose, map a role to a model, or reinterpret an explicit selection.
- **Permission posture is the caller's**, passed in per call. A module that hardcodes its own permission level removes the decision from every workflow that uses it, and the decision does not reappear at the call site where a reviewer would look for it.
- **Where the workspace is** is a parameter, never derived from the module's own location on disk. Deriving it means a run in an isolated workspace writes its artifacts into the original one, and the isolation is only as real as the least careful path computation.
- **Terminating.** A module returns; the phase decides whether that ends the run. See `module.md`.

## Three failures to check for by reading

These are cheap to find and each one silently disables something a reader will assume is working.

- **A timeout handler with no timeout.** Catching the runtime's timeout exception while never passing a timeout argument produces a handler that cannot fire, usually beside a message stating a specific duration. The message is then the only evidence anyone has, and it is false.
- **A blanket exception swallow around parsing.** Convenient while the shape of the stream is unknown, and permanent afterwards. Narrow it to the parse, or the module reports "no result" for every bug inside it.
- **One field carrying two meanings.** A retry classification whose "none" value means both *succeeded* and *do not bother* works only while every caller checks success first. The next caller will not.

## Prove it the way every primitive is proved

The six cases in 🧱 [`primitives/README.md`](../foundations/Agentic_Engineering/primitives/README.md) apply here, and the sixth is the one this module fails most often: invoked against the wrong workspace, it must **report the workspace it observed and the one it expected**, rather than operating on whatever it found.

Add one more, specific to this module: **a run that produces no terminal record**. It is the realistic failure of a streaming interface and the one that most resembles success.
