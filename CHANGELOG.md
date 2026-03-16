# Changelog

## [0.6.0] - 2026-03-16 - Runtime configuration hardening

### Added
- Added JSDoc coverage for request-context DTO usage and runtime configuration components.

### Changed
- Refined runtime configuration composition for server and TLS settings.
- Hardened runtime configuration objects to remain immutable after initialization.
- Updated package version metadata to `0.6.0`.

## [0.5.0] - 2026-03-13

### Added
- Added `ai/` documentation for agent-oriented project materials.
- Added a non-resettable request-context attribute.
- Added component type conventions to the cognitive context.

### Changed
- Updated `README.md` with package and agent-interface documentation refinements.
- Migrated dependency injection to `@teqfw/di` v2 and updated package metadata accordingly.
- Refined architecture and terminology around the dispatcher, request context, and transport boundary.
- Reworked source files to codex-generated module layout and aligned exported namespace style with the `$` convention.
- Verified modules in `src/` against updated TeqFW ES module conventions and aligned DTO component types with those rules.
- Restructured and cleaned up `ctx/docs`, including TeqFW convention documents and removal of the obsolete composition level.
- Moved the accept test into the integration test suite.
- Refreshed runtime and development dependencies.

### Removed
- Removed legacy code, tests, and the shared `common.mjs` unit-test helper.

## [0.4.0] - 2025-12-20

### Added
- TypeScript type declarations for the public API via `types.d.ts`.
- ADSM cognitive context in `ctx/`.

## [0.3.1] - 2025-08-21

### Added
- Added TeqFW descriptor to define package namespace for @teqfw/core.

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
