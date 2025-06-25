/**
 * Enforces allow‐list rules and security checks when resolving
 * a relative URL to an absolute filesystem path under a given root.
 */
export default class Fl32_Web_Back_Handler_Static_A_Resolver {
    /**
     * @param {typeof import('node:path')} path
     */
    constructor({'node:path': path}) {
        /**
         * Resolve a filesystem path for given config and relative URL part.
         * Applies allow rules and prevents path traversal.
         *
         * @param {{root: string, prefix: string, allow?: Record<string,string[]>}} config
         * @param {string} rel
         * @returns {string|null}
         * @throws {Error} On traversal or absolute rel paths.
         */
        this.resolve = (config, rel) => {
            // disallow path‐traversal or absolute rel
            if (rel.includes('..') || path.isAbsolute(rel)) {
                throw new Error('Static access denied');
            }

            let pkgName;
            let subPath = '';

            // root‐level allow: '.' rules permit any rel under root
            if (config.allow?.['.'] != null) {
                pkgName = '.';
                subPath = rel;
            } else if (config.allow) {
                for (const key of Object.keys(config.allow)) {
                    if (rel === key || rel.startsWith(`${key}/`)) {
                        pkgName = key;
                        const offset = key.length + (rel[key.length] === '/' ? 1 : 0);
                        subPath = rel.slice(offset);
                        break;
                    }
                }
            }

            if (!pkgName) {
                return null;
            }

            const rules = config.allow[pkgName] || [];
            let allowed = rules.includes('.');
            if (!allowed) {
                for (const rule of rules) {
                    if (subPath === rule || subPath.startsWith(`${rule}/`)) {
                        allowed = true;
                        break;
                    }
                }
            }
            if (!allowed) {
                return null;
            }

            const fsPath = path.resolve(config.root, rel);
            if (!fsPath.startsWith(config.root)) {
                throw new Error('Resolved path is outside the root');
            }

            return fsPath;
        };
    }
}
