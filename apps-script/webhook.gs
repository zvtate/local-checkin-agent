/**
 * LoCAL Check-in Agent — Google Apps Script webhook
 *
 * Setup:
 * 1. script.google.com → New project → paste this as Code.gs
 * 2. Set SHEET_ID below to your Google Sheet ID
 * 3. Deploy → New deployment → Web app
 *    Execute as: Me | Who has access: Anyone
 * 4. Copy the Web App URL into checkin.js as WEBHOOK_URL
 */

const SHEET_ID     = 'YOUR_GOOGLE_SHEET_ID_HERE';
const NOTIFY_EMAIL = 'zoe.victoria.tate@uncdf.org';
const SHEET_NAME   = 'Responses';

// Column schema — order must match appendRow() below
const HEADERS = [
  'Timestamp',
  'Province',
  'Code',
  'Check-in',
  'Ref Score (last APA)',  // context only — scores reset each year
  'Answer',
  'Follow-up',
  'Response Key',
  'Pts Available',
  'Ref Score + CI Pts',   // indicative ceiling
  // Inferred PM statuses (not_started / in_progress / n/a)
  'PM14 Status',
  'PM15 Status',
  'Docs Ready',           // for 'both' answer: yes / no / n/a
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss    = SpreadsheetApp.openById(SHEET_ID);
    let   sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
           .setFontWeight('bold')
           .setBackground('#E8F5E9');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(data.timestamp),
      data.province,
      data.provinceCode,
      'Check-in ' + data.checkin,
      data.refScore,
      data.answer,
      data.followup || '',
      data.responseKey,
      data.availPts,
      data.refScoreWithCI,
      data.pm14_status || '',
      data.pm15_status || '',
      data.docs_ready  || '',
    ]);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: `[LoCAL] ${data.province} · Check-in ${data.checkin} · ${data.responseKey}`,
      body: [
        `Province:       ${data.province} (${data.provinceCode})`,
        `Check-in:       ${data.checkin}`,
        `Answer:         ${data.responseKey}`,
        `Ref score:      ${data.refScore} pts (last APA — resets each year)`,
        `Pts at stake:   ${data.availPts}`,
        `PM14 status:    ${data.pm14_status}`,
        `PM15 status:    ${data.pm15_status}`,
        `Docs ready:     ${data.docs_ready}`,
        ``,
        `Timestamp:      ${data.timestamp}`,
      ].join('\n'),
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// doGet keeps the deployment testable (visit the URL in a browser to confirm it's live)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'LoCAL webhook active', ts: new Date().toISOString() }))
    .setMimeType(ContentService.MimeType.JSON);
}
