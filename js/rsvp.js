(function () {
  'use strict';

  // PLACEHOLDER — replace with the Apps Script /exec URL after deploy.
  const APPS_SCRIPT_URL = '__APPS_SCRIPT_URL__';

  const SESSION_KEY = 'rsvp-submitted-v1';

  const form     = document.getElementById('rsvp-form');
  const input    = document.getElementById('rsvp-name');
  const help     = document.getElementById('rsvp-name-help');
  const success  = document.getElementById('rsvp-success');
  const errorBox = document.getElementById('rsvp-error');
  const nameOut  = success ? success.querySelector('[data-name]') : null;
  const bodyOut  = success ? success.querySelector('.rsvp__success-body') : null;

  if (!form) return;

  // If already submitted in this session, show the success state directly.
  const prev = sessionStorage.getItem(SESSION_KEY);
  if (prev) {
    try {
      const { name, attending } = JSON.parse(prev);
      revealSuccess(name, attending);
    } catch (_) { /* ignore */ }
  }

  function setHelp(msg) { if (help) help.textContent = msg || ''; }

  function disableButtons(disabled) {
    form.querySelectorAll('button[type="submit"]').forEach((b) => {
      b.disabled = disabled;
    });
  }

  function revealSuccess(name, attending) {
    form.classList.add('is-gone');
    if (nameOut) nameOut.textContent = name;
    if (bodyOut) {
      bodyOut.textContent = attending === false
        ? 'ვწუხვართ, რომ ვერ შეძლებთ. გმადლობთ, რომ გვაცნობეთ.'
        : 'რა კარგია — მოუთმენლად გელით ჩვენს დღესასწაულზე!';
    }
    if (success) {
      success.hidden = false;
      requestAnimationFrame(() => success.classList.add('is-shown'));
    }
  }

  function revealError() {
    if (errorBox) errorBox.hidden = false;
  }

  async function submitRsvp(name, attending) {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ name, attending }),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    });
    return res.json();
  }

  async function handle(e, btn) {
    e.preventDefault();
    setHelp('');
    if (errorBox) errorBox.hidden = true;

    const name = (input.value || '').trim();
    if (!name) {
      setHelp('გთხოვთ, მიუთითეთ სახელი და გვარი');
      input.focus();
      return;
    }
    if (name.length > 80) {
      setHelp('სახელი ძალიან გრძელია');
      return;
    }

    const attending = btn.dataset.attending === 'true';

    btn.classList.add('is-loading');
    disableButtons(true);

    const minDelay = new Promise((r) => setTimeout(r, 300));

    try {
      const [result] = await Promise.all([
        submitRsvp(name, attending),
        minDelay,
      ]);
      btn.classList.remove('is-loading');

      if (result && result.ok) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name, attending }));
        revealSuccess(name, attending);
        // Celebrate a "yes" with a petal burst from the confirmation
        if (attending && typeof window.bloomConfetti === 'function') {
          requestAnimationFrame(() => {
            const r = (success || form).getBoundingClientRect();
            window.bloomConfetti(r.left + r.width / 2, r.top + r.height / 3, { count: 52 });
          });
        }
      } else {
        disableButtons(false);
        revealError();
      }
    } catch (err) {
      btn.classList.remove('is-loading');
      disableButtons(false);
      revealError();
    }
  }

  form.querySelectorAll('button[type="submit"]').forEach((btn) => {
    btn.addEventListener('click', (e) => handle(e, btn));
  });
})();
