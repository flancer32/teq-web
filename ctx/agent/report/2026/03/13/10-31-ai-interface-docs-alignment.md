# AI Interface Docs Alignment

Path: `./ctx/agent/report/2026/03/13/10-31-ai-interface-docs-alignment.md`

## Goal

Align the consumer-oriented documents in `ai/` with the actual public interface exposed by the package implementation.

## Actions

- Rechecked actual DTO and factory names in `src/Back/Dto/*` and `types.d.ts`.
- Updated `ai/overview.md` to reference the real handler metadata factory and DTO names.
- Updated `ai/abstractions.md` to reference the real handler metadata factory and static source DTO factory.
- Updated `ai/examples/minimal-server.md` so the example injects `Fl32_Web_Back_Dto_Info__Factory$` and uses it consistently.

## Results

The main consumer-facing mismatch in `ai/` was removed. Interface documents now reference the DTO naming and factory shape that exist in the current package implementation, reducing the risk that consumers will request incorrect DI entries when integrating the package.

## Artifacts

- `ai/overview.md`
- `ai/abstractions.md`
- `ai/examples/minimal-server.md`
- `ctx/agent/report/2026/03/13/10-31-ai-interface-docs-alignment.md`
