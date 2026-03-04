# Unit Testing Contract

Path: `ctx/docs/code/layout/testing/unit.md`
Version: `20260304`

## 1. Purpose

This document defines the normative unit-testing contract for TeqFW-based projects.

Unit testing verifies correctness of individual implementation modules at the module contract boundary. The goal of unit testing is to ensure that each module behaves deterministically, enforces its documented invariants, and fails immediately when invalid input is provided.

This document defines placement rules, structural mirroring requirements, isolation constraints, determinism expectations, and failure semantics for unit tests.

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

Structural mirroring is mandatory.

Example:

```
src/Dto/DepId.mjs
→
test/unit/Dto/DepId.test.mjs
```

This rule ensures predictable discoverability of tests and deterministic navigation between implementation modules and their corresponding unit tests.

## 4. One-to-One Test Mapping

TeqFW enforces a strict unit test coverage rule:

```
1 source file = 1 unit test
```

For every testable source module there MUST exist exactly one corresponding unit test file.

The unit test file must verify the complete public contract of the corresponding module.

Multiple modules must not share a single unit test file.

This invariant ensures that module contracts remain explicitly verifiable and traceable across the codebase.

## 5. Isolation Invariant

Unit tests MUST operate in a fully isolated environment.

Unit tests MUST NOT perform:

- filesystem access
- network access
- timer-based execution
- environment-variable access
- mutation of global process state

Unit tests must not depend on global mutable state.

If a module interacts with external facilities, those interactions must be abstracted and controlled within the test boundary.

Isolation ensures that unit tests remain deterministic and repeatable.

## 6. Determinism Invariant

For modules that define deterministic behavior, unit tests MUST verify that:

- identical input produces structurally identical output
- repeated invocation does not mutate prior results
- no hidden state persists across calls

Determinism verification applies only to behaviors defined in the module contract.

Modules that intentionally rely on nondeterministic behavior must explicitly document that behavior.

## 7. Failure Semantics

For modules that define fail-fast behavior, unit tests MUST verify that:

- invalid input results in immediate failure
- no partial structures are returned
- failure is expressed through a standard `Error`

Error message wording is not part of the contract unless explicitly specified in documentation.

Unit tests must validate failure conditions defined in module contracts.

## 8. Structural Verification

Where applicable, unit tests MUST verify:

- structural shape of returned objects
- normalization rules
- immutability guarantees when specified
- absence of unintended mutation

Unit tests must validate behavior defined in the module contract and MUST NOT depend on undocumented internal implementation details.

## 9. Tooling

The normative testing stack for unit tests consists of:

- `node:test`
- `node:assert/strict`

External testing frameworks are not part of the TeqFW testing contract.

This invariant ensures consistent execution semantics across all TeqFW projects.

## 10. Environment Neutrality

TeqFW packages may contain modules intended for:

- browser execution
- Node.js execution
- isomorphic execution

Unit tests verify JavaScript module behavior and must not depend on deployment environment characteristics.

Unit tests operate purely at the module contract boundary.

## 11. Contract Boundary

The unit-testing contract governs verification of individual implementation modules.

Unit tests:

- validate module-level correctness
- enforce isolation invariants
- verify deterministic behavior where defined

Unit tests do not verify system-level composition or runtime lifecycle behavior.

Those concerns belong to integration testing.

## 12. Summary

Each testable module MUST have exactly one corresponding unit test file.

Unit tests MUST mirror the source directory structure, operate in a fully isolated environment, verify deterministic behavior where specified, enforce fail-fast semantics where defined, and validate structural correctness of module outputs.

Unit testing protects correctness of implementation modules and forms the foundation of the TeqFW testing model.
