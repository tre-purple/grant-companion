import React from 'react'

export default function Topbar({ title, actions }) {
  return (
    <div className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-actions">{actions}</div>
    </div>
  )
}
