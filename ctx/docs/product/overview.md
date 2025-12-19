# Teq Web Dispatcher Plugin

Path: `./ctx/docs/product/overview.md`

## Product Purpose

This project is a server-side plugin for the Tequila Framework (TeqFW) that implements a universal HTTP request dispatcher with a multi-stage processing model.  
The product is designed for use in a Node.js environment and provides declarative, extensible, and predictable handling of incoming requests without relying on external dependencies or frameworks.

The plugin is not a general-purpose web framework and does not introduce its own application model. It solves a narrow and explicit task: **coordinating HTTP request processing through a set of independent handlers**.

## Responsibility Boundaries

The product is responsible for:

- receiving HTTP requests from built-in Node.js servers (`http`, `http2`, `https`);
- ordered execution of registered handlers;
- propagation of request context across processing stages;
- response generation when the response stream is in a writable state.

The product is **not responsible** for:

- application business logic;
- MVC-style routing;
- session state management;
- deployment, infrastructure, or network configuration.

## Request Processing Model

Request handling is organized as a linear sequence of stages:

1. **pre** — preliminary processing (logging, context preparation);
2. **process** — main request processing;
3. **post** — finalization stage (cleanup, completion, metrics).

Each handler:

- is initialized once;
- is executed for every request;
- has no knowledge of concrete implementations of other handlers.

Execution order within a stage is defined declaratively via `before` / `after` dependencies and is computed using topological sorting.

## Key Components

### Dispatcher

The central coordination component.

- manages handler registration;
- computes execution order;
- invokes handlers within a single request lifecycle;
- contains no application-specific logic.

### Server

A minimal HTTP server implementation.

- accepts incoming connections;
- delegates request handling to the Dispatcher;
- does not interpret request content.

### Handlers

A set of modular request handlers.

- implement a unified handler interface;
- are registered declaratively;
- can be added or removed without modifying the Dispatcher.

## Product Invariants

- The architecture is based on **composition**, not inheritance.
- All dependencies are resolved through the TeqFW DI container.
- No static imports are used between components.
- The code is written in modern JavaScript (ES2022+).
- All comments and messages in the code are written **in English only**.
- The plugin is executed as-is and does not require a build step.

## Extension Model

Functionality is extended by:

- adding new handlers;
- connecting auxiliary components;
- configuring handler execution order.

Modifying existing Dispatcher components is not considered a primary extension scenario.

## Testing

The product assumes the presence of unit tests for all runtime components:

- Dispatcher;
- Server;
- Handlers.

Testing is performed in Node.js without external testing frameworks, using the standard platform facilities.

## Final Statement

The product is an infrastructure module of TeqFW that fixes a minimalistic and strictly defined HTTP request processing model.  
It serves as a building block for server-side applications where execution transparency, extensibility, and architectural control are required, without imposing higher-level frameworks or patterns.
