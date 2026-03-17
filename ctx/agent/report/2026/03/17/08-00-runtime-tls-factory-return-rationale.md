# Iteration Report

## Goal
Clarify whether returning a value from `Fl32_Web_Back_Config_Runtime_Tls` factory contradicts the runtime-config specification, and verify if the return can be removed while keeping DI-only links between runtime config components.

## Performed Actions
- Inspected current implementation of:
  - `src/Back/Config/Runtime/Tls.mjs`
  - `src/Back/Config/Runtime.mjs`
- Implemented and tested a strict-spec attempt:
  - removed return value from `Tls.Factory.freeze()`;
  - linked runtime to TLS through DI injection (`tlsData` + `tlsFactory`) instead of `tlsFactory.freeze()` return;
  - adapted unit tests accordingly.
- Ran test suite and analyzed failures.
- Verified that the strict-spec attempt causes integration failures in current DI setup (misbinding/usage issues around simultaneous `Tls$` and `Tls__Factory$` in Runtime factory dependencies).
- Restored stable runtime-config implementation:
  - `Tls.Factory.freeze()` returns TLS proxy;
  - Runtime obtains and stores TLS node via `tlsFactory.freeze()` return.
- Re-ran tests on restored state.

## Result
- Specification interpretation: yes, factory return value conflicts with updated runtime-config spec.
- Practical status in this codebase: current DI/container behavior prevents a clean migration to strict DI-only wiring for TLS node without additional DI-level refactoring.
- Working implementation remains with return from `Tls.Factory.freeze()` as a compatibility workaround.

## Validation
- `npm run test:unit` — pass (21/21)
- `npm run test:integration` — pass (6/6)

## Artifacts
- Updated and then stabilized files:
  - `src/Back/Config/Runtime.mjs`
  - `src/Back/Config/Runtime/Tls.mjs`
  - `test/unit/Back/Config/Runtime.test.mjs`
  - `test/unit/Back/Config/Runtime/Tls.test.mjs`
- New report:
  - `ctx/agent/report/2026/03/17/08-00-runtime-tls-factory-return-rationale.md`
