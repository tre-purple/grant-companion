// ── Date & Number Helpers ──────────────────────────────────────────────────

export function fmtDate(d) {
  if (!d) return '—'
  const dt = new Date(d + 'T12:00:00')
  return dt.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
}

export function fmtMoney(n) {
  return '$' + Number(n).toLocaleString()
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  const now = new Date()
  const target = new Date(dateStr + 'T12:00:00')
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24))
}

export function uid() {
  return Math.random().toString(36).slice(2, 9)
}

// ── Local Storage ─────────────────────────────────────────────────────────

import { SEED_GRANTS } from '../data/seedData'

export function loadGrants() {
  try {
    const raw = localStorage.getItem('gmc_grants')
    return raw ? JSON.parse(raw) : SEED_GRANTS
  } catch {
    return SEED_GRANTS
  }
}

export function saveGrants(grants) {
  localStorage.setItem('gmc_grants', JSON.stringify(grants))
}
