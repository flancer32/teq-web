# Iteration Report: Replace `it()` with `test()` in Node.js tests

## Goal
Refactor Node.js test files to use canonical `test()` API from `node:test` instead of `it()` across test suites.

## Performed Actions
1. Read and applied governing instructions from:
- `AGENTS.md` (root)
- `ctx/AGENTS.md`
- `ctx/agent/AGENTS.md`
- `ctx/agent/report/AGENTS.md`
- `test/unit/AGENTS.md`

2. Discovered target files under `test/` matching `*.test.mjs` / `*.test.js`.

3. Replaced in test files:
- `import { ..., it, ... } from 'node:test'` -> `import { ..., test, ... } from 'node:test'`
- `it('...', ...)` -> `test('...', ...)`

4. Verified replacements with ripgrep:
- No remaining `it` imports from `node:test` in test files.
- No remaining `it(` call sites in test files.

5. Ran verification commands:
- `npm run test:unit`
- `npm run test`

## Produced Artifacts
Updated test files in `test/` where `it` was used from `node:test` (imports and test declarations).

Created this report:
- `ctx/agent/report/2026/03/04/16-16-replace-it-with-test.md`

## Verification Results
- `npm run test:unit`: failed in current workspace/sandbox context (`test/unit/Back/Dispatcher.test.mjs`, `test/unit/Back/Server.test.mjs`).
- `npm run test`: failed because it depends on `test:unit` and stopped at the same failing unit stage.

Notes:
- Failures are observed during runtime behavior/mocking/environment (including sandbox network/listen restrictions), not due to remaining `it()` usage.
- Worktree contains unrelated pre-existing changes outside this iteration scope; they were not reverted.
