import {describe, it, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {buildTestContainer} from '../../../unit/common.js';

class EventEmitter { constructor(){this._e={};} on(e,f){(this._e[e] ||= []).push(f);} emit(e,...a){(this._e[e]||[]).forEach(fn=>fn(...a));} }

const mockHttp2={constants:{HTTP2_HEADER_CONTENT_LENGTH:'content-length',HTTP2_HEADER_CONTENT_TYPE:'content-type',HTTP2_HEADER_LAST_MODIFIED:'last-modified',HTTP_STATUS_OK:200}};
const normalize=p=>{p=p.replace(/\\/g,'/');p=p.replace(/\/+/g,'/');if(p.length>1&&p.endsWith('/'))p=p.slice(0,-1);return p;};
const mockPath={resolve:(...a)=>normalize(a.filter(Boolean).join('/')),join:(...a)=>normalize(a.filter(Boolean).join('/')),isAbsolute:p=>p.startsWith('/'),extname:p=>{const b=p.split('/').pop();const i=b.lastIndexOf('.');return i>-1?b.slice(i):'';}};

let files;let stat;function resetFS(){files={};stat={};}
function addDir(p){p=mockPath.resolve(p);stat[p]={isFile:()=>false,isDirectory:()=>true,size:0,mtime:new Date()};}
function addFile(p,c){p=mockPath.resolve(p);files[p]=c;stat[p]={isFile:()=>true,isDirectory:()=>false,size:Buffer.byteLength(c),mtime:new Date()};}

const mockFs={
  promises:{
    stat:async p=>{p=mockPath.resolve(p);if(!stat[p]) throw new Error('ENOENT');return stat[p];}
  },
  createReadStream:p=>({pipe(res){setImmediate(()=>{if(files[p]) res.write(files[p]);res.end();});}})
};

class MockRes extends EventEmitter{constructor(){super();this.data=Buffer.alloc(0);this.statusCode=undefined;this.headers=undefined;this._sent=false;this._end=false;}get headersSent(){return this._sent;}get writableEnded(){return this._end;}writeHead(s,h){this.statusCode=s;this.headers=h;this._sent=true;}write(c){this.data=Buffer.concat([this.data,Buffer.from(c)]);}end(c){if(c) this.write(c);this._end=true;this.emit('finish');}}

describe('Fl32_Web_Back_Handler_Static (modular)', () => {
  let container; const log=[];

  beforeEach(() => {
    container = buildTestContainer();
    container.register('node:fs', mockFs);
    container.register('node:http2', mockHttp2);
    container.register('node:path', mockPath);
    container.register('Fl32_Web_Back_Logger$', {
      warn: (...a)=>log.push(['warn',...a]),
      exception: (...a)=>log.push(['exception',...a])
    });
    log.length=0; resetFS();
  });

  it('should match sources by prefix length', async () => {
    addDir('/a'); addFile('/a/test.txt','A');
    addDir('/b'); addFile('/b/test.txt','B');
    const handler = await container.get('Fl32_Web_Back_Handler_Static$');
    const Cfg = await container.get('Fl32_Web_Back_Dto_Handler_Source$');
    await handler.init({sources:[
      Cfg.create({prefix:'/files/',root:'/a',allow:{'.':['.']}}),
      Cfg.create({prefix:'/files/special/',root:'/b',allow:{'.':['.']}}),
    ]});
    const res=new MockRes();
    const ok=await handler.handle({url:'/files/special/test.txt'},res);
    await new Promise(r=>res.on('finish',r));
    assert.strictEqual(ok,true);
    assert.strictEqual(res.data.toString(),'B');
  });

  it('should enforce allow list rules', async () => {
    addFile('src/Back/Server.js','class Fl32_Web_Back_Server {}');
    addFile('src/Back/Handler/Static.js','static');
    const handler=await container.get('Fl32_Web_Back_Handler_Static$');
    const Cfg=await container.get('Fl32_Web_Back_Dto_Handler_Source$');
    await handler.init({sources:[Cfg.create({root:'src',prefix:'/s/',allow:{Back:['Server.js']}})]});
    const resOk=new MockRes();
    const ok=await handler.handle({url:'/s/Back/Server.js'},resOk);
    await new Promise(r=>resOk.on('finish',r));
    assert.strictEqual(ok,true);
    const resBad=new MockRes();
    const bad=await handler.handle({url:'/s/Back/Handler/Static.js'},resBad);
    assert.strictEqual(bad,false);
    assert.strictEqual(resBad.headersSent,false);
  });

  it('should allow full access with dot rule', async () => {
    addFile('src/Back/Server.js','class Fl32_Web_Back_Server {}');
    const handler=await container.get('Fl32_Web_Back_Handler_Static$');
    const Cfg=await container.get('Fl32_Web_Back_Dto_Handler_Source$');
    await handler.init({sources:[Cfg.create({root:'src',prefix:'/full/',allow:{Back:['.']}})]});
    const res=new MockRes();
    const ok=await handler.handle({url:'/full/Back/Server.js'},res);
    await new Promise(r=>res.on('finish',r));
    assert.strictEqual(ok,true);
    assert.match(res.data.toString(),/class Fl32_Web_Back_Server/);
  });

  it('should serve index files in directories', async () => {
    addDir('/dir'); addDir('/dir/d'); addFile('/dir/d/index.txt','INDEX');
    const handler=await container.get('Fl32_Web_Back_Handler_Static$');
    const Cfg=await container.get('Fl32_Web_Back_Dto_Handler_Source$');
    await handler.init({sources:[Cfg.create({root:'/dir',prefix:'/w/',defaults:['index.txt'],allow:{'.':['.']}})]});
    const res=new MockRes();
    const ok=await handler.handle({url:'/w/d/'},res);
    await new Promise(r=>res.on('finish',r));
    assert.strictEqual(ok,true);
    assert.strictEqual(res.data.toString(),'INDEX');
  });

  it('should reject path traversal and unmatched prefixes', async () => {
    addFile('/safe/file.txt','ok');
    const handler=await container.get('Fl32_Web_Back_Handler_Static$');
    const Cfg=await container.get('Fl32_Web_Back_Dto_Handler_Source$');
    await handler.init({sources:[Cfg.create({root:'/safe',prefix:'/p/',allow:{'.':['.']}})]});
    const res1=new MockRes();
    const bad1=await handler.handle({url:'/p/../file.txt'},res1);
    assert.strictEqual(bad1,false);
    const res2=new MockRes();
    const bad2=await handler.handle({url:'/x/file.txt'},res2);
    assert.strictEqual(bad2,false);
    assert.strictEqual(res2.headersSent,false);
  });
});
