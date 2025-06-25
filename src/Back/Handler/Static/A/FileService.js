export default class Fl32_Web_Back_Handler_Static_A_FileService {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {typeof import('node:fs')} fs
     * @param {typeof import('node:http2')} http2
     * @param {typeof import('node:path')} path
     * @param {Fl32_Web_Back_Logger} logger
     * @param {Fl32_Web_Back_Helper_Mime} helpMime
     * @param {Fl32_Web_Back_Handler_Static_A_Resolver} resolver
     * @param {Fl32_Web_Back_Handler_Static_A_Fallback} fallback
     */
    constructor(
        {
            'node:fs': fs,
            'node:http2': http2,
            'node:path': path,
            Fl32_Web_Back_Logger$: logger,
            Fl32_Web_Back_Helper_Mime$: helpMime,
            Fl32_Web_Back_Handler_Static_A_Resolver$: resolver,
            Fl32_Web_Back_Handler_Static_A_Fallback$: fallback,
        }
    ) {
        /* eslint-enable jsdoc/check-param-names */
        this._fs = fs;
        this._fsp = fs.promises;
        this._path = path;
        this._logger = logger;
        this._helpMime = helpMime;
        this._resolver = resolver;
        this._fallback = fallback;
        const {constants: H2} = http2;
        this._H2 = H2;
    }

    /**
     * Serve a file for given config and relative path.
     *
     * @param {*} config
     * @param {string} rel
     * @param {*} req
     * @param {*} res
     * @returns {Promise<boolean>} true if served
     */
    async serve(config, rel, req, res) {
        try {
            let fsPath = this._resolver.resolve(config, rel);
            if (!fsPath) return false;

            fsPath = await this._fallback.apply(fsPath, config.defaults);
            if (!fsPath) return false;

            const stat = await this._fsp.stat(fsPath);
            if (!stat.isFile()) return false;

            const stream = this._fs.createReadStream(fsPath);
            const ext = this._path.extname(fsPath).toLowerCase();
            const headers = {
                [this._H2.HTTP2_HEADER_CONTENT_LENGTH]: stat.size,
                [this._H2.HTTP2_HEADER_CONTENT_TYPE]: this._helpMime.getByExt(ext),
                [this._H2.HTTP2_HEADER_LAST_MODIFIED]: stat.mtime.toUTCString(),
            };
            res.writeHead(this._H2.HTTP_STATUS_OK, headers);
            stream.pipe(res);
            return true;
        } catch (e) {
            this._logger.exception(e);
            return false;
        }
    }
}
