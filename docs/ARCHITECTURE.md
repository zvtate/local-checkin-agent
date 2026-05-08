# Architecture — LoCAL Check-in Agent

> **Quick links:** [API](./API.md) · [Data Model](./DATA_MODEL.md) · [Runbook](./RUNBOOK.md) · [APA Logic](./APA_COMPLIANCE_LOGIC.md)

## What this system does in one sentence

A PS opens a URL like `form.html?p=guadalcanal`, answers one or two questions about what their province has done, and immediately sees a personalised action plan showing exactly which APA marks they can still earn — and what that means in dollar terms for their grant.

---

## Component overview

| Component | File / Location | Purpose |
|-----------|----------------|---------|
| Form | `form.html` | Single-page app served by Express. All 9 check-ins rendered as a tracker list. Province-aware content. Mobile-first. |
| API | `server/index.js` | Express on port 3002. 7 endpoints. Reads SQLite, writes submissions, syncs to Google Sheets. |
| Database | `server/local.db` | SQLite. Provinces, PMs, scores, check-in definitions, submissions. Seeded from `seed.js`. |
| Sheets sync | `gws` CLI via `execSync` | On every submission, appends a row to the Submissions tab in Google Sheets. Fire-and-forget. |
| nginx | `/etc/nginx/sites-available/pcdftracker.com` | Reverse proxy: port 80/443 → port 3002. |
| PM2 | process name `local-checkin` | Keeps the Node process alive across restarts. |

---

## System flow

```mermaid
flowchart TD
    A["LoCAL focal point\nsends email with link"] -->|"form.html?p=guadalcanal"| B["form.html\nstatic file via Express"]

    B -->|"GET /api/province/:id\nGET /api/status/:id"| C["Express API\nserver/index.js :3002"]
    C -->|reads| D[("SQLite\nlocal.db")]

    B --> E{"PS selects\nan answer"}
    E -->|"follow-up\ncondition met"| F["Follow-up question\nrenders inline"]
    E -->|"no follow-up"| G["Result panel\nrenders inline"]
    F --> G

    G -->|"GET /api/gaps/:province/:ci"| C
    G -->|"POST /api/submit"| C
    C -->|"INSERT INTO submissions"| D
    C -->|"gws sheets append\n(fire-and-forget)"| H[("Google Sheets\nSubmissions tab")]

    I["nginx\nport 80/443"] -->|"proxy_pass"| C
    J["PM2"] -->|"keeps alive"| C
```

---

## Check-in schedule

Nine check-ins spread across the April → March fiscal year. CI-8 fires quarterly.

| Month | Check-in | Topic | PMs covered |
|-------|---------|-------|------------|
| April | CI-1 | Is CCARRO in post? | PM 12 |
| April, Jul, Oct, Jan | CI-8 | Quarterly PBCRG report submitted? | PM 16 |
| June | CI-2 | CC awareness sessions held? | PM 14, 15 |
| July | CI-3 | Climate data in PG database? | PM 1, 2 |
| August | CI-4 | APA documentation reminder *(no reply needed)* | — |
| September | CI-9 | PBCRG utilisation over 75%? | PM 17, 18 |
| October | CI-5 | Planning season — NDPs, ACCAF, land-use plan | PM 3–9 |
| December | CI-6 | Mid-planning check | PM 4, 5, 10, 11 |
| February | CI-7 | Engineer sign-off + tender documents ready? | PM 9, 13 |

**Check-in types:**
- `activity-linked` (8 of 9): asks a question, returns a personalised response.
- `activity-agnostic` (CI-4 only): one-way documentation reminder, no question.

**Completion model:** check-ins are cumulative, not monthly resets. Once a province gives the required positive answer, that check-in is marked done and greys out. `/api/status/:province_id` tracks this.

---

## Database — core tables

The tables that hold all reference data and drive the form.

```mermaid
erDiagram
    provinces {
        TEXT id PK "slug: guadalcanal"
        TEXT name
        TEXT code "GP, TP, WP..."
        INTEGER current_score "FY 2024/25 APA total"
        INTEGER exp_weight "score squared"
    }
    pms {
        INTEGER pm_number PK "1-18"
        TEXT theme "A-H"
        TEXT theme_name
        TEXT label
        INTEGER max_score "5 for most, 7/10/8 for PM16/17/18"
    }
    sub_indicators {
        TEXT id PK "1a, 1b, 2a..."
        INTEGER pm_number FK
        TEXT label
        INTEGER max_score
    }
    province_scores {
        TEXT province_id FK
        TEXT sub_indicator FK
        INTEGER score "FY 2024/25 APA result"
    }
    checkins {
        INTEGER id PK "1-9"
        TEXT trigger_month "April, June..."
        TEXT type "activity-linked or activity-agnostic"
        TEXT question_tmpl "NULL for CI-4"
        INTEGER weeks_to_apa
    }
    checkin_pms {
        INTEGER checkin_id FK
        INTEGER pm_number FK
    }
    checkin_options {
        INTEGER id PK
        INTEGER checkin_id FK
        TEXT value "YES, BOTH, NONE..."
        TEXT label "button text"
        INTEGER sort_order
    }

    provinces ||--o{ province_scores : "has scores"
    sub_indicators ||--o{ province_scores : "scored in"
    pms ||--o{ sub_indicators : "has sub-indicators"
    checkins ||--o{ checkin_pms : "covers PMs"
    pms ||--o{ checkin_pms : "covered in"
    checkins ||--o{ checkin_options : "has answer options"
```

---

## Database — response and submission tables

The tables for content (mostly not yet seeded — see [Data Model](./DATA_MODEL.md)) and the live submissions log.

```mermaid
erDiagram
    response_templates {
        INTEGER id PK
        INTEGER checkin_id FK
        TEXT answer_value "matches checkin_options.value"
        TEXT province_id FK "NULL = default for all"
        INTEGER has_followup "1 = show follow-up"
        TEXT followup_q
        TEXT response_tmpl
        TEXT grant_impact
    }
    followup_options {
        INTEGER id PK
        INTEGER response_template_id FK
        TEXT value "YES, NOT_YET..."
        TEXT label
    }
    followup_responses {
        INTEGER id PK
        INTEGER response_template_id FK
        TEXT followup_value
        TEXT province_id FK "NULL = default"
        TEXT response_tmpl
    }
    reminders {
        INTEGER id PK
        INTEGER checkin_id FK
        TEXT pm_ref "PM#14, Deadline..."
        INTEGER pts
        TEXT body
    }
    province_priorities {
        INTEGER id PK
        TEXT province_id FK
        INTEGER pm_number FK
        TEXT label
        INTEGER pts
        TEXT timing "Now, Planning season..."
        TEXT action
    }
    submissions {
        INTEGER id PK
        TEXT province_id FK
        INTEGER checkin_id FK
        TEXT answer_value
        TEXT followup_value
        TEXT submitted_at "UTC datetime"
        TEXT ip_hash
    }

    response_templates ||--o{ followup_options : "leads to"
    response_templates ||--o{ followup_responses : "branches into"
```

---

## Scoring and grant impact

APA scores run 0–100. Each province's share of the PBCRG grant pool is proportional to `score²`.

```mermaid
flowchart LR
    Score["Province earns\nAPA score\n0 – 100 pts"] --> Weight["Grant weight\n= score²"]
    Weight --> Share["Grant share\n= own weight\n÷ sum of all\n9 province weights"]

    subgraph Why_it_matters["Why every point matters"]
        Ex1["Score 33 → weight 1089"]
        Ex2["Score 38 → weight 1444"]
        Ex3["+5 pts = +33% more grant\nfor a 15% score increase"]
        Ex1 --> Ex2 --> Ex3
    end
```

**Current weights (FY 2024/25 APA):**

| Province | Score | Weight | % of pool |
|----------|-------|--------|-----------|
| Makira & Ulawa | 39 | 1521 | 14.7% |
| Guadalcanal | 37 | 1369 | 13.2% |
| Isabel | 35 | 1225 | 11.8% |
| Western | 34 | 1156 | 11.2% |
| Malaita | 34 | 1156 | 11.2% |
| Temotu | 33 | 1089 | 10.5% |
| Choiseul | 33 | 1089 | 10.5% |
| Central Islands | 33 | 1089 | 10.5% |
| Rennell & Bellona | 24 | 576 | 5.6% |
| **Total** | | **10270** | **100%** |

---

## Data flow — a single form submission

```
1. Focal point sends email:
      "Hi [PS], please complete your June check-in:"
      https://pcdftracker.com/form.html?p=guadalcanal

2. PS clicks → browser loads form.html

3. form.html fires two parallel API calls:
      GET /api/province/guadalcanal  → scores, sub_scores, pm_totals
      GET /api/status/guadalcanal    → done/pending status for all 9 CIs

4. Page renders:
      Province header (name, score badge, weight)
      9 check-in rows — green tick, amber dot, or grey lock

5. PS clicks a check-in row → question panel expands
      (CI-4 skips to result immediately)

6. PS selects an answer:
      If a follow-up condition is met → follow-up question renders
      Otherwise → finaliseCI() runs

7. finaliseCI():
      GET /api/gaps/guadalcanal/2    → PM-level gaps for this CI
      POST /api/submit               → logs the submission (fire-and-forget)
      CI_META[2].response(...)       → runs the hardcoded response function
      Renders: status tag | guidance text | PM gap list | grant impact bar

8. SQLite: INSERT INTO submissions
   Google Sheets: row appended to Submissions tab via gws CLI
```

---

## What is NOT yet built

| Item | Current state | Blocking? |
|------|--------------|-----------|
| `response_templates` DB content | Lives as JS in `form.html` CI_META | Not blocking — form works |
| `reminders` / `province_priorities` content | Tables empty | Not blocking — hardcoded in form |
| PS email addresses | NULL for all 9 | Blocking automated sends |
| Automated email sending | Manual only | Planned feature |
| SSL certificate | DNS not yet propagated | Site accessible via IP |
| PBCRG pool size (SBD) | Unknown | Grant impact shows multiplier only |
