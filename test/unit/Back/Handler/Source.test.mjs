import {describe, it, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {Writable} from 'node:stream';
import {buildTestContainer} from '../../common.js';

class MockRes extends Writable {
    constructor() {
        super();
        this.data = Buffer.alloc(0);
        this.statusCode = undefined;
        this.headers = undefined;
        this._headersSent = false;
        this._ended = false;
    }
    get headersSent() { return this._headersSent; }
    get writableEnded() { return this._ended; }
    writeHead(status, headers) {
        this.statusCode = status;
        this.headers = headers;
        this._headersSent = true;
    }
    _write(chunk, enc, cb) {
        this.data = Buffer.concat([this.data, chunk]);
        cb();
    }
    end(chunk) {
        if (chunk) this.data = Buffer.concat([this.data, Buffer.from(chunk)]);
        this._ended = true;
        super.end();
    }
}

describe('Fl32_Web_Back_Handler_Source', () => {
    let container;
    const log = [];

    beforeEach(() => {
        container = buildTestContainer();
        container.register('Fl32_Web_Back_Logger$', {
            warn: (...args) => log.push(['warn', ...args]),
            exception: (...args) => log.push(['exception', ...args]),
        });
        log.length = 0;
    });

    it('should serve allowed file', async () => {
        const handler = await container.get('Fl32_Web_Back_Handler_Source$');
        await handler.init({root: 'node_modules', prefix: '/npm/', allow: {'@teqfw/di': ['package.json']}});
        const req = {url: '/npm/@teqfw/di/package.json'};
        const res = new MockRes();
        const ok = await handler.handle(req, res);
        await new Promise(resolve => res.on('finish', resolve));
        assert.strictEqual(ok, true);
        assert.strictEqual(res.statusCode, 200);
        assert.match(res.data.toString(), /@teqfw\/di/);
        assert.strictEqual(log.length, 0);
    });

    it('should deny disallowed path', async () => {
        const handler = await container.get('Fl32_Web_Back_Handler_Source$');
        await handler.init({root: 'node_modules', prefix: '/npm/', allow: {'@teqfw/di': ['package.json']}});
        const req = {url: '/npm/@teqfw/di/secret.js'};
        const res = new MockRes();
        const ok = await handler.handle(req, res);
        assert.strictEqual(ok, false);
        assert.strictEqual(res.headersSent, false);
        assert.ok(log[0][0] === 'warn');
    });

    it('should serve allowed src file', async () => {
        const handler = await container.get('Fl32_Web_Back_Handler_Source$');
        await handler.init({root: 'src', prefix: '/sources/', allow: {Back: ['Server.js']}});
        const req = {url: '/sources/Back/Server.js'};
        const res = new MockRes();
        const ok = await handler.handle(req, res);
        await new Promise(resolve => res.on('finish', resolve));
        assert.strictEqual(ok, true);
        assert.strictEqual(res.statusCode, 200);
        assert.match(res.data.toString(), /class Fl32_Web_Back_Server/);
        assert.strictEqual(log.length, 0);
    });
});
