# Component Types Refactoring

Path: `./ctx/agent/report/2026/03/13/07-44-component-types-refactoring.md`

## Goal

Refactor the package source code under `src/` so that DTOs, factories, and static data components comply with the updated TeqFW component type conventions approved by the human.

## Actions

- Refactored the four DTO-related modules so that the `default` export is now the data structure itself:
  - `src/Back/Dto/Handler/Info.mjs`
  - `src/Back/Dto/Handler/Source.mjs`
  - `src/Back/Server/Config.mjs`
  - `src/Back/Server/Config/Tls.mjs`
- Introduced dedicated factory modules for those DTOs to preserve DI compatibility with the current `@teqfw/di` implementation:
  - `src/Back/Dto/Handler/Info/Factory.mjs`
  - `src/Back/Dto/Handler/Source/Factory.mjs`
  - `src/Back/Server/Config/Factory.mjs`
  - `src/Back/Server/Config/Tls/Factory.mjs`
- Updated handler and server components to depend on the new factory component identifiers instead of treating DTO modules as factories.
- Made static data components immutable by freezing singleton instances in:
  - `src/Back/Defaults.mjs`
  - `src/Back/Enum/Stage.mjs`
  - `src/Back/Enum/Server/Type.mjs`
- Updated `types.d.ts`, dev bootstrap, and unit/integration tests to the new publication model and added immutability assertions.

## Results

- DTO modules now publish transient data components as their `default` export and no longer expose handler behavior from the same component identity.
- DTO creation is centralized in explicit factory components that return frozen DTO instances.
- Static data components are now immutable singleton instances when created by the container.
- The refactoring remains compatible with the current container implementation by using separate factory modules instead of in-module named exports with per-export dependency descriptors.
- Full automated verification passed with `npm test`.

## Artifacts

- New factory modules:
  - `src/Back/Dto/Handler/Info/Factory.mjs`
  - `src/Back/Dto/Handler/Source/Factory.mjs`
  - `src/Back/Server/Config/Factory.mjs`
  - `src/Back/Server/Config/Tls/Factory.mjs`
- New report: `ctx/agent/report/2026/03/13/07-44-component-types-refactoring.md`
