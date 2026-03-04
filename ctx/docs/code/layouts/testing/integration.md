# Integration Testing Contract

Path: `ctx/docs/code/layout/testing/integration.md`
Version: `20260304`

## 1. Purpose

This document defines the normative integration-testing contract for TeqFW-based projects.

Integration testing verifies observable runtime behavior of the system under real composition conditions. The goal of integration testing is to ensure that independently correct modules interact correctly when composed together and that system-level invariants remain stable across runtime execution.

Integration tests validate behavior at the system runtime boundary and serve as executable verification of architectural behavior.

This document defines placement rules, allowed side effects, structural organization of integration tests, and the acceptance role of integration testing.

## 2. Scope

Integration tests verify system-level invariants that emerge when multiple modules operate together under runtime conditions.

Examples of such invariants include:

- runtime composition behavior
- lifecycle behavior of runtime components
- execution of extensions or middleware
- configuration rules and runtime configuration locking
- propagation of runtime failures
- integrity of runtime state transitions

Integration tests validate externally observable behavior only and must not depend on internal implementation structure.

## 3. Placement

Integration tests are located exclusively in:

```id="l4dr9s"
test/integration/
```

Structural mirroring of the source directory is **not required**.

Integration tests are organized by runtime scenarios rather than by individual source files.

Each integration test file should represent a distinct semantic domain of runtime behavior.

This organization improves clarity of system-level verification and avoids artificial coupling between integration tests and internal module structure.

## 4. Allowed Side Effects

Integration tests may interact with real runtime facilities when necessary to validate system behavior.

Integration tests MAY perform:

- filesystem access
- dynamic module loading
- use of fixture modules
- verification of object identity
- validation of runtime error propagation
- validation of runtime state transitions

Integration tests MUST NOT depend on:

- external network services
- nondeterministic timing behavior
- environment-specific configuration

Integration tests must remain deterministic across repeated executions.

## 5. Structural Model

Each integration test file must represent a distinct runtime scenario or system invariant.

Integration tests must:

- validate observable system behavior
- avoid dependence on internal module structure
- avoid indirect behavioral assumptions
- avoid helper abstractions that obscure runtime configuration

Integration tests collectively verify system behavior across the runtime lifecycle.

Typical runtime phases verified by integration tests may include:

1. configuration phase
2. runtime composition phase
3. execution phase
4. extension or middleware execution
5. lifecycle transitions
6. failure handling and state transitions

The ordering of integration test scenarios should follow logical runtime progression when possible.

## 6. Acceptance Role

Integration tests define the acceptance boundary for system runtime behavior.

A build MUST NOT be considered behaviorally valid if integration tests fail.

Integration tests act as executable verification of architectural behavior under runtime composition.

When discrepancies arise between documentation and runtime behavior, integration tests define the effective behavior unless documentation is explicitly updated.

## 7. Invariant Coverage Requirement

Integration tests must collectively verify all publicly observable runtime invariants of the system.

For every documented system-level runtime behavior, there must exist at least one integration scenario validating that behavior.

When new runtime semantics are introduced, a corresponding integration test scenario must be added within the same change set.

Removal or modification of an integration scenario requires explicit justification and corresponding documentation updates.

## 8. Relationship to Unit Testing

Integration tests do not replace unit tests.

Unit tests validate correctness of individual modules and enforce isolation invariants.

Integration tests validate system behavior under runtime composition.

Unit testing protects local correctness.

Integration testing protects architectural behavior.

Both testing layers are mandatory and complementary.

## 9. Environment Neutrality

TeqFW packages may contain code intended for:

- browser environments
- Node.js environments
- isomorphic execution

Integration tests verify runtime behavior of JavaScript modules and must not depend on deployment environment characteristics.

Integration tests validate system behavior independent of deployment topology.

## 10. Summary

Integration testing verifies observable system behavior when modules operate together under runtime conditions.

Integration tests validate runtime composition behavior, lifecycle transitions, failure propagation, and system-level invariants.

This testing layer serves as executable verification of architectural behavior and protects system integrity during development and evolution.
