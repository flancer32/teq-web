# Architecture Documentation (`./ctx/docs/architecture/`)

Path: `./ctx/docs/architecture/AGENTS.md`

## Purpose

The `ctx/docs/architecture/` directory contains declarative documentation of the system's architectural form. Documents at this level define structural units, responsibility boundaries, execution structure, and architectural constraints derived from the product level without introducing implementation rules.

## Level Map

- `AGENTS.md` — this document, defining the boundaries and structure of the `architecture/` level.
- `constraints.md` — immutable architectural constraints that protect the declared structural form from invalid transformations.
- `overview.md` — architectural overview defining the system contours, coordination center, execution phases, and structural data entities.

## Level Boundary

This level defines architecture only. It may refine the product level into structural form, but it must not define runtime environment conditions, source-code conventions, repository layout, or agent procedures.

## Summary

`ctx/docs/architecture/AGENTS.md` defines the scope and navigation of the architectural documentation level.
