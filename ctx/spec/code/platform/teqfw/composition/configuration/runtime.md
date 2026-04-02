# Runtime Configuration Convention

- Path: `ctx/spec/code/platform/teqfw/composition/configuration/runtime.md`
- Version: `20260402`

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
- the same configuration state may be reachable through multiple DI paths
- DI paths are aliases to the same runtime state, not independent copies
- finalization composes frozen child wrappers into parent state from leaves toward the root

Runtime configuration is a Runtime Data Component.

## Documentation Requirement

Every runtime configuration parameter exposed by an npm package MUST be documented in the package `README.md`.

The `README.md` entry for each runtime configuration parameter MUST identify the environment variable name and the role of the parameter in runtime behavior.

If a runtime configuration component adds, removes, or changes a public runtime parameter, the package `README.md` MUST be updated in the same iteration.

## Architectural Model

Runtime configuration in TeqFW follows a strict model:

- each configuration node is a DI component with one underlying state object and one read wrapper
- the configuration hierarchy matches the DI dependency graph
- modules do not construct configuration subtrees manually
- configuration composition is performed only through DI and freeze propagation
- a runtime node may be exposed through multiple DI paths, but all paths must resolve to the same underlying state object and wrapper identity for that node

This model is required for deterministic behavior in modular monolith applications.

## Package Dependency Composition

Runtime configuration is package-scoped and composes along package dependencies.

Rules:

- each package owns its own runtime configuration node
- a package injects runtime configuration from each direct dependency
- a package configures its own runtime node and initializes direct dependency factories during freeze
- direct dependency runtime wrappers are reachable through the package's own runtime node
- transitive runtime configuration is reached by propagating initialization through the dependency chain
- the host application initializes only the root runtime node of its package branch
- the host application does not need to know the internal runtime configuration structure of transitive dependencies

This means package runtime configuration is a chained graph, not a flat registry.
Each package writes values to its own node during configure and finalizes direct dependencies during freeze.
When direct dependencies freeze, they return frozen wrappers that are then assigned into the parent node.

## Structural Constraints

A runtime configuration module MUST:

- export `Data`, `Factory`, and `Wrapper` (default export)
- export `__deps__` only when `Factory` has container-managed dependencies
- NOT declare any additional classes or constructors
- NOT define nested configuration classes
- NOT instantiate configuration substructures using `new`
- NOT implement configuration trees as plain objects

A module represents exactly one configuration node.

Nested configuration MUST be implemented as separate runtime configuration components and injected via DI.
The parent node may store a reference to the frozen wrapper of a dependency node.

## Module Structure

A runtime configuration module publishes:

```
Data
Factory
Wrapper (default export)
__deps__ (optional)
```

The structure is fixed and MUST NOT be altered.

### Data

Defines internal configuration state.

Rules:

- contains only primitive values or references to frozen dependency wrappers
- contains no logic
- does not instantiate objects
- does not depend on local helper classes
- does not assign default values at declaration time

Data is mutable only during initialization.

### Factory

Controls configuration initialization.

Factory responsibilities:

- accept configuration parameters
- apply values using "first write wins"
- assign default values during freeze if fields remain unset
- freeze dependency factories before freezing the current node
- assign frozen dependency wrapper into the current node if the slot is still empty
- finalize configuration state

Factory methods MUST:

- be defined in constructor using closures
- return only platform-defined results
- NOT expose configuration objects

`configure()` is a mutation operation only. `freeze()` finalizes the node and returns the read wrapper for the same underlying state.

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
    depFactory: "Ns_Dep_Config_Runtime__Factory$",
  }),
});
```

A configuration component depends on:

- dependency factory

Configuration composition is performed only through these dependencies.

Direct instantiation is not allowed.

## Hierarchical Composition

Configuration hierarchy MUST be built through DI.

Rules:

- parent components receive child configuration via injection
- parent components propagate configuration via dependency factories
- configuration graph matches DI graph
- runtime configuration follows package dependency edges, not a flat application-wide registry
- a package configures its own node and the nodes of its direct dependencies
- freeze proceeds bottom-up: child factories freeze before parent factories freeze
- a frozen child state is assigned to the parent node after child freeze completes
- transitive dependency nodes are initialized when the dependency chain is traversed

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
- freezing a node freezes its dependencies first
- the resulting frozen dependency state becomes available to the parent node
- the same frozen state may be exposed through multiple container access paths
- `freeze()` returns the wrapper for the same underlying state that container paths resolve to

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
- all DI paths that resolve to the same node observe the same frozen state
- wrappers remain read-only aliases over the frozen state

## Factory Lifecycle

Factory exposes two operations:

### configure(params)

- applies configuration values
- does not return a value

### freeze()

- finalizes configuration
- assigns default values before finalizing dependencies
- recursively finalizes dependencies
- returns the read wrapper of the frozen node
- does not expose mutable state
- is idempotent

## Access Model

Configuration access is strictly defined:

- reads MUST be performed through injected proxy
- direct access to internal state is forbidden
- factory MUST NOT be used for reading
- multiple proxies or DI paths may resolve to the same underlying state
- the wrapper is a read-only alias, not a copy of state
- `freeze()` returns the same wrapper identity that the container path exposes for the frozen node

This enforces separation:

- write path → Factory
- read path → Wrapper proxy

## Type Map Integration

Types are exposed through type map:

```
type Ns_Pkg_Config_Runtime = import("./src/Config/Runtime.mjs").Data;
type Ns_Pkg_Config_Runtime__Factory = import("./src/Config/Runtime.mjs").Factory;
```

For runtime configuration, the plain namespace type alias intentionally maps to `Data`.
The default export `Wrapper` is a DI transport layer returning a proxy over the same configuration state.
Static typing therefore describes the configuration shape through `Data`, while CDC resolution exposes the wrapper singleton for runtime access.

## Canonical Runtime Configuration Module

```javascript
// Ns_Pkg_Config_Runtime => ./src/Config/Runtime.mjs
// types.d.ts: type Ns_Pkg_Config_Runtime = import("./src/Config/Runtime.mjs").Data;
// types.d.ts: type Ns_Pkg_Config_Runtime__Factory = import("./src/Config/Runtime.mjs").Factory;

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
   * @param {Ns_Dep_Config_Runtime__Factory} deps.depFactory
   */
  constructor({ depFactory }) {
    this.configure = function (params = {}) {
      if (frozen) throw new Error("Runtime configuration is frozen.");

      if (cfg.port === undefined && params.port !== undefined) {
        cfg.port = Number(params.port);
      }
      if (cfg.host === undefined && params.host !== undefined) {
        cfg.host = String(params.host);
      }
    };

    this.freeze = function () {
      if (frozen) return proxy;

      if (cfg.port === undefined) cfg.port = 3000;
      if (cfg.host === undefined) cfg.host = "127.0.0.1";

      cfg.dep = depFactory.freeze();

      frozen = true;
      Object.freeze(cfg);
      return proxy;
    };
  }
}

/**
 * Dependency descriptor for DI container.
 */
export const __deps__ = Object.freeze({
  Factory: Object.freeze({
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
