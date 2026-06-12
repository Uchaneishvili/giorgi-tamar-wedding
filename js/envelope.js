(function () {
  'use strict';

  const overlay = document.getElementById('envelope-intro');
  if (!overlay) {
    document.body.classList.remove('is-sealed');
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fireOpened(detail) {
    document.dispatchEvent(new CustomEvent('envelope:opened', { detail: detail || {} }));
  }

  const btn = overlay.querySelector('.envelope');
  let opened = false;

  function open() {
    if (opened) return;
    opened = true;

    overlay.classList.add('is-opening');
    if (btn) btn.setAttribute('aria-disabled', 'true');

    // Burst of petals from the wax seal as it breaks
    if (typeof window.bloomConfetti === 'function') {
      const seal = overlay.querySelector('.envelope__seal');
      const r = (seal || btn).getBoundingClientRect();
      window.bloomConfetti(r.left + r.width / 2, r.top + r.height / 2, { count: 46 });
    }

    // Reveal timing (ms):
    //   0:    seal fades / scales away (320ms)
    //   ~150: flap rotates up (1200ms)
    //   1100: fire envelope:opened (hero starts revealing under us)
    //   1700: overlay fades out (800ms)
    //   2500: cleanup — remove overlay from DOM and unlock scroll
    const heroDelay  = prefersReducedMotion ? 250 : 1100;
    const fadeDelay  = prefersReducedMotion ? 400 : 1700;
    const cleanupMs  = fadeDelay + (prefersReducedMotion ? 450 : 1050);

    setTimeout(() => fireOpened(), heroDelay);

    setTimeout(() => overlay.classList.add('is-gone'), fadeDelay);

    setTimeout(() => {
      document.body.classList.remove('is-sealed');
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, cleanupMs);
  }

  if (btn) {
    btn.addEventListener('click', open);
    // Auto-focus so keyboard users can press Enter/Space immediately
    requestAnimationFrame(() => {
      try { btn.focus({ preventScroll: true }); } catch (_) {}
    });
  }
})();
