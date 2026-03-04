# Product Constraints

Path: `./ctx/docs/product/constraints.md`
Version: `20260304`

## 1. Purpose of This Document

Mandatory product-level constraints are defined in this document. The constraints establish the boundary of the product’s semantic model and prohibit directions of change that would alter its identity. This document does not describe architecture, composition, environment conditions, implementation, or code.

## 2. Immutable Semantic Frame

The product is permanently defined as:

- an infrastructural npm package for server-side coordination of web requests in applications built according to the TeqFW philosophy;
- a module of a modular monolith that ensures a unified request lifecycle through the Dispatcher;
- a component of the TeqFW ecosystem that functions only with mandatory use of `@teqfw/di`.

The product cannot be redefined as:

- a universal Node.js web framework;
- a standalone web server;
- a general-purpose HTTP abstraction layer;
- an independent server platform;
- a tool outside the TeqFW philosophy.

Changing this frame constitutes a different product.

## 3. Non-Reducible Invariants

The following properties cannot be weakened, removed, or reinterpreted:

- The product admits exactly one request-lifecycle semantics, and it is defined by the Dispatcher.
- Request processing outside the Dispatcher is prohibited.
- Alternative parallel processing mechanisms are not allowed.
- The Server does not process requests outside forwarding them to the Dispatcher.
- Handlers are isolated and have no knowledge of each other beyond declarative ordering metadata applied by the infrastructure.
- The execution order of Handlers is fixed and does not change during processing.
- The product contains no application-level logic.
- The product has no meaning outside TeqFW and `@teqfw/di`.
- The product is not intended for end users.
- Request processing exists exclusively in the form of a pipeline.

Removal or modification of any of these statements requires revision of `./ctx/docs/product/overview.md`.

## 4. Prohibited Domain Expansions

The product cannot be extended in the following directions:

- introduction of an application routing framework or mandatory route-definition model;
- semantic interpretation of representation formats (JSON, HTML, GraphQL, etc.);
- session management;
- introduction of business-process abstractions;
- imposition of application structure;
- addition of any user interface;
- introduction of mechanisms intended for end users;
- making Handler correctness depend on specific transport implementations;
- clustering Handlers into coupled units;
- introducing alternative request-processing models.

The product model contains no entities, roles, or modes beyond those defined in `./ctx/docs/product/overview.md`.

## 5. Prohibited Model Transformations

The following transformations are not permitted:

- emergence of a second lifecycle control center;
- relocation of processing logic from Handlers to the Dispatcher;
- introduction of global processing state;
- dynamic reordering of Handlers during request processing;
- blurring the boundary between infrastructural and application levels;
- evolution of the product into a universal HTTP tool.

Any of these transformations constitutes an exit from the product boundary.

## 6. Boundary of Permissible Evolution

Permissible evolution is limited to changes that:

- clarify wording without altering meaning;
- increase strictness of invariants;
- enhance declarative precision and remove ambiguity;
- do not introduce new entities;
- do not alter the central role of the Dispatcher;
- do not weaken Handler isolation.

are considered permissible.

Expansion is defined only through explicit modification of product-level documents.

## 7. Agent Responsibility

When changes are produced by an LLM agent:

- not expand the domain model;
- not weaken invariants;
- not interpret absence of prohibition as permission;
- not transfer functionality from other ADSM levels into the `product` level;
- request user confirmation before any potential semantic transformation.

## 8. Product Identity Boundary

The product remains within its identity as long as:

- the Dispatcher remains the product’s only lifecycle-defining authority;
- the pipeline remains the only form of processing;
- Handlers remain atomic and isolated;
- the product retains its purely infrastructural nature;
- the inseparable link to TeqFW and `@teqfw/di` is preserved.

Violation of any of these conditions implies a change of product branch.
