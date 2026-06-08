# Wedding Invitation — Giorgi & Tamar

**Status:** Draft for review
**Date:** 2026-06-08
**Authors:** Giorgi (owner), Claude (design)

## 1. Purpose

A single-page wedding invitation website for **Giorgi & Tamar**, a Georgian couple in their mid-twenties. The site must feel modern and editorial — not a recycled template, not folkloric — and collect RSVP responses (name + yes/no) into a single source of truth the couple can monitor in real time.

**Success criteria:**
- The site evokes "this was made with care, specifically for us" within the first 3 seconds of viewing.
- Any guest, on a mobile device, can submit RSVP in under 15 seconds.
- All RSVPs land in a Google Sheet the couple can open at any time.
- No backend server, no recurring infrastructure cost, no maintenance after deploy.

## 2. Wedding Facts (content)

- **Date:** 12 ივლისი 2026 (Sunday)
- **Ceremony (ჯვრისწერა):** 15:00 — წმ. ილია მართალის ტაძარი, საგურამო
  - Map: <https://maps.app.goo.gl/Hjb79ozCgQ8ew2n46>
- **Reception (ქორწილი):** 19:00 — რესტორანი ბაგინეთი, მცხეთა
  - Map: <https://maps.app.goo.gl/xgGkoSygaK6BY4sy6>
- Street addresses intentionally omitted; only Google Maps links shown.
- Language: Georgian primary. No English/Russian variant for v1.
- Photos: a few non-professional shots available; usable in small editorial grid, **not** full-bleed hero.

## 3. Design Direction

**"Modern Editorial — Quiet Confidence"**

Not traditional, not folkloric. The reference points are *Apple keynote landing pages* × *Kinfolk / Cereal magazine* × the natural beauty of Georgian script. The aesthetic principle: **restraint creates elegance**.

### 3.1 Color palette

```
--bg:        #FAFAF7   /* off-white paper */
--ink:       #0F0F0F   /* deep ink, not pure black */
--ink-soft:  #5C5852   /* secondary text */
--accent:    #C97B5C   /* terracotta — single accent */
--line:      #E8E2D8   /* hairline dividers */
```

A single accent color (terracotta) is used sparingly — primary CTA button, RSVP confirmation, the ampersand in the hero, and nowhere else. Everything else is monochrome on warm white.

### 3.2 Typography

| Role | Latin | Georgian |
| --- | --- | --- |
| Display (large headings, names) | Fraunces (variable, soft-modern serif) | FiraGO Bold / BPG Nino Mtavruli |
| Body (paragraphs, labels) | Inter | FiraGO Regular |
| Microcopy / labels (uppercase, tracked) | Inter, letter-spacing 0.18em | FiraGO Mtavruli, letter-spacing 0.16em |

Type scale (modular, base 16px desktop, base 17px mobile):
- Hero name: `clamp(64px, 14vw, 180px)`
- Section title: `clamp(32px, 5vw, 56px)`
- Body: `17px / line-height 1.65`
- Microcopy: `12px tracked uppercase`

Fonts loaded from Google Fonts with `display=swap` and preconnect — measured load impact ≤ 1 LCP hit.

### 3.3 Layout principles

- Mobile-first. Every section designed for 375px width first, then enhanced for ≥768px and ≥1200px.
- Generous vertical rhythm — section padding is `clamp(96px, 14vh, 200px)` top/bottom.
- Max content width 1200px; reading-width passages clamped to ~640px.
- Asymmetry preferred over rigid centering in "Our Story"; everything else is centered for ceremony.
- Single column on mobile, intentional 2-column splits on desktop.

## 4. Site Structure

Single-page vertical scroll. No multi-route navigation. Sections in order:

1. **Hero** — full viewport, typography-based, sets tone.
2. **Welcome / Invitation** — one sentence inviting the guest.
3. **Countdown** — live timer to 12 July 2026 00:00 Tbilisi time (or to ceremony start 15:00; see open question).
4. **Our Story** — 3–4 chapter cards (alternating image / text) telling how they met.
5. **Ceremony & Reception** — split layout with both events.
6. **RSVP** — form (name + yes/no).
7. **Footer** — monogram, year, subtle close.

### 4.1 Hero

- Full viewport height (`100svh` to handle iOS Safari url bar).
- Off-white background. No image behind names.
- Vertical centered stack:
  - Microcopy: `THE WEDDING OF` (Latin) / `მოწვევა ქორწილში` (Georgian) — chooses based on `lang` attr, default Georgian.
  - Display name: **Giorgi** (large serif)
  - Italic ampersand: *&* in terracotta
  - Display name: **Tamar** (large serif)
  - Microcopy date: `12 . 07 . 2026 — საქართველო`
- Below: a thin 1px vertical line (`--line` color, 80px tall) + a subtle scroll-hint arrow that gently bobs.
- **Entrance:** on first load, letters of "Giorgi" and "Tamar" cascade in character-by-character (60ms apart, 8px upward drift, opacity 0→1, 600ms cubic-bezier ease-out). Microcopy and date follow after the names finish.

### 4.2 Welcome / Invitation

- Single column, max-width 640px, centered.
- One italic serif sentence:
  > გვექნება დიდი სიხარული, თუ ჩვენთან ერთად აღნიშნავთ ცხოვრების ყველაზე მნიშვნელოვან დღეს.
- Above and below: hairline horizontal divider, 80px wide, centered.
- Scroll reveals with 12px upward drift + opacity 0→1 (Intersection Observer, threshold 0.2).

### 4.3 Countdown

- 4 large mono-tabular digit blocks horizontally on desktop, 2×2 grid on mobile.
- Labels in microcopy underneath: `დღე · საათი · წუთი · წამი`
- Digits use `font-variant-numeric: tabular-nums` to prevent layout shift.
- **Animation:** when a digit changes, it performs a CSS 3D card flip (`rotateX` 90deg out, swap content, rotateX 0 in), 400ms each, CSS-only via a tiny JS that swaps `.flip` class.
- Updates every 1000ms via `requestAnimationFrame` / `setInterval`.

### 4.4 Our Story

- Section title: `ჩვენი ისტორია`
- 3–4 "chapter" rows. Each row:
  - Desktop: alternating left-image / right-text and right-image / left-text. ~6:6 grid with 60–80px gutter.
  - Mobile: stacked, image on top, text below.
- Each chapter has:
  - A microcopy label: `Chapter 01 — პირველი შეხვედრა`
  - A short serif headline (one line)
  - A 2–3 sentence body paragraph (Georgian)
  - One photo (max ~520px wide, soft 4px border-radius, subtle 1px line)
- **Animation per chapter on scroll-in:**
  - Image revealed with `clip-path: inset(100% 0 0 0)` → `inset(0)` over 900ms cubic-bezier(0.16, 1, 0.3, 1).
  - Text fades + drifts up 16px over 700ms, 100ms after image starts.
- **Parallax:** images drift -30px on scroll over their visible range. Implemented via Intersection Observer + CSS variable, not on every scroll event (performance).

Chapters (placeholder until couple confirms):
1. პირველი შეხვედრა
2. პირველი თარიღი
3. წინადადება
4. და აი, აქამდე მოვედით

### 4.5 Ceremony & Reception

- Section title: `12 ივლისი, 2026`
- 2-column split on desktop (`1fr 1px 1fr`); stacked on mobile.
- Center vertical hairline divider, only on desktop.
- Left column (ცერემონია):
  - Microcopy: `ჯვრისწერა`
  - Large time: `15:00`
  - Venue name: `წმ. ილია მართალის ტაძარი`
  - City: `საგურამო`
  - Inline link: `მისამართის ნახვა →` (terracotta on hover, underline animates left-to-right)
- Right column (ბანკეტი):
  - Microcopy: `ქორწილი`
  - Large time: `19:00`
  - Venue name: `რესტორანი ბაგინეთი`
  - City: `მცხეთა`
  - Inline link: `მისამართის ნახვა →`

### 4.6 RSVP

- Centered, max-width 520px.
- Section title: `დაგვიდასტურეთ მონაწილეობა`
- Subtitle (body italic): "გთხოვთ დაგვიდასტუროთ თქვენი მონაწილეობა {DEADLINE} -მდე"
- Form fields:
  - Single text input: **სახელი და გვარი** (required, ≤ 80 chars, trimmed)
- Two-choice CTA, side by side (stacked on narrow mobile):
  - **დიახ, აუცილებლად** — filled terracotta button
  - **სამწუხაროდ, ვერ მოვალ** — outline button
- Submit action: clicking either button = "the answer" + form is submitted with the corresponding boolean.
- **Submit animation:**
  - Pressed button shows inline spinner replacing label (300ms min, even on fast networks, to feel intentional).
  - On success: button morphs into checkmark (✓ scaled in, draw path), entire form rotates out on `rotateX` axis, and a thank-you card rotates in from the same axis (600ms total).
- **Success state copy:**
  > გმადლობთ, [სახელი]! ❤
  > თქვენი პასუხი მიღებულია.
- **Error state copy:**
  > რაღაც შეცდომა მოხდა. გთხოვთ, სცადოთ ხელახლა.
  > გადაცემის შემთხვევაში, შეგიძლიათ პირდაპირ დაგვიკავშირდეთ.

### 4.7 Footer

- Section padding `120px / 80px`.
- Centered:
  - Tiny "G & T" monogram (SVG, draws in once with stroke-dashoffset on first scroll into view)
  - `გიორგი & თამარი · 2026`
- Background remains `--bg`; no color change.

## 5. Motion & Animation

| # | Animation | Trigger | Duration | Notes |
| - | --- | --- | --- | --- |
| 1 | Page loader monogram | First page load | ~1000ms total (fade out after content paint) | Solid `--bg` overlay with centered SVG "G & T", fades when DOM ready + fonts loaded |
| 2 | Hero letter cascade | Load (after loader) | 60ms stagger, 600ms each | "Giorgi" and "Tamar" only |
| 3 | Section fade-up | Scroll into view | 700ms | All sections; Intersection Observer threshold 0.2 |
| 4 | Countdown digit flip | Digit changes | 400ms | CSS 3D `rotateX` |
| 5 | Our Story image reveal | Scroll into view | 900ms | `clip-path: inset(100% 0 0 0)` → `inset(0)` |
| 6 | Our Story parallax | Scroll | continuous | -30px drift over section visible range; CSS variable + IO |
| 7 | SVG hairline divider draw | Scroll into view | 800ms | `stroke-dashoffset` animation between sections |
| 8 | Magnetic RSVP buttons | Pointer near (desktop only, `pointer: fine`) | continuous | translate up to 4px toward cursor; disabled on touch |
| 9 | RSVP submit morph | Form submit | 600ms | Button → ✓, then form rotateX exit, thank-you rotateX enter |
| 10 | Custom cursor ring | Pointer move (desktop only) | continuous | 12px ring, lags pointer with smooth follow; scales on interactive hover; OFF on `pointer: coarse` and `prefers-reduced-motion` |

**Accessibility:** every animation must respect `@media (prefers-reduced-motion: reduce)` — all transforms reduced to opacity-only or disabled.

## 6. Background Music

- Floating toggle button, top-right, position fixed, 32px diameter, terracotta SVG icon on `--bg` circle. Default state: `play` icon (i.e., music is **off**).
- Initial opacity 0.6; on hover/focus 1.0.
- **Default state: OFF.** Browsers block autoplay-with-sound; we honor that and don't try to bypass.
- After page load + 2 seconds, a small tooltip slides in next to the button: `მუსიკის ჩასართავად დააწექი ♪`. Auto-dismisses after 5 seconds. Dismisses on click anywhere.
- On click:
  - Audio starts at volume 0 and fades to 0.3 over 2000ms.
  - Icon morphs to `pause`.
  - Tooltip dismisses.
- On second click: fade volume to 0 over 1000ms, then pause; icon returns to `play`.
- Audio element: `<audio loop preload="metadata">`, single source.
- Track: piano instrumental, ~3–4 minutes, royalty-free / properly licensed. Recommended starting candidates (final pick during implementation):
  - Pixabay Music: piano ambient tracks
  - YouTube Audio Library: "Cinematic / Calm / Piano" filters
  - Ludovico Einaudi-style — **only with proper licensing**; royalty-free alternative preferred
- State **not persisted across reloads** (intentional — fresh visit = quiet start).

## 7. Data & Backend

### 7.1 Google Sheet

Spreadsheet with a single sheet `RSVPs`. Columns:

| A | B | C | D |
| --- | --- | --- | --- |
| Timestamp (ISO 8601) | Name | Attending (TRUE / FALSE) | Source (string, default `web`) |

The couple gets edit access; the Apps Script runs as the sheet owner.

### 7.2 Apps Script Web App

```javascript
// google-apps-script/Code.gs
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (!data.name || typeof data.attending !== 'boolean') {
      return _json({ ok: false, error: 'invalid_payload' });
    }
    const name = String(data.name).trim().slice(0, 80);
    if (!name) return _json({ ok: false, error: 'empty_name' });

    const sheet = SpreadsheetApp.getActive().getSheetByName('RSVPs');
    sheet.appendRow([new Date().toISOString(), name, data.attending, 'web']);
    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: 'server_error' });
  }
}

function _json(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Deployment: **Deploy as Web App** → Execute as: **owner** → Access: **Anyone**. Returns a stable URL.

### 7.3 Frontend submission

```javascript
async function submitRsvp(name, attending) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ name, attending }),
    headers: { 'Content-Type': 'text/plain;charset=utf-8' } // avoids CORS preflight on Apps Script
  });
  return res.json();
}
```

Note on `Content-Type`: Apps Script Web Apps don't support CORS preflight responses. Sending as `text/plain` skips preflight; the server reads `e.postData.contents` as a string and parses it as JSON.

### 7.4 Validation & abuse protection (lightweight)

- Client: trim, max 80 chars, non-empty, prevent double submit (disable buttons after first click).
- Client: `sessionStorage` flag prevents accidental re-submit within the same session (with subtle "თქვენი პასუხი უკვე მიღებულია" message).
- Server: trim + 80 char cap.
- No CAPTCHA. Acceptable risk for a private invitation. If spam occurs, manual cleanup or post-launch hardening.

## 8. File Structure

```
index.html
css/
  styles.css         /* all styles, single file, CSS variables */
  fonts.css          /* @import google fonts */
js/
  countdown.js
  rsvp.js
  reveal.js          /* IntersectionObserver-based scroll reveal */
  music.js
  cursor.js          /* optional desktop cursor ring */
audio/
  ambient.mp3        /* the chosen piano track */
image/
  /* photos used in Our Story */
  monogram.svg
  divider.svg
google-apps-script/
  Code.gs
  README.md          /* step-by-step deploy instructions */
docs/superpowers/specs/
  2026-06-08-wedding-invitation-design.md  /* this file */
README.md            /* root readme */
```

## 9. Performance Budget

- LCP target ≤ 2.0s on mobile 4G.
- CLS target = 0 (we set explicit sizes for every image and reserve space for fonts).
- JS total ≤ 30KB minified.
- CSS total ≤ 25KB minified.
- Audio: preload `metadata` only — actual track only downloads on user click.
- Images: served as compressed WebP with JPEG fallback; `loading="lazy"` for all non-hero images; explicit `width` / `height` attributes.

## 10. Accessibility

- Semantic HTML5 (`<header>`, `<section>`, `<form>`, `<footer>`).
- Color contrast ≥ AA against `--bg` for all text.
- All animations respect `prefers-reduced-motion: reduce`.
- Form input has `<label>`, `aria-describedby` for help text, `aria-live="polite"` for status messages.
- Music toggle has `aria-label` ("ფონური მუსიკის ჩართვა / გათიშვა") and `aria-pressed` state.
- Keyboard navigable: visible focus rings, logical tab order, `Enter` submits form.
- `lang="ka"` on `<html>`.

## 11. Browser Support

- Chromium ≥ 100, Safari ≥ 15, Firefox ≥ 100.
- iOS Safari 15+ and Chrome Android current — primary mobile targets.
- No IE, no legacy Edge.
- `100svh` used for hero; fallback `100vh` set first.

## 12. Deployment

- Static hosting: Netlify or Vercel (drag-and-drop folder works).
- Domain: TBD by couple.
- Apps Script Web App URL configured as a single constant in `js/rsvp.js` — couple swaps in after they deploy their Sheet.
- README contains: how to deploy Apps Script, how to update the date, how to update photos, how to swap audio.

## 13. Open Questions / Deferred Decisions

These don't block design approval but must be resolved during or after implementation:

1. **Countdown target time:** midnight on 12 July, or 15:00 (ceremony start)? Recommendation: **15:00 ceremony time** — it's the meaningful moment.
2. **RSVP deadline:** what date appears in the "გთხოვთ დაგვიდასტუროთ ... -მდე" line?
3. **Audio track:** specific file. Royalty-free piano piece, ~3–4min loopable.
4. **"Our Story" content:** the 3–4 chapter titles and paragraphs. Placeholders until couple writes the actual stories.
5. **Photos to use:** which specific photos go into each chapter slot.
6. **Domain name:** if a custom domain is desired.
7. **Optional cursor ring:** ship in v1 or hold for "delight pass" later? Recommendation: ship behind a feature flag in code (one boolean), default ON desktop.

## 14. What This Spec Is Not

- Not a multi-language site. Georgian only for v1.
- Not a guestbook. RSVP only — no message field, no photo upload, no comments.
- Not a multi-event site. Two events (ceremony + reception), nothing more.
- Not gated behind a password. Public URL; security through obscurity is acceptable for an invitation.
- Not analytics-instrumented. No Google Analytics, no tracking pixels — privacy-respectful by default.
