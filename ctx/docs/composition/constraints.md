# Composition Constraints

Path: `./ctx/docs/composition/constraints.md`

## 1. Purpose of the Document

Mandatory compositional constraints are defined in this document. The constraints establish the boundaries of the system’s execution model, lifecycle dynamics, phase ordering, and temporal invariants. This document does not describe architectural structure, product semantics, environmental conditions, or implementation details.

Composition is derived strictly from `./ctx/docs/composition/overview.md`.

## 2. Immutable Execution Model

The composition is permanently defined as:

- a request-driven execution model;
- a single fundamental execution unit — request lifecycle;
- a bounded single-instance lifecycle model;
- a strictly ordered five-phase lifecycle;
- a deterministic, linear, non-branching phase transition model;
- a structurally isolated concurrency model;
- a mandatory terminal resolution model.

The composition must not be redefined as:

- a multi-unit execution model;
- an event-loop–driven internal orchestration model;
- a branching or graph-based lifecycle model;
- a nested or recursive lifecycle model;
- a cross-context reactive coordination model;
- a session-driven or long-lived execution model.

Changing this framework constitutes the creation of a different compositional form.

## 3. Non-Modifiable Temporal Invariants

The following compositional properties must not be weakened, removed, or reinterpreted:

- existence of exactly one fundamental execution unit — request lifecycle;
- lifecycle completeness from Activation to Context Disposal;
- strict linear ordering of lifecycle phases without repetition;
- mandatory execution of all phases exactly once per lifecycle;
- existence of a single transition authority governing phase transitions;
- mandatory sequential execution of all registered PRE Handlers and all registered POST Handlers within Sequential Processing Phase;
- sequential execution of PROCESS Handlers until a terminal handling decision is produced or a failure occurs;
- single terminal resolution per execution instance;
- termination exclusively with Processing Result or Processing Error;
- mandatory Context Disposal Phase regardless of termination type;
- isolation of concurrent execution instances;
- absence of cross-instance temporal influence;
- absence of shared compositional state between execution instances;
- absence of phase skipping within the lifecycle;
- absence of early termination before Resolution Phase outside the PROCESS-stage terminal handling decision.

Removal or modification of any of these items requires revision of `./ctx/docs/composition/overview.md`.

## 4. Prohibited Execution Model Expansions

The composition must not be expanded in the following directions:

- introduction of alternative lifecycle variants;
- introduction of additional lifecycle phases;
- merging or collapsing existing lifecycle phases;
- dynamic insertion or removal of phases during execution;
- introduction of nested or sub-lifecycles within one execution instance;
- aggregation of multiple request lifecycles into a composite lifecycle;
- introduction of parallel execution of Handlers;
- introduction of conditional execution models beyond the PROCESS-stage terminal handling decision;
- introduction of cross-instance coordination or synchronization models;
- reinterpretation of failure as a non-terminal or recoverable intermediate state.

The composition introduces no execution forms beyond those established in `./ctx/docs/composition/overview.md`.

## 5. Prohibited Lifecycle Transformations

The following transformations are not permitted:

- conversion of linear lifecycle into branching, conditional, or cyclic graphs;
- introduction of early termination paths bypassing defined phases;
- skipping of PRE Handlers or POST Handlers within Sequential Processing Phase;
- reordering of Handlers during execution;
- dynamic mutation of the pipeline during active lifecycle;
- repetition of any lifecycle phase within one execution instance;
- external termination of lifecycle without structural resolution;
- persistence of Request Context beyond defined lifecycle boundaries;
- merging, coupling, or synchronizing multiple execution instances.

Any of these transformations constitutes exiting the compositional boundaries.

## 6. Boundary of Permissible Evolution

Only the following compositional changes are permissible:

- clarification of lifecycle phase descriptions without altering ordering or cardinality;
- strengthening of temporal invariants;
- refinement of isolation rules without changing structural independence;
- improved precision of terminal state articulation;
- elimination of ambiguity in phase transition wording.

Compositional expansion or restructuring is defined only through explicit modification of `./ctx/docs/composition/overview.md`.

## 7. Agent Responsibility

When changes are produced by an LLM agent:

- not introduce alternative execution models;
- not reinterpret linear phase ordering;
- not weaken mandatory phase completeness;
- not introduce early termination paths;
- not introduce hidden lifecycle branches or sub-lifecycles;
- not weaken isolation between execution instances;
- not reinterpret failure as a non-terminal state;
- request user confirmation before proposing compositional transformations.

## 8. Compositional Identity Boundary

The composition remains within its identity as long as:

- a single request lifecycle remains the only execution unit;
- lifecycle phases remain strictly ordered, deterministic, and non-repeating;
- every lifecycle terminates exactly once with Result or Error;
- Context Disposal remains mandatory;
- all PRE and POST Handlers are executed sequentially without skipping;
- PROCESS Handlers are executed sequentially until a terminal handling decision or failure;
- execution instances remain temporally isolated;
- no alternative execution graphs are introduced.

Violation of any of these conditions constitutes a compositional branch change.
