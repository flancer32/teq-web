# package.json — Library Package Layout

Path: `ctx/docs/code/layouts/package-json.md`

## 1. Purpose of the Document

This document describes the structure of the `package.json` file used in the `@flancer32/teq-web` package.

It explains how package metadata, dependency declarations, namespace configuration, and development tooling are organized within this project.

This document belongs to the **code/layouts** level of the ADSM documentation and describes the engineering layout of the project.

It does not define reusable conventions, product semantics, architecture, execution model, or environment conditions.

## 2. Generation Contract

The `package.json` file of this package is a generated artifact.

The authoritative definition of its structure is located in this document:

`ctx/docs/code/layouts/package-json.md`

Agents treat this document as the single source of truth for the structure and values of `package.json`.

Generation workflow:

1. Read this document.
2. Extract the structural layout and fixed metadata values.
3. Generate the `package.json` file accordingly.

Manual edits of `package.json` are not considered authoritative.

If a discrepancy appears between `package.json` and this document, the structure defined in this document takes precedence.

### Version Handling

The `version` field may evolve during the lifecycle of the package.

Agents may update the version according to semantic versioning rules while preserving the structural layout defined in this document.

## 3. Role of package.json in This Project

Within this project, `package.json` serves as the central metadata and tooling configuration file.

It performs the following functions:

- defines npm identity of the package;
- declares ECMAScript module mode;
- exposes the type map used by IDE tooling;
- registers the dependency injection namespace used by the DI container;
- declares runtime dependencies;
- declares development tooling;
- defines test execution scripts;
- defines the publication scope of the npm distribution.

The package is a **library module** and therefore does not define a runtime entrypoint.

## 4. Package Identity

The package identity is defined as:

```
name: @flancer32/teq-web
version: 0.5.0
```

The `version` value may change as the package evolves and is maintained during the development process.

The version follows semantic versioning.

The package name reflects its role as the web coordination infrastructure module within the TeqFW ecosystem.

## 5. Identity Metadata Contract

The following identity metadata remains stable when regenerating `package.json`.

Fixed values:

```
name: @flancer32/teq-web
license: Apache-2.0
```

Author metadata:

```
author:
  name: Alex Gusev
  email: alex@flancer64.com
  url: https://github.com/flancer64
```

Repository metadata:

```
repository:
  type: git
  url: git+https://github.com/flancer32/teq-web.git
```

Project links:

```
homepage: https://github.com/flancer32/teq-web
bugs:
  url: https://github.com/flancer32/teq-web/issues
```

The following fields may evolve as the project develops:

```
version
description
keywords
```

These fields describe the published artifact and do not influence runtime behavior.

## 6. Module System

The project operates exclusively in ECMAScript module mode.

```
"type": "module"
```

Production modules use the `.mjs` extension.

This configuration ensures compatibility with the TeqFW dependency injection container.

## 7. Type Map

The package exposes a type map used by IDE tooling.

```
"types": "types.d.ts"
```

The `types.d.ts` file provides namespace-to-file mappings used for static analysis and source navigation.

This mechanism supports developer tooling and does not participate in runtime execution.

## 8. Dependency Injection Namespace

The project registers the following namespace mapping:

```
prefix: Fl32_Web_
path: ./src
ext: .mjs
```

This mapping defines the namespace root used by the TeqFW dependency injection container.

It connects dependency identifiers with the physical location of runtime modules.

## 9. Runtime Dependencies

The package declares the following runtime dependency:

```
@teqfw/di
```

This dependency provides the dependency injection container used by the TeqFW ecosystem.

No additional runtime dependencies are currently required.

## 10. Development Dependencies

Development dependencies include tools used during development but not required during runtime.

The project currently uses:

```
eslint
```

### Node.js Type Definitions

Because the project targets the Node.js runtime and uses Node built-in modules, the development environment must include Node.js type definitions.

The following package must be present in `devDependencies`:

```
@types/node
```

Example:

```
"devDependencies": {
  "@types/node": "^20",
  "eslint": "^9.0.0"
}
```

The `@types/node` package provides type declarations for Node.js built-in modules and enables correct operation of IDE language services such as **tsserver**.

Without this package, IDE tooling may fail to resolve Node built-in modules referenced using the `node:` specifier.

Examples:

```
node:http
node:fs
node:path
node:stream
node:crypto
node:test
```

These identifiers may appear in:

- JSDoc type annotations;
- TypeScript declaration files (`types.d.ts`);
- static analysis performed by IDE tooling.

If `@types/node` is not installed, IDE tooling may produce errors such as:

```
Cannot find module 'node:http'
```

The `@types/node` dependency affects only development tooling and does not influence runtime execution.

The version of `@types/node` should correspond to the Node.js runtime version targeted by the project.

Example:

```
Node runtime: >=20
Types package: @types/node ^20
```

## 11. Test Environment

Testing is performed using the built-in Node.js test runner.

Test environments:

```
./test/unit
./test/accept
```

The following npm scripts are used:

```
test:unit
test:integration
test
```

These scripts support development workflow.

### Unit Test Script Contract

The `test:unit` script must discover test files recursively without relying on shell globstar expansion.

Required form:

```
"test:unit": "find test/unit -name '*.test.mjs' -print0 | xargs -0 node --test"
```

This form ensures stable behavior across environments where `**` is not expanded recursively by default shell settings.

### Integration Test Script Contract

The `test:integration` script must discover integration test files recursively without relying on shell globstar expansion.

Required form:

```
"test:integration": "find test/accept -name '*.test.mjs' -print0 | xargs -0 node --test"
```

This form ensures stable behavior across environments where `**` is not expanded recursively by default shell settings.

## 12. Published File Scope

The `files` field defines which files are included in the npm distribution.

Published files include:

```
src/
types.d.ts
README.md
LICENSE
CHANGELOG.md
```

This ensures that only production sources and documentation are included in the published package.

## 13. Node.js Runtime Requirement

The project declares Node.js runtime compatibility:

```
engines.node >= 20
```

This version provides stable ECMAScript module support and includes the built-in `node:test` framework used by the project.

For development tooling compatibility, the version of `@types/node` should correspond to the declared Node.js runtime version.

## 14. Absence of Runtime Entrypoint

Because this package is a library module:

- no runtime bootstrap is defined;
- no `scripts.start` exists;
- the package is not intended to be executed directly.

Runtime lifecycle is defined by the application that integrates the library.

## 15. Canonical package.json Structure

The following JSON fragment illustrates the canonical structure of the `package.json` file used in this project.

```json
{
  "name": "@flancer32/teq-web",
  "version": "0.5.0",
  "description": "Server-side web request coordination infrastructure for TeqFW modular monolith applications.",
  "type": "module",
  "license": "Apache-2.0",

  "author": {
    "name": "Alex Gusev",
    "email": "alex@flancer64.com",
    "url": "https://github.com/flancer64"
  },

  "repository": {
    "type": "git",
    "url": "git+https://github.com/flancer32/teq-web.git"
  },

  "homepage": "https://github.com/flancer32/teq-web",

  "bugs": {
    "url": "https://github.com/flancer32/teq-web/issues"
  },

  "keywords": [
    "teqfw",
    "tequila-framework",
    "web",
    "pipeline-engine",
    "request-pipeline",
    "dependency-injection",
    "modular-monolith",
    "nodejs"
  ],

  "types": "types.d.ts",

  "engines": {
    "node": ">=20"
  },

  "teqfw": {
    "namespaces": [
      {
        "prefix": "Fl32_Web_",
        "path": "./src",
        "ext": ".mjs"
      }
    ]
  },

  "dependencies": {
    "@teqfw/di": "^2.0.0"
  },

  "devDependencies": {
    "@types/node": "^20",
    "eslint": "^9.0.0"
  },

  "scripts": {
    "test:unit": "find test/unit -name '*.test.mjs' -print0 | xargs -0 node --test",
    "test:integration": "find test/accept -name '*.test.mjs' -print0 | xargs -0 node --test",
    "test": "npm run test:unit && npm run test:integration"
  },

  "files": ["src/", "types.d.ts", "README.md", "LICENSE", "CHANGELOG.md"]
}
```

This fragment serves as the reference layout used by agents when generating or validating the `package.json` file.

## 16. Summary

The `package.json` file defines the engineering layout of the `@flancer32/teq-web` library package.

It specifies:

- npm package identity;
- module system configuration;
- namespace registration for the dependency injection container;
- runtime and development dependencies;
- testing scripts;
- publication scope of the package.

For correct operation of IDE tooling and static analysis, the development environment must include the `@types/node` package.

The package functions as an infrastructure module within the TeqFW ecosystem and does not define its own runtime entrypoint.
