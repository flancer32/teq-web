# Core Abstractions

## Pipeline Engine

`Fl32_Web_Back_PipelineEngine$` is the single lifecycle coordinator. It owns handler registration, derives deterministic order from handler metadata, creates one request context per request, and executes handlers in this fixed order:

`INIT -> PROCESS -> FINALIZE`

Main methods:

- `addHandler(handler)` or `registerHandler(handler)` registers a handler before the pipeline is locked;
- `lockHandlers()` freezes handler order explicitly;
- `onEventRequest(req, res)` or `handleRequest(req, res)` executes one request lifecycle after the pipeline has been locked.

## Server

`Fl32_Web_Back_Server$` is the built-in transport adapter around Node.js `http` and `http2`. On `start(cfg)` it locks the pipeline, creates the server instance, binds request events to the Pipeline Engine, and starts listening.

Default transport settings come from flat fields of `Fl32_Web_Back_Config_Runtime$` (`port`, `type`, `tls`). TLS values for `tls` are provided by the dedicated runtime configuration component `Fl32_Web_Back_Config_Runtime_Tls$`. Supported transport modes come from `Fl32_Web_Back_Enum_Server_Type$`:

- `http`
- `http2`
- `https`

Mode meaning:

- `http` is plain HTTP.
- `http2` is cleartext HTTP/2.
- `https` is secure web transport implemented through the Node.js secure `http2` server and may negotiate `HTTP/2` or fall back to `HTTP/1.1`.

`https` requires `config.tls` to contain both `key` and `cert`.

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

Preferred generated code shape:

- Prefer ordinary class methods over assigning handler methods inside the constructor.
- Keep `getRegistrationInfo()` stable after construction.
- In `PROCESS` handlers, prefer `context.completed = true` after the response is finalized.

## Request Context

The Pipeline Engine passes one request-scoped context to every handler. Consumer code should rely on these stable fields:

- `request`: Node.js request object;
- `response`: Node.js response object;
- `data`: mutable per-request shared storage for handlers;
- `completed`: completion flag.

Handlers may mutate `data` and may read the rest of the context. They must not replace the context object.

Runtime detail:

- The Pipeline Engine enforces completion semantics through the `completed` field during request execution.
- For generated handler code, use the stable field `context.completed = true`.

## Stage Semantics

- `INIT`: always runs first; use for setup, logging, request enrichment, or guard preparation.
- `PROCESS`: runs until completion is marked; use for actual request handling.
- `FINALIZE`: always runs last; use for cleanup and post-processing.

Only `PROCESS` handlers may mark the request as completed.

## Built-in Static Handler

`Fl32_Web_Back_Handler_Static$` is a PROCESS-stage handler for static file delivery. Before use, call `init({sources})` with source DTOs created by `Fl32_Web_Back_Dto_Source__Factory$`.

Each source describes:

- `root`: filesystem root;
- `prefix`: URL prefix matched by the handler;
- `allow`: optional allowlist map that limits which paths under `root` may be served;
- `defaults`: optional fallback filenames for directory requests.

Important behavior:

- Omitting `allow` does not enable directory listing. The handler still serves only a concrete file path or a fallback file from `defaults`.
- If `allow` is omitted, any path under `root` may be resolved, subject to traversal protection and file existence checks.
- If `allow` is provided, only paths matched by its rules may be served.
- For agent-generated configurations, prefer specifying `allow` explicitly instead of relying on omission.

Example static handler setup:

```javascript
const source = dtoSourceFactory.create({
  root: "./web",
  prefix: "/",
  allow: {
    ".": ["assets", "favicon.ico", "robots.txt"],
  },
  defaults: ["index.html"],
});

await staticHandler.init({sources: [source]});
pipeline.addHandler(staticHandler);
```

In this example:

- `root` points to the filesystem directory used for static files;
- `prefix` means requests under `/` are checked against this source;
- `allow` permits only `assets/**`, `favicon.ico`, and `robots.txt` under `root`;
- `defaults` allows `/` or any allowed directory request to fall back to `index.html` when that file exists.

If the static handler serves a file successfully, it marks the request as completed.
