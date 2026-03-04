# Iteration Report: Dispatcher unit-test type alias update

## Goal
Update unit tests to use `Fl32_Web_Back_Dispatcher` (without trailing `$`) instead of `Fl32_Web_Back_Dispatcher$` for JSDoc type annotations, according to updated `ctx/docs/code/conventions/types-map.md`.

## Performed Actions
1. Read updated convention:
- `ctx/docs/code/conventions/types-map.md`

2. Searched `test/unit/**/*.test.mjs` for `Fl32_Web_Back_Dispatcher$` type usage.

3. Updated `test/unit/Back/Dispatcher.test.mjs`:
- Replaced all JSDoc occurrences of `@type {Fl32_Web_Back_Dispatcher$}` with `@type {Fl32_Web_Back_Dispatcher}`.
- Kept DI key usage unchanged (`container.get('Fl32_Web_Back_Dispatcher$')`).

4. Verified:
- No remaining `Fl32_Web_Back_Dispatcher$` matches in unit tests.

5. Ran test command:
- `npm run test:unit`

## Produced Artifacts
Modified:
- `test/unit/Back/Dispatcher.test.mjs`

Created:
- `ctx/agent/report/2026/03/04/17-34-dispatcher-type-without-dollar-in-unit-tests.md`

## Verification Result
`npm run test:unit` still fails in current workspace for:
- `test/unit/Back/Dispatcher.test.mjs`
- `test/unit/Back/Server.test.mjs`

Failure pattern is consistent with previous runs in this environment/worktree and not caused by the JSDoc type alias rename.
