# Iteration Report

## Goal

Remove the static import introduced into `src/Back/PipelineEngine.mjs` and align the new request-context dependency model with TeqFW DI conventions and updated tests.

## Actions

- Removed the static import from `src/Back/PipelineEngine.mjs`.
- Reworked request-context creation to use a DI-managed factory dependency instead of a directly imported constructor.
- Added `Factory` export to `src/Back/Dto/RequestContext.mjs`.
- Added `Fl32_Web_Back_Dto_RequestContext$Factory` to `types.d.ts`.
- Updated `PipelineEngine` dependency descriptor to use `Fl32_Web_Back_Dto_RequestContext__Factory$`.
- Updated unit tests for `PipelineEngine` to pass the explicit DTO factory according to the changed constructor signature.
- Verified that container-based integration scenarios work with the DI factory resolution.

## Artifacts

- `src/Back/PipelineEngine.mjs`
- `src/Back/Dto/RequestContext.mjs`
- `types.d.ts`
- `test/unit/Back/PipelineEngine.test.mjs`

## Verification

- Ran `npm test`.
- Unit tests: passed.
- Integration tests: passed.
