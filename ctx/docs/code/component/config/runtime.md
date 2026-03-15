# Runtime Configuration Component

Path: `ctx/docs/code/component/config/runtime.md`
Template Version: `20260315`

## Purpose

This document defines the architectural contract for runtime configuration components in TeqFW packages. The contract specifies the structure, lifecycle, and ES module pattern used to represent runtime configuration objects managed by the DI container.

## Runtime Configuration Concept

Runtime configuration represents values that are supplied during application startup and remain immutable during application execution. Runtime configuration objects belong to individual packages and form a hierarchical structure that mirrors the dependency graph of the application.

Runtime configuration is a Runtime Data Component.

Runtime configuration must be initialized before any component reads its values. After initialization completes the configuration object becomes immutable for the entire lifetime of the application.

Runtime configuration must be frozen after initialization by the configuration component.

Component type definitions are described in ctx/docs/code/convention/teqfw/component-types.md.

## Runtime Configuration Component

Each package exposing runtime configuration publishes a runtime configuration component whose namespace identifier follows the pattern:

```
Ns_Pkg_Config_Runtime
```

The runtime component is resolved through the DI container and provides read-only access to configuration values.

The runtime component instance is a proxy object guarding access to the underlying configuration data structure.

## Module Structure

A runtime configuration module publishes three exports:

```
Data
Factory
default export
```

The responsibilities are defined as follows.

Data
Defines the configuration data structure and JSDoc property types.

Factory
Controls initialization and finalization of the configuration hierarchy.

Default export
Represents the runtime component resolved by the DI container and returns the protected proxy object.

The module itself owns the singleton configuration state through variables defined in module scope.

## Dependency Declaration

Runtime configuration factories declare dependencies through the module dependency descriptor.

Example:

```javascript
export const __deps__ = Object.freeze({
  Factory: Object.freeze({
    depData: "Ns_Dep_Config_Runtime$",
    depFactory: "Ns_Dep_Config_Runtime__Factory$",
  }),
});
```

The factory receives both the runtime configuration object and the factory of its dependency.

## Initialization Semantics

Runtime configuration supports cumulative initialization. Multiple packages may contribute configuration values while the configuration hierarchy is being built.

Initialization follows the rule:

```
first write wins
```

A configuration property must only be assigned if it has not yet received a value.

Configuration initialization proceeds in two phases:

1. configure phase
2. freeze phase

During the configure phase packages propagate configuration parameters through dependency factories. During the freeze phase configuration objects become immutable.

## Immutability Rules

Runtime configuration enforces strict immutability through a proxy wrapper.

The proxy enforces the following rules:

Reading configuration before finalization is not allowed.
Writing configuration properties is not allowed.
Adding or deleting properties is not allowed.

After the freeze phase the configuration object becomes permanently immutable.

## Factory Lifecycle

Runtime configuration factories implement two lifecycle operations.

configure(params)

Receives configuration parameters from the application and propagates configuration to dependency factories.

freeze()

Finalizes the configuration object and recursively finalizes dependency factories.

The freeze operation must be idempotent so that repeated calls do not produce errors in complex dependency graphs.

## Type Map Integration

Runtime configuration types are exported through the package type map.

Example declarations in `types.d.ts`:

```
type Ns_Pkg_Config_Runtime = import("./src/Config/Runtime.mjs").Data;
type Ns_Pkg_Config_Runtime$Factory = import("./src/Config/Runtime.mjs").Factory;
```

This approach ensures that IDE tooling and tsserver can resolve runtime configuration types without requiring TypeScript in the implementation.

## Canonical Runtime Configuration Module

The following module illustrates the canonical implementation pattern for runtime configuration in a TeqFW package.

```javascript
// Ns_Pkg_Config_Runtime => ./src/Config/Runtime.mjs
// types.d.ts: type Ns_Pkg_Config_Runtime = import("./src/Config/Runtime.mjs").Data;
// types.d.ts: type Ns_Pkg_Config_Runtime$Factory = import("./src/Config/Runtime.mjs").Factory;

export const __deps__ = Object.freeze({
  Factory: Object.freeze({
    depData: "Ns_Dep_Config_Runtime$",
    depFactory: "Ns_Dep_Config_Runtime__Factory$",
  }),
});

/**
 * Runtime configuration data structure.
 */
export class Data {
  /** @type {number} */
  port;

  /** @type {string} */
  host;

  /** @type {Ns_Dep_Config_Runtime} */
  dep;
}

/** @type {Ns_Pkg_Config_Runtime} */
const cfg = new Data();

/** @type {boolean} */
let frozen = false;

/** @type {Ns_Pkg_Config_Runtime} */
const proxy = new Proxy(cfg, {
  get(target, prop) {
    if (!frozen) throw new Error("Runtime configuration is not initialized.");
    return target[prop];
  },
  set() {
    throw new Error("Runtime configuration is immutable.");
  },
  defineProperty() {
    throw new Error("Runtime configuration is immutable.");
  },
  deleteProperty() {
    throw new Error("Runtime configuration is immutable.");
  },
});

/**
 * Runtime configuration component.
 */
export default class Ns_Pkg_Config_Runtime {
  constructor() {
    return proxy;
  }
}

/**
 * Runtime configuration factory.
 */
export class Factory {
  /**
   * @param {object} deps
   * @param {Ns_Dep_Config_Runtime} deps.depData
   * @param {Ns_Dep_Config_Runtime$Factory} deps.depFactory
   */
  constructor({ depData, depFactory }) {
    if (cfg.dep === undefined) cfg.dep = depData;

    this.configure = function (params = {}) {
      if (frozen) throw new Error("Runtime configuration is frozen.");

      if (cfg.port === undefined && params.PORT !== undefined) cfg.port = Number(params.PORT);

      if (cfg.host === undefined && params.HOST !== undefined) cfg.host = String(params.HOST);

      depFactory.configure(params);
    };

    this.freeze = function () {
      if (frozen) return;

      depFactory.freeze();

      Object.freeze(cfg);

      frozen = true;
    };
  }
}
```

## Summary

Runtime configuration components in TeqFW follow a deterministic pattern where configuration state is owned by the module, exposed through a proxy runtime component, initialized through factories, and finalized once during application startup. This structure ensures deterministic configuration behavior, strict immutability, and compatibility with the TeqFW dependency injection and type map architecture.
