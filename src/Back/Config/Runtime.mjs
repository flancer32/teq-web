// @ts-check

export const __deps__ = Object.freeze({
    cast: 'Fl32_Web_Back_Helper_Cast$',
    SERVER_TYPE: 'Fl32_Web_Back_Enum_Server_Type$',
    tlsFactory: 'Fl32_Web_Back_Server_Config_Tls__Factory$',
});

/**
 * Backend runtime configuration.
 */
export class Data {
    /** @type {number|undefined} */
    port;
    /** @type {string|undefined} */
    type;
    /** @type {Fl32_Web_Back_Server_Config_Tls|undefined} */
    tls;
}

/** @type {Fl32_Web_Back_Config_Runtime} */
const cfg = new Data();
let frozen = false;

/** @type {Fl32_Web_Back_Config_Runtime} */
const proxy = new Proxy(cfg, {
    get(target, prop, receiver) {
        const isServiceProp = (prop === 'then')
            || (typeof prop === 'symbol')
            || (typeof prop === 'string' && prop in Object.prototype);
        if (!frozen && !isServiceProp) {
            throw new Error('Runtime configuration is not initialized.');
        }
        return Reflect.get(target, prop, receiver);
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
});

export default class Fl32_Web_Back_Config_Runtime {
    constructor() {
        return proxy;
    }
}

/**
 * @typedef {object} Fl32_Web_Back_Config_RuntimeFactoryParams
 * @property {Fl32_Web_Back_Helper_Cast} cast
 * @property {Fl32_Web_Back_Enum_Server_Type} SERVER_TYPE
 * @property {Fl32_Web_Back_Server_Config_Tls$Factory} tlsFactory
 */

export class Factory {
    /**
     * @param {Fl32_Web_Back_Config_RuntimeFactoryParams} params
     */
    constructor({cast, SERVER_TYPE, tlsFactory}) {
        /**
         * @param {{port?: *, type?: *, tls?: *}} [params]
         * @returns {Fl32_Web_Back_Config_Runtime}
         */
        this.configure = function (params = {}) {
            if (frozen) throw new Error('Runtime configuration is frozen.');
            if (cfg.port === undefined && params.port !== undefined) {
                cfg.port = cast.int(params.port);
            }
            if (cfg.type === undefined && params.type !== undefined) {
                cfg.type = cast.enum(params.type, SERVER_TYPE, {lower: true});
            }
            if (cfg.tls === undefined && params.tls !== undefined) {
                cfg.tls = tlsFactory.create(params.tls);
            }
            return proxy;
        };

        /**
         * @returns {Fl32_Web_Back_Config_Runtime}
         */
        this.freeze = function () {
            if (frozen) return proxy;
            if (cfg.port === undefined) cfg.port = 3000;
            if (cfg.type === undefined) cfg.type = SERVER_TYPE.HTTP;
            if (cfg.type === SERVER_TYPE.HTTPS && cfg.tls === undefined) {
                throw new Error('TLS configuration is required for HTTPS server type');
            }
            Object.freeze(cfg);
            frozen = true;
            return proxy;
        };
    }
}
