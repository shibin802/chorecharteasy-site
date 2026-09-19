import { stripeClient, billingReady, isLiveBilling } from './billing.mjs';

export function subscriptionReady(env) {
  return billingReady(env) && env.SUBSCRIPTIONS_ENABLED === 'true'
    && /^price_/.test(env.STRIPE_SUBSCRIPTION_PRICE_ID || '') && /^prod_/.test(env.STRIPE_SUBSCRIPTION_PRODUCT_ID || '');
}
export async function subscriptionAccess(env, userId) {
  if (!subscriptionReady(env)) return { plan: 'free', status: 'none', entitlements: [] };
  const now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare("SELECT * FROM billing_subscriptions WHERE user_id = ? AND status = 'active' AND paid_until > ? ORDER BY paid_until DESC LIMIT 1").bind(userId, now).first();
  const customer = await env.DB.prepare('SELECT customer_id FROM billing_customers WHERE user_id=?').bind(userId).first();
  return row ? { billingAccount: Boolean(customer), plan: 'plus', status: 'active', entitlements: ['watermark_free_print'], expiresAt: row.paid_until, cancelAtPeriodEnd: Boolean(row.cancel_at_period_end), testMode: !isLiveBilling(env) }
    : { billingAccount: Boolean(customer), plan: 'free', status: 'none', entitlements: [] };
}
async function requireMember(request, env, h) {
  h.assertSameOrigin(request, env);
  if (!subscriptionReady(env)) throw new h.ApiError(503, 'billing_unavailable', 'Subscriptions are not available yet.');
  const me = await (await h.currentUser(new Request(request.url, { headers: request.headers }), env)).json();
  if (!me.authenticated) throw new h.ApiError(401, 'sign_in_required', 'Please sign in with Google first.');
  await h.checkRateLimit(env.DB, await h.pseudonymousBucket(request, env, 'subscription', me.user.id), 12, 3600, Math.floor(Date.now()/1000));
  return me;
}
async function monthlyPrice(env) {
  const price = await stripeClient(env).prices.retrieve(env.STRIPE_SUBSCRIPTION_PRICE_ID);
  const product = typeof price.product === 'string' ? price.product : price.product?.id;
  if (price.livemode !== isLiveBilling(env) || !price.active || product !== env.STRIPE_SUBSCRIPTION_PRODUCT_ID || price.type !== 'recurring' || price.recurring?.interval !== 'month' || price.recurring.interval_count !== 1 || price.currency !== 'usd' || !Number.isInteger(price.unit_amount) || price.unit_amount < 1) throw new Error('A valid monthly USD price matching the billing environment must be configured');
  return price;
}
export async function subscriptionPlan(request, env, h) {
  if (request.method !== 'GET') throw new h.ApiError(405, 'method_not_allowed', 'Use GET.');
  if (!subscriptionReady(env)) return h.jsonResponse({ok:true, enabled:false, amount:100, currency:'usd', interval:'month', testMode:!isLiveBilling(env)});
  const price = await monthlyPrice(env);
  return h.jsonResponse({ok:true, enabled:true, amount:price.unit_amount, currency:price.currency, interval:'month', testMode:!isLiveBilling(env)});
}
export async function subscribe(request, env, h) {
  if (request.method !== 'POST') throw new h.ApiError(405, 'method_not_allowed', 'Use POST.');
  const me = await requireMember(request, env, h);
  const stripe = stripeClient(env), price = await monthlyPrice(env), now = Math.floor(Date.now()/1000);
  let customer = await env.DB.prepare('SELECT * FROM billing_customers WHERE user_id = ?').bind(me.user.id).first();
  if (!customer) {
    const created = await stripe.customers.create({metadata:{application:'chorecharteasy',user_id:me.user.id}}, {idempotencyKey:`cce-customer-${me.user.id}`});
    if (created.livemode !== isLiveBilling(env)) throw new Error('Unexpected customer mode');
    await env.DB.prepare('INSERT INTO billing_customers (user_id,customer_id) VALUES (?,?) ON CONFLICT(user_id) DO NOTHING').bind(me.user.id,created.id).run();
    customer = await env.DB.prepare('SELECT * FROM billing_customers WHERE user_id = ?').bind(me.user.id).first();
  }
  // Query Stripe too: an earlier successful checkout may still be waiting for its webhook.
  const existing = await stripe.subscriptions.list({customer:customer.customer_id,status:'all',limit:100});
  if (existing.data.some(s=>!['canceled','incomplete_expired'].includes(s.status))) throw new h.ApiError(409,'subscription_exists','You already have a subscription. Manage it from your account.');
  if (customer.checkout_url && customer.checkout_expires_at > now) return h.jsonResponse({ok:true,url:customer.checkout_url,testMode:!isLiveBilling(env)});
  const claim = await env.DB.prepare('UPDATE billing_customers SET lock_until = ? WHERE user_id = ? AND lock_until < ?').bind(now+90,me.user.id,now).run();
  if (!claim.meta?.changes) throw new h.ApiError(409,'checkout_in_progress','Checkout is being prepared. Please try again shortly.');
  try {
    // Persist the attempt before contacting Stripe. Retries after a timeout reuse its
    // key; completed/expired sessions retire it so a new checkout gets a new key.
    let attempt = await env.DB.prepare('SELECT * FROM billing_checkout_attempts WHERE user_id=?').bind(me.user.id).first();
    if (!attempt || attempt.price_id !== price.id || (attempt.expires_at && attempt.expires_at <= now) || (!attempt.expires_at && attempt.created_at + 86500 <= now)) {
      attempt = { id: crypto.randomUUID(), price_id: price.id };
      await env.DB.prepare('INSERT INTO billing_checkout_attempts (user_id,id,price_id,created_at) VALUES (?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET id=excluded.id,price_id=excluded.price_id,created_at=excluded.created_at,checkout_id=NULL,expires_at=0').bind(me.user.id,attempt.id,price.id,now).run();
    }
    const origin = new URL(env.PUBLIC_ORIGIN).origin;
    const session = await stripe.checkout.sessions.create({mode:'subscription',customer:customer.customer_id,
      line_items:[{price:price.id,quantity:1}],client_reference_id:me.user.id,
      metadata:{application:'chorecharteasy',user_id:me.user.id},subscription_data:{metadata:{application:'chorecharteasy',user_id:me.user.id}},
      integration_identifier:'chorecharteasy_llqgpsod',success_url:`${origin}/account?subscription=returned`,cancel_url:`${origin}/pricing?checkout=cancelled`
    },{idempotencyKey:`cce-monthly-${attempt.id}`});
    if (session.livemode !== isLiveBilling(env) || !session.url?.startsWith('https://checkout.stripe.com/')) throw new Error('Unexpected checkout mode');
    await env.DB.prepare('UPDATE billing_checkout_attempts SET checkout_id=?,expires_at=? WHERE user_id=? AND id=?').bind(session.id,session.expires_at,me.user.id,attempt.id).run();
    await env.DB.prepare('UPDATE billing_customers SET checkout_id=?,checkout_url=?,checkout_expires_at=?,lock_until=0 WHERE user_id=?').bind(session.id,session.url,session.expires_at,me.user.id).run();
    return h.jsonResponse({ok:true,url:session.url,testMode:!isLiveBilling(env)});
  } catch(error) { await env.DB.prepare('UPDATE billing_customers SET lock_until=0 WHERE user_id=?').bind(me.user.id).run(); throw error; }
}
export async function billingPortal(request, env, h) {
  if(request.method!=='POST') throw new h.ApiError(405,'method_not_allowed','Use POST.');
  const me=await requireMember(request,env,h);
  const customer=await env.DB.prepare('SELECT customer_id FROM billing_customers WHERE user_id=?').bind(me.user.id).first();
  if(!customer) throw new h.ApiError(404,'no_subscription','No billing account yet.');
  const session=await stripeClient(env).billingPortal.sessions.create({customer:customer.customer_id,return_url:new URL('/account',env.PUBLIC_ORIGIN).href});
  if(!session.url?.startsWith('https://billing.stripe.com/')) throw new Error('Unexpected billing portal URL');
  return h.jsonResponse({ok:true,url:session.url});
}
export async function syncSubscription(env,id) {
  if(!subscriptionReady(env) || !/^sub_/.test(id || '')) return;
  // Retrieve current provider state instead of trusting out-of-order event snapshots.
  const observed=Date.now();
  const sub=await stripeClient(env).subscriptions.retrieve(id,{expand:['latest_invoice']});
  if(sub.livemode !== isLiveBilling(env) || sub.metadata?.application!=='chorecharteasy') return;
  const customerId=typeof sub.customer==='string'?sub.customer:sub.customer?.id;
  const owner=await env.DB.prepare('SELECT user_id FROM billing_customers WHERE customer_id=?').bind(customerId).first();
  if(!owner || owner.user_id!==sub.metadata.user_id) throw new Error('Subscription owner mismatch');
  const items=sub.items?.data || [];
  const item=items.length===1 && items[0];
  const product=typeof item?.price?.product==='string'?item.price.product:item?.price?.product?.id;
  const invoice=sub.latest_invoice;
  const paid=invoice && typeof invoice!=='string' && invoice.status==='paid';
  const valid=item?.price?.livemode === isLiveBilling(env) && item.price.currency === 'usd' && product===env.STRIPE_SUBSCRIPTION_PRODUCT_ID && item.price.recurring?.interval==='month' && item.price.recurring?.interval_count===1;
  const paidUntil=valid && paid && sub.status==='active' ? Number(item.current_period_end || 0) : 0;
  await env.DB.prepare(`INSERT INTO billing_subscriptions (id,user_id,customer_id,status,paid_until,cancel_at_period_end,observed_at) VALUES (?,?,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET status=excluded.status,paid_until=excluded.paid_until,cancel_at_period_end=excluded.cancel_at_period_end,observed_at=excluded.observed_at WHERE excluded.observed_at >= billing_subscriptions.observed_at`)
    .bind(sub.id,owner.user_id,customerId,sub.status,paidUntil,(sub.cancel_at_period_end || sub.cancel_at)?1:0,observed).run();
}
export async function subscriptionEvent(event,env) {
  if(event.type.startsWith('customer.subscription.')) { await syncSubscription(env,event.data.object.id); return true; }
  if(event.type.startsWith('invoice.')) {
    const invoice=event.data.object;
    const sub=invoice.parent?.subscription_details?.subscription || invoice.subscription;
    await syncSubscription(env,typeof sub==='string'?sub:sub?.id); return true;
  }
  if(event.type.startsWith('checkout.session.') && event.data.object.mode==='subscription') {
    const sub=event.data.object.subscription; await syncSubscription(env,typeof sub==='string'?sub:sub?.id);
    if (['checkout.session.completed','checkout.session.expired'].includes(event.type)) {
      await env.DB.prepare('UPDATE billing_customers SET checkout_id=NULL,checkout_url=NULL,checkout_expires_at=0 WHERE checkout_id=?').bind(event.data.object.id).run();
      await env.DB.prepare('DELETE FROM billing_checkout_attempts WHERE checkout_id=?').bind(event.data.object.id).run();
    }
    return true;
  }
  return false;
}
