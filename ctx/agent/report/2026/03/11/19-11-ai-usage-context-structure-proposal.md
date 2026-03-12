# AI Usage Context Structure Proposal

## Goal

Inspect the ADSM cognitive documentation relevant to package consumers and propose a compact `ai/` directory structure for agent-oriented usage context without modifying product files.

## Performed Actions

- Read the governing context documents: `AGENTS.md`, `ctx/AGENTS.md`, `ctx/docs/AGENTS.md`, `ctx/agent/AGENTS.md`, and `ctx/agent/report/AGENTS.md`.
- Reviewed consumer-relevant cognitive documentation in `ctx/docs/product/overview.md`, `ctx/docs/product/constraints.md`, `ctx/docs/architecture/overview.md`, `ctx/docs/architecture/constraints.md`, `ctx/docs/environment/overview.md`, `ctx/docs/environment/constraints.md`, and `ctx/docs/code/components.md`.
- Cross-checked the published package surface in `package.json`, `types.d.ts`, and selected modules under `src/Back/` to align the proposal with actual public abstractions exposed to consumers.
- Derived the consumer-facing usage model centered on `Fl32_Web_Back_PipelineEngine`, `Fl32_Web_Back_Server`, the handler contract, stage semantics, and static-file handler configuration.
- Prepared a compact proposed `ai/` structure intended to capture package purpose, abstractions, constraints, and a minimal usage path.

## Produced Artifacts

- Proposed `ai/` structure for user approval:
  - `ai/overview.md` — package purpose, dependency model, primary runtime role, and when to use the package.
  - `ai/abstractions.md` — core consumer-facing concepts: Pipeline Engine, Server, handler contract, request context, stages, and built-in static handler.
  - `ai/rules.md` — usage constraints that affect consumers: immutable handler set after startup, stage completion rules, response semantics, and environment assumptions.
  - `ai/examples/minimal-server.md` — smallest practical DI-based usage flow showing handler registration, pipeline locking through server start, and request handling.

## Outcome

No existing product files were modified. One iteration report was created. The next step is to wait for approval before generating files inside `ai/`.
