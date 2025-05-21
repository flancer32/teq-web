/**
 * Serves static files from a configured root directory.
 * Prevents directory traversal and streams file content to the response.
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
         * Root directory for static files.
         * @type {string}
         */
        let _root;

        /**
         * Default filenames to try when a path is a directory.
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
                let fsPath = path.resolve(_root, '.' + urlPath);

                if (!fsPath.startsWith(_root)) return false;

                let stat;
                try {
                    stat = await fsp.stat(fsPath);
                } catch {
                    return false;
                }

                // If a path is a directory — try default files
                if (stat.isDirectory()) {
                    for (const file of _defaultFiles) {
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
                    if (!stat.isFile()) return false;
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
            } catch (e) {
                logger.exception(e);
                return false;
            }
        };

        /**
         * Initializes the handler with the root directory.
         *
         * @param {object} params
         * @param {string} params.rootPath - Absolute or relative path to the static root directory.
         * @returns {Promise<void>}
         */
        this.init = async function ({rootPath}) {
            _root = path.resolve(rootPath);
            logger.info(`Static files root: ${_root}`);
        };

        /**
         * Returns the handler registration info.
         * @returns {Fl32_Web_Back_Dto_Handler_Info.Dto}
         */
        this.getRegistrationInfo = () => _info;
    }
}
