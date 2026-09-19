import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {billingHistory,requestRefund} from '../functions/_lib/refunds.mjs';
const sql=new DatabaseSync(':memory:');
for(const file of ['0001_initial.sql','0005_subscriptions.sql','0007_refund_requests.sql'])sql.exec(readFileSync(new URL('../backend/migrations/'+file,import.meta.url),'utf8'));
sql.exec("INSERT INTO users VALUES ('u1','one@example.test','h1','active',0,0,NULL),('u2','two@example.test','h2','active',0,0,NULL); INSERT INTO billing_customers(user_id,customer_id) VALUES ('u1','cus_one'),('u2','cus_two')");
function prepare(q,v=[]){return {bind:(...a)=>prepare(q,a),first:async()=>sql.prepare(q).get(...v)||null,all:async()=>({results:sql.prepare(q).all(...v)}),run:async()=>({meta:{changes:sql.prepare(q).run(...v).changes}})}}
const env={DB:{prepare},PUBLIC_ORIGIN:'https://example.test',STRIPE_TEST_ENABLED:'true',STRIPE_SECRET_KEY:'rk_test_fake',STRIPE_WEBHOOK_SECRET:'whsec_fake',STRIPE_PRICE_ID:'price_legacy',SUBSCRIPTIONS_ENABLED:'true',STRIPE_SUBSCRIPTION_PRICE_ID:'price_monthly',STRIPE_SUBSCRIPTION_PRODUCT_ID:'prod_plus'};
class ApiError extends Error{constructor(status,code,message){super(message);this.status=status;this.code=code}}
let signedIn=true,user='u1';const h={ApiError,assertSameOrigin:r=>{if(r.headers.get('Origin')!=='https://example.test')throw new ApiError(403,'origin','Wrong origin');},currentUser:async()=>Response.json({authenticated:signedIn,user:{id:user}}),checkRateLimit:async()=>{},pseudonymousBucket:async()=>'',jsonResponse:Response.json,readJson:r=>r.json()};
let invoice={id:'in_one',customer:'cus_one',livemode:false,status:'paid',amount_paid:100,currency:'usd',created:1};
globalThis.fetch=async input=>{const url=String(input);if(url.includes('/v1/invoices/in_'))return Response.json(invoice);if(url.includes('/v1/invoices?'))return Response.json({data:[invoice],has_more:false});throw Error(url);};
const req=(body={invoiceId:'in_one',reason:'Please review this duplicate payment.'},origin='https://example.test')=>new Request('https://example.test/api/billing/refund-requests',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
test('refund requests authenticate, isolate owners, validate invoices, persist once and list only own history',async()=>{
 signedIn=false;await assert.rejects(()=>requestRefund(req(),env,h),{status:401});signedIn=true;
 await assert.rejects(()=>requestRefund(req(undefined,'https://evil.test'),env,h),{status:403});
 user='u2';await assert.rejects(()=>requestRefund(req(),env,h),{status:404});user='u1';
 for(const change of [{livemode:true},{status:'open'},{amount_paid:0}]){const original={...invoice};Object.assign(invoice,change);await assert.rejects(()=>requestRefund(req(),env,h),{status:404});invoice=original;}
 await assert.rejects(()=>requestRefund(req({invoiceId:'in_one',reason:'x'}),env,h),{status:422});
 const a=await (await requestRefund(req(),env,h)).json();const b=await(await requestRefund(req(),env,h)).json();assert.equal(a.request.id,b.request.id);assert.equal(a.request.status,'pending');
 let result=await(await billingHistory(new Request('https://example.test/api/billing/history'),env,h)).json();assert.equal(result.requests.length,1);assert.equal(result.invoices[0].amount,100);
 user='u2';result=await(await billingHistory(new Request('https://example.test/api/billing/history'),env,h)).json();assert.equal(result.requests.length,0);assert.equal(result.invoices.length,0);
});
