# Minimal Server Example

This example shows the preferred TeqFW-style usage path: external code resolves one application service from the container, and that service receives web infrastructure through constructor injection.

```js
// src/Handler/Hello.mjs
// @ts-check

/**
 * @namespace App_Web_Handler_Hello
 * @description Example PROCESS handler
 */

export default class Hello {
    /**
     * @param {object} deps
     * @param {Fl32_Web_Back_Dto_Info$Factory} deps.dtoInfoFactory
     * @param {Fl32_Web_Back_Enum_Stage} deps.STAGE
     */
    constructor({dtoInfoFactory, STAGE}) {
        const info = dtoInfoFactory.create({
            name: 'App_Web_Handler_Hello',
            stage: STAGE.PROCESS,
        });

        this.getRegistrationInfo = () => info;

        this.handle = async function (context) {
            const {response} = context;
            response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            response.end('ok');
            context.complete();
        };
    }
}

export const __deps__ = Object.freeze({
    dtoInfoFactory: 'Fl32_Web_Back_Dto_Info__Factory$',
    STAGE: 'Fl32_Web_Back_Enum_Stage$',
});
```

```js
// src/Server/Start.mjs
// @ts-check

/**
 * @namespace App_Web_Server_Start
 * @description Example application entry service
 */

export default class Start {
    /**
     * @param {object} deps
     * @param {Fl32_Web_Back_PipelineEngine} deps.pipeline
     * @param {Fl32_Web_Back_Server} deps.server
     * @param {App_Web_Handler_Hello} deps.helloHandler
     */
    constructor({pipeline, server, helloHandler}) {
        this.execute = async function () {
            pipeline.addHandler(helloHandler);
            await server.start({port: 3000, type: 'http'});
        };
    }
}

export const __deps__ = Object.freeze({
    pipeline: 'Fl32_Web_Back_PipelineEngine$',
    server: 'Fl32_Web_Back_Server$',
    helloHandler: 'App_Web_Handler_Hello$',
});
```

```js
// composition root
const app = await container.get('App_Web_Server_Start$');
await app.execute();
```

Consumer notes:

- The composition root configures namespace roots once and resolves one application entry service.
- Application modules do not construct collaborators directly and do not call `new` for DI-managed handlers or infrastructure services.
- `server.start()` locks handler registration for the runtime lifetime of that server instance.
- Built-in server defaults may also be supplied through `Fl32_Web_Back_Config_Runtime__Factory$` as `{port, type, tls}`, where `tls` is owned by the runtime component `Fl32_Web_Back_Config_Runtime_Tls$`.
- If your application already has its own transport layer, inject `Fl32_Web_Back_PipelineEngine$` and call `pipeline.onEventRequest(req, res)` from that adapter instead of using `Fl32_Web_Back_Server$`.
- A correct PROCESS handler ends the response and then marks the context completed.
