# Agentic Engineering workspace contract

This repository is the bounded orchestration workspace for Agentic Engineering and the portable **workbench tool**. Its GitHub identity is `alexortiz201/agentic-engineering`.

## Topology and ownership

- [`workbench/`](workbench/) — **OWNED** portable Workbench tool: doctrine, contracts, canonical authored resources, templates, and harness descriptions. It is not a runtime/controller. Its [`AGENTS.md`](workbench/AGENTS.md) is authoritative for all work beneath that directory.
- `workbench/.profile/`, `.memory/`, and `.workgroup/` — **LOCAL WORKBENCH OVERLAYS/STATE**. Their contents are ignored, environment-specific, and never canonical portable source. Their sanitized tracked contracts are under `workbench/templates/layout/`; preserve their distinct semantics rather than treating them as one store.
- [`plans/`](plans/) — **OWNED** workspace plans. [`MIGRATE_AIDD_PLAN.md`](plans/MIGRATE_AIDD_PLAN.md) preserves the active `CORRECTION REQUIRED` checkpoint; reorganization does not resolve its migration gates. [`PI_TOOL_INTEGRATION.md`](plans/PI_TOOL_INTEGRATION.md) records integration direction.
- [`architecture/`](architecture/) — **OWNED** workspace-level navigation and boundary documentation.
- `dist/` or other material explicitly identified by its owning package as derived is **GENERATED**: regenerate it from canonical sources; do not make an independently authored fork.

The external sibling repository `../dotfiles/pi/` is **EXTERNAL OPERATOR CONFIGURATION**. It owns the Pi profile and the owned Pi/Claude AIDD adaptation at `pi/packages/aidd-pi/`. It is not part of this repository and must not be moved here.

AIDD upstream is **UPSTREAM REFERENCE** material only. When needed, it is materialized and ignored at the dotfiles repository's `pi/upstreams/aidd/`; it is not vendored, a submodule, a runtime dependency, or a permanent component of this repository. The old standalone Projects checkout is historical/reference material and is not this workspace's `aidd/` directory.

## Scope and discovery

Start from this repository root. Inspect this tree and follow repository-local links. Do not recursively search the parent Projects directory or unrelated siblings.

Inspect `../dotfiles/pi/` only when a task explicitly concerns Pi integration, `aidd-pi`, or an upstream comparison. Do not move, vendor, or rewrite its operator configuration. Do not inspect the standalone AIDD checkout unless a migration task explicitly requires comparison with its historical state.

No nested repository or `.git` directory may be introduced beneath this workspace without explicit authorization. Preserve Git history, uncommitted work, generated/canonical distinctions, and migration evidence. Do not commit, push, or alter unrelated remotes without explicit authorization.

## Instruction precedence

1. This file governs workspace topology, ownership, and cross-repository boundaries.
2. A nested `AGENTS.md` governs its subtree; `workbench/AGENTS.md` is the Workbench tool contract.
3. The closest applicable instruction file wins for narrower scope, provided it does not weaken this workspace contract or an explicit user instruction.

Use repository-relative links for internal relationships. Keep external references identifiable as external; do not recast historical path evidence as current operational instructions.
