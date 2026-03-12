# AGENTS.md

Version: 20260311

## Package Purpose

This directory provides the Agent Interface of `@flancer32/teq-web`. It contains a compact usage-oriented projection of the package intended for LLM agents that consume the package as a dependency inside TeqFW applications.

The interface describes how external code should use the package and excludes repository organization, development workflow, testing strategy, and other internal project concerns.

## TeqFW Usage Model

`@flancer32/teq-web` is designed for TeqFW-style runtime composition with `@teqfw/di`.

Dependencies should be linked through Canonical Dependency Codes and constructor injection rather than through direct static imports between application modules. External code should treat the package as infrastructure resolved by the container:

- application modules declare dependencies through `__deps__`;
- the container resolves `Fl32_Web_*` identifiers at runtime;
- orchestration is performed inside DI-managed application services;
- handlers and server components are configured before the server enters execution phase.

## Reading Order

Agents should read the documents in this directory in the following order:

1. `AGENTS.md` — overview of the agent interface and navigation.
2. `overview.md` — package role, intended usage boundary, and main entry points.
3. `abstractions.md` — core runtime concepts and consumer-facing abstractions.
4. `rules.md` — mandatory usage constraints and invariants.
5. `examples/minimal-server.md` — minimal TeqFW-style orchestration example.

## Interface Scope

The documents in this directory define only the supported usage semantics relevant to package consumers. Behaviors not described here should be treated as undefined and should not be inferred from internal implementation details.

Internal helper modules and deep implementation paths are outside the preferred consumer interface unless a task explicitly requires them.
