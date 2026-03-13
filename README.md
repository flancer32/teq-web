# @flancer32/teq-web

Infrastructure web server and deterministic request pipeline for TeqFW packages.

`@flancer32/teq-web` is an infrastructural component of the **Tequila Framework (TeqFW)** platform.

The package provides a deterministic **request lifecycle pipeline** and a built-in **Node.js web server** that other TeqFW packages can use as the runtime environment for processing HTTP requests.

Within the TeqFW ecosystem, this package plays a role similar to how **Express** or **Fastify** are used in typical Node.js applications: it acts as the **web runtime layer** used by higher-level packages.

Unlike general-purpose web frameworks, this package focuses only on coordinating **request lifecycle execution through a deterministic handler pipeline**.

The package requires the dependency container **@teqfw/di**.

Platform website: <https://teqfw.com/>

## Overview

The package provides infrastructure for processing web requests inside a TeqFW application.

Core responsibilities:

- deterministic **request lifecycle coordination**
- ordered **handler execution pipeline**
- **Node.js server integration** (`http`, `http2`, `https`)
- **handler registration metadata**
- **static file handler**
- DTO factories and enums used by handler implementations

The package does **not** provide:

- routing frameworks
- controllers
- application architecture
- persistence
- session management
- business logic abstractions

Its sole responsibility is coordinating the **lifecycle of a web request**.

## Role in the TeqFW Ecosystem

| Layer                | Responsibility                            |
| -------------------- | ----------------------------------------- |
| Application packages | business logic, handlers                  |
| `@flancer32/teq-web` | web server and request lifecycle pipeline |
| `@teqfw/di`          | runtime dependency linking                |

TeqFW applications are composed of multiple packages that declare dependencies through the DI container.

`@flancer32/teq-web` provides the **web runtime layer** in which those packages handle incoming requests.

## Request Lifecycle

Each request is processed through a fixed three-stage pipeline:

```text
INIT → PROCESS → FINALIZE
```

Stage semantics:

| Stage    | Purpose                                           |
| -------- | ------------------------------------------------- |
| INIT     | request preparation (logging, enrichment, guards) |
| PROCESS  | request handling                                  |
| FINALIZE | cleanup and post-processing                       |

Processing stops when a `PROCESS` handler marks the request as completed.

If no handler handles the request, the system produces **404 Not Found**.

## Core Components

### Pipeline Engine

The **Pipeline Engine** is the single lifecycle coordination authority.

Responsibilities:

- handler registration
- deterministic handler ordering
- request lifecycle execution
- request completion control
- runtime error handling

Handlers are ordered based on declarative metadata (`before` / `after` constraints).

### Server

The built-in server connects the Node.js transport layer to the request pipeline.

Supported server types:

- `http`
- `http2`
- `https`

The server locks the handler pipeline before entering the execution phase.

### Handlers

Handlers are independent modules participating in request processing.

Each handler provides registration metadata:

- unique handler name
- execution stage
- relative ordering constraints

Handlers do not coordinate with each other directly. Execution order is derived from metadata and is deterministic.

## Example (TeqFW Style)

```javascript
// App/Web/Handler/Hello.mjs

export const __deps__ = {
  dtoInfoFactory: "Fl32_Web_Back_Dto_Info__Factory$",
  STAGE: "Fl32_Web_Back_Enum_Stage$",
};

export default class App_Web_Handler_Hello {
  constructor({ dtoInfoFactory, STAGE }) {
    const info = dtoInfoFactory.create({
      name: "App_Web_Handler_Hello",
      stage: STAGE.PROCESS,
    });

    this.getRegistrationInfo = () => info;

    this.handle = async function (context) {
      const { response } = context;

      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end("ok");

      context.complete();
    };
  }
}
```

```javascript
// App/Web/Server/Start.mjs

export const __deps__ = {
  pipeline: "Fl32_Web_Back_PipelineEngine$",
  server: "Fl32_Web_Back_Server$",
  helloHandler: "App_Web_Handler_Hello$",
};

export default class App_Web_Server_Start {
  constructor({ pipeline, server, helloHandler }) {
    this.execute = async function () {
      pipeline.addHandler(helloHandler);

      await server.start({
        port: 3000,
        type: "http",
      });
    };
  }
}
```

Application entry point:

```javascript
const app = await container.get("App_Web_Server_Start$");
await app.execute();
```

## Designed for Development with LLM Agents

TeqFW is an architectural approach designed for software development in which **LLM agents participate directly in the development process**.

Traditional software architectures assume that all code is written and maintained by humans.

TeqFW assumes a different workflow:

- humans design the **architecture and specifications**
- LLM agents generate and maintain the **implementation**

To support this workflow, TeqFW structures applications so they are easier for automated agents to analyze and modify.

Key design principles include:

- explicit dependency contracts
- deterministic runtime linking
- predictable module structure
- namespace-based component addressing
- minimal hidden coupling between modules

This allows systems to be more reliably:

- analyzed
- generated
- refactored
- extended

by both **human developers and AI agents**.

## Agent-Driven Implementation

TeqFW libraries are developed using **Agent-Driven Software Management (ADSM)**, a methodology created by **Alex Gusev**.

The workflow is:

1. A human architect defines the **product model and specifications**
2. **LLM agents (Codex)** generate the implementation
3. The human architect reviews and integrates the generated code

This package is part of that experiment and demonstrates how **human-designed architecture can be implemented by AI agents**.

## Agent Interface

This package includes **agent interface documentation** intended for LLM agents that use the library as a dependency.

These documents are distributed inside the package in:

```text
./ai/
```

They describe:

- runtime abstractions
- request lifecycle semantics
- handler contracts
- integration rules for TeqFW applications

Human developers typically read the README and source code, while **LLM agents can rely on the documentation in `./ai/`.**

## Installation

```bash
npm install @flancer32/teq-web
```

The package requires a configured `@teqfw/di` container.

## Tequila Framework

`@flancer32/teq-web` is part of the **Tequila Framework (TeqFW)** ecosystem.

More information about the platform:
[https://teqfw.com/](https://teqfw.com/)

TeqFW is an experimental platform exploring how software architecture changes when **AI agents become active participants in the development process**.

Key architectural ideas include:

- modular monolith architecture
- runtime dependency linking
- namespace-based component addressing
- pure JavaScript without compilation
- system structures optimized for collaboration with LLM agents

## Author

**Alex Gusev**

Creator of:

- **Tequila Framework (TeqFW)**
- **ADSM (Agent-Driven Software Management)**

This project explores how software architecture evolves when **LLM agents become active participants in the development process**.
