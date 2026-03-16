// @ts-check

/**
 * Logs basic request information at the beginning of the request lifecycle.
 *
 * @implements Fl32_Web_Back_Api_Handler
 */
export const __deps__ = Object.freeze({
    logger: 'Fl32_Web_Back_Logger$',
    dtoInfoFactory: 'Fl32_Web_Back_Dto_Info__Factory$',
    STAGE: 'Fl32_Web_Back_Enum_Stage$',
});

export default class Fl32_Web_Back_Handler_Pre_Log {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {object} params
     * @param {Fl32_Web_Back_Logger} params.logger
     * @param {Fl32_Web_Back_Dto_Info$Factory} params.dtoInfoFactory
     * @param {Fl32_Web_Back_Enum_Stage} params.STAGE
     */
    constructor(
        {
            logger,
            dtoInfoFactory,
            STAGE,
        }
    ) {
        /* eslint-enable jsdoc/check-param-names */
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
