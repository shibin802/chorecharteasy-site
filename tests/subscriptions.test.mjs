import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {subscriptionAccess,syncSubscription,subscribe,billingPortal,subscriptionPlan,subscriptionEvent} from '../functions/_lib/subscriptions.mjs';
const sql=new DatabaseSync(':memory:');
for(const file of ['0001_initial.sql','0005_subscriptions.sql','0006_checkout_attempts.sql'])sql.exec(readFileSync(new URL('../backend/migrations/'+file,import.meta.url),'utf8'));
sql.exec("INSERT INTO users VALUES ('u1','one@example.test','h1','active',0,0,NULL),('u2','two@example.test','h2','active',0,0,NULL)");
function prepare(q,v=[]){return {bind:(...a)=>prepare(q,a),first:async()=>sql.prepare(q).get(...v)||null,run:async()=>({meta:{changes:sql.prepare(q).run(...v).changes}})}}
const env={DB:{prepare},PUBLIC_ORIGIN:'https://example.test',STRIPE_TEST_ENABLED:'true',STRIPE_SECRET_KEY:'rk_test_fake',STRIPE_WEBHOOK_SECRET:'whsec_fake',STRIPE_PRICE_ID:'price_legacy',SUBSCRIPTIONS_ENABLED:'true',STRIPE_SUBSCRIPTION_PRICE_ID:'price_monthly',STRIPE_SUBSCRIPTION_PRODUCT_ID:'prod_plus'};
let latest,existing=[],payload,customer='cus_one';const end=Math.floor(Date.now()/1000)+86400;
const price={id:'price_monthly',product:'prod_plus',livemode:false,active:true,type:'recurring',unit_amount:100,currency:'usd',recurring:{interval:'month',interval_count:1}};
globalThis.fetch=async(input,init)=>{const url=String(input);if(url.includes('/v1/prices/'))return Response.json(price);if(url.includes('/v1/customers'))return Response.json({id:customer,livemode:false});if(url.includes('/v1/subscriptions/sub_'))return Response.json(latest);if(url.includes('/v1/subscriptions?'))return Response.json({data:existing});if(url.includes('/v1/checkout/sessions')){payload=new URLSearchParams(init.body);return Response.json({id:'cs_test_monthly',url:'https://checkout.stripe.com/c/test',livemode:false,expires_at:end});}if(url.includes('/v1/billing_portal/sessions')){payload=new URLSearchParams(init.body);return Response.json({url:'https://billing.stripe.com/test'});}throw Error(url);};
class ApiError extends Error{constructor(status,code,message){super(message);this.status=status;this.code=code}}
let signedIn=true,user='u1';const h={ApiError,assertSameOrigin:r=>{if(r.headers.get('Origin')!=='https://example.test')throw new ApiError(403,'origin','Wrong origin');},currentUser:async()=>Response.json({authenticated:signedIn,user:{id:user}}),checkRateLimit:async()=>{},pseudonymousBucket:async()=>'',jsonResponse:Response.json};
const req=(method='POST')=>new Request('https://example.test/api/billing/subscribe',{method,headers:{Origin:'https://example.test'}});
test('monthly checkout verifies price, user, origin and duplicate subscription; portal binds server customer',async()=>{
 signedIn=false;await assert.rejects(()=>subscribe(req(),env,h),{status:401});signedIn=true;
 await assert.rejects(()=>subscribe(new Request('https://example.test',{method:'POST'}),env,h),{status:403});
 const result=await subscribe(req(),env,h);assert.equal(result.status,200);assert.equal(payload.get('mode'),'subscription');assert.equal(payload.get('line_items[0][price]'),'price_monthly');assert.equal(payload.get('subscription_data[metadata][user_id]'),'u1');
 existing=[{status:'active'}];await assert.rejects(()=>subscribe(req(),env,h),{code:'subscription_exists'});existing=[];
 await billingPortal(req(),env,h);assert.equal(payload.get('customer'),'cus_one');user='u2';await assert.rejects(()=>billingPortal(req(),env,h),{status:404});user='u1';
 price.type='one_time';await assert.rejects(()=>subscriptionPlan(req('GET'),env,h));price.type='recurring';
});
test('verified paid subscription grants only its owner, survives scheduled cancellation, expires and revokes',async()=>{
 latest={id:'sub_monthly',customer:'cus_one',livemode:false,metadata:{application:'chorecharteasy',user_id:'u1'},status:'active',latest_invoice:{status:'paid'},items:{data:[{price,current_period_end:end}]}};
 await syncSubscription(env,'sub_monthly');assert.deepEqual((await subscriptionAccess(env,'u1')).entitlements,['watermark_free_print']);assert.equal((await subscriptionAccess(env,'u2')).plan,'free');
 latest.cancel_at_period_end=true;await syncSubscription(env,'sub_monthly');assert.equal((await subscriptionAccess(env,'u1')).cancelAtPeriodEnd,true);
 latest.items.data[0].current_period_end=1;await syncSubscription(env,'sub_monthly');assert.equal((await subscriptionAccess(env,'u1')).plan,'free');latest.items.data[0].current_period_end=end;
 latest.latest_invoice.status='open';await syncSubscription(env,'sub_monthly');assert.equal((await subscriptionAccess(env,'u1')).plan,'free');latest.latest_invoice.status='paid';
 latest.status='canceled';await subscriptionEvent({type:'customer.subscription.deleted',data:{object:{id:'sub_monthly',status:'active'}}},env);assert.equal((await subscriptionAccess(env,'u1')).plan,'free');
 latest.status='active';latest.metadata.user_id='u2';await assert.rejects(()=>syncSubscription(env,'sub_monthly'),/owner mismatch/);latest.metadata.user_id='u1';
 latest.items.data[0].price={...price,product:'prod_other'};await syncSubscription(env,'sub_monthly');assert.equal((await subscriptionAccess(env,'u1')).plan,'free');
 assert.equal((await subscriptionAccess({...env,SUBSCRIPTIONS_ENABLED:'false'},'u1')).plan,'free');
});
test('checkout attempts survive uncertain failures and rotate after finished sessions',async()=>{
 existing=[];signedIn=true;user='u1';
 sql.exec('DELETE FROM billing_checkout_attempts; UPDATE billing_customers SET checkout_id=NULL,checkout_url=NULL,checkout_expires_at=0,lock_until=0');
 const originalFetch=globalThis.fetch,keys=[];let fail=true,count=0;
 globalThis.fetch=async(input,init)=>{
  if(!String(input).includes('/v1/checkout/sessions'))return originalFetch(input,init);
  keys.push(new Headers(init.headers).get('idempotency-key'));
  if(fail)return Response.json({error:{message:'Try again',type:'api_error'}},{status:400});
  count++;
  return Response.json({id:'cs_attempt_'+count,url:'https://checkout.stripe.com/c/attempt'+count,livemode:false,expires_at:end});
 };
 try {
  await assert.rejects(()=>subscribe(req(),env,h));
  fail=false;await subscribe(req(),env,h);
  assert.equal(keys[0],keys[1],'retry must reuse the persisted attempt');
  await subscriptionEvent({type:'checkout.session.expired',data:{object:{id:'cs_attempt_1',mode:'subscription'}}},env);
  await subscribe(req(),env,h);assert.notEqual(keys[1],keys[2],'expired checkout must get a fresh attempt');
  // Delayed delivery for the old session must not remove the new attempt.
  await subscriptionEvent({type:'checkout.session.expired',data:{object:{id:'cs_attempt_1',mode:'subscription'}}},env);
  assert.equal(sql.prepare('SELECT checkout_id FROM billing_checkout_attempts WHERE user_id=?').get('u1').checkout_id,'cs_attempt_2');
  await subscriptionEvent({type:'checkout.session.completed',data:{object:{id:'cs_attempt_2',mode:'subscription'}}},env);
  await subscribe(req(),env,h);assert.notEqual(keys[2],keys[3],'completed checkout must get a fresh attempt');
 }finally{globalThis.fetch=originalFetch;}
});
