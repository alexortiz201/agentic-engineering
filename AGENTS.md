# Agentic Engineering workspace contract

This repository is the bounded orchestration workspace for Agentic Engineering and the portable **workbench tool**. Its GitHub identity is `alexortiz201/agentic-engineering`.

## Topology and ownership

- [`cli/`](cli/README.md) — **OWNED** standalone TypeScript/Clack setup wizard; independent of Pi, Herdr and Workbench runtimes. Only setup is implemented.
- [`setup/`](setup/OWNERSHIP.md) — **OWNED** staged computer provisioning sources, bootstrap and [approval-gated migration/retirement](setup/MIGRATION.md). Old dotfiles remains intact until approved retirement; copied source does not transfer live ownership.
- [`harness/pi/`](harness/pi/README.md) — **AUTHORED CANONICAL SOURCE** for selective Pi packages, portable seed and accepted metadata. Both hosts' selective ownership handoffs are verified; see `plans/handoffs/AIR_LIVE_HANDOFF_RESULT.md` and `plans/handoffs/MINI_LIVE_HANDOFF_RESULT.md`. Edit only this source; generation from root `pi/` is retired. Root `pi/` remains frozen compatibility/recovery material for retained consumers, never a second authored authority; removal remains separately approval-gated.
- [`workbench/`](workbench/) — **OWNED** portable Workbench tool: doctrine, contracts, canonical authored resources, templates, and harness descriptions. It is not a runtime/controller. Its [`AGENTS.md`](workbench/AGENTS.md) is authoritative for all work beneath that directory.
- `workbench/.profile/`, `.memory/`, and `.workgroup/` — **LOCAL WORKBENCH OVERLAYS/STATE**. Their contents are ignored, environment-specific, and never canonical portable source. Their sanitized tracked contracts are under `workbench/templates/layout/`; preserve their distinct semantics rather than treating them as one store.
- [`plans/`](plans/) — **OWNED** workspace plans. [`MIGRATE_AIDD_PLAN.md`](plans/MIGRATE_AIDD_PLAN.md) preserves the active `CORRECTION REQUIRED` checkpoint; reorganization does not resolve its migration gates. [`PI_TOOL_INTEGRATION.md`](plans/PI_TOOL_INTEGRATION.md) records integration direction.
- [`architecture/`](architecture/) — **OWNED** workspace-level navigation and boundary documentation.
- `dist/` or other material explicitly identified by its owning package as derived is **GENERATED**: regenerate it from canonical sources; do not make an independently authored fork.

The `harness/pi/` source owns portable Pi resources and accepted package declarations under the verified ownership model above. All 13 root `pi/` files and `scripts/install-pi` remain unchanged for legacy dotfiles `pi-resources`, old-link compatibility, fixtures and documented audit/recovery. Do not backport new resource edits into the frozen root tree or run legacy setup over accepted selective links. This Git repository, not any host filesystem, is canonical. Mini and Air intentionally share `/Volumes/DevDrive/Projects/agentic-engineering` as their active development working tree when available; coordinate nonoverlapping edits and one Git writer without branch resets/checkouts. Air's accepted local checkout remains its offline Pi resource owner, not a competing active workspace. Keep those links local; shared project work does not authorize a runtime relink. Reviewed versions may be promoted through ordinary, explicitly approved Git workflows. Mini's approved native handoff is applied; `../dotfiles/pi/` is now historical/reference material there, including its AIDD adaptation. Dotfiles owns machine prerequisites and thin resource bootstrap integration, not a second active Pi configuration. Both Macs' completed Pi migrations at accepted baseline `e9c0a625` are accepted by the operator; older Air preparation inventories are historical evidence, not current state. New deployment, source-layout handoffs and live ownership changes remain separately approval-gated; see `setup/MIGRATION.md`. Do not repeat the migrations or alter live installations without explicit authorization.

AIDD upstream is **UPSTREAM REFERENCE** material only. When needed, it is materialized and ignored at the dotfiles repository's `pi/upstreams/aidd/`; it is not vendored, a submodule, a runtime dependency, or a permanent component of this repository. The old standalone Projects checkout is historical/reference material and is not this workspace's `aidd/` directory.

## Scope and discovery

Start from this repository root. Inspect this tree and follow repository-local links. Do not recursively search the parent Projects directory or unrelated siblings.

Inspect `../dotfiles/pi/` only when a task explicitly concerns Pi integration, `aidd-pi`, or an upstream comparison. Preserve its operator configuration until an explicitly approved migration. Do not inspect the standalone AIDD checkout unless a migration task explicitly requires comparison with its historical state.

No nested repository or `.git` directory may be introduced beneath this workspace without explicit authorization. Preserve Git history, uncommitted work, generated/canonical distinctions, and migration evidence. Do not commit, push, or alter unrelated remotes without explicit authorization.

## Instruction precedence

1. This file governs workspace topology, ownership, and cross-repository boundaries.
2. A nested `AGENTS.md` governs its subtree; `workbench/AGENTS.md` is the Workbench tool contract.
3. The closest applicable instruction file wins for narrower scope, provided it does not weaken this workspace contract or an explicit user instruction.

Use repository-relative links for internal relationships. Keep external references identifiable as external; do not recast historical path evidence as current operational instructions.
