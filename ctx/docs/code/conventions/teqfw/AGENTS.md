# TeqFW Conventions (`./ctx/docs/code/conventions/teqfw/`)

Path: `./ctx/docs/code/conventions/teqfw/AGENTS.md`

## Purpose

The `ctx/docs/code/conventions/teqfw/` directory contains declarative engineering conventions specific to TeqFW module structure and static typing aids. Documents at this level define stable implementation forms used by TeqFW packages without redefining broader code-level boundaries.

## Level Map

- `AGENTS.md` — this document, defining the boundaries and structure of the `teqfw/` convention level.
- `es6-modules.md` — normative structural convention for TeqFW DI-compatible ES modules managed by the dependency container.
- `types-map.md` — convention for TeqFW type maps that connect namespace identifiers to static type declarations.

## Level Boundary

This level defines TeqFW-specific implementation conventions only. It may refine module form and static type mapping, but it must not redefine repository topology, product semantics, runtime environment, or agent procedures.

## Summary

`ctx/docs/code/conventions/teqfw/AGENTS.md` defines the scope and navigation of TeqFW-specific code conventions.
