/**
 * Web server implementation supporting HTTP/1 and HTTP/2 protocols.
 * Handles incoming requests and delegates them to the dispatcher.
 *
 * @property {function(): module:http.Server} getInstance - Returns the server instance.
 * @property {function(Fl32_Web_Back_Server_Config.Dto): Promise<void>} start - Starts the server with given configuration.
 * @property {function(): Promise<void>} stop - Stops the server.
 */
export default class Fl32_Web_Back_Server {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {typeof import('node:http')} http
     * @param {typeof import('node:http2')} http2
     * @param {Fl32_Web_Back_Defaults} DEF
     * @param {Fl32_Web_Back_Logger} logger
     * @param {Fl32_Web_Back_Dispatcher} dispatcher
     * @param {typeof Fl32_Web_Back_Enum_Server_Type} SERVER_TYPE
     */
    constructor(
        {
            'node:http': http,
            'node:http2': http2,
            Fl32_Web_Back_Defaults$: DEF,
            Fl32_Web_Back_Logger$: logger,
            Fl32_Web_Back_Dispatcher$: dispatcher,
            Fl32_Web_Back_Enum_Server_Type$: SERVER_TYPE,
        }
    ) {
        /* eslint-enable jsdoc/require-param-description,jsdoc/check-param-names */
        // VARS
        const {createServer} = http;
        const {createServer: createServerH2, createSecureServer} = http2;
        /** @type {module:http.Server} */
        let _instance;

        // MAIN
        /**
         * @returns {module:http.Server}
         */
        this.getInstance = () => _instance;

        /**
         * Starts the server with optional configuration.
         * @param {Fl32_Web_Back_Server_Config.Dto} [cfg] - Server configuration
         * @returns {Promise<void>}
         */
        this.start = async function (cfg) {
            // order handlers in the dispatcher
            dispatcher.orderHandlers();
            // create server
            const port = cfg?.port ?? DEF.PORT;
            const type = cfg?.type ?? SERVER_TYPE.HTTP;

            if (type === SERVER_TYPE.HTTP2) {
                _instance = createServerH2();
                logger.info(`Starting server in HTTP/2 mode on port ${port}...`);
            } else if (type === SERVER_TYPE.HTTP) {
                _instance = createServer({});
                logger.info(`Starting server in HTTP/1 mode on port ${port}...`);
            } else if (type === SERVER_TYPE.HTTPS) {
                if (!cfg.tls?.key || !cfg.tls?.cert) {
                    logger.error('HTTPS server requires TLS key and certificate');
                    throw new Error('TLS key and certificate are required for HTTPS server');
                }
                _instance = createSecureServer(cfg.tls);
                logger.info(`Starting server in HTTPS (HTTP/2 + TLS) mode on port ${port}...`);
            } else {
                logger.error(`Unsupported server type: ${type}`);
                throw new Error(`Server type '${type}' is not supported`);
            }

            _instance.on('request', dispatcher.onEventRequest);
            _instance.listen(port);
        };

        /**
         * Stops the server.
         * @returns {Promise<void>}
         */
        this.stop = async function () {
            if (_instance) {
                await new Promise((resolve, reject) => {
                    _instance.close(err => err ? reject(err) : resolve());
                });
                logger.info('Server stopped');
                _instance = undefined;
            } else {
                logger.warn('Server is not running');
            }
        };
    }
}