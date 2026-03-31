/**
 * DTO describing handler registration and ordering metadata.
 */
// @ts-check
export default class Fl32_Web_Back_Dto_Info {
    /**
     * Handlers to run before this one.
     * @type {string[]}
     */
    after = [];

    /**
     * Handlers to run after this one.
     * @type {string[]}
     */
    before = [];

    /**
     * Unique handler name for ordering.
     * @type {string|undefined}
     */
    name;

    /**
     * Execution stage: `INIT`, `PROCESS`, or `FINALIZE`.
     * @type {string|undefined}
     * @see Fl32_Web_Back_Enum_Stage
     */
    stage;
}

export class Factory {
    /**
     * @param {object} deps
     * @param {Fl32_Web_Back_Helper_Cast} deps.cast
     * @param {Fl32_Web_Back_Enum_Stage} deps.STAGE
     */
    constructor({cast, STAGE}) {

        /**
         * @param {*} [data]
         * @returns {Fl32_Web_Back_Dto_Info}
         */
        this.create = function (data) {
            const res = new Fl32_Web_Back_Dto_Info();
            res.after = cast.array(data?.after, cast.string);
            res.before = cast.array(data?.before, cast.string);
            res.name = cast.string(data?.name);
            res.stage = cast.enum(data?.stage, STAGE, {upper: true});
            return Object.freeze(res);
        };
    }
}

/**
 * DTO dependencies.
 */
export const __deps__ = Object.freeze({
    default: {},
    Factory: {
        cast: 'Fl32_Web_Back_Helper_Cast$',
        STAGE: 'Fl32_Web_Back_Enum_Stage$',
    },
});
