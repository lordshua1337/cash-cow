'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp, ArrowRight, Loader2, ExternalLink } from 'lucide-react'
import type { WorkflowState } from '@/lib/workflow-state'

interface TrendItem {
  readonly name: string
  readonly tagline: string
  readonly category: string
  readonly source: 'producthunt' | 'hackernews' | 'github'
  readonly score: number
  readonly url?: string
}

interface StepDiscoverProps {
  readonly state: WorkflowState
  readonly onNext: (niche: string, trendName: string) => void
}

const CATEGORIES = ['All', 'SaaS', 'Dev Tools', 'AI / ML', 'Productivity', 'Finance', 'Marketing', 'Design', 'Health', 'Education']

export default function StepDiscover({ state, onNext }: StepDiscoverProps) {
  const [trends, setTrends] = useState<TrendItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const [customNiche, setCustomNiche] = useState(state.niche || '')
  const [mode, setMode] = useState<'browse' | 'custom'>('browse')

  useEffect(() => {
    fetchTrends()
  }, [])

  async function fetchTrends() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/trends/live')
      if (!res.ok) throw new Error('Failed to fetch trends')
      const data = await res.json()
      setTrends(data.trends || [])
    } catch {
      setError('Couldn\'t fetch trends right now. Try typing your own niche below!')
      setTrends([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter === 'All'
    ? trends
    : trends.filter((t) => t.category.toLowerCase().includes(filter.toLowerCase()))

  function handlePickTrend(trend: TrendItem) {
    onNext(trend.name, trend.name)
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!customNiche.trim()) return
    onNext(customNiche.trim(), '')
  }

  const sourceColors: Record<string, string> = {
    producthunt: 'var(--gold)',
    hackernews: 'var(--gold)',
    github: 'var(--brown)',
  }

  const sourceLabels: Record<string, string> = {
    producthunt: 'Product Hunt',
    hackernews: 'Hacker News',
    github: 'GitHub',
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🔍</div>
        <h2
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
        >
          What&apos;s hot right now?
        </h2>
        <p style={{ color: 'var(--brown-muted)' }}>
          Browse trending products or type your own niche to research
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setMode('browse')}
          className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
          style={{
            background: mode === 'browse' ? 'var(--spot-black)' : 'var(--white)',
            color: mode === 'browse' ? 'var(--cream)' : 'var(--brown-muted)',
            border: '2px solid ' + (mode === 'browse' ? 'var(--spot-black)' : 'var(--spot-gray)'),
          }}
        >
          Browse Trending
        </button>
        <button
          onClick={() => setMode('custom')}
          className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
          style={{
            background: mode === 'custom' ? 'var(--spot-black)' : 'var(--white)',
            color: mode === 'custom' ? 'var(--cream)' : 'var(--brown-muted)',
            border: '2px solid ' + (mode === 'custom' ? 'var(--spot-black)' : 'var(--spot-gray)'),
          }}
        >
          Type My Own
        </button>
      </div>

      {mode === 'custom' ? (
        <form onSubmit={handleCustomSubmit} className="max-w-lg mx-auto">
          <div
            className="flex items-center gap-3 p-2 rounded-2xl"
            style={{ background: 'var(--white)', border: '2px solid var(--spot-gray)' }}
          >
            <Search size={20} style={{ color: 'var(--brown-faint)', marginLeft: 12 }} />
            <input
              type="text"
              value={customNiche}
              onChange={(e) => setCustomNiche(e.target.value)}
              placeholder="e.g. AI code reviewers, personal CRM, habit trackers..."
              className="flex-1 py-3 text-base outline-none bg-transparent"
              style={{ color: 'var(--brown)' }}
              autoFocus
            />
            <button
              type="submit"
              disabled={!customNiche.trim()}
              className="btn-bounce px-5 py-3 rounded-xl text-sm font-bold transition-all"
              style={{
                background: customNiche.trim() ? 'var(--cash)' : 'var(--spot-gray)',
                color: customNiche.trim() ? '#fff' : 'var(--brown-faint)',
              }}
            >
              Research This
              <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* Category filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 flex-wrap justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all"
                style={{
                  background: filter === cat ? 'var(--spot-black)' : 'var(--white)',
                  color: filter === cat ? 'var(--cream)' : 'var(--brown-muted)',
                  border: '1px solid ' + (filter === cat ? 'var(--spot-black)' : 'var(--spot-gray)'),
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-16">
              <Loader2 size={32} className="animate-spin mx-auto mb-3" style={{ color: 'var(--cash)' }} />
              <div className="text-sm font-bold" style={{ color: 'var(--brown-muted)' }}>
                Grazing the internet for trending products...
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="text-center py-8 px-4 rounded-xl mb-6"
              style={{ background: 'var(--gold-soft)', color: 'var(--gold)' }}
            >
              <div className="text-sm font-bold">{error}</div>
            </div>
          )}

          {/* Trend cards */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((trend, i) => (
                <button
                  key={`${trend.name}-${i}`}
                  onClick={() => handlePickTrend(trend)}
                  className="card-lift text-left rounded-2xl p-5 flex flex-col gap-3 group"
                  style={{
                    background: 'var(--white)',
                    border: '2px solid var(--spot-gray)',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-base group-hover:underline">{trend.name}</div>
                      <div className="text-sm mt-1" style={{ color: 'var(--brown-muted)' }}>
                        {trend.tagline}
                      </div>
                    </div>
                    <ArrowRight
                      size={16}
                      className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--cash)' }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="px-2 py-0.5 rounded font-bold"
                      style={{
                        background: `${sourceColors[trend.source]}15`,
                        color: sourceColors[trend.source],
                      }}
                    >
                      {sourceLabels[trend.source]}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded font-bold"
                      style={{ background: 'var(--cream-dark)', color: 'var(--brown-muted)' }}
                    >
                      {trend.category}
                    </span>
                    <span className="flex items-center gap-1 ml-auto font-bold" style={{ color: 'var(--cash)' }}>
                      <TrendingUp size={12} />
                      {trend.score}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-3xl mb-3">🌾</div>
              <div className="font-bold" style={{ color: 'var(--brown-muted)' }}>
                No trends in this category yet
              </div>
              <div className="text-sm mt-1" style={{ color: 'var(--brown-faint)' }}>
                Try a different category or type your own niche
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
