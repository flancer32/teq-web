# TeqFW Configuration Conventions

- Path: `ctx/spec/code/platform/teqfw/composition/configuration/AGENTS.md`
- Version: `20260401`

## Purpose

This directory contains detailed conventions for TeqFW configuration component forms. This level refines the high-level configuration model from `ctx/spec/code/platform/teqfw/composition/configuration.md` into concrete static and runtime component contracts.

## Level Map

- `AGENTS.md` — this document, defining boundaries and navigation for the `configuration/` convention level.
- `runtime.md` — runtime configuration convention: distributed initialization, factory lifecycle, freeze semantics, and read-only proxy access.
- `static.md` — static configuration convention: immutable container-managed constants and dependency declaration form.

The list above is alphabetical and serves navigation purposes.

## Reading Order

1. `ctx/spec/code/platform/teqfw/composition/configuration.md` — defines the high-level package-centered configuration model.
2. `static.md` — defines conventions for static configuration component form.
3. `runtime.md` — defines conventions for runtime configuration component form and initialization lifecycle.

## Level Boundary

This level defines only detailed conventions for configuration component structure and lifecycle. It must not redefine broader TeqFW namespace conventions, general ES module conventions, or repository-level policies.
