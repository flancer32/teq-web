# Environment Overview

Path: `ctx/docs/environment/overview.md`

## 1. Purpose of the Level

This document defines the environmental form of the system. It describes the conditions of existence, runtime assumptions, infrastructural dependencies, and external conditions within which the system operates, without redefining product meaning, architectural structure, compositional dynamics, or implementation details.

Environment is derived strictly from:

- `product/overview.md`
- `architecture/overview.md`
- `composition/overview.md`

This document does not define restrictions; environmental constraints are defined separately if required.

## 2. Environmental Classification

The system exists within the following environmental class:

- runtime environment type: long-running Node.js server process;
- execution hosting model: externally managed server process;
- deployment topology class: single-instance or multi-process clustered deployment on one host;
- infrastructural integration model: integration into existing web server infrastructure with optional reverse proxy.

This classification defines the external conditions under which the system exists, not its internal structure.

## 3. Runtime Context

The environment requires:

- a Node.js runtime capable of running a long-lived server process;
- stable availability of incoming HTTP/HTTPS/HTTP2 requests.

The system assumes:

- a long-running execution model;
- explicit transition from configuration to execution phase within a persistent process.

Multiple runtime instances may coexist as separate Node.js processes. Each process represents an independent architectural instance with isolated memory space.

The system does not assume an ephemeral or invocation-based execution model.

The operating system is not specified. Any environment capable of running the required Node.js runtime is considered valid.

## 4. Infrastructure Dependencies

The environment requires:

- network stack capable of delivering HTTP/HTTPS/HTTP2 requests to the Node.js process;
- external process lifecycle management (e.g., process manager or equivalent);
- availability of environment variables.

The system does not require:

- mandatory external storage;
- mandatory external coordination services;
- mandatory distributed state;
- mandatory external orchestration beyond process supervision.

Dependency container presence (`@teqfw/di`) is assumed as part of the runtime environment of the application but is not an environmental orchestration mechanism.

No internal lifecycle logic is defined at this level.

## 5. Process and Hosting Model

The system is not responsible for:

- starting or supervising its own process lifecycle;
- restarting after failure;
- scaling through process replication;
- load balancing between instances.

These responsibilities belong to the hosting environment.

One Node.js process corresponds to one architectural instance. In cluster mode, multiple independent instances may run concurrently without shared runtime state.

Process isolation is assumed. Shared in-memory state between processes is not part of the model.

## 6. External Interaction Model

The system connects to the external world through:

- network sockets receiving HTTP/HTTPS/HTTP2 traffic.

It may:

- listen directly on a public port;
- operate behind a reverse proxy;
- perform TLS termination internally or receive already terminated traffic from upstream infrastructure.

Transport infrastructure such as routing, TLS certificate management, port binding policies, and network-level balancing belongs to the environment.

The system boundary begins with normalized Web Request representation and ends with Processing Result or Processing Error.

## 7. Deployment Assumptions

Deployment does not alter system identity provided that:

- the process remains long-running;
- runtime isolation between instances is preserved;
- environmental supervision remains external to the system.

The production model assumes deployment on a standalone VPS. Development assumes execution on a local developer machine. Containerization is permitted as an infrastructural packaging mechanism but does not redefine environmental class.

Distributed deployment across multiple hosts is not part of the environmental identity of the system. Any multi-host topology constitutes an environmental reclassification even if each process remains an independent instance.

Configuration parameters that affect networking or hosting belong to the environment unless they redefine architectural structure.

## 8. Environmental Boundaries

Belongs to the environment:

- operating system;
- process manager;
- reverse proxy and network routing;
- TLS certificates and their lifecycle;
- port management;
- load balancing mechanisms;
- infrastructure-level logging and log rotation;
- process monitoring and restart policies.

Belongs to the system (not environment):

- Dispatcher;
- Server component as architectural unit;
- Handler Registry;
- Handlers;
- Request Context;
- Processing Result and Processing Error;
- internal configuration phase logic.

## 9. Stability of Environmental Assumptions

Environmental invariants:

- long-running process model;
- external supervision of process lifecycle;
- network-based request delivery;
- runtime instance isolation.

Environmental variations that do not alter system identity:

- choice of operating system;
- use or absence of reverse proxy;
- internal or external TLS termination;
- containerized or non-containerized packaging;
- single-process or multi-process cluster deployment on a host.

Environmental shifts that would constitute reclassification:

- transition to an ephemeral invocation model;
- removal of network-based interaction as primary entry mechanism;
- internalization of process supervision or load balancing as core responsibility.

## 10. Structural Map of the Level

This overview may be extended by:

- `environment/runtime/*.md`
- `environment/hosting/*.md`
- `environment/deployment/*.md`
- `environment/infrastructure/*.md`

These documents may elaborate environmental conditions but must not introduce architectural entities or compositional rules.

## 11. Summary of Environmental Form

The environment is defined as:

- a long-running Node.js server process;
- hosted under external process supervision;
- integrated into network infrastructure with optional reverse proxy;
- scalable through independent process replication;
- dependent on environment-provided networking and supervision;
- excluding infrastructure management, scaling logic, and transport-level administration from system responsibility.
