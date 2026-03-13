# DTO Namespace Shortening

Path: `./ctx/agent/report/2026/03/13/08-44-dto-namespace-shortening.md`

## Goal

Remove the redundant `Handler` segment from DTO component addresses so that DTO namespaces use the shorter form `Fl32_Web_Back_Dto_*`.

## Actions

- Moved DTO implementation modules from `src/Back/Dto/Handler/` to `src/Back/Dto/`:
  - `Info.mjs`
  - `Source.mjs`
- Renamed DTO class and typedef identifiers from `Fl32_Web_Back_Dto_Handler_*` to `Fl32_Web_Back_Dto_*`.
- Updated all CDC references, JSDoc types, ES module imports, and `types.d.ts` aliases to the shortened namespace form.
- Updated dev bootstrap and integration tests to resolve factories through:
  - `Fl32_Web_Back_Dto_Info__Factory$`
  - `Fl32_Web_Back_Dto_Source__Factory$`
- Ran the full automated test suite.

## Results

- DTO component addresses no longer contain the redundant `Handler` segment.
- Source-tree mapping now matches the shorter namespaces:
  - `Fl32_Web_Back_Dto_Info` → `src/Back/Dto/Info.mjs`
  - `Fl32_Web_Back_Dto_Source` → `src/Back/Dto/Source.mjs`
- All unit and integration tests passed with `npm test`.

## Artifacts

- Updated DTO modules:
  - `src/Back/Dto/Info.mjs`
  - `src/Back/Dto/Source.mjs`
- New report: `ctx/agent/report/2026/03/13/08-44-dto-namespace-shortening.md`
