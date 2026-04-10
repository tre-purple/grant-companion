import React from 'react'
import { fmtDate, fmtMoney, daysUntil } from '../utils/helpers'
import { Clock } from 'lucide-react'

export default function GrantCard({ grant, navigate }) {
  const days = daysUntil(grant.nextReportDue)
  const isOverdue = days !== null && days < 0
  const isSoon    = days !== null && days >= 0 && days <= 30

  const badgeClass = isOverdue ? 'badge-red' : isSoon ? 'badge-amber' : 'badge-blue'

  const totalSpent = grant.checkins.reduce((sum, ci) => sum + (ci.amount || 0), 0)
  const pct        = grant.fundingAmount > 0 ? Math.min(100, Math.round((totalSpent / grant.fundingAmount) * 100)) : 0
  const barColor   = pct >= 90 ? 'danger' : pct >= 75 ? 'warning' : 'normal'

  const avgProgress = grant.objectives.length > 0
    ? Math.round(grant.objectives.reduce((sum, obj) => sum + (obj.progress || 0), 0) / grant.objectives.length)
    : null

  return (
    <div className="grant-card" onClick={() => navigate('grant-detail', grant.id)}>
      <div className="grant-card-header">
        <div>
          <div className="grant-name">{grant.name}</div>
          {grant.status === 'upcoming'  && <span className="badge badge-amber"  style={{ marginTop: 4 }}>Upcoming</span>}
          {grant.status === 'completed' && <span className="badge badge-gray"   style={{ marginTop: 4 }}>Completed</span>}
          {grant.status === 'archived'  && <span className="badge badge-gray"   style={{ marginTop: 4, opacity: 0.6 }}>Archived</span>}
        </div>
        {grant.nextReportDue && days !== null && (
          <span className={`badge ${badgeClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} strokeWidth={2} /> Report due {fmtDate(grant.nextReportDue)}
          </span>
        )}
      </div>

      <div className="grant-meta-row">
        <div>
          <div className="grant-meta-label">Project Period</div>
          <div className="grant-meta-value">{fmtDate(grant.startDate)} – {fmtDate(grant.endDate)}</div>
        </div>
        <div style={{ minWidth: 140 }}>
          <div className="grant-meta-label">Budget</div>
          <div className="grant-meta-value">{fmtMoney(totalSpent)} <span style={{ fontWeight: 400, color: 'var(--gray-400)' }}>/ {fmtMoney(grant.fundingAmount)}</span></div>
          <div className="budget-bar-track" style={{ marginTop: 6, height: 4 }}>
            <div className={`budget-bar-fill budget-bar-fill--${barColor}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div>
          <div className="grant-meta-label">Reporting</div>
          <div className="grant-meta-value">{grant.reportingCadence}</div>
        </div>
        <div style={{ minWidth: 100 }}>
          <div className="grant-meta-label">Progress</div>
          {avgProgress !== null ? (
            <>
              <div className="grant-meta-value">{avgProgress}%</div>
              <div className="budget-bar-track" style={{ marginTop: 6, height: 4 }}>
                <div
                  className={`obj-bar-fill obj-bar-fill--${avgProgress === 100 ? 'complete' : avgProgress >= 50 ? 'halfway' : 'start'}`}
                  style={{ width: `${avgProgress}%` }}
                />
              </div>
            </>
          ) : (
            <div className="grant-meta-value" style={{ color: 'var(--gray-300)' }}>—</div>
          )}
        </div>
      </div>

      {grant.status === 'active' && (
        <div className="grant-actions" onClick={e => e.stopPropagation()}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('add-checkin', grant.id)}
          >
            + Add Check-in
          </button>
          <button
            className="btn btn-success btn-sm"
            onClick={() => navigate('generate-report', grant.id)}
          >
            Generate Report
          </button>
        </div>
      )}
    </div>
  )
}
