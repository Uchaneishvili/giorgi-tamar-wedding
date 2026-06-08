(function () {
  'use strict';

  const FEATURE_FLAG_CURSOR_RING = true; // toggle off here to ship without ring

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer        = window.matchMedia('(pointer: fine)').matches;

  if (prefersReducedMotion || !isFinePointer) return;

  // ─── Magnetic buttons (RSVP) ────────────────────────────────────────────
  // Spec §5 #8: "translate up to 4px toward cursor". Strength 0.05 × radius 80 = 4px max.
  const MAGNET_RADIUS = 80;
  const MAGNET_STRENGTH = 0.05;

  const magnets = document.querySelectorAll('.rsvp .btn');
  magnets.forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > MAGNET_RADIUS) {
        btn.style.transform = '';
        return;
      }
      btn.style.transform = `translate(${dx * MAGNET_STRENGTH}px, ${dy * MAGNET_STRENGTH}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });

  // ─── Cursor ring (optional) ─────────────────────────────────────────────
  if (!FEATURE_FLAG_CURSOR_RING) return;

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(ring);

  let targetX = 0, targetY = 0;
  let x = 0, y = 0;

  function loop() {
    x += (targetX - x) * 0.18;
    y += (targetY - y) * 0.18;
    ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }

  document.addEventListener('pointermove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    ring.classList.add('is-active');
  });

  const HOVER_TARGETS = 'a, button, input, [data-cursor-hover]';
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest(HOVER_TARGETS)) ring.classList.add('is-hover');
    else ring.classList.remove('is-hover');
  });

  loop();
})();
