# Testing Layers

Path: `ctx/docs/code/layout/testing.md`
Template Version: `20260304`

## 1. Purpose

This document defines the normative testing-layer model used in TeqFW-based projects.

Testing verifies correctness at two architectural boundaries:

- module implementation contracts;
- system runtime behavior under composition.

The testing model separates verification of local implementation invariants from verification of runtime behavior of the system as a whole.

This separation protects both implementation correctness and architectural behavior during refactoring, agent-generated changes, and system evolution.

This document defines the **testing layer model only**. Detailed rules for each layer are defined in layer-specific testing contracts.

## 2. Testing Layer Model

TeqFW projects define two mandatory testing layers:

- unit testing
- integration testing

Each layer verifies a different class of invariants and operates at a distinct architectural boundary.

The separation of testing layers is structural and must not be violated.

Additional testing layers may exist in a project (for example system tests, CLI tests, or environment tests), but such layers are outside the platform testing contract and are not defined in this document.

## 3. Directory Structure

All TeqFW projects use the same testing layout.

```text
test/
  unit/
  integration/
```

This directory structure is a platform invariant.

The directory structure ensures that testing layers remain structurally separated and predictable for automated tooling and agents.

## 4. Layer Boundaries

### Unit Testing

Unit testing verifies **module-level contracts** of implementation modules.

Unit tests validate:

- deterministic behavior of modules
- structural correctness of produced values
- fail-fast semantics when defined
- immutability guarantees when specified

Unit tests operate in a fully isolated environment and must not interact with external systems.

Unit tests protect **local correctness of implementation modules**.

### Integration Testing

Integration testing verifies **runtime behavior of the system under composition**.

Integration tests validate observable system-level invariants such as:

- runtime composition behavior
- lifecycle behavior of runtime components
- extension or middleware execution
- configuration locking rules
- failure propagation and state transitions

Integration tests operate at the **system runtime boundary** and validate externally observable behavior only.

Integration tests protect **architectural behavior of the system**.

## 5. Layer Interaction

Unit tests and integration tests are complementary.

Unit tests:

- validate local module contracts
- verify deterministic and structural behavior
- enforce isolation invariants

Integration tests:

- validate runtime composition behavior
- verify lifecycle semantics
- validate observable system invariants

Neither layer replaces the other.

A build is considered behaviorally valid only when both testing layers pass.

## 6. Normative Testing Stack

All TeqFW projects use the same normative testing stack:

- `node:test`
- `node:assert/strict`

External testing frameworks are not part of the platform contract.

This invariant ensures predictable behavior of the testing environment across all TeqFW-based projects.

## 7. Runtime Environment Neutrality

TeqFW packages may contain code intended for:

- browser environments
- Node.js environments
- isomorphic execution

The testing model is independent of deployment environment.

Tests verify JavaScript module behavior rather than runtime deployment configuration.

## 8. Normative References

Detailed layer contracts are defined in the following documents:

- `ctx/docs/code/layout/testing/unit.md`
- `ctx/docs/code/layout/testing/integration.md`

These documents define structural rules, constraints, and behavioral expectations for each testing layer.

## 9. Summary

Testing in TeqFW projects is structured into two mandatory layers:

- Unit testing verifies correctness of individual implementation modules.
- Integration testing verifies runtime behavior of the system under composition.

This layered testing model protects both local implementation correctness and architectural behavior of the system during development and evolution.
