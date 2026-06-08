(function () {
  'use strict';

  const btn     = document.getElementById('music-toggle');
  const tooltip = document.getElementById('music-tooltip');
  const audio   = document.getElementById('bgm');

  if (!btn || !audio) return;

  const FADE_IN_MS  = 2000;
  const FADE_OUT_MS = 1000;
  const TARGET_VOL  = 0.3;

  let playing = false;
  let tooltipShown = false;

  function showTooltip() {
    if (!tooltip || tooltipShown || playing) return;
    tooltipShown = true;
    tooltip.classList.add('is-shown');
    setTimeout(() => tooltip.classList.remove('is-shown'), 5000);
  }
  function dismissTooltip() {
    if (tooltip) tooltip.classList.remove('is-shown');
  }

  function fade(from, to, ms) {
    return new Promise((resolve) => {
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / ms);
        audio.volume = from + (to - from) * t;
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      }
      audio.volume = from;
      requestAnimationFrame(step);
    });
  }

  async function play() {
    try {
      audio.volume = 0;
      await audio.play();
      playing = true;
      btn.classList.add('is-playing');
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-label', 'ფონური მუსიკის გათიშვა');
      dismissTooltip();
      await fade(0, TARGET_VOL, FADE_IN_MS);
    } catch (_) {
      // Browser blocked playback; stay in stopped state.
      playing = false;
    }
  }

  async function pause() {
    await fade(audio.volume, 0, FADE_OUT_MS);
    audio.pause();
    playing = false;
    btn.classList.remove('is-playing');
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'ფონური მუსიკის ჩართვა');
  }

  btn.addEventListener('click', () => {
    if (playing) pause();
    else play();
  });

  // Show tooltip 2s after load (only if music never started)
  setTimeout(showTooltip, 2000);
  // Dismiss on any click anywhere
  document.addEventListener('click', dismissTooltip, { once: false });
})();
