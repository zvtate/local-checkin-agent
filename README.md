# LoCAL Check-in Agent — Setup Guide

A lightweight web form that sends periodic check-in prompts to Provincial Secretaries,
collects their answers, displays personalised action steps, and logs responses to a Google Sheet.

---

## Quick overview

```
Email (CTA button)
    ↓
checkin.html?p=guadalcanal&c=2   ← hosted static file
    ↓ answer submitted
Result screen (instant, no page reload)
    ↓ fire-and-forget POST
Google Apps Script webhook → Sheet + email notification
```

---

## 1 · Fill in the placeholders in checkin.js

Open `checkin.js` and update:

| Placeholder | Replace with |
|---|---|
| `PASTE_APPS_SCRIPT_WEB_APP_URL_HERE` | Web App URL from step 2 |
| `[LoCAL Focal Point Name]` | e.g. Jane Doe |
| `local@uncdf.org` | Actual focal point email |
| `[Phone]` | Focal point phone number |
| `[PS Name — Guadalcanal]` (×9) | Each Provincial Secretary's name |

---

## 2 · Deploy the Google Apps Script webhook

1. Go to [script.google.com](https://script.google.com) and create a new project.
2. Paste the contents of `apps-script/webhook.gs` as the only file (replace the default `Code.gs`).
3. Set `SHEET_ID` to the ID of your Google Sheet (the part of the URL after `/d/`).
4. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** and copy the **Web App URL**.
6. Paste that URL into `checkin.js` as `WEBHOOK_URL`.

The script auto-creates the `Responses` sheet with column headers on first run.

---

## 3 · Host the static files

The three files (`checkin.html`, `checkin.css`, `checkin.js`) can be served from any static host.

### Option A — Netlify (recommended, free)

```bash
# From the checkin-agent/ directory
netlify deploy --prod --dir .
```

Or drag-and-drop the folder at [app.netlify.com](https://app.netlify.com).

### Option B — GitHub Pages

1. Push `checkin-agent/` to a GitHub repo.
2. Settings → Pages → Source: `main` branch, `/` (root) or `/docs` folder.

### Option C — Any web server / SharePoint

Upload the three files to any directory that serves static HTML.

---

## 4 · URL format

Each province + check-in combination gets a unique URL:

```
https://your-site.netlify.app/checkin.html?p=guadalcanal&c=2
https://your-site.netlify.app/checkin.html?p=temotu&c=2
https://your-site.netlify.app/checkin.html?p=rennell-bellona&c=2
```

**Province keys** (`p=`):

| Province | Key |
|---|---|
| Guadalcanal | `guadalcanal` |
| Temotu | `temotu` |
| Rennell & Bellona | `rennell-bellona` |
| Western | `western` |
| Choiseul | `choiseul` |
| Malaita | `malaita` |
| Central Islands | `central-islands` |
| Isabel | `isabel` |
| Makira-Ulawa | `makira-ulawa` |

**Check-in keys** (`c=`):

| # | Month | Topic |
|---|---|---|
| 2 | June | CC awareness sessions (PM#14 + PM#15) |
| *(3–9 to be added)* | | |

---

## 5 · Update the email templates

Each email in `email-templates/` has a CTA button linking to the hosted URL.
Update the `href` in the button once you have your hosting URL:

```html
<a class="cta-btn" href="https://your-site.netlify.app/checkin.html?p=guadalcanal&c=2">
  Answer quick check →
</a>
```

---

## 6 · Testing

Open the form directly in a browser:

```
file:///path/to/checkin-agent/checkin.html?p=guadalcanal&c=2
```

The webhook POST will silently fail until the Apps Script URL is set — that's expected.
The form and result screen work fully offline.

To test the full flow (form → Sheet logged → email notification):

1. Deploy Apps Script (step 2).
2. Host files (step 3).
3. Open the hosted URL and submit an answer.
4. Check the Google Sheet and your email.

---

## 7 · Adding more check-ins

In `checkin.js`:

1. Add a new entry under `CHECKINS` (copy check-in 2 as a template).
2. Add the per-province `checkins[N]` data block inside each province in `PROVINCES`.
3. Update email templates with the new `c=N` URL parameter.

No other files need to change.

---

## Documentation

Project documentation lives in [`docs/`](./docs/):

| Document | Contents |
|---|---|
| [docs/README.md](./docs/README.md) | Project summary and doc index |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System flow, components, database schema, scoring logic, open items |
| [docs/APA_COMPLIANCE_LOGIC.md](./docs/APA_COMPLIANCE_LOGIC.md) | All 18 PM definitions, per-province scores, gap analysis, check-in messages |
| [docs/DATA_MODEL.md](./docs/DATA_MODEL.md) | SQLite table reference, seeding status, data corrections |

---

## File structure

```
checkin-agent/
├── checkin.html          ← markup (3 screens: question / follow-up / result)
├── checkin.css           ← mobile-first styles
├── checkin.js            ← all data + UI logic
├── apps-script/
│   └── webhook.gs        ← Google Apps Script (paste into script.google.com)
├── email-templates/
│   └── checkin-2.html    ← email HTML per check-in (link updated per province)
├── server/
│   ├── schema.sql        ← SQLite schema (13 tables)
│   ├── seed.js           ← seeds all reference data
│   └── local.db          ← SQLite database (not committed)
├── docs/                 ← project documentation
└── README.md             ← this file
```
