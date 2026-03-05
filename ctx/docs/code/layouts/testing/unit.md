# Unit Testing Contract

Path: `ctx/docs/code/layout/testing/unit.md`
Version: `20260304`

## 1. Purpose

This document defines the normative unit-testing contract for TeqFW-based projects.

Unit testing verifies correctness of individual implementation modules at the module contract boundary. Unit tests ensure that each module behaves deterministically, enforces its documented invariants, and fails immediately when invalid input is provided.

The contract defined in this document is designed to support **deterministic generation, analysis, and modification of tests by automated agents**.

Unit testing governs implementation-level verification only and does not validate runtime composition or system-level behavior.

## 2. Scope

The unit-testing contract applies to all implementation modules located in the primary source directory of the package (typically `src/`).

A source file is considered testable if it contains executable logic, invariant enforcement, structural normalization, or transformation behavior.

Modules that contain only re-exports and no executable logic are exempt from the one-to-one testing requirement.

Unit testing operates strictly at the module contract boundary.

## 3. Placement

Unit tests are located exclusively in:

```
test/unit/
```

The directory structure inside `test/unit/` MUST mirror the structure of the primary source directory.

Example:

```
src/Dto/DepId.mjs
→
test/unit/Dto/DepId.test.mjs
```

Structural mirroring is mandatory and ensures deterministic navigation between implementation modules and their corresponding tests.

## 4. One-to-One Test Mapping

TeqFW enforces the following rule:

```
1 source file = 1 unit test
```

For every testable source module there MUST exist exactly one corresponding unit test file.

Multiple modules must not share a single unit test file.

This rule guarantees explicit traceability between implementation modules and their unit tests.

## 5. Test File Naming

Unit test file names MUST match the name of the implementation module.

The test file name is formed by appending the suffix `.test.mjs` to the module name.

Example:

```
src/Back/PipelineEngine.mjs
→
test/unit/Back/PipelineEngine.test.mjs
```

This deterministic naming rule allows agents to locate tests without search heuristics.

## 6. Test Suite Structure

Each unit test file MUST contain a test suite corresponding to exactly one implementation module.

Example:

```
describe('Pipeline Engine', () => {
    test('should execute handlers in order', ...)
});
```

A test suite must not combine tests for multiple modules.

The suite name must correspond to the tested module role.


## 7. Test Declaration Form

Tests MUST be declared using the `test()` function from `node:test`.

Use of the Mocha-style alias `it()` is prohibited.

Example:

```
test('should normalize dependency identifier', ...)
```

This rule ensures reliable test detection by development tools and automated agents.

## 8. Test Structure

Each test should follow the structure:

Arrange → Act → Assert

Example:

```
test('should normalize identifier', () => {

    // Arrange
    const input = 'Module.Component';

    // Act
    const result = normalize(input);

    // Assert
    assert.equal(result, 'Module_Component');
});
```

This structure ensures predictable interpretation of tests by automated agents.

## 9. Shared Test Bootstrap

Test environment initialization must be centralized.

Unit tests MUST use a shared bootstrap utility for test setup when runtime infrastructure is required.

Example pattern:

```
const container = buildTestContainer();
```

Unit tests must not construct complex runtime infrastructure directly.

This rule guarantees deterministic setup behavior and simplifies automated test generation.

## 10. Isolation Invariant

Unit tests MUST operate in a fully isolated environment.

Unit tests MUST NOT perform:

- filesystem access
- network access
- timer-based execution
- environment variable access
- mutation of global process state

Tests must not depend on shared mutable state.

Isolation guarantees deterministic and repeatable test execution.

## 11. Determinism Invariant

For modules that define deterministic behavior, unit tests MUST verify that:

- identical input produces identical output
- repeated invocation does not mutate prior results
- no hidden state persists across calls

Random values, timestamps, or nondeterministic input must not be used.

## 12. Public Contract Verification

Unit tests MUST verify only the public contract of the module.

Internal implementation details must not be accessed or asserted.

Tests must not depend on private state, internal helper functions, or hidden structures.

This rule protects tests from breaking during internal refactoring.

## 13. Structural Verification

Where applicable, unit tests MUST verify:

- structural shape of returned objects
- normalization rules
- immutability guarantees when specified
- absence of unintended mutation

Tests must validate behavior defined in the module contract only.

## 14. Failure Semantics

For modules that define fail-fast behavior, unit tests MUST verify that:

- invalid input results in immediate failure
- no partial structures are returned
- failure is expressed through a standard `Error`

Exact error message wording is not part of the contract unless explicitly documented.

## 15. Tooling

The normative testing stack for unit tests consists of:

- `node:test`
- `node:assert/strict`

External testing frameworks are not part of the TeqFW testing contract.

This rule guarantees consistent execution semantics across TeqFW projects.

## 16. Environment Neutrality

TeqFW packages may contain modules intended for:

- browser execution
- Node.js execution
- isomorphic execution

Unit tests verify JavaScript module behavior and must not depend on deployment environment characteristics.

## 17. Agent Compatibility

Unit tests must be structured so that automated agents can deterministically:

- locate tests
- understand tested behavior
- generate new tests
- modify existing tests

To support agent operation, unit tests must avoid ambiguous structures, implicit dependencies, and hidden test infrastructure.

## 18. Summary

Each testable module MUST have exactly one corresponding unit test file.

Unit tests MUST mirror the source directory structure, follow deterministic naming rules, declare tests using `test()`, verify only the public contract of modules, operate in a fully isolated environment, and use a centralized bootstrap when runtime infrastructure is required.

These rules ensure that unit tests remain deterministic, maintainable, and suitable for automated agent-driven development.
