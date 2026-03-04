import type { ComplaintCluster, TrendingProduct, Competitor, ScoreWithConfidence } from './types'

export function scoreIdeaMarketDemand(
  trendingProducts: readonly TrendingProduct[],
  complaintClusters: readonly ComplaintCluster[]
): ScoreWithConfidence {
  const productFactor = Math.min(trendingProducts.length * 5, 50)

  const verifiedComplaints = complaintClusters.filter((c) => c.verified)
  const complaintFactor =
    verifiedComplaints.length > 0
      ? verifiedComplaints.reduce((sum, c) => sum + c.frequency, 0) / verifiedComplaints.length
      : 0

  const score = Math.min(Math.round((productFactor + complaintFactor) / 2), 100)
  const verifiedScore = verifiedComplaints.length > 0 ? score : undefined

  const verificationPercentage =
    complaintClusters.length > 0
      ? Math.round((verifiedComplaints.length / complaintClusters.length) * 100)
      : 0

  return {
    score,
    verifiedScore,
    confidenceLevel: verificationPercentage >= 80 ? 'high' : verificationPercentage >= 50 ? 'medium' : 'low',
    verificationPercentage,
  }
}

export function scoreCompetitionDensity(
  competitors: readonly Competitor[],
  trendingProducts: readonly TrendingProduct[]
): number {
  const competitorCount = competitors.length
  const productCount = trendingProducts.length
  const density = Math.min((competitorCount / (productCount || 1)) * 50, 100)
  return Math.round(density)
}

export function scoreBuildComplexity(features: readonly string[]): number {
  const featureCount = features.length
  if (featureCount === 0) return 10
  const complexityPerFeature =
    features.reduce((sum, f) => {
      const wordCount = f.split(' ').length
      return sum + (wordCount > 10 ? 20 : wordCount > 5 ? 15 : 10)
    }, 0) / featureCount

  return Math.min(Math.round((featureCount * 3 + complexityPerFeature) / 2), 100)
}

export function scoreRevenuePotential(
  pricing: number,
  monetizationModel: string,
  competitors: readonly Competitor[]
): ScoreWithConfidence {
  const pricingFactor = Math.min((pricing / 100) * 40, 40)

  const modelFactors: Record<string, number> = {
    subscription: 30,
    marketplace: 25,
    freemium: 20,
    saas: 35,
    'one-time': 15,
  }
  const modelFactor = modelFactors[monetizationModel.toLowerCase()] ?? 20

  const verifiedCompetitors = competitors.filter((c) => c.dataSource === 'api_verified')
  const marketFactor = Math.min(verifiedCompetitors.length * 2, 30)

  const score = Math.round(pricingFactor + modelFactor + marketFactor)
  const verifiedScore = verifiedCompetitors.length > 0 ? score : undefined

  const verificationPercentage =
    competitors.length > 0
      ? Math.round((verifiedCompetitors.length / competitors.length) * 100)
      : 0

  return {
    score,
    verifiedScore,
    confidenceLevel: verificationPercentage >= 80 ? 'high' : verificationPercentage >= 50 ? 'medium' : 'low',
    verificationPercentage,
  }
}

export function scoreAIBuildability(features: readonly string[], buildDays: number): number {
  const speedFactor = buildDays <= 3 ? 80 : buildDays <= 14 ? 60 : buildDays <= 30 ? 40 : 20
  const featureFactor = features.length <= 5 ? 20 : features.length <= 10 ? 15 : 10
  return Math.min(speedFactor + featureFactor, 100)
}

export function calculateOverallScore(
  demandScore: ScoreWithConfidence,
  competitionScore: number,
  complexityScore: number,
  revenueScore: ScoreWithConfidence,
  aiabilityScore: number
): ScoreWithConfidence {
  const score =
    (demandScore.score + revenueScore.score + aiabilityScore) * 0.4 -
    (competitionScore + complexityScore * 0.5) * 0.1

  const verifiedScore =
    demandScore.verifiedScore !== undefined && revenueScore.verifiedScore !== undefined
      ? (demandScore.verifiedScore + revenueScore.verifiedScore + aiabilityScore) * 0.4 -
        (competitionScore + complexityScore * 0.5) * 0.1
      : undefined

  const verificationPercentage = Math.round(
    (demandScore.verificationPercentage + revenueScore.verificationPercentage) / 2
  )

  return {
    score: Math.max(Math.min(Math.round(score), 100), 0),
    verifiedScore:
      verifiedScore !== undefined ? Math.max(Math.min(Math.round(verifiedScore), 100), 0) : undefined,
    confidenceLevel: verificationPercentage >= 80 ? 'high' : verificationPercentage >= 50 ? 'medium' : 'low',
    verificationPercentage,
  }
}
