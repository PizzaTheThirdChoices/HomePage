# PTTC CONTACT — Google Apps Script (Draft)

This is an **alternative to PR #42 (Google Forms) and PR #43 (Formspree)**. Do not merge all three. No production endpoint or private credentials are committed.

## Setup
1. Create a private Google Sheet owned by the band's Google account. Add a sheet named `Contacts` with headers `Timestamp | Name | Email | Message`.
2. Open Extensions → Apps Script. Copy `gas/Code.gs`.
3. In Project Settings → Script properties set:
   - `SPREADSHEET_ID`: Sheet ID from the spreadsheet URL
   - `NOTIFY_EMAIL`: band notification mailbox
4. Deploy → New deployment → **Web app**; execute as **Me**, access **Anyone**. Approve the Google permissions. Confirm that the `/exec` URL is correct.
5. In `contact.html`, set `data-gas-url` to the `https://script.google.com/macros/s/.../exec` URL. Until then, the button remains disabled.
6. Test from a local HTTP server and a GitHub Pages preview with a separate test mailbox. Verify *both* Sheet row and Gmail notification; test error handling, mobile, and spam behavior.

## Reliability and security caveats
- The cross-origin POST uses a hidden iframe and a GAS HTML confirmation message, not `fetch(..., {mode:"no-cors"})`. **Verify that postMessage reaches the site from the actual GAS deployment**; Google-hosted iframe/wrapper behavior can differ. If no confirmation is received, the UI reports an *unknown result*, not success. Do not immediately retry: the row may have been saved.
- Public GAS endpoints can be abused. The honeypot is minimal protection, not a substitute for rate limiting or CAPTCHA. For a public production launch, add stronger anti-abuse controls or consider a managed form backend.
- A script-property spreadsheet ID is not sent to the browser; don't commit credentials. Restrict spreadsheet collaborators; enable 2FA.
- The input data is personal information. Confirm retention/erasure, Google service processing, and privacy policy wording before launch.
- GAS free quotas and Google account permissions apply. Notification delivery may fail despite a saved Sheet row.
