import type { MarketSnapshot, Calf } from '@/lib/types'
import { EXAMPLE_SNAPSHOTS } from '@/lib/mock-data'
import {
  scoreIdeaMarketDemand,
  scoreCompetitionDensity,
  scoreBuildComplexity,
  scoreRevenuePotential,
  scoreAIBuildability,
  calculateOverallScore,
} from '@/lib/scoring'

import { callLLM } from '@/lib/ai/llm'

function extractJson<T>(text: string): T {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON found in response')
  return JSON.parse(match[0]) as T
}

function extractJsonArray<T>(text: string): T[] {
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('No JSON array found in response')
  return JSON.parse(match[0]) as T[]
}

const EXAMPLE_FORMAT = JSON.stringify(EXAMPLE_SNAPSHOTS[0], null, 2)

interface RawSnapshotData {
  niche: string
  trendingProducts: Array<{
    name: string
    rating: number
    reviewCount: number
    category: string
    source: 'google' | 'product_hunt'
  }>
  competitorLandscape: Array<{
    company: string
    pricing: string
    keyFeatures: string[]
    complaints: string[]
    techStack?: string[]
    estimatedTraffic?: { monthly: number; source: string }
  }>
  reviewComplaintClusters: Array<{
    complaintTheme: string
    frequency: number
    sentiment: 'negative' | 'neutral'
    exampleQuotes: string[]
    source: 'g2' | 'reddit' | 'product_hunt' | 'ai_hypothetical'
    sourceCount: number
    verified: boolean
  }>
}

export async function researchNiche(niche: string): Promise<MarketSnapshot> {
  const system = `You are a senior product researcher and market analyst. Research the given niche thoroughly.

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):

${EXAMPLE_FORMAT}

Rules:
- Include 4-6 trending products with realistic ratings and review counts
- Include 3-4 competitors with real pricing, features, and tech stacks
- Include 3-5 complaint clusters mined from review sites
- All data is AI-estimated (set dataSource to "ai_estimated", verified to false, source to "ai_hypothetical")
- Use realistic numbers based on your knowledge of the market
- Do NOT include id, userId, createdAt, or isExample fields -- those are added server-side`

  const userPrompt = `Research the "${niche}" market niche. Provide comprehensive market analysis including trending products, competitor landscape, and common user complaints.`

  const response = await callLLM(system, userPrompt)
  const raw = extractJson<RawSnapshotData>(response)

  const now = new Date().toISOString()
  const id = `snap-${niche.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`

  return {
    id,
    userId: 'user',
    niche: raw.niche || niche,
    createdAt: now,
    trendingProducts: raw.trendingProducts.map((p) => ({
      ...p,
      dataSource: 'ai_estimated' as const,
      confidenceLevel: 'low' as const,
    })),
    competitorLandscape: raw.competitorLandscape.map((c) => ({
      ...c,
      complaints: c.complaints || [],
      dataSource: 'ai_estimated' as const,
    })),
    reviewComplaintClusters: raw.reviewComplaintClusters.map((c) => ({
      ...c,
      verified: false,
      source: c.source || ('ai_hypothetical' as const),
    })),
  }
}

interface RawCalfData {
  productName: string
  oneLinePitch: string
  targetAudience: string
  coreFeatures: string[]
  differentiationAngle: string
  monetizationModel: string
  pricingRecommendation: number
  estimatedBuildDays: number
  buildDaysMin: number
  buildDaysMax: number
  buildDaysContext: string
  revenuePotentialMin: number
  revenuePotentialMax: number
  revenuePotentialBasis: string
  whyWorksData: {
    trendVelocity: string
    adSpendInsight: string
    complaintClusters: string[]
  }
  whyMightFail: {
    risks: string[]
    marketSaturation: boolean
    buildComplexity: string
  }
  variationLevels: {
    micro: { name: string; features: string[]; buildDays: number; pricing: number }
    standard: { name: string; features: string[]; buildDays: number; pricing: number }
    premium: { name: string; features: string[]; buildDays: number; pricing: number }
  }
}

export async function generateCalfIdeas(snapshot: MarketSnapshot): Promise<Calf[]> {
  const system = `You are a product strategist who generates innovative product ideas from market research.

Given a market snapshot with trending products, competitors, and complaint clusters, generate 2-3 unique product ideas that address real gaps.

Return ONLY a valid JSON array. Each object must have these fields:
- productName: string (creative, memorable name)
- oneLinePitch: string (one sentence)
- targetAudience: string (specific audience)
- coreFeatures: string[] (5 MVP features)
- differentiationAngle: string (what makes it unique)
- monetizationModel: string (subscription, saas, freemium, marketplace, one-time)
- pricingRecommendation: number (monthly price in USD)
- estimatedBuildDays: number
- buildDaysMin: number
- buildDaysMax: number
- buildDaysContext: string
- revenuePotentialMin: number (monthly, in USD)
- revenuePotentialMax: number (monthly, in USD)
- revenuePotentialBasis: string
- whyWorksData: { trendVelocity: string, adSpendInsight: string, complaintClusters: string[] }
- whyMightFail: { risks: string[], marketSaturation: boolean, buildComplexity: string }
- variationLevels: { micro: { name, features[], buildDays, pricing }, standard: { ... }, premium: { ... } }

Do NOT include scoring fields -- those are calculated server-side.`

  const userPrompt = `Generate product ideas from this market research:

Niche: ${snapshot.niche}
Trending Products: ${JSON.stringify(snapshot.trendingProducts.map((p) => p.name))}
Competitors: ${JSON.stringify(snapshot.competitorLandscape.map((c) => ({ company: c.company, pricing: c.pricing, features: c.keyFeatures })))}
Top Complaints: ${JSON.stringify(snapshot.reviewComplaintClusters.map((c) => ({ theme: c.complaintTheme, frequency: c.frequency })))}`

  const response = await callLLM(system, userPrompt, 6000)
  const rawCalves = extractJsonArray<RawCalfData>(response)

  const now = new Date().toISOString()

  return rawCalves.map((raw, index) => {
    const demandScore = scoreIdeaMarketDemand(
      snapshot.trendingProducts,
      snapshot.reviewComplaintClusters
    )
    const competitionScore = scoreCompetitionDensity(
      snapshot.competitorLandscape,
      snapshot.trendingProducts
    )
    const complexityScore = scoreBuildComplexity(raw.coreFeatures)
    const revenueScore = scoreRevenuePotential(
      raw.pricingRecommendation,
      raw.monetizationModel,
      snapshot.competitorLandscape
    )
    const aiScore = scoreAIBuildability(raw.coreFeatures, raw.estimatedBuildDays)
    const overall = calculateOverallScore(demandScore, competitionScore, complexityScore, revenueScore, aiScore)

    const id = `calf-${raw.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}-${index}`

    return {
      id,
      userId: 'user',
      niche: snapshot.niche,
      createdAt: now,
      updatedAt: now,
      status: 'grazing' as const,
      productName: raw.productName,
      oneLinePitch: raw.oneLinePitch,
      targetAudience: raw.targetAudience,
      coreFeatures: raw.coreFeatures,
      differentiationAngle: raw.differentiationAngle,
      monetizationModel: raw.monetizationModel,
      pricingRecommendation: raw.pricingRecommendation,
      estimatedBuildDays: raw.estimatedBuildDays,
      buildDaysMin: raw.buildDaysMin,
      buildDaysMax: raw.buildDaysMax,
      buildDaysContext: raw.buildDaysContext,
      marketDemandScore: demandScore.score,
      marketDemandScoreVerified: demandScore.verifiedScore,
      competitionDensityScore: competitionScore,
      buildComplexityScore: complexityScore,
      revenuePotentialScore: revenueScore.score,
      revenuePotentialScoreVerified: revenueScore.verifiedScore,
      aiBuildabilityScore: aiScore,
      overallScore: overall.score,
      confidenceLevel: overall.confidenceLevel,
      verificationPercentage: overall.verificationPercentage,
      revenuePotentialMin: raw.revenuePotentialMin,
      revenuePotentialMax: raw.revenuePotentialMax,
      revenuePotentialBasis: raw.revenuePotentialBasis,
      whyWorksData: raw.whyWorksData,
      whyMightFail: raw.whyMightFail,
      variationLevels: raw.variationLevels,
      snapshotId: snapshot.id,
    }
  })
}

export async function generateBrief(calf: Calf, snapshot: MarketSnapshot | null): Promise<string> {
  const system = `You are a senior product architect who writes comprehensive build briefs for product ideas.

Generate a detailed, actionable build brief in markdown format. Include these sections:
## Vision & Target Audience
## Tech Stack
## MVP Features (detailed breakdown of each feature)
## Data Model
## Revenue Model (pricing tiers)
## Build Timeline (week-by-week)
## Risks & Mitigations (as a markdown table)

Be specific, practical, and realistic. This brief should be ready to hand to a developer.`

  const userPrompt = `Write a build brief for this product:

Product: ${calf.productName}
Pitch: ${calf.oneLinePitch}
Target Audience: ${calf.targetAudience}
Niche: ${calf.niche}
Core Features: ${JSON.stringify(calf.coreFeatures)}
Differentiation: ${calf.differentiationAngle}
Monetization: ${calf.monetizationModel}
Pricing: $${calf.pricingRecommendation}/mo
Build Time: ${calf.buildDaysMin}-${calf.buildDaysMax} days
Revenue Potential: $${calf.revenuePotentialMin}-$${calf.revenuePotentialMax}/mo
Variations: ${JSON.stringify(calf.variationLevels)}
${snapshot ? `Market Context: ${snapshot.competitorLandscape.map((c) => `${c.company} (${c.pricing})`).join(', ')}` : ''}`

  return callLLM(system, userPrompt, 4000)
}
