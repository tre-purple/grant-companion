# 🌱 Grant Companion

**A grant reporting companion for nonprofits — manage grants with confidence.**

Grant Companion helps nonprofit staff stay on top of grant reporting by making it easy to log progress check-ins throughout the year, then generate complete funder-ready reports with one click. No more scrambling at the end of a grant period.

---

## What It Does

- **Dashboard** — See all active grants, upcoming report deadlines, and days until next report at a glance
- **Add New Grant** — Upload your RFP, application, and contract — AI extracts objectives, dates, budget, and reporting schedule automatically
- **Check-ins** — Log progress notes, tag them to objectives, and attach media throughout the grant period
- **Generate Report** — AI writes a complete quarterly progress report from your check-ins with one click
- **Grant Assistant** — Chat with an AI that knows your grant's objectives and check-in history to help you prepare reports

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 18 | Component model, easy to read and extend |
| Build | Vite | Fast dev server, simple config |
| Styles | Plain CSS with custom properties | No magic, easy to understand and override |
| AI | Anthropic Claude API | Powers extraction, report generation, and assistant chat |
| Storage | localStorage (v1) | Works offline, zero setup — swap to Supabase later |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/grant-companion.git
cd grant-companion
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

```bash
cp .env.example .env
```

Open `.env` and add your Anthropic API key:

```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get a key at [console.anthropic.com](https://console.anthropic.com). The key is only used in your local browser — it never gets sent to any server we control.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
grant-companion/
├── index.html                  # Vite entry point
├── package.json
├── vite.config.js
├── .env.example                # Copy to .env, add your API key
└── src/
    ├── main.jsx                # React bootstrap
    ├── App.jsx                 # Root component + client-side routing
    ├── styles/
    │   └── global.css          # Design tokens (CSS vars) + all styles
    ├── utils/
    │   ├── helpers.js          # Date/money formatting, localStorage
    │   └── claude.js           # Anthropic API wrapper
    ├── data/
    │   └── seedData.js         # Demo grants for development
    ├── components/
    │   ├── Sidebar.jsx         # Left nav
    │   ├── Topbar.jsx          # Page header bar
    │   ├── GrantCard.jsx       # Reusable grant summary card
    │   └── GrantAssistant.jsx  # AI chat panel
    └── pages/
        ├── Dashboard.jsx       # Home — stats + grant list
        ├── AllGrants.jsx       # Full grants list with tabs
        ├── GrantDetail.jsx     # Single grant — objectives + check-ins
        ├── AddGrant.jsx        # Upload docs → extract → confirm
        ├── AddCheckin.jsx      # Log a progress update
        └── GenerateReport.jsx  # AI report generation + assistant
```

---

## Deployment

Build for production:

```bash
npm run build
```

The `dist/` folder is a static site — deploy to:
- **Vercel** — `vercel deploy` (recommended, free tier)
- **Netlify** — drag and drop `dist/` folder
- **GitHub Pages** — push `dist/` to `gh-pages` branch

> ⚠️ **Important:** When deploying, set `VITE_ANTHROPIC_API_KEY` as an environment variable in your hosting dashboard. Do not commit `.env` to the repo.

---

## Roadmap

- [ ] User authentication (login / org accounts)
- [ ] Multi-organization support (for rolling out to other nonprofits)
- [ ] Real file parsing — extract text from uploaded PDFs
- [ ] Export report as Word doc (.docx)
- [ ] Email reminders for upcoming report deadlines
- [ ] Supabase backend (replace localStorage)
- [ ] Objective progress tracking with metrics
- [ ] Media attachments on check-ins

---

## Contributing

This project is currently in active early development. If you're a nonprofit interested in piloting Grant Companion, reach out.

---

*Built with ❤️ to help nonprofits spend less time on paperwork and more time on impact.*
