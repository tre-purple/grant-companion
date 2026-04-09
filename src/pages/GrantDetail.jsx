import React from 'react'
import Topbar from '../components/Topbar'
import { fmtDate, fmtMoney, daysUntil } from '../utils/helpers'

export default function GrantDetail({ grantId, grants, navigate }) {
  const grant = grants.find(g => g.id === grantId)
  if (!grant) return <div className="page-content">Grant not found.</div>

  const days      = daysUntil(grant.nextReportDue)
  const isOverdue = days !== null && days < 0
  const isSoon    = days !== null && days >= 0 && days <= 30
  const badgeClass = isOverdue ? 'badge-red' : isSoon ? 'badge-amber' : 'badge-blue'

  return (
    <>
      <Topbar
        title="Grant Details"
        actions={
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('add-checkin', grant.id)}>
              + Add Check-in
            </button>
            <button className="btn btn-success btn-sm" onClick={() => navigate('generate-report', grant.id)}>
              Generate Report
            </button>
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
              <span className={`badge badge-${grant.status === 'active' ? 'green' : 'amber'}`}>
                {grant.status}
              </span>
            </div>
            {grant.nextReportDue && (
              <span className={`badge ${badgeClass}`} style={{ fontSize: 13, padding: '6px 14px' }}>
                ⏰ Report due {fmtDate(grant.nextReportDue)}
              </span>
            )}
          </div>
          <div className="grant-meta-row">
            <div>
              <div className="grant-meta-label">📅 Project Period</div>
              <div className="grant-meta-value">{fmtDate(grant.startDate)} – {fmtDate(grant.endDate)}</div>
            </div>
            <div>
              <div className="grant-meta-label">💵 Budget</div>
              <div className="grant-meta-value">{fmtMoney(grant.fundingAmount)}</div>
            </div>
            <div>
              <div className="grant-meta-label">📄 Reporting</div>
              <div className="grant-meta-value">{grant.reportingCadence}</div>
            </div>
            <div>
              <div className="grant-meta-label">🏢 Funder</div>
              <div className="grant-meta-value">{grant.funder || '—'}</div>
            </div>
          </div>
        </div>

        {/* Objectives */}
        {grant.objectives.length > 0 && (
          <div className="card mb-24">
            <div className="section-title mb-16">Objectives</div>
            {grant.objectives.map(obj => (
              <div key={obj.id} className="objective-card">
                <div className="objective-title">{obj.title}</div>
                <div className="objective-desc">{obj.description}</div>
                {obj.outcomes?.length > 0 && (
                  <>
                    <div className="objective-outcomes-label">Expected Outcomes</div>
                    <ul className="objective-outcomes">
                      {obj.outcomes.map((o, i) => <li key={i}>{o}</li>)}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Check-ins */}
        <div className="card">
          <div className="flex-between mb-16">
            <div className="section-title">Recent Check-ins</div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('add-checkin', grant.id)}>
              + Add Check-in
            </button>
          </div>

          {grant.checkins.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px' }}>
              <div className="empty-state-icon">📝</div>
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
                  <div className="checkin-date">{fmtDate(ci.date)}</div>
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
      </div>
    </>
  )
}
