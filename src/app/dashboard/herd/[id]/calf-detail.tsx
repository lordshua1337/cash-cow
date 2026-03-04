'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, TrendingUp, Hammer, DollarSign, Skull, Shield, AlertTriangle,
  Zap, Clock, Target, Copy, Download, ChevronDown, ChevronUp, Check, Loader,
  BarChart3, Calendar, FileText, Settings2
} from 'lucide-react'
import { getCalfById, MOCK_BRIEFS, getSnapshotById } from '@/lib/mock-data'
import { loadState, updateCalfStatus, updateCalfNotes, getCalves, getSnapshots } from '@/lib/state'
import { exportBriefAsMarkdown, downloadFile } from '@/lib/export'
import { BriefCustomizer } from '@/components/brief/BriefCustomizer'
import type { Calf, CalfStatus, MarketSnapshot, RevenueForecast, BuildPlaybook } from '@/lib/types'

const STATUS_CONFIG: Record<CalfStatus, { label: string; icon: typeof TrendingUp; color: string; bg: string }> = {
  grazing: { label: 'Grazing', icon: TrendingUp, color: 'var(--blue)', bg: 'var(--blue-soft)' },
  building: { label: 'Building', icon: Hammer, color: 'var(--amber)', bg: 'var(--amber-soft)' },
  milking: { label: 'Milking', icon: DollarSign, color: 'var(--green)', bg: 'var(--green-soft)' },
  dried_up: { label: 'Dried Up', icon: Skull, color: 'var(--text-muted)', bg: 'var(--bg-alt)' },
}

const ALL_STATUSES: CalfStatus[] = ['grazing', 'building', 'milking', 'dried_up']

function findCalf(calfId: string): Calf | undefined {
  const mockCalf = getCalfById(calfId)
  if (mockCalf) return mockCalf
  return getCalves().find((c) => c.id === calfId)
}

function findSnapshot(snapshotId: string): MarketSnapshot | null {
  const example = getSnapshotById(snapshotId)
  if (example) return example
  return getSnapshots().find((s) => s.id === snapshotId) ?? null
}

export function CalfDetail({ calfId }: { readonly calfId: string }) {
  const [baseCalf, setBaseCalf] = useState<Calf | undefined>(undefined)
  const [currentStatus, setCurrentStatus] = useState<CalfStatus>('grazing')
  const [notes, setNotes] = useState('')
  const [showBrief, setShowBrief] = useState(false)
  const [briefLoading, setBriefLoading] = useState(false)
  const [briefContent, setBriefContent] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showRisks, setShowRisks] = useState(false)

  // Phase 4 state
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [customBriefLoading, setCustomBriefLoading] = useState(false)

  // Phase 2 state
  const [forecast, setForecast] = useState<RevenueForecast | null>(null)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [forecastError, setForecastError] = useState<string | null>(null)
  const [playbook, setPlaybook] = useState<BuildPlaybook | null>(null)
  const [playbookLoading, setPlaybookLoading] = useState(false)
  const [playbookError, setPlaybookError] = useState<string | null>(null)
  const [selectedVariation, setSelectedVariation] = useState<'micro' | 'standard' | 'premium'>('standard')

  useEffect(() => {
    const found = findCalf(calfId)
    setBaseCalf(found)
    if (found) setCurrentStatus(found.status)
  }, [calfId])

  useEffect(() => {
    if (!baseCalf) return
    const state = loadState()
    const override = state.overrides[calfId]
    if (override?.status) setCurrentStatus(override.status)
    if (override?.notes) setNotes(override.notes)
  }, [calfId, baseCalf])

  if (!baseCalf) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Calf not found.</p>
        <Link href="/dashboard/herd" className="text-sm mt-2 inline-block" style={{ color: 'var(--amber)' }}>
          Back to The Herd
        </Link>
      </div>
    )
  }

  const calf: Calf = { ...baseCalf, status: currentStatus }
  const snapshot = findSnapshot(calf.snapshotId)
  const statusConf = STATUS_CONFIG[currentStatus]
  const isExampleCalf = MOCK_BRIEFS[calfId] !== undefined

  const handleStatusChange = (newStatus: CalfStatus) => {
    setCurrentStatus(newStatus)
    updateCalfStatus(calfId, newStatus)
  }

  const handleNotesChange = (value: string) => {
    setNotes(value)
    updateCalfNotes(calfId, value)
  }

  const handleGenerateBrief = async () => {
    setBriefLoading(true)
    setShowBrief(true)

    if (isExampleCalf) {
      setBriefContent(MOCK_BRIEFS[calfId] ?? 'Brief not available for this calf.')
      setBriefLoading(false)
      return
    }

    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calf, snapshot }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Brief generation failed')
      }
      const { brief } = await res.json() as { brief: string }
      setBriefContent(brief)
    } catch (error) {
      setBriefContent(`Error: ${error instanceof Error ? error.message : 'Brief generation failed'}`)
    } finally {
      setBriefLoading(false)
    }
  }

  const handleCopyBrief = async () => {
    if (!briefContent) return
    const markdown = exportBriefAsMarkdown(calf, briefContent)
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadBrief = () => {
    if (!briefContent) return
    const markdown = exportBriefAsMarkdown(calf, briefContent)
    downloadFile(markdown, `${calf.productName.toLowerCase().replace(/\s+/g, '-')}-brief.md`, 'text/markdown')
  }

  const handleDownloadPDF = async () => {
    if (!briefContent || briefContent.startsWith('Error:')) return
    const { generateBriefPDF } = await import('@/lib/export/pdf')
    await generateBriefPDF(calf, briefContent)
  }

  const handleCustomBrief = async (sections: readonly string[], customSections: readonly string[]) => {
    setCustomBriefLoading(true)
    setShowCustomizer(false)
    setShowBrief(true)
    setBriefLoading(true)

    try {
      const res = await fetch('/api/brief/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calf, sections, customSections }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Custom brief failed')
      }
      const { brief } = await res.json() as { brief: string }
      setBriefContent(brief)
    } catch (error) {
      setBriefContent(`Error: ${error instanceof Error ? error.message : 'Custom brief failed'}`)
    } finally {
      setBriefLoading(false)
      setCustomBriefLoading(false)
    }
  }

  const handleGenerateForecast = async () => {
    setForecastLoading(true)
    setForecastError(null)
    try {
      const res = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calf }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Forecast failed')
      }
      const { forecast: f } = await res.json() as { forecast: RevenueForecast }
      setForecast(f)
    } catch (error) {
      setForecastError(error instanceof Error ? error.message : 'Forecast failed')
    } finally {
      setForecastLoading(false)
    }
  }

  const handleGeneratePlaybook = async (level: 'micro' | 'standard' | 'premium') => {
    setPlaybookLoading(true)
    setPlaybookError(null)
    setSelectedVariation(level)
    try {
      const res = await fetch('/api/playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calf, variationLevel: level }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Playbook generation failed')
      }
      const { playbook: p } = await res.json() as { playbook: BuildPlaybook }
      setPlaybook(p)
    } catch (error) {
      setPlaybookError(error instanceof Error ? error.message : 'Playbook generation failed')
    } finally {
      setPlaybookLoading(false)
    }
  }

  // Find the best score-to-effort ratio variation
  const variationScores = (['micro', 'standard', 'premium'] as const).map((level) => {
    const v = calf.variationLevels[level]
    const ratio = v.pricing / Math.max(v.buildDays, 1)
    return { level, ratio }
  })
  const bestVariation = variationScores.sort((a, b) => b.ratio - a.ratio)[0].level

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back nav */}
      <Link
        href="/dashboard/herd"
        className="inline-flex items-center gap-1.5 text-sm mb-6"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={14} />
        Back to The Herd
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black">{calf.productName}</h1>
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold"
              style={{ background: statusConf.bg, color: statusConf.color }}
            >
              <statusConf.icon size={12} />
              {statusConf.label}
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>{calf.oneLinePitch}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {calf.niche} -- created {new Date(calf.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-black" style={{ color: 'var(--amber)' }}>{calf.overallScore}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Overall Score</p>
        </div>
      </div>

      {/* Confidence banner */}
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-lg mb-6"
        style={{
          background: calf.confidenceLevel === 'high' ? 'var(--green-soft)' : calf.confidenceLevel === 'medium' ? 'var(--amber-soft)' : 'var(--red-soft)',
          border: `1px solid ${calf.confidenceLevel === 'high' ? 'rgba(5,150,105,0.2)' : calf.confidenceLevel === 'medium' ? 'rgba(217,119,6,0.2)' : 'rgba(220,38,38,0.2)'}`,
        }}
      >
        <Shield size={14} style={{ color: calf.confidenceLevel === 'high' ? 'var(--green)' : calf.confidenceLevel === 'medium' ? 'var(--amber)' : 'var(--red)' }} />
        <span className="text-sm font-bold" style={{ color: calf.confidenceLevel === 'high' ? 'var(--green)' : calf.confidenceLevel === 'medium' ? 'var(--amber)' : 'var(--red)' }}>
          {calf.verificationPercentage}% data verified
        </span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          -- {calf.confidenceLevel === 'high' ? 'High confidence, most data from verified API sources' : calf.confidenceLevel === 'medium' ? 'Medium confidence, mix of verified and AI-estimated data' : 'Low confidence, mostly AI estimates'}
        </span>
      </div>

      {/* Scores grid */}
      <div
        className="grid grid-cols-5 gap-4 p-5 rounded-xl mb-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {[
          { label: 'Market Demand', value: calf.marketDemandScore, verified: calf.marketDemandScoreVerified, color: 'var(--amber)' },
          { label: 'Competition', value: calf.competitionDensityScore, color: calf.competitionDensityScore <= 40 ? 'var(--green)' : 'var(--orange)' },
          { label: 'Complexity', value: calf.buildComplexityScore, color: calf.buildComplexityScore <= 40 ? 'var(--green)' : 'var(--orange)' },
          { label: 'Revenue', value: calf.revenuePotentialScore, verified: calf.revenuePotentialScoreVerified, color: 'var(--amber)' },
          { label: 'AI Buildability', value: calf.aiBuildabilityScore, color: 'var(--blue)' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
            {s.verified !== undefined && (
              <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Verified: {s.verified}</p>
            )}
          </div>
        ))}
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Build Time</span>
          </div>
          <p className="text-lg font-bold">{calf.buildDaysMin}-{calf.buildDaysMax} days</p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{calf.buildDaysContext}</p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Pricing</span>
          </div>
          <p className="text-lg font-bold">${calf.pricingRecommendation}/mo</p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{calf.monetizationModel}</p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Revenue Potential</span>
          </div>
          <p className="text-lg font-bold" style={{ color: 'var(--green)' }}>
            ${(calf.revenuePotentialMin / 1000).toFixed(0)}K-${(calf.revenuePotentialMax / 1000).toFixed(0)}K/mo
          </p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{calf.revenuePotentialBasis}</p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Target</span>
          </div>
          <p className="text-sm font-bold leading-snug">{calf.targetAudience}</p>
        </div>
      </div>

      {/* Core features */}
      <div className="p-5 rounded-xl mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h3 className="font-bold mb-3">Core Features (MVP)</h3>
        <div className="space-y-2">
          {calf.coreFeatures.map((feature, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--green)' }} />
              <p className="text-sm">{feature}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Differentiation</p>
          <p className="text-sm">{calf.differentiationAngle}</p>
        </div>
      </div>

      {/* Revenue Forecast */}
      <div className="p-5 rounded-xl mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} style={{ color: 'var(--green)' }} />
          <h3 className="font-bold">Revenue Forecast</h3>
        </div>

        {!forecast && !forecastLoading && !forecastError && (
          <button
            onClick={handleGenerateForecast}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all hover:scale-[1.01]"
            style={{ background: 'var(--green-soft)', color: 'var(--green)', border: '1px solid rgba(5,150,105,0.2)' }}
          >
            <BarChart3 size={16} />
            Generate 12-Month Forecast
          </button>
        )}

        {forecastLoading && (
          <div className="text-center py-6">
            <Loader size={20} className="animate-spin mx-auto mb-2" style={{ color: 'var(--green)' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Generating revenue forecast...</p>
          </div>
        )}

        {forecastError && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--red-soft)' }}>
            <AlertTriangle size={14} style={{ color: 'var(--red)' }} />
            <p className="text-sm" style={{ color: 'var(--red)' }}>{forecastError}</p>
          </div>
        )}

        {forecast && (
          <div>
            {/* CSS Bar Chart */}
            <div className="flex items-end gap-1 h-40 mb-4 px-2">
              {forecast.months.map((m) => {
                const maxMrr = Math.max(...forecast.months.map((x) => x.best), 1)
                const baseHeight = (m.mrr / maxMrr) * 100
                const bestHeight = (m.best / maxMrr) * 100
                const worstHeight = (m.worst / maxMrr) * 100

                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5" title={`Month ${m.month}: $${m.mrr.toLocaleString()} MRR`}>
                    <div className="w-full relative" style={{ height: `${bestHeight}%`, minHeight: '2px' }}>
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-t opacity-20"
                        style={{ height: `${bestHeight}%`, background: 'var(--green)', minHeight: '2px' }}
                      />
                      <div
                        className="absolute bottom-0 left-[15%] right-[15%] rounded-t"
                        style={{ height: `${(baseHeight / bestHeight) * 100}%`, background: 'var(--green)', minHeight: '2px' }}
                      />
                      {worstHeight > 0 && (
                        <div
                          className="absolute bottom-0 left-[30%] right-[30%] rounded-t opacity-40"
                          style={{ height: `${(worstHeight / bestHeight) * 100}%`, background: 'var(--orange)', minHeight: '1px' }}
                        />
                      )}
                    </div>
                    <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>M{m.month}</span>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-[10px] mb-4" style={{ color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 rounded" style={{ background: 'var(--green)' }} /> Base
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 rounded opacity-20" style={{ background: 'var(--green)' }} /> Best Case
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 rounded opacity-40" style={{ background: 'var(--orange)' }} /> Worst Case
              </span>
            </div>

            {/* Key numbers */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-lg" style={{ background: 'var(--bg)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Month 12 MRR</p>
                <p className="text-lg font-black" style={{ color: 'var(--green)' }}>
                  ${forecast.months[11]?.mrr.toLocaleString() ?? '0'}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--bg)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Best Case M12</p>
                <p className="text-lg font-black" style={{ color: 'var(--text)' }}>
                  ${forecast.months[11]?.best.toLocaleString() ?? '0'}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--bg)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Break Even</p>
                <p className="text-lg font-black" style={{ color: 'var(--amber)' }}>
                  {forecast.breakEvenMonth ? `Month ${forecast.breakEvenMonth}` : 'N/A'}
                </p>
              </div>
            </div>

            {/* Assumptions */}
            <div>
              <p className="text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Assumptions</p>
              <ul className="space-y-1">
                {forecast.assumptions.map((a, i) => (
                  <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Build Variations (enhanced - clickable with playbook) */}
      <div className="p-5 rounded-xl mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h3 className="font-bold mb-3">Build Variations</h3>

        {/* Feature comparison table */}
        <div className="mb-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="text-left py-2 pr-4" style={{ color: 'var(--text-secondary)' }}>Feature</th>
                {(['micro', 'standard', 'premium'] as const).map((level) => (
                  <th key={level} className="text-center py-2 px-2" style={{ color: level === bestVariation ? 'var(--amber)' : 'var(--text-secondary)' }}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                    {level === bestVariation && (
                      <span className="block text-[9px] font-normal" style={{ color: 'var(--amber)' }}>Recommended</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="py-2 pr-4 font-medium">Build Time</td>
                {(['micro', 'standard', 'premium'] as const).map((level) => (
                  <td key={level} className="text-center py-2">{calf.variationLevels[level].buildDays}d</td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="py-2 pr-4 font-medium">Pricing</td>
                {(['micro', 'standard', 'premium'] as const).map((level) => (
                  <td key={level} className="text-center py-2">${calf.variationLevels[level].pricing}/mo</td>
                ))}
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Features</td>
                {(['micro', 'standard', 'premium'] as const).map((level) => (
                  <td key={level} className="text-center py-2">{calf.variationLevels[level].features.length}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Variation cards */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {(['micro', 'standard', 'premium'] as const).map((level) => {
            const v = calf.variationLevels[level]
            const isSelected = selectedVariation === level
            return (
              <button
                key={level}
                onClick={() => setSelectedVariation(level)}
                className="p-4 rounded-lg text-left transition-all"
                style={{
                  background: isSelected ? 'var(--amber-soft)' : 'var(--bg)',
                  border: `2px solid ${isSelected ? 'var(--amber)' : 'var(--border)'}`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    {level}
                  </p>
                  {level === bestVariation && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: 'var(--amber-soft)', color: 'var(--amber)' }}>
                      BEST VALUE
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold mb-1">{v.name}</p>
                <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {v.buildDays} days -- ${v.pricing}/mo
                </p>
                <ul className="space-y-1">
                  {v.features.map((f, i) => (
                    <li key={i} className="text-[11px] flex items-start gap-1">
                      <span style={{ color: 'var(--green)' }}>+</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>

        {/* Generate playbook button */}
        {!playbook && !playbookLoading && (
          <button
            onClick={() => handleGeneratePlaybook(selectedVariation)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all hover:scale-[1.01]"
            style={{ background: 'var(--amber-soft)', color: 'var(--amber)', border: '1px solid rgba(217,119,6,0.2)' }}
          >
            <Calendar size={16} />
            Generate Build Playbook ({selectedVariation})
          </button>
        )}

        {playbookLoading && (
          <div className="text-center py-6">
            <Loader size={20} className="animate-spin mx-auto mb-2" style={{ color: 'var(--amber)' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Generating build playbook...</p>
          </div>
        )}

        {playbookError && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--red-soft)' }}>
            <AlertTriangle size={14} style={{ color: 'var(--red)' }} />
            <p className="text-sm" style={{ color: 'var(--red)' }}>{playbookError}</p>
          </div>
        )}

        {/* Playbook timeline */}
        {playbook && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar size={16} style={{ color: 'var(--amber)' }} />
                <h4 className="text-sm font-bold">
                  Build Playbook -- {playbook.variationLevel} ({playbook.totalWeeks} weeks)
                </h4>
              </div>
              <button
                onClick={() => {
                  setPlaybook(null)
                  setPlaybookError(null)
                }}
                className="text-xs px-2 py-1 rounded"
                style={{ color: 'var(--text-muted)', background: 'var(--bg)' }}
              >
                Regenerate
              </button>
            </div>

            {/* Key milestones */}
            <div className="flex flex-wrap gap-2 mb-4">
              {playbook.keyMilestones.map((m, i) => (
                <span key={i} className="px-2 py-1 rounded text-[10px] font-medium" style={{ background: 'var(--amber-soft)', color: 'var(--amber)' }}>
                  {m}
                </span>
              ))}
            </div>

            {/* Week cards */}
            <div className="space-y-3">
              {playbook.weeks.map((week) => (
                <div key={week.week} className="p-4 rounded-lg" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black"
                      style={{ background: 'var(--amber)', color: '#fff' }}
                    >
                      {week.week}
                    </span>
                    <p className="text-sm font-bold">{week.title}</p>
                  </div>
                  <div className="space-y-1.5 mb-2">
                    {week.tasks.map((t, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <Check size={10} className="mt-0.5 shrink-0" style={{ color: 'var(--green)' }} />
                        <div>
                          <span className="font-medium">{t.task}</span>
                          <span style={{ color: 'var(--text-muted)' }}> -- {t.details}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Deliverables:</span>
                    {week.deliverables.map((d, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded" style={{ background: 'var(--green-soft)', color: 'var(--green)' }}>
                        {d}
                      </span>
                    ))}
                  </div>
                  {week.techStack.length > 0 && (
                    <div className="flex items-center gap-1 mt-1 text-[10px]">
                      <span style={{ color: 'var(--text-muted)' }}>Tech:</span>
                      {week.techStack.map((t, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded" style={{ background: 'var(--blue-soft)', color: 'var(--blue)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Why it works / risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="p-5 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} style={{ color: 'var(--green)' }} />
            <h3 className="font-bold">Why This Works</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Trend Velocity</p>
              <p>{calf.whyWorksData.trendVelocity}</p>
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Ad Spend Signal</p>
              <p>{calf.whyWorksData.adSpendInsight}</p>
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Complaint Clusters Addressed</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {calf.whyWorksData.complaintClusters.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs" style={{ background: 'var(--green-soft)', color: 'var(--green)' }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <button onClick={() => setShowRisks(!showRisks)} className="flex items-center gap-2 w-full">
            <AlertTriangle size={16} style={{ color: 'var(--orange)' }} />
            <h3 className="font-bold flex-1 text-left">Why It Might Fail</h3>
            {showRisks ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showRisks && (
            <div className="space-y-3 text-sm mt-3">
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Risks</p>
                <ul className="space-y-1 mt-1">
                  {calf.whyMightFail.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <AlertTriangle size={10} className="mt-1 shrink-0" style={{ color: 'var(--orange)' }} />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-4 text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>
                  Market Saturation: <span style={{ color: calf.whyMightFail.marketSaturation ? 'var(--red)' : 'var(--green)' }}>
                    {calf.whyMightFail.marketSaturation ? 'Yes' : 'No'}
                  </span>
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Complexity: <span style={{ color: 'var(--text)' }}>{calf.whyMightFail.buildComplexity}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status change + notes */}
      <div className="p-5 rounded-xl mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h3 className="font-bold mb-3">Manage This Calf</h3>
        <div className="flex gap-2 mb-4">
          {ALL_STATUSES.map((s) => {
            const conf = STATUS_CONFIG[s]
            const isActive = currentStatus === s
            return (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: isActive ? conf.bg : 'var(--bg)',
                  color: isActive ? conf.color : 'var(--text-muted)',
                  border: isActive ? `1px solid ${conf.color}` : '1px solid var(--border)',
                }}
              >
                <conf.icon size={12} />
                {conf.label}
              </button>
            )
          })}
        </div>
        <textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Add notes about this calf..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg text-sm resize-none"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }}
        />
      </div>

      {/* Brief section */}
      <div className="p-5 rounded-xl mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Product Brief</h3>
          <div className="flex gap-2">
          {!briefContent && !briefLoading && (
            <button
              onClick={() => setShowCustomizer(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              <Settings2 size={12} />
              Customize
            </button>
          )}
          {briefContent && !briefContent.startsWith('Error:') && (
            <>
              <button
                onClick={handleCopyBrief}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                {copied ? <Check size={12} style={{ color: 'var(--green)' }} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleDownloadBrief}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                <Download size={12} />
                .md
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: 'var(--amber-soft)', border: '1px solid rgba(217,119,6,0.2)', color: 'var(--amber)' }}
              >
                <FileText size={12} />
                PDF
              </button>
            </>
          )}
        </div>
        </div>

        {!showBrief ? (
          <button
            onClick={handleGenerateBrief}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold transition-all hover:scale-[1.01]"
            style={{ background: 'var(--amber)', color: '#FFFFFF', boxShadow: '0 0 20px rgba(217, 119, 6, 0.2)' }}
          >
            <Zap size={18} />
            Generate Build Brief
          </button>
        ) : briefLoading ? (
          <div className="text-center py-8">
            <Loader size={24} className="animate-spin mx-auto mb-3" style={{ color: 'var(--amber)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>
              {isExampleCalf ? 'Loading brief...' : 'Generating your product brief with AI...'}
            </p>
            {!isExampleCalf && (
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>This may take 10-20 seconds</p>
            )}
          </div>
        ) : briefContent ? (
          briefContent.startsWith('Error:') ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg" style={{ background: 'var(--red-soft)', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
              <AlertTriangle size={14} style={{ color: 'var(--red)' }} />
              <p className="text-sm" style={{ color: 'var(--red)' }}>{briefContent.slice(7)}</p>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              {briefContent.split('\n').map((line, i) => {
                if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold mt-4 mb-1" style={{ color: 'var(--text)' }}>{line.slice(4)}</h3>
                if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mt-6 mb-2" style={{ color: 'var(--text)' }}>{line.slice(3)}</h2>
                if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-sm font-bold mt-2">{line.slice(2, -2)}</p>
                if (line.startsWith('- ')) return (
                  <div key={i} className="flex items-start gap-2 ml-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--amber)' }}>-</span>
                    <span>{line.slice(2)}</span>
                  </div>
                )
                if (line.startsWith('| ')) return <p key={i} className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{line}</p>
                if (line.trim() === '---') return <hr key={i} className="my-4" style={{ borderColor: 'var(--border)' }} />
                if (line.trim() === '') return <div key={i} className="h-2" />
                const parts = line.split(/(\*\*[^*]+\*\*)/)
                return (
                  <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {parts.map((part, j) => {
                      if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} style={{ color: 'var(--text)' }}>{part.slice(2, -2)}</strong>
                      return <span key={j}>{part}</span>
                    })}
                  </p>
                )
              })}
            </div>
          )
        ) : (
          <p className="text-sm" style={{ color: 'var(--red)' }}>Failed to generate brief.</p>
        )}
      </div>

      {/* Brief Customizer Modal */}
      {showCustomizer && (
        <BriefCustomizer
          onGenerate={handleCustomBrief}
          onClose={() => setShowCustomizer(false)}
          isLoading={customBriefLoading}
        />
      )}
    </div>
  )
}
