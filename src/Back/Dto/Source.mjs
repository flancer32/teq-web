// @ts-check

export const __deps__ = Object.freeze({
    cast: 'Fl32_Web_Back_Helper_Cast$',
});

export default class Fl32_Web_Back_Dto_Source {
    /** @type {string} */
    root;
    /** @type {string} */
    prefix;
    /** @type {{[key: string]: string[]}} */
    allow = {};
    /** @type {string[]} */
    defaults = [];
}

export class Factory {
    /* eslint-disable jsdoc/require-param-description */
    /**
     * @param {object} params
     * @param {Fl32_Web_Back_Helper_Cast} params.cast
     */
    constructor(
        {
            cast,
        }
    ) {
        /* eslint-enable jsdoc/require-param-description */
        /**
         * @param {*} [data]
         * @returns {Fl32_Web_Back_Dto_Source}
         */
        this.create = function (data) {
            const res = new Fl32_Web_Back_Dto_Source();
            if (data) {
                res.root = cast.string(data.root);
                res.prefix = cast.string(data.prefix);
                res.allow = cast.stringArrayMap(data.allow);
                res.defaults = cast.array(data.defaults, cast.string);
            }
            return Object.freeze(res);
        };
    }
}
