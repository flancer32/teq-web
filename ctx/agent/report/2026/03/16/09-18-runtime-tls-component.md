# Runtime TLS Component

## Goal

Refine the runtime configuration implementation after review so that the package exposes a base runtime configuration component `Fl32_Web_Back_Config_Runtime` and a separate TLS runtime configuration component `Fl32_Web_Back_Config_Runtime_Tls`, while preserving hierarchical access through `config.server.tls`.

## Actions

- Added the dedicated runtime configuration module [Tls.mjs](/home/alex/work/@flancer32/teq-web/src/Back/Config/Runtime/Tls.mjs) for TLS state ownership and lifecycle.
- Reworked [Runtime.mjs](/home/alex/work/@flancer32/teq-web/src/Back/Config/Runtime.mjs) so the `server` subtree stays in the base runtime component, but TLS data is provided through the dedicated runtime component rather than an inline class-only structure.
- Updated [types.d.ts](/home/alex/work/@flancer32/teq-web/types.d.ts) so tsserver can resolve `Fl32_Web_Back_Config_Runtime_Tls` from a standalone module when the package is consumed as a dependency.
- Added unit coverage for the TLS runtime component in [Tls.test.mjs](/home/alex/work/@flancer32/teq-web/test/unit/Back/Config/Runtime/Tls.test.mjs) and updated runtime/integration tests to the new dependency graph.
- Updated consumer-facing package interface docs in [overview.md](/home/alex/work/@flancer32/teq-web/ai/overview.md), [abstractions.md](/home/alex/work/@flancer32/teq-web/ai/abstractions.md), [rules.md](/home/alex/work/@flancer32/teq-web/ai/rules.md), and [minimal-server.md](/home/alex/work/@flancer32/teq-web/ai/examples/minimal-server.md).
- Synchronized the dev bootstrap example in [bootstrap.mjs](/home/alex/work/@flancer32/teq-web/test/dev/bootstrap.mjs) with the hierarchical runtime configuration shape.

## Results

- The package now exposes two runtime configuration components relevant to server startup: `Fl32_Web_Back_Config_Runtime` and `Fl32_Web_Back_Config_Runtime_Tls`.
- The obsolete server configuration branch remains removed; runtime configuration access stays hierarchical through `config.server` and `config.server.tls`.
- Type hints for TLS runtime configuration are now backed by a dedicated source module.
- Test suite passes with `npm test`.
