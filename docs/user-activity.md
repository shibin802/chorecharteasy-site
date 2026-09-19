# User order and print activity

Cloudflare → Workers & Pages → D1 → chorecharteasy-production → Studio.
`user_activity` stores events; `user_activity_details` joins account email and UTC time.

```sql
SELECT email,event_type,occurred_at_utc,resource_id,subscription_id,status,
       amount,currency,plan,paper,starter,task_count
FROM user_activity_details WHERE livemode=1
ORDER BY occurred_at DESC, recorded_at DESC LIMIT 100;
```

```sql
SELECT * FROM user_activity_details
WHERE email = 'replace-with-customer-email'
ORDER BY occurred_at DESC;
```

- `checkout.created`: server created checkout. `checkout.opened`: reused an unexpired checkout. Neither proves payment.
- `invoice.paid`: verified Stripe payment, including renewal. Amount is in minor currency units (USD 100 = $1). Do not sum both checkout amounts and invoice amounts.
- `invoice.payment_failed`, `checkout.session.*`, `customer.subscription.*`: verified provider events, preserving original provider occurrence time. Events can arrive out of order; current entitlement remains in `billing_subscriptions`.
- `print_preview_opened`: signed-in user opened preview.
- `print_requested`: signed-in user clicked Print or save PDF; not proof of actual printing, PDF saving, or dialog confirmation. Browser telemetry is best effort; network failures, blockers, direct browser Ctrl+P, or guest usage may not produce records.
- `plan` on print events comes from the authenticated server membership, not client input. Browser event attributes are still client-reported, not a fraud-proof usage meter.
- No child names, titles, task contents, raw IPs, card data or private checkout URLs are collected. Guests are not tracked by this feature.
- Collection begins with this deployment; past prints cannot be recovered. Stripe retries are deduplicated by event ID, browser retries by user + event ID.
- Access is restricted to database administrators; no public activity-read endpoint. Account deletion cascades these records. Review retention periodically alongside account/billing deletion obligations.
