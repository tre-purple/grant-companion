import React, { useState } from 'react'
import Topbar from '../components/Topbar'
import { uid } from '../utils/helpers'
import { Paperclip, Save } from 'lucide-react'

export default function AddCheckin({ grantId, grants, onSave, navigate }) {
  const grant = grants.find(g => g.id === grantId)
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm]       = useState({ date: today, notes: '', objectives: [], tags: '', amount: '' })
  const [saving, setSaving]   = useState(false)
  const [tagSuggestions, setTagSuggestions] = useState([])

  const allExistingTags = [...new Set(grant?.checkins.flatMap(ci => ci.tags || []))]

  function handleTagChange(value) {
    setForm(f => ({ ...f, tags: value }))
    const parts   = value.split(',')
    const current = parts[parts.length - 1].trim().toLowerCase()
    if (current.length === 0) { setTagSuggestions([]); return }
    const already = parts.slice(0, -1).map(t => t.trim().toLowerCase())
    const matches = allExistingTags.filter(t =>
      t.toLowerCase().includes(current) && !already.includes(t.toLowerCase())
    )
    setTagSuggestions(matches)
  }

  function applySuggestion(tag) {
    const parts = form.tags.split(',')
    parts[parts.length - 1] = ' ' + tag
    setForm(f => ({ ...f, tags: parts.join(',') + ', ' }))
    setTagSuggestions([])
  }

  if (!grant) return null

  function toggleObjective(oid) {
    setForm(f => ({
      ...f,
      objectives: f.objectives.includes(oid)
        ? f.objectives.filter(o => o !== oid)
        : [...f.objectives, oid],
    }))
  }

  async function handleSave() {
    if (!form.notes.trim()) return alert('Please add some notes about your progress.')
    setSaving(true)
    const checkin = {
      id: 'c' + uid(),
      date: form.date,
      notes: form.notes,
      objectives: form.objectives,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      amount: form.amount !== '' ? Number(form.amount) : null,
    }
    onSave(grantId, checkin)
    setSaving(false)
    navigate('grant-detail', grantId)
  }

  return (
    <>
      <Topbar title="Add Check-in" />
      <div className="page-content">
        <div className="breadcrumb">
          <span className="breadcrumb-link" onClick={() => navigate('dashboard')}>Dashboard</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-link" onClick={() => navigate('grant-detail', grantId)}>{grant.name}</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">Add Check-in</span>
        </div>

        <div className="page-header">
          <div className="page-title">Add Check-in</div>
          <div className="page-subtitle">{grant.name}</div>
        </div>

        <div className="card" style={{ maxWidth: 720 }}>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Notes <span className="form-label-hint">(What progress have you made?)</span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="Describe activities, milestones, challenges, or any relevant updates…"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              style={{ minHeight: 140 }}
            />
          </div>

          {grant.objectives.length > 0 && (
            <div className="form-group">
              <label className="form-label">
                Related Objectives <span className="form-label-hint">(Select all that apply)</span>
              </label>
              {grant.objectives.map(obj => (
                <div
                  key={obj.id}
                  className={`objective-checkbox-item${form.objectives.includes(obj.id) ? ' selected' : ''}`}
                  onClick={() => toggleObjective(obj.id)}
                >
                  <input type="checkbox" checked={form.objectives.includes(obj.id)} readOnly />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{obj.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{obj.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              Amount Spent <span className="form-label-hint">(optional — dollars spent during this period)</span>
            </label>
            <div className="input-prefix-wrap">
              <span className="input-prefix">$</span>
              <input
                className="form-input input-with-prefix"
                type="number"
                min="0"
                placeholder="0"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">
              Tags <span className="form-label-hint">(comma-separated, e.g., milestone, workshop)</span>
            </label>
            <input
              className="form-input"
              placeholder="milestone, event, partnership"
              value={form.tags}
              onChange={e => handleTagChange(e.target.value)}
              onBlur={() => setTimeout(() => setTagSuggestions([]), 150)}
              autoComplete="off"
            />
            {tagSuggestions.length > 0 && (
              <div className="tag-suggestions">
                {tagSuggestions.map(t => (
                  <div key={t} className="tag-suggestion-item" onMouseDown={() => applySuggestion(t)}>
                    {t}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Supporting Media <span className="form-label-hint">(Photos, documents, etc.)</span>
            </label>
            <div className="upload-zone">
              <div className="upload-icon"><Paperclip size={28} strokeWidth={1.5} /></div>
              <div className="upload-text">Click to upload files</div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>
                File upload coming in next release
              </div>
            </div>
          </div>

          <hr className="divider" />
          <div className="flex-between">
            <button className="btn btn-secondary" onClick={() => navigate('grant-detail', grantId)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <><span className="spinner" /> Saving…</> : <><Save size={14} strokeWidth={1.75} style={{ marginRight: 6 }} />Save Check-in</>}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
