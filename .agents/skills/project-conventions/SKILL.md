---
name: project-conventions
description: Project-specific conventions for every task in @flancer32/teq-web.
---

# Project Conventions

`AGENTS.md` overrides this file on conflicts. The mounted `ctx/` is the authoritative
cognitive context for the product; preserve consistency with it.

## Repositories

- The product repository is `flancer32/teq-web`; the mounted cognitive-context repository is `flancer32/teq-web-ctx` (source: `ctx/agent/flows/app/configuration.md`).
- `root` and `ctx` are separate repositories; do not mix their status, commits, or pushes (source: `AGENTS.md`).
- `ctx` is the authoritative cognitive context for product work (source: `AGENTS.md`, `ctx/AGENTS.md`).

## Workflow

- Work in the repository's `main` branch. This project rule overrides any GitHub-skill instruction to use a separate branch (source: `ctx/agent/flows/app/configuration.md`).
- At the start of work, check upstream in `root` and `ctx` when applicable; keep each local `main` synchronized by fast-forwarding when safe (source: `ctx/agent/flows/app/configuration.md`, `ctx/agent/flows/ctx/configuration.md`).
- Before changes, inspect every affected working tree (source: `AGENTS.md`).
- Do not modify `ctx` unless the task explicitly requires a context change (source: `AGENTS.md`).
- Do not commit or push unless the user requests it (source: `AGENTS.md`).
- Ask the user when a missing decision changes behavior or grants external authority (source: `AGENTS.md`).

## Communication

- Communicate with the developer in Russian; write code, comments, documentation, commit messages, and identifiers in English (source: repository task instructions in `AGENTS.md`).
- Report changes, verification, and remaining risks (source: repository task instructions in `AGENTS.md`).

## Project boundaries

- `@flancer32/teq-web` is a Node.js web-server orchestration layer over plain HTTP and secure web transport, not a router, controller framework, or application platform (source: `ctx/docs/product/overview.md`, `ctx/docs/product/constraints.md`).
- Runtime implementation stays under `src/`; tests stay under `test/`; consumer skills stay under `skills/<skill-name>/` and are not imported by runtime modules (source: `ctx/docs/code/layout.md`).
- Use ES modules with `.mjs`; namespace mapping follows `Fl32_Web_ -> ./src` and does not use `index.mjs` namespace entry points (source: `ctx/docs/code/namespace-mapping.md`).
- `@teqfw/di` is the mandatory construction and integration authority for runtime assembly; do not introduce a parallel non-DI construction model (source: `ctx/docs/architecture/constraints.md`).
- Preserve the unified `Server` transport boundary, the `Pipeline Engine` as the single lifecycle coordinator, and the fixed `INIT -> PROCESS -> FINALIZE` lifecycle (source: `ctx/docs/architecture/constraints.md`, `ctx/docs/product/constraints.md`).

## Validation

- Run `npm run typecheck` for source, test, or type declaration changes; it uses `jsconfig.json` with `checkJs` and `noEmit` (source: `package.json`, `ctx/docs/code/package.md`).
- Run `npm run test:unit` for isolated module-contract changes and `npm run test:integration` for composed runtime or transport changes (source: `ctx/docs/code/testing.md`).
- Run `npm test` when a change crosses unit and integration boundaries or when the complete test suite is required (source: `package.json`, `ctx/docs/code/testing.md`).
- Run `npm run lint:md` for changes to published skills or root Markdown files, then run `git diff --check` for every affected repository (source: `package.json`, template `project-conventions.memo.md`).

## Shared memory

- `flancer32/ai-memo` is the shared cross-project issue tracker and memory. Source identity: `flancer32/teq-web`. Note path: `project/flancer32/teq-web/`. Resolvers: `flancer32/teq-web` and, for context-owned issues, `flancer32/teq-web-ctx` (source: `ctx/agent/flows/app/configuration.md`, `ctx/agent/flows/ctx/configuration.md`).
- Every issue must name the project or projects expected to resolve it (source: template `project-conventions.memo.md`).
- In multiline text sent to GitHub, use actual line breaks; never send literal `\n`, which GitHub displays as text (source: template `project-conventions.memo.md`).
- When referring to a commit in another repository, use its full GitHub URL: `https://github.com/vendor/name/commit/<sha>` (source: template `project-conventions.memo.md`).
