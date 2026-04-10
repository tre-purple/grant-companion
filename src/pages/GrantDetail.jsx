import React, { useState } from 'react'
import Topbar from '../components/Topbar'
import { fmtDate, fmtMoney, daysUntil } from '../utils/helpers'
import { Clock, Calendar, DollarSign, FileText, Building2, PenLine, BookOpen, ChevronDown, ChevronUp, Trash2, Pencil, Plus, X, Check } from 'lucide-react'
import { uid } from '../utils/helpers'

const STATUS_OPTIONS = [
  { value: 'active',    label: 'Active' },
  { value: 'upcoming',  label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived',  label: 'Archived' },
]

export default function GrantDetail({ grantId, grants, onDelete, onStatusChange, onObjectiveProgress, onObjectiveAdd, onObjectiveUpdate, onObjectiveDelete, navigate }) {
  const grant = grants.find(g => g.id === grantId)
  const [expandedReportId, setExpandedReportId] = useState(null)
  const [confirmDelete, setConfirmDelete]         = useState(false)
  const [editingObjId, setEditingObjId]           = useState(null)
  const [editDraft, setEditDraft]                 = useState({})
  const [addingObj, setAddingObj]                 = useState(false)
  const [newObj, setNewObj]                       = useState({ title: '', description: '' })

  if (!grant) return <div className="page-content">Grant not found.</div>

  const days      = daysUntil(grant.nextReportDue)
  const isOverdue = days !== null && days < 0
  const isSoon    = days !== null && days >= 0 && days <= 30
  const badgeClass = isOverdue ? 'badge-red' : isSoon ? 'badge-amber' : 'badge-blue'
  const savedReports = [...(grant.reports || [])].reverse()

  const avgProgress = grant.objectives.length > 0
    ? Math.round(grant.objectives.reduce((sum, obj) => sum + (obj.progress || 0), 0) / grant.objectives.length)
    : 0

  const checkinCountFor = (objId) => grant.checkins.filter(ci => ci.objectives?.includes(objId)).length

  const totalSpent = grant.checkins.reduce((sum, ci) => sum + (ci.amount || 0), 0)
  const remaining  = grant.fundingAmount - totalSpent
  const pct        = grant.fundingAmount > 0 ? Math.min(100, Math.round((totalSpent / grant.fundingAmount) * 100)) : 0
  const barColor   = pct >= 90 ? 'danger' : pct >= 75 ? 'warning' : 'normal'

  return (
    <>
      <Topbar
        title="Grant Details"
        actions={
          <>
            {grant.status === 'active' && (
              <>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('add-checkin', grant.id)}>
                  + Add Check-in
                </button>
                <button className="btn btn-success btn-sm" onClick={() => navigate('generate-report', grant.id)}>
                  Generate Report
                </button>
              </>
            )}
          </>
        }
      />

      <div className="page-content">
        <div className="breadcrumb">
          <span className="breadcrumb-link" onClick={() => navigate('dashboard')}>Dashboard</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{grant.name}</span>
        </div>

        {/* Header card */}
        <div className="card mb-24">
          <div className="flex-between mb-16">
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gray-900)', marginBottom: 8 }}>
                {grant.name}
              </h1>
              <select
                className={`status-select status-select--${grant.status}`}
                value={grant.status}
                onChange={e => onStatusChange(grant.id, e.target.value)}
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {grant.nextReportDue && (
              <span className={`badge ${badgeClass}`} style={{ fontSize: 13, padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Clock size={13} strokeWidth={2} /> Report due {fmtDate(grant.nextReportDue)}
              </span>
            )}
          </div>
          <div className="grant-meta-row">
            <div>
              <div className="grant-meta-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} strokeWidth={1.75} /> Project Period</div>
              <div className="grant-meta-value">{fmtDate(grant.startDate)} – {fmtDate(grant.endDate)}</div>
            </div>
            <div>
              <div className="grant-meta-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={13} strokeWidth={1.75} /> Total Budget</div>
              <div className="grant-meta-value">{fmtMoney(grant.fundingAmount)}</div>
            </div>
            <div>
              <div className="grant-meta-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FileText size={13} strokeWidth={1.75} /> Reporting</div>
              <div className="grant-meta-value">{grant.reportingCadence}</div>
            </div>
            <div>
              <div className="grant-meta-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={13} strokeWidth={1.75} /> Funder</div>
              <div className="grant-meta-value">{grant.funder || '—'}</div>
            </div>
          </div>

          {/* Budget Progress */}
          <div className="budget-section">
            <div className="budget-section-header">
              <span className="budget-section-label">Budget Usage</span>
              <span className="budget-section-pct">{pct}%</span>
            </div>
            <div className="budget-bar-track">
              <div className={`budget-bar-fill budget-bar-fill--${barColor}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="budget-section-footer">
              <span><strong>{fmtMoney(totalSpent)}</strong> spent</span>
              <span style={{ color: remaining < 0 ? 'var(--red)' : 'var(--gray-400)' }}>
                {remaining >= 0 ? `${fmtMoney(remaining)} remaining` : `${fmtMoney(Math.abs(remaining))} over budget`}
              </span>
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="card mb-24">
          <div className="flex-between mb-16">
            <div className="section-title">
              Objectives
              {grant.objectives.length > 0 && <span className="obj-overall-label" style={{ marginLeft: 12 }}>{avgProgress}% overall</span>}
            </div>
            <button
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
              onClick={() => { setAddingObj(true); setNewObj({ title: '', description: '' }) }}
            >
              <Plus size={13} strokeWidth={2} /> Add Objective
            </button>
          </div>

          {grant.objectives.length === 0 && !addingObj && (
            <div className="empty-state" style={{ padding: '24px' }}>
              <div className="empty-state-title" style={{ fontSize: 15 }}>No objectives yet</div>
              <div className="empty-state-desc">Add objectives to track progress toward your grant goals.</div>
            </div>
          )}

          {grant.objectives.map(obj => {
            const p = obj.progress || 0
            const ciCount = checkinCountFor(obj.id)
            const objBarColor = p === 100 ? 'complete' : p >= 50 ? 'halfway' : 'start'
            const isEditing = editingObjId === obj.id

            return (
              <div key={obj.id} className="objective-card">
                {isEditing ? (
                  <>
                    <input
                      className="form-input"
                      style={{ marginBottom: 8, fontWeight: 600 }}
                      value={editDraft.title}
                      onChange={e => setEditDraft(d => ({ ...d, title: e.target.value }))}
                      placeholder="Objective title"
                      autoFocus
                    />
                    <textarea
                      className="form-textarea"
                      style={{ minHeight: 72, marginBottom: 10 }}
                      value={editDraft.description}
                      onChange={e => setEditDraft(d => ({ ...d, description: e.target.value }))}
                      placeholder="Description"
                    />
                    <div className="flex gap-8">
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                        onClick={() => {
                          onObjectiveUpdate(grant.id, { ...obj, ...editDraft })
                          setEditingObjId(null)
                        }}
                      >
                        <Check size={13} strokeWidth={2} /> Save
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingObjId(null)}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: 4 }}>
                      <div className="objective-title" style={{ margin: 0 }}>{obj.title}</div>
                      <div className="flex gap-8" style={{ flexShrink: 0, marginLeft: 12 }}>
                        <button
                          className="btn-icon"
                          title="Edit objective"
                          onClick={() => { setEditingObjId(obj.id); setEditDraft({ title: obj.title, description: obj.description }) }}
                        >
                          <Pencil size={13} strokeWidth={1.75} />
                        </button>
                        <button
                          className="btn-icon btn-icon--danger"
                          title="Delete objective"
                          onClick={() => onObjectiveDelete(grant.id, obj.id)}
                        >
                          <Trash2 size={13} strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
                    <div className="objective-desc">{obj.description}</div>

                    <div className="obj-progress-row">
                      <div className="budget-bar-track" style={{ flex: 1 }}>
                        <div className={`obj-bar-fill obj-bar-fill--${objBarColor}`} style={{ width: `${p}%` }} />
                      </div>
                      <div className="obj-progress-input-wrap">
                        <input
                          type="number" min="0" max="100"
                          className="obj-progress-input"
                          value={p}
                          onChange={e => onObjectiveProgress(grant.id, obj.id, Math.min(100, Math.max(0, Number(e.target.value))))}
                        />
                        <span className="obj-progress-sym">%</span>
                      </div>
                      {p === 100 && <span className="badge badge-green" style={{ marginLeft: 8, fontSize: 11 }}>Completed</span>}
                    </div>
                    <div className="obj-checkin-count">{ciCount} check-in{ciCount !== 1 ? 's' : ''} linked</div>

                    {obj.outcomes?.length > 0 && (
                      <>
                        <div className="objective-outcomes-label">Expected Outcomes</div>
                        <ul className="objective-outcomes">
                          {obj.outcomes.map((o, i) => <li key={i}>{o}</li>)}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </div>
            )
          })}

          {addingObj && (
            <div className="objective-card" style={{ borderColor: 'var(--blue-light)', background: 'var(--blue-pale)' }}>
              <input
                className="form-input"
                style={{ marginBottom: 8 }}
                value={newObj.title}
                onChange={e => setNewObj(d => ({ ...d, title: e.target.value }))}
                placeholder="Objective title"
                autoFocus
              />
              <textarea
                className="form-textarea"
                style={{ minHeight: 72, marginBottom: 10 }}
                value={newObj.description}
                onChange={e => setNewObj(d => ({ ...d, description: e.target.value }))}
                placeholder="Description (what will be accomplished?)"
              />
              <div className="flex gap-8">
                <button
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                  disabled={!newObj.title.trim()}
                  onClick={() => {
                    onObjectiveAdd(grant.id, { id: 'o' + uid(), ...newObj, outcomes: [], progress: 0 })
                    setAddingObj(false)
                  }}
                >
                  <Plus size={13} strokeWidth={2} /> Add Objective
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setAddingObj(false)}>
                  <X size={13} strokeWidth={2} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Saved Reports */}
        <div className="card mb-24">
          <div className="flex-between mb-16">
            <div className="section-title">Saved Reports</div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('generate-report', grant.id)}>
              Generate Report
            </button>
          </div>

          {savedReports.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px' }}>
              <div className="empty-state-icon"><BookOpen size={40} strokeWidth={1.25} /></div>
              <div className="empty-state-title">No saved reports yet</div>
              <div className="empty-state-desc">
                Generate a report and click "Save Report" to keep a record of what was sent to your funder.
              </div>
            </div>
          ) : (
            savedReports.map(r => {
              const isOpen = expandedReportId === r.id
              return (
                <div key={r.id} className="saved-report-item">
                  <div
                    className="saved-report-header"
                    onClick={() => setExpandedReportId(isOpen ? null : r.id)}
                  >
                    <div className="saved-report-meta">
                      <div className="saved-report-period">
                        {fmtDate(r.periodStart)} – {fmtDate(r.periodEnd)}
                      </div>
                      <div className="saved-report-date">Saved {fmtDate(r.generatedAt)}</div>
                    </div>
                    <span className="saved-report-toggle">
                      {isOpen
                        ? <ChevronUp size={16} strokeWidth={1.75} />
                        : <ChevronDown size={16} strokeWidth={1.75} />}
                    </span>
                  </div>
                  {isOpen && (
                    <div className="saved-report-body">
                      <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.85, color: 'var(--gray-700)' }}>
                        {r.content}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Check-ins */}
        <div className="card mb-24">
          <div className="flex-between mb-16">
            <div className="section-title">Recent Check-ins</div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('add-checkin', grant.id)}>
              + Add Check-in
            </button>
          </div>

          {grant.checkins.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px' }}>
              <div className="empty-state-icon"><PenLine size={48} strokeWidth={1.25} /></div>
              <div className="empty-state-title">No check-ins yet</div>
              <div className="empty-state-desc">
                Add your first check-in to start tracking progress toward your objectives.
              </div>
            </div>
          ) : (
            [...grant.checkins].reverse().map(ci => (
              <div key={ci.id} className="checkin-item">
                <div className="checkin-bar" />
                <div className="checkin-content">
                  <div className="checkin-date-row">
                    <span className="checkin-date">{fmtDate(ci.date)}</span>
                    {ci.amount > 0 && (
                      <span className="checkin-amount">{fmtMoney(ci.amount)} spent</span>
                    )}
                  </div>
                  <div className="checkin-note">{ci.notes}</div>
                  {ci.tags?.length > 0 && (
                    <div className="checkin-tags">
                      {ci.tags.map(t => <span key={t} className="checkin-tag">{t}</span>)}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Danger Zone */}
        <div className="danger-zone">
          <div className="danger-zone-label">Danger Zone</div>
          {!confirmDelete ? (
            <div className="flex-between">
              <div>
                <div className="danger-zone-action-title">Delete this grant</div>
                <div className="danger-zone-action-desc">
                  Permanently removes all check-ins, saved reports, and grant data. This cannot be undone.
                </div>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => setConfirmDelete(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
              >
                <Trash2 size={14} strokeWidth={1.75} /> Delete Grant
              </button>
            </div>
          ) : (
            <div className="danger-zone-confirm">
              <div className="danger-zone-confirm-text">
                Are you sure? This will permanently delete <strong>{grant.name}</strong> and all associated data.
              </div>
              <div className="flex gap-8">
                <button className="btn btn-secondary btn-sm" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(grant.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Trash2 size={14} strokeWidth={1.75} /> Yes, Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
