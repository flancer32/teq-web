# Iteration Report

## Goal
Validate direct-constructor mocking approach on `Dispatcher` and apply the same unit-test scheme across other backend unit tests.

## Actions
- Converted `test/unit/Back/Dispatcher.test.mjs` to instantiate `Fl32_Web_Back_Dispatcher` directly with explicit mocked constructor dependencies.
- Confirmed dispatcher test passes after conversion.
- Migrated remaining backend unit tests away from DI container-based SUT construction (`buildTestContainer` / `container.get`) to direct constructor instantiation with explicit mocks.
- Updated relative import paths in nested test directories to point to `src/` correctly.
- Kept `test/unit/common.mjs` compatibility API intact (`buildTestContainer` + `createTestContainer`).

## Artifacts
Modified test files:
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

## Verification
- `node --test $(find test/unit/Back -name '*.test.mjs' | sort)`
- Result: 12 passed, 0 failed.

## Result
The backend unit tests are now isolated from DI v2 transitive-mock limitations by constructing SUTs directly and passing explicit mock dependencies.
