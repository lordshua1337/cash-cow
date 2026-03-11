'use client'

import { RefreshCw, Clock, Calendar, CalendarRange } from 'lucide-react'
import type { ProductIdea } from '@/lib/types'

const COMPLEXITY_CONFIG = {
  weekend: { label: 'Weekend', icon: Clock, color: 'var(--cash)', bg: 'var(--cash-soft)' },
  'few-weeks': { label: 'Few Weeks', icon: Calendar, color: 'var(--gold)', bg: 'var(--gold-soft)' },
  'month-plus': { label: 'Month+', icon: CalendarRange, color: 'var(--blue)', bg: 'var(--blue-soft)' },
} as const

interface IdeaCardProps {
  readonly idea: ProductIdea
  readonly onRemix: (idea: ProductIdea) => void
}

export default function IdeaCard({ idea, onRemix }: IdeaCardProps) {
  const complexity = COMPLEXITY_CONFIG[idea.complexity]

  return (
    <div
      className="card-lift rounded-2xl p-4 flex flex-col gap-2 group cursor-pointer"
      onClick={() => onRemix(idea)}
      style={{
        background: 'var(--white)',
        border: '2px solid var(--spot-gray)',
        boxShadow: '0 2px 12px rgba(41, 37, 36, 0.04)',
      }}
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold"
          style={{ background: complexity.bg, color: complexity.color }}
        >
          <complexity.icon size={10} />
          {complexity.label}
        </span>
        <span
          className="px-2 py-0.5 rounded text-[11px] font-bold"
          style={{ background: 'var(--cream-dark)', color: 'var(--brown-faint)' }}
        >
          {idea.category}
        </span>
      </div>

      <h3
        className="text-base font-bold leading-tight"
        style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
      >
        {idea.name}
      </h3>

      <p className="text-sm leading-snug flex-1" style={{ color: 'var(--brown-muted)' }}>
        {idea.pitch}
      </p>

      <div
        className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-lg text-xs font-bold transition-all opacity-70 group-hover:opacity-100"
        style={{
          background: 'var(--cash)',
          color: '#fff',
          boxShadow: '0 2px 8px rgba(34, 197, 94, 0.2)',
        }}
      >
        <RefreshCw size={12} />
        Remix It
      </div>
    </div>
  )
}
