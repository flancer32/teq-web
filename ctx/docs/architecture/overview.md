# Architecture Overview

Path: `./ctx/docs/architecture/overview.md`

## 1. Purpose of the Level

The architectural form of the system is defined at this level, including structural shape, responsibility boundaries, architectural entities, and execution structure. Architectural constraints are defined in `./ctx/docs/architecture/constraints.md`. Architecture is derived strictly from `./ctx/docs/product/overview.md` and does not introduce new product-level entities.

## 2. Architectural Classification

The system belongs to the following architectural class:

- infrastructural server coordination component;
- coordinator-centered runtime structure;
- modular monolith internal web-processing subsystem.

This classification defines the system as a structural coordination mechanism for web request processing inside a modular monolith.

## 3. Architectural Center

The architecture has a structural coordination locus:

- Dispatcher.

The Dispatcher is the single coordination locus in the architecture. All request-processing orchestration is routed through it, and no distributed, nested, or peer coordination structures exist within the architectural boundary.

## 4. Architectural Units

The architecture recognizes the following structural units:

- Contour — a responsibility boundary within the system;
- Context — a bounded architectural space of request processing;
- Component — a structural participant within a contour;
- Architectural Data Entity — a canonical structural entity defining context identity.

These units are conceptual and do not imply specific modules, classes, or folders.

### 4.1 Architectural Instance

An Architectural Instance is one configured structural assembly of the architectural units defined at this level: Server + Dispatcher + Handler Registry + Handlers + Context Contour. An Architectural Instance exists within a single runtime process boundary. Multiple Architectural Instances may coexist concurrently but are structurally independent and do not share configuration or context spaces.

## 5. Architectural Contours

The system consists of the following stable contours:

1. Transport Contour: includes the Server component; receives external web requests and normalizes them into a unified internal representation. This Server component is the architectural realization of the product-level Server entity.

2. Coordination Contour: includes the Dispatcher and Handler Registry; defines structural ordering, lifecycle control, and coordination of request processing.

3. Processing Contour: includes Handlers; performs atomic processing steps over a bounded Request Context.

4. Context Contour: includes Request Context and Processing Result/Error entities; defines the bounded structural space of a single request lifecycle.

Contours define responsibility separation and structural boundaries without implying technical layering.

## 6. Structural Modes of Existence

The architecture distinguishes two structural modes of existence of a single architectural instance:

1. Configuration Phase
2. Execution Phase

### 6.1 Configuration Phase

Configuration Phase is a one-time structural act performed before the Server begins accepting Web Requests.

During Configuration Phase:

- operational parameters of the Server are defined (including transport mode and port);
- Handlers are registered in the Handler Registry;
- structural ordering of the processing pipeline is established;
- the Dispatcher is structurally bound to the finalized Handler Registry.

Handler registration includes stage membership within the processing pipeline (PRE, PROCESS, POST) and may include declarative relative ordering metadata between Handlers. Structural ordering is derived from the registered set and is locked before Server activation. References to unknown Handlers do not influence ordering, and circular ordering constraints are a configuration-time structural error.

Configuration Phase applies globally to the architectural instance and is executed exactly once.

Server activation completes the Configuration Phase and establishes the transition into Execution Phase.

### 6.2 Execution Phase

Execution Phase begins when the Server starts accepting Web Requests.

During Execution Phase:

- each incoming Web Request is normalized by the Server;
- the Dispatcher creates a Request Context;
- the Dispatcher applies registered Handlers sequentially;
- processing terminates with either a Processing Result or a Processing Error.

Handlers operate primarily on the Request Context as the transport-neutral internal boundary of the lifecycle. The Request Context may retain access to raw transport request and response objects as an escape hatch for advanced use cases, but the architectural contract does not require Handlers to depend on transport-specific APIs.

The structural configuration established during Configuration Phase remains immutable throughout Execution Phase.

## 7. State Model

State exists only within bounded Request Context instances during Execution Phase.

- Each Web Request creates a transient Request Context.
- Multiple contexts may coexist concurrently.
- Contexts are isolated and exist only for the duration of request processing.

There is no global mutable processing state governing lifecycle behavior. Structural configuration is fixed prior to execution and does not change at runtime.

## 8. Architectural Data

The architecture operates on a minimal set of structural entities:

- Web Request (normalized internal representation);
- Request Context;
- Processing Result;
- Processing Error.

These entities define structural identity and coordination but do not define storage, serialization, or transport encoding.

Web Request and Request Context jointly define the transport-neutral internal interface of the system. The normalized representation contains only the information required for request coordination and handler execution, while raw transport objects may be carried as optional, non-normative attachments to support advanced scenarios without redefining the architectural boundary.

## 9. System Boundary

Belongs to the system:

- Server (as transport adapter);
- Dispatcher;
- Handler Registry;
- Handlers;
- Request Context;
- Processing Result and Processing Error.

Belongs to the external environment:

- network stack;
- HTTP/HTTPS/HTTP2 implementations;
- DI container (`@teqfw/di`);
- application-level modules and business logic;
- infrastructure and deployment environment.

Interaction with the environment occurs only through normalized Web Requests and structural Processing Results or Errors.

## 10. Structural Map of the Level

Permitted extensions of this overview include documents such as:

- `architecture/contours/*.md`
- `architecture/boundaries/*.md`
- `architecture/data-flow/*.md`
- `architecture/lifecycle/*.md`

These documents may elaborate the structural form; architectural entities remain the set defined at this level.

## 11. Summary of Architectural Form

The architecture is defined as:

- a coordinator-centered infrastructural subsystem;
- structured into transport, coordination, processing, and context contours;
- existing in two structural modes: one-time Configuration and repeated Execution;
- operating through a fixed, preconfigured processing pipeline;
- bounded by normalized request input and structural result/error output;
- organized around the Dispatcher as the unique orchestration hub for request processing.
