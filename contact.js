// The form remains disabled until the band configures and verifies Formspree.
// Enter the Formspree form ID into contact.html's data-formspree-id attribute.
// Never put a Gmail password, API secret, or access token in public JavaScript.
(() => {
  const form = document.getElementById('contact-form');
  const button = document.getElementById('contact-submit');
  const status = document.getElementById('contact-status');
  if (!form || !button || !status) return;
  const id = (form.dataset.formspreeId || '').trim();
  if (!/^[a-zA-Z0-9]{8,}$/.test(id)) return;
  button.disabled = false;
  button.textContent = 'SEND / 送信';
  status.textContent = '';
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    button.disabled = true;
    status.textContent = '送信中です…';
    try {
      const response = await fetch('https://formspree.io/f/' + id, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      status.textContent = '送信が完了しました。お問い合わせありがとうございます。';
    } catch (_) {
      status.textContent = '送信できませんでした。時間をおいて再度お試しいただくか、メールでご連絡ください。';
    } finally {
      button.disabled = false;
    }
  });
})();
