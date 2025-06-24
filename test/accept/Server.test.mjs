import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildTestContainer} from '../unit/common.js';

async function waitListening(server) {
  if (!server.getInstance().listening) {
    await new Promise(res => server.getInstance().once('listening', res));
  }
}

describe('Fl32_Web_Back_Server', () => {
  it('should start and respond in HTTP/1 mode', async () => {
    const container = buildTestContainer();
    const server = await container.get('Fl32_Web_Back_Server$');
    const SERVER_TYPE = await container.get('Fl32_Web_Back_Enum_Server_Type$');
    const Config = await container.get('Fl32_Web_Back_Server_Config$');
    const http = await container.get('node:http');

    const cfg = Config.create({ port: 3051, type: SERVER_TYPE.HTTP });
    await server.start(cfg);
    await waitListening(server);

    const status = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${cfg.port}`, res => {
        const {statusCode} = res;
        res.resume();
        res.on('end', () => resolve(statusCode));
      }).on('error', reject);
    });

    assert.strictEqual(status, 404);
    await server.stop();
    assert.strictEqual(server.getInstance(), undefined);
  });

  it('should start and respond in HTTP/2 mode', async () => {
    const container = buildTestContainer();
    const server = await container.get('Fl32_Web_Back_Server$');
    const SERVER_TYPE = await container.get('Fl32_Web_Back_Enum_Server_Type$');
    const Config = await container.get('Fl32_Web_Back_Server_Config$');
    const http2 = await container.get('node:http2');

    const cfg = Config.create({ port: 3052, type: SERVER_TYPE.HTTP2 });
    await server.start(cfg);
    await waitListening(server);

    const status = await new Promise((resolve, reject) => {
      const client = http2.connect(`http://localhost:${cfg.port}`);
      client.on('error', reject);
      const req = client.request({ ':path': '/' });
      req.on('response', headers => {
        resolve(headers[':status']);
      });
      req.on('end', () => client.close());
      req.end();
    });

    assert.strictEqual(status, 404);
    await server.stop();
    assert.strictEqual(server.getInstance(), undefined);
  });

  it('should start and respond in HTTPS mode', async () => {
    const container = buildTestContainer();
    const server = await container.get('Fl32_Web_Back_Server$');
    const SERVER_TYPE = await container.get('Fl32_Web_Back_Enum_Server_Type$');
    const Config = await container.get('Fl32_Web_Back_Server_Config$');
    const http2 = await container.get('node:http2');

    const dir = dirname(fileURLToPath(import.meta.url));
    const certDir = join(dir, '..', 'certs');
    const key = readFileSync(join(certDir, 'key.pem'), 'utf8');
    const cert = readFileSync(join(certDir, 'cert.pem'), 'utf8');
    let ca;
    try { ca = readFileSync(join(certDir, 'ca.pem'), 'utf8'); } catch {}

    const cfg = Config.create({
      port: 3053,
      type: SERVER_TYPE.HTTPS,
      tls: {key, cert, ca}
    });
    await server.start(cfg);
    await waitListening(server);

    const status = await new Promise((resolve, reject) => {
      const client = http2.connect(`https://localhost:${cfg.port}`, {
        rejectUnauthorized: false,
      });
      client.on('error', reject);
      const req = client.request({ ':path': '/' });
      req.on('response', headers => {
        resolve(headers[':status']);
      });
      req.on('end', () => client.close());
      req.end();
    });

    assert.strictEqual(status, 404);
    await server.stop();
    assert.strictEqual(server.getInstance(), undefined);
  });
});

describe('Fl32_Web_Back_Api_Handler', () => {
  it('should serve allowed NPM file', async () => {
    const container = buildTestContainer();
    const dispatcher = await container.get('Fl32_Web_Back_Dispatcher$');
    const handler = await container.get('Fl32_Web_Back_Handler_Static$');
    const Cfg = await container.get('Fl32_Web_Back_Dto_Handler_Source$');
    await handler.init({
      sources: [Cfg.create({
        root: 'node_modules',
        prefix: '/npm/',
        allow: {
          '@teqfw/di/src': ['.'],
        },
      })],
    });
    dispatcher.addHandler(handler);
    dispatcher.orderHandlers();

    const server = await container.get('Fl32_Web_Back_Server$');
    const SERVER_TYPE = await container.get('Fl32_Web_Back_Enum_Server_Type$');
    const Config = await container.get('Fl32_Web_Back_Server_Config$');
    const http = await container.get('node:http');

    const cfg = Config.create({ port: 3056, type: SERVER_TYPE.HTTP });
    await server.start(cfg);
    await waitListening(server);

    const result = await new Promise((resolve, reject) => {
      const req = http.get({
        hostname: 'localhost',
        port: cfg.port,
        path: '/npm/@teqfw/di/src/Api/Container/Parser/Chunk.js',
      }, res => {
        const chunks = [];
        res.on('data', ch => chunks.push(ch));
        res.on('end', () => {
          resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() });
        });
      });
      req.on('error', reject);
    });

    assert.strictEqual(result.status, 200);
    assert.match(result.body, /class TeqFw_Di_Api_Container_Parser_Chunk/);

    await server.stop();
    assert.strictEqual(server.getInstance(), undefined);
  });

  it('should serve allowed source file', async () => {
    const container = buildTestContainer();
    const dispatcher = await container.get('Fl32_Web_Back_Dispatcher$');
    const handler = await container.get('Fl32_Web_Back_Handler_Static$');
    const Cfg = await container.get('Fl32_Web_Back_Dto_Handler_Source$');
    await handler.init({
      sources: [Cfg.create({
        root: 'src',
        prefix: '/sources/',
        allow: {
          Back: ['Server.js'],
        },
      })],
    });
    dispatcher.addHandler(handler);
    dispatcher.orderHandlers();

    const server = await container.get('Fl32_Web_Back_Server$');
    const SERVER_TYPE = await container.get('Fl32_Web_Back_Enum_Server_Type$');
    const Config = await container.get('Fl32_Web_Back_Server_Config$');
    const http = await container.get('node:http');

    const cfg = Config.create({ port: 3057, type: SERVER_TYPE.HTTP });
    await server.start(cfg);
    await waitListening(server);

    const result = await new Promise((resolve, reject) => {
      const req = http.get({
        hostname: 'localhost',
        port: cfg.port,
        path: '/sources/Back/Server.js',
      }, res => {
        const chunks = [];
        res.on('data', ch => chunks.push(ch));
        res.on('end', () => {
          resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() });
        });
      });
      req.on('error', reject);
    });

    assert.strictEqual(result.status, 200);
    assert.match(result.body, /class Fl32_Web_Back_Server/);

    await server.stop();
    assert.strictEqual(server.getInstance(), undefined);
  });
});
