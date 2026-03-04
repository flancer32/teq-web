# Отчёт итерации — структурный аудит и gap-анализ (src/Back vs ctx/docs)

Path: `./ctx/agent/report/2026/03/04/14-36-structural-audit-gap-analysis.md`

## Цель

Выполнить read-only структурный аудит реализации в `src/Back/` и извлечь заявленную модель системы из `ctx/docs/**`, затем сопоставить обе модели и зафиксировать расхождения.

## Выполненные действия

- Прочитан весь корпус документации `ctx/docs/**` (product / architecture / composition / environment / code).
- Проанализирована структура и поведение модулей в `src/Back/**`.
- Восстановлены две модели системы: документированная (как целевая) и фактическая (по коду).
- Выполнено сопоставление сущностей/фаз/ограничений и сформирован перечень расхождений.

## Артефакты

- Данный отчёт: `ctx/agent/report/2026/03/04/14-36-structural-audit-gap-analysis.md`.

---

# Анализ расхождений между кодом и документацией

## 1. Модель системы, извлечённая из документации

**Назначение.** Пакет `@flancer32/teq-web` — инфраструктурный модуль TeqFW для серверной координации обработки веб‑запросов в модульном монолите; смысл продукта — унифицировать жизненный цикл обработки запроса через единственный центр координации (Dispatcher) и конвейер из изолированных Handler’ов. Док: `ctx/docs/product/overview.md:8`, `ctx/docs/product/overview.md:29`, `ctx/docs/product/constraints.md:32`.

**Архитектурные сущности (целевой набор).**

- `Server` как транспортный адаптер, принимающий внешний Web Request и передающий его в Dispatcher. Док: `ctx/docs/product/overview.md:18`, `ctx/docs/architecture/overview.md:46`.
- `Dispatcher` как единственный locus управления жизненным циклом запроса. Док: `ctx/docs/product/overview.md:19`, `ctx/docs/architecture/overview.md:23`.
- `Handler Registry` как часть Coordination Contour (регистрация и фиксация структуры pipeline в Configuration Phase). Док: `ctx/docs/architecture/overview.md:40`, `ctx/docs/architecture/overview.md:70`.
- `Handler` как атомарная стадия обработки, изолированная от других handler’ов. Док: `ctx/docs/product/overview.md:22`, `ctx/docs/product/constraints.md:36`.
- `Request Context` как ограниченное, транзиентное пространство состояния одного запроса. Док: `ctx/docs/product/overview.md:21`, `ctx/docs/architecture/overview.md:93`.
- Терминальные сущности `Processing Result` / `Processing Error`. Док: `ctx/docs/product/overview.md:24`, `ctx/docs/composition/overview.md:45`.

**Runtime-модель.**

- Две структурные фазы экземпляра архитектуры: одноразовая `Configuration Phase` и повторяющаяся `Execution Phase`. Док: `ctx/docs/architecture/overview.md:58`.
- Модель жизненного цикла запроса (fundamental execution unit) — строго линейная, пятифазная: Activation → Context Formation → Sequential Processing → Resolution → Context Disposal. Док: `ctx/docs/composition/overview.md:37`.
- Обязательные ограничения композиции: отсутствие ветвлений, ранних завершений, пропуска handler’ов; все зарегистрированные handler’ы выполняются последовательно; завершение всегда терминально (Result или Error) + обязательная disposal-фаза контекста. Док: `ctx/docs/composition/constraints.md:38`, `ctx/docs/composition/constraints.md:50`.

**Ограничения (ключевые).**

- Обработка запроса вне Dispatcher запрещена. Док: `ctx/docs/product/constraints.md:33`.
- Server не выполняет обработку запроса, кроме передачи в Dispatcher. Док: `ctx/docs/product/constraints.md:35`.
- Handler’ы изолированы и “не знают” друг о друге. Док: `ctx/docs/product/constraints.md:36`.
- Динамическая переупорядочка/мутация pipeline в процессе выполнения запрещена. Док: `ctx/docs/architecture/constraints.md:31`, `ctx/docs/product/constraints.md:69`.
- Запрещено расширение домена в сторону routing и интерпретации форматов представления. Док: `ctx/docs/product/constraints.md:49`, `ctx/docs/product/constraints.md:50`.
- Инженерные инварианты (code level): runtime‑модули в `src/`, ES‑модули используют `.mjs`. Док: `ctx/docs/code/layouts/files.md:64`, `ctx/docs/code/layouts/files.md:66`.

## 2. Модель системы, извлечённая из реализации

**Runtime entrypoints / жизненный цикл.**

- Основной runtime‑вход: `Fl32_Web_Back_Server.start(cfg)` создаёт Node‑сервер (`http`/`http2`/`http2 secure`), предварительно вызывает `dispatcher.orderHandlers()`, затем подписывает `dispatcher.onEventRequest` на `request` и запускает `listen`. Код: `src/Back/Server.js:49`, `src/Back/Server.js:74`.
- Вход обработки запроса: `Fl32_Web_Back_Dispatcher.onEventRequest(req,res)`. Код: `src/Back/Dispatcher.js:53`.

**Ключевые компоненты.**

- `Fl32_Web_Back_Dispatcher` содержит реестр handler’ов как `Map` внутри Dispatcher (регистрация через `addHandler`). Код: `src/Back/Dispatcher.js:28`, `src/Back/Dispatcher.js:41`.
- Стадийная модель pipeline: handler’ы делятся на `pre/process/post` по `Fl32_Web_Back_Enum_Stage`. Код: `src/Back/Dispatcher.js:97`, `src/Back/Enum/Stage.js:5`.
- Порядок внутри стадии рассчитывается топологической сортировкой по декларациям `before/after` из DTO регистрации handler’а (`Fl32_Web_Back_Dto_Handler_Info`). Код: `src/Back/Dispatcher.js:109`, `src/Back/Dto/Handler/Info.js:31`, `src/Back/Helper/Order/Kahn.js:13`.
- Ошибки/результаты выражены побочными эффектами записи в `res` (404/500) через `Fl32_Web_Back_Helper_Respond`. Код: `src/Back/Dispatcher.js:72`, `src/Back/Helper/Respond.js:168`.

**Фактический data flow (упрощённо).**

`node:http{,2} request` → `Server.start(): on('request', dispatcher.onEventRequest)` → `Dispatcher.onEventRequest(req,res)` → `pre[]: handle()` (все, ошибки изолированы) → `process[]: handle()` (до первого `true`; при исключении — 500) → если ответа нет — 404 → `post[]: handle()` (все, всегда). Код: `src/Back/Server.js:74`, `src/Back/Dispatcher.js:55`.

**Набор реализованных handler’ов в `src/Back`.**

- `Fl32_Web_Back_Handler_Pre_Log` — pre‑логирование. Код: `src/Back/Handler/Pre/Log.js:5`.
- `Fl32_Web_Back_Handler_Static` — раздача статических файлов по префиксу URL; использует подсистему `Static/A/*`. Код: `src/Back/Handler/Static.js:50`, `src/Back/Handler/Static/A/Registry.js:42`, `src/Back/Handler/Static/A/FileService.js:35`.

## 3. Сущности, описанные в документации, но отсутствующие в коде

- **Request Context как явная структурная сущность и граница состояния.** В реализации нет объекта “контекст запроса”; обработка ведётся на паре `req/res`. Код: `src/Back/Dispatcher.js:53`. Док: `ctx/docs/product/overview.md:21`, `ctx/docs/architecture/overview.md:93`, `ctx/docs/composition/overview.md:41`.
- **Processing Result / Processing Error как терминальные сущности.** Вместо Result/Error используются HTTP‑ответы (404/500) через `res`. Код: `src/Back/Dispatcher.js:78`. Док: `ctx/docs/product/overview.md:24`, `ctx/docs/composition/overview.md:45`.
- **Нормализованное внутреннее представление Web Request на границе Server.** Server не нормализует запрос в отдельную внутреннюю форму и не создаёт Request Context; он передаёт нативные `req/res` в Dispatcher. Код: `src/Back/Server.js:74`. Док: `ctx/docs/architecture/overview.md:46`, `ctx/docs/architecture/overview.md:84`.
- **Handler Registry как отдельный компонент Coordination Contour.** В коде “registry” как самостоятельный участник не выделен; реестр встроен в Dispatcher. Код: `src/Back/Dispatcher.js:28`. Док: `ctx/docs/architecture/overview.md:48`, `ctx/docs/architecture/overview.md:70`.
- **Пятифазный жизненный цикл запроса (в терминах композиции) как обязательная форма выполнения.** Реализация оперирует трёхстадийной схемой pre/process/post и ранней остановкой process‑стадии. Код: `src/Back/Dispatcher.js:64`. Док: `ctx/docs/composition/overview.md:37`, `ctx/docs/composition/overview.md:63`.

## 4. Сущности, существующие в коде, но не описанные в документации

- **Стадии выполнения `PRE/PROCESS/POST` как модель обработки.** Код: `src/Back/Enum/Stage.js:5`, `src/Back/Dispatcher.js:97`. Док (вместо стадий — пятифазный lifecycle): `ctx/docs/composition/overview.md:37`.
- **Семантика “первый process‑handler победил” (boolean `handled`).** Код: `src/Back/Dispatcher.js:65`. Док (запрет пропуска/раннего завершения): `ctx/docs/composition/constraints.md:50`.
- **Декларативные зависимости handler’ов `before/after` + топологическая сортировка (Kahn).** Код: `src/Back/Dto/Handler/Info.js:31`, `src/Back/Helper/Order/Kahn.js:13`. Док (говорит о фиксированном порядке, но не вводит зависимостный граф handler’ов как механизм): `ctx/docs/product/overview.md:36`.
- **Подсистема раздачи статических файлов как часть runtime‑обработки (Static handler).** Код: `src/Back/Handler/Static.js:50`, `src/Back/Handler/Static/A/Registry.js:42`. Док (routing запрещён на уровне продукта): `ctx/docs/product/constraints.md:49`.
- **Helper `Respond` с конкретными HTTP‑кодами и формированием JSON тела.** Код: `src/Back/Helper/Respond.js:27`. Док (интерпретация форматов представления запрещена): `ctx/docs/product/constraints.md:50`.

## 5. Концептуальные расхождения

- **Раннее завершение/пропуск handler’ов против “все handler’ы выполняются последовательно”.** Реализация останавливает `process`‑стадию на первом `true`. Код: `src/Back/Dispatcher.js:69`. Док: `ctx/docs/composition/constraints.md:43`, `ctx/docs/composition/constraints.md:50`.
- **Нарушение изоляции handler’ов через `before/after` зависимости.** Конфигурация порядка требует знать имена других handler’ов (хотя косвенно) и формирует граф зависимостей. Код: `src/Back/Dto/Handler/Info.js:31`. Док: `ctx/docs/product/constraints.md:36`.
- **Routing/маршрутизация внутри продукта.** `Static` выбирает обработку по URL‑префиксу (по сути мини‑router). Код: `src/Back/Handler/Static/A/Registry.js:42`. Док: `ctx/docs/product/constraints.md:49`, `ctx/docs/product/overview.md:55`.
- **Транспортная зависимость handler’ов.** Контракт handler’ов принимает Node‑специфичные `IncomingMessage`/`ServerResponse`. Код: `src/Back/Api/Handler.js:11`. Док: `ctx/docs/product/constraints.md:56`, `ctx/docs/architecture/overview.md:125`.
- **Отсутствие Request Context меняет модель ошибок/результатов и lifecycle disposal.** Реализация фиксирует терминальность через запись ответа, но не через структурные Result/Error и disposal контекста. Код: `src/Back/Dispatcher.js:78`. Док: `ctx/docs/composition/overview.md:45`, `ctx/docs/composition/overview.md:47`.
- **Несоответствие инженерным инвариантам по расширениям модулей.** Документация требует `.mjs`, а `src/Back` использует `.js`. Код: `src/Back/Server.js:1`. Док: `ctx/docs/code/layouts/files.md:66`, `ctx/docs/code/layouts/files/src.md:16`.
- **Частичное несоответствие конвенции DI‑совместимых ES6 модулей.** Требование `// @ts-check` отсутствует в анализируемых модулях `src/Back`. Код (пример): `src/Back/Dispatcher.js:1`. Док: `ctx/docs/code/conventions/es6-modules.md:26`.

