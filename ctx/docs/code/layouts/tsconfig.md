# tsconfig — Project Type Analysis Layout

Path: `ctx/docs/code/layout/tsconfig.md`
Version: `20260304`

## 1. Purpose of the Document

This document defines the structure of the `tsconfig.json` file used in TeqFW-based projects.

The configuration is used exclusively for **static analysis of JavaScript sources by IDE tooling** and TypeScript language services.

The configuration does **not compile code** and does **not emit artifacts**.

This document belongs to the **code/layouts** level of the ADSM documentation and defines the canonical structure of `tsconfig.json` used in the project.

It does not define runtime behavior, architecture, environment configuration, or product semantics.

## 2. Generation Model

The `tsconfig.json` file is a **generated artifact**.

The authoritative definition of its structure is located in this document:

```
ctx/docs/code/layout/tsconfig.md
```

Agents generating `tsconfig.json` must treat this document as the single source of truth.

Generation workflow:

1. Read this document.
2. Extract the canonical configuration structure.
3. Generate the `tsconfig.json` file accordingly.

Manual edits of `tsconfig.json` are not considered authoritative.

If a discrepancy appears between `tsconfig.json` and this document, the structure defined in this document takes precedence.

## 3. Role of tsconfig in TeqFW Projects

Within TeqFW projects, `tsconfig.json` is used exclusively as an **IDE static analysis configuration**.

Its purpose is to enable TypeScript language services (`tsserver`) to perform:

- type checking of JavaScript via JSDoc;
- validation of module imports;
- IDE navigation and symbol resolution;
- validation of Node.js built-in module references.

The configuration does **not produce compiled JavaScript**.

All production code remains standard ECMAScript modules.

## 4. JavaScript Type Checking Mode

TeqFW projects use TypeScript only as a **type analysis engine for JavaScript**.

The following options are mandatory:

```
checkJs: true
noEmit: true
```

Meaning:

- `checkJs: true` enables type checking of `.js` / `.mjs` files using JSDoc annotations.
- `noEmit: true` disables compilation output.

The TypeScript compiler must never emit JavaScript code.

## 5. Module System Configuration

The configuration must match the Node.js ESM execution model used by the project.

Required options:

```
module: nodenext
moduleResolution: nodenext
target: ESNext
```

These options ensure that TypeScript language services correctly resolve:

- ECMAScript modules
- Node.js `node:` module specifiers
- `.mjs` files
- ESM import behavior used by Node.js.

## 6. Project Root Resolution

The configuration must define the project root directory.

```
baseUrl: "."
```

This ensures consistent resolution of local module paths and `paths` mappings.

## 7. Type Map Integration

TeqFW projects expose a **type mapping file** used for IDE navigation.

The following file is mandatory:

```
types.d.ts
```

The file contains namespace-to-file mappings used by IDE tooling to resolve dependency identifiers used by the DI container.

Example mapping:

```
paths:
  "@teqfw/web-types": ["types.d.ts"]
```

The exact alias may differ between packages but must always reference `types.d.ts`.

## 8. Node.js Type Definitions

TeqFW projects rely on Node.js built-in modules such as:

```
node:http
node:fs
node:path
node:stream
node:test
```

TypeScript language services cannot resolve these modules without Node.js type definitions.

Therefore the project **must include the Node.js types package**:

```
@types/node
```

in `devDependencies`.

Example:

```
devDependencies:
  @types/node ^20
```

Without this package IDE tooling may report errors such as:

```
Cannot find module 'node:http'
```

The version of `@types/node` should correspond to the Node.js runtime used by the project.

Example:

```
Node runtime: >=20
Types package: @types/node ^20
```

This dependency affects only development tooling and has no impact on runtime execution.

## 9. Source Scope

The configuration must explicitly include all directories participating in type analysis.

Required entries:

```
src
test
types.d.ts
```

Meaning:

- `src` — production source code
- `test` — unit and integration tests
- `types.d.ts` — namespace type map used by IDE tooling

All TeqFW projects include test directories.

## 10. Canonical tsconfig.json Structure

The following JSON fragment represents the canonical structure used by agents when generating the configuration.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "checkJs": true,
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "noEmit": true,
    "target": "ESNext",

    "paths": {
      "@project/types": ["types.d.ts"]
    }
  },

  "include": ["src", "test", "types.d.ts"]
}
```

The exact alias used in `paths` may vary between projects but must always reference `types.d.ts`.

## 11. Summary

The `tsconfig.json` file defines the static analysis configuration used by IDE tooling in TeqFW projects.

It enables:

- JSDoc-based type checking of JavaScript;
- correct resolution of ECMAScript modules;
- IDE navigation through DI namespace mappings;
- validation of Node.js built-in modules.

The configuration never compiles code and never produces output artifacts.

The `tsconfig.json` file is generated from this document and must remain consistent with the layout defined here.
