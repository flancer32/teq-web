# Iteration Report

## Goal
Switch `test:unit` to a shell-globstar-independent recursive test discovery command and align the package layout documentation.

## Actions
- Updated `package.json` script:
  - from: `node --test test/unit/**/*.test.mjs`
  - to: `find test/unit -name '*.test.mjs' -print0 | xargs -0 node --test`
- Updated `ctx/docs/code/layouts/package-json.md` with an explicit unit-test script contract requiring recursive discovery without `**` globstar dependency.
- Executed `npm run test:unit` to verify behavior.

## Artifacts
- Modified: `package.json`
- Modified: `ctx/docs/code/layouts/package-json.md`
- Created: `ctx/agent/report/2026/03/04/18-50-shell-independent-test-unit-script.md`

## Result
The unit test script now discovers tests recursively in a shell-configuration-independent way. Verification passed: 12 unit tests executed, 12 passed.
