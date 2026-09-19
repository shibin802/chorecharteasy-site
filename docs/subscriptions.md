# Monthly Plus preview

Free chart maker and randomizer printing includes a visible foreground text watermark. Google-authenticated users with an active Stripe sandbox subscription and a paid, unexpired invoice period receive `watermark_free_print`. Charts remain browser-local. Browser-side rendering is not tamper-proof: technical users can modify HTML/CSS; server-generated artifacts would be required for stronger enforcement.

## Configuration

Preview only: `SUBSCRIPTIONS_ENABLED=true`, `STRIPE_SUBSCRIPTION_PRICE_ID` identifies the current recurring monthly USD price and `STRIPE_SUBSCRIPTION_PRODUCT_ID` identifies the Plus product. Keep existing Stripe test key/webhook bindings. The runtime rejects live keys and events. The old one-time integration test remains separate and does not grant Plus.

Current preview product: `prod_VHn3pnUbzKj9u6`; monthly price: `price_1UHDTqBwa0ypffEuFr1OA3IS` (USD 1/month).

To change pricing, create another recurring monthly USD Price on the same Plus product and update `STRIPE_SUBSCRIPTION_PRICE_ID` in preview bindings, then redeploy. The pricing page reads this price from the server. Existing subscriptions keep their original price until explicitly migrated; do not silently change existing subscriber billing. Finish or expire open checkouts before changing the configured Price.

Required restricted key permissions: Prices read, Checkout Sessions write, Customers write, Subscriptions read, Invoices read, Customer Portal write. No live payment, refund, payout or Connect access is required.

Webhook: checkout.session.completed/expired/async_payment_succeeded/async_payment_failed; customer.subscription.created/updated/deleted/paused/resumed; invoice.paid/payment_failed. The handler checks the signature and fetches the latest subscription from Stripe, verifies customer ownership and product, then records the paid-through date. Failed, canceled, expired, wrong-product or unpaid subscriptions cannot grant Plus. Return URLs never grant access.

The Stripe Customer Portal must allow cancellation at the end of the billing period. Account settings exposes it only for users with a Stripe customer. Production rollout, live credentials and real-payment refund/tax policy are separate from this preview.
