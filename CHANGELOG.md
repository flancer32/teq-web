# Changelog

## [0.2.0] - 2025-06-21

### Added
- Integration test covering NPM handler with the built-in server.
- Built-in NPM handler for serving files from `node_modules`.
- JSDoc examples for NPM handler initialization.

## [0.1.0] - 2025-06-11

### Added
- Initial release of `@flancer32/teq-web`, a TeqFW plugin for centralized HTTP(S) request handling.
- Dispatcher with three-stage lifecycle: `pre`, `process`, and `post`, each with isolated execution logic.
- Middleware registration with support for execution order via `before`/`after` dependencies.
- Support for custom adapters to integrate with various web servers (e.g., Express, Fastify, Node.js `http`).
- Basic Node.js HTTP server implementation for standalone use cases.
- Unified interfaces for registering request handlers from other teq-plugins.
- Modular architecture compatible with Tequila Framework philosophy.

