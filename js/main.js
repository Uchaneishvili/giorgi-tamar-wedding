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
})();
