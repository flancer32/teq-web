import test from 'node:test';
import assert from 'assert';
import {buildTestContainer} from '../../../common.js';

test.describe('Fl32_Web_Back_Dto_Handler_Source', () => {

  test('should create valid config DTO with casted fields', async () => {
    const container = buildTestContainer();

    container.register('Fl32_Web_Back_Helper_Cast$', {
      string: (data) => typeof data === 'string' ? data : undefined,
      stringArrayMap: (data) => data,
    });

    const factory = await container.get('Fl32_Web_Back_Dto_Handler_Source$');
    const dto = factory.create({
      root: '/abs/path',
      prefix: '/src/',
      allow: { vue: ['dist/vue.global.js'] },
    });

    assert.strictEqual(dto.root, '/abs/path');
    assert.strictEqual(dto.prefix, '/src/');
    assert.deepStrictEqual(dto.allow, { vue: ['dist/vue.global.js'] });
  });

  test('should throw if required fields are missing or invalid', async () => {
    const container = buildTestContainer();

    container.register('Fl32_Web_Back_Helper_Cast$', {
      string: () => undefined,
      stringArrayMap: () => ({}),
    });

    const factory = await container.get('Fl32_Web_Back_Dto_Handler_Source$');

    assert.throws(() => {
      factory.create({});
    }, /invalid.*root/i);

    assert.throws(() => {
      factory.create({ root: '/x', prefix: 123 });
    }, /invalid.*prefix/i);
  });
});
