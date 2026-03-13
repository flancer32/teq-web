// @ts-check

export const __deps__ = Object.freeze({
    cast: 'Fl32_Web_Back_Helper_Cast$',
    SERVER_TYPE: 'Fl32_Web_Back_Enum_Server_Type$',
    tlsFactory: 'Fl32_Web_Back_Server_Config_Tls__Factory$',
});

/**
 * @typedef {object} Fl32_Web_Back_Server_ConfigFactoryParams
 * @property {Fl32_Web_Back_Helper_Cast} cast
 * @property {Fl32_Web_Back_Enum_Server_Type} SERVER_TYPE
 * @property {Fl32_Web_Back_Server_Config_Tls$Factory} tlsFactory
 */

export default class Fl32_Web_Back_Server_Config {
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
    /**
     * TLS configuration for HTTPS server.
     * @type {Fl32_Web_Back_Server_Config_Tls|undefined}
     */
    tls;
}

export class Factory {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {Fl32_Web_Back_Server_ConfigFactoryParams} params
     */
    constructor(
        {
            cast,
            SERVER_TYPE,
            tlsFactory,
        }
    ) {
        /* eslint-enable jsdoc/require-param-description,jsdoc/check-param-names */
        /**
         * @param {Fl32_Web_Back_Server_Config|object} [data]
         * @returns {Fl32_Web_Back_Server_Config}
         */
        this.create = function (data) {
            const res = new Fl32_Web_Back_Server_Config();
            if (data) {
                res.port = cast.int(data.port);
                res.type = cast.enum(data.type, SERVER_TYPE, {lower: true});

                if (data.tls) {
                    res.tls = tlsFactory.create(data.tls);
                }

                if (res.type === SERVER_TYPE.HTTPS && !res.tls) {
                    throw new Error('TLS configuration is required for HTTPS server type');
                }
            }
            return Object.freeze(res);
        };
    }
}
