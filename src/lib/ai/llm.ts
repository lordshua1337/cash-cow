// Unified LLM caller -- routes between Groq (free) and Claude (paid upgrade)
// Groq is the default. Set CLAUDE_API_KEY to upgrade to Claude quality.

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || ''

const GROQ_MODEL = 'llama-3.3-70b-versatile'
const CLAUDE_MODEL = 'claude-sonnet-4-20250514'

type Provider = 'groq' | 'claude'

function getProvider(): Provider {
  // Claude takes priority if both are set
  if (CLAUDE_API_KEY) return 'claude'
  if (GROQ_API_KEY) return 'groq'
  throw new Error('No AI provider configured. Set GROQ_API_KEY (free) or CLAUDE_API_KEY.')
}

async function callGroq(system: string, user: string, maxTokens: number): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: maxTokens,
      temperature: 0.7,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq API error: ${res.status} ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

async function callClaude(system: string, user: string, maxTokens: number): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error: ${res.status} ${err}`)
  }

  const data = await res.json()
  const content = data.content?.[0]
  if (content?.type === 'text') return content.text
  throw new Error('Unexpected Claude response format')
}

export async function callLLM(system: string, user: string, maxTokens = 4000): Promise<string> {
  const provider = getProvider()
  if (provider === 'claude') {
    return callClaude(system, user, maxTokens)
  }
  return callGroq(system, user, maxTokens)
}

export function getActiveProvider(): string {
  try {
    return getProvider()
  } catch {
    return 'none'
  }
}
