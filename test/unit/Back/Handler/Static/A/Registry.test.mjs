import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import Fl32_Web_Back_Handler_Static_A_Registry from '../../../../../../src/Back/Handler/Static/A/Registry.mjs';

/** Simple config factory mock */
function getMockFactory() {
    return { create: dto => ({ root: dto.root, prefix: dto.prefix }) };
}

describe('Fl32_Web_Back_Handler_Static_A_Registry', () => {
    test('stores initial config', async () => {
        /** @type {Fl32_Web_Back_Handler_Static_A_Registry} */
        const registry = new Fl32_Web_Back_Handler_Static_A_Registry({
            configFactory: getMockFactory(),
            logger: {warn: () => {}},
        });

        registry.addConfigs([{ root: '/a', prefix: '/p/' }]);
        const match = registry.find('/p/file.txt');

        assert.ok(match);
        assert.strictEqual(match.config.root, '/a');
    });

    test('adds config with new prefix', async () => {
        /** @type {Fl32_Web_Back_Handler_Static_A_Registry} */
        const registry = new Fl32_Web_Back_Handler_Static_A_Registry({
            configFactory: getMockFactory(),
            logger: {warn: () => {}},
        });

        registry.addConfigs([{ root: '/a', prefix: '/p/' }]);
        registry.addConfigs([{ root: '/b', prefix: '/p/s/' }]);

        const match = registry.find('/p/s/file.txt');
        assert.ok(match);
        assert.strictEqual(match.config.root, '/b');
    });

    test('ignores config with existing prefix', async () => {
        /** @type {Fl32_Web_Back_Handler_Static_A_Registry} */
        const registry = new Fl32_Web_Back_Handler_Static_A_Registry({
            configFactory: getMockFactory(),
            logger: {warn: () => {}},
        });

        registry.addConfigs([{ root: '/a', prefix: '/p/' }]);
        registry.addConfigs([{ root: '/b', prefix: '/p/s/' }]);
        registry.addConfigs([{ root: '/c', prefix: '/p/s/' }]);

        const match = registry.find('/p/s/test.txt');
        assert.ok(match);
        assert.strictEqual(match.config.root, '/b');
    });

    test('logs warning when prefix already exists', async () => {
        const log = [];
        /** @type {Fl32_Web_Back_Handler_Static_A_Registry} */
        const registry = new Fl32_Web_Back_Handler_Static_A_Registry({
            configFactory: getMockFactory(),
            logger: {warn: (...args) => log.push(args)},
        });

        registry.addConfigs([{ root: '/a', prefix: '/p/' }]);
        registry.addConfigs([{ root: '/b', prefix: '/p/' }]);

        assert.strictEqual(log.length, 1);
        assert.ok(log[0][0].includes('/p/'));
    });

    test('prefers longer prefix when matching', async () => {
        /** @type {Fl32_Web_Back_Handler_Static_A_Registry} */
        const registry = new Fl32_Web_Back_Handler_Static_A_Registry({
            configFactory: getMockFactory(),
            logger: {warn: () => {}},
        });

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
