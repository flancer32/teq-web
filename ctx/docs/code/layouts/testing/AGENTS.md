# Testing Layout Details (`./ctx/docs/code/layouts/testing/`)

Path: `./ctx/docs/code/layouts/testing/AGENTS.md`

## Purpose

The `ctx/docs/code/layouts/testing/` directory contains declarative contracts for concrete testing layers defined by the parent testing layout document. Documents at this level specify the placement and verification boundary of each mandatory testing layer.

## Level Map

- `AGENTS.md` — this document, defining the boundaries and structure of the `testing/` level.
- `integration.md` — contract for integration tests that verify observable runtime behavior under composed execution.
- `unit.md` — contract for unit tests that verify isolated module-level implementation contracts.

## Level Boundary

This level defines concrete testing-layer contracts only. It must not redefine the repository layout as a whole, architectural semantics, product meaning, or agent workflows.

## Summary

`ctx/docs/code/layouts/testing/AGENTS.md` defines the navigation and scope of detailed testing-layer documentation.
