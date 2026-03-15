import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

async function loadRuntimeModule() {
    const href = pathToFileURL(path.resolve(import.meta.dirname, '../../../../src/Back/Config/Runtime.mjs')).href;
    return import(`${href}?case=${Math.random()}`);
}

describe('Fl32_Web_Back_Config_Runtime', () => {
    test('uses configured values after freeze and keeps first write wins', async () => {
        const {default: RuntimeConfig, Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await import('../../../../src/Back/Server/Config/Tls.mjs');

        const runtime = new RuntimeConfig();
        const factory = new Factory({
            cast: new Cast(),
            SERVER_TYPE: new ServerType(),
            tlsFactory: new TlsFactory({cast: new Cast()}),
        });

        assert.throws(() => runtime.port, /not initialized/);

        factory.configure({port: '8080', type: 'http2'});
        factory.configure({port: '9090', type: 'https'});
        factory.freeze();

        assert.equal(runtime.port, 8080);
        assert.equal(runtime.type, 'http2');
        assert.equal(Object.isFrozen(runtime), true);
        assert.throws(() => {
            runtime.port = 1;
        }, /immutable/);
        assert.throws(() => factory.configure({port: 1}), /frozen/);
        assert.equal(factory.freeze(), runtime);
    });

    test('applies defaults on freeze', async () => {
        const {default: RuntimeConfig, Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await import('../../../../src/Back/Server/Config/Tls.mjs');

        const runtime = new RuntimeConfig();
        const factory = new Factory({
            cast: new Cast(),
            SERVER_TYPE: new ServerType(),
            tlsFactory: new TlsFactory({cast: new Cast()}),
        });

        factory.freeze();

        assert.equal(runtime.port, 3000);
        assert.equal(runtime.type, 'http');
    });

    test('requires tls for https mode', async () => {
        const {Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await import('../../../../src/Back/Server/Config/Tls.mjs');

        const factory = new Factory({
            cast: new Cast(),
            SERVER_TYPE: new ServerType(),
            tlsFactory: new TlsFactory({cast: new Cast()}),
        });

        factory.configure({type: 'https'});
        assert.throws(() => factory.freeze(), /TLS configuration is required/);
    });
});
