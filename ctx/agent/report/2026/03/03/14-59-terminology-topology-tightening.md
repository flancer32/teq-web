# Terminology and Environmental Topology Tightening

Goal
- Eliminate the undefined term “Architectural Instance” ambiguity at the architecture level without introducing new entities or changing product semantics.
- Stabilize “Server” terminology alignment between product and architecture levels without splitting or renaming the entity.
- Prohibit distributed multi-host topology at the environment level while keeping multi-process clustering on a single host allowed.

Performed Actions
- Added a formal structural definition of Architectural Instance in `ctx/docs/architecture/overview.md`.
- Clarified that the Transport Contour Server component is the architectural realization of the product-level Server entity in `ctx/docs/architecture/overview.md`.
- Clarified that Server is a conceptual product-level entity and that its architectural realization is defined at the architecture level in `ctx/docs/product/overview.md`.
- Removed multi-host allowance by declaring multi-host topology as an environmental reclassification in `ctx/docs/environment/overview.md`.
- Made single-host topology an explicit environmental invariant and prohibited distributed multi-host deployment topology in `ctx/docs/environment/constraints.md`.

Produced Artifacts
- Updated documents:
  - `ctx/docs/architecture/overview.md`
  - `ctx/docs/product/overview.md`
  - `ctx/docs/environment/overview.md`
  - `ctx/docs/environment/constraints.md`

Notes
- No changes were made to `ctx/docs/product/constraints.md` or `ctx/docs/architecture/constraints.md`.
- No level restructuring or new entities were introduced; changes are limited to definition tightening, cross-level term alignment, and environmental boundary narrowing.
