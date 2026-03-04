'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpDown, Filter, Download, TrendingUp, Hammer, DollarSign, Skull } from 'lucide-react'
import { MOCK_CALVES, sortCalves } from '@/lib/mock-data'
import { loadState } from '@/lib/state'
import { exportPortfolioCSV, downloadFile } from '@/lib/export'
import type { Calf, CalfStatus, ConfidenceLevel } from '@/lib/types'

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

export default function HerdPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | CalfStatus>('all')
  const [sortBy, setSortBy] = useState<string>('overall_score')
  const [calves, setCalves] = useState<readonly Calf[]>([])
  const [allCalves, setAllCalves] = useState<readonly Calf[]>([])

  useEffect(() => {
    const state = loadState()
    // Apply overrides from localStorage
    const withOverrides = MOCK_CALVES.map((calf) => {
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

  // Derived from allCalves (unfiltered) to always show full herd stats
  const totalRevenue = allCalves.reduce((sum, c) => sum + (c.monthlyRevenue ?? 0), 0)

  const statusCounts = allCalves.reduce((acc, c) => {
    const newAcc = { ...acc }
    newAcc[c.status] = (newAcc[c.status] ?? 0) + 1
    return newAcc
  }, {} as Record<string, number>)

  const handleExport = () => {
    const csv = exportPortfolioCSV(calves)
    downloadFile(csv, 'cash-cow-herd.csv', 'text/csv')
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
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-4 gap-4 mb-8 p-5 rounded-xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total Calves</p>
          <p className="text-2xl font-black">{MOCK_CALVES.length}</p>
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
          <Link
            href="/dashboard/pasture"
            className="text-sm font-medium"
            style={{ color: 'var(--amber)' }}
          >
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

                {/* Score badges */}
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

                {/* Confidence badge */}
                <div
                  className="px-2 py-1 rounded text-[10px] font-bold mb-3"
                  style={{ background: confConf.bg, color: confConf.color }}
                >
                  {confConf.label}
                </div>

                {/* Bottom row */}
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
