# Agent Iteration Planning Protocol

Path: `./ctx/agent/plan/AGENTS.md`
Version: `20260216`

## Directory Purpose

The `ctx/agent/plan/` directory contains normative definitions of planned iterations prior to their implementation. Each plan defines a single bounded execution slice of the existing architectural and product semantics.

A plan defines execution scope. It does not define or modify system invariants.

## Level Map

- `YYYY/` — hierarchical storage structure for plans organized by year with nested month and day directories.
- `AGENTS.md` — this document, defining the invariants of the `plan/` level.

Plan files MUST be stored at:

`./ctx/agent/plan/YYYY/MM/DD/HH-MM-{title}.md`

## Plan Invariants

Each plan MUST:

- define exactly one iteration scope;
- declare explicit in-scope elements;
- declare explicit out-of-scope elements;
- reference authoritative documents it depends on;
- define required artifacts;
- define completion criteria;
- define prohibited modifications.

A plan MUST NOT:

- introduce new architectural semantics;
- redefine invariants;
- alter validation rules;
- extend the linking pipeline;
- modify previously established contracts.

A plan operates strictly within already defined normative documents.

## Plan Immutability

A plan becomes immutable at the moment implementation begins. Modification after that point is prohibited. If assumptions change, a new plan MUST be created.

Deletion of a plan is permitted only if the iteration was abandoned prior to implementation.

## Relationship to Reports

Each completed plan MUST have a corresponding report in `ctx/agent/report/`. A report confirms execution of the plan.

Absence of a report indicates that the plan is pending or abandoned.

## Summary

`ctx/agent/plan/AGENTS.md` defines a declarative protocol for iteration planning. It enforces bounded execution scope and preserves architectural invariants while enabling controlled incremental development.
