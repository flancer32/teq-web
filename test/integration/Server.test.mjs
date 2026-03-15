import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import Container from '@teqfw/di';
import Fl32_Web_Back_Server from '../../src/Back/Server.mjs';

const SRC = path.resolve(import.meta.dirname, '../../src');

/**
 * @returns {{headersSent:boolean,writableEnded:boolean,statusCode?:number,body?:string,writeHead:(status:number)=>void,end:(body?:string)=>void}}
 */
function createResponse() {
    return {
        headersSent: false,
        writableEnded: false,
        statusCode: undefined,
        body: undefined,
        writeHead(status) {
            this.statusCode = status;
            this.headersSent = true;
        },
        end(body = '') {
            this.body = body;
            this.writableEnded = true;
        },
    };
}

/**
 * @param {string} label
 * @param {string[]} log
 * @returns {{listening:boolean,on:(name:string,handler:Function)=>void,listen:()=>void,close:(cb?:Function)=>void,emitRequest:(req:any,res:any)=>Promise<void>}}
 */
function createMockServer(label, log) {
    /** @type {((req:any,res:any)=>Promise<void>)|undefined} */
    let onRequest;
    return {
        listening: false,
        on(name, handler) {
            if (name === 'request') {
                onRequest = handler;
            }
            log.push(`${label}.on`);
        },
        listen() {
            this.listening = true;
            log.push(`${label}.listen`);
        },
        close(cb) {
            this.listening = false;
            log.push(`${label}.close`);
            cb?.();
        },
        async emitRequest(req, res) {
            await onRequest?.(req, res);
        },
    };
}

describe('Fl32_Web_Back_Server integration', () => {
    test('returns 404 through transport when no PROCESS handler completes', async () => {
        const container = new Container();
        container.addNamespaceRoot('Fl32_Web_', SRC, '.mjs');
        container.enableTestMode();
        const runtimeFactory = await container.get('Fl32_Web_Back_Config_Runtime__Factory$');
        runtimeFactory.freeze();
        const log = [];
        const mockHttpServer = createMockServer('http', log);
        const mockHttp = {createServer: () => mockHttpServer};
        const mockHttp2 = {
            createServer: () => createMockServer('http2', log),
            createSecureServer: () => createMockServer('https', log),
        };

        const server = new Fl32_Web_Back_Server({
            http: mockHttp,
            http2: mockHttp2,
            config: await container.get('Fl32_Web_Back_Config_Runtime$'),
            logger: {info: () => {}, warn: () => {}, error: () => {}, exception: () => {}},
            pipelineEngine: await container.get('Fl32_Web_Back_PipelineEngine$'),
            SERVER_TYPE: await container.get('Fl32_Web_Back_Enum_Server_Type$'),
        });

        await server.start();
        const res = createResponse();
        await server.getInstance().emitRequest({url: '/missing'}, res);

        assert.strictEqual(res.statusCode, 404);
        assert.deepStrictEqual(log, ['http.on', 'http.listen']);

        await server.stop();
        assert.strictEqual(server.getInstance(), undefined);
    });

    test('returns 500 through transport when PROCESS handler throws', async () => {
        const container = new Container();
        container.addNamespaceRoot('Fl32_Web_', SRC, '.mjs');
        container.enableTestMode();
        const runtimeFactory = await container.get('Fl32_Web_Back_Config_Runtime__Factory$');
        runtimeFactory.freeze();
        const STAGE = await container.get('Fl32_Web_Back_Enum_Stage$');
        const pipelineEngine = await container.get('Fl32_Web_Back_PipelineEngine$');
        pipelineEngine.addHandler({
            getRegistrationInfo: () => ({name: 'Boom', stage: STAGE.PROCESS}),
            handle: async () => {
                throw new Error('boom');
            },
        });

        const server = new Fl32_Web_Back_Server({
            http: {createServer: () => createMockServer('http', [])},
            http2: {
                createServer: () => createMockServer('http2', []),
                createSecureServer: () => createMockServer('https', []),
            },
            config: await container.get('Fl32_Web_Back_Config_Runtime$'),
            logger: {info: () => {}, warn: () => {}, error: () => {}, exception: () => {}},
            pipelineEngine,
            SERVER_TYPE: await container.get('Fl32_Web_Back_Enum_Server_Type$'),
        });

        await server.start();
        const res = createResponse();
        await server.getInstance().emitRequest({url: '/boom'}, res);

        assert.strictEqual(res.statusCode, 500);
        assert.strictEqual(res.body, 'Internal Server Error');

        await server.stop();
    });
});
