import {describe, test, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import Fl32_Web_Back_Handler_Static from '../../../../../src/Back/Handler/Static.mjs';
import Fl32_Web_Back_Handler_Static_A_Config from '../../../../../src/Back/Handler/Static/A/Config.mjs';
import Fl32_Web_Back_Handler_Static_A_Registry from '../../../../../src/Back/Handler/Static/A/Registry.mjs';
import Fl32_Web_Back_Handler_Static_A_Resolver from '../../../../../src/Back/Handler/Static/A/Resolver.mjs';
import Fl32_Web_Back_Handler_Static_A_Fallback from '../../../../../src/Back/Handler/Static/A/Fallback.mjs';
import Fl32_Web_Back_Handler_Static_A_FileService from '../../../../../src/Back/Handler/Static/A/FileService.mjs';
import Fl32_Web_Back_Helper_Respond from '../../../../../src/Back/Helper/Respond.mjs';
import Fl32_Web_Back_Helper_Cast from '../../../../../src/Back/Helper/Cast.mjs';
import Fl32_Web_Back_Dto_Handler_Source from '../../../../../src/Back/Dto/Handler/Source.mjs';
import Fl32_Web_Back_Dto_Handler_Info from '../../../../../src/Back/Dto/Handler/Info.mjs';

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
    const STAGE = Object.freeze({PRE: 'pre', PROCESS: 'process', POST: 'post'});
    let logger;
    let dtoSource;
    let handler;

    beforeEach(() => {
        logger = {
            warn: () => {},
            exception: () => {}
        };
        const cast = new Fl32_Web_Back_Helper_Cast();
        dtoSource = new Fl32_Web_Back_Dto_Handler_Source({cast});
        const dtoInfo = new Fl32_Web_Back_Dto_Handler_Info({cast, STAGE});
        const configFactory = new Fl32_Web_Back_Handler_Static_A_Config({path: mockPath});
        const registry = new Fl32_Web_Back_Handler_Static_A_Registry({configFactory, logger});
        const resolver = new Fl32_Web_Back_Handler_Static_A_Resolver({path: mockPath});
        const fallback = new Fl32_Web_Back_Handler_Static_A_Fallback({fs: mockFs, path: mockPath});
        const fileService = new Fl32_Web_Back_Handler_Static_A_FileService({
            fs: mockFs,
            http2: mockHttp2,
            path: mockPath,
            logger,
            helpMime: {getByExt: () => 'text/plain'},
            resolver,
            fallback,
        });
        const respond = new Fl32_Web_Back_Helper_Respond({http2: mockHttp2});
        handler = new Fl32_Web_Back_Handler_Static({registry, fileService, respond, logger, dtoInfo, STAGE});
    });

    test('serves from the most specific source', async () => {
        addDir('/a');
        addFile('/a/test.txt', 'A');
        addDir('/b');
        addFile('/b/test.txt', 'B');

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

    test('enforces allow-list rules', async () => {
        addFile('src/Back/Server.mjs', 'class X {}');
        addFile('src/Back/Handler/Static.mjs', 'ignore');

        await handler.init({
            sources: [
                dtoSource.create({prefix: '/s/', root: 'src', allow: {Back: ['Server.mjs']}, defaults: []})
            ]
        });

        const okRes = new MockRes();
        const ok = await handler.handle({url: '/s/Back/Server.mjs'}, okRes);
        await new Promise(r => okRes.on('finish', r));
        assert.strictEqual(ok, true);

        const badRes = new MockRes();
        const bad = await handler.handle({url: '/s/Back/Handler/Static.mjs'}, badRes);
        assert.strictEqual(bad, false);
        assert.strictEqual(badRes.headersSent, false);
    });

    test('serves index files in directories', async () => {
        addDir('/dir');
        addDir('/dir/d');
        addFile('/dir/d/index.txt', 'INDEX');

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

    test('rejects traversal and unmatched prefixes', async () => {
        addFile('/safe/file.txt', 'ok');

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
