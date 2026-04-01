# TeqFW DI — Usage

- Path: `ctx/spec/code/platform/teqfw/di/usage.md`
- Document Version: `20260331`

## Purpose

Defines the usage contract of TeqFW dependency injection.

Specifies how components declare dependencies, how they are resolved, and how application composition is performed.

## Scope

Defines:

- dependency declaration
- component interaction model
- component resolution
- composition root

Does not define:

- module structure (see `es6-module.md`)
- container implementation
- architectural justification

This document defines runtime composition only.

## Core Model

Composition is performed by the container.

```text
component
    -> declares dependencies
container
    -> resolves dependencies
constructor
    -> receives ready instances
```

Invariants:

- components do not use static imports
- components declare dependency contracts explicitly
- components are safe to import (no side effects)

DI-compatible modules MUST follow the canonical ES module structure defined in `es6-module.md`.

## Dependency Declaration

Dependencies are declared via `__deps__` only when a component actually has dependencies.
Components without dependencies MUST omit `__deps__`.

Canonical form:

```javascript
export const __deps__ = Object.freeze({
  main: Object.freeze({
    logger: "App_Logger$",
  }),
});
```

Rules:

- `__deps__` is a service block and MUST be placed at the end of module
- descriptor MUST use canonical nested structure
- top-level keys correspond to exported components (`main` for default export)
- nested objects define dependency maps
- nested objects MUST be immutable (`Object.freeze`)
- keys match constructor parameters
- values are Canonical Dependency Codes (CDC)
- all dependencies are explicit
- empty descriptors are not allowed
- manual resolution is not allowed

Shorthand form MAY be used only for simple modules with a single default export:

```javascript
export const __deps__ = Object.freeze({
  logger: "App_Logger$",
});
```

In this case:

- shorthand is equivalent to `main` descriptor
- shorthand MUST NOT be used in multi-export modules

## Constructor Contract

Dependencies are provided as a single structured object.

```javascript
constructor({ logger }) {}
```

Rules:

- parameter names match `__deps__`
- no aliasing
- dependencies are treated as immutable

## Canonical Dependency Codes

CDC is the addressing mechanism of components.

Form:

```text
Namespace_Component
Namespace_Component$
Namespace_Component$$
Namespace_Component__Export
Namespace_Component__Export$
```

Meaning:

- no marker → use export as-is
- `$` → singleton instance (shared)
- `$$` → transient instance (new instance per injection)
- `__Export` → named export

Invariants:

- CDC addresses a component, not a file
- CDC relies on namespace identifiers
- namespace is defined in module header (`@namespace`)
- CDC is resolved only by the container

## Component Resolution

Components are requested via container.

```javascript
const service = await container.get("App_Service$");
```

Rules:

- resolution is performed only through container
- direct instantiation of container-managed components is not allowed
- dependency graph is resolved recursively

## Composition Root

Application defines a single composition root.

```javascript
const container = new Container();

const registry = new NamespaceRegistry({
  fs,
  path,
  appRoot,
});

container.setNamespaceRegistry(registry);

const app = await container.get("App_Root$");
```

Responsibilities:

- create container
- configure namespace registry
- request root component

Constraints:

- no business logic
- no manual wiring
- single entry point

## Component Interaction

Components interact only through declared dependencies.

Rules:

- no hidden coupling via imports
- container MUST NOT be injected or referenced in components
- no runtime dependency lookup

## Lifecycle Model

Lifecycle is defined by CDC.

```text
$   -> shared instance (singleton)
$$  -> new instance (transient)
```

Rules:

- `$` is used for singleton services
- `$$` is used for transient objects created at injection time
- lifecycle is controlled exclusively by the container

## Object Creation

Object creation is centralized.

Allowed:

- container (for managed components)
- factories (for transient data)

Not allowed:

- direct `new` for container-managed components

## Namespace Usage

Rules:

- namespace identifiers are used as addresses
- file paths are not used
- mapping is defined externally
- identifiers are stable under refactoring

## Execution Model

```text
composition root
    -> container.get("App_Root$")
    -> dependency graph resolved
    -> ready instance returned
```

## Constraints

- all dependencies are explicit
- container is the only composition mechanism
- modules used by the container MUST be DI-compatible
- modules MUST be safe to import (no side effects)
- object lifecycle is container-controlled

## Summary

TeqFW DI defines runtime composition through:

- explicit dependency contracts
- CDC-based addressing
- constructor injection
- centralized resolution

Components declare structure.
The container performs all linking.
