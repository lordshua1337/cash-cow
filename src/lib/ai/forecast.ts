import type { Calf, RevenueForecast, MonthlyForecast } from '@/lib/types'

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || ''
const CLAUDE_MODEL = 'claude-sonnet-4-20250514'

async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY not configured')
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
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

interface RawForecast {
  months: Array<{
    month: number
    label: string
    mrr: number
    best: number
    worst: number
  }>
  assumptions: string[]
  breakEvenMonth: number | null
}

export async function forecastRevenue(calf: Calf): Promise<RevenueForecast> {
  const system = `You are a SaaS revenue analyst. Generate a realistic 12-month MRR forecast.

Return ONLY valid JSON with this structure:
{
  "months": [
    { "month": 1, "label": "Month 1", "mrr": 0, "best": 0, "worst": 0 },
    ... (12 months)
  ],
  "assumptions": ["assumption1", "assumption2", ...],
  "breakEvenMonth": null or number (month when costs are covered)
}

Rules:
- Month 1 revenue should be $0 or very low (launch month)
- Growth should be realistic for a solo-founder SaaS
- Best case: ~2x of base projection
- Worst case: ~0.3x of base projection
- Include 3-5 key assumptions
- Break-even is typically month 4-8 for a solo SaaS`

  const userPrompt = `Forecast 12-month MRR for:

Product: ${calf.productName}
Pricing: $${calf.pricingRecommendation}/mo
Revenue Potential: $${calf.revenuePotentialMin}-$${calf.revenuePotentialMax}/mo
Monetization: ${calf.monetizationModel}
Target Audience: ${calf.targetAudience}
Market Demand Score: ${calf.marketDemandScore}/100
Competition Score: ${calf.competitionDensityScore}/100`

  const response = await callClaude(system, userPrompt)
  const match = response.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON found in forecast response')
  const raw: RawForecast = JSON.parse(match[0])

  return {
    calfId: calf.id,
    months: raw.months.map((m): MonthlyForecast => ({
      month: m.month,
      label: m.label,
      mrr: m.mrr,
      best: m.best,
      worst: m.worst,
    })),
    assumptions: raw.assumptions,
    breakEvenMonth: raw.breakEvenMonth,
  }
}
