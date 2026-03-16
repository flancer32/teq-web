// @ts-check

export const __deps__ = Object.freeze({
    fs: 'node_fs',
    http2: 'node_http2',
    path: 'node_path',
    logger: 'Fl32_Web_Back_Logger$',
    helpMime: 'Fl32_Web_Back_Helper_Mime$',
    resolver: 'Fl32_Web_Back_Handler_Static_A_Resolver$',
    fallback: 'Fl32_Web_Back_Handler_Static_A_Fallback$',
});

export default class Fl32_Web_Back_Handler_Static_A_FileService {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {object} params
     * @param {Fl32_Web_Node_Fs} params.fs
     * @param {Fl32_Web_Node_Http2} params.http2
     * @param {Fl32_Web_Node_Path} params.path
     * @param {Fl32_Web_Back_Logger} params.logger
     * @param {Fl32_Web_Back_Helper_Mime} params.helpMime
     * @param {Fl32_Web_Back_Handler_Static_A_Resolver} params.resolver
     * @param {Fl32_Web_Back_Handler_Static_A_Fallback} params.fallback
     */
    constructor(
        {
            fs,
            http2,
            path,
            logger,
            helpMime,
            resolver,
            fallback,
        }
    ) {
        /* eslint-enable jsdoc/check-param-names */
        const {constants: H2} = http2;

        /**
         * Serve a file for given config and relative path.
         *
         * @param {Fl32_Web_Back_Handler_Static_A_Config_Value} config
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
