# PTTC CONTACT — Google Apps Script (Draft)

This is an **alternative to PR #42 (Google Forms) and PR #43 (Formspree)**. Do not merge all three. No production endpoint or private credentials are committed.

## Setup
1. Create a private Google Sheet owned by the band's Google account. Add a sheet named `Contacts` with headers `Timestamp | Name | Email | Message | Request Token`.
2. Open Extensions → Apps Script. Copy `gas/Code.gs`.
3. In Project Settings → Script properties set:
   - `SPREADSHEET_ID`: Sheet ID from the spreadsheet URL
   - `NOTIFY_EMAIL`: band notification mailbox
4. Deploy → New deployment → **Web app**; execute as **Me**, access **Anyone**. Approve the Google permissions. Confirm that the `/exec` URL is correct.
5. In `contact.html`, set `data-gas-url` to the `https://script.google.com/macros/s/.../exec` URL. Until then, the button remains disabled.
6. Test from a local HTTP server and a GitHub Pages preview with a separate test mailbox. Verify *both* Sheet row and Gmail notification; confirm that the success message appears, and test error handling, mobile, and spam behavior.

## Reliability and security caveats
- The cross-origin POST uses a hidden iframe and a GAS HTML confirmation message, not `fetch(..., {mode:"no-cors"})`. **Verify that postMessage reaches the site from the actual GAS deployment**; Google-hosted iframe/wrapper behavior can differ. If no confirmation is received, the UI reports an *unknown result*, not success. Do not immediately retry: the row may have been saved.
- Public GAS endpoints can be abused. The honeypot is minimal protection, not a substitute for rate limiting or CAPTCHA. For a public production launch, add stronger anti-abuse controls or consider a managed form backend.
- A script-property spreadsheet ID is not sent to the browser; don't commit credentials. Restrict spreadsheet collaborators; enable 2FA.
- The input data is personal information. Confirm retention/erasure, Google service processing, and privacy policy wording before launch.
- GAS free quotas and Google account permissions apply. Notification delivery may fail despite a saved Sheet row.

## Security hardening (security/contact-gas-hardening)

- The GAS endpoint limits traffic to roughly **30 accepted submissions per hour globally**, and **3 submissions per 10 minutes per entered email address**, using Apps Script CacheService with ScriptLock. This is best-effort throttling, not an atomic, durable security boundary: caches can evict entries, and all senders share the global quota. Rejected requests do not append a row or send mail.
- The `Contacts` sheet now uses **column E (`Request Token`)** to recognize repeat requests with the same random token and avoid saving or notifying twice. Do not delete or expose this column. Existing four-column rows remain valid.
- Spreadsheet cells starting with formula-trigger characters are stored as escaped text.
- The previously tested GAS iframe response needs `.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)`; this removes the X-Frame-Options protection from the response. The return HTML contains no personal contact details, but allowing embedding is a security trade-off. Only enable this on the dedicated contact endpoint.
- The honeypot, public nonce and frontend validation are **not** real bot authentication. A malicious client can invoke the publicly exposed GAS URL, choose different email addresses, and exhaust shared quotas. For robust protection, use a managed form service or authenticated backend with a CAPTCHA/rate-limit verifier.
- Configure spreadsheet access to only the band operators. Review and delete old submissions periodically. Do not log request bodies or share submitted email addresses.

## Deployment after merging this security PR
1. Copy the updated `gas/Code.gs` into the *existing* Apps Script project.
2. Apps Script → Deploy → Manage deployments → Edit → New version → Deploy. Keep the same `/exec` URL.
3. Confirm that `Contacts` has column E labeled `Request Token`.
4. Send **one distinct test inquiry** and confirm exactly one new row, one notification, and one frontend success message.
5. Verify a replay of **the same request token** does not add a second row. Avoid production load tests of the global limit.

**This PR is based on PR #44, not `main`. Merge #44 first, then this security PR, or retarget it after #44 is merged.**
