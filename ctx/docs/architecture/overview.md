# Architecture Overview

Path: `./ctx/docs/architecture/overview.md`
Version: `20260305`

## 1. Purpose of the Level

The architectural form of the system is defined at this level, including structural shape, responsibility boundaries, architectural entities, and execution structure.

Architectural constraints are defined in `./ctx/docs/architecture/constraints.md`.

Architecture is derived strictly from `./ctx/docs/product/overview.md` and does not introduce new product-level entities.

## 2. Architectural Classification

The system belongs to the following architectural class:

- infrastructural request-processing subsystem;
- coordinator-centered runtime structure;
- modular monolith internal web-processing component.

This classification defines the system as a structural coordination mechanism for deterministic processing of web requests inside a modular monolith.

## 3. Architectural Center

The architecture has a structural coordination locus:

- Pipeline Engine

The Pipeline Engine is the single coordination locus in the architecture. All request-processing orchestration is routed through it, and no distributed, nested, or peer coordination structures exist within the architectural boundary.

## 4. Architectural Units

The architecture recognizes the following structural units:

- Contour: a responsibility boundary within the system.
- Component: a structural participant within a contour.
- Architectural Data Entity: a canonical structural entity defining runtime interaction boundaries.

These units are conceptual and do not imply specific modules, classes, or folders.

### 4.1 Architectural Instance

An Architectural Instance is one configured structural assembly of the architectural units defined at this level:

- Server
- Pipeline Engine
- Handlers

An Architectural Instance exists within a single runtime process boundary.

Multiple Architectural Instances may coexist concurrently but are structurally independent and do not share configuration or handler sets.

## 5. Architectural Contours

The system consists of the following stable contours:

1. Transport Contour: includes the Server component; receives external web requests and forwards them to the Pipeline Engine; delivers the resulting transport response.
2. Coordination Contour: includes the Pipeline Engine; defines lifecycle control, handler ordering, and request processing execution.
3. Processing Contour: includes Handlers; performs atomic processing steps over one request lifecycle.

Contours define responsibility separation and structural boundaries without implying technical layering.

## 6. Processing Pipeline

The Pipeline Engine executes request processing as a Processing Pipeline of handlers.

Handlers are partitioned into three stages:

- `INIT`
- `PROCESS`
- `FINALIZE`

Stage semantics:

- `INIT` handlers run first and are always executed.
- `PROCESS` handlers run next until request processing is marked as completed.
- `FINALIZE` handlers run last and are always executed.

Within each stage, handler order is derived from declarative `before` and `after` constraints and is deterministic.

The derived handler order is locked during system initialization.

Request processing completion is represented by a non-resettable completion attribute stored in request-scoped context associated with the Web Request.

The completion attribute is monotonic within the lifetime of a single request and must not be reset.

The completion attribute may be set only by `PROCESS` handlers. `INIT` and `FINALIZE` handlers must not set it.

The Pipeline Engine terminates `PROCESS` stage execution when the completion attribute becomes completed.

## 7. Structural Modes of Existence

The architecture distinguishes two structural modes of existence of a single architectural instance:

1. Configuration Phase
2. Execution Phase

### 7.1 Configuration Phase

Configuration Phase is a one-time structural act performed before the Server begins accepting web requests.

During Configuration Phase:

- server operational parameters are defined;
- handlers are registered into the Pipeline Engine;
- handler ordering is derived and locked.

### 7.2 Execution Phase

Execution Phase begins when the Server starts accepting web requests.

During Execution Phase:

1. The Server receives a web request.
2. The Server transfers the request to the Pipeline Engine.
3. The Pipeline Engine executes the Processing Pipeline.
4. Request processing terminates by producing a transport response.

The structural configuration established during Configuration Phase remains immutable throughout Execution Phase.

## 8. Architectural Data

The architecture operates on a minimal set of structural entities:

- Web Request
- Transport Response

These entities define the system boundary of interaction.

They do not define serialization, transport encoding, or storage representation.

## 9. System Boundary

Belongs to the system:

- Server
- Pipeline Engine
- Handlers

Belongs to the external environment:

- network stack
- HTTP/HTTPS/HTTP2 implementations
- DI container (`@teqfw/di`)
- application modules
- business logic
- infrastructure and deployment environment

Interaction with the environment occurs through Web Requests entering the system and transport responses leaving the system.

## 10. Structural Map of the Level

Permitted extensions of this overview include documents such as:

```
architecture/contours/*.md
architecture/boundaries/*.md
architecture/data-flow/*.md
architecture/lifecycle/*.md
```

These documents may elaborate structural details while preserving the architectural entities and execution semantics defined in this document.

## 11. Summary of Architectural Form

The architecture is defined as:

- an infrastructural request-processing subsystem;
- centered around the Pipeline Engine as the unique coordination locus;
- organized into transport, coordination, and processing contours;
- operating through a deterministic three-stage handler pipeline;
- existing in two structural modes: Configuration and Execution;
- bounded by Web Request input and transport response output.
