# Agentic Engineering backlog

Canonical workspace backlog and execution index. Architecture authority remains the [root README](../README.md), [Workbench contract](../workbench/AGENTS.md), and linked plans; this document records work status and does not authorize implementation. Workbench constructs/organizes/validates/evolves project artifacts; it is not a runtime. Pi is the execution harness, Herdr process/workspace infrastructure, Herdsman managed-agent coordination/supervision. AIDD is an attributed, replaceable knowledge package; it owns neither Resources nor Workbench. The Core Four remain **Context, Model, Prompt, Tools**; Model includes invocation-specific effort. Semantic Roles do not permanently own models. Capability is not permission.

Status means: COMPLETE verified; ACTIVE evidenced in progress; READY sufficiently scoped and authorized in principle (not a grant beyond current instructions); BLOCKED depends on a decision or unmet prerequisite; DEFERRED consciously parked; IDEA exploratory; SUPERSEDED replaced by a documented decision. Priorities: P0 safety/correctness blocker, P1 high-value near-term, P2 useful, P3 exploration. Evidence provenance is named per source; prompt recollection alone is not verification. The current operator mission authorizes bounded Workbench tooling and isolated fixtures in this repository, with architecture review and verification. Dotfiles/runtime implementation remains operator-owned and read-only for this mission; upstream Pi, installed packages, protected lifecycle/settings and AIDD migration are excluded.

## Roadmap / execution order

**Current mission reconciliation:** **AE-17 → AE-18 COMPLETE** as the explicitly authorized bounded Workbench vertical slice, task state **acceptance_pending**. Fresh independent architecture review PASS, no material findings; human acceptance/shipping not granted. The historical runtime-first order below remains supporting/deferred work, not a prerequisite for all bounded construction. Root 110/110, profiles 29/29, scoped strict types and installed/portable config checks newly passed; owned lifecycle completion/review reused from dotfiles report §H. Live lifecycle NOT TESTED. See [construction plan](WORKBENCH_CONSTRUCTION_SLICE.md) and [checkpoint](AUTONOMOUS_WORKBENCH_HANDOFF.md).

1. **Runtime resilience acceptance (AE-01, P1)** — separate owner/agent workstream. Continue bounded acceptance of cancellation, continuation, delegation failure, and lifecycle/authority behavior. Do not wait for backlog work; owned P1a/P1b corrections are now authorized and regression-verified in dotfiles, while upstream/configuration/restoration changes remain gated. This is the most valuable near-term technical work, contingent on safe test conditions and existing authority.
2. **Lifecycle poison evidence diagnosis (AE-02, P1)** — independent of routing and acceptance. Preserve earliest-failure evidence, determine whether incidents differ, establish a safe recovery/regression approach before proposing code changes. No speculative lifecycle rewrite or gate bypass.
3. **Finish evidence-based Pi cleanup/operator decisions (AE-13, P2)** — use existing cleanup plan; preserve private/protected settings and establish consumer evidence before package removal/upgrades.
4. **Workbench capability inventory and learning gaps (AE-09/11, P2)** — compare actual Resources with target capabilities; do not promote ideas into product requirements.
5. **AIDD stays gated (AE-10, BLOCKED)** — operator decision gates and existing `CORRECTION REQUIRED` checkpoint first; no migration, activation or approval implied.

Six explicit routing presets are preserved (five-preset milestone plus live-accepted Luna/low-edit); they are not a prerequisite for these items. Context efficiency measurements, Code Mode and Durable experiments can be independently designed, but should not displace unresolved runtime safety evidence. Parallel safe work: AE-02 evidence diagnosis can proceed apart from AE-01 if distinct owners/evidence; AE-05/06 experiments and AE-11 learning audit are independent research/design; routine environment maintenance is independent. Do not overlap with the runtime agent's files or duplicate its acceptance tests. Approval-gated items remain blocked regardless of parallelism.

## Backlog entries

### AE-01 — Managed runtime resilience and continuation acceptance
- **Status:** BLOCKED (owned P1a/P1b corrected and regression-verified; upstream producer/retirement contracts and provider-backed live acceptance remain unresolved)
- **Priority:** P1
- **Area:** Herdsman/Pi harness lifecycle
- **Summary:** Verify bounded task continuity through safe compaction and same semantic task, plus managed-child cancellation, historical continuation, delegation failure, and lifecycle/authority integration. Context maintenance is not task completion; retain the semantic task/authority.
- **Prior characterization evidence:** `inspected` by autonomous Lead — dotfiles `.no-stow/docs/runtime-resilience-implementation.md` records 23 runtime regressions, sanitized diagnostics, exact normal-path saved-review continuation and resolved prior workers. Desired guarantees remain unmet: default threshold retirement cancels compaction; nonempty errored assistant can be produced as completed. Prior live routing is not failure/lifecycle acceptance. `executed` autonomous increment: four installed compaction/projection/settlement boundary tests and ten terminal-failure producer tests passed; no source fix applied. Evidence/limitations: external `.no-stow/docs/upstream-failure-classification.md`; checkpoint `.no-stow/docs/autonomous-runtime-handoff.md`. Architecture contract: `../README.md` and `../workbench/harnesses/pi.md`.
- **Dependencies:** Safe test environment and existing lifecycle authority; specific scenarios need bounded acceptance plan. Does not depend on routing enhancements.
- **Owned correction evidence:** `executed` — operator-authorized dotfiles P1a/P1b implemented; adapters 103/103, lifecycle 170/170 under Node and Bun, profiles 29/29, root 110/110, scoped strict types/config pass. Independent bounded read-only review PASS. See external `../../dotfiles/.no-stow/docs/lifecycle-approval-proposals.md` §H and current handoff. Consumed-child/SDK tests are isolated integration, not full managed terminal settlement or provider-backed live acceptance; upstream/core/settings unchanged.
- **Next action:** Operator selects owning-source Pi append-ID/managed terminal-outcome work and retirement contract; establish exact disposable live ownership/loading before acceptance. Do not repeat completed isolated fixtures, prior regressions or normal-path continuation. No runtime implementation in this canonical repository.
- **Approval required:** Any lifecycle implementation/configuration change or disruptive live acceptance needs explicit operator authorization.
- **Source references:** `../README.md`; `../workbench/harnesses/pi.md`; external `../../dotfiles/.no-stow/docs/delegation-routing-live-acceptance.md`; external `../../dotfiles/.no-stow/docs/delegation-routing-implementation.md`.

### AE-02 — Lifecycle gate poisoning diagnosis
- **Status:** BLOCKED (owned P1a/P1b implementation complete; historical first cause, upstream correlation and live acceptance remain unresolved)
- **Priority:** P1
- **Area:** Lifecycle recovery/correctness
- **Summary:** Evidence-based root-cause investigation for “Lifecycle fence: Error: lifecycle gate is poisoned”; preserve earliest failure, distinguish incidents, and derive safe recovery plus deterministic regression coverage. Keep separate from routing acceptance.
- **Prior characterization evidence:** `inspected` — external dotfiles `.no-stow/docs/lifecycle-poison-investigation.md` distinguishes three histories and healthy comparator; ten isolated characterization tests reproduce injected callback-state rejection, branch drift, duplicate attribution and release uncertainty. `executed` by autonomous Lead: ten tests rerun pass; passing poison assertions are not healthy-runtime acceptance. Historical first transition/scheduling remains UNKNOWN. External `.no-stow/docs/lifecycle-approval-proposals.md` and `.no-stow/docs/lifecycle-callback-guard.proposed.patch` contain unapplied approval evidence; no original saved sessions replayed or protected source altered.
- **Dependencies:** Original lifecycle/session and OS permission/compaction evidence if available; source owner and recovery authorization for any intervention.
- **Owned correction evidence:** `executed` — authorized P1a/P1b separates ordinary completion from selected-only callback idle/queue checks and guarantees existing terminal denial despite publication failure; no authority reset, new grant or validation weakening. Actual-source regressions and full lifecycle/type checks pass; independent review PASS. External `../../dotfiles/.no-stow/docs/lifecycle-approval-proposals.md` §H records exact files, initial/final results, preservation and rollback. P2 diagnostics and P3 upstream Pi exact append identity remain deferred; live NOT TESTED. Do not mark poisoning fully resolved.
- **Next action:** Select separately authorized owning-source Pi append-ID work and decide P2 first-observed-failure scope/privacy/lifetime; then establish a healthy disposable managed target for provider-backed acceptance. Preserve current denial and original sessions; do not repeat completed historical extraction or claim an established historical root cause.
- **Approval required:** Recovery actions, gate resets/bypasses, lifecycle changes, or protected environment manipulation require explicit authorization.
- **Source references:** external `../../dotfiles/.no-stow/docs/delegation-routing-implementation.md` §Phase 8A; external `../../dotfiles/.no-stow/docs/delegation-routing-live-acceptance.md` §G.

### AE-03 — Herdsman model/effort routing evolution
- **Status:** DEFERRED
- **Priority:** P3
- **Area:** Invocation configuration
- **Summary:** Six named explicit presets are preserved (the original five plus live-accepted Luna/low-edit). Arbitrary per-call overrides, upstream API enhancement, task-aware/automatic selection, richer invocation configuration and observability are possibilities, not prerequisites. Evaluate added complexity only against demonstrated consumer need.
- **Current evidence:** `executed` (reported in acceptance artifact) five presets live-accepted; 22 targeted tests passed, scoped TypeScript check passed, four probes estimated $0.0260694; prior Sol/high review reused. Current public Herdsman fields lack arbitrary model/thinking; current accepted mechanism is named definition preset. `documented` explicit routing report cautions against automatic classification and global definition mutation.
- **Dependencies:** Demonstrated limitation/consumer and supported upstream API if arbitrary call overrides are pursued.
- **Next action:** None until a concrete workload cannot be served by current finite presets; then document tradeoff and upstream feasibility before proposing change.
- **Approval required:** Operator approval for routing policy changes, live cost-bearing probes, or runtime/configuration changes.
- **Source references:** external `../../dotfiles/.no-stow/docs/delegation-routing-implementation.md`; external `../../dotfiles/.no-stow/docs/delegation-routing-live-acceptance.md`.

### AE-04 — Pi Code Mode experiment
- **Status:** COMPLETE (bounded no-inference standalone feasibility; integrated authority/privacy and cost-bearing comparison NOT TESTED)
- **Priority:** P3
- **Area:** Harness efficiency
- **Summary:** Evaluate Pi 1.1.0 Code Mode for batched independent calls, filtered/structured results, context reduction and execution efficiency. It is not Workbench, durable tasks or managed ownership.
- **Current evidence:** `inspected` installed Pi/standalone Code Mode 1.1.0 docs/contracts and integrated nested-hook source. `executed` five closed synthetic VM tests passed: batching/exact filtered output, partial failures, host boundary, no rollback/store drop, pending-host abort. Sample: 358279 raw → 148 filtered JSON bytes; VM 45–64ms versus direct parallel ~0.7ms. No inference, installation or global activation. These are payload sizes, not actual tokenizer/context cost or protected runtime acceptance. Evidence: external `.no-stow/docs/codemode-context-efficiency-evaluation.md`.
- **Dependencies:** Check current Pi docs/configuration, candidate workflow and permission surface; compare with deterministic scripts/direct tools.
- **Next action:** None for completed bounded feasibility. Keep direct deterministic filtering for known verification; only select a real variable-composition workflow after approval for disposable integrated nested-hook/privacy tests and matched inference A/B. Global activation is not recommended by this evidence.
- **Approval required:** Any configuration/installation or cost-bearing experiment requires operator authorization.
- **Source references:** `../workbench/harnesses/pi.md`; inspect the installed Pi 1.1.0 docs only when experiment is approved.

### AE-05 — Pi Durable fault-injection experiment
- **Status:** IDEA
- **Priority:** P3
- **Area:** Durable execution
- **Summary:** Investigate `@earendil-works/pi-durable` for persistence/restart recovery, tool intent/result, retry state, child ownership and checkpoints. Preserve limitation: no generic exactly-once external effects, authority continuity, rollback guarantee, uniform storage durability; APIs experimental. Not a substitute for Herdr/Herdsman ownership.
- **Current evidence:** `asserted` interest from mission context; no local implementation/validation evidence found.
- **Dependencies:** Bounded failure model, current package/API compatibility review, and safe isolated test harness.
- **Next action:** Propose fault-injection cases (crash before/after intent, effect, result; retry; child interruption) and classify replay safety per side effect before any experiment.
- **Approval required:** Package install, runtime integration, external effects and cost-bearing tests require explicit approval; no production adoption without evidence.
- **Source references:** Workbench ownership boundaries in `../README.md`; external package name `@earendil-works/pi-durable`.

### AE-06 — Memory and hindsight investigation
- **Status:** IDEA
- **Priority:** P3
- **Area:** Knowledge continuity
- **Summary:** Evaluate Hindsight, pi-memory and pi-hindsight; semantic retrieval, retain/recall/reflect, lessons and project troubleshooting memory, promotion of reusable knowledge. Memory is not authority. Reusable construction knowledge belongs in Resources; project decisions/evidence in Project Artifacts; session execution state in Harness.
- **Current evidence:** `documented` architecture separates these owners (`../README.md`, `../workbench/README.md`); no comparative compatibility/privacy validation located. Workbench's private local memory is not a shared automatic transcript pipeline.
- **Dependencies:** Current Pi compatibility, storage/privacy and isolation model, user correction/deletion semantics, injection policy and retrieval precision.
- **Next action:** Comparative read-only research and threat/data-flow table; identify smallest useful use case and promotion/deletion controls.
- **Approval required:** No automatic transcript ingestion; storage, installation, cross-session capture or private data processing requires explicit operator authorization.
- **Source references:** `../README.md`; `../workbench/README.md`; `../workbench/handbook/01_LOCAL_MEMORY.md`.

### AE-07 — Context efficiency measurement
- **Status:** COMPLETE (bounded static/usage baseline and output-equivalence experiment; production/inference A/B remains untested)
- **Priority:** P2
- **Area:** Context and cost
- **Summary:** Reduce unnecessary context/inference cost while preserving task state and safety: smaller boot, selective resource loading, bounded outputs, safe compaction/continuation, less repeated repository reading, caching and durable checkpoints. Do not confuse conversational memory with durable task state.
- **Current evidence:** `executed` no-inference output-equivalence sample and static file-size baseline (102717 bytes required evidence versus 4554-byte checkpoint at sampling; not actual loaded context). Actual OpenAI usage metadata: Luna/low fixture child 55 turns ~$0.03877; Sol/high review 5 turns ~$0.14136; Lead partial sample 80 turns ~$1.08276. Estimates are not invoices/current context occupancy or comparative model rankings. Reused completed work, deterministic checks and selective checkpoint/evidence reads; no context controller/configuration/routing changes. Evidence: external `.no-stow/docs/codemode-context-efficiency-evaluation.md`.
- **Dependencies:** Select one representative workflow and collect comparable baseline; lifecycle goals do not authorize lifecycle change.
- **Next action:** None for completed baseline. If operator approves an actual inference/boot-load experiment, use matched workflow/model/prompt, tokenizer usage, wall time, cost and correction/coordination counts; preserve required authority context and lifecycle-owned compaction. Do not reopen baseline gathering without a consumer.
- **Approval required:** Cost-bearing inference benchmarks or configuration edits require approval.
- **Source references:** `../README.md`; `../workbench/README.md`; `../plans/PI_TOOL_INTEGRATION.md`.

### AE-08 — Orchestration consumers and isolation map
- **Status:** READY
- **Priority:** P2
- **Area:** Pi / Herdr / Herdsman / pi-subagents
- **Summary:** Map actual consumers and unique behaviors for Herdr, Herdsman, pi-subagents, controller concurrency, worktrees, cancellation, structured returns and evidence. Decide consolidation only with consumer and behavioral-equivalence evidence; avoid expensive generalist delegation and overlapping work.
- **Current evidence:** `documented` cleanup report retained Herdsman, Herdr, pi-subagents and Workbench adapter because distinct ownership/behavior; no consumer-wide consolidation study. Routing report documents managed result/identity guarantees and that pi-subagents is not equivalent. Current dotfiles cleanup plan exists and has unresolved operator maintenance choices.
- **Dependencies:** Consumer inventory (configs, packages, workflows) and boundary classification; no changes needed to perform audit.
- **Next action:** Create read-only consumer/unique-capability matrix, including concurrency/worktree isolation and failure/cancellation propagation; identify unused components without recommending removal absent proof.
- **Approval required:** Package removal, migration or configuration change requires operator approval.
- **Source references:** `../README.md`; external `../../dotfiles/pi/.pi/docs/internal-cleanup.md`; external `../../dotfiles/.no-stow/docs/delegation-routing-implementation.md`; external `../../dotfiles/.no-stow/docs/cleanup-upgrade-plan.md`.

### AE-09 — Workbench project-construction capabilities
- **Status:** COMPLETE (bounded capability inventory; executable work split into AE-17/18)
- **Priority:** P2
- **Area:** Workbench
- **Summary:** Long-term Workbench goal: discover reusable Resources, select primitives, compose bounded workflows, construct ADWs and justified project factories, evaluate quality and evolve existing project workflows while preserving project ownership. Do not require each project to have a factory, multi-agent system, universal controller or complex runtime.
- **Current evidence:** `documented` root README defines Resources → Workbench → Project Artifacts, demand-driven composition, and says Workbench is not a runtime. `workbench/TODO.md` explicitly treats factory/scaffolder/controller hypotheses as conditional, requiring real consumer, demonstrated need, architecture review and approval. Architecture review records typed child workflow as planned, not implicit.
- **Dependencies:** Identify actual gaps in current construction documentation/tooling and a real consumer before proposing capability.
- **Inventory evidence:** `inspected` actual repository: specs/commands/roles/gates/ADW authoring are documented Resources; observe/triage/browser tools exist; at initial discovery no objective-to-assignment constructor was present; AE-17 now supplies explicit-brief construction. Dotfiles controlled Pi return adapter exists but is not managed orchestration. Missing requested architecture paths are absent, not hidden implementation. Bounded concrete gap and implementation path: [AE-17/18 plan](WORKBENCH_CONSTRUCTION_SLICE.md).
- **Next action:** None for this inventory; AE-17/18 completed, human acceptance pending. No factory/controller inferred.
- **Approval required:** New tooling/subsystem requires architecture review and explicit approval.
- **Source references:** `../README.md`; `../architecture/adw-composition-review.md`; `../workbench/TODO.md`.

### AE-10 — AIDD migration
- **Status:** BLOCKED
- **Priority:** P2
- **Area:** Attributed knowledge package / cross-harness migration
- **Summary:** Preserve the migration's exact `CORRECTION REQUIRED` state. Do not implement, approve, activate or infer ownership transfer. Outstanding questions include authored resource ownership/attribution, generated distributions, portable skills, cross-harness compatibility, private operator configuration and duplication.
- **Current evidence:** `inspected` `plans/MIGRATE_AIDD_PLAN.md`: Phase 1 clearance historical; phases 4.1, 4.2, 4.3 accepted subphases only; Phase 2 partial with ordinary Pi availability and authenticated Claude runtime unverified; Phase 7 integration and Phase 8 rollout not established. Explicit instruction: do not copy/rename/link/package/install before applicable decisions approved. Cleanup report retains package and generator; migration remains gated.
- **Dependencies:** Phase 0 decisions/ADRs, approval; Phase 2/7/8 integration and rollout gates; secure ownership and cross-harness evidence.
- **Next action:** None until operators resolve the exact open Phase 0 decisions in the plan; then revise plan only under explicit migration authorization.
- **Approval required:** Yes — all Phase 0 ownership/release, identity, stack, tools, artifact, Git safety decisions and migration actions require operator decisions.
- **Source references:** `plans/MIGRATE_AIDD_PLAN.md`; external `../../dotfiles/pi/.pi/docs/internal-cleanup.md`.

### AE-11 — Agentic Engineering learning/resource gap audit
- **Status:** READY
- **Priority:** P2
- **Area:** Learning and reusable Resources
- **Summary:** Turn course/materials into reusable practices while avoiding duplication. Topics include Software Factory, action safety/limits, proposals/targets, agentic KPIs, repository practices, workflows, architecture decisions, evaluation, construction quality and continuous improvement.
- **Current evidence:** `inspected` existing Resources include `foundations/Agentic_Engineering/10_THE_SOFTWARE_FACTORY.md`, `12_EVALUATIONS.md`, `13_MEMORY.md`, `14_SEMANTIC_AGENT_ROLES.md`, primitives, authority/safety, workflow and composition. `workbench/TODO.md` identifies conditional gaps/hypotheses and extensive existing work. No source-to-resource course coverage map found in inspected canonical docs; exact course source availability unverified.
- **Dependencies:** Locate course source/materials in authorized scope and map each topic to existing resource, gap, or non-generalizable proposal.
- **Next action:** Produce a gap-only coverage matrix; do not rewrite/add Resources until a real reusable gap is evidenced and reviewed.
- **Approval required:** Changes to portable doctrine/resources require review; no automatic import of course material.
- **Source references:** `../workbench/foundations/Agentic_Engineering/`; `../workbench/TODO.md`.

### AE-12 — Invocation-specific model and effort strategy
- **Status:** DEFERRED
- **Priority:** P2
- **Area:** Core Four / operator routing
- **Summary:** Explore cost-aware invocation-specific model/effort using task complexity, capability, provider support, provenance and optional lightweight classification. Keep semantic Roles model-agnostic; automatic routing only if justified. Preserve current six accepted presets.
- **Current evidence:** `documented` `plans/PI_TOOL_INTEGRATION.md`: interactive unknown-request routing differs from controller-specified invocation; mapping provisional; prefer explicit upstream choice. Routing implementation report confirms finite presets and unsupported arbitrary per-call API. A separate subagent-model proposal remains unapproved; it must not be treated as policy.
- **Dependencies:** Real invocation examples, measured outcome/cost and supported call interface.
- **Next action:** No implementation; if specific recurring classification error emerges, compare explicit call-site policy with lightweight classification and retain requested/effective provenance.
- **Approval required:** Operator approval for policy/configuration or live model spend; proposal pins require approval.
- **Source references:** `plans/PI_TOOL_INTEGRATION.md`; external `../../dotfiles/.no-stow/docs/subagent-model-proposal.md`; external delegation routing reports.

### AE-13 — Developer environment and tooling maintenance
- **Status:** ACTIVE
- **Priority:** P2
- **Area:** Operator dotfiles/environment
- **Summary:** Preserve discrete maintenance decisions: Herdr/Herdsman workflow improvements, Pi extension compatibility, tool discovery, MCP, Code Mode, execution observability/structured returns/status reporting, deterministic shell/Node verification, Homebrew profile, Corepack/pnpm ownership, protected Stow collisions and Pi package upgrades. Keep routine maintenance separate from architecture.
- **Current evidence:** `documented` dotfiles `.no-stow/docs/cleanup-upgrade-plan.md` and `.no-stow/docs/delegation-routing-implementation.md`; `inspected` cleanup report says selected internal cleanup complete but operator package/activation/migration choices remain gated. Prior known cmux retirement, package cleanup, Brew profile, Docker Desktop, just install and protected configuration work require separate verification; this consolidation did not claim all complete.
- **Dependencies:** Existing operator cleanup plan and actual receipts/current configuration; owner is dotfiles operator.
- **Next action:** Operator continues the existing maintenance plan; verify individual items against receipts/configuration, not mission recollection. Keep this backlog read-only regarding dotfiles.
- **Approval required:** Install/remove/upgrade, package activation, private setting edits or protected Stow changes require explicit operator authorization.
- **Source references:** external `../../dotfiles/.no-stow/docs/cleanup-upgrade-plan.md`; external `../../dotfiles/pi/.pi/docs/internal-cleanup.md`; external routing reports.

### AE-14 — October 9, 2026 Modern Pi evaluation source gap
- **Status:** READY
- **Priority:** P2
- **Area:** Evidence/provenance
- **Summary:** Locate the October 9, 2026 Modern Pi architectural evaluation if it is present locally; do not fabricate or infer its contents.
- **Current evidence:** `executed` scoped filename/content search in dotfiles `.no-stow/docs` and `pi/.pi/docs` found no match; project-local filename search found no candidate. The delegation implementation report also records no evaluation file found in its scoped documentation search. Thus source gap is recorded, not proof no copy exists elsewhere.
- **Dependencies:** User/operator may supply exact report location or artifact.
- **Next action:** If supplied, inspect and extract decisions/provenance; otherwise retain this gap and proceed without it.
- **Approval required:** No unless locating it requires searching outside authorized repositories or accessing private external storage.
- **Source references:** external dotfiles routing implementation report §Phase 1; bounded search documented here.

### AE-15 — Additional previously discussed product/tool ideas
- **Status:** IDEA
- **Priority:** P3
- **Area:** Future capabilities
- **Summary:** Preserve, but do not prioritize by default: standalone animated desktop-pet daemon; agentic workflow observability; reusable project bootstrap; agent invocation contracts; Workbench capability resolution; AI-assisted software-factory workflows; MCP/tool integration; safe parallel development/worktree isolation; durable execution evidence; cost/performance benchmarks; reusable acceptance-test fixtures.
- **Current evidence:** `asserted` examples in mission context; no further canonical supporting plan/evidence located in scoped discovery. Treat each as candidate idea, not an approved commitment.
- **Dependencies:** Real consumer, problem statement, owner, boundary, measurable success criteria; check existing Resources/Workbench/runtime first.
- **Next action:** None until a candidate is selected; then write a short evidence-backed proposal into the relevant owned planning source.
- **Approval required:** Before implementation or configuration changes; desktop daemon also entails persistent process/permissions review.
- **Source references:** This mission's supplied context; `../README.md` architecture boundaries; `../workbench/TODO.md` for conditional factory/scaffolder concepts.

### AE-16 — Five explicit delegation-routing presets accepted
- **Status:** COMPLETE
- **Priority:** P2 (completed milestone; no pending implementation)
- **Area:** Herdsman invocation routing
- **Summary:** Accepted implementation milestone for `routing-luna-low-read`, `routing-terra-medium-read`, `routing-terra-medium-edit`, `routing-sol-high-read`, and `routing-sol-high-edit`. Subsequent narrow Luna/low-edit live acceptance (disposable edit, matching startup/dispatch) is documented in the inspected dotfiles delegation README; preserve all six. This is not a claim that complete lifecycle/cancellation/continuation acceptance passed.
- **Current evidence:** `documented` report records live acceptance of Luna/low, Terra/medium read/edit, Sol/high read/edit; four new probes cost estimated $0.0260694, prior Sol/high review reused; 22 targeted tests and scoped strict TypeScript passed. See report for limitations and historical evidence.
- **Dependencies:** None for this milestone; future enhancements are AE-03 and deferred.
- **Next action:** None; do not reopen implementation without demonstrated need.
- **Approval required:** Any further live probes/config changes require operator approval.
- **Source references:** external `../../dotfiles/.no-stow/docs/delegation-routing-live-acceptance.md`; external `../../dotfiles/.no-stow/docs/delegation-routing-implementation.md`.

### AE-17 — Construct explicit bounded engineering packets
- **Status:** COMPLETE (bounded engineering result; task acceptance_pending)
- **Priority:** P1
- **Area:** Workbench construction/context/planning
- **Summary:** Validate explicitly authored objective, targeted context, requirements, dependency/ownership plan, acceptance checks and Core Four; emit self-contained inspectable assignments. No execution controller, router, permission grant or private Pi APIs.
- **Dependencies:** AE-09 inventory satisfied; current operator mission authorizes bounded tooling; existing spec/command/role contracts reused.
- **Acceptance / implementation:** [construction slice plan](WORKBENCH_CONSTRUCTION_SLICE.md), increment 1; independent architecture review required.
- **Evidence:** `inspected` current tooling gap; `documented` plan and acceptance established before implementation.
- **Evidence:** `executed` constructor 19/19, syntax/strict JSDoc passed; actual three-file packet constructed and navigation integrated. Fresh independent architecture review PASS with no material findings; final documentation gates passed. [Completion record](evidence/workbench-slice/completion.json) retains check/review provenance and scoped limitations.
- **Next action:** Human acceptance of bounded constructor; no shipping/runtime/adoption grant.
- **Approval required:** Human acceptance; no installation/runtime/settings grant.

### AE-18 — Deliver and verify an isolated managed engineering slice
- **Status:** COMPLETE (bounded engineering result; task acceptance_pending)
- **Priority:** P1
- **Area:** Workbench end-to-end delivery
- **Summary:** Construct a packet for a synthetic slug-normalization objective, execute through existing Herdsman ownership, independently check behavior and exact nonempty allowed diff, retain durable delivery evidence/update state. Runtime settlement alone never establishes success.
- **Dependencies:** AE-17 tested constructor; current fixture/delegation authorization and valid managed authority.
- **Acceptance:** [construction slice plan](WORKBENCH_CONSTRUCTION_SLICE.md), increment 2; no-op/scope/check failure controls; all nine slice stages evidenced; acceptance_pending, not human-accepted/shipping.
- **Evidence:** `executed` packet → existing managed implementer → exact nonempty `slug.mjs` diff → independent 6/6 behavioral tests + syntax; protected-file/canonical-workspace hashes checked. Gate controls 5/5 including no-op/scope/failing-check rejection. [Nine-stage durable trace](evidence/workbench-slice/README.md) distinguishes agent-asserted dispatch/report from independent checks; effective effort/cost unobserved. No multi-task readiness claim.
- **Review:** `inspected` by fresh independent reviewer, [PASS](evidence/workbench-slice/architecture-review.json), no material findings. Node results inspected by reviewer, independently executed by Lead; optional verifier identity-report suggestion retained as AE-19.
- **Next action:** Human acceptance of bounded delivery; no shipping or production adoption.
- **Approval required:** Human acceptance/shipping; production adoption outside this mission.

### AE-19 — Make fixture verification identity self-contained
- **Status:** DEFERRED (optional review suggestion, not a current repair)
- **Priority:** P3
- **Area:** Project-owned synthetic verification evidence
- **Summary:** Include canonical workspace and run/task identity directly in the verifier JSON, so a standalone report can identify its check subject/cwd. Current AE-18 reconciles identity separately; no material contract violation found.
- **Evidence:** `inspected` fresh review AR-01, Low/tech_debt at `verify-fixture.mjs:48–50`; [review record](evidence/workbench-slice/architecture-review.json).
- **Dependencies:** Operator selects this evidence improvement and scopes its contract/tests; affected architecture review must reopen on a material implementation change.
- **Next action:** None; keep current reviewed implementation stable. Do not infer execution authority from this suggestion.
- **Approval required:** Separate selection; no runtime/controller changes.

## Runtime residual risk classification (current slice)

- **CRITICAL conditional:** actual fence/poison, ambiguous executor identity/authority or uncertain child ownership. Stop affected operations; no bypass/recovery.
- **NONBLOCKING:** missing comprehensive live acceptance, incomplete first-cause diagnostics and unknown historical poison causes. Use conservative fixtures; do not claim runtime health.
- **DEFERRED:** upstream summary-text correlation and terminal-outcome provenance require owning-source authorization; upstream Pi changes explicitly forbidden. Independently verify implementation and tests.
- **BLOCKING for specific workflows only:** restoration/retirement/repeated selected-cycle contracts remain unresolved. Current slice does not restore, retire, force compact or inject lifecycle failures.

## Completed and accepted evidence

- **Internal Pi cleanup is a bounded completion, not necessarily human-accepted:** see external report; human acceptance remains distinct (`acceptance_pending`).

- **Internal Pi cleanup COMPLETE as a bounded cleanup change:** only retired archived runner sources and stale guidance removed; active AIDD generator/distribution, Workbench adapter/`wb_return`, lifecycle and authored tools retained. Report says targeted checks passed; human acceptance is distinct (`acceptance_pending` in report), so do not assert operator acceptance. Source: external `../../dotfiles/pi/.pi/docs/internal-cleanup.md`.
- **Workbench architecture direction documented, not an implementation completion:** canonical root README and Workbench documents define current boundaries and construction mission. Do not claim planned project factory/capability resolution is already built.
- **AIDD phases:** retain granular status exactly as in AE-10; do not mark full migration complete.

## Operator decisions / approvals requiring explicit action

1. AIDD Phase 0 gates and any migration/activation/rollout (AE-10).
2. Further lifecycle repair/recovery/configuration, first-observed-failure design, owning-source upstream correction or live failure-injection acceptance (AE-01/02). Owned P1a/P1b has a bounded implementation grant and verified completion; no bypass/reset/restoration authority follows.
3. Adoption of arbitrary/automatic routing, model pins, or additional live cost-bearing probes (AE-03/12).
4. Installing Code Mode/Durable/memory packages, configuration, transcript storage or external data processing (AE-04/05/06).
5. Workbench new construction tooling/factory/controller/subsystem proposals (AE-09/11).
6. Dotfiles package install/remove/upgrade, Homebrew/profile and protected Stow/configuration changes (AE-13).

Operator decisions do not follow from this backlog's READY/IDEA classification.
