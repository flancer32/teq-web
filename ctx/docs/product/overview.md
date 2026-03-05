# Product Overview

Path: `./ctx/docs/product/overview.md`
Version: `20260305`

## 1. Product Purpose

`@flancer32/teq-web` provides infrastructural server-side processing of web requests for TeqFW applications. The product standardizes the request lifecycle as an ordered handler pipeline executed by a single coordination component.

## 2. Context of Existence

The product exists only within the TeqFW ecosystem and requires `@teqfw/di` for wiring and lifecycle management.

The product is not a general-purpose Node.js web framework and does not impose application architecture, routing models, or business logic structures.

## 3. Subject Model

Core entities of the product:

- Server
- Web Request
- Dispatcher
- Handler
- Processing Pipeline

Server is a conceptual product-level entity whose architectural implementation is defined at the architecture level.

The Server receives an external Web Request and transfers it to the Dispatcher.

The Dispatcher executes the Processing Pipeline.

Handlers are independently developed modules of the modular monolith and are isolated from one another. Handlers may declare ordering constraints, but they do not directly coordinate with other handlers.

## 4. Handler Registration Metadata

Each handler provides registration metadata that includes:

- unique handler name
- execution stage: `pre`, `process`, or `post`
- relative ordering constraints expressed as `before` and `after` references to other handler names

Handler ordering is derived from the registered set and is locked before the Server begins accepting requests.

## 5. Processing Pipeline

The Processing Pipeline is the only mechanism of request processing within the product.

The pipeline is structured into three stages:

- `pre`
- `process`
- `post`

Stage semantics:

- `pre` handlers are always executed and must not terminate request processing.
- `process` handlers are executed in order until one handler reports that the request has been handled.
- `post` handlers are always executed after request processing, regardless of whether a handler handled the request or whether processing terminated due to an error.

## 6. Runtime Outcomes

For each incoming request, the system produces exactly one HTTP response.

If no `process` handler handles the request, the Dispatcher produces a `404 Not Found` response.

If a `process` handler throws an exception while the response is still writable, the Dispatcher produces a `500 Internal Server Error` response.

Exceptions thrown by `pre` and `post` handlers do not terminate request processing and are treated as isolated failures.

## 7. Product Invariants

1. The Dispatcher is the unique lifecycle coordination authority of request processing within the product.
2. Request processing outside the Dispatcher is not permitted.
3. The Processing Pipeline is the only form of request processing.
4. The pipeline stage model is fixed as `pre → process → post`.
5. Handler execution order is deterministic and derived from declarative handler metadata.
6. Handler registration and ordering occur only during system initialization and are immutable during request processing.
7. The product contains no application-level business logic.
8. The product exists only within TeqFW and requires `@teqfw/di`.

Changing any of these statements implies a change in the product’s semantic identity.

## 8. Product Boundaries

The product is responsible only for request lifecycle coordination and execution of registered handlers.

The product does not provide:

- application routing frameworks
- application structure
- data models or database interaction
- session management
- representation format semantics
- business logic abstractions
- deployment or clustering infrastructure

## 9. User Role

The product is used by TeqFW application developers as an infrastructural module of the modular monolith. Developers implement and register handlers and configure the server environment in which the product operates.

The product is not intended for end users and provides no user interface.

## 10. Modes of Existence

The product has no semantic modes of existence. Transport configuration options do not alter request lifecycle semantics.

## 11. Systemic Value

By standardizing the lifecycle of request processing, the product allows independent modules of the monolith to cooperate through a deterministic handler pipeline without redesigning coordination logic for each application.

## 12. Relation to Other ADSM Levels

- `./ctx/docs/product/constraints.md`
- `./ctx/docs/architecture/overview.md`
- `./ctx/docs/architecture/constraints.md`
- `./ctx/docs/code/`

Scope: this document defines the semantic model of the product and does not describe architectural implementation or code-level mechanisms.

