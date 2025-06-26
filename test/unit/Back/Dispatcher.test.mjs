import {describe, it, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {buildTestContainer} from '../common.js';

/** Collects execution order */
let log;
/** DI container for each test */
let container;
/** Dispatcher stages enum */
let STAGE;
/** Respond helper mock */
let respond;

beforeEach(async () => {
    log = [];
    container = buildTestContainer();

    // Mock logger to keep tests quiet
    container.register('Fl32_Web_Back_Logger$', {
        info: () => {},
        error: () => {},
        exception: () => {},
    });
    // Keep handler order as provided
    container.register('Fl32_Web_Back_Helper_Order_Kahn$', {sort: arr => arr});

    // Respond helper stub
    respond = {
        isWritable: res => !res.headersSent && !res.writableEnded,
        code404_NotFound: ({res}) => { res.code = 404; res.headersSent = true; },
        code500_InternalServerError: ({res}) => { res.code = 500; res.headersSent = true; },
    };
    container.register('Fl32_Web_Back_Helper_Respond$', respond);

    STAGE = await container.get('Fl32_Web_Back_Enum_Stage$');
});

function pre(name) {
    return {
        getRegistrationInfo: () => ({name, stage: STAGE.PRE}),
        handle: async () => { log.push(name); },
    };
}

function proc(name, opts = {}) {
    const {handled = true, throwErr = false, send = true} = opts;
    return {
        getRegistrationInfo: () => ({name, stage: STAGE.PROCESS}),
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
        getRegistrationInfo: () => ({name, stage: STAGE.POST}),
        handle: async () => { log.push(name); },
    };
}

describe('Fl32_Web_Back_Dispatcher', () => {
    it('calls pre-handlers even when a process handler fails', async () => {
        const dispatcher = await container.get('Fl32_Web_Back_Dispatcher$');
        dispatcher.addHandler(pre('pre'));
        dispatcher.addHandler(proc('proc', {throwErr: true, send: false}));
        dispatcher.orderHandlers();

        const req = {url: '/'}; const res = {};
        await dispatcher.onEventRequest(req, res);

        assert.strictEqual(log[0], 'pre');
    });

    it('executes post-handlers after a successful process handler', async () => {
        const dispatcher = await container.get('Fl32_Web_Back_Dispatcher$');
        dispatcher.addHandler(pre('pre'));
        dispatcher.addHandler(proc('proc'));
        dispatcher.addHandler(post('post'));
        dispatcher.orderHandlers();

        const req = {url: '/'}; const res = {};
        await dispatcher.onEventRequest(req, res);

        assert.deepStrictEqual(log, ['pre', 'proc', 'post']);
    });

    it('returns 500 if a process handler throws', async () => {
        const dispatcher = await container.get('Fl32_Web_Back_Dispatcher$');
        dispatcher.addHandler(proc('proc', {throwErr: true, send: false}));
        dispatcher.orderHandlers();

        const req = {url: '/'}; const res = {};
        await dispatcher.onEventRequest(req, res);

        assert.strictEqual(res.code, 500);
    });

    it('returns 404 if no process handler handles the request', async () => {
        const dispatcher = await container.get('Fl32_Web_Back_Dispatcher$');
        dispatcher.addHandler(pre('pre'));
        dispatcher.addHandler(proc('p1', {handled: false, send: false}));
        dispatcher.addHandler(post('post'));
        dispatcher.orderHandlers();

        const req = {url: '/missing'}; const res = {};
        await dispatcher.onEventRequest(req, res);

        assert.strictEqual(res.code, 404);
        assert.deepStrictEqual(log, ['pre', 'p1', 'post']);
    });
});

