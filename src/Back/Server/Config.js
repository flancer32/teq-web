/**
 * Factory for server configuration DTO.
 * Supports HTTP, HTTPS and HTTP2 server types with TLS configuration.
 */
export default class Fl32_Web_Back_Server_Config {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {Fl32_Web_Back_Helper_Cast} cast
     * @param {typeof Fl32_Web_Back_Enum_Server_Type} SERVER_TYPE
     * @param {Fl32_Web_Back_Server_Config_Tls} tlsFactory
     */
    constructor(
        {
            Fl32_Web_Back_Helper_Cast$: cast,
            Fl32_Web_Back_Enum_Server_Type$: SERVER_TYPE,
            Fl32_Web_Back_Server_Config_Tls$: tlsFactory,
        }
    ) {
        /* eslint-enable jsdoc/require-param-description,jsdoc/check-param-names */
        // INSTANCE METHODS
        /**
         * Creates a new DTO instance with properly casted attributes.
         * Ensures valid values for enums and numerical fields.
         * Validates TLS configuration when type is HTTPS.
         *
         * @param {Fl32_Web_Back_Server_Config.Dto|object} [data] - Raw input data for the DTO.
         * @returns {Dto} - A properly structured DTO instance.
         * @throws {Error} When HTTPS type is specified without TLS configuration.
         */
        this.create = function (data) {
            const res = Object.assign(new Dto(), data);
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
    /**
     * TLS configuration for HTTPS server.
     * @type {Fl32_Web_Back_Server_Config_Tls.Dto|undefined}
     */
    tls;
}