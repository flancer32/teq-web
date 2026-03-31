/**
 * Static asset fallback helper.
 */
// @ts-check
export default class Fl32_Web_Back_Handler_Static_A_Fallback {
    /**
     * @param {object} deps
     * @param {Fl32_Web_Node_Fs} deps.fs
     * @param {Fl32_Web_Node_Path} deps.path
     */
    constructor({fs, path}) {

        /**
         * Apply default index fallback for directories.
         *
         * @param {string} fsPath
         * @param {string[]} defaults
         * @returns {Promise<string|null>} Path to existing file or null.
         */
        this.apply = async (fsPath, defaults) => {
            let stat;
            try { stat = await fs.promises.stat(fsPath); } catch { return null; }

            if (stat.isDirectory()) {
                for (const file of defaults) {
                    const candidate = path.join(fsPath, file);
                    try {
                        const s = await fs.promises.stat(candidate);
                        if (s.isFile()) return candidate;
                    } catch { /* ignore */ }
                }
                return null;
            }
            return stat.isFile() ? fsPath : null;
        };
    }
}

/**
 * Dependencies for the static fallback helper.
 */
export const __deps__ = Object.freeze({
    default: {
        fs: 'node:fs',
        path: 'node:path',
    },
});
