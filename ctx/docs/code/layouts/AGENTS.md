# Code Layouts (`./ctx/docs/code/layouts/`)

Path: `./ctx/docs/code/layouts/AGENTS.md`

## Purpose

The `ctx/docs/code/layouts/` directory contains declarative descriptions of structural layouts for repository artifacts, source-tree organization, and testing directories. Documents at this level define where implementation artifacts belong and how structural files are organized.

## Level Map

- `files/` — detailed layout rules for repository directories and source-tree structure.
- `testing/` — detailed layout rules for testing layers and their placement.
- `AGENTS.md` — this document, defining the boundaries and structure of the `layouts/` level.
- `files.md` — canonical repository-level file and directory layout for TeqFW packages.
- `jsconfig.md` — canonical structure of `jsconfig.json` used for JavaScript static analysis.
- `package-json.md` — canonical structure and invariants of the package manifest.
- `testing.md` — top-level model of mandatory testing layers and their separation.

## Level Boundary

This level defines structural layouts of code artifacts only. It must not define component responsibilities, runtime behavior, agent procedures, or semantic constraints outside repository and file organization.

## Summary

`ctx/docs/code/layouts/AGENTS.md` defines the scope and navigation of structural layout documentation for code artifacts.
