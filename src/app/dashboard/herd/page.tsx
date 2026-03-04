'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpDown, Filter, Download, TrendingUp, Hammer, DollarSign, Skull, Lightbulb, Loader, AlertTriangle, Target, ArrowRight, Search } from 'lucide-react'
import { MOCK_CALVES, EXAMPLE_SNAPSHOTS, sortCalves } from '@/lib/mock-data'
import { loadState, getCalves, getSnapshots } from '@/lib/state'
import { exportPortfolioCSV, exportFullCSV, exportSnapshotsCSV, downloadFile } from '@/lib/export'
import type { Calf, CalfStatus, ConfidenceLevel, Recommendation } from '@/lib/types'

const STATUS_CONFIG: Record<CalfStatus, { label: string; icon: typeof TrendingUp; color: string; bg: string }> = {
  grazing: { label: 'Grazing', icon: TrendingUp, color: 'var(--blue)', bg: 'var(--blue-soft)' },
  building: { label: 'Building', icon: Hammer, color: 'var(--amber)', bg: 'var(--amber-soft)' },
  milking: { label: 'Milking', icon: DollarSign, color: 'var(--green)', bg: 'var(--green-soft)' },
  dried_up: { label: 'Dried Up', icon: Skull, color: 'var(--text-muted)', bg: 'var(--bg-alt)' },
}

const CONFIDENCE_CONFIG: Record<ConfidenceLevel, { label: string; color: string; bg: string }> = {
  high: { label: 'High confidence (80%+ verified)', color: 'var(--green)', bg: 'var(--green-soft)' },
  medium: { label: 'Medium confidence (50-79% verified)', color: 'var(--amber)', bg: 'var(--amber-soft)' },
  low: { label: 'Low confidence (mostly AI estimates)', color: 'var(--red)', bg: 'var(--red-soft)' },
}

const ACTION_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Target }> = {
  focus: { label: 'Focus', color: 'var(--green)', bg: 'var(--green-soft)', icon: Target },
  pivot: { label: 'Pivot', color: 'var(--orange)', bg: 'var(--orange-soft)', icon: ArrowRight },
  explore: { label: 'Explore', color: 'var(--blue)', bg: 'var(--blue-soft)', icon: Search },
  abandon: { label: 'Abandon', color: 'var(--red)', bg: 'var(--red-soft)', icon: Skull },
}

export default function HerdPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | CalfStatus>('all')
  const [sortBy, setSortBy] = useState<string>('overall_score')
  const [calves, setCalves] = useState<readonly Calf[]>([])
  const [allCalves, setAllCalves] = useState<readonly Calf[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [recsLoading, setRecsLoading] = useState(false)
  const [recsError, setRecsError] = useState<string | null>(null)
  const [showExportMenu, setShowExportMenu] = useState(false)

  useEffect(() => {
    const state = loadState()
    const userCalves = getCalves()
    const exampleIds = new Set(MOCK_CALVES.map((c) => c.id))
    const merged = [
      ...MOCK_CALVES,
      ...userCalves.filter((c) => !exampleIds.has(c.id)),
    ]

    const withOverrides = merged.map((calf) => {
      const override = state.overrides[calf.id]
      if (!override) return calf
      return {
        ...calf,
        status: override.status ?? calf.status,
        monthlyRevenue: override.monthlyRevenue ?? calf.monthlyRevenue,
      }
    })

    setAllCalves(withOverrides)

    const filtered = filterStatus === 'all'
      ? withOverrides
      : withOverrides.filter((c) => c.status === filterStatus)

    setCalves(sortCalves(filtered, sortBy))
  }, [filterStatus, sortBy])

  const totalRevenue = allCalves.reduce((sum, c) => sum + (c.monthlyRevenue ?? 0), 0)

  const statusCounts = allCalves.reduce((acc, c) => {
    const newAcc = { ...acc }
    newAcc[c.status] = (newAcc[c.status] ?? 0) + 1
    return newAcc
  }, {} as Record<string, number>)

  const handleExportPortfolio = () => {
    const csv = exportPortfolioCSV(calves)
    downloadFile(csv, 'cash-cow-herd.csv', 'text/csv')
    setShowExportMenu(false)
  }

  const handleExportFull = () => {
    const csv = exportFullCSV(calves)
    downloadFile(csv, 'cash-cow-herd-full.csv', 'text/csv')
    setShowExportMenu(false)
  }

  const handleExportResearch = () => {
    const userSnapshots = getSnapshots()
    const all = [...EXAMPLE_SNAPSHOTS, ...userSnapshots]
    const csv = exportSnapshotsCSV(all)
    downloadFile(csv, 'cash-cow-research.csv', 'text/csv')
    setShowExportMenu(false)
  }

  const handleGetRecommendations = async () => {
    setRecsLoading(true)
    setRecsError(null)
    try {
      const userSnapshots = getSnapshots()
      const allSnapshots = [...EXAMPLE_SNAPSHOTS, ...userSnapshots]

      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calves: allCalves, snapshots: allSnapshots }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Recommendations failed')
      }
      const { recommendations: recs } = await res.json() as { recommendations: Recommendation[] }
      setRecommendations(recs)
    } catch (error) {
      setRecsError(error instanceof Error ? error.message : 'Recommendations failed')
    } finally {
      setRecsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">The Herd</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Your portfolio of product ideas. Track from grazing to milking.
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            <Download size={16} />
            Export CSV
          </button>
          {showExportMenu && (
            <div
              className="absolute right-0 top-full mt-1 w-48 py-1 rounded-lg shadow-lg z-10"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <button
                onClick={handleExportPortfolio}
                className="w-full text-left px-4 py-2 text-sm hover:opacity-80"
                style={{ color: 'var(--text)' }}
              >
                Portfolio
              </button>
              <button
                onClick={handleExportFull}
                className="w-full text-left px-4 py-2 text-sm hover:opacity-80"
                style={{ color: 'var(--text)' }}
              >
                Full (with scores)
              </button>
              <button
                onClick={handleExportResearch}
                className="w-full text-left px-4 py-2 text-sm hover:opacity-80"
                style={{ color: 'var(--text)' }}
              >
                Market Research
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      <div
        className="p-5 rounded-xl mb-8"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} style={{ color: 'var(--amber)' }} />
            <h3 className="font-bold">AI Recommendations</h3>
          </div>
          {recommendations.length === 0 && !recsLoading && (
            <button
              onClick={handleGetRecommendations}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ background: 'var(--amber-soft)', color: 'var(--amber)', border: '1px solid rgba(217,119,6,0.2)' }}
            >
              <Lightbulb size={12} />
              Get Recommendations
            </button>
          )}
        </div>

        {recsLoading && (
          <div className="flex items-center gap-3 py-4">
            <Loader size={16} className="animate-spin" style={{ color: 'var(--amber)' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Analyzing your portfolio...</p>
          </div>
        )}

        {recsError && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--red-soft)' }}>
            <AlertTriangle size={14} style={{ color: 'var(--red)' }} />
            <p className="text-sm" style={{ color: 'var(--red)' }}>{recsError}</p>
          </div>
        )}

        {recommendations.length === 0 && !recsLoading && !recsError && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Get AI-powered suggestions on which calves to focus on, pivot, or explore new niches.
          </p>
        )}

        {recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommendations.sort((a, b) => a.priority - b.priority).slice(0, 3).map((rec, i) => {
              const config = ACTION_CONFIG[rec.action] ?? ACTION_CONFIG['explore']
              const ActionIcon = config.icon
              return (
                <div
                  key={i}
                  className="p-4 rounded-lg"
                  style={{ background: config.bg, border: `1px solid ${config.color}20` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ActionIcon size={14} style={{ color: config.color }} />
                    <span className="text-xs font-bold uppercase" style={{ color: config.color }}>
                      {config.label}
                    </span>
                    {rec.calfName && (
                      <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>
                        {rec.calfName}
                      </span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{rec.reasoning}</p>
                  {rec.suggestedNiche && (
                    <p className="text-xs mt-2 font-medium" style={{ color: config.color }}>
                      Suggested niche: {rec.suggestedNiche}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-4 gap-4 mb-8 p-5 rounded-xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total Calves</p>
          <p className="text-2xl font-black">{allCalves.length}</p>
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Building</p>
          <p className="text-2xl font-black" style={{ color: 'var(--amber)' }}>
            {statusCounts['building'] ?? 0}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Milking</p>
          <p className="text-2xl font-black" style={{ color: 'var(--green)' }}>
            {statusCounts['milking'] ?? 0}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total Revenue</p>
          <p className="text-2xl font-black" style={{ color: 'var(--green)' }}>
            ${totalRevenue.toLocaleString()}/mo
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | CalfStatus)}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            <option value="all">All Statuses</option>
            <option value="grazing">Grazing</option>
            <option value="building">Building</option>
            <option value="milking">Milking</option>
            <option value="dried_up">Dried Up</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            <option value="overall_score">Best Score</option>
            <option value="monthly_revenue">Highest Revenue</option>
            <option value="created_at">Newest First</option>
          </select>
        </div>
      </div>

      {/* Calf cards */}
      {calves.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>No calves match this filter.</p>
          <Link href="/dashboard/pasture" className="text-sm font-medium" style={{ color: 'var(--amber)' }}>
            Go to The Pasture and research a niche to generate ideas.
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {calves.map((calf) => {
            const statusConf = STATUS_CONFIG[calf.status]
            const StatusIcon = statusConf.icon
            const confConf = CONFIDENCE_CONFIG[calf.confidenceLevel]

            return (
              <Link
                key={calf.id}
                href={`/dashboard/herd/${calf.id}`}
                className="p-5 rounded-xl transition-all hover:scale-[1.01] cursor-pointer"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderTop: `3px solid ${statusConf.color}`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold truncate">{calf.productName}</h3>
                    <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {calf.oneLinePitch}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ml-3 shrink-0"
                    style={{ background: statusConf.bg, color: statusConf.color }}
                  >
                    <StatusIcon size={12} />
                    {statusConf.label}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap mb-3">
                  {[
                    { label: 'Market', value: calf.marketDemandScore, color: 'var(--amber)' },
                    { label: 'Revenue', value: calf.revenuePotentialScore, color: 'var(--green)' },
                    { label: 'AI Build', value: calf.aiBuildabilityScore, color: 'var(--blue)' },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium"
                      style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                    >
                      <span style={{ color: s.color }}>{s.value}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                    </div>
                  ))}
                </div>

                <div
                  className="px-2 py-1 rounded text-[10px] font-bold mb-3"
                  style={{ background: confConf.bg, color: confConf.color }}
                >
                  {confConf.label}
                </div>

                <div className="flex items-center justify-between text-xs pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="space-y-0.5" style={{ color: 'var(--text-secondary)' }}>
                    <p>Build: <span style={{ color: 'var(--text)' }}>{calf.buildDaysMin}-{calf.buildDaysMax}d</span></p>
                    <p>Pricing: <span style={{ color: 'var(--text)' }}>${calf.pricingRecommendation}/mo</span></p>
                    {calf.monthlyRevenue !== undefined && calf.monthlyRevenue > 0 && (
                      <p>Revenue: <span style={{ color: 'var(--green)' }}>${calf.monthlyRevenue.toLocaleString()}/mo</span></p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black" style={{ color: 'var(--amber)' }}>{calf.overallScore}</p>
                    <p style={{ color: 'var(--text-muted)' }}>Score</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
