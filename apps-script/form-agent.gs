/**
 * LoCAL Check-in Agent — Google Forms + Apps Script
 *
 * Bind this script to the Google Sheet linked to your Form:
 *   Sheet → Extensions → Apps Script → paste here → Save
 *
 * Then add a trigger:
 *   Triggers (clock icon) → Add trigger
 *   Function: onFormSubmit | Event: From spreadsheet | Form submit
 *
 * See FORMS-SETUP.md for complete setup instructions.
 */

// ── Config ────────────────────────────────────────────────────

const PROGRAMME_EMAIL = 'zoe.victoria.tate@uncdf.org';

const FOCAL_POINT = {
  name:  '[LoCAL Focal Point Name]',
  email: 'local@uncdf.org',
  phone: '[Phone]',
};

// ── Exact Google Form field titles ────────────────────────────
// These must match your form question text character-for-character.
const FIELD = {
  PROVINCE:   'Province',
  CHECKIN:    'Check-in number',
  MAIN_Q:     'Has your province held at least one CC awareness session this fiscal year?',
  FOLLOWUP_Q: 'Are all required records filed and ready for the assessor?',
};

// ── Answer → internal key mapping ────────────────────────────
// Keys must match the option labels in your Form exactly.
const ANSWER_MAP = {
  'Both — staff session and community session done': 'both',
  'Staff session only':                              'staff',
  'Community session only':                          'community',
  'Not yet this fiscal year':                        'none',
};
const FOLLOWUP_MAP = {
  '✓ Yes, records filed for both sessions': 'yes',
  '✗ Not all filed yet':                    'no',
};

// ── Province data ─────────────────────────────────────────────
// score    = last APA reference (context only — all scores reset each APA)
// psEmail  = Provincial Secretary email (fill before going live)
// checkins = per-check-in: { availPts, refScore }
// priorities = top 3 quick wins OUTSIDE the current CI theme
//              { label, pts, timing, action }

const PROVINCES = {
  'Guadalcanal': {
    name: 'Guadalcanal', code: 'GP',
    psEmail: '[gp-ps@prov.gov.sb]',
    score: 37,
    checkins: { 2: { availPts: 10, refScore: 47 } },
    priorities: [
      { label: 'PM#13 — CC clause in all PBCRG tender documents',
        pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to every PBCRG procurement document. Template available from LoCAL focal point — 30-minute admin task per contract.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project explicitly referencing the National Development Strategy 2016–2035. Standard citation text from LoCAL focal point.' },
      { label: 'PM#5b — Priority statements linked to climate data',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'Guadalcanal is the only province that missed this. ACCAF LALAP priority statements must cite your PM#1 climate data as evidence. Your CCARRO has that data — the link is a one-paragraph update.' },
    ],
  },
  'Temotu': {
    name: 'Temotu', code: 'TP',
    psEmail: '[tp-ps@prov.gov.sb]',
    score: 33,
    checkins: { 2: { availPts: 10, refScore: 43 } },
    priorities: [
      { label: 'PM#9 — Provincial Engineer design sign-off',
        pts: 5, timing: 'Before 31 March',
        action: 'This entire PM was missed in the last APA. Provincial Engineer must review every PBCRG infrastructure design and add a signed note confirming CC risks considered and standards applied. One page per project.' },
      { label: 'PM#13 — CC clause in all PBCRG tender documents',
        pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to all PBCRG procurement documents. Template from LoCAL focal point.' },
      { label: 'PM#4c — National Climate Change Policy reference',
        pts: 1, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per project referencing the NCCP. Same approach as your existing NDS reference — standard citation from LoCAL focal point.' },
    ],
  },
  'Rennell & Bellona': {
    name: 'Rennell & Bellona', code: 'RBP',
    psEmail: '[rbp-ps@prov.gov.sb]',
    score: 24,
    checkins: { 2: { availPts: 10, refScore: 34 } },
    priorities: [
      { label: 'PM#12 — Designate a CC Focal Point (CCARRO) — URGENT',
        pts: 5, timing: 'Immediately',
        action: 'Rennell & Bellona is the only province without a designated CCARRO. This single action unlocks PM#4, #5, #14, and #15. Issue a formal designation letter naming the officer, citing LoCAL duties, with a budget line. Template from LoCAL focal point.' },
      { label: 'PM#13 — CC clause in all PBCRG tender documents',
        pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to all PBCRG procurement documents. Template from LoCAL focal point.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the National Development Strategy 2016–2035. Standard citation from LoCAL focal point.' },
    ],
  },
  'Western': {
    name: 'Western', code: 'WP',
    psEmail: '[wp-ps@prov.gov.sb]',
    score: 34,
    checkins: { 2: { availPts: 10, refScore: 44 } },
    priorities: [
      { label: 'PM#13 — CC clause in all PBCRG tender documents',
        pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to all PBCRG procurement documents. Template from LoCAL focal point.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'Western already references the NCCP (PM#4c) — the NDS reference is the same approach. One sentence per project.' },
      { label: 'PM#10 — Vulnerable group targeting in ACCAF (2 pts gap)',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'All provinces scored 3/5. The remaining 2 pts require explicitly naming vulnerable beneficiaries (women, youth, disability) in ACCAF Columns I, J, V, W with a note on how each project addresses their specific CC exposure.' },
    ],
  },
  'Choiseul': {
    name: 'Choiseul', code: 'CP',
    psEmail: '[cp-ps@prov.gov.sb]',
    score: 33,
    checkins: { 2: { availPts: 10, refScore: 43 } },
    priorities: [
      { label: 'PM#13 — CC clause in remaining PBCRG tender documents (4 pts gap)',
        pts: 4, timing: 'Before 31 March',
        action: 'Choiseul scored 1/5 last APA — some CC language already in some tenders. Apply the standard clause consistently to all PBCRG contracts. Template from LoCAL focal point.' },
      { label: 'PM#5c — Priority statements used in project selection',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'ACCAF LALAP priority statements must be explicitly referenced in the project selection justification in the annual plan. The statements exist — they need to appear in the plan text.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the NDS 2016–2035. Choiseul\'s PM#9 (4/5) is the second-best in the system — that strength should be protected and re-demonstrated this year.' },
    ],
  },
  'Malaita': {
    name: 'Malaita', code: 'MP',
    psEmail: '[mp-ps@prov.gov.sb]',
    score: 34,
    checkins: { 2: { availPts: 10, refScore: 44 } },
    priorities: [
      { label: 'PM#9 — Provincial Engineer design sign-off',
        pts: 5, timing: 'Before 31 March',
        action: 'This entire PM was missed in the last APA. Provincial Engineer must sign off all PBCRG infrastructure designs confirming CC risks considered, and add a written note on standards applied. One page per project.' },
      { label: 'PM#13 — CC clause in all PBCRG tender documents',
        pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to all PBCRG procurement documents. Template from LoCAL focal point.' },
      { label: 'PM#8b — CC-proofing cost estimates in ACCAF Cols AD–AG',
        pts: 3, timing: 'Planning season (Nov–Jan)',
        action: 'Malaita is the only province that missed PM#8b. Add CC-proofing cost estimates to ACCAF Columns AD–AG for every PBCRG project. Contact LoCAL focal point for an ACCAF session — one-day fix.' },
    ],
  },
  'Central Islands': {
    name: 'Central Islands', code: 'CIP',
    psEmail: '[cip-ps@prov.gov.sb]',
    score: 33,
    checkins: { 2: { availPts: 10, refScore: 43 } },
    priorities: [
      { label: 'PM#9 — Provincial Engineer design sign-off',
        pts: 5, timing: 'Before 31 March',
        action: 'This entire PM was missed in the last APA (same gap in Temotu and Malaita). Provincial Engineer must review all PBCRG designs and add a signed note per project confirming CC risks considered.' },
      { label: 'PM#13 — CC clause in all PBCRG tender documents',
        pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to all PBCRG procurement documents. Template from LoCAL focal point.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the National Development Strategy 2016–2035. Standard citation from LoCAL focal point.' },
    ],
  },
  'Isabel': {
    name: 'Isabel', code: 'IP',
    psEmail: '[ip-ps@prov.gov.sb]',
    score: 35,
    checkins: { 2: { availPts: 10, refScore: 45 } },
    priorities: [
      { label: 'PM#13 — CC clause in remaining PBCRG tender documents (2 pts gap)',
        pts: 2, timing: 'Before 31 March',
        action: 'Isabel scored 3/5 last APA — the CC clause is already in most tenders. Apply it consistently to all remaining PBCRG contracts.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the National Development Strategy 2016–2035. Standard citation from LoCAL focal point.' },
      { label: 'PM#4c — National Climate Change Policy reference',
        pts: 1, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per project referencing the NCCP — same approach as the NDS reference. Together PM#4b + PM#4c are 3 pts for two sentences.' },
    ],
  },
  'Makira-Ulawa': {
    name: 'Makira-Ulawa', code: 'MUP',
    psEmail: '[mup-ps@prov.gov.sb]',
    score: 39,
    checkins: { 2: { availPts: 10, refScore: 49 } },
    priorities: [
      { label: 'PM#13 — CC clause in remaining PBCRG tender documents (2 pts gap)',
        pts: 2, timing: 'Before 31 March',
        action: 'Makira-Ulawa scored 3/5 last APA. Apply the standard CC clause to all remaining PBCRG contracts.' },
      { label: 'PM#9b — Written design records for all PBCRG infrastructure',
        pts: 2, timing: 'Before 31 March',
        action: 'A written note per project recording the design standards applied and how resilience was incorporated. One page is sufficient — the engineer sign-off exists (PM#9a), the written record is the gap.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the National Development Strategy 2016–2035. Standard citation from LoCAL focal point.' },
    ],
  },
};

// ── Check-in 2 response content ───────────────────────────────
// All guidance framed as "what evidence earns this PM" — not "last year's gap".
// Scores reset each APA; all 10 pts (PM#14 + PM#15) available to every province.

const CI2 = {
  month: 'June 2026',
  topic: 'CC awareness sessions',
  pms:   'PM#14 + PM#15',

  responses: {
    'both+yes': {
      outcome: 'ok',
      headline: 'Both sessions done and documented',
      body: function(p) {
        return 'PM#14 requires documented training of PG staff on CC adaptation. ' +
          'PM#15 requires documented meetings with WDC members or community leaders covering CC risks. ' +
          p.name + ' has completed both and has the records in order — the assessor will check for exactly these documents. ' +
          'One additional point to verify: PM#15 attendance records should show disaggregated participation by sex and, where possible, youth. ' +
          'If the current records do not capture this, add a brief note on who attended before the APA visit.';
      },
      reminders: [
        { label: 'Before the APA visit',
          text: 'Organise evidence in labelled folders: one per session. Label: "PM#14 — [date]" and "PM#15 — [date]". The assessor will look for both.' },
        { label: 'PM#14 evidence checklist',
          text: 'Signed attendance list of PG staff · Written agenda or programme explicitly mentioning CC/adaptation · Brief summary or minutes of what was covered.' },
        { label: 'PM#15 evidence checklist',
          text: 'Signed attendance list disaggregated by sex/youth where possible · Meeting agenda including CC topic · Brief summary or minutes.' },
        { label: 'APA deadline',
          text: 'All evidence must be filed before the assessor\'s visit (target: August). Records submitted after the visit cannot be accepted.' },
      ],
    },

    'both+no': {
      outcome: 'warn',
      headline: 'Sessions done — documentation still needed',
      body: function(p) {
        return p.name + ' has held both sessions — that is the activity requirement for PM#14 and PM#15. ' +
          'To earn these points, the assessor also needs: (1) a signed attendance list, (2) a written agenda or programme, and (3) a brief summary or minutes — for each session separately. ' +
          'Filing these now rather than the week before the APA avoids last-minute gaps. ' +
          'For PM#15, attendance records should show disaggregated participation (women, youth) — a brief note on who attended is sufficient.';
      },
      reminders: [
        { label: 'Action needed — file records for both sessions',
          text: 'For each session: (1) signed attendance list, (2) written agenda explicitly mentioning CC, (3) one-page summary or minutes. Missing any one element is enough for the assessor to withhold points.' },
        { label: 'PM#15 — disaggregated attendance',
          text: 'Attendance records should identify women and youth participants specifically. This does not require a separate form — a note at the bottom of the sign-in sheet is sufficient.' },
        { label: 'APA deadline',
          text: 'All evidence must be filed before the assessor\'s visit (target: August).' },
      ],
    },

    'staff': {
      outcome: 'warn',
      headline: 'Staff session done — community session still needed for PM#15',
      body: function(p) {
        return 'PM#14 (5 pts) requires documented training of PG staff on CC adaptation — the staff session covers this, assuming records are filed. ' +
          'PM#15 (5 pts) requires a separate documented meeting with WDC members or community leaders on CC risks. ' +
          'A standalone event is not required: any WDC meeting that includes climate topics on the agenda qualifies. ' +
          'Check if a WDC meeting is scheduled in the next few weeks and add CC to the agenda. ' +
          'Both PMs require: signed attendance list, written agenda, brief summary or minutes.';
      },
      reminders: [
        { label: 'Quickest path for PM#15',
          text: 'Check if a WDC meeting is already on the calendar. Add CC adaptation to the agenda, take disaggregated attendance, and write a one-page summary. That is PM#15 with no additional convening cost.' },
        { label: 'PM#14 — don\'t lose what you have',
          text: 'Staff session already done. File: signed attendance list, agenda/programme, written summary. Store in a labelled folder "PM#14 — [date]".' },
        { label: 'APA deadline',
          text: 'Both sessions must be documented before the assessor\'s visit (target: August).' },
      ],
    },

    'community': {
      outcome: 'warn',
      headline: 'Community session done — staff session still needed for PM#14',
      body: function(p) {
        return 'PM#15 (5 pts) requires documented meetings with WDC members or community leaders on CC — the community session covers this, assuming records are filed. ' +
          'PM#14 (5 pts) requires a separate documented training with PG staff on CC adaptation. ' +
          'This is typically a half-day internal session — all relevant staff should attend and sign in. ' +
          'Contact your CCARRO or LoCAL focal point to arrange this before August. ' +
          'Both PMs require: signed attendance list, written agenda, brief summary or minutes.';
      },
      reminders: [
        { label: 'Quickest path for PM#14',
          text: 'A half-day internal briefing with PG staff is sufficient. Ask your CCARRO to facilitate — MECDM can often provide a presenter at short notice if needed.' },
        { label: 'PM#15 — don\'t lose what you have',
          text: 'Community session already done. File: signed attendance list (disaggregated), agenda, written summary. Store in a labelled folder "PM#15 — [date]".' },
        { label: 'APA deadline',
          text: 'Both sessions must be documented before the assessor\'s visit (target: August).' },
      ],
    },

    'none': {
      outcome: 'alert',
      headline: 'Eight weeks — still achievable if started now',
      body: function(p) {
        return 'PM#14 requires documented training with PG staff on CC adaptation. ' +
          'PM#15 requires documented meetings with WDC members or community leaders on CC risks. ' +
          'Together they are worth up to 10 points — the most accessible measures in the framework. ' +
          'The APA window opens in approximately 8 weeks. That is enough time to hold and document both, if started this month. ' +
          'A combined half-day event can cover both PMs in a single day. ' +
          'Contact LoCAL focal point this week to confirm a date — a facilitator and materials can be arranged.';
      },
      reminders: [
        { label: 'PM#14 · 5 pts — What it takes',
          text: 'One documented training session with PG staff on CC adaptation. Required: (1) signed attendance list, (2) written agenda explicitly mentioning CC/adaptation, (3) brief summary or minutes.' },
        { label: 'PM#15 · 5 pts — What it takes',
          text: 'One documented meeting with WDC members or community leaders covering CC risks. Required: (1) signed attendance list disaggregated by sex/youth, (2) agenda including CC item, (3) brief summary or minutes.' },
        { label: 'Combined session option',
          text: 'A combined half-day event — morning for PG staff, afternoon for WDC/community — covers both PMs in one day. Take separate attendance sheets for each part.' },
        { label: 'APA deadline',
          text: 'Sessions must be held and documented before the assessor\'s visit (target: August). Starting this month leaves time to correct any documentation gaps.' },
      ],
    },
  },
};

// ── onFormSubmit ──────────────────────────────────────────────

function onFormSubmit(e) {
  try {
    const values = e.namedValues;

    const provinceName  = (values[FIELD.PROVINCE]   || [''])[0].trim();
    const ciNum         = parseInt((values[FIELD.CHECKIN] || ['2'])[0]);
    const mainRaw       = (values[FIELD.MAIN_Q]     || [''])[0].trim();
    const followupRaw   = (values[FIELD.FOLLOWUP_Q] || [''])[0].trim();

    const province = PROVINCES[provinceName];
    if (!province) {
      Logger.log('Unknown province: ' + provinceName);
      return;
    }

    const ciData     = province.checkins[ciNum];
    const answerKey  = ANSWER_MAP[mainRaw]    || mainRaw;
    const followKey  = FOLLOWUP_MAP[followupRaw] || null;
    const responseKey = (followKey && answerKey === 'both')
      ? answerKey + '+' + followKey
      : answerKey;

    // Only CI2 content exists so far
    const content = (ciNum === 2) ? CI2 : null;
    if (!content) { Logger.log('No content for check-in ' + ciNum); return; }

    const response = content.responses[responseKey];
    if (!response) { Logger.log('No response for key: ' + responseKey); return; }

    const subject = '[LoCAL] ' + province.name + ' — Check-in ' + ciNum
      + ' guidance: ' + content.topic;

    const htmlBody = buildEmail(province, ciNum, ciData, content, response, responseKey);

    // Send to PS + CC programme team
    MailApp.sendEmail({
      to:       province.psEmail,
      cc:       PROGRAMME_EMAIL,
      subject:  subject,
      htmlBody: htmlBody,
      noReply:  false,
    });

    // Log inferred PM statuses to adjacent columns in Sheet
    // (the form response row is already written; this appends derived data)
    logDerivedData(e, province, ciNum, answerKey, followKey, responseKey);

  } catch (err) {
    Logger.log('onFormSubmit error: ' + err.message + '\n' + err.stack);
    MailApp.sendEmail(PROGRAMME_EMAIL,
      '[LoCAL] Form submission error', err.message + '\n\n' + JSON.stringify(e.namedValues));
  }
}

// ── Log inferred PM statuses to Sheet ────────────────────────

function logDerivedData(e, province, ciNum, answerKey, followKey, responseKey) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0]; // form responses go to first sheet
  const lastRow = sheet.getLastRow();

  // Find or create derived columns (after form's own columns)
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const derivedCols = ['PM14 Status', 'PM15 Status', 'Docs Ready', 'Response Key'];

  derivedCols.forEach(function(col) {
    if (headers.indexOf(col) === -1) {
      const nextCol = sheet.getLastColumn() + 1;
      sheet.getRange(1, nextCol).setValue(col).setFontWeight('bold');
      headers.push(col);
    }
  });

  const pm14Col     = headers.indexOf('PM14 Status') + 1;
  const pm15Col     = headers.indexOf('PM15 Status') + 1;
  const docsCol     = headers.indexOf('Docs Ready') + 1;
  const responseCol = headers.indexOf('Response Key') + 1;

  const pm14Status = (answerKey === 'both' || answerKey === 'staff')     ? 'in_progress' : 'not_started';
  const pm15Status = (answerKey === 'both' || answerKey === 'community') ? 'in_progress' : 'not_started';
  const docsReady  = responseKey === 'both+yes' ? 'yes'
                   : responseKey === 'both+no'  ? 'no'
                   : 'n/a';

  sheet.getRange(lastRow, pm14Col).setValue(pm14Status);
  sheet.getRange(lastRow, pm15Col).setValue(pm15Status);
  sheet.getRange(lastRow, docsCol).setValue(docsReady);
  sheet.getRange(lastRow, responseCol).setValue(responseKey);
}

// ── Email builder ─────────────────────────────────────────────

function buildEmail(province, ciNum, ciData, content, response, responseKey) {
  const headerColor = response.outcome === 'ok'    ? '#2E7D32'
                    : response.outcome === 'warn'  ? '#E65100'
                    : '#B71C1C';
  const outcomeIcon = response.outcome === 'ok'    ? '✓'
                    : response.outcome === 'warn'  ? '→'
                    : '!';

  const bodyText   = typeof response.body === 'function'
    ? response.body(province) : response.body;

  const remindersHtml = response.reminders.map(function(r) {
    return '<tr><td style="padding:8px 14px 8px 14px;border-left:3px solid #1565C0;background:#E3F2FD;border-radius:0 6px 6px 0;margin-bottom:8px;">' +
      '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#1565C0;margin-bottom:3px;">' + r.label + '</div>' +
      '<div style="font-size:13px;color:#5F6368;line-height:1.5;">' + r.text + '</div>' +
      '</td></tr><tr><td style="height:8px;"></td></tr>';
  }).join('');

  const prioritiesHtml = province.priorities.map(function(p) {
    return '<tr><td style="padding:10px 14px;border:1px solid #E0E0E0;border-radius:6px;">' +
      '<div style="display:table;width:100%;">' +
      '<div style="display:table-cell;font-size:13px;font-weight:600;color:#202124;">' + p.label + '</div>' +
      '<div style="display:table-cell;text-align:right;white-space:nowrap;">' +
        '<span style="font-size:12px;font-weight:700;color:#2E7D32;background:#F0F7F0;padding:2px 8px;border-radius:10px;">+' + p.pts + ' pts</span>' +
      '</div></div>' +
      '<div style="font-size:11px;color:#9AA0A6;font-style:italic;margin:3px 0;">' + p.timing + '</div>' +
      '<div style="font-size:13px;color:#5F6368;line-height:1.5;">' + p.action + '</div>' +
      '</td></tr><tr><td style="height:8px;"></td></tr>';
  }).join('');

  return '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#F1F3F4;font-family:Arial,Helvetica,sans-serif;">' +

    '<div style="max-width:600px;margin:28px auto;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.10);">' +

    // Header
    '<div style="background:' + headerColor + ';padding:22px 24px 18px;">' +
      '<div style="font-size:11px;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.55);margin-bottom:5px;">LoCAL Solomon Islands · ' + content.month + ' check-in</div>' +
      '<div style="font-size:24px;font-weight:700;color:#fff;line-height:1.15;">' + province.name + ' Province</div>' +
      '<div style="font-size:13px;color:rgba(255,255,255,0.65);margin-top:3px;">' + content.topic + ' · ' + content.pms + '</div>' +
      '<div style="margin-top:12px;display:inline-block;background:rgba(255,255,255,0.15);border-radius:20px;padding:5px 14px;font-size:14px;font-weight:700;color:#fff;">' +
        outcomeIcon + '&nbsp; ' + response.headline +
      '</div>' +
    '</div>' +

    // Score context
    '<div style="background:#E8F5E9;border-bottom:1px solid #C8E6C9;padding:12px 24px;">' +
      '<table style="width:100%;border-collapse:collapse;"><tr>' +
        '<td style="font-size:12px;color:#5F6368;">Last APA reference: <strong style="color:#1B5E20;">' + province.score + ' pts</strong></td>' +
        '<td style="font-size:12px;color:#5F6368;text-align:center;">Available this check-in: <strong style="color:#2E7D32;">+' + ciData.availPts + ' pts</strong></td>' +
        '<td style="font-size:12px;color:#5F6368;text-align:right;">If achieved: <strong style="color:#1B5E20;">' + ciData.refScore + ' pts</strong></td>' +
      '</tr></table>' +
      '<div style="font-size:10px;color:#9AA0A6;font-style:italic;margin-top:4px;">All scores re-assessed from zero each APA cycle</div>' +
    '</div>' +

    // Body
    '<div style="background:#fff;padding:20px 24px;">' +

      // What this means
      '<p style="font-size:14px;color:#5F6368;line-height:1.65;margin:0 0 20px;">' + bodyText + '</p>' +

      // This check-in reminders
      '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9AA0A6;margin-bottom:8px;">This check-in — what you need</div>' +
      '<table style="width:100%;border-collapse:collapse;">' + remindersHtml + '</table>' +

      // Province priorities
      '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9AA0A6;margin:20px 0 8px;">Your other quick wins before the APA</div>' +
      '<table style="width:100%;border-collapse:collapse;">' + prioritiesHtml + '</table>' +

      // Contact
      '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9AA0A6;margin:20px 0 8px;">LoCAL support</div>' +
      '<div style="background:#F8F9FA;border-radius:6px;padding:12px 14px;font-size:12px;color:#9AA0A6;line-height:1.6;">' +
        '<strong style="color:#5F6368;">' + FOCAL_POINT.name + '</strong><br>' +
        '<a href="mailto:' + FOCAL_POINT.email + '" style="color:#1B5E20;text-decoration:none;">' + FOCAL_POINT.email + '</a>' +
        (FOCAL_POINT.phone ? ' · ' + FOCAL_POINT.phone : '') +
      '</div>' +

    '</div>' +

    // Footer
    '<div style="background:#F8F9FA;border-top:1px solid #ECECEC;padding:14px 24px;font-size:11px;color:#9AA0A6;line-height:1.6;">' +
      '<strong style="color:#5F6368;">LoCAL Solomon Islands · UNCDF / MPGIS</strong><br>' +
      'This message was generated automatically from your check-in response.' +
    '</div>' +

    '</div></body></html>';
}

// ── Utility: get pre-fill entry IDs ──────────────────────────
// Run this once from the Apps Script editor (Run → getFormEntryIds)
// after creating the form. It logs the entry IDs you need for the
// province pre-fill URLs.

function getFormEntryIds() {
  // Replace with your form URL
  const formUrl = 'https://docs.google.com/forms/d/YOUR_FORM_ID/edit';
  const form = FormApp.openByUrl(formUrl);
  form.getItems().forEach(function(item) {
    Logger.log(item.getTitle() + ' → entry.' + item.getId());
  });
}

// ── Utility: generate all 9 province pre-fill URLs ───────────
// Run this once after getFormEntryIds to get the 9 email links.
// Replace FORM_ID, PROVINCE_ENTRY_ID, CHECKIN_ENTRY_ID with real values.

function generateProvinceUrls() {
  const FORM_ID          = 'YOUR_FORM_ID';
  const PROVINCE_ENTRY   = 'PROVINCE_ENTRY_ID';   // e.g. 123456789
  const CHECKIN_ENTRY    = 'CHECKIN_ENTRY_ID';    // e.g. 987654321
  const CI_NUM           = '2';

  const base = 'https://docs.google.com/forms/d/' + FORM_ID + '/viewform?usp=pp_url';

  Object.keys(PROVINCES).forEach(function(name) {
    const encoded = encodeURIComponent(name);
    const url = base
      + '&entry.' + PROVINCE_ENTRY + '=' + encoded
      + '&entry.' + CHECKIN_ENTRY  + '=' + CI_NUM;
    Logger.log(name + ':\n' + url + '\n');
  });
}
