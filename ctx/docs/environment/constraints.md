# Environment Constraints

Path: `ctx/docs/environment/constraints.md`
Version: `20260304`

## 1. Purpose of the Document

This document defines mandatory environmental constraints. It establishes the boundaries of the system’s conditions of existence, runtime assumptions, infrastructural dependencies, and prohibited environmental transformations. The document preserves environmental identity when working with LLM agents and does not describe product semantics, architectural structure, compositional dynamics, or implementation details.

Environment is derived strictly from `ctx/docs/environment/overview.md`.

## 2. Immutable Environmental Framework

The system is permanently defined as operating within:

- a long-running Node.js server process runtime class;
- an externally supervised hosting model;
- a network-based interaction model (HTTP/HTTPS/HTTP2);
- an isolated process model without shared in-memory state between instances;
- a deployment topology allowing single-instance or multi-process replication on a single host.

The environment must not be redefined as:

- an ephemeral or serverless invocation model;
- a CLI-based execution model;
- a browser-based runtime;
- a self-supervised or self-orchestrating process model;
- a runtime class without mandatory network-based interaction;
- a topology requiring shared in-memory coordination between processes.

Changing this framework constitutes the creation of a different environmental form.

## 3. Non-Modifiable Environmental Invariants

The following environmental properties must not be weakened, removed, or reinterpreted:

- long-running process lifetime model;
- mandatory Node.js runtime platform class;
- external responsibility for process supervision, restart, and scaling;
- network socket–based request delivery;
- runtime isolation between process instances;
- absence of mandatory inter-process shared state;
- separation between environmental infrastructure and architectural structure.

Removal or modification of any of these items requires revision of `ctx/docs/environment/overview.md`.

## 4. Prohibited Environmental Expansions

The environment must not be expanded in the following directions:

- introduction of alternative runtime categories (browser, CLI, ephemeral execution);
- implicit support for non-network entry mechanisms;
- addition of mandatory distributed coordination assumptions;
- embedding process orchestration logic inside the system boundary;
- making reverse proxy mandatory;
- making a specific TLS termination model mandatory;
- introducing platform-specific hosting requirements as environmental invariants;
- introducing mandatory containerization;
- introducing distributed multi-host deployment topology.

The agent is not permitted to introduce new environmental assumptions not established in `ctx/docs/environment/overview.md`.

## 5. Prohibited Environmental Transformations

The following transformations are not permitted:

- shifting responsibility for process lifecycle management from host to system;
- internalizing restart, supervision, or load-balancing mechanisms;
- requiring inter-process synchronization as a condition of correctness;
- converting optional clustering into mandatory clustering;
- converting optional single-instance deployment into a prohibited mode;
- redefining deployment platform as part of system identity;
- removing the network-based interaction model;
- collapsing the boundary between environmental infrastructure and architectural entities.

Any of these transformations constitutes exiting the environmental boundaries.

## 6. Boundary of Permissible Evolution

Only the following environmental changes are permissible:

- clarification of runtime assumptions without altering runtime class;
- strengthening of isolation and supervision invariants;
- refinement of hosting descriptions without shifting responsibility;
- improved precision of deployment flexibility;
- elimination of ambiguity in environmental boundaries.

Environmental restructuring is possible only through explicit modification of `ctx/docs/environment/overview.md`.

## 7. Agent Responsibility

The LLM agent must:

- not introduce new runtime platforms;
- not reinterpret long-running process model;
- not embed orchestration or supervision logic into the system;
- not assume distributed coordination unless explicitly declared;
- not reinterpret optional environmental features as mandatory;
- not treat absence of prohibition as permission for environmental expansion;
- request user confirmation before proposing environmental reclassification.

## 8. Environmental Identity Boundary

The environment remains within its identity as long as:

- runtime classification remains long-running Node.js server process;
- supervision and orchestration remain external;
- network-based interaction remains primary entry mechanism;
- process isolation remains preserved;
- the deployment topology remains within a single-host boundary;
- deployment flexibility remains within declared topology class;
- environmental conditions do not redefine architectural structure.

Violation of any of these conditions constitutes an environmental branch change.
