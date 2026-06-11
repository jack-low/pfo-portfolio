/* contact.js — accessible contact form: client validation, optional Cloudflare
   Turnstile, and JSON submit to the same-origin API. Progressive: if JS fails,
   the form simply doesn't submit (no silent data loss). */
(function () {
  const cfg = window.SITE_CONFIG || {};
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('cf-status');
  const submitBtn = document.getElementById('cf-submit');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fields = {
    name:    { el: form.name,    err: document.getElementById('cf-name-err'),    max: 80 },
    email:   { el: form.email,   err: document.getElementById('cf-email-err'),   max: 160 },
    subject: { el: form.subject, err: document.getElementById('cf-subject-err'), max: 120 },
    message: { el: form.message, err: document.getElementById('cf-message-err'), max: 4000, min: 5 },
    consent: { el: form.consent, err: document.getElementById('cf-consent-err') }
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(key, msg) {
    const f = fields[key];
    if (!f || !f.err) return;
    f.err.textContent = msg || '';
    if (f.el) f.el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function validate() {
    let ok = true;
    const v = (s) => (s || '').trim();

    if (!v(fields.name.el.value)) { setError('name', 'お名前を入力してください'); ok = false; }
    else if (fields.name.el.value.length > fields.name.max) { setError('name', '長すぎます'); ok = false; }
    else setError('name', '');

    const email = v(fields.email.el.value);
    if (!email) { setError('email', 'メールアドレスを入力してください'); ok = false; }
    else if (!EMAIL_RE.test(email) || email.length > fields.email.max) { setError('email', 'メールアドレスの形式が正しくありません'); ok = false; }
    else setError('email', '');

    if (fields.subject.el.value.length > fields.subject.max) { setError('subject', '件名が長すぎます'); ok = false; }
    else setError('subject', '');

    const msg = v(fields.message.el.value);
    if (!msg) { setError('message', '本文を入力してください'); ok = false; }
    else if (msg.length < fields.message.min) { setError('message', 'もう少し詳しく入力してください'); ok = false; }
    else if (fields.message.el.value.length > fields.message.max) { setError('message', '本文が長すぎます'); ok = false; }
    else setError('message', '');

    if (!fields.consent.el.checked) { setError('consent', '送信に同意してください'); ok = false; }
    else setError('consent', '');

    return ok;
  }

  // live-clear errors as the user fixes them
  ['name', 'email', 'subject', 'message'].forEach((k) => {
    fields[k].el && fields[k].el.addEventListener('input', () => {
      if (fields[k].err && fields[k].err.textContent) setError(k, '');
    });
  });
  fields.consent.el && fields.consent.el.addEventListener('change', () => setError('consent', ''));

  function setStatus(msg, kind) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  function turnstileToken() {
    if (!cfg.turnstileSiteKey) return '';
    try { return (window.turnstile && window.turnstile.getResponse()) || ''; }
    catch (_) { return ''; }
  }

  function openMailFallback(payload) {
    const to = cfg.contactEmail || 'contact@solo-map.app';
    const subject = payload.subject || 'ポートフォリオサイトからのお問い合わせ';
    const body = [
      `お名前: ${payload.name}`,
      `返信先: ${payload.email}`,
      '',
      payload.message
    ].join('\n');
    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('', '');
    if (!validate()) {
      const firstErr = form.querySelector('[aria-invalid="true"]');
      firstErr && firstErr.focus({ preventScroll: reduce });
      setStatus('入力内容をご確認ください。', 'error');
      return;
    }

    const token = turnstileToken();
    if (cfg.turnstileSiteKey && !token) {
      setStatus('確認（Turnstile）を完了してください。', 'error');
      return;
    }

    const payload = {
      name: fields.name.el.value.trim(),
      email: fields.email.el.value.trim(),
      subject: fields.subject.el.value.trim(),
      message: fields.message.el.value.trim(),
      consent: !!fields.consent.el.checked,
      company: (form.company && form.company.value) || '', // honeypot
      turnstileToken: token
    };

    submitBtn.disabled = true;
    setStatus('送信中…', 'pending');

    try {
      const res = await fetch(cfg.contactEndpoint || '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        form.reset();
        setStatus('送信しました。お問い合わせありがとうございます。', 'success');
        try { window.turnstile && window.turnstile.reset(); } catch (_) {}
      } else if (res.status === 429) {
        setStatus('送信回数が多すぎます。しばらく経ってからお試しください。', 'error');
      } else {
        setStatus('送信に失敗しました。時間をおいて再度お試しください。', 'error');
      }
    } catch (_) {
      openMailFallback(payload);
      setStatus('メールアプリを開きました。内容をご確認のうえ送信してください。', 'success');
    } finally {
      submitBtn.disabled = false;
    }
  });

  // Render Turnstile only when a real site key is configured.
  if (cfg.turnstileSiteKey) {
    const slot = document.getElementById('cf-turnstile');
    if (slot) {
      slot.className = 'cf-turnstile';
      slot.setAttribute('data-sitekey', cfg.turnstileSiteKey);
      slot.setAttribute('data-theme', 'auto');
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.async = true; s.defer = true;
      document.head.appendChild(s);
    }
  }
})();
