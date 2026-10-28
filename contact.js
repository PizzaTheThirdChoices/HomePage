// Set the public Formspree form ID in contact.html (data-formspree-id).
(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const submit = form.querySelector('button[type="submit"]');
  const status = document.querySelector('#contact-status');
  const id = (form.dataset.formspreeId || '').trim();
  if (!/^[a-zA-Z0-9]{8,}$/.test(id)) return;
  submit.disabled = false;
  status.textContent = '';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    submit.disabled = true;
    status.textContent = '送信中です…';
    status.dataset.state = '';
    try {
      const response = await fetch('https://formspree.io/f/' + encodeURIComponent(id), {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      status.dataset.state = 'success';
      status.textContent = '送信しました。お問い合わせありがとうございます。';
    } catch (_) {
      status.dataset.state = 'error';
      status.textContent = '送信できませんでした。メールから直接お問い合わせください。';
    } finally {
      submit.disabled = false;
    }
  });
})();
