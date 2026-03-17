# Configuration Conventions in TeqFW Applications

Path: `ctx/docs/code/convention/teqfw/configuration.md`
Template Version: `20260315`

## Purpose

This document defines architectural conventions for configuration in TeqFW applications. The goal is to ensure deterministic configuration behavior in modular monoliths composed of independently developed packages.

Detailed implementation conventions are defined in:

- `ctx/docs/code/convention/teqfw/configuration/static.md` for static configuration components.
- `ctx/docs/code/convention/teqfw/configuration/runtime.md` for runtime configuration components.

## Configuration Model

Configuration in TeqFW is organized as a hierarchical system of configuration objects belonging to individual packages. Each package defines its own configuration structure and does not depend on the configuration structure of the application that uses it.

The complete configuration of an application is therefore a composite formed by the configuration objects of all participating packages.

Configuration flows through the dependency hierarchy of packages. A package is responsible for configuring the configuration objects of the packages it depends on.

## Types of Configuration

TeqFW distinguishes two independent configuration types.

### Static Configuration

Static configuration represents constant values defined by packages. Static configuration does not depend on runtime environment parameters and does not change during application execution.

Static configuration objects are defined by packages and composed through dependency injection without a runtime initialization phase.

### Runtime Configuration

Runtime configuration represents values that must be provided when the application starts. These values typically originate from environment variables or external configuration sources such as JSON or XML.

Runtime configuration objects exist for individual packages and are organized according to the dependency hierarchy of the application.

Runtime configuration values remain immutable after initialization.

## Configuration Scope

Because TeqFW is an isomorphic platform, configuration exists in three execution domains.

### Backend

Backend configuration applies to server-side execution.

### Frontend

Frontend configuration applies to browser execution.

### Shared

Shared configuration applies to both backend and frontend code.

Packages that operate exclusively within one domain may omit explicit domain markers in their namespace.

## Package-Level Configuration

Each package declares its own configuration object. The structure of this object is defined by the package and is independent of the application that uses it.

Packages must not assume how configuration parameters are represented in environment variables or external configuration files. Mapping from external configuration sources to package configuration objects is the responsibility of the application.

## Application-Level Configuration

The application is responsible for initializing the configuration hierarchy.

During application startup the application performs the following steps.

1. External configuration sources are read.
2. The root configuration handler is obtained from the DI container.
3. Configuration values are propagated through the dependency hierarchy.
4. The configuration hierarchy becomes immutable.

After initialization the configuration objects are considered frozen and must not change for the lifetime of the application.

## Configuration Composition

Configuration in a TeqFW application is compositional.

Each package configuration object contains configuration objects of its dependencies. The root configuration object of the application therefore forms a tree whose structure mirrors the dependency graph of packages.

Packages do not know about the application-level configuration object. They operate only on their own configuration objects and on configuration objects of their dependencies.

## Initialization Semantics

Runtime configuration supports cumulative initialization.

Multiple packages may initialize configuration parameters of the same dependency as configuration propagates through the dependency hierarchy. Initialization follows the rule **first write wins**. Once a configuration parameter receives a value it must not be overwritten by subsequent configuration steps.

After configuration propagation completes the entire configuration hierarchy becomes immutable.

## User Preferences

User-specific preferences do not belong to package configuration. User preferences may change during application execution and are therefore treated as a separate layer outside static and runtime configuration.

Typical storage locations include browser storage or application databases.

## Relationship to Dependency Injection

Configuration objects are part of the dependency graph managed by the TeqFW DI container. Configuration handlers are responsible for initializing configuration data and exposing it to dependent components.

Configuration data must not be accessed before initialization completes.

## Summary

Configuration in TeqFW applications follows these principles.

Configuration belongs to packages.
Configuration objects form a hierarchical composite that mirrors package dependencies.
Static and runtime configuration are independent concepts.
Applications map external configuration sources to package configuration objects.
Configuration is initialized once during startup and becomes immutable afterwards.
