/**
 * RSVP collector for Giorgi & Tamar wedding (12 July 2026).
 * Bound to a Google Sheet. Deploy as a Web App:
 *   Execute as: Me (owner)   |   Who has access: Anyone
 * The styled "RSVPs" tab is created automatically on first write.
 * To prettify an already-created sheet, run formatSheet() once from the editor.
 */

const HEADERS = ['თარიღი', 'სახელი და გვარი', 'დასწრება', 'წყარო'];

function _sheet() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName('RSVPs');
  if (!sh) {
    sh = ss.insertSheet('RSVPs');
    sh.appendRow(HEADERS);
    _style(sh);
  }
  return sh;
}

/** Run once from the editor to (re)style an existing sheet. */
function formatSheet() {
  _style(_sheet());
}

function _style(sh) {
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

  const header = sh.getRange(1, 1, 1, HEADERS.length);
  header.setFontWeight('bold')
        .setFontColor('#FFFFFF')
        .setBackground('#C97B5C')
        .setHorizontalAlignment('center')
        .setVerticalAlignment('middle');
  sh.setRowHeight(1, 36);

  sh.setColumnWidth(1, 150);
  sh.setColumnWidth(2, 240);
  sh.setColumnWidth(3, 110);
  sh.setColumnWidth(4, 90);

  // attendance as centered checkboxes
  sh.getRange(2, 3, sh.getMaxRows() - 1, 1).insertCheckboxes().setHorizontalAlignment('center');

  // zebra striping
  sh.getBandings().forEach(function (b) { b.remove(); });
  sh.getRange(1, 1, sh.getMaxRows(), HEADERS.length)
    .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);

  // re-assert header style (banding can recolour row 1)
  header.setBackground('#C97B5C').setFontColor('#FFFFFF').setFontWeight('bold');
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (!data || !data.name || typeof data.attending !== 'boolean') {
      return _json({ ok: false, error: 'invalid_payload' });
    }

    const name = String(data.name).trim().slice(0, 80);
    if (!name) return _json({ ok: false, error: 'empty_name' });

    const ts = Utilities.formatDate(new Date(), 'Asia/Tbilisi', 'dd.MM.yyyy HH:mm');
    const sh = _sheet();
    sh.insertRowAfter(1); // newest first — add just under the header
    sh.getRange(2, 1, 1, HEADERS.length).setValues([[ts, name, data.attending, 'web']]);
    sh.getRange(2, 3).insertCheckboxes();
    return _json({ ok: true });
  } catch (err) {
    console.error(err);
    return _json({ ok: false, error: 'server_error' });
  }
}

function doGet() {
  return _json({ ok: true, service: 'rsvp', version: 4 });
}

function _json(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
