# TeqFW Addressing Specifications

- Path: `ctx/spec/code/platform/teqfw/addressing/AGENTS.md`
- Version: `20260401`

## Purpose

This level defines addressing rules used to identify TeqFW components across runtime composition and static analysis.

## Level Map

- `AGENTS.md` — level definition for TeqFW addressing specifications.
- `namespaces.md` — canonical namespace identifiers used as component addresses.
- `types-map.md` — mapping between namespace identifiers, static type aliases, and implementation modules.

## Reading Order

1. `AGENTS.md`
2. `namespaces.md`
3. `types-map.md`

## Level Boundary

This level defines component identity and addressing translation rules.

This level does NOT define module structure, dependency lifecycle, or configuration behavior. Those concerns belong to sibling levels under `coding/` and `composition/`.
