# Changelog

## [0.3.0] - 2025-06-26

### Added
- Generalized NPM handler into a Source handler with DTO-based configuration.
- Unit tests for the dispatcher and built-in handlers.

### Changed
- Static handler refactored into modular components with before/after ordering.

### Fixed
- Improved validation messages for static handler configuration.
- File service now reports specific filesystem errors.

## [0.2.0] - 2025-06-21

### Added
- Integration test covering static file serving from `node_modules`.
- Static handler can serve files from `node_modules` via `Handler_Source`.
- JSDoc examples for initializing the static handler with a `Handler_Source` DTO.

## [0.1.0] - 2025-06-11

### Added
- Initial release of `@flancer32/teq-web`, a TeqFW plugin for centralized HTTP(S) request handling.
- Dispatcher with three-stage lifecycle: `pre`, `process`, and `post`, each with isolated execution logic.
- Middleware registration with support for execution order via `before`/`after` dependencies.
- Support for custom adapters to integrate with various web servers (e.g., Express, Fastify, Node.js `http`).
- Basic Node.js HTTP server implementation for standalone use cases.
- Unified interfaces for registering request handlers from other teq-plugins.
- Modular architecture compatible with Tequila Framework philosophy.

