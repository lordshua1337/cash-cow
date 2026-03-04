'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, TrendingUp, Hammer, DollarSign, Skull, Shield, AlertTriangle,
  Zap, Clock, Target, Copy, Download, ChevronDown, ChevronUp, Check
} from 'lucide-react'
import { getCalfById, MOCK_BRIEFS, getSnapshotById } from '@/lib/mock-data'
import { loadState, updateCalfStatus, updateCalfNotes } from '@/lib/state'
import { exportBriefAsMarkdown, downloadFile } from '@/lib/export'
import type { Calf, CalfStatus } from '@/lib/types'

const STATUS_CONFIG: Record<CalfStatus, { label: string; icon: typeof TrendingUp; color: string; bg: string }> = {
  grazing: { label: 'Grazing', icon: TrendingUp, color: 'var(--blue)', bg: 'var(--blue-soft)' },
  building: { label: 'Building', icon: Hammer, color: 'var(--amber)', bg: 'var(--amber-soft)' },
  milking: { label: 'Milking', icon: DollarSign, color: 'var(--green)', bg: 'var(--green-soft)' },
  dried_up: { label: 'Dried Up', icon: Skull, color: 'var(--text-muted)', bg: 'var(--bg-alt)' },
}

const ALL_STATUSES: CalfStatus[] = ['grazing', 'building', 'milking', 'dried_up']

export function CalfDetail({ calfId }: { readonly calfId: string }) {
  const baseCalf = getCalfById(calfId)
  const [currentStatus, setCurrentStatus] = useState<CalfStatus>(baseCalf?.status ?? 'grazing')
  const [notes, setNotes] = useState('')
  const [showBrief, setShowBrief] = useState(false)
  const [briefLoading, setBriefLoading] = useState(false)
  const [briefContent, setBriefContent] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showRisks, setShowRisks] = useState(false)

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
  const snapshot = getSnapshotById(calf.snapshotId)
  const statusConf = STATUS_CONFIG[currentStatus]

  const handleStatusChange = (newStatus: CalfStatus) => {
    setCurrentStatus(newStatus)
    updateCalfStatus(calfId, newStatus)
  }

  const handleNotesChange = (value: string) => {
    setNotes(value)
    updateCalfNotes(calfId, value)
  }

  const handleGenerateBrief = () => {
    setBriefLoading(true)
    setShowBrief(true)
    // Simulate brief generation delay
    setTimeout(() => {
      setBriefContent(MOCK_BRIEFS[calfId] ?? 'Brief not available for this calf.')
      setBriefLoading(false)
    }, 2000)
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

      {/* Variation levels */}
      <div className="p-5 rounded-xl mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h3 className="font-bold mb-3">Build Variations</h3>
        <div className="grid grid-cols-3 gap-4">
          {(['micro', 'standard', 'premium'] as const).map((level) => {
            const v = calf.variationLevels[level]
            return (
              <div
                key={level}
                className="p-4 rounded-lg"
                style={{
                  background: level === 'standard' ? 'var(--amber-soft)' : 'var(--bg)',
                  border: `1px solid ${level === 'standard' ? 'rgba(217,119,6,0.3)' : 'var(--border)'}`,
                }}
              >
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>
                  {level}
                </p>
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
              </div>
            )
          })}
        </div>
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
          <button
            onClick={() => setShowRisks(!showRisks)}
            className="flex items-center gap-2 w-full"
          >
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
          {briefContent && (
            <div className="flex gap-2">
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
                Download .md
              </button>
            </div>
          )}
        </div>

        {!showBrief ? (
          <button
            onClick={handleGenerateBrief}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold transition-all hover:scale-[1.01]"
            style={{
              background: 'var(--amber)',
              color: '#FFFFFF',
              boxShadow: '0 0 20px rgba(217, 119, 6, 0.2)',
            }}
          >
            <Zap size={18} />
            Generate Build Brief
          </button>
        ) : briefLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin text-2xl mb-3">
              <Zap size={24} style={{ color: 'var(--amber)' }} />
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Generating your product brief...</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>(est. 2 seconds)</p>
          </div>
        ) : briefContent ? (
          <div className="prose prose-sm max-w-none">
            {briefContent.split('\n').map((line, i) => {
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-base font-bold mt-4 mb-1" style={{ color: 'var(--text)' }}>{line.slice(4)}</h3>
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-lg font-bold mt-6 mb-2" style={{ color: 'var(--text)' }}>{line.slice(3)}</h2>
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="text-sm font-bold mt-2">{line.slice(2, -2)}</p>
              }
              if (line.startsWith('- ')) {
                return (
                  <div key={i} className="flex items-start gap-2 ml-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--amber)' }}>-</span>
                    <span>{line.slice(2)}</span>
                  </div>
                )
              }
              if (line.startsWith('| ')) {
                return <p key={i} className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{line}</p>
              }
              if (line.trim() === '---') {
                return <hr key={i} className="my-4" style={{ borderColor: 'var(--border)' }} />
              }
              if (line.trim() === '') {
                return <div key={i} className="h-2" />
              }
              // Handle inline bold
              const parts = line.split(/(\*\*[^*]+\*\*)/)
              return (
                <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={j} style={{ color: 'var(--text)' }}>{part.slice(2, -2)}</strong>
                    }
                    return <span key={j}>{part}</span>
                  })}
                </p>
              )
            })}
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--red)' }}>Failed to generate brief.</p>
        )}
      </div>
    </div>
  )
}
