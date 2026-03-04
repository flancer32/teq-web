# Architecture Constraints

Path: `./ctx/docs/architecture/constraints.md`
Version: `20260303`

## 1. Purpose of the Document

Mandatory architectural constraints are defined in this document. The constraints establish the boundaries of the system’s structural form, its modes of existence, and prohibited directions of architectural transformation. This document does not describe product semantics, composition dynamics, environment conditions, or implementation details.

## 2. Prohibited Architectural Reclassification

Any transformation that changes the architectural class fixed in `./ctx/docs/architecture/overview.md` is prohibited.

The following changes constitute architectural reclassification:

- introduction of additional coordination loci or redistribution of lifecycle control outside the Dispatcher;
- introduction of distributed, nested, or peer orchestration within the system boundary;
- replacement of the coordinator-centered structure with a framework-like layered abstraction as the primary architectural form;
- introduction of a transport-framework-dependent execution model as an architectural requirement;
- introduction of global mutable processing state governing request lifecycle behavior;
- replacement of the orchestration core with alternative or competing coordination centers within the same architectural instance.

## 3. Configuration Invariants

The architecture operates in two structural modes: Configuration Phase and Execution Phase.

The following transformations are prohibited:

- re-entry into Configuration Phase after Execution has begun;
- runtime modification of Server operational parameters after activation;
- runtime Handler registration, removal, or replacement after Configuration;
- runtime mutation of processing pipeline ordering or composition;
- runtime replacement or re-binding of the Dispatcher to a different Handler Registry;
- introduction of runtime mechanisms whose purpose is architectural reconfiguration.

Any relaxation of the phase separation or one-time configuration act constitutes architectural restructuring and requires explicit revision of `./ctx/docs/architecture/overview.md`.

## 4. Prohibited Structural Expansions

The architecture must not be expanded in the following directions:

- implicit creation of new architectural contours or architectural units beyond those defined in `./ctx/docs/architecture/overview.md`;
- extension of the architectural data entity set beyond Web Request, Request Context, Processing Result, and Processing Error;
- embedding external framework-specific transport abstractions inside architectural data entities;
- inclusion of DI container (`@teqfw/di`) or application-level modules and business logic inside the architectural boundary.

## 5. Prohibited Structural Transformations

The following transformations are not permitted:

- persistence of Request Context beyond a single request lifecycle;
- any cross-context state sharing that breaks Request Context isolation;
- request processing outside the architectural contours fixed in `./ctx/docs/architecture/overview.md`;
- framework-dependent transformation of Web Request into transport-specific objects as a structural requirement;
- parallel alternative execution models within the same architectural instance.

Any of these transformations constitutes exiting the architectural boundaries.

## 6. Boundary of Permissible Evolution

Only the following architectural changes are permissible:

- clarification of structural definitions without altering meaning;
- strengthening of invariants;
- formal refinement of contour descriptions without shifting responsibility;
- improved precision of Configuration/Execution articulation;
- documented structural refactoring that explicitly revises `./ctx/docs/architecture/overview.md`.

Architectural restructuring is possible only through explicit modification of `./ctx/docs/architecture/overview.md`.

## 7. Architectural Identity Boundary

Architectural identity collapses if any of the following occur:

- the coordination topology ceases to have exactly one orchestration locus (Dispatcher) or introduces distributed, nested, or competing orchestration centers;
- the Configuration/Execution separation is violated by runtime reconfiguration or re-entry into Configuration;
- the processing pipeline becomes structurally mutable during Execution Phase;
- Request Context loses transience or isolation, or shared mutable state is introduced as a coordination mechanism;
- architectural contours, architectural data entities, or the system boundary are extended beyond what is fixed in `./ctx/docs/architecture/overview.md`.

Any identity collapse constitutes an architectural branch change.
