/* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
/**
 * TODO: add JSDoc annotations
 */
export default class Fl32_Web_Back_Server_Config {
    /**
     * @param {Fl32_Web_Back_Defaults} DEF
     * @param {Fl32_Web_Back_Helper_Cast} cast
     * @param {typeof Fl32_Web_Back_Enum_Server_Type} SERVER_TYPE
     */
    constructor(
        {
            Fl32_Web_Back_Defaults$: DEF,
            Fl32_Web_Back_Helper_Cast$: cast,
            Fl32_Web_Back_Enum_Server_Type$: SERVER_TYPE,
        }
    ) {
        // INSTANCE METHODS
        /**
         * Creates a new DTO instance with properly casted attributes.
         * Ensures valid values for enums and numerical fields.
         *
         * @param {Fl32_Web_Back_Server_Config.Dto|object} [data] - Raw input data for the DTO.
         * @returns {Dto} - A properly structured DTO instance.
         */
        this.create = function (data) {
            const res = Object.assign(new Dto(), data);
            if (data) {
                res.port = cast.int(data.port);
                res.type = cast.enum(data.type, SERVER_TYPE, {lower: true});
            }
            return res;
        };
    }
}

/**
 * @memberOf Fl32_Web_Back_Server_Config
 */
class Dto {
    /**
     * Port to listening (3000).
     *
     * @type {number}
     */
    port;
    /**
     * @type {string}
     * @see Fl32_Web_Back_Enum_Server_Type
     */
    type;
}