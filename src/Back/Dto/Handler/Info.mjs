// @ts-check

/**
 * Factory for handler registration metadata.
 */
export const __deps__ = Object.freeze({
    cast: 'Fl32_Web_Back_Helper_Cast$',
    STAGE: 'Fl32_Web_Back_Enum_Stage$',
});

/**
 * @typedef {object} Fl32_Web_Back_Dto_Handler_InfoConstructorParams
 * @property {Fl32_Web_Back_Helper_Cast} cast
 * @property {Fl32_Web_Back_Enum_Stage} STAGE
 */

export default class Fl32_Web_Back_Dto_Handler_Info {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {Fl32_Web_Back_Dto_Handler_InfoConstructorParams} params
     */
    constructor(
        {
            cast,
            STAGE,
        }
    ) {
        /* eslint-enable jsdoc/check-param-names */
        /**
         * Create a validated DTO for handler registration.
         *
         * @param {*} [data] - Optional raw object.
         * @returns {Dto}
         */
        this.create = function (data) {
            const res = (data && typeof data === 'object' && !Array.isArray(data))
                ? Object.assign(new Dto(), data)
                : new Dto();
            res.after = cast.array(data?.after, cast.string);
            res.before = cast.array(data?.before, cast.string);
            res.name = cast.string(data?.name);
            res.stage = cast.enum(data?.stage, STAGE, {upper: true});
            return res;
        };
    }
}

export class Dto {
    /**
     * Handlers to run before this one.
     * @type {string[]}
     */
    after;

    /**
     * Handlers to run after this one.
     * @type {string[]}
     */
    before;

    /**
     * Unique handler name for ordering.
     * @type {string}
     */
    name;

    /**
     * Execution stage: `INIT`, `PROCESS`, or `FINALIZE`.
     * @type {string}
     * @see Fl32_Web_Back_Enum_Stage
     */
    stage;
}
