# 🛠️ Tools

Executable machinery that is **generic** -- useful to anyone building agentic developer workflows, regardless of whose repositories they are building them for.

That is the whole admission test, and it is a test about **subject**, not about executability. This package executes things; what it does not hold is one organization's finished workflows. A recorder that captures how work was actually done, a triage script that decides whether a test failure is real, a browser probe that observes state without editing source -- these are instrumentation for the discipline itself. A script that boots a particular company's local stack is not, however well written, and belongs in that company's own library.

**What a tool must be, to sit here:**

- **Named by a step, never restated by one.** A `deterministic` step references a tool by path and does not inline its commands. Inlining is how one procedure ends up in three workflows, drifts three ways, and has to be fixed three times. If a step needs behaviour a tool lacks, change the tool.
- **Reached only after the cheaper options fail.** The preference order for a deterministic step is an existing package script, then a standard CLI call, then a script in here. A tool earns its place when neither of the first two covers it.
- **Honest about whether it has run.** See below; this is the column that is always quietly upgraded.

## Contents

| Tool | What it does | Ever run? |
|---|---|---|
| [`observe/`](observe/README.md) | Records work as it happens, so a workflow can be derived from what occurred rather than from what anyone recalls occurring | Yes -- repeatedly, and its gap contract was revised from what the recordings showed |
| [`triage/flake_triage.sh`](triage/flake_triage.sh) | Re-runs named failing suites **in isolation** and returns a verdict per suite: likely load flake vs. likely real | No. Authored, never executed |
| [`triage/pr_preflight.sh`](triage/pr_preflight.sh) | Reports a pull request's base, labels, milestone, mergeability, review decision, and the check rollup **collapsed to the latest run per context** | Yes -- once, read-only, and that run found a defect in the script itself |
| [`browser/store_trace.js`](browser/store_trace.js) | Subscribes to a running application's own state container from the page and records a frame on every watched change, with the duration of each transient state | The technique, by hand; not this file |
| [`browser/xhr_delay.js`](browser/xhr_delay.js) | Widens a transient async window by delaying matching requests, so a production-only timing defect reproduces locally | **Yes** -- the one tool here with a recorded successful execution |

## The status claim is the part to protect

**A script that has not been run is a hypothesis.** However carefully its header documents its behaviour, an unexecuted script states intentions, and the `Ever run?` column above exists to keep that visible rather than letting a well-written header read as a result.

`pr_preflight.sh` is the cautionary case and the reason the column is worth its space. It was written against a plausible reading of a status-check API and, the first time it met a real pull request, reported five failing checks on one whose checks all passed -- the rollup returns every historical run per context, and the script was counting superseded failures as current. It now de-duplicates by context and reports that same pull request as passing. **One real run found a defect that no amount of review had.**

**Editing a tool does not change what this column says. Only running it does.** That rule is the specific thing that decays first, because a substantial edit feels like progress and the column is one word away from claiming it was.

## Exit codes are the contract

A tool here returns a **distinct non-zero exit code per failure class**, so a calling workflow can gate on *which* thing went wrong rather than matching strings in output nobody versioned. The reasoning, and what makes an allocation a good one, is in [gates](../foundations/Agentic_Engineering/08_GATES.md#an-exit-code-is-the-typed-failure-value-a-gate-routes-on).

**The allocation is shared across the whole tool set, not chosen per tool.** Per-tool numbering means `3` means something different in every step, which is the string-matching problem wearing a number. This is the allocation these tools were written against, carried from the library they came from:

| Code | Means |
|---|---|
| `0` | Success |
| `1` | Usage error -- a defect in the *workflow*, never a failing check |
| `2` | Teardown incomplete -- something survived that should not have |
| `3` | Timeout waiting for a service to become available |
| `4` | Registration or handshake rejected by a supervisor |
| `5` | A service is down |
| `6` | A search index is missing, unhealthy, or empty |
| `7` | **The wrong checkout is being served** -- stop, every observation is void |
| `8` | A real test failure, as opposed to an instrument failure |
| `9` | A pre-review gate failed |

`1`, `2`, `3`, `8` and `9` generalize to any stack. `5`, `6` and `7` are shaped by the kind of system the allocation was first written for; keep the numbers if the classes apply, and extend rather than renumber if they do not -- the same rule the gate namespace follows, and for the same reason.

**Of these, only `0`, `1`, `8` and `9` have ever actually been returned by a tool in this directory.** The rest are declared contracts. A gate branching on a code that has never been produced is an `agent_checked` gate wearing a `code_enforced` costume: the branch is real code, and nothing has established that the condition it tests can occur.

## Shape every tool here follows

- `#!/usr/bin/env bash` with `set -euo pipefail` for shell; portable across BSD and GNU userlands, or explicit about which it needs.
- A header block stating **purpose, inputs, outputs and exit codes**, which `--help` prints. The header is the documentation; there is no second copy to drift from it.
- **Flags, never positional guesswork.** Every input is named.
- **No destructive action without an explicit flag.** The default for anything that kills or moves something is to report what it *would* do and exit `0`.
- **Echo what it is about to do before doing it**, so a transcript shows the reasoning rather than only the result.
- **Carry the reasoning in the header, not just the behaviour.** The failure a tool encodes is the part a workflow replaying it would otherwise discard, and it is worth more than the code.
