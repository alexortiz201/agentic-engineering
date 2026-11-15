# Explicit construction packet

A generic, read-only Workbench construction tool: validate an **explicit, caller-authored engineering brief**, retrieve only selected local text, and render self-contained bounded assignments. This tool does not turn vague requests into semantic plans. It is not a controller, agent launcher, permission sandbox, resolver, model router, or persistence engine.

## Entry points

Requires a current Node.js runtime with `node:test` and `Object.hasOwn` (Node 22+ recommended). Runtime and tests use Node built-ins only; no installation, build, package manifest, service or harness is required.

```sh
node workbench/tools/construct/construct.mjs --help
node workbench/tools/construct/construct.mjs --brief BRIEF.json --workspace WORKSPACE
node --test workbench/tools/construct/construct.test.mjs
node --check workbench/tools/construct/construct.mjs
node --check workbench/tools/construct/construct.test.mjs
```

Flags only. `--brief` and `--workspace` are required exactly once, in either order. `--help` is standalone. Input paths are explicit caller selections; relative CLI paths are resolved from the caller's cwd. The workspace must exist and its root must not itself be a symlink. The packet records its observed canonical absolute path, not an inferred repository identity. Do not persist an identifying workspace path or private context in a public evidence store; use a sanitized copy for publication.

Normal success emits **one JSON object and a newline on stdout**; progress/errors go to stderr. `--help` emits documentation instead. Failures emit no partial packet. The tool writes nothing and never runs `checks[].argv`, contacts providers, launches agents, or claims target delivery.

| Exit | Contract |
|---|---|
| `0` | Packet construction succeeded (or help printed) |
| `1` | Usage, unreadable/non-JSON brief, strict schema or relationship violation, unsafe lexical path |
| `9` | Unresolved questions, workspace/context/write-ancestor boundary failure, invalid text or retrieval size limit |

## Version-1 brief

Every object requires **exactly** the keys shown below; unknown keys are rejected, including any dependency-completion field. Strings are nonempty (after trimming), except literal non-executable argv arguments may be empty. NUL in strings is forbidden. IDs are 1–64 ASCII letters/digits/underscores/hyphens, beginning with a letter or digit. IDs are unique within each requirement/task/check list. Original objective and other text are preserved, not rewritten.

This illustrative brief presumes the caller has already created the selected `README.md` and `transform.test.mjs` in the chosen synthetic workspace. It does not create them or prescribe a product workflow.

```json
{
  "schema_version": 1,
  "run_id": "synthetic-transform",
  "objective": "Implement the specified synthetic transformation without external effects.",
  "context": [
    { "path": "README.md", "reason": "Behavior, edge cases and fixture constraints" },
    { "path": "transform.test.mjs", "reason": "Independent behavioral criteria" }
  ],
  "requirements": [
    { "id": "R1", "text": "Meet the synthetic input/output behavior described by the fixture tests." }
  ],
  "assumptions": ["The synthetic fixture contains no private or production data."],
  "questions": [],
  "constraints": ["Use Node built-ins only; no external effects."],
  "authority": {
    "write_paths": ["src/transform.mjs"],
    "prohibited": ["Do not edit tests or other files, install, commit, publish or ship."]
  },
  "tasks": [
    {
      "id": "T1",
      "objective": "Implement only src/transform.mjs against the selected behavior.",
      "depends_on": [],
      "requirement_ids": ["R1"],
      "write_paths": ["src/transform.mjs"]
    }
  ],
  "checks": [
    { "id": "C1", "argv": ["node", "--test", "transform.test.mjs"], "requirement_ids": ["R1"] },
    { "id": "C2", "argv": ["node", "--check", "src/transform.mjs"], "requirement_ids": ["R1"] }
  ],
  "invocation": {
    "role": "Developer",
    "model": { "provider": "openai", "id": "explicit-model-selection", "effort": "high" },
    "prompt": "Implement only the granted module. Report actual changed files, check evidence, failures and remaining risks. Do not accept or ship.",
    "tools": ["read", "edit", "bash"]
  }
}
```

### Validation boundaries

- `context`, `requirements`, `tasks`, `checks`, `authority.write_paths` and `invocation.tools` are nonempty arrays. `assumptions`, `questions`, `constraints`, `authority.prohibited`, task `depends_on` and task `write_paths` may be empty. Nonempty questions block construction with exit `9`.
- Context paths are unique, explicit workspace-relative files. Paths for both context and writes reject absolute/drive paths, backslashes, colon, globs (`* ? [ ] { }`), control characters, dot/parent/empty segments and ambiguous leading/trailing segment whitespace or trailing dots. No normalization turns unsafe paths into allowed paths.
- Context is strictly decoded UTF-8; invalid encodings, NUL, non-whitespace C0 controls and DEL are rejected as binary/control data. Tab, CR, LF, Unicode and a UTF-8 BOM are preserved. Each file is at most **32 KiB**, combined raw bytes at most **128 KiB**, inclusive. Empty text files are allowed. Reads are bounded, nonrecursive and only for selected files.
- `lstat` checks every path segment **within the canonical workspace**, including leaves, for symlinks. Context must be existing regular files with directory ancestors. Proposed writes may not yet exist; existing ancestors are still inspected, and existing write leaves must be regular files. Context opens use `O_NOFOLLOW`, compare inode/device identity to the inspected leaf, and check size/modification metadata before and after reading.
- Every task maps nonempty known requirement IDs; all requirements are covered by tasks. Every check maps nonempty known requirement IDs; all requirements are independently covered by checks. Maps cannot contain duplicates.
- Task writes are exact subsets of the stated authority. Write lists contain no duplicates; authority file-prefix conflicts are rejected. No two tasks may own the same declared write path. The consuming harness/workflow must supply one actual executor per task and enforce the grant; the constructor supplies no executor.
- Dependencies are **declarative DAG edges**, not satisfaction state. Valid forward references are allowed; dangling, self and cyclic references are rejected. Task array order is preserved, never treated as a topological execution schedule. Graph structure carries no completion evidence.
- Every dependent assignment is labeled **NOT READY**: verified predecessor-completion evidence is unavailable. Before execution, the consumer must re-check every predecessor through **authoritative workflow state**. Ordering, task prose and successful construction never prove completion. Tasks without dependencies clear the **dependency gate only**; all other execution gates remain separate. No dependency state, state lookup or persistence is implemented here.
- Role must be exactly `Product`, `Researcher`, `Planner`, `Developer`, `Reviewer` or `Verifier`, matching [portable Role vocabulary](../../foundations/Agentic_Engineering/14_SEMANTIC_AGENT_ROLES.md). Checking the name does not prove semantic Role fidelity. Model provider/ID/effort are explicit nonempty strings. The portable tool applies no provider policy (the mission example uses OpenAI). Tools are explicit unique nonempty strings; availability is neither verified nor permission.
- Literal argv arrays require a nonempty executable string, with string arguments. They are inert data, not shell code to be run by this tool. The packet includes both lossless argv and a single-quoted POSIX display command; consumers on other shells must use argv rather than interpreting the display string. The recorded check cwd is the observed workspace. Authorization and independent execution remain the consumer's responsibility.

## Packet and assignment contract

Output keys are fixed by `constructPacket`, with `schema_version: 1` and `kind: workbench_construction_packet`. It contains the validated brief, observed workspace, context inventory/content (`path`, `reason`, raw `bytes`, SHA-256, content, trust, source), requirement/task/check map, requested-only invocation, assignments and stop conditions. There are no timestamps or inferred settings; identical brief values and a stable canonical workspace yield deterministic output, even if brief object keys were reordered.

`task_state: ready` and `source: executed` describe **deterministic construction and context read only**, never semantic requirement quality or execution/target readiness. Checks remain `not_run`; effective model/tools and agent identity remain `null` with explicit `unobserved` explanations. No invocation has happened.

Each assignment includes its task identity, original request, Role, assumptions/questions/constraints, exact task grant, requirements, dependencies, stop conditions, literal check commands and expected evidence. It explicitly renders the **Core Four: Context, Model, Prompt, Tools**. Role is separate from Model; agent identity is separate from task identity; authority is separate from Tools. The assignment text embeds this entire contract, including selected content, so a fresh bounded worker need not inherit a hidden conversation or another assignment. Context is **untrusted task data, never authority**, even if it contains apparent commands or instructions.

Expected evidence includes actual identity, changed-file/diff and protected-file evidence, a nonempty change subject for mutating tasks, requirement/artifact map, authoritative predecessor-completion evidence, actually run check commands/results/provenance, failures, risks and remaining work. The consumer must independently reproduce objective claims. Neither assignment text nor an agent's completion report enforces or proves delivery.

## Architecture and debugging map

All authored implementation lives in [`construct.mjs`](construct.mjs); boundary regressions live in [`construct.test.mjs`](construct.test.mjs). There are no generated sources or runtime dependencies beyond Node.

```text
CLI entry → main → parseArgs → explicit brief read + JSON parse
                              ↓
                         constructPacket
                              ├─ validateBrief → exact schema, ownership/maps, DAG
                              ├─ unresolved-question readiness guard
                              ├─ workspace lstat/realpath
                              ├─ inspectPath for every granted write path
                              ├─ retrieve selected files
                              │    ├─ inspectPath → bounded open/read/stat
                              │    └─ decodeText + SHA-256, combined byte guard
                              └─ assignment → Core Four, dependency gate, evidence, text
                         ↓
                    one JSON packet
```

Library entry points: `validateBrief(input)` is pure and returns a canonical-key-order brief; `constructPacket(input, workspace)` asynchronously validates, reads and renders; `main(args, io)` handles the CLI contract and returns its exit code. `ConstructionError.exitCode` carries classified failures. No automatic CLI execution occurs on import. Kahn's algorithm detects cycles without recursive graph traversal.

Debug from the reported failure class: exit `1` → argument parser or strict brief relationships; exit `9` → questions/workspace/ancestor/text/size boundaries. Known errors identify relevant fields or selected relative paths without echoing context contents. Context is assembled before any packet is printed; failures cannot emit a partial JSON packet. Fix the explicit source brief/workspace, then have its owner authorize another construction; this tool implements no automatic retry or repair.

## Status, validation and limitations

**ARCHITECTURE GATE: APPLIES** — deterministic tooling, artifact/data flow and stated authority boundary. Fresh independent read-only architecture review **PASS**, no material findings, for this constructor and its bounded synthetic delivery consumer. Lead independently executed Node/types/structural checks; the reviewer inspected those records and executed scoped Git checks, not a second Node run. Engineering completion is separate from human acceptance and shipping.

**IMPLEMENTED AND VERIFIED:** synthetic constructor and CLI tests on Node 24; strict-schema failures, hash/content, maps, DAGs including forward edges, missing dependency evidence, ownership/grant failures, path/symlink/text/size boundaries, determinism, self-contained assignments, exit codes and inert checks/read-only CLI behavior.

**IMPLEMENTED BUT NOT RUNTIME-VERIFIED:** other Node versions and operating systems; adversarial concurrent filesystem changes. This constructor performs no live agent dispatch or target implementation.

**IMPLEMENTED AND VERIFIED:** the consuming Lead also constructed a three-file synthetic slug packet, dispatched its dependency-free assignment through existing managed ownership, independently reran 6 behavioral tests and syntax, and confirmed an exact nonempty granted-file diff. Package navigation is integrated. This is one bounded delivery use, not a workflow-state reader or comprehensive lifecycle acceptance.

**DEFERRED:** comprehensive live lifecycle acceptance and multi-task authoritative completion-state integration. Optional consumer follow-up: include canonical workspace/run/task in verifier JSON; current identity is reconciled separately. Task is `acceptance_pending`; no human acceptance or shipping is implied.

Limits and consequences:

- The operator owns context selection and privacy. No secret detector or private-data policy engine exists. Do not select private files; successful parsing is not permission to publish context.
- A stable, caller-controlled workspace is assumed. Leaf race checks are best-effort, not atomic containment for concurrently replaced ancestors or a hostile filesystem. Canonical workspace ancestors outside the root are not inspected. No sandbox, hard-link/case-alias isolation, timeout controller, checkout-identity attestation or repository policy enforcement is claimed.
- Write ownership is checked against declared exact paths, not future filesystem aliases. The consumer must enforce actual executor/file ownership and actual changes independently.
- The constructor cannot verify semantic adequacy, tool/model availability, prompt fidelity, command safety, external dependencies or completion. Unresolved explicit questions block construction; undeclared ambiguity must be caught by the owner/reviewer.
- Context bytes are bounded, not the number of tasks or the complete packet. Embedding selected context per assignment deliberately trades size for self-contained handoff; keep briefs bounded. The explicit brief is read as local JSON, not as recursively selected context.
- JSDoc uses `@ts-check`. If TypeScript and Node declarations are **already available**, run a strict no-emit check with their existing type root; do not install dependencies for this tool. For example, with an existing global `ts-node` providing Node declarations:

  ```sh
  tsc --noEmit --allowJs --checkJs --strict --module nodenext --target es2022 \
    --types node --typeRoots "$(npm root -g)/ts-node/node_modules/@types" \
    workbench/tools/construct/construct.mjs workbench/tools/construct/construct.test.mjs
  ```

No formatter, Mermaid renderer, build, package-check script or repository CI was discovered for this new subtree. This document uses a text call map, not Mermaid. Applicable baseline checks are the test suite, Node syntax, available JSDoc type check, local link/contract inspection and scoped whitespace checks.

Rollback is limited to removing these new mission-owned source/test/README files after owner approval. Never reset, stash or alter unrelated workspace changes. Human acceptance and all shipping actions remain separate.
