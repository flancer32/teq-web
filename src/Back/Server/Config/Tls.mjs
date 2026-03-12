// @ts-check

/**
 * Factory for TLS configuration DTO.
 * Produces validated DTOs for HTTPS server configuration.
 */
export const __deps__ = Object.freeze({
    cast: 'Fl32_Web_Back_Helper_Cast$',
});

/**
 * @typedef {object} Fl32_Web_Back_Server_Config_TlsConstructorParams
 * @property {Fl32_Web_Back_Helper_Cast} cast
 */

export default class Fl32_Web_Back_Server_Config_Tls {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {Fl32_Web_Back_Server_Config_TlsConstructorParams} params
     */
    constructor(
        {
            cast,
        }
    ) {
        /* eslint-enable jsdoc/require-param-description,jsdoc/check-param-names */
        /**
         * Create a validated DTO for TLS configuration.
         *
         * @param {*} [data] - Optional raw object.
         * @returns {Dto}
         */
        this.create = function (data) {
            const res = Object.assign(new Dto(), data);
            if (data) {
                res.ca = cast.string(data?.ca);
                res.cert = cast.string(data.cert);
                res.key = cast.string(data.key);
            }
            return res;
        };
    }
}

/**
 * @memberOf Fl32_Web_Back_Server_Config_Tls
 */
class Dto {
    /**
     * Trusted CA certificates in PEM format.
     * @type {string|undefined}
     */
    ca;

    /**
     * Certificate in PEM format.
     * @type {string}
     */
    cert;

    /**
     * Private key in PEM format.
     * @type {string}
     */
    key;
}
