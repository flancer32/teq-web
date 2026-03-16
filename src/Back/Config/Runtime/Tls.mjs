// @ts-check

export const __deps__ = Object.freeze({
    cast: 'Fl32_Web_Back_Helper_Cast$',
});

/**
 * TLS runtime configuration.
 */
export class Data {
    /** @type {string|undefined} */
    ca;
    /** @type {string|undefined} */
    cert;
    /** @type {string|undefined} */
    key;
}

/** @type {Fl32_Web_Back_Config_Runtime_Tls} */
const cfg = new Data();
let frozen = false;

const facade = {};

/** @type {Fl32_Web_Back_Config_Runtime_Tls} */
const proxy = new Proxy(facade, {
    get(_target, prop) {
        const isServiceProp = (prop === 'then') || (typeof prop === 'symbol');
        if (!frozen && !isServiceProp) throw new Error('Runtime configuration is not initialized.');
        return cfg[prop];
    },
    set() {
        throw new Error('Runtime configuration is immutable.');
    },
    defineProperty() {
        throw new Error('Runtime configuration is immutable.');
    },
    deleteProperty() {
        throw new Error('Runtime configuration is immutable.');
    },
    preventExtensions() {
        throw new Error('Runtime configuration wrapper cannot be frozen.');
    },
});

export default class Wrapper {
    constructor() {
        return proxy;
    }
}

export class Factory {
    /**
     * @param {object} params
     * @param {Fl32_Web_Back_Helper_Cast} params.cast
     */
    constructor({cast}) {
        /**
         * @param {Fl32_Web_Back_Config_Runtime_Tls_Params} [params]
         * @returns {Fl32_Web_Back_Config_Runtime_Tls}
         */
        this.configure = function (params = {}) {
            if (frozen) throw new Error('Runtime configuration is frozen.');
            if (cfg.ca === undefined && params.ca !== undefined) {
                cfg.ca = cast.string(params.ca);
            }
            if (cfg.cert === undefined && params.cert !== undefined) {
                cfg.cert = cast.string(params.cert);
            }
            if (cfg.key === undefined && params.key !== undefined) {
                cfg.key = cast.string(params.key);
            }
            return proxy;
        };

        /**
         * @returns {Fl32_Web_Back_Config_Runtime_Tls}
         */
        this.freeze = function () {
            if (frozen) return proxy;
            Object.freeze(cfg);
            frozen = true;
            return proxy;
        };
    }
}
