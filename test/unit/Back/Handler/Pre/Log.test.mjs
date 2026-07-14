import {describe, test, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import Fl32_Web_Back_Handler_Pre_Log from '../../../../../src/Back/Handler/Pre/Log.mjs';
import {Factory as Fl32_Web_Back_Dto_Info_Factory} from '../../../../../src/Back/Dto/Info.mjs';
import Fl32_Web_Back_Helper_Cast from '../../../../../src/Back/Helper/Cast.mjs';

function createLoggerProvider(log) {
    return {
        forSource: () => ({
            debug: (msg) => log.push(msg),
        }),
    };
}

describe('Fl32_Web_Back_Handler_Pre_Log', () => {
    const log = [];
    const STAGE = Object.freeze({INIT: 'INIT', PROCESS: 'PROCESS', FINALIZE: 'FINALIZE'});
    const cast = new Fl32_Web_Back_Helper_Cast();
    const dtoInfoFactory = new Fl32_Web_Back_Dto_Info_Factory({cast, STAGE});
    let logger;

    beforeEach(() => {
        log.length = 0;
        logger = createLoggerProvider(log);
    });

    test('logs method and url', async () => {
        /** @type {Fl32_Web_Back_Handler_Pre_Log} */
        const handler = new Fl32_Web_Back_Handler_Pre_Log({logger, dtoInfoFactory, STAGE});
        assert.strictEqual(handler.getRegistrationInfo().name, 'Fl32_Web_Back_Handler_Pre_Log');
        await handler.handle({request: {method: 'GET', url: '/path'}});
        assert.deepStrictEqual(log, ['GET /path']);
    });
});
