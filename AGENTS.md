# AGENTS.md

## Project: @flancer32/teq-web

This project implements a request dispatcher plugin for Tequila Framework (TeqFW).  
The plugin provides a multi-stage handler system (`pre`, `process`, `post`) and integrates directly with Node.js servers (`http`, `http2`, `https`) without external dependencies.

---

## Project Structure

| Directory                  | Description                                                                |
|----------------------------|----------------------------------------------------------------------------|
| `/src/Back/Api/Handler.js` | Interface for all request handlers.                                        |
| `/src/Back/Dispatcher.js`  | Core dispatcher that orchestrates handler execution.                       |
| `/src/Back/Handler/`       | Built-in request handlers (`Pre_Log`, `Static`, `Source`, etc).            |
| `/src/Back/Helper/`        | Internal helpers (`Mime`, `Respond`, `Order_Kahn`, etc).                   |
| `/src/Back/Dto/`           | DTO factories used to pass typed configuration and metadata.               |
| `/src/Back/Server.js`      | Standalone HTTP(S) server implementation using built-in Node.js libraries. |

---

## Execution Agents

### Dispatcher

- File: `Back/Dispatcher.js`
- Role: Core runtime coordinator for HTTP requests.
- Interface: uses `Fl32_Web_Back_Api_Handler` and topological ordering via `Order_Kahn`.

### Server

- File: `Back/Server.js`
- Role: HTTP/1.1, HTTP/2, or HTTPS web server.
- Launches `Dispatcher.onEventRequest()` on each request.

### Handlers

- Files: `Back/Handler/Pre_Log.js`, `.../Static.js`, `.../Source.js`
- Role: Modular request processors, registered via `Dispatcher.addHandler()`.
- Lifecycle: Initialized once, executed per request by dispatcher.

---

## Code Style

- Language: Modern JavaScript (ES2022+).
- No static imports (uses DI-based module resolution).
- All comments and messages must be in English (strict rule).
- File naming: PascalCase with dot-separated exports, e.g. `Fl32_Web_Back_Enum_Stage`.

---

## Testing

- Unit tests must be provided for all runtime agents (Dispatcher, Handlers).
- Test framework: `node:test`.
- Mocks: registered via custom `buildTestContainer()` helper.
- Location: colocated or `/test/` folder depending on iteration.

---

## Build & Execution

- This project is a TeqFW plugin. It is not compiled or bundled.
- Executed in-place by Tequila runtime.
- Requires a DI container to resolve dependencies at runtime.

---

## Contribution Rules (for AI Agents)

- When creating new Handlers, they **must** implement `Fl32_Web_Back_Api_Handler` and provide `getRegistrationInfo()`.
- Handlers must be registered with `Dispatcher.addHandler()` and ordered with `orderHandlers()`.
- All request-handling code **must** call `respond.isWritable(res)` before sending a response.
- Do not modify existing dispatcher logic directly — create a new handler or helper instead.

---

## Conventions for AI Tools (Codex, etc.)

- Start by inspecting `Dispatcher.js` and `Handler/` folder to locate runtime behavior.
- DTOs are created via `*.create(data)` methods and used to validate configs.
- Use `getRegistrationInfo().stage` to determine when a handler runs (`pre`, `process`, `post`).
- Prefer composition over inheritance. Avoid using `extends`.
- Respect topological order defined via `before`/`after`.

---

## CI/Automation

- No CI defined yet. Future CI will:
    - Validate handler registration structure.
    - Enforce code style and comment policy.
    - Run full test suite before merge.

---

## License

This project is licensed under the Apache-2.0 license.
