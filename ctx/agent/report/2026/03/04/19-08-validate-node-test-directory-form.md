# Iteration Report

## Goal
Evaluate proposed script form (`node --test <directory>`) and apply it if better.

## Actions
- Applied proposed scripts in `package.json` and synchronized `ctx/docs/code/layouts/package-json.md`.
- Executed:
  - `npm run test:unit`
  - `npm run test:integration`
- Observed runtime behavior on Node `v24.11.0`:
  - `node --test test/unit` fails with `MODULE_NOT_FOUND` for `test/unit`.
  - `node --test test/accept` fails with `MODULE_NOT_FOUND` for `test/accept`.
- Reverted scripts and docs to working recursive discovery form based on `find ... | xargs ...`.
- Re-ran verification commands.

## Artifacts
- Modified: `package.json`
- Modified: `ctx/docs/code/layouts/package-json.md`
- Created: `ctx/agent/report/2026/03/04/19-08-validate-node-test-directory-form.md`

## Result
Proposed directory form is not compatible in this environment and was not kept.
Current working scripts remain:
- `test:unit`: `find test/unit -name '*.test.mjs' -print0 | xargs -0 node --test`
- `test:integration`: `find test/accept -name '*.test.mjs' -print0 | xargs -0 node --test`

Verification:
- unit tests: 12 passed;
- integration tests are discovered correctly but fail due to missing `express` dependency in test environment.
