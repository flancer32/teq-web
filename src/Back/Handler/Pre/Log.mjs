// @ts-check

/**
 * @namespace Fl32_Web_Back_Handler_Pre_Log
 * @description Logs basic request information at the beginning of the request lifecycle.
 * @implements {Fl32_Web_Back_Api_Handler$}
 */
export default class Log {
    /**
     * @param {object} deps
     * @param {TeqFw_Log_Provider$} deps.logger
     * @param {Fl32_Web_Back_Dto_Info__Factory$} deps.dtoInfoFactory
     * @param {Fl32_Web_Back_Enum_Stage$} deps.STAGE
     */
    constructor({logger, dtoInfoFactory, STAGE}) {
        const log = logger.forSource('Fl32_Web_Back_Handler_Pre_Log');
        // VARS
        const _info = dtoInfoFactory.create({
            name: 'Fl32_Web_Back_Handler_Pre_Log',
            stage: STAGE.INIT,
        });

        // MAIN

        /**
         * Log request method and URL.
         *
         * @param {Fl32_Web_Back_Dto_RequestContext$} context
         * @returns {Promise<void>}
         */
        this.handle = async function (context) {
            log.debug(`${context.request.method} ${context.request.url}`);
        };

        /**
         * Return handler registration info.
         *
         * @returns {Fl32_Web_Back_Dto_Info$}
         */
        this.getRegistrationInfo = () => _info;
    }
}

/**
 * Dependencies for the log handler.
 */
export const __deps__ = Object.freeze({
    default: {
        logger: 'TeqFw_Log_Provider$',
        dtoInfoFactory: 'Fl32_Web_Back_Dto_Info__Factory$',
        STAGE: 'Fl32_Web_Back_Enum_Stage$',
    },
});
