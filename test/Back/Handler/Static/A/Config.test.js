import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import Config from '../../../../../src/Back/Handler/Static/A/Config.js';

describe('Static A Config', () => {
    it('normalizes prefix and defaults', () => {
        const factory = new Config({'node:path': path});
        const dto = {root: './r', prefix: '/p', allow: {'.':['.']}, defaults: []};
        const cfg = factory.create(dto);
        assert.strictEqual(cfg.root, path.resolve('./r'));
        assert.strictEqual(cfg.prefix, '/p/');
        assert.deepStrictEqual(cfg.defaults, ['index.html','index.htm','index.txt']);
    });

    it('throws on invalid data', () => {
        const factory = new Config({'node:path': path});
        assert.throws(() => factory.create({prefix:'/'}), /root must be a string/);
        assert.throws(() => factory.create({root:'a', prefix: 5}), /prefix must be a string/i);
    });
});
