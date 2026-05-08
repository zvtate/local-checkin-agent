# LoCAL Check-in Agent — API Reference

Express server at `server/index.js`. Runs on port 3002 (configurable via `PORT` env var). All endpoints return JSON. No authentication.

The static frontend (`form.html`) is served from the project root via `express.static` — the Express process serves both the API and the HTML page.

---

## Endpoints

### `GET /api/provinces`

Returns all 9 provinces, ordered by `current_score` descending.

**Response:**
```json
[
  {
    "id": "makira-ulawa",
    "name": "Makira & Ulawa",
    "code": "MUP",
    "ps_name": null,
    "current_score": 39,
    "exp_weight": 1521
  },
  ...
]
```

**Notes:** `ps_name` is NULL for all 9 provinces in the current seed — PS names have not yet been entered.

---

### `GET /api/province/:id`

Returns a single province with all sub-indicator scores and per-PM totals.

**URL params:**

| Param | Type | Description |
|---|---|---|
| `id` | TEXT | Province slug: `guadalcanal`, `temotu`, `rennell-bellona`, `western`, `choiseul`, `malaita`, `central-islands`, `isabel`, `makira-ulawa` |

**Response:**
```json
{
  "id": "guadalcanal",
  "name": "Guadalcanal",
  "code": "GP",
  "ps_name": null,
  "current_score": 37,
  "exp_weight": 1369,
  "sub_scores": [
    {
      "sub_indicator": "1a",
      "score": 2,
      "label": "Temperature and rainfall data ≥10 yrs in PG database",
      "max_score": 2,
      "pm_number": 1
    },
    ...
  ],
  "pm_totals": [
    {
      "pm_number": 1,
      "score": 5,
      "max_score": 5
    },
    ...
  ]
}
```

**Errors:**
- `404` with `{ "error": "Province not found" }` if the slug does not match any row.

---

### `GET /api/checkin/:id`

Returns a single check-in definition with its answer options and the PMs it covers.

**URL params:**

| Param | Type | Description |
|---|---|---|
| `id` | INTEGER | Check-in number 1–9 |

**Response:**
```json
{
  "id": 2,
  "trigger_month": "June",
  "trigger_day": 1,
  "type": "activity-linked",
  "subject_tmpl": "{province} LoCAL — June: CC awareness sessions (PM#14+15, up to {avail_pts} pts)",
  "intro_tmpl": "{province} scored {pm14_score}/5 on staff CC awareness...",
  "question_tmpl": "Has your province held at least one CC awareness session this fiscal year — for staff or for communities?",
  "weeks_to_apa": 8,
  "options": [
    { "id": 5, "checkin_id": 2, "value": "BOTH",      "label": "Both — staff and community sessions done", "sort_order": 0 },
    { "id": 6, "checkin_id": 2, "value": "STAFF",     "label": "Staff session only",                       "sort_order": 1 },
    { "id": 7, "checkin_id": 2, "value": "COMMUNITY", "label": "Community session only",                   "sort_order": 2 },
    { "id": 8, "checkin_id": 2, "value": "NONE",      "label": "Not yet this fiscal year",                 "sort_order": 3 }
  ],
  "pms": [
    { "pm_number": 14, "label": "Staff CC awareness session", "max_score": 5, "theme": "F", "theme_name": "Climate Change Awareness", "notes": "..." },
    { "pm_number": 15, "label": "Community CC meetings with records", "max_score": 5, "theme": "F", "theme_name": "Climate Change Awareness", "notes": "..." }
  ]
}
```

**Notes:**
- CI 4 (August) has `type: "activity-agnostic"` and `question_tmpl: null` — it is a reminder-only check-in with no answer options.
- CI 8 has `trigger_month: "Quarterly"` — it fires in October, January, April, and July.
- Template placeholders in `subject_tmpl` and `intro_tmpl` (e.g. `{province}`, `{score}`) are resolved by the caller.

**Errors:**
- `404` with `{ "error": "Check-in not found" }` if the id does not match.

---

### `GET /api/gaps/:province_id/:checkin_id`

Returns the province's current scores and gaps for the PMs covered by a specific check-in. Used by `form.html` after an answer is selected to populate the result panel.

**URL params:**

| Param | Type | Description |
|---|---|---|
| `province_id` | TEXT | Province slug |
| `checkin_id` | INTEGER | Check-in number 1–9 |

**Response:**
```json
{
  "pms": [
    {
      "pm_number": 14,
      "label": "Staff CC awareness session",
      "max_score": 5,
      "theme_name": "Climate Change Awareness",
      "scored": 0,
      "gap": 5
    },
    {
      "pm_number": 15,
      "label": "Community CC meetings with records",
      "max_score": 5,
      "theme_name": "Climate Change Awareness",
      "scored": 1,
      "gap": 4
    }
  ],
  "sub_indicators": [
    {
      "id": "14",
      "pm_number": 14,
      "label": "Documented training of PG staff on CC adaptation (sign-in sheet, agenda, summary)",
      "max_score": 5,
      "score": 0,
      "gap": 5
    },
    {
      "id": "15",
      "pm_number": 15,
      "label": "Documented meetings with WDCs and community leaders on CC adaptation (disaggregated records)",
      "max_score": 5,
      "score": 1,
      "gap": 4
    }
  ]
}
```

**Notes:**
- `pms` is ordered by `gap DESC` — the largest gaps appear first.
- `sub_indicators` is ordered by `pm_number`, then `id`.
- `score` in `sub_indicators` comes from a LEFT JOIN against `province_scores`; if somehow no score row exists, it will be NULL rather than 0.
- The `form.html` frontend uses the `pms` array to compute the grant impact bar: it sums all `gap` values, adds them to `current_score`, squares the result, and divides by `exp_weight` to get the multiplier.

---

### `POST /api/submit`

Logs a form submission to the `submissions` table.

**Request body (JSON):**

| Field | Type | Required | Description |
|---|---|---|---|
| `province_id` | TEXT | Yes | Province slug |
| `checkin_id` | INTEGER | Yes | Check-in number 1–9 |
| `answer_value` | TEXT | Yes | Value from `checkin_options.value` (e.g. `BOTH`, `YES`, `NOT_STARTED`) |
| `followup_value` | TEXT | No | Follow-up answer if the check-in has a follow-up question; null otherwise |

**Response:**
```json
{ "ok": true }
```

**Errors:**
- `400` with `{ "error": "Missing required fields" }` if any of `province_id`, `checkin_id`, or `answer_value` is absent.

**Notes:**
- Does not validate that `province_id` or `checkin_id` actually exist in the database — an invalid ID will succeed silently (the foreign key constraint is defined in the schema but SQLite FK enforcement must be enabled per-connection; the server enables it via `PRAGMA foreign_keys = ON` in `schema.sql` but the pragma only applies during that session).
- The `submitted_at` field defaults to `datetime('now')` in SQLite (UTC).
- `form.html` fires this as fire-and-forget (`.catch(function(){})`) — submission errors are silently ignored by the client.

---

### `GET /api/status/:province_id`

Returns the completion status of all 9 check-ins for a given province, based on the most recent submission per check-in.

**URL params:**

| Param | Type | Description |
|---|---|---|
| `province_id` | TEXT | Province slug |

**Response:**
```json
[
  {
    "checkin_id": 1,
    "trigger_month": "April",
    "type": "activity-linked",
    "done": false,
    "last_answer": null,
    "last_followup": null,
    "answered_at": null
  },
  {
    "checkin_id": 2,
    "trigger_month": "June",
    "type": "activity-linked",
    "done": true,
    "last_answer": "BOTH",
    "last_followup": "YES",
    "answered_at": "2026-06-03 09:14:22"
  },
  ...
]
```

**Notes:**
- Always returns 9 items — one per check-in — regardless of whether the province has submitted anything.
- `done` is determined by a hardcoded completion table in `index.js`:

| CI | Condition for `done: true` |
|---|---|
| 1 | `answer=YES` AND `followup=YES` |
| 2 | `answer=BOTH` AND `followup=YES` |
| 3 | `answer=YES` AND `followup=YES` |
| 4 | Always `true` (reminder only) |
| 5 | `answer=YES` AND `followup=YES` |
| 6 | `answer=BOTH` AND `followup=YES` |
| 7 | `answer=YES_ALL` AND `followup=YES` |
| 8 | `answer=SUBMITTED` |
| 9 | `answer=OVER_75` AND `followup=YES` |

- Only the most recent submission per check-in is used (submissions are scanned in DESC order by `submitted_at` and deduplicated by `checkin_id`).

---

### `GET /api/submissions`

Returns all submissions across all provinces, enriched with province name and check-in month. Admin endpoint — no filtering.

**Response:**
```json
[
  {
    "id": 1,
    "province_id": "guadalcanal",
    "checkin_id": 2,
    "answer_value": "BOTH",
    "followup_value": "YES",
    "submitted_at": "2026-06-03 09:14:22",
    "ip_hash": null,
    "province_name": "Guadalcanal",
    "trigger_month": "June"
  },
  ...
]
```

**Notes:**
- Ordered by `submitted_at DESC`.
- No authentication or rate limiting. Intended for internal/admin use only.

---

## Answer option reference

All valid `answer_value` strings per check-in, as seeded:

| CI | Valid answer values |
|---|---|
| 1 | `YES`, `NO` |
| 2 | `BOTH`, `STAFF`, `COMMUNITY`, `NONE` |
| 3 | `YES`, `NO` |
| 4 | *(no question — reminder only)* |
| 5 | `YES`, `NO` |
| 6 | `BOTH`, `NDS_ONLY`, `NEITHER` |
| 7 | `YES_ALL`, `PARTIAL`, `NO` |
| 8 | `SUBMITTED`, `IN_PROGRESS`, `NOT_STARTED` |
| 9 | `OVER_75`, `FIFTY_75`, `UNDER_50` |

**Note:** The frontend (`form.html`) uses `NONE` (CI 2) and `FIFTY_75` / `UNDER_50` (CI 9), but `seed.js` stores the CI 2 "not yet" option as `NONE` and CI 9 options as `FIFTY_75` and `UNDER_50`. Ensure submissions use these exact strings.
