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
    test('uses flat runtime values after freeze and keeps first write wins', async () => {
        const {default: RuntimeConfig, Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const cast = new Cast();
        const runtime = new RuntimeConfig({
            cast,
            SERVER_TYPE: new ServerType(),
            tlsFactory: new TlsFactory({cast}),
        });
        const factory = new Factory({
            cast,
            SERVER_TYPE: new ServerType(),
            tlsFactory: new TlsFactory({cast}),
        });

        assert.throws(() => runtime.port, /not initialized/);

        factory.configure({port: '8080', type: 'http2'});
        factory.configure({port: '9090', type: 'https'});
        factory.freeze();

        assert.equal(runtime.port, 8080);
        assert.equal(runtime.type, 'http2');
        assert.throws(() => Object.freeze(runtime), /cannot be frozen/);
        assert.throws(() => {
            runtime.port = 9090;
        }, /immutable/);
        assert.throws(() => factory.configure({port: 1}), /frozen/);
        assert.equal(factory.freeze(), undefined);
    });

    test('applies defaults on freeze', async () => {
        const {default: RuntimeConfig, Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const cast = new Cast();
        const runtime = new RuntimeConfig({
            cast,
            SERVER_TYPE: new ServerType(),
            tlsFactory: new TlsFactory({cast}),
        });
        const factory = new Factory({
            cast,
            SERVER_TYPE: new ServerType(),
            tlsFactory: new TlsFactory({cast}),
        });

        factory.freeze();

        assert.equal(runtime.port, 3000);
        assert.equal(runtime.type, 'http');
        assert.throws(() => Object.freeze(runtime), /cannot be frozen/);
    });

    test('requires tls for https mode', async () => {
        const {Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const cast = new Cast();
        const factory = new Factory({
            cast,
            SERVER_TYPE: new ServerType(),
            tlsFactory: new TlsFactory({cast}),
        });

        factory.configure({type: 'https'});
        assert.throws(() => factory.freeze(), /TLS configuration is required/);
    });

    test('hydrates tls subtree through dedicated runtime component', async () => {
        const {default: RuntimeConfig, Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const cast = new Cast();
        const runtime = new RuntimeConfig({
            cast,
            SERVER_TYPE: new ServerType(),
            tlsFactory: new TlsFactory({cast}),
        });
        const factory = new Factory({
            cast,
            SERVER_TYPE: new ServerType(),
            tlsFactory: new TlsFactory({cast}),
        });

        factory.configure({type: 'https', tls: {key: 'key', cert: 'cert', ca: 'ca'}});
        factory.freeze();

        assert.equal(runtime.tls.key, 'key');
        assert.equal(runtime.tls.cert, 'cert');
        assert.equal(runtime.tls.ca, 'ca');
        assert.throws(() => Object.freeze(runtime.tls), /cannot be frozen/);
        assert.throws(() => Object.freeze(runtime), /cannot be frozen/);
    });
});
