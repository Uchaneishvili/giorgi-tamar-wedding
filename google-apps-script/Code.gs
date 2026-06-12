/**
 * RSVP collector for Giorgi & Tamar wedding (12 July 2026).
 * Bound to a Google Sheet. Deploy as a Web App:
 *   Execute as: Me (owner)   |   Who has access: Anyone
 * The "RSVPs" tab (with headers) is created automatically on first write.
 */

function _sheet() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName('RSVPs');
  if (!sh) {
    sh = ss.insertSheet('RSVPs');
    sh.appendRow(['Timestamp', 'Name', 'Attending', 'Source']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (!data || !data.name || typeof data.attending !== 'boolean') {
      return _json({ ok: false, error: 'invalid_payload' });
    }

    const name = String(data.name).trim().slice(0, 80);
    if (!name) return _json({ ok: false, error: 'empty_name' });

    _sheet().appendRow([new Date().toISOString(), name, data.attending, 'web']);
    return _json({ ok: true });
  } catch (err) {
    console.error(err);
    return _json({ ok: false, error: 'server_error' });
  }
}

function doGet() {
  return _json({ ok: true, service: 'rsvp', version: 2 });
}

function _json(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
