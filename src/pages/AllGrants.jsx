import React, { useState } from 'react'
import Topbar from '../components/Topbar'
import GrantCard from '../components/GrantCard'

const TABS = ['All', 'Active', 'Upcoming', 'Completed']

export default function AllGrants({ grants, navigate }) {
  const [activeTab, setActiveTab] = useState('All')

  const filtered = grants.filter(g => {
    if (activeTab === 'All')       return true
    if (activeTab === 'Active')    return g.status === 'active'
    if (activeTab === 'Upcoming')  return g.status === 'upcoming'
    if (activeTab === 'Completed') return g.status === 'completed'
    return true
  })

  const count = (tab) => {
    if (tab === 'All')       return grants.length
    if (tab === 'Active')    return grants.filter(g => g.status === 'active').length
    if (tab === 'Upcoming')  return grants.filter(g => g.status === 'upcoming').length
    if (tab === 'Completed') return grants.filter(g => g.status === 'completed').length
    return 0
  }

  return (
    <>
      <Topbar
        title="All Grants"
        actions={
          <button className="btn btn-primary" onClick={() => navigate('add-grant')}>
            + Add New Grant
          </button>
        }
      />
      <div className="page-content">
        <div className="tabs">
          {TABS.map(tab => (
            <div
              key={tab}
              className={`tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab} ({count(tab)})
            </div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No {activeTab.toLowerCase()} grants</div>
            <div className="empty-state-desc">
              {activeTab === 'All'
                ? 'Add your first grant to get started.'
                : `You don't have any ${activeTab.toLowerCase()} grants yet.`}
            </div>
          </div>
        ) : (
          filtered.map(grant => (
            <GrantCard key={grant.id} grant={grant} navigate={navigate} />
          ))
        )}
      </div>
    </>
  )
}
