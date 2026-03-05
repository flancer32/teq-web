# Architecture Constraints

Path: `./ctx/docs/architecture/constraints.md`
Version: `20260305`

## 1. Purpose of the Document

This document defines mandatory architectural constraints of the system.

The constraints establish the boundaries of the system’s structural form, its permitted modes of existence, and prohibited directions of architectural transformation.

This document does not define product semantics, environment conditions, or implementation techniques.

Architectural form is defined in:

`./ctx/docs/architecture/overview.md`

This document protects that architectural form from structural transformation.

## 2. Prohibited Architectural Reclassification

Any transformation that changes the architectural class defined in `./ctx/docs/architecture/overview.md` is prohibited.

The following transformations constitute architectural reclassification:

- introduction of additional lifecycle execution centers outside the Pipeline Engine;
- introduction of distributed, nested, or peer orchestration structures within the system boundary;
- replacement of the pipeline-centered architecture with a framework-style layered abstraction as the primary system form;
- introduction of a transport-framework-dependent execution model as an architectural requirement;
- introduction of global mutable processing state governing request lifecycle behavior;
- replacement of the Pipeline Engine with alternative or competing coordination centers within the same architectural instance.

## 3. Configuration Invariants

The architecture operates in two structural modes:

- Configuration Phase
- Execution Phase

The following transformations are prohibited:

- re-entry into Configuration Phase after Execution Phase has begun;
- runtime modification of Server operational parameters after activation;
- runtime registration, removal, or replacement of Handlers after Configuration Phase;
- runtime mutation of Processing Pipeline ordering or composition;
- runtime replacement or rebinding of the Pipeline Engine to a different handler set;
- introduction of mechanisms whose purpose is architectural reconfiguration during Execution Phase.

Relaxation of the one-time configuration rule constitutes architectural restructuring and requires explicit revision of `./ctx/docs/architecture/overview.md`.

## 4. Prohibited Structural Expansions

The architecture must not be expanded in the following directions:

- implicit creation of new architectural contours or structural units beyond those defined in `./ctx/docs/architecture/overview.md`;
- extension of the architectural data entity set beyond Web Request and Transport Response;
- embedding external framework-specific transport abstractions inside architectural data entities;
- inclusion of DI container (`@teqfw/di`) or application-level modules and business logic inside the architectural boundary.

## 5. Execution Semantics Invariants

Execution semantics defined in `./ctx/docs/architecture/overview.md` must remain unchanged.

The following transformations are prohibited:

- introduction of execution units other than the request-processing execution instance;
- execution instances that produce more than one terminal outcome;
- execution instances that terminate without producing a transport response;
- interaction or coordination between concurrent execution instances;
- introduction of alternative request-processing execution paths bypassing the Processing Pipeline;
- allowing `INIT` or `FINALIZE` handlers to mark request processing as completed;
- allowing request processing completion to be reset after it has been marked completed.

Handlers must not perform transport-level operations.

Handlers produce Transport Response specifications but must not directly write to network sockets or perform HTTP response transmission.

Actual network transmission of responses is performed exclusively by the Server component after pipeline completion.

These constraints guarantee that request processing remains a deterministic pipeline-based execution model.

## 6. Prohibited Structural Transformations

The following transformations are not permitted:

- persistence of request-processing state beyond the lifetime of a single request;
- cross-request shared mutable state that violates request isolation;
- request processing performed outside the Processing Pipeline;
- framework-dependent transformation of Web Request into transport-specific objects as a structural requirement;
- introduction of parallel alternative request-processing execution models within the same architectural instance.

Any of these transformations constitutes exit from the architectural boundaries.

## 7. Boundary of Permissible Evolution

Architectural evolution is limited to changes that:

- clarify structural definitions without altering meaning;
- strengthen architectural invariants;
- refine descriptions of contours and responsibilities;
- improve precision of Configuration/Execution articulation;
- restructure the architecture only through explicit revision of `./ctx/docs/architecture/overview.md`.

Any structural change must be explicitly documented in the architectural overview.

## 8. Architectural Identity Boundary

Architectural identity collapses if any of the following occur:

- the execution topology introduces more than one lifecycle coordination authority or removes the Pipeline Engine as the unique execution center;
- the Configuration/Execution separation is violated by runtime reconfiguration;
- the Processing Pipeline becomes structurally mutable during Execution Phase;
- request-scoped processing state loses isolation or becomes persistent beyond a single request lifecycle;
- shared mutable state becomes a coordination mechanism between handlers;
- architectural contours, architectural data entities, or system boundaries expand beyond those defined in `./ctx/docs/architecture/overview.md`.

Violation of any of these conditions constitutes an architectural branch change.
