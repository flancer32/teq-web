import {describe, test, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import Fl32_Web_Back_Handler_Pre_Log from '../../../../../src/Back/Handler/Pre/Log.mjs';
import {Factory as Fl32_Web_Back_Dto_Info_Factory} from '../../../../../src/Back/Dto/Info.mjs';
import Fl32_Web_Back_Helper_Cast from '../../../../../src/Back/Helper/Cast.mjs';

describe('Fl32_Web_Back_Handler_Pre_Log', () => {
    const log = [];
    const STAGE = Object.freeze({INIT: 'INIT', PROCESS: 'PROCESS', FINALIZE: 'FINALIZE'});
    const cast = new Fl32_Web_Back_Helper_Cast();
    const dtoInfoFactory = new Fl32_Web_Back_Dto_Info_Factory({cast, STAGE});
    let logger;

    beforeEach(() => {
        log.length = 0;
        logger = {
            debug: (msg) => log.push(msg),
        };
    });

    test('logs method and url', async () => {
        /** @type {Fl32_Web_Back_Handler_Pre_Log} */
        const handler = new Fl32_Web_Back_Handler_Pre_Log({logger, dtoInfoFactory, STAGE});
        await handler.handle({request: {method: 'GET', url: '/path'}});
        assert.deepStrictEqual(log, ['GET /path']);
    });
});
