# Runtime Configuration Convention

Path: `ctx/docs/code/convention/teqfw/configuration/runtime.md`
Template Version: `20260317`

## Purpose

This document defines the runtime configuration convention for TeqFW packages.

Runtime configuration in TeqFW is not a generic configuration pattern. It is a DI-integrated mechanism designed for deterministic composition of application state in a modular monolith.

The specification defines structure, lifecycle, and composition rules for runtime configuration components required for compatibility with the TeqFW DI container and agent-driven development.

## Runtime Configuration in TeqFW

Runtime configuration represents values supplied during application startup and shared across the application.

Runtime configuration is implemented as a distributed initialization system with centralized read access.

The model is defined as follows:

- configuration state is owned by modules
- configuration may be written from multiple locations during initialization
- configuration is read exclusively through DI
- configuration becomes immutable after finalization

Runtime configuration is a Runtime Data Component.

## Architectural Model

Runtime configuration in TeqFW follows a strict model:

- each configuration node is a DI component
- configuration hierarchy matches the DI dependency graph
- modules do not construct configuration subtrees
- configuration composition is performed only through DI

This model is required for deterministic behavior in modular monolith applications.

## Structural Constraints

A runtime configuration module MUST:

- export exactly three symbols: Data, Factory, Wrapper
- NOT declare any additional classes or constructors
- NOT define nested configuration classes
- NOT instantiate configuration substructures using `new`
- NOT implement configuration trees as plain objects

A module represents exactly one configuration node.

Nested configuration MUST be implemented as separate runtime configuration components and injected via DI.

## Module Structure

A runtime configuration module publishes:

```
Data
Factory
Wrapper (default export)
```

The structure is fixed and MUST NOT be altered.

### Data

Defines internal configuration state.

Rules:

- contains only primitive values or references to other configuration components
- contains no logic
- does not instantiate objects
- does not depend on local helper classes

Data is mutable only during initialization.

### Factory

Controls configuration initialization.

Factory responsibilities:

- accept configuration parameters
- apply values using "first write wins"
- propagate configuration to dependency factories
- finalize configuration state

Factory methods MUST:

- be defined in constructor using closures
- NOT return any value
- NOT expose configuration objects

Factory is a mutation interface only.

### Wrapper

Default export instantiated by DI.

Wrapper MUST return a proxy object.

The proxy is the only allowed read interface.

The proxy MUST:

- read values from internal state
- reject access before initialization
- reject all mutations
- reject structural operations

The proxy MUST use a facade object independent from configuration state.

## Dependency Integration

Runtime configuration is fully integrated with DI.

Dependencies are declared as:

```javascript
export const __deps__ = Object.freeze({
  Factory: Object.freeze({
    depData: "Ns_Dep_Config_Runtime$",
    depFactory: "Ns_Dep_Config_Runtime__Factory$",
  }),
});
```

A configuration component depends on:

- dependency configuration data
- dependency factory

Configuration composition is performed only through these dependencies.

Direct instantiation is not allowed.

## Hierarchical Composition

Configuration hierarchy MUST be built through DI.

Rules:

- parent components receive child configuration via injection
- parent components propagate configuration via dependency factories
- configuration graph matches DI graph

Example:

```
cfg.dep = injectedDependencyConfig
```

No other form of composition is allowed.

## Initialization Model

Initialization is distributed.

Multiple modules may contribute configuration values.

Rules:

- configuration may be written from multiple locations
- each property follows "first write wins"
- writes are allowed only before freeze
- reads are allowed only after freeze

Initialization phases:

1. configure phase
2. freeze phase

## Immutability

Immutability is enforced by the proxy.

Rules:

- no reads before freeze
- no writes at any time
- no structural changes
- no freezing of wrapper

After freeze:

- internal state is frozen
- configuration becomes immutable

## Factory Lifecycle

Factory exposes two operations:

### configure(params)

- applies configuration values
- propagates configuration to dependencies
- does not return a value

### freeze()

- finalizes configuration
- recursively finalizes dependencies
- is idempotent
- does not return a value

## Access Model

Configuration access is strictly defined:

- reads MUST be performed through injected proxy
- direct access to internal state is forbidden
- factory MUST NOT be used for reading

This enforces separation:

- write path → Factory
- read path → Wrapper proxy

## Type Map Integration

Types are exposed through type map:

```
type Ns_Pkg_Config_Runtime = import("./src/Config/Runtime.mjs").Data;
type Ns_Pkg_Config_Runtime$Factory = import("./src/Config/Runtime.mjs").Factory;
```

## Canonical Runtime Configuration Module

```javascript
// Ns_Pkg_Config_Runtime => ./src/Config/Runtime.mjs
// types.d.ts: type Ns_Pkg_Config_Runtime = import("./src/Config/Runtime.mjs").Data;
// types.d.ts: type Ns_Pkg_Config_Runtime$Factory = import("./src/Config/Runtime.mjs").Factory;

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

/** @type {object} */
const facade = {};

let frozen = false;

/** @type {Ns_Pkg_Config_Runtime} */
const proxy = new Proxy(facade, {
  get(_target, prop) {
    const isServiceProp = prop === "then" || typeof prop === "symbol";
    if (!frozen && !isServiceProp) {
      throw new Error("Runtime configuration is not initialized.");
    }
    return Reflect.get(cfg, prop);
  },
  set() {
    throw new Error("Runtime configuration is immutable.");
  },
  defineProperty() {
    throw new Error("Runtime configuration wrapper is immutable.");
  },
  deleteProperty() {
    throw new Error("Runtime configuration wrapper is immutable.");
  },
  preventExtensions() {
    throw new Error("Runtime configuration wrapper cannot be frozen.");
  },
});

/**
 * Runtime configuration wrapper component.
 */
export default class Wrapper {
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

      if (cfg.port === undefined && params.PORT !== undefined) {
        cfg.port = Number(params.PORT);
      }

      if (cfg.host === undefined && params.HOST !== undefined) {
        cfg.host = String(params.HOST);
      }

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

/**
 * Dependency descriptor for DI container.
 */
export const __deps__ = Object.freeze({
  Factory: Object.freeze({
    depData: "Ns_Dep_Config_Runtime$",
    depFactory: "Ns_Dep_Config_Runtime__Factory$",
  }),
});
```

## Summary

Runtime configuration in TeqFW is a DI-native mechanism for building application configuration as a deterministic graph of components.

The system enforces:

- strict module structure
- DI-only composition
- distributed initialization
- centralized read access
- immutable final state

The structure is fixed and platform-defined. Deviations are not allowed, as they break compatibility with DI and agent-driven development.
