// @ts-check

/**
 * Universal static-file PROCESS handler.
 *
 * @implements Fl32_Web_Back_Api_Handler
 */
export const __deps__ = Object.freeze({
    registry: 'Fl32_Web_Back_Handler_Static_A_Registry$',
    fileService: 'Fl32_Web_Back_Handler_Static_A_FileService$',
    respond: 'Fl32_Web_Back_Helper_Respond$',
    logger: 'Fl32_Web_Back_Logger$',
    dtoInfoFactory: 'Fl32_Web_Back_Dto_Info__Factory$',
    STAGE: 'Fl32_Web_Back_Enum_Stage$',
});

/**
 * @typedef {object} Fl32_Web_Back_Handler_StaticConstructorParams
 * @property {Fl32_Web_Back_Handler_Static_A_Registry} registry
 * @property {Fl32_Web_Back_Handler_Static_A_FileService} fileService
 * @property {Fl32_Web_Back_Helper_Respond} respond
 * @property {Fl32_Web_Back_Logger} logger
 * @property {Fl32_Web_Back_Dto_Info$Factory} dtoInfoFactory
 * @property {Fl32_Web_Back_Enum_Stage} STAGE
 */

export default class Fl32_Web_Back_Handler_Static {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {Fl32_Web_Back_Handler_StaticConstructorParams} params
     */
    constructor(
        {
            registry,
            fileService,
            respond,
            logger,
            dtoInfoFactory,
            STAGE,
        }
    ) {
        /* eslint-enable jsdoc/check-param-names */

        const _info = dtoInfoFactory.create({
            name: this.constructor.name,
            stage: STAGE.PROCESS,
        });

        /**
         * Initialize registry with provided sources.
         *
         * @param {{sources: Fl32_Web_Back_Dto_Source[]}} params
         * @returns {Promise<void>}
         */
        this.init = async ({sources = []} = {}) => {
            registry.addConfigs(sources);
        };

        /**
         * Attempt to handle incoming request.
         *
         * @param {Fl32_Web_Back_PipelineEngine_RequestContext} context
         * @returns {Promise<void>}
         */
        this.handle = async (context) => {
            const req = context.request;
            const res = context.response;
            if (!respond.isWritable(res)) return;
            const urlPath = decodeURIComponent(req.url.split('?')[0]);
            const match = registry.find(urlPath);
            if (!match) return;
            const served = await fileService.serve(match.config, match.rel, req, res);
            if (served) {
                context.complete();
            }
        };

        /**
         * @returns {Fl32_Web_Back_Dto_Info}
         */
        this.getRegistrationInfo = () => _info;
    }
}
