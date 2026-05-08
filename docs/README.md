# LoCAL Check-in Agent — Documentation

The check-in agent sends periodic prompts to the nine Provincial Secretaries of Solomon Islands, collects a short form response, and shows each PS a personalised action plan. The goal: nudge provinces toward the specific activities that earn APA marks. Because each province's grant share is proportional to `score²`, every point gained compounds in dollar value.

**Live URL:** https://pcdftracker.com (DNS pending — accessible at http://167.86.93.243:3002)
**Repo:** https://github.com/zvtate/local-checkin-agent

---

## Read these docs in this order

| Doc | What you'll learn | Read if you're... |
|-----|------------------|-------------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System components, check-in schedule, ER diagrams, scoring formula, data flow | Getting oriented |
| [DATA_MODEL.md](./DATA_MODEL.md) | Every SQLite table — fields, row counts, seeding status, key queries | Touching the database |
| [API.md](./API.md) | Every endpoint — method, params, request/response shapes, edge cases | Building or debugging |
| [RUNBOOK.md](./RUNBOOK.md) | Start/stop, re-seed, nginx, SSL, deploy a code change | Operating the server |
| [APA_COMPLIANCE_LOGIC.md](./APA_COMPLIANCE_LOGIC.md) | All 18 PMs, per-province scores, check-in message templates, grant impact tables | Understanding the programme logic |

---

## System status (May 2026)

### Live and working
- `form.html` — check-in dashboard at `form.html?p=<province-slug>`
- `server/index.js` — Express API, port 3002, PM2 process `local-checkin`
- `server/local.db` — SQLite, fully seeded (provinces, PMs, 279 scores, check-in definitions)
- nginx — port 80 → port 3002
- Google Sheets sync — submissions appended on every POST `/api/submit`

### Pending
| Item | Blocker |
|------|---------|
| SSL certificate | DNS propagation for pcdftracker.com |
| PS names and emails | Must be entered manually before automated sends |
| `response_templates` in DB | Currently hardcoded as JS in `form.html` CI_META |
| Automated email sends | PS email addresses needed first |
| PBCRG pool size (SBD) | Needed to show concrete dollar amounts in grant impact |

---

## Province URLs (send these in check-in emails)

| Province | URL |
|----------|-----|
| Guadalcanal | `https://pcdftracker.com/form.html?p=guadalcanal` |
| Malaita | `https://pcdftracker.com/form.html?p=malaita` |
| Western | `https://pcdftracker.com/form.html?p=western` |
| Isabel | `https://pcdftracker.com/form.html?p=isabel` |
| Makira & Ulawa | `https://pcdftracker.com/form.html?p=makira-ulawa` |
| Temotu | `https://pcdftracker.com/form.html?p=temotu` |
| Choiseul | `https://pcdftracker.com/form.html?p=choiseul` |
| Central Islands | `https://pcdftracker.com/form.html?p=central-islands` |
| Rennell & Bellona | `https://pcdftracker.com/form.html?p=rennell-bellona` |
