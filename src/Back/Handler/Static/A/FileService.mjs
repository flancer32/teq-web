/**
 * Static file service.
 */
// @ts-check
export default class Fl32_Web_Back_Handler_Static_A_FileService {
    /**
     * @param {object} deps
     * @param {Fl32_Web_Node_Fs} deps.fs
     * @param {Fl32_Web_Node_Http2} deps.http2
     * @param {Fl32_Web_Node_Path} deps.path
     * @param {Fl32_Web_Back_Logger} deps.logger
     * @param {Fl32_Web_Back_Helper_Mime} deps.helpMime
     * @param {Fl32_Web_Back_Handler_Static_A_Resolver} deps.resolver
     * @param {Fl32_Web_Back_Handler_Static_A_Fallback} deps.fallback
     */
    constructor({fs, http2, path, logger, helpMime, resolver, fallback}) {
        const {constants: H2} = http2;

        /**
         * Serve a file for given config and relative path.
         *
         * @param {Fl32_Web_Back_Handler_Static_A_Config__Value} config
         * @param {string} rel
         * @param {Fl32_Web_Node_Http_IncomingMessage|Fl32_Web_Node_Http2_ServerRequest} req
         * @param {Fl32_Web_Back_Response_Target} res
         * @returns {Promise<boolean>} true if served
         */
        this.serve = async (config, rel, req, res) => {
            let fsPath;
            try {
                fsPath = resolver.resolve(config, rel);
                if (!fsPath) return false;

                fsPath = await fallback.apply(fsPath, config.defaults);
                if (!fsPath) return false;

                const stat = await fs.promises.stat(fsPath);
                if (!stat.isFile()) return false;

                const stream = fs.createReadStream(fsPath);
                const ext = path.extname(fsPath).toLowerCase();
                const headers = {
                    [H2.HTTP2_HEADER_CONTENT_LENGTH]: stat.size,
                    [H2.HTTP2_HEADER_CONTENT_TYPE]: helpMime.getByExt(ext),
                    [H2.HTTP2_HEADER_LAST_MODIFIED]: stat.mtime.toUTCString(),
                };
                res.writeHead(H2.HTTP_STATUS_OK, headers);
                stream.pipe(res);
                return true;
            } catch (e) {
                if (e?.code === 'ENOENT') {
                    logger.info(`File not found: ${fsPath}`);
                } else if (e?.code === 'EACCES' || e?.code === 'EPERM') {
                    logger.warn(`Access denied: ${fsPath}`);
                } else {
                    logger.exception(e);
                }
                return false;
            }
        };
    }
}

/**
 * Dependencies for the static file service.
 */
export const __deps__ = Object.freeze({
    default: {
        fs: 'node:fs',
        http2: 'node:http2',
        path: 'node:path',
        logger: 'Fl32_Web_Back_Logger$',
        helpMime: 'Fl32_Web_Back_Helper_Mime$',
        resolver: 'Fl32_Web_Back_Handler_Static_A_Resolver$',
        fallback: 'Fl32_Web_Back_Handler_Static_A_Fallback$',
    },
});
