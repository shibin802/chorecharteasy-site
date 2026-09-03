# Stripe Checkout activation

Status: **[NEEDS_REVIEW]**. The paid offer and Checkout Session flow are implemented, but production payments stay disabled until the launch checks below are complete.

## Implemented

- The home page presents the **ChoreChartEasy Plus Starter Pack** at **$4.99 USD**, paid once.
- `POST /api/checkout` creates a Stripe-hosted Checkout Session and returns only its `checkout.stripe.com` URL.
- `/checkout-success` verifies the returned Checkout Session with Stripe before showing a confirmed state.
- `/checkout-cancelled` returns customers to Plus or the free maker.
- Missing configuration keeps the button disabled and the API returns `503 checkout_unavailable`.
- No secret key is present in source code, client JavaScript, or the API response.

## Production variables

Set these in the Cloudflare Pages **Production** environment. Keep preview payments disabled until a separate Stripe test key and test Price are deliberately configured.

| Variable | Value |
| --- | --- |
| `PUBLIC_ORIGIN` | `https://chorecharteasy.com` |
| `STRIPE_SECRET_KEY` | Stripe production secret or restricted key; store as an encrypted secret |
| `STRIPE_PRICE_ID` | Production one-time Price ID for exactly `$4.99 USD` |
| `PAYMENTS_ENABLED` | Keep `false` until every launch check passes; then set `true` |

Email sign-in must be enabled before payments:

| Variable | Value |
| --- | --- |
| `AUTH_ENABLED` | Keep `false` until login email delivery is tested; then set `true` |
| `AUTH_DEV_BYPASS` | `false` in production |
| `AUTH_FROM_EMAIL` | A sender on the verified domain, such as `ChoreChartEasy <login@chorecharteasy.com>` |
| `RESEND_API_KEY` | Resend API key stored as an encrypted secret |
| `SESSION_SECRET` | Random secret of at least 32 bytes, stored as an encrypted secret |
| `RATE_LIMIT_SALT` | Separate random secret of at least 32 bytes, stored as an encrypted secret |

The restricted key needs **Checkout Sessions: Write** to create sessions and **Checkout Sessions: Read** to confirm them. It also needs **Prices: Read** so the server can verify the configured Price is active, one-time, USD, and exactly $4.99 before creating a session. Product, Price, Payment Link, and Subscription permissions alone do not authorize dynamic Checkout Sessions.

## Launch checks

1. Confirm the three premium themes, reward-goal print strip, and household-use terms are actually deliverable.
2. Update the Privacy Policy for account email, sessions, Resend, Stripe, retention, deletion requests, and user rights. Replace the current free-only Terms and Refund Policy with reviewed language covering seller identity, digital delivery, refunds, support, and mandatory consumer rights.
3. Create the matching production Product and one-time `$4.99 USD` Price in Stripe.
4. Verify the sender domain in Resend, configure the login variables, enable `AUTH_ENABLED`, and complete one email sign-in.
5. Add the Stripe variables while leaving `PAYMENTS_ENABLED=false`.
6. Deploy and confirm `/api/membership` reports accounts enabled and payments disabled.
7. Enable payments, sign in, complete one low-value live purchase, verify the browser reaches `/checkout-success`, and confirm the payment in Stripe.
8. Refund that launch verification payment from Stripe if it is only a test.

## Current scope limit

The success page verifies the Checkout Session for payment-flow validation. Durable entitlements and automated fulfillment still require a signed Stripe webhook and server-side order record before Plus assets should be protected as paid downloads.
