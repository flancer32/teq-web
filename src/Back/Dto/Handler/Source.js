/**
 * Factory for file source configuration DTO used by Static handler.
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
         * Create validated DTO for source configuration.
         *
         * @param {*} [data]
         * @returns {Dto}
         */
        this.create = function (data) {
            const res = new Dto();
            if (data) {
                res.root = cast.string(data.root);
                res.prefix = cast.string(data.prefix);
                res.allow = cast.stringArrayMap(data.allow);
                res.defaults = cast.array(data.defaults, cast.string);
            }
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
    /** @type {string[]} */
    defaults = [];
}
