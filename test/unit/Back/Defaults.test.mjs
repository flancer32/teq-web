import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import Fl32_Web_Back_Defaults from '../../../src/Back/Defaults.mjs';

describe('Fl32_Web_Back_Defaults', () => {
    test('contains default port', () => {
        const defaults = new Fl32_Web_Back_Defaults();
        assert.strictEqual(defaults.PORT, 3000);
        assert.equal(Object.isFrozen(defaults), true);
    });
});
