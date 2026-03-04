import type { Calf, MarketSnapshot, Recommendation } from '@/lib/types'

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

export async function getRecommendations(
  calves: readonly Calf[],
  snapshots: readonly MarketSnapshot[]
): Promise<Recommendation[]> {
  const system = `You are a product portfolio advisor. Analyze a portfolio of product ideas and provide 2-3 actionable recommendations.

Return ONLY a valid JSON array. Each item must have:
- action: "focus" | "pivot" | "explore" | "abandon"
- calfId: string (ID of relevant calf, or null for explore)
- calfName: string (name of relevant calf, or null for explore)
- reasoning: string (1-2 sentences explaining why)
- suggestedNiche: string (only for "explore" action, optional)
- priority: number (1=highest)

Rules:
- Always recommend 1 "focus" action (best opportunity)
- If any calf scores below 50 overall, consider "abandon" or "pivot"
- Include 1 "explore" suggestion for a new niche based on market gaps
- Be specific and data-driven in reasoning`

  const calfSummaries = calves.map((c) => ({
    id: c.id,
    name: c.productName,
    niche: c.niche,
    status: c.status,
    overallScore: c.overallScore,
    marketDemand: c.marketDemandScore,
    competition: c.competitionDensityScore,
    revenue: c.revenuePotentialScore,
    monthlyRevenue: c.monthlyRevenue ?? 0,
    pricing: c.pricingRecommendation,
  }))

  const nicheSummaries = snapshots.map((s) => ({
    niche: s.niche,
    productCount: s.trendingProducts.length,
    competitorCount: s.competitorLandscape.length,
    topComplaints: s.reviewComplaintClusters.map((c) => c.complaintTheme).slice(0, 3),
  }))

  const userPrompt = `Analyze this product portfolio and provide recommendations:

Calves (product ideas):
${JSON.stringify(calfSummaries, null, 2)}

Market Research:
${JSON.stringify(nicheSummaries, null, 2)}`

  const response = await callClaude(system, userPrompt)
  const match = response.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('No JSON array found in recommendations response')
  return JSON.parse(match[0]) as Recommendation[]
}
