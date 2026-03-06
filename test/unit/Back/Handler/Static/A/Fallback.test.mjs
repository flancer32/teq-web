import {describe, test, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import Fl32_Web_Back_Handler_Static_A_Fallback from '../../../../../../src/Back/Handler/Static/A/Fallback.mjs';

describe('Fl32_Web_Back_Handler_Static_A_Fallback', () => {
    /** @type {{ promises: { stat: (p: string) => Promise<any> }, _add: (p: string, isFile: boolean) => void }} */
    let mockFs;

    beforeEach(() => {
        const storage = new Map();

        mockFs = {
            promises: {
                stat: async p => {
                    // normalize path: backslashes → slashes, remove duplicate and trailing slash
                    const key = p.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/\/$/, '');
                    if (!storage.has(key)) throw new Error('ENOENT');
                    return storage.get(key);
                }
            },
            /** Adds a file or directory into the mock storage */
            _add: (p, isFile) => {
                const key = p.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/\/$/, '');
                storage.set(key, {
                    isFile: () => isFile,
                    isDirectory: () => !isFile
                });
            }
        };
    });

    function addFile(p) { mockFs._add(p, true); }

    function addDir(p) { mockFs._add(p, false); }

    /** Creates and returns a configured Fallback instance */
    async function getFallback() {
        /** @type {Fl32_Web_Back_Handler_Static_A_Fallback} */
        const fallback = new Fl32_Web_Back_Handler_Static_A_Fallback({fs: mockFs, path});
        return fallback;
    }

    test('returns index file for a directory', async () => {
        addDir('/d');
        addFile('/d/index.html');

        const fb = await getFallback();
        const result = await fb.apply('/d', ['index.html']);
        assert.strictEqual(result, '/d/index.html');
    });

    test('returns null when nothing found', async () => {
        addDir('/x');

        const fb = await getFallback();
        const result = await fb.apply('/x', ['a.html']);
        assert.strictEqual(result, null);
    });
});
