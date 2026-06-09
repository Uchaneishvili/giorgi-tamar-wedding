(function () {
  'use strict';

  function hideLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    // Wait at least one paint after fonts are ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => loader.classList.add('is-gone'));
    });
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(hideLoader);
  } else {
    window.addEventListener('load', hideLoader);
  }

  // Hard ceiling: never block the page on slow font CDN
  setTimeout(hideLoader, 2500);

  function splitChars() {
    const targets = document.querySelectorAll('.hero__name[data-cascade]');
    targets.forEach((el) => {
      const text = el.textContent;
      el.textContent = '';
      [...text].forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? ' ' : ch;
        span.style.animationDelay = `${i * 60}ms`;
        el.appendChild(span);
      });
    });
  }

  function startHero() {
    splitChars();
    const hero = document.getElementById('hero');
    if (!hero) return;

    let started = false;
    function reveal() {
      if (started) return;
      started = true;
      hero.classList.add('is-ready');
    }

    // Reveal once the envelope is opened — listen first in case the event
    // fires before fonts are ready.
    document.addEventListener('envelope:opened', reveal, { once: true });

    // Fallback: if envelope script never dispatches (404, error), reveal anyway
    setTimeout(reveal, 4000);
  }

  // Prepare hero (split chars + listener) as soon as fonts are ready
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(startHero);
  } else {
    window.addEventListener('load', startHero);
  }
})();
