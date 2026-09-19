// Identity, plan and payment amounts are always supplied by trusted server state.
export async function recordActivity(env, event) {
  const now = Math.floor(Date.now()/1000);
  await env.DB.prepare(`INSERT INTO user_activity
    (id,user_id,event_type,source,resource_id,subscription_id,status,amount,currency,plan,paper,starter,task_count,livemode,occurred_at,recorded_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING`)
    .bind(event.id,event.userId,event.type,event.source,event.resourceId??null,event.subscriptionId??null,
      event.status??null,event.amount??null,event.currency??null,event.plan??null,event.paper??null,
      event.starter??null,event.taskCount??null,event.live?1:0,event.at??now,now).run();
}

export async function printActivity(request,env,h) {
  if(request.method!=='POST') throw new h.ApiError(405,'method_not_allowed','Use POST.');
  h.assertSameOrigin(request,env);
  const me=await (await h.currentUser(new Request(request.url,{headers:request.headers}),env)).json();
  if(!me.authenticated) throw new h.ApiError(401,'sign_in_required','Please sign in first.');
  const data=await h.readActivity(request);
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.id||'') ||
     !['print_preview_opened','print_requested'].includes(data.type) ||
     !['letter','a4'].includes(data.paper) || !['weekly','morning','blank'].includes(data.starter) ||
     !Number.isInteger(data.taskCount) || data.taskCount<0 || data.taskCount>100)
    throw new h.ApiError(400,'invalid_activity','Invalid print event.');
  const now=Math.floor(Date.now()/1000);
  await h.checkRateLimit(env.DB,await h.pseudonymousBucket(request,env,'print_activity',me.user.id),120,3600,now);
  await recordActivity(env,{id:`print:${me.user.id}:${data.id}`,userId:me.user.id,type:data.type,source:'browser',
    paper:data.paper,starter:data.starter,taskCount:data.taskCount,plan:me.membership?.plan==='plus'?'plus':'free',live:h.isLiveBilling(env)});
  return h.jsonResponse({ok:true});
}

export async function recordBillingEvent(event,env) {
  const obj=event.data.object;
  const customer=typeof obj.customer==='string'?obj.customer:obj.customer?.id;
  if(!customer || !event.id) return;
  if(!event.type.startsWith('invoice.') && obj.metadata?.application!=='chorecharteasy') return;
  const owner=await env.DB.prepare('SELECT user_id FROM billing_customers WHERE customer_id=?').bind(customer).first();
  if(!owner) return;
  const sub=obj.parent?.subscription_details?.subscription || obj.subscription;
  await recordActivity(env,{id:`stripe:${event.id}`,userId:owner.user_id,type:event.type,source:'stripe',resourceId:obj.id,
    subscriptionId:event.type.startsWith('customer.subscription.')?obj.id:(typeof sub==='string'?sub:sub?.id),
    status:obj.payment_status||obj.status,amount:event.type==='invoice.paid'?obj.amount_paid:(obj.amount_total??obj.amount_due),
    currency:obj.currency,live:event.livemode,at:event.created});
}
