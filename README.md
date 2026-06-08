# Giorgi & Tamar — Wedding Invitation

A single-page wedding invitation website for **გიორგი & თამარი**, 12 July 2026.

## Status

Design phase. See [`docs/superpowers/specs/2026-06-08-wedding-invitation-design.md`](docs/superpowers/specs/2026-06-08-wedding-invitation-design.md) for the full spec.

## Stack

- Vanilla HTML / CSS / JavaScript — no frameworks, no build step.
- RSVP backend via Google Sheets + Google Apps Script Web App.
- Designed mobile-first.

## Structure

```
index.html              — the page
css/                    — styles
js/                     — countdown, RSVP, scroll reveal, music, cursor
image/                  — photos and SVG assets
audio/                  — background piano track
google-apps-script/     — Apps Script deployment files
docs/                   — design spec
```

## Deployment

1. Deploy the Apps Script (see `google-apps-script/README.md`) to get the Web App URL.
2. Paste the URL into `js/rsvp.js` as the `APPS_SCRIPT_URL` constant.
3. Push the folder to Netlify, Vercel, or any static host.
