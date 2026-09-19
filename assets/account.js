import { api, loginUrl } from './auth-common.js';
import './auth-nav.js';
const status = document.getElementById('account-status');
async function load() {
  try {
    const me = await api('/api/me');
    if (!me.authenticated) { location.replace(loginUrl('/account')); return; }
    document.getElementById('account-email').textContent = me.user.email;
    document.getElementById('account-id').textContent = me.user.id;
    document.getElementById('account-avatar').textContent = me.user.email.charAt(0).toUpperCase();
    document.getElementById('account-details').hidden = false;
    document.getElementById('manage-billing').hidden = !me.billingAccount;
    document.getElementById('refresh-plan').hidden = !new URLSearchParams(location.search).has('subscription');
    document.getElementById('account-plan').textContent = me.membership.plan === 'plus' ? 'Plus' : 'Free';
    document.getElementById('upgrade-plan').hidden = me.membership.plan === 'plus';
    document.getElementById('subscription-status').textContent = me.membership.plan === 'plus' ? (me.membership.cancelAtPeriodEnd ? 'Ends ' : 'Current paid period ends ') + new Date(me.membership.expiresAt * 1000).toLocaleDateString() : 'Free prints include a watermark. Upgrade to Plus to remove it.';
    document.getElementById('billing-details').hidden = false;
    loadBilling();
    status.textContent = new URLSearchParams(location.search).has('subscription') && me.membership.plan !== 'plus' ? 'Waiting for payment confirmation. Refresh your plan in a moment.' : '';
  } catch { status.textContent = 'Your account could not load. Please refresh to try again.'; }
}
document.getElementById('sign-out').addEventListener('click', async () => {
  try { await api('/api/logout', {}); location.assign('/'); }
  catch (error) { status.textContent = error.message; }
});


document.getElementById('refresh-plan').addEventListener('click', load);
document.getElementById('manage-billing').addEventListener('click', async () => { try { const result=await api('/api/billing/portal',{}); if(new URL(result.url).origin !== 'https://billing.stripe.com') throw new Error('Unable to open billing.'); location.assign(result.url); } catch(error) {status.textContent=error.message;} });

const billingStatus=document.getElementById('billing-status');
const refundForm=document.getElementById('refund-form');
let selectedInvoice=null;
const money=i=>new Intl.NumberFormat('en-US',{style:'currency',currency:i.currency}).format(i.amount/100);
const date=seconds=>new Date(seconds*1000).toLocaleDateString();
function textElement(tag,text){const el=document.createElement(tag);el.textContent=text;return el;}
async function loadBilling(){
  const refresh=document.getElementById('reload-billing');refresh.disabled=true;
  billingStatus.textContent='Loading payments…';
  try{
    const data=await api('/api/billing/history');
    const list=document.getElementById('payment-list');list.replaceChildren();
    for(const invoice of data.invoices){
      const row=textElement('article','');row.className='payment-row';
      row.append(textElement('h3',`${money(invoice)} · ${invoice.status}`),textElement('p',`${date(invoice.created)} · ${invoice.number || invoice.id}`));
      const existing=data.requests.find(r=>r.invoice_id===invoice.id);
      if(existing)row.append(textElement('p',`Refund request: ${existing.status}`));
      else if(invoice.canRequest){
        const button=textElement('button','Request refund');button.type='button';button.className='button button-secondary';
        button.addEventListener('click',()=>{selectedInvoice=invoice.id;refundForm.hidden=false;document.getElementById('refund-payment').textContent=`${money(invoice)} · ${invoice.number || invoice.id}`;document.getElementById('refund-reason').focus();});row.append(button);
      }
      list.append(row);
    }
    const history=document.getElementById('refund-history');history.replaceChildren();
    if(data.requests.length)history.append(textElement('h3','Your refund requests'));
    for(const r of data.requests){const row=textElement('article','');row.className='payment-row';row.append(textElement('p',`${r.status === 'pending' ? 'Pending review' : r.status} · ${date(r.created_at)}`),textElement('p',`Request #${r.id}`));if(r.resolution)row.append(textElement('p',r.resolution));history.append(row);}
    billingStatus.textContent=data.invoices.length ? (data.hasMore ? 'Showing your latest 24 invoices.' : '') : 'No payments yet.';
  }catch(error){billingStatus.textContent='Payments could not load. '+error.message;}
  finally{refresh.disabled=false;}
}
document.getElementById('reload-billing').addEventListener('click',loadBilling);
document.getElementById('cancel-refund').addEventListener('click',()=>{refundForm.hidden=true;selectedInvoice=null;refundForm.reset();});
refundForm.addEventListener('submit',async event=>{
  event.preventDefault();if(!selectedInvoice)return;
  const button=document.getElementById('submit-refund');button.disabled=true;
  try{const result=await api('/api/billing/refund-requests',{invoiceId:selectedInvoice,reason:document.getElementById('refund-reason').value});refundForm.hidden=true;refundForm.reset();selectedInvoice=null;await loadBilling();billingStatus.textContent=`Request saved. Your request number is ${result.request.id}. Status: ${result.request.status}. No refund has been issued.`;}
  catch(error){billingStatus.textContent=error.message;}
  finally{button.disabled=false;}
});
load();
