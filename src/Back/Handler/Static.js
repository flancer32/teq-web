/**
 * Universal file handler serving files from multiple sources using helper modules.
 *
 * @implements Fl32_Web_Back_Api_Handler
 */
export default class Fl32_Web_Back_Handler_Static {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {Fl32_Web_Back_Handler_Static_A_Registry} registry
     * @param {Fl32_Web_Back_Handler_Static_A_FileService} fileService
     * @param {Fl32_Web_Back_Helper_Respond} respond
     * @param {Fl32_Web_Back_Logger} logger
     * @param {Fl32_Web_Back_Dto_Handler_Info} dtoInfo
     * @param {typeof Fl32_Web_Back_Enum_Stage} STAGE
     */
    constructor(
        {
            Fl32_Web_Back_Handler_Static_A_Registry$: registry,
            Fl32_Web_Back_Handler_Static_A_FileService$: fileService,
            Fl32_Web_Back_Helper_Respond$: respond,
            Fl32_Web_Back_Logger$: logger,
            Fl32_Web_Back_Dto_Handler_Info$: dtoInfo,
            Fl32_Web_Back_Enum_Stage$: STAGE,
        }
    ) {
        /* eslint-enable jsdoc/check-param-names */

        const _info = dtoInfo.create();
        _info.name = this.constructor.name;
        _info.stage = STAGE.PROCESS;
        Object.freeze(_info);

        /**
         * Initialize registry with provided sources.
         *
         * @param {{sources: Fl32_Web_Back_Dto_Handler_Source.Dto[]}} params
         * @returns {Promise<void>}
         */
        this.init = async ({sources = []} = {}) => {
            registry.setConfigs(sources);
        };

        /**
         * Attempt to handle incoming request.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @returns {Promise<boolean>} True if file served
         */
        this.handle = async (req, res) => {
            if (!respond.isWritable(res)) return false;
            const urlPath = decodeURIComponent(req.url.split('?')[0]);
            const match = registry.find(urlPath);
            if (!match) return false;
            return fileService.serve(match.config, match.rel, req, res);
        };

        /**
         * @returns {Fl32_Web_Back_Dto_Handler_Info.Dto}
         */
        this.getRegistrationInfo = () => _info;
    }
}
