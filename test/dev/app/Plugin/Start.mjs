export const __deps__ = {
    path: 'node_path',
    url: 'node_url',
    dispatcher: 'Fl32_Web_Back_Dispatcher$',
    hndlRequestLog: 'Fl32_Web_Back_Handler_Pre_Log$',
    hndlStatic: 'Fl32_Web_Back_Handler_Static$',
    dtoCfg: 'Fl32_Web_Back_Dto_Handler_Source$',
};

export default class App_Plugin_Start {
    /**
     * @param {typeof import('node:path')} path
     * @param {typeof import('node:url')} url
     * @param {Fl32_Web_Back_Dispatcher} dispatcher
     * @param {Fl32_Web_Back_Handler_Pre_Log} hndlRequestLog
     * @param {Fl32_Web_Back_Handler_Static} hndlStatic
     * @param {Fl32_Web_Back_Dto_Handler_Source} dtoCfg
     */
    constructor(
        {
            path,
            url,
            dispatcher,
            hndlRequestLog,
            hndlStatic,
            dtoCfg,
        }
    ) {
        // VARS
        const {dirname, join} = path;
        const {fileURLToPath} = url;

        // MAIN
        /* Resolve a path to the root folder. */
        const metaUrl = new URL(import.meta.url);
        const script = fileURLToPath(metaUrl);
        const cur = dirname(script);
        const root = join(cur, '..', '..');
        const webRoot = join(root, 'web');

        return async function () {
            const srcNpm = dtoCfg.create({root: 'node_modules', prefix: '/npm/', allow: {'@teqfw/di': ['src/Container.mjs']}});
            const srcWeb = dtoCfg.create({root: webRoot, prefix: '/'});
            await hndlStatic.init({sources: [srcNpm, srcWeb]});
            dispatcher.addHandler(hndlRequestLog);
            dispatcher.addHandler(hndlStatic);
        };
    }
}
