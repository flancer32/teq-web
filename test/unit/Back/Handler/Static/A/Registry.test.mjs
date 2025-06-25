import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {buildTestContainer} from '../../../../common.js';

describe('Fl32_Web_Back_Handler_Static_A_Registry', () => {
    it('sorts configurations by prefix length and finds matching config', async () => {
        const container = buildTestContainer();
        /** @type {Fl32_Web_Back_Handler_Static_A_Registry} */
        const registry = await container.get('Fl32_Web_Back_Handler_Static_A_Registry$');

        const dtos = [
            {root: '/a', prefix: '/files/', defaults: []},
            {root: '/b', prefix: '/files/special/', defaults: []}
        ];
        registry.setConfigs(dtos);

        const {resolve} = await import('node:path');
        const match = registry.find('/files/special/test.txt');

        assert.ok(match, 'Expected a match for /files/special/test.txt');
        assert.strictEqual(match.config.root, resolve('/b'));
        assert.strictEqual(match.rel, 'test.txt');

        const noMatch = registry.find('/unknown');
        assert.strictEqual(noMatch, null);
    });
});
