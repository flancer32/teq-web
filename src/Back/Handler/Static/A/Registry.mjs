/**
 * Static configuration registry.
 */
// @ts-check
export default class Fl32_Web_Back_Handler_Static_A_Registry {
    /**
     * @param {object} deps
     * @param {Fl32_Web_Back_Handler_Static_A_Config} deps.configFactory
     * @param {Fl32_Web_Back_Logger} deps.logger
     */
    constructor({configFactory, logger}) {
        /** @type {Fl32_Web_Back_Dto_Source[]} */
        let _configs = [];

        /**
         * Add configurations ensuring unique prefixes.
         * Existing entries are not modified.
         *
         * @param {Fl32_Web_Back_Dto_Source[]} dtoList
         */
        this.addConfigs = function (dtoList = []) {
            const list = dtoList.map(dto => configFactory.create(dto));
            for (const cfg of list) {
                if (!_configs.some(c => c.prefix === cfg.prefix)) {
                    _configs.push(cfg);
                } else {
                    logger.warn(`Static config with prefix ${cfg.prefix} already exists`);
                }
            }
            _configs.sort((a, b) => b.prefix.length - a.prefix.length);
        };

        /**
         * Find configuration by matching URL prefix.
         *
         * @param {string} url
         * @returns {Fl32_Web_Back_Handler_Static_A_Match|null}
         */
        this.find = function (url) {
            for (const cfg of _configs) {
                if (url.startsWith(cfg.prefix)) {
                    const rel = url.slice(cfg.prefix.length);
                    return {config: cfg, rel};
                }
            }
            return null;
        };
    }
}

/**
 * Dependencies for the static registry helper.
 */
export const __deps__ = Object.freeze({
    default: {
        configFactory: 'Fl32_Web_Back_Handler_Static_A_Config$',
        logger: 'Fl32_Web_Back_Logger$',
    },
});
