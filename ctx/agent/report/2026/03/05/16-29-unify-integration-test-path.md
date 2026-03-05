# Unify integration test path in docs and repo

Goal: unify integration test path across documentation and repository structure by using `test/integration/` instead of `test/accept/`.

## Actions

- Updated npm integration test script to discover tests under `test/integration/`.
- Updated documentation fragments referencing the integration test directory and `test:integration` script.
- Renamed directory `test/accept/` to `test/integration/`.

## Artifacts

- Updated: `package.json`
- Updated: `ctx/docs/code/layouts/package-json.md`
- Moved: `test/accept/` → `test/integration/`

## Result

Documentation and repository structure now consistently use `test/integration/` as the integration test location.
