# Package Overview

`@flancer32/teq-web` is server-side request coordination infrastructure for TeqFW applications. It provides a deterministic handler pipeline for web requests and a built-in Node.js server that feeds requests into that pipeline.

This package is not a general-purpose web framework. It does not define routing, controllers, domain models, persistence, session handling, or application structure. Its role is limited to coordinating one request lifecycle inside a TeqFW modular monolith.

The package assumes the TeqFW DI runtime model and exposes its runtime surface through DI-managed modules under the `Fl32_Web_` namespace rooted at the published `src/` tree. In normal usage, application modules receive these dependencies through constructor injection and orchestrate them from DI-managed services rather than creating containers or wiring collaborators manually inside feature code.

Runtime startup configuration is exposed through `Fl32_Web_Back_Config_Runtime$` with flat transport fields `config.host`, `config.port`, `config.type`, and `config.tls`. The optional `host` field selects the listening address; when omitted, Node.js chooses its default listen address. The `tls` field is backed by `Fl32_Web_Back_Config_Runtime_Tls$`. Application-level configuration loading is coupled to the direct GitHub dependency `@teqfw/cfg`; this package owns only the transport-specific schema.

Use this package when external code needs one of these roles:

- accept plain HTTP requests or secure web requests with the built-in server;
- run request handlers through a fixed three-stage lifecycle;
- register multiple independent handlers with deterministic ordering;
- serve static files through the built-in PROCESS-stage handler.

Do not use this package as:

- a manually wired standalone web platform outside TeqFW DI;
- a replacement for an application router or MVC framework;
- a browser, CLI, or serverless runtime component.

The main consumer entry points are:

- `Fl32_Web_Back_PipelineEngine$` for request lifecycle coordination;
- `Fl32_Web_Back_Server$` for the built-in Node.js server;
- `Fl32_Web_Back_Api_Handler` plus `Fl32_Web_Back_Dto_Info__Factory$` and `Fl32_Web_Back_Dto_Info$` for custom handlers;
- `Fl32_Web_Back_Handler_Static$` plus `Fl32_Web_Back_Dto_Source$` values for static file serving.

## Agent Notes

- Prefer the canonical patterns in `recipes.md` when generating code.
- Treat `examples/minimal-server.md` as a minimal wiring example, not as the only acceptable code shape.
- Do not infer support for routing, controllers, middleware stacks, or directory listing from the existence of handlers or static-file serving.
- Prefer explicit static-source configuration, especially `allow`, instead of relying on omission-driven defaults.
- Compatibility note: older handlers may still use `context.complete()` or `context.isCompleted()`. These helpers are removed. Generate and migrate handler code to use `context.completed = true`.
