# Generate AI Usage Context

## Goal

Create a compact `ai/` directory for LLM agents that consume `@flancer32/teq-web` as a dependency, using the cognitive documentation as the source and limiting changes to `ai/`.

## Performed Actions

- Used the previously reviewed cognitive documentation in `ctx/docs/` as the normative source for package purpose, abstractions, constraints, and usage semantics.
- Cross-checked the consumer-visible package surface in `package.json`, `types.d.ts`, and selected `src/Back/` modules to ensure the generated usage context referenced actual DI entry points and runtime abstractions.
- Created the approved `ai/` structure and wrote compact consumer-oriented documents:
  - `ai/overview.md`
  - `ai/abstractions.md`
  - `ai/rules.md`
  - `ai/examples/minimal-server.md`
- Kept the generated content focused on dependency usage and avoided duplicating the full cognitive context.

## Produced Artifacts

- `ai/overview.md` — package role, ecosystem boundary, and primary consumer entry points.
- `ai/abstractions.md` — Pipeline Engine, Server, handler contract, request context, stage model, and built-in static handler.
- `ai/rules.md` — consumer-relevant invariants covering registration timing, completion semantics, response semantics, transport boundary, environment assumptions, and DI usage.
- `ai/examples/minimal-server.md` — minimal DI-based example for registering a handler and starting the built-in server.

## Outcome

The repository now contains a compact `ai/` projection of the cognitive context for package consumers. No existing files outside `ai/` were modified; only the mandatory iteration report was added under `ctx/agent/report/`.
