# LoCAL Check-in Agent — Database Reference

SQLite database at `server/local.db`. Schema defined in `server/schema.sql`; all reference data seeded by `server/seed.js` using `better-sqlite3` in a single transaction. Recreate from scratch with `node seed.js`.

---

## Seeding status

### Fully seeded (content complete)

| Table | Row count | Notes |
|---|---|---|
| `provinces` | 9 | All 9 provinces. `ps_name` is NULL for all — must be populated before automated emails. |
| `pms` | 18 | PM#1–18, with themes, labels, max scores, and system-wide notes. |
| `sub_indicators` | 31 | All sub-indicators. Single-indicator PMs (PM#6, PM#10–18) use the PM number as the string id. |
| `province_scores` | 279 | 9 provinces × 31 sub-indicators. FY 2024/25 APA data, verified against source document (two corrections applied — see Score data notes). |
| `checkins` | 9 | CI 1–9 with trigger month/day, type, and template strings. |
| `checkin_pms` | 29 | Check-in to PM mappings. |
| `checkin_options` | 22 | Answer options for CIs 1, 2, 3, 5, 6, 7, 8, 9. CI 4 has no options (activity-agnostic). |

### Schema-only (no content yet seeded)

| Table | Purpose | Blocking? |
|---|---|---|
| `response_templates` | Guidance text shown to PS after each answer | Yes — currently lives as JS in `form.html` |
| `followup_options` | Answer buttons for follow-up questions | Yes — blocked by `response_templates` |
| `followup_responses` | Guidance text after follow-up answer | Yes — blocked by `response_templates` |
| `reminders` | Per-check-in reminder bullet points | No — form.html hardcodes these |
| `province_priorities` | Per-province quick-win action items | No — form.html hardcodes these |
| `submissions` | Response log | No — rows are inserted by the API at runtime |

---

## Score data notes

**province_scores is fully verified:** all 9 province totals and all theme sub-totals match their sub-indicator sums exactly. Data source: FY 2024/25 APA (conducted January–March 2026, results endorsed in the 2026–2027 Consolidated Assessment Report). Verified May 2026.

**Two corrections applied to the source document:**
1. **RBP PM#9:** source shows sub-total = 2; corrected to 3 (9a=2 + 9b=1). Both Theme B total (21) and province total (24) require 3.
2. **GP PM#14:** source shows sub-total = 1; corrected to 0 (indicator row = 0). Theme F total for GP is 1 (PM14=0 + PM15=1) and province total (37) requires 0.

---

## Tables

### `provinces`

Reference row per province. 9 rows total.

| Field | Type | Notes |
|---|---|---|
| `id` | TEXT PK | Slug used in URLs and foreign keys: `guadalcanal`, `temotu`, `rennell-bellona`, `western`, `choiseul`, `malaita`, `central-islands`, `isabel`, `makira-ulawa` |
| `name` | TEXT | Display name |
| `code` | TEXT | 2–3 letter abbreviation: GP, TP, RBP, WP, CP, MP, CIP, IP, MUP |
| `ps_name` | TEXT | Provincial Secretary name — **NULL for all 9 provinces in current seed data**; must be populated before automated emails go live |
| `current_score` | INTEGER | Most recent APA score (FY 2024/25): 24–39 |
| `exp_weight` | INTEGER | `current_score²` — stored for quick reference, always derivable from `current_score` |

**Supports:** province-specific URL routing, per-province response selection, grant-impact calculations.

---

### `pms`

One row per Performance Measure. 18 rows total (PM#1–18).

| Field | Type | Notes |
|---|---|---|
| `pm_number` | INTEGER PK | 1–18 |
| `theme` | TEXT | 'A'–'H' |
| `theme_name` | TEXT | e.g. 'Climate Change Planning' |
| `label` | TEXT | Short PM description |
| `max_score` | INTEGER | Theme totals: A=10, B=35, C=10, D=5, E=5, F=10, G=7, H=18. Grand total = 100. |
| `notes` | TEXT | System-wide observations on scoring patterns |

**Supports:** check-in content assembly, reminder generation, gap analysis display.

---

### `sub_indicators`

One row per sub-indicator. 31 rows total.

| Field | Type | Notes |
|---|---|---|
| `id` | TEXT PK | '1a', '1b', '2a', etc. PM#6, PM#10–18 are single-indicator PMs (id = the PM number as string) |
| `pm_number` | INTEGER FK → `pms` | |
| `label` | TEXT | Plain-language description of what earns the mark |
| `max_score` | INTEGER | Points for this sub-indicator |

**Supports:** granular gap analysis, per-sub-indicator scoring display.

---

### `province_scores`

One row per (province, sub-indicator) pair. 279 rows (9 × 31).

| Field | Type | Notes |
|---|---|---|
| `province_id` | TEXT FK → `provinces` | |
| `sub_indicator` | TEXT FK → `sub_indicators` | |
| `score` | INTEGER | Actual FY 2024/25 score; 0 ≤ score ≤ sub_indicator.max_score |

**Primary key:** `(province_id, sub_indicator)` — composite, no surrogate key needed.

**Supports:** per-province gap calculation, personalising check-in messages with specific sub-indicator deficits.

**Important:** these are reference scores from the last APA cycle. Each APA cycle resets all scores to zero — provinces must re-demonstrate every sub-indicator from scratch.

---

### `checkins`

One row per check-in. 9 rows (CI 1–9).

| Field | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | 1–9 |
| `trigger_month` | TEXT | 'April', 'June', etc. CI 8 uses 'Quarterly' — fires in October, January, April, July |
| `trigger_day` | INTEGER | Day of month; 1 or 15 |
| `type` | TEXT | 'activity-linked' (8 of 9) or 'activity-agnostic' (CI 4 only) |
| `subject_tmpl` | TEXT | Email subject line template with `{province}` placeholder |
| `intro_tmpl` | TEXT | Opening paragraph template |
| `question_tmpl` | TEXT | The question asked; NULL for CI 4 (activity-agnostic) |
| `weeks_to_apa` | INTEGER | Approximate lead time to APA window at time of sending |

**Supports:** scheduled send logic, form rendering, email subject generation.

---

### `checkin_pms`

Maps which PMs each check-in covers. 29 rows.

| Field | Type | Notes |
|---|---|---|
| `checkin_id` | INTEGER FK → `checkins` | |
| `pm_number` | INTEGER FK → `pms` | |

**Primary key:** `(checkin_id, pm_number)`.

**Supports:** filtering gap analysis to only PMs relevant to the current check-in.

---

### `checkin_options`

Answer options displayed on the form for each check-in. 22 rows across 8 check-ins.

| Field | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Autoincrement |
| `checkin_id` | INTEGER FK → `checkins` | |
| `value` | TEXT | Machine key sent in POST body: 'YES', 'BOTH', 'STAFF', 'OVER_75', etc. |
| `label` | TEXT | Human-readable button text shown on form |
| `sort_order` | INTEGER | Display order |

**CI 4 has no options** — it is an activity-agnostic reminder with no question.

**Supports:** form button rendering, answer routing.

---

### `response_templates` — schema only, no content yet

One row per (check-in, answer, province) combination. Province-specific rows override the default (NULL province_id) row.

| Field | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Autoincrement |
| `checkin_id` | INTEGER FK → `checkins` | |
| `answer_value` | TEXT | Matches `checkin_options.value` |
| `province_id` | TEXT FK → `provinces` (nullable) | NULL = default for all provinces |
| `has_followup` | INTEGER | 1 = show a follow-up question after this response |
| `followup_q` | TEXT | The follow-up question text (if `has_followup = 1`) |
| `response_tmpl` | TEXT | Guidance text shown to the PS |
| `grant_impact` | TEXT | Grant-impact paragraph with province-specific numbers |

**Lookup order for a given submission:** find a row matching `(checkin_id, answer_value, province_id)`; if none, fall back to `(checkin_id, answer_value, NULL)`.

---

### `followup_options` — schema only, no content yet

Answer options for follow-up questions. Linked to a specific `response_template` row (the one that triggered the follow-up).

| Field | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Autoincrement |
| `response_template_id` | INTEGER FK → `response_templates` | |
| `value` | TEXT | Machine key: 'YES', 'NOT_YET', etc. |
| `label` | TEXT | Button label |

---

### `followup_responses` — schema only, no content yet

Response text shown after the PS answers the follow-up question.

| Field | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Autoincrement |
| `response_template_id` | INTEGER FK → `response_templates` | The parent response that triggered the follow-up |
| `followup_value` | TEXT | Matches `followup_options.value` |
| `province_id` | TEXT FK → `provinces` (nullable) | NULL = default; non-null = province override |
| `response_tmpl` | TEXT | Final guidance text shown to PS |

---

### `reminders` — schema only, no content yet

Reminder bullet points shown at the bottom of every check-in response (regardless of what the PS answered).

| Field | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Autoincrement |
| `checkin_id` | INTEGER FK → `checkins` | |
| `pm_ref` | TEXT | Label for the reminder: 'PM#14', 'Deadline', 'Tip', etc. |
| `pts` | INTEGER | Point value (nullable — not all reminders reference a scoreable PM) |
| `body` | TEXT | Reminder text |
| `sort_order` | INTEGER | Display order |

---

### `province_priorities` — schema only, no content yet

Persistent per-province quick-win actions, surfaced at the bottom of each check-in result screen.

| Field | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Autoincrement |
| `province_id` | TEXT FK → `provinces` | |
| `pm_number` | INTEGER FK → `pms` | |
| `label` | TEXT | Short description of the gap |
| `pts` | INTEGER | Points available |
| `timing` | TEXT | When to act: 'Now', 'Planning season', 'Before APA', etc. |
| `action` | TEXT | One-sentence action instruction |
| `sort_order` | INTEGER | Display order within the province |

---

### `submissions`

Response log. One row per form submission.

| Field | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Autoincrement |
| `province_id` | TEXT FK → `provinces` | |
| `checkin_id` | INTEGER FK → `checkins` | |
| `answer_value` | TEXT | What the PS selected |
| `followup_value` | TEXT | Follow-up answer if applicable; NULL otherwise |
| `submitted_at` | TEXT | ISO 8601 datetime, defaults to `datetime('now')` (UTC) |
| `ip_hash` | TEXT | Hashed client IP for deduplication; nullable |

**Supports:** response tracking, auditing, completion status calculation (`/api/status/:province_id`).

---

## Queries used by the API

These are the five key SQL queries in `server/index.js`.

### Province sub-scores and PM totals (`GET /api/province/:id`)

```sql
-- Sub-indicator level scores
SELECT ps.sub_indicator, ps.score, si.label, si.max_score, si.pm_number
FROM province_scores ps
JOIN sub_indicators si ON si.id = ps.sub_indicator
WHERE ps.province_id = ?
ORDER BY si.pm_number, ps.sub_indicator;

-- PM-level totals (aggregated from sub-indicators)
SELECT si.pm_number, SUM(ps.score) as score, SUM(si.max_score) as max_score
FROM province_scores ps
JOIN sub_indicators si ON si.id = ps.sub_indicator
WHERE ps.province_id = ?
GROUP BY si.pm_number;
```

### Gap analysis for a check-in (`GET /api/gaps/:province_id/:checkin_id`)

```sql
-- PM-level gaps (only PMs this check-in covers)
SELECT p.pm_number, p.label, p.max_score, p.theme_name,
       COALESCE(SUM(ps.score), 0) as scored,
       p.max_score - COALESCE(SUM(ps.score), 0) as gap
FROM checkin_pms cp
JOIN pms p ON p.pm_number = cp.pm_number
LEFT JOIN sub_indicators si ON si.pm_number = p.pm_number
LEFT JOIN province_scores ps ON ps.sub_indicator = si.id AND ps.province_id = ?
WHERE cp.checkin_id = ?
GROUP BY p.pm_number
ORDER BY gap DESC;

-- Sub-indicator level gaps
SELECT si.id, si.pm_number, si.label, si.max_score, ps.score,
       si.max_score - ps.score as gap
FROM checkin_pms cp
JOIN sub_indicators si ON si.pm_number = cp.pm_number
LEFT JOIN province_scores ps ON ps.sub_indicator = si.id AND ps.province_id = ?
WHERE cp.checkin_id = ?
ORDER BY si.pm_number, si.id;
```

### Province completion status (`GET /api/status/:province_id`)

```sql
SELECT s.checkin_id, s.answer_value, s.followup_value, s.submitted_at
FROM submissions s
WHERE s.province_id = ?
ORDER BY s.submitted_at DESC;
```

The API then iterates this result set in application code to pick the most recent submission per `checkin_id`, applies the hardcoded `COMPLETE` conditions, and joins against all checkins to produce the 9-item status array.
