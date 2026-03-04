# VSCode Type Hint Diagnosis

## Goal
Identify why VS Code does not provide type hints in JS tests despite declarations in `types.d.ts`.

## Actions
- Reviewed project TypeScript metadata: `tsconfig.json`, `package.json`, `types.d.ts`.
- Reviewed active failing test file: `test/unit/Back/Dispatcher.test.mjs`.
- Searched for JSDoc type names usage across `src/` and `test/`.
- Compared declared global type names against JSDoc references.

## Findings
- `tsconfig.json` includes only `src` and `types.d.ts`; `test/**` is excluded from the configured TS project.
- Many test JSDoc annotations use `$`-suffixed type names (`Fl32_Web_*$`), while `types.d.ts` declares only non-suffixed names (`Fl32_Web_*`).
- These two issues together explain missing/failed IntelliSense in `test/unit/Back/Dispatcher.test.mjs` and similar tests.

## Artifacts
- Diagnostic report: `ctx/agent/report/2026/03/04/18-08-vscode-type-hint-diagnosis.md`
- No product code changes were made in this iteration.
