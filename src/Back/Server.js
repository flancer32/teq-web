/**
 * TODO: add JSDoc annotations
 */
export default class Fl32_Web_Back_Server {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {typeof import('node:http')} http
     * @param {typeof import('node:http2')} http2
     * @param {typeof import('node:https')} https
     * @param {Fl32_Web_Back_Defaults} DEF
     * @param {Fl32_Web_Back_Logger} logger
     * @param {Fl32_Web_Back_Dispatcher} dispatcher
     * @param {typeof Fl32_Web_Back_Enum_Server_Type} SERVER_TYPE
     */
    constructor(
        {
            'node:http': http,
            'node:http2': http2,
            'node:https': https,
            Fl32_Web_Back_Defaults$: DEF,
            Fl32_Web_Back_Logger$: logger,
            Fl32_Web_Back_Dispatcher$: dispatcher,
            Fl32_Web_Back_Enum_Server_Type$: SERVER_TYPE,
        }
    ) {
        /* eslint-enable jsdoc/require-param-description,jsdoc/check-param-names */
        // VARS
        const {createServer} = http;
        const {createServer: createServerH2} = http2;
        /** @type {module:http.Server} */
        let _instance;

        // MAIN
        /**
         * @returns {module:http.Server}
         */
        this.getInstance = () => _instance;

        /**
         * @param {Fl32_Web_Back_Server_Config.Dto} [cfg]
         * @returns {Promise<void>}
         */
        this.start = async function (cfg) {
            // order handlers in the dispatcher
            dispatcher.orderHandlers();
            // create server
            const port = cfg?.port ?? DEF.PORT;
            const type = cfg?.type ?? SERVER_TYPE.HTTP;
            _instance = createServer({});
            _instance.on('request', dispatcher.onEventRequest);
            _instance.listen(port);
            logger.info(`The server is listening on port ${port}...`);
        };

        this.stop = async function () {
            console.log(`The server is stopping...`);
        };
    }
}
