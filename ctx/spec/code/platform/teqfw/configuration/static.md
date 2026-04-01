# Static Configuration Convention

Path: `ctx/spec/code/platform/teqfw/configuration/static.md`
Template Version: `20260329`

## Purpose

This document defines the static configuration convention for TeqFW packages. The contract specifies the structure and ES module pattern used to represent immutable package configuration objects resolved by the DI container.

Static configuration represents constant values defined by the package itself. These values do not depend on runtime environment parameters and remain immutable for the lifetime of the application.

## Static Configuration Concept

Static configuration represents package-level constants and immutable configuration parameters defined by the package implementation.

Static configuration is a Static Data Component.

Static configuration objects belong to individual packages and may form a hierarchical structure that mirrors the dependency graph of packages.

Component type definitions are described in ctx/spec/code/platform/teqfw/component-types.md.

Static configuration:

- is defined by package code
- does not depend on runtime environment variables
- does not require initialization
- remains immutable during application execution

Static configuration objects are resolved through the dependency injection container and exposed to dependent components as read-only values.

## Static Configuration Component

Each package exposing static configuration publishes a configuration component whose namespace identifier follows the pattern:

```
Ns_Pkg_Config_Static
```

The component represents a Static Data Component containing immutable configuration values defined by the package.

The container creates the configuration object once and provides the same instance to all dependent components.

Static configuration components:

- are singletons managed by the container
- contain immutable constant values
- may reference static configuration of dependency packages
- do not require initialization or lifecycle management

## Module Structure

A static configuration module publishes a single container-managed component.

```
default export
```

The default export represents the configuration component resolved by the dependency container.

Unlike runtime configuration modules, static configuration modules:

- do not publish factories
- do not manage lifecycle phases
- do not own module-level configuration state

Configuration values are defined directly in the component structure and become immutable immediately after the instance is created.

Static configuration is immutable and must be frozen.

## Dependency Declaration

Static configuration modules may depend on configuration components of other packages.

Dependencies are declared through the module dependency descriptor.

Example:

```javascript
export const __deps__ = Object.freeze({
  depCfg: "Ns_Dep_Config_Static$",
});
```

The dependency descriptor maps constructor parameters to configuration components resolved by the dependency container.

## Immutability Rules

Static configuration objects become immutable immediately after instantiation.

The constructor must freeze the instance to prevent modification of configuration values.

Prototype mutation must also be prevented by freezing the component prototype before export.

Immutability guarantees that configuration constants remain stable during the entire application lifetime.

## Type Map Integration

Static configuration components are exported through the package type map.

Example declaration in `types.d.ts`:

```
type Ns_Pkg_Config_Static = import("./src/Config/Static.mjs").default;
```

This declaration allows IDE tooling and tsserver to resolve configuration types through JSDoc annotations without requiring TypeScript in the implementation.

## Canonical Static Configuration Module

The following module illustrates the canonical implementation pattern for static configuration in a TeqFW package.

```javascript
// Ns_Pkg_Config_Static => ./src/Config/Static.mjs
// types.d.ts: type Ns_Pkg_Config_Static = import("./src/Config/Static.mjs").default;

export const __deps__ = Object.freeze({
  depCfg: "Ns_Dep_Config_Static$",
});

/**
 * Static configuration constants for the package.
 */
class Ns_Pkg_Config_Static {
  /** @type {string} */
  name = "pkg";

  /** @type {number} */
  defaultPort = 3000;

  /** @type {Ns_Dep_Config_Static} */
  dep;

  /**
   * @param {object} deps
   * @param {Ns_Dep_Config_Static} deps.depCfg
   */
  constructor({ depCfg }) {
    this.dep = depCfg;
    Object.freeze(this);
  }
}

Object.freeze(Ns_Pkg_Config_Static.prototype);

export default Ns_Pkg_Config_Static;
```

## Summary

Static configuration components represent immutable package-level constants exposed through the dependency injection container.

A static configuration module:

- publishes a single configuration component
- defines constant values directly in the component structure
- receives configuration dependencies through DI
- freezes the instance immediately after construction
- does not implement lifecycle management or factories

This structure provides deterministic configuration behavior while keeping static configuration independent from runtime initialization logic.
