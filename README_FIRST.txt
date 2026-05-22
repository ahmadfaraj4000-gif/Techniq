
TECHNIQ SKIN & BEAUTY — INTAKE + ADMIN SETUP
============================================

FILES
-----
1) intake-consent.html
   Customer-facing intake + consent form.
   Send this link after booking:
   https://techniqskinandbeauty.com/intake-consent.html

2) admin-intake.html
   Admin-only dashboard for viewing forms, printing/saving PDF, exporting CSV/JSON, marking reviewed, and saving admin notes.

3) techniq_secure_intake_setup.sql
   Supabase table + RLS security policies.

SETUP STEPS
-----------
1) Supabase SQL
   Go to Supabase → SQL Editor → New Query.
   Paste and run:
   techniq_secure_intake_setup.sql

2) Create admin login
   Go to Supabase → Authentication → Users.
   Create/invite admin user:
   techniqskinandbeauty@gmail.com

   If your actual admin login email is different, change it in:
   - techniq_secure_intake_setup.sql
   - admin-intake.html line: APPROVED_ADMIN_EMAIL

3) Add Supabase keys to BOTH html files
   Replace:
   PASTE_YOUR_SUPABASE_URL_HERE
   PASTE_YOUR_SUPABASE_ANON_KEY_HERE

   Supabase Project → Settings → API:
   - Project URL
   - anon public key

4) Upload files to website
   Upload:
   - intake-consent.html
   - admin-intake.html

SECURITY NOTES
--------------
- admin-intake.html is still a public static file if someone guesses the URL.
- That is normal for static hosting.
- The actual data is protected by Supabase Auth + RLS.
- Public users can only INSERT forms.
- Public users cannot SELECT/read form submissions.
- Only the approved logged-in admin email can view/update/delete records.

EXPORTS
-------
- Admin dashboard has Export CSV and Export JSON.
- Individual records can be printed/saved as PDF from the browser.
- Customers can print/save/download their own copy from the intake page.

IMPORTANT HEALTH DATA NOTE
--------------------------
This form asks health-related intake questions. Keep access limited.
Do not collect SSNs, insurance numbers, IDs, or unrelated medical documents through this form.
