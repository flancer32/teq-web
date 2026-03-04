import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import Fl32_Web_Back_Dispatcher from '../../../src/Back/Dispatcher.mjs';

/** Collects execution order */
let log;
/** Dispatcher stages enum */
/** @type {Fl32_Web_Back_Enum_Stage} */
const STAGE = Object.freeze({
    PRE: 'pre',
    PROCESS: 'process',
    POST: 'post',
});
/** Respond helper mock */
let respond;
/** Logger mock */
let logger;
/** Order helper mock */
let helpOrder;

beforeEach(() => {
    log = [];
    logger = {
        info: () => { },
        error: () => { },
        exception: () => { },
    };
    // Keep handler order as provided.
    helpOrder = { sort: arr => arr };

    // Respond helper stub.
    respond = {
        isWritable: res => !res.headersSent && !res.writableEnded,
        code404_NotFound: ({ res }) => { res.code = 404; res.headersSent = true; },
        code500_InternalServerError: ({ res }) => { res.code = 500; res.headersSent = true; },
    };
});

function pre(name) {
    return {
        getRegistrationInfo: () => ({ name, stage: STAGE.PRE }),
        handle: async () => { log.push(name); },
    };
}

function proc(name, opts = {}) {
    const { handled = true, throwErr = false, send = true } = opts;
    return {
        getRegistrationInfo: () => ({ name, stage: STAGE.PROCESS }),
        handle: async (req, res) => {
            log.push(name);
            if (throwErr) throw new Error('boom');
            if (send) res.headersSent = true;
            return handled;
        },
    };
}

function post(name) {
    return {
        getRegistrationInfo: () => ({ name, stage: STAGE.POST }),
        handle: async () => { log.push(name); },
    };
}

describe('Fl32_Web_Back_Dispatcher', () => {
    test('calls pre-handlers even when a process handler fails', async () => {
        /** @type {Fl32_Web_Back_Dispatcher} */
        const dispatcher = new Fl32_Web_Back_Dispatcher({ logger, respond, helpOrder, STAGE });
        dispatcher.addHandler(pre('pre'));
        dispatcher.addHandler(proc('proc', { throwErr: true, send: false }));
        dispatcher.orderHandlers();

        const req = { url: '/' }; const res = {};
        await dispatcher.onEventRequest(req, res);

        assert.strictEqual(log[0], 'pre');
    });

    test('executes post-handlers after a successful process handler', async () => {
        /** @type {Fl32_Web_Back_Dispatcher} */
        const dispatcher = new Fl32_Web_Back_Dispatcher({ logger, respond, helpOrder, STAGE });
        dispatcher.addHandler(pre('pre'));
        dispatcher.addHandler(proc('proc'));
        dispatcher.addHandler(post('post'));
        dispatcher.orderHandlers();

        const req = { url: '/' }; const res = {};
        await dispatcher.onEventRequest(req, res);

        assert.deepStrictEqual(log, ['pre', 'proc', 'post']);
    });

    test('returns 500 if a process handler throws', async () => {
        /** @type {Fl32_Web_Back_Dispatcher} */
        const dispatcher = new Fl32_Web_Back_Dispatcher({ logger, respond, helpOrder, STAGE });
        dispatcher.addHandler(proc('proc', { throwErr: true, send: false }));
        dispatcher.orderHandlers();

        const req = { url: '/' }; const res = {};
        await dispatcher.onEventRequest(req, res);

        assert.strictEqual(res.code, 500);
    });

    test('returns 404 if no process handler handles the request', async () => {
        /** @type {Fl32_Web_Back_Dispatcher} */
        const dispatcher = new Fl32_Web_Back_Dispatcher({ logger, respond, helpOrder, STAGE });
        dispatcher.addHandler(pre('pre'));
        dispatcher.addHandler(proc('p1', { handled: false, send: false }));
        dispatcher.addHandler(post('post'));
        dispatcher.orderHandlers();

        const req = { url: '/missing' }; const res = {};
        await dispatcher.onEventRequest(req, res);

        assert.strictEqual(res.code, 404);
        assert.deepStrictEqual(log, ['pre', 'p1', 'post']);
    });

    test('orders handlers according to before/after dependencies', async () => {
        const localLog = [];
        const helpOrderByDeps = {
            sort: (handlers) => {
                const graph = new Map();
                const inDegree = new Map();
                const byName = new Map();
                for (const h of handlers) {
                    const { name } = h.getRegistrationInfo();
                    byName.set(name, h);
                    graph.set(name, new Set());
                    inDegree.set(name, 0);
                }
                for (const h of handlers) {
                    const { name, after = [] } = h.getRegistrationInfo();
                    for (const dep of after) {
                        if (!graph.has(dep)) continue;
                        graph.get(dep).add(name);
                        inDegree.set(name, inDegree.get(name) + 1);
                    }
                }
                const queue = [];
                for (const [name, degree] of inDegree.entries()) {
                    if (degree === 0) queue.push(name);
                }
                const res = [];
                while (queue.length) {
                    const name = queue.shift();
                    res.push(byName.get(name));
                    for (const next of graph.get(name)) {
                        inDegree.set(next, inDegree.get(next) - 1);
                        if (inDegree.get(next) === 0) queue.push(next);
                    }
                }
                return res;
            },
        };
        const mk = (name, after = []) => ({
            getRegistrationInfo: () => ({ name, stage: STAGE.PRE, after }),
            handle: async () => { localLog.push(name); },
        });

        /** @type {Fl32_Web_Back_Dispatcher} */
        const dispatcher = new Fl32_Web_Back_Dispatcher({ logger, respond, helpOrder: helpOrderByDeps, STAGE });
        dispatcher.addHandler(mk('a', ['c']));
        dispatcher.addHandler(mk('b', ['a']));
        dispatcher.addHandler(mk('c'));
        dispatcher.orderHandlers();

        await dispatcher.onEventRequest({}, {});

        assert.deepStrictEqual(localLog, ['c', 'a', 'b']);
    });
});
