'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Zap, Clock, TrendingUp } from 'lucide-react'
import type { Trend, TrendCategory } from '@/lib/trends/types'
import { StageBadge, getStageColor } from '@/components/trends/StageBadge'
import { getTrends } from '@/lib/trends/mock-data'

const CATEGORIES: readonly (TrendCategory | 'All')[] = [
  'All',
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

interface FilterState {
  readonly minScore: number
  readonly competition: 'All' | 'Low' | 'Medium' | 'High'
  readonly monetization: 'All' | 'None' | 'Emerging' | 'Proven' | 'Unknown'
  readonly category: TrendCategory | 'All'
}

interface GoldmineCardProps {
  readonly trend: Trend
  readonly index: number
}

function GoldmineCard({ trend, index }: GoldmineCardProps) {
  const stageColor = getStageColor(trend.current_stage)
  const isHighValue = trend.trend_score >= 75

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: 'var(--surface)',
        border: isHighValue ? `1px solid ${stageColor}60` : '1px solid var(--border)',
        boxShadow: isHighValue ? `0 0 24px ${stageColor}18` : 'none',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {isHighValue && (
              <Zap size={14} style={{ color: '#FFD600' }} />
            )}
            <h3 className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>
              {trend.name}
            </h3>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {trend.category}
          </p>
        </div>
        <div
          className="text-xl font-black shrink-0"
          style={{ color: stageColor }}
        >
          {trend.trend_score}
        </div>
      </div>

      {/* Stage badge */}
      <StageBadge stage={trend.current_stage} size="sm" />

      {/* Description */}
      {trend.description && (
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {trend.description}
        </p>
      )}

      {/* Metrics row */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-1.5">
          <span style={{ color: 'var(--text-secondary)' }}>Competition:</span>
          <span
            className="font-semibold"
            style={{
              color:
                trend.competition_density === 'Low'
                  ? 'var(--success)'
                  : trend.competition_density === 'Medium'
                    ? 'var(--warning)'
                    : 'var(--danger)',
            }}
          >
            {trend.competition_density}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp size={11} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Monetization:</span>
          <span className="font-semibold" style={{ color: 'var(--text)' }}>
            {trend.monetization_signal}
          </span>
        </div>
        {trend.time_to_build_days && (
          <div className="flex items-center gap-1.5">
            <Clock size={11} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Build:</span>
            <span className="font-semibold" style={{ color: 'var(--text)' }}>
              {trend.time_to_build_days}d
            </span>
          </div>
        )}
      </div>

      {/* Confidence bar */}
      <div>
        <div className="flex items-center justify-between mb-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span>Confidence</span>
          <span style={{ color: 'var(--text)' }}>{trend.confidence_score}%</span>
        </div>
        <div
          className="w-full h-1 rounded-full"
          style={{ background: 'var(--border)' }}
        >
          <div
            className="h-1 rounded-full"
            style={{ width: `${trend.confidence_score}%`, background: stageColor }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export function GoldmineFinder() {
  const [filters, setFilters] = useState<FilterState>({
    minScore: 0,
    competition: 'All',
    monetization: 'All',
    category: 'All',
  })

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const results = getTrends({
    minScore: filters.minScore,
    competition: filters.competition === 'All' ? undefined : filters.competition,
    monetization: filters.monetization === 'All' ? undefined : filters.monetization,
    category: filters.category === 'All' ? undefined : filters.category,
    sortBy: 'trend_score',
    sortDir: 'desc',
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Filter controls */}
      <div
        className="rounded-xl p-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text)' }}>
          Filters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Min score slider */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
              Min Score: <span style={{ color: 'var(--accent)' }}>{filters.minScore}</span>
            </label>
            <input
              type="range"
              min={0}
              max={90}
              step={5}
              value={filters.minScore}
              onChange={(e) => updateFilter('minScore', Number(e.target.value))}
              className="w-full accent-cyan-400"
              style={{ accentColor: 'var(--accent)' }}
            />
          </div>

          {/* Competition dropdown */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
              Competition
            </label>
            <select
              value={filters.competition}
              onChange={(e) => updateFilter('competition', e.target.value as FilterState['competition'])}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          {/* Monetization dropdown */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
              Monetization
            </label>
            <select
              value={filters.monetization}
              onChange={(e) => updateFilter('monetization', e.target.value as FilterState['monetization'])}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              <option>All</option>
              <option>Emerging</option>
              <option>Proven</option>
              <option>None</option>
              <option>Unknown</option>
            </select>
          </div>

          {/* Category dropdown */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value as FilterState['category'])}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
            {results.length}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            opportunities found
          </span>
        </div>
      </div>

      {/* Results grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((trend, index) => (
            <GoldmineCard key={trend.id} trend={trend} index={index} />
          ))}
        </div>
      ) : (
        <div
          className="rounded-xl p-12 text-center"
          style={{ border: '1px dashed var(--border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No trends match your filters. Try lowering the minimum score.
          </p>
        </div>
      )}
    </div>
  )
}
