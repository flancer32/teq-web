# Iteration Report

## Goal
Analyze failures in `test/unit/Back/Dispatcher.test.mjs` and verify whether mock isolation in unit tests is insufficient.

## Actions
- Read project/testing instructions in `AGENTS.md`, `ctx/AGENTS.md`, `ctx/agent/AGENTS.md`, and `test/unit/AGENTS.md`.
- Executed failing tests:
  - `npm test -- test/unit/Back/Dispatcher.test.mjs`
  - `node --test test/unit/Back/Dispatcher.test.mjs`
  - `node test/unit/Back/Dispatcher.test.mjs`
  - `node test/unit/Back/Server.test.mjs`
  - `node test/unit/Back/Handler/Pre/Log.test.mjs`
- Confirmed runtime behavior: despite `container.register(...)`, real `Logger`/`Respond`/`http` implementations are used.
- Inspected container internals in `node_modules/@teqfw/di/src/Container.mjs` and README.

## Artifacts
- Created this report: `ctx/agent/report/2026/03/04/18-18-dispatcher-mock-analysis.md`.

## Result
Root cause is not only mock completeness, but DI behavior in `@teqfw/di@2.0.0`: `register(cdc, mock)` is applied at root `container.get(cdc)` lookup and is not used to replace transitive dependencies during graph resolution. Therefore tests that expect nested dependency overrides via `container.register('Fl32_Web_Back_Logger$', ...)` are not isolated as intended.
