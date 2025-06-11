import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {buildTestContainer} from '../../../common.js';

describe('Fl32_Web_Back_Helper_Order_Kahn', () => {

    describe('sort', () => {
        it('should sort handlers respecting after/before constraints', async () => {
            const container = buildTestContainer();
            const sorter = await container.get('Fl32_Web_Back_Helper_Order_Kahn$');

            // Mock handlers with dependencies
            const mk = (name, after = [], before = []) => ({
                getRegistrationInfo: () => ({name, after, before})
            });

            const a = mk('a');                  // no deps
            const b = mk('b', ['a']);           // after a
            const c = mk('c', [], ['b']);       // before b (== b after c)
            const d = mk('d', ['b', 'c']);      // after b and c

            const result = sorter.sort([a, b, c, d]);
            const names = result.map(h => h.getRegistrationInfo().name);
            assert.deepStrictEqual(names, ['a', 'c', 'b', 'd']);
        });

        it('should detect circular dependency', async () => {
            const container = buildTestContainer();
            const sorter = await container.get('Fl32_Web_Back_Helper_Order_Kahn$');

            const mk = (name, after = [], before = []) => ({
                getRegistrationInfo: () => ({name, after, before})
            });

            const x = mk('x', ['y']);
            const y = mk('y', ['x']);

            assert.throws(() => {
                sorter.sort([x, y]);
            }, /Circular dependency detected/);
        });

        it('should ignore references to unknown handlers', async () => {
            const container = buildTestContainer();
            const sorter = await container.get('Fl32_Web_Back_Helper_Order_Kahn$');

            const mk = (name, after = [], before = []) => ({
                getRegistrationInfo: () => ({name, after, before})
            });

            const a = mk('a', ['ghost']); // ghost does not exist
            const b = mk('b');

            const result = sorter.sort([a, b]);
            const names = result.map(h => h.getRegistrationInfo().name);
            assert.deepStrictEqual(names.sort(), ['a', 'b']); // Order can vary, but no crash
        });
    });
});
