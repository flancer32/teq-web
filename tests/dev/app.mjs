#!/usr/bin/env node
'use strict';
/**
 * A test script to emulate an app that uses the web server.
 */
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import Container from '@teqfw/di';

// VARS
/* Resolve a path to the root folder. */
const url = new URL(import.meta.url);
const script = fileURLToPath(url);
const cur = dirname(script);
const root = join(cur, '..', '..');

// Create a new instance of the container
const container = new Container();

// Get the resolver from the container
const resolver = container.getResolver();
resolver.addNamespaceRoot('Fl32_Web_', join(root, 'src'));
resolver.addNamespaceRoot('App_', join(cur, 'app'));

// init the app (add the handlers to the Dispatcher)
/** @type {function} */
const appStart = await container.get('App_Plugin_Start$');
await appStart();

// order handlers in the Dispatcher
/** @type {Fl32_Web_Back_Dispatcher} */
const dispatcher = await container.get('Fl32_Web_Back_Dispatcher$');
dispatcher.orderHandlers();

// configure and run the server
/** @type {Fl32_Web_Back_Server} */
const server = await container.get('Fl32_Web_Back_Server$');
/** @type {typeof Fl32_Web_Back_Enum_Server_Type} */
const SERVER_TYPE = await container.get('Fl32_Web_Back_Enum_Server_Type$');
/** @type {Fl32_Web_Back_Server_Config} */
const factConfig = await container.get('Fl32_Web_Back_Server_Config$');
const cfg = factConfig.create({
    port: 3000, type: SERVER_TYPE.HTTP
});
await server.start(cfg);
