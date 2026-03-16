# JSDoc Annotation Conventions for TeqFW Applications

Path: `ctx/docs/code/conventions/teqfw/jsdoc.md`
Template Version: `20260316`

## Document Scope

This document defines structural conventions for annotating JavaScript code in TeqFW applications using JSDoc.

The conventions align JSDoc usage with the architectural principles of the TeqFW platform:

- dependency injection based composition
- namespace-addressed components
- runtime-first JavaScript execution
- TypeScript used only as a static analyzer

The rules defined here are mandatory for code that participates in container-managed runtime composition.

The primary consumer of these conventions is automated tooling and LLM development agents.

## Structural Role of JSDoc

JSDoc is the structural typing layer attached directly to runtime JavaScript.

Runtime JavaScript together with adjacent JSDoc annotations forms the complete structural contract of the system.

Implications:

- executable JavaScript is the structural source of truth
- structural contracts must remain observable in runtime code
- no parallel structural model exists outside runtime code
- external declaration files may exist only as tooling mirrors

JSDoc describes structure. Runtime code implements behavior.

## Relationship with Namespace Types

Type references in JSDoc MUST use TeqFW namespace identifiers.

Example:

```

Fl32_Web_Back_Service_Logger
Fl32_Web_Back_Config_Runtime
Fl32_Web_Back_Repo_User

```

Namespace identifiers represent architectural component identities rather than module paths.

The namespace identifier refers to the component, while the dependency container resolves the implementation module during runtime composition.

JSDoc annotations therefore reference architectural components rather than filesystem locations.

Filesystem paths or `import()` expressions MUST NOT be used as type identifiers inside JSDoc annotations.

## Role of the `types.d.ts` Type Map

Each TeqFW package contains a type map file named `types.d.ts`.

This file defines type aliases mapping namespace identifiers to runtime implementation modules.

Example:

```ts
type Fl32_Web_Back_Service_Logger = import("./src/Back/Service/Logger.mjs").default;
```

The type map exists only for static tooling and IDE analysis.

JSDoc annotations MUST reference the types exposed through this file.

The type map must mirror runtime JavaScript modules and must not introduce independent structural models.

## Prohibition of `@typedef`

`@typedef` annotations MUST NOT be used in TeqFW application code.

Reason:

TypeScript static analysis (`tsserver`) does not expose typedef structures as global type symbols usable across modules.

All structural types used in JSDoc annotations must correspond to namespace types defined in `types.d.ts`.

Local typedef definitions are not permitted.

## Mandatory Annotation Units

The following program units MUST be annotated.

Functions
Methods
Constructors
Factories
Structured parameters
Structured return values

## Constructor Behavior Model

Container-managed classes define their behavior inside the constructor.

TeqFW components do not use prototype methods.

Instead, functions are created inside the constructor and assigned to the instance.

These functions capture constructor dependencies through JavaScript closures.

Example behavioral pattern:

```
constructor(deps) {
  this.method = function (...) { ... }
}
```

This pattern ensures that dependencies remain available through closure variables rather than instance properties.

Prototype methods such as:

```
method() {}
```

or

```
Class.prototype.method = ...
```

must not be used in container-managed components.

## Module Annotation Requirements

Every ES module MUST begin with a module-level JSDoc block describing the responsibility of the module.

Example:

```javascript
/**
 * Provides user management services.
 */
```

The description defines the architectural role of the module rather than its implementation details.

Every exported symbol MUST have explicit structural documentation.

Unannotated exports are not allowed.

## Constructor Annotation Model

Container-managed classes receive dependencies through a single structured constructor parameter.

Inline parameter annotations MUST be used.

Example:

```javascript
export default class UserService {
  /**
   * @param {object} params
   * @param {Fl32_Web_Back_Service_Logger} params.logger
   * @param {Fl32_Web_Back_Repo_User} params.repo
   */
  constructor({ logger, repo }) {}
}
```

Rules:

- constructor parameters MUST be represented as a structured object
- each dependency MUST be documented explicitly
- inline parameter annotations MUST be used

## Dependency Injection Alignment

JSDoc annotations must align with dependency descriptors declared in the module.

Example dependency descriptor:

```javascript
export const __deps__ = Object.freeze({
  logger: "Fl32_Web_Back_Service_Logger$",
});
```

Constructor annotation must reference the same dependency.

```
@param {Fl32_Web_Back_Service_Logger} params.logger
```

## Dependency Name Consistency

Dependency identifiers MUST remain identical in:

- dependency descriptor keys
- constructor destructuring parameters
- JSDoc parameter paths

Example:

```javascript
export const __deps__ = Object.freeze({
  logger: "Fl32_Web_Back_Service_Logger$",
});
```

```javascript
constructor({ logger }) {}
```

```
@param {Fl32_Web_Back_Service_Logger} params.logger
```

Renaming dependencies through destructuring or aliasing is not allowed.

## Structured Parameter Rules

When a function accepts a structured parameter object, the structure MUST be explicitly documented.

Example:

```javascript
/**
 * Creates a user.
 *
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.email
 */
function createUser({ name, email }) {}
```

Implicit structural inference must not be used.

## Return Type Annotation

All non-void functions MUST declare `@returns`.

Example:

```javascript
/**
 * Resolves a dependency.
 *
 * @param {string} id
 * @returns {object}
 */
function resolve(id) {}
```

## Annotation Determinism Rule

JSDoc annotations must remain deterministic and mechanically parsable.

The following constructs are not allowed:

- conditional typing
- computed type expressions
- dynamic type generation
- complex generics
- structural type composition

Structural typing must remain explicit and simple.

## Canonical DI Module Example

The following example illustrates the canonical structure of a DI-compatible module in TeqFW.

```javascript
/**
 * User service responsible for user management operations.
 */
export default class Fl32_Web_Back_Service_User {
  /**
   * @param {object} params
   * @param {Fl32_Web_Back_Service_Logger} params.logger
   * @param {Fl32_Web_Back_Repo_User} params.repo
   */
  constructor({ logger, repo }) {
    /**
     * Creates a user.
     *
     * @param {Fl32_Web_Back_Dto_User} user
     * @returns {Promise<void>}
     */
    this.create = async function (user) {
      logger.info("create user", user);
      await repo.save(user);
    };
  }
}

export const __deps__ = Object.freeze({
  logger: "Fl32_Web_Back_Service_Logger$",
  repo: "Fl32_Web_Back_Repo_User$",
});
```

Behavior is implemented through functions defined inside the constructor.

These functions capture dependencies through JavaScript closures.

## Common Annotation Errors

### Using `@typedef`

Incorrect:

```javascript
/**
 * @typedef {object} Params
 * @property {string} name
 */
```

Use namespace types defined in `types.d.ts`.

Correct:

```
@param {Fl32_Web_Back_Dto_User} dto
```

### Referencing Module Paths

Incorrect:

```
@param {import("./UserRepo.mjs").default} repo
```

Correct:

```
@param {Fl32_Web_Back_Repo_User} params.repo
```

### Dependency Name Mismatch

Incorrect:

```javascript
export const __deps__ = Object.freeze({
  logger: "Fl32_Web_Back_Service_Logger$",
});

constructor({ log }) {}
```

Correct:

```javascript
constructor({ logger }) {}
```

### Missing `@returns`

Incorrect:

```javascript
/**
 * Creates a user.
 */
function createUser(dto) {}
```

Correct:

```javascript
/**
 * Creates a user.
 *
 * @param {Fl32_Web_Back_Dto_User} dto
 * @returns {Promise<void>}
 */
```

### Dynamic Type Expressions

Incorrect:

```
@param {T extends object ? T : never}
```

Explicit namespace types must be used instead.

## Summary

JSDoc in TeqFW applications provides deterministic structural typing aligned with runtime JavaScript and dependency injection architecture.

Key principles:

- runtime JavaScript is the structural source of truth
- JSDoc defines explicit structural contracts
- namespace identifiers represent architectural component types
- constructor dependencies are annotated inline
- behavior is implemented through constructor closures
- `types.d.ts` provides the static type map
- typedef annotations are prohibited
- annotations must remain deterministic and machine-parsable
