import {describe, it, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {Writable} from 'node:stream';
import {mkdtemp, writeFile, mkdir, rm} from 'node:fs/promises';
import os from 'node:os';
import {join} from 'node:path';
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

describe('Fl32_Web_Back_Handler_Static (extended)', () => {
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

    it('should match sources by prefix length', async () => {
        const dirA = await mkdtemp(join(os.tmpdir(), 'a-'));
        const dirB = await mkdtemp(join(os.tmpdir(), 'b-'));
        await writeFile(join(dirA, 'test.txt'), 'A');
        await writeFile(join(dirB, 'test.txt'), 'B');
        const handler = await container.get('Fl32_Web_Back_Handler_Static$');
        const Cfg = await container.get('Fl32_Web_Back_Dto_Handler_Source$');
        await handler.init({sources: [
            Cfg.create({prefix: '/files/', root: dirA}),
            Cfg.create({prefix: '/files/special/', root: dirB}),
        ]});
        const req = {url: '/files/special/test.txt'};
        const res = new MockRes();
        const ok = await handler.handle(req, res);
        await new Promise(r => res.on('finish', r));
        assert.strictEqual(ok, true);
        assert.strictEqual(res.data.toString(), 'B');
        await rm(dirA, {recursive: true, force: true});
        await rm(dirB, {recursive: true, force: true});
    });

    it('should enforce allow list rules', async () => {
        const handler = await container.get('Fl32_Web_Back_Handler_Static$');
        const Cfg = await container.get('Fl32_Web_Back_Dto_Handler_Source$');
        await handler.init({sources: [
            Cfg.create({root: 'src', prefix: '/s/', allow: {Back: ['Server.js']}})
        ]});
        const reqOk = {url: '/s/Back/Server.js'};
        const resOk = new MockRes();
        const ok = await handler.handle(reqOk, resOk);
        await new Promise(r => resOk.on('finish', r));
        assert.strictEqual(ok, true);
        const reqBad = {url: '/s/Back/Handler/Static.js'};
        const resBad = new MockRes();
        const bad = await handler.handle(reqBad, resBad);
        assert.strictEqual(bad, false);
        assert.strictEqual(resBad.headersSent, false);
    });

    it('should allow full access with dot rule', async () => {
        const handler = await container.get('Fl32_Web_Back_Handler_Static$');
        const Cfg = await container.get('Fl32_Web_Back_Dto_Handler_Source$');
        await handler.init({sources: [
            Cfg.create({root: 'src', prefix: '/full/', allow: {Back: ['.']}})
        ]});
        const req = {url: '/full/Back/Server.js'};
        const res = new MockRes();
        const ok = await handler.handle(req, res);
        await new Promise(r => res.on('finish', r));
        assert.strictEqual(ok, true);
        assert.match(res.data.toString(), /class Fl32_Web_Back_Server/);
    });

    it('should serve index files in directories', async () => {
        const dir = await mkdtemp(join(os.tmpdir(), 'web-'));
        await mkdir(join(dir, 'd'));
        await writeFile(join(dir, 'd', 'index.txt'), 'INDEX');
        const handler = await container.get('Fl32_Web_Back_Handler_Static$');
        const Cfg = await container.get('Fl32_Web_Back_Dto_Handler_Source$');
        await handler.init({sources: [Cfg.create({root: dir, prefix: '/w/', defaults: ['index.txt']}) ]});
        const req = {url: '/w/d/'};
        const res = new MockRes();
        const ok = await handler.handle(req, res);
        await new Promise(r => res.on('finish', r));
        assert.strictEqual(ok, true);
        assert.strictEqual(res.data.toString(), 'INDEX');
        await rm(dir, {recursive: true, force: true});
    });

    it('should reject path traversal and unmatched prefixes', async () => {
        const dir = await mkdtemp(join(os.tmpdir(), 'safe-'));
        await writeFile(join(dir, 'file.txt'), 'ok');
        const handler = await container.get('Fl32_Web_Back_Handler_Static$');
        const Cfg = await container.get('Fl32_Web_Back_Dto_Handler_Source$');
        await handler.init({sources: [Cfg.create({root: dir, prefix: '/p/'})]});
        const res1 = new MockRes();
        const bad1 = await handler.handle({url: '/p/../file.txt'}, res1);
        assert.strictEqual(bad1, false);
        const res2 = new MockRes();
        const bad2 = await handler.handle({url: '/x/file.txt'}, res2);
        assert.strictEqual(bad2, false);
        assert.strictEqual(res2.headersSent, false);
        await rm(dir, {recursive: true, force: true});
    });
});
