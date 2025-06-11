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

describe('Fl32_Web_Back_Server (real)', () => {
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
