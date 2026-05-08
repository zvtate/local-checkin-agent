# AGENTS.md — LoCAL Check-in Agent

Guidance for AI agents working on this codebase. Read this before touching anything.

---

## What this project does

The **LoCAL Check-in Agent** sends periodic prompts to the nine Provincial Secretaries (PS) of Solomon Islands, collects a one- or two-question response via a mobile-first web form, and immediately shows each PS personalised action steps. The purpose is to nudge provinces toward completing the activities that determine their Annual Performance Assessment (APA) score.

**Why this matters:** each province's share of UNCDF climate-finance grants is proportional to `score²`. Every additional point a province earns compounds in grant weight — a low-scoring province gains proportionally more from the same improvement. The system makes this concrete and actionable for the PS.

---

## Repository layout

```
checkin-agent/
├── form.html              # The live form served to PS — all 9 check-ins in one page
├── checkin.html/.js/.css  # Legacy single-check-in prototype — do not edit
├── README.md
├── AGENTS.md              # ← this file
├── docs/
│   ├── ARCHITECTURE.md    # System design, Mermaid diagrams, deployment
│   ├── API.md             # All REST endpoints with request/response shapes
│   ├── DATA_MODEL.md      # Full schema with ER diagrams and seeding notes
│   ├── RUNBOOK.md         # PM2, nginx, certbot, GWS CLI setup
│   └── APA_COMPLIANCE_LOGIC.md  # Source-of-truth: all 18 PMs, sub-indicators, check-in logic
├── server/
│   ├── index.js           # Express API (port 3002) — all endpoints + Google Sheets sync
│   ├── schema.sql         # SQLite schema — 13 tables
│   ├── seed.js            # Seeds all static data (provinces, PMs, sub-indicators, scores)
│   ├── local.db           # SQLite database (binary — do not commit carelessly)
│   ├── format_sheet.js    # One-shot: apply column widths, frozen rows, conditional formatting
│   ├── build_dashboard.js # One-shot: create Province Matrix + Submissions Pivot + dropdowns
│   └── package.json       # better-sqlite3, cors, express
└── apps-script/           # Legacy Google Apps Script — superseded by GWS CLI, ignore
```

---

## Running locally

```bash
cd server
npm install
node seed.js         # populate local.db (safe to re-run — uses INSERT OR IGNORE)
node index.js        # API on http://localhost:3002
```

Open `http://localhost:3002/form.html?p=guadalcanal` (replace province slug as needed).

**Province slugs:** `guadalcanal` `makira-ulawa` `isabel` `western` `malaita` `temotu` `choiseul` `central-islands` `rennell-bellona`

---

## Production stack

| Layer | Tool | Config |
|-------|------|--------|
| Process manager | PM2 | `pm2 start index.js --name checkin-api` |
| Reverse proxy | nginx | `/etc/nginx/sites-available/pcdftracker.com` → `proxy_pass http://localhost:3002` |
| SSL | certbot / Let's Encrypt | pending DNS propagation for pcdftracker.com |
| VPS | Contabo | IP 167.86.93.243 |

Start/restart: `pm2 restart checkin-api` — check with `pm2 logs checkin-api`.

---

## Google Sheets integration

**Sheet ID:** `1hxwfZBxPJxK8Xa8fn8-4Rm8iAySLUOKE2mFPBZhzHMw`

**Sheet tabs:**
| Tab | Sheet ID | Purpose |
|-----|----------|---------|
| Submissions | 2125495364 | One row per form submission — live log |
| Province Scores | 1557381689 | APA sub-indicator scores per province |
| PM Summary | 430546440 | 18 PMs with theme, max score, notes |
| Province Matrix | dynamic | Province × PM heat map (auto-created by build_dashboard.js) |
| Submissions Pivot | dynamic | Live pivot: Province × CI# count |

**Sync mechanism:** `server/index.js` calls `gws sheets spreadsheets values append` via `execSync` inside `setImmediate` (fire-and-forget) on every POST `/api/submit`. No Apps Script. No webhooks.

**GWS CLI pattern:**
```bash
gws sheets spreadsheets values append \
  --params '{"spreadsheetId":"...","range":"Submissions!A1","valueInputOption":"RAW"}' \
  --json '{"majorDimension":"ROWS","values":[["value1","value2",...]]}'
```

**Re-applying sheet formatting** (safe to re-run, idempotent):
```bash
node server/format_sheet.js      # colours, frozen rows, column widths, conditional formatting
node server/build_dashboard.js   # recreates Province Matrix + Submissions Pivot tabs
```

---

## Data model (summary)

See `docs/DATA_MODEL.md` for full schema. Key relationships:

- **provinces** (9 rows): id = slug, current_score = sum of all sub-indicator scores, exp_weight = score²
- **pms** (18 rows): 8 themes (A–H), max_score varies (5 for PM1–15, 7/10/8 for PM16/17/18), total max = **100**
- **sub_indicators** (31 rows): each PM has 1–4 sub-indicators; sum of sub scores = PM score
- **province_scores** (279 rows): one row per (province, sub_indicator); seeded from APA results
- **checkins** (9 rows): one per fiscal-year touchpoint (April → March)
- **checkin_pms**: which PMs each check-in covers
- **submissions**: one row per PS response; grows over time

**Source of truth for scores:** `docs/APA_COMPLIANCE_LOGIC.md` — if the database and the doc disagree, the doc is authoritative. Known corrections already applied: RBP PM#9 = 3 (not 2), GP PM#14 = 0 (not 1).

---

## The check-in model

Check-ins are **cumulative and conditional**, not monthly standalone forms. A check-in is considered "complete" when the province gives the required positive answer. Completion logic lives in `server/index.js` in the `COMPLETE` object:

```js
const COMPLETE = {
  1: (a,f) => a==='YES'     && f==='YES',
  2: (a,f) => a==='BOTH'    && f==='YES',
  ...
  4: ()    => true,                         // reminder only — always complete
  8: (a)   => a==='SUBMITTED',
};
```

Once complete, the check-in is greyed out and not re-shown. The `/api/status/:province_id` endpoint returns the latest answer per CI and whether each one is done.

---

## form.html structure

- Single file, no framework, mobile-first CSS
- On load: fetches `/api/province/:id` and `/api/status/:id` in parallel
- `CI_META` object (in the `<script>` block) defines per-check-in content: topic, question, follow-up logic, and `response()` function that generates personalised messaging
- Grant impact shown live: `newScore = current + gap`, `mult = newWeight / exp_weight`

---

## Key conventions

- **No framework** — vanilla JS only in `form.html`. Keep it that way; it must work on old mobile browsers.
- **No template literals in Safari-critical code** — Safari on older iOS has issues with backtick strings in some contexts. Use string concatenation if in doubt.
- **SQLite is local only** — `local.db` is the operational store on the VPS. The Google Sheet is the human-readable source of truth for non-technical stakeholders.
- **GWS CLI, not Apps Script** — all Sheets operations go through `gws sheets`. Do not reintroduce Apps Script.
- **Seed is idempotent** — `seed.js` uses `INSERT OR IGNORE` / `INSERT OR REPLACE`. Safe to re-run.
- **format_sheet.js and build_dashboard.js are one-shot scripts** — run them manually after schema/data changes. They are not part of the API server.
- **Port 3002** — hardcoded in `index.js` and nginx config. Don't change without updating both.

---

## Common tasks

**Add a new province or update a score:**
1. Edit `server/seed.js` — find the province in `provinces` array and `province_scores` object
2. Run `node seed.js` to re-seed
3. Verify `current_score` = sum of all sub-indicator scores for that province
4. Re-export Province Scores tab to Sheet if needed (no auto-sync for score data — only submissions auto-sync)

**Change check-in content (question, response text):**
- Edit `CI_META` in `form.html` — it's a large object near the bottom of the `<script>` block
- Each CI has: `topic`, `question`, `followup` (object with condition + question), `response(data)` function

**Change completion conditions:**
- Edit `COMPLETE` object in `server/index.js`

**Re-format the Google Sheet:**
```bash
cd server
node format_sheet.js      # safe to re-run
node build_dashboard.js   # recreates and reformats dashboard tabs
```

**Check submissions:**
```bash
curl http://localhost:3002/api/submissions | jq .
```

---

## Out of scope for agents

- Do not modify `local.db` directly with SQL — use the seed scripts
- Do not push `local.db` to GitHub (it contains real response data)
- Do not add `node_modules/` to git
- Do not reintroduce the `apps-script/` pattern for Sheets sync
- Do not add a frontend build step (webpack, vite, etc.) — this must stay as plain HTML/JS

---

## Contact

Project owner: zvtate@gmail.com — UNCDF LoCAL Solomon Islands programme
