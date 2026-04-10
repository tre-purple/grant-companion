import React from 'react'
import Topbar from '../components/Topbar'
import GrantCard from '../components/GrantCard'
import { daysUntil, fmtDate } from '../utils/helpers'
import { CheckCircle, AlertCircle, Calendar, ClipboardList } from 'lucide-react'

export default function Dashboard({ grants, navigate }) {
  const activeGrants   = grants.filter(g => g.status === 'active')
  const upcomingGrants = grants.filter(g => g.status === 'upcoming')
  const withReports    = activeGrants.filter(g => g.nextReportDue)

  const overdueGrants = activeGrants.filter(g => g.nextReportDue && daysUntil(g.nextReportDue) < 0)
  const overdueCount  = overdueGrants.length

  const soonestGrant = withReports.length
    ? withReports.reduce((prev, curr) =>
        (daysUntil(prev.nextReportDue) ?? 999) < (daysUntil(curr.nextReportDue) ?? 999) ? prev : curr
      )
    : null

  return (
    <>
      <Topbar
        title="Dashboard"
        actions={
          <button className="btn btn-primary" onClick={() => navigate('add-grant')}>
            + Add New Grant
          </button>
        }
      />

      <div className="page-content">
        {/* Stats */}
        <div className="stats-grid">
          {/* Active Grants */}
          <div className="stat-card">
            <div>
              <div className="stat-label">Active Grants</div>
              <div className="stat-value">{activeGrants.length}</div>
              {upcomingGrants.length > 0 && (
                <div className="stat-sub">{upcomingGrants.length} upcoming</div>
              )}
            </div>
            <div className="stat-icon blue"><CheckCircle size={22} strokeWidth={1.5} /></div>
          </div>

          {/* Next Report Due */}
          <div
            className="stat-card"
            style={{ cursor: soonestGrant ? 'pointer' : 'default' }}
            onClick={() => soonestGrant && navigate('grant-detail', soonestGrant.id)}
          >
            <div style={{ minWidth: 0 }}>
              <div className="stat-label">Next Report Due</div>
              <div className="stat-value" style={{ fontSize: soonestGrant ? 24 : 32 }}>
                {soonestGrant ? fmtDate(soonestGrant.nextReportDue) : '—'}
              </div>
              {soonestGrant && (
                <div className="stat-sub" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
                  {soonestGrant.name}
                </div>
              )}
            </div>
            <div className="stat-icon blue"><Calendar size={22} strokeWidth={1.5} /></div>
          </div>

          {/* Overdue Reports */}
          <div
            className="stat-card"
            style={{ cursor: overdueCount > 0 ? 'pointer' : 'default' }}
            onClick={() => overdueCount > 0 && navigate('grants')}
          >
            <div>
              <div className="stat-label">Overdue Reports</div>
              <div className="stat-value" style={{ color: overdueCount > 0 ? 'var(--red)' : 'var(--green)' }}>
                {overdueCount}
              </div>
              <div className="stat-sub" style={{ color: overdueCount > 0 ? 'var(--red)' : 'var(--green)' }}>
                {overdueCount > 0 ? 'needs attention' : 'all on track'}
              </div>
            </div>
            <div className={`stat-icon ${overdueCount > 0 ? 'red' : 'green'}`}>
              {overdueCount > 0
                ? <AlertCircle size={22} strokeWidth={1.5} />
                : <CheckCircle size={22} strokeWidth={1.5} />}
            </div>
          </div>
        </div>

        {/* Active Grants */}
        <div className="section-header mb-16">
          <div className="section-title">Active Grants</div>
        </div>

        {activeGrants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><ClipboardList size={48} strokeWidth={1.25} /></div>
            <div className="empty-state-title">No active grants yet</div>
            <div className="empty-state-desc">Add your first grant to start tracking progress and reporting.</div>
            <button className="btn btn-primary mt-16" onClick={() => navigate('add-grant')}>
              + Add New Grant
            </button>
          </div>
        ) : (
          activeGrants.map(grant => (
            <GrantCard key={grant.id} grant={grant} navigate={navigate} />
          ))
        )}

        {/* Upcoming Grants */}
        {upcomingGrants.length > 0 && (
          <>
            <div className="section-header mt-24 mb-16">
              <div className="section-title">Upcoming Grants</div>
            </div>
            {upcomingGrants.map(grant => (
              <div
                key={grant.id}
                className="upcoming-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('grant-detail', grant.id)}
              >
                <div className="upcoming-name">{grant.name}</div>
                <div className="upcoming-start">Starts {fmtDate(grant.startDate)}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  )
}
