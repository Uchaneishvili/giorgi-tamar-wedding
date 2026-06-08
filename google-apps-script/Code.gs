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
