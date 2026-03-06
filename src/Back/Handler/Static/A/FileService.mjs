// @ts-check

export const __deps__ = {
    fs: 'node_fs',
    http2: 'node_http2',
    path: 'node_path',
    logger: 'Fl32_Web_Back_Logger$',
    helpMime: 'Fl32_Web_Back_Helper_Mime$',
    resolver: 'Fl32_Web_Back_Handler_Static_A_Resolver$',
    fallback: 'Fl32_Web_Back_Handler_Static_A_Fallback$',
};

/**
 * @typedef {object} Fl32_Web_Back_Handler_Static_A_FileServiceConstructorParams
 * @property {typeof import('node:fs')} fs
 * @property {typeof import('node:http2')} http2
 * @property {typeof import('node:path')} path
 * @property {Fl32_Web_Back_Logger} logger
 * @property {Fl32_Web_Back_Helper_Mime} helpMime
 * @property {Fl32_Web_Back_Handler_Static_A_Resolver} resolver
 * @property {Fl32_Web_Back_Handler_Static_A_Fallback} fallback
 */

export default class Fl32_Web_Back_Handler_Static_A_FileService {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {Fl32_Web_Back_Handler_Static_A_FileServiceConstructorParams} params
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
         * @param {*} config
         * @param {string} rel
         * @param {*} req
         * @param {*} res
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
