// @ts-check

/**
 * @namespace Fl32_Web_Back_Server
 * @description Web server implementation supporting HTTP/1 and HTTP/2 protocols.
 * Handles incoming requests and delegates them to the Pipeline Engine.
 */
export default class Server {
    /**
     * @param {object} deps
     * @param {Fl32_Web_Node_Http} deps.http
     * @param {Fl32_Web_Node_Http2} deps.http2
     * @param {Fl32_Web_Back_Config_Runtime$} deps.config
     * @param {TeqFw_Log_Provider$} deps.logger
     * @param {Fl32_Web_Back_PipelineEngine$} deps.pipelineEngine
     * @param {Fl32_Web_Back_Enum_Server_Type$} deps.SERVER_TYPE
     */
    constructor({http, http2, config, logger, pipelineEngine, SERVER_TYPE}) {
        // VARS
        const { createServer } = http;
        const { createServer: createServerH2, createSecureServer } = http2;
        const log = logger.forSource('Fl32_Web_Back_Server');
        /** @type {Fl32_Web_Node_Http_Server} */
        let _instance;

        // MAIN
        /**
         * @returns {Fl32_Web_Node_Http_Server}
         */
        this.getInstance = () => _instance;

        /**
         * Starts the server with optional configuration.
         * @param {Fl32_Web_Back_Config_Runtime$} cfg
         * @returns {Promise<void>}
         */
        this.start = async function (cfg) {
            pipelineEngine.lockHandlers();
            // create server
            const host = cfg?.host ?? config.host;
            const port = cfg?.port ?? config.port;
            const type = cfg?.type ?? config.type;
            const tls = cfg?.tls ?? config.tls;
            const endpoint = host === undefined ? `port ${port}` : `host ${host} and port ${port}`;

            if (type === SERVER_TYPE.HTTP2) {
                _instance = createServerH2();
                log.info(`Starting server in HTTP/2 mode on ${endpoint}...`);
            } else if (type === SERVER_TYPE.HTTP) {
                _instance = createServer({});
                log.info(`Starting server in HTTP/1 mode on ${endpoint}...`);
            } else if (type === SERVER_TYPE.HTTPS) {
                if (!tls?.key || !tls?.cert) {
                    log.error('HTTPS server requires TLS key and certificate');
                    throw new Error('TLS key and certificate are required for HTTPS server');
                }
                _instance = createSecureServer(tls);
                log.info(`Starting server in HTTPS (HTTP/2 + TLS) mode on ${endpoint}...`);
            } else {
                log.error(`Unsupported server type: ${type}`);
                throw new Error(`Server type '${type}' is not supported`);
            }

            _instance.on('request', pipelineEngine.handleRequest);
            if (host === undefined) _instance.listen(port);
            else _instance.listen(port, host);
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
                log.info('Server stopped');
                _instance = undefined;
            } else {
                log.warn('Server is not running');
            }
        };
    }
}

/**
 * Dependencies for the web server.
 */
export const __deps__ = Object.freeze({
    default: {
        http: 'node:http',
        http2: 'node:http2',
        config: 'Fl32_Web_Back_Config_Runtime$',
        logger: 'TeqFw_Log_Provider$',
        pipelineEngine: 'Fl32_Web_Back_PipelineEngine$',
        SERVER_TYPE: 'Fl32_Web_Back_Enum_Server_Type$',
    },
});
