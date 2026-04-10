import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import AllGrants from './pages/AllGrants'
import GrantDetail from './pages/GrantDetail'
import AddGrant from './pages/AddGrant'
import AddCheckin from './pages/AddCheckin'
import GenerateReport from './pages/GenerateReport'
import GrantAssistant from './components/GrantAssistant'
import { loadGrants, saveGrants } from './utils/helpers'
import { MessageSquare } from 'lucide-react'

export default function App() {
  const [grants, setGrants]           = useState(loadGrants)
  const [page, setPage]               = useState('dashboard')
  const [param, setParam]             = useState(null)
  const [assistantOpen, setAssistantOpen] = useState(false)

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

  function deleteGrant(grantId) {
    setGrants(gs => gs.filter(g => g.id !== grantId))
    navigate('dashboard')
  }

  function updateGrantStatus(grantId, newStatus) {
    setGrants(gs =>
      gs.map(g => g.id === grantId ? { ...g, status: newStatus } : g)
    )
  }

  function addObjective(grantId, objective) {
    setGrants(gs => gs.map(g => g.id === grantId
      ? { ...g, objectives: [...g.objectives, objective] } : g))
  }

  function updateObjective(grantId, objective) {
    setGrants(gs => gs.map(g => g.id === grantId
      ? { ...g, objectives: g.objectives.map(obj => obj.id === objective.id ? objective : obj) } : g))
  }

  function deleteObjective(grantId, objectiveId) {
    setGrants(gs => gs.map(g => g.id === grantId
      ? { ...g, objectives: g.objectives.filter(obj => obj.id !== objectiveId) } : g))
  }

  function updateObjectiveProgress(grantId, objectiveId, progress) {
    setGrants(gs =>
      gs.map(g => g.id === grantId
        ? { ...g, objectives: g.objectives.map(obj => obj.id === objectiveId ? { ...obj, progress } : obj) }
        : g
      )
    )
  }

  function saveReport(grantId, report) {
    setGrants(gs =>
      gs.map(g =>
        g.id === grantId ? { ...g, reports: [...(g.reports || []), report] } : g
      )
    )
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
        return <GrantDetail grantId={param} grants={grants} onDelete={deleteGrant} onStatusChange={updateGrantStatus} onObjectiveProgress={updateObjectiveProgress} onObjectiveAdd={addObjective} onObjectiveUpdate={updateObjective} onObjectiveDelete={deleteObjective} navigate={navigate} />

      case 'add-grant':
        return <AddGrant onGrantCreated={addGrant} navigate={navigate} />

      case 'add-checkin':
        return <AddCheckin grantId={param} grants={grants} onSave={addCheckin} navigate={navigate} />

      case 'generate-report':
        return <GenerateReport grantId={param} grants={grants} onReportSaved={saveReport} navigate={navigate} />

      default:
        return <Dashboard grants={grants} navigate={navigate} />
    }
  }

  const contextGrant = (page === 'grant-detail' || page === 'generate-report')
    ? grants.find(g => g.id === param)
    : null

  return (
    <div className="app-shell">
      <Sidebar activePage={sidebarActive} navigate={navigate} />
      <div className="main-content">
        {renderPage()}
      </div>

      {assistantOpen && (
        <div className="assistant-drawer">
          <GrantAssistant
            key={contextGrant?.id || 'global'}
            grant={contextGrant}
            allGrants={grants}
            onClose={() => setAssistantOpen(false)}
          />
        </div>
      )}

      <button
        className={`assistant-fab${assistantOpen ? ' assistant-fab--active' : ''}`}
        onClick={() => setAssistantOpen(o => !o)}
        title="Grant Assistant"
      >
        <MessageSquare size={20} strokeWidth={1.75} />
      </button>
    </div>
  )
}
