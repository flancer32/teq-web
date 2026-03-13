# Transient Components Combined Modules

Path: `./ctx/agent/report/2026/03/13/07-50-transient-components-combined-modules.md`

## Goal

Rewrite transient component modules so that each DTO and its factory are published from the same ES module in the style described by section 6 of `ctx/docs/code/conventions/teqfw/component-types.md`.

## Actions

- Merged DTO structure and factory back into the same ES module for:
  - `src/Back/Dto/Handler/Info.mjs`
  - `src/Back/Dto/Handler/Source.mjs`
  - `src/Back/Server/Config.mjs`
  - `src/Back/Server/Config/Tls.mjs`
- Removed the temporary dedicated factory modules created in the previous refactoring step.
- Restored consumer dependencies to use named-export CDC addresses such as `Fl32_Web_Back_Dto_Handler_Info__Factory$`.
- Kept DTOs as `default` exports and `Factory` as named exports in each combined module.
- Preserved runtime compatibility with the current `@teqfw/di` implementation by using flat string-based `__deps__` descriptors instead of nested per-export descriptors.
- Updated `types.d.ts`, unit tests, integration tests, and dev bootstrap to the combined-module form.

## Results

- Transient components now follow the requested combined publication style: `default` export is the DTO structure, and `Factory` is a named export in the same ES module.
- DTO instances remain immutable because each factory returns `Object.freeze(...)`.
- Container-managed resolution of `__Factory$` named exports continues to work with the current dependency container implementation.
- Full automated verification passed with `npm test`.

## Artifacts

- Updated transient component modules:
  - `src/Back/Dto/Handler/Info.mjs`
  - `src/Back/Dto/Handler/Source.mjs`
  - `src/Back/Server/Config.mjs`
  - `src/Back/Server/Config/Tls.mjs`
- New report: `ctx/agent/report/2026/03/13/07-50-transient-components-combined-modules.md`
