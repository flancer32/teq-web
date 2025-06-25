import {describe, it, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import Fallback from '../../../../../src/Back/Handler/Static/A/Fallback.js';

const normalize = p => {
    p = p.replace(/\\/g,'/');
    p = p.replace(/\/+/g,'/');
    if(p.length>1 && p.endsWith('/')) p=p.slice(0,-1);
    return p;
};

let files; let stat;
function reset(){ files={}; stat={}; }
function addFile(p){ p=normalize(p); files[p]=true; stat[p]={isFile:()=>true,isDirectory:()=>false}; }
function addDir(p){ p=normalize(p); stat[p]={isFile:()=>false,isDirectory:()=>true}; }

const mockFs = {
    promises: {
        stat: async (p)=>{
            p=normalize(p);
            if(!stat[p]) throw new Error('ENOENT');
            return stat[p];
        }
    }
};

describe('Static A Fallback', () => {
    beforeEach(reset);

    it('returns index file for directory', async () => {
        addDir('/d');
        addFile('/d/index.html');
        const fb = new Fallback({'node:fs': mockFs, 'node:path': path});
        const res = await fb.apply('/d', ['index.html']);
        assert.strictEqual(res, normalize('/d/index.html'));
    });

    it('returns null when nothing found', async () => {
        addDir('/x');
        const fb = new Fallback({'node:fs': mockFs, 'node:path': path});
        const res = await fb.apply('/x', ['a.html']);
        assert.strictEqual(res, null);
    });
});
