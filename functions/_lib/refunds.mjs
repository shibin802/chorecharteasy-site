import { stripeClient } from './billing.mjs';
import { subscriptionReady } from './subscriptions.mjs';

async function owner(request, env, h) {
  if (!subscriptionReady(env)) throw new h.ApiError(503, 'billing_unavailable', 'Billing is unavailable.');
  if (request.method !== 'GET') h.assertSameOrigin(request, env);
  const me = await (await h.currentUser(new Request(request.url, {headers:request.headers}), env)).json();
  if (!me.authenticated) throw new h.ApiError(401, 'sign_in_required', 'Please sign in first.');
  await h.checkRateLimit(env.DB, await h.pseudonymousBucket(request, env, 'billing-history', me.user.id), 60, 3600, Math.floor(Date.now()/1000));
  const customer = await env.DB.prepare('SELECT customer_id FROM billing_customers WHERE user_id=?').bind(me.user.id).first();
  return {userId:me.user.id, customerId:customer?.customer_id};
}
export function eligibleInvoice(invoice, customerId) {
  return Boolean(customerId && invoice.customer === customerId && !invoice.livemode && invoice.status === 'paid' && invoice.amount_paid > 0);
}
export async function billingHistory(request, env, h) {
  if(request.method !== 'GET') throw new h.ApiError(405,'method_not_allowed','Use GET.');
  const {userId,customerId} = await owner(request,env,h);
  const requests = await env.DB.prepare('SELECT id,invoice_id,status,created_at,resolution FROM refund_requests WHERE user_id=? ORDER BY created_at DESC LIMIT 100').bind(userId).all();
  const invoices = customerId ? await stripeClient(env).invoices.list({customer:customerId,limit:24}) : {data:[],has_more:false};
  return h.jsonResponse({ok:true,testMode:true,hasMore:invoices.has_more,requests:requests.results,invoices:invoices.data.filter(i=>i.customer===customerId && !i.livemode).map(i=>({id:i.id,number:i.number,amount:i.amount_paid,currency:i.currency,status:i.status,created:i.created,canRequest:eligibleInvoice(i,customerId)}))});
}
export async function requestRefund(request, env, h) {
  if(request.method !== 'POST') throw new h.ApiError(405,'method_not_allowed','Use POST.');
  const {userId,customerId} = await owner(request,env,h);
  const body = await h.readJson(request);
  if(typeof body.invoiceId !== 'string' || !/^in_[a-zA-Z0-9]+$/.test(body.invoiceId) || typeof body.reason !== 'string' || body.reason.trim().length<10 || body.reason.trim().length>1000) throw new h.ApiError(422,'invalid_request','Choose a payment and describe the issue in 10–1,000 characters.');
  if(!customerId) throw new h.ApiError(404,'payment_not_found','Payment not found.');
  const invoice = await stripeClient(env).invoices.retrieve(body.invoiceId);
  if(!eligibleInvoice(invoice,customerId)) throw new h.ApiError(404,'payment_not_found','An eligible paid invoice was not found.');
  const id=crypto.randomUUID(),now=Math.floor(Date.now()/1000);
  await env.DB.prepare("INSERT INTO refund_requests (id,user_id,invoice_id,reason,status,created_at,updated_at) VALUES (?,?,?,?,'pending',?,?) ON CONFLICT(invoice_id) DO NOTHING").bind(id,userId,invoice.id,body.reason.trim(),now,now).run();
  const saved=await env.DB.prepare('SELECT id,status,created_at FROM refund_requests WHERE invoice_id=? AND user_id=?').bind(invoice.id,userId).first();
  return h.jsonResponse({ok:true,testMode:true,request:saved});
}
