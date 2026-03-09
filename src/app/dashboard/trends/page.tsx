'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Crosshair, TrendingUp, Zap, Target, ArrowRight, Plus,
  Eye, Search, Hammer, Rocket, ChevronDown, ChevronUp,
} from 'lucide-react'
import { TrendHeatmap } from '@/components/trends/TrendHeatmap'
import { AlertCenter } from '@/components/trends/AlertCenter'
import { StageBadge } from '@/components/trends/StageBadge'
import { getCategoryStats, getTrends, getAnalysisForTrend } from '@/lib/trends/mock-data'
import { calculateBuildNextScore, getPlaybook, getVerdictColor } from '@/lib/trends/build-playbooks'
import {
  loadPipeline, addToPipeline,
  STAGE_LABELS, STAGE_COLORS,
} from '@/lib/trends/opportunity-pipeline'
import type { Trend, TrendCategory } from '@/lib/trends/types'
import type { PipelineStage, Pipeline } from '@/lib/trends/opportunity-pipeline'

interface OpportunityCardProps {
  readonly trend: Trend
  readonly rank: number
  readonly pipeline: Pipeline
  readonly onPipelineChange: (updated: Pipeline) => void
}

function OpportunityCard({ trend, rank, pipeline, onPipelineChange }: OpportunityCardProps) {
  const [expanded, setExpanded] = useState(false)
  const buildScore = calculateBuildNextScore(trend)
  const playbook = getPlaybook(trend.id)
  const analysis = getAnalysisForTrend(trend.id)
  const pipelineEntry = pipeline.entries.find((e) => e.trendId === trend.id)

  const handleAddToPipeline = useCallback((stage: PipelineStage) => {
    const updated = addToPipeline(trend.id, stage)
    onPipelineChange(updated)
  }, [trend.id, onPipelineChange])

  const verdictColor = playbook ? getVerdictColor(playbook.verdict) : 'var(--text-secondary)'
  const topIdea = playbook?.productIdeas[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.08 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: rank === 0 ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--border)',
        boxShadow: rank === 0 ? '0 0 30px rgba(34, 197, 94, 0.08)' : 'none',
      }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {rank === 0 && <Zap size={16} style={{ color: '#FFD600' }} />}
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                #{rank + 1} Opportunity
              </span>
            </div>
            <h3 className="text-lg font-black" style={{ color: 'var(--text)' }}>
              {trend.name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {trend.category}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl font-black" style={{ color: 'var(--cash)' }}>
              {buildScore}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Build Score
            </div>
          </div>
        </div>

        {playbook && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
            style={{ background: `${verdictColor}10`, border: `1px solid ${verdictColor}30` }}
          >
            <Target size={14} style={{ color: verdictColor }} />
            <span className="text-sm font-bold" style={{ color: verdictColor }}>
              {playbook.verdict}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              -- {playbook.verdictReason.substring(0, 80)}{playbook.verdictReason.length > 80 ? '...' : ''}
            </span>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 mb-3">
          <div className="text-center">
            <div className="text-sm font-bold" style={{ color: 'var(--blue, #3B82F6)' }}>
              {trend.trend_score}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Momentum</div>
          </div>
          <div className="text-center">
            <StageBadge stage={trend.current_stage} size="sm" />
          </div>
          <div className="text-center">
            <div
              className="text-sm font-bold"
              style={{
                color: trend.competition_density === 'Low' ? 'var(--cash)'
                  : trend.competition_density === 'Medium' ? 'var(--orange, #FF9100)'
                  : 'var(--red, #EF4444)',
              }}
            >
              {trend.competition_density}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Competition</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>
              {trend.time_to_build_days ?? '?'}d
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Build Time</div>
          </div>
        </div>

        {topIdea && (
          <div
            className="rounded-lg p-3 mb-3"
            style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.15)' }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Zap size={12} style={{ color: 'var(--cash)' }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--cash)' }}>
                Top Product Idea
              </span>
            </div>
            <div className="text-sm font-bold mb-0.5" style={{ color: 'var(--text)' }}>
              {topIdea.name}
            </div>
            <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {topIdea.description}
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs">
              <span style={{ color: 'var(--text-secondary)' }}>
                Revenue: <span style={{ color: 'var(--cash)' }}>{topIdea.estimatedMRR}</span>
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                Model: <span style={{ color: 'var(--text)' }}>{topIdea.revenueModel.split('(')[0].trim()}</span>
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {!pipelineEntry ? (
            <button
              onClick={() => handleAddToPipeline('watching')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
              style={{ background: 'var(--cash-soft)', border: '1px solid rgba(34, 197, 94, 0.3)', color: 'var(--cash)' }}
            >
              <Plus size={12} />
              Add to Pipeline
            </button>
          ) : (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: `${STAGE_COLORS[pipelineEntry.stage]}15`,
                border: `1px solid ${STAGE_COLORS[pipelineEntry.stage]}40`,
                color: STAGE_COLORS[pipelineEntry.stage],
              }}
            >
              {pipelineEntry.stage === 'watching' && <Eye size={12} />}
              {pipelineEntry.stage === 'researching' && <Search size={12} />}
              {pipelineEntry.stage === 'building' && <Hammer size={12} />}
              {pipelineEntry.stage === 'launched' && <Rocket size={12} />}
              {STAGE_LABELS[pipelineEntry.stage]}
            </div>
          )}

          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            {expanded ? 'Less' : 'Full Playbook'}
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {playbook && (
            <Link
              href={`/dashboard/trends/${trend.id}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ml-auto"
              style={{ color: 'var(--cash)' }}
            >
              Deep Dive <ArrowRight size={12} />
            </Link>
          )}
        </div>
      </div>

      {expanded && playbook && (
        <div
          className="px-5 pb-5 flex flex-col gap-4"
          style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}
        >
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
              Product Ideas ({playbook.productIdeas.length})
            </h4>
            <div className="flex flex-col gap-2">
              {playbook.productIdeas.map((idea) => (
                <div
                  key={idea.name}
                  className="rounded-lg p-3"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{idea.name}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        background: idea.difficulty === 'Low' ? 'rgba(34, 197, 94, 0.1)'
                          : idea.difficulty === 'Medium' ? 'rgba(255, 214, 0, 0.1)'
                          : 'rgba(239, 68, 68, 0.1)',
                        color: idea.difficulty === 'Low' ? 'var(--cash)'
                          : idea.difficulty === 'Medium' ? 'var(--orange, #FFD600)'
                          : 'var(--red, #EF4444)',
                      }}
                    >
                      {idea.difficulty}
                    </span>
                  </div>
                  <p className="text-xs mb-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{idea.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Target: </span>
                      <span style={{ color: 'var(--text)' }}>{idea.targetCustomer}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Revenue: </span>
                      <span style={{ color: 'var(--cash)' }}>{idea.estimatedMRR}</span>
                    </div>
                    <div className="col-span-2">
                      <span style={{ color: 'var(--text-secondary)' }}>Model: </span>
                      <span style={{ color: 'var(--text)' }}>{idea.revenueModel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
              Build Advice
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
              {playbook.buildAdvice}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>
                Target Market
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>
                {playbook.targetMarket}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>
                Time to First Revenue
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--cash)' }}>
                {playbook.timeToFirstRevenue}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
              Risk Factors
            </h4>
            <ul className="flex flex-col gap-1">
              {playbook.riskFactors.map((risk) => (
                <li key={risk} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--red, #EF4444)' }}>--</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>

          {analysis?.ai_notes && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                AI Market Analysis
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>
                {analysis.ai_notes}
              </p>
              {analysis.estimated_peak_months !== undefined && analysis.estimated_peak_months > 0 && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span style={{ color: 'var(--text-secondary)' }}>Estimated peak in:</span>
                  <span className="font-bold" style={{ color: 'var(--orange, #FF9100)' }}>
                    {analysis.estimated_peak_months} months
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default function TrendsOverviewPage() {
  const [selectedCategory, setSelectedCategory] = useState<TrendCategory | undefined>()
  const [showAllTrends, setShowAllTrends] = useState(false)
  const [pipeline, setPipeline] = useState<Pipeline>({ entries: [] })

  useEffect(() => {
    setPipeline(loadPipeline())
  }, [])

  const pipelineCounts = {
    watching: pipeline.entries.filter((e) => e.stage === 'watching').length,
    researching: pipeline.entries.filter((e) => e.stage === 'researching').length,
    building: pipeline.entries.filter((e) => e.stage === 'building').length,
    launched: pipeline.entries.filter((e) => e.stage === 'launched').length,
  }

  const categoryStats = getCategoryStats()

  const allTrends = getTrends(
    selectedCategory
      ? { category: selectedCategory, sortBy: 'trend_score', sortDir: 'desc' }
      : { sortBy: 'trend_score', sortDir: 'desc' }
  )
  const rankedTrends = [...allTrends].sort((a, b) => calculateBuildNextScore(b) - calculateBuildNextScore(a))
  const topOpportunities = rankedTrends.slice(0, 5)
  const remainingTrends = rankedTrends.slice(5)

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      <div>
        <div className="flex items-center justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target size={20} style={{ color: 'var(--cash)' }} />
              <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
                What to Build Next
              </h1>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {selectedCategory
                ? `Top opportunities in ${selectedCategory}`
                : `${allTrends.length} trends analyzed. Top opportunities ranked by Build Score.`}
            </p>
          </div>
          <AlertCenter />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          { stage: 'watching' as const, icon: Eye, label: 'Watching' },
          { stage: 'researching' as const, icon: Search, label: 'Researching' },
          { stage: 'building' as const, icon: Hammer, label: 'Building' },
          { stage: 'launched' as const, icon: Rocket, label: 'Launched' },
        ]).map(({ stage, icon: Icon, label }) => (
          <Link
            key={stage}
            href="/dashboard/trends/pipeline"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-[1.02]"
            style={{
              background: 'var(--surface)',
              border: pipelineCounts[stage] > 0
                ? `1px solid ${STAGE_COLORS[stage]}40`
                : '1px solid var(--border)',
            }}
          >
            <Icon size={18} style={{ color: STAGE_COLORS[stage] }} />
            <div>
              <div className="text-lg font-black" style={{ color: 'var(--text)' }}>
                {pipelineCounts[stage]}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</div>
            </div>
          </Link>
        ))}
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} style={{ color: '#FFD600' }} />
          <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
            Top {topOpportunities.length} Build Opportunities
          </h2>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Ranked by Build Score
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {topOpportunities.map((trend, index) => (
            <OpportunityCard key={trend.id} trend={trend} rank={index} pipeline={pipeline} onPipelineChange={setPipeline} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} style={{ color: 'var(--cash)' }} />
          <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
            Category Heatmap
          </h2>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Click to filter opportunities
          </span>
        </div>
        <TrendHeatmap
          stats={categoryStats}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>

      {remainingTrends.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Crosshair size={16} style={{ color: 'var(--cash)' }} />
              <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                All Trends
              </h2>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {remainingTrends.length} more trends
              </span>
            </div>
            <button
              onClick={() => setShowAllTrends((prev) => !prev)}
              className="flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: 'var(--cash)' }}
            >
              {showAllTrends ? 'Collapse' : 'Show All'}
              {showAllTrends ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {showAllTrends && (
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--border)' }}
            >
              <div
                className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                style={{
                  background: 'var(--surface)',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                <div className="col-span-3">Trend</div>
                <div className="col-span-2">Stage</div>
                <div className="col-span-2 text-right">Build Score</div>
                <div className="col-span-2 text-right">Competition</div>
                <div className="col-span-3 text-right">Verdict</div>
              </div>
              {remainingTrends.map((trend, index) => {
                const score = calculateBuildNextScore(trend)
                const pb = getPlaybook(trend.id)
                return (
                  <Link
                    key={trend.id}
                    href={`/dashboard/trends/${trend.id}`}
                    className="grid grid-cols-12 gap-4 px-4 py-3 items-center transition-colors hover:bg-white/[0.02]"
                    style={{
                      borderBottom: index < remainingTrends.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <div className="col-span-3">
                      <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{trend.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{trend.category}</div>
                    </div>
                    <div className="col-span-2">
                      <StageBadge stage={trend.current_stage} size="sm" />
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-sm font-bold" style={{ color: 'var(--cash)' }}>{score}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span
                        className="text-xs font-medium"
                        style={{
                          color: trend.competition_density === 'Low' ? 'var(--cash)'
                            : trend.competition_density === 'Medium' ? 'var(--orange, #FF9100)'
                            : 'var(--red, #EF4444)',
                        }}
                      >
                        {trend.competition_density}
                      </span>
                    </div>
                    <div className="col-span-3 text-right">
                      {pb ? (
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded"
                          style={{
                            background: `${getVerdictColor(pb.verdict)}15`,
                            color: getVerdictColor(pb.verdict),
                          }}
                        >
                          {pb.verdict}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>--</span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
