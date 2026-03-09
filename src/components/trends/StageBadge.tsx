'use client'

import type { TrendStage } from '@/lib/trends/types'

interface StageBadgeProps {
  readonly stage: TrendStage
  readonly size?: 'sm' | 'md'
}

const stageConfig: Record<TrendStage, { label: string; bg: string; border: string; text: string }> = {
  Emerging: {
    label: 'Emerging',
    bg: 'rgba(0, 212, 255, 0.1)',
    border: 'rgba(0, 212, 255, 0.4)',
    text: '#00D4FF',
  },
  Accelerating: {
    label: 'Accelerating',
    bg: 'rgba(0, 230, 118, 0.1)',
    border: 'rgba(0, 230, 118, 0.4)',
    text: '#00E676',
  },
  Peaking: {
    label: 'Peaking',
    bg: 'rgba(255, 214, 0, 0.1)',
    border: 'rgba(255, 214, 0, 0.4)',
    text: '#FFD600',
  },
  Saturating: {
    label: 'Saturating',
    bg: 'rgba(255, 145, 0, 0.1)',
    border: 'rgba(255, 145, 0, 0.4)',
    text: '#FF9100',
  },
  Declining: {
    label: 'Declining',
    bg: 'rgba(255, 82, 82, 0.1)',
    border: 'rgba(255, 82, 82, 0.4)',
    text: '#FF5252',
  },
}

export function StageBadge({ stage, size = 'md' }: StageBadgeProps) {
  const config = stageConfig[stage]
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1'

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium tracking-wide ${sizeClass}`}
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
      }}
    >
      {config.label}
    </span>
  )
}

export function getStageColor(stage: TrendStage): string {
  const colorMap: Record<TrendStage, string> = {
    Emerging: '#00D4FF',
    Accelerating: '#00E676',
    Peaking: '#FFD600',
    Saturating: '#FF9100',
    Declining: '#FF5252',
  }
  return colorMap[stage]
}
