import {beforeEach, describe, test} from 'node:test';
import assert from 'node:assert/strict';
import Fl32_Web_Back_Handler_Static from '../../../../src/Back/Handler/Static.mjs';
import {Factory as Fl32_Web_Back_Dto_Info_Factory} from '../../../../src/Back/Dto/Info.mjs';
import Fl32_Web_Back_Helper_Cast from '../../../../src/Back/Helper/Cast.mjs';
import Fl32_Web_Back_Enum_Stage from '../../../../src/Back/Enum/Stage.mjs';

describe('Fl32_Web_Back_Handler_Static', () => {
    const STAGE = new Fl32_Web_Back_Enum_Stage();
    const dtoInfoFactory = new Fl32_Web_Back_Dto_Info_Factory({cast: new Fl32_Web_Back_Helper_Cast(), STAGE});
    let registry;
    let fileService;
    let respond;
    let handler;

    beforeEach(() => {
        registry = {
            addConfigs: () => {},
            find: () => null,
        };
        fileService = {
            serve: async () => false,
        };
        respond = {
            isWritable: () => true,
        };
        handler = new Fl32_Web_Back_Handler_Static({
            registry,
            fileService,
            respond,
            logger: {warn: () => {}},
            dtoInfoFactory,
            STAGE,
        });
    });

    test('uses PROCESS stage registration info', () => {
        const info = handler.getRegistrationInfo();
        assert.strictEqual(info.stage, STAGE.PROCESS);
        assert.strictEqual(typeof info.name, 'string');
    });

    test('marks request completed when file is served', async () => {
        registry.find = () => ({config: {}, rel: 'file.txt'});
        fileService.serve = async () => true;
        const context = {
            request: {url: '/file.txt'},
            response: {},
            completed: false,
            complete() {
                this.completed = true;
            },
        };

        await handler.handle(context);

        assert.strictEqual(context.completed, true);
    });

    test('does nothing when no source matches request', async () => {
        const context = {
            request: {url: '/missing'},
            response: {},
            completed: false,
            complete() {
                this.completed = true;
            },
        };

        await handler.handle(context);

        assert.strictEqual(context.completed, false);
    });
});
