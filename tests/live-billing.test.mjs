import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {billingReady,testBillingReady,testWebhook,testCheckout} from '../functions/_lib/billing.mjs';
import {subscriptionPlan} from '../functions/_lib/subscriptions.mjs';
import {eligibleInvoice} from '../functions/_lib/refunds.mjs';
const env={STRIPE_MODE:'live',STRIPE_LIVE_ENABLED:'true',STRIPE_SECRET_KEY:'rk_live_fixture',STRIPE_WEBHOOK_SECRET:'whsec_fixture',PUBLIC_ORIGIN:'https://chorecharteasy.com',DB:{},SUBSCRIPTIONS_ENABLED:'true',STRIPE_SUBSCRIPTION_PRICE_ID:'price_live',STRIPE_SUBSCRIPTION_PRODUCT_ID:'prod_plus'};
class ApiError extends Error{constructor(status,code,message){super(message);this.status=status;this.code=code;}}
const h={ApiError,jsonResponse:Response.json,assertSameOrigin:()=>{}};
test('live billing requires explicit opt-in, matching key and production origin; old checkout stays disabled',async()=>{
 assert.equal(billingReady(env),true);assert.equal(testBillingReady(env),false);
 for(const change of [{STRIPE_LIVE_ENABLED:'false'},{STRIPE_MODE:'invalid'},{STRIPE_SECRET_KEY:'rk_test_fixture'},{PUBLIC_ORIGIN:'https://feat-google-stripe.chorecharteasy.pages.dev'},{STRIPE_TEST_ENABLED:'true'}])assert.equal(billingReady({...env,...change}),false);
 await assert.rejects(()=>testCheckout(new Request(env.PUBLIC_ORIGIN,{method:'POST'}),env,h),{status:503});
});
test('signed live webhook accepted; signed sandbox event and invalid signature rejected',async()=>{
 async function send(livemode,valid=true){const raw=JSON.stringify({id:'evt_mode',type:'product.updated',livemode,data:{object:{}}});const t=Math.floor(Date.now()/1000);const signature=createHmac('sha256',env.STRIPE_WEBHOOK_SECRET).update(`${t}.${raw}`).digest('hex');return testWebhook(new Request(env.PUBLIC_ORIGIN,{method:'POST',body:raw,headers:{'stripe-signature':`t=${t},v1=${valid?signature:'bad'}`}}),env,h);}
 assert.equal((await send(true)).status,200);await assert.rejects(()=>send(false),{code:'wrong_mode'});await assert.rejects(()=>send(true,false),{code:'invalid_signature'});
});
test('live price must be monthly USD for the configured product and returns real mode',async()=>{
 const original=globalThis.fetch;
 const price={id:'price_live',product:'prod_plus',active:true,livemode:true,type:'recurring',currency:'usd',unit_amount:100,recurring:{interval:'month',interval_count:1}};
 globalThis.fetch=async()=>Response.json(price);
 try{const request=new Request(env.PUBLIC_ORIGIN);const plan=await(await subscriptionPlan(request,env,h)).json();assert.equal(plan.testMode,false);assert.equal(plan.amount,100);price.livemode=false;await assert.rejects(()=>subscriptionPlan(request,env,h));}finally{globalThis.fetch=original;}
});
test('refund eligibility enforces invoice ownership and environment',()=>{
 const invoice={customer:'cus_owner',livemode:true,status:'paid',amount_paid:100};
 assert.equal(eligibleInvoice(invoice,'cus_owner',true),true);assert.equal(eligibleInvoice(invoice,'cus_other',true),false);assert.equal(eligibleInvoice(invoice,'cus_owner',false),false);assert.equal(eligibleInvoice({...invoice,livemode:false},'cus_owner',true),false);
});
