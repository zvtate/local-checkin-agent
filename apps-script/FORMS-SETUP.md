# LoCAL Check-in — Google Forms Setup Guide

Estimated time: 30–40 minutes end-to-end.

---

## Overview

```
Gmail (you send the check-in email)
  ↓ province-specific pre-fill link
Google Form (one form, shared)
  ↓ submit
Google Sheet (auto-populated by Forms)
  ↓ onFormSubmit trigger
Apps Script (form-agent.gs)
  ↓ generates bespoke guidance
Email to PS + CC to you (~30 sec delay)
```

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.new](https://sheets.new) and create a blank sheet.
2. Name it: **LoCAL Check-in Responses**
3. Keep this tab open — you'll come back to it.

---

## Step 2 — Create the Google Form

Go to [forms.new](https://forms.new).

**Form title:** `LoCAL Check-in — Solomon Islands`

**Form description:** *(leave blank — instructions come via email)*

Create the following questions **in this exact order** with **these exact titles**:

---

### Question 1 — Province *(Short answer)*

**Title:** `Province`
- Required: Yes
- Do NOT make this a dropdown — it needs to be pre-filled via URL
- Respondents won't see this if you use the pre-fill link correctly

---

### Question 2 — Check-in number *(Short answer)*

**Title:** `Check-in number`
- Required: Yes
- Pre-filled via URL — respondents won't edit this

---

### Question 3 — Main question *(Multiple choice)*

**Title:** `Has your province held at least one CC awareness session this fiscal year?`

Options (type these exactly):
```
Both — staff session and community session done
Staff session only
Community session only
Not yet this fiscal year
```

- Required: Yes
- Set up section branching (see Step 3)

---

### Question 4 — Follow-up *(Multiple choice, in Section 2)*

**Title:** `Are all required records filed and ready for the assessor?`

Options (type these exactly):
```
✓ Yes, records filed for both sessions
✗ Not all filed yet
```

- Required: Yes
- This question sits in **Section 2** (see Step 3)

---

## Step 3 — Set up section branching

The follow-up question should only appear when the answer is "Both done".

1. After creating Question 3, click the **three-dot menu** on that question → **Go to section based on answer**
2. Set:
   - `Both — staff session and community session done` → **Go to section 2 (Follow-up)**
   - All other options → **Submit form**
3. In Section 2 (where Question 4 lives), set the section's "After section 2" to → **Submit form**

---

## Step 4 — Link Form to the Sheet

1. In the Form, click the **Responses** tab
2. Click the Google Sheets icon (or **Link to Sheets**)
3. Select **Select existing spreadsheet** → choose the sheet from Step 1
4. Click **Create**

The form will now write responses to that sheet automatically.

---

## Step 5 — Add the Apps Script

1. Open your Google Sheet
2. **Extensions → Apps Script**
3. Delete all default code in `Code.gs`
4. Paste the entire contents of `form-agent.gs` (from this folder)
5. Fill in the placeholders at the top:
   - `FOCAL_POINT.name` — your LoCAL focal point's name
   - `FOCAL_POINT.email` — their email
   - `FOCAL_POINT.phone` — their phone (or delete the line)
   - `psEmail` for each province — the PS's email address
6. Click **Save** (disk icon or Ctrl+S)

---

## Step 6 — Get the Form entry IDs

You need the numeric entry IDs to build the pre-fill URLs.

1. In the Apps Script editor, find the function `getFormEntryIds`
2. Replace `YOUR_FORM_ID` with your form's ID (visible in the form's URL:
   `https://docs.google.com/forms/d/[THIS_PART]/edit`)
3. Click **Run → getFormEntryIds**
4. Click **View → Logs** (or Ctrl+Enter)
5. You'll see output like:
   ```
   Province → entry.123456789
   Check-in number → entry.987654321
   Has your province held... → entry.111222333
   Are all required records... → entry.444555666
   ```
6. Note the IDs for **Province** and **Check-in number** — you need these for the pre-fill URLs.

---

## Step 7 — Generate the 9 province pre-fill URLs

1. In `form-agent.gs`, find the function `generateProvinceUrls`
2. Replace:
   - `YOUR_FORM_ID` with your form ID
   - `PROVINCE_ENTRY_ID` with the Province field entry ID from Step 6
   - `CHECKIN_ENTRY_ID` with the Check-in number entry ID from Step 6
3. **Run → generateProvinceUrls**
4. **View → Logs** — you'll see 9 URLs, one per province:
   ```
   Guadalcanal:
   https://docs.google.com/forms/d/.../viewform?...&entry.123456789=Guadalcanal&entry.987654321=2

   Temotu:
   https://docs.google.com/forms/d/.../viewform?...&entry.123456789=Temotu&entry.987654321=2
   ...
   ```
5. Copy each URL — these go into the email templates (the CTA button `href`).

> **Test each URL** by opening it in a browser. Province and check-in number should be pre-filled and not editable.

---

## Step 8 — Set up the onFormSubmit trigger

1. In the Apps Script editor, click the **clock icon** (Triggers) in the left sidebar
2. **+ Add Trigger** (bottom right)
3. Configure:
   - **Function:** `onFormSubmit`
   - **Deployment:** Head
   - **Event source:** From spreadsheet
   - **Event type:** On form submit
4. Click **Save**
5. You may be prompted to authorise — click through the Google permissions dialog

---

## Step 9 — Test the full flow

1. Open the Guadalcanal pre-fill URL from Step 7
2. Verify Province = "Guadalcanal" and Check-in = "2" are pre-filled
3. Select **"Not yet this fiscal year"** → submit
4. Wait ~30 seconds
5. Check:
   - **Your inbox (PROGRAMME_EMAIL)**: you should receive the CC copy of the bespoke guidance email
   - **The PS email** (or use your own email as placeholder for testing): guidance email received
   - **The Google Sheet**: new row with the response + inferred PM14/PM15 status columns

6. Repeat for at least one "Both done" path to test the follow-up branching.

---

## Step 10 — Update email templates

In each province's check-in email (the HTML template or your Gmail draft), update the CTA button link to the province's pre-fill URL from Step 7:

```html
<a href="https://docs.google.com/forms/d/.../viewform?...&entry.XXX=Guadalcanal&entry.YYY=2">
  Answer quick check →
</a>
```

---

## Analytics — what the Sheet gives you

After a few check-in cycles, the Sheet will have:

| Column | Use |
|---|---|
| Timestamp | When they responded |
| Province | Filter by province |
| Answer | What they said |
| PM14 Status | `in_progress` / `not_started` |
| PM15 Status | `in_progress` / `not_started` |
| Docs Ready | `yes` / `no` / `n/a` |
| Response Key | Full answer path |

**Useful pivot tables:**
- Province × Answer → who hasn't responded (blank = no response)
- PM14 Status / PM15 Status by Province → compliance picture across system
- Timestamp trends → engagement over the check-in cycle

---

## Adding Check-in 3 (July) later

1. In `form-agent.gs`, add a `CI3` constant (same structure as `CI2`)
2. Update `onFormSubmit` to route `ciNum === 3` to `CI3`
3. Generate new pre-fill URLs with `CI_NUM = '3'`
4. No form changes needed — the branching logic is the same

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Email not sent | Check trigger is set up (Step 8). Check Apps Script Executions log for errors. |
| Province not found | Check the form's Province field value exactly matches a key in `PROVINCES` (case-sensitive) |
| Follow-up not showing | Re-check section branching in the form (Step 3) |
| Pre-fill URL not working | Verify entry IDs — run `getFormEntryIds` again and check for typos |
| PS email bouncing | Update `psEmail` in `form-agent.gs` and re-save |
