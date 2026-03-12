# Align AI Docs with TeqFW DI Style

## Goal

Revise the generated `ai/` usage context so that examples and guidance follow the TeqFW late-binding model with `@teqfw/di`, and add `ai/AGENTS.md` for agent navigation.

## Performed Actions

- Inspected the local agent interface of `node_modules/@teqfw/di/ai/`, including `AGENTS.md`, `concepts.md`, `container.md`, `dependency-id.md`, and `usage.md`, to align wording and examples with the established TeqFW DI style.
- Reworked `ai/examples/minimal-server.md` from a manually wired bootstrap script into a TeqFW-style example consisting of:
  - a DI-managed handler module with `__deps__`;
  - a DI-managed application service that receives `PipelineEngine`, `Server`, and the handler through constructor injection;
  - a minimal composition-root snippet that resolves a single application entry service.
- Updated `ai/overview.md` to make constructor injection and DI-managed orchestration the normal usage model and to avoid implying standalone manual wiring as the preferred path.
- Added `ai/AGENTS.md` to define the purpose, TeqFW usage model, reading order, and interface scope of the `ai/` directory.

## Produced Artifacts

- `ai/AGENTS.md` — navigation and scope document for the package agent interface.
- Updated `ai/overview.md` — clarified TeqFW-native dependency usage.
- Updated `ai/examples/minimal-server.md` — replaced manual container bootstrap style with constructor-injected TeqFW-style orchestration.

## Outcome

The `ai/` directory now presents the package in the same late-binding idiom used by `@teqfw/di`. The consumer example no longer promotes manual container setup inside feature code and instead shows the package as infrastructure resolved and orchestrated through TeqFW application modules.
