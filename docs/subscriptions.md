# Monthly Plus subscriptions

Free chart maker and randomizer printing includes a visible foreground text watermark. Google-authenticated users with an active Stripe sandbox subscription and a paid, unexpired invoice period receive `watermark_free_print`. Charts remain browser-local. Browser-side rendering is not tamper-proof: technical users can modify HTML/CSS; server-generated artifacts would be required for stronger enforcement.

## Configuration

Preview only: `SUBSCRIPTIONS_ENABLED=true`, `STRIPE_SUBSCRIPTION_PRICE_ID` identifies the current recurring monthly USD price and `STRIPE_SUBSCRIPTION_PRODUCT_ID` identifies the Plus product. Keep existing Stripe test key/webhook bindings. Preview rejects live keys and events; production rejects test keys and events. The old one-time integration test remains separate and does not grant Plus.

Current preview product: `prod_VHn3pnUbzKj9u6`; monthly price: `price_1UHDTqBwa0ypffEuFr1OA3IS` (USD 1/month).

To change pricing, create another recurring monthly USD Price on the same Plus product and update `STRIPE_SUBSCRIPTION_PRICE_ID` in preview bindings, then redeploy. The pricing page reads this price from the server. Existing subscriptions keep their original price until explicitly migrated; do not silently change existing subscriber billing. Finish or expire open checkouts before changing the configured Price.

Required restricted key permissions: Prices read, Checkout Sessions write, Customers write, Subscriptions read, Invoices read, Customer Portal write. No live payment, refund, payout or Connect access is required.

Webhook: checkout.session.completed/expired/async_payment_succeeded/async_payment_failed; customer.subscription.created/updated/deleted/paused/resumed; invoice.paid/payment_failed. The handler checks the signature and fetches the latest subscription from Stripe, verifies customer ownership and product, then records the paid-through date. Failed, canceled, expired, wrong-product or unpaid subscriptions cannot grant Plus. Return URLs never grant access.

The Stripe Customer Portal must allow cancellation at the end of the billing period. Account settings exposes it only for users with a Stripe customer. Refund requests are manually reviewed; no automatic refund API is enabled.

## Production

Use a separate production D1 database, never copy preview users, sessions, customers or entitlements into it. Keep preview keys and bindings unchanged.

- `STRIPE_MODE=live`, `STRIPE_LIVE_ENABLED=true`, `STRIPE_TEST_ENABLED=false`
- `PUBLIC_ORIGIN=https://chorecharteasy.com`, `SUBSCRIPTIONS_ENABLED=true`
- `STRIPE_SUBSCRIPTION_PRODUCT_ID=prod_VHn3pnUbzKj9u6`
- `STRIPE_SUBSCRIPTION_PRICE_ID=price_1UHHBXJBSusIhXSUrf6dkcOM` (verified in the live dashboard: USD 1/month)
- Encrypt `STRIPE_SECRET_KEY` (restricted live key) and `STRIPE_WEBHOOK_SECRET` in production bindings.
- Register `https://chorecharteasy.com/api/billing/webhook` with the subscription events above; align its API version with the pinned Stripe SDK.
- Configure the live Customer Portal to allow cancellation at period end, payment method updates and invoice history.
- Enable production Google login with the production origin and separate encrypted SESSION_SECRET/RATE_LIMIT_SALT.

Legacy one-time test checkout remains disabled in live mode. Pricing hides the sandbox label for live payments. Keep `STRIPE_LIVE_ENABLED=false` until keys, webhooks, portal, authentication, and the deployment are ready. Roll back by disabling that flag and redeploying. The integration does not enable automatic tax collection; review applicable registrations before enabling Stripe Tax collection.
