// @ts-check

export const __deps__ = Object.freeze({
    path: 'node:path',
});

export default class Fl32_Web_Back_Handler_Static_A_Config {
    static DEFAULT_FILES = ['index.html', 'index.htm', 'index.txt'];
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {object} params
     * @param {Fl32_Web_Node_Path} params.path
     */
    constructor(
        {
            path,
        }
    ) {
        /* eslint-enable jsdoc/check-param-names */

        /**
         * Normalize DTO fields into configuration object.
         *
         * @param {Fl32_Web_Back_Dto_Source} dto
         * @returns {Fl32_Web_Back_Handler_Static_A_Config_Value}
         * @throws {Error} When required fields are missing or invalid.
         */
        this.create = (dto) => {
            if (!dto || typeof dto.root !== 'string') {
                throw new Error("Field 'root' must be a string");
            }
            let prefix = dto.prefix ?? '/';
            if (typeof prefix !== 'string') {
                throw new Error("Field 'prefix' must be a string");
            }
            if (!prefix.endsWith('/')) prefix += '/';

            const root = path.resolve(dto.root);

            let allow;
            if (dto.allow !== undefined) {
                if (typeof dto.allow !== 'object' || dto.allow === null || Array.isArray(dto.allow)) {
                    throw new Error("Field 'allow' must be an object");
                }
                for (const [k, arr] of Object.entries(dto.allow)) {
                    if (!Array.isArray(arr) || arr.some(v => typeof v !== 'string')) {
                        throw new Error(`Field 'allow.${k}' must be an array of strings`);
                    }
                }
                allow = dto.allow;
            }

            let defaults = dto.defaults;
            if (defaults !== undefined && defaults.length) {
                if (!Array.isArray(defaults) || defaults.some(v => typeof v !== 'string')) {
                    throw new Error("Field 'defaults' must be an array of strings");
                }
            } else {
                defaults = Fl32_Web_Back_Handler_Static_A_Config.DEFAULT_FILES;
            }

            return {root, prefix, allow, defaults};
        };
    }
}
