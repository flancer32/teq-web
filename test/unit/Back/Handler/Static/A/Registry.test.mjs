import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildTestContainer } from '../../../../common.js';

/** Simple config factory mock */
function getMockFactory() {
    return { create: dto => ({ root: dto.root, prefix: dto.prefix }) };
}

describe('Fl32_Web_Back_Handler_Static_A_Registry', () => {
    it('stores initial config', async () => {
        const container = buildTestContainer();
        container.register('Fl32_Web_Back_Handler_Static_A_Config$', getMockFactory());
        /** @type {Fl32_Web_Back_Handler_Static_A_Registry} */
        const registry = await container.get('Fl32_Web_Back_Handler_Static_A_Registry$');

        registry.addConfigs([{ root: '/a', prefix: '/p/' }]);
        const match = registry.find('/p/file.txt');

        assert.ok(match);
        assert.strictEqual(match.config.root, '/a');
    });

    it('adds config with new prefix', async () => {
        const container = buildTestContainer();
        container.register('Fl32_Web_Back_Handler_Static_A_Config$', getMockFactory());
        const registry = await container.get('Fl32_Web_Back_Handler_Static_A_Registry$');

        registry.addConfigs([{ root: '/a', prefix: '/p/' }]);
        registry.addConfigs([{ root: '/b', prefix: '/p/s/' }]);

        const match = registry.find('/p/s/file.txt');
        assert.ok(match);
        assert.strictEqual(match.config.root, '/b');
    });

    it('ignores config with existing prefix', async () => {
        const container = buildTestContainer();
        container.register('Fl32_Web_Back_Handler_Static_A_Config$', getMockFactory());
        const registry = await container.get('Fl32_Web_Back_Handler_Static_A_Registry$');

        registry.addConfigs([{ root: '/a', prefix: '/p/' }]);
        registry.addConfigs([{ root: '/b', prefix: '/p/s/' }]);
        registry.addConfigs([{ root: '/c', prefix: '/p/s/' }]);

        const match = registry.find('/p/s/test.txt');
        assert.ok(match);
        assert.strictEqual(match.config.root, '/b');
    });

    it('prefers longer prefix when matching', async () => {
        const container = buildTestContainer();
        container.register('Fl32_Web_Back_Handler_Static_A_Config$', getMockFactory());
        const registry = await container.get('Fl32_Web_Back_Handler_Static_A_Registry$');

        registry.addConfigs([
            { root: '/a', prefix: '/p/' },
            { root: '/b', prefix: '/p/s/' }
        ]);

        const match1 = registry.find('/p/s/x.txt');
        const match2 = registry.find('/p/y.txt');

        assert.strictEqual(match1.config.root, '/b');
        assert.strictEqual(match2.config.root, '/a');
    });
});
