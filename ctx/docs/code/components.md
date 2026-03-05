# Code Components Overview

Path: `./ctx/docs/code/components.md`
Version: `20260304`

## Purpose

This document enumerates the primary implementation components of the package at the code level and groups them by structural role for navigation, review, and agent-assisted development.

This document uses concrete namespace identifiers and file paths and therefore belongs exclusively to the `code/` level. Higher levels (`product/`, `architecture/`, `environment/`) remain name-agnostic and do not reference concrete implementation identifiers.

## Scope

The scope of this document is the backend runtime implementation located under `src/Back/`.

This document is descriptive of the current implementation shape and does not redefine product, architecture, or environment semantics.

## Component Groups

### Transport and Server

- `Fl32_Web_Back_Server` — web server component that starts and stops a Node.js HTTP/HTTP2/HTTPS server instance and forwards inbound requests into the coordination subsystem; `src/Back/Server.mjs`.
- `Fl32_Web_Back_Server_Config` — server configuration DTO factory for `port`, `type`, and TLS configuration; `src/Back/Server/Config.mjs`.
- `Fl32_Web_Back_Server_Config_Tls` — TLS configuration DTO factory for secure server mode; `src/Back/Server/Config/Tls.mjs`.
- `Fl32_Web_Back_Enum_Server_Type` — server transport mode enumeration (`http`, `http2`, `https`); `src/Back/Enum/Server/Type.mjs`.
- `Fl32_Web_Back_Defaults` — hardcoded defaults used by the server component; `src/Back/Defaults.mjs`.

### Coordination

- `Fl32_Web_Back_Pipeline_Engine` — Pipeline Engine component that applies registered handlers within the request lifecycle and enforces stage ordering semantics; `src/Back/PipelineEngine.mjs`.

### Handler Contract

- `Fl32_Web_Back_Api_Handler` — handler interface that defines the handler contract and registration metadata access; `src/Back/Api/Handler.mjs`.
- `Fl32_Web_Back_Dto_Handler_Info` — handler registration DTO factory defining `name`, `stage`, and relative ordering metadata; `src/Back/Dto/Handler/Info.mjs`.
- `Fl32_Web_Back_Enum_Stage` — handler stage enumeration (`INIT`, `PROCESS`, `FINALIZE`); `src/Back/Enum/Stage.mjs`.

### Built-in Handlers

- `Fl32_Web_Back_Handler_Pre_Log` — INIT-stage handler that logs request method and URL; `src/Back/Handler/Pre/Log.mjs`.
- `Fl32_Web_Back_Handler_Static` — PROCESS-stage handler that serves static files from configured sources; `src/Back/Handler/Static.mjs`.

### Static Handler Subsystem

- `Fl32_Web_Back_Dto_Handler_Source` — source configuration DTO factory used by the static handler; `src/Back/Dto/Handler/Source.mjs`.
- `Fl32_Web_Back_Handler_Static_A_Registry` — in-memory registry that stores normalized static source configurations and performs prefix matching; `src/Back/Handler/Static/A/Registry.mjs`.
- `Fl32_Web_Back_Handler_Static_A_Config` — source configuration normalizer and validator; `src/Back/Handler/Static/A/Config.mjs`.
- `Fl32_Web_Back_Handler_Static_A_Resolver` — path resolver that enforces allow rules and prevents traversal; `src/Back/Handler/Static/A/Resolver.mjs`.
- `Fl32_Web_Back_Handler_Static_A_Fallback` — directory fallback resolver that selects default index files; `src/Back/Handler/Static/A/Fallback.mjs`.
- `Fl32_Web_Back_Handler_Static_A_FileService` — file serving service that streams file contents and sets response headers; `src/Back/Handler/Static/A/FileService.mjs`.

### Helpers and Utilities

- `Fl32_Web_Back_Helper_Respond` — response helper that writes standard HTTP responses and checks response writability; `src/Back/Helper/Respond.mjs`.
- `Fl32_Web_Back_Helper_Order_Kahn` — handler ordering helper implementing topological sort for `before` and `after` constraints; `src/Back/Helper/Order/Kahn.mjs`.
- `Fl32_Web_Back_Helper_Cast` — primitive casting helper used by DTO factories; `src/Back/Helper/Cast.mjs`.
- `Fl32_Web_Back_Helper_Mime` — MIME type mapping helper used by static file serving; `src/Back/Helper/Mime.mjs`.

### Logging

- `Fl32_Web_Back_Logger` — logger implementation delegating to the Node.js console; `src/Back/Logger.mjs`.

## Notes on Module Extensions

The current implementation under `src/Back/` uses the `.mjs` extension in alignment with the engineering layout described by `ctx/docs/code/layouts/files.md` for ES modules.
