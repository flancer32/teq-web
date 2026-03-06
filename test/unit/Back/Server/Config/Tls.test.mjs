import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import Fl32_Web_Back_Server_Config_Tls from '../../../../../src/Back/Server/Config/Tls.mjs';
import Fl32_Web_Back_Helper_Cast from '../../../../../src/Back/Helper/Cast.mjs';

describe('Fl32_Web_Back_Server_Config_Tls', () => {
    test('creates tls dto with casted string fields', () => {
        const factory = new Fl32_Web_Back_Server_Config_Tls({cast: new Fl32_Web_Back_Helper_Cast()});
        const dto = factory.create({key: 'key', cert: 'cert', ca: 'ca'});
        assert.deepStrictEqual({key: dto.key, cert: dto.cert, ca: dto.ca}, {key: 'key', cert: 'cert', ca: 'ca'});
    });
});
