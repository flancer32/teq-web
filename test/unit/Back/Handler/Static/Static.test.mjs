import {describe, it, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {buildTestContainer} from '../../../common.js';

/** Simple HTTP/2 constants mock */
const mockHttp2 = {
    constants: {
        HTTP2_HEADER_CONTENT_LENGTH: 'content-length',
        HTTP2_HEADER_CONTENT_TYPE: 'content-type',
        HTTP2_HEADER_LAST_MODIFIED: 'last-modified',
        HTTP_STATUS_OK: 200
    }
};

/** Minimal path mock for FS key normalization */
const mockPath = {
    resolve: (...parts) => parts.join('/').replace(/\/+/g, '/'),
    join: (...parts) => parts.join('/').replace(/\/+/g, '/'),
    isAbsolute: p => p.startsWith('/'),
    extname: p => {
        const m = p.match(/(\.[^./]+)$/);
        return m ? m[1] : '';
    }
};

/** In-memory FS storage */
let storage;
let mockFs;

function resetFs() {
    storage = new Map();
}

function addFile(p, content) {
    const key = mockPath.resolve(p);
    storage.set(key, {
        isFile: () => true,
        isDirectory: () => false,
        size: Buffer.byteLength(content),
        mtime: new Date(),
        content
    });
}

function addDir(p) {
    const key = mockPath.resolve(p);
    storage.set(key, {
        isFile: () => false,
        isDirectory: () => true,
        size: 0,
        mtime: new Date(),
        content: null
    });
}

beforeEach(() => {
    resetFs();
    mockFs = {
        promises: {
            stat: async p => {
                const key = mockPath.resolve(p);
                if (!storage.has(key)) throw new Error('ENOENT');
                const entry = storage.get(key);
                return {
                    isFile: entry.isFile,
                    isDirectory: entry.isDirectory,
                    size: entry.size,
                    mtime: entry.mtime
                };
            }
        },
        createReadStream: p => ({
            pipe: res => {
                setImmediate(() => {
                    const entry = storage.get(mockPath.resolve(p));
                    if (entry && entry.content != null) res.write(entry.content);
                    res.end();
                });
            }
        })
    };
});

/** Mock response with writable stream semantics */
class MockRes extends EventEmitter {
    constructor() {
        super();
        this.data = Buffer.alloc(0);
        this.statusCode = undefined;
        this.headers = undefined;
        this._sent = false;
        this._ended = false;
    }

    get headersSent() { return this._sent; }

    get writableEnded() { return this._ended; }

    writeHead(status, headers) {
        this.statusCode = status;
        this.headers = headers;
        this._sent = true;
    }

    write(chunk) {
        this.data = Buffer.concat([this.data, Buffer.from(chunk)]);
    }

    end(chunk) {
        if (chunk) this.write(chunk);
        this._ended = true;
        this.emit('finish');
    }
}

describe('Fl32_Web_Back_Handler_Static', () => {
    let container;

    beforeEach(() => {
        container = buildTestContainer();
        container.register('node:fs', mockFs);
        container.register('node:http2', mockHttp2);
        container.register('node:path', mockPath);
        container.register('Fl32_Web_Back_Logger$', {
            warn: () => {},
            exception: () => {}
        });
    });

    it('serves from the most specific source', async () => {
        addDir('/a');
        addFile('/a/test.txt', 'A');
        addDir('/b');
        addFile('/b/test.txt', 'B');

        /** @type {Fl32_Web_Back_Dto_Handler_Source} */
        const dtoSource = await container.get('Fl32_Web_Back_Dto_Handler_Source$');
        /** @type {Fl32_Web_Back_Handler_Static} */
        const handler = await container.get('Fl32_Web_Back_Handler_Static$');

        await handler.init({
            sources: [
                dtoSource.create({prefix: '/files/', root: '/a', allow: {'.': ['.']}, defaults: []}),
                dtoSource.create({prefix: '/files/special/', root: '/b', allow: {'.': ['.']}, defaults: []})
            ]
        });

        const res = new MockRes();
        const ok = await handler.handle({url: '/files/special/test.txt'}, res);
        await new Promise(r => res.on('finish', r));

        assert.strictEqual(ok, true);
        assert.strictEqual(res.data.toString(), 'B');
    });

    it('enforces allow-list rules', async () => {
        addFile('src/Back/Server.js', 'class X {}');
        addFile('src/Back/Handler/Static.js', 'ignore');

        /** @type {Fl32_Web_Back_Dto_Handler_Source} */
        const dtoSource = await container.get('Fl32_Web_Back_Dto_Handler_Source$');
        /** @type {Fl32_Web_Back_Handler_Static} */
        const handler = await container.get('Fl32_Web_Back_Handler_Static$');

        await handler.init({
            sources: [
                dtoSource.create({prefix: '/s/', root: 'src', allow: {Back: ['Server.js']}, defaults: []})
            ]
        });

        const okRes = new MockRes();
        const ok = await handler.handle({url: '/s/Back/Server.js'}, okRes);
        await new Promise(r => okRes.on('finish', r));
        assert.strictEqual(ok, true);

        const badRes = new MockRes();
        const bad = await handler.handle({url: '/s/Back/Handler/Static.js'}, badRes);
        assert.strictEqual(bad, false);
        assert.strictEqual(badRes.headersSent, false);
    });

    it('serves index files in directories', async () => {
        addDir('/dir');
        addDir('/dir/d');
        addFile('/dir/d/index.txt', 'INDEX');

        /** @type {Fl32_Web_Back_Dto_Handler_Source} */
        const dtoSource = await container.get('Fl32_Web_Back_Dto_Handler_Source$');
        /** @type {Fl32_Web_Back_Handler_Static} */
        const handler = await container.get('Fl32_Web_Back_Handler_Static$');

        await handler.init({
            sources: [
                dtoSource.create({
                    prefix: '/w/',
                    root: '/dir',
                    allow: {'.': ['.']},
                    defaults: ['index.txt']
                })
            ]
        });

        const res = new MockRes();
        const ok = await handler.handle({url: '/w/d/'}, res);
        await new Promise(r => res.on('finish', r));

        assert.strictEqual(ok, true);
        assert.strictEqual(res.data.toString(), 'INDEX');
    });

    it('rejects traversal and unmatched prefixes', async () => {
        addFile('/safe/file.txt', 'ok');

        /** @type {Fl32_Web_Back_Dto_Handler_Source} */
        const dtoSource = await container.get('Fl32_Web_Back_Dto_Handler_Source$');
        /** @type {Fl32_Web_Back_Handler_Static} */
        const handler = await container.get('Fl32_Web_Back_Handler_Static$');

        await handler.init({
            sources: [
                dtoSource.create({prefix: '/p/', root: '/safe', allow: {'.': ['.']}, defaults: []})
            ]
        });

        const res1 = new MockRes();
        const bad1 = await handler.handle({url: '/p/../file.txt'}, res1);
        assert.strictEqual(bad1, false);

        const res2 = new MockRes();
        const bad2 = await handler.handle({url: '/x/file.txt'}, res2);
        assert.strictEqual(bad2, false);
        assert.strictEqual(res2.headersSent, false);
    });
});
