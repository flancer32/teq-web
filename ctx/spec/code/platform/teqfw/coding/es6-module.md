# ES6 Modules in TeqFW

- Path: `ctx/spec/code/platform/teqfw/coding/es6-module.md`
- Version: `20260401`

## Purpose

Defines the canonical structural form of ES6 modules used as component publication units in TeqFW applications.

The document specifies constraints required for compatibility with:

- dependency container
- namespace-based addressing
- JSDoc structural typing

Dependency declaration, lifecycle, and composition rules are defined in `ctx/spec/code/platform/teqfw/composition/di/usage.md`.

## Concept

In TeqFW:

ES module ≠ component
ES module = publication unit of component(s)

A module exposes components that:

- are addressed by namespace identifiers
- may be instantiated by the container
- may be used as plain exports

Global identity of a component is defined by its namespace and external type mapping, not by local symbol names.

## Naming Model

Local names inside a module MUST be short and context-local.

Examples:

```javascript
export default class Service {}
export function helper() {}
```

Not allowed:

```javascript
export default class Ns_Service {}
export class Vendor_Project_Component {}
```

Rules:

- local identifiers MUST NOT encode namespace
- local identifiers SHOULD be minimal and semantic within the module
- global identity is defined by:
  - `@namespace` in module header
  - external type mapping (e.g. `types.d.ts`)

## Module Form

Every ES module in TeqFW follows a deterministic structural form.

A module MUST:

- start with `// @ts-check`
- define a JSDoc header with `@namespace` and `@description`
- expose at least one export (default or named)
- be safe to import (no side effects)
- have predictable top-down structure

A module MUST NOT:

- use static `import` statements
- perform external side effects at top-level
- execute application logic at import time

## Canonical Structure

The module is organized as an ordered sequence of blocks.

Blocks MUST appear in the following order:

1. `// @ts-check`
2. JSDoc header (`@namespace`, `@description`)
3. Constants / internal state (optional)
4. Internal helpers (optional)
5. Main implementation (`default export`, optional)
6. Named exports (optional)
7. Service blocks (e.g. `__deps__`, optional, always last)

Blocks MUST be omitted if they have no semantic content.

## Minimal Module

A minimal valid module:

```javascript
// @ts-check

/**
 * @namespace Vendor_Project_Package_Module
 * @description Minimal module
 */

export default function () {}
```

## Top-Level Code

Top-level code is restricted to structural declarations.

Allowed:

- constants
- immutable objects
- internal caches
- private module state

```javascript
const cache = new Map();
```

Not allowed:

- network calls
- filesystem access
- environment mutation
- execution of workflows
- dependency resolution

Top-level code MUST NOT produce side effects outside the module.

## Exports

A module MUST expose at least one export:

- `default export` — primary component
- named exports — secondary API

The default export is used when the module represents a primary component.

Named exports are used for:

- factories
- helpers
- secondary components

Exported identifiers follow local naming rules and MUST remain short.

## Component Mapping

Component type determines module form.

### Handler Component

- implemented as class
- exposed as default export
- may declare dependencies

```javascript
export default class Service {}
```

### Factory

- handler specialization
- may be default or named export
- creates transient data

### Data Component

- contains no behavior
- immutable
- no dependencies

```javascript
export default Object.freeze({});
```

## Dependency Descriptor

If a module has dependencies, they MUST be declared via `__deps__`.

Rules:

- exported constant
- immutable (`Object.freeze`)
- placed at the end of module
- omitted when the module has no dependencies
- keys match constructor parameters

```javascript
export const __deps__ = Object.freeze({
  logger: "Ns_Logger$",
});
```

Canonical nested descriptor form:

```javascript
export const __deps__ = Object.freeze({
  main: Object.freeze({
    logger: "Ns_Logger$",
  }),
});
```

Rules:

- string values denote canonical dependency codes
- nested descriptor objects are allowed for export-specific dependency sets
- descriptors MUST remain frozen
- empty descriptors are not allowed

## Constructor Model

Constructor receives dependencies as a single structured object.

```javascript
constructor({ logger }) {}
```

Rules:

- names match `__deps__`
- no aliasing
- no manual resolution

## Behavior Definition

Behavior MUST be defined inside constructor using closures.

```javascript
constructor({ logger }) {
  this.run = function () {
    logger.log("run");
  };
}
```

Not allowed:

```javascript
run() {}
Class.prototype.run = ...
```

## Dependency Usage

Dependencies MUST be used directly in closures.

Allowed:

```javascript
this.run = function () {
  logger.log("run");
};
```

Not recommended:

```javascript
this.logger = logger;
```

## Module Encapsulation

Module MAY define private state shared across instances.

```javascript
const cache = new Map();

export default class Service {
  constructor() {
    this.get = function (key) {
      return cache.get(key);
    };
  }
}
```

## JSDoc Requirements

Module MUST include:

- module-level JSDoc header
- `@namespace` annotation
- `@description` annotation

Public API SHOULD include:

- constructor annotations
- method annotations

Type references SHOULD use namespace-based identifiers:

```javascript
/**
 * @namespace Ns_Service
 * @description Service component
 */
export default class Service {
  /**
   * @param {object} params
   * @param {Ns_Logger} params.logger
   */
  constructor({ logger }) {
    this.run = function () {};
  }
}
```

## Canonical Module

```javascript
// @ts-check

/**
 * @namespace Ns_Service
 * @description Example service component
 */

const cache = new Map();

export default class Service {
  /**
   * @param {object} params
   * @param {Ns_Logger} params.logger
   */
  constructor({ logger }) {
    this.run = function (key) {
      if (!cache.has(key)) {
        cache.set(key, key);
      }
      logger.log(key);
      return cache.get(key);
    };
  }
}

export const __deps__ = Object.freeze({
  logger: "Ns_Logger$",
});
```

## Summary

An ES module in TeqFW is a deterministic publication unit of components with a fixed structural form.

The structure enforces:

- explicit module identity (`@namespace`)
- separation of local and global naming
- type-aware validation (`@ts-check`)
- deterministic block ordering
- absence of side effects at import time
- constructor-based composition
- closure-based behavior
- static dependency declaration

Local symbols remain short and context-bound, while global identity is defined externally through namespace and type mapping.
