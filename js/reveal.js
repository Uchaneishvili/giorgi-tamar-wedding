(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    const targets = document.querySelectorAll('.reveal');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    targets.forEach((el) => io.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function initParallax() {
    if (prefersReducedMotion) return;
    const images = document.querySelectorAll('.story__image');
    if (!images.length) return;

    let ticking = false;
    function update() {
      images.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        // 0 when off-screen below, 1 when above; midpoint when centered
        const progress = 1 - (rect.top + rect.height / 2) / vh;
        const clamped = Math.max(0, Math.min(1, progress));
        // -30px max drift (matches spec)
        const offset = (clamped - 0.5) * -30;
        img.style.setProperty('--parallax', `${offset.toFixed(1)}px`);
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
  } else {
    initParallax();
  }
})();
