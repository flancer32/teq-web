export default class Fl32_Web_Back_Handler_Static_A_Registry {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {Fl32_Web_Back_Handler_Static_A_Config} configFactory
     * @param {Fl32_Web_Back_Logger} logger
     */
    constructor(
        {
            Fl32_Web_Back_Handler_Static_A_Config$: configFactory,
            Fl32_Web_Back_Logger$: logger,
        }
    ) {
        /* eslint-enable jsdoc/check-param-names */
        /** @type {Fl32_Web_Back_Dto_Handler_Source.Dto[]} */
        let _configs = [];

        /**
         * Add configurations ensuring unique prefixes.
         * Existing entries are not modified.
         *
         * @param {Fl32_Web_Back_Dto_Handler_Source.Dto[]} dtoList
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
         * @returns {{config: *, rel: string}|null}
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
