import { NextResponse } from 'next/server'
import { TRENDS, type MarketTrend } from '@/data/trends'
import { fetchLiveSignals, type LiveSignal } from '@/lib/trend-adapters'

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  try {
    // Fetch live signals for each trend in parallel (batched to avoid rate limits)
    const batchSize = 5
    const trendNames = TRENDS.map((t) => t.name)
    const allLiveSignals: Map<string, readonly LiveSignal[]> = new Map()

    for (let i = 0; i < trendNames.length; i += batchSize) {
      const batch = trendNames.slice(i, i + batchSize)
      const results = await Promise.all(
        batch.map(async (name) => {
          const signals = await fetchLiveSignals(name)
          return { name, signals }
        })
      )
      for (const r of results) {
        allLiveSignals.set(r.name, r.signals)
      }
    }

    // Merge live signals into static trend data
    const enrichedTrends: MarketTrend[] = TRENDS.map((trend) => {
      const live = allLiveSignals.get(trend.name) ?? []

      if (live.length === 0) return { ...trend }

      // Replace matching signals with live data, keep others as-is
      const updatedSignals = trend.signals.map((staticSignal) => {
        const liveMatch = live.find((l) => l.source === staticSignal.source)
        if (liveMatch) {
          return {
            source: liveMatch.source,
            score: liveMatch.score,
            velocity: liveMatch.velocity,
          }
        }
        return staticSignal
      })

      // Recalculate overall score as weighted average of all signals
      const avgScore = Math.round(
        updatedSignals.reduce((sum, s) => sum + s.score, 0) / updatedSignals.length
      )

      // Recalculate confidence based on how many sources have data
      const liveSources = live.filter((l) => l.mentions > 0).length
      const confidence = Math.round(
        (trend.confidence * 0.5) + (liveSources / 2) * 50 * 0.5
      )

      return {
        ...trend,
        signals: updatedSignals,
        score: Math.round(trend.score * 0.4 + avgScore * 0.6),
        confidence: Math.min(100, confidence),
      }
    })

    // Sort by score descending
    const sorted = [...enrichedTrends].sort((a, b) => b.score - a.score)

    return NextResponse.json({
      trends: sorted,
      live: true,
      sources: ['HackerNews', 'GitHub'],
      fetchedAt: new Date().toISOString(),
    })
  } catch {
    // Fallback to static data on any error
    return NextResponse.json({
      trends: TRENDS,
      live: false,
      sources: [],
      fetchedAt: new Date().toISOString(),
    })
  }
}
