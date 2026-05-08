# Runbook — LoCAL Check-in Agent

> **Quick links:** [Architecture](./ARCHITECTURE.md) · [API](./API.md) · [Data Model](./DATA_MODEL.md)

Operational reference for running, deploying, and maintaining the server.

## Quick-reference commands

```bash
pm2 restart local-checkin          # restart after a code change
pm2 logs local-checkin             # tail logs
pm2 status                         # check process state
node seed.js                       # re-seed the database (safe to re-run)
sudo nginx -t && sudo systemctl reload nginx   # test + reload nginx config
```

---

## Environment

| Item | Value |
|---|---|
| VPS IP | 167.86.93.243 |
| Domain | pcdftracker.com (purchased; DNS propagation pending as of May 2026) |
| Node process | PM2, process name `local-checkin` |
| Node app port | 3002 |
| Reverse proxy | nginx → port 3002 |
| Database | SQLite at `server/local.db` |
| Node version | 25 |

---

## Prerequisites

```bash
node --version    # should be v25.x
pm2 --version     # process manager
nginx -v          # reverse proxy
certbot --version # SSL (Let's Encrypt)
```

Install PM2 globally if missing:
```bash
npm install -g pm2
```

---

## Starting, stopping, restarting

```bash
# Start (from the project root or with the full path)
pm2 start server/index.js --name local-checkin --cwd /home/zoe/Projects/LoCAL/checkin-agent

# Restart after a code change
pm2 restart local-checkin

# Stop
pm2 stop local-checkin

# Delete the PM2 entry entirely
pm2 delete local-checkin
```

Persist PM2 across reboots (run once after the initial setup):
```bash
pm2 save
pm2 startup
# Follow the instructions printed by pm2 startup
```

---

## Checking status and logs

```bash
# Summary of all PM2 processes
pm2 status

# Live process monitor (CPU, memory, restart count)
pm2 monit

# Tail logs (stdout + stderr)
pm2 logs local-checkin

# Last 200 lines
pm2 logs local-checkin --lines 200
```

---

## Re-seeding the database

The seed script applies `schema.sql` first (idempotent — uses `CREATE TABLE IF NOT EXISTS`), then inserts all reference data using `INSERT OR REPLACE`. It is safe to re-run at any time without data loss risk for seeded tables.

```bash
cd /home/zoe/Projects/LoCAL/checkin-agent/server
node seed.js
```

Expected output:
```
✓ Database seeded successfully
  9 provinces
  18 performance measures
  31 sub-indicators
  279 province scores
  9 check-ins
  29 check-in/PM mappings
  22 answer options
```

**WARNING:** `INSERT OR REPLACE` will overwrite any manual edits to seeded rows. The `submissions` table is not touched by the seed script — response logs are preserved across re-seeds.

To rebuild the database from scratch (deletes all data including submissions):
```bash
rm server/local.db
node seed.js
```

---

## nginx configuration

Config file: `/etc/nginx/sites-available/pcdftracker.com`

The nginx config proxies port 80 (and 443 once SSL is issued) to the Node app on port 3002.

Test config syntax before reloading:
```bash
sudo nginx -t
```

Reload nginx (no downtime):
```bash
sudo systemctl reload nginx
```

Example proxy block (adapt to match the actual config file):
```nginx
server {
    listen 80;
    server_name pcdftracker.com www.pcdftracker.com;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## SSL certificate

SSL is issued via certbot (Let's Encrypt). DNS must propagate before the certificate can be issued.

Issue certificate (run once, after DNS propagates):
```bash
sudo certbot --nginx -d pcdftracker.com -d www.pcdftracker.com
```

Certbot will modify the nginx config automatically to add a `listen 443 ssl` block and redirect HTTP to HTTPS.

Check that auto-renewal works (dry run):
```bash
sudo certbot renew --dry-run
```

Auto-renewal runs via a systemd timer — no manual cron job needed. Check timer status:
```bash
systemctl status certbot.timer
```

---

## Adding a new check-in

1. Add a row to the `checkins` array in `server/seed.js` with the new `id`, `trigger_month`, `trigger_day`, `type`, `subject_tmpl`, `intro_tmpl`, `question_tmpl`, and `weeks_to_apa`.
2. Add the CI-to-PM mappings in the `ciPMs` array in `server/seed.js`.
3. Add answer options in the `options` array in `server/seed.js`.
4. Add a `CI_META` entry in `form.html` matching the new `id`. This must include `topic`, `question`, an optional `followup` object, and a `response` function.
5. Re-seed: `node seed.js`.
6. Restart the server: `pm2 restart local-checkin`.

---

## Updating a province PS name

Provincial Secretary names are stored in `provinces.ps_name`. All 9 are currently NULL.

**Option A — update seed.js** (persists across re-seeds):

Edit the `ps_name: null` entry for the relevant province in `server/seed.js`, then re-seed:
```bash
node seed.js
```

**Option B — direct SQL** (faster, but will be overwritten if seed.js is re-run):
```bash
sqlite3 server/local.db "UPDATE provinces SET ps_name = 'Name Here' WHERE id = 'guadalcanal';"
```

---

## Checking the database directly

```bash
sqlite3 server/local.db

# Useful queries
.tables
SELECT id, name, current_score FROM provinces ORDER BY current_score DESC;
SELECT COUNT(*) FROM submissions;
SELECT province_id, checkin_id, answer_value, submitted_at FROM submissions ORDER BY submitted_at DESC LIMIT 20;
.quit
```

---

## Deploying a code change

```bash
# Pull the latest code
git -C /home/zoe/Projects/LoCAL/checkin-agent pull

# If server/package.json dependencies changed
cd /home/zoe/Projects/LoCAL/checkin-agent/server && npm install

# Restart the process
pm2 restart local-checkin

# Confirm it started cleanly
pm2 logs local-checkin --lines 20
```

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3002` | Port the Express server binds to |

Set a custom port for PM2:
```bash
pm2 start server/index.js --name local-checkin --env PORT=3003
```

Or add it to a `pm2.config.js` at the project root.
