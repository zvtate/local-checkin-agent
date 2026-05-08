/* ============================================================
   LoCAL Check-in Agent — Data + UI logic
   Usage: checkin.html?p=guadalcanal&c=2
   ============================================================ */

// ── Configuration ────────────────────────────────────────────
const WEBHOOK_URL = 'PASTE_APPS_SCRIPT_WEB_APP_URL_HERE';

const FOCAL_POINT = {
  name:  '[LoCAL Focal Point Name]',
  email: 'local@uncdf.org',
  phone: '[Phone]',
};

// ── Core scoring note ─────────────────────────────────────────
// APA scores reset to zero each year. All points must be
// re-demonstrated with fresh evidence every assessment cycle.
// Reference scores from last APA are shown for context only.

// ── Province data ─────────────────────────────────────────────
// score   = last APA reference score (context only — does not carry over)
// pms     = last APA PM-level reference scores (context only)
// checkins = per-check-in data keyed by check-in number
//   availPts = max pts for this check-in's PMs (always full marks — scores reset)
//   refScore = reference score + availPts (indicative ceiling if CI measures achieved)
// priorities = province-specific quick wins OUTSIDE the current CI theme
//   each: { label, pts, timing, action }

const PROVINCES = {

  guadalcanal: {
    name: 'Guadalcanal', code: 'GP', ps: '[PS Name — Guadalcanal]',
    score: 37,
    pms: { pm1:5, pm2:3, pm3:3, pm4:2, pm5:3, pm6:0, pm7:5, pm8:5, pm9:2,
           pm10:3, pm11:0, pm12:5, pm13:0, pm14:0, pm15:1, pm16:0, pm17:0, pm18:0 },
    checkins: { 2: { availPts: 10, refScore: 47 } },
    priorities: [
      { label: 'PM#13 — CC clause in all PBCRG tender documents',
        pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to every PBCRG procurement document. Template available from LoCAL focal point — 30-minute admin task per contract.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'Add one sentence per PBCRG project in the annual plan explicitly referencing the National Development Strategy 2016–2035. Standard citation text available from LoCAL focal point.' },
      { label: 'PM#5b — Priority statements linked to climate data',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'Guadalcanal is the only province that missed this. ACCAF LALAP priority statements must cite the climate data from PM#1 as evidence. Your CCARRO has that data — the link is a one-paragraph update.' },
    ],
  },

  temotu: {
    name: 'Temotu', code: 'TP', ps: '[PS Name — Temotu]',
    score: 33,
    pms: { pm1:2, pm2:0, pm3:3, pm4:4, pm5:5, pm6:0, pm7:5, pm8:5, pm9:0,
           pm10:3, pm11:0, pm12:5, pm13:0, pm14:0, pm15:1, pm16:0, pm17:0, pm18:0 },
    checkins: { 2: { availPts: 10, refScore: 43 } },
    priorities: [
      { label: 'PM#9 — Provincial Engineer design sign-off',
        pts: 5, timing: 'Before 31 March',
        action: 'Entire PM missed last APA. Provincial Engineer must review every PBCRG infrastructure design and add a signed note confirming CC risks considered and standards applied. One page per project.' },
      { label: 'PM#13 — CC clause in all PBCRG tender documents',
        pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to all PBCRG procurement documents. Template from LoCAL focal point.' },
      { label: 'PM#4c — National Climate Change Policy reference',
        pts: 1, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per project referencing the NCCP. Standard citation from LoCAL focal point — same approach as your existing NDS reference.' },
    ],
  },

  'rennell-bellona': {
    name: 'Rennell & Bellona', code: 'RBP', ps: '[PS Name — Rennell & Bellona]',
    score: 24,
    pms: { pm1:0, pm2:0, pm3:3, pm4:2, pm5:3, pm6:0, pm7:5, pm8:5, pm9:3,
           pm10:3, pm11:0, pm12:0, pm13:0, pm14:0, pm15:0, pm16:0, pm17:0, pm18:0 },
    checkins: { 2: { availPts: 10, refScore: 34 } },
    priorities: [
      { label: 'PM#12 — Designate a CC Focal Point (CCARRO)',
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

  western: {
    name: 'Western', code: 'WP', ps: '[PS Name — Western]',
    score: 34,
    pms: { pm1:0, pm2:0, pm3:3, pm4:3, pm5:5, pm6:0, pm7:5, pm8:5, pm9:3,
           pm10:3, pm11:0, pm12:5, pm13:0, pm14:1, pm15:1, pm16:0, pm17:0, pm18:0 },
    checkins: { 2: { availPts: 10, refScore: 44 } },
    priorities: [
      { label: 'PM#13 — CC clause in all PBCRG tender documents',
        pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to all PBCRG procurement documents. Template from LoCAL focal point.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the National Development Strategy 2016–2035. Western already references the NCCP (PM#4c) — the NDS reference is the same approach.' },
      { label: 'PM#10 — Vulnerable group targeting in ACCAF',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'All provinces scored 3/5 last APA. The remaining 2 pts require explicit naming of vulnerable beneficiaries (women, youth, people with disability) in ACCAF Columns I, J, V, and W — with a note on how each project addresses their specific CC exposure.' },
    ],
  },

  choiseul: {
    name: 'Choiseul', code: 'CP', ps: '[PS Name — Choiseul]',
    score: 33,
    pms: { pm1:2, pm2:0, pm3:3, pm4:2, pm5:3, pm6:0, pm7:5, pm8:5, pm9:4,
           pm10:3, pm11:0, pm12:5, pm13:1, pm14:0, pm15:0, pm16:0, pm17:0, pm18:0 },
    checkins: { 2: { availPts: 10, refScore: 43 } },
    priorities: [
      { label: 'PM#13 — CC clause in all PBCRG tender documents (4 pts gap)',
        pts: 4, timing: 'Before 31 March',
        action: 'Choiseul scored 1/5 last APA — some CC language already in some tenders. Apply the standard clause consistently to all PBCRG contracts to close the remaining gap. Template from LoCAL focal point.' },
      { label: 'PM#5c — Priority statements used in project selection',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'ACCAF LALAP priority statements must be explicitly referenced in the justification for each selected project in the annual plan. The statements exist — they need to be cited in the plan text.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the National Development Strategy 2016–2035. Standard citation from LoCAL focal point. Note: Choiseul's PM#9 (4/5) is the second-best in the system — that strength should be protected this year.' },
    ],
  },

  malaita: {
    name: 'Malaita', code: 'MP', ps: '[PS Name — Malaita]',
    score: 34,
    pms: { pm1:2, pm2:3, pm3:3, pm4:4, pm5:5, pm6:0, pm7:5, pm8:2, pm9:0,
           pm10:3, pm11:0, pm12:5, pm13:0, pm14:1, pm15:1, pm16:0, pm17:0, pm18:0 },
    checkins: { 2: { availPts: 10, refScore: 44 } },
    priorities: [
      { label: 'PM#9 — Provincial Engineer design sign-off',
        pts: 5, timing: 'Before 31 March',
        action: 'Entire PM missed last APA. Provincial Engineer must sign off all PBCRG infrastructure designs confirming CC risks considered, and add a written note on standards applied. One page per project is sufficient.' },
      { label: 'PM#13 — CC clause in all PBCRG tender documents',
        pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to all PBCRG procurement documents. Template from LoCAL focal point.' },
      { label: 'PM#8b — CC-proofing cost estimates in ACCAF Cols AD–AG',
        pts: 3, timing: 'Planning season (Nov–Jan)',
        action: 'Malaita is the only province that missed PM#8b. Add cost estimates for CC-proofing elements to ACCAF Columns AD–AG for every PBCRG project. Contact LoCAL focal point for an ACCAF session — this is a one-day fix.' },
    ],
  },

  'central-islands': {
    name: 'Central Islands', code: 'CIP', ps: '[PS Name — Central Islands]',
    score: 33,
    pms: { pm1:2, pm2:3, pm3:3, pm4:2, pm5:5, pm6:0, pm7:5, pm8:5, pm9:0,
           pm10:3, pm11:0, pm12:5, pm13:0, pm14:0, pm15:0, pm16:0, pm17:0, pm18:0 },
    checkins: { 2: { availPts: 10, refScore: 43 } },
    priorities: [
      { label: 'PM#9 — Provincial Engineer design sign-off',
        pts: 5, timing: 'Before 31 March',
        action: 'Entire PM missed last APA (same gap in Temotu and Malaita). Provincial Engineer must review all PBCRG designs and add a signed note per project confirming CC risks considered.' },
      { label: 'PM#13 — CC clause in all PBCRG tender documents',
        pts: 5, timing: 'Before 31 March',
        action: 'Add standard CC clause to all PBCRG procurement documents. Template from LoCAL focal point.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the National Development Strategy 2016–2035. Standard citation from LoCAL focal point.' },
    ],
  },

  isabel: {
    name: 'Isabel', code: 'IP', ps: '[PS Name — Isabel]',
    score: 35,
    pms: { pm1:0, pm2:0, pm3:3, pm4:2, pm5:5, pm6:0, pm7:5, pm8:5, pm9:3,
           pm10:3, pm11:0, pm12:5, pm13:3, pm14:0, pm15:1, pm16:0, pm17:0, pm18:0 },
    checkins: { 2: { availPts: 10, refScore: 45 } },
    priorities: [
      { label: 'PM#13 — CC clause in remaining PBCRG tender documents (2 pts gap)',
        pts: 2, timing: 'Before 31 March',
        action: 'Isabel scored 3/5 last APA — some tenders already include the CC clause. Apply it consistently to all remaining PBCRG contracts.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the National Development Strategy 2016–2035. Standard citation from LoCAL focal point.' },
      { label: 'PM#4c — National Climate Change Policy reference',
        pts: 1, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per project referencing the NCCP — same approach as the NDS reference. These two fixes together are worth 3 pts and take minutes.' },
    ],
  },

  'makira-ulawa': {
    name: 'Makira-Ulawa', code: 'MUP', ps: '[PS Name — Makira-Ulawa]',
    score: 39,
    pms: { pm1:3, pm2:3, pm3:3, pm4:2, pm5:5, pm6:0, pm7:5, pm8:5, pm9:2,
           pm10:3, pm11:0, pm12:5, pm13:3, pm14:0, pm15:0, pm16:0, pm17:0, pm18:0 },
    checkins: { 2: { availPts: 10, refScore: 49 } },
    priorities: [
      { label: 'PM#13 — CC clause in remaining PBCRG tender documents (2 pts gap)',
        pts: 2, timing: 'Before 31 March',
        action: 'Makira-Ulawa scored 3/5 last APA. Apply the standard CC clause to all remaining PBCRG contracts to close the gap.' },
      { label: 'PM#9b — Written design records for all PBCRG infrastructure',
        pts: 2, timing: 'Before 31 March',
        action: 'PM#9a (engineer sign-off) was partially done. PM#9b requires a written note per project recording the design standards applied and how resilience was incorporated — one page is sufficient.' },
      { label: 'PM#4b — NDS 2016–2035 reference in plan text',
        pts: 2, timing: 'Planning season (Nov–Jan)',
        action: 'One sentence per PBCRG project referencing the National Development Strategy 2016–2035. Standard citation from LoCAL focal point.' },
    ],
  },

};

// ── PM definitions (for display labels) ──────────────────────
const PM_LABELS = {
  pm14: { label: 'PM#14 — Staff CC awareness', max: 5 },
  pm15: { label: 'PM#15 — Community CC awareness', max: 5 },
};

// ── Check-in content ──────────────────────────────────────────
// Note: scores reset each year. availPts = full marks for these PMs.
// All guidance is framed as "what evidence earns this PM" not "close last year's gap".

const CHECKINS = {

  2: {
    month: 'June 2026',
    topic: 'CC awareness sessions',
    pms:   'PM#14 + PM#15',
    weeksToAPA: 8,

    question: (p) =>
      `Has ${p.name} Province held at least one climate change awareness session this fiscal year — for PG staff or for communities?`,

    options: [
      { value: 'both',      label: 'Both — staff session and community session done' },
      { value: 'staff',     label: 'Staff session only' },
      { value: 'community', label: 'Community session only' },
      { value: 'none',      label: 'Not yet this fiscal year' },
    ],

    followup: {
      condition: 'both',
      contextLabel: (p) => `${p.name} has completed both sessions`,
      question: 'One more question: are the required records — signed attendance list, written agenda, and a summary note — filed and ready for the assessor for each session?',
      options: [
        { value: 'yes', label: '✓ Yes, records filed for both sessions' },
        { value: 'no',  label: '✗ Not all records filed yet' },
      ],
    },

    responses: {

      'both+yes': {
        iconType: 'ok', icon: '✓',
        headline: 'Both sessions done and documented',
        body: (p, ci) =>
          `PM#14 requires a documented training of PG staff on climate change adaptation. ` +
          `PM#15 requires documented meetings with WDC members or community leaders covering CC risks. ` +
          `${p.name} has completed both and has the records in order — the assessor will check for exactly these documents. ` +
          `One additional point to verify: PM#15 attendance records should show disaggregated participation by sex and, where possible, youth. ` +
          `If the current records do not capture this, supplement with a short note on who attended before the APA visit.`,
        reminders: () => sessionDocReminders('both_filed'),
      },

      'both+no': {
        iconType: 'warn', icon: '!',
        headline: 'Sessions done — documentation still needed',
        body: (p, ci) =>
          `${p.name} has held both sessions — that is the activity requirement for PM#14 and PM#15. ` +
          `To earn these points, the assessor also needs: (1) a signed attendance list, (2) a written agenda or programme, and (3) a brief summary or minutes — for each session separately. ` +
          `Filing these now rather than the week before the APA avoids last-minute gaps. ` +
          `For PM#15 specifically, attendance records should show disaggregated participation (women, youth) — a brief note on who attended is sufficient.`,
        reminders: () => sessionDocReminders('both_undoc'),
      },

      'staff': {
        iconType: 'warn', icon: '→',
        headline: 'Staff session done — community session needed for PM#15',
        body: (p, ci) =>
          `PM#14 (5 pts) requires documented training of PG staff on CC adaptation — your staff session covers this, assuming records are filed. ` +
          `PM#15 (5 pts) requires a separate documented meeting with WDC members or community leaders on CC risks. ` +
          `A standalone event is not required: any WDC meeting that includes climate topics on the agenda qualifies. ` +
          `Check if a WDC meeting is scheduled in the next few weeks and add CC to the agenda. ` +
          `Both PMs require: signed attendance list, written agenda, brief summary or minutes.`,
        reminders: () => sessionDocReminders('staff_only'),
      },

      'community': {
        iconType: 'warn', icon: '→',
        headline: 'Community session done — staff session needed for PM#14',
        body: (p, ci) =>
          `PM#15 (5 pts) requires documented meetings with WDC members or community leaders on CC — your community session covers this, assuming records are filed. ` +
          `PM#14 (5 pts) requires a separate documented training with PG staff on CC adaptation. ` +
          `This is typically a half-day internal session — all relevant staff should attend and sign in. ` +
          `Contact your CCARRO or LoCAL focal point to arrange this before August. ` +
          `Both PMs require: signed attendance list, written agenda, brief summary or minutes.`,
        reminders: () => sessionDocReminders('community_only'),
      },

      'none': {
        iconType: 'alert', icon: '!',
        headline: 'Eight weeks — still achievable with both sessions',
        body: (p, ci) =>
          `PM#14 requires documented training with PG staff on CC adaptation. ` +
          `PM#15 requires documented meetings with WDC members or community leaders on CC risks. ` +
          `Together they are worth up to 10 points. ` +
          `The APA window opens in approximately 8 weeks — enough time to hold and document both, if started this month. ` +
          `A combined half-day event can cover both PMs in one session. ` +
          `Contact LoCAL focal point this week to confirm a date — they can provide a facilitator and session materials.`,
        reminders: () => sessionDocReminders('none'),
      },

    },
  },

};

// ── Session reminder sets ─────────────────────────────────────

function sessionDocReminders(state) {
  const base = [
    {
      type: 'pm', label: 'PM#14 · 5 pts — What it takes',
      text: 'One documented training session with PG staff on CC adaptation. Required evidence: (1) signed attendance list of staff present, (2) written agenda or programme explicitly mentioning CC/adaptation, (3) brief summary or minutes of what was covered. A half-day session earns full marks.',
    },
    {
      type: 'pm', label: 'PM#15 · 5 pts — What it takes',
      text: 'One documented meeting with WDC members or community leaders covering CC risks and adaptation. Required evidence: (1) signed attendance list disaggregated by sex/youth where possible, (2) meeting agenda including a CC agenda item, (3) brief summary or minutes. A WDC meeting that includes CC on the agenda counts — no separate event needed.',
    },
    {
      type: 'tip', label: 'Filing tip',
      text: 'Keep evidence for each session in a separate labelled folder: one for the staff session, one for the community session. Label them "PM#14 — [date]" and "PM#15 — [date]". The assessor will look for both.',
    },
  ];

  if (state === 'staff_only') {
    base.push({
      type: 'tip', label: 'Quickest path for PM#15',
      text: 'Check if a WDC meeting is already on the calendar. Add CC adaptation to the agenda, take disaggregated attendance, and write a one-page summary. That is PM#15 with no additional convening cost.',
    });
  }
  if (state === 'community_only') {
    base.push({
      type: 'tip', label: 'Quickest path for PM#14',
      text: 'A half-day internal briefing with PG staff is sufficient. Ask your CCARRO to facilitate — MECDM can often provide a presenter at short notice if needed.',
    });
  }
  if (state === 'none') {
    base.push({
      type: 'tip', label: 'Combined session option',
      text: 'A combined half-day event — morning for staff, afternoon community session with WDC members — covers both PM#14 and PM#15 in one day. Ensure you take separate attendance sheets for each part.',
    });
  }

  base.push({
    type: 'deadline', label: 'APA deadline',
    text: 'All session evidence must be filed before the assessor\'s visit (target: August). The assessor reviews documents on-site — records submitted after the visit cannot be accepted.',
  });

  return base;
}

// ── Helpers ───────────────────────────────────────────────────

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function show(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(screenId);
  if (el) el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderContact(containerId) {
  document.getElementById(containerId).innerHTML =
    `<strong>${FOCAL_POINT.name}</strong><br>` +
    `<a href="mailto:${FOCAL_POINT.email}">${FOCAL_POINT.email}</a>` +
    (FOCAL_POINT.phone ? ` · ${FOCAL_POINT.phone}` : '');
}

// ── Logging (fire-and-forget, no-cors) ───────────────────────

function logResponse(province, ciNum, ciData, responseKey, followupVal) {
  if (!WEBHOOK_URL || WEBHOOK_URL.startsWith('PASTE_')) return;

  // Infer PM14/PM15 status from response for analytics
  const pm14status =
    responseKey.startsWith('both') || responseKey === 'staff' ? 'in_progress' :
    responseKey === 'community' ? 'not_started' : 'not_started';
  const pm15status =
    responseKey.startsWith('both') || responseKey === 'community' ? 'in_progress' :
    responseKey === 'staff' ? 'not_started' : 'not_started';
  const docsReady = responseKey === 'both+yes' ? 'yes' : responseKey === 'both+no' ? 'no' : 'n/a';

  fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      timestamp:    new Date().toISOString(),
      province:     province.name,
      provinceCode: province.code,
      checkin:      ciNum,
      refScore:     province.score,
      answer:       responseKey.split('+')[0],
      followup:     followupVal || '',
      responseKey,
      availPts:     ciData.availPts,
      refScoreWithCI: ciData.refScore,
      pm14_status:  pm14status,
      pm15_status:  pm15status,
      docs_ready:   docsReady,
    }),
  }).catch(() => {});
}

// ── Render helpers ────────────────────────────────────────────

function renderReminders(containerId, reminders) {
  const container = document.getElementById(containerId);
  if (!reminders || reminders.length === 0) { container.innerHTML = ''; return; }
  container.innerHTML = reminders.map(r => `
    <div class="reminder ${r.type}">
      <div class="reminder-label">${r.label}</div>
      <div class="reminder-text">${r.text}</div>
    </div>
  `).join('');
}

function renderPriorities(containerId, priorities) {
  const container = document.getElementById(containerId);
  if (!priorities || priorities.length === 0) { container.innerHTML = ''; return; }
  container.innerHTML = priorities.map(p => `
    <div class="priority-item">
      <div class="priority-header">
        <span class="priority-label">${p.label}</span>
        <span class="priority-pts">+${p.pts} pts</span>
      </div>
      <div class="priority-timing">${p.timing}</div>
      <div class="priority-action">${p.action}</div>
    </div>
  `).join('');
}

function renderOptions(containerId, options, onSelect) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt.label;
    btn.setAttribute('type', 'button');
    btn.addEventListener('click', () => {
      container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      setTimeout(() => onSelect(opt.value), 220);
    });
    container.appendChild(btn);
  });
}

// ── Main flow ─────────────────────────────────────────────────

function init() {
  const provinceKey = (getParam('p') || '').toLowerCase();
  const ciNum       = parseInt(getParam('c') || '0', 10);
  const province    = PROVINCES[provinceKey];
  const checkin     = CHECKINS[ciNum];

  if (!province || !checkin || !province.checkins[ciNum]) {
    renderContact('error-contact');
    show('screen-error');
    return;
  }

  const ciData  = province.checkins[ciNum];
  const eyebrow = `LoCAL Solomon Islands · ${checkin.month} check-in`;

  // Screen 1 — Question
  document.getElementById('q-eyebrow').textContent   = eyebrow;
  document.getElementById('q-province').textContent  = province.name + ' Province';
  document.getElementById('q-subhead').textContent   = checkin.topic + ' · ' + checkin.pms;
  document.getElementById('q-ref-score').textContent = province.score + ' pts';
  document.getElementById('q-avail').textContent     = '+' + ciData.availPts + ' pts';
  document.getElementById('q-ref-label').textContent = 'last APA reference';
  document.getElementById('q-question').textContent  = checkin.question(province);
  document.getElementById('q-meta').textContent      =
    `APA window opens in ~${checkin.weeksToAPA} weeks · 1–2 questions · ~30 seconds · all scores reset each APA`;

  renderOptions('q-options', checkin.options, (answer) => {
    if (checkin.followup && answer === checkin.followup.condition) {
      showFollowup(province, ciNum, ciData, checkin, answer);
    } else {
      showResult(province, ciNum, ciData, checkin, answer, null);
    }
  });

  show('screen-question');
}

// ── Screen 2 — Follow-up ──────────────────────────────────────

function showFollowup(province, ciNum, ciData, checkin, firstAnswer) {
  const fu = checkin.followup;
  document.getElementById('f-eyebrow').textContent  = `LoCAL Solomon Islands · ${checkin.month} check-in`;
  document.getElementById('f-province').textContent = province.name + ' Province';
  document.getElementById('f-context').textContent  = fu.contextLabel(province);
  document.getElementById('f-question').textContent = fu.question;
  renderOptions('f-options', fu.options, (followupAnswer) => {
    showResult(province, ciNum, ciData, checkin, firstAnswer, followupAnswer);
  });
  show('screen-followup');
}

// ── Screen 3 — Result ─────────────────────────────────────────

function showResult(province, ciNum, ciData, checkin, answer, followupAnswer) {
  const responseKey = followupAnswer ? `${answer}+${followupAnswer}` : answer;
  const response    = checkin.responses[responseKey];

  if (!response) { show('screen-error'); return; }

  logResponse(province, ciNum, ciData, responseKey, followupAnswer);

  // Header colour
  const header = document.getElementById('r-header');
  header.style.background =
    response.iconType === 'ok'    ? '#2E7D32' :
    response.iconType === 'warn'  ? '#E65100' : '#B71C1C';

  document.getElementById('r-eyebrow').textContent  = `LoCAL Solomon Islands · ${checkin.month}`;
  const iconEl = document.getElementById('r-icon');
  iconEl.textContent = response.icon;
  iconEl.className   = `result-icon ${response.iconType}`;
  document.getElementById('r-headline').textContent = response.headline;

  // Score context
  document.getElementById('r-score-before').textContent = province.score + ' pts';
  document.getElementById('r-score-after').textContent  = ciData.refScore + ' pts';
  document.getElementById('r-avail-pts').textContent    = '+' + ciData.availPts;

  // Body
  document.getElementById('r-body').textContent =
    typeof response.body === 'function' ? response.body(province, ciData) : response.body;

  // This check-in reminders
  const reminders = typeof response.reminders === 'function'
    ? response.reminders(province, ciData) : (response.reminders || []);
  renderReminders('r-reminders', reminders);

  // Province-wide priorities
  renderPriorities('r-priorities', province.priorities);

  renderContact('r-contact');
  show('screen-result');
}

// ── Boot ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  show('screen-loading');
  setTimeout(init, 100);
});
