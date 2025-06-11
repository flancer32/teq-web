import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {buildTestContainer} from '../unit/common.js';
import Express from 'express';
import Fastify from 'fastify';

async function startExpress(port, dispatcher) {
  const app = Express();
  app.use(async (req, res) => {
    await dispatcher.onEventRequest(req, res);
  });
  const server = await new Promise((resolve, reject) => {
    const srv = app.listen(port, err => err ? reject(err) : resolve(srv));
  });
  return server;
}

async function startFastify(port, dispatcher) {
  const fastify = Fastify();
  fastify.all('*', async (request, reply) => {
    const req = request.raw;
    const res = reply.raw;
    await dispatcher.onEventRequest(req, res);
  });
  await fastify.listen({port});
  return fastify;
}

describe('Dispatcher integration with external servers', () => {
  it('should respond via express', async () => {
    const container = buildTestContainer();
    const dispatcher = await container.get('Fl32_Web_Back_Dispatcher$');
    const port = 3054;
    const server = await startExpress(port, dispatcher);

    const status = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${port}`, res => {
        const {statusCode} = res;
        res.resume();
        res.on('end', () => resolve(statusCode));
      }).on('error', reject);
    });

    assert.strictEqual(status, 404);
    await new Promise(resolve => server.close(resolve));
  });

  it('should respond via fastify', async () => {
    const container = buildTestContainer();
    const dispatcher = await container.get('Fl32_Web_Back_Dispatcher$');
    const port = 3055;
    const fastify = await startFastify(port, dispatcher);

    const status = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${port}`, res => {
        const {statusCode} = res;
        res.resume();
        res.on('end', () => resolve(statusCode));
      }).on('error', reject);
    });

    assert.strictEqual(status, 404);
    await fastify.close();
  });
});
