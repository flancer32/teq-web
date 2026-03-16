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

/** @type {Fl32_Web_Back_Config_Runtime_Tls} */
const proxy = new Proxy(cfg, {
    get(target, prop) {
        const isServiceProp = (prop === 'then') || (typeof prop === 'symbol');
        if (!frozen && !isServiceProp) throw new Error('Runtime configuration is not initialized.');
        return target[prop];
    },
    set() {
        throw new Error('Runtime configuration is immutable.');
    },
    defineProperty(target, prop, descriptor) {
        const current = Object.getOwnPropertyDescriptor(target, prop);
        const isFreezeStep = current
            && (descriptor?.configurable === false)
            && (!('writable' in descriptor) || descriptor.writable === false)
            && (!('value' in descriptor) || descriptor.value === current.value);
        if (isFreezeStep) {
            return Reflect.defineProperty(target, prop, descriptor);
        }
        throw new Error('Runtime configuration is immutable.');
    },
    deleteProperty() {
        throw new Error('Runtime configuration is immutable.');
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
