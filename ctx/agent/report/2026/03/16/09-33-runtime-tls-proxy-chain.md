# Runtime TLS Proxy Chain

## Goal

Adjust `Fl32_Web_Back_Config_Runtime_Tls` so it behaves as a full runtime configuration component with its own proxy wrapper and lifecycle, and connect it to `Fl32_Web_Back_Config_Runtime` as a chained runtime configuration dependency.

## Actions

- Reworked [Tls.mjs](/home/alex/work/@flancer32/teq-web/src/Back/Config/Runtime/Tls.mjs) to use protected proxy access with read protection before freeze and immutable access after freeze.
- Updated [Runtime.mjs](/home/alex/work/@flancer32/teq-web/src/Back/Config/Runtime.mjs) so the base runtime configuration component delegates TLS configuration lifecycle through the TLS runtime component instead of treating it as a plain object.
- Preserved an optional factory override in the root runtime factory for isolated unit testing while keeping the default chained behavior for normal package runtime.
- Expanded runtime unit tests to validate the TLS proxy wrapper and the chained runtime initialization semantics.

## Results

- `Fl32_Web_Back_Config_Runtime_Tls` now follows the same runtime-configuration component pattern as `Fl32_Web_Back_Config_Runtime`.
- Runtime configuration chaining works for the built-in server TLS branch.
- Test suite passes with `npm test`.
