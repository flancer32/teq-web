import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import Fl32_Web_Back_Handler_Static_A_FileService from '../../../../../../src/Back/Handler/Static/A/FileService.mjs';
import Fl32_Web_Back_Handler_Static_A_Resolver from '../../../../../../src/Back/Handler/Static/A/Resolver.mjs';
import Fl32_Web_Back_Handler_Static_A_Fallback from '../../../../../../src/Back/Handler/Static/A/Fallback.mjs';

const normalize = p => p.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/\/$/, '');
const mockPath = {
  resolve: (...parts) => normalize(parts.join('/')),
  join: (...parts) => normalize(parts.join('/')),
  isAbsolute: p => String(p).startsWith('/'),
  extname: p => {
    const m = String(p).match(/(\.[^./]+)$/);
    return m ? m[1] : '';
  }
};
const mockHttp2 = {
  constants: {
    HTTP2_HEADER_CONTENT_LENGTH: 'content-length',
    HTTP2_HEADER_CONTENT_TYPE: 'content-type',
    HTTP2_HEADER_LAST_MODIFIED: 'last-modified',
    HTTP_STATUS_OK: 200
  }
};

class MockRes extends EventEmitter {
  constructor() {
    super();
    this.data = '';
    this.status = undefined;
    this.headers = undefined;
    this._hs = false;
    this._ended = false;
  }
  get headersSent() {
    return this._hs;
  }
  get writableEnded() {
    return this._ended;
  }
  writeHead(status, headers) {
    this.status = status;
    this.headers = headers;
    this._hs = true;
  }
  write(chunk) {
    this.data += chunk;
  }
  end(chunk) {
    if (chunk) this.write(chunk);
    this._ended = true;
    this.emit('finish');
  }
}

describe('Fl32_Web_Back_Handler_Static_A_FileService', () => {
  let storage, mockFs, mime, logger, logs, addFile, addDir;

  beforeEach(() => {
    storage = new Map();

    // mock fs.promises.stat and createReadStream
    mockFs = {
      promises: {
        stat: async p => {
          const key = normalize(p);
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
            const key = normalize(p);
            const entry = storage.get(key);
            if (entry && entry.content != null) res.write(entry.content);
            res.end();
          });
        }
      })
    };

    // simple mime helper
    mime = {
      getByExt: () => 'text/plain'
    };

    logs = [];
    // simple logger collecting calls
    logger = {
      info: (...args) => logs.push(['info', ...args]),
      warn: (...args) => logs.push(['warn', ...args]),
      exception: (...args) => logs.push(['exception', ...args])
    };

    // helpers to populate mock FS
    addFile = (p, content) => {
      const key = normalize(p);
      storage.set(key, {
        isFile: () => true,
        isDirectory: () => false,
        size: Buffer.byteLength(content),
        mtime: new Date(),
        content
      });
    };
    addDir = p => {
      const key = normalize(p);
      storage.set(key, {
        isFile: () => false,
        isDirectory: () => true,
        size: 0,
        mtime: new Date()
      });
    };
  });

  test('serves existing file', async () => {
    addFile('/root/a.txt', 'A');

    /** @type {{ root: string, prefix: string, defaults: string[] }} */
    const config = { root: '/root', prefix: '/p/', defaults: ['index.html'] };
    const res = new MockRes();

    /** @type {Fl32_Web_Back_Handler_Static_A_FileService} */
    const service = new Fl32_Web_Back_Handler_Static_A_FileService({
      fs: mockFs,
      http2: mockHttp2,
      path: mockPath,
      logger,
      helpMime: mime,
      resolver: new Fl32_Web_Back_Handler_Static_A_Resolver({path: mockPath}),
      fallback: new Fl32_Web_Back_Handler_Static_A_Fallback({fs: mockFs, path: mockPath}),
    });

    const ok = await service.serve(config, 'a.txt', {}, res);
    await new Promise(r => res.on('finish', r));

    assert.ok(ok);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data, 'A');
  });

  test('returns false when file not found', async () => {
    addDir('/root');

    /** @type {{ root: string, prefix: string, defaults: string[] }} */
    const config = { root: '/root', prefix: '/p/', defaults: ['index.html'] };
    const res = new MockRes();

    /** @type {Fl32_Web_Back_Handler_Static_A_FileService} */
    const service = new Fl32_Web_Back_Handler_Static_A_FileService({
      fs: mockFs,
      http2: mockHttp2,
      path: mockPath,
      logger,
      helpMime: mime,
      resolver: new Fl32_Web_Back_Handler_Static_A_Resolver({path: mockPath}),
      fallback: new Fl32_Web_Back_Handler_Static_A_Fallback({fs: mockFs, path: mockPath}),
    });

    const ok = await service.serve(config, 'missing.txt', {}, res);
    assert.strictEqual(ok, false);
  });

  test('logs info when file is missing during stat', async () => {
    mockFs.promises.stat = async () => {
      const err = new Error('ENOENT');
      err.code = 'ENOENT';
      throw err;
    };
    /** @type {{ root: string, prefix: string, defaults: string[] }} */
    const config = { root: '/root', prefix: '/p/', defaults: [] };
    const res = new MockRes();

    /** @type {Fl32_Web_Back_Handler_Static_A_FileService} */
    const service = new Fl32_Web_Back_Handler_Static_A_FileService({
      fs: mockFs,
      http2: mockHttp2,
      path: mockPath,
      logger,
      helpMime: mime,
      resolver: new Fl32_Web_Back_Handler_Static_A_Resolver({path: mockPath}),
      fallback: { apply: async p => p },
    });

    const ok = await service.serve(config, 'missing.txt', {}, res);

    assert.strictEqual(ok, false);
    assert.strictEqual(logs.length, 1);
    assert.strictEqual(logs[0][0], 'info');
  });

  test('logs warn on access errors', async () => {
    /** force EACCES error */
    mockFs.promises.stat = async () => {
      const err = new Error('EACCES');
      err.code = 'EACCES';
      throw err;
    };

    /** @type {{ root: string, prefix: string, defaults: string[] }} */
    const config = { root: '/root', prefix: '/p/', defaults: [] };
    const res = new MockRes();

    /** @type {Fl32_Web_Back_Handler_Static_A_FileService} */
    const service = new Fl32_Web_Back_Handler_Static_A_FileService({
      fs: mockFs,
      http2: mockHttp2,
      path: mockPath,
      logger,
      helpMime: mime,
      resolver: new Fl32_Web_Back_Handler_Static_A_Resolver({path: mockPath}),
      fallback: { apply: async p => p },
    });

    const ok = await service.serve(config, 'denied.txt', {}, res);

    assert.strictEqual(ok, false);
    assert.strictEqual(logs.length, 1);
    assert.strictEqual(logs[0][0], 'warn');
  });

  test('logs exception on unexpected errors', async () => {
    addFile('/root/x.txt', 'X');
    mockFs.createReadStream = () => { throw new Error('boom'); };

    /** @type {{ root: string, prefix: string, defaults: string[] }} */
    const config = { root: '/root', prefix: '/p/', defaults: [] };
    const res = new MockRes();

    /** @type {Fl32_Web_Back_Handler_Static_A_FileService} */
    const service = new Fl32_Web_Back_Handler_Static_A_FileService({
      fs: mockFs,
      http2: mockHttp2,
      path: mockPath,
      logger,
      helpMime: mime,
      resolver: new Fl32_Web_Back_Handler_Static_A_Resolver({path: mockPath}),
      fallback: { apply: async p => p },
    });

    const ok = await service.serve(config, 'x.txt', {}, res);

    assert.strictEqual(ok, false);
    assert.strictEqual(logs.length, 1);
    assert.strictEqual(logs[0][0], 'exception');
  });
});
