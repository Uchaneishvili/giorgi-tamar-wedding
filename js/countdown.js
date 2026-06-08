(function () {
  'use strict';

  // Ceremony start: 2026-07-12T15:00:00+04:00 (Tbilisi time)
  const TARGET = new Date('2026-07-12T15:00:00+04:00').getTime();

  const els = {
    days:  document.querySelector('[data-cd="days"]'),
    hours: document.querySelector('[data-cd="hours"]'),
    mins:  document.querySelector('[data-cd="mins"]'),
    secs:  document.querySelector('[data-cd="secs"]'),
  };

  function compute(nowMs) {
    let diff = Math.max(0, TARGET - nowMs);
    const days  = Math.floor(diff / 86_400_000); diff -= days  * 86_400_000;
    const hours = Math.floor(diff / 3_600_000);  diff -= hours * 3_600_000;
    const mins  = Math.floor(diff / 60_000);     diff -= mins  * 60_000;
    const secs  = Math.floor(diff / 1000);
    return { days, hours, mins, secs };
  }

  function pad(n, len) { return String(n).padStart(len, '0'); }

  function setValue(el, next) {
    if (!el || el.textContent === next) return;
    el.textContent = next;
    el.classList.remove('is-flipping');
    void el.offsetWidth; // restart animation
    el.classList.add('is-flipping');
  }

  function tick() {
    const t = compute(Date.now());
    if (!els.days) return;
    setValue(els.days,  String(t.days));
    setValue(els.hours, pad(t.hours, 2));
    setValue(els.mins,  pad(t.mins, 2));
    setValue(els.secs,  pad(t.secs, 2));
  }

  function init() {
    if (!els.days) return;
    tick();
    setInterval(tick, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for in-browser sanity check (Task 7 verify step)
  window.__countdownCompute = compute;
})();
