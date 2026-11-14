# Techniq portal foundation

The admin portal is deployed at https://techniqskinandbeauty.com/portal/. Manual customer, consultation, availability, and promotion-draft workflows are available; paid booking and messaging are not yet connected.

## Setup

1. Confirm that `techniqskinandbeautyllc@gmail.com` is the intended Supabase administrator. This is the address currently specified by the existing intake admin page. If it differs, update it in both `schema.sql` and `portal.js` before setup.
2. Back up and inspect the existing Supabase project and its `client_intake_forms` policies. The old `techniq_secure_intake_setup.sql` in this workspace is empty; this migration does not change existing intake security or data.
3. The portal tables in `schema.sql` have been created in the existing Supabase project and are protected by row-level security for the authorized authenticated email.
4. Publish the `portal/` directory with the website, and visit `/portal/`. Sign in with the existing Supabase administrator account. Verify that another account cannot read or write the portal tables, and verify the existing intake table is separately protected.

## Available

Customer profiles and consent flag; manual visit notes; matching intake count by email with a link to the existing intake dashboard; manual consultation records and status; editable promotion drafts; customer consultation history and dashboard shortcuts; saved placeholder price and follow-up settings. Matching by email is informational, not a verified identity link. No data is automatically imported from historical forms or orders.

## Still required

Public consultation booking, availability and payment holds; Square checkout/webhooks and reconciliation; shared editable product catalog and order analytics; Google authorization and Meet creation; Brevo transactional and promotional delivery with unsubscribe synchronization; Pushover alerts; durable scheduled jobs; automatic intake association; production rollout and end-to-end testing. The values in Settings do not yet affect live prices or send messages. Promotion drafts cannot be sent. Do not store provider secrets in browser files or this repository.

The existing product checkout function source is in `supabase/functions/create-square-checkout/index.ts`. It validates product and variant prices server-side against a hard-coded catalog. Keep it synchronized with `products.js` until a managed catalog replaces both. Existing checkout shipping rules differ slightly from storefront estimates and require reconciliation. Product JSON-LD is generated client-side; Google indexing and rich results are not guaranteed.

## Integration observations (November 2026)

The existing project contains `create-square-checkout`; its source and payment verification still need review before extending checkout. Pushover requires verification of the account email before creating an application token. Its device list showed only an offline iPad; register the intended phone and verify delivery before enabling alerts. No integration secrets should be stored in the website files.

The portal database migration and availability table were applied on November 14, 2026. Anonymous reads returned no rows; an administrator role test could read settings. Actual password sign-in remains to be tested by the administrator. The intake table has a separate update policy naming a different email, so marking forms reviewed and changing notes requires a policy correction. Brevo requires phone verification before sending; Pushover requires email verification and an application token, and the phone must be registered.
