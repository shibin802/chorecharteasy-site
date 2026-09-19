import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../assets/print-access.js',import.meta.url),'utf8');
function setup(){
 let premium=false,resolveFetch,calls=0,now=1000000;
 const winEvents={},docEvents={},note={},upgrade={},window={addEventListener:(type,fn)=>winEvents[type]=fn};
 const document={hidden:false,documentElement:{classList:{toggle:(_,value)=>{premium=value;}}},querySelectorAll:s=>s==='[data-print-plan]'?[note]:[upgrade],addEventListener:(type,fn)=>docEvents[type]=fn};
 const context={window,document,Date:{now:()=>now},fetch:()=>{calls++;return new Promise(resolve=>{resolveFetch=resolve;});}};
 vm.runInNewContext(source,context);
 return {window,docEvents,winEvents,note,upgrade,get premium(){return premium;},get calls(){return calls;},advance:n=>now=n,resolve:r=>resolveFetch(r)};
}
const plus={authenticated:true,membership:{entitlements:['watermark_free_print'],expiresAt:2000}};
test('paid printing stays watermark-free during repeated visibility refresh and temporary failure',async()=>{
 const s=setup();const initial=s.window.ChorePrintAccess.refresh();s.resolve(Response.json(plus));await initial;assert.equal(s.premium,true);
 const refresh=s.window.ChorePrintAccess.refresh();s.docEvents.visibilitychange();s.winEvents.beforeprint();
 assert.equal(s.calls,2,'overlapping checks share one request');assert.equal(s.premium,true);assert.equal(s.note.textContent,'Plus · Watermark-free printing');
 s.resolve(new Response('',{status:503}));await refresh;assert.equal(s.premium,true);
 s.advance(2000001);s.winEvents.beforeprint();assert.equal(s.premium,false,'expired access never remains premium');
});
test('confirmed free account or sign-out removes previously verified paid access',async()=>{
 const s=setup();let pending=s.window.ChorePrintAccess.refresh();s.resolve(Response.json(plus));await pending;
 pending=s.window.ChorePrintAccess.refresh();s.resolve(Response.json({authenticated:false}));await pending;assert.equal(s.premium,false);assert.equal(s.upgrade.hidden,false);
 pending=s.window.ChorePrintAccess.refresh();s.resolve(Response.json(plus));await pending;assert.equal(s.premium,true);
 pending=s.window.ChorePrintAccess.refresh();s.resolve(new Response('',{status:401}));await pending;assert.equal(s.premium,false);
});
