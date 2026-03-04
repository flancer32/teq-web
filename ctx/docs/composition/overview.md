# Composition Overview

Path: `./ctx/docs/composition/overview.md`
Version: `20260304`

## 1. Purpose of the Level

The compositional form of the system is defined at this level, including the execution model, phase transitions, and temporal interaction between architectural units, without introducing architectural restructuring, environmental assumptions, or implementation details.

Composition is derived strictly from `./ctx/docs/architecture/overview.md` and does not introduce new architectural entities.

Compositional constraints are defined in `./ctx/docs/composition/constraints.md`.

## 2. Execution Model Classification

The system operates as:

- a request-driven execution model;
- a multi-phase lifecycle model.

The compositional identity of the system is defined by repeated, bounded lifecycles of individual request processing instances. Execution is triggered by the appearance of a Web Request and proceeds through a fixed sequence of lifecycle phases.

This classification defines how architectural units interact over time, not how they are implemented.

## 3. Fundamental Execution Unit

The compositional model is organized around:

- a single request lifecycle.

A single execution instance is defined as the complete lifecycle of one Web Request inside the architectural boundary, from activation to terminal resolution.

The runtime process of the server is not considered a fundamental execution unit; it serves only as a carrier of repeated request lifecycles.

## 4. Lifecycle Phases

The compositional model consists of the following stable phases:

1. Activation Phase: a Web Request appears within the architectural boundary and becomes eligible for processing.

2. Context Formation Phase: a Request Context is created and associated with the incoming request.

3. Sequential Processing Phase: registered Handlers are applied sequentially in the order fixed by architectural configuration within the defined contours.

4. Resolution Phase: execution produces one terminal structural entity, either a Processing Result or a Processing Error.

5. Context Disposal Phase: the Request Context completes its lifecycle and ceases to exist within the system.

Sequential Processing Phase is internally structured as a three-stage pipeline: PRE stage, PROCESS stage, and POST stage. PRE Handlers are executed sequentially and the stage terminates on either completion or failure. PROCESS Handlers are executed sequentially until one Handler produces a terminal handling decision or a failure occurs. POST Handlers are executed sequentially and are mandatory regardless of the outcome of PRE or PROCESS, including failure.

Each phase:

- has a defined structural purpose;
- depends on the completion of the previous phase;
- does not redefine architectural contours.

This level defines temporal ordering and phase transitions.

## 5. Phase Transitions

Execution begins with the Activation Phase upon the appearance of a Web Request.

Control moves deterministically and linearly from one phase to the next. Phase transitions are strictly ordered, occur exactly once per execution instance, and are governed by a single transition authority internal to the lifecycle flow.

The lifecycle contains no branching between phases and no return to previous phases. The Resolution Phase is mandatory and represents the only valid termination point of execution. The PROCESS stage of Sequential Processing Phase may terminate when a Handler produces a terminal handling decision, and this termination does not alter the phase ordering of the lifecycle.

## 6. Concurrency Model

The system allows multiple execution instances (request lifecycles) to coexist.

Each lifecycle:

- is structurally isolated;
- does not interact with other lifecycles;
- does not share compositional state.

The presence of concurrent lifecycles does not alter the phase structure or internal ordering of any single execution instance.

Concurrency is defined at the model level without reference to runtime mechanisms or infrastructure.

## 7. Stability and Reconfiguration

Structural configuration of the processing pipeline is established in the architectural Configuration Phase and is treated as stable during each execution instance (see `./ctx/docs/architecture/overview.md` and `./ctx/docs/architecture/constraints.md`). Dynamic reconfiguration during an active execution instance is outside the compositional model.

Temporal invariants apply equally to all execution instances.

## 8. Failure and Termination Model

Failure is represented structurally as a Processing Error.

The Resolution Phase always produces exactly one of two terminal entities:

- Processing Result (normal termination);
- Processing Error (failure termination).

Failure does not remove the Resolution Phase or Context Disposal Phase. Instead, it is resolved within the same linear phase structure and leads to a deterministic terminal state. Failure during PRE or PROCESS terminates further execution of remaining Handlers in the active stage and transitions into the mandatory POST stage before terminal resolution.

Unresolved, partially completed, or abandoned lifecycles are not valid compositional states.

## 9. Compositional Boundaries

The composition is responsible for:

- defining execution order;
- defining lifecycle phases;
- defining deterministic phase transitions;
- defining temporal isolation between execution instances.

The composition is not responsible for:

- defining structural entities (architecture level);
- defining domain meaning (product level);
- defining infrastructure (environment level);
- defining code organization (code level).

## 10. Structural Map of the Level

This overview may be extended by:

- `composition/lifecycle/*.md`
- `composition/flows/*.md`
- `composition/concurrency/*.md`
- `composition/failure-model/*.md`

These documents elaborate execution dynamics but do not introduce new architectural entities.

## 11. Summary of Compositional Form

The composition is defined as:

- a request-driven, single-instance lifecycle model;
- organized into five strictly ordered phases;
- operating through deterministic linear transitions;
- terminating exclusively with either Processing Result or Processing Error;
- allowing multiple isolated execution instances to coexist without interaction.
