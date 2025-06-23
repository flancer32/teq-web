export default class App_Plugin_Start {
    /**
     * @param {typeof import('node:path')} path
     * @param {typeof import('node:url')} url
     * @param {Fl32_Web_Back_Dispatcher} dispatcher
     * @param {Fl32_Web_Back_Handler_Pre_Log} hndlRequestLog
     * @param {Fl32_Web_Back_Handler_Source} hndlSource
     * @param {Fl32_Web_Back_Handler_Static} hndlStatic
     */
    constructor(
        {
            'node:path': path,
            'node:url': url,
            Fl32_Web_Back_Dispatcher$: dispatcher,
            Fl32_Web_Back_Handler_Pre_Log$: hndlRequestLog,
            Fl32_Web_Back_Handler_Source$: hndlSource,
            Fl32_Web_Back_Handler_Static$: hndlStatic,
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
            // Set up handlers
            await hndlSource.init({root: 'node_modules', prefix: '/npm/', allow: {'@teqfw/di': ['src/Container.js']}});
            await hndlStatic.init({rootPath: webRoot});
            // Register handlers
            dispatcher.addHandler(hndlRequestLog);
            dispatcher.addHandler(hndlSource);
            dispatcher.addHandler(hndlStatic);
        };
    }
}