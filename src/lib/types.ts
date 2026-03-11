// Cash Cow -- Core Types

export type Complexity = 'weekend' | 'few-weeks' | 'month-plus'

export type IdeaCategory = 'all' | 'ai-tools' | 'productivity' | 'finance' | 'health' | 'education' | 'marketing'

export interface ProductIdea {
  readonly id: string
  readonly name: string
  readonly pitch: string
  readonly category: string
  readonly whyNow: string
  readonly risk: string
  readonly complexity: Complexity
}

export interface BuildSpec {
  readonly productName: string
  readonly whatYoureBuilding: string
  readonly whoWantsThis: string
  readonly whyThisCouldWork: string
  readonly coreFeatures: readonly string[]
  readonly techStack: readonly { tool: string; why: string }[]
  readonly buildPlan: readonly string[]
  readonly v2Ideas: readonly string[]
  readonly risks: readonly string[]
  readonly complexity: Complexity
  // Monetization fields (optional for backward compat with old specs)
  readonly monetizationModel?: string
  readonly pricingStrategy?: string
  readonly revenueTimeline?: string
  readonly customerAcquisition?: string
}

// Keep TrendSource for internal API fetching (HN + GitHub raw data)
export type TrendSource = 'hackernews' | 'github'

export interface TrendingProduct {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly url: string
  readonly source: TrendSource
  readonly score: number
  readonly commentCount: number
  readonly timestamp: string
  readonly category: string
}
