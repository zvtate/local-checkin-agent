# LoCAL Check-in Agent — Documentation

The LoCAL Check-in Agent sends periodic prompts to the nine Provincial Secretaries of Solomon Islands, collects a short response via a mobile-friendly web form, and immediately shows each PS a personalised action plan. The goal is to nudge provinces toward the specific activities that determine their Annual Performance Assessment (APA) score — which is squared before being used to allocate UNCDF climate finance grants (PBCRG), so every point gained compounds. The system covers all 18 Performance Measures across 9 check-in touchpoints spread through the April–March fiscal year.

Live URL (pending DNS): **https://pcdftracker.com**

GitHub repo: [https://github.com/zvtate/local-checkin-agent](https://github.com/zvtate/local-checkin-agent)

---

## Documents

| File | Contents | For |
|---|---|---|
| [API.md](./API.md) | Every endpoint in `server/index.js`: method, path, params, request body, response shape, edge cases | Developer |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System flow diagram, component table, database ER diagram, check-in schedule (Gantt), scoring logic, data flow, open items | Developer |
| [DATA_MODEL.md](./DATA_MODEL.md) | SQLite table-by-table reference, seeding status, score data notes, key API queries | Developer |
| [RUNBOOK.md](./RUNBOOK.md) | How to start/stop/restart, re-seed, configure nginx, renew SSL, add a check-in, update PS names | Operator |
| [APA_COMPLIANCE_LOGIC.md](./APA_COMPLIANCE_LOGIC.md) | Full business-logic spec: all 18 PM definitions with sub-indicator scoring, per-province scores (FY 2024/25), per-province gap analysis, check-in messages with decision trees | Programme staff, developer |

---

## Current status

### What is live

- `form.html` — the check-in dashboard. Served at `https://pcdftracker.com/form.html?p=<province-slug>`. Renders all 9 check-ins as a tracker list, opens inline question panels, shows personalised results with gap analysis and grant impact.
- `server/index.js` — Express API on port 3002. All 7 endpoints working. PM2 process name: `local-checkin`.
- `server/local.db` — SQLite database. Fully seeded with provinces, PMs, sub-indicators, FY 2024/25 scores, check-in definitions, and answer options.
- nginx reverse proxy: port 80 → port 3002.

### What is pending

| Item | Status |
|---|---|
| Domain / SSL | pcdftracker.com purchased; DNS propagation pending; SSL cert to be issued via certbot once DNS resolves |
| PS email addresses | `ps_name` NULL for all 9 provinces — must be filled before automated sending |
| `response_templates` content | Response text lives in `form.html` JS (`CI_META`), not in the database |
| `reminders` / `province_priorities` content | Tables exist in schema, no rows seeded |
| Email sending | Manual only — focal point composes and sends; no automated scheduled send |
| Google Sheets sync | No sync between `submissions` table and any external spreadsheet |
| PBCRG disbursement date | Check-ins 8 and 9 activate only once grants are disbursed |
| PBCRG pool size (SBD) | Needed to make grant impact figures concrete |

---

## Quick orientation

**How to access the form:** `https://pcdftracker.com/form.html?p=guadalcanal`

Valid province slugs: `guadalcanal`, `temotu`, `rennell-bellona`, `western`, `choiseul`, `malaita`, `central-islands`, `isabel`, `makira-ulawa`

**How the form works:**
1. Loads province data and check-in status from the API.
2. Shows all 9 check-ins as a list with done/pending status.
3. PS clicks a check-in → inline question panel opens.
4. PS selects answer → follow-up question if applicable → result panel shows guidance, gap analysis, grant impact bar.
5. Submission is logged to `server/local.db`.

**How to restart the server after a change:**
```bash
pm2 restart local-checkin
```

**How to re-seed the database:**
```bash
cd /home/zoe/Projects/LoCAL/checkin-agent/server && node seed.js
```

See [RUNBOOK.md](./RUNBOOK.md) for full operational instructions.
