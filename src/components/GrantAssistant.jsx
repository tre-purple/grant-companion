import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X } from 'lucide-react'
import { callClaude } from '../utils/claude'
import { fmtMoney } from '../utils/helpers'

export default function GrantAssistant({ grant, allGrants, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'system', text: grant
        ? 'Ask questions about this grant\'s progress, objectives, or what to include in your report.'
        : 'Ask questions about any of your grants — deadlines, progress, next steps, or anything else.' },
  ])
  const [input, setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const SUGGESTIONS = grant
    ? [
        'What have we done toward each objective?',
        'Which objectives need more attention?',
        'Summarize our progress this quarter.',
      ]
    : [
        'Which grants have reports due soon?',
        'What grants am I currently managing?',
        'Which grant has the most check-ins?',
      ]

  function buildSystem() {
    if (grant) {
      return `You are a helpful grant assistant for the "${grant.name}" grant managed by a nonprofit.
Grant data:
- Funder: ${grant.funder || 'N/A'}
- Budget: ${fmtMoney(grant.fundingAmount)}
- Status: ${grant.status}
- Objectives: ${grant.objectives.map(o => `${o.title} (${o.progress || 0}% complete): ${o.description}`).join('; ')}
- Check-ins (${grant.checkins.length} total): ${JSON.stringify(grant.checkins.slice(-10))}
Answer questions concisely and helpfully.`
    }

    const active = (allGrants || []).filter(g => g.status === 'active')
    return `You are a helpful grant management assistant for a nonprofit organization.
Active grants (${active.length} total):
${active.map(g => `- ${g.name} | Funder: ${g.funder || 'N/A'} | Budget: ${fmtMoney(g.fundingAmount)} | Check-ins: ${g.checkins.length} | Next report: ${g.nextReportDue || 'not set'}`).join('\n')}
Answer questions about grant deadlines, progress, and next steps. Be concise and helpful.`
  }

  async function send(text) {
    const msg = (text || input).trim()
    if (!msg) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const reply = await callClaude([{ role: 'user', content: msg }], buildSystem())
      setMessages(m => [...m, { role: 'assistant', text: reply }])
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', text: `Error: ${e.message}` }])
    }
    setLoading(false)
  }

  return (
    <div className="assistant-panel">
      <div className="assistant-header">
        <span className="assistant-icon"><MessageSquare size={18} strokeWidth={1.75} /></span>
        <span className="assistant-title">{grant ? grant.name : 'Grant Assistant'}</span>
        {onClose && (
          <button className="btn-icon" style={{ marginLeft: 'auto' }} onClick={onClose} title="Close">
            <X size={16} strokeWidth={1.75} />
          </button>
        )}
      </div>

      <div className="assistant-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>{m.text}</div>
        ))}
        {loading && <div className="chat-bubble assistant" style={{ opacity: 0.6 }}>Thinking…</div>}
        <div ref={endRef} />
      </div>

      {messages.length === 1 && (
        <div className="chat-prompts">
          <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 8 }}>Try asking:</div>
          {SUGGESTIONS.map(s => (
            <button key={s} className="chat-prompt-btn" onClick={() => send(s)}>"{s}"</button>
          ))}
        </div>
      )}

      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Ask a question…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && send()}
        />
        <button className="btn btn-primary btn-sm" onClick={() => send()} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  )
}
