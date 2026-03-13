# Component Types Compliance Review

Path: `./ctx/agent/report/2026/03/13/07-37-component-types-compliance-review.md`

## Goal

Analyze the package source code under `src/` against the updated TeqFW component type conventions in `ctx/docs/code/conventions/teqfw/`, with special attention to DTO publication form, and prepare a deviation list with a remediation plan for human approval.

## Actions

- Read the applicable cognitive context documents, including the TeqFW component type and ES module conventions, and the reporting rules.
- Scanned all modules under `src/` and classified them against the Handler Component, Static Data Component, and Transient Data Component model.
- Inspected DTO-related modules under `src/Back/Dto/` and `src/Back/Server/Config*.mjs` to verify whether the default export represents data or factory behavior.
- Checked static data modules for the immutability requirement stated for enums, constants, and defaults.
- Traced current usages of DTO factories in handler and config modules to estimate the scope of a corrective refactor.

## Results

- Four modules that conceptually represent DTOs are currently published as default-export factories instead of default-export transient data components:
  - `src/Back/Dto/Handler/Info.mjs`
  - `src/Back/Dto/Handler/Source.mjs`
  - `src/Back/Server/Config.mjs`
  - `src/Back/Server/Config/Tls.mjs`
- The same four DTO modules also return mutable DTO instances, which conflicts with the requirement that transient data components are immutable after creation.
- Three modules that conceptually represent static data components are currently mutable class instances and do not freeze the singleton instance:
  - `src/Back/Enum/Stage.mjs`
  - `src/Back/Enum/Server/Type.mjs`
  - `src/Back/Defaults.mjs`
- The remaining modules in `src/Back/` fit the current component taxonomy as handler components or generic helper modules and did not reveal additional component-type mismatches during this pass.

## Artifacts

- New report: `ctx/agent/report/2026/03/13/07-37-component-types-compliance-review.md`
