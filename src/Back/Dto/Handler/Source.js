/**
 * Factory for Source handler configuration DTO.
 */
export default class Fl32_Web_Back_Dto_Handler_Source {
    /* eslint-disable jsdoc/require-param-description */
    /**
     * @param {Fl32_Web_Back_Helper_Cast} cast
     */
    constructor(
        {
            Fl32_Web_Back_Helper_Cast$: cast,
        }
    ) {
        /* eslint-enable jsdoc/require-param-description */
        /**
         * Create validated DTO for Source handler configuration.
         *
         * @param {*} data
         * @returns {Dto}
         */
        this.create = function (data) {
            if (!data || typeof data !== 'object' || Array.isArray(data)) {
                throw new Error('Configuration object is required');
            }
            if (typeof data.root !== 'string' || !data.root) {
                throw new Error('Invalid value for root');
            }
            if (typeof data.prefix !== 'string' || !data.prefix) {
                throw new Error('Invalid value for prefix');
            }
            const res = new Dto();
            res.root = cast.string(data.root);
            res.prefix = cast.string(data.prefix);
            res.allow = cast.stringArrayMap(data.allow);
            return res;
        };
    }
}

/**
 * @memberOf Fl32_Web_Back_Dto_Handler_Source
 */
class Dto {
    /** @type {string} */
    root;
    /** @type {string} */
    prefix;
    /** @type {{[key: string]: string[]}} */
    allow = {};
}
