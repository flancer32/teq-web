import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import Fl32_Web_Back_Api_Handler from '../../../../src/Back/Api/Handler.mjs';

describe('Fl32_Web_Back_Api_Handler', () => {
    test('throws for abstract methods', async () => {
        const handler = new Fl32_Web_Back_Api_Handler();

        await assert.rejects(async () => handler.handle({}), /Method not implemented/);
        assert.throws(() => handler.getRegistrationInfo(), /Method not implemented/);
    });
});
