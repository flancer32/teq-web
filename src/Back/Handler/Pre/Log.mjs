/**
 * Logs basic request information at the beginning of the request lifecycle.
 * @implements Fl32_Web_Back_Api_Handler
 */
export const __deps__ = {
    logger: 'Fl32_Web_Back_Logger$',
    dtoInfo: 'Fl32_Web_Back_Dto_Handler_Info$',
    STAGE: 'Fl32_Web_Back_Enum_Stage$',
};

/**
 * @typedef {object} Fl32_Web_Back_Handler_Pre_LogConstructorParams
 * @property {Fl32_Web_Back_Logger} logger
 * @property {Fl32_Web_Back_Dto_Handler_Info} dtoInfo
 * @property {Fl32_Web_Back_Enum_Stage} STAGE
 */

export default class Fl32_Web_Back_Handler_Pre_Log {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {Fl32_Web_Back_Handler_Pre_LogConstructorParams} params
     */
    constructor(
        {
            logger,
            dtoInfo,
            STAGE,
        }
    ) {
        /* eslint-enable jsdoc/check-param-names */
        // VARS
        const _info = dtoInfo.create();
        _info.name = this.constructor.name;
        _info.stage = STAGE.PRE;
        Object.freeze(_info);

        // MAIN

        /**
         * Log request method and URL.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
         * @returns {Promise<void>}
         */
        this.handle = async function (req) {
            logger.debug(`${req.method} ${req.url}`);
        };

        /**
         * Return handler registration info.
         *
         * @returns {Fl32_Web_Back_Dto_Handler_Info.Dto}
         */
        this.getRegistrationInfo = () => _info;
    }
}
