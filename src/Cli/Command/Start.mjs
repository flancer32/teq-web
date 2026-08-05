// @ts-check

/**
 * @namespace Fl32_Web_Cli_Command_Start
 * @description CLI command to start the web server as a long-running process.
 */
export default class Start {
    /**
     * @param {object} deps
     * @param {Fl32_Web_Back_Server$} deps.server
     * @param {Fl32_Web_Back_Config_Runtime__Factory$} deps.configFactory
     */
    constructor({server, configFactory}) {

        /**
         * @type {'long-running'}
         */
        this.lifetime = 'long-running';

        /**
         * @type {string}
         */
        this.id = 'fl32:web:start';

        /**
         * @type {string}
         */
        this.summary = 'Start the web server.';

        /**
         * Start the web server. Freezes runtime configuration, then binds and listens.
         * Returns a runtime handle for graceful shutdown via AbortSignal.
         *
         * @param {object} context
         * @param {AbortSignal} context.signal
         * @returns {Promise<{done: Promise<void>, stop: () => Promise<void>}>}
         */
        this.start = async function (context) {
            configFactory.freeze();
            await server.start();
            return {
                done: new Promise((resolve) => {
                    context.signal.addEventListener('abort', () => resolve(), {once: true});
                }),
                stop: async () => {
                    await server.stop();
                },
            };
        };
    }
}

/**
 * Dependencies for the CLI start command.
 */
export const __deps__ = Object.freeze({
    default: {
        server: 'Fl32_Web_Back_Server$',
        configFactory: 'Fl32_Web_Back_Config_Runtime__Factory$',
    },
});
