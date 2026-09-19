import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../assets/login.js',import.meta.url),'utf8').replace(/^import .*;$/gm,'');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('Google button waits for its stylesheet and retries a failed asset without rendering unstyled content',async()=>{
 let frameHeight=0,notify,resolveAccount;
 const accountPending=new Promise(resolve=>{resolveAccount=resolve;});
 const elements=Object.fromEntries(['account-status','retry-google','google-button'].map(id=>[id,{clientWidth:308,setAttribute(name,value){this[name]=value;},querySelector(){return {getBoundingClientRect(){return {height:frameHeight};}};},replaceChildren(){},addEventListener(t,fn){this.click=fn;}}]));
 const pending=[],timers=new Map();let rendered=0,tid=0;
 vm.runInNewContext(source,{Map,Promise,Error,Math,URLSearchParams,location:{search:'',replace(){}},safeReturn:()=>'/account',
  MutationObserver:class {constructor(fn){notify=fn;}observe(){}disconnect(){}},
  setTimeout:fn=>{timers.set(++tid,fn);return tid;},clearTimeout:id=>timers.delete(id),
  document:{getElementById:id=>elements[id],createElement:tag=>({tag,remove(){this.removed=true;}}),head:{append:el=>pending.push(el)}},
  window:{google:{accounts:{id:{initialize(){},renderButton(){rendered++;}}}}},
  api:async path=>{assert.equal(path,'/api/auth/google/challenge','no separate account request');return accountPending;}
 });
 await flush();assert.equal(pending.length,2,'Google assets start before the account response');
 assert.equal(rendered,0);resolveAccount({clientId:'test',nonce:'test'});await flush();
 pending.find(e=>e.tag==='script').onload();await flush();assert.equal(rendered,0,'script alone cannot expose an unstyled fallback');
 pending.find(e=>e.tag==='link').onerror();await flush();assert.equal(rendered,0);assert.equal(elements['retry-google'].hidden,false);
 const retry=elements['retry-google'].click();await flush();assert.equal(pending.length,3,'loaded script reused; failed stylesheet retried');
 pending[2].onload();await flush();assert.equal(elements['google-button']['aria-busy'],'true');
 frameHeight=44;notify();await retry;assert.equal(elements['google-button']['aria-busy'],'false');assert.equal(rendered,1);assert.equal(elements['retry-google'].hidden,true);assert.equal(timers.size,0);
});
