import {describe, it, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {buildTestContainer} from '../../../common.js';

describe('Fl32_Web_Back_Handler_Pre_Log', () => {
    let container;
    const log = [];

    beforeEach(() => {
        log.length = 0;
        container = buildTestContainer();
        container.register('Fl32_Web_Back_Logger$', {
            debug: (msg) => log.push(msg),
        });
    });

    it('logs method and url', async () => {
        const handler = await container.get('Fl32_Web_Back_Handler_Pre_Log$');
        await handler.handle({method: 'GET', url: '/path'});
        assert.deepStrictEqual(log, ['GET /path']);
    });
});
