import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import Resolver from '../../../../../src/Back/Handler/Static/A/Resolver.js';

describe('Static A Resolver', () => {
    const resolver = new Resolver({'node:path': path});
    const config = {root: path.resolve('/root'), prefix:'/p/', allow:{pkg:['a.txt']}};

    it('resolves allowed path', () => {
        const p = resolver.resolve(config, 'pkg/a.txt');
        assert.strictEqual(p, path.resolve('/root/pkg/a.txt'));
    });

    it('blocks disallowed path', () => {
        const p = resolver.resolve(config, 'pkg/b.txt');
        assert.strictEqual(p, null);
    });

    it('throws on traversal', () => {
        assert.throws(() => resolver.resolve(config, '../x'), /access denied/);
    });
});
