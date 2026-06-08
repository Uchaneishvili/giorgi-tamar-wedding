# Wedding Invitation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page wedding invitation site for Giorgi & Tamar (12 July 2026), backed by Google Sheets via Apps Script for RSVPs.

**Architecture:** Static site — vanilla HTML/CSS/JS, no build step, no framework. Single `index.html` with externalized CSS and ES module-free JS files. RSVP backend is a deployed Google Apps Script Web App writing to a Google Sheet. The frontend submits JSON-as-text to avoid CORS preflight.

**Tech Stack:** HTML5, CSS3 (variables, clamp, grid, clip-path, transforms), vanilla JS (Intersection Observer, fetch, requestAnimationFrame), Google Apps Script, Google Sheets. Fonts via Google Fonts (Fraunces, Inter, FiraGO).

**Testing approach:** No automated test runner — this is a presentational static site. Verification is **manual browser testing** via a local static server. Each task's verification step opens the page, scrolls to the relevant section, and checks the described behavior. Pure functions (countdown math) get a tiny inline assertion in browser DevTools.

**Defaults for spec §13 open questions (engineer may override during implementation):**
- Countdown target: **2026-07-12T15:00:00+04:00** (ceremony start, Tbilisi time)
- RSVP deadline shown in copy: **1 ივლისი 2026** (placeholder — couple confirms)
- Audio track: filename `audio/ambient.mp3` — actual asset provided by couple before deploy
- Our Story chapters: 4 chapters with placeholder Georgian copy + 4 placeholder images
- Domain: ship to Netlify subdomain initially
- Cursor ring: feature-flagged in `js/cursor.js`, default ON for desktop

---

## File Structure

Files this plan creates (paths relative to repo root `/Users/giga/Desktop/giorgi-tamar-wedding/`):

```
index.html                          — single page, semantic HTML, sections in order
css/fonts.css                       — @import Google Fonts (Fraunces, Inter, FiraGO)
css/styles.css                      — all styles, single file, CSS variables
js/reveal.js                        — IntersectionObserver-based scroll reveal utility
js/countdown.js                     — countdown ticker + digit flip animation
js/rsvp.js                          — form submission + morph animation + sessionStorage guard
js/music.js                         — audio toggle + tooltip + fade
js/cursor.js                        — magnetic buttons + optional cursor ring (feature-flagged)
js/main.js                          — loader fade-out + hero letter cascade + module init
audio/.gitkeep                      — placeholder; ambient.mp3 added later
image/.gitkeep                      — placeholder; photos added later
image/monogram.svg                  — G & T monogram (used in loader and footer)
google-apps-script/Code.gs          — doPost handler + JSON helper
google-apps-script/README.md        — step-by-step deploy instructions
docs/superpowers/plans/2026-06-08-wedding-invitation-implementation.md  — this plan
```

Each JS file is a self-contained IIFE; no module system. Loaded via `<script defer>` at end of body. `js/main.js` orchestrates init order.

---

## Task 1: Scaffold index.html + empty assets

**Files:**
- Create: `index.html`
- Create: `audio/.gitkeep`
- Create: `image/.gitkeep`

- [ ] **Step 1: Create `index.html` with full semantic skeleton**

```html
<!DOCTYPE html>
<html lang="ka">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>გიორგი & თამარი — 12 ივლისი 2026</title>
  <meta name="description" content="გიორგი და თამარის საქორწინო მოწვევა — 12 ივლისი 2026, საქართველო." />
  <meta name="theme-color" content="#FAFAF7" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="css/fonts.css" />
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <div id="loader" class="loader" aria-hidden="true">
    <!-- monogram SVG injected/inlined in Task 3 -->
  </div>

  <button id="music-toggle" class="music-toggle" type="button" aria-pressed="false"
          aria-label="ფონური მუსიკის ჩართვა / გათიშვა">
    <!-- play/pause SVG; filled in Task 14 -->
  </button>
  <div id="music-tooltip" class="music-tooltip" role="status" aria-hidden="true">
    მუსიკის ჩასართავად დააწექი ♪
  </div>

  <main>
    <section id="hero" class="hero"><!-- Task 4 --></section>
    <section id="welcome" class="welcome"><!-- Task 6 --></section>
    <section id="countdown" class="countdown"><!-- Task 7 --></section>
    <section id="story" class="story"><!-- Task 8 --></section>
    <section id="events" class="events"><!-- Task 9 --></section>
    <section id="rsvp" class="rsvp"><!-- Task 10 --></section>
  </main>

  <footer id="footer" class="footer"><!-- Task 13 --></footer>

  <audio id="bgm" loop preload="metadata">
    <source src="audio/ambient.mp3" type="audio/mpeg" />
  </audio>

  <script defer src="js/reveal.js"></script>
  <script defer src="js/countdown.js"></script>
  <script defer src="js/rsvp.js"></script>
  <script defer src="js/music.js"></script>
  <script defer src="js/cursor.js"></script>
  <script defer src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `audio/.gitkeep` and `image/.gitkeep`**

Both files are empty placeholders so the directories survive in git.

```bash
touch audio/.gitkeep image/.gitkeep
```

- [ ] **Step 3: Verify file loads in browser**

Run from repo root:
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000` in browser. Expected: blank white page (no styles yet), no console errors except 404s for `fonts.css`, `styles.css`, and the JS files we haven't created yet. The 404s are OK at this stage.

- [ ] **Step 4: Commit**

```bash
git add index.html audio/.gitkeep image/.gitkeep
git commit -m "feat: scaffold index.html with semantic sections and audio/image dirs"
```

---

## Task 2: Fonts + design tokens + base styles

**Files:**
- Create: `css/fonts.css`
- Create: `css/styles.css`

- [ ] **Step 1: Create `css/fonts.css` with Google Fonts imports**

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Georgian:opsz,wght@8..144,400..700&display=swap');
```

Note: We use Noto Georgian (Sans + Serif) families because FiraGO/BPG Nino are not on Google Fonts. Noto Serif Georgian pairs naturally with Fraunces; Noto Sans Georgian pairs with Inter. This satisfies the spec's "soft modern serif + clean sans" intent.

- [ ] **Step 2: Create `css/styles.css` with design tokens and base styles**

```css
:root {
  --bg: #FAFAF7;
  --ink: #0F0F0F;
  --ink-soft: #5C5852;
  --accent: #C97B5C;
  --line: #E8E2D8;

  --font-display: 'Fraunces', 'Noto Serif Georgian', Georgia, serif;
  --font-body: 'Inter', 'Noto Sans Georgian', system-ui, sans-serif;

  --section-pad-y: clamp(96px, 14vh, 200px);
  --container-max: 1200px;
  --read-max: 640px;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
html { -webkit-text-size-adjust: 100%; }

body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.65;
  font-feature-settings: 'kern', 'liga', 'calt';
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

@media (min-width: 768px) {
  body { font-size: 16px; }
}

img, svg { display: block; max-width: 100%; height: auto; }

a {
  color: inherit;
  text-decoration: none;
}

button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}

main { display: block; }

section {
  padding: var(--section-pad-y) clamp(20px, 5vw, 48px);
  max-width: var(--container-max);
  margin: 0 auto;
}

.microcopy {
  font-family: var(--font-body);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-soft);
  font-weight: 500;
}

.serif-display {
  font-family: var(--font-display);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: -0.01em;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0 0 clamp(48px, 6vw, 80px);
  text-align: center;
}

.divider-hair {
  width: 80px;
  height: 1px;
  background: var(--line);
  margin: 32px auto;
  border: 0;
}

/* Scroll-reveal base state (Task 5 toggles .is-visible) */
.reveal {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 700ms var(--ease-out), transform 700ms var(--ease-out);
  will-change: opacity, transform;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Reduced-motion overrides applied globally */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
  .reveal { opacity: 1; transform: none; }
}

/* Visible focus ring */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 2px;
}
```

- [ ] **Step 3: Verify in browser**

Reload `http://localhost:8000`. Expected: page background turns warm off-white (`#FAFAF7`). No fonts loaded yet visually (no text), so the change is the background color and a clean console (no CSS 404s). Open DevTools → Network → confirm `fonts.css` and `styles.css` both return 200.

- [ ] **Step 4: Commit**

```bash
git add css/fonts.css css/styles.css
git commit -m "feat: design tokens, font imports, base styles, reduced-motion guards"
```

---

## Task 3: Monogram SVG + page loader

**Files:**
- Create: `image/monogram.svg`
- Modify: `index.html` (inline loader monogram)
- Modify: `css/styles.css` (loader styles)
- Create: `js/main.js` (loader fade-out logic)

- [ ] **Step 1: Create `image/monogram.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
  <path d="M 38 18 Q 22 18, 22 32 Q 22 46, 38 46 L 38 36 L 30 36" />
  <path d="M 56 22 Q 62 16, 70 22 M 60 22 L 60 46" />
  <path d="M 82 18 L 100 18 L 91 18 L 91 46" />
</svg>
```

This is a minimal "G T" + decorative center motif drawn with currentColor strokes so the loader uses `--ink` and the footer can use `--accent`.

- [ ] **Step 2: Inline the loader monogram + replace the empty `#loader` in `index.html`**

Find `<div id="loader" class="loader" aria-hidden="true">` in `index.html` and replace with:

```html
<div id="loader" class="loader" aria-hidden="true">
  <svg class="loader__monogram" viewBox="0 0 120 60" fill="none" stroke="currentColor"
       stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M 38 18 Q 22 18, 22 32 Q 22 46, 38 46 L 38 36 L 30 36" />
    <path d="M 56 22 Q 62 16, 70 22 M 60 22 L 60 46" />
    <path d="M 82 18 L 100 18 L 91 18 L 91 46" />
  </svg>
</div>
```

- [ ] **Step 3: Append loader styles to `css/styles.css`**

```css
/* Loader overlay */
.loader {
  position: fixed;
  inset: 0;
  background: var(--bg);
  display: grid;
  place-items: center;
  z-index: 999;
  transition: opacity 600ms var(--ease-out), visibility 0ms 600ms;
}
.loader.is-gone {
  opacity: 0;
  visibility: hidden;
}
.loader__monogram {
  width: 80px;
  height: auto;
  color: var(--ink);
  animation: monogram-pulse 1800ms ease-in-out infinite;
}
@keyframes monogram-pulse {
  0%, 100% { opacity: 0.55; transform: scale(0.98); }
  50%      { opacity: 1.00; transform: scale(1.00); }
}
@media (prefers-reduced-motion: reduce) {
  .loader__monogram { animation: none; opacity: 1; }
}
```

- [ ] **Step 4: Create `js/main.js` with loader fade-out**

```javascript
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
```

- [ ] **Step 5: Verify in browser**

Reload `http://localhost:8000`. Expected: brief view of centered pulsing monogram, then fades out smoothly after fonts load. Throttle network to "Fast 3G" in DevTools and reload — loader still hides within 2.5s ceiling.

- [ ] **Step 6: Commit**

```bash
git add image/monogram.svg index.html css/styles.css js/main.js
git commit -m "feat: page loader with monogram pulse and fade-out"
```

---

## Task 4: Hero section + letter cascade

**Files:**
- Modify: `index.html` (hero section markup)
- Modify: `css/styles.css` (hero styles)
- Modify: `js/main.js` (letter cascade)

- [ ] **Step 1: Replace empty `#hero` section in `index.html`**

```html
<section id="hero" class="hero">
  <p class="microcopy hero__kicker">მოწვევა ქორწილში</p>
  <h1 class="hero__names" aria-label="გიორგი & თამარი">
    <span class="hero__name" data-cascade>გიორგი</span>
    <span class="hero__amp" aria-hidden="true">&amp;</span>
    <span class="hero__name" data-cascade>თამარი</span>
  </h1>
  <p class="microcopy hero__date">12 . 07 . 2026 — საქართველო</p>
  <div class="hero__scrollhint" aria-hidden="true">
    <span class="hero__line"></span>
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.25">
      <path d="M8 3v9M4 9l4 4 4-4" />
    </svg>
  </div>
</section>
```

- [ ] **Step 2: Append hero styles to `css/styles.css`**

```css
.hero {
  min-height: 100vh;
  min-height: 100svh;
  max-width: none;
  padding: 0 clamp(20px, 5vw, 48px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 24px;
  position: relative;
}
.hero__kicker { margin: 0; opacity: 0; transform: translateY(8px); transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out); }
.hero__date   { margin: 0; opacity: 0; transform: translateY(8px); transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out); }
.hero.is-ready .hero__kicker,
.hero.is-ready .hero__date { opacity: 1; transform: none; }
.hero.is-ready .hero__kicker { transition-delay: 700ms; }
.hero.is-ready .hero__date   { transition-delay: 900ms; }

.hero__names {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(64px, 14vw, 180px);
  line-height: 0.95;
  letter-spacing: -0.02em;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(4px, 1vw, 12px);
}
.hero__amp {
  font-style: italic;
  color: var(--accent);
  font-size: 0.55em;
  line-height: 1;
}
.hero__name {
  display: inline-block;
  /* per-letter spans injected by JS */
}
.hero__name .char {
  display: inline-block;
  opacity: 0;
  transform: translateY(8px);
  will-change: opacity, transform;
}
.hero.is-ready .hero__name .char {
  animation: char-in 600ms var(--ease-out) forwards;
}

@keyframes char-in {
  to { opacity: 1; transform: translateY(0); }
}

.hero__scrollhint {
  position: absolute;
  bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--ink-soft);
  opacity: 0;
  transition: opacity 600ms var(--ease-out);
  transition-delay: 1200ms;
}
.hero.is-ready .hero__scrollhint { opacity: 0.7; }
.hero__line { width: 1px; height: 80px; background: var(--line); }
.hero__scrollhint svg { animation: bob 1800ms ease-in-out infinite; }

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(4px); }
}

@media (prefers-reduced-motion: reduce) {
  .hero__name .char { opacity: 1 !important; transform: none !important; animation: none !important; }
  .hero__scrollhint svg { animation: none; }
}
```

- [ ] **Step 3: Append letter cascade logic to `js/main.js`**

Insert this just before the closing `})();` of `js/main.js`:

```javascript
  function splitChars() {
    const targets = document.querySelectorAll('.hero__name[data-cascade]');
    targets.forEach((el) => {
      const text = el.textContent;
      el.textContent = '';
      [...text].forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? ' ' : ch;
        span.style.animationDelay = `${i * 60}ms`;
        el.appendChild(span);
      });
    });
  }

  function startHero() {
    splitChars();
    const hero = document.getElementById('hero');
    if (hero) {
      // Wait for loader fade so cascade is visible
      setTimeout(() => hero.classList.add('is-ready'), 200);
    }
  }

  // Run after loader hides
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(startHero);
  } else {
    window.addEventListener('load', startHero);
  }
```

- [ ] **Step 4: Verify in browser**

Reload `http://localhost:8000`. Expected: after loader fades, "გიორგი" cascades letter-by-letter from left, then the terracotta italic "&", then "თამარი" cascades. Microcopy "მოწვევა ქორწილში" and the date appear after the names settle. Scroll hint appears at bottom and gently bobs.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "feat: hero section with letter cascade and scroll hint"
```

---

## Task 5: Scroll reveal utility (reveal.js)

**Files:**
- Create: `js/reveal.js`

- [ ] **Step 1: Create `js/reveal.js`**

```javascript
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
})();
```

- [ ] **Step 2: Verify in browser**

Reload `http://localhost:8000`. No visible change yet (no `.reveal` elements exist), but confirm no console errors. Open DevTools → Sources → Page → `js/reveal.js` loads as 200.

- [ ] **Step 3: Commit**

```bash
git add js/reveal.js
git commit -m "feat: scroll-reveal utility using IntersectionObserver"
```

---

## Task 6: Welcome / Invitation section

**Files:**
- Modify: `index.html` (welcome section markup)
- Modify: `css/styles.css` (welcome styles)

- [ ] **Step 1: Replace empty `#welcome` section in `index.html`**

```html
<section id="welcome" class="welcome">
  <hr class="divider-hair reveal" />
  <p class="welcome__sentence serif-display reveal">
    გვექნება დიდი სიხარული, თუ ჩვენთან ერთად აღნიშნავთ ცხოვრების ყველაზე მნიშვნელოვან დღეს.
  </p>
  <hr class="divider-hair reveal" />
</section>
```

- [ ] **Step 2: Append welcome styles to `css/styles.css`**

```css
.welcome {
  max-width: var(--read-max);
  text-align: center;
}
.welcome__sentence {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(20px, 2.6vw, 28px);
  line-height: 1.45;
  color: var(--ink);
  margin: 24px 0;
}
```

- [ ] **Step 3: Verify in browser**

Reload `http://localhost:8000` and scroll past the hero. Expected: the italic sentence appears between two short hairline dividers, fading up smoothly as it enters the viewport.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: welcome section with reveal-on-scroll dividers"
```

---

## Task 7: Countdown section + digit flip

**Files:**
- Modify: `index.html` (countdown markup)
- Modify: `css/styles.css` (countdown styles + flip animation)
- Create: `js/countdown.js`

- [ ] **Step 1: Replace empty `#countdown` section in `index.html`**

```html
<section id="countdown" class="countdown">
  <p class="microcopy reveal" style="text-align: center; margin: 0 0 32px;">ჯვრისწერამდე დარჩა</p>
  <div class="countdown__grid" aria-live="off">
    <div class="countdown__cell">
      <span class="countdown__value" data-cd="days">--</span>
      <span class="countdown__label microcopy">დღე</span>
    </div>
    <div class="countdown__cell">
      <span class="countdown__value" data-cd="hours">--</span>
      <span class="countdown__label microcopy">საათი</span>
    </div>
    <div class="countdown__cell">
      <span class="countdown__value" data-cd="mins">--</span>
      <span class="countdown__label microcopy">წუთი</span>
    </div>
    <div class="countdown__cell">
      <span class="countdown__value" data-cd="secs">--</span>
      <span class="countdown__label microcopy">წამი</span>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append countdown styles to `css/styles.css`**

```css
.countdown { text-align: center; }
.countdown__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  max-width: 720px;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .countdown__grid { grid-template-columns: repeat(4, 1fr); }
}
.countdown__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.countdown__value {
  font-family: var(--font-display);
  font-size: clamp(56px, 9vw, 96px);
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--ink);
  display: inline-block;
  perspective: 600px;
  transition: transform 400ms var(--ease-out);
  transform-style: preserve-3d;
}
.countdown__value.is-flipping {
  animation: digit-flip 400ms var(--ease-out);
}
@keyframes digit-flip {
  0%   { transform: rotateX(0deg);  }
  50%  { transform: rotateX(90deg); }
  51%  { transform: rotateX(-90deg); }
  100% { transform: rotateX(0deg);  }
}
@media (prefers-reduced-motion: reduce) {
  .countdown__value.is-flipping { animation: none; }
}
```

- [ ] **Step 3: Create `js/countdown.js`**

```javascript
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
    setValue(els.days,  pad(t.days, 3));
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
```

- [ ] **Step 4: Sanity-check countdown math in browser console**

Reload `http://localhost:8000`. Open DevTools → Console. Run:

```javascript
__countdownCompute(new Date('2026-07-12T15:00:00+04:00').getTime())
// Expected: { days: 0, hours: 0, mins: 0, secs: 0 }

__countdownCompute(new Date('2026-07-11T15:00:00+04:00').getTime())
// Expected: { days: 1, hours: 0, mins: 0, secs: 0 }

__countdownCompute(new Date('2026-07-12T14:59:00+04:00').getTime())
// Expected: { days: 0, hours: 0, mins: 1, secs: 0 }
```

If all three return the expected values, the math is correct.

- [ ] **Step 5: Verify in browser visually**

Scroll to countdown section. Expected: 2×2 grid on mobile / 4-column row on desktop. Digits show actual remaining time. Seconds column flips smoothly every second (3D rotate). No layout shift while digits change (tabular-nums).

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css js/countdown.js
git commit -m "feat: countdown with 3D digit flip targeting 2026-07-12 15:00 Tbilisi"
```

---

## Task 8: Our Story section + clip-path reveal + parallax

**Files:**
- Modify: `index.html` (story section markup)
- Modify: `css/styles.css` (story styles + clip-path animation)
- Add to existing `js/reveal.js`: parallax + image clip-path handler

For now, photos are placeholders. Create four placeholder images by saving any small jpg/webp as `image/story-01.webp`, `image/story-02.webp`, `image/story-03.webp`, `image/story-04.webp`. They can be replaced before deploy without touching markup.

- [ ] **Step 1: Replace empty `#story` section in `index.html`**

```html
<section id="story" class="story">
  <h2 class="section-title reveal">ჩვენი ისტორია</h2>

  <article class="story__chapter" data-chapter="1">
    <div class="story__media reveal">
      <div class="story__image-wrap">
        <img class="story__image" src="image/story-01.webp" alt="" width="520" height="650" loading="lazy" />
      </div>
    </div>
    <div class="story__text reveal">
      <p class="microcopy">Chapter 01 — პირველი შეხვედრა</p>
      <h3 class="serif-display story__headline">სადაც ყველაფერი დაიწყო</h3>
      <p class="story__body">აქ მოვა ჩვენი პირველი შეხვედრის მოკლე ისტორია. ორი წინადადება საკმარისია — დანარჩენი ფოტოს დარჩება.</p>
    </div>
  </article>

  <article class="story__chapter" data-chapter="2">
    <div class="story__text reveal">
      <p class="microcopy">Chapter 02 — პირველი თარიღი</p>
      <h3 class="serif-display story__headline">პირველი საღამო</h3>
      <p class="story__body">პირველი თარიღი იყო ისეთი, რომელიც დიდხანს გვახსოვს. ღამეც გრძელი იყო და სიცილიც.</p>
    </div>
    <div class="story__media reveal">
      <div class="story__image-wrap">
        <img class="story__image" src="image/story-02.webp" alt="" width="520" height="650" loading="lazy" />
      </div>
    </div>
  </article>

  <article class="story__chapter" data-chapter="3">
    <div class="story__media reveal">
      <div class="story__image-wrap">
        <img class="story__image" src="image/story-03.webp" alt="" width="520" height="650" loading="lazy" />
      </div>
    </div>
    <div class="story__text reveal">
      <p class="microcopy">Chapter 03 — წინადადება</p>
      <h3 class="serif-display story__headline">და მერე — „კი"</h3>
      <p class="story__body">წინადადება მოულოდნელად მოვიდა, თუმცა მისი პასუხი — დაუყოვნებლივ.</p>
    </div>
  </article>

  <article class="story__chapter" data-chapter="4">
    <div class="story__text reveal">
      <p class="microcopy">Chapter 04 — და აი, აქამდე მოვედით</p>
      <h3 class="serif-display story__headline">და აქედან ერთად</h3>
      <p class="story__body">დღეს გვინდა ეს მნიშვნელოვანი დღე თქვენთან, ჩვენთვის ყველაზე ახლობელ ხალხთან გავიზიაროთ.</p>
    </div>
    <div class="story__media reveal">
      <div class="story__image-wrap">
        <img class="story__image" src="image/story-04.webp" alt="" width="520" height="650" loading="lazy" />
      </div>
    </div>
  </article>
</section>
```

- [ ] **Step 2: Append story styles to `css/styles.css`**

```css
.story__chapter {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin: 0 auto clamp(80px, 12vh, 160px);
  max-width: 1100px;
  align-items: center;
}
.story__chapter:last-child { margin-bottom: 0; }

@media (min-width: 900px) {
  .story__chapter {
    grid-template-columns: 6fr 6fr;
    gap: 80px;
  }
}

.story__image-wrap {
  overflow: hidden;
  border-radius: 4px;
  position: relative;
}
.story__image {
  width: 100%;
  height: auto;
  display: block;
  border: 1px solid var(--line);
  border-radius: 4px;
  clip-path: inset(100% 0 0 0);
  transition: clip-path 900ms var(--ease-out), transform 1200ms linear;
  transform: translateY(var(--parallax, 0));
  will-change: clip-path, transform;
}
.story__media.is-visible .story__image {
  clip-path: inset(0 0 0 0);
}

.story__text { max-width: 480px; }
.story__text .microcopy { margin: 0 0 12px; }
.story__headline {
  font-size: clamp(28px, 3.6vw, 42px);
  margin: 0 0 16px;
  line-height: 1.15;
}
.story__body {
  color: var(--ink-soft);
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .story__image { clip-path: none; transform: none; transition: none; }
}
```

- [ ] **Step 3: Append parallax handler to `js/reveal.js`**

Insert this just before the closing `})();` of `js/reveal.js`:

```javascript
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
```

- [ ] **Step 4: Add four placeholder images**

Until real photos are provided, generate placeholders so the layout fills correctly. Run from repo root:

```bash
# Download Unsplash placeholders (replaced later by couple)
curl -s -L "https://picsum.photos/seed/story01/520/650" -o image/story-01.webp
curl -s -L "https://picsum.photos/seed/story02/520/650" -o image/story-02.webp
curl -s -L "https://picsum.photos/seed/story03/520/650" -o image/story-03.webp
curl -s -L "https://picsum.photos/seed/story04/520/650" -o image/story-04.webp
```

Note: `picsum.photos` returns JPEGs even with `.webp` extension — that's OK because browsers sniff by content. Real WebP files will be swapped in by the couple before deploy.

- [ ] **Step 5: Verify in browser**

Reload, scroll to "Our Story". Expected: alternating image / text rows. As each enters viewport, image is revealed top-to-bottom via clip-path (vertical wipe). Text fades up shortly after. Continued scrolling causes images to drift gently (parallax). On a narrow viewport (≤ 900px), each chapter is single-column with image above text.

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css js/reveal.js image/story-01.webp image/story-02.webp image/story-03.webp image/story-04.webp
git commit -m "feat: our story section with clip-path reveal and scroll parallax"
```

---

## Task 9: Ceremony & Reception section

**Files:**
- Modify: `index.html` (events section markup)
- Modify: `css/styles.css` (events styles)

- [ ] **Step 1: Replace empty `#events` section in `index.html`**

```html
<section id="events" class="events">
  <h2 class="section-title reveal">12 ივლისი, 2026</h2>

  <div class="events__grid">
    <article class="event reveal">
      <p class="microcopy event__label">ჯვრისწერა</p>
      <p class="event__time serif-display">15:00</p>
      <p class="event__venue">წმ. ილია მართალის ტაძარი</p>
      <p class="event__city">საგურამო</p>
      <a class="event__map" href="https://maps.app.goo.gl/Hjb79ozCgQ8ew2n46" target="_blank" rel="noopener">
        <span>მისამართის ნახვა</span>
        <span aria-hidden="true">→</span>
      </a>
    </article>

    <div class="events__divider" aria-hidden="true"></div>

    <article class="event reveal">
      <p class="microcopy event__label">ქორწილი</p>
      <p class="event__time serif-display">19:00</p>
      <p class="event__venue">რესტორანი ბაგინეთი</p>
      <p class="event__city">მცხეთა</p>
      <a class="event__map" href="https://maps.app.goo.gl/xgGkoSygaK6BY4sy6" target="_blank" rel="noopener">
        <span>მისამართის ნახვა</span>
        <span aria-hidden="true">→</span>
      </a>
    </article>
  </div>
</section>
```

- [ ] **Step 2: Append events styles to `css/styles.css`**

```css
.events__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  align-items: start;
  max-width: 900px;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .events__grid {
    grid-template-columns: 1fr 1px 1fr;
    gap: 64px;
  }
  .events__divider { background: var(--line); width: 1px; height: 100%; min-height: 220px; justify-self: center; }
}
.events__divider { display: none; }
@media (min-width: 768px) {
  .events__divider { display: block; }
}

.event { text-align: center; }
.event__label { margin: 0 0 16px; }
.event__time {
  font-size: clamp(48px, 6vw, 72px);
  margin: 0 0 16px;
  line-height: 1;
}
.event__venue {
  font-size: 18px;
  margin: 0 0 4px;
  color: var(--ink);
}
.event__city {
  color: var(--ink-soft);
  margin: 0 0 24px;
}
.event__map {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
  color: var(--ink);
  font-size: 14px;
  letter-spacing: 0.04em;
  padding-bottom: 4px;
}
.event__map::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 400ms var(--ease-out);
}
.event__map:hover { color: var(--accent); }
.event__map:hover::after,
.event__map:focus-visible::after { transform: scaleX(1); }
```

- [ ] **Step 3: Verify in browser**

Reload, scroll to events. Expected: two centered columns on desktop with thin vertical divider between; stacked on mobile. Each shows label / time / venue / city / "მისამართის ნახვა →". Hovering a map link draws a terracotta underline from left to right. Clicking opens the Google Maps URL in a new tab.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: ceremony & reception section with map links"
```

---

## Task 10: RSVP form markup + styles

**Files:**
- Modify: `index.html` (rsvp section markup)
- Modify: `css/styles.css` (rsvp styles)

- [ ] **Step 1: Replace empty `#rsvp` section in `index.html`**

```html
<section id="rsvp" class="rsvp">
  <div class="rsvp__inner">
    <h2 class="section-title reveal">დაგვიდასტურეთ მონაწილეობა</h2>
    <p class="rsvp__sub reveal serif-display">გთხოვთ დაგვიდასტუროთ თქვენი მონაწილეობა <em>1 ივლისი 2026</em>-მდე</p>

    <form id="rsvp-form" class="rsvp__form reveal" novalidate>
      <label class="rsvp__label" for="rsvp-name">სახელი და გვარი</label>
      <input id="rsvp-name" name="name" type="text" class="rsvp__input"
             required maxlength="80" autocomplete="name" />
      <p id="rsvp-name-help" class="rsvp__help microcopy" aria-live="polite"></p>

      <div class="rsvp__actions">
        <button type="submit" class="btn btn--solid" data-attending="true">
          <span class="btn__label">დიახ, აუცილებლად</span>
          <span class="btn__spinner" aria-hidden="true"></span>
        </button>
        <button type="submit" class="btn btn--outline" data-attending="false">
          <span class="btn__label">სამწუხაროდ, ვერ მოვალ</span>
          <span class="btn__spinner" aria-hidden="true"></span>
        </button>
      </div>
    </form>

    <div id="rsvp-success" class="rsvp__success" hidden>
      <svg class="rsvp__check" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" stroke-width="1.5" />
        <path d="M14 25 L21 32 L34 17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <p class="rsvp__success-title serif-display">გმადლობთ, <span data-name></span>!</p>
      <p class="rsvp__success-body">თქვენი პასუხი მიღებულია.</p>
    </div>

    <div id="rsvp-error" class="rsvp__error" hidden role="alert">
      <p>რაღაც შეცდომა მოხდა. გთხოვთ, სცადოთ ხელახლა.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append RSVP styles to `css/styles.css`**

```css
.rsvp__inner { max-width: 520px; margin: 0 auto; text-align: center; }
.rsvp__sub {
  font-style: italic;
  font-size: clamp(16px, 2vw, 18px);
  color: var(--ink-soft);
  margin: 0 0 40px;
}
.rsvp__sub em { font-style: italic; color: var(--ink); }

.rsvp__form { display: flex; flex-direction: column; gap: 16px; text-align: left; }
.rsvp__label {
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-soft);
  font-weight: 500;
}
.rsvp__input {
  font: inherit;
  font-size: 18px;
  padding: 14px 16px;
  background: transparent;
  border: 1px solid var(--line);
  border-bottom: 1px solid var(--ink);
  border-radius: 2px;
  color: var(--ink);
  transition: border-color 200ms var(--ease-out);
}
.rsvp__input:focus { outline: none; border-color: var(--accent); }
.rsvp__help { min-height: 16px; margin: 0; color: var(--accent); text-transform: none; letter-spacing: 0; }

.rsvp__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}
@media (min-width: 480px) {
  .rsvp__actions { flex-direction: row; }
  .rsvp__actions .btn { flex: 1; }
}

.btn {
  position: relative;
  padding: 16px 24px;
  font-size: 15px;
  letter-spacing: 0.04em;
  border-radius: 999px;
  transition: transform 200ms var(--ease-out), background 200ms var(--ease-out), color 200ms var(--ease-out);
  overflow: hidden;
}
.btn--solid {
  background: var(--accent);
  color: var(--bg);
  border: 1px solid var(--accent);
}
.btn--solid:hover { background: #b66948; border-color: #b66948; }
.btn--outline {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--ink);
}
.btn--outline:hover { background: var(--ink); color: var(--bg); }
.btn:disabled { opacity: 0.7; cursor: not-allowed; }

.btn__spinner {
  position: absolute;
  inset: 0;
  display: none;
  place-items: center;
}
.btn.is-loading .btn__label { opacity: 0; }
.btn.is-loading .btn__spinner { display: grid; }
.btn__spinner::after {
  content: '';
  width: 16px; height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.rsvp__form { transition: transform 600ms var(--ease-out), opacity 400ms var(--ease-out); transform-origin: 50% 50%; transform-style: preserve-3d; }
.rsvp__form.is-gone { transform: rotateX(90deg); opacity: 0; pointer-events: none; }

.rsvp__success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  opacity: 0;
  transform: rotateX(-90deg);
  transform-origin: 50% 50%;
  transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out);
  transform-style: preserve-3d;
}
.rsvp__success.is-shown { opacity: 1; transform: rotateX(0deg); }
.rsvp__check { width: 56px; height: 56px; color: var(--accent); }
.rsvp__success-title { font-size: clamp(22px, 3vw, 28px); margin: 0; }
.rsvp__success-body { color: var(--ink-soft); margin: 0; }

.rsvp__error { margin-top: 24px; color: var(--accent); }

@media (prefers-reduced-motion: reduce) {
  .rsvp__form, .rsvp__success { transition: opacity 200ms ease; transform: none !important; }
  .btn__spinner::after { animation: none; }
}
```

- [ ] **Step 3: Verify in browser**

Reload, scroll to RSVP. Expected: centered max-520px form. Input with clean underline-style border. Two pill buttons — filled terracotta "დიახ" and outline "სამწუხაროდ". Both fade up on scroll. Clicking either does nothing yet (no JS wired). Hovering shows the hover treatments.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: RSVP form markup, input, two pill CTAs, success/error containers"
```

---

## Task 11: Google Apps Script + deploy README

**Files:**
- Create: `google-apps-script/Code.gs`
- Create: `google-apps-script/README.md`

- [ ] **Step 1: Create `google-apps-script/Code.gs`**

```javascript
/**
 * RSVP collector for Giorgi & Tamar wedding (12 July 2026).
 * Deploy: Extensions → Apps Script → Deploy → New deployment → Web app
 *   Execute as: Me (owner)
 *   Who has access: Anyone
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (!data || !data.name || typeof data.attending !== 'boolean') {
      return _json({ ok: false, error: 'invalid_payload' });
    }

    const name = String(data.name).trim().slice(0, 80);
    if (!name) return _json({ ok: false, error: 'empty_name' });

    const sheet = SpreadsheetApp.getActive().getSheetByName('RSVPs');
    if (!sheet) return _json({ ok: false, error: 'missing_sheet' });

    sheet.appendRow([new Date().toISOString(), name, data.attending, 'web']);
    return _json({ ok: true });
  } catch (err) {
    console.error(err);
    return _json({ ok: false, error: 'server_error' });
  }
}

function doGet() {
  return _json({ ok: true, service: 'rsvp', version: 1 });
}

function _json(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
```

- [ ] **Step 2: Create `google-apps-script/README.md`**

```markdown
# RSVP Backend — Apps Script Deploy

This is a one-time setup. Result: a stable Web App URL the website calls to record RSVPs into a Google Sheet.

## 1. Create the Sheet

1. Visit <https://sheets.new>.
2. Rename the spreadsheet (e.g., "Wedding RSVPs").
3. Rename `Sheet1` → `RSVPs`.
4. In row 1, type these headers:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Attending`
   - D1: `Source`

## 2. Attach the Script

1. In the spreadsheet menu: **Extensions → Apps Script**.
2. Delete the default `Code.gs` content.
3. Paste the full contents of this folder's `Code.gs`.
4. **Save** (cmd/ctrl + S).

## 3. Deploy as Web App

1. Top-right **Deploy → New deployment**.
2. Gear icon → **Web app**.
3. Settings:
   - Description: `RSVP v1`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. **Deploy**.
5. Grant the permission prompt (script will warn it can write to the sheet — that's the point).
6. Copy the **Web app URL** that ends in `/exec`.

## 4. Wire to Frontend

Open `js/rsvp.js` in the repo and replace the `APPS_SCRIPT_URL` constant with the copied URL.

## 5. Smoke Test

From any terminal:

```bash
curl -X POST "<YOUR_URL>" \
  -H "Content-Type: text/plain;charset=utf-8" \
  --data '{"name":"Test User","attending":true}'
```

Expected: `{"ok":true}`. Check the sheet — a new row should appear.
```

- [ ] **Step 3: Verify (no browser test for backend)**

This task creates files only; the actual deploy happens when the couple is ready. Verify the files exist and the script parses as valid JavaScript:

```bash
node --check google-apps-script/Code.gs
```

Expected: no output (success).

- [ ] **Step 4: Commit**

```bash
git add google-apps-script/Code.gs google-apps-script/README.md
git commit -m "feat: Apps Script doPost handler + step-by-step deploy guide"
```

---

## Task 12: RSVP frontend submission + morph animation

**Files:**
- Create: `js/rsvp.js`

- [ ] **Step 1: Create `js/rsvp.js`**

```javascript
(function () {
  'use strict';

  // PLACEHOLDER — replace with the Apps Script /exec URL after deploy.
  const APPS_SCRIPT_URL = '__APPS_SCRIPT_URL__';

  const SESSION_KEY = 'rsvp-submitted-v1';

  const form     = document.getElementById('rsvp-form');
  const input    = document.getElementById('rsvp-name');
  const help     = document.getElementById('rsvp-name-help');
  const success  = document.getElementById('rsvp-success');
  const errorBox = document.getElementById('rsvp-error');
  const nameOut  = success ? success.querySelector('[data-name]') : null;

  if (!form) return;

  // If already submitted in this session, show the success state directly.
  const prev = sessionStorage.getItem(SESSION_KEY);
  if (prev) {
    try {
      const { name } = JSON.parse(prev);
      revealSuccess(name);
    } catch (_) { /* ignore */ }
  }

  function setHelp(msg) { if (help) help.textContent = msg || ''; }

  function disableButtons(disabled) {
    form.querySelectorAll('button[type="submit"]').forEach((b) => {
      b.disabled = disabled;
    });
  }

  function revealSuccess(name) {
    form.classList.add('is-gone');
    if (nameOut) nameOut.textContent = name;
    if (success) {
      success.hidden = false;
      requestAnimationFrame(() => success.classList.add('is-shown'));
    }
  }

  function revealError() {
    if (errorBox) errorBox.hidden = false;
  }

  async function submitRsvp(name, attending) {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ name, attending }),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    });
    return res.json();
  }

  async function handle(e, btn) {
    e.preventDefault();
    setHelp('');
    if (errorBox) errorBox.hidden = true;

    const name = (input.value || '').trim();
    if (!name) {
      setHelp('გთხოვთ შეიყვანოთ სახელი');
      input.focus();
      return;
    }
    if (name.length > 80) {
      setHelp('სახელი ძალიან გრძელია');
      return;
    }

    const attending = btn.dataset.attending === 'true';

    btn.classList.add('is-loading');
    disableButtons(true);

    const minDelay = new Promise((r) => setTimeout(r, 300));

    try {
      const [result] = await Promise.all([
        submitRsvp(name, attending),
        minDelay,
      ]);
      btn.classList.remove('is-loading');

      if (result && result.ok) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name, attending }));
        revealSuccess(name);
      } else {
        disableButtons(false);
        revealError();
      }
    } catch (err) {
      btn.classList.remove('is-loading');
      disableButtons(false);
      revealError();
    }
  }

  form.querySelectorAll('button[type="submit"]').forEach((btn) => {
    btn.addEventListener('click', (e) => handle(e, btn));
  });
})();
```

- [ ] **Step 2: Verify in browser (offline path)**

Reload `http://localhost:8000`. Scroll to RSVP. Enter a name and click either button. Because `APPS_SCRIPT_URL` is still `__APPS_SCRIPT_URL__`, fetch will fail. Expected: spinner shows for ≥ 300ms, then error message appears: "რაღაც შეცდომა მოხდა. გთხოვთ, სცადოთ ხელახლა." Buttons re-enable.

Then test empty-name path: clear input, click button. Expected: "გთხოვთ შეიყვანოთ სახელი" appears below input, focus jumps to input, no fetch fires.

- [ ] **Step 3: Verify happy path with mocked fetch**

In DevTools Console, run:

```javascript
window.fetch = async () => ({ json: async () => ({ ok: true }) });
sessionStorage.removeItem('rsvp-submitted-v1');
location.reload();
```

After reload, enter a name and click "დიახ, აუცილებლად". Expected: spinner ≥ 300ms, then form rotates out on rotateX axis, success card rotates in showing the name and checkmark. Reload the page — success state persists (sessionStorage hit).

Clear it again before continuing:
```javascript
sessionStorage.removeItem('rsvp-submitted-v1');
```

- [ ] **Step 4: Commit**

```bash
git add js/rsvp.js
git commit -m "feat: RSVP submission with morph animation, sessionStorage guard, error handling"
```

---

## Task 13: Footer + monogram draw

**Files:**
- Modify: `index.html` (footer markup)
- Modify: `css/styles.css` (footer + stroke draw)

- [ ] **Step 1: Replace empty `#footer` in `index.html`**

```html
<footer id="footer" class="footer">
  <div class="footer__inner reveal">
    <svg class="footer__monogram" viewBox="0 0 120 60" aria-hidden="true">
      <path d="M 38 18 Q 22 18, 22 32 Q 22 46, 38 46 L 38 36 L 30 36"
            fill="none" stroke="currentColor" stroke-width="1.25"
            stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 56 22 Q 62 16, 70 22 M 60 22 L 60 46"
            fill="none" stroke="currentColor" stroke-width="1.25"
            stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 82 18 L 100 18 L 91 18 L 91 46"
            fill="none" stroke="currentColor" stroke-width="1.25"
            stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <p class="footer__caption microcopy">გიორგი &amp; თამარი · 2026</p>
  </div>
</footer>
```

- [ ] **Step 2: Append footer styles to `css/styles.css`**

```css
.footer {
  padding: 120px 24px 80px;
  text-align: center;
  color: var(--ink-soft);
}
.footer__inner { display: inline-flex; flex-direction: column; align-items: center; gap: 16px; }
.footer__monogram {
  width: 80px;
  height: auto;
  color: var(--accent);
}
.footer__monogram path {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  transition: stroke-dashoffset 1200ms var(--ease-out);
}
.footer__monogram path:nth-child(2) { transition-delay: 200ms; }
.footer__monogram path:nth-child(3) { transition-delay: 400ms; }
.footer__inner.is-visible .footer__monogram path { stroke-dashoffset: 0; }

.footer__caption { margin: 0; }

@media (prefers-reduced-motion: reduce) {
  .footer__monogram path { stroke-dashoffset: 0; transition: none; }
}
```

- [ ] **Step 3: Verify in browser**

Reload, scroll to bottom. Expected: as the footer enters viewport, the three monogram strokes draw in sequentially over ~1.2s, each starting 200ms after the previous. The terracotta "G T" mark sits above "გიორგი & თამარი · 2026".

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: footer with stroke-draw monogram on scroll-into-view"
```

---

## Task 14: Background music toggle + tooltip

**Files:**
- Modify: `index.html` (music toggle SVG + tooltip refinement)
- Modify: `css/styles.css` (music styles)
- Create: `js/music.js`

- [ ] **Step 1: Replace the music button + tooltip in `index.html`**

Find the existing `<button id="music-toggle" ...>` and `<div id="music-tooltip" ...>` and replace with:

```html
<button id="music-toggle" class="music-toggle" type="button"
        aria-pressed="false" aria-label="ფონური მუსიკის ჩართვა">
  <svg class="music-toggle__icon music-toggle__icon--play" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </svg>
  <svg class="music-toggle__icon music-toggle__icon--pause" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="6" y="5" width="4" height="14" fill="currentColor" />
    <rect x="14" y="5" width="4" height="14" fill="currentColor" />
  </svg>
</button>
<div id="music-tooltip" class="music-tooltip" role="status">
  მუსიკის ჩასართავად დააწექი ♪
</div>
```

- [ ] **Step 2: Append music styles to `css/styles.css`**

```css
.music-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--bg);
  border: 1px solid var(--line);
  color: var(--accent);
  display: grid;
  place-items: center;
  opacity: 0.6;
  transition: opacity 200ms var(--ease-out), transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.music-toggle:hover,
.music-toggle:focus-visible { opacity: 1; transform: scale(1.05); box-shadow: 0 4px 14px rgba(0,0,0,0.08); }
.music-toggle__icon { width: 18px; height: 18px; }
.music-toggle__icon--pause { display: none; }
.music-toggle.is-playing .music-toggle__icon--play { display: none; }
.music-toggle.is-playing .music-toggle__icon--pause { display: block; }

.music-tooltip {
  position: fixed;
  top: 28px;
  right: 76px;
  z-index: 100;
  background: var(--ink);
  color: var(--bg);
  font-size: 12px;
  letter-spacing: 0.04em;
  padding: 8px 14px;
  border-radius: 999px;
  opacity: 0;
  transform: translateX(8px);
  transition: opacity 300ms var(--ease-out), transform 300ms var(--ease-out);
  pointer-events: none;
  white-space: nowrap;
}
.music-tooltip.is-shown { opacity: 1; transform: translateX(0); }
```

- [ ] **Step 3: Create `js/music.js`**

```javascript
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
```

- [ ] **Step 4: Verify in browser**

Reload `http://localhost:8000`. Expected: small circular music button at top-right with play icon. After 2 seconds, tooltip slides in: "მუსიკის ჩასართავად დააწექი ♪". Tooltip auto-dismisses after 5s. Click the button — without `audio/ambient.mp3` present this will fail silently and the icon stays as play. Add any small mp3 to `audio/ambient.mp3` to fully test fade-in (or trust the failed-play branch logs no error).

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css js/music.js
git commit -m "feat: floating music toggle with tooltip and volume fade"
```

---

## Task 15: Magnetic RSVP buttons + cursor ring

**Files:**
- Create: `js/cursor.js`
- Modify: `css/styles.css` (cursor ring styles)

- [ ] **Step 1: Append cursor ring styles to `css/styles.css`**

```css
@media (hover: hover) and (pointer: fine) {
  .cursor-ring {
    position: fixed;
    top: 0; left: 0;
    width: 24px; height: 24px;
    border: 1px solid var(--ink);
    border-radius: 50%;
    pointer-events: none;
    transform: translate3d(-50%, -50%, 0);
    transition: width 200ms var(--ease-out), height 200ms var(--ease-out), opacity 200ms var(--ease-out);
    z-index: 9998;
    opacity: 0;
    mix-blend-mode: difference;
  }
  .cursor-ring.is-active { opacity: 1; }
  .cursor-ring.is-hover { width: 40px; height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .cursor-ring { display: none !important; }
}
```

- [ ] **Step 2: Create `js/cursor.js`**

```javascript
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
```

- [ ] **Step 3: Verify in browser (desktop only)**

On a desktop browser, reload `http://localhost:8000`. Expected: a small circle follows your cursor with smooth lag. Hovering interactive elements (links, buttons, the form input) grows the ring. Hovering near (but not on) an RSVP button pulls the button gently toward your cursor. On mobile / touch (or DevTools "Toggle device toolbar" → touch mode), the ring is hidden and magnetism is disabled.

- [ ] **Step 4: Commit**

```bash
git add css/styles.css js/cursor.js
git commit -m "feat: magnetic RSVP buttons + optional cursor ring (desktop, feature-flagged)"
```

---

## Task 16: Accessibility + reduced-motion audit

**Files:**
- Modify: `index.html` (add reveal classes, aria refinements)
- Modify: `css/styles.css` (focus + skip-link if needed)

This task is a sweep — no new feature, just verifying every spec accessibility requirement is honored.

- [ ] **Step 1: Add `reveal` class to remaining headings**

In `index.html`, search for every `<section>` and ensure the section title and at least one body element carry the `reveal` class so scroll-reveal applies. Check Hero (skip — has its own cascade), Welcome (done), Countdown (done), Story (done), Events (done), RSVP (done). No edits expected unless something was missed.

- [ ] **Step 2: Add `aria-live="polite"` to RSVP success container**

In `index.html`, find `<div id="rsvp-success" class="rsvp__success" hidden>` and update to:

```html
<div id="rsvp-success" class="rsvp__success" hidden aria-live="polite">
```

- [ ] **Step 3: Run an accessibility check in DevTools Lighthouse**

Run from the page:
- DevTools → Lighthouse → Accessibility only → Analyze.
- Expected: score ≥ 95. Note any issues flagged.

Common items Lighthouse may flag and how to fix:
- Missing `alt`: every `<img class="story__image">` already has `alt=""` (decorative, OK because text describes the story). If Lighthouse flags this, leave alone — empty `alt` is valid for decorative images.
- Color contrast: terracotta on off-white passes AA. Confirm in DevTools color picker.

- [ ] **Step 4: Test reduced-motion**

In DevTools → Rendering → "Emulate CSS media feature `prefers-reduced-motion`" → reduce. Reload. Expected:
- Loader monogram does not pulse (still visible).
- Hero letters appear at once (no cascade).
- Section reveals appear immediately (no fade-up).
- Countdown digits do not flip.
- Story images appear without clip-path or parallax.
- Footer monogram appears already drawn.
- Cursor ring is hidden, magnetic buttons disabled.

- [ ] **Step 5: Keyboard navigation pass**

With keyboard only (Tab / Shift+Tab / Enter):
- Tab through document. Expected order: music toggle → RSVP name input → "დიახ" button → "სამწუხაროდ" button → map links.
- Visible focus ring (terracotta outline) appears on every focused element.
- `Enter` on either RSVP button triggers submission (works because the buttons are inside a form).

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "fix(a11y): aria-live on RSVP success, verify focus order and reduced-motion paths"
```

---

## Task 17: Performance pass + root README

**Files:**
- Modify: `index.html` (font preload hints)
- Modify: `README.md` (deployment + maintenance instructions)

- [ ] **Step 1: Add font preload hints to `index.html`**

In `<head>`, immediately after the two `preconnect` links, add:

```html
<link rel="preload" as="style" href="css/fonts.css" />
```

(Google Fonts' `@import` already includes `display=swap`, which prevents FOIT-related CLS.)

- [ ] **Step 2: Lighthouse Performance check**

DevTools → Lighthouse → Performance only → Mobile → Analyze. Targets per spec §9:

- LCP ≤ 2.0s (note: placeholder picsum images load slower than real WebP will; LCP may be artificially high until real images replace them)
- CLS = 0
- JS transfer ≤ 30KB (we ship ~10KB total — well under)
- CSS transfer ≤ 25KB (one file, well under)

Confirm CLS is 0. The image `width`/`height` attributes are set in markup which reserves layout space.

- [ ] **Step 3: Rewrite `README.md`**

Replace the existing `README.md` with:

```markdown
# Giorgi & Tamar — Wedding Invitation

A single-page wedding invitation site for **გიორგი & თამარი**, 12 ივლისი 2026.

Live URL: _set after deploy_

## Stack

- Vanilla HTML / CSS / JavaScript — no frameworks, no build step.
- RSVP backend: Google Apps Script Web App → Google Sheet.
- Hosting: any static host (Netlify, Vercel, Cloudflare Pages).

## Structure

```
index.html              page
css/                    styles + font imports
js/                     countdown, RSVP, reveal, music, cursor, main
image/                  monogram + story photos
audio/                  ambient.mp3 (background music)
google-apps-script/     Apps Script files + deploy README
docs/superpowers/       design spec + implementation plan
```

## Local development

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deployment checklist

1. **RSVP backend.** Follow `google-apps-script/README.md` to deploy `Code.gs` as a Web App. Copy the `/exec` URL.
2. **Wire URL.** Open `js/rsvp.js` and replace `__APPS_SCRIPT_URL__` with the URL.
3. **Real photos.** Replace placeholder files `image/story-01.webp` through `image/story-04.webp` with the couple's photos (520×650 recommended, WebP preferred, < 100KB each).
4. **Audio.** Drop the licensed piano track at `audio/ambient.mp3`.
5. **Story copy.** Update each `.story__chapter` in `index.html` with real chapter titles + paragraphs.
6. **RSVP deadline.** In `index.html`, find `.rsvp__sub` and replace `1 ივლისი 2026` with the chosen deadline.
7. **Deploy.** Drag the project folder into Netlify Drop (https://app.netlify.com/drop) or `vercel --prod`.
8. **Smoke test.** Open the deployed URL on mobile, submit a test RSVP, verify a row appears in the sheet.

## Maintenance knobs

| What | Where |
| --- | --- |
| Ceremony date/time | `js/countdown.js` — `TARGET` constant |
| RSVP deadline copy | `index.html` — `.rsvp__sub` |
| Apps Script URL | `js/rsvp.js` — `APPS_SCRIPT_URL` |
| Background music volume | `js/music.js` — `TARGET_VOL` (default 0.3) |
| Cursor ring on/off | `js/cursor.js` — `FEATURE_FLAG_CURSOR_RING` |

## Spec & plan

- Design spec: [`docs/superpowers/specs/2026-06-08-wedding-invitation-design.md`](docs/superpowers/specs/2026-06-08-wedding-invitation-design.md)
- Implementation plan: [`docs/superpowers/plans/2026-06-08-wedding-invitation-implementation.md`](docs/superpowers/plans/2026-06-08-wedding-invitation-implementation.md)
```

- [ ] **Step 4: Final smoke test**

Reload `http://localhost:8000`. Walk through full page once on desktop, then again on DevTools mobile emulation (iPhone 12). Verify:
- All sections render and reveal correctly
- Countdown ticks
- RSVP error state appears with placeholder URL
- Music tooltip shows and dismisses
- No console errors
- No layout shift while scrolling

- [ ] **Step 5: Commit**

```bash
git add index.html README.md
git commit -m "chore: font preload hint, root README with deploy + maintenance guide"
```

---

## Done

After Task 17 the site is functionally complete and deployable. Remaining work outside this plan:
- Real photos (Task 8 placeholders → real WebP files)
- Real story copy (Task 8 placeholder Georgian text → couple's chapters)
- Real audio file (`audio/ambient.mp3`)
- Deploy Apps Script and wire `APPS_SCRIPT_URL` in `js/rsvp.js`
- Choose hosting (Netlify drop is easiest)
- Optional: custom domain
