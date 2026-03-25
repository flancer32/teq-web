// @ts-check

/**
 * Web server implementation supporting HTTP/1 and HTTP/2 protocols.
 * Handles incoming requests and delegates them to the Pipeline Engine.
 */
export const __deps__ = Object.freeze({
    http: 'node:http',
    http2: 'node:http2',
    config: 'Fl32_Web_Back_Config_Runtime$',
    logger: 'Fl32_Web_Back_Logger$',
    pipelineEngine: 'Fl32_Web_Back_PipelineEngine$',
    SERVER_TYPE: 'Fl32_Web_Back_Enum_Server_Type$',
});

export default class Fl32_Web_Back_Server {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {object} deps
     * @param {Fl32_Web_Node_Http} deps.http
     * @param {Fl32_Web_Node_Http2} deps.http2
     * @param {Fl32_Web_Back_Config_Runtime} deps.config
     * @param {Fl32_Web_Back_Logger} deps.logger
     * @param {Fl32_Web_Back_PipelineEngine} deps.pipelineEngine
     * @param {Fl32_Web_Back_Enum_Server_Type} deps.SERVER_TYPE
     */
    constructor(
        {
            http,
            http2,
            config,
            logger,
            pipelineEngine,
            SERVER_TYPE,
        }
    ) {
        /* eslint-enable jsdoc/require-param-description,jsdoc/check-param-names */
        // VARS
        const { createServer } = http;
        const { createServer: createServerH2, createSecureServer } = http2;
        /** @type {Fl32_Web_Node_Http_Server} */
        let _instance;

        // MAIN
        /**
         * @returns {Fl32_Web_Node_Http_Server}
         */
        this.getInstance = () => _instance;

        /**
         * Starts the server with optional configuration.
         * @param {Fl32_Web_Back_Config_Runtime} [cfg]
         * @returns {Promise<void>}
         */
        this.start = async function (cfg) {
            pipelineEngine.lockHandlers();
            // create server
            const port = cfg?.port ?? config.port;
            const type = cfg?.type ?? config.type;
            const tls = cfg?.tls ?? config.tls;

            if (type === SERVER_TYPE.HTTP2) {
                _instance = createServerH2();
                logger.info(`Starting server in HTTP/2 mode on port ${port}...`);
            } else if (type === SERVER_TYPE.HTTP) {
                _instance = createServer({});
                logger.info(`Starting server in HTTP/1 mode on port ${port}...`);
            } else if (type === SERVER_TYPE.HTTPS) {
                if (!tls?.key || !tls?.cert) {
                    logger.error('HTTPS server requires TLS key and certificate');
                    throw new Error('TLS key and certificate are required for HTTPS server');
                }
                _instance = createSecureServer(tls);
                logger.info(`Starting server in HTTPS (HTTP/2 + TLS) mode on port ${port}...`);
            } else {
                logger.error(`Unsupported server type: ${type}`);
                throw new Error(`Server type '${type}' is not supported`);
            }

            _instance.on('request', pipelineEngine.handleRequest);
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
