# Code Documentation (`./ctx/docs/code/`)

Path: `./ctx/docs/code/AGENTS.md`

## Purpose

The `ctx/docs/code/` directory contains declarative engineering documentation that binds architectural form to concrete repository structure, source-module conventions, and implementation-facing reference materials. This level defines how the system is represented in code without redefining product, architecture, or environment semantics.

## Level Map

- `components/` — reserved branch for component-specific code documentation when dedicated component documents are split into separate files.
- `conventions/` — engineering conventions for module form, typing, and other cross-cutting implementation rules.
- `layouts/` — structural documentation for repository files, source-tree layout, and testing layout.
- `AGENTS.md` — this document, defining the boundaries and structure of the `code/` level.
- `components.md` — overview of concrete implementation components and their mapping to source modules.

## Level Boundary

This level defines engineering representation only. It may name concrete modules, files, and directories, but it must not redefine architectural structure, product semantics, runtime environment, or agent workflows.

## Summary

`ctx/docs/code/AGENTS.md` defines the scope and navigation of implementation-level documentation in `ctx/docs/code/`.
