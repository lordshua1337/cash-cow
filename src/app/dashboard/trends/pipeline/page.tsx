'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Eye, Search, Hammer, Rocket, ArrowRight, Trash2, ChevronRight,
} from 'lucide-react'
import { StageBadge } from '@/components/trends/StageBadge'
import { getTrendById } from '@/lib/trends/mock-data'
import { calculateBuildNextScore, getPlaybook, getVerdictColor } from '@/lib/trends/build-playbooks'
import {
  loadPipeline, movePipelineEntry, removeFromPipeline, updatePipelineNotes,
  STAGE_LABELS, STAGE_COLORS,
  type PipelineStage, type Pipeline, type PipelineEntry,
} from '@/lib/trends/opportunity-pipeline'
import type { Trend } from '@/lib/trends/types'

const STAGES: readonly PipelineStage[] = ['watching', 'researching', 'building', 'launched']
const STAGE_ICONS = {
  watching: Eye,
  researching: Search,
  building: Hammer,
  launched: Rocket,
}
const NEXT_STAGE: Record<PipelineStage, PipelineStage | null> = {
  watching: 'researching',
  researching: 'building',
  building: 'launched',
  launched: null,
}

interface PipelineCardProps {
  readonly entry: PipelineEntry
  readonly trend: Trend
  readonly onMove: (trendId: string, stage: PipelineStage) => void
  readonly onRemove: (trendId: string) => void
  readonly onUpdateNotes: (trendId: string, notes: string) => void
}

function PipelineCard({ entry, trend, onMove, onRemove, onUpdateNotes }: PipelineCardProps) {
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState(entry.notes)
  const playbook = getPlaybook(trend.id)
  const buildScore = calculateBuildNextScore(trend)
  const nextStage = NEXT_STAGE[entry.stage]

  const handleSaveNotes = useCallback(() => {
    onUpdateNotes(entry.trendId, notes)
    setEditing(false)
  }, [entry.trendId, notes, onUpdateNotes])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-lg p-4 flex flex-col gap-2"
      style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>
            {trend.name}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {trend.category}
          </div>
        </div>
        <div className="text-lg font-black shrink-0" style={{ color: 'var(--cash)' }}>
          {buildScore}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <StageBadge stage={trend.current_stage} size="sm" />
        {playbook && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded"
            style={{
              background: `${getVerdictColor(playbook.verdict)}15`,
              color: getVerdictColor(playbook.verdict),
            }}
          >
            {playbook.verdict}
          </span>
        )}
      </div>

      {editing ? (
        <div className="flex flex-col gap-1">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-2 py-1.5 rounded text-xs resize-none outline-none"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', minHeight: '60px' }}
            placeholder="Add notes about this opportunity..."
          />
          <div className="flex gap-1">
            <button
              onClick={handleSaveNotes}
              className="text-xs px-2 py-1 rounded"
              style={{ background: 'var(--cash-soft)', color: 'var(--cash)' }}
            >
              Save
            </button>
            <button
              onClick={() => { setEditing(false); setNotes(entry.notes) }}
              className="text-xs px-2 py-1 rounded"
              style={{ color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-left py-1 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          {entry.notes || 'Click to add notes...'}
        </button>
      )}

      <div className="flex items-center gap-2 mt-1">
        {nextStage && (
          <button
            onClick={() => onMove(entry.trendId, nextStage)}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all hover:scale-105"
            style={{ background: `${STAGE_COLORS[nextStage]}15`, color: STAGE_COLORS[nextStage], border: `1px solid ${STAGE_COLORS[nextStage]}30` }}
          >
            Move to {STAGE_LABELS[nextStage]}
            <ChevronRight size={10} />
          </button>
        )}
        <button
          onClick={() => onRemove(entry.trendId)}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ml-auto"
          style={{ color: 'var(--red, #EF4444)' }}
        >
          <Trash2 size={10} />
          Remove
        </button>
      </div>

      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        Added {new Date(entry.addedAt).toLocaleDateString()}
      </div>
    </motion.div>
  )
}

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState<Pipeline>({ entries: [] })

  useEffect(() => {
    setPipeline(loadPipeline())
  }, [])

  const handleMove = useCallback((trendId: string, stage: PipelineStage) => {
    const updated = movePipelineEntry(trendId, stage)
    setPipeline(updated)
  }, [])

  const handleRemove = useCallback((trendId: string) => {
    const updated = removeFromPipeline(trendId)
    setPipeline(updated)
  }, [])

  const handleUpdateNotes = useCallback((trendId: string, notes: string) => {
    const updated = updatePipelineNotes(trendId, notes)
    setPipeline(updated)
  }, [])

  const totalEntries = pipeline.entries.length

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ArrowRight size={20} style={{ color: 'var(--cash)' }} />
          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
            Opportunity Pipeline
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Track opportunities from discovery to launch. {totalEntries} opportunities in your pipeline.
        </p>
      </div>

      {totalEntries === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ border: '1px dashed var(--border)' }}
        >
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            Your pipeline is empty.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Go to the Overview and click &quot;Add to Pipeline&quot; on any opportunity to start tracking it.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {STAGES.map((stage) => {
            const Icon = STAGE_ICONS[stage]
            const entries = pipeline.entries.filter((e) => e.stage === stage)

            return (
              <div key={stage} className="flex flex-col gap-3">
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: `${STAGE_COLORS[stage]}10`, border: `1px solid ${STAGE_COLORS[stage]}25` }}
                >
                  <Icon size={16} style={{ color: STAGE_COLORS[stage] }} />
                  <span className="text-sm font-bold" style={{ color: STAGE_COLORS[stage] }}>
                    {STAGE_LABELS[stage]}
                  </span>
                  <span className="text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>
                    {entries.length}
                  </span>
                </div>

                {entries.length === 0 ? (
                  <div
                    className="rounded-lg p-6 text-center"
                    style={{ border: '1px dashed var(--border)' }}
                  >
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      No opportunities
                    </p>
                  </div>
                ) : (
                  entries.map((entry) => {
                    const trend = getTrendById(entry.trendId)
                    if (!trend) return null
                    return (
                      <PipelineCard
                        key={entry.trendId}
                        entry={entry}
                        trend={trend}
                        onMove={handleMove}
                        onRemove={handleRemove}
                        onUpdateNotes={handleUpdateNotes}
                      />
                    )
                  })
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
