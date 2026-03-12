# Usage Rules

## Structural Rules

- The Pipeline Engine is the only request-lifecycle coordinator.
- Request processing always uses the fixed stage sequence `INIT -> PROCESS -> FINALIZE`.
- Handlers are registered during setup and must not be added, removed, or reordered after startup.
- Handler ordering is declarative and derived from `name`, `before`, and `after`.

## Completion Rules

- Request completion is a monotonic flag for one request.
- Only `PROCESS` handlers may call `context.complete()` or set completion to `true`.
- `INIT` and `FINALIZE` handlers must never mark the request completed.
- Completion cannot be reset once set.

## Response Rules

- Exactly one terminal HTTP response must result from each request.
- If no `PROCESS` handler completes the request and the response is still writable, the Pipeline Engine returns `404 Not Found`.
- If a `PROCESS` handler throws and the response is still writable, the Pipeline Engine returns `500 Internal Server Error` and stops further PROCESS handlers.
- Exceptions in `INIT` and `FINALIZE` handlers are isolated and do not abort the pipeline.

## Transport Boundary

- Handlers work on request context and response specification only.
- Handlers must not perform transport-level transmission or socket management.
- Actual network response transmission belongs to the built-in `Server` or to the external transport framework that called the Pipeline Engine.

## Environment Assumptions

- Runtime is Node.js 20 or newer.
- The package is intended for long-running server processes.
- Process supervision, restart, scaling, reverse proxying, and load balancing are external concerns.
- Multiple instances may run concurrently, but they are independent and must not rely on shared in-memory state.

## DI Usage Rules

- The package is designed for `@teqfw/di`.
- Consumer code should resolve package modules through the `Fl32_Web_` namespace mapped to the package `src/` path.
- Treat helper internals under deep implementation paths as non-essential unless the task specifically requires them. Preferred consumer entry points are the Pipeline Engine, Server, handler API, DTO factories, enums, and built-in handlers.
