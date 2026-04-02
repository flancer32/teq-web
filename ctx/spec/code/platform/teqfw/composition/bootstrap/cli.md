# TeqFW CLI Execution Mode

- Path: `ctx/spec/code/platform/teqfw/composition/bootstrap/cli.md`
- Version: `20260401`

## Purpose

Defines the execution contract of a TeqFW application when started as a Node.js CLI process.

This document specifies how the platform bootstrap is invoked and how the application lifecycle is executed in CLI mode.

## Execution Model

CLI mode represents a single-run process execution.

- application is started as a Node.js process
- execution is initiated once
- process terminates after execution completes

Execution is synchronous at the process level.

## Entry Point

The application MUST be started via the CLI bootstrap script:

```
bin/cli.mjs
```

Execution:

```
node bin/cli.mjs
```

## Canonical CLI Bootstrap

The CLI bootstrap MUST follow the canonical structure below.

The only project-specific element is the Canonical Dependency Code (CDC) of the root application component:

```
Ns_Project_App$
```

The CDC identifies the component to be resolved by the dependency container.

```javascript
#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import processModule from "node:process";
import { fileURLToPath } from "node:url";

import Container from "@teqfw/di/src/Container.mjs";
import NamespaceRegistry from "@teqfw/di/src/Config/NamespaceRegistry.mjs";

/**
 * TeqFW DI context (minimal for agents):
 *
 * CDC (Canonical Dependency Code):
 *   "Namespace_Component_Path$"
 *
 * Resolution:
 *   - "$" → default export singleton
 *   - "Ns_A_B$" → <namespace root>/A/B + ext
 *
 * Namespace roots:
 *   registered at runtime as (prefix → directory → extension)
 *   and define how CDC maps to filesystem modules
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const container = new Container();
// DO NOT use container.register here (tests only)

/**
 * NamespaceRegistry:
 * discovers and returns namespace root mappings
 * based on project structure and TeqFW conventions
 */
const namespaceRegistry = new NamespaceRegistry({ fs, path, appRoot: projectRoot });

const entries = await namespaceRegistry.build();

for (const entry of entries) {
  container.addNamespaceRoot(entry.prefix, entry.dirAbs, entry.ext);
}

// Raw CLI arguments (no parsing at bootstrap level)
const cliArgs = processModule.argv.slice(2);

/**
 * Root application component (project-specific).
 *
 * Contract:
 * - run({ projectRoot, cliArgs }): Promise<number>
 * - stop(): Promise<void>
 */
/** @type {Ns_Project_App} */
const app = await container.get("Ns_Project_App$");

let exitCode = 1;
let stopRequested = false;

// Shutdown is best-effort and must run only once
const stopApp = async function () {
  if (stopRequested) return;
  stopRequested = true;
  try {
    await app.stop();
  } catch (error) {
    console.error(error);
  }
};

// Map OS signals to graceful shutdown
for (const signal of ["SIGINT", "SIGTERM"]) {
  processModule.once(signal, () => {
    void stopApp();
  });
}

try {
  exitCode = await app.run({ projectRoot, cliArgs });
} catch (error) {
  console.error(error);
  exitCode = 1;
} finally {
  await stopApp();
}

// Fallback to 1 if exitCode is invalid
processModule.exit(typeof exitCode === "number" ? exitCode : 1);
```

## CLI Arguments

CLI arguments are passed to the application without interpretation:

```
process.argv.slice(2)
```

Bootstrap MUST:

- forward arguments to the application
- not parse or transform arguments

Argument semantics are defined exclusively by the application.

## Lifecycle

Execution follows a strict sequence:

```
process start
→ bootstrap initialization
→ namespace discovery and registration
→ App resolution (via CDC)
→ app.run(...)
→ app.stop() (graceful, including signal handling)
→ process exit
```

Rules:

- exactly one `app.run` invocation per process
- `app.stop` MUST be called after execution
- shutdown MUST be idempotent
- OS signals (SIGINT, SIGTERM) MUST trigger graceful shutdown
- no re-entry or multiple runs are allowed

## Execution Context

CLI execution uses a single application context:

- context is created during bootstrap
- context exists only for the lifetime of the process
- context is not reused across executions

## Exit Code

The process exit code is defined by the application:

- `app.run` returns `exitCode`
- bootstrap MUST terminate the process with this value

If execution fails:

- a non-zero exit code MUST be returned

If exitCode is invalid:

- bootstrap MUST fallback to `1`

## Error Handling

Errors during:

- dependency resolution
- application execution
- shutdown

MUST result in:

- process termination
- non-zero exit code

Bootstrap may log errors but must not recover execution.

## Constraints

CLI mode MUST NOT:

- implement command routing in bootstrap
- introduce multiple execution cycles
- maintain state between runs
- transform CLI arguments at bootstrap level
- embed application logic into bootstrap

## Summary

CLI execution in TeqFW is a single-run Node.js process that:

- builds namespace mappings
- resolves the root application component via CDC
- executes `app.run`
- performs idempotent graceful shutdown via `app.stop`
- handles OS signals
- terminates with the application-defined exit code
