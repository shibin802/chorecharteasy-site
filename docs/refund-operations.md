# Preview refund request review

Requests are stored in the preview D1 refund_requests table, not emailed automatically. The customer sees the saved ID and status. The current implementation does not execute Stripe refunds and needs no refund-write permission. Review this queue manually in Cloudflare D1 console; there is no merchant admin UI yet.

```sql
SELECT r.id, u.email, r.invoice_id, r.reason, r.status, r.created_at
FROM refund_requests r JOIN users u ON u.id=r.user_id
WHERE r.status='pending' ORDER BY r.created_at;
```

Verify the invoice and customer in the Stripe sandbox. For a test approval or rejection, update the selected request by its exact ID using bound parameters. Set status to approved or declined, supply a customer-visible resolution, and updated_at to the current Unix timestamp. Never mark refunded until Stripe independently confirms a completed refund. Approval alone performs no financial action and changes no membership. Before real billing, define refund terms, merchant notifications, a secured review interface, and refund/entitlement reconciliation.
