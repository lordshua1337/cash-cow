// Cash Cow -- Core Types

export type TrendSource = 'hackernews' | 'github'

export type Complexity = 'weekend' | 'few-weeks' | 'month-plus'

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

export interface BuildSpec {
  readonly productName: string
  readonly whatItDoes: string
  readonly whoItsFor: string
  readonly coreFeatures: readonly string[]
  readonly techStack: readonly string[]
  readonly mvpScope: string
  readonly complexity: Complexity
  readonly buildSteps: readonly string[]
}
