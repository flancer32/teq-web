/**
 * Serves whitelisted source files from the configured root directory.
 * @implements Fl32_Web_Back_Api_Handler
 */
export default class Fl32_Web_Back_Handler_Source {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {typeof import('node:fs')} fs
     * @param {typeof import('node:http2')} http2
     * @param {typeof import('node:path')} path
     * @param {Fl32_Web_Back_Logger} logger
     * @param {Fl32_Web_Back_Helper_Mime} helpMime
     * @param {Fl32_Web_Back_Helper_Respond} respond
     * @param {Fl32_Web_Back_Dto_Handler_Info} dtoInfo
     * @param {Fl32_Web_Back_Dto_Handler_Source} dtoCfg
     * @param {typeof Fl32_Web_Back_Enum_Stage} STAGE
     */
    constructor(
        {
            'node:fs': fs,
            'node:http2': http2,
            'node:path': path,
            Fl32_Web_Back_Logger$: logger,
            Fl32_Web_Back_Helper_Mime$: helpMime,
            Fl32_Web_Back_Helper_Respond$: respond,
            Fl32_Web_Back_Dto_Handler_Info$: dtoInfo,
            Fl32_Web_Back_Dto_Handler_Source$: dtoCfg,
            Fl32_Web_Back_Enum_Stage$: STAGE,
        }
    ) {
        /* eslint-enable jsdoc/check-param-names */
        // VARS
        const {promises: fsp} = fs;
        const {constants: H2} = http2;
        const {
            HTTP2_HEADER_CONTENT_LENGTH,
            HTTP2_HEADER_CONTENT_TYPE,
            HTTP2_HEADER_LAST_MODIFIED,
            HTTP_STATUS_OK,
        } = H2;
        /** @type {string} */
        let _root;

        /** @type {string} */
        let _prefix = '/';

        /** @type {Fl32_Web_Back_Dto_Handler_Info.Dto} */
        const _info = dtoInfo.create();
        _info.name = this.constructor.name;
        _info.stage = STAGE.PROCESS;
        Object.freeze(_info);

        /** @type {{[key: string]: string[]}} */
        let _allow = {};

        // MAIN
        /**
         * Handles request to serve allowed files from the source directory.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @returns {Promise<boolean>}
         */
        this.handle = async function (req, res) {
            if (!respond.isWritable(res)) return false;

            const urlPath = decodeURIComponent(req.url.split('?')[0]);
            if (!urlPath.startsWith(_prefix)) return false;

            const rel = urlPath.slice(_prefix.length);
            if (rel.includes('..') || path.isAbsolute(rel)) {
                logger.warn(`Source static access denied: ${rel}`);
                return false;
            }

            let pkg;
            let subPath;
            for (const key of Object.keys(_allow)) {
                if (rel === key || rel.startsWith(`${key}/`)) {
                    pkg = key;
                    subPath = rel.slice(key.length);
                    if (subPath.startsWith('/')) subPath = subPath.slice(1);
                    break;
                }
            }
            if (!pkg) return false;

            const rules = _allow[pkg] || [];
            let allowed = false;
            if (rules.includes('.')) {
                allowed = true;
            } else {
                for (const p of rules) {
                    if (subPath === p || subPath.startsWith(`${p}/`)) {
                        allowed = true;
                        break;
                    }
                }
            }

            if (!allowed) {
                logger.warn(`Source static access denied: ${rel}`);
                return false;
            }

            const fsPath = path.resolve(_root, rel);
            if (!fsPath.startsWith(_root)) {
                logger.warn(`Source static access denied: ${rel}`);
                return false;
            }

            let stat;
            try {
                stat = await fsp.stat(fsPath);
            } catch {
                logger.warn(`Source static file not found: ${rel}`);
                return false;
            }
            if (!stat.isFile()) {
                logger.warn(`Source static file not found: ${rel}`);
                return false;
            }

            const stream = fs.createReadStream(fsPath);
            const ext = path.extname(fsPath).toLowerCase();
            const headers = {
                [HTTP2_HEADER_CONTENT_LENGTH]: stat.size,
                [HTTP2_HEADER_CONTENT_TYPE]: helpMime.getByExt(ext),
                [HTTP2_HEADER_LAST_MODIFIED]: stat.mtime.toUTCString(),
            };
            res.writeHead(HTTP_STATUS_OK, headers);
            stream.pipe(res);
            return true;
        };

        /**
         * Initialize handler.
         *
         * @param {object} params
         * @param {string} params.root - Root directory for files.
         * @param {string} params.prefix - URL prefix to match.
         * @param {{[key: string]: string[]}} params.allow - Map of directories to paths
         *   that can be served.
         * @returns {Promise<void>}
         *
         * @example
         * // Allow a single file from a package
         * await sourceHandler.init({
         *   root: 'node_modules',
         *   prefix: '/node_modules/',
         *   allow: {
         *     vue: ['dist/vue.global.prod.js'],
         *   },
         * });
         *
         * @example
         * // Allow all files from a subfolder
         * await sourceHandler.init({
         *   root: 'node_modules',
         *   prefix: '/node_modules/',
         *   allow: {
         *     '@teqfw/di/src': ['.'],
         *   },
         * });
         */
        /**
         * @param {Fl32_Web_Back_Dto_Handler_Source.Dto|object} cfg
         * @returns {Promise<void>}
         */
        this.init = async function (cfg = {}) {
            const dto = dtoCfg.create(cfg);
            _root = path.resolve(dto.root);
            _prefix = dto.prefix;
            if (!_prefix.endsWith('/')) _prefix += '/';
            _allow = dto.allow;
        };

        /** @returns {Fl32_Web_Back_Dto_Handler_Info.Dto} */
        this.getRegistrationInfo = () => _info;
    }
}
