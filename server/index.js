'use strict';
const express    = require('express');
const cors       = require('cors');
const Database   = require('better-sqlite3');
const path       = require('path');
const { execSync } = require('child_process');

const SHEET_ID = '1hxwfZBxPJxK8Xa8fn8-4Rm8iAySLUOKE2mFPBZhzHMw';

function syncToSheet(row) {
  try {
    const values = JSON.stringify([[
      new Date().toISOString(),
      row.province_name,
      row.province_code,
      row.checkin_id,
      row.trigger_month,
      row.answer_value,
      row.followup_value || '',
      row.submitted_at,
    ]]);
    execSync(
      `gws sheets spreadsheets values append ` +
      `--params '{"spreadsheetId":"${SHEET_ID}","range":"Submissions!A1","valueInputOption":"RAW"}' ` +
      `--json '{"majorDimension":"ROWS","values":${values}}'`,
      { timeout: 10000 }
    );
  } catch (e) {
    console.error('Sheet sync failed (submission still saved):', e.message);
  }
}

const db  = new Database(path.join(__dirname, 'local.db'));
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// ── Province list ────────────────────────────────────────────
app.get('/api/provinces', (req, res) => {
  res.json(db.prepare('SELECT * FROM provinces ORDER BY current_score DESC').all());
});

// ── Single province + all sub-scores ─────────────────────────
app.get('/api/province/:id', (req, res) => {
  const province = db.prepare('SELECT * FROM provinces WHERE id = ?').get(req.params.id);
  if (!province) return res.status(404).json({ error: 'Province not found' });

  const scores = db.prepare(`
    SELECT ps.sub_indicator, ps.score, si.label, si.max_score, si.pm_number
    FROM province_scores ps
    JOIN sub_indicators si ON si.id = ps.sub_indicator
    WHERE ps.province_id = ?
    ORDER BY si.pm_number, ps.sub_indicator
  `).all(req.params.id);

  const pmTotals = db.prepare(`
    SELECT si.pm_number, SUM(ps.score) as score, SUM(si.max_score) as max_score
    FROM province_scores ps
    JOIN sub_indicators si ON si.id = ps.sub_indicator
    WHERE ps.province_id = ?
    GROUP BY si.pm_number
  `).all(req.params.id);

  res.json({ ...province, sub_scores: scores, pm_totals: pmTotals });
});

// ── Check-in + its options + PMs covered ─────────────────────
app.get('/api/checkin/:id', (req, res) => {
  const checkin = db.prepare('SELECT * FROM checkins WHERE id = ?').get(req.params.id);
  if (!checkin) return res.status(404).json({ error: 'Check-in not found' });

  const options = db.prepare(
    'SELECT * FROM checkin_options WHERE checkin_id = ? ORDER BY sort_order'
  ).all(req.params.id);

  const pms = db.prepare(`
    SELECT p.pm_number, p.label, p.max_score, p.theme, p.theme_name, p.notes
    FROM checkin_pms cp JOIN pms p ON p.pm_number = cp.pm_number
    WHERE cp.checkin_id = ?
  `).all(req.params.id);

  res.json({ ...checkin, options, pms });
});

// ── Province gaps for a specific check-in ────────────────────
app.get('/api/gaps/:province_id/:checkin_id', (req, res) => {
  const { province_id, checkin_id } = req.params;

  const pms = db.prepare(`
    SELECT p.pm_number, p.label, p.max_score, p.theme_name,
           COALESCE(SUM(ps.score), 0) as scored,
           p.max_score - COALESCE(SUM(ps.score), 0) as gap
    FROM checkin_pms cp
    JOIN pms p ON p.pm_number = cp.pm_number
    LEFT JOIN sub_indicators si ON si.pm_number = p.pm_number
    LEFT JOIN province_scores ps ON ps.sub_indicator = si.id AND ps.province_id = ?
    WHERE cp.checkin_id = ?
    GROUP BY p.pm_number
    ORDER BY gap DESC
  `).all(province_id, checkin_id);

  const subs = db.prepare(`
    SELECT si.id, si.pm_number, si.label, si.max_score, ps.score,
           si.max_score - ps.score as gap
    FROM checkin_pms cp
    JOIN sub_indicators si ON si.pm_number = cp.pm_number
    LEFT JOIN province_scores ps ON ps.sub_indicator = si.id AND ps.province_id = ?
    WHERE cp.checkin_id = ?
    ORDER BY si.pm_number, si.id
  `).all(province_id, checkin_id);

  res.json({ pms, sub_indicators: subs });
});

// ── Log submission ────────────────────────────────────────────
app.post('/api/submit', (req, res) => {
  const { province_id, checkin_id, answer_value, followup_value } = req.body;
  if (!province_id || !checkin_id || !answer_value)
    return res.status(400).json({ error: 'Missing required fields' });

  db.prepare(`
    INSERT INTO submissions (province_id, checkin_id, answer_value, followup_value)
    VALUES (?, ?, ?, ?)
  `).run(province_id, checkin_id, answer_value, followup_value || null);

  // Sync to Google Sheet (async — don't block the response)
  const province = db.prepare('SELECT name, code FROM provinces WHERE id = ?').get(province_id);
  const checkin  = db.prepare('SELECT trigger_month FROM checkins WHERE id = ?').get(checkin_id);
  setImmediate(() => syncToSheet({
    province_name:  province ? province.name : province_id,
    province_code:  province ? province.code : '',
    checkin_id,
    trigger_month:  checkin ? checkin.trigger_month : '',
    answer_value,
    followup_value,
    submitted_at:   new Date().toISOString(),
  }));

  res.json({ ok: true });
});

// ── Province status — what's done, what's outstanding ─────────
// A check-in is "complete" when the province gave a positive answer.
// Completion conditions per check-in:
//   1 → answer=YES  followup=YES
//   2 → answer=BOTH followup=YES
//   3 → answer=YES  followup=YES
//   4 → always complete (reminder only)
//   5 → answer=YES  followup=YES
//   6 → answer=BOTH followup=YES
//   7 → answer=YES_ALL followup=YES
//   8 → answer=SUBMITTED
//   9 → answer=OVER_75 followup=YES
const COMPLETE = {
  1: (a,f) => a==='YES'     && f==='YES',
  2: (a,f) => a==='BOTH'    && f==='YES',
  3: (a,f) => a==='YES'     && f==='YES',
  4: ()    => true,
  5: (a,f) => a==='YES'     && f==='YES',
  6: (a,f) => a==='BOTH'    && f==='YES',
  7: (a,f) => a==='YES_ALL' && f==='YES',
  8: (a)   => a==='SUBMITTED',
  9: (a,f) => a==='OVER_75' && f==='YES',
};

app.get('/api/status/:province_id', (req, res) => {
  const subs = db.prepare(`
    SELECT s.checkin_id, s.answer_value, s.followup_value, s.submitted_at
    FROM submissions s
    WHERE s.province_id = ?
    ORDER BY s.submitted_at DESC
  `).all(req.params.province_id);

  // Most recent answer per check-in
  const latest = {};
  subs.forEach(s => { if (!latest[s.checkin_id]) latest[s.checkin_id] = s; });

  const checkins = db.prepare('SELECT * FROM checkins ORDER BY id').all();
  const result = checkins.map(ci => {
    const sub  = latest[ci.id];
    const done = sub
      ? (COMPLETE[ci.id] || (() => false))(sub.answer_value, sub.followup_value)
      : false;
    return {
      checkin_id:    ci.id,
      trigger_month: ci.trigger_month,
      type:          ci.type,
      done,
      last_answer:   sub ? sub.answer_value  : null,
      last_followup: sub ? sub.followup_value : null,
      answered_at:   sub ? sub.submitted_at   : null,
    };
  });

  res.json(result);
});

// ── All submissions (admin) ───────────────────────────────────
app.get('/api/submissions', (req, res) => {
  res.json(db.prepare(`
    SELECT s.*, p.name as province_name, c.trigger_month
    FROM submissions s
    JOIN provinces p ON p.id = s.province_id
    JOIN checkins c ON c.id = s.checkin_id
    ORDER BY s.submitted_at DESC
  `).all());
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
