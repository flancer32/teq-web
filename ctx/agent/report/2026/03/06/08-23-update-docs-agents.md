# Update `ctx/docs` AGENTS hierarchy

Path: `./ctx/agent/report/2026/03/06/08-23-update-docs-agents.md`

## Goal

Update all `AGENTS.md` files under `ctx/docs/` and its subdirectories so that each required level contains a concise level description and an актуальная `Level Map` aligned with the current documentation tree.

## Actions

- Read the governing instructions from the project root `AGENTS.md`, `ctx/AGENTS.md`, `ctx/agent/AGENTS.md`, and `ctx/agent/report/AGENTS.md`.
- Read the existing `AGENTS.md` files in `ctx/docs/` and `ctx/docs/architecture/`.
- Collected the current directory and file structure of `ctx/docs/` to determine which levels require `AGENTS.md`.
- Read the documents in `ctx/docs/architecture/`, `ctx/docs/code/`, `ctx/docs/environment/`, and `ctx/docs/product/` to describe each level map with concrete declarative purposes.
- Rewrote `ctx/docs/architecture/AGENTS.md` to reflect the actual files of the architectural level and to align its format with current context rules.
- Added missing `AGENTS.md` files for `ctx/docs/code/`, `ctx/docs/code/conventions/`, `ctx/docs/code/layouts/`, `ctx/docs/code/layouts/files/`, and `ctx/docs/code/layouts/testing/`.
- Updated `ctx/docs/AGENTS.md` so its `Level Map` reflects the current root-level structure including the non-context `output.md` artifact.

## Artifacts

- Updated `./ctx/docs/AGENTS.md`
- Updated `./ctx/docs/architecture/AGENTS.md`
- Added `./ctx/docs/code/AGENTS.md`
- Added `./ctx/docs/code/conventions/AGENTS.md`
- Added `./ctx/docs/code/layouts/AGENTS.md`
- Added `./ctx/docs/code/layouts/files/AGENTS.md`
- Added `./ctx/docs/code/layouts/testing/AGENTS.md`

## Result

The `ctx/docs/` branch now contains `AGENTS.md` files at all required intermediate levels with concise purpose statements and `Level Map` sections synchronized with the current directory structure.
