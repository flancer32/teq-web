# @flancer32/teq-web

Web plugin for the TeqFW platform, providing interfaces for web request handlers, a simple web server based on Node.js
libraries (`http`, `http2`, `https`), a handler dispatcher, and rules for connecting handlers from other plugins.

## Overview

The **@flancer32/teq-web** plugin for the **TeqFW** platform implements a flexible web server using standard Node.js
libraries (`http`, `http2`, `https`). It features a centralized web request dispatcher that allows other plugins to
register their handlers efficiently.

### Key Features:

- Modular architecture that enables seamless integration of new handlers from external plugins.
- Flexible middleware registration with a configurable execution order.
- Structured request processing in three distinct stages:
    - **Pre-processing (`PRE`)**: Initial request handling (e.g., logging, authentication).
    - **Main processing (`PROCESS`)**: Core logic execution and routing.
    - **Post-processing (`POST`)**: Final actions, such as logging the response or cleanup.
- The dispatcher sequentially executes all pre-processing handlers, exactly one main handler (if found), and all
  post-processing handlers.
- Supports integration with alternative web servers via custom adapters.

## Features

- Interfaces for web request handlers.
- Simple web server using Node.js libraries.
- Handler dispatcher for efficient request routing.
- Support for integrating handlers from external plugins.

## Integration

Register the namespace to use this plugin with TeqFW DI:

```js
import Container from '@teqfw/di';

// Create a new instance of the container
const container = new Container();

// Get the resolver from the container
const resolver = container.getResolver();
resolver.addNamespaceRoot('Fl32_Web_', './node_modules/@flancer32/teq-web/src'); 
```