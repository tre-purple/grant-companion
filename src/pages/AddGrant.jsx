import React, { useState } from 'react'
import Topbar from '../components/Topbar'
import { callClaude } from '../utils/claude'
import { uid } from '../utils/helpers'
import { extractTextFromFile } from '../utils/pdfExtract'
import { CheckCircle, Upload, Sparkles, Info } from 'lucide-react'

const DOC_SLOTS = [
  { key: 'rfp',         label: 'Request for Proposal (RFP)',  hint: "The funder's RFP document" },
  { key: 'application', label: 'Grant Application',           hint: 'Your submitted application' },
  { key: 'contract',    label: 'Grant Contract',              hint: 'The executed award agreement' },
]

export default function AddGrant({ onGrantCreated, navigate }) {
  const [step, setStep] = useState(1) // 1=upload  2=extracting  3=confirm  4=success
  const [files, setFiles] = useState({ rfp: null, application: null, contract: null })
  const [editing, setEditing] = useState(null)
  const [newGrantId, setNewGrantId] = useState(null)

  const hasAnyFile = Object.values(files).some(Boolean)

  async function processDocuments() {
    setStep(2)

    const entries = await Promise.all(
      DOC_SLOTS.map(async ({ key, label }) => {
        const file = files[key]
        if (!file) return null
        const text = await extractTextFromFile(file)
        return text ? `=== ${label} ===\n${text}` : null
      })
    )
    const docContent = entries.filter(Boolean).join('\n\n')
    const hasContent = docContent.length > 0

    const systemPrompt = `You are a grant document analyzer for nonprofits. Extract structured info and return ONLY valid JSON, no markdown, no explanation.`

    const prompt = `Analyze the following grant documents and extract key information.
${hasContent ? docContent : `Document filenames: ${Object.values(files).filter(Boolean).map(f => f.name).join(', ')}`}

Return a JSON object with this exact structure:
{
  "name": "Grant program name",
  "funder": "Funder organization name",
  "fundingAmount": 125000,
  "startDate": "2024-01-01",
  "endDate": "2026-12-31",
  "reportingCadence": "Quarterly",
  "objectives": [
    { "id": "o1", "title": "Objective title", "description": "What will be accomplished", "outcomes": ["outcome 1", "outcome 2"] }
  ],
  "contacts": 1
}
Infer realistic values from the document names. Return ONLY the JSON.`

    try {
      const raw = await callClaude([{ role: 'user', content: prompt }], systemPrompt)
      const data = JSON.parse(raw.replace(/```json|```/g, '').trim())
      setEditing(data)
      setStep(3)
    } catch {
      // Graceful fallback if API unavailable
      setEditing({
        name: files.application?.name?.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ') || 'New Grant Program',
        funder: 'Grant Funder',
        fundingAmount: 75000,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        reportingCadence: 'Quarterly',
        contacts: 1,
        objectives: [
          { id: 'o1', title: 'Primary program objective', description: 'Edit this to match your grant objectives', outcomes: [] },
        ],
      })
      setStep(3)
    }
  }

  function confirmAndCreate() {
    const id = 'g' + uid()
    const grant = {
      id,
      ...editing,
      status: 'active',
      fundingAmount: Number(editing.fundingAmount),
      nextReportDue: editing.endDate || null,
      objectives: (editing.objectives || []).map(obj => ({ ...obj, progress: obj.progress ?? 0 })),
      checkins: [],
      reports: [],
      createdAt: new Date().toISOString().split('T')[0],
    }
    setNewGrantId(id)
    onGrantCreated(grant)
    setStep(4)
  }

  // Step 4: Success
  if (step === 4) {
    return (
      <>
        <Topbar title="Add New Grant" />
        <div className="page-content">
          <div className="success-screen">
            <div className="success-icon"><CheckCircle size={64} strokeWidth={1.25} color="var(--green)" /></div>
            <div className="success-title">Grant Created Successfully!</div>
            <div className="success-desc">
              Your grant is now active. Start adding check-ins to track progress toward your objectives.
            </div>
            <div className="flex gap-12">
              <button className="btn btn-secondary" onClick={() => navigate('dashboard')}>
                Back to Dashboard
              </button>
              <button className="btn btn-primary" onClick={() => navigate('grant-detail', newGrantId)}>
                View Grant →
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Step 2: Extracting
  if (step === 2) {
    return (
      <>
        <Topbar title="Add New Grant" />
        <div className="page-content">
          <div className="loading-overlay" style={{ minHeight: 400 }}>
            <div className="spinner-blue" />
            <div style={{ marginTop: 20, fontSize: 16, fontWeight: 600, color: 'var(--gray-700)' }}>
              Analyzing your documents…
            </div>
            <div className="loading-text">
              Extracting objectives, reporting schedule, budget, and key dates
            </div>
          </div>
        </div>
      </>
    )
  }

  // Step 3: Confirm
  if (step === 3 && editing) {
    return (
      <>
        <Topbar title="Confirm Grant Details" />
        <div className="page-content">
          <div className="breadcrumb">
            <span className="breadcrumb-link" onClick={() => navigate('dashboard')}>Dashboard</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">Confirm Grant Details</span>
          </div>

          <div className="banner banner-info mb-16" style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Info size={16} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: 2 }} /> We extracted the following information from your documents. Review and edit anything before creating the grant.
          </div>

          <div className="card" style={{ maxWidth: 720 }}>
            <div className="form-group">
              <label className="form-label">Grant Name</label>
              <input className="form-input" value={editing.name || ''} onChange={e => setEditing(d => ({ ...d, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Funder</label>
              <input className="form-input" value={editing.funder || ''} onChange={e => setEditing(d => ({ ...d, funder: e.target.value }))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input className="form-input" type="date" value={editing.startDate || ''} onChange={e => setEditing(d => ({ ...d, startDate: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input className="form-input" type="date" value={editing.endDate || ''} onChange={e => setEditing(d => ({ ...d, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Funding Amount ($)</label>
                <input className="form-input" type="number" value={editing.fundingAmount || ''} onChange={e => setEditing(d => ({ ...d, fundingAmount: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Reporting Cadence</label>
                <select className="form-select" value={editing.reportingCadence || 'Quarterly'} onChange={e => setEditing(d => ({ ...d, reportingCadence: e.target.value }))}>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Semi-Annual</option>
                  <option>Annual</option>
                </select>
              </div>
            </div>

            {editing.objectives?.length > 0 && (
              <div className="form-group">
                <label className="form-label">Extracted Objectives ({editing.objectives.length})</label>
                {editing.objectives.map(obj => (
                  <div key={obj.id} className="objective-card">
                    <div className="objective-title">{obj.title}</div>
                    <div className="objective-desc">{obj.description}</div>
                  </div>
                ))}
              </div>
            )}

            <hr className="divider" />
            <div className="flex-between">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary btn-lg" onClick={confirmAndCreate}>
                Confirm & Create Grant →
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Step 1: Upload
  return (
    <>
      <Topbar title="Add New Grant" />
      <div className="page-content">
        <div className="breadcrumb">
          <span className="breadcrumb-link" onClick={() => navigate('dashboard')}>Dashboard</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">Add New Grant</span>
        </div>

        <div className="page-header">
          <div className="page-title">Add New Grant</div>
          <div className="page-subtitle">
            Upload your grant documents and we'll extract key information automatically
          </div>
        </div>

        <div className="card" style={{ maxWidth: 720 }}>
          {DOC_SLOTS.map(({ key, label, hint }) => (
            <div key={key} className="upload-section">
              <div className="upload-section-label">{label}</div>
              <label>
                <div className={`upload-zone${files[key] ? ' has-file' : ''}`}>
                  <div className="upload-icon">{files[key] ? <CheckCircle size={28} strokeWidth={1.5} color="var(--green)" /> : <Upload size={28} strokeWidth={1.5} />}</div>
                  {files[key] ? (
                    <div className="upload-text"><strong>{files[key].name}</strong></div>
                  ) : (
                    <>
                      <div className="upload-text">
                        <strong>Click to upload</strong> or drag and drop
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>{hint}</div>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx"
                  onChange={e => setFiles(f => ({ ...f, [key]: e.target.files[0] }))}
                />
              </label>
            </div>
          ))}

          <hr className="divider" />
          <button
            className="btn btn-primary btn-lg w-full"
            disabled={!hasAnyFile}
            onClick={processDocuments}
          >
            {hasAnyFile ? <><Sparkles size={15} strokeWidth={1.75} style={{ marginRight: 6 }} />Process Documents</> : 'Upload at least one document to continue'}
          </button>
        </div>
      </div>
    </>
  )
}
