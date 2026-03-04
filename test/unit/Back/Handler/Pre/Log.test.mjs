import {describe, test, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import Fl32_Web_Back_Handler_Pre_Log from '../../../../../src/Back/Handler/Pre/Log.mjs';
import Fl32_Web_Back_Dto_Handler_Info from '../../../../../src/Back/Dto/Handler/Info.mjs';
import Fl32_Web_Back_Helper_Cast from '../../../../../src/Back/Helper/Cast.mjs';

describe('Fl32_Web_Back_Handler_Pre_Log', () => {
    const log = [];
    const STAGE = Object.freeze({PRE: 'pre', PROCESS: 'process', POST: 'post'});
    const cast = new Fl32_Web_Back_Helper_Cast();
    const dtoInfo = new Fl32_Web_Back_Dto_Handler_Info({cast, STAGE});
    let logger;

    beforeEach(() => {
        log.length = 0;
        logger = {
            debug: (msg) => log.push(msg),
        };
    });

    test('logs method and url', async () => {
        /** @type {Fl32_Web_Back_Handler_Pre_Log} */
        const handler = new Fl32_Web_Back_Handler_Pre_Log({logger, dtoInfo, STAGE});
        await handler.handle({method: 'GET', url: '/path'});
        assert.deepStrictEqual(log, ['GET /path']);
    });
});
