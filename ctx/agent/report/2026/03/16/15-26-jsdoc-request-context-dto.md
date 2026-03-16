# Iteration Report

## Goal

Adapt `src/` JSDoc annotations to the new TeqFW JSDoc specification and introduce a dedicated runtime DTO for request context where a reusable cross-module structural contract exists.

## Actions

- Reviewed the governing context documents under `ctx/` and the new specification in `ctx/docs/code/convention/teqfw/jsdoc.md`.
- Audited JSDoc usage in `src/` for prohibited `@typedef`, `import(...)`, and `module:` type references.
- Added the runtime DTO `src/Back/Dto/RequestContext.mjs` and exposed it through `types.d.ts` as `Fl32_Web_Back_Dto_RequestContext`.
- Updated `src/Back/PipelineEngine.mjs` to use the dedicated request-context DTO while preserving compatibility with both direct construction and DI/container resolution.
- Replaced local constructor `@typedef` declarations in DI-managed modules with inline structured `@param {object}` annotations.
- Replaced JSDoc references to Node runtime types with namespace-backed aliases defined in `types.d.ts`.
- Added namespace aliases in `types.d.ts` for reusable structural shapes and Node runtime types used by JSDoc.
- Updated handler and helper annotations to reference `Fl32_Web_Back_Dto_RequestContext` and other namespace types.

## Artifacts

- `src/Back/Dto/RequestContext.mjs`
- `src/Back/PipelineEngine.mjs`
- `src/Back/Api/Handler.mjs`
- `src/Back/Handler/Pre/Log.mjs`
- `src/Back/Handler/Static.mjs`
- `src/Back/Helper/Respond.mjs`
- `src/Back/Server.mjs`
- `src/Back/Dto/Info.mjs`
- `src/Back/Dto/Source.mjs`
- `src/Back/Config/Runtime.mjs`
- `src/Back/Config/Runtime/Tls.mjs`
- `src/Back/Handler/Static/A/Config.mjs`
- `src/Back/Handler/Static/A/Fallback.mjs`
- `src/Back/Handler/Static/A/FileService.mjs`
- `src/Back/Handler/Static/A/Registry.mjs`
- `src/Back/Handler/Static/A/Resolver.mjs`
- `types.d.ts`

## Verification

- Ran `npm test`.
- Unit tests: passed.
- Integration tests: passed.
