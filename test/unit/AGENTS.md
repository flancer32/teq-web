# AI Agent Unit Testing Instructions for @flancer32/teq-web

This document outlines project-specific guidelines for writing and maintaining unit tests in the `@flancer32/teq-web` plugin. Follow these rules to ensure consistency and reliability.

---

## 1. Test File Location & Naming

* Mirror `src/` structure under `test/unit/`, using the same path and filenames.
* Use `.test.mjs` suffix for test files, e.g. `Config.test.mjs`, `Kahn.test.mjs`.
* Top-level `describe` must reference the full DI key:

  ```js
  describe('Fl32_Web_Back_Handler_Static_A_Config', () => { /* ... */ });
  ```

## 2. Dependency Injection via DI Container

* Always call `buildTestContainer()` from `test/unit/common.js` and then:

  ```js
  /** @type {Fl32_Web_Back_Handler_Static_A_Config} */
  const config = await container.get('Fl32_Web_Back_Handler_Static_A_Config$');
  ```
* **Do not** import production modules (`node:path`, etc.) directly—register or mock everything through the container.
* Use `container.register(depId, mock)` to override dependencies in test mode.

## 3. Asynchronous Subject Retrieval

* Declare your `it` or `beforeEach` callbacks as `async` if you call `await container.get(...)`.
* Always `await container.get('Your_Service_Key$')` to obtain the actual instance before invoking its methods.

## 4. Testing Patterns

* Use Node’s built-in test runner and assertion library:

  ```js
  import { describe, it } from 'node:test';
  import assert from 'node:assert/strict';
  ```
* **Success cases**:

    * `assert.strictEqual(actual, expected)` for primitives.
    * `assert.deepStrictEqual(actual, expected)` for objects/arrays.
* **Error cases**:

    * `assert.throws(() => fn(), /message/)` matching a key fragment of the error.

## 5. DTO Shape & Defaults

* Pass a full DTO to `factory.create(dto)`.
* To test fallback/default logic, supply `[]` for optional arrays.

## 6. Comments & Documentation

* All inline comments must be in **English**.
* Comment only non-trivial logic; don’t restate obvious assertions.

## 7. Mocks & Helpers

* Use plain JS objects or small factory functions for mocks.
* No external mocking libraries—rely on `@teqfw/di` test mode.

## 8. Maintenance

* One behavior per `it` block—keep tests focused and concise.
* Update tests when API or default constants change.
* Ensure CI runs all tests automatically.

---

## Test Mode Support in `@teqfw/di`

When you enable test mode, you can inject or override any dependency—built-in or custom—without touching production code:

```js
const container = buildTestContainer();
container.enableTestMode();

// override a service or Node builtin
container.register('Fl32_Web_Back_Logger$', mockLogger);
container.register('node:fs', { /* mock fs.promises.stat… */});
```

* **register** vs. **registerInstance**
  Use `container.register(depId, instanceOrFactory)` to bind mocks. Avoid `registerInstance`, which is not part of the public test-mode API.

### Mocking Node.js Built-ins

```js
// simulate filesystem behavior
container.register('node:fs', {
    promises: {
        stat: async (p) => { /* … */ }
    },
    createReadStream: (p) => { /* … */ }
});

// adjust path logic
container.register('node:path', {
    join: (...parts) => parts.join('/'),
    resolve: (p) => `/abs/${p}`
});
```

These overrides are injected into every module that asks for `node:fs` or `node:path`, enabling isolated, deterministic tests without side effects.
