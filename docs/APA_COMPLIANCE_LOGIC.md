# APA Compliance Agent — Logic Document
**LoCAL Solomon Islands | PBCRG Performance Support**
*Draft v0.4 — May 2026*

---

## Purpose

This document defines the logic for an AI agent that helps Provincial Governments (PGs) in Solomon Islands maximise their LoCAL APA scores and thereby their PBCRG grant allocations. The agent sends proactive, scheduled messages to the **Provincial Secretary** of each province, asks a short diagnostic question, and returns concise advice calibrated to the financial stakes.

**Scope:** LoCAL CCA performance measures only (PMs #1–18, 100 points total). General PCDF measures are a separate system not covered here.

---

## Key Facts the Agent Must Know

### Grant formula
- **LoCAL PBCRG = 50% weight from general PCDF PMs + 50% weight from LoCAL CCA PMs**
- This agent covers the CCA component (PMs #1–18, 100 points)
- Improving CCA scores directly increases the 50% LoCAL component of the PBCRG allocation

### The exponential scoring rule — lead with this every time
Scores are applied **exponentially (score × score)** before being weighted into grant allocations. This is not a linear relationship:

| Your CCA score | Exponential weight | vs. average (33.5 pts) |
|---|---|---|
| 24 pts (RBP, lowest) | 576 | 0.5× the average province |
| 33.5 pts (average) | 1,122 | baseline |
| 37 pts (GP, highest) | 1,369 | 1.2× the average |
| 55 pts (achievable) | 3,025 | 2.7× the average |
| 75 pts (high performance) | 5,625 | 5.0× the average |

**The message:** Rennell & Bellona at 24 points receives roughly half the grant weight of Guadalcanal at 37 — despite a gap of only 13 points. Moving from 33 to 55 points nearly triples a province's share of the performance pool. Every sub-indicator missed is a compounding loss.

### Fiscal year and assessment calendar
- **FY:** 1 April – 31 March
- **Planning season:** November – January
- **Budget deadline:** 31 March (PG Assembly approval + submission to MPGIS)
- **APA window:** August – October (currently January–March due to scheduling delays)
- **Grant figures announced:** Late November / early December

### 2024/25 baseline scores (FY 2024/25 APA, conducted Jan–Mar 2026)

| Province | Score /100 | vs. FY23/24 | Exponential weight |
|---|---|---|---|
| Makira & Ulawa | 39 | +10 | 1,521 |
| Guadalcanal | 37 | +9 | 1,369 |
| Isabel | 35 | +11 | 1,225 |
| Western | 34 | +6 | 1,156 |
| Malaita | 34 | +6 | 1,156 |
| Temotu | 33 | +4 | 1,089 |
| Choiseul | 33 | +8 | 1,089 |
| Central Islands | 33 | +10 | 1,089 |
| Rennell & Bellona | 24 | +1 | 576 |
| **System average** | **33.5** | **+7.2** | **1,122** |

---

## Per-Province Sub-Indicator Scores — FY 2024/25

*Extracted from the 2026-2027 Consolidated Assessment Report (the endorsed scoring system). Province codes: GP=Guadalcanal, TP=Temotu, RBP=Rennell & Bellona, WP=Western, CP=Choiseul, MP=Malaita, CIP=Central Islands, IP=Isabel, MUP=Makira & Ulawa.*

*Two errors were found in the source document and corrected below:*
*(1) RBP PM#9 sub-total shows 2 in the document but 9a(2)+9b(1)=3; Theme B=21 and total=24 both require PM9=3.*
*(2) GP PM#14 sub-total shows 1 in the document but the indicator row shows 0; Theme F=1 for GP (PM14=0+PM15=1) and total=37 both require PM14=0.*

### Theme A — Data & Pre-Planning (max 10)

| Sub-indicator | Max | GP | TP | RBP | WP | CP | MP | CIP | IP | MUP |
|---|---|---|---|---|---|---|---|---|---|---|
| 1a Temperature & rainfall data ≥10 yrs | 2 | 2 | 2 | 0 | 0 | 2 | 2 | 2 | 0 | 2 |
| 1b Additional hazard data ≥10 yrs | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1c Trend analysis: temperature & rainfall | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1d Trend analysis: flood/landslide/wind/SLR | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **PM#1 sub-total** | **5** | **5** | **2** | **0** | **0** | **2** | **2** | **2** | **0** | **3** |
| 2a Vulnerability & exposure data collected/reviewed | 3 | 1 | 0 | 0 | 0 | 0 | 3 | 3 | 0 | 3 |
| 2b CRA exists and used to inform planning | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **PM#2 sub-total** | **5** | **3** | **0** | **0** | **0** | **0** | **3** | **3** | **0** | **3** |
| **Theme A total** | **10** | **8** | **2** | **0** | **0** | **2** | **5** | **5** | **0** | **6** |

### Theme B — Climate Change Planning (max 35)

| Sub-indicator | Max | GP | TP | RBP | WP | CP | MP | CIP | IP | MUP |
|---|---|---|---|---|---|---|---|---|---|---|
| 3a CC discussed with citizens in planning | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 3b CC discussed with vulnerable groups | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 3c CC risks in vulnerable sectors discussed | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| **PM#3 sub-total** | **5** | **3** | **3** | **3** | **3** | **3** | **3** | **3** | **3** | **3** |
| 4a CC mainstreamed in rolling 3-yr plan | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| 4b Links to National Development Strategy 2016-2035 | 2 | 0 | 2 | 0 | 0 | 0 | 2 | 0 | 0 | 0 |
| 4c Links to National Climate Change Policy | 1 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| **PM#4 sub-total** | **5** | **2** | **4** | **2** | **3** | **2** | **4** | **2** | **2** | **2** |
| 5a Adaptation priority statements in ACCAF | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 5b Priority statements underpinned by CRA/climate data | 2 | 0 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| 5c Priority statements used to justify project selection | 2 | 2 | 2 | 0 | 2 | 0 | 2 | 2 | 2 | 2 |
| **PM#5 sub-total** | **5** | **3** | **5** | **3** | **5** | **3** | **5** | **5** | **5** | **5** |
| 6 Links between CRA and rolling plan (all funding sources) | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **PM#6 sub-total** | **5** | **0** | **0** | **0** | **0** | **0** | **0** | **0** | **0** | **0** |
| 7a Adaptation rationale in ACCAF Column J (all projects) | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| 7b M&E outcome/output indicators in ACCAF Cols L–W | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| **PM#7 sub-total** | **5** | **5** | **5** | **5** | **5** | **5** | **5** | **5** | **5** | **5** |
| 8a Intervention description in ACCAF Cols I–S | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| 8b Additional CC-proofing costs in ACCAF Cols AD–AG | 3 | 3 | 3 | 3 | 3 | 3 | 0 | 3 | 3 | 3 |
| **PM#8 sub-total** | **5** | **5** | **5** | **5** | **5** | **5** | **2** | **5** | **5** | **5** |
| 9a Engineer signed off design reports (CC risk certified) | 3 | 1 | 0 | 2 | 1 | 2 | 0 | 0 | 2 | 2 |
| 9b Design issues, standards, resilience recorded in writing | 2 | 1 | 0 | 1 | 2 | 2 | 0 | 0 | 1 | 0 |
| **PM#9 sub-total** | **5** | **2** | **0** | **3*** | **3** | **4** | **0** | **0** | **3** | **2** |
| **Theme B total** | **35** | **20** | **22** | **21** | **24** | **22** | **19** | **20** | **23** | **22** |

*\* RBP PM#9 sub-total in source document incorrectly shows 2; corrected to 3 (9a=2+9b=1).*

### Theme C — Targeting (max 10)

| Sub-indicator | Max | GP | TP | RBP | WP | CP | MP | CIP | IP | MUP |
|---|---|---|---|---|---|---|---|---|---|---|
| 10 Vulnerable groups identified in ACCAF Cols I,J,V,W | 5 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| 11 CC outcomes in overall development budget (non-PBCRG) | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Theme C total** | **10** | **3** | **3** | **3** | **3** | **3** | **3** | **3** | **3** | **3** |

### Theme D — Human Resources (max 5)

| Sub-indicator | Max | GP | TP | RBP | WP | CP | MP | CIP | IP | MUP |
|---|---|---|---|---|---|---|---|---|---|---|
| 12 Named CC Focal Point with task description & budget | 5 | 5 | 5 | **0** | 5 | 5 | 5 | 5 | 5 | 5 |
| **Theme D total** | **5** | **5** | **5** | **0** | **5** | **5** | **5** | **5** | **5** | **5** |

*RBP is the only province without a CC Focal Point — this is a structural block on multiple measures.*

### Theme E — Procurement (max 5)

| Sub-indicator | Max | GP | TP | RBP | WP | CP | MP | CIP | IP | MUP |
|---|---|---|---|---|---|---|---|---|---|---|
| 13 CC clause in all PBCRG procurement/tender documents | 5 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 3 | 3 |
| **Theme E total** | **5** | **0** | **0** | **0** | **0** | **1** | **0** | **0** | **3** | **3** |

### Theme F — Climate Change Awareness (max 10)

| Sub-indicator | Max | GP | TP | RBP | WP | CP | MP | CIP | IP | MUP |
|---|---|---|---|---|---|---|---|---|---|---|
| 14 Staff trained/sensitised on CC adaptation | 5 | 0* | 0 | 0 | 1 | 0 | 1 | 0 | 0 | 0 |
| 15 Community meetings on CC adaptation (with records) | 5 | 1 | 1 | 0 | 1 | 0 | 1 | 0 | 1 | 0 |
| **Theme F total** | **10** | **1** | **1** | **0** | **2** | **0** | **2** | **0** | **1** | **0** |

*\* GP PM#14 sub-total in source document incorrectly shows 1; corrected to 0 (indicator row=0; Theme F=1 = PM14(0)+PM15(1)).*

### Themes G & H — Accountability and Use of Funds (max 25)

All provinces scored 0 on PM#16, PM#17, PM#18 — grants have not yet been disbursed.

| PM | Max | All provinces |
|---|---|---|
| 16 Quarterly PBCRG utilisation reports on time | 7 | 0 |
| 17 PBCRG funds spent (utilisation level) | 10 | 0 |
| 18 PBCRG projects executed as planned | 8 | 0 |

---

## Per-Province Gap Analysis (FY 2025/26 targets)

*For each province: current score, sub-indicators already achieved, sub-indicators to target. "Quick wins" are document/admin fixes achievable without new activities.*

### Guadalcanal — 37/100

**Achieved:** Full PM#1 (5/5, only province with complete met data), PM#2b (2/2), PM#7 (5/5), PM#8 (5/5), PM#12 (5/5).

**Key gaps:**
- PM#2a: scored 1/3 (partial vulnerability data — needs full SIIVA/iPLAN review)
- PM#3b: 0/2 — no documented outreach to vulnerable groups
- PM#4b: 0/2 — no NDS reference (TP and MP scored this; it is a single sentence addition)
- PM#4c: 0/1 — no NCCP reference (WP scored this)
- PM#5b: 0/2 — **GP is the only province that missed this** — priority statements not linked to PM#1 climate data
- PM#9: 2/5 — engineer sign-off partial (9a=1/3, 9b=1/2)
- PM#10: 3/5 — partial vulnerable group identification
- PM#13: 0/5 — no CC tender clause
- PM#14: 0/5 — no staff awareness session
- PM#15: 1/5 — partial community meetings

**Quick wins this cycle (≈+12 pts):** PM#4b(+2), PM#4c(+1), PM#5b(+2), PM#13(+5) → brings to ~49. Add PM#14+15 for 9 more → ~58.

---

### Temotu — 33/100

**Achieved:** PM#4b (2/2 — NDS reference), PM#5b (2/2), PM#5c (2/2), PM#7 (5/5), PM#8 (5/5), PM#12 (5/5).

**Key gaps:**
- PM#1: 2/5 — only 1a scored; missing 1b (hazard data), 1c (trend analysis), 1d
- PM#2: 0/5 — no vulnerability data, no CRA
- PM#3b: 0/2
- PM#4c: 0/1 — no NCCP reference
- PM#9: **0/5** — entire PM missed; Provincial Engineer has not signed off any designs
- PM#10: 3/5
- PM#13: 0/5 — no CC tender clause
- PM#14: 0/5
- PM#15: 1/5

**Quick wins this cycle (≈+9 pts):** PM#4c(+1), PM#9(up to +5), PM#13(+5) → brings to ~42. Add PM#14+15 for up to 9 more → ~51.
**PM#9 is the biggest structural gap** — requires the Provincial Engineer to formally review and document all PBCRG project designs.

---

### Rennell & Bellona — 24/100 (lowest)

**Achieved:** PM#7 (5/5), PM#8 (5/5). Partial on PM#9 (3/5).

**Critical structural issue: PM#12 = 0/5 — no CC Focal Point.** This must be the first action — without a designated CCARRO, every downstream PM is harder to achieve.

**Key gaps:**
- PM#1: 0/5 — no met data at all
- PM#2: 0/5 — no CRA
- PM#3b: 0/2
- PM#4b: 0/2 — no NDS reference
- PM#4c: 0/1
- PM#5c: 0/2 — priority statements not used in project selection
- PM#10: 3/5
- PM#12: **0/5 — no CC Focal Point** (only province)
- PM#13: 0/5
- PM#14: 0/5
- PM#15: 0/5

**Priority sequencing:** (1) Designate CC Focal Point in writing (+5). (2) PM#4b, 4c (+3). (3) PM#5c (+2). (4) PM#13 (+5). (5) PM#14+15 (+10). That alone adds 25 points → score 49, exponential weight 2,401 (vs 576 now — 4× increase).

---

### Western — 34/100

**Achieved:** PM#4c (1/1 — only province with NCCP reference), PM#5 (5/5), PM#7 (5/5), PM#8 (5/5), PM#9 (3/5 — full 9b), PM#12 (5/5).

**Key gaps:**
- PM#1: 0/5 — no met data
- PM#2: 0/5 — no CRA
- PM#3b: 0/2
- PM#4b: 0/2 — no NDS reference
- PM#10: 3/5
- PM#13: 0/5
- PM#14: 1/5
- PM#15: 1/5

**Quick wins this cycle (≈+9 pts):** PM#4b(+2), PM#13(+5) → brings to ~41. Add PM#14+15 for up to 8 more → ~49.
WP is already the highest Theme B scorer (24/35) — further gains require met data (PM#1) or the CRA (PM#2).

---

### Choiseul — 33/100

**Achieved:** PM#1a (2/2), PM#5b (2/2), PM#7 (5/5), PM#8 (5/5), PM#9 (4/5 — near-full), PM#12 (5/5).

**Key gaps:**
- PM#1b/1c/1d: 0/3 (hazard data and trend analysis)
- PM#2: 0/5
- PM#3b: 0/2
- PM#4b: 0/2
- PM#4c: 0/1
- PM#5c: 0/2 — priority statements not used in project selection
- PM#10: 3/5
- PM#13: 1/5 — partial (only province with any score below IP/MUP level; some CC language in some tenders)
- PM#14: 0/5
- PM#15: 0/5

**Quick wins this cycle (≈+10 pts):** PM#4b(+2), PM#4c(+1), PM#5c(+2), PM#13(+4 more) → brings to ~43. Add PM#14+15 for +10 → ~53.
CP's PM#9 at 4/5 is the second-best result system-wide — close to full marks.

---

### Malaita — 34/100

**Achieved:** PM#2a (3/3 — full vulnerability data), PM#4b (2/2 — NDS reference), PM#5 (5/5), PM#7 (5/5), PM#12 (5/5).

**Key gaps:**
- PM#1b/1c/1d: 0/3
- PM#2b: 0/2 — no CRA
- PM#3b: 0/2
- PM#4c: 0/1
- PM#8b: **0/3 — only province that missed PM#8b** (CC-proofing cost documentation)
- PM#9: **0/5** — entire PM missed (same as TP)
- PM#10: 3/5
- PM#13: 0/5
- PM#14: 1/5
- PM#15: 1/5

**Quick wins this cycle (≈+13 pts):** PM#8b(+3), PM#4c(+1), PM#9(up to +5), PM#13(+5) → brings to ~47. Add PM#14+15 for up to 8 more → ~55.
**PM#8b is the most surprising gap** — every other province scored this. Check that ACCAF Cols AD–AG have been populated with cost estimates. One ACCAF session fixes this.

---

### Central Islands — 33/100

**Achieved:** PM#2a (3/3 — full vulnerability data), PM#5 (5/5), PM#7 (5/5), PM#8 (5/5), PM#12 (5/5).

**Key gaps:**
- PM#1b/1c/1d: 0/3
- PM#2b: 0/2 — no CRA
- PM#3b: 0/2
- PM#4b: 0/2
- PM#4c: 0/1
- PM#9: **0/5** — entire PM missed
- PM#10: 3/5
- PM#13: 0/5
- PM#14: 0/5
- PM#15: 0/5

**Quick wins this cycle (≈+13 pts):** PM#4b(+2), PM#4c(+1), PM#9(up to +5), PM#13(+5) → brings to ~46. Add PM#14+15 for +10 → ~56.
**CIP, TP, and MP all score PM#9 = 0** — Provincial Engineers are not signing off designs with climate rationale. This is a systemic issue in these three provinces.

---

### Isabel — 35/100

**Achieved:** PM#5 (5/5), PM#7 (5/5), PM#8 (5/5), PM#9 (3/5), PM#12 (5/5), PM#13 (3/5 — second-highest on procurement).

**Key gaps:**
- PM#1: 0/5 — no met data
- PM#2: 0/5 — no CRA
- PM#3b: 0/2
- PM#4b: 0/2
- PM#4c: 0/1
- PM#9b: 1/2 (partial — design records incomplete)
- PM#10: 3/5
- PM#13: 3/5 — 2 more points available (some tenders missing CC clause)
- PM#14: 0/5
- PM#15: 1/5

**Quick wins this cycle (≈+10 pts):** PM#4b(+2), PM#4c(+1), PM#13(+2 more) → brings to ~40. Add PM#14+15 for +9 → ~49.
IP already scores PM#13 at 3/5 — completing the standard CC clause across all tender documents closes the remaining 2 points.

---

### Makira & Ulawa — 39/100 (highest)

**Achieved:** PM#2a (3/3 — full vulnerability data), PM#5 (5/5), PM#7 (5/5), PM#8 (5/5), PM#12 (5/5), PM#13 (3/5), PM#1c (1/1 trend analysis).

**Key gaps:**
- PM#1b: 0/1, PM#1d: 0/1 (hazard data and trend analysis missing)
- PM#2b: 0/2 — no CRA
- PM#3b: 0/2
- PM#4b: 0/2
- PM#4c: 0/1
- PM#9a: 2/3, PM#9b: 0/2 — design sign-off partial; no written design records
- PM#10: 3/5
- PM#13: 3/5 — 2 more points available
- PM#14: 0/5
- PM#15: 0/5

**Quick wins this cycle (≈+12 pts):** PM#4b(+2), PM#4c(+1), PM#9b(+2), PM#13(+2) → brings to ~46. Add PM#14+15 for +10 → ~56.
MUP starts from the highest base — reaching 56+ would give exponential weight of 3,136 vs 1,521 now, more than doubling its grant share.

---

## The 18 Performance Measures — Full Sub-Indicator Detail

**Scoring is NOT binary.** Each PM has sub-indicators with partial marks. The agent must know exactly which sub-indicators a province is missing so advice is specific, not generic.

### Theme A — Data and Pre-Planning Support (max 10 pts)

**PM#1 — Meteorological data (max 5 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| 1a | Temperature and rainfall data for ≥10 years collected and stored in PG database | 2 |
| 1b | Additional data (flood, landslide, wind, sea level rise) for ≥10 years stored in PG database | 1 |
| 1c | PG analysis of trends for temperature and rainfall — charts or tables showing ≥10 year trends | 1 |
| 1d | PG analysis of trends for flood, landslide, wind, sea level rise | 1 |

*GP scored all sub-indicators (5/5). MUP scored 1a and 1c. TP, CP, MP, CIP scored 1a only. WP, RBP, IP scored 0 — no met data at all. Gap: request temperature/rainfall data from SI Met Services, then prepare trend charts in Excel from the dataset.*

**PM#2 — Climate Risk Assessment (max 5 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| 2a | Vulnerability and exposure data collected or reviewed annually (using SIIVA, iPLAN, or equivalent) | 3 |
| 2b | CRA exists and is used to inform planning and budgeting decisions — updated annually | 2 |

*GP scored 2b (2/2) with a partial 2a (1/3). MP, CIP, MUP scored full 2a (3/3) but missed 2b. TP, RBP, WP, CP, IP scored 0 on both — no vulnerability data and no CRA. 2b (CRA informing planning decisions) remains a near-universal gap — only GP achieved it.*

---

### Theme B — Climate Change Planning (max 35 pts)

**PM#3 — Involvement in CC-related planning (max 5 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| 3a | PG discussed CC issues and risks with citizens as part of the planning process (records of meetings) | 1 |
| 3b | PG discussed CC risks specifically with vulnerable groups (women, youth, people with disability) | 2 |
| 3c | PG discussed CC risks in relation to vulnerable sectors and exposed areas with citizens | 2 |

*All 9 provinces scored 3a (1/1) and 3c (2/2). 3b is a universal gap (0/9 provinces) — specific outreach to vulnerable groups is not being documented with disaggregated attendance records.*

**PM#4 — Mainstreaming CC in annual plans (max 5 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| 4a | CC interventions mainstreamed in annual updates to the rolling three-year plan (using CRA or other evidence) | 2 |
| 4b | Annual plan updates linked explicitly to the National Development Strategy 2016–2035 | 2 |
| 4c | Annual plan updates consistent with the National Climate Change Policy | 1 |

*All 9 provinces scored 4a (2/2). 4b: only TP and MP scored (2/2); 7 provinces at 0. 4c: only WP scored (1/1); 8 provinces at 0. This is a document-writing gap — PBCRG projects simply need to reference the NDS 2016-2035 and NCCP by name. Use TP and MP's plan text as a template.*

**PM#5 — Adaptation priority statements (max 5 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| 5a | 3–5 adaptation priority statements developed in ACCAF (LALAP tab) | 1 |
| 5b | Priority statements underpinned by CRA data or climate risk data from PM#1 | 2 |
| 5c | Priority statements used to justify project selection in annual plan | 2 |

*All 9 provinces scored 5a (1/1). 5b: 8/9 scored 2/2 — only GP missed (priority statements not linked to climate data). 5c: 7/9 scored 2/2 — RBP and CP missed (priority statements not carried through to project selection in the plan).*

**PM#6 — Linkage between CRA and rolling plan (max 5 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| Single | Documented links between CRA (or climate risk data) and annual plan project selection **from ALL funding sources** — not just PBCRG | 5 |

*Consistently scored 0 across all provinces. The requirement covers non-PBCRG projects too — this is the stretch goal. Until a full CRA is in place, provinces can use climate risk data from PM#1 as the evidence base.*

**PM#7 — Project rationale (max 5 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| 7a | Adaptation rationale completed in Column J of ACCAF Data Tracker for every PBCRG-funded project | 3 |
| 7b | Adaptation outcome and output indicators completed in Columns L–W of ACCAF Tracker for every project | 2 |

*All 9 provinces scored 7a (3/3) and 7b (2/2) — PM#7 is fully achieved system-wide. This is no longer a gap.*

**PM#8 — CC profiles and project descriptions (max 5 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| 8a | ACCAF Data Tracker Columns I–S completed for all PBCRG projects (narrative, rationale) | 2 |
| 8b | Additional cost of CC-proofing documented in Columns AD–AG of ACCAF Tracker for all projects | 3 |

*All 9 provinces scored 8a (2/2). 8b: 8/9 scored 3/3 — only Malaita missed it (0/3). PM#8 is no longer a system-wide gap; Malaita's ACCAF Cols AD–AG simply need to be populated with CC-proofing cost estimates.*

**PM#9 — Screening of projects (max 5 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| 9a | Provincial Engineer has signed off all design reports for PBCRG infrastructure projects, certifying CC risk consideration | 3 |
| 9b | Design issues, standards adopted, and how resilience is incorporated are recorded in design reports | 2 |

*PM#9 has the widest variation in the system. Three provinces scored 0/5 entirely (TP, MP, CIP). CP scored 4/5 (best). WP, IP scored 3/5. RBP scored 3/5 (corrected from document's 2). GP and MUP scored 2/5. 9b (written design records) is still weak for most — WP and CP achieved it fully. Provincial Engineer engagement is the critical path.*

---

### Theme C — Targeting of Investments (max 10 pts)

**PM#10 — Targeting vulnerable groups (max 5 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| Single | Columns I, J, V, and W of ACCAF Tracker explicitly identify vulnerable beneficiaries (women, youth etc.) and explain how the project addresses their specific CC exposure | 5 |

*All 9 provinces scored 3/5 — partial across the board. The ACCAF tracker is being filled but vulnerable group identification (specific names/categories in Cols I, J, V, W) is not yet explicit enough to earn full marks.*

**PM#11 — CC in overall development budget (max 5 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| Single | Evidence that CC outcomes are being integrated broadly in the PG budget — not just PBCRG projects. Non-PBCRG projects identified and narratives added to show CC links | 5 |

*Scored 0 by almost all provinces. Requires applying CC lens to the full development budget, not just LoCAL-funded projects.*

---

### Theme D — Human Resources (max 5 pts)

**PM#12 — CC Focal Point (max 5 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| Single | Named Focal Point Person (FPP/CCARRO) with documented task description and budget allocation — including externally funded positions if fully integrated into PG planning | 5 |

*8/9 provinces scored 5/5. Exception: RBP scored 0 — no CC Focal Point at all. This is the most critical structural issue in the system and must be RBP's first priority.*

---

### Theme E — Procurement (max 5 pts)

**PM#13 — CC in procurement (max 5 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| Single (partial scoring) | CC considerations factored into procurement/tender documents for PBCRG investments. Partial marks where some but not all contracts include CC language | 5 |

*Major variation: IP=3/5, MUP=3/5, CP=1/5. Six provinces (GP, TP, RBP, WP, MP, CIP) scored 0. The template CC clause approach used by IP and MUP should be shared system-wide. Adding it to procurement documents is a one-off administrative fix.*

---

### Theme F — Climate Change Awareness (max 10 pts)

**PM#14 — Staff awareness (max 5 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| Single | Evidence PG trained and sensitised provincial staff on CC adaptation (sign-in sheets, agenda, report) | 5 |

*WP=1/5, MP=1/5; all others 0 (corrected: GP=0 not 1 as shown in source document). Very low activity system-wide. A single documented half-day session earns the full 5 points.*

**PM#15 — Citizen involvement (max 5 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| Single | Discussions/meetings with community leaders, WDCs, and citizens on CC adaptation challenges — includes gender-specific approach. Records required. | 5 |

*GP=1, TP=1, WP=1, MP=1, IP=1 (all partial); RBP=0, CP=0, CIP=0, MUP=0. Partial credit is achievable but full marks require records of meetings with disaggregated attendance. The gap is documentation, not activity — WDC meetings already happening are sufficient if properly recorded.*

---

### Theme G — Accountability and Reporting (max 7 pts)
*Activates once PBCRG grants are disbursed*

**PM#16 — Quarterly reporting (max 7 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| Proportional | All four quarterly reports on PBCRG utilisation submitted on time via ACCAF Tracker Columns X–AM. Points are proportional to number of on-time reports | 7 |

---

### Theme H — Targeting and Use of Funds (max 18 pts)
*Activates once PBCRG grants are disbursed*

**PM#17 — Utilisation level (max 10 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| Proportional | PBCRG funds spent in previous FY to deliver planned CC outputs as per ACCAF tracker and budget. Points are proportional to absorption rate | 10 |

**PM#18 — Execution as planned (max 8 pts)**

| Sub-indicator | What earns the mark | Pts |
|---|---|---|
| Proportional | PBCRG-funded CC projects completed as planned in the rolling three-year plan and budget | 8 |

---

## Where Each Province Is Leaving Points on the Table

Based on FY 2024/25 scores. **Important update from baseline:** PM#7b and PM#8b — previously identified as universal gaps — are now broadly achieved. The current highest-value gaps are different per province; use the Per-Province Gap Analysis section above for personalised advice. Below is the system-wide picture.

### Universal gaps (all 9 provinces scored 0)

| Gap | Max pts | Why it's universal |
|---|---|---|
| PM#3b: Documented outreach to vulnerable groups | 2 | Meetings happen but are not disaggregated by sex/age/disability in records |
| PM#6: CRA links to non-PBCRG project selection | 5 | Requires full CRA; none yet in place; use PM#1 data as interim evidence base |
| PM#11: CC outcomes in overall development budget | 5 | Requires applying CC lens beyond LoCAL projects — the stretch goal |
| PM#16–18: Reporting and utilisation | 25 | Grants not yet disbursed |

### Near-universal gaps (7–8 of 9 provinces scored 0)

| Gap | Provinces still missing | Max pts | Note |
|---|---|---|---|
| PM#4b: NDS 2016-2035 reference in plan | GP, RBP, WP, CP, CIP, IP, MUP (7/9) | 2 | TP and MP already scored this — copy their approach |
| PM#4c: NCCP reference in plan | GP, TP, RBP, CP, MP, CIP, IP, MUP (8/9) | 1 | Only WP scored it; one sentence fix |
| PM#5c: Priority statements used in project selection | RBP, CP (2/9) | 2 | Most now score this; RBP and CP need to connect ACCAF priorities to plan |
| PM#9: Engineer design sign-off + written records | TP, MP, CIP all 0/5; GP, MUP partial | up to 5 | Three provinces have entirely missed; Provincial Engineer engagement is critical |
| PM#13: CC clause in all tender documents | GP, TP, RBP, WP, MP, CIP all 0/5 | up to 5 | Template clause fix; IP and MUP already at 3/5 — they show it is achievable |
| PM#14: Staff CC awareness session | All except WP (1) and MP (1) | up to 5 | Half-day session with documentation |
| PM#15: Community CC meetings with records | All partial or 0 | up to 5 | WDC meetings already happening — add CC agenda item and attendance sheet |

### What has improved (no longer a gap for most)

| Formerly flagged gap | Status now |
|---|---|
| PM#7b: ACCAF M&E columns L–W | All 9 provinces scored 2/2 — fully resolved |
| PM#8b: CC-proofing costs in ACCAF Cols AD–AG | 8/9 scored 3/3; only Malaita (0) still needs this |
| PM#5b: Priority statements linked to CRA data | 8/9 scored 2/2; only Guadalcanal (0) still needs this |
| PM#7a: Adaptation rationale Column J | All 9 provinces scored 3/3 — fully resolved |

**Realistic target:** A province currently at 33 (Temotu, Choiseul, Central Islands) can reach 55–60 by addressing PM#4b/4c, PM#9, PM#13, PM#14, PM#15 — without a full CRA and without grants flowing. That moves from exponential weight 1,089 to ~3,025–3,600 — roughly **3× the grant share**.

---

## Compliance Calendar

```
APRIL        MAY–JUNE     JULY         AUG–MARCH    NOV–DEC
─────────────────────────────────────────────────────────────
FY STARTS    AWARENESS    PRE-APA      APA WINDOW   RESULTS &
─────────────────────────────────────────────────────────────
PM#12        PM#14+15     PM#1+2       Assessors    Grant
Confirm      Training:    Met data?    visit        figures
focal        done or      CRA done?    Document     announced
point        planned?                  everything

JAN–FEB      MARCH        ── Then loop back to April ──────
─────────────────────────────────────────────────────────────
PLANNING     BUDGET
SEASON       DEADLINE
PM#3–11      31 March
ACCAF use    Plan to
PM#4b,4c     MPGIS
NDS + NCCP
references
─────────────── Once PBCRG grants flowing ───────────────────
QUARTERLY    QUARTERLY    PRE-APA
PM#16        PM#16        PM#17+18
Q report     Q report     Utilisation
due          due          + execution
                          check
```

---

## Email UX Framework

### Design principles

Each check-in email has a fixed 3-part structure to keep reading time under 2 minutes and reply friction minimal:

1. **QUICK CHECK** — one question; reply options given explicitly. For activity-linked check-ins: YES triggers one follow-up question (and only one). NO/Not yet triggers action steps directly.
2. **REMINDERS** — 3–4 bullets; each cites the PM number and point value. Province-specific gaps listed at the bottom of each reminder block.
3. **GRANT IMPACT** — 1–2 sentences; specific exponential weight numbers, not generic language. Pre-computed per province.

**Two check-in types:**
- **Activity-linked** (8 of 9): A specific action either happened or did not. The quiz validates it. YES → one follow-up to check quality. NO → action steps.
- **Activity-agnostic** (1 of 9): Check-in 4 (August). A documentation reminder before the APA visit — no activity to validate, no quiz. Reminder-only format.

**Tone:** Direct and collegial. Address the Provincial Secretary by name. Never condescending. The financial stakes are stated as facts, not threats.

**Subject line pattern:** `[Province] LoCAL — [Month]: [topic] ([PM numbers], [total pts])`

---

### Grant impact reference table

Pre-computed per province for Check-in 2 (PM#14+15). Use analogous formula for other check-ins.

| Province | Score | Weight | Available from PM#14+15 | New score | New weight | Multiplier |
|---|---|---|---|---|---|---|
| Guadalcanal | 37 | 1,369 | +9 (PM14=0→5, PM15=1→5) | 46 | 2,116 | **1.55×** |
| Temotu | 33 | 1,089 | +9 (PM14=0→5, PM15=1→5) | 42 | 1,764 | **1.62×** |
| Rennell & Bellona | 24 | 576 | +10 (both at 0) | 34 | 1,156 | **2.01×** |
| Western | 34 | 1,156 | +8 (PM14=1→5, PM15=1→5) | 42 | 1,764 | **1.53×** |
| Choiseul | 33 | 1,089 | +10 (both at 0) | 43 | 1,849 | **1.70×** |
| Malaita | 34 | 1,156 | +8 (PM14=1→5, PM15=1→5) | 42 | 1,764 | **1.53×** |
| Central Islands | 33 | 1,089 | +10 (both at 0) | 43 | 1,849 | **1.70×** |
| Isabel | 35 | 1,225 | +9 (PM14=0→5, PM15=1→5) | 44 | 1,936 | **1.58×** |
| Makira & Ulawa | 39 | 1,521 | +10 (both at 0) | 49 | 2,401 | **1.58×** |

*For other check-ins: weight = score². Grant share ∝ weight / sum of all weights. One additional point at score X adds 2X+1 to a province's weight.*

---

## Check-In Messages

---

### CHECK-IN 1 — April | PM#12 — Confirm CC Focal Point
**Type:** Activity-linked | **Trigger:** 1 April

**Subject:** `[Province] LoCAL — April: confirm CC Focal Point (PM#12, 5 pts)`

---

*Dear [PS name],*

*The new fiscal year started 1 April. [Province] scored [X]/100 on last year's APA. Everything the CCARRO does this year — the planning documents, the ACCAF entries, the awareness sessions — depends on their designation being formally in place.*

**QUICK CHECK**
*Is your CC Focal Point / CCARRO still in post and formally designated for LoCAL duties this fiscal year?*
> *Reply: YES / NO / CHANGED*

---

**YES →** *(agent replies)*
> Good. One follow-up: is their designation confirmed in writing — a formal letter or task description naming LoCAL specifically, with a budget line for this FY?
>
> **YES:** Brief them now on [Province]'s specific gaps from last year's APA — these are the documentation tasks the planning season must close. [Reference Check-in 5 personalisation table for province-specific list.]
>
> **NOT YET:** Please draft the designation letter this week. A template is available from [LoCAL focal point]. This 5-point measure requires the written record — verbal designation does not score.

**NO / CHANGED →** *(agent replies)*
> PM#12 (5 pts) requires a formally designated, named officer with a written task description. Please confirm a new designation this week and notify MPGIS and UNCDF/LoCAL in writing.
>
> *Note for RBP specifically:* Rennell & Bellona scored 0 on PM#12 last year — there is currently no designated CCARRO. Without one, PM#4, #5, #7, #8, #14, and #15 are all at risk. This must be resolved before any other action.

---

**REMINDERS**
- PM#12 (5 pts): Named CCARRO, written task description referencing LoCAL, budget confirmed — externally funded positions count only if fully integrated into PG planning
- Diary now: awareness sessions (June), planning briefing (October), planning season (November–January), budget submission (31 March)
- *[Province]-specific note:* [Insert from Per-Province Gap Analysis — e.g., "Guadalcanal: brief CCARRO on PM#4b (NDS reference), PM#5b (linking priority statements to climate data), and PM#9 (engineer design sign-off)"]

**GRANT IMPACT**
> PM#12 is worth 5 points directly, but it is also the entry condition for measures worth another 25+ points. At [Province]'s current score of [X] (grant weight [X²]), losing PM#12 through a lapsed designation is the highest-cost administrative failure in the framework. The fix is a letter.

---

### CHECK-IN 2 — June | PM#14 + PM#15 — Awareness sessions
**Type:** Activity-linked | **Trigger:** 1 June

**Subject:** `[Province] LoCAL — June: CC awareness sessions (PM#14+15, up to [available] pts)`

---

*Dear [PS name],*

*[Province] scored [PM14 score]/5 on staff CC awareness (PM#14) and [PM15 score]/5 on community CC awareness (PM#15) last year. The APA window opens in approximately 8 weeks.*

**QUICK CHECK**
*Has your province held at least one CC awareness session this fiscal year — for staff or for communities?*
> *Reply: BOTH DONE / STAFF ONLY / COMMUNITY ONLY / NOT YET*

---

**BOTH DONE →** *(agent replies)*
> Good. One follow-up: are sign-in sheets, an agenda, and a brief written summary filed and ready for the assessor?
>
> **YES:** Well positioned. Ensure the community session records show participation from women and youth specifically — the assessor checks for disaggregated attendance, not just total numbers.
>
> **NOT YET:** File these records now. A session without documentation cannot score, even if it happened. A sign-in sheet and one-page summary are sufficient.

**STAFF ONLY / COMMUNITY ONLY →** *(agent replies)*
> One more session covers the remaining [5] points. A combined half-day event counts for both PM#14 and PM#15. WDC meetings already happening count — add a CC agenda item and take disaggregated attendance. Contact [LoCAL focal point] for facilitation materials.

**NOT YET →** *(agent replies)*
> Eight weeks is enough time for a combined staff + community session. That is up to [available] points in one day. Contact [LoCAL focal point] this week to confirm a date — they can provide a facilitator and materials. The session does not need to be exclusively about climate change.

---

**REMINDERS**
- PM#14 (5 pts): Documented training of PG staff on CC adaptation — sign-in sheet + agenda required; a single well-documented session earns full marks
- PM#15 (5 pts): Meeting with WDCs and community leaders on CC adaptation challenges — attendance disaggregated by sex and including youth
- WDC meetings already happening count for PM#15 — add a CC agenda item and take attendance; no separate event required
- File records before August — assessors need documentation, not verbal confirmation

**GRANT IMPACT**
> PM#14 + PM#15 = [available] points available for [Province]. Achieving both raises your score from [X] to [X+available], increasing your exponential grant weight from [X²] to [(X+available)²] — **[multiplier]× more funding from the LoCAL performance pool**. A half-day session and a sign-in sheet deliver more to [Province]'s allocation than almost any other single action before the APA.

---

### CHECK-IN 3 — July | PM#1 + PM#2 — Climate data and risk assessment
**Type:** Activity-linked | **Trigger:** 1 July

**Subject:** `[Province] LoCAL — July: climate data and risk assessment (PM#1+2, 10 pts)`

---

*Dear [PS name],*

*[Province] scored [PM1 score]/5 on meteorological data (PM#1) and [PM2 score]/5 on climate risk assessment (PM#2) last year. These 10 points underpin almost everything in Theme B.*

**QUICK CHECK**
*Is 10-year temperature and rainfall data stored in your PG database?*
> *Reply: YES / NO*

---

**YES →** *(agent replies)*
> Good. One follow-up: have trend charts or tables been prepared from this data showing long-term temperature and rainfall trends?
>
> **YES:** Well positioned on PM#1a and PM#1c. Check also: (a) additional hazard data stored — flood, landslide, wind, sea level rise (PM#1b, 1 pt); (b) CRA on file and referenced explicitly in your annual plan project descriptions (PM#2b, 2 pts). The assessor checks the link between the CRA and plan text, not just the existence of the CRA.
>
> **NOT YET:** Trend charts are worth 1 point (PM#1c) and are a one-hour task in Excel from the data already in your database. Ask your CCARRO or Planning Officer to do this before August.

**NO →** *(agent replies)*
> Request 10-year temperature and rainfall data from SI Met Services or an online climate database — this data exists nationally and is a request, not a research project. Contact [LoCAL focal point] for a standard request letter template. Without this dataset, PM#1 and PM#2 score 0 across most sub-indicators: that is 10 points of gap that cannot be closed without taking this first step.

---

**REMINDERS**
- PM#1a (2 pts): Temperature + rainfall ≥10 yrs in PG database — the entry point for all of PM#1
- PM#1c (1 pt): Trend analysis from that data — Excel chart, one hour of work
- PM#2a (3 pts): Vulnerability/exposure data collected or reviewed annually using SIIVA, iPLAN, or equivalent
- PM#2b (2 pts): CRA referenced explicitly in annual plan project justifications — the link must appear in the plan text
- *[Province]-specific:* [Insert current PM#1 and PM#2 scores and specific sub-indicators not yet scored]

**GRANT IMPACT**
> [Province] at [X] points is [description vs average]. The 10 points in PM#1+2 are foundational — provinces with this data (Guadalcanal: 5+3=8, Makira & Ulawa: 3+3=6) consistently outperform those without it. Closing this gap fully adds 10 points; from [X] to [X+gap]: weight [X²] → [(X+gap)²].

---

### CHECK-IN 4 — August | APA documentation checklist
**Type:** Activity-agnostic (reminder only) | **Trigger:** 1 August

**Subject:** `[Province] LoCAL — August: APA documentation checklist (no reply needed)`

---

*Dear [PS name],*

*The APA assessment team will visit [Province] this quarter. This is a documentation reminder — no reply needed, but please act on any gaps below. Work done but not documented cannot be scored.*

---

**REMINDERS**
- PM#1: PG database with 10-year temperature/rainfall data + trend charts (PM#1a, 1c)
- PM#12: Written CCARRO designation with task description naming LoCAL and budget line confirmed
- PM#14+15: Sign-in sheets, agenda, and written summary from at least one awareness session — disaggregated attendance
- PM#7: ACCAF Data Tracker Columns J (rationale), L–W (M&E indicators) complete for all PBCRG projects
- PM#8: ACCAF Columns I–S (narrative) and AD–AG (CC-proofing cost estimates) complete for all PBCRG projects
- PM#9: Design files contain Provincial Engineer sign-off and annotated note on CC standards applied
- PM#13: PBCRG tender documents include CC considerations clause
- *[Province]-specific:* Please also confirm the following, which were specific gaps last year: [from Per-Province Gap Analysis]

**GRANT IMPACT**
> At [Province]'s current score of [X] (grant weight [X²]), sub-indicators missed through missing paperwork — not missing activity — are a direct, avoidable grant loss. If you completed an awareness session but have no sign-in sheet, contact [LoCAL focal point] this week — there is still time to file records before the assessors arrive.

---

### CHECK-IN 5 — October | PMs #3–9 — Planning season
**Type:** Activity-linked | **Trigger:** 15 October
*Most important check-in of the year — 35 points determined by what happens November–January.*

**Subject:** `[Province] LoCAL — October: planning season starts now (35 pts at stake)`

---

*Dear [PS name],*

*The planning season begins this month. Theme B (Climate Change Planning) is worth 35 points — more than any other theme — and is entirely determined by what your CCARRO and Planning Officer do between now and 31 March. [Province] scored [Theme B score]/35 last year.*

*The specific gaps were: [from Check-in 5 personalisation table below].*

**QUICK CHECK**
*Has your CCARRO been briefed on these gaps specifically — before the planning cycle starts?*
> *Reply: YES / NO*

---

**YES →** *(agent replies)*
> Good. One follow-up: is a session confirmed with the planning team to work through the ACCAF priority statements (LALAP tab) before November?
>
> **YES:** Good. Prioritise the specific gaps listed above. For PM#4b and 4c, the fix is one sentence per project referencing the NDS/NCCP — [LoCAL focal point] has standard citation text. For PM#9, the Provincial Engineer needs to review and document CC risk consideration for all PBCRG designs before the plan is submitted.
>
> **NOT YET:** The planning season will not wait. Confirm a date this week — one 2–3 hour session with the CCARRO and Planning Officer on the specific ACCAF columns and document references is all that is needed.

**NO →** *(agent replies)*
> Contact [LoCAL focal point] today to arrange a focused briefing before November. [Province]'s specific gaps are documentation gaps, not conceptual ones — they can be closed in one planning cycle with the right preparation.

---

**REMINDERS**
- PM#4b (2 pts): Add one sentence per PBCRG project referencing the National Development Strategy 2016–2035 — standard citation text available from [LoCAL focal point]
- PM#4c (1 pt): Add one sentence per project referencing the National Climate Change Policy — same approach
- PM#5b (2 pts): ACCAF priority statements must cite your PM#1 climate data as the evidence base
- PM#5c (2 pts): Priority statements must appear in the justification for project selection in the annual plan
- PM#9 (up to 5 pts): Provincial Engineer must formally review and document CC risk consideration for all PBCRG infrastructure designs — written record required, not just verbal sign-off
- *[Province]-specific gaps:* [from personalisation table]

**GRANT IMPACT**
> [Province] scored [Theme B]/35 last year — [pts remaining] points left on the table in this theme alone. The planning season is the only window to close these. Provinces that address PM#4b, 4c, and PM#9 this cycle gain [typical gain] points; for [Province] at [X], that moves weight from [X²] to [(X+gain)²] — [ratio]× more from the performance pool.

#### Check-in 5 personalisation table

| Province | Theme B | Specific gaps for the message |
|---|---|---|
| **Guadalcanal** | 20/35 | PM#4b (NDS ref, 2 pts), PM#4c (NCCP ref, 1 pt), PM#5b (link priority statements to PM#1 climate data — only GP missed this, 2 pts), PM#9 (9a=1/3, 9b=1/2 — engineer sign-off partial) |
| **Temotu** | 22/35 | PM#4c (NCCP ref, 1 pt), PM#9 (entire PM=0 — engineer has not signed off any designs) |
| **Rennell & Bellona** | 21/35 | PM#4b (NDS ref, 2 pts), PM#4c (NCCP ref, 1 pt), PM#5c (priority statements not used in project selection, 2 pts) |
| **Western** | 24/35 | PM#4b (NDS ref, 2 pts) — WP is already the highest Theme B scorer; PM#4b is the only major planning gap |
| **Choiseul** | 22/35 | PM#4b (NDS ref, 2 pts), PM#4c (NCCP ref, 1 pt), PM#5c (priority statements not used in project selection, 2 pts) |
| **Malaita** | 19/35 | PM#4c (NCCP ref, 1 pt), PM#8b (ACCAF Cols AD–AG cost estimates — only Malaita missed this, 3 pts), PM#9 (entire PM=0 — engineer sign-off not done) |
| **Central Islands** | 20/35 | PM#4b (NDS ref, 2 pts), PM#4c (NCCP ref, 1 pt), PM#9 (entire PM=0) |
| **Isabel** | 23/35 | PM#4b (NDS ref, 2 pts), PM#4c (NCCP ref, 1 pt), PM#9b (design records partial — 1 more pt available) |
| **Makira & Ulawa** | 22/35 | PM#4b (NDS ref, 2 pts), PM#4c (NCCP ref, 1 pt), PM#9b (no written design records — 2 pts) |

---

### CHECK-IN 6 — December | PM#4 + PM#5 + PM#10 + PM#11 — Mid-planning check
**Type:** Activity-linked | **Trigger:** 1 December

**Subject:** `[Province] LoCAL — December: four measures to confirm before plan is finalised`

---

*Dear [PS name],*

*Mid-planning check. The plan is in draft — these four measures can still be fixed before submission.*

**QUICK CHECK**
*Does [Province]'s draft annual plan include explicit references to the National Development Strategy 2016–2035 (PM#4b, 2 pts) and the National Climate Change Policy (PM#4c, 1 pt) in the project descriptions?*
> *Reply: BOTH / NDS ONLY / NEITHER*

---

**BOTH →** *(agent replies)*
> Good. One follow-up: are these references within the actual project text — not only in the plan preamble or a covering note?
>
> **YES:** The assessor reads the project text, not the preamble — you are positioned well. Also check: ACCAF Columns I, J, V, W (PM#10) — are vulnerable beneficiaries named explicitly by category (women, youth, people with disability)?
>
> **NOT YET:** Move the NDS and NCCP references into the project description paragraphs directly. This is a copy-paste task — [LoCAL focal point] has the standard citation text.

**NDS ONLY / NEITHER →** *(agent replies)*
> PM#4b + PM#4c = 3 points for two sentences. Contact [LoCAL focal point] for the standard citation text — it is the same for all provinces. You have until 31 March.

---

**REMINDERS**
- PM#4b (2 pts): NDS reference must appear in the project text, not the plan preamble
- PM#4c (1 pt): NCCP reference — same requirement
- PM#10 (5 pts): ACCAF Cols I, J, V, W — name vulnerable beneficiaries explicitly (women, youth, disability) and link to the project; all provinces scored 3/5 last year — the remaining 2 pts require more specificity
- PM#11 (5 pts): Identify one or two non-PBCRG budget projects as CC adaptation interventions and add a CC narrative paragraph to each — no new activity required, just a labelling and narrative exercise

**GRANT IMPACT**
> PM#4b + PM#4c = 3 points for two sentences per project. PM#10 and PM#11 together offer up to 7 more. For [Province] at [X], the full 10-point gain here moves weight from [X²] to [(X+10)²] — [ratio]× more. PM#11 in particular scores 0 across all nine provinces: the first province to close it gains a meaningful edge in the allocation.

---

### CHECK-IN 7 — February | PM#9 + PM#13 — Technical and procurement
**Type:** Activity-linked | **Trigger:** 1 February

**Subject:** `[Province] LoCAL — February: engineer sign-off and tender clause before 31 March (PM#9+13, up to 10 pts)`

---

*Dear [PS name],*

*Two technically focused measures before the 31 March budget submission. [Province] scored [PM9+PM13 score]/10 on these last year.*

**QUICK CHECK**
*Has the Provincial Engineer reviewed and documented climate risk considerations for all PBCRG infrastructure project designs — with a signed note on file?*
> *Reply: YES, ALL DOCUMENTED / PARTIALLY / NOT YET*

---

**YES →** *(agent replies)*
> Good. One follow-up: do all PBCRG tender documents include a CC considerations clause?
>
> **YES:** File these with the annual plan submission. Confirm also that ACCAF Cols AD–AG (PM#8b, 3 pts) are populated with CC-proofing cost estimates for each project — [Province] scored [PM8b score]/3 on this last year.
>
> **NOT YET:** Contact [LoCAL focal point] for the standard CC tender clause template — 30 minutes to add to the procurement document, applies to all future contracts, worth up to 5 points (PM#13).

**PARTIALLY / NOT YET →** *(agent replies)*
> Ask the Provincial Engineer to add a brief annotated note to each PBCRG design file: what climate standards were considered and how resilience was incorporated. One page per project is sufficient for PM#9b (2 pts). PM#9a (3 pts) requires a formal sign-off certifying the design has accounted for foreseeable natural hazards.

---

**REMINDERS**
- PM#9a (3 pts): Provincial Engineer formal sign-off on each PBCRG design certifying CC risks considered
- PM#9b (2 pts): Written record of design decisions — annotated note, one page per project; WP and CP achieved full marks on this last year
- PM#13 (5 pts): CC clause in all PBCRG tender documents — template available from [LoCAL focal point]; Isabel and Makira & Ulawa scored 3/5 last year using this approach
- PM#8b (3 pts — Malaita only): ACCAF Columns AD–AG cost estimates for CC-proofing element — every other province scored this; contact [LoCAL focal point] for an ACCAF session

**GRANT IMPACT**
> PM#9 + PM#13 = up to 10 points and are within the Provincial Engineer's and Procurement Officer's direct control. These are the last major gains available before plan submission. For [Province] at [X], the full gap of [available pts] moves weight from [X²] to [(X+available)²] — [ratio]× more from the performance pool.

---

### CHECK-IN 8 — Quarterly | PM#16 — PBCRG utilisation reporting
**Type:** Activity-linked | **Trigger:** 15th of month after each quarter-end (July, Oct, Jan, Apr)
*Active once PBCRG grants are disbursed.*

**Subject:** `[Province] LoCAL — [Month]: quarterly PBCRG report due (PM#16)`

---

*Dear [PS name],*

*A quarterly report on PBCRG utilisation is due this month.*

**QUICK CHECK**
*Has the report been submitted to MPGIS via the ACCAF Data Tracker (Columns X–AM)?*
> *Reply: SUBMITTED / IN PROGRESS / NOT STARTED*

---

**SUBMITTED →** *(agent replies)*
> Thank you. PM#16 is proportional — all four on-time reports earn the full 7 points. Next report due: [date]. Please calendar this now.

**IN PROGRESS / NOT STARTED →** *(agent replies)*
> Each late or missing report reduces PM#16 proportionally. Submit before [deadline]. If your Finance Officer needs the ACCAF Tracker template, contact [LoCAL focal point] immediately.

---

**REMINDERS**
- PM#16 (7 pts): All four quarterly reports submitted on time via ACCAF Cols X–AM — each report is worth approximately 1.75 points
- Late submission still earns partial credit — missing entirely earns nothing for that quarter
- Reports go to MPGIS; MPGIS forwards to UNCDF/LoCAL

**GRANT IMPACT**
> PM#16 is automatic points — no fieldwork, no new activities. Each on-time report is 1.75 points; four reports = 7 points. For [Province] at [X], the full PM#16 moves weight from [X²] to [(X+7)²] — [ratio]× more. Missing a quarterly report is the highest-cost avoidable loss in the system once grants are flowing.

---

### CHECK-IN 9 — September | PM#17 + PM#18 — Utilisation and execution
**Type:** Activity-linked | **Trigger:** 1 September
*Active once PBCRG grants are disbursed.*

**Subject:** `[Province] LoCAL — September: PBCRG utilisation check (PM#17+18, 18 pts)`

---

*Dear [PS name],*

*PM#17 (utilisation level, 10 pts) and PM#18 (execution as planned, 8 pts) are proportional to what has been spent and delivered. The APA window opens in approximately 8 weeks.*

**QUICK CHECK**
*Approximately what percentage of [Province]'s PBCRG allocation has been committed or spent this fiscal year?*
> *Reply: OVER 75% / 50–75% / UNDER 50%*

---

**OVER 75% →** *(agent replies)*
> Well positioned. One follow-up: are payment receipts, progress reports, and ACCAF tracker updates (Cols X–AM) filed for all completed works?
>
> **YES:** Good — you are positioned to score strongly on PM#17 and PM#18. Ensure the ACCAF tracker reflects actual progress against the annual plan.
>
> **NOT YET:** File these records before the APA. Evidence of spend and delivery must be in writing — the assessor cannot score progress that is not documented.

**50–75% →** *(agent replies)*
> There is still time. Review which approved projects have not started procurement and expedite. For PM#18, partial delivery with a documented progress note counts — ensure all started projects have a written update on file.

**UNDER 50% →** *(agent replies)*
> This needs management attention today. PM#17 scales directly with utilisation — 40% spend is approximately 40% of the 10 points. Review what is blocking implementation (procurement delays, contractor issues, cash flow) and contact MPGIS and [LoCAL focal point] immediately. Unspent PBCRG funds signal low absorption and risk reallocation in future grant cycles.

---

**REMINDERS**
- PM#17 (10 pts): Proportional to PBCRG funds spent — plan only what can be delivered
- PM#18 (8 pts): Projects completed as planned in the rolling 3-year plan and budget
- All evidence must be in the ACCAF tracker (Cols X–AM) and cross-referenced to the annual plan
- Unspent funds risk reallocation to higher-performing provinces in future cycles

**GRANT IMPACT**
> PM#17 + PM#18 = 18 points — the single largest combined measure in the framework, and entirely driven by delivery. For [Province] at [X], achieving the full 18 moves weight from [X²] to [(X+18)²] — [ratio]× more. These points cannot be earned through documentation alone; they require that PBCRG-funded projects are actually implemented and recorded.

---

## Decision Tree Summary

```
APRIL
└── CHECK-IN 1 [Activity-linked]: CCARRO in post + designation in writing?
    YES → confirm written + brief on gaps  |  NO → formal letter this week

JUNE
└── CHECK-IN 2 [Activity-linked]: CC awareness session held this FY?
    Both + records → confirm disaggregation  |  One done → schedule second  |  None → 8 weeks, act now

JULY
└── CHECK-IN 3 [Activity-linked]: 10-year climate data in PG database?
    YES → confirm trend charts + CRA link  |  NO → request from SI Met Services

AUGUST
└── CHECK-IN 4 [Activity-agnostic — reminder only]: Documentation checklist before APA
    No quiz — action on any gap listed

OCTOBER
└── CHECK-IN 5 [Activity-linked]: CCARRO briefed on planning gaps? (35 pts)
    YES → confirm ACCAF session date  |  NO → contact LoCAL focal point today

DECEMBER
└── CHECK-IN 6 [Activity-linked]: NDS+NCCP references in plan project text?
    Both → confirm in project text not preamble  |  Partial/none → standard citation text from LoCAL

FEBRUARY
└── CHECK-IN 7 [Activity-linked]: Engineer design records done?
    YES → confirm tender clause  |  Partial/no → written note per project

── Once grants flowing ────────────────────────────────────────────

QUARTERLY
└── CHECK-IN 8 [Activity-linked]: Quarterly PBCRG report submitted?
    Yes → next date  |  No → submit before deadline, proportional loss

SEPTEMBER
└── CHECK-IN 9 [Activity-linked]: % PBCRG spent?
    >75% → confirm records filed  |  50-75% → expedite  |  <50% → management escalation today
```

---

## Open Items Before Finalising

1. **Province contacts:** Name and email of Provincial Secretary for each of the 9 provinces
2. **LoCAL focal point contact:** UNCDF/LoCAL staff member to refer provinces to — name + email/phone
3. ~~**Per-province PM breakdown:**~~ **RESOLVED** — Full sub-indicator scores per province extracted and verified in the "Per-Province Sub-Indicator Scores" section above. Two document errors found and corrected (RBP PM#9 sub-total, GP PM#14 sub-total).
4. **PM#16–18 activation date:** Confirm when first PBCRG disbursements are expected so Check-ins 8 and 9 can be scheduled
5. **PBCRG pool size (SBD):** Approximate annual allocation so the exponential scoring table can be made concrete — "the difference between 24 and 37 points is approximately SBD X"
6. **Rennell & Bellona — structural alert resolved in agent logic:** RBP improved only 1 point (23→24) and has no CC Focal Point (PM#12=0). Check-in 1 for RBP must lead with the focal point issue before anything else.
7. **Source document errors to flag to assessor:** (a) RBP PM#9 sub-total shows 2, should be 3 (9a=2+9b=1); (b) GP PM#14 sub-total shows 1, should be 0; (c) Table 2 Theme F label shows "(15)", should be "(10)". Grand totals are correct; only the sub-total rows have errors.

---

*Document updated to v0.4 with per-province sub-indicator scores extracted from 2026-2027 Consolidated Assessment Report and incorporated throughout. Next step: confirm Open Items 1, 2, 4, 5 with UNCDF team, then build the message-sending infrastructure.*
