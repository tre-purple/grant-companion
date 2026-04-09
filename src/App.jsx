import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import AllGrants from './pages/AllGrants'
import GrantDetail from './pages/GrantDetail'
import AddGrant from './pages/AddGrant'
import AddCheckin from './pages/AddCheckin'
import GenerateReport from './pages/GenerateReport'
import { loadGrants, saveGrants } from './utils/helpers'

export default function App() {
  const [grants, setGrants] = useState(loadGrants)
  const [page, setPage]     = useState('dashboard')
  const [param, setParam]   = useState(null)   // grantId for detail/checkin/report pages

  // Persist grants to localStorage whenever they change
  useEffect(() => { saveGrants(grants) }, [grants])

  function navigate(p, id = null) {
    setPage(p)
    setParam(id)
    window.scrollTo(0, 0)
  }

  function addCheckin(grantId, checkin) {
    setGrants(gs =>
      gs.map(g =>
        g.id === grantId ? { ...g, checkins: [...g.checkins, checkin] } : g
      )
    )
  }

  function addGrant(grant) {
    setGrants(gs => [...gs, grant])
  }

  // Which sidebar item is "active"
  const sidebarActive = ['dashboard', 'grants'].includes(page) ? page : 'dashboard'

  function renderPage() {
    switch (page) {
      case 'dashboard':
        return <Dashboard grants={grants} navigate={navigate} />

      case 'grants':
        return <AllGrants grants={grants} navigate={navigate} />

      case 'grant-detail':
        return <GrantDetail grantId={param} grants={grants} navigate={navigate} />

      case 'add-grant':
        return <AddGrant onGrantCreated={addGrant} navigate={navigate} />

      case 'add-checkin':
        return <AddCheckin grantId={param} grants={grants} onSave={addCheckin} navigate={navigate} />

      case 'generate-report':
        return <GenerateReport grantId={param} grants={grants} navigate={navigate} />

      default:
        return <Dashboard grants={grants} navigate={navigate} />
    }
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={sidebarActive} navigate={navigate} />
      <div className="main-content">
        {renderPage()}
      </div>
    </div>
  )
}
