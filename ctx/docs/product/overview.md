# Product Overview

Path: `./ctx/docs/product/overview.md`
Version: `20260304`

## 1. Product Purpose

`@flancer32/teq-web` enables server-side processing of web requests in applications built in accordance with the Tequila Framework philosophy and allows Teq applications to exist as network web services within the modular monolith model.

## 2. Context of Existence

The product exists exclusively within the context of TeqFW, a platform based on modular monolith architecture, late binding, and composition. In this model, an application consists of independent modules unified by shared infrastructure and a single dependency container, and server-side coordination of web requests is standardized without imposing application architecture or introducing an additional framework model. The product is not intended to serve as a universal server tool outside the TeqFW philosophy.

## 3. Subject Model

Core entities of the product:

- Server
- Dispatcher
- Web Request
- Request Context
- Handler
- Processing Pipeline
- Processing Error
- Processing Result

Server is a conceptual product-level entity. Its architectural realization is defined at the architecture level.

The central entity of the model is the Dispatcher. The Server receives an external Web Request and transfers it to the Dispatcher; the request is represented as a Request Context. The Dispatcher conducts the context through a pipeline consisting of ordered Handlers. Handlers are independent modules of the monolith and have no knowledge of one another beyond declarative ordering metadata applied by the infrastructure. Processing terminates with either a Processing Result or a Processing Error, and the atomic unit of request processing is the Handler. Within the processing pipeline the Sequential Processing Phase is structured into three stages: PRE stage, PROCESS stage, and POST stage.

## 4. Product Invariants

1. The Dispatcher is the unique semantic authority of the request lifecycle within the product.
2. Request processing outside the Dispatcher is not permitted.
3. Handlers are isolated and have no knowledge of each other.
4. The execution order of handlers is strict and determined by the infrastructure.
5. The product does not contain application-level business logic.
6. The product is an infrastructural module of a modular monolith.
7. The use of TeqFW DI is mandatory for the product to function.
8. The product is server-agnostic within the supported transport modes.
9. The product has no standalone meaning outside the TeqFW ecosystem.

Changing any of these statements implies a change in the product’s essence.

## 5. Product Boundaries

The product is responsible for:

- coordinating the execution of web requests through the Dispatcher;
- ensuring consistent processing of a request by modules within the monolith;
- providing a unified infrastructural framework for the server side of a Teq application.

The product is not responsible for:

- application routing frameworks or application structure;
- data models or database interaction;
- session management;
- semantic interpretation of representation formats;
- implementation of application-level protocols;
- deployment, clustering, or process management;
- business logic of the application.

The responsibility of the product ends with coordination of request processing.

The product may include optional infrastructural Handler implementations and helper utilities intended to be composed into the request-processing pipeline of an application, including request logging and static file serving, without redefining the product’s semantic frame.

## 6. User Role

The primary user of the product is a Teq application developer. The product is used as an infrastructural module of the monolith by including it as part of an application, defining the set of Handlers, and configuring the server mode. The product is not intended for end users and does not provide a user interface.

## 7. Modes of Existence

The product has no semantic modes of existence. Configuration modes, including selection of transport protocol, do not alter the subject model. Error handling is an obligatory part of the lifecycle and cannot be disabled.

## 8. Systemic Value

The product establishes a standard for server-side coordination of web requests within the TeqFW modular monolith and creates a stable infrastructural framework that ensures consistent processing among modules without redesigning the server layer per application.

## 9. Outside the Model

The product is not a universal Node.js web framework, an independent server platform, a tool for microservice architectures, a distributed system orchestrator, or a user-facing product. It exists as an infrastructural module of Teq applications and has no standalone meaning outside the Tequila Framework philosophy.

## 10. Relation to Other ADSM Levels

- `./ctx/docs/product/constraints.md`
- `./ctx/docs/architecture/overview.md`
- `./ctx/docs/architecture/constraints.md`
- `./ctx/docs/composition/overview.md`
- `./ctx/docs/composition/constraints.md`
- `./ctx/docs/code/`

Scope: this document describes only the `product` level, and statements from other levels are not duplicated.
