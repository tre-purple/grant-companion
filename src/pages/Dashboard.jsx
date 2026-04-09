import React from 'react'
import Topbar from '../components/Topbar'
import GrantCard from '../components/GrantCard'
import { daysUntil, fmtDate } from '../utils/helpers'

export default function Dashboard({ grants, navigate }) {
  const activeGrants   = grants.filter(g => g.status === 'active')
  const upcomingGrants = grants.filter(g => g.status === 'upcoming')
  const withReports    = activeGrants.filter(g => g.nextReportDue)
  const soonestDays    = withReports.length
    ? Math.min(...withReports.map(g => daysUntil(g.nextReportDue) ?? 999))
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
          <div className="stat-card">
            <div>
              <div className="stat-label">Active Grants</div>
              <div className="stat-value">{activeGrants.length}</div>
            </div>
            <div className="stat-icon blue">✅</div>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Upcoming Reports</div>
              <div className="stat-value">{withReports.length}</div>
            </div>
            <div className="stat-icon blue">📅</div>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Days to Next Report</div>
              <div className="stat-value">{soonestDays !== null ? soonestDays : '—'}</div>
            </div>
            <div className="stat-icon amber">⏰</div>
          </div>
        </div>

        {/* Active Grants */}
        <div className="section-header mb-16">
          <div className="section-title">Active Grants</div>
        </div>

        {activeGrants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
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
