# Changelog

All notable changes to Grant Companion are documented here.
Format: **Added** for new features, **Changed** for updates to existing behavior, **Fixed** for bug fixes.

---

## [Unreleased]

---

## 2026-04-09 — Session 6

### Changed
- **FEATURES.md** — Backlog audit: all completed items verified as checked. Supporting Media Upload remains the only unchecked original backlog item (requires IndexedDB or backend storage — not viable with localStorage).
- **FEATURES.md** — Added "Future Ideas" section with 8 new suggestions: Data Backup & Restore, Grant Calendar View, Budget Line Items, Prospect/Pipeline Tracking, Custom Report Instructions, Print-Ready Grant Summary, Check-in Templates, Dark Mode.
- **CHANGELOG.md** — Documentation pass to ensure all sessions are accurately recorded.

---

## 2026-04-09 — Session 5

### Added
- **Search & Filter** — Search input on the All Grants page filters grants in real-time by name, funder, or tag. Works in combination with the status tabs. Empty state messaging updates to reflect the active search query.
- **Objective Editing** — Objectives on the Grant Detail page are now fully editable. Each card has inline edit (pencil icon → title + description inputs → Save/Cancel) and delete (trash icon) controls. An "Add Objective" button at the top of the section opens an inline form to create new objectives. The objectives card is always visible (even when empty) so there's always a way to add them.
- **Tag Autocomplete** — The Tags field on the Add Check-in form now suggests existing tags from the grant's check-in history as you type. Suggestions appear in a dropdown and update per comma segment. Click to insert.
- **Export as Doc** — The "Export as Doc" button on Generate Report now works. Downloads the report as a `.txt` file with the grant name, funder, and reporting period as a header. Filename is derived from the grant name and period dates.
- **Fix Document Upload** — `pdfjs-dist` integrated for real PDF text extraction. When uploading grant documents, actual PDF content is now extracted (up to 25 pages, 20,000 characters) and sent to Claude for analysis — not just the filename. Falls back to filename-based analysis if extraction fails. PDF library loads lazily via dynamic import, keeping the initial bundle small (208KB vs 660KB).
- **Persistent Grant Assistant** — Grant Assistant is now a global floating panel accessible from every page via a fixed button in the bottom-right corner. Click to open/close a slide-in drawer. Context is automatic: when viewing a specific grant, the assistant knows about that grant; on other pages it works in "all grants" mode with awareness of every active grant. Messages reset when switching grant context.

### Changed
- **Generate Report** — Removed the inline two-column assistant panel. The global assistant (above) replaces it and is accessible from any page including Generate Report.
- **Remove `contacts` field** — Removed unused `contacts` field from seed data. The field was never displayed or used in the UI.

---

## 2026-04-09 — Session 4

### Added
- **Objective Progress** — Each objective now has a `progress` field (0–100). On the Grant Detail page, every objective card shows a color-coded progress bar (gray → blue → green at 100%) with an inline editable percentage input. At 100% a green "Completed" badge appears. The objectives section header shows the overall average progress across all objectives. Grant Cards replace the static "Check-ins" column with a live "Progress" bar and percentage. New grants get `progress: 0` on each objective at creation.
- **Rethink Dashboard Stats** — All three stat cards now show actionable data:
  - **Active Grants** — count as before, with an "X upcoming" sub-label when upcoming grants exist.
  - **Next Report Due** — shows the actual report date and the grant name; clicking the card navigates directly to that grant.
  - **Overdue Reports** — shows a count; green with "all on track" when 0, red with "needs attention" and a count when reports are past due. Clicking navigates to All Grants.

### Changed
- **Seed data** — Sample objectives now have realistic starting progress values (45% / 30% / 20%) so the feature is visible immediately.

---

## 2026-04-09 — Session 3

### Added
- **Budget Tracking** — Check-ins now have an optional "Amount Spent" field (dollar input with `$` prefix). Amounts roll up automatically across all check-ins to show total spend vs. budget.
- **Budget progress bar on Grant Detail** — Header card now shows a "Budget Usage" section below the metadata row: a color-coded progress bar (blue → amber at 75% → red at 90%+), percentage used, dollars spent, and dollars remaining. Over-budget grants display the overage in red.
- **Spend indicator on Grant Cards** — The Budget column on each card now shows `$X,XXX / $Y,YYY` with a compact 4px progress bar below it, giving an at-a-glance spend status from the dashboard and All Grants views.
- **Spend amount on check-in entries** — When a check-in has an amount logged, it appears as a green `$X,XXX spent` label on the right side of the check-in date row in Grant Detail.

### Changed
- **Seed data** — Existing sample check-ins now have realistic `amount` values ($8,500 / $3,200 / $450) so budget tracking is visible immediately on first load.

---

## 2026-04-09 — Session 2

### Added
- **Grant Lifecycle** — Status selector on the Grant Detail page replaces the static status badge. Grants can be moved between `Active`, `Upcoming`, `Completed`, and `Archived` via an inline styled dropdown. Changes persist immediately to localStorage.
- **Archived tab** — All Grants page now has an `Archived` tab. The `All` tab excludes archived grants (they're intentionally hidden from the main view). Archived grants still appear in their dedicated tab.

### Changed
- **Grant Detail topbar actions** — "Add Check-in" and "Generate Report" buttons are now only shown for `active` grants. Completed and archived grants show no action buttons.
- **Grant Card status badges** — Cards now show correct badges for all statuses: green for Active (no badge shown, implied), amber for Upcoming, gray for Completed, muted gray for Archived.

---

## 2026-04-09 — Session 1

### Added
- **Delete Grant** — Danger Zone section at the bottom of the Grant Detail page. Two-step inline confirmation (no browser dialogs) before permanently removing a grant and all associated check-ins, reports, and data. Navigates back to Dashboard on confirmation.
- **Report History** — Grants now store a `reports` array. On the Generate Report page, a "Save Report" button captures the report text, reporting period, and generation date. Saved reports appear on the Grant Detail page as collapsible rows (newest first), expandable inline to read the full report content.

### Changed
- **Icons** — Replaced all emoji icons throughout the dashboard with `lucide-react` SVG line art icons. Consistent `strokeWidth` of 1.5–1.75 across all icons for a clean, minimal aesthetic. Added `lucide-react` as a dependency.

---

## 2026-04-09 — Initial Release (v0.1)

### Added
- **Dashboard** — Stats grid (active grants, upcoming reports, days to next report), active grant cards, upcoming grants list.
- **All Grants** — Tab-filtered view (All / Active / Upcoming / Completed) with grant cards.
- **Grant Detail** — Header with status badge and report deadline, metadata row (period, budget, cadence, funder), objectives list with outcomes, check-in timeline.
- **Add Grant** — 4-step flow: upload documents → AI extraction via Claude API → confirm/edit extracted data → success screen. Falls back gracefully if API is unavailable.
- **Add Check-in** — Form for date, notes, related objectives (multi-select), and tags. Saves to the grant's check-in history.
- **Generate Report** — AI-powered quarterly progress report generation using Claude. Configurable reporting period. Copy to clipboard. Grant Assistant chat panel with suggested prompts.
- **Grant Assistant** — Contextual AI chat on the Generate Report page. Aware of the current grant's objectives, check-ins, and reporting period.
- **Sidebar Navigation** — Dashboard and All Grants (active); Reports, Calendar, Settings (placeholder, coming soon).
- **Data persistence** — All grant data stored in browser localStorage. Seeded with two example grants on first load.
