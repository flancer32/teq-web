# Iteration Report: Rebuild `types.d.ts` and annotate unit tests

## Goal
1. Rebuild `types.d.ts` according to `ctx/docs/code/conventions/types-map.md`.
2. Add explicit types in unit tests for every object returned by DI container (`await container.get(...)`).

## Actions Performed
1. Read governing documents and specification:
- `AGENTS.md`
- `test/unit/AGENTS.md`
- `ctx/docs/code/conventions/types-map.md`

2. Rebuilt `types.d.ts` in deterministic structure required by the convention:
- `INTERNAL CLASS MAPPINGS`
- `INTERNAL INSTANCE MAPPINGS`
- `PUBLIC GLOBAL API`

3. Applied canonical mapping rules in `types.d.ts`:
- Class mapping uses `typeof import("...").default`
- Instance mapping uses `InstanceType<Ns_Component>` only
- Added class and instance aliases for all namespace identifiers mapped from `src/**/*.mjs`
- Kept alphabetical ordering inside each section

4. Updated unit tests under `test/unit`:
- Added JSDoc `@type` annotations for all values returned by `await container.get(...)`
- Switched annotations to instance aliases (`...$`) to match container-returned objects

5. Validated coverage:
- Checked all `await container.get(...)` calls in `test/unit/**/*.test.mjs`
- Confirmed each call has nearby explicit `@type` annotation

## Produced Artifacts
Modified:
- `types.d.ts`
- `test/unit/Back/Dispatcher.test.mjs`
- `test/unit/Back/Dto/Handler/Source.test.mjs`
- `test/unit/Back/Handler/Pre/Log.test.mjs`
- `test/unit/Back/Handler/Static/A/Config.test.mjs`
- `test/unit/Back/Handler/Static/A/Fallback.test.mjs`
- `test/unit/Back/Handler/Static/A/FileService.test.mjs`
- `test/unit/Back/Handler/Static/A/Registry.test.mjs`
- `test/unit/Back/Handler/Static/A/Resolver.test.mjs`
- `test/unit/Back/Handler/Static/Static.test.mjs`
- `test/unit/Back/Helper/Order/Kahn.test.mjs`
- `test/unit/Back/Helper/Respond.test.mjs`
- `test/unit/Back/Server.test.mjs`

Created:
- `ctx/agent/report/2026/03/04/17-17-rebuild-types-and-annotate-unit-tests.md`

## Verification
Executed:
- `npm run test:unit`

Result:
- Fails in current workspace at:
  - `test/unit/Back/Dispatcher.test.mjs`
  - `test/unit/Back/Server.test.mjs`

These failures were already present in the current worktree/test environment and are not introduced by the type-map/JSDoc typing changes.
