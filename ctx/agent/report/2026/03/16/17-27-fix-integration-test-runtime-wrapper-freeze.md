# Fix integration test for runtime wrapper freeze semantics

## Goal
Adjust failing integration test to match current runtime configuration contract where internal data is frozen while the external proxy wrapper remains non-freezable.

## Actions
- Reproduced failure with `npm test` and identified failing assertion in `test/integration/Es6ModulesConvention.test.mjs`.
- Confirmed current implementation in `src/Back/Config/Runtime.mjs` freezes internal config data (`cfg`) and intentionally keeps proxy wrapper non-freezable.
- Updated failing assertion:
  - removed `Object.isFrozen(runtimeConfigFactory.freeze()) === true` expectation;
  - added immutability behavior check by asserting write attempt to frozen runtime wrapper throws `Runtime configuration is immutable.`.
- Re-ran full test suite with `npm test`.

## Artifacts
- `test/integration/Es6ModulesConvention.test.mjs` (updated assertion)
- `ctx/agent/report/2026/03/16/17-27-fix-integration-test-runtime-wrapper-freeze.md`

## Result
- Unit tests: passed
- Integration tests: passed
- Total suite status: green
