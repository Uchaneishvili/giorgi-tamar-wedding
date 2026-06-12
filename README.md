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
js/                     countdown, RSVP, reveal, music, cursor, confetti, petals, sections, main
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
6. **RSVP sub-line.** In `index.html`, `.rsvp__sub` holds the warm invite line (no deadline). Edit if you want different wording.
7. **Deploy.** Drag the project folder into Netlify Drop (https://app.netlify.com/drop) or `vercel --prod`.
8. **Smoke test.** Open the deployed URL on mobile, submit a test RSVP, verify a row appears in the sheet.

## Maintenance knobs

| What | Where |
| --- | --- |
| Ceremony date/time | `js/countdown.js` — `TARGET` constant |
| RSVP sub-line copy | `index.html` — `.rsvp__sub` |
| Apps Script URL | `js/rsvp.js` — `APPS_SCRIPT_URL` |
| Background music volume | `js/music.js` — `TARGET_VOL` (default 0.3) |
| Cursor ring on/off | `js/cursor.js` — `FEATURE_FLAG_CURSOR_RING` |

## Spec & plan

- Design spec: [`docs/superpowers/specs/2026-06-08-wedding-invitation-design.md`](docs/superpowers/specs/2026-06-08-wedding-invitation-design.md)
- Implementation plan: [`docs/superpowers/plans/2026-06-08-wedding-invitation-implementation.md`](docs/superpowers/plans/2026-06-08-wedding-invitation-implementation.md)
