/**
 * RSVP backend — Google Apps Script Web App (optional upgrade).
 *
 * Enables TRUE cross-device editing: each guest's reply lives in ONE row,
 * keyed by rsvpId, and an edit overwrites that same row (no duplicates).
 *
 * Setup: see SETUP.md in this folder. In short:
 *   1. Open your RSVP Google Sheet → Extensions → Apps Script.
 *   2. Paste this file in, Save.
 *   3. Deploy → New deployment → type "Web app",
 *        Execute as: Me,  Who has access: Anyone.
 *   4. Copy the Web app URL and paste it into assets/config.js as
 *      googleForm.appsScriptUrl.
 */

var SHEET_NAME = 'RSVPs';
var HEADERS = ['rsvpId', 'timestamp', 'name', 'attending', 'adults', 'kids', 'total', 'note'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // avoid races when two people submit at once
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    var row = [
      data.rsvpId || '',
      new Date(),
      data.name || '',
      data.attending || '',
      data.adults != null ? data.adults : '',
      data.kids != null ? data.kids : '',
      data.total != null ? data.total : '',
      data.note || ''
    ];

    var lastRow = sheet.getLastRow();
    var existing = -1;
    if (data.rsvpId && lastRow > 1) {
      var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (ids[i][0] === data.rsvpId) { existing = i + 2; break; }
      }
    }

    if (existing > 0) {
      sheet.getRange(existing, 1, 1, row.length).setValues([row]); // edit in place
    } else {
      sheet.appendRow(row); // first time for this guest
    }

    return json_({ ok: true, updated: existing > 0 });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
