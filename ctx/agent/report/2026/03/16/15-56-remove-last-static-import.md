# Iteration Report

## Goal

Remove the last remaining static import from `src/` and keep the runtime configuration modules consistent with TeqFW DI conventions.

## Actions

- Removed the static import from `src/Back/Config/Runtime.mjs`.
- Declared `tlsFactory` as the only TLS-related DI dependency for runtime configuration.
- Removed the now-redundant `tlsData` constructor dependency from `Fl32_Web_Back_Config_Runtime.Factory`.
- Updated runtime freeze logic to assign the initialized TLS subtree from `tlsFactory.freeze()`.
- Updated unit tests for runtime configuration to match the changed constructor signature.
- Verified that `src/` contains no static imports.

## Artifacts

- `src/Back/Config/Runtime.mjs`
- `test/unit/Back/Config/Runtime.test.mjs`

## Verification

- Ran `rg -n "^import\\s+.+\\s+from\\s+['\\\"]|^import\\s+['\\\"]" src`.
- Result: no matches.
- Ran `npm test`.
- Unit tests: passed.
- Integration tests: passed.
