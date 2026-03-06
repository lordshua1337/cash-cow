'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  ArrowRight,
  Zap,
  Eye,
  Clock,
  AlertTriangle,
  XCircle,
  Filter,
  Radio,
} from 'lucide-react'
import {
  TRENDS,
  STAGE_COLORS,
  VERDICT_COLORS,
  getCategories,
  type TrendCategory,
  type MarketTrend,
} from '@/data/trends'

const VERDICT_ICONS: Record<MarketTrend['verdict'], typeof Zap> = {
  'Build Now': Zap,
  'Watch Closely': Eye,
  'Too Early': Clock,
  'Too Late': XCircle,
  'High Risk': AlertTriangle,
}

const CACHE_KEY = 'cashcow-live-trends'
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

interface CachedTrends {
  readonly trends: readonly MarketTrend[]
  readonly live: boolean
  readonly fetchedAt: string
}

function loadCachedTrends(): CachedTrends | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(CACHE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as CachedTrends
    if (Date.now() - new Date(parsed.fetchedAt).getTime() > CACHE_TTL) return null
    return parsed
  } catch {
    return null
  }
}

function saveCachedTrends(data: CachedTrends): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CACHE_KEY, JSON.stringify(data))
}

export default function TrendsPage() {
  const [selectedCategory, setSelectedCategory] = useState<TrendCategory | 'All'>('All')
  const [selectedVerdict, setSelectedVerdict] = useState<MarketTrend['verdict'] | 'All'>('All')
  const [sortBy, setSortBy] = useState<'score' | 'confidence' | 'buildDays'>('score')
  const [trends, setTrends] = useState<readonly MarketTrend[]>(TRENDS)
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch live data on mount
  useEffect(() => {
    const cached = loadCachedTrends()
    if (cached) {
      setTrends(cached.trends)
      setIsLive(cached.live)
      return
    }

    setLoading(true)
    fetch('/api/trends')
      .then(res => res.json())
      .then((data: CachedTrends) => {
        setTrends(data.trends)
        setIsLive(data.live)
        saveCachedTrends(data)
      })
      .catch(() => {
        // Fallback to static
        setTrends(TRENDS)
        setIsLive(false)
      })
      .finally(() => setLoading(false))
  }, [])

  const categories = getCategories()

  const filtered = useMemo(() => {
    let result = [...trends]

    if (selectedCategory !== 'All') {
      result = result.filter(t => t.category === selectedCategory)
    }
    if (selectedVerdict !== 'All') {
      result = result.filter(t => t.verdict === selectedVerdict)
    }

    result.sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score
      if (sortBy === 'confidence') return b.confidence - a.confidence
      return a.buildDays - b.buildDays
    })

    return result
  }, [trends, selectedCategory, selectedVerdict, sortBy])

  const buildNowCount = trends.filter(t => t.verdict === 'Build Now').length
  const avgScore = Math.round(trends.reduce((s, t) => s + t.score, 0) / trends.length)

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={20} style={{ color: 'var(--cash)' }} />
          <h1 className="text-2xl font-black">Trend Sniper</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
          Market trends scored from live signals.
          Click a trend to pre-fill your pasture research.
        </p>
        {/* Live indicator */}
        <div className="flex items-center gap-2 mt-2">
          {loading ? (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Fetching live signals...</span>
          ) : isLive ? (
            <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--cash)' }}>
              <Radio size={10} className="animate-pulse" />
              Live -- HackerNews + GitHub
            </span>
          ) : (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Static data (API unavailable)</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Trends Tracked', value: trends.length, color: 'var(--text)' },
          { label: 'Build Now', value: buildNowCount, color: 'var(--cash)' },
          { label: 'Avg Score', value: avgScore, color: 'var(--blue)' },
          { label: 'Categories', value: categories.length, color: 'var(--orange)' },
        ].map(s => (
          <div
            key={s.label}
            className="p-4 rounded-xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Filters:</span>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          {(['All', ...categories] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                background: selectedCategory === cat ? 'var(--cash-soft)' : 'var(--surface)',
                color: selectedCategory === cat ? 'var(--cash)' : 'var(--text-secondary)',
                border: `1px solid ${selectedCategory === cat ? 'rgba(34, 197, 94, 0.3)' : 'var(--border)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Verdict pills */}
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Build Now', 'Watch Closely', 'Too Early', 'Too Late', 'High Risk'] as const).map(v => (
            <button
              key={v}
              onClick={() => setSelectedVerdict(v)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                background: selectedVerdict === v ? 'var(--cash-soft)' : 'var(--surface)',
                color: selectedVerdict === v ? 'var(--cash)' : 'var(--text-secondary)',
                border: `1px solid ${selectedVerdict === v ? 'rgba(34, 197, 94, 0.3)' : 'var(--border)'}`,
              }}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-1 rounded-lg text-xs font-medium"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <option value="score">Sort: Score</option>
          <option value="confidence">Sort: Confidence</option>
          <option value="buildDays">Sort: Build Time</option>
        </select>
      </div>

      {/* Results count */}
      <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        {filtered.length} trend{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Trend cards */}
      <div className="grid gap-4">
        {filtered.map(trend => {
          const VerdictIcon = VERDICT_ICONS[trend.verdict]
          const avgSignal = Math.round(
            trend.signals.reduce((s, sig) => s + sig.score, 0) / trend.signals.length
          )

          return (
            <Link
              key={trend.id}
              href={`/dashboard/pasture?q=${encodeURIComponent(trend.name)}`}
              className="block p-5 rounded-xl transition-all hover:scale-[1.01]"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-base truncate">{trend.name}</h3>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                      style={{
                        background: `${STAGE_COLORS[trend.stage]}15`,
                        color: STAGE_COLORS[trend.stage],
                      }}
                    >
                      {trend.stage}
                    </span>
                  </div>
                  <p className="text-sm mb-2 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                    {trend.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>{trend.category}</span>
                    <span>{trend.competition} competition</span>
                    <span>{trend.buildDays}d build</span>
                    <span>{trend.monetization} monetization</span>
                  </div>
                </div>

                {/* Right: score + verdict */}
                <div className="flex items-center gap-4 shrink-0">
                  {/* Signal sources mini chart */}
                  <div className="hidden sm:flex items-end gap-0.5 h-8">
                    {trend.signals.map(sig => (
                      <div
                        key={sig.source}
                        className="w-1.5 rounded-t"
                        style={{
                          height: `${sig.score * 0.3}px`,
                          background: sig.velocity > 0 ? 'var(--cash)' : 'var(--red)',
                          opacity: 0.6 + (sig.score / 100) * 0.4,
                        }}
                        title={`${sig.source}: ${sig.score} (${sig.velocity > 0 ? '+' : ''}${sig.velocity})`}
                      />
                    ))}
                  </div>

                  {/* Score */}
                  <div className="text-center">
                    <div className="text-2xl font-black" style={{ color: 'var(--cash)' }}>
                      {trend.score}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      score
                    </div>
                  </div>

                  {/* Verdict */}
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{
                      background: `${VERDICT_COLORS[trend.verdict]}15`,
                      color: VERDICT_COLORS[trend.verdict],
                    }}
                  >
                    <VerdictIcon size={12} />
                    {trend.verdict}
                  </div>

                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p style={{ color: 'var(--text-muted)' }}>No trends match your filters.</p>
        </div>
      )}
    </div>
  )
}
