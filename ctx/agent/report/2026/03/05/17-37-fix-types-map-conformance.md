# Report — Fix Types Map Conformance

Date: 2026-03-05 17:37 (Europe/Riga)

## Goal

Bring `types.d.ts` into conformance with `ctx/docs/code/conventions/types-map.md`.

## Actions Performed

- Removed duplicated namespace mappings from the `INTERNAL TYPE BINDINGS` section in `types.d.ts`.
- Kept namespace mappings in `PUBLIC GLOBAL API` as global declarations.
- Revalidated conformance invariants:
  - no duplicated namespace identifiers across sections,
  - deterministic section layout,
  - alphabetical ordering in public section,
  - all referenced `import()` files exist.

## Produced Artifacts

- `types.d.ts` — updated to eliminate duplicate namespace declarations across sections.
- `ctx/agent/report/2026/03/05/17-37-fix-types-map-conformance.md` — this iteration report.
