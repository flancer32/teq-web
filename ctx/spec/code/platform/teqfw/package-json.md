# Node.js Package Manifest

- Path: `ctx/spec/code/platform/teqfw/package-json.md`
- Document Version: `20260329`

## Purpose

Defines the Node.js/npm conventions used for generating `package.json`.

## Scope

Applies to Node.js/npm environment.

Defines platform-specific representation of the package.

## Source of Data

Product-specific values are defined in:

```
ctx/docs/code/platform/nodejs/package-json.md
```

This document defines how these values are expressed in Node.js.

## Module System

- ESM only
- "type": "module"
- file extension: .mjs

## Dependency Model

- runtime dependencies → dependencies
- development dependencies → devDependencies
- dependency versions are provided by code-level document

## Runtime

- Recommended Node.js version: >= 20
- MAY be enforced via engines.node

## Entrypoint Execution

Entrypoint definition depends on package role:

- application:
  - entrypoint path is provided by code-level document
  - start script MUST be defined as:

```
"start": "node <entrypoint>"
```

- library:
  - entrypoint is defined via standard npm fields (e.g. "main", "exports")
  - start script MUST NOT be required

## Scripts

The following scripts are part of TeqFW standard and MUST be defined:

```
start
test:unit
test:integration
test
```

Templates:

```
start → "node <entrypoint>"

test:unit → "find test/unit -name '*.test.mjs' -print0 | xargs -0 node --test"
test:integration → "find test/integration -name '*.test.mjs' -print0 | xargs -0 node --test"
test → sequential execution of test:unit and test:integration
```

## Metadata Mapping

Authors:

- defined as a list in code-level document
- mapped to JSON array:

```
"author": [ { ... }, { ... } ]
```

## Extension Fields

Custom fields are allowed.

TeqFW namespace is mapped as:

```
"teqfw": {
"namespaces": [ ... ]
}
```

## Manifest Structure

The resulting `package.json` is constructed by:

- taking values from code-level definition
- mapping them to npm fields
- adding platform-required fields defined in this document
