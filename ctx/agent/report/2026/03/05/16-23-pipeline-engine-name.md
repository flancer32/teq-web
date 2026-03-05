# Iteration Report — Pipeline Engine Naming

Date: 2026-03-05 16:23 (Europe/Riga)

## Goal

Bring `ctx/docs/` documentation into a consistent component naming scheme by replacing the legacy component name `Dispatcher` with the canonical name `Pipeline Engine`.

## Actions Performed

- Replaced product-level references to the coordination component with `Pipeline Engine`.
- Updated architecture-level constraints and overview to treat `Pipeline Engine` as the unique coordination locus.
- Updated code-level navigation documents to use `Pipeline Engine` terminology, including examples and keywords.
- Verified that `ctx/docs/` contains no remaining occurrences of `Dispatcher` / `dispatcher`.

## Artifacts Produced

- Updated files:
  - `ctx/docs/product/overview.md`
  - `ctx/docs/product/constraints.md`
  - `ctx/docs/architecture/overview.md`
  - `ctx/docs/architecture/constraints.md`
  - `ctx/docs/environment/overview.md`
  - `ctx/docs/code/components.md`
  - `ctx/docs/code/layouts/testing/unit.md`
  - `ctx/docs/code/layouts/package-json.md`

