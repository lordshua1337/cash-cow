'use client'

import { Zap, Clock, Calendar, CalendarRange, AlertTriangle } from 'lucide-react'
import type { ProductIdea } from '@/lib/types'

const COMPLEXITY_CONFIG = {
  weekend: { label: 'Weekend', icon: Clock, color: 'var(--cash)', bg: 'var(--cash-soft)' },
  'few-weeks': { label: 'Few Weeks', icon: Calendar, color: 'var(--gold)', bg: 'var(--gold-soft)' },
  'month-plus': { label: 'Month+', icon: CalendarRange, color: 'var(--blue)', bg: 'var(--blue-soft)' },
} as const

interface IdeaCardProps {
  readonly idea: ProductIdea
  readonly featured?: boolean
  readonly onGetSpec: (idea: ProductIdea) => void
}

export default function IdeaCard({ idea, featured, onGetSpec }: IdeaCardProps) {
  const complexity = COMPLEXITY_CONFIG[idea.complexity]

  if (featured) {
    return (
      <div
        className="card-lift rounded-2xl p-6 sm:p-8"
        style={{
          background: 'var(--white)',
          border: '2px solid var(--cash)',
          boxShadow: '0 8px 30px rgba(34, 197, 94, 0.12)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
            style={{ background: 'var(--cash-soft)', color: 'var(--cash-dark)' }}
          >
            <Zap size={12} />
            Top Pick
          </span>
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
            style={{ background: complexity.bg, color: complexity.color }}
          >
            <complexity.icon size={12} />
            {complexity.label}
          </span>
          <span
            className="px-2.5 py-1 rounded-lg text-xs font-bold"
            style={{ background: 'var(--cream-dark)', color: 'var(--brown-muted)' }}
          >
            {idea.category}
          </span>
        </div>

        <h2
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
        >
          {idea.name}
        </h2>

        <p className="text-base sm:text-lg mb-4" style={{ color: 'var(--brown-light)' }}>
          {idea.pitch}
        </p>

        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--brown-muted)' }}>
          {idea.whyNow}
        </p>

        <p
          className="inline-flex items-center gap-1.5 text-xs mb-6"
          style={{ color: 'var(--brown-faint)' }}
        >
          <AlertTriangle size={12} />
          {idea.risk}
        </p>

        <div>
          <button
            onClick={() => onGetSpec(idea)}
            className="btn-bounce inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-bold"
            style={{
              background: 'var(--cash)',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
            }}
          >
            <Zap size={18} />
            Get Build Spec
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="card-lift rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: 'var(--white)',
        border: '2px solid var(--spot-gray)',
        boxShadow: '0 4px 20px rgba(41, 37, 36, 0.06)',
      }}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold"
          style={{ background: complexity.bg, color: complexity.color }}
        >
          <complexity.icon size={11} />
          {complexity.label}
        </span>
        <span
          className="px-2 py-0.5 rounded-lg text-xs font-bold"
          style={{ background: 'var(--cream-dark)', color: 'var(--brown-muted)' }}
        >
          {idea.category}
        </span>
      </div>

      <div className="flex-1">
        <h3
          className="text-lg font-bold mb-1 leading-tight"
          style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
        >
          {idea.name}
        </h3>
        <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--brown-light)' }}>
          {idea.pitch}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--brown-muted)' }}>
          {idea.whyNow}
        </p>
      </div>

      <button
        onClick={() => onGetSpec(idea)}
        className="btn-bounce inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold self-start"
        style={{
          background: 'var(--cash)',
          color: '#fff',
          boxShadow: '0 2px 8px rgba(34, 197, 94, 0.25)',
        }}
      >
        <Zap size={14} />
        Get Build Spec
      </button>
    </div>
  )
}
