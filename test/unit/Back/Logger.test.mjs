import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import Fl32_Web_Back_Logger from '../../../src/Back/Logger.mjs';

describe('Fl32_Web_Back_Logger', () => {
    test('exposes all expected logging methods', () => {
        const logger = new Fl32_Web_Back_Logger();
        assert.equal(typeof logger.error, 'function');
        assert.equal(typeof logger.warn, 'function');
        assert.equal(typeof logger.info, 'function');
        assert.equal(typeof logger.debug, 'function');
        assert.equal(typeof logger.trace, 'function');
        assert.equal(typeof logger.exception, 'function');
    });
});
