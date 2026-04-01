/**
 * Runtime configuration wrapper and factory wiring.
 */
// @ts-check

export class Data {
    /** @type {number|undefined} */
    port;
    /** @type {string|undefined} */
    type;
    /** @type {Fl32_Web_Back_Config_Runtime_Tls|undefined} */
    tls;
}

/** @type {Fl32_Web_Back_Config_Runtime} */
const cfg = new Data();
let frozen = false;

const facade = {};

/** @type {Fl32_Web_Back_Config_Runtime} */
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
     * @param {object} deps
     * @param {Fl32_Web_Back_Helper_Cast} deps.cast
     * @param {Fl32_Web_Back_Enum_Server_Type} deps.SERVER_TYPE
     * @param {Fl32_Web_Back_Config_Runtime_Tls$Factory} deps.tlsFactory
     */
    constructor({cast, SERVER_TYPE, tlsFactory}) {
        /**
         * @param {Fl32_Web_Back_Config_Runtime} [params]
         */
        this.configure = function (params = {}) {
            if (frozen) throw new Error('Runtime configuration is frozen.');
            if (cfg.port === undefined && params.port !== undefined) {
                cfg.port = cast.int(params.port);
            }
            if (cfg.type === undefined && params.type !== undefined) {
                cfg.type = cast.enum(params.type, SERVER_TYPE, { lower: true });
            }
            if (params.tls !== undefined) {
                tlsFactory.configure(params.tls);
            }
        };

        /**
         * @returns {Fl32_Web_Back_Config_Runtime}
         */
        this.freeze = function () {
            if (frozen) return proxy;
            if (cfg.port === undefined) cfg.port = 3000;
            if (cfg.type === undefined) cfg.type = SERVER_TYPE.HTTP;
            const tls = tlsFactory.freeze();
            if (cfg.tls === undefined) cfg.tls = tls;
            if (cfg.type === SERVER_TYPE.HTTPS && cfg.tls === undefined) {
                throw new Error('TLS configuration is required for HTTPS server type');
            }
            if (cfg.type === SERVER_TYPE.HTTPS && (!cfg.tls.key || !cfg.tls.cert)) {
                throw new Error('TLS configuration is required for HTTPS server type');
            }
            Object.freeze(cfg);
            frozen = true;
            return proxy;
        };
    }
}

/**
 * Backend runtime configuration container.
 *
 * `default export` is the runtime wrapper.
 * `Factory` is the DI-managed component described by `__deps__`.
 */
export const __deps__ = Object.freeze({
    default: Object.freeze({}),
    Factory: Object.freeze({
        cast: 'Fl32_Web_Back_Helper_Cast$',
        SERVER_TYPE: 'Fl32_Web_Back_Enum_Server_Type$',
        tlsFactory: 'Fl32_Web_Back_Config_Runtime_Tls__Factory$',
    }),
});
