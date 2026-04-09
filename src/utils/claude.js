// ── Anthropic API Helper ─────────────────────────────────────────────────────
//
// This calls the Claude API to power three features:
//   1. Document extraction  — reads uploaded grant docs and pulls out key fields
//   2. Report generation    — turns check-ins + objectives into a funder-ready report
//   3. Grant Assistant chat — answers staff questions about their grant progress
//
// The API key is never stored in code. It must be set in your environment:
//   VITE_ANTHROPIC_API_KEY=sk-ant-...
//
// See README.md for setup instructions.
// ─────────────────────────────────────────────────────────────────────────────

const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

export async function callClaude(messages, system = '') {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error(
      'Missing VITE_ANTHROPIC_API_KEY. Create a .env file with your Anthropic API key. See README.md.'
    )
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-calls': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      system: system || 'You are a helpful grant management assistant for nonprofit organizations.',
      messages,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${res.status}`)
  }

  const data = await res.json()
  return data.content?.[0]?.text || ''
}
