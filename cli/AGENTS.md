# Setup CLI conventions

Inspect existing code/tests before adding dependencies or abstractions. This subtree owns the setup wizard and bounded project-capability integration; root safety and deployment gates still apply. Project integration uses the existing catalog and must not invoke machine installers.

## Paved road

- Strict TypeScript, Node >=22.19, npm lockfile, Node built-ins and `node:test`.
- Standard `@clack/prompts`, sequential `async/await`. Direct `@clack/core` primitives are allowed for the demonstrated interaction requirements not met by the standard helpers: the per-component tri-state cycle (`[ ] → [x] → [−]`) requires handling Space/x/-/0 keys and rendering inline with component list scroll, and navigation controls need Backspace to return preserved intent. Reuse core Select/MultiSelect/Confirm primitives for navigation rather than introducing another UI framework; `@clack/core` was already a transitive dependency and is pinned to avoid implicit upgrades. No state-management library.
- Keep the typed `SetupSession` small: profile and desired selections, including each selection's removal scope/confirmation. Do not duplicate those decisions in parallel state stores.
- Keep detected `State` snapshots separate from user decisions and reviewed `Plan` snapshots. Available/installed/enabled/loaded are not synonyms.

## Boundaries

- `components/`: single authoritative catalog for concrete capabilities, explicit project applicability and composition dependencies; `profiles/`: overridable machine recommendation data.
- `project/`: selected-only project linking, pure dependency resolution/planning, ownership reconciliation and verification. No workflow runtime or additional registry; use canonical leaf sources and preserve project-owned files.
- `setup/detect.ts`: actual read-only observations through `Context.run`/filesystem helpers.
- `setup/plan.ts`: pure deterministic decisions. No filesystem access, commands, prompts or mutation of caller inputs.
- `setup/execute.ts`: explicitly approved effects plus exported `verify`; `files.ts`/`theme.ts` own narrow filesystem/settings mechanisms. Reuse Stow/native managers, not a new transaction engine.
- `prompts/`: decisions and presentation only; read-only cleanup evidence is allowed. No installs/removals while answering questions.
- `commands/setup.ts`: sequential coordination and explicit session state; only pass the reviewed plan to execution.

## Non-negotiable invariants

Skipped components are untouched; current selections are no-ops; removals require explicit confirmed selection. Never adopt/delete unmanaged files. Preserve private data and unselected optional resources. Dry-run has no installation/removal effects. Failures/partial results must be visible. Reruns inspect actual state and avoid unnecessary work; stale previews are refused, not force-applied.

Test destructive paths only in temporary homes with controlled runners. Never invoke live Pi/Homebrew mutations from tests. Actual Stow fixtures and package-command stubs are different evidence; never claim runtime acceptance from fixtures.

Run `npm --prefix cli run check`, `npm --prefix cli run build`, `npm --prefix cli test`; optionally `python3 cli/tests/terminal-probe.py` for real PTY dry-runs. Existing Pi regression checks remain in `scripts/install-pi.test.js` at repository root.

See [development examples](DEVELOPMENT.md), [supported operations](README.md#supported-operations), and [deployment gates](../setup/MIGRATION.md). Deviate only for a demonstrated requirement: explain the benefit, cost and tests; hypothetical future products do not justify a framework.
