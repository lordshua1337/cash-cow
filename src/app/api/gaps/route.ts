import { NextRequest, NextResponse } from 'next/server'
import { callLLM } from '@/lib/ai/llm'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { snapshot } = body

    if (!snapshot || !snapshot.niche) {
      return NextResponse.json({ error: 'Missing research data' }, { status: 400 })
    }

    const systemPrompt = `You are a product strategist who identifies market gaps -- opportunities where competitors fail and users suffer.

Given market research data (competitors, their features, user complaints), identify 3-5 GAP OPPORTUNITIES.

A gap is something that:
1. Users clearly want (based on complaints)
2. No competitor does well (or at all)
3. Could be built into a product differentiator

Return ONLY a valid JSON array. Each gap object must have:
- id: string (like "gap-1", "gap-2")
- title: string (short, punchy -- e.g. "No Real-Time Collaboration")
- description: string (2-3 sentences explaining the gap)
- whyItMatters: string (why users care, backed by complaint data)
- complaintsAddressed: string[] (which complaint themes this solves)
- competitorWeaknesses: string[] (which competitors fail here and why)
- feasibilityScore: number (1-10, how buildable is this?)
- revenueScore: number (1-10, how much money could this make?)
- differentiationScore: number (1-10, how hard is this for competitors to copy?)

Rank by: highest combined score. Be specific and actionable.`

    const userPrompt = `Find the market gaps in the "${snapshot.niche}" space.

COMPETITORS:
${JSON.stringify(snapshot.competitorLandscape.map((c: { company: string; pricing: string; keyFeatures: readonly string[]; complaints: readonly string[] }) => ({
  company: c.company,
  pricing: c.pricing,
  features: c.keyFeatures,
  complaints: c.complaints,
})), null, 2)}

USER COMPLAINTS:
${JSON.stringify(snapshot.reviewComplaintClusters.map((c: { complaintTheme: string; frequency: number; exampleQuotes: readonly string[] }) => ({
  theme: c.complaintTheme,
  frequency: c.frequency,
  quotes: c.exampleQuotes,
})), null, 2)}

TRENDING PRODUCTS:
${snapshot.trendingProducts.map((p: { name: string }) => p.name).join(', ')}`

    const text = await callLLM(systemPrompt, userPrompt, 4000)
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) {
      return NextResponse.json({ error: 'Could not parse gap analysis' }, { status: 500 })
    }

    const gaps = JSON.parse(match[0])
    return NextResponse.json({ gaps })
  } catch (err) {
    console.error('Gap analysis error:', err)
    return NextResponse.json({ error: 'Gap analysis failed' }, { status: 500 })
  }
}
