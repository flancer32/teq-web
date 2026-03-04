# Code Components Overview

Path: `./ctx/docs/code/components.md`
Version: `20260304`

## Purpose

This document enumerates the primary implementation components of the package at the code level and groups them by structural role for navigation, review, and agent-assisted development.

This document uses concrete namespace identifiers and file paths and therefore belongs exclusively to the `code/` level. Higher levels (`product/`, `architecture/`, `composition/`) remain name-agnostic and do not reference concrete implementation identifiers.

## Scope

The scope of this document is the backend runtime implementation located under `src/Back/`.

This document is descriptive of the current implementation shape and does not redefine product, architecture, composition, or environment semantics.

## Component Groups

### Transport and Server

- `Fl32_Web_Back_Server` — web server component that starts and stops a Node.js HTTP/HTTP2/HTTPS server instance and forwards inbound requests into the coordination subsystem; `src/Back/Server.js`.
- `Fl32_Web_Back_Server_Config` — server configuration DTO factory for `port`, `type`, and TLS configuration; `src/Back/Server/Config.js`.
- `Fl32_Web_Back_Server_Config_Tls` — TLS configuration DTO factory for secure server mode; `src/Back/Server/Config/Tls.js`.
- `Fl32_Web_Back_Enum_Server_Type` — server transport mode enumeration (`http`, `http2`, `https`); `src/Back/Enum/Server/Type.js`.
- `Fl32_Web_Back_Defaults` — hardcoded defaults used by the server component; `src/Back/Defaults.js`.

### Coordination

- `Fl32_Web_Back_Dispatcher` — dispatcher that applies registered handlers within the request lifecycle and enforces stage ordering semantics; `src/Back/Dispatcher.js`.

### Handler Contract

- `Fl32_Web_Back_Api_Handler` — handler interface that defines the handler contract and registration metadata access; `src/Back/Api/Handler.js`.
- `Fl32_Web_Back_Dto_Handler_Info` — handler registration DTO factory defining `name`, `stage`, and relative ordering metadata; `src/Back/Dto/Handler/Info.js`.
- `Fl32_Web_Back_Enum_Stage` — handler stage enumeration (`pre`, `process`, `post`); `src/Back/Enum/Stage.js`.

### Built-in Handlers

- `Fl32_Web_Back_Handler_Pre_Log` — pre-stage handler that logs request method and URL; `src/Back/Handler/Pre/Log.js`.
- `Fl32_Web_Back_Handler_Static` — process-stage handler that serves static files from configured sources; `src/Back/Handler/Static.js`.

### Static Handler Subsystem

- `Fl32_Web_Back_Dto_Handler_Source` — source configuration DTO factory used by the static handler; `src/Back/Dto/Handler/Source.js`.
- `Fl32_Web_Back_Handler_Static_A_Registry` — in-memory registry that stores normalized static source configurations and performs prefix matching; `src/Back/Handler/Static/A/Registry.js`.
- `Fl32_Web_Back_Handler_Static_A_Config` — source configuration normalizer and validator; `src/Back/Handler/Static/A/Config.js`.
- `Fl32_Web_Back_Handler_Static_A_Resolver` — path resolver that enforces allow rules and prevents traversal; `src/Back/Handler/Static/A/Resolver.js`.
- `Fl32_Web_Back_Handler_Static_A_Fallback` — directory fallback resolver that selects default index files; `src/Back/Handler/Static/A/Fallback.js`.
- `Fl32_Web_Back_Handler_Static_A_FileService` — file serving service that streams file contents and sets response headers; `src/Back/Handler/Static/A/FileService.js`.

### Helpers and Utilities

- `Fl32_Web_Back_Helper_Respond` — response helper that writes standard HTTP responses and checks response writability; `src/Back/Helper/Respond.js`.
- `Fl32_Web_Back_Helper_Order_Kahn` — handler ordering helper implementing topological sort for `before` and `after` constraints; `src/Back/Helper/Order/Kahn.js`.
- `Fl32_Web_Back_Helper_Cast` — primitive casting helper used by DTO factories; `src/Back/Helper/Cast.js`.
- `Fl32_Web_Back_Helper_Mime` — MIME type mapping helper used by static file serving; `src/Back/Helper/Mime.js`.

### Logging

- `Fl32_Web_Back_Logger` — logger implementation delegating to the Node.js console; `src/Back/Logger.js`.

## Notes on Module Extensions

The current implementation under `src/Back/` uses the `.js` extension. The target engineering layout described by `ctx/docs/code/layouts/files.md` requires `.mjs` for ES modules, and this migration is tracked as an implementation alignment task rather than as a change of the code-level component set.

