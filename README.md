# Pocket Steve 🏭

A bilingual (Chinese/Vietnamese) factory assistant web app powered by Claude AI. Workers log in with their employee ID and name, ask questions, and get answers based on the owner's custom knowledge SKILLs.

**Live URL:** https://stevetai0314-dot.github.io/pocket-steve/

---

## Architecture

```
[Worker's Phone/PC]
      ↓ POST (Content-Type: text/plain — avoids CORS preflight)
[GitHub Pages — index.html]
      ↓
[Google Apps Script Web App]
      ├─ Validate worker ID + name (workers sheet)
      ├─ Check daily quota (< 30 messages/day)
      ├─ Route to relevant SKILLs by keyword
      ├─ Call Claude Haiku 4.5 with prompt caching
      └─ Log to Google Sheets
```

---

## Features

- Bilingual UI: 中文 / Tiếng Việt (one-click toggle)
- Worker authentication: employee ID + name
- 30 messages/day quota per worker
- 9 factory knowledge SKILLs with keyword routing
- Usage log in Google Sheets (who asked what)
- Mobile-first chat interface

---

## Setup Guide

### Step 1 — Google Sheets

1. Go to [sheets.google.com](https://sheets.google.com) → New spreadsheet → Name it `Factory Assistant DB`
2. Create three sheets (tabs):

**`workers`**
| worker_id | name | department | active |
|-----------|------|------------|--------|
| A001 | 員工姓名 | 染整課 | Y |

**`usage_log`**
| timestamp | worker_id | name | language | question | response_preview |

**`daily_quota`**
| worker_id | date | count |

3. Copy the Spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/【SPREADSHEET_ID】/edit`

---

### Step 2 — Google Apps Script

1. Go to [script.google.com](https://script.google.com) → New project → Name it `Factory Assistant`
2. Create four script files and paste the code from the `gas/` folder:
   - `Database.gs` — Google Sheets read/write
   - `Claude.gs` — Claude API call with prompt caching
   - `Code.gs` — doPost handler (main entry point)
   - `Skills.gs` — SKILL content + keyword routing

3. Set Script Properties (Project Settings → Script Properties):

| Key | Value |
|-----|-------|
| `SHEET_ID` | Your Spreadsheet ID from Step 1 |
| `CLAUDE_API_KEY` | Your Anthropic API key |

4. Test: run `testGetWorker()` in Database.gs → should return the worker row as JSON

5. Deploy as Web App:
   - Deploy → New deployment → Type: Web app
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click Deploy → Copy the Web App URL

---

### Step 3 — GitHub Pages

1. Fork or clone this repo
2. In `index.html`, replace the `GAS_URL` value with your Web App URL:
   ```javascript
   const GAS_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```
3. Push to GitHub
4. Enable GitHub Pages: repo Settings → Pages → Branch: main → / (root) → Save
5. Wait 1–2 minutes → open `https://YOUR_USERNAME.github.io/pocket-steve/`

---

### Step 4 — Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Billing → Add credit card → Top up (minimum $5 USD)
3. API Keys → Create new key → paste into GAS Script Properties

**Cost estimate:** ~NT$7–14/day for 5–10 active users using Claude Haiku 4.5 with prompt caching

---

## SKILLs Included

| SKILL | Keywords that trigger it |
|-------|--------------------------|
| 潤滑油選用 | 油、潤滑、脂、齒輪、液壓、氣壓 |
| 精密零件入料驗收 | 培林、軸承、零件、規格、仿品 |
| 關鍵零件供應商管控 | 培林、軸承、零件、規格、仿品 |
| 委外維修交接協議 | 維修、送修、廠商、報價、合約 |
| 採購報價單地雷審查 | 報價單、合約、條款、付款 |
| 技術性糾紛舉證邏輯 | 糾紛、賠償、責任、付錢 |
| 紡織新品開發審查 | 新品、開發、客戶、TPU、貼合 |
| 車縫組合加工規格 | 車縫、針距、縫線、方框 |
| 假性改善辨識 | 改善、效果、指標 |

If no keyword matches, all SKILLs are loaded as fallback.

---

## Adding Workers

Edit the `workers` sheet directly in Google Sheets:

```
worker_id | name     | department | active
A001      | 阮文明    | 染整課     | Y
A002      | Nguyễn   | 織帶課     | Y
```

- Set `active = N` to disable a worker without deleting their history
- No code changes needed

## Adding New SKILLs

1. Add the SKILL content as a new key in the `SKILLS` object in `Skills.gs`
2. Add keyword matching in `getSkillsForMessage()`
3. Save GAS (no re-deploy needed)

---

## File Structure

```
pocket-steve/
  index.html        — Single-page app (login + chat)
  gas/
    Code.gs         — doPost handler
    Database.gs     — Google Sheets helpers
    Claude.gs       — Claude API call
    Skills.gs       — SKILL content + keyword routing
  README.md
```
