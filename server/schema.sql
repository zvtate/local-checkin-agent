-- LoCAL Check-in Agent — Database Schema

PRAGMA foreign_keys = ON;

-- ── Provinces ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS provinces (
  id              TEXT PRIMARY KEY,  -- 'guadalcanal', 'temotu', etc.
  name            TEXT NOT NULL,
  code            TEXT NOT NULL,     -- 'GP', 'TP', etc.
  ps_name         TEXT,              -- Provincial Secretary name
  current_score   INTEGER NOT NULL,
  exp_weight      INTEGER NOT NULL   -- score * score
);

-- ── PM Definitions ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pms (
  pm_number   INTEGER PRIMARY KEY,   -- 1–18
  theme       TEXT NOT NULL,         -- 'A'–'H'
  theme_name  TEXT NOT NULL,
  label       TEXT NOT NULL,
  max_score   INTEGER NOT NULL,
  notes       TEXT                   -- system-wide observations
);

-- ── Sub-indicators ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sub_indicators (
  id              TEXT PRIMARY KEY,  -- '1a', '1b', '2a', etc.
  pm_number       INTEGER NOT NULL REFERENCES pms(pm_number),
  label           TEXT NOT NULL,     -- what earns the mark
  max_score       INTEGER NOT NULL
);

-- ── Province sub-indicator scores (last APA) ─────────────────
CREATE TABLE IF NOT EXISTS province_scores (
  province_id     TEXT NOT NULL REFERENCES provinces(id),
  sub_indicator   TEXT NOT NULL REFERENCES sub_indicators(id),
  score           INTEGER NOT NULL,
  PRIMARY KEY (province_id, sub_indicator)
);

-- ── Check-in definitions ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS checkins (
  id              INTEGER PRIMARY KEY,  -- 1–9
  trigger_month   TEXT NOT NULL,        -- 'April', 'June', etc.
  trigger_day     INTEGER DEFAULT 1,
  type            TEXT NOT NULL CHECK (type IN ('activity-linked','activity-agnostic')),
  subject_tmpl    TEXT NOT NULL,
  intro_tmpl      TEXT NOT NULL,
  question_tmpl   TEXT,                 -- NULL for activity-agnostic
  weeks_to_apa    INTEGER
);

-- ── PMs covered per check-in ──────────────────────────────────
CREATE TABLE IF NOT EXISTS checkin_pms (
  checkin_id  INTEGER NOT NULL REFERENCES checkins(id),
  pm_number   INTEGER NOT NULL REFERENCES pms(pm_number),
  PRIMARY KEY (checkin_id, pm_number)
);

-- ── Answer options per check-in ───────────────────────────────
CREATE TABLE IF NOT EXISTS checkin_options (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  checkin_id  INTEGER NOT NULL REFERENCES checkins(id),
  value       TEXT NOT NULL,   -- 'YES', 'BOTH', 'STAFF_ONLY', etc.
  label       TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- ── Response templates (answer → text shown to PS) ────────────
-- province_id NULL = applies to all provinces
CREATE TABLE IF NOT EXISTS response_templates (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  checkin_id      INTEGER NOT NULL REFERENCES checkins(id),
  answer_value    TEXT NOT NULL,
  province_id     TEXT REFERENCES provinces(id),
  has_followup    INTEGER NOT NULL DEFAULT 0,  -- 1 = show follow-up question
  followup_q      TEXT,
  response_tmpl   TEXT NOT NULL,
  grant_impact    TEXT
);

-- ── Follow-up options ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS followup_options (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  response_template_id INTEGER NOT NULL REFERENCES response_templates(id),
  value               TEXT NOT NULL,
  label               TEXT NOT NULL
);

-- ── Follow-up responses ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS followup_responses (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  response_template_id INTEGER NOT NULL REFERENCES response_templates(id),
  followup_value      TEXT NOT NULL,
  province_id         TEXT REFERENCES provinces(id),
  response_tmpl       TEXT NOT NULL
);

-- ── Reminder items per check-in ───────────────────────────────
CREATE TABLE IF NOT EXISTS reminders (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  checkin_id  INTEGER NOT NULL REFERENCES checkins(id),
  pm_ref      TEXT,            -- 'PM#14', 'Tip', 'Deadline', etc.
  pts         INTEGER,
  body        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- ── Province-specific priorities (year-round quick wins) ──────
CREATE TABLE IF NOT EXISTS province_priorities (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  province_id TEXT NOT NULL REFERENCES provinces(id),
  pm_number   INTEGER NOT NULL REFERENCES pms(pm_number),
  label       TEXT NOT NULL,
  pts         INTEGER NOT NULL,
  timing      TEXT NOT NULL,
  action      TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- ── Form submissions (response log) ──────────────────────────
CREATE TABLE IF NOT EXISTS submissions (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  province_id     TEXT NOT NULL REFERENCES provinces(id),
  checkin_id      INTEGER NOT NULL REFERENCES checkins(id),
  answer_value    TEXT NOT NULL,
  followup_value  TEXT,
  submitted_at    TEXT NOT NULL DEFAULT (datetime('now')),
  ip_hash         TEXT
);
