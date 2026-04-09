import React from 'react'

const navItems = [
  { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { id: 'grants',    icon: '📋', label: 'All Grants' },
  { id: 'reports',   icon: '📊', label: 'Reports', disabled: true },
  { id: 'calendar',  icon: '📅', label: 'Calendar', disabled: true },
  { id: 'settings',  icon: '⚙️', label: 'Settings', disabled: true },
]

export default function Sidebar({ activePage, navigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <div className="logo-icon">🌱</div>
          <div className="logo-text">
            <span className="logo-text-main">Grant Companion</span>
            <span className="logo-text-sub">Management Suite</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item${activePage === item.id ? ' active' : ''}`}
            style={item.disabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
            onClick={() => !item.disabled && navigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.disabled && (
              <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,.3)' }}>
                soon
              </span>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">GW</div>
          <div className="user-info">
            <div className="user-name">Grant Writer</div>
            <div className="user-role">Staff Member</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
