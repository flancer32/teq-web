import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import Registry from '../../../../../src/Back/Handler/Static/A/Registry.js';
import Config from '../../../../../src/Back/Handler/Static/A/Config.js';

describe('Static A Registry', () => {
    it('sorts configs and finds matches', () => {
        const cfgFactory = new Config({'node:path': path});
        const registry = new Registry({Fl32_Web_Back_Handler_Static_A_Config$: cfgFactory});
        const list = [
            {root:'/a', prefix:'/files/', defaults:[]},
            {root:'/b', prefix:'/files/special/', defaults:[]},
        ];
        registry.setConfigs(list);
        const match = registry.find('/files/special/test.txt');
        assert.ok(match);
        assert.strictEqual(match.config.root, path.resolve('/b'));
        assert.strictEqual(match.rel, 'test.txt');
        assert.strictEqual(registry.find('/unknown'), null);
    });
});
