/**
 * Universal static-file PROCESS handler.
 *
 * @implements Fl32_Web_Back_Api_Handler
 */
// @ts-check
export default class Fl32_Web_Back_Handler_Static {
    /**
     * @param {object} deps
     * @param {Fl32_Web_Back_Handler_Static_A_Registry} deps.registry
     * @param {Fl32_Web_Back_Handler_Static_A_FileService} deps.fileService
     * @param {Fl32_Web_Back_Helper_Respond} deps.respond
     * @param {Fl32_Web_Back_Logger} deps.logger
     * @param {Fl32_Web_Back_Dto_Info__Factory} deps.dtoInfoFactory
     * @param {Fl32_Web_Back_Enum_Stage} deps.STAGE
     */
    constructor({registry, fileService, respond, logger, dtoInfoFactory, STAGE}) {

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
         * @param {Fl32_Web_Back_Dto_RequestContext} context
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

/**
 * Dependencies for the static handler.
 */
export const __deps__ = Object.freeze({
    default: {
        registry: 'Fl32_Web_Back_Handler_Static_A_Registry$',
        fileService: 'Fl32_Web_Back_Handler_Static_A_FileService$',
        respond: 'Fl32_Web_Back_Helper_Respond$',
        logger: 'Fl32_Web_Back_Logger$',
        dtoInfoFactory: 'Fl32_Web_Back_Dto_Info__Factory$',
        STAGE: 'Fl32_Web_Back_Enum_Stage$',
    },
});
