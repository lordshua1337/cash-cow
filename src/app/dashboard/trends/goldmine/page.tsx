'use client'

import { Zap } from 'lucide-react'
import { GoldmineFinder } from '@/components/trends/GoldmineFinder'

export default function GoldminePage() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Zap size={20} style={{ color: '#FFD600' }} />
          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
            Goldmine
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Filter trends by competition density and monetization signal to find high-opportunity gaps before they peak.
        </p>
      </div>

      <GoldmineFinder />
    </div>
  )
}
