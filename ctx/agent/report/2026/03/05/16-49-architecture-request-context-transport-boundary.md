# Report — Architecture: Request Context & Transport Boundary

Date: 2026-03-05 16:49 (Europe/Riga)

## Goal

Introduce two architecture-level clarifications to eliminate ambiguity for deterministic code generation:

1. Define Request Context ownership and lifecycle.
2. Clarify the boundary between handlers and transport operations.

## Actions Performed

- Updated the architecture overview to define Request Context as request-scoped, Pipeline-Engine-owned, and non-replaceable by handlers.
- Updated the architecture constraints to prohibit transport-level operations in handlers and to assign network transmission exclusively to the Server component after pipeline completion.

## Produced Artifacts

- `ctx/docs/architecture/overview.md` — added the **Request Context** subsection.
- `ctx/docs/architecture/constraints.md` — added the handler/transport responsibility constraint.

