import test from 'node:test';
import assert from 'node:assert/strict';
import {Factory as Fl32_Web_Back_Dto_Source_Factory} from '../../../../../src/Back/Dto/Source.mjs';

test.describe('Fl32_Web_Back_Dto_Source', () => {
  test('should create valid config DTO with casted fields', async () => {
    const cast = {
      string: (d) => typeof d === 'string' ? d : undefined,
      stringArrayMap: (d) => d,
      array: (d, item) => Array.isArray(d) ? d.map(item) : [],
    };
    /** @type {Fl32_Web_Back_Dto_Source$Factory} */
    const factory = new Fl32_Web_Back_Dto_Source_Factory({cast});
    const dto = factory.create({
      root: '/abs/path',
      prefix: '/src/',
      allow: { vue: ['dist/vue.global.js'] },
      defaults: ['index.html'],
    });
    assert.strictEqual(dto.root, '/abs/path');
    assert.strictEqual(dto.prefix, '/src/');
    assert.deepStrictEqual(dto.allow, { vue: ['dist/vue.global.js'] });
    assert.deepStrictEqual(dto.defaults, ['index.html']);
    assert.equal(Object.isFrozen(dto), true);
  });

  test('should return undefined fields if values are invalid', async () => {
    const cast = {
      string: () => undefined,
      stringArrayMap: () => ({}),
      array: () => [],
    };
    /** @type {Fl32_Web_Back_Dto_Source$Factory} */
    const factory = new Fl32_Web_Back_Dto_Source_Factory({cast});
    const dto = factory.create({});
    assert.strictEqual(dto.root, undefined);
    assert.strictEqual(dto.prefix, undefined);
    assert.deepStrictEqual(dto.allow, {});
    assert.deepStrictEqual(dto.defaults, []);
  });
});
