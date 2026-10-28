// GitHub Pages cannot read cross-origin GAS responses directly.
// Submit to a hidden iframe and accept an explicit nonce-matched response.
(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const status = document.querySelector('#contact-status');
  const endpoint = (form.dataset.gasUrl || '').trim();
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint)) return;

  const frame = document.createElement('iframe');
  frame.name = 'pttc-contact-response';
  frame.title = 'お問い合わせ送信処理';
  frame.style.display = 'none';
  document.body.append(frame);
  form.method = 'POST';
  form.action = endpoint;
  form.target = frame.name;
  let tokenField = document.createElement('input');
  tokenField.type = 'hidden';
  tokenField.name = 'request_token';
  form.append(tokenField);
  let pending = null;
  button.disabled = false;
  status.textContent = '';

  window.addEventListener('message', event => {
    if (!pending || !event.data || event.data.type !== 'pttc-contact-result') return;
    if (!/^https:\/\/(?:[a-z0-9-]+\.)*(?:googleusercontent\.com|google\.com)$/.test(event.origin)) return;
    if (event.data.token !== pending) return;
    pending = null;
    button.disabled = false;
    button.textContent = 'SEND MESSAGE ↗';
    if (event.data.ok === true) {
      form.reset();
      status.dataset.state = 'success';
      status.textContent = 'お問い合わせを受け付けました。ありがとうございます。';
    } else {
      status.dataset.state = 'error';
      status.textContent = '送信を確認できませんでした。メールで直接お問い合わせください。';
    }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity() || pending) return;
    if (form.elements.namedItem('_gotcha')?.value) return;
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    pending = Array.from(bytes, n => n.toString(16).padStart(2, '0')).join('');
    tokenField.value = pending;
    button.disabled = true;
    button.textContent = 'SENDING...';
    status.dataset.state = '';
    status.textContent = '送信中です…';
    form.submit();
    // Do not claim success when no confirmed GAS response arrives.
    const attempt = pending;
    setTimeout(() => {
      if (pending !== attempt) return;
      pending = null;
      button.disabled = false;
      button.textContent = 'SEND MESSAGE ↗';
      status.dataset.state = 'error';
      status.textContent = '送信結果を確認できませんでした。重複送信せず、メールでお問い合わせください。';
    }, 20000);
  });
})();
