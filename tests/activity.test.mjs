import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {printActivity,recordBillingEvent} from '../functions/_lib/activity.mjs';
const sql=new DatabaseSync(':memory:');
for(const f of ['0001_initial.sql','0005_subscriptions.sql','0008_user_activity.sql']) sql.exec(readFileSync(new URL('../backend/migrations/'+f,import.meta.url),'utf8'));
sql.exec("INSERT INTO users VALUES ('u1','test@example.test','hash','active',0,0,NULL); INSERT INTO billing_customers(user_id,customer_id) VALUES ('u1','cus_1')");
function prepare(q,v=[]){return {bind:(...a)=>prepare(q,a),first:async()=>sql.prepare(q).get(...v)||null,run:async()=>sql.prepare(q).run(...v)}}
const env={DB:{prepare}};
let authenticated=true;
const h={ApiError:class extends Error{constructor(status,code){super(code);this.status=status;}},assertSameOrigin:r=>{if(r.headers.get('Origin')!=='https://example.test')throw new Error('origin');},currentUser:async()=>Response.json({authenticated,user:{id:'u1'},membership:{plan:'plus'}}),readActivity:r=>r.json(),checkRateLimit:async()=>{},pseudonymousBucket:async()=>'',isLiveBilling:()=>true,jsonResponse:Response.json};
const data={id:crypto.randomUUID(),type:'print_requested',paper:'a4',starter:'weekly',taskCount:5};
const req=d=>new Request('https://example.test/api/activity/print',{method:'POST',headers:{Origin:'https://example.test','Content-Type':'application/json'},body:JSON.stringify(d)});
test('print records bind to authenticated identity and server plan; retries deduplicate; payment events cannot be forged',async()=>{
 authenticated=false;await assert.rejects(()=>printActivity(req(data),env,h),{status:401});authenticated=true;
 await assert.rejects(()=>printActivity(new Request('https://example.test',{method:'POST'}),env,h),/origin/);
 await assert.rejects(()=>printActivity(req({...data,type:'invoice.paid'}),env,h),{status:400});
 await assert.rejects(()=>printActivity(req({...data,taskCount:-1}),env,h),{status:400});
 await printActivity(req({...data,userId:'attacker',plan:'free'}),env,h);await printActivity(req(data),env,h);
 const rows=sql.prepare('SELECT * FROM user_activity_details').all();assert.equal(rows.length,1);assert.equal(rows[0].user_id,'u1');assert.equal(rows[0].plan,'plus');assert.equal(rows[0].email,'test@example.test');assert.equal(rows[0].amount,null);
});
test('verified Stripe records retain invoice amounts and idempotency without mixing unknown customers',async()=>{
 const event={id:'evt_paid',type:'invoice.paid',created:123,livemode:true,data:{object:{id:'in_1',customer:'cus_1',amount_paid:100,currency:'usd',status:'paid',parent:{subscription_details:{subscription:'sub_1'}}}}};
 await recordBillingEvent(event,env);await recordBillingEvent(event,env);
 const rows=sql.prepare("SELECT * FROM user_activity WHERE source='stripe'").all();assert.equal(rows.length,1);assert.equal(rows[0].amount,100);assert.equal(rows[0].subscription_id,'sub_1');assert.equal(rows[0].occurred_at,123);
 await recordBillingEvent({...event,id:'evt_other',data:{object:{...event.data.object,customer:'cus_unknown'}}},env);
 assert.equal(sql.prepare("SELECT COUNT(*) n FROM user_activity WHERE source='stripe'").get().n,1);
});

test('randomizer print uses browser-selected paper without collecting assignment content',async()=>{
 await printActivity(req({...data,id:crypto.randomUUID(),paper:'browser-default',starter:'randomizer',taskCount:12}),env,h);
 const row=sql.prepare("SELECT * FROM user_activity WHERE starter='randomizer'").get();
 assert.equal(row.paper,'browser-default');assert.equal(row.task_count,12);
});
