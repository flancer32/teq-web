# Agent Recipes

Use these patterns as canonical starting points for generated code.

## Custom PROCESS Handler

Prefer ordinary class methods and mark completion through `context.completed = true`.

```js
// @ts-check

export default class App_Web_Handler_Hello {
    /**
     * @param {object} deps
     * @param {Fl32_Web_Back_Dto_Info__Factory$} deps.dtoInfoFactory
     * @param {Fl32_Web_Back_Enum_Stage$} deps.STAGE
     */
    constructor({dtoInfoFactory, STAGE}) {
        this.info = dtoInfoFactory.create({
            name: 'App_Web_Handler_Hello',
            stage: STAGE.PROCESS,
        });
    }

    getRegistrationInfo() {
        return this.info;
    }

    async handle(context) {
        context.response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        context.response.end('ok');
        context.completed = true;
    }
}

export const __deps__ = Object.freeze({
    dtoInfoFactory: 'Fl32_Web_Back_Dto_Info__Factory$',
    STAGE: 'Fl32_Web_Back_Enum_Stage$',
});
```

## Static Handler With Explicit Allow

Prefer explicit `allow` rules. Omitting `allow` exposes any resolvable path under `root`; it does not enable directory listing.

```js
const source = dtoSourceFactory.create({
    root: './web',
    prefix: '/',
    allow: {
        '.': ['assets', 'favicon.ico', 'robots.txt'],
    },
    defaults: ['index.html'],
});

await staticHandler.init({sources: [source]});
pipeline.addHandler(staticHandler);
```

This configuration serves only:

- `./web/assets/**`
- `./web/favicon.ico`
- `./web/robots.txt`
- `./web/index.html` as directory fallback where applicable

## External Transport Adapter

Use this when another transport layer owns request ingress and only delegates request execution to the pipeline.

```js
await pipeline.lockHandlers();

transport.on('request', async (req, res) => {
    await pipeline.onEventRequest(req, res);
});
```

Rules:

- register all handlers before `lockHandlers()`;
- never add handlers after the pipeline is locked;
- call the pipeline only with writable native request/response objects from the transport.
