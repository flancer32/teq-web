import {describe, it, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import FileService from '../../../../../src/Back/Handler/Static/A/FileService.js';
import Resolver from '../../../../../src/Back/Handler/Static/A/Resolver.js';
import Fallback from '../../../../../src/Back/Handler/Static/A/Fallback.js';

class EventEmitter { constructor(){this._e={};} on(e,f){(this._e[e] ||= []).push(f);} emit(e,...a){(this._e[e]||[]).forEach(f=>f(...a));} }

const mockHttp2 = { constants:{ HTTP2_HEADER_CONTENT_LENGTH:'len', HTTP2_HEADER_CONTENT_TYPE:'type', HTTP2_HEADER_LAST_MODIFIED:'mod', HTTP_STATUS_OK:200 } };

const normalize=p=>{p=p.replace(/\\/g,'/');p=p.replace(/\/+/g,'/');if(p.length>1&&p.endsWith('/'))p=p.slice(0,-1);return p;};
const mockPath = { resolve:(...a)=>normalize(a.filter(Boolean).join('/')), join:(...a)=>normalize(a.filter(Boolean).join('/')), extname:p=>{const b=p.split('/').pop();const i=b.lastIndexOf('.');return i>-1?b.slice(i):'';}, isAbsolute:p=>p.startsWith('/') };

let files;let stat;
function reset(){files={};stat={};}
function addFile(p,c){p=mockPath.resolve(p);files[p]=c;stat[p]={isFile:()=>true,isDirectory:()=>false,size:Buffer.byteLength(c),mtime:new Date()};}
function addDir(p){p=mockPath.resolve(p);stat[p]={isFile:()=>false,isDirectory:()=>true,size:0,mtime:new Date()};}

const mockFs={
  promises:{
    stat:async p=>{p=mockPath.resolve(p);if(!stat[p]) throw new Error('ENOENT');return stat[p];}
  },
  createReadStream:p=>({
    pipe(res){setImmediate(()=>{if(files[p]) res.write(files[p]);res.end();});}
  })
};

class MockRes extends EventEmitter{constructor(){super();this.data='';this.status=undefined;this.headers=undefined;this._hs=false;this._ended=false;}get headersSent(){return this._hs;}get writableEnded(){return this._ended;}writeHead(s,h){this.status=s;this.headers=h;this._hs=true;}write(c){this.data+=c;}end(c){if(c) this.write(c);this._ended=true;this.emit('finish');}}

const logger={exception:()=>{}};
const mime={getByExt:()=>"text/plain"};

let service;

beforeEach(() => {
  reset();
  const resolver = new Resolver({'node:path': mockPath});
  const fb = new Fallback({'node:fs': mockFs, 'node:path': mockPath});
  service = new FileService({
    'node:fs': mockFs,
    'node:http2': mockHttp2,
    'node:path': mockPath,
    Fl32_Web_Back_Logger$: logger,
    Fl32_Web_Back_Helper_Mime$: mime,
    Fl32_Web_Back_Handler_Static_A_Resolver$: resolver,
    Fl32_Web_Back_Handler_Static_A_Fallback$: fb,
  });
});

describe('Static A FileService', () => {
  it('serves existing file', async () => {
    addFile('/root/a.txt','A');
    const config={root:'/root',prefix:'/p/',defaults:['index.html']};
    const res=new MockRes();
    const ok=await service.serve(config,'a.txt',{},res); 
    await new Promise(r=>res.on('finish',r));
    assert.ok(ok);
    assert.strictEqual(res.status,200);
    assert.strictEqual(res.data,'A');
  });

  it('returns false when not found', async () => {
    addDir('/root');
    const config={root:'/root',prefix:'/p/',defaults:['index.html']};
    const res=new MockRes();
    const ok=await service.serve(config,'missing.txt',{},res);
    assert.strictEqual(ok,false);
  });
});
