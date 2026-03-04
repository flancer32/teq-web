# Iteration Report

## Goal
Implement test container factory changes in `test/unit/common.mjs` so each unit test can use a freshly created DI container instance.

## Actions
- Reviewed current `test/unit/common.mjs` and `@teqfw/di` typing/API.
- Updated `test/unit/common.mjs`:
  - Added `createTestContainer()` as async factory returning a brand-new configured container.
  - Kept `buildTestContainer()` as backward-compatible alias to avoid breaking existing tests.
- Ran targeted tests:
  - `node --test test/unit/Back/Dispatcher.test.mjs`
  - `node --test test/unit/Back/Handler/Pre/Log.test.mjs`

## Artifacts
- Modified file: `test/unit/common.mjs`.
- Created report: `ctx/agent/report/2026/03/04/18-24-test-container-factory-in-common.md`.

## Result
A dedicated async factory for fresh unit-test containers is now available and existing tests remain compatible via alias. Test failures persist because the root cause is not container reuse, but DI v2 mock behavior for transitive dependencies.
