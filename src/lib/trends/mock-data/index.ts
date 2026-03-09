import type { Trend, TrendCategory, TrendStage, TrendSignal, TrendAnalysis, Alert, Watchlist } from '@/lib/trends/types'
import { mockTrends } from './trends'
import { mockSignals } from './signals'
import { mockAnalysis } from './analysis'
import { mockAlerts } from './alerts'
import { mockWatchlists } from './watchlists'

export { mockTrends, mockSignals, mockAnalysis, mockAlerts, mockWatchlists }

export interface TrendFilters {
  readonly category?: TrendCategory
  readonly stage?: TrendStage
  readonly minScore?: number
  readonly maxScore?: number
  readonly competition?: 'Low' | 'Medium' | 'High'
  readonly monetization?: 'None' | 'Emerging' | 'Proven' | 'Unknown'
  readonly sortBy?: 'trend_score' | 'confidence_score' | 'name' | 'created_at'
  readonly sortDir?: 'asc' | 'desc'
}

export function getTrends(filters?: TrendFilters): readonly Trend[] {
  let results: readonly Trend[] = mockTrends

  if (!filters) {
    return results
  }

  if (filters.category !== undefined) {
    results = results.filter((t) => t.category === filters.category)
  }

  if (filters.stage !== undefined) {
    results = results.filter((t) => t.current_stage === filters.stage)
  }

  if (filters.minScore !== undefined) {
    results = results.filter((t) => t.trend_score >= (filters.minScore as number))
  }

  if (filters.maxScore !== undefined) {
    results = results.filter((t) => t.trend_score <= (filters.maxScore as number))
  }

  if (filters.competition !== undefined) {
    results = results.filter((t) => t.competition_density === filters.competition)
  }

  if (filters.monetization !== undefined) {
    results = results.filter((t) => t.monetization_signal === filters.monetization)
  }

  const sortBy = filters.sortBy ?? 'trend_score'
  const sortDir = filters.sortDir ?? 'desc'

  return [...results].sort((a, b) => {
    let aVal: string | number
    let bVal: string | number

    if (sortBy === 'name') {
      aVal = a.name
      bVal = b.name
    } else if (sortBy === 'created_at') {
      aVal = a.created_at
      bVal = b.created_at
    } else {
      aVal = a[sortBy]
      bVal = b[sortBy]
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }

    return sortDir === 'asc'
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number)
  })
}

export function getTrendById(id: string): Trend | undefined {
  return mockTrends.find((t) => t.id === id)
}

export function getSignalsForTrend(trendId: string): readonly TrendSignal[] {
  return mockSignals.filter((s) => s.trend_id === trendId)
}

export function getAnalysisForTrend(trendId: string): TrendAnalysis | undefined {
  return mockAnalysis.find((a) => a.trend_id === trendId)
}

export function getAlerts(): readonly Alert[] {
  return mockAlerts
}

export function getWatchlists(): readonly Watchlist[] {
  return mockWatchlists
}

export function getCategoryStats(): ReadonlyArray<{
  category: TrendCategory
  count: number
  avgScore: number
  topTrends: readonly Trend[]
}> {
  const categories: TrendCategory[] = [
    'AI/ML',
    'Fintech',
    'Health',
    'Education',
    'Creator Tools',
    'Dev Tools',
    'E-Commerce',
    'Web3',
    'Infrastructure',
    'Enterprise',
    'Other',
  ]

  return categories.map((category) => {
    const trends = mockTrends.filter((t) => t.category === category)
    const avgScore =
      trends.length > 0
        ? Math.round(trends.reduce((sum, t) => sum + t.trend_score, 0) / trends.length)
        : 0
    const topTrends = [...trends]
      .sort((a, b) => b.trend_score - a.trend_score)
      .slice(0, 3)

    return {
      category,
      count: trends.length,
      avgScore,
      topTrends,
    }
  })
}
