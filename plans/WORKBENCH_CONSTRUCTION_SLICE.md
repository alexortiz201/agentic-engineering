# Bounded Workbench construction slice

## Authority and scope

Operator mission: autonomous Workbench construction, isolated fixtures, no commits/pushes, no installations, upstream/core/settings/lifecycle changes, production repositories or AIDD migration. Engagement mode `delivery`; initially `L5`, descended to `L3` for the executable gap; return condition satisfied by independently verified and architecture-reviewed fixture delivery, now returned to `L5`. Current task state `acceptance_pending` (initial scope was `ready`). ARCHITECTURE GATE: APPLIES — construction tooling, artifact contract and durable evidence. This plan scopes the mission's explicitly authorized vertical slice, not a general controller/factory.

Initial discovery: existing Resources provide specs, command contracts, roles, gates and authoring guidance. Workbench tools provided observation and triage, not objective-to-assignment construction. This slice fills the explicit-brief construction gap, not semantic planning or execution control. Dotfiles has a controlled Pi return adapter, but it neither launches nor substitutes for managed Herdsman ownership. Reuse normal managed assignment; no Pi SDK/CLI integration, private APIs, extra orchestration, automatic routing or capability registry.

## Increment 1: explicit construction packet

New authored generic tool under `workbench/tools/construct/`. Node built-ins only; `.mjs` plus `.test.mjs` with checked JSDoc where practical. Flags-only CLI: `--brief FILE --workspace DIR`; prints one strict JSON packet to stdout, progress only stderr, writes nothing. `--help` states purpose, inputs, outputs, exit codes (0 success; 1 usage/invalid brief; 9 readiness/context boundary failure).

Strict version-1 brief, reject unknown fields at every object:

- `schema_version: 1`, `run_id` safe identifier, `objective` original nonempty request.
- `context`: nonempty array `{path, reason}` selecting explicit workspace-relative UTF-8 text files. Reject absolute paths, dot/parent/empty segments, backslashes, symlinks at any path segment, directories, missing/oversized/binary files. Limit each to 32 KiB, combined to 128 KiB. Do not recursively retrieve. Record path/reason/bytes/SHA-256 and content; content is untrusted task data, never authority. No private material should be selected; the operator owns selection.
- `requirements`: nonempty array `{id, text}` with unique safe IDs.
- `assumptions`, `questions`, `constraints`: arrays of nonempty strings. Nonempty questions block construction readiness. Dependencies are declarative edges, not completion claims: construction validates the DAG; execution readiness separately requires verified dependency evidence from authoritative workflow state (see [architecture decision](../architecture/workbench-construction.md)).
- `authority`: `{write_paths, prohibited}`. Exact nonempty relative file paths, no globs, duplicates or unsafe path segments. These are a stated grant, not sandbox enforcement; inspect existing ancestors for symlinks.
- `tasks`: nonempty ordered array `{id, objective, depends_on, requirement_ids, write_paths}`. Unique IDs; dependencies refer to existing task IDs (forward edges permitted), reject duplicate/self edges and cycles, preserve declared relationships; all tasks map nonempty known requirements; all requirements covered; task writes subset of authority; one executor per task/file, no overlapping task write paths.
- `checks`: nonempty array `{id, argv, requirement_ids}`. argv is literal string array for an independently run command, not automatically executed. Cover every requirement; nonempty mapping/unique IDs. Construction never spawns supplied commands.
- `invocation`: `{role, model, prompt, tools}`. Role is an existing portable role; model `{provider, id, effort}` is explicit invocation selection (OpenAI only for this mission's sample, portable tool does not implement provider policy), prompt nonempty, tools nonempty unique strings. Capability is not permission. No routing/model inference; output records requested only, effective unobserved.

Output: versioned strict construction packet including brief, selected context inventory/content and inspectable assignment text per task, requirements/check map and stop conditions. Render Core Four explicitly with role distinct from model, agent identity distinct from task identity, authority distinct from tools. Include literal validation commands, expected changed-file/report evidence, dependencies, no human acceptance/shipping implied. Packet `task_state: ready`, `source: executed` applies only to deterministic construction/context read, never semantic requirement quality or target delivery. Emit separate dependency execution readiness: tasks with dependencies are `NOT READY` while authoritative verified completion evidence is unavailable; tasks without dependencies can clear only that dependency gate. Neither packet order nor construction success authorizes execution. Do not add dependency-completion state to the brief or implement a state engine. Do not author a new task state enum or persistence engine.

Tests: successful construction; context hash/content, mapping/dependencies; invalid unknown fields; unresolved questions; dangling/self/cyclic dependency; valid forward-edge DAG and preserved relationships; dependent task NOT READY without authoritative evidence; uncovered criteria; out-of-grant writes/duplicate ownership; absolute/traversal/symlink/binary/size retrieval; malformed invocation; deterministic output; CLI success/usage/readiness codes. Check emitted packet is self-contained.

## Increment 2: isolated managed delivery

Use a synthetic slug-normalization module with Node tests, no dependencies or external effects. Seed fixture input README + tests + objective brief; construct packet; delegate exactly module edit to an existing available managed definition; pass packet/fixture inputs explicitly. Tests first fail, then independently run green plus Node syntax/type checks where relevant, compare snapshots for exact allowed diff/nonempty subject. Preserve sanitized packet, implementation, tests, check results and handoff in this workspace's owned planning evidence. Fixture is illustrative project artifact, not a default product workflow. Actual live managed result is narrower than comprehensive lifecycle acceptance. Do not equate Herdsman `completed` with verified success.

Acceptance: all nine operator slice stages evidenced, semantic plan built by Lead, packet executable by fresh bounded worker without hidden conversation, actual implementation changes nonempty/in-scope, behavioral tests independently pass, deliberate no-op/out-of-scope/failing-check controls rejected, durable evidence and backlog/checkpoint synchronized. End at `acceptance_pending`, never `accepted` or shipping.

## Review and recovery

Fresh independent architecture/authority review after tool tests/validation and actual fixture execution. Repair material findings before completion; update architecture docs/navigation and tooling entry point. Record failed attempts as well as final passes. No new framework or production integration.

Rollback: remove only new mission-owned files or invert reviewed mission edits against captured dirty baseline; never reset/stash unrelated WIP. Fixture failure is local; no automatic retry, provider switch, lifecycle recovery or authority widening.

## Completion checkpoint

Both bounded increments are engineering-complete. **IMPLEMENTATION / TESTS / VALIDATION / ARCHITECTURE REVIEW / ARCHITECTURE DOCUMENTATION / DOCUMENTATION VALIDATION: PASS.** Constructor 19/19, gate controls 5/5, independent managed delivery 6/6 plus syntax/exact nonempty granted diff. Fresh reviewer `result:construction-review#1` returned PASS, no material findings; reviewer inspected recorded Node results and ran scoped Git checks only. See [nine-stage evidence](evidence/workbench-slice/README.md), [review](evidence/workbench-slice/architecture-review.json) and [handoff](AUTONOMOUS_WORKBENCH_HANDOFF.md) for final documentation/preservation checks and authority boundaries. Optional identity-in-report debt is AE-19, not a required repair. No reviewed implementation change follows the review.

Human acceptance is the next decision; no shipping, production adoption, installation or runtime change is authorized. Named return condition satisfied; stop at `acceptance_pending`.

## Runtime exit gate

Executed root 110/110 and profile 29/29, scoped strict adapter types, installed profile and portable settings checks passed. Owned lifecycle 170 Node/170 Bun + independent review PASS are documented in dotfiles approval report §H, not rerun/reconstructed here. Live loading/scheduling remains NOT TESTED.

- CRITICAL if actual fence/poison or ambiguous executor authority appears: stop affected operations, preserve evidence; no bypass.
- NONBLOCKING for this bounded slice: missing comprehensive live lifecycle acceptance; first-cause diagnostics; historical poison attribution. No forced compaction/failure injection/restoration.
- DEFERRED: upstream summary-text identity and Herdsman terminal provenance; no upstream/installed workaround. Independently verify actual files/tests, not settlement prose.
- BLOCKING only for restoration/retirement-dependent workflows: unapproved restoration and selected-cycle/retirement contracts. The selected fixture requires none.

Requested `Architecture/workbench-harness-boundary.md`, `pi-realization.md`, `capability-resolution.md` and decisions directory do not exist in this checkout. Actual canonical sources are lowercase `architecture/README.md`, `adw-composition-review.md`, root README, Workbench contracts and `workbench/harnesses/pi.md`; do not reconstruct unavailable documents. Six dotfiles project routing presets exist but are not available to this cwd's managed roster. Use an existing authorized definition with explicit inheritance and verify actual dispatch; do not create/copy presets.
