The current CDC parser rejects identifiers like `node:http`, `node:http2`, `node:fs`, and `node:path` with:

`CDC must satisfy AsciiCdcIdentifier.`

This breaks consumers that declare built-in Node dependencies using the `node:` prefix. In our integration tests, the DI container fails before application logic is reached because dependency resolution aborts during CDC parsing.

Observed behavior:
- `node:...` CDCs are rejected by the parser.
- The parser still appears to accept only the older ASCII-only form and legacy `node_...` prefix handling.
- Any consumer that migrated to `node:` cannot resolve built-in dependencies.

Expected behavior:
- The parser should accept the documented or required CDC grammar for built-in Node dependencies.
- The grammar and validation should match the actual supported dependency syntax end-to-end.

Requested fix:
- Update the parser and related DI resolution code to support the required CDC grammar for built-in Node dependencies.
- Add regression tests that fail on the current implementation and cover at least:
  - `node:http`
  - `node:http2`
  - `node:fs`
  - `node:path`
- Add a negative test that proves unsupported identifiers still fail for the right reason.

Why this matters:
- This is a compatibility regression in the DI layer, not in the consuming application code.
- The failure happens during container resolution, so it blocks all dependent integration tests and makes the breakage hard to diagnose without targeted coverage.
