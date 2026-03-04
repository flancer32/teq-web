# Repository File Layout

Path: `ctx/docs/code/layout/files.md`
Version: `20260304`

## 1. Scope

This document defines the canonical repository file layout for TeqFW projects and specifies structural invariants governing repository directories and root files.

The document defines repository structure only and does not define product semantics, architecture, or implementation logic.

The internal structure of the documentation system located in `ctx/` is defined by the documentation corpus itself and is not specified here.

All TeqFW repositories MUST conform to this layout unless explicitly documented otherwise.

## 2. Canonical Repository Structure

The minimal canonical repository structure is:

```
/
  ctx/
  src/
  test/
    unit/
    integration/
  bin/

  .gitignore
  AGENTS.md
  LICENSE
  package.json
  README.md
  tsconfig.json
  types.d.ts
```

This structure represents the minimal structural form of a TeqFW repository and may be used by automated agents as the baseline for repository creation or validation.

Additional directories or files MAY exist when required by project functionality or development tooling.

Examples of additional artifacts include:

```
web/
CHANGELOG.md
eslint.config.js
.editorconfig
.github/
```

Such additions MUST NOT modify the structural invariants defined in this document.

## 3. Structural Directories

### 3.1 `ctx/`

The `ctx/` directory contains the documentation corpus used by ADSM agents and human developers.

The internal structure of `ctx/` is defined by the documentation system and MUST NOT be redefined in this document.

### 3.2 `src/`

All runtime implementation code of the project is located exclusively in `src/`.

All ES modules MUST use the `.mjs` extension.

Implementation modules MUST NOT exist outside `src/`.

The internal structure of `src/` is defined by a separate implementation layout document.

### 3.3 `test/`

All automated tests are located in `test/`.

Mandatory structure:

```
test/
  unit/
  integration/
```

Unit tests validate isolated modules and integration tests validate interaction between components.

The test directory structure SHOULD mirror the structure of `src/`.

An optional directory `test/dev/` MAY exist for exploratory or diagnostic tests when explicitly requested by the developer.

### 3.4 `bin/`

The `bin/` directory contains executable scripts associated with the package.

Scripts located in `bin/` MAY start the application or provide command-line utilities distributed with the package.

All executable modules MUST use the `.mjs` extension.

Executable logic MUST NOT exist outside `src/` and `bin/`.

### 3.5 `web/`

The optional `web/` directory contains static resources intended for direct distribution by a web server.

Files in `web/` are not part of the runtime implementation located in `src/`.

The directory MUST contain only static assets such as HTML, CSS, images, or client-side JavaScript.

## 4. Root Files

### 4.1 `package.json`

`package.json` defines package metadata, dependency graph, entry points, and runtime scripts.

### 4.2 `tsconfig.json`

`tsconfig.json` configures the TypeScript language server used by development environments.

The repository MUST NOT contain TypeScript source files and the configuration MUST NOT be used for TypeScript compilation.

### 4.3 `types.d.ts`

`types.d.ts` contains global declaration types used for IDE type analysis and navigation.

Only declaration files are permitted and TypeScript source files are prohibited.

### 4.4 `README.md`

`README.md` provides the public overview of the repository.

### 4.5 `LICENSE`

`LICENSE` defines the legal distribution terms of the repository.

### 4.6 `.gitignore`

`.gitignore` defines ignored files and directories for version control.

### 4.7 `AGENTS.md`

`AGENTS.md` defines operational instructions governing the interaction of automated development agents with the repository.

Agents MUST treat `AGENTS.md` as an operational instruction layer complementing the documentation stored in `ctx/`.

### 4.8 Optional Root Files

Additional root files MAY exist when required by development tooling.

Examples include `CHANGELOG.md` and `eslint.config.js`.

Such files are optional and do not modify repository structure.

## 5. Structural Invariants

A repository is structurally compliant with TeqFW conventions only if the following conditions hold simultaneously:

- implementation modules exist only inside `src/`
- automated tests exist only inside `test/`
- executable scripts exist only inside `bin/`
- project documentation exists inside `ctx/`
- all ES modules use the `.mjs` extension
- `tsconfig.json` exists for IDE language services
- `types.d.ts` exists for shared declaration types

Violation of these conditions constitutes structural non-compliance.
