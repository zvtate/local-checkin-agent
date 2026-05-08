/**
 * LoCAL Check-in Agent — Apps Script Web App
 *
 * DEPLOY:
 * 1. script.google.com → New project → delete default code → paste this file
 * 2. Fill SHEET_ID and FOCAL_POINT below
 * 3. Deploy → New deployment → Web app
 *    Execute as: Me | Who has access: Anyone
 * 4. Copy the /exec URL — use as ?p=guadalcanal&c=2
 *
 * URL format: https://script.google.com/macros/s/[ID]/exec?p=guadalcanal&c=2
 */

// ── Config ────────────────────────────────────────────────────

var SHEET_ID       = '1lOcXBLzRaJuq4CD1SgHnvCXoUaRRDORHkC9J_umEbys';
var NOTIFY_EMAIL   = 'zoe.victoria.tate@uncdf.org';

var FOCAL_POINT = {
  name:  'Zoe Victoria Tate',
  email: 'zoe.victoria.tate@uncdf.org',
  phone: '7218774'
};

// ── Province data ─────────────────────────────────────────────

var PROVINCES = {
  'guadalcanal': {
    name: 'Guadalcanal', code: 'GP', psEmail: 'zoe.victoria.tate@uncdf.org', score: 37,
    checkins: { '2': { availPts: 10, refScore: 47 } },
    priorities: [
      { label: 'PM#13 — CC clause in all PBCRG tender documents', pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to every PBCRG procurement document. Template from LoCAL focal point — 30-minute admin task per contract.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text', pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the National Development Strategy 2016–2035. Standard citation from LoCAL focal point.' },
      { label: 'PM#5b — Priority statements linked to climate data', pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'Guadalcanal is the only province that missed this. ACCAF LALAP priority statements must cite your PM#1 climate data as evidence.' }
    ]
  },
  'temotu': {
    name: 'Temotu', code: 'TP', psEmail: 'zoe.victoria.tate@uncdf.org', score: 33,
    checkins: { '2': { availPts: 10, refScore: 43 } },
    priorities: [
      { label: 'PM#9 — Provincial Engineer design sign-off', pts: 5, timing: 'Before 31 March',
        action: 'Entire PM missed last APA. Engineer must sign every PBCRG design file confirming CC risks considered. One annotated page per project.' },
      { label: 'PM#13 — CC clause in all PBCRG tender documents', pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to all PBCRG procurement documents. Template from LoCAL focal point.' },
      { label: 'PM#4c — National Climate Change Policy reference', pts: 1, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per project referencing the NCCP — same approach as your existing NDS reference.' }
    ]
  },
  'rennell-bellona': {
    name: 'Rennell & Bellona', code: 'RBP', psEmail: 'zoe.victoria.tate@uncdf.org', score: 24,
    checkins: { '2': { availPts: 10, refScore: 34 } },
    priorities: [
      { label: 'PM#12 — Designate CC Focal Point (CCARRO) — URGENT', pts: 5, timing: 'Immediately',
        action: 'Only province without a designated CCARRO. This unlocks PM#4, #5, #14, #15. Issue formal designation letter with task description and budget line.' },
      { label: 'PM#13 — CC clause in all PBCRG tender documents', pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to all PBCRG procurement documents. Template from LoCAL focal point.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text', pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the NDS 2016–2035. Standard citation from LoCAL focal point.' }
    ]
  },
  'western': {
    name: 'Western', code: 'WP', psEmail: 'zoe.victoria.tate@uncdf.org', score: 34,
    checkins: { '2': { availPts: 10, refScore: 44 } },
    priorities: [
      { label: 'PM#13 — CC clause in all PBCRG tender documents', pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to all PBCRG procurement documents. Template from LoCAL focal point.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text', pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'Western already references the NCCP — the NDS reference is the same approach. One sentence per project.' },
      { label: 'PM#10 — Vulnerable group targeting in ACCAF (2 pts gap)', pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'Explicitly name vulnerable beneficiaries in ACCAF Cols I, J, V, W with a note on how each project addresses their specific CC exposure.' }
    ]
  },
  'choiseul': {
    name: 'Choiseul', code: 'CP', psEmail: 'zoe.victoria.tate@uncdf.org', score: 33,
    checkins: { '2': { availPts: 10, refScore: 43 } },
    priorities: [
      { label: 'PM#13 — CC clause in remaining tender documents (4 pts gap)', pts: 4, timing: 'Before 31 March',
        action: 'Choiseul scored 1/5 — some CC language exists. Apply standard clause to all remaining PBCRG contracts.' },
      { label: 'PM#5c — Priority statements used in project selection', pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'ACCAF LALAP priority statements must be cited in the project selection justification in the annual plan.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text', pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the NDS 2016–2035. Standard citation from LoCAL focal point.' }
    ]
  },
  'malaita': {
    name: 'Malaita', code: 'MP', psEmail: 'zoe.victoria.tate@uncdf.org', score: 34,
    checkins: { '2': { availPts: 10, refScore: 44 } },
    priorities: [
      { label: 'PM#9 — Provincial Engineer design sign-off', pts: 5, timing: 'Before 31 March',
        action: 'Entire PM missed last APA. Engineer signs every PBCRG design file confirming CC risks considered. One annotated page per project.' },
      { label: 'PM#13 — CC clause in all PBCRG tender documents', pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to all PBCRG procurement documents. Template from LoCAL focal point.' },
      { label: 'PM#8b — CC-proofing cost estimates in ACCAF Cols AD–AG', pts: 3, timing: 'Planning season (Nov–Jan)',
        action: 'Malaita is the only province that missed PM#8b. Populate ACCAF Cols AD–AG with CC-proofing cost estimates. Contact LoCAL focal point for an ACCAF session.' }
    ]
  },
  'central-islands': {
    name: 'Central Islands', code: 'CIP', psEmail: 'zoe.victoria.tate@uncdf.org', score: 33,
    checkins: { '2': { availPts: 10, refScore: 43 } },
    priorities: [
      { label: 'PM#9 — Provincial Engineer design sign-off', pts: 5, timing: 'Before 31 March',
        action: 'Entire PM missed (same gap in Temotu and Malaita). Engineer signs every PBCRG design file confirming CC risks considered.' },
      { label: 'PM#13 — CC clause in all PBCRG tender documents', pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to all PBCRG procurement documents. Template from LoCAL focal point.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text', pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the NDS 2016–2035. Standard citation from LoCAL focal point.' }
    ]
  },
  'isabel': {
    name: 'Isabel', code: 'IP', psEmail: 'zoe.victoria.tate@uncdf.org', score: 35,
    checkins: { '2': { availPts: 10, refScore: 45 } },
    priorities: [
      { label: 'PM#13 — CC clause in remaining tender documents (2 pts gap)', pts: 2, timing: 'Before 31 March',
        action: 'Isabel scored 3/5 — CC clause already in most tenders. Apply consistently to all remaining PBCRG contracts.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text', pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the NDS 2016–2035. Standard citation from LoCAL focal point.' },
      { label: 'PM#4c — National Climate Change Policy reference', pts: 1, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per project referencing the NCCP. Same approach as the NDS reference — together PM#4b + #4c are 3 pts for two sentences.' }
    ]
  },
  'makira-ulawa': {
    name: 'Makira-Ulawa', code: 'MUP', psEmail: 'zoe.victoria.tate@uncdf.org', score: 39,
    checkins: { '2': { availPts: 10, refScore: 49 } },
    priorities: [
      { label: 'PM#13 — CC clause in remaining tender documents (2 pts gap)', pts: 2, timing: 'Before 31 March',
        action: 'Makira-Ulawa scored 3/5. Apply the standard CC clause to all remaining PBCRG contracts.' },
      { label: 'PM#9b — Written design records for all PBCRG infrastructure', pts: 2, timing: 'Before 31 March',
        action: 'A written note per project on design standards applied and how resilience was incorporated. One page per project is sufficient.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text', pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the NDS 2016–2035. Standard citation from LoCAL focal point.' }
    ]
  }
};

// ── Check-in 2 content ────────────────────────────────────────

var CI2_RESPONSES = {
  'both+yes': {
    outcome: 'ok', icon: '✓',
    headline: 'Both sessions done and documented',
    body: function(p) {
      return 'PM#14 requires documented training of PG staff on CC adaptation. PM#15 requires documented meetings with WDC members or community leaders on CC risks. ' + p.name + ' has completed both and has records in order — exactly what the assessor will check. ' +
        'Verify that PM#15 attendance records show disaggregated participation by sex and, where possible, youth. If not captured, add a brief note before the APA visit.';
    },
    reminders: [
      { label: 'Before the APA visit', text: 'Organise evidence in labelled folders — one per session: "PM#14 — [date]" and "PM#15 — [date]". The assessor will look for both.' },
      { label: 'PM#14 evidence checklist', text: 'Signed attendance list of PG staff · Written agenda explicitly mentioning CC/adaptation · Brief summary or minutes.' },
      { label: 'PM#15 evidence checklist', text: 'Signed attendance list disaggregated by sex/youth · Meeting agenda including CC item · Brief summary or minutes.' },
      { label: 'APA deadline', text: 'All evidence must be filed before the assessor\'s visit (target: August). Records submitted after the visit cannot be accepted.' }
    ]
  },
  'both+no': {
    outcome: 'warn', icon: '!',
    headline: 'Sessions done — documentation still needed',
    body: function(p) {
      return p.name + ' has held both sessions — that is the activity requirement for PM#14 and PM#15. ' +
        'To earn these points, the assessor also needs: (1) a signed attendance list, (2) a written agenda, and (3) a brief summary or minutes — for each session separately. ' +
        'Filing these now avoids last-minute gaps before the APA. For PM#15, attendance records should show disaggregated participation (women, youth).';
    },
    reminders: [
      { label: 'Action needed — file records for both sessions', text: 'For each session: signed attendance list · written agenda mentioning CC · one-page summary or minutes. Missing any one element is enough for the assessor to withhold points.' },
      { label: 'PM#15 — disaggregated attendance', text: 'Identify women and youth participants specifically. A note at the bottom of the sign-in sheet is sufficient.' },
      { label: 'APA deadline', text: 'All evidence must be filed before the assessor\'s visit (target: August).' }
    ]
  },
  'staff': {
    outcome: 'warn', icon: '→',
    headline: 'Staff session done — community session needed for PM#15',
    body: function(p) {
      return 'PM#14 (5 pts) — staff session covers this if records are filed. ' +
        'PM#15 (5 pts) requires a documented meeting with WDC members or community leaders on CC risks. ' +
        'No standalone event needed: any WDC meeting that includes CC on the agenda qualifies. ' +
        'Check if a WDC meeting is scheduled soon and add CC to the agenda. Both PMs require: signed attendance list, written agenda, brief summary.';
    },
    reminders: [
      { label: 'Quickest path for PM#15', text: 'Check the WDC meeting calendar. Add CC adaptation to the agenda, take disaggregated attendance, write a one-page summary. PM#15 with no extra convening cost.' },
      { label: 'PM#14 — secure what you have', text: 'File: signed attendance list, agenda/programme, written summary. Label the folder "PM#14 — [date]".' },
      { label: 'APA deadline', text: 'Both sessions must be documented before the assessor\'s visit (target: August).' }
    ]
  },
  'community': {
    outcome: 'warn', icon: '→',
    headline: 'Community session done — staff session needed for PM#14',
    body: function(p) {
      return 'PM#15 (5 pts) — community session covers this if records are filed. ' +
        'PM#14 (5 pts) requires a documented training with PG staff on CC adaptation. ' +
        'A half-day internal session is sufficient — all relevant staff should attend and sign in. ' +
        'Contact your CCARRO or LoCAL focal point to arrange this before August. Both PMs require: signed attendance list, written agenda, brief summary.';
    },
    reminders: [
      { label: 'Quickest path for PM#14', text: 'A half-day internal briefing with PG staff. MECDM can often provide a presenter at short notice. Label records "PM#14 — [date]".' },
      { label: 'PM#15 — secure what you have', text: 'File: signed attendance list (disaggregated), agenda, written summary. Label "PM#15 — [date]".' },
      { label: 'APA deadline', text: 'Both sessions must be documented before the assessor\'s visit (target: August).' }
    ]
  },
  'none': {
    outcome: 'alert', icon: '!',
    headline: 'Eight weeks — still achievable if started this month',
    body: function(p) {
      return 'PM#14 requires documented training with PG staff on CC adaptation. PM#15 requires documented meetings with WDC members or community leaders on CC risks. ' +
        'Together: up to 10 points — the most accessible measures in the framework. ' +
        'The APA window opens in approximately 8 weeks. A combined half-day event covers both PMs in one day. ' +
        'Contact LoCAL focal point this week to confirm a date.';
    },
    reminders: [
      { label: 'PM#14 · 5 pts — What it takes', text: 'Documented training with PG staff on CC adaptation. Required: signed attendance list · written agenda mentioning CC · brief summary or minutes.' },
      { label: 'PM#15 · 5 pts — What it takes', text: 'Documented meeting with WDC members/community leaders on CC risks. Required: signed attendance list (disaggregated by sex/youth) · agenda including CC item · brief summary.' },
      { label: 'Combined session option', text: 'Morning for PG staff + afternoon for WDC/community — covers both PMs in one day. Keep separate attendance sheets for each part.' },
      { label: 'APA deadline', text: 'Sessions must be held and documented before the assessor\'s visit (target: August). Starting now leaves time to correct any documentation gaps.' }
    ]
  }
};

// ── doGet — serve the form page ───────────────────────────────

function doGet(e) {
  var p  = (e.parameter.p || '').toLowerCase();
  var c  = e.parameter.c || '2';
  var province = PROVINCES[p];

  var html = province ? buildFormPage(province, c) : buildErrorPage();

  return HtmlService.createHtmlOutput(html)
    .setTitle('LoCAL Check-in · Solomon Islands')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ── processSubmit — called from client JS ─────────────────────

function processSubmit(data) {
  try {
    var province = PROVINCES[data.provinceKey];
    var ciData   = province.checkins[data.ciNum];
    var responseKey = data.followup
      ? data.answer + '+' + data.followup
      : data.answer;

    var response = CI2_RESPONSES[responseKey];
    if (!response) return { ok: false, error: 'Unknown response key: ' + responseKey };

    // Log to Sheet
    logToSheet(province, data.ciNum, data.answer, data.followup, responseKey);

    // Send email to PS + CC programme team
    sendEmail(province, data.ciNum, ciData, response, responseKey);

    // Return result content to display on-page
    return {
      ok:          true,
      outcome:     response.outcome,
      icon:        response.icon,
      headline:    response.headline,
      body:        response.body(province),
      reminders:   response.reminders,
      priorities:  province.priorities,
      scoreBefore: province.score,
      scoreAfter:  ciData.refScore,
      availPts:    ciData.availPts,
      provinceName:province.name,
      focalPoint:  FOCAL_POINT
    };

  } catch(err) {
    Logger.log(err.message + '\n' + err.stack);
    return { ok: false, error: err.message };
  }
}

// ── Log to Sheet ──────────────────────────────────────────────

function logToSheet(province, ciNum, answer, followup, responseKey) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Responses');

  if (!sheet) {
    sheet = ss.insertSheet('Responses');
    sheet.appendRow(['Timestamp','Province','Code','Check-in','Ref Score','Answer',
                     'Follow-up','Response Key','PM14 Status','PM15 Status','Docs Ready']);
    sheet.getRange(1,1,1,11).setFontWeight('bold').setBackground('#E8F5E9');
    sheet.setFrozenRows(1);
  }

  var pm14 = (answer === 'both' || answer === 'staff')     ? 'in_progress' : 'not_started';
  var pm15 = (answer === 'both' || answer === 'community') ? 'in_progress' : 'not_started';
  var docs = responseKey === 'both+yes' ? 'yes' : responseKey === 'both+no' ? 'no' : 'n/a';

  sheet.appendRow([
    new Date(), province.name, province.code, 'CI-' + ciNum,
    province.score, answer, followup || '', responseKey, pm14, pm15, docs
  ]);
}

// ── Send email ────────────────────────────────────────────────

function sendEmail(province, ciNum, ciData, response, responseKey) {
  var headerColor = response.outcome === 'ok' ? '#2E7D32'
                  : response.outcome === 'warn' ? '#E65100' : '#B71C1C';

  var remindersHtml = response.reminders.map(function(r) {
    return '<div style="margin-bottom:8px;padding:10px 14px;border-left:3px solid #1565C0;background:#E3F2FD;border-radius:0 6px 6px 0;">' +
      '<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#1565C0;margin-bottom:3px;">' + r.label + '</div>' +
      '<div style="font-size:13px;color:#5F6368;line-height:1.5;">' + r.text + '</div></div>';
  }).join('');

  var prioritiesHtml = province.priorities.map(function(p) {
    return '<div style="margin-bottom:8px;padding:10px 14px;border:1px solid #E0E0E0;border-radius:6px;">' +
      '<div style="font-size:13px;font-weight:600;color:#202124;">' + p.label +
        ' <span style="font-size:12px;font-weight:700;color:#2E7D32;background:#F0F7F0;padding:2px 8px;border-radius:10px;">+' + p.pts + ' pts</span></div>' +
      '<div style="font-size:11px;color:#9AA0A6;font-style:italic;margin:2px 0;">' + p.timing + '</div>' +
      '<div style="font-size:13px;color:#5F6368;line-height:1.5;">' + p.action + '</div></div>';
  }).join('');

  var html = '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#F1F3F4;font-family:Arial,sans-serif;">' +
    '<div style="max-width:600px;margin:24px auto;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1);">' +

    '<div style="background:' + headerColor + ';padding:22px 24px;">' +
      '<div style="font-size:11px;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.55);margin-bottom:4px;">LoCAL Solomon Islands · Check-in ' + ciNum + '</div>' +
      '<div style="font-size:22px;font-weight:700;color:#fff;">' + province.name + ' Province</div>' +
      '<div style="font-size:13px;color:rgba(255,255,255,0.65);margin-top:2px;">CC awareness sessions · PM#14 + PM#15</div>' +
      '<div style="margin-top:10px;display:inline-block;background:rgba(255,255,255,0.15);border-radius:20px;padding:4px 14px;font-size:14px;font-weight:700;color:#fff;">' +
        response.icon + '&nbsp; ' + response.headline + '</div>' +
    '</div>' +

    '<div style="background:#E8F5E9;border-bottom:1px solid #C8E6C9;padding:10px 24px;">' +
      '<span style="font-size:12px;color:#5F6368;">Last APA reference: <strong style="color:#1B5E20;">' + province.score + ' pts</strong></span>' +
      '&nbsp;&nbsp;·&nbsp;&nbsp;<span style="font-size:12px;color:#5F6368;">Available this check-in: <strong style="color:#2E7D32;">+' + ciData.availPts + ' pts</strong></span>' +
      '&nbsp;&nbsp;·&nbsp;&nbsp;<span style="font-size:12px;color:#5F6368;">If achieved: <strong>' + ciData.refScore + ' pts</strong></span><br>' +
      '<span style="font-size:10px;color:#9AA0A6;font-style:italic;">All scores re-assessed from zero each APA cycle</span>' +
    '</div>' +

    '<div style="background:#fff;padding:20px 24px;">' +
      '<p style="font-size:14px;color:#5F6368;line-height:1.65;margin:0 0 18px;">' + response.body(province) + '</p>' +
      '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9AA0A6;margin-bottom:8px;">This check-in — what you need</div>' +
      remindersHtml +
      '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9AA0A6;margin:18px 0 8px;">Your other quick wins before the APA</div>' +
      prioritiesHtml +
      '<div style="background:#F8F9FA;border-radius:6px;padding:12px 14px;font-size:12px;color:#9AA0A6;margin-top:18px;line-height:1.6;">' +
        '<strong style="color:#5F6368;">' + FOCAL_POINT.name + '</strong><br>' +
        '<a href="mailto:' + FOCAL_POINT.email + '" style="color:#1B5E20;text-decoration:none;">' + FOCAL_POINT.email + '</a>' +
        (FOCAL_POINT.phone ? ' · ' + FOCAL_POINT.phone : '') +
      '</div>' +
    '</div>' +

    '<div style="background:#F8F9FA;border-top:1px solid #ECECEC;padding:12px 24px;font-size:11px;color:#9AA0A6;">' +
      'LoCAL Solomon Islands · UNCDF / MPGIS · Generated from your check-in response.' +
    '</div>' +
    '</div></body></html>';

  MailApp.sendEmail({
    to:       province.psEmail,
    cc:       NOTIFY_EMAIL,
    subject:  '[LoCAL] ' + province.name + ' — Check-in ' + ciNum + ': ' + response.headline,
    htmlBody: html
  });
}

// ── Build form page HTML ──────────────────────────────────────

function buildFormPage(province, ciNum) {
  var ciData = province.checkins[ciNum];
  var provinceKey = Object.keys(PROVINCES).filter(function(k) {
    return PROVINCES[k].name === province.name;
  })[0];

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>LoCAL Check-in · ' + province.name + '</title>' +
    '<style>' + getCSS() + '</style></head><body>' +
    '<div id="app">' +

    // Loading
    '<div id="s-load" class="screen active"><div class="load-inner"><div class="spinner"></div></div></div>' +

    // Question
    '<div id="s-q" class="screen">' +
      '<div class="card">' +
        '<div class="hdr">' +
          '<div class="eyebrow">LoCAL Solomon Islands · June 2026 check-in</div>' +
          '<h1>' + province.name + ' Province</h1>' +
          '<div class="subhead">CC awareness sessions · PM#14 + PM#15</div>' +
        '</div>' +
        '<div class="score-strip">' +
          '<div class="si"><span class="sv">' + province.score + ' pts</span><span class="sl">last APA reference</span></div>' +
          '<div class="sep"></div>' +
          '<div class="si"><span class="sv accent">+' + ciData.availPts + ' pts</span><span class="sl">available this check-in</span></div>' +
        '</div>' +
        '<div class="body">' +
          '<p class="qtext">Has ' + province.name + ' Province held at least one climate change awareness session this fiscal year — for PG staff or for communities?</p>' +
          '<div class="opts" id="opts-main">' +
            '<button class="opt" data-val="both">Both — staff session and community session done</button>' +
            '<button class="opt" data-val="staff">Staff session only</button>' +
            '<button class="opt" data-val="community">Community session only</button>' +
            '<button class="opt" data-val="none">Not yet this fiscal year</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<p class="meta">APA window opens in ~8 weeks · 1–2 questions · ~30 seconds · all scores reset each APA</p>' +
    '</div>' +

    // Follow-up
    '<div id="s-fu" class="screen">' +
      '<div class="card">' +
        '<div class="hdr compact"><div class="eyebrow">LoCAL Solomon Islands · June 2026</div><h1>' + province.name + ' Province</h1></div>' +
        '<div class="fu-ctx" id="fu-ctx">' + province.name + ' has completed both sessions</div>' +
        '<div class="body">' +
          '<p class="qtext">One more question: are all required records — signed attendance list, written agenda, and a summary note — filed and ready for the assessor for each session?</p>' +
          '<div class="opts" id="opts-fu">' +
            '<button class="opt" data-val="yes">✓ Yes, records filed for both sessions</button>' +
            '<button class="opt" data-val="no">✗ Not all records filed yet</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    // Result
    '<div id="s-res" class="screen">' +
      '<div class="card">' +
        '<div class="hdr" id="res-hdr">' +
          '<div class="eyebrow">LoCAL Solomon Islands · June 2026</div>' +
          '<div class="icon-wrap"><span class="icon" id="res-icon"></span></div>' +
          '<h1 id="res-headline"></h1>' +
        '</div>' +
        '<div class="sc-ctx">' +
          '<div class="sc-row">' +
            '<div class="sc-i"><span class="sc-n">' + province.score + ' pts</span><span class="sc-l">last APA reference</span></div>' +
            '<div class="sc-arr">→</div>' +
            '<div class="sc-i"><span class="sc-n grn">' + ciData.refScore + ' pts</span><span class="sc-l">if check-in achieved</span></div>' +
            '<div class="sc-div"></div>' +
            '<div class="sc-i"><span class="sc-n acc">+' + ciData.availPts + '</span><span class="sc-l">pts at stake</span></div>' +
          '</div>' +
          '<div class="reset-note">All scores re-assessed from zero each APA cycle</div>' +
        '</div>' +
        '<div class="body">' +
          '<p class="rbody" id="res-body"></p>' +
          '<div class="slbl">This check-in — what you need</div>' +
          '<div id="res-rem"></div>' +
          '<div class="slbl">Your other quick wins before the APA</div>' +
          '<div id="res-pri"></div>' +
          '<div class="slbl">LoCAL support</div>' +
          '<div class="contact" id="res-contact"></div>' +
        '</div>' +
      '</div>' +
      '<p class="footer">Your response has been recorded. You can close this tab.</p>' +
    '</div>' +

    '</div>' + // #app

    '<script>' + getClientJS(provinceKey, ciNum) + '</script>' +
    '</body></html>';
}

function buildErrorPage() {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>LoCAL Check-in</title><style>' + getCSS() + '</style></head><body>' +
    '<div id="app"><div class="card" style="margin-top:24px;">' +
    '<div class="hdr" style="background:#37474F;"><div class="eyebrow">LoCAL Solomon Islands</div><h1>Link not recognised</h1></div>' +
    '<div class="body"><p class="rbody">This check-in link appears to be invalid or expired. Please contact your LoCAL focal point for the correct link.</p>' +
    '<div class="contact"><strong>' + FOCAL_POINT.name + '</strong><br><a href="mailto:' + FOCAL_POINT.email + '">' + FOCAL_POINT.email + '</a></div>' +
    '</div></div></div></body></html>';
}

// ── Client-side JS ────────────────────────────────────────────

function getClientJS(provinceKey, ciNum) {
  return '(function(){' +
    'var answer=null,followup=null;' +

    // Show initial screen after brief load
    'setTimeout(function(){show("s-q");},150);' +

    // Option click handler
    'document.querySelectorAll("#opts-main .opt").forEach(function(btn){' +
      'btn.addEventListener("click",function(){' +
        'document.querySelectorAll("#opts-main .opt").forEach(function(b){b.classList.remove("sel");});' +
        'btn.classList.add("sel");' +
        'answer=btn.dataset.val;' +
        'setTimeout(function(){' +
          'if(answer==="both"){show("s-fu");}' +
          'else{submit();}' +
        '},220);' +
      '});' +
    '});' +

    'document.querySelectorAll("#opts-fu .opt").forEach(function(btn){' +
      'btn.addEventListener("click",function(){' +
        'document.querySelectorAll("#opts-fu .opt").forEach(function(b){b.classList.remove("sel");});' +
        'btn.classList.add("sel");' +
        'followup=btn.dataset.val;' +
        'setTimeout(submit,220);' +
      '});' +
    '});' +

    'function submit(){' +
      'show("s-load");' +
      'google.script.run' +
        '.withSuccessHandler(showResult)' +
        '.withFailureHandler(function(e){alert("Error: "+e.message);show("s-q");})' +
        '.processSubmit({provinceKey:"' + provinceKey + '",ciNum:"' + ciNum + '",answer:answer,followup:followup});' +
    '}' +

    'function showResult(d){' +
      'if(!d.ok){alert("Error: "+d.error);show("s-q");return;}' +
      'var hdr=document.getElementById("res-hdr");' +
      'hdr.style.background=d.outcome==="ok"?"#2E7D32":d.outcome==="warn"?"#E65100":"#B71C1C";' +
      'document.getElementById("res-icon").textContent=d.icon;' +
      'document.getElementById("res-icon").className="icon "+(d.outcome);' +
      'document.getElementById("res-headline").textContent=d.headline;' +
      'document.getElementById("res-body").textContent=d.body;' +
      // Reminders
      'var remEl=document.getElementById("res-rem");' +
      'remEl.innerHTML=d.reminders.map(function(r){' +
        'return\'<div class="rem pm"><div class="rem-lbl">\'+r.label+\'</div><div class="rem-txt">\'+r.text+\'</div></div>\';' +
      '}).join("");' +
      // Priorities
      'var priEl=document.getElementById("res-pri");' +
      'priEl.innerHTML=d.priorities.map(function(p){' +
        'return\'<div class="pri"><div class="pri-top"><span class="pri-lbl">\'+p.label+\'</span><span class="pri-pts">+\'+p.pts+\' pts</span></div><div class="pri-timing">\'+p.timing+\'</div><div class="pri-act">\'+p.action+\'</div></div>\';' +
      '}).join("");' +
      // Contact
      'document.getElementById("res-contact").innerHTML=\'<strong>\'+d.focalPoint.name+\'</strong><br><a href="mailto:\'+d.focalPoint.email+\'">\'+d.focalPoint.email+\'</a>\'+' +
        '(d.focalPoint.phone?\' · \'+d.focalPoint.phone:\'\');' +
      'show("s-res");' +
    '}' +

    'function show(id){' +
      'document.querySelectorAll(".screen").forEach(function(s){s.classList.remove("active");});' +
      'document.getElementById(id).classList.add("active");' +
      'window.scrollTo({top:0,behavior:"smooth"});' +
    '}' +
  '})();';
}

// ── CSS ───────────────────────────────────────────────────────

function getCSS() {
  return '*{box-sizing:border-box;margin:0;padding:0}' +
  ':root{--g:#1B5E20;--gm:#2E7D32;--gl:#A5D6A7;--gbg:#F0F7F0;--gbd:#C8E6C9;' +
    '--am:#E65100;--rd:#C62828;--bl:#1565C0;--blbg:#E3F2FD;' +
    '--t:#202124;--t2:#5F6368;--tm:#9AA0A6;--bd:#EBEBEB;--bg:#F1F3F4}' +
  'html{font-size:16px;-webkit-text-size-adjust:100%}' +
  'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;background:var(--bg);color:var(--t);padding:16px 0 48px}' +
  '#app{max-width:480px;margin:0 auto;padding:0 16px}' +
  '.screen{display:none}.screen.active{display:block;animation:fi .2s ease}' +
  '@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
  '.card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.10);margin-bottom:10px}' +
  '.hdr{background:var(--g);padding:22px 20px 20px;color:#fff}' +
  '.hdr.compact{padding:16px 20px}' +
  '.eyebrow{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,.55);margin-bottom:5px}' +
  '.hdr h1{font-size:22px;font-weight:700;line-height:1.15}' +
  '.subhead{font-size:13px;color:rgba(255,255,255,.6);margin-top:3px}' +
  '.score-strip{background:var(--gm);padding:12px 20px;display:flex;align-items:center}' +
  '.si{display:flex;flex-direction:column;flex:1}' +
  '.sv{font-size:20px;font-weight:800;color:#fff;line-height:1.1}.sv.accent{color:var(--gl)}' +
  '.sl{font-size:10px;color:rgba(255,255,255,.55);margin-top:2px}' +
  '.sep{width:1px;background:rgba(255,255,255,.2);align-self:stretch;margin:4px 14px;flex-shrink:0}' +
  '.body{padding:20px}' +
  '.qtext{font-size:15px;color:var(--t);line-height:1.6;margin-bottom:18px}' +
  '.opts{display:flex;flex-direction:column;gap:10px}' +
  '.opt{display:block;width:100%;min-height:56px;padding:14px 16px;background:#fff;border:2px solid var(--bd);border-radius:8px;font-size:15px;font-weight:500;color:var(--t);text-align:left;cursor:pointer;line-height:1.4;transition:border-color .15s,background .15s;-webkit-tap-highlight-color:transparent}' +
  '.opt:hover,.opt:focus-visible{border-color:var(--gm);background:var(--gbg);outline:none}' +
  '.opt.sel{border-color:var(--g);background:var(--gbg);color:var(--g)}' +
  '.fu-ctx{background:var(--gbg);border-bottom:1px solid var(--gbd);padding:12px 20px;font-size:13px;color:var(--g);font-weight:500}' +
  '.icon-wrap{margin:10px 0 8px}' +
  '.icon{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;font-size:18px;font-weight:900;color:#fff;background:rgba(255,255,255,.15)}' +
  '.icon.ok{background:rgba(165,214,167,.3)}.icon.warn{background:rgba(255,193,7,.25)}.icon.alert{background:rgba(244,67,54,.2)}' +
  '.sc-ctx{background:var(--gbg);border-bottom:1px solid var(--gbd);padding:13px 20px 9px}' +
  '.sc-row{display:flex;align-items:center;gap:6px;margin-bottom:5px}' +
  '.sc-i{display:flex;flex-direction:column;align-items:center}' +
  '.sc-n{font-size:17px;font-weight:800;color:var(--t);line-height:1}.sc-n.grn{color:var(--g)}.sc-n.acc{color:var(--gm)}' +
  '.sc-l{font-size:10px;color:var(--tm);margin-top:2px;text-align:center}' +
  '.sc-arr{font-size:15px;color:var(--tm);padding-bottom:12px}' +
  '.sc-div{width:1px;height:32px;background:var(--gbd);margin:0 8px;flex-shrink:0}' +
  '.reset-note{font-size:10px;color:var(--tm);font-style:italic}' +
  '.rbody{font-size:14px;color:var(--t2);line-height:1.65;margin-bottom:18px}' +
  '.slbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--tm);margin:18px 0 8px}' +
  '.rem{border-radius:8px;padding:11px 13px;font-size:13px;line-height:1.5;margin-bottom:8px}' +
  '.rem.pm{background:var(--blbg);border-left:3px solid var(--bl)}' +
  '.rem.tip{background:var(--gbg);border-left:3px solid var(--gm)}' +
  '.rem.deadline{background:#FFF3E0;border-left:3px solid var(--am)}' +
  '.rem-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--bl);margin-bottom:3px}' +
  '.rem-txt{color:var(--t2)}' +
  '.pri{border:1px solid var(--bd);border-radius:8px;padding:11px 13px;margin-bottom:8px}' +
  '.pri-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:2px}' +
  '.pri-lbl{font-size:13px;font-weight:600;color:var(--t);flex:1;line-height:1.35}' +
  '.pri-pts{font-size:12px;font-weight:700;color:var(--gm);background:var(--gbg);padding:2px 7px;border-radius:10px;white-space:nowrap;flex-shrink:0}' +
  '.pri-timing{font-size:11px;color:var(--tm);font-style:italic;margin-bottom:4px}' +
  '.pri-act{font-size:13px;color:var(--t2);line-height:1.5}' +
  '.contact{background:#F8F9FA;border-radius:8px;padding:12px 14px;font-size:12px;color:var(--tm);line-height:1.6}' +
  '.contact strong{color:var(--t2)}.contact a{color:var(--g);text-decoration:none}' +
  '.meta{font-size:11px;color:var(--tm);text-align:center;padding:6px 0 4px;line-height:1.6}' +
  '.footer{font-size:12px;color:var(--tm);text-align:center;padding:8px 0}' +
  '.load-inner{display:flex;align-items:center;justify-content:center;min-height:220px}' +
  '.spinner{width:32px;height:32px;border:3px solid var(--gbd);border-top-color:var(--gm);border-radius:50%;animation:spin .8s linear infinite}' +
  '@keyframes spin{to{transform:rotate(360deg)}}' +
  '@media(min-width:520px){body{padding:32px 0 60px}.hdr{padding:26px 24px 22px}.body{padding:24px}.score-strip{padding:14px 24px}.sc-ctx{padding:14px 24px 10px}}';
}
