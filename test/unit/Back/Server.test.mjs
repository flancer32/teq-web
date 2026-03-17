import {describe, test, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import Fl32_Web_Back_Server from '../../../src/Back/Server.mjs';
import Fl32_Web_Back_Enum_Server_Type from '../../../src/Back/Enum/Server/Type.mjs';

describe('Fl32_Web_Back_Server (mocked)', () => {

    /** @type {Array<*>} */
    const log = [];
    let logger;
    let pipelineEngine;
    let server;

    // Mocks for HTTP/1 and HTTP/2 servers
    const mockHttp = {
        createServer: () => ({
            listen: () => { log.push('http.listen'); },
            on: () => { log.push('http.on'); },
            close: (cb) => { log.push('http.close'); cb && cb(); },
        }),
    };

    const mockHttp2 = {
        createServer: () => ({
            listen: () => { log.push('http2.listen'); },
            on: () => { log.push('http2.on'); },
            close: (cb) => { log.push('http2.close'); cb && cb(); },
        }),
        createSecureServer: (tlsOpts) => ({
            listen: () => { log.push('http2s.listen'); },
            on: () => { log.push('http2s.on'); },
            close: (cb) => { log.push('http2s.close'); cb && cb(); },
        })
    };

    beforeEach(() => {
        log.length = 0;
        logger = {
            info: (...args) => log.push(['info', ...args]),
            error: (...args) => log.push(['error', ...args]),
            warn: (...args) => log.push(['warn', ...args]),
        };
        pipelineEngine = {
            lockHandlers: () => log.push('pipeline.lockHandlers'),
            handleRequest: () => {},
        };
        server = new Fl32_Web_Back_Server({
            http: mockHttp,
            http2: mockHttp2,
            config: Object.freeze({port: 3000, type: 'http'}),
            logger,
            pipelineEngine,
            SERVER_TYPE: new Fl32_Web_Back_Enum_Server_Type(),
        });
    });

    test('should start in HTTP/1 mode by default', async () => {
        /** @type {Fl32_Web_Back_Server} */
        await server.start(); // default mode is HTTP/1
        assert.deepStrictEqual(log, [
            'pipeline.lockHandlers',
            ['info', 'Starting server in HTTP/1 mode on port 3000...'],
            'http.on',
            'http.listen',
        ]);
    });

    test('should start in HTTP/2 mode if specified', async () => {
        /** @type {Fl32_Web_Back_Server} */
        await server.start({type: 'http2', port: 8080});
        assert.deepStrictEqual(log, [
            'pipeline.lockHandlers',
            ['info', 'Starting server in HTTP/2 mode on port 8080...'],
            'http2.on',
            'http2.listen',
        ]);
    });

    test('should start in HTTPS/2 mode with TLS config', async () => {
        /** @type {Fl32_Web_Back_Server} */
        await server.start({type: 'https', port: 8443, tls: {key: 'a', cert: 'b'}});
        assert.deepStrictEqual(log, [
            'pipeline.lockHandlers',
            ['info', 'Starting server in HTTPS (HTTP/2 + TLS) mode on port 8443...'],
            'http2s.on',
            'http2s.listen',
        ]);
    });

    test('should throw error if TLS config is missing in HTTPS mode', async () => {
        /** @type {Fl32_Web_Back_Server} */
        await assert.rejects(
            () => server.start({type: 'https', port: 1234}),
            /TLS key and certificate are required/
        );
        assert.deepStrictEqual(log.at(-1), ['error', 'HTTPS server requires TLS key and certificate']);
    });

    test('should throw error on unsupported server type', async () => {
        /** @type {Fl32_Web_Back_Server} */
        await assert.rejects(
            () => server.start({type: 'ftp', port: 21}),
            /not supported/
        );
        assert.deepStrictEqual(log.at(-1), ['error', 'Unsupported server type: ftp']);
    });

    test('should stop the server', async () => {
        /** @type {Fl32_Web_Back_Server} */
        await server.start();
        await server.stop();
        assert.deepStrictEqual(log.slice(-2), [
            'http.close',
            ['info', 'Server stopped'],
        ]);
    });
});
