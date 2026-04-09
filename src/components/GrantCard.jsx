import React from 'react'
import { fmtDate, fmtMoney, daysUntil } from '../utils/helpers'

export default function GrantCard({ grant, navigate }) {
  const days = daysUntil(grant.nextReportDue)
  const isOverdue = days !== null && days < 0
  const isSoon    = days !== null && days >= 0 && days <= 30

  const badgeClass = isOverdue ? 'badge-red' : isSoon ? 'badge-amber' : 'badge-blue'

  return (
    <div className="grant-card" onClick={() => navigate('grant-detail', grant.id)}>
      <div className="grant-card-header">
        <div>
          <div className="grant-name">{grant.name}</div>
          {grant.status === 'upcoming' && (
            <span className="badge badge-amber" style={{ marginTop: 4 }}>upcoming</span>
          )}
        </div>
        {grant.nextReportDue && days !== null && (
          <span className={`badge ${badgeClass}`}>
            ⏰ Report due {fmtDate(grant.nextReportDue)}
          </span>
        )}
      </div>

      <div className="grant-meta-row">
        <div>
          <div className="grant-meta-label">Project Period</div>
          <div className="grant-meta-value">{fmtDate(grant.startDate)} – {fmtDate(grant.endDate)}</div>
        </div>
        <div>
          <div className="grant-meta-label">Budget</div>
          <div className="grant-meta-value">{fmtMoney(grant.fundingAmount)}</div>
        </div>
        <div>
          <div className="grant-meta-label">Reporting</div>
          <div className="grant-meta-value">{grant.reportingCadence}</div>
        </div>
        <div>
          <div className="grant-meta-label">Check-ins</div>
          <div className="grant-meta-value">{grant.checkins.length}</div>
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
