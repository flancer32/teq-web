# JSDoc DTO Aliases

Path: `./ctx/agent/report/2026/03/12/10-38-jsdoc-dto-aliases.md`

## Goal

Replace external JSDoc references of the form `Namespace.Dto` with `Namespace$Dto` and align `types.d.ts` with the same addressing scheme.

## Actions

- Located all external JSDoc references using `Fl32_Web_... .Dto` in `src/`.
- Replaced those references with `Fl32_Web_...$Dto`.
- Exported `Dto` as a named export from modules whose DTO classes are referenced outside their declaring file.
- Added named-export aliases for DTO types in `types.d.ts`.
- Verified that no external references of the form `Fl32_Web_....Dto` remain.
- Ran `npm run test:integration`.

## Results

- External JSDoc references now use the `Namespace$Dto` form.
- DTO classes in the following modules are exported as named export `Dto`:
  - `src/Back/Dto/Handler/Info.mjs`
  - `src/Back/Dto/Handler/Source.mjs`
  - `src/Back/Server/Config.mjs`
  - `src/Back/Server/Config/Tls.mjs`
- `types.d.ts` now contains DTO aliases for:
  - `Fl32_Web_Back_Dto_Handler_Info$Dto`
  - `Fl32_Web_Back_Dto_Handler_Source$Dto`
  - `Fl32_Web_Back_Server_Config$Dto`
  - `Fl32_Web_Back_Server_Config_Tls$Dto`
- `npm run test:integration` passed.

## Artifacts

- Updated source modules in `src/`.
- Updated type map `types.d.ts`.
- New report: `ctx/agent/report/2026/03/12/10-38-jsdoc-dto-aliases.md`
