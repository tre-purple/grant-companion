import React, { useState, useRef, useEffect } from 'react'
import { callClaude } from '../utils/claude'

export default function GrantAssistant({ grant, reportingPeriod }) {
  const [messages, setMessages] = useState([
    { role: 'system', text: 'Ask questions about your grant progress, objectives, or what to include in your report.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const SUGGESTIONS = [
    'What have we done toward each objective?',
    "What's missing for this report?",
    'How many check-ins do we have this quarter?',
  ]

  async function send(text) {
    const msg = (text || input).trim()
    if (!msg) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: msg }])
    setLoading(true)

    const system = `You are a helpful grant assistant for the "${grant.name}" grant managed by a nonprofit.
You have access to the following grant data:
- Funder: ${grant.funder}
- Objectives: ${grant.objectives.map(o => `${o.title}: ${o.description}`).join('; ')}
- Check-ins: ${JSON.stringify(grant.checkins)}
- Reporting period being prepared: ${reportingPeriod?.start || 'not set'} to ${reportingPeriod?.end || 'not set'}
Answer questions concisely and helpfully to assist staff in preparing their grant report.`

    try {
      const reply = await callClaude([{ role: 'user', content: msg }], system)
      setMessages(m => [...m, { role: 'assistant', text: reply }])
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', text: `Error: ${e.message}` }])
    }
    setLoading(false)
  }

  return (
    <div className="assistant-panel" style={{ position: 'sticky', top: 76, maxHeight: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <div className="assistant-header">
        <span className="assistant-icon">💬</span>
        <span className="assistant-title">Grant Assistant</span>
      </div>

      <div className="assistant-messages" style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>{m.text}</div>
        ))}
        {loading && (
          <div className="chat-bubble assistant" style={{ opacity: 0.6 }}>Thinking…</div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length === 1 && (
        <div className="chat-prompts">
          <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 8 }}>Try asking:</div>
          {SUGGESTIONS.map(s => (
            <button key={s} className="chat-prompt-btn" onClick={() => send(s)}>
              "{s}"
            </button>
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
