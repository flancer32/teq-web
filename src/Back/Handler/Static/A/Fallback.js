export default class Fl32_Web_Back_Handler_Static_A_Fallback {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {typeof import('node:fs')} fs
     * @param {typeof import('node:path')} path
     */
    constructor(
        {
            'node:fs': fs,
            'node:path': path,
        }
    ) {
        /* eslint-enable jsdoc/check-param-names */
        this._fsp = fs.promises;
        this._path = path;
    }

    /**
     * Apply default index fallback for directories.
     *
     * @param {string} fsPath
     * @param {string[]} defaults
     * @returns {Promise<string|null>} Path to existing file or null.
     */
    async apply(fsPath, defaults) {
        let stat;
        try { stat = await this._fsp.stat(fsPath); } catch { return null; }

        if (stat.isDirectory()) {
            for (const file of defaults) {
                const candidate = this._path.join(fsPath, file);
                try {
                    const s = await this._fsp.stat(candidate);
                    if (s.isFile()) return candidate;
                } catch { /* ignore */ }
            }
            return null;
        }
        return stat.isFile() ? fsPath : null;
    }
}
