# Iteration Report

## Goal
Align runtime-config components with updated specification `ctx/docs/code/component/config/runtime.md`, flatten server runtime configuration to top-level fields (`cfg.port`, no `cfg.server.port`), and update related tests and component initialization.

## Performed Actions
- Refactored runtime config component in `src/Back/Config/Runtime.mjs`:
  - removed nested `server` subtree usage;
  - switched to top-level runtime fields: `port`, `type`, `tls`;
  - updated `Factory.configure` to accept flat params (`{port, type, tls}`);
  - kept first-write-wins behavior and freeze lifecycle.
- Updated server runtime consumption in `src/Back/Server.mjs`:
  - switched reads from `config.server.*` to `config.*`.
- Updated runtime types in `types.d.ts`:
  - removed `Fl32_Web_Back_Config_Runtime_Server` alias;
  - changed `Fl32_Web_Back_Config_Runtime_Params` to flat shape.
- Updated component initialization for dev bootstrap in `test/dev/bootstrap.mjs`:
  - switched runtime configure call to `{port: PORT}`.
- Updated tests to match flat runtime model:
  - `test/unit/Back/Config/Runtime.test.mjs`;
  - `test/unit/Back/Config/Runtime/Tls.test.mjs`;
  - `test/unit/Back/Server.test.mjs`;
  - `test/integration/Es6ModulesConvention.test.mjs`.
- Ran full test suite subsets:
  - `npm run test:unit`;
  - `npm run test:integration`.

## Produced Artifacts
- Updated source files:
  - `src/Back/Config/Runtime.mjs`
  - `src/Back/Config/Runtime/Tls.mjs`
  - `src/Back/Server.mjs`
  - `types.d.ts`
  - `test/dev/bootstrap.mjs`
  - `test/unit/Back/Config/Runtime.test.mjs`
  - `test/unit/Back/Config/Runtime/Tls.test.mjs`
  - `test/unit/Back/Server.test.mjs`
  - `test/integration/Es6ModulesConvention.test.mjs`
- New report file:
  - `ctx/agent/report/2026/03/17/07-51-runtime-config-flat-port.md`

## Validation Result
- Unit tests: pass (`21/21`).
- Integration tests: pass (`6/6`).
