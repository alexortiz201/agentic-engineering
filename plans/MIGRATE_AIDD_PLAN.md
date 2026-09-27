# AIDD Migration Plan

## Status

**Current checkpoint: `CORRECTION REQUIRED` — overall migration acceptance remains open.** Phase 1 clearance is the accepted historical checkpoint. Phase 4.1, 4.2, and 4.3 are accepted as completed/ported subphases with recorded scoped validation; their completion does not establish overall migration acceptance or rollout. Phase 2 is partially accepted: isolated Pi package-origin skill discovery, alternate-identity testing, and static Claude plugin validation are recorded, but ordinary Pi-session availability and authenticated Claude runtime discovery remain unverified. Phase 7 integration acceptance and Phase 8 rollout are not established. This checkpoint records evidence; it does not authorize remaining migration work.

Do not copy, rename, link, package, or install resources until the applicable decision gates are approved.

## Goal

Create an independently owned, cross-harness package containing the selected
AIDD commands and skills, adapted to the workbench's tooling rather than linked
to the upstream AIDD checkout.

The package should:

- share one canonical source of truth across Pi and Claude Code;
- expose a stable namespaced command interface in both harnesses;
- preserve progressive skill disclosure without introducing global name
  collisions in Pi;
- replace hardcoded AIDD identity with build-time module configuration;
- retain useful workflows while replacing incompatible stack assumptions;
- exclude the seven unwanted Adobe/Lit application-architecture skills;
- preserve upstream MIT attribution;
- remain testable, versioned, and independently maintainable.

## Sources and constraints

Planning inputs:

- `TOOLS.md` and `NOTES.md` when present in the active operator workspace
- upstream AIDD command and skill sources, materialized only when needed in the external dotfiles repository at `pi/upstreams/aidd/`
- Pi package, skill, prompt-template, and extension documentation
- upstream AIDD commit `9a7c8e3`
- upstream AIDD license: MIT, copyright 2025 Eric Elliott

## Ownership and source locations

- **OWNED — Pi port:** `pi/packages/aidd-pi/` in the external dotfiles repository. It is a Pi/Claude-specific owned implementation, not a component of the portable Workbench repository.
- **UPSTREAM REFERENCE — AIDD:** `pi/upstreams/aidd/` when materialized from `https://github.com/paralleldrive/aidd.git`. It is unowned, ignored, reproducible reference material; it is neither vendored nor a submodule and must not be a runtime dependency.
- **OWNED — Workbench:** the portable Agentic Engineering workspace. It owns contracts and documentation, not the Pi port or an upstream checkout.

The historical standalone checkout at `/Volumes/DevDrive/Projects/aidd` remains unmodified during this reorganization. Historical evidence may name that path, but current instructions must use the upstreams convention. The owned package must not depend on symlinks into any upstream checkout.

## Migration boundary

### Commands to retain — 19

All current command resources are wanted:

1. `aidd-churn`
2. `aidd-fix`
3. `aidd-parallel`
4. `aidd-pipeline`
5. `aidd-pr`
6. `aidd-requirements`
7. `aidd-riteway-ai`
8. `aidd-rtc`
9. `aidd-upskill`
10. `commit`
11. `discover`
12. `execute`
13. `help`
14. `log`
15. `plan`
16. `review`
17. `run-test`
18. `task`
19. `user-test`

These names describe the upstream source inventory, not the final public names.
The final namespace and prefixes are decided in Phase 0.

### Skills to retain and port — 28

1. `aidd-agent-orchestrator`
2. `aidd-autodux`
3. `aidd-churn`
4. `aidd-error-causes`
5. `aidd-fix`
6. `aidd-javascript`
7. `aidd-javascript-io-effects`
8. `aidd-jwt-security`
9. `aidd-layout`
10. `aidd-log`
11. `aidd-parallel`
12. `aidd-pipeline`
13. `aidd-please`
14. `aidd-pr`
15. `aidd-product-manager`
16. `aidd-requirements`
17. `aidd-review`
18. `aidd-riteway-ai`
19. `aidd-rtc`
20. `aidd-stack`
21. `aidd-sudolang-syntax`
22. `aidd-task-creator`
23. `aidd-tdd`
24. `aidd-timing-safe-compare`
25. `aidd-ui`
26. `aidd-upskill`
27. `aidd-user-testing`
28. `aidd-write`

“Retain” does not mean copy unchanged. Stack-coupled skills must be rewritten or
made profile-driven while preserving their useful intent.

### Explicitly excluded — 7

Use an allowlist so these cannot enter the package accidentally:

- `aidd-ecs`
- `aidd-lit`
- `aidd-namespace`
- `aidd-observe`
- `aidd-react`
- `aidd-service`
- `aidd-structure`

Exclude their supporting files and remove retained-skill references to them.
Tests must reject `@adobe/data/*`, `Database.Plugin`, `DatabaseElement`, and other
stale dependencies from source and packed output unless a future decision
explicitly restores one.

## Recommended architecture

### One canonical source, generated harness targets

Use neutral canonical resource IDs such as `fix`, `review`, and
`agent-orchestrator`. Generate harness-specific artifacts rather than hand-editing
two copies.

```text
<owned-package>/
├── package.json
├── LICENSE
├── NOTICE
├── README.md
├── module.json
├── resources/
│   ├── commands/
│   ├── skills/
│   └── manifest.json
├── extensions/
│   └── pi-commands.ts
├── scripts/
│   ├── build-resources.ts
│   └── validate-resources.ts
├── dist/
│   ├── claude/
│   │   ├── .claude-plugin/plugin.json
│   │   ├── commands/
│   │   └── skills/
│   └── pi/
│       ├── extensions/
│       └── skills/
└── tests/
```

`dist/` should be deterministic generated output. Whether it is committed or
built during packaging is a Phase 0 release decision.

### Module identity

Replace hardcoded identity with validated build configuration. The exact schema
is a decision gate, but it must distinguish concepts that Pi and Claude treat
differently. A likely shape is:

```json
{
  "modulePrefix": "wb-",
  "commandNamespace": "wb",
  "packageName": "<owned-package>",
  "displayName": "Workbench"
}
```

If only `modulePrefix` is retained, derive the command namespace by removing one
trailing hyphen and reject ambiguous values. Do not derive npm package ownership
or display names implicitly.

Identity is a **build-time** concern for the shared distribution:

- Claude's plugin name is static in `.claude-plugin/plugin.json`.
- Skill frontmatter names are static when Pi discovers them.
- Pi may read runtime settings for behavior, but runtime settings cannot safely
  rename already-discovered skills or Claude's plugin namespace.

Never replace AIDD text inside the required upstream copyright/license notice.

### Pi command and skill behavior

A Pi package does not automatically namespace its skills. The Pi target should:

1. generate collision-safe underlying skill names, such as
   `${modulePrefix}review`;
2. expose native discovery as `/skill:${modulePrefix}review`;
3. register the canonical user command, such as `/wb:review`, through the
   extension;
4. route command arguments to the correct bundled prompt/skill without relying
   on the upstream checkout or current working directory.

Pi has no direct extension API named “load this skill.” The implementation must
choose and test one dispatch strategy:

- send an internal `/skill:<generated-name> <args>` user message with expansion
  enabled; or
- load the bundled resource in the extension and inject its expanded prompt.

The first is preferable if integration tests prove it preserves arguments,
provenance, noninteractive behavior, and avoids recursive command dispatch.

Fail validation if command collisions produce Pi's numeric aliases such as
`:1` or `:2`; those must not become public API.

### Claude Code behavior

Generate a native plugin target with its static plugin namespace and neutral
skill names. Before committing to the layout, test how Claude handles a command
and skill with the same basename. Publish one unambiguous
`/<namespace>:<capability>` entrypoint per capability.

### Resource manifest

Maintain one typed manifest containing:

- module identity;
- the 19-command allowlist;
- the 28-skill allowlist;
- the seven-skill denylist;
- command-to-skill routing;
- command aliases;
- skill-to-skill dependencies;
- required and optional external capabilities;
- source file and upstream commit attribution;
- harness-specific generation rules.

Generate indexes and wrappers from this manifest. Do not use broad directory
copying or package globs that could silently include excluded resources.

## Phase 0 — decisions required before implementation

Record each answer in an architecture decision record before Terra dispatches
implementation tasks.

### 0.1 Ownership and release

Established ownership boundary: the owned Pi/Claude package lives in the external dotfiles repository at `pi/packages/aidd-pi/`; upstream AIDD is an ignored reference checkout at `pi/upstreams/aidd/` when needed. It is not a permanent component of `agentic-engineering`.

Decide:

- package release identity and local package path within that ownership boundary;
- npm package name and scope;
- public or private distribution;
- package license for new work;
- whether generated `dist/` files are committed;
- versioning and upstream-sync policy.

Recommendation: record the source commit per migrated resource and selectively
port future upstream changes; do not merge the upstream repository wholesale.

### 0.2 Public identity

Decide:

- default `modulePrefix`;
- command namespace;
- Claude plugin name;
- whether “AIDD” remains only in provenance or also in user-facing names;
- whether legacy aliases such as `/aidd:review` are wanted temporarily.

### 0.3 State-management replacement

`aidd-autodux`, `aidd-stack`, `aidd-javascript-io-effects`, `aidd-review`, and
`aidd-tdd` form one coupled decision. Specify:

- Autodux as the expected state-management solution;
- preferred async/effect mechanism compatible with Autodux, or
  profile-dependent guidance;
- whether Autodux is a default, an optional profile, or one of several profiles;
- framework defaults, if any.

Retain the `autodux` name and preserve its behavior explicitly; do not disguise
it as a neutral state-management abstraction.

### 0.4 Test and evaluation stack

Decide whether the owned package should preserve, replace, or make optional:

- Riteway assertions;
- Vitest;
- Playwright;
- Riteway AI and `.sudo` evaluations;
- Bun-compiled validation tools.

The chosen skill guidance must not claim a test runner is mandatory unless the
project or active profile selects it.

### 0.5 External tools

For each dependency, choose **owned**, **required external**, **optional**, or
**replaced**:

- `npx aidd churn`;
- Git and Git history;
- GitHub CLI and GitHub GraphQL;
- browser automation and screenshots;
- Pi subagent tool;
- Claude subagents;
- Cursor Agent CLI;
- `error-causes`;
- SudoLang tooling.

Recommendation: remove Cursor Agent coupling; adapt orchestration to harness
capabilities. Decide separately whether to port churn's deterministic CLI or
retain AIDD as an explicit external dependency.

### 0.6 Project artifact conventions

Decide whether these are package defaults, configurable paths, or removed:

- `plan.md`;
- `plan/story-map/`;
- `tasks/` and `tasks/archive/`;
- `activity-log.md`;
- project-local configuration;
- end-to-end-test-before-commit policy.

### 0.7 Git safety policy

Approve or replace workflows that currently tell agents to commit, push, share a
branch, and run `git pull --rebase`. Destructive or remote operations must be
explicit and must not occur merely because a skill was loaded.

## Phase 1 — freeze inventory and dependency graph

1. Build a machine-readable manifest from the approved lists.
2. Inventory every retained skill's supporting README, reference, script, test,
   and template file.
3. Classify every internal reference as:
   - retained and renamed;
   - replaced by a harness adapter;
   - optional external dependency;
   - stale and removed.
4. Capture command → skill and skill → skill edges.
5. Add a denylist for the seven excluded skills and Adobe APIs.
6. Add a branding scan with explicit exceptions for attribution and deliberately
   retained external commands.

**Exit criterion:** every file and dependency has an explicit disposition; no
resource is copied because it merely shares a directory with a wanted resource.

## Phase 2 — package scaffold and generators

1. Create the owned repository/package only after Phase 0 approval.
2. Add the package manifest with explicit Pi resource entries.
3. Put Pi-provided packages in `peerDependencies` with `"*"` ranges.
4. Put actual runtime libraries in `dependencies`; do not copy the upstream
   dependency list wholesale.
5. Add `module.json` schema and validation.
6. Implement deterministic generation for Pi and Claude targets.
7. Generate command/skill indexes from the manifest.
8. Add MIT attribution and a modification notice from the start.

**Exit criterion:** an empty/minimal package packs and loads in both harnesses,
and changing module identity regenerates valid, collision-free names.

## Phase 3 — port portable content first

Port and normalize the lowest-risk skills before coupled workflows:

- `jwt-security`
- `layout`
- `log`
- `product-manager`
- `requirements`
- `rtc`
- `timing-safe-compare`
- `write`
- `sudolang-syntax`

For each skill:

1. remove hardcoded upstream paths and command names;
2. preserve useful references and assets;
3. add explicit compatibility/capability metadata;
4. retain upstream attribution in the manifest/NOTICE;
5. validate all relative links;
6. add a focused behavioral or structure test.

**Exit criterion:** each skill works independently and introduces no dependency
on an excluded skill.

## Phase 4 — port and modernize stack-coupled guidance

Treat related skills as one coherent profile rather than independent search and
replace operations.

### 4.1 JavaScript and application stack

Port together:

- `javascript`
- `autodux` → approved Autodux capability/name
- `javascript-io-effects` → approved effect model
- `stack` → profile-driven stack guidance
- `ui`
- `error-causes` → approved package-neutral or package-specific policy

Remove Adobe dependencies and stale Saga assumptions according to Phase 0
decisions while retaining approved Autodux guidance. Make applicability explicit
so non-JavaScript projects do not load JavaScript policy accidentally.

### 4.2 Testing and evaluation

**Status:** COMPLETE. **ARCHITECTURE GATE: NOT APPLICABLE —** this phase adds
guidance-only canonical skills through the existing deterministic generator and
introduces no runtime, state, adapter, external-system integration, authority
mechanism, or consumed code API.

Ported together:

- `tdd`
- `riteway-ai`

Universal TDD behavior is separated from runner-specific references. Riteway,
Vitest, Playwright, `.sudo`, Bun, model, and harness choices are optional
capability profiles. Unavailable churn or evaluation capabilities have
actionable, non-fabricated fallbacks. Prompt-only tool mocks are not treated as
isolation, and live evaluation effects require explicit authority.

### 4.3 Deterministic tooling

Port `churn` after deciding whether to:

- own and rename the CLI implementation;
- invoke an external AIDD CLI explicitly; or
- replace it with another maintained hotspot tool.

Do not leave `npx aidd churn` hidden inside an otherwise owned package.

**Exit criterion:** no retained skill prescribes unavailable tooling without a
capability check and actionable fallback.

## Phase 5 — adapt workflow and orchestration skills

**Architecture prerequisite:** use the portable [`semantic role` contract](../workbench/foundations/Agentic_Engineering/14_SEMANTIC_AGENT_ROLES.md) and the cross-repository [role/routing architecture](../../Architecture/semantic-agent-routing.md). Phase 5 content may name semantic responsibilities and capabilities; it must not embed the current operator's provider/model/effort mapping or treat harness-native subagents as the portable controller.

Port after their lower-level dependencies stabilize:

1. `agent-orchestrator`
2. `task-creator`
3. `fix`
4. `review`
5. `parallel`
6. `pipeline`
7. `pr`
8. `user-testing`
9. `please`
10. `upskill`

Required adaptations:

- express recurring specialized work as the smallest justified semantic-role requirements, without inventing a fixed roster or role DSL;
- leave concrete provider/model/reasoning-effort selection to operator routing policy and preserve explicit requested/effective evidence;
- keep ADW/controller-spawned invocations distinct from optional Pi/Claude harness-native subagents;
- replace Cursor Agent and generic `Task`/`Agent` pseudocode with a small
  harness-capability abstraction;
- map Pi delegation to the installed `subagent` tool without copying that
  extension into this package;
- define Claude's corresponding delegation behavior separately;
- preserve stop-on-blocker and untrusted-task boundaries;
- use approved artifact paths and Git safety policy;
- parameterize skill naming and validation in `upskill`;
- make browser and GitHub features fail clearly when unavailable;
- make `please` a generated router over the actual manifest rather than a stale
  handwritten command catalog;
- ensure `review` references only retained or optional skills.

**Exit criterion:** every workflow resolves only manifest-declared dependencies
and has tested behavior when optional capabilities are absent.

## Phase 6 — migrate commands and namespace adapters

1. Convert all 19 upstream command files to neutral canonical command IDs.
2. Generate Claude wrappers from the canonical command definitions.
3. Generate/register Pi namespaced commands from the same manifest.
4. Preserve positional and free-form arguments exactly.
5. Decide precedence when a command and skill share a capability name.
6. Ensure extension commands work in TUI, RPC, JSON, and print modes without
   requiring UI prompts.
7. Generate `help` from the manifest so it cannot advertise missing resources.
8. Reject duplicate registrations and numeric fallback aliases.

**Exit criterion:** both harnesses expose the approved namespace and the same
capability catalog with no ambiguous entrypoints.

## Phase 7 — validation and integration tests

### Inventory and exclusion

- Assert exactly 19 canonical commands and 28 canonical skills.
- Assert all seven excluded skills and their support files are absent.
- Assert excluded Adobe imports and concepts are absent from packed output.

### Identity and branding

- Test the approved default module identity.
- Test a second identity such as `wb-`.
- Reject empty, malformed, reserved, or conflicting prefixes/namespaces.
- Scan for hardcoded `aidd-`, `/aidd-*`, `ai/skills`, and `aidd-custom` with a
  narrow allowlist for attribution or intentionally retained external tools.
- Verify generated frontmatter names meet Agent Skills/Pi constraints.

### Dependency integrity

- Resolve every internal skill and command reference.
- Validate every relative Markdown link and required supporting file.
- Detect dependency cycles and missing optional-capability declarations.
- Confirm no retained resource references an excluded skill.

### Pi

- Run TypeScript/static checks and unit tests.
- Run `npm pack --dry-run` and inspect package contents.
- Install the packed artifact in an isolated Pi home/configuration.
- Verify extension, skill, and command provenance with Pi discovery APIs/RPC.
- Verify `/namespace:capability` argument forwarding.
- Verify native underlying skill names are collision-safe.
- Verify `/reload` does not duplicate commands.
- Verify no `:1`/`:2` command aliases appear.
- Smoke-test TUI, RPC, JSON, and print behavior where applicable.

### Claude Code

- Validate the generated plugin manifest with the supported Claude tooling.
- Test namespaced discovery.
- Test command-only, skill-only, and same-capability command/skill cases.
- Verify package-relative references after installation.

### Behavioral tests

- Exercise one representative command from each group: planning, implementation,
  review, orchestration, GitHub, user testing, and authoring.
- Verify clear fallback messages for missing `gh`, browser automation, subagent
  support, evaluation runner, and churn backend.
- Verify remote Git actions require the approved explicit trigger.

### Legal and release

- Verify `LICENSE` and `NOTICE` are included in the packed artifact.
- Verify every derived resource records its upstream source and commit.
- Verify no secret, generated session, or machine-specific absolute path ships.

## Phase 8 — staged rollout

1. Install from a local packed artifact, not a source symlink.
2. Enable only the extension and portable skill wave first.
3. Validate command discovery and routine use.
4. Enable stack/testing profiles.
5. Enable orchestration, GitHub, and browser-dependent workflows last.
6. Run a short acceptance period before publishing or replacing existing Pi
   prompts.
7. Remove superseded local prompts only after equivalent package behavior is
   demonstrated.
8. Document rollback: remove/disable the package and restore prior settings
   without changing the external AIDD checkout.

## Terra execution plan

### Model policy

Use the lowest appropriate role for each bounded task. Escalate a failed or
ambiguous task individually rather than raising effort for an entire wave.

- **`openai-codex/gpt-5.3-codex-luna`, low/medium:** worker tasks: mechanical
  inventory, scaffolding, deterministic rewrites, content ports, formatting,
  simple tests, package inspection, and documentation.
- **`openai-codex/gpt-5.6-terra`, medium/high:** engineering tasks: generators,
  validators, extension and adapter code, integration and behavioral tests,
  release validation, and implementation-focused review.
- **`openai-codex/gpt-5.6-sol`, high:** architecture: Phase 0/ADRs, schemas and
  naming policy, tightly coupled stack or workflow redesign, and audits that
  expose unresolved architectural or security issues.

If Terra uses different model identifiers, preserve these role tiers: Luna for
bounded worker tasks, Terra for engineering, and Sol for architecture.

### Task graph

| ID | Task | Preferred model | Effort | Depends on | Parallelism / ownership |
|---|---|---|---|---|---|
| T0 | Answer Phase 0 decisions and write ADRs | Human + `openai-codex/gpt-5.6-sol` | High | — | One architecture owner; do not delegate unresolved product choices |
| T1 | Build exact file inventory, dependency graph, allowlist, denylist, and source-attribution map | `openai-codex/gpt-5.3-codex-luna` | Low | T0 | Single mechanical task |
| T2 | Design manifest/schema, build targets, naming rules, and collision policy | `openai-codex/gpt-5.6-sol` | High | T0, T1 | One architecture owner |
| T3 | Scaffold owned package, license/NOTICE, manifests, and minimal harness fixtures | `openai-codex/gpt-5.3-codex-luna` | Low | T2 | One worker; no content port yet |
| T4 | Implement deterministic resource generator and validator | `openai-codex/gpt-5.6-terra` | Medium | T2, T3 | One worker because generated formats share code |
| T5A | Port `jwt-security`, `requirements`, `timing-safe-compare` | `openai-codex/gpt-5.3-codex-luna` | Medium | T4 | Parallel content batch; owns only assigned skill folders |
| T5B | Port `layout`, `ui`, `write` | `openai-codex/gpt-5.3-codex-luna` | Medium | T4 | Parallel content batch |
| T5C | Port `log`, `product-manager`, `rtc`, `sudolang-syntax` | `openai-codex/gpt-5.3-codex-luna` | Medium | T4 | Parallel content batch |
| T6A | Adapt `autodux`, `javascript-io-effects`, and `stack` around approved Autodux profiles | `openai-codex/gpt-5.6-sol` | High | T0, T4 | One owner due to coupled architecture |
| T6B | Port `javascript` and `error-causes` against approved policies | `openai-codex/gpt-5.3-codex-luna` | Medium | T0, T4 | May run parallel with T6A; reconcile afterward |
| T6C | Redesign `tdd` and `riteway-ai` around approved test/eval capabilities | `openai-codex/gpt-5.6-sol` | High | T0, T4 | One owner due to test-stack coupling |
| T6D | Port or adapt `churn` and its deterministic backend | `openai-codex/gpt-5.6-terra` | Medium | T0, T4 | Isolated tooling task |
| T7A | Adapt `agent-orchestrator`, `parallel`, and `pipeline` to harness capabilities | `openai-codex/gpt-5.6-sol` | High | T4 | One owner; security-sensitive delegation behavior |
| T7B | Adapt `task-creator`, `fix`, and `review` | `openai-codex/gpt-5.6-sol` | High | T5*, T6*, T7A | One owner; depends on settled lower-level policies |
| T7C | Adapt `pr` and `user-testing` with optional capability guards | `openai-codex/gpt-5.6-terra` | Medium | T4, T7A | Can run parallel with T7B after interfaces settle |
| T7D | Adapt generated router `please` and authoring system `upskill` | `openai-codex/gpt-5.6-sol` | High | T5*, T6*, T7A–T7C | Run after final catalog/dependencies stabilize |
| T8 | Migrate all 19 commands into canonical definitions and generated Claude wrappers | `openai-codex/gpt-5.3-codex-luna` | Medium | T7D | One content owner to keep command language consistent |
| T9 | Implement Pi namespaced command extension and argument dispatch | `openai-codex/gpt-5.6-terra` | Medium | T4, T8 | One extension owner |
| T10 | Complete Claude plugin generation and namespace/collision handling | `openai-codex/gpt-5.6-terra` | Medium | T4, T8 | May run parallel with T9 |
| T11A | Add inventory, branding, dependency, link, and packed-content tests | `openai-codex/gpt-5.3-codex-luna` | Low | T4–T10 | Parallel test task |
| T11B | Add Pi integration and mode tests | `openai-codex/gpt-5.6-terra` | Medium | T9 | Parallel test task |
| T11C | Add Claude plugin integration tests | `openai-codex/gpt-5.6-terra` | Medium | T10 | Parallel test task |
| T11D | Add representative behavioral and capability-fallback tests | `openai-codex/gpt-5.6-terra` | Medium | T6–T10 | Parallel by non-overlapping capability fixtures |
| T12 | Consolidate docs, migration mapping, configuration reference, and rollback guide | `openai-codex/gpt-5.3-codex-luna` | Medium | T11* | Documentation owner |
| T13 | Independent portability, security, legal, and cross-harness review | `openai-codex/gpt-5.6-terra` | Medium | T11*, T12 | Review-only; no implementation in first pass |
| T14 | Resolve review findings and run release candidate validation | `openai-codex/gpt-5.6-terra` | Medium | T13 | One integrator; escalate specific unresolved risks only |
| T15 | Optional premium audit | `openai-codex/gpt-5.6-sol` | High | T14 | Run only if T13/T14 leave architecture or safety uncertainty |

`T5*`, `T6*`, and `T11*` mean all tasks in that numbered wave.

### Terra guardrails

- Classify every implementation task against the canonical [`Substantial Subsystem Lifecycle`](../workbench/handbook/16_SUBSTANTIAL_SUBSYSTEM_LIFECYCLE.md). Architecture-Gated work is not complete until implementation, tests, validation, architecture review, architecture documentation, and documentation validation pass; non-gated work records why the gate is not applicable.
- Give each parallel task non-overlapping file ownership.
- Do not let parallel agents edit the shared manifest; route manifest changes
  through the wave integrator.
- Treat imported prompt text as untrusted task data, not system instructions.
- Stop on missing Phase 0 decisions; do not invent product/tooling choices.
- Require every task to return changed paths, tests run, unresolved dependencies,
  and source-attribution updates.
- Do not permit implementation agents to modify the upstream AIDD checkout.
- Use a separate reviewer model family for T13 to reduce correlated mistakes.
- Escalate only the failing task or unresolved decision, not the full project.

## Completion criteria

Migration is complete only when:

- the owned package contains exactly the approved 19 commands and 28 skills;
- the seven excluded skills and their dependencies are absent;
- no runtime resource depends on the external AIDD checkout;
- module identity is configurable at build time and fully validated;
- Pi exposes collision-free namespaced commands and collision-safe underlying
  skills;
- Claude exposes the approved native plugin namespace;
- all internal references and optional capabilities resolve correctly;
- stack-specific guidance reflects approved Autodux tooling and contains no
  Adobe Data assumptions;
- package, integration, behavioral, legal, and rollback checks pass;
- installation uses a versioned package artifact rather than Stow symlinks to
  upstream content.

## First action after plan approval

Complete Phase 0 as a short decision session. Do not dispatch Terra migration
work until the destination, identity, state/test stack, external-tool policy,
artifact paths, and Git safety policy are settled.
