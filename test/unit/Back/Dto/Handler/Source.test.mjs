import test from 'node:test';
import assert from 'assert';
import {buildTestContainer} from '../../../common.js';

test.describe('Fl32_Web_Back_Dto_Handler_Source', () => {
  test('should create valid config DTO with casted fields', async () => {
    const container = buildTestContainer();
    container.register('Fl32_Web_Back_Helper_Cast$', {
      string: (d) => typeof d === 'string' ? d : undefined,
      stringArrayMap: (d) => d,
      array: (d, item) => Array.isArray(d) ? d.map(item) : [],
    });
    const factory = await container.get('Fl32_Web_Back_Dto_Handler_Source$');
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
  });

  test('should return undefined fields if values are invalid', async () => {
    const container = buildTestContainer();
    container.register('Fl32_Web_Back_Helper_Cast$', {
      string: () => undefined,
      stringArrayMap: () => ({}),
      array: () => [],
    });
    const factory = await container.get('Fl32_Web_Back_Dto_Handler_Source$');
    const dto = factory.create({});
    assert.strictEqual(dto.root, undefined);
    assert.strictEqual(dto.prefix, undefined);
    assert.deepStrictEqual(dto.allow, {});
    assert.deepStrictEqual(dto.defaults, []);
  });
});
