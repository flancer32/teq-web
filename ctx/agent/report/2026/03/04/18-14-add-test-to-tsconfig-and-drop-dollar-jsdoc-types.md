# Add test to TS project and remove `$` from JSDoc type names

## Goal
Apply requested migration: include `test/` into TypeScript project scope and remove `$` suffixes from JSDoc type descriptions as an outdated convention.

## Actions
- Updated `tsconfig.json` to include `test` directory in TS project `include` list.
- Performed bulk JSDoc normalization in `src/**/*.mjs` and `test/**/*.mjs`:
  - Removed `$` suffix from type references inside JSDoc tags (`@type`, `@param`, `@returns`, `@typedef`, `@property`, `@implements`, `@memberOf`, `@see`).
  - Kept DI string identifiers unchanged (e.g. `container.get('...$')`, `DI` maps), because they are runtime keys, not type annotations.
- Verified no JSDoc tags with `$`-suffixed type names remain under `src/` and `test/`.

## Validation
- Attempted `npx tsc --noEmit --pretty false`; execution failed due offline registry lookup (`EAI_AGAIN`), so compiler validation could not be completed in this environment.

## Artifacts
- `tsconfig.json`
- Multiple `.mjs` files in `src/` and `test/` with normalized JSDoc type names.
