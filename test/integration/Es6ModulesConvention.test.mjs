import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import Container from '@teqfw/di';

import {__deps__ as dtoInfoDeps} from '../../src/Back/Dto/Info.mjs';
import {__deps__ as dtoSourceDeps} from '../../src/Back/Dto/Source.mjs';
import {__deps__ as runtimeConfigDeps} from '../../src/Back/Config/Runtime.mjs';
import {__deps__ as runtimeTlsDeps} from '../../src/Back/Config/Runtime/Tls.mjs';
import {__deps__ as staticHandlerDeps} from '../../src/Back/Handler/Static.mjs';
import {__deps__ as preLogDeps} from '../../src/Back/Handler/Pre/Log.mjs';
import {__deps__ as staticConfigDeps} from '../../src/Back/Handler/Static/A/Config.mjs';
import {__deps__ as staticFallbackDeps} from '../../src/Back/Handler/Static/A/Fallback.mjs';
import {__deps__ as staticFileServiceDeps} from '../../src/Back/Handler/Static/A/FileService.mjs';
import {__deps__ as staticRegistryDeps} from '../../src/Back/Handler/Static/A/Registry.mjs';
import {__deps__ as staticResolverDeps} from '../../src/Back/Handler/Static/A/Resolver.mjs';
import {__deps__ as respondDeps} from '../../src/Back/Helper/Respond.mjs';
import {__deps__ as pipelineEngineDeps} from '../../src/Back/PipelineEngine.mjs';
import {__deps__ as serverDeps} from '../../src/Back/Server.mjs';

const SRC = path.resolve(import.meta.dirname, '../../src');
const DEP_DESCRIPTORS = [
    dtoInfoDeps,
    dtoSourceDeps,
    runtimeConfigDeps,
    runtimeTlsDeps,
    staticHandlerDeps,
    preLogDeps,
    staticConfigDeps,
    staticFallbackDeps,
    staticFileServiceDeps,
    staticRegistryDeps,
    staticResolverDeps,
    respondDeps,
    pipelineEngineDeps,
    serverDeps,
];
const MANAGED_MODULE_IDS = [
    'Fl32_Web_Back_Logger$',
    'Fl32_Web_Back_Enum_Stage$',
    'Fl32_Web_Back_Enum_Server_Type$',
    'Fl32_Web_Back_Helper_Cast$',
    'Fl32_Web_Back_Helper_Mime$',
    'Fl32_Web_Back_Helper_Order_Kahn$',
    'Fl32_Web_Back_Helper_Respond$',
    'Fl32_Web_Back_Dto_Info$',
    'Fl32_Web_Back_Dto_Info__Factory$',
    'Fl32_Web_Back_Dto_Source$',
    'Fl32_Web_Back_Dto_Source__Factory$',
    'Fl32_Web_Back_Config_Runtime_Tls__Factory$',
    'Fl32_Web_Back_Config_Runtime__Factory$',
    'Fl32_Web_Back_Handler_Static_A_Config$',
    'Fl32_Web_Back_Handler_Static_A_Fallback$',
    'Fl32_Web_Back_Handler_Static_A_FileService$',
    'Fl32_Web_Back_Handler_Static_A_Registry$',
    'Fl32_Web_Back_Handler_Static_A_Resolver$',
    'Fl32_Web_Back_Handler_Pre_Log$',
    'Fl32_Web_Back_Handler_Static$',
    'Fl32_Web_Back_PipelineEngine$',
];

function createContainer() {
    const container = new Container();
    container.addNamespaceRoot('Fl32_Web_', SRC, '.mjs');
    container.enableTestMode();
    return container;
}

describe('TeqFW ES6 module convention integration', () => {
    test('freezes dependency descriptors for managed modules', () => {
        for (const descriptor of DEP_DESCRIPTORS) {
            assert.equal(Object.isFrozen(descriptor), true);
        }
    });

    test('keeps container-managed modules safe to import and instantiate', async () => {
        const container = createContainer();

        for (const id of MANAGED_MODULE_IDS) {
            const instance = await container.get(id);
            assert.ok(instance, `Expected container instance for ${id}`);
        }

        const logger = await container.get('Fl32_Web_Back_Logger$');
        const runtimeConfigFactory = await container.get('Fl32_Web_Back_Config_Runtime__Factory$');
        const runtimeFromFactory = runtimeConfigFactory.configure({server: {port: '3001', type: 'http'}});
        runtimeConfigFactory.freeze();
        const runtimeConfig = await container.get('Fl32_Web_Back_Config_Runtime$');
        const server = await container.get('Fl32_Web_Back_Server$');
        const STAGE = await container.get('Fl32_Web_Back_Enum_Stage$');
        const SERVER_TYPE = await container.get('Fl32_Web_Back_Enum_Server_Type$');
        const cast = await container.get('Fl32_Web_Back_Helper_Cast$');
        const kahn = await container.get('Fl32_Web_Back_Helper_Order_Kahn$');

        assert.equal(typeof logger.info, 'function');
        assert.equal(typeof server.start, 'function');
        assert.equal(runtimeFromFactory, runtimeConfig);
        assert.equal(runtimeConfig.server.port, 3001);
        assert.equal(runtimeConfig.server.type, 'http');
        assert.equal(typeof runtimeConfig.server.tls, 'object');
        assert.equal(STAGE.PROCESS, 'PROCESS');
        assert.equal(Object.isFrozen(STAGE), true);
        assert.equal(SERVER_TYPE.HTTPS, 'https');
        assert.equal(Object.isFrozen(SERVER_TYPE), true);
        assert.deepEqual(cast.array(['a', 'b'], cast.string), ['a', 'b']);

        const dtoInfoFactory = await container.get('Fl32_Web_Back_Dto_Info__Factory$');
        const dtoInfo = dtoInfoFactory.create({name: 'h1', stage: 'process'});
        assert.equal(Object.isFrozen(dtoInfo), true);

        const sourceFactory = await container.get('Fl32_Web_Back_Dto_Source__Factory$');
        const sourceDto = sourceFactory.create({root: '/tmp'});
        assert.equal(Object.isFrozen(sourceDto), true);

        const frozenRuntime = runtimeConfigFactory.freeze();
        assert.throws(() => {
            frozenRuntime.server = {};
        }, /Runtime configuration is immutable\./);

        assert.deepEqual(
            kahn.sort([
                {
                    getRegistrationInfo: () => ({name: 'one', before: ['two']}),
                },
                {
                    getRegistrationInfo: () => ({name: 'two'}),
                },
            ]).map((item) => item.getRegistrationInfo().name),
            ['one', 'two']
        );
    });
});
