'use client'

import { motion } from 'framer-motion'
import type { TrendCategory, Trend } from '@/lib/trends/types'
import { StageBadge } from '@/components/trends/StageBadge'

interface CategoryStat {
  readonly category: TrendCategory
  readonly count: number
  readonly avgScore: number
  readonly topTrends: readonly Trend[]
}

interface TrendHeatmapProps {
  readonly stats: readonly CategoryStat[]
  readonly selectedCategory?: TrendCategory
  readonly onSelectCategory: (category: TrendCategory | undefined) => void
}

function getScoreColor(score: number): string {
  if (score >= 70) return '#00E676'
  if (score >= 55) return '#FFD600'
  if (score >= 40) return '#FF9100'
  if (score >= 25) return '#00D4FF'
  return '#8888A0'
}

function getScoreGlow(score: number): string {
  if (score >= 70) return '0 0 20px rgba(0, 230, 118, 0.2)'
  if (score >= 55) return '0 0 20px rgba(255, 214, 0, 0.15)'
  if (score >= 40) return '0 0 20px rgba(255, 145, 0, 0.15)'
  if (score >= 25) return '0 0 20px rgba(0, 212, 255, 0.12)'
  return 'none'
}

interface CategoryCardProps {
  readonly stat: CategoryStat
  readonly isSelected: boolean
  readonly onSelect: () => void
  readonly index: number
}

function CategoryCard({ stat, isSelected, onSelect, index }: CategoryCardProps) {
  const color = getScoreColor(stat.avgScore)
  const glow = getScoreGlow(stat.avgScore)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onSelect}
      className="rounded-xl cursor-pointer transition-all"
      style={{
        background: 'var(--surface)',
        border: isSelected
          ? `1px solid ${color}`
          : '1px solid var(--border)',
        boxShadow: isSelected ? glow : 'none',
        padding: '1.25rem',
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
          {stat.category}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {stat.count} trends
        </span>
      </div>

      {/* Big score number */}
      <div
        className="text-4xl font-black mb-3 leading-none"
        style={{ color }}
      >
        {stat.avgScore}
      </div>

      {/* Score bar */}
      <div
        className="w-full h-1 rounded-full mb-4"
        style={{ background: 'var(--border)' }}
      >
        <div
          className="h-1 rounded-full transition-all"
          style={{ width: `${stat.avgScore}%`, background: color }}
        />
      </div>

      {/* Top 3 trends */}
      <div className="flex flex-col gap-2">
        {stat.topTrends.map((trend) => (
          <div
            key={trend.id}
            className="flex items-center justify-between gap-2"
          >
            <span
              className="text-xs truncate"
              style={{ color: 'var(--text)' }}
            >
              {trend.name}
            </span>
            <StageBadge stage={trend.current_stage} size="sm" />
          </div>
        ))}
        {stat.topTrends.length === 0 && (
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            No trends tracked yet.
          </p>
        )}
      </div>
    </motion.div>
  )
}

export function TrendHeatmap({ stats, selectedCategory, onSelectCategory }: TrendHeatmapProps) {
  function handleSelect(category: TrendCategory) {
    onSelectCategory(selectedCategory === category ? undefined : category)
  }

  return (
    <div>
      {selectedCategory && (
        <div className="mb-4">
          <button
            onClick={() => onSelectCategory(undefined)}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: 'var(--accent-soft)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              color: 'var(--accent)',
            }}
          >
            Clear filter: {selectedCategory}
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <CategoryCard
            key={stat.category}
            stat={stat}
            isSelected={selectedCategory === stat.category}
            onSelect={() => handleSelect(stat.category)}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
