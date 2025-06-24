/**
 * Universal file handler serving files from multiple sources.
 * Supports allow lists and directory index fallbacks.
 *
 * @implements Fl32_Web_Back_Api_Handler
 */
export default class Fl32_Web_Back_Handler_Static {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {typeof import('node:fs')} fs - Node.js file system module.
     * @param {typeof import('node:http2')} http2
     * @param {typeof import('node:path')} path - Node.js path module.
     * @param {Fl32_Web_Back_Logger} logger - Logger instance.
     * @param {Fl32_Web_Back_Helper_Mime} helpMime - MIME helper for content type resolution.
     * @param {Fl32_Web_Back_Helper_Respond} respond - Response helper with status utilities.
     * @param {Fl32_Web_Back_Dto_Handler_Info} dtoInfo - DTO factory for handler registration.
     * @param {Fl32_Web_Back_Dto_Handler_Source} dtoSource - DTO factory for source configs.
     * @param {typeof Fl32_Web_Back_Enum_Stage} STAGE - Enum of handler stages.
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
            Fl32_Web_Back_Dto_Handler_Source$: dtoSource,
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

        /**
         * Handler registration info.
         * @type {Fl32_Web_Back_Dto_Handler_Info.Dto}
         */
        const _info = dtoInfo.create();
        _info.name = this.constructor.name;
        _info.stage = STAGE.PROCESS;
        Object.freeze(_info);

        /**
         * Sources configuration sorted by prefix length.
         * @type {{root: string, prefix: string, allow?: Record<string,string[]>, defaults: string[]}[]}
         */
        let _sources = [];

        /**
         * Global default index file names.
         * @type {string[]}
         */
        const _defaultFiles = ['index.html', 'index.htm', 'index.txt'];


        /**
         * Handles the incoming request by attempting to serve a static file.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - HTTP request object.
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object.
         * @returns {Promise<boolean>} - True if the file was served, false otherwise.
         */
        this.handle = async function (req, res) {
            if (!respond.isWritable(res)) return false;

            try {
                const urlPath = decodeURIComponent(req.url.split('?')[0]);

                for (const src of _sources) {
                    if (!urlPath.startsWith(src.prefix)) continue;

                    const rel = urlPath.slice(src.prefix.length);
                    if (rel.includes('..') || path.isAbsolute(rel)) {
                        logger.warn(`Static access denied: ${rel}`);
                        return false;
                    }

                    if (src.allow) {
                        let pkg; let subPath;
                        for (const key of Object.keys(src.allow)) {
                            if (rel === key || rel.startsWith(`${key}/`)) {
                                pkg = key;
                                subPath = rel.slice(key.length);
                                if (subPath.startsWith('/')) subPath = subPath.slice(1);
                                break;
                            }
                        }
                        if (!pkg) return false;

                        const rules = src.allow[pkg] || [];
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
                        if (!allowed) return false;
                    }

                    let fsPath = path.resolve(src.root, rel);
                    if (!fsPath.startsWith(src.root)) {
                        logger.warn(`Static access denied: ${rel}`);
                        return false;
                    }

                    let stat;
                    try {
                        stat = await fsp.stat(fsPath);
                    } catch {
                        continue;
                    }

                    if (stat.isDirectory()) {
                        for (const file of src.defaults) {
                            const candidate = path.join(fsPath, file);
                            try {
                                const s = await fsp.stat(candidate);
                                if (s.isFile()) {
                                    fsPath = candidate;
                                    stat = s;
                                    break;
                                }
                            } catch {
                                // ignore and continue
                            }
                        }
                        if (!stat.isFile()) continue;
                    }

                    if (!stat.isFile()) continue;

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
                }

                return false;
            } catch (e) {
                logger.exception(e);
                return false;
            }
        };

        /**
         * Initializes the handler with list of sources.
         * Each source may specify root, prefix, allow map and default index files.
         *
         * @param {{sources: object[]} } params
         * @returns {Promise<void>}
         */
        this.init = async function ({sources = []} = {}) {
            _sources = sources.map(src => {
                const dto = dtoSource.create(src);
                const res = {};
                res.root = path.resolve(dto.root);
                res.prefix = dto.prefix || '/';
                if (!res.prefix.endsWith('/')) res.prefix += '/';
                res.allow = dto.allow;
                const defs = (dto.defaults.length) ? dto.defaults : _defaultFiles;
                res.defaults = defs;
                return res;
            }).sort((a, b) => b.prefix.length - a.prefix.length);
        };

        /**
         * Returns the handler registration info.
         * @returns {Fl32_Web_Back_Dto_Handler_Info.Dto}
         */
        this.getRegistrationInfo = () => _info;
    }
}
