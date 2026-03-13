// @ts-check

export const __deps__ = Object.freeze({
    cast: 'Fl32_Web_Back_Helper_Cast$',
});

/**
 * @typedef {object} Fl32_Web_Back_Server_Config_TlsFactoryParams
 * @property {Fl32_Web_Back_Helper_Cast} cast
 */

export default class Fl32_Web_Back_Server_Config_Tls {
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

export class Factory {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {Fl32_Web_Back_Server_Config_TlsFactoryParams} params
     */
    constructor(
        {
            cast,
        }
    ) {
        /* eslint-enable jsdoc/require-param-description,jsdoc/check-param-names */
        /**
         * @param {*} [data]
         * @returns {Fl32_Web_Back_Server_Config_Tls}
         */
        this.create = function (data) {
            const res = new Fl32_Web_Back_Server_Config_Tls();
            if (data) {
                res.ca = cast.string(data?.ca);
                res.cert = cast.string(data.cert);
                res.key = cast.string(data.key);
            }
            return Object.freeze(res);
        };
    }
}
