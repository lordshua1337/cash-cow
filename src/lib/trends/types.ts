export type TrendCategory =
  | 'AI/ML'
  | 'Fintech'
  | 'Health'
  | 'Education'
  | 'Creator Tools'
  | 'Dev Tools'
  | 'E-Commerce'
  | 'Web3'
  | 'Infrastructure'
  | 'Enterprise'
  | 'Other'

export type TrendStage =
  | 'Emerging'
  | 'Accelerating'
  | 'Peaking'
  | 'Saturating'
  | 'Declining'

export type TrendSignalSource =
  | 'HackerNews'
  | 'GitHub'
  | 'Reddit'
  | 'GoogleTrends'
  | 'ProductHunt'

export interface Trend {
  readonly id: string
  readonly name: string
  readonly category: TrendCategory
  readonly description?: string
  readonly current_stage: TrendStage
  readonly trend_score: number
  readonly confidence_score: number
  readonly competition_density: 'Low' | 'Medium' | 'High'
  readonly monetization_signal: 'None' | 'Emerging' | 'Proven' | 'Unknown'
  readonly time_to_build_days?: number
  readonly created_at: string
  readonly updated_at: string
  readonly last_analyzed_at?: string
}

export interface TrendSignal {
  readonly id: string
  readonly trend_id: string
  readonly source: TrendSignalSource
  readonly signal_score: number
  readonly velocity?: number
  readonly raw_data?: Record<string, unknown>
  readonly created_at: string
}

export interface TrendAnalysis {
  readonly id: string
  readonly trend_id: string
  readonly analysis_stage: TrendStage
  readonly confidence_percent: number
  readonly historical_pattern?: string
  readonly ai_notes?: string
  readonly key_indicators?: ReadonlyArray<{ indicator: string; value: unknown }>
  readonly estimated_peak_months?: number
  readonly related_trends?: readonly string[]
  readonly updated_at: string
  readonly analyzed_by: string
}

export interface Watchlist {
  readonly id: string
  readonly user_id: string
  readonly name: string
  readonly description?: string
  readonly keyword_filters: readonly string[]
  readonly category_filters?: readonly TrendCategory[]
  readonly min_trend_score: number
  readonly created_at: string
  readonly updated_at: string
}

export interface Alert {
  readonly id: string
  readonly user_id: string
  readonly watchlist_id?: string
  readonly trend_id: string
  readonly alert_type: 'Breakout' | 'Decay' | 'DailyDigest' | 'Custom'
  readonly title: string
  readonly message: string
  readonly sent_at: string
  readonly read_at?: string
}
