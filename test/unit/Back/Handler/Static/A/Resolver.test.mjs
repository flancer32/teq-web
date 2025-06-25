import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildTestContainer } from '../../../../common.js';

describe('Fl32_Web_Back_Handler_Static_A_Resolver', () => {
    it('resolves allowed path', async () => {
        const container = buildTestContainer();
        /** @type {Fl32_Web_Back_Handler_Static_A_Resolver} */
        const resolver = await container.get('Fl32_Web_Back_Handler_Static_A_Resolver$');

        const { resolve } = await import('node:path');
        const config = {
            root: resolve('/root'),
            prefix: '/p/',
            allow: { pkg: ['a.txt'] }
        };

        const fsPath = resolver.resolve(config, 'pkg/a.txt');
        assert.strictEqual(fsPath, resolve('/root/pkg/a.txt'));
    });

    it('returns null for disallowed path', async () => {
        const container = buildTestContainer();
        /** @type {Fl32_Web_Back_Handler_Static_A_Resolver} */
        const resolver = await container.get('Fl32_Web_Back_Handler_Static_A_Resolver$');

        const { resolve } = await import('node:path');
        const config = {
            root: resolve('/root'),
            prefix: '/p/',
            allow: { pkg: ['a.txt'] }
        };

        const result = resolver.resolve(config, 'pkg/b.txt');
        assert.strictEqual(result, null);
    });

    it('throws on path traversal attempts', async () => {
        const container = buildTestContainer();
        /** @type {Fl32_Web_Back_Handler_Static_A_Resolver} */
        const resolver = await container.get('Fl32_Web_Back_Handler_Static_A_Resolver$');

        const { resolve } = await import('node:path');
        const config = {
            root: resolve('/root'),
            prefix: '/p/',
            allow: { pkg: ['a.txt'] }
        };

        assert.throws(
            () => resolver.resolve(config, '../x'),
            /Static access denied/
        );
    });

    it('throws on absolute rel paths', async () => {
        const container = buildTestContainer();
        /** @type {Fl32_Web_Back_Handler_Static_A_Resolver} */
        const resolver = await container.get('Fl32_Web_Back_Handler_Static_A_Resolver$');

        const { resolve } = await import('node:path');
        const config = {
            root: resolve('/root'),
            prefix: '/p/',
            allow: { pkg: ['a.txt'] }
        };

        assert.throws(
            () => resolver.resolve(config, '/etc/passwd'),
            /Static access denied/
        );
    });
});
