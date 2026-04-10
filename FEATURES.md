# Grant Companion — Feature Backlog

> Prioritized list of improvements identified during product review (April 2026).

---

## In Progress

- [x] **Report History** — Save generated reports to the grant record; view past reports from the grant detail page.

---

## High Priority

- [x] **Fix Document Upload** — Currently Claude only receives filenames, not file content. Integrate `pdf.js` to extract text and send actual document content to Claude for real extraction.
- [x] **Budget Tracking** — Add `budgetSpent` to check-ins (optional number). Show a spend bar on the grant detail and dashboard (e.g. `$42,000 of $75,000 spent`).
- [x] **Objective Progress** — Add a simple progress indicator per objective (manual % or auto-derived from tagged check-ins). Makes the grant detail page actually useful for tracking.
- [x] **Grant Lifecycle** — Add a status dropdown to the grant detail topbar so grants can be moved from `active → completed → archived`. Unblocks the Completed tab in AllGrants.

---

## Medium Priority

- [x] **Rethink Dashboard Stats** — Replace generic counts with actionable info: next report due (grant name + date), overdue report count (red when > 0), grants expiring this quarter.
- [x] **Persistent Grant Assistant** — Move the AI assistant out of the report page and into a global toggle or sidebar panel. Give it context across all grants, not just one.
- [x] **Search & Filter** — Add a search bar to AllGrants filtering by name, funder, or tag. Basic but essential once there are 10+ grants.
- [x] **Objective Editing** — Allow editing, adding, and removing objectives after grant creation (in the confirm step and from the grant detail page).

---

## Lower Priority

- [x] **Tag Autocomplete** — Suggest existing tags from the same grant when typing in the check-in form. Prevents `milestone` / `Milestone` / `milestones` fragmentation.
- [ ] **Supporting Media Upload** — Currently stubbed. Implement actual file attachment storage for check-ins (photos, documents). Requires IndexedDB or a backend — localStorage is not viable for binary data.
- [x] **Export Report as Doc** — Currently disabled. Export generated report as `.docx` or PDF for submission to funders.
- [x] **Remove unused `contacts` field** — The `contacts` field exists in the data model but is never shown or used in the UI.

---

## Future Ideas

These were not part of the original product review but are logical next steps as the app matures.

- [ ] **Data Backup & Restore** — Export all grant data as a JSON file and re-import it. Critical safety net since all data lives in browser localStorage — a browser reset or device switch currently means permanent data loss.
- [ ] **Grant Calendar View** — Visual month/quarter calendar showing report due dates and grant end dates across all active grants. Replaces the placeholder Calendar nav item.
- [ ] **Budget Line Items** — Break a grant's budget into categories (Personnel, Equipment, Indirect Costs, Travel, etc.) rather than a single lump sum. Allows per-category spend tracking on check-ins.
- [ ] **Prospect / Pipeline Tracking** — Track grants not yet awarded. Add a `Prospect` status and an "Applied" date field so the pipeline goes: Prospect → Applied → Active → Completed.
- [ ] **Custom Report Instructions** — Let users write a standing instruction (e.g. "always include a narrative section") that gets appended to the Claude report prompt. Stored per grant.
- [ ] **Print-Ready Grant Summary** — One-page printable view: grant header, objectives with progress, budget bar, and the three most recent check-ins. Useful for board reports and funder check-ins.
- [ ] **Check-in Templates** — Save reusable note snippets for common activity types (site visit, board meeting, milestone reached) to speed up recurring entries.
- [ ] **Dark Mode** — Theme toggle stored in localStorage. The CSS custom properties are already set up for this; it's mostly a palette swap.

---

## Notes

- Mobile/responsive support is intentionally deferred — app is designed for desktop use.
- Auth/multi-user is out of scope for the current phase.
- Reports, Calendar, and Settings sidebar items are placeholder nav — build out as features are completed.
- Supporting Media Upload and Data Backup & Restore are the two highest-risk gaps given the localStorage-only architecture.
