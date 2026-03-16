// @ts-check

import { Factory as RuntimeTlsFactory } from './Runtime/Tls.mjs';

export const __deps__ = Object.freeze({
    cast: 'Fl32_Web_Back_Helper_Cast$',
    SERVER_TYPE: 'Fl32_Web_Back_Enum_Server_Type$',
    tlsData: 'Fl32_Web_Back_Config_Runtime_Tls$',
});

/**
 * Backend runtime configuration.
 */
export class Data {
    /** @type {Fl32_Web_Back_Config_Runtime_Server|undefined} */
    server;
}

/**
 * Built-in server runtime configuration subtree.
 */
export class Server {
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

/** @type {Fl32_Web_Back_Config_Runtime} */
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
     * @param {Fl32_Web_Back_Enum_Server_Type} params.SERVER_TYPE
     * @param {Fl32_Web_Back_Config_Runtime_Tls} params.tlsData
     * @param {Fl32_Web_Back_Config_Runtime_Tls$Factory} params.tlsFactory
     */
    constructor({ cast, SERVER_TYPE, tlsData, tlsFactory = new RuntimeTlsFactory({ cast }) }) {
        /**
         * @param {{server?: {port?: *, type?: *, tls?: *}}} [params]
         * @returns {Fl32_Web_Back_Config_Runtime}
         */
        this.configure = function (params = {}) {
            if (frozen) throw new Error('Runtime configuration is frozen.');
            if (cfg.server === undefined) cfg.server = new Server();
            if (cfg.server.port === undefined && params.server?.port !== undefined) {
                cfg.server.port = cast.int(params.server.port);
            }
            if (cfg.server.type === undefined && params.server?.type !== undefined) {
                cfg.server.type = cast.enum(params.server.type, SERVER_TYPE, { lower: true });
            }
            if (params.server?.tls !== undefined) {
                tlsFactory.configure(params.server.tls);
            }
            return proxy;
        };

        /**
         * @returns {Fl32_Web_Back_Config_Runtime}
         */
        this.freeze = function () {
            if (frozen) return proxy;
            if (cfg.server === undefined) cfg.server = new Server();
            if (cfg.server.port === undefined) cfg.server.port = 3000;
            if (cfg.server.type === undefined) cfg.server.type = SERVER_TYPE.HTTP;
            tlsFactory.freeze();
            if (cfg.server.tls === undefined) cfg.server.tls = tlsData;
            if (cfg.server.type === SERVER_TYPE.HTTPS && cfg.server.tls === undefined) {
                throw new Error('TLS configuration is required for HTTPS server type');
            }
            if (cfg.server.type === SERVER_TYPE.HTTPS && (!cfg.server.tls.key || !cfg.server.tls.cert)) {
                throw new Error('TLS configuration is required for HTTPS server type');
            }
            Object.freeze(cfg.server);
            Object.freeze(cfg);
            frozen = true;
            return proxy;
        };
    }
}
