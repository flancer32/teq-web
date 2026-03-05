# Align Documentation With Implementation

## Goal

Review additional in-worktree changes under `ctx/docs` and ensure documentation is internally consistent and matches the current implementation model.

## Actions

- Re-aligned product and architecture documents with the actual runtime model implemented in `src/Back/Dispatcher.mjs`:
- Central coordination entity is `Dispatcher` (not `Pipeline Engine`).
- Handler execution stages are `pre`, `process`, `post` (not `INIT/PROCESS/FINALIZE`).
- Removed references to entities that do not exist in the current implementation model (`Handler Registry`, `Request Context`, `Processing Result`, `Processing Error`) from product/architecture/environment docs.
- Cleaned up `ctx/docs/environment/overview.md` to reflect the corrected system boundary and system-vs-environment entity split.
- Re-checked `ctx/docs` for leftover references to the deleted `composition` documentation level and for removed terms.

## Artifacts (Modified Files)

- ctx/docs/architecture/constraints.md
- ctx/docs/architecture/overview.md
- ctx/docs/environment/overview.md
- ctx/docs/product/constraints.md
- ctx/docs/product/overview.md

## Result

Documentation in `ctx/docs` no longer implies a `composition` documentation level and no longer introduces a conflicting `Pipeline Engine`/`INIT/FINALIZE` model; the product and architecture descriptions match the dispatcher-centered three-stage pipeline implemented in code.
