# Implementation Layout of `src/`

Path: `ctx/docs/code/layout/files/src.md`
Version: `20260304`

## 1. Scope

This document defines structural invariants governing the implementation layout inside the `src/` directory of a TeqFW project.

The document specifies directory structure, namespace mapping rules, naming conventions, and structural constraints applied to source modules.

The document defines structural rules only and does not define architecture, runtime behavior, or component responsibilities.

All implementation modules of the project MUST reside inside `src/`.

All implementation modules MUST use the `.mjs` extension.

## 2. Canonical Minimal Structure

The minimal structural form of `src/` is:

```text
src/
  Enum/
  Dto/
```

The directories `Enum/` and `Dto/` are mandatory.

Additional directories and modules MAY exist.

Directories inside `src/` MUST exist only when required by namespace mapping or structural clarity.

Artificial directory creation is prohibited.

## 3. Namespace Mapping

All implementation modules are addressed by a namespace identifier.

A namespace identifier has the form:

```text
Ns_Pkg_Part_Component
```

The namespace prefix `Ns_Pkg_` identifies the package namespace and is defined in `package.json`.

During namespace-to-path resolution the namespace prefix is removed.

The remaining namespace segments map directly to directories and file names inside `src/`.

Mapping rule:

```text
Ns_Pkg_Part_Component → src/Part/Component.mjs
```

Each namespace segment corresponds to one directory level.

The final namespace segment becomes the module file name.

Directory nesting depth is not restricted.

## 4. Reserved Namespace Segments

Two namespace segments are structurally reserved.

### 4.1 `Enum`

Modules with namespace segment `Enum` represent enumerations.

Example:

```text
Ns_Pkg_Enum_Status → src/Enum/Status.mjs
```

Rules:

- modules inside `src/Enum/` MUST represent enumerations
- auxiliary modules are prohibited inside `Enum/`

### 4.2 `Dto`

Modules with namespace segment `Dto` represent data transfer objects.

Example:

```text
Ns_Pkg_Dto_User_Profile → src/Dto/User/Profile.mjs
```

Rules:

- modules inside `src/Dto/` MUST represent DTO structures
- auxiliary modules are prohibited inside `Dto/`

## 5. Naming Rules

### 5.1 File Names

File names MUST follow the following rules:

- file names use PascalCase
- underscore (`_`) characters are prohibited
- the file name corresponds to the final namespace segment

Example of correct structure:

```text
src/Dto/User/Profile.mjs
```

Example of prohibited structure:

```text
src/Dto/User_Profile.mjs
```

The presence of `_` indicates a missing directory boundary.

### 5.2 Directory Names

Directory names MUST follow the following rules:

- directory names use PascalCase
- each directory corresponds to exactly one namespace segment

Directory nesting depth is not restricted.

## 6. Root Module and Same-Named Directory Rule

If a root-level module contains internal structural parts, those parts MUST be placed inside a directory with the same name.

Structure:

```text
Component.mjs
Component/
  PartA.mjs
  PartB.mjs
```

Rules:

- the root module represents the public or orchestration boundary of the component
- the same-named directory contains internal structural modules

The following structure is prohibited:

```text
Component/Component.mjs
```

This rule prevents namespace duplication and preserves visual hierarchy.

## 7. Root-Level Modules

Root-level modules inside `src/` are permitted.

Example:

```text
src/App.mjs
src/Server.mjs
src/Logger.mjs
```

Root-level modules SHOULD be used only when the number of modules is small and additional hierarchy would not improve structural clarity.

## 8. Module Export Recommendation

An ES module MAY export multiple values.

For structural clarity it is recommended that modules provide a single default export.

This recommendation improves navigation and documentation through IDE tools and JSDoc.

The recommendation does not constitute a structural requirement.

## 9. Structural Restrictions

The following structures are prohibited:

- `src/internal/` directories intended to bypass namespace mapping
- `index.mjs` modules used as implicit entry points
- auxiliary modules inside `Enum/`
- auxiliary modules inside `Dto/`

All modules MUST remain addressable through explicit namespace mapping.

## 10. JSDoc Requirement

JSDoc documentation is mandatory for the entire implementation.

Rules:

- every exported class, factory, function, or object MUST include a top-level JSDoc block
- public methods MUST define `@param` and `@returns`
- constructor dependency descriptors MUST define explicit typedef structures
- DTO structural types SHOULD reference declarations defined in `types.d.ts` when available
- duplicate typedef definitions for existing DTO structures are prohibited
- local variables SHOULD include explicit `@type` annotations when the type is non-trivial

TypeScript source files are prohibited.

JSDoc is the only permitted structural typing mechanism.

## 11. Structural Invariants

A project implementation is structurally compliant only if the following conditions hold simultaneously:

- all runtime modules are located inside `src/`
- all modules use the `.mjs` extension
- namespace identifiers map deterministically to directory paths
- directory names correspond to namespace segments
- file names correspond to final namespace segments
- directories `Enum/` and `Dto/` exist
- modules inside `Enum/` contain only enumerations
- modules inside `Dto/` contain only DTO structures
- `index.mjs` modules are not used
- `internal` directories are not used

Violation of these conditions constitutes structural non-compliance.
