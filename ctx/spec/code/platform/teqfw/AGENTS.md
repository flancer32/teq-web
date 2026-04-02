# TeqFW — Platform Specification

- Path: `ctx/spec/code/platform/teqfw/AGENTS.md`
- Version: `20260401`

## Purpose

This level defines the TeqFW platform specification as a structured knowledge system for agent-driven application development.

This directory is the platform entry point inside cognitive contexts of TeqFW-based ADSM projects. Its purpose is to help agents navigate platform knowledge and build local task context while developing applications on TeqFW.

## Level Map

- `addressing/` — component identity and addressing rules, including namespaces, CDC, and mappings between runtime and static addressing.
- `agents/` — agent-oriented development conventions for TeqFW projects, including context structure, workflows, prompt contracts, and machine-readable documentation.
- `coding/` — code-level forms required for TeqFW compatibility, including ES module structure, component publication forms, and JSDoc conventions.
- `composition/` — runtime assembly of TeqFW applications, including DI, lifecycle, bootstrap, and configuration as a composition mechanism.
- `data/` — data structures and persistence-related conventions, including DTO, repositories, database usage, and storage-related patterns.
- `foundation/` — platform foundations for application development on TeqFW, including philosophy, principles, applicability limits, and high-level usage model.
- `integration/` — interaction with external systems, including HTTP clients, messaging, email, third-party APIs, and external providers.
- `interfaces/` — application boundaries exposed through TeqFW, including web, CLI, handlers, routing, and public machine interfaces.
- `quality/` — verification, diagnostics, observability, and reliability-related conventions.
- `AGENTS.md` — level definition for TeqFW platform specifications.

## Reading Order

Recommended reading order for agents entering this level:

1. `AGENTS.md`
2. `foundation/`
3. `addressing/`
4. `coding/`
5. `composition/`
6. `data/`
7. `interfaces/`
8. `integration/`
9. `quality/`
10. `agents/`

This order is semantic, not alphabetical. It defines how to build local understanding of the platform from general foundations to specialized usage areas.

## Scope

This level defines platform knowledge required for application development on TeqFW, including:

- platform foundations and applicability
- component addressing rules
- code structure and publication forms
- runtime composition and application assembly
- data handling and persistence conventions
- application interfaces
- integration with external systems
- quality and observability practices
- agent-oriented development conventions

This level does NOT define:

- project-specific business logic
- application-specific product behavior
- project-specific architecture outside platform usage

## Navigation Model

Navigation is hierarchical and deterministic.

Rules:

- every directory MUST contain an `AGENTS.md` file
- `AGENTS.md` is the only entry point for that level
- agents MUST read `AGENTS.md` before accessing files in the directory
- navigation MUST be performed by directory structure and file names, not by search
- full leaf paths MUST be sufficient to infer the semantic area of a document before reading it

## Navigation Rules

If you need:

- platform philosophy or applicability boundaries → `foundation/`
- component identity, namespace rules, or CDC semantics → `addressing/`
- how to write TeqFW-compatible code → `coding/`
- how TeqFW assembles and runs applications → `composition/`
- how TeqFW applications represent or persist data → `data/`
- how TeqFW applications expose boundaries → `interfaces/`
- how TeqFW applications connect to external systems → `integration/`
- how to validate, observe, or troubleshoot behavior → `quality/`
- how agents should work with TeqFW projects in ADSM contexts → `agents/`

## Core Principle

These specifications describe TeqFW from the perspective of platform use in application development.

The primary consumer is an agent working inside a TeqFW project context. Documents at this level therefore MUST help the agent answer practical questions of platform use:

- how to think about the platform
- how to reference platform entities
- how to write compatible code
- how to compose a running application
- how to work with data
- how to expose interfaces
- how to integrate external systems
- how to validate and observe results
- how to operate within an agent-driven workflow

## Structural Invariants

- platform knowledge MUST be organized by semantic area of platform use
- directory names MUST denote non-overlapping knowledge zones
- file names MUST identify the concrete subject of the specification
- platform addressing rules remain the common identity layer across all zones
- runtime composition remains explicit and container-driven
- code conventions MUST remain aligned with agent-readable and machine-checkable structure
- documents at this level MUST describe reusable platform usage patterns, not project-local decisions

## Level Boundary

This level defines reusable knowledge about how TeqFW is used to build applications.

Subdirectories may refine specific areas of platform use, but they MUST NOT:

- redefine the overall purpose of the platform level
- duplicate the same subject across multiple semantic zones
- mix project-specific implementation details into platform specifications
- introduce categories that are based on document form instead of semantic area

All subordinate levels must preserve deterministic navigation for agents and keep the specification space understandable from directory and file names alone.
