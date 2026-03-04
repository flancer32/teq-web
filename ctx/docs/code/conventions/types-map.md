# Type Maps in TeqFW

Path: `ctx/docs/code/conventions/types-map.md`
Version: `20260304`

## 1. Purpose

A type map provides a static bridge between:

- architectural namespace identifiers used by the dependency container
- concrete JavaScript implementation files

Type maps exist solely to support:

- IDE navigation
- static analysis
- JSDoc type inference
- automated analysis by development agents

Type maps do not participate in runtime execution and do not influence dependency resolution.

They exist only for static tooling.

## 2. Architectural context

TeqFW architecture separates two domains.

Runtime domain:

```
namespace identifiers
```

Static analysis domain:

```
files and types
```

Runtime code resolves dependencies using namespace identifiers through the DI container.

Static tooling operates on files and types.

The type map bridges these domains without introducing runtime coupling.

## 3. Definition

A type map is a deterministic mapping:

```
Namespace identifier → implementation class
```

Each mapping references the JavaScript source file that defines the implementation class.

Example:

```ts
type Ns_Component = import("./src/Component.mjs").default;
```

The namespace identifier represents the **instance type** of the class.

The constructor type can be obtained using the standard TypeScript expression:

```
typeof Ns_Component
```

The type map itself does not define structure or behavior. All structural information is derived from the referenced implementation file.

## 4. One package — one type map

Every npm package that exposes namespace-addressable components MUST provide exactly one type map.

Convention:

```
types.d.ts
```

Referenced in `package.json`:

```json
{
  "types": "types.d.ts"
}
```

## 5. Public API vs internal bindings

Type maps contain two categories of declarations.

### 5.1 Public namespace API

Public namespace identifiers represent architectural entities intentionally exposed by the package.

These identifiers are declared in the global type namespace.

Example:

```ts
declare global {
  type Ns_Service = import("./src/Service.mjs").default;
}
```

Public namespace identifiers:

- are globally visible
- may be referenced by other packages
- form the type-level API of the package
- must remain stable across compatible versions

Renaming or removing a public namespace identifier constitutes a breaking change.

### 5.2 Internal bindings

Internal bindings support IDE navigation inside the package implementation.

They are declared as module-scoped exports.

Example:

```ts
export type Ns_Component = import("./src/Component.mjs").default;
```

Internal bindings:

- are not globally visible
- are not part of the package API
- may change freely between versions.

## 6. Canonical mapping rules

### 6.1 Namespace identifier → instance type

Each namespace identifier maps to the **instance type** of the implementation class.

Canonical form:

```ts
type Ns_Component = import("./src/Component.mjs").default;
```

This matches the standard TypeScript interpretation of class types.

### 6.2 Constructor type

The constructor type is derived using the standard expression:

```
typeof Ns_Component
```

Example:

```js
/** @type {typeof Ns_Component} */
const ComponentClass = ...
```

No additional aliases are required.

## 7. Namespace → file path rule

Namespace identifiers must correspond deterministically to source files.

Rule:

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

This rule allows agents to derive source paths automatically.

The type map must not contradict this rule.

## 8. Deterministic file structure

The structure of `types.d.ts` must be deterministic.

The file contains two sections:

```
INTERNAL TYPE BINDINGS
PUBLIC GLOBAL API
```

Example:

```ts
/* ===== INTERNAL TYPE BINDINGS ===== */

export type Ns_Component = import("./src/Component.mjs").default;

/* ===== PUBLIC GLOBAL API ===== */

declare global {
  type Ns_Service = import("./src/Service.mjs").default;
}

export {};
```

Entries inside each section must be sorted alphabetically by namespace identifier.

## 9. Allowed declaration forms

Only the following declaration forms are allowed.

Instance type mapping

```
type Ns_Component =
  import("./src/...").default;
```

Global instance type mapping

```
declare global {
  type Ns_Component =
    import("./src/...").default;
}
```

No other type declarations are allowed.

In particular, type maps must not contain:

- interfaces
- custom type definitions
- method signatures
- structural declarations.

## 10. Agent generation

The type map is a **generated artifact**.

Agents must generate and maintain the file automatically.

Manual edits may be overwritten.

The type map must be generated from:

```
namespace registry
+
source file structure
```

Generation algorithm:

1. read namespace identifiers from the namespace registry
2. derive source file paths using the namespace → path rule
3. verify that the file exists
4. generate instance type mapping
5. classify mapping as public or internal
6. sort entries alphabetically
7. write deterministic file structure.

## 11. Agent validation rules

Agents must validate the following invariants:

1. every public namespace identifier appears in the type map
2. referenced source files exist
3. namespace → path rule is satisfied
4. global declarations correspond only to public API identifiers
5. no duplicate namespace identifiers exist
6. entries are sorted deterministically.

Violation of these rules indicates architectural inconsistency.

## 12. IDE integration

When a package declares:

```
"types": "types.d.ts"
```

VSCode automatically loads the type map and:

1. resolves `import()` references
2. derives type information from source files
3. exposes public namespace identifiers globally.

No additional configuration is required.

## 13. Usage example

Application code references namespace identifiers directly.

```js
/**
 * @param {Ns_Service} service
 */
export default function run(service) {
  service.execute();
}
```

Constructor usage:

```js
/** @type {typeof Ns_Service} */
const ServiceClass = ...
```

No imports are required.

## 14. Summary

Type maps bind architectural namespace identifiers to implementation files.

They provide static analysis support while preserving runtime independence.

A type map:

- maps namespace identifiers to instance types
- derives constructor types via `typeof`
- separates public API from internal bindings
- follows deterministic namespace → path rules
- is generated automatically by agents
- can be validated mechanically.

This ensures that TeqFW namespace architecture remains consistent, analyzable, and agent-compatible.
