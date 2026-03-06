import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import Fl32_Web_Back_Helper_Mime from '../../../../src/Back/Helper/Mime.mjs';

describe('Fl32_Web_Back_Helper_Mime', () => {
    test('returns mapped mime type by extension', () => {
        const mime = new Fl32_Web_Back_Helper_Mime();
        assert.strictEqual(mime.getByExt('.html'), 'text/html');
        assert.strictEqual(mime.getByExt('.MJS'), 'application/javascript');
    });

    test('returns octet-stream for unknown extension', () => {
        const mime = new Fl32_Web_Back_Helper_Mime();
        assert.strictEqual(mime.getByExt('.unknown-ext'), 'application/octet-stream');
    });
});
