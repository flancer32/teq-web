# Iteration Report

## Goal

Create a plain JavaScript smoke entrypoint in `test/dev/bootstrap.mjs` that starts the server with default handlers and serves static files from `test/dev/web` for manual verification.

## Actions

- Implemented `test/dev/bootstrap.mjs` as a standalone dev bootstrap using the current package source, `@teqfw/di`, built-in pre-log handler, built-in static handler, and `Fl32_Web_Back_Server`.
- Added startup synchronization in the bootstrap so it waits for the actual `listening` event before reporting success.
- Added graceful shutdown on `SIGINT` and `SIGTERM`.
- Configured the static source to serve `test/dev/web` through prefix `/` and added an explicit allow-list rule `'.': ['.']` to match the current static resolver behavior.
- Added `test/dev/web/index.html` as a manual smoke page.
- Verified behavior by running the bootstrap locally, requesting `/` and `/missing`, and confirming `200 OK` for the smoke page and `404 Not Found` for a missing path.

## Artifacts

- `test/dev/bootstrap.mjs`
- `test/dev/web/index.html`
