import React, { useState, useEffect } from 'react'
import Topbar from '../components/Topbar'
import GrantAssistant from '../components/GrantAssistant'
import { callClaude } from '../utils/claude'
import { fmtDate, fmtMoney } from '../utils/helpers'

export default function GenerateReport({ grantId, grants, navigate }) {
  const grant = grants.find(g => g.id === grantId)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate]     = useState('')
  const [report, setReport]       = useState(null)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied]       = useState(false)

  useEffect(() => {
    if (!grant) return
    // Default: last full quarter
    const now    = new Date()
    const qStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - 3, 1)
    const qEnd   = new Date(qStart.getFullYear(), qStart.getMonth() + 3, 0)
    setStartDate(qStart.toISOString().split('T')[0])
    setEndDate(qEnd.toISOString().split('T')[0])
  }, [grantId])

  if (!grant) return null

  const checkinsInRange = grant.checkins.filter(ci => {
    const d = ci.date
    return (!startDate || d >= startDate) && (!endDate || d <= endDate)
  })

  async function generateReport() {
    setGenerating(true)
    setReport(null)

    const system = `You are a professional grant report writer for nonprofit organizations.
Write formal, outcome-focused quarterly progress reports that are compelling to funders.
Use specific data and details from the check-ins provided. Be concise but thorough.`

    const prompt = `Write a complete quarterly progress report for this grant.

GRANT: ${grant.name}
FUNDER: ${grant.funder || 'N/A'}
BUDGET: ${fmtMoney(grant.fundingAmount)}
REPORTING PERIOD: ${startDate} to ${endDate}

OBJECTIVES:
${grant.objectives.map((o, i) => `${i + 1}. ${o.title}: ${o.description}`).join('\n')}

CHECK-INS DURING PERIOD (${checkinsInRange.length} total):
${checkinsInRange.map(ci => `- ${ci.date}: ${ci.notes} [tags: ${ci.tags?.join(', ') || 'none'}]`).join('\n') || 'No check-ins recorded for this period.'}

Write a professional report with these sections:
1. Executive Summary (2-3 sentences)
2. Progress by Objective (one section per objective, referencing specific check-in activities)
3. Outcomes & Highlights
4. Challenges & Next Steps

Use a formal, factual tone appropriate for a grant funder. Be specific about activities and numbers where available.`

    try {
      const text = await callClaude([{ role: 'user', content: prompt }], system)
      setReport(text)
    } catch (e) {
      setReport(`Error generating report: ${e.message}\n\nPlease check your API key in .env and try again.`)
    }
    setGenerating(false)
  }

  async function copyToClipboard() {
    if (!report) return
    await navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Topbar title="Generate Report" />
      <div className="page-content">
        <div className="breadcrumb">
          <span className="breadcrumb-link" onClick={() => navigate('dashboard')}>Dashboard</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-link" onClick={() => navigate('grant-detail', grantId)}>{grant.name}</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">Generate Report</span>
        </div>

        <div className="two-col">
          {/* ── Left: Report ── */}
          <div>
            <div className="card mb-16">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>
                Generate Report
              </h2>
              <p className="text-muted text-sm mb-16">{grant.name}</p>

              {/* Period selector — always visible so user can change it */}
              <div className="form-group">
                <label className="form-label">Reporting Period</label>
                <div className="form-row">
                  <input
                    className="form-input"
                    type="date"
                    value={startDate}
                    onChange={e => { setStartDate(e.target.value); setReport(null) }}
                  />
                  <input
                    className="form-input"
                    type="date"
                    value={endDate}
                    onChange={e => { setEndDate(e.target.value); setReport(null) }}
                  />
                </div>
                <div className="text-xs text-muted mt-8">
                  {checkinsInRange.length} check-in{checkinsInRange.length !== 1 ? 's' : ''} in this period
                </div>
              </div>

              {!report && (
                <button
                  className="btn btn-primary btn-lg w-full"
                  onClick={generateReport}
                  disabled={generating}
                >
                  {generating
                    ? <><span className="spinner" /> Generating report…</>
                    : '✨ Generate Report'}
                </button>
              )}

              {report && (
                <>
                  <div className="flex gap-8 mb-16">
                    <button className="btn btn-secondary btn-sm" onClick={copyToClipboard}>
                      {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
                    </button>
                    <button className="btn btn-success btn-sm" disabled title="Export coming soon">
                      ⬇️ Export as Doc
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={generateReport} disabled={generating}>
                      ↺ Regenerate
                    </button>
                  </div>

                  <div className="report-content">
                    <div className="report-title">Quarterly Progress Report</div>
                    <div className="report-period">
                      Reporting Period: {fmtDate(startDate)} – {fmtDate(endDate)}
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.85, color: 'var(--gray-700)' }}>
                      {report}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Right: Grant Assistant ── */}
          <GrantAssistant
            grant={grant}
            reportingPeriod={{ start: startDate, end: endDate }}
          />
        </div>
      </div>
    </>
  )
}
