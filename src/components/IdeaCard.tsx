'use client'

import { RefreshCw, Clock, Calendar, CalendarRange } from 'lucide-react'
import type { ProductIdea } from '@/lib/types'

const COMPLEXITY_CONFIG = {
  weekend: { label: 'Weekend', icon: Clock, color: 'var(--cash)' },
  'few-weeks': { label: 'Few Weeks', icon: Calendar, color: 'var(--gold)' },
  'month-plus': { label: 'Month+', icon: CalendarRange, color: 'var(--blue)' },
} as const

interface IdeaCardProps {
  readonly idea: ProductIdea
  readonly onRemix: (idea: ProductIdea) => void
}

export default function IdeaCard({ idea, onRemix }: IdeaCardProps) {
  const complexity = COMPLEXITY_CONFIG[idea.complexity]

  return (
    <div
      className="card rounded-2xl p-5 flex flex-col gap-2.5 group cursor-pointer"
      onClick={() => onRemix(idea)}
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold"
          style={{ background: 'var(--cream-dark)', color: complexity.color }}
        >
          <complexity.icon size={10} />
          {complexity.label}
        </span>
        <span
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold"
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
        className="inline-flex items-center gap-1.5 self-start px-3.5 py-2 rounded-xl text-xs font-bold transition-opacity opacity-60 group-hover:opacity-100"
        style={{
          background: 'var(--cash)',
          color: '#fff',
        }}
      >
        <RefreshCw size={12} />
        Remix It
      </div>
    </div>
  )
}
