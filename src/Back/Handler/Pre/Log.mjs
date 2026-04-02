/**
 * Logs basic request information at the beginning of the request lifecycle.
 *
 * @implements Fl32_Web_Back_Api_Handler
 */
// @ts-check
export default class Fl32_Web_Back_Handler_Pre_Log {
    /**
     * @param {object} deps
     * @param {Fl32_Web_Back_Logger} deps.logger
     * @param {Fl32_Web_Back_Dto_Info__Factory} deps.dtoInfoFactory
     * @param {Fl32_Web_Back_Enum_Stage} deps.STAGE
     */
    constructor({logger, dtoInfoFactory, STAGE}) {
        // VARS
        const _info = dtoInfoFactory.create({
            name: this.constructor.name,
            stage: STAGE.INIT,
        });

        // MAIN

        /**
         * Log request method and URL.
         *
         * @param {Fl32_Web_Back_Dto_RequestContext} context
         * @returns {Promise<void>}
         */
        this.handle = async function (context) {
            logger.debug(`${context.request.method} ${context.request.url}`);
        };

        /**
         * Return handler registration info.
         *
         * @returns {Fl32_Web_Back_Dto_Info}
         */
        this.getRegistrationInfo = () => _info;
    }
}

/**
 * Dependencies for the log handler.
 */
export const __deps__ = Object.freeze({
    default: {
        logger: 'Fl32_Web_Back_Logger$',
        dtoInfoFactory: 'Fl32_Web_Back_Dto_Info__Factory$',
        STAGE: 'Fl32_Web_Back_Enum_Stage$',
    },
});
