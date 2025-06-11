# @flancer32/teq-web

**@flancer32/teq-web** is a modular request dispatcher and web server for Node.js applications.  
It follows the principles of the [TeqFW](https://github.com/flancer32/teqfw) architecture but works independently and
can be integrated into any Node.js project.  
The plugin offers a flexible, pluggable HTTP/2-capable server with three-stage handler processing and dependency-driven
execution order.

---

## Overview

This package provides:

- A **dispatcher** that processes HTTP requests in three well-defined stages: `pre`, `process`, `post`.
- A **handler interface** for modular request handling across plugins or components.
- A **built-in server** based on Node.js libraries (`http`, `http2`), supporting TLS via `http2.createSecureServer()`.
- Support for **relative handler ordering** using `before` / `after` declarations and topological sorting.
- Compatibility with **external servers** like Express/Fastify by using the dispatcher as middleware.
- Minimal dependencies and full support for dependency injection via `@teqfw/di`.

---

## Architecture

The dispatcher runs HTTP requests through a consistent three-phase pipeline:

1. **Pre-processing (`pre`)** — All handlers are executed in a defined order (e.g., logging, authentication).
2. **Processing (`process`)** — Handlers are checked sequentially until one returns `true` (request handled).
3. **Post-processing (`post`)** — All handlers are executed unconditionally, even after errors.

Each handler provides its registration metadata via the `getRegistrationInfo()` method. Execution order is resolved with
a built-in implementation of Kahn's algorithm.

Example handler definition:

```js
const My_Handler = {
    getRegistrationInfo: () => Object.freeze({
        name: 'My_Handler',
        stage: 'process', // can be 'pre', 'process', or 'post'
        before: [],
        after: [],
    }),

    handle: async (req, res) => {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello from My_Handler!');
        return true;
    },
};

export default My_Handler;
````

---

## Usage

This example shows how to create a minimal application that:

* Registers two handlers: a logger and a static file server
* Starts a secure HTTPS server using built-in components

```js
import Container from '@teqfw/di';
import {readFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

// Resolve working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');
const webRoot = join(__dirname, 'web');
const certs = join(__dirname, 'certs');

// DI container setup
const container = new Container();
const resolver = container.getResolver();
resolver.addNamespaceRoot('Fl32_Web_', './node_modules/@flancer32/teq-web/src');

// Get and configure built-in handlers
const logHandler = await container.get('Fl32_Web_Back_Handler_Pre_Log$');
const staticHandler = await container.get('Fl32_Web_Back_Handler_Static$');
await staticHandler.init({rootPath: webRoot});

// Register handlers
const dispatcher = await container.get('Fl32_Web_Back_Dispatcher$');
dispatcher.addHandler(logHandler);
dispatcher.addHandler(staticHandler);

// Create and start the server
const server = await container.get('Fl32_Web_Back_Server$');
await server.start({
    port: 3443,
    type: 'https',
    tls: {
        key: readFileSync(join(certs, 'key.pem'), 'utf8'),
        cert: readFileSync(join(certs, 'cert.pem'), 'utf8'),
        ca: readFileSync(join(certs, 'ca.pem'), 'utf8'),
    }
});
```

This will start an HTTPS server on port `3443` with:

* `Fl32_Web_Back_Handler_Pre_Log` logging each request method and URL;
* `Fl32_Web_Back_Handler_Static` serving files from the `/web` folder.

---

### Using with Express or Fastify

The dispatcher can be connected to external web frameworks instead of the built-in server.

```js
// Express
const app = Express();
app.use(async (req, res) => {
    await dispatcher.onEventRequest(req, res);
});
app.listen(3000);

// Fastify
const fastify = Fastify();
fastify.all('*', async (request, reply) => {
    const req = request.raw;
    const res = reply.raw;
    await dispatcher.onEventRequest(req, res);
});
await fastify.listen({port: 3000});
```

---

## Installation

```bash
npm install @flancer32/teq-web
```

This plugin requires a configured `@teqfw/di` container and optionally integrates with TeqFW-based apps.

---

## Status

This package is under active development and already used in real-world applications. Documentation is built using the
**3DP** method (Dialog-Driven Development Process) and evolves alongside actual use cases.
