(function () {
  'use strict';

  // Shared celebratory burst — petals + confetti flung from a point, then
  // tugged down by gravity. Used on envelope-open and on RSVP success.
  // Exposes window.bloomConfetti(x, y, opts). No-ops under reduced motion.

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.bloomConfetti = function () {};
    return;
  }

  const COLORS = ['#C97B5C', '#E8A33D', '#E89B8B', '#D45D79', '#7BA6C9', '#7A8B6A'];

  let canvas = null;
  let ctx = null;
  let dpr = 1;
  let particles = [];
  let rafId = 0;

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: '1200',          // above content, below nothing important
      pointerEvents: 'none',
    });
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas, { passive: true });
  }

  function sizeCanvas() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(min, max) { return min + Math.random() * (max - min); }

  function spawn(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = rand(-Math.PI * 0.95, -Math.PI * 0.05); // mostly upward
      const speed = rand(4, 12);
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        g: rand(0.12, 0.22),
        r: rand(4, 9),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.2, 0.2),
        color: COLORS[(Math.random() * COLORS.length) | 0],
        petal: Math.random() < 0.5,
        life: 0,
        ttl: rand(70, 130),
      });
    }
  }

  function drawParticle(p) {
    const fade = p.life > p.ttl - 24 ? Math.max(0, (p.ttl - p.life) / 24) : 1;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = fade;
    ctx.fillStyle = p.color;
    if (p.petal) {
      ctx.beginPath();
      ctx.moveTo(0, -p.r);
      ctx.quadraticCurveTo(p.r, 0, 0, p.r);
      ctx.quadraticCurveTo(-p.r, 0, 0, -p.r);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillRect(-p.r * 0.5, -p.r * 0.7, p.r, p.r * 1.4);
    }
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life++;
      p.vy += p.g;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.life >= p.ttl || p.y > window.innerHeight + 40) {
        particles.splice(i, 1);
        continue;
      }
      drawParticle(p);
    }
    if (particles.length) {
      rafId = requestAnimationFrame(frame);
    } else {
      cleanup();
    }
  }

  function cleanup() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    window.removeEventListener('resize', sizeCanvas);
    canvas = null; ctx = null; particles = [];
  }

  window.bloomConfetti = function (x, y, opts) {
    opts = opts || {};
    ensureCanvas();
    const cx = typeof x === 'number' ? x : window.innerWidth / 2;
    const cy = typeof y === 'number' ? y : window.innerHeight / 2;
    spawn(cx, cy, opts.count || 40);
    if (!rafId) rafId = requestAnimationFrame(frame);
  };
})();
