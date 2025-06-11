import {describe, it, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {buildTestContainer} from '../common.js';

describe('Fl32_Web_Back_Server (mocked)', () => {

    /** @type {import('@teqfw/di').Container} */
    let container;
    /** @type {Array<*>} */
    const log = [];

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
        container = buildTestContainer();

        container.register('node:http', mockHttp);
        container.register('node:http2', mockHttp2);

        container.register('Fl32_Web_Back_Logger$', {
            info: (...args) => log.push(['info', ...args]),
            error: (...args) => log.push(['error', ...args]),
        });

        container.register('Fl32_Web_Back_Dispatcher$', {
            orderHandlers: () => log.push('dispatcher.orderHandlers'),
            onEventRequest: () => {},
        });
    });

    it('should start in HTTP/1 mode by default', async () => {
        const server = await container.get('Fl32_Web_Back_Server$');
        await server.start(); // default mode is HTTP/1
        assert.deepStrictEqual(log, [
            'dispatcher.orderHandlers',
            ['info', 'Starting server in HTTP/1 mode on port 3000...'],
            'http.on',
            'http.listen',
        ]);
    });

    it('should start in HTTP/2 mode if specified', async () => {
        const server = await container.get('Fl32_Web_Back_Server$');
        await server.start({type: 'http2', port: 8080});
        assert.deepStrictEqual(log, [
            'dispatcher.orderHandlers',
            ['info', 'Starting server in HTTP/2 mode on port 8080...'],
            'http2.on',
            'http2.listen',
        ]);
    });

    it('should start in HTTPS/2 mode with TLS config', async () => {
        const server = await container.get('Fl32_Web_Back_Server$');
        await server.start({type: 'https', port: 8443, tls: {key: 'a', cert: 'b'}});
        assert.deepStrictEqual(log, [
            'dispatcher.orderHandlers',
            ['info', 'Starting server in HTTPS (HTTP/2 + TLS) mode on port 8443...'],
            'http2s.on',
            'http2s.listen',
        ]);
    });

    it('should throw error if TLS config is missing in HTTPS mode', async () => {
        const server = await container.get('Fl32_Web_Back_Server$');
        await assert.rejects(
            () => server.start({type: 'https', port: 1234}),
            /TLS key and certificate are required/
        );
        assert.deepStrictEqual(log.at(-1), ['error', 'HTTPS server requires TLS key and certificate']);
    });

    it('should throw error on unsupported server type', async () => {
        const server = await container.get('Fl32_Web_Back_Server$');
        await assert.rejects(
            () => server.start({type: 'ftp', port: 21}),
            /not supported/
        );
        assert.deepStrictEqual(log.at(-1), ['error', 'Unsupported server type: ftp']);
    });

    it('should stop the server', async () => {
        const server = await container.get('Fl32_Web_Back_Server$');
        await server.start();
        await server.stop();
        assert.deepStrictEqual(log.slice(-2), [
            'http.close',
            ['info', 'Server stopped'],
        ]);
    });
});
