import React, { useState } from 'react'
import Topbar from '../components/Topbar'
import GrantCard from '../components/GrantCard'
import { ClipboardList } from 'lucide-react'

const TABS = ['All', 'Active', 'Upcoming', 'Completed', 'Archived']

export default function AllGrants({ grants, navigate }) {
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch]       = useState('')

  const q = search.toLowerCase().trim()
  const filtered = grants.filter(g => {
    const tabMatch =
      activeTab === 'All'       ? g.status !== 'archived' :
      activeTab === 'Active'    ? g.status === 'active'   :
      activeTab === 'Upcoming'  ? g.status === 'upcoming' :
      activeTab === 'Completed' ? g.status === 'completed':
      activeTab === 'Archived'  ? g.status === 'archived' : true
    if (!tabMatch) return false
    if (!q) return true
    return (
      g.name.toLowerCase().includes(q) ||
      (g.funder || '').toLowerCase().includes(q) ||
      g.checkins.some(ci => ci.tags?.some(t => t.toLowerCase().includes(q)))
    )
  })

  const count = (tab) => {
    if (tab === 'All')       return grants.filter(g => g.status !== 'archived').length
    if (tab === 'Active')    return grants.filter(g => g.status === 'active').length
    if (tab === 'Upcoming')  return grants.filter(g => g.status === 'upcoming').length
    if (tab === 'Completed') return grants.filter(g => g.status === 'completed').length
    if (tab === 'Archived')  return grants.filter(g => g.status === 'archived').length
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
        <div className="search-bar-wrap">
          <input
            className="form-input search-input"
            type="search"
            placeholder="Search by name, funder, or tag…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
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
            <div className="empty-state-icon"><ClipboardList size={48} strokeWidth={1.25} /></div>
            <div className="empty-state-title">
              {q ? 'No results' : `No ${activeTab.toLowerCase()} grants`}
            </div>
            <div className="empty-state-desc">
              {q
                ? `No grants match "${search}". Try a different search.`
                : activeTab === 'All'
                ? 'Add your first grant to get started.'
                : activeTab === 'Archived'
                ? 'Grants you archive will appear here.'
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
