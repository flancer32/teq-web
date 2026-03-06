# Iteration Report

## Goal

Refactor integration tests so they no longer depend on `test/unit/common.mjs` and instead assemble the DI container explicitly inside each scenario.

## Actions

- Inspected project context documents for testing and reporting rules.
- Reviewed `test/unit/common.mjs` to extract the minimal DI container setup previously reused by integration tests.
- Updated `test/integration/PipelineEngine.test.mjs` to instantiate `@teqfw/di` container inside each `test(...)` case, add the namespace root, and enable test mode directly in the scenario.
- Updated `test/integration/Server.test.mjs` with the same explicit per-scenario container assembly model.
- Verified integration behavior with `npm run test:integration`.

## Artifacts

- `test/integration/PipelineEngine.test.mjs`
- `test/integration/Server.test.mjs`
- `ctx/agent/report/2026/03/06/08-12-inline-container-setup-in-integration-tests.md`

## Result

Integration tests no longer rely on the unit-test helper file and now expose container construction steps directly in each runtime scenario. `npm run test:integration` passes successfully.
