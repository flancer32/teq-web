# Type Maps in TeqFW

- Path: `ctx/spec/code/platform/teqfw/addressing/types-map.md`
- Version: `20260402`

## 1. Purpose

A type map provides a static bridge between architectural namespace identifiers used by TeqFW and concrete JavaScript implementation modules.

Type maps exist solely for static tooling and support:

- IDE navigation
- static analysis
- JSDoc type inference
- automated analysis by development agents

Type maps do not participate in runtime execution and do not influence dependency resolution.

## 2. Addressing Domains

TeqFW uses several related but distinct addressing domains. They must remain strictly separated.

### 2.1 Runtime namespace

Runtime namespace identifiers address architectural components.

Example:

```
TeqFw_Di_Resolver
TeqFw_Di_Service_Logger
TeqFw_Di_Enum_Life
```

Properties:

- identifies components
- used as the base identity for container resolution
- contains no lifecycle markers
- contains no export selector by itself

### 2.2 CDC

CDC addresses concrete runtime resolution targets derived from a namespace.

Example:

```
TeqFw_Di_Resolver$
TeqFw_Di_Resolver__Factory$$
TeqFw_Di_Enum_Life__CONST
```

Properties:

- used only by the dependency container
- starts with the runtime namespace identifier
- may add `__Export` for named export selection
- may add `$` or `$$` for lifecycle selection
- may add `$$$Wrapper` for whole-module wrapper selection without lifecycle modifiers

### 2.3 Module address space

Module addresses identify ES modules in the filesystem.

Example:

```
./src/Resolver.mjs
./src/Service/Logger.mjs
./src/Enum/Life.mjs
```

Properties:

- represents filesystem paths
- used by the JavaScript module loader
- independent from runtime namespace identifiers and CDC

### 2.4 Type namespace

Type identifiers exist only for static analysis.

Example:

```
TeqFw_Di_Resolver
TeqFw_Di_Resolver__Config
TeqFw_Di_Enum_Life
```

Properties:

- used only by IDE tooling and tsserver
- may reference named exports through `__Export`
- must not contain `$`, `$$`, or `$$$`
- must not be interpreted as CDC dependency identifiers

## 3. Namespace Separation

The namespace identifier always identifies the component.

Export selection uses the same rule in runtime and static addressing:

```
Namespace_Component__Export
```

Only CDC adds runtime semantics after component and export selection.

Consequences:

- namespace identity is shared between runtime and static addressing
- `__Export` has the same meaning in CDC and in type aliases
- lifecycle and wrapper markers belong only to CDC
- static type aliases never encode runtime lifecycle semantics

## 4. Symbolic Component Addressing

TeqFW uses symbolic addressing for runtime components.

Runtime namespace identifiers do not represent module names or file paths.
They represent abstract component identities resolved by the dependency container.

Example:

```
TeqFw_Di_Service_Logger
```

This identifier does not directly reference a file.
Instead it identifies a component that the container resolves using deterministic namespace mapping rules.

Resolution process:

```
symbolic component identifier
        ↓
namespace → path transformation
        ↓
module file
        ↓
component instance
```

This separation ensures that:

- component identifiers remain stable even if file structure changes
- dependency identifiers remain architectural concepts
- runtime resolution remains independent from module loader semantics

TeqFW therefore distinguishes four independent layers:

- symbolic component addressing (runtime namespace)
- CDC runtime addressing
- module addressing (filesystem paths)
- type addressing (static analysis)

Only CDC participates in dependency resolution.

## 5. Type Map Definition

A type map is a deterministic mapping between architectural namespace identifiers and module types.

Example:

```ts
type Ns_Component = import("./src/Component.mjs").default;
```

Each mapping references the JavaScript module implementing the component.

The type map does not define behavior or structure. Structural information is derived from the referenced implementation module.

## 6. Type Map File

Each npm package exposing namespace-addressable components contains exactly one type map file.

Convention:

```
types.d.ts
```

The file must be referenced in `package.json`.

```json
{
  "types": "types.d.ts"
}
```

## 7. Global Type Registry

All type aliases defined in the type map are declared in the global type namespace.

This is required because JSDoc annotations cannot reference module-scoped type exports.

Example:

```ts
declare global {
  type Ns_Component = import("./src/Component.mjs").default;
}
```

### Module invariant

The `types.d.ts` file must end with:

```ts
export {};
```

This ensures:

- the declaration file is treated as a module
- global namespace augmentation remains stable
- IDE type resolution functions correctly

## 8. Namespace Mapping Rules

Namespace identifiers correspond deterministically to source modules.

### 8.1 Namespace → File Path

Namespace identifiers map to file paths using the rule:

```
Namespace prefix removed
Underscore "_" → directory separator "/"
```

Example:

```
Ns_Module_Service
→
src/Module/Service.mjs
```

The type map must not contradict this rule.

### 8.2 Class Component Mapping

For class-based modules the namespace identifier maps to the instance type of the default export.

```ts
type Ns_Component = import("./src/Component.mjs").default;
```

Constructor type may be obtained using:

```
typeof Ns_Component
```

### 8.3 Enum Component Mapping

Enum modules export constant value objects.

The namespace identifier maps to the value type of the exported object.

```ts
type Ns_Enum = typeof import("./src/Enum/Name.mjs").default;
```

### Structural Alias Exception

Some platform-defined module conventions publish a default export that exists only as a runtime wrapper over another structural type exposed by the same module.

In such cases, the plain namespace type alias may intentionally map to that structural type instead of the default export wrapper type.

Canonical example:

```ts
type Ns_Pkg_Config_Runtime = import("./src/Config/Runtime.mjs").Data;
```

In this convention:

- the static alias describes the configuration data shape
- CDC still resolves the default export wrapper for runtime access
- the exception must be defined by the component convention, not inferred ad hoc

### 8.4 Named Export Aliases

Named exports are referenced using the convention:

```
Namespace__ExportName
```

Example:

```ts
type Ns_Component__Config = import("./src/Component.mjs").Config;
```

Properties:

- `__` separates component namespace from export selector
- the alias exists only in the type namespace
- the export selector has the same meaning as in CDC
- lifecycle and wrapper markers are not allowed in static aliases

### 8.5 Nested Module Mapping

If a concept is implemented as a separate module file it becomes a normal namespace component.

Example file:

```
src/Dto/Resolver/Config/DTO.mjs
```

Namespace:

```
TeqFw_Di_Dto_Resolver_Config_DTO
```

Mapping:

```ts
type TeqFw_Di_Dto_Resolver_Config_DTO = import("./src/Dto/Resolver/Config/DTO.mjs").default;
```

Such identifiers belong to the runtime namespace and therefore must not contain lifecycle or export-selection markers.

## 9. Deterministic File Structure

The `types.d.ts` file has a deterministic structure.

The file contains a single global declaration block.

Example:

```ts
declare global {
  type Ns_Component = import("./src/Component.mjs").default;

  type Ns_Component__Options = import("./src/Component.mjs").Options;

  type Ns_Enum = typeof import("./src/Enum/Life.mjs").default;
}

export {};
```

Entries must be sorted alphabetically by type identifier.

## 10. Allowed Declaration Forms

Only the following declaration forms are allowed.

Class component mapping

```ts
type Ns_Component =
  import("./src/...").default;
```

Enum value mapping

```ts
type Ns_Enum =
  typeof import("./src/...").default;
```

Named export alias

```ts
type Ns_Component__Export =
  import("./src/...").Export;
```

Type maps must not contain:

- interfaces
- structural type definitions
- method signatures
- custom type declarations

## 11. Generation Rules

The type map is a generated artifact.

Agents generate the file from:

```
namespace registry
+
source file structure
```

Generation algorithm:

1. read namespace identifiers from the namespace registry
2. derive source file paths using the namespace → path rule
3. verify that source files exist
4. detect module structure
5. generate the appropriate type mapping
6. generate aliases for named exports when required
7. sort entries alphabetically
8. produce deterministic file structure

Manual edits may be overwritten by generators.

## 12. Generation Invariants

The generated file must satisfy the following invariants:

- every namespace identifier has a corresponding default-export type alias
- every required named export alias uses `__Export`
- referenced source files exist
- namespace → path rule holds
- no duplicate type identifiers exist
- entries are sorted alphabetically
- `$`, `$$`, and `$$$` never appear in type aliases
- the file ends with `export {}`

## 13. IDE Integration

When a package declares:

```json
"types": "types.d.ts"
```

VSCode automatically loads the type map and:

- resolves `import()` references
- derives type information from implementation modules
- exposes type aliases globally

## 14. Summary

Type maps bind architectural namespace identifiers to implementation modules while remaining independent from runtime dependency resolution.

A type map:

- maps namespace identifiers to module types
- supports class components and enum modules
- supports named export aliases using `Namespace__Export`
- declares all types globally for JSDoc compatibility
- follows deterministic namespace → file path rules
- keeps CDC lifecycle markers out of static type aliases
- is generated automatically
- ends with `export {}`

The structure is deterministic and can be validated mechanically.
