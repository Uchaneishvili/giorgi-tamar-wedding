(function () {
  'use strict';

  // Lift the active section's --section-tint onto <body> so body-level accents
  // (the cursor ring) shift hue as the reader travels down the page. Each
  // section declares its own tint in CSS; we just promote the one in view.

  if (!('IntersectionObserver' in window)) return;

  const sections = document.querySelectorAll('#hero, #welcome, #countdown, #events, #rsvp, #footer');
  if (!sections.length) return;

  function apply(el) {
    const tint = getComputedStyle(el).getPropertyValue('--section-tint').trim();
    if (tint) document.body.style.setProperty('--section-tint', tint);
  }

  const io = new IntersectionObserver((entries) => {
    // The section occupying the viewport's central band wins
    entries.forEach((entry) => {
      if (entry.isIntersecting) apply(entry.target);
    });
  }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });

  sections.forEach((s) => io.observe(s));
})();
