export default class Fl32_Web_Back_Handler_Static_A_Registry {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {Fl32_Web_Back_Handler_Static_A_Config} configFactory
     */
    constructor(
        {
            Fl32_Web_Back_Handler_Static_A_Config$: configFactory,
        }
    ) {
        /* eslint-enable jsdoc/check-param-names */
        this._factory = configFactory;
        /** @type {ReturnType<Fl32_Web_Back_Handler_Static_A_Config['create']>[]} */
        let _configs = [];

        /**
         * Store configuration list sorted by prefix length.
         *
         * @param {Fl32_Web_Back_Dto_Handler_Source.Dto[]} dtoList
         */
        this.setConfigs = function (dtoList = []) {
            _configs = dtoList
                .map(dto => this._factory.create(dto))
                .sort((a, b) => b.prefix.length - a.prefix.length);
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
