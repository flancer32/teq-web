# Iteration Report: DI v2 and `.mjs` Migration

## Goal
Migrate runtime source code to the `@teqfw/di` v2 module dependency format and rename project source files from `.js` to `.mjs` according to `ctx/docs/code/components.md` requirements.

## Actions Performed
- Migrated backend runtime modules under `src/Back/` to explicit v2 dependency descriptors using `export const __deps__`.
- Replaced legacy constructor dependency keys (`Fl32_...$`, `node:...`) with local dependency names resolved via `__deps__`.
- Switched Node built-in CDC identifiers to v2-compatible forms (`node_http`, `node_http2`, `node_fs`, `node_path`, `node_url`).
- Renamed all source `.js` files to `.mjs` in:
  - `src/Back/**`
  - `test/unit/common.mjs`
  - `test/dev/app/Plugin/Start.mjs`
- Updated path and extension references in test and dev files to match `.mjs` naming.
- Updated type import paths in `types.d.ts` from `.js` to `.mjs`.
- Updated code-level component document `ctx/docs/code/components.md` to point to `.mjs` source paths and reflect completed extension migration.
- Updated container initialization in test/dev helpers to v2 builder API (`container.addNamespaceRoot(...)`) instead of `getResolver().addNamespaceRoot(...)`.

## Artifacts Produced
- Modified runtime modules in `src/Back/**.mjs` with v2 dependency descriptors.
- Renamed source files from `.js` to `.mjs`.
- Updated test and dev integration references to new filenames and DI keys.
- Updated `types.d.ts` imports to `.mjs`.
- Updated `ctx/docs/code/components.md` extension/path references.

## Validation
- Verified DI instantiation smoke check:
  - `container.get('Fl32_Web_Back_Dispatcher$')` succeeds with `.mjs` namespace root.
- Running unit tests revealed incompatibility with current tests that rely on legacy nested mock substitution behavior.
