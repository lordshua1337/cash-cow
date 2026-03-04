// Cash Cow -- Core Types

export type CalfStatus = 'grazing' | 'building' | 'milking' | 'dried_up'

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export type DataSource = 'api_verified' | 'ai_estimated'

export type ComplaintSource = 'g2' | 'reddit' | 'product_hunt' | 'ai_hypothetical'

export interface TrendingProduct {
  readonly name: string
  readonly rating: number
  readonly reviewCount: number
  readonly category: string
  readonly source: 'google' | 'product_hunt'
  readonly dataSource?: DataSource
  readonly confidenceLevel?: ConfidenceLevel
}

export interface Competitor {
  readonly company: string
  readonly pricing: string
  readonly keyFeatures: readonly string[]
  readonly complaints: readonly string[]
  readonly dataSource: DataSource
  readonly techStack?: readonly string[]
  readonly estimatedTraffic?: {
    readonly monthly: number
    readonly source: string
  }
}

export interface ComplaintCluster {
  readonly complaintTheme: string
  readonly frequency: number
  readonly sentiment: 'negative' | 'neutral'
  readonly exampleQuotes: readonly string[]
  readonly source: ComplaintSource
  readonly sourceCount: number
  readonly verified: boolean
}

export interface MarketSnapshot {
  readonly id: string
  readonly userId: string
  readonly niche: string
  readonly createdAt: string
  readonly trendingProducts: readonly TrendingProduct[]
  readonly competitorLandscape: readonly Competitor[]
  readonly reviewComplaintClusters: readonly ComplaintCluster[]
  readonly isExample?: boolean
}

export interface VariationLevel {
  readonly name: string
  readonly features: readonly string[]
  readonly buildDays: number
  readonly pricing: number
}

export interface ScoreWithConfidence {
  readonly score: number
  readonly verifiedScore?: number
  readonly confidenceLevel: ConfidenceLevel
  readonly verificationPercentage: number
}

export interface Calf {
  readonly id: string
  readonly userId: string
  readonly niche: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly status: CalfStatus
  readonly productName: string
  readonly oneLinePitch: string
  readonly targetAudience: string
  readonly coreFeatures: readonly string[]
  readonly differentiationAngle: string
  readonly monetizationModel: string
  readonly pricingRecommendation: number
  readonly estimatedBuildDays: number
  readonly buildDaysMin: number
  readonly buildDaysMax: number
  readonly buildDaysContext: string
  readonly marketDemandScore: number
  readonly marketDemandScoreVerified?: number
  readonly competitionDensityScore: number
  readonly buildComplexityScore: number
  readonly revenuePotentialScore: number
  readonly revenuePotentialScoreVerified?: number
  readonly aiBuildabilityScore: number
  readonly overallScore: number
  readonly confidenceLevel: ConfidenceLevel
  readonly verificationPercentage: number
  readonly revenuePotentialMin: number
  readonly revenuePotentialMax: number
  readonly revenuePotentialBasis: string
  readonly monthlyRevenue?: number
  readonly whyWorksData: {
    readonly trendVelocity: string
    readonly adSpendInsight: string
    readonly complaintClusters: readonly string[]
  }
  readonly whyMightFail: {
    readonly risks: readonly string[]
    readonly marketSaturation: boolean
    readonly buildComplexity: string
  }
  readonly variationLevels: {
    readonly micro: VariationLevel
    readonly standard: VariationLevel
    readonly premium: VariationLevel
  }
  readonly briefMarkdown?: string
  readonly snapshotId: string
}

// Webhook payload types (stubs -- will be used when real API routes are added)
export interface TrendAlertPayload {
  readonly source: string
  readonly timestamp: string
  readonly trendId: string
  readonly category: string
  readonly velocity: number
  readonly score: number
}

export interface AdIntelPayload {
  readonly source: string
  readonly timestamp: string
  readonly competitorId: string
  readonly adPatterns: Record<string, unknown>
  readonly spend: number
}
