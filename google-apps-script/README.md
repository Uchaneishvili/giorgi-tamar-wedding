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
