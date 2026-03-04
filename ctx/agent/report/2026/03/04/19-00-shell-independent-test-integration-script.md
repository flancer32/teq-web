# Iteration Report

## Goal
Apply shell-independent recursive test discovery for integration tests and align package layout documentation.

## Actions
- Updated `package.json` integration script:
  - from: `node --test test/integration`
  - to: `find test/accept -name '*.test.mjs' -print0 | xargs -0 node --test`
- Updated `ctx/docs/code/layouts/package-json.md`:
  - changed test environment path from `./test/integration` to `./test/accept`;
  - added `Integration Test Script Contract` with required shell-independent script form;
  - updated canonical `scripts` JSON example.
- Executed `npm run test:integration`.

## Artifacts
- Modified: `package.json`
- Modified: `ctx/docs/code/layouts/package-json.md`
- Created: `ctx/agent/report/2026/03/04/19-00-shell-independent-test-integration-script.md`

## Result
Integration script now discovers tests recursively without depending on shell globstar behavior and uses the actual integration test directory (`test/accept`).

Current integration test run fails due to environment dependency issues:
- missing package `express` for `test/accept/ExternalServer.test.mjs`.
