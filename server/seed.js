'use strict';
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database(path.join(__dirname, 'local.db'));
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

const run = db.transaction(() => {

  // ── Provinces ───────────────────────────────────────────────
  const insertProvince = db.prepare(`
    INSERT OR REPLACE INTO provinces (id, name, code, ps_name, current_score, exp_weight)
    VALUES (@id, @name, @code, @ps_name, @current_score, @exp_weight)`);

  const provinces = [
    { id: 'guadalcanal',    name: 'Guadalcanal',       code: 'GP',  ps_name: null, current_score: 37, exp_weight: 1369 },
    { id: 'temotu',         name: 'Temotu',             code: 'TP',  ps_name: null, current_score: 33, exp_weight: 1089 },
    { id: 'rennell-bellona',name: 'Rennell & Bellona',  code: 'RBP', ps_name: null, current_score: 24, exp_weight: 576  },
    { id: 'western',        name: 'Western',            code: 'WP',  ps_name: null, current_score: 34, exp_weight: 1156 },
    { id: 'choiseul',       name: 'Choiseul',           code: 'CP',  ps_name: null, current_score: 33, exp_weight: 1089 },
    { id: 'malaita',        name: 'Malaita',            code: 'MP',  ps_name: null, current_score: 34, exp_weight: 1156 },
    { id: 'central-islands',name: 'Central Islands',    code: 'CIP', ps_name: null, current_score: 33, exp_weight: 1089 },
    { id: 'isabel',         name: 'Isabel',             code: 'IP',  ps_name: null, current_score: 35, exp_weight: 1225 },
    { id: 'makira-ulawa',   name: 'Makira & Ulawa',     code: 'MUP', ps_name: null, current_score: 39, exp_weight: 1521 },
  ];
  provinces.forEach(p => insertProvince.run(p));

  // ── PM Definitions ──────────────────────────────────────────
  const insertPM = db.prepare(`
    INSERT OR REPLACE INTO pms (pm_number, theme, theme_name, label, max_score, notes)
    VALUES (@pm_number, @theme, @theme_name, @label, @max_score, @notes)`);

  const pms = [
    { pm_number: 1,  theme: 'A', theme_name: 'Data & Pre-Planning',          label: 'Meteorological data',                      max_score: 5,  notes: 'GP only province with full 5/5. WP, RBP, IP scored 0.' },
    { pm_number: 2,  theme: 'A', theme_name: 'Data & Pre-Planning',          label: 'Climate Risk Assessment',                  max_score: 5,  notes: 'PM#2b (CRA informing planning) near-universal gap — only GP achieved it.' },
    { pm_number: 3,  theme: 'B', theme_name: 'Climate Change Planning',      label: 'Involvement in CC-related planning',        max_score: 5,  notes: 'PM#3b (vulnerable groups) universal gap — all 9 provinces scored 0.' },
    { pm_number: 4,  theme: 'B', theme_name: 'Climate Change Planning',      label: 'Mainstreaming CC in annual plans',          max_score: 5,  notes: 'PM#4b: only TP+MP scored. PM#4c: only WP scored. Document-writing gap.' },
    { pm_number: 5,  theme: 'B', theme_name: 'Climate Change Planning',      label: 'Adaptation priority statements',            max_score: 5,  notes: 'PM#5b: GP only province missing. PM#5c: RBP and CP missing.' },
    { pm_number: 6,  theme: 'B', theme_name: 'Climate Change Planning',      label: 'Linkage between CRA and rolling plan',      max_score: 5,  notes: 'Universal 0. Requires full CRA covering non-PBCRG projects — stretch goal.' },
    { pm_number: 7,  theme: 'B', theme_name: 'Climate Change Planning',      label: 'Project rationale',                        max_score: 5,  notes: 'Fully achieved system-wide — all 9 provinces 5/5. No longer a gap.' },
    { pm_number: 8,  theme: 'B', theme_name: 'Climate Change Planning',      label: 'CC profiles and project descriptions',      max_score: 5,  notes: 'PM#8b: only Malaita missed (0/3). Near-fully resolved system-wide.' },
    { pm_number: 9,  theme: 'B', theme_name: 'Climate Change Planning',      label: 'Screening of projects',                    max_score: 5,  notes: 'TP, MP, CIP all 0/5. WP, CP best performers. Provincial Engineer engagement critical.' },
    { pm_number: 10, theme: 'C', theme_name: 'Targeting of Investments',     label: 'Targeting vulnerable groups',              max_score: 5,  notes: 'All 9 provinces 3/5 — partial. Explicit naming by category needed in ACCAF.' },
    { pm_number: 11, theme: 'C', theme_name: 'Targeting of Investments',     label: 'CC in overall development budget',         max_score: 5,  notes: 'Universal 0. Requires CC lens on full PG budget, not just PBCRG. Stretch goal.' },
    { pm_number: 12, theme: 'D', theme_name: 'Human Resources',              label: 'CC Focal Point (CCARRO)',                  max_score: 5,  notes: 'RBP only province without a designated CCARRO — critical structural block.' },
    { pm_number: 13, theme: 'E', theme_name: 'Procurement',                  label: 'CC clause in all PBCRG tender documents',  max_score: 5,  notes: 'IP=3, MUP=3, CP=1. Six provinces at 0. Template clause fix — one-off admin task.' },
    { pm_number: 14, theme: 'F', theme_name: 'Climate Change Awareness',     label: 'Staff CC awareness session',               max_score: 5,  notes: 'WP=1, MP=1, all others 0. Single documented half-day session = full marks.' },
    { pm_number: 15, theme: 'F', theme_name: 'Climate Change Awareness',     label: 'Community CC meetings with records',       max_score: 5,  notes: 'All partial or 0. WDC meetings already happening qualify if properly recorded.' },
    { pm_number: 16, theme: 'G', theme_name: 'Accountability & Reporting',   label: 'Quarterly PBCRG utilisation reports',      max_score: 7,  notes: 'Activates once PBCRG grants disbursed. All currently 0.' },
    { pm_number: 17, theme: 'H', theme_name: 'Targeting & Use of Funds',     label: 'PBCRG utilisation level',                  max_score: 10, notes: 'Activates once PBCRG grants disbursed. Proportional to absorption rate.' },
    { pm_number: 18, theme: 'H', theme_name: 'Targeting & Use of Funds',     label: 'PBCRG execution as planned',               max_score: 8,  notes: 'Activates once PBCRG grants disbursed. Proportional to delivery.' },
  ];
  pms.forEach(p => insertPM.run(p));

  // ── Sub-indicators ──────────────────────────────────────────
  const insertSub = db.prepare(`
    INSERT OR REPLACE INTO sub_indicators (id, pm_number, label, max_score)
    VALUES (@id, @pm_number, @label, @max_score)`);

  const subs = [
    { id: '1a',  pm_number: 1,  label: 'Temperature and rainfall data ≥10 yrs in PG database',                                       max_score: 2 },
    { id: '1b',  pm_number: 1,  label: 'Additional hazard data (flood, landslide, wind, SLR) ≥10 yrs in PG database',                max_score: 1 },
    { id: '1c',  pm_number: 1,  label: 'PG analysis of temperature and rainfall trends (charts or tables)',                           max_score: 1 },
    { id: '1d',  pm_number: 1,  label: 'PG analysis of flood, landslide, wind, sea level rise trends',                               max_score: 1 },
    { id: '2a',  pm_number: 2,  label: 'Vulnerability and exposure data collected or reviewed (SIIVA, iPLAN, or equivalent)',         max_score: 3 },
    { id: '2b',  pm_number: 2,  label: 'CRA exists and used to inform planning and budgeting — updated annually',                     max_score: 2 },
    { id: '3a',  pm_number: 3,  label: 'CC discussed with citizens in planning process (records of meetings)',                        max_score: 1 },
    { id: '3b',  pm_number: 3,  label: 'CC discussed specifically with vulnerable groups (women, youth, people with disability)',     max_score: 2 },
    { id: '3c',  pm_number: 3,  label: 'CC risks in vulnerable sectors discussed with citizens',                                     max_score: 2 },
    { id: '4a',  pm_number: 4,  label: 'CC interventions mainstreamed in rolling 3-year plan using CRA or climate evidence',         max_score: 2 },
    { id: '4b',  pm_number: 4,  label: 'Plan explicitly links to National Development Strategy 2016–2035',                           max_score: 2 },
    { id: '4c',  pm_number: 4,  label: 'Plan consistent with National Climate Change Policy',                                        max_score: 1 },
    { id: '5a',  pm_number: 5,  label: '3–5 adaptation priority statements in ACCAF (LALAP tab)',                                    max_score: 1 },
    { id: '5b',  pm_number: 5,  label: 'Priority statements underpinned by CRA data or PM#1 climate data',                          max_score: 2 },
    { id: '5c',  pm_number: 5,  label: 'Priority statements used to justify project selection in annual plan',                       max_score: 2 },
    { id: '6',   pm_number: 6,  label: 'Documented links between CRA and project selection across ALL funding sources',              max_score: 5 },
    { id: '7a',  pm_number: 7,  label: 'Adaptation rationale in ACCAF Column J for every PBCRG project',                            max_score: 3 },
    { id: '7b',  pm_number: 7,  label: 'Adaptation outcome/output indicators in ACCAF Columns L–W for every project',               max_score: 2 },
    { id: '8a',  pm_number: 8,  label: 'ACCAF Columns I–S completed for all PBCRG projects (narrative, rationale)',                 max_score: 2 },
    { id: '8b',  pm_number: 8,  label: 'Additional CC-proofing costs in ACCAF Columns AD–AG for all projects',                      max_score: 3 },
    { id: '9a',  pm_number: 9,  label: 'Provincial Engineer signed off all PBCRG design reports certifying CC risk consideration',   max_score: 3 },
    { id: '9b',  pm_number: 9,  label: 'Design issues, standards, and resilience recorded in writing per project',                   max_score: 2 },
    { id: '10',  pm_number: 10, label: 'ACCAF Cols I, J, V, W explicitly identify vulnerable beneficiaries and CC exposure link',   max_score: 5 },
    { id: '11',  pm_number: 11, label: 'CC outcomes in overall PG development budget (non-PBCRG projects identified with CC narrative)', max_score: 5 },
    { id: '12',  pm_number: 12, label: 'Named CCARRO with written task description referencing LoCAL and confirmed budget line',    max_score: 5 },
    { id: '13',  pm_number: 13, label: 'CC considerations clause in all PBCRG procurement/tender documents (partial scoring allowed)', max_score: 5 },
    { id: '14',  pm_number: 14, label: 'Documented training of PG staff on CC adaptation (sign-in sheet, agenda, summary)',         max_score: 5 },
    { id: '15',  pm_number: 15, label: 'Documented meetings with WDCs and community leaders on CC adaptation (disaggregated records)', max_score: 5 },
    { id: '16',  pm_number: 16, label: 'All four quarterly PBCRG utilisation reports submitted on time via ACCAF Cols X–AM',        max_score: 7 },
    { id: '17',  pm_number: 17, label: 'PBCRG funds spent to deliver CC outputs — proportional to absorption rate',                 max_score: 10 },
    { id: '18',  pm_number: 18, label: 'PBCRG CC projects completed as planned in the rolling 3-year plan and budget',             max_score: 8 },
  ];
  subs.forEach(s => insertSub.run(s));

  // ── Province sub-indicator scores (FY 2024/25 APA) ──────────
  const insertScore = db.prepare(`
    INSERT OR REPLACE INTO province_scores (province_id, sub_indicator, score)
    VALUES (@province_id, @sub_indicator, @score)`);

  const scores = [
    // GP — Guadalcanal (37)
    ['guadalcanal','1a',2],['guadalcanal','1b',1],['guadalcanal','1c',1],['guadalcanal','1d',1],
    ['guadalcanal','2a',1],['guadalcanal','2b',2],
    ['guadalcanal','3a',1],['guadalcanal','3b',0],['guadalcanal','3c',2],
    ['guadalcanal','4a',2],['guadalcanal','4b',0],['guadalcanal','4c',0],
    ['guadalcanal','5a',1],['guadalcanal','5b',0],['guadalcanal','5c',2],
    ['guadalcanal','6',0],
    ['guadalcanal','7a',3],['guadalcanal','7b',2],
    ['guadalcanal','8a',2],['guadalcanal','8b',3],
    ['guadalcanal','9a',1],['guadalcanal','9b',1],
    ['guadalcanal','10',3],['guadalcanal','11',0],
    ['guadalcanal','12',5],['guadalcanal','13',0],
    ['guadalcanal','14',0],['guadalcanal','15',1],
    ['guadalcanal','16',0],['guadalcanal','17',0],['guadalcanal','18',0],

    // TP — Temotu (33)
    ['temotu','1a',2],['temotu','1b',0],['temotu','1c',0],['temotu','1d',0],
    ['temotu','2a',0],['temotu','2b',0],
    ['temotu','3a',1],['temotu','3b',0],['temotu','3c',2],
    ['temotu','4a',2],['temotu','4b',2],['temotu','4c',0],
    ['temotu','5a',1],['temotu','5b',2],['temotu','5c',2],
    ['temotu','6',0],
    ['temotu','7a',3],['temotu','7b',2],
    ['temotu','8a',2],['temotu','8b',3],
    ['temotu','9a',0],['temotu','9b',0],
    ['temotu','10',3],['temotu','11',0],
    ['temotu','12',5],['temotu','13',0],
    ['temotu','14',0],['temotu','15',1],
    ['temotu','16',0],['temotu','17',0],['temotu','18',0],

    // RBP — Rennell & Bellona (24)
    ['rennell-bellona','1a',0],['rennell-bellona','1b',0],['rennell-bellona','1c',0],['rennell-bellona','1d',0],
    ['rennell-bellona','2a',0],['rennell-bellona','2b',0],
    ['rennell-bellona','3a',1],['rennell-bellona','3b',0],['rennell-bellona','3c',2],
    ['rennell-bellona','4a',2],['rennell-bellona','4b',0],['rennell-bellona','4c',0],
    ['rennell-bellona','5a',1],['rennell-bellona','5b',2],['rennell-bellona','5c',0],
    ['rennell-bellona','6',0],
    ['rennell-bellona','7a',3],['rennell-bellona','7b',2],
    ['rennell-bellona','8a',2],['rennell-bellona','8b',3],
    ['rennell-bellona','9a',2],['rennell-bellona','9b',1],
    ['rennell-bellona','10',3],['rennell-bellona','11',0],
    ['rennell-bellona','12',0],['rennell-bellona','13',0],
    ['rennell-bellona','14',0],['rennell-bellona','15',0],
    ['rennell-bellona','16',0],['rennell-bellona','17',0],['rennell-bellona','18',0],

    // WP — Western (34)
    ['western','1a',0],['western','1b',0],['western','1c',0],['western','1d',0],
    ['western','2a',0],['western','2b',0],
    ['western','3a',1],['western','3b',0],['western','3c',2],
    ['western','4a',2],['western','4b',0],['western','4c',1],
    ['western','5a',1],['western','5b',2],['western','5c',2],
    ['western','6',0],
    ['western','7a',3],['western','7b',2],
    ['western','8a',2],['western','8b',3],
    ['western','9a',1],['western','9b',2],
    ['western','10',3],['western','11',0],
    ['western','12',5],['western','13',0],
    ['western','14',1],['western','15',1],
    ['western','16',0],['western','17',0],['western','18',0],

    // CP — Choiseul (33)
    ['choiseul','1a',2],['choiseul','1b',0],['choiseul','1c',0],['choiseul','1d',0],
    ['choiseul','2a',0],['choiseul','2b',0],
    ['choiseul','3a',1],['choiseul','3b',0],['choiseul','3c',2],
    ['choiseul','4a',2],['choiseul','4b',0],['choiseul','4c',0],
    ['choiseul','5a',1],['choiseul','5b',2],['choiseul','5c',0],
    ['choiseul','6',0],
    ['choiseul','7a',3],['choiseul','7b',2],
    ['choiseul','8a',2],['choiseul','8b',3],
    ['choiseul','9a',2],['choiseul','9b',2],
    ['choiseul','10',3],['choiseul','11',0],
    ['choiseul','12',5],['choiseul','13',1],
    ['choiseul','14',0],['choiseul','15',0],
    ['choiseul','16',0],['choiseul','17',0],['choiseul','18',0],

    // MP — Malaita (34)
    ['malaita','1a',2],['malaita','1b',0],['malaita','1c',0],['malaita','1d',0],
    ['malaita','2a',3],['malaita','2b',0],
    ['malaita','3a',1],['malaita','3b',0],['malaita','3c',2],
    ['malaita','4a',2],['malaita','4b',2],['malaita','4c',0],
    ['malaita','5a',1],['malaita','5b',2],['malaita','5c',2],
    ['malaita','6',0],
    ['malaita','7a',3],['malaita','7b',2],
    ['malaita','8a',2],['malaita','8b',0],
    ['malaita','9a',0],['malaita','9b',0],
    ['malaita','10',3],['malaita','11',0],
    ['malaita','12',5],['malaita','13',0],
    ['malaita','14',1],['malaita','15',1],
    ['malaita','16',0],['malaita','17',0],['malaita','18',0],

    // CIP — Central Islands (33)
    ['central-islands','1a',2],['central-islands','1b',0],['central-islands','1c',0],['central-islands','1d',0],
    ['central-islands','2a',3],['central-islands','2b',0],
    ['central-islands','3a',1],['central-islands','3b',0],['central-islands','3c',2],
    ['central-islands','4a',2],['central-islands','4b',0],['central-islands','4c',0],
    ['central-islands','5a',1],['central-islands','5b',2],['central-islands','5c',2],
    ['central-islands','6',0],
    ['central-islands','7a',3],['central-islands','7b',2],
    ['central-islands','8a',2],['central-islands','8b',3],
    ['central-islands','9a',0],['central-islands','9b',0],
    ['central-islands','10',3],['central-islands','11',0],
    ['central-islands','12',5],['central-islands','13',0],
    ['central-islands','14',0],['central-islands','15',0],
    ['central-islands','16',0],['central-islands','17',0],['central-islands','18',0],

    // IP — Isabel (35)
    ['isabel','1a',0],['isabel','1b',0],['isabel','1c',0],['isabel','1d',0],
    ['isabel','2a',0],['isabel','2b',0],
    ['isabel','3a',1],['isabel','3b',0],['isabel','3c',2],
    ['isabel','4a',2],['isabel','4b',0],['isabel','4c',0],
    ['isabel','5a',1],['isabel','5b',2],['isabel','5c',2],
    ['isabel','6',0],
    ['isabel','7a',3],['isabel','7b',2],
    ['isabel','8a',2],['isabel','8b',3],
    ['isabel','9a',2],['isabel','9b',1],
    ['isabel','10',3],['isabel','11',0],
    ['isabel','12',5],['isabel','13',3],
    ['isabel','14',0],['isabel','15',1],
    ['isabel','16',0],['isabel','17',0],['isabel','18',0],

    // MUP — Makira & Ulawa (39)
    ['makira-ulawa','1a',2],['makira-ulawa','1b',0],['makira-ulawa','1c',1],['makira-ulawa','1d',0],
    ['makira-ulawa','2a',3],['makira-ulawa','2b',0],
    ['makira-ulawa','3a',1],['makira-ulawa','3b',0],['makira-ulawa','3c',2],
    ['makira-ulawa','4a',2],['makira-ulawa','4b',0],['makira-ulawa','4c',0],
    ['makira-ulawa','5a',1],['makira-ulawa','5b',2],['makira-ulawa','5c',2],
    ['makira-ulawa','6',0],
    ['makira-ulawa','7a',3],['makira-ulawa','7b',2],
    ['makira-ulawa','8a',2],['makira-ulawa','8b',3],
    ['makira-ulawa','9a',2],['makira-ulawa','9b',0],
    ['makira-ulawa','10',3],['makira-ulawa','11',0],
    ['makira-ulawa','12',5],['makira-ulawa','13',3],
    ['makira-ulawa','14',0],['makira-ulawa','15',0],
    ['makira-ulawa','16',0],['makira-ulawa','17',0],['makira-ulawa','18',0],
  ];
  scores.forEach(([province_id, sub_indicator, score]) =>
    insertScore.run({ province_id, sub_indicator, score }));

  // ── Check-ins ────────────────────────────────────────────────
  const insertCI = db.prepare(`
    INSERT OR REPLACE INTO checkins (id, trigger_month, trigger_day, type, subject_tmpl, intro_tmpl, question_tmpl, weeks_to_apa)
    VALUES (@id, @trigger_month, @trigger_day, @type, @subject_tmpl, @intro_tmpl, @question_tmpl, @weeks_to_apa)`);

  const checkins = [
    {
      id: 1, trigger_month: 'April', trigger_day: 1, type: 'activity-linked',
      subject_tmpl: '{province} LoCAL — April: confirm CC Focal Point (PM#12, 5 pts)',
      intro_tmpl: 'The new fiscal year started 1 April. {province} scored {score}/100 on last year\'s APA. Everything the CCARRO does this year depends on their designation being formally in place.',
      question_tmpl: 'Is your CC Focal Point / CCARRO still in post and formally designated for LoCAL duties this fiscal year?',
      weeks_to_apa: null,
    },
    {
      id: 2, trigger_month: 'June', trigger_day: 1, type: 'activity-linked',
      subject_tmpl: '{province} LoCAL — June: CC awareness sessions (PM#14+15, up to {avail_pts} pts)',
      intro_tmpl: '{province} scored {pm14_score}/5 on staff CC awareness (PM#14) and {pm15_score}/5 on community CC awareness (PM#15) last year. The APA window opens in approximately 8 weeks.',
      question_tmpl: 'Has your province held at least one CC awareness session this fiscal year — for staff or for communities?',
      weeks_to_apa: 8,
    },
    {
      id: 3, trigger_month: 'July', trigger_day: 1, type: 'activity-linked',
      subject_tmpl: '{province} LoCAL — July: climate data and risk assessment (PM#1+2, 10 pts)',
      intro_tmpl: '{province} scored {pm1_score}/5 on meteorological data (PM#1) and {pm2_score}/5 on climate risk assessment (PM#2) last year. These 10 points underpin almost everything in Theme B.',
      question_tmpl: 'Is 10-year temperature and rainfall data stored in your PG database?',
      weeks_to_apa: null,
    },
    {
      id: 4, trigger_month: 'August', trigger_day: 1, type: 'activity-agnostic',
      subject_tmpl: '{province} LoCAL — August: APA documentation checklist (no reply needed)',
      intro_tmpl: 'The APA assessment team will visit {province} this quarter. This is a documentation reminder — no reply needed, but please act on any gaps below. Work done but not documented cannot be scored.',
      question_tmpl: null,
      weeks_to_apa: null,
    },
    {
      id: 5, trigger_month: 'October', trigger_day: 15, type: 'activity-linked',
      subject_tmpl: '{province} LoCAL — October: planning season starts now (35 pts at stake)',
      intro_tmpl: 'The planning season begins this month. Theme B (Climate Change Planning) is worth 35 points and is entirely determined by what your CCARRO and Planning Officer do between now and 31 March. {province} scored {theme_b_score}/35 last year.',
      question_tmpl: 'Has your CCARRO been briefed on these specific gaps before the planning cycle starts?',
      weeks_to_apa: null,
    },
    {
      id: 6, trigger_month: 'December', trigger_day: 1, type: 'activity-linked',
      subject_tmpl: '{province} LoCAL — December: four measures to confirm before plan is finalised',
      intro_tmpl: 'Mid-planning check. The plan is in draft — these four measures can still be fixed before submission.',
      question_tmpl: 'Does {province}\'s draft annual plan include explicit references to the National Development Strategy 2016–2035 (PM#4b, 2 pts) and the National Climate Change Policy (PM#4c, 1 pt) in the project descriptions?',
      weeks_to_apa: null,
    },
    {
      id: 7, trigger_month: 'February', trigger_day: 1, type: 'activity-linked',
      subject_tmpl: '{province} LoCAL — February: engineer sign-off and tender clause before 31 March (PM#9+13, up to 10 pts)',
      intro_tmpl: 'Two technically focused measures before the 31 March budget submission. {province} scored {pm9_pm13_score}/10 on these last year.',
      question_tmpl: 'Has the Provincial Engineer reviewed and documented climate risk considerations for all PBCRG infrastructure project designs — with a signed note on file?',
      weeks_to_apa: null,
    },
    {
      id: 8, trigger_month: 'Quarterly', trigger_day: 15, type: 'activity-linked',
      subject_tmpl: '{province} LoCAL — {month}: quarterly PBCRG report due (PM#16)',
      intro_tmpl: 'A quarterly report on PBCRG utilisation is due this month.',
      question_tmpl: 'Has the report been submitted to MPGIS via the ACCAF Data Tracker (Columns X–AM)?',
      weeks_to_apa: null,
    },
    {
      id: 9, trigger_month: 'September', trigger_day: 1, type: 'activity-linked',
      subject_tmpl: '{province} LoCAL — September: PBCRG utilisation check (PM#17+18, 18 pts)',
      intro_tmpl: 'PM#17 (utilisation level, 10 pts) and PM#18 (execution as planned, 8 pts) are proportional to what has been spent and delivered. The APA window opens in approximately 8 weeks.',
      question_tmpl: 'Approximately what percentage of {province}\'s PBCRG allocation has been committed or spent this fiscal year?',
      weeks_to_apa: 8,
    },
  ];
  checkins.forEach(c => insertCI.run(c));

  // ── Check-in ↔ PM mappings ────────────────────────────────────
  const insertCIPM = db.prepare(`
    INSERT OR REPLACE INTO checkin_pms (checkin_id, pm_number) VALUES (?, ?)`);

  const ciPMs = [
    [1, 12],
    [2, 14], [2, 15],
    [3, 1],  [3, 2],
    [4, 1],  [4, 7], [4, 8], [4, 9], [4, 12], [4, 13], [4, 14], [4, 15],
    [5, 3],  [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [5, 9],
    [6, 4],  [6, 5], [6, 10], [6, 11],
    [7, 9],  [7, 13],
    [8, 16],
    [9, 17], [9, 18],
  ];
  ciPMs.forEach(([ci, pm]) => insertCIPM.run(ci, pm));

  // ── Answer options ────────────────────────────────────────────
  const insertOpt = db.prepare(`
    INSERT OR REPLACE INTO checkin_options (checkin_id, value, label, sort_order)
    VALUES (@checkin_id, @value, @label, @sort_order)`);

  const options = [
    // CI 1
    { checkin_id: 1, value: 'YES',     label: 'Yes — in post and formally designated', sort_order: 0 },
    { checkin_id: 1, value: 'NO',      label: 'No / position has changed',             sort_order: 1 },
    // CI 2
    { checkin_id: 2, value: 'BOTH',    label: 'Both — staff session and community session done', sort_order: 0 },
    { checkin_id: 2, value: 'STAFF',   label: 'Staff session only',                             sort_order: 1 },
    { checkin_id: 2, value: 'COMMUNITY', label: 'Community session only',                       sort_order: 2 },
    { checkin_id: 2, value: 'NONE',    label: 'Not yet this fiscal year',                       sort_order: 3 },
    // CI 3
    { checkin_id: 3, value: 'YES',     label: 'Yes — data is in the PG database',   sort_order: 0 },
    { checkin_id: 3, value: 'NO',      label: 'No — data is not yet available',     sort_order: 1 },
    // CI 5
    { checkin_id: 5, value: 'YES',     label: 'Yes — CCARRO has been briefed',      sort_order: 0 },
    { checkin_id: 5, value: 'NO',      label: 'No — not yet briefed',               sort_order: 1 },
    // CI 6
    { checkin_id: 6, value: 'BOTH',    label: 'Both NDS and NCCP referenced',       sort_order: 0 },
    { checkin_id: 6, value: 'NDS_ONLY', label: 'NDS only',                          sort_order: 1 },
    { checkin_id: 6, value: 'NEITHER', label: 'Neither referenced yet',             sort_order: 2 },
    // CI 7
    { checkin_id: 7, value: 'YES_ALL', label: 'Yes — all designs documented',       sort_order: 0 },
    { checkin_id: 7, value: 'PARTIAL', label: 'Partially done',                     sort_order: 1 },
    { checkin_id: 7, value: 'NO',      label: 'Not yet',                            sort_order: 2 },
    // CI 8
    { checkin_id: 8, value: 'SUBMITTED',   label: 'Submitted',                      sort_order: 0 },
    { checkin_id: 8, value: 'IN_PROGRESS', label: 'In progress',                    sort_order: 1 },
    { checkin_id: 8, value: 'NOT_STARTED', label: 'Not started',                    sort_order: 2 },
    // CI 9
    { checkin_id: 9, value: 'OVER_75',  label: 'Over 75% committed or spent',       sort_order: 0 },
    { checkin_id: 9, value: 'FIFTY_75', label: '50–75%',                            sort_order: 1 },
    { checkin_id: 9, value: 'UNDER_50', label: 'Under 50%',                         sort_order: 2 },
  ];
  options.forEach(o => insertOpt.run(o));

  console.log('✓ Database seeded successfully');
  console.log(`  ${provinces.length} provinces`);
  console.log(`  ${pms.length} performance measures`);
  console.log(`  ${subs.length} sub-indicators`);
  console.log(`  ${scores.length} province scores`);
  console.log(`  ${checkins.length} check-ins`);
  console.log(`  ${ciPMs.length} check-in/PM mappings`);
  console.log(`  ${options.length} answer options`);
});

run();
db.close();
