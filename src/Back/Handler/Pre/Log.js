/**
 * Logs basic request information at the beginning of the request lifecycle.
 * @implements Fl32_Web_Back_Api_Handler
 */
export default class Fl32_Web_Back_Handler_Pre_Log {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {Fl32_Web_Back_Logger} logger
     * @param {Fl32_Web_Back_Dto_Handler_Info} dtoInfo
     * @param {typeof Fl32_Web_Back_Enum_Stage} STAGE
     */
    constructor(
        {
            Fl32_Web_Back_Logger$: logger,
            Fl32_Web_Back_Dto_Handler_Info$: dtoInfo,
            Fl32_Web_Back_Enum_Stage$: STAGE,
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
