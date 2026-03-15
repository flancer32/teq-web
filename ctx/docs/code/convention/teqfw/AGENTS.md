# TeqFW Conventions

Path: `./ctx/docs/code/convention/teqfw/AGENTS.md`
Template Version: `20260315`

## Purpose

The `ctx/docs/code/convention/teqfw/` directory contains declarative engineering conventions specific to TeqFW component addressing, component classification, configuration composition, module structure, and static typing aids. Documents at this level define stable implementation forms used by TeqFW packages without redefining broader code-level boundaries.

## Level Map

- `AGENTS.md` — this document, defining the boundaries and structure of the `teqfw/` convention level.
- `component-types.md` — architectural component categories used in TeqFW and their normative ES module publication forms.
- `configuration.md` — package-centered configuration model, initialization semantics, and immutability rules for TeqFW applications.
- `es6-modules.md` — normative structural convention for TeqFW DI-compatible ES modules managed by the dependency container.
- `namespaces.md` — canonical addressing convention for TeqFW components using namespace identifiers.
- `types-map.md` — convention for TeqFW type maps that connect namespace identifiers to static type declarations.

The list above is alphabetical and serves navigation purposes.

## Reading Order

For conceptual understanding the documents should be read in the following order:

1. `namespaces.md` — defines the canonical addressing model of components.
2. `component-types.md` — defines architectural component categories used in the system.
3. `configuration.md` — defines package-level configuration composition and runtime initialization semantics.
4. `es6-modules.md` — defines how components are published through ES modules and instantiated by the container.
5. `types-map.md` — defines the static bridge between namespace identifiers and implementation modules used by IDE tooling.

This order reflects the conceptual model of TeqFW:

```
namespace identifier
↓
component type
↓
configuration model
↓
ES module publication
↓
static type mapping
```

## Level Boundary

This level defines TeqFW-specific implementation conventions only. It may refine component addressing, component classification, configuration composition, module form, and static type mapping, but it must not redefine repository topology, product semantics, runtime environment, or agent procedures.

## Summary

`ctx/docs/code/convention/teqfw/AGENTS.md` defines the scope, navigation, and reading order of TeqFW-specific code conventions for namespaces, component types, configuration, DI-compatible modules, and type maps.
