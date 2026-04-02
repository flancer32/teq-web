# TeqFW Composition Specifications

- Path: `ctx/spec/code/platform/teqfw/composition/AGENTS.md`
- Version: `20260401`

## Purpose

This level defines how TeqFW applications are assembled, configured, and started at runtime.

## Level Map

- `bootstrap/` — process entry and startup execution modes for TeqFW applications.
- `configuration/` — detailed runtime and static configuration component conventions.
- `di/` — dependency injection usage rules for runtime composition.
- `AGENTS.md` — level definition for TeqFW composition specifications.
- `configuration.md` — high-level configuration model for package-owned configuration trees.

## Reading Order

1. `AGENTS.md`
2. `configuration.md`
3. `di/`
4. `configuration/`
5. `bootstrap/`

## Level Boundary

This level defines runtime composition mechanisms, including dependency injection, configuration propagation, and bootstrap entry flow.

This level does NOT define component identity rules or code publication forms. Those concerns belong to sibling levels under `addressing/` and `coding/`.
