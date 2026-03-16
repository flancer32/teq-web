import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

async function loadRuntimeModule() {
    const href = pathToFileURL(path.resolve(import.meta.dirname, '../../../../src/Back/Config/Runtime.mjs')).href;
    return import(`${href}?case=${Math.random()}`);
}

async function loadRuntimeTlsModule() {
    const href = pathToFileURL(path.resolve(import.meta.dirname, '../../../../src/Back/Config/Runtime/Tls.mjs')).href;
    return import(`${href}?case=${Math.random()}`);
}

describe('Fl32_Web_Back_Config_Runtime', () => {
    test('uses hierarchical server values after freeze and keeps first write wins', async () => {
        const {default: RuntimeConfig, Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const runtime = new RuntimeConfig();
        const factory = new Factory({
            cast: new Cast(),
            SERVER_TYPE: new ServerType(),
            tlsFactory: new TlsFactory({cast: new Cast()}),
        });

        assert.throws(() => runtime.server, /not initialized/);

        factory.configure({server: {port: '8080', type: 'http2'}});
        factory.configure({server: {port: '9090', type: 'https'}});
        factory.freeze();

        assert.equal(runtime.server.port, 8080);
        assert.equal(runtime.server.type, 'http2');
        assert.equal(Object.isFrozen(runtime.server), true);
        assert.throws(() => Object.freeze(runtime), /cannot be frozen/);
        assert.throws(() => {
            runtime.server = undefined;
        }, /immutable/);
        assert.throws(() => factory.configure({server: {port: 1}}), /frozen/);
        assert.equal(factory.freeze(), runtime);
    });

    test('applies defaults on freeze', async () => {
        const {default: RuntimeConfig, Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const runtime = new RuntimeConfig();
        const factory = new Factory({
            cast: new Cast(),
            SERVER_TYPE: new ServerType(),
            tlsFactory: new TlsFactory({cast: new Cast()}),
        });

        factory.freeze();

        assert.equal(runtime.server.port, 3000);
        assert.equal(runtime.server.type, 'http');
        assert.throws(() => Object.freeze(runtime), /cannot be frozen/);
    });

    test('requires tls for https mode', async () => {
        const {Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const factory = new Factory({
            cast: new Cast(),
            SERVER_TYPE: new ServerType(),
            tlsFactory: new TlsFactory({cast: new Cast()}),
        });

        factory.configure({server: {type: 'https'}});
        assert.throws(() => factory.freeze(), /TLS configuration is required/);
    });

    test('hydrates tls subtree through dedicated runtime component', async () => {
        const {default: RuntimeConfig, Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const runtime = new RuntimeConfig();
        const cast = new Cast();
        const factory = new Factory({
            cast,
            SERVER_TYPE: new ServerType(),
            tlsFactory: new TlsFactory({cast}),
        });

        factory.configure({server: {type: 'https', tls: {key: 'key', cert: 'cert', ca: 'ca'}}});
        factory.freeze();

        assert.equal(runtime.server.tls.key, 'key');
        assert.equal(runtime.server.tls.cert, 'cert');
        assert.equal(runtime.server.tls.ca, 'ca');
        assert.throws(() => Object.freeze(runtime.server.tls), /cannot be frozen/);
        assert.throws(() => Object.freeze(runtime), /cannot be frozen/);
    });
});
