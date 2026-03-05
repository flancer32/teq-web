# Product Constraints

Path: `./ctx/docs/product/constraints.md`
Version: `20260305`

## 1. Purpose of This Document

Mandatory product-level constraints are defined in this document. The constraints establish the boundary of the product’s semantic model and prohibit directions of change that would alter its identity.

This document does not describe architecture, environment conditions, implementation, or code.

The semantic model of the product is defined in:

`./ctx/docs/product/overview.md`

This document protects that model from transformation.

## 2. Immutable Semantic Frame

The product is permanently defined as:

- an infrastructural npm package for coordinated server-side processing of web requests in TeqFW applications;
- a deterministic request lifecycle executed by an ordered handler pipeline;
- a component of the TeqFW ecosystem that functions only with mandatory use of `@teqfw/di`.

The product cannot be redefined as:

- a universal Node.js web framework;
- a standalone web server;
- a general-purpose HTTP abstraction layer;
- an independent server platform;
- a tool outside the TeqFW philosophy.

Changing this frame constitutes a different product.

## 3. Pipeline Engine Authority

The Pipeline Engine defined in the product overview must remain the single lifecycle coordination authority of request processing.

The following transformations are prohibited:

- introduction of a second coordination center for request processing;
- request processing executed outside the Pipeline Engine;
- relocation of request-processing control to the Server or to handlers.

## 4. Processing Pipeline Model

The Processing Pipeline model defined in the product overview must remain unchanged.

The following transformations are prohibited:

- replacement of the three-stage model `INIT → PROCESS → FINALIZE`;
- removal of any stage;
- introduction of alternative request-processing execution models alongside the pipeline;
- dynamic reordering of handlers during request processing.

## 5. Handler Registration and Ordering

Handler registration and ordering must remain an initialization-time act.

The following transformations are prohibited:

- registering handlers after the Server begins accepting requests;
- removing or replacing handlers at runtime;
- changing handler ordering during request processing.

## 6. Runtime Outcome Semantics

The following runtime semantics must remain unchanged:

- `INIT` and `FINALIZE` handler failures are isolated and do not terminate request processing;
- a `PROCESS` handler failure may produce a `500 Internal Server Error` if the response is still writable;
- if no `PROCESS` handler handles the request, the Pipeline Engine produces a `404 Not Found` response;
- each request produces exactly one HTTP response;
- request processing completion is represented by a non-resettable request-context attribute that may be set only by `PROCESS` handlers.

## 7. Prohibited Domain Expansions

The product cannot be extended in the following directions:

- inclusion of application-level business logic;
- definition of application routing, controllers, or web framework conventions;
- inclusion of persistence, data access, or domain modeling concerns;
- imposition of application structure;
- addition of any user interface;
- introduction of mechanisms intended for end users;
- making handler correctness depend on specific transport implementations.

The product model contains no entities, roles, or modes beyond those defined in `./ctx/docs/product/overview.md`.

## 8. Boundary of Permissible Evolution

Permissible evolution is limited to changes that:

- clarify wording without altering meaning;
- increase strictness of invariants;
- enhance declarative precision and remove ambiguity;
- do not introduce new product-level entities;
- do not weaken handler isolation.

Any semantic transformation requires explicit revision of product-level documents.

## 9. Agent Responsibility

When changes are produced by an LLM agent:

- the domain model must not be expanded;
- invariants must not be weakened;
- absence of prohibition must not be interpreted as permission;
- functionality from other ADSM levels must not be transferred into the product level;
- user confirmation must be requested before any potential semantic transformation.

## 10. Product Identity Boundary

The product remains within its identity as long as:

- the Pipeline Engine remains the single lifecycle coordination authority;
- the Processing Pipeline remains the only form of request processing;
- the pipeline stage model remains `INIT → PROCESS → FINALIZE`;
- handlers remain isolated and ordered only by declarative metadata;
- the product retains its purely infrastructural nature;
- the inseparable link to TeqFW and `@teqfw/di` is preserved.
