import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import {Factory as Fl32_Web_Back_Server_Config_Factory} from '../../../../src/Back/Server/Config.mjs';
import {Factory as Fl32_Web_Back_Server_Config_Tls_Factory} from '../../../../src/Back/Server/Config/Tls.mjs';
import Fl32_Web_Back_Helper_Cast from '../../../../src/Back/Helper/Cast.mjs';
import Fl32_Web_Back_Enum_Server_Type from '../../../../src/Back/Enum/Server/Type.mjs';

describe('Fl32_Web_Back_Server_Config', () => {
    test('creates http dto', () => {
        const cast = new Fl32_Web_Back_Helper_Cast();
        const cfg = new Fl32_Web_Back_Server_Config_Factory({
            cast,
            SERVER_TYPE: new Fl32_Web_Back_Enum_Server_Type(),
            tlsFactory: new Fl32_Web_Back_Server_Config_Tls_Factory({cast}),
        });
        const dto = cfg.create({port: '8080', type: 'http'});
        assert.strictEqual(dto.port, 8080);
        assert.strictEqual(dto.type, 'http');
        assert.strictEqual(dto.tls, undefined);
        assert.equal(Object.isFrozen(dto), true);
    });

    test('requires tls for https type', () => {
        const cast = new Fl32_Web_Back_Helper_Cast();
        const cfg = new Fl32_Web_Back_Server_Config_Factory({
            cast,
            SERVER_TYPE: new Fl32_Web_Back_Enum_Server_Type(),
            tlsFactory: new Fl32_Web_Back_Server_Config_Tls_Factory({cast}),
        });
        assert.throws(() => cfg.create({type: 'https'}), /TLS configuration is required/);
    });
});
