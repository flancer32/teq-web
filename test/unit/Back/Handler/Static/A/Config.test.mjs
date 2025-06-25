import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {buildTestContainer} from '../../../../common.js';

describe('Fl32_Web_Back_Handler_Static_A_Config', () => {
    it('normalizes root, prefix, allow and defaults', async () => {
        const container = buildTestContainer();
        /** @type {Fl32_Web_Back_Handler_Static_A_Config} */
        const factory = await container.get('Fl32_Web_Back_Handler_Static_A_Config$');

        const dto = {
            root: './r',
            prefix: '/p',
            allow: {'.': ['.']},
            defaults: []
        };
        const cfg = factory.create(dto);

        // root is resolved via node:path from the container
        const {resolve} = await import('node:path');
        assert.strictEqual(cfg.root, resolve('./r'));

        // prefix is normalized to always end with a slash
        assert.strictEqual(cfg.prefix, '/p/');

        // allowed extensions are preserved
        assert.deepStrictEqual(cfg.allow, {'.': ['.']});

        // defaults fallback to built-in list when empty
        assert.deepStrictEqual(
            cfg.defaults,
            ['index.html', 'index.htm', 'index.txt']
        );
    });

    it('throws on invalid data', async () => {
        const container = buildTestContainer();
        const factory = await container.get('Fl32_Web_Back_Handler_Static_A_Config$');

        // missing root should throw an error about root
        assert.throws(
            () => factory.create({prefix: '/'}),
            /root must be a string/
        );

        // non-string prefix should throw an error about prefix
        assert.throws(
            () => factory.create({root: 'a', prefix: 5}),
            /prefix must be a string/i
        );
    });
});
