# AI Agents Configuration for Source Directory

This document defines **long-term, project-agnostic** conventions that AI agents must follow when reading, creating, refactoring, or testing code under any `src/` directory. These guidelines are **permanent** and apply to **all** tasks in this area.

---

## 1. Directory & File Organization

* **AZ-structuring**

    * **A-struct**: decompose a single “root” module into its private implementation parts under an `A/` subfolder.

      ```text
      src/Feature/Component.js
      src/Feature/Component/A/Part1.js
      src/Feature/Component/A/Part2.js
      ```

      Files under `A/` are private to their parent.
    * **Z-struct**: helper modules whose changes do not affect siblings live under a `Z/` subfolder.

* **Visibility boundaries**: anything **outside** `A/` or `Z/` is public API.

* **Role → Feature layering**

    * First level: by architectural layer (e.g. `Back/`, `Front/`, `Shared/`).
    * Second level: by business feature or component.

* **Mirror in tests**

    * For every `src/.../X.js` there must be a matching `test/unit/.../X.test.mjs` with the same relative path and filename.

---

## 2. Class Naming (FQN)

* Map file path to fully qualified class name (FQN). Example:

  ```text
  src/Back/Handler/Static/A/Config.js => class Back_Handler_Static_A_Config
  ```

---

## 3. Dependency Injection, `this` & Closures

* **DI Container**

    * Inject all external services (file system, path, network, helpers, loggers, factories, enums) via a DI container.
* **Private state via closure**

    * Do **not** assign injected dependencies to `this`.
    * Capture each in a `const` inside the constructor and expose only public methods.

```js
class Example {
    constructor({helperService, logger}) {
        this.handle = (req, res) => {
            if (!helperService.isWritable(res)) return false;
            logger.info('Processing');
            return true;
        };
    }
}
```

---

## 4. Comments & Annotations

* **Language**: all comments and JSDoc must be in **English**.
* **JSDoc**: use `@param {Type}` and `@returns {Type}` on every public method.
* **Class annotation**: annotate all classes with a JSDoc `@class` tag and description.

---

## 5. Error Handling

* **Module-level**

    * Do **not** catch all exceptions in each module.
    * Catch only **expected, domain-specific** errors when a meaningful fallback exists.
* **Top-level handler**

    * Wrap the entire pipeline in a single `try/catch` at the entry point.
    * In that catch, use `logger.exception(error)` and return a safe default (`false`, `null`, or `[]`).

---

## 6. Testing Conventions

Refer to the [AI Agent Unit Testing Instructions](../test/unit/AGENTS.md) for project-specific testing guidelines.

---

## 7. Ongoing Responsibilities

AI agents must always:

1. **Enforce AZ-structuring** when adding or refactoring code.
2. **Preserve FQN mapping** between file paths and class names.
3. **Use DI + closures**—never attach injected services to `this`.
4. **Write English JSDoc** for every new or modified public API, including `@class` on all classes.
5. **Catch and log errors** at the top level; handle known cases locally.
6. **Generate or update unit tests** with full coverage for every behavior change (see unit testing guidelines).
7. **Maintain test-source mirror** so no source file exists without a corresponding test.

These policies are **permanent** and must be validated on every code change.
