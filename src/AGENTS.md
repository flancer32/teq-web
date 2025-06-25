# AI Agents Configuration for Source Directory

This document defines **long-term, project-agnostic** conventions that AI agents must follow when reading, creating, refactoring, or testing code under any `src/` directory. These guidelines are **permanent** and apply to **all** tasks in this area.

---

## 1. Directory & File Organization

- **AZ-structuring**
    - **A-struct**: use an `A/` subfolder to decompose a single “root” module into its private implementation parts.
      ```
      src/Feature/Component/Component.js
      src/Feature/Component/A/Part1.js
      src/Feature/Component/A/Part2.js
      ```
      Files under `A/` are private to their parent.
    - **Z-struct**: use a `Z/` subfolder for helper modules whose changes do not affect siblings outside that group.
    - **Visibility boundaries**: anything **outside** `A/` or `Z/` is considered public API; code inside `A/` is private to its host; code inside `Z/` is private to that feature group.
- **Role → Feature layering**
    - First level: by architectural layer (e.g. `Back/`, `Front/`, `Shared/`).
    - Second level: by business feature or component.
- **Mirror in tests**
    - For every `src/.../X.js` there must be a matching `test/.../X.test.js` with the same relative path and filename.

---

## 2. Class Naming (FQN)

- Map file path to fully qualified class name (FQN). Example:

```
src/Back/Handler/Static/A/Config.js => class Back_Handler_Static_A_Config
```

---

## 3. Dependency Injection, `this` & Closures

- **DI Container**
- Inject all external services—file system, path, network, helpers, loggers, factories, enums—via a DI container.
- **Private state via closure**
- **Do not** assign injected dependencies to `this`.
- Capture each in a `const` inside the constructor and expose only public methods.

```js
class Example {
    constructor({helperService, logger}) {

        this.handle = (req, res) => {
            if (!helperService.isWritable(res)) return false;
            logge.info('Processing');
            // … use helper and log …
            return true;
        }
    }
}
```

---

## 4. Comments & Annotations

* **Language**: all comments and JSDoc must be in **English**.
* **JSDoc**: use `@param {Type}` and `@returns {Type}` on every public method.

---

## 5. Error Handling

* **Module-level**

    * Do **not** catch every exception in each module.
    * Only catch and handle **expected, domain-specific** errors where a meaningful fallback exists (e.g. missing resource → return `null`).

* **Top-level handler**

    * Wrap the entire pipeline in a single `try/catch` at the entry point (e.g. in the top-level handler or service).
    * In that catch block, log the error (`logger.exception(error)`) and return a safe default (`false`, `null`, or `[]`).

This ensures unexpected bugs bubble up to one central boundary for logging and recovery, while modules remain focused on their own logic.

---

## 6. Testing Conventions

* **Unit-only**: mock all external I/O (file system, path, network, streams).
* **Async flows**: use minimal event emitters or Promise patterns (e.g. `res.on('finish')`) to await streaming.
* **Structure** mirrors `src/`:

  ```
  test/Feature/Component/A/Part1.test.js
  test/Feature/Component/A/Part2.test.js
  test/Feature/Component/Component.test.js
  ```

---

## 7. Ongoing Responsibilities

AI agents must always:

1. **Enforce AZ-structuring** when adding or refactoring code.
2. **Preserve FQN mapping** between file paths and class names.
3. **Use DI + closures**—never attach injected services to `this`.
4. **Write English JSDoc** for every new or modified public API.
5. **Catch and log errors** at the top level; only handle known cases locally.
6. **Generate or update unit tests** with full coverage for every behavior change.
7. **Maintain test-source mirror** so no source file exists without a corresponding test.

These policies are **permanent** and must be validated on every code change.
