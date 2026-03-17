# Core Abstractions

## Pipeline Engine

`Fl32_Web_Back_PipelineEngine$` is the single lifecycle coordinator. It owns handler registration, derives deterministic order from handler metadata, creates one request context per request, and executes handlers in this fixed order:

`INIT -> PROCESS -> FINALIZE`

Main methods:

- `addHandler(handler)` or `registerHandler(handler)` registers a handler before the pipeline is locked;
- `lockHandlers()` freezes handler order explicitly;
- `onEventRequest(req, res)` or `handleRequest(req, res)` executes one request lifecycle.

## Server

`Fl32_Web_Back_Server$` is the built-in transport adapter around Node.js `http` and `http2`. On `start(cfg)` it locks the pipeline, creates the server instance, binds request events to the Pipeline Engine, and starts listening.

Default transport settings come from flat fields of `Fl32_Web_Back_Config_Runtime$` (`port`, `type`, `tls`). TLS values for `tls` are provided by the dedicated runtime configuration component `Fl32_Web_Back_Config_Runtime_Tls$`. Supported transport modes come from `Fl32_Web_Back_Enum_Server_Type$`:

- `http`
- `http2`
- `https`

`https` requires `server.tls`.

## Handler Contract

Custom handlers implement `Fl32_Web_Back_Api_Handler`:

- `getRegistrationInfo()` returns handler metadata;
- `handle(context)` performs work for one request.

Handler metadata is created with `Fl32_Web_Back_Dto_Info__Factory$` and contains:

- `name`: unique handler name;
- `stage`: `INIT`, `PROCESS`, or `FINALIZE`;
- `before`: handler names that must run after this handler;
- `after`: handler names that must run before this handler.

Ordering is resolved once from this metadata and is deterministic within each stage.

## Request Context

The Pipeline Engine passes one request-scoped context to every handler. Its stable fields are:

- `request`: Node.js request object;
- `response`: Node.js response object;
- `data`: mutable per-request shared storage for handlers;
- `completed`: completion flag;
- `complete()`: marks request processing as completed;
- `isCompleted()`: reads the completion state.

Handlers may mutate `data` and may read the rest of the context. They must not replace the context object.

## Stage Semantics

- `INIT`: always runs first; use for setup, logging, request enrichment, or guard preparation.
- `PROCESS`: runs until completion is marked; use for actual request handling.
- `FINALIZE`: always runs last; use for cleanup and post-processing.

Only `PROCESS` handlers may mark the request as completed.

## Built-in Static Handler

`Fl32_Web_Back_Handler_Static$` is a PROCESS-stage handler for static file delivery. Before use, call `init({sources})` with source DTOs created by `Fl32_Web_Back_Dto_Source$Factory`.

Each source describes:

- `root`: filesystem root;
- `prefix`: URL prefix matched by the handler;
- `allow`: optional allowlist map for paths under the source;
- `defaults`: optional fallback filenames for directory requests.

If the static handler serves a file successfully, it marks the request as completed.
