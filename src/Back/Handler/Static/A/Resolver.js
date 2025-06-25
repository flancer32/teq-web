export default class Fl32_Web_Back_Handler_Static_A_Resolver {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {typeof import('node:path')} path
     */
    constructor(
        {
            'node:path': path,
        }
    ) {
        /* eslint-enable jsdoc/check-param-names */
        this._path = path;
    }

    /**
     * Resolve filesystem path for given config and relative URL part.
     * Applies allow rules and security checks.
     *
     * @param {{root:string,prefix:string,allow?:Record<string,string[]>}} config
     * @param {string} rel
     * @returns {string|null} Absolute path or null when not allowed.
     * @throws {Error} On path traversal attempts.
     */
    resolve(config, rel) {
        if (rel.includes('..') || this._path.isAbsolute(rel)) {
            throw new Error('Static access denied');
        }

        if (config.allow) {
            let pkg; let subPath = '';
            for (const key of Object.keys(config.allow)) {
                if (rel === key || rel.startsWith(`${key}/`)) {
                    pkg = key;
                    subPath = rel.slice(key.length);
                    if (subPath.startsWith('/')) subPath = subPath.slice(1);
                    break;
                }
            }
            if (!pkg) return null;

            const rules = config.allow[pkg] || [];
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
            if (!allowed) return null;
        }

        const fsPath = this._path.resolve(config.root, rel);
        if (!fsPath.startsWith(config.root)) {
            throw new Error('Resolved path is outside the root');
        }
        return fsPath;
    }
}
