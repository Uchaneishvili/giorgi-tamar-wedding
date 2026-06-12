(function () {
  'use strict';

  // Drifting flower petals rising through the hero — a living garden behind
  // the names. Canvas keeps it cheap; we cap the count and pause off-screen.

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.getElementById('hero');
  if (!hero || !window.requestAnimationFrame) return;

  const COLORS = ['#C97B5C', '#E8A33D', '#E89B8B', '#D45D79', '#7BA6C9', '#7A8B6A'];
  const COUNT = window.innerWidth < 600 ? 12 : 24;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero__petals';
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    zIndex: '0',
    pointerEvents: 'none',
  });
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  let petals = [];
  let running = false;
  let rafId = 0;

  function rand(min, max) { return min + Math.random() * (max - min); }

  function makePetal(seedTop) {
    return {
      x: rand(0, W),
      y: seedTop ? rand(-H * 0.2, H) : rand(H, H * 1.4),
      r: rand(4, 10),
      vy: rand(-0.55, -0.22),            // rise
      drift: rand(8, 26),                // horizontal sway amplitude
      phase: rand(0, Math.PI * 2),
      sway: rand(0.006, 0.016),          // sway frequency
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.012, 0.012),
      color: COLORS[(Math.random() * COLORS.length) | 0],
      alpha: rand(0.35, 0.75),
    };
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width;
    H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!petals.length) {
      petals = Array.from({ length: COUNT }, () => makePetal(true));
    }
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    // teardrop petal: two mirrored arcs
    ctx.beginPath();
    ctx.moveTo(0, -p.r);
    ctx.quadraticCurveTo(p.r * 0.9, 0, 0, p.r);
    ctx.quadraticCurveTo(-p.r * 0.9, 0, 0, -p.r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (const p of petals) {
      p.y += p.vy;
      p.phase += p.sway;
      p.x += Math.cos(p.phase) * p.drift * 0.02;
      p.rot += p.vr;
      if (p.y < -p.r * 2) {           // recycle below
        p.y = H + p.r * 2;
        p.x = rand(0, W);
      }
      drawPetal(p);
    }
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  resize();

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  }, { passive: true });

  // Pause when the hero scrolls out of view
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries[0].isIntersecting ? start() : stop();
    }, { threshold: 0.01 });
    io.observe(hero);
  } else {
    start();
  }

  // Kick off once the invitation is opened (hero is hidden before then)
  document.addEventListener('envelope:opened', start, { once: true });
})();
