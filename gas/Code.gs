/**
 * PTTC contact endpoint. Deploy as a Web app, executing as the owner,
 * accessible to anyone. Set Script Properties: SPREADSHEET_ID and NOTIFY_EMAIL.
 * Public endpoint: restrict Sheets sharing and protect the Google account.
 */
function doPost(e) {
  const data = (e && e.parameter) || {};
  const token = String(data.request_token || '').slice(0, 128);
  try {
    if (data._gotcha) return respond_(false, token);
    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const message = String(data.message || '').trim();
    if (!name || name.length > 120 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
        !message || message.length > 10000 ||
        !/^[a-f0-9]{32}$/.test(token)) {
      return respond_(false, token);
    }
    const props = PropertiesService.getScriptProperties();
    const sheetId = props.getProperty('SPREADSHEET_ID');
    const notifyEmail = props.getProperty('NOTIFY_EMAIL');
    if (!sheetId || !notifyEmail) return respond_(false, token);
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return respond_(false, token);
    try {
      const spreadsheet = SpreadsheetApp.openById(sheetId);
      const sheet = spreadsheet.getSheetByName('Contacts');
      if (!sheet) throw new Error('Create a Contacts sheet first');
      // Neutralize spreadsheet formulas entered by anonymous visitors.
      const safe = value => /^[=+@\-]/.test(value) ? "'" + value : value;
      sheet.appendRow([new Date(), safe(name), safe(email), safe(message)]);
    } finally {
      lock.releaseLock();
    }
    // Once saved, email notification failures must not cause duplicate submissions.
    try {
      MailApp.sendEmail({
        to: notifyEmail,
        subject: '[PTTC CONTACT] 新しいお問い合わせ',
        body: 'お名前: ' + name + '\n返信先: ' + email + '\n\n本文:\n' + message,
        replyTo: email
      });
    } catch (notificationError) {
      console.error('Saved, but notification failed: ' + notificationError);
    }
    return respond_(true, token);
  } catch (error) {
    console.error('Contact submission failed: ' + error);
    return respond_(false, token);
  }
}

function respond_(ok, token) {
  const payload = JSON.stringify({
    type: 'pttc-contact-result',
    ok: !!ok,
    token: String(token || '')
  }).replace(/</g, '\\u003c');
  // HtmlService may run inside a nested Google-hosted iframe.
  // Dispatch to all accessible ancestors so the outer contact page receives it.
  const html = '<!doctype html><html><head><meta charset="utf-8"></head><body>' +
    '<script>(function(){var msg=' + payload + ';' +
    'var current=window;while(current!==current.parent){' +
    'current=current.parent;current.postMessage(msg,"*");' +
    '}' +
    '})();<\/script></body></html>';
  return HtmlService.createHtmlOutput(html);
}
