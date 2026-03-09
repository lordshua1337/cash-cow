'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft, Target, Zap, TrendingUp, Clock, Shield,
  DollarSign, Users, AlertTriangle, Plus, Eye, Search,
  Hammer, Rocket, ChevronRight,
} from 'lucide-react'
import { StageBadge } from '@/components/trends/StageBadge'
import { getTrendById, getAnalysisForTrend, getSignalsForTrend } from '@/lib/trends/mock-data'
import { calculateBuildNextScore, getPlaybook, getVerdictColor } from '@/lib/trends/build-playbooks'
import {
  loadPipeline, addToPipeline, movePipelineEntry,
  STAGE_LABELS, STAGE_COLORS,
  type PipelineStage, type Pipeline,
} from '@/lib/trends/opportunity-pipeline'

const NEXT_STAGE: Record<PipelineStage, PipelineStage | null> = {
  watching: 'researching',
  researching: 'building',
  building: 'launched',
  launched: null,
}

export function OpportunityDetail({ trendId }: { readonly trendId: string }) {
  const trend = getTrendById(trendId)
  const [pipeline, setPipeline] = useState<Pipeline>({ entries: [] })

  useEffect(() => {
    setPipeline(loadPipeline())
  }, [])

  const handleAddToPipeline = useCallback((stage: PipelineStage) => {
    const updated = addToPipeline(trendId, stage)
    setPipeline(updated)
  }, [trendId])

  const handleMovePipeline = useCallback((stage: PipelineStage) => {
    const updated = movePipelineEntry(trendId, stage)
    setPipeline(updated)
  }, [trendId])

  if (!trend) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p style={{ color: 'var(--text-secondary)' }}>Trend not found.</p>
        <Link href="/dashboard/trends" className="text-sm" style={{ color: 'var(--cash)' }}>
          Back to Trends
        </Link>
      </div>
    )
  }

  const playbook = getPlaybook(trend.id)
  const analysis = getAnalysisForTrend(trend.id)
  const signals = getSignalsForTrend(trend.id)
  const buildScore = calculateBuildNextScore(trend)
  const pipelineEntry = pipeline.entries.find((e) => e.trendId === trend.id)
  const nextStage = pipelineEntry ? NEXT_STAGE[pipelineEntry.stage] : null

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <Link
        href="/dashboard/trends"
        className="flex items-center gap-1 text-sm transition-colors w-fit"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={14} />
        Back to Trends
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>
              {trend.category}
            </div>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
              {trend.name}
            </h1>
            {trend.description && (
              <p className="text-sm mt-2 leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                {trend.description}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-5xl font-black" style={{ color: 'var(--cash)' }}>
              {buildScore}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Build Score</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!pipelineEntry ? (
            <button
              onClick={() => handleAddToPipeline('watching')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{ background: 'var(--cash)', color: '#0A0A0A' }}
            >
              <Plus size={14} />
              Add to Pipeline
            </button>
          ) : (
            <>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  background: `${STAGE_COLORS[pipelineEntry.stage]}15`,
                  border: `1px solid ${STAGE_COLORS[pipelineEntry.stage]}40`,
                  color: STAGE_COLORS[pipelineEntry.stage],
                }}
              >
                {pipelineEntry.stage === 'watching' && <Eye size={14} />}
                {pipelineEntry.stage === 'researching' && <Search size={14} />}
                {pipelineEntry.stage === 'building' && <Hammer size={14} />}
                {pipelineEntry.stage === 'launched' && <Rocket size={14} />}
                In Pipeline: {STAGE_LABELS[pipelineEntry.stage]}
              </div>
              {nextStage && (
                <button
                  onClick={() => handleMovePipeline(nextStage)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                  style={{ background: `${STAGE_COLORS[nextStage]}15`, color: STAGE_COLORS[nextStage], border: `1px solid ${STAGE_COLORS[nextStage]}30` }}
                >
                  Move to {STAGE_LABELS[nextStage]}
                  <ChevronRight size={14} />
                </button>
              )}
            </>
          )}
        </div>
      </motion.div>

      {playbook && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-5"
          style={{
            background: `${getVerdictColor(playbook.verdict)}08`,
            border: `1px solid ${getVerdictColor(playbook.verdict)}30`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Target size={18} style={{ color: getVerdictColor(playbook.verdict) }} />
            <span className="text-lg font-black" style={{ color: getVerdictColor(playbook.verdict) }}>
              {playbook.verdict}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
            {playbook.verdictReason}
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-3"
      >
        {[
          { label: 'Momentum', value: String(trend.trend_score), icon: TrendingUp, color: 'var(--cash)' },
          { label: 'Stage', value: trend.current_stage, icon: Target, color: 'var(--text)' },
          { label: 'Competition', value: trend.competition_density, icon: Shield,
            color: trend.competition_density === 'Low' ? 'var(--cash)' : trend.competition_density === 'Medium' ? 'var(--orange, #FF9100)' : 'var(--red, #EF4444)' },
          { label: 'Monetization', value: trend.monetization_signal, icon: DollarSign, color: 'var(--cash)' },
          { label: 'Build Time', value: `${trend.time_to_build_days ?? '?'} days`, icon: Clock, color: 'var(--text)' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl p-4 text-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <Icon size={16} className="mx-auto mb-2" style={{ color }} />
            <div className="text-lg font-black" style={{ color }}>{value}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</div>
          </div>
        ))}
      </motion.div>

      {playbook && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} style={{ color: '#FFD600' }} />
            <h2 className="text-lg font-black" style={{ color: 'var(--text)' }}>
              What to Build
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {playbook.productIdeas.map((idea, index) => (
              <div
                key={idea.name}
                className="rounded-xl p-5"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                      style={{ background: 'var(--cash-soft)', color: 'var(--cash)' }}
                    >
                      {index + 1}
                    </span>
                    <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                      {idea.name}
                    </h3>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded font-medium"
                    style={{
                      background: idea.difficulty === 'Low' ? 'rgba(34, 197, 94, 0.1)'
                        : idea.difficulty === 'Medium' ? 'rgba(255, 214, 0, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                      color: idea.difficulty === 'Low' ? 'var(--cash)'
                        : idea.difficulty === 'Medium' ? 'var(--orange, #FFD600)'
                        : 'var(--red, #EF4444)',
                    }}
                  >
                    {idea.difficulty} difficulty
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {idea.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Users size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--cash)' }} />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                        Target Customer
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text)' }}>{idea.targetCustomer}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--cash)' }} />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                        Revenue Model
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text)' }}>{idea.revenueModel}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <TrendingUp size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--cash)' }} />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                        Estimated MRR
                      </div>
                      <div className="text-sm font-bold" style={{ color: 'var(--cash)' }}>{idea.estimatedMRR}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {playbook && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl p-5"
          style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.15)' }}
        >
          <h2 className="text-base font-black mb-2" style={{ color: 'var(--cash)' }}>
            Build Advice
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
            {playbook.buildAdvice}
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>
                Target Market
              </div>
              <p className="text-sm" style={{ color: 'var(--text)' }}>{playbook.targetMarket}</p>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>
                Time to First Revenue
              </div>
              <p className="text-sm font-bold" style={{ color: 'var(--cash)' }}>{playbook.timeToFirstRevenue}</p>
            </div>
          </div>
        </motion.section>
      )}

      {playbook && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} style={{ color: 'var(--red, #EF4444)' }} />
            <h2 className="text-base font-black" style={{ color: 'var(--text)' }}>
              Risk Factors
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {playbook.riskFactors.map((risk) => (
              <div
                key={risk}
                className="flex items-start gap-3 px-4 py-3 rounded-lg"
                style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}
              >
                <span style={{ color: 'var(--red, #EF4444)' }}>--</span>
                <span className="text-sm" style={{ color: 'var(--text)' }}>{risk}</span>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {analysis && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl p-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-base font-black mb-3" style={{ color: 'var(--text)' }}>
            AI Market Analysis
          </h2>
          {analysis.ai_notes && (
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text)' }}>
              {analysis.ai_notes}
            </p>
          )}
          {analysis.historical_pattern && (
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>
                Historical Pattern
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {analysis.historical_pattern}
              </p>
            </div>
          )}
          {analysis.key_indicators && analysis.key_indicators.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                Key Indicators
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {analysis.key_indicators.map((ind) => (
                  <div
                    key={ind.indicator}
                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                  >
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{ind.indicator}</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--cash)' }}>{String(ind.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {analysis.estimated_peak_months !== undefined && analysis.estimated_peak_months > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: 'rgba(255, 214, 0, 0.05)', border: '1px solid rgba(255, 214, 0, 0.15)' }}>
              <Clock size={16} style={{ color: 'var(--orange, #FFD600)' }} />
              <div>
                <div className="text-sm font-bold" style={{ color: 'var(--orange, #FFD600)' }}>
                  Estimated peak in {analysis.estimated_peak_months} months
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Build window closes approximately {new Date(Date.now() + analysis.estimated_peak_months * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          )}
        </motion.section>
      )}

      {signals.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-base font-black mb-3" style={{ color: 'var(--text)' }}>
            Signal Sources
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {signals.map((signal) => (
              <div
                key={signal.id}
                className="rounded-lg p-3 text-center"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="text-lg font-black" style={{ color: 'var(--cash)' }}>
                  {signal.signal_score}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{signal.source}</div>
                {signal.velocity !== undefined && (
                  <div
                    className="text-xs mt-1 font-medium"
                    style={{ color: signal.velocity > 0 ? 'var(--cash)' : 'var(--red, #EF4444)' }}
                  >
                    {signal.velocity > 0 ? '+' : ''}{signal.velocity}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {!playbook && (
        <div
          className="rounded-xl p-8 text-center"
          style={{ border: '1px dashed var(--border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Build playbook not available for this trend yet. Check back later for product ideas and strategic analysis.
          </p>
        </div>
      )}
    </div>
  )
}
