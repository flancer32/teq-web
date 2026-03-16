# Runtime Config Merge

## Goal

Verify `Fl32_Web_Back_Config_Runtime` against the updated runtime configuration specification, remove the obsolete `Fl32_Web_Back_Server_Config` branch, and update the package agent interface documentation in `ai/`.

## Actions

- Reworked [src/Back/Config/Runtime.mjs](/home/alex/work/@flancer32/teq-web/src/Back/Config/Runtime.mjs) into the single runtime configuration component that owns hierarchical `server` configuration internally.
- Removed obsolete server configuration modules [src/Back/Server/Config.mjs](/home/alex/work/@flancer32/teq-web/src/Back/Server/Config.mjs) and [src/Back/Server/Config/Tls.mjs](/home/alex/work/@flancer32/teq-web/src/Back/Server/Config/Tls.mjs).
- Updated [src/Back/Server.mjs](/home/alex/work/@flancer32/teq-web/src/Back/Server.mjs) to read defaults from `config.server`.
- Updated [types.d.ts](/home/alex/work/@flancer32/teq-web/types.d.ts) to expose the nested runtime configuration types from `Runtime.mjs`.
- Adjusted integration and unit tests to the new lifecycle and hierarchy, including removal of tests for deleted modules.
- Updated package interface documents in [ai/overview.md](/home/alex/work/@flancer32/teq-web/ai/overview.md), [ai/abstractions.md](/home/alex/work/@flancer32/teq-web/ai/abstractions.md), [ai/rules.md](/home/alex/work/@flancer32/teq-web/ai/rules.md), and [ai/examples/minimal-server.md](/home/alex/work/@flancer32/teq-web/ai/examples/minimal-server.md).

## Results

- Runtime configuration now has one public component branch: `Fl32_Web_Back_Config_Runtime` with hierarchical access through `runtime.server`.
- Server configuration is treated as configuration state, not as a separate DTO-like component.
- Test suite passes with `npm test`.

## Notes

- The user-updated specification document [ctx/docs/code/component/config/runtime.md](/home/alex/work/@flancer32/teq-web/ctx/docs/code/component/config/runtime.md) remained modified in the worktree and was used as the validation baseline.
