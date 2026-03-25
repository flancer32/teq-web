# Test Failure Report

Path: `ctx/agent/report/2026/03/25/17-52-test-failures-cdc-compatibility.md`

## Goal

Run the test suite after the latest updates and determine the cause of the reported failures.

## Performed Actions

- Reviewed the active ADSM instructions from `AGENTS.md` and the relevant `ctx/` levels.
- Ran `npm test` to reproduce the failures.
- Inspected the failing integration tests and the dependency parser in `@teqfw/di`.
- Checked the project source for dependency CDC strings that are no longer accepted by the updated parser.

## Findings

- All 5 failing integration tests fail before reaching their assertions.
- The common error is `CDC must satisfy AsciiCdcIdentifier.`
- The updated `@teqfw/di` parser rejects CDC values containing `:` and currently still expects the older ASCII-only form.
- The project source declares built-in Node dependencies with `node:` CDCs in modules such as `src/Back/Server.mjs` and `src/Back/Handler/Static/A/FileService.mjs`.
- This mismatch prevents the container from resolving `Fl32_Web_Back_Server$` and related dependencies, which in turn breaks the integration tests for `PipelineEngine`, `Server`, and `Es6ModulesConvention`.

## Produced Artifacts

- `ctx/agent/report/2026/03/25/17-52-test-failures-cdc-compatibility.md`

## Test Results

- Unit tests: passed (`55` passed, `0` failed).
- Integration tests: failed (`1` passed, `5` failed).

