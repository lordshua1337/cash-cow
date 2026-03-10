'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Loader2, Zap, Shield, DollarSign, Check } from 'lucide-react'
import type { WorkflowState, GapOpportunity } from '@/lib/workflow-state'

interface StepGapProps {
  readonly state: WorkflowState
  readonly onNext: (gaps: readonly GapOpportunity[], selected: GapOpportunity) => void
  readonly onBack: () => void
}

export default function StepGap({ state, onNext, onBack }: StepGapProps) {
  const [gaps, setGaps] = useState<GapOpportunity[]>(state.gaps as GapOpportunity[] || [])
  const [selected, setSelected] = useState<GapOpportunity | null>(state.selectedGap)
  const [loading, setLoading] = useState(state.gaps.length === 0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (state.gaps.length === 0 && state.snapshot) {
      analyzeGaps()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function analyzeGaps() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshot: state.snapshot }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Gap analysis failed')
      }
      const data = await res.json()
      setGaps(data.gaps || [])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gap analysis failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 size={40} className="animate-spin mx-auto mb-4" style={{ color: 'var(--gold)' }} />
        <h3
          className="text-xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
        >
          Finding the gaps...
        </h3>
        <p className="text-sm" style={{ color: 'var(--brown-muted)' }}>
          AI is analyzing every competitor and complaint to find what nobody does well.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">🕳️</div>
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
          Couldn&apos;t find the gaps
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--brown-muted)' }}>{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onBack} className="btn-bounce px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: 'var(--white)', border: '2px solid var(--spot-gray)', color: 'var(--brown-muted)' }}>
            <ArrowLeft size={14} className="inline mr-1" /> Go Back
          </button>
          <button onClick={analyzeGaps} className="btn-bounce px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: 'var(--gold)', color: '#fff' }}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const totalScore = (g: GapOpportunity) => g.feasibilityScore + g.revenueScore + g.differentiationScore

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🎯</div>
        <h2
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
        >
          Here&apos;s where everyone drops the ball
        </h2>
        <p style={{ color: 'var(--brown-muted)' }}>
          Pick the gap you want to exploit. This becomes your product&apos;s superpower.
        </p>
      </div>

      <div className="grid gap-4 mb-8">
        {gaps.sort((a, b) => totalScore(b) - totalScore(a)).map((gap) => {
          const isSelected = selected?.id === gap.id
          return (
            <button
              key={gap.id}
              onClick={() => setSelected(gap)}
              className="card-lift text-left rounded-2xl p-5 transition-all"
              style={{
                background: isSelected ? 'var(--cash-soft)' : 'var(--white)',
                border: isSelected ? '3px solid var(--cash)' : '2px solid var(--spot-gray)',
                boxShadow: isSelected ? '0 4px 20px rgba(34, 197, 94, 0.15)' : undefined,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {isSelected && <Check size={16} style={{ color: 'var(--cash)' }} />}
                    <h3 className="font-bold text-lg">{gap.title}</h3>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--brown-muted)' }}>
                    {gap.description}
                  </p>
                </div>
              </div>

              <div
                className="text-sm mb-3 p-3 rounded-lg"
                style={{ background: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--cream)', color: 'var(--brown-light)' }}
              >
                <strong>Why it matters:</strong> {gap.whyItMatters}
              </div>

              {/* Scores */}
              <div className="flex gap-4 mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Zap size={12} style={{ color: 'var(--cash)' }} />
                  <span style={{ color: 'var(--brown-muted)' }}>Feasibility</span>
                  <span style={{ color: 'var(--cash)' }}>{gap.feasibilityScore}/10</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <DollarSign size={12} style={{ color: 'var(--gold)' }} />
                  <span style={{ color: 'var(--brown-muted)' }}>Revenue</span>
                  <span style={{ color: 'var(--gold)' }}>{gap.revenueScore}/10</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Shield size={12} style={{ color: 'var(--blue)' }} />
                  <span style={{ color: 'var(--brown-muted)' }}>Moat</span>
                  <span style={{ color: 'var(--blue)' }}>{gap.differentiationScore}/10</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {gap.complaintsAddressed.slice(0, 3).map((c, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded font-bold"
                    style={{ background: 'var(--gold-soft)', color: 'var(--gold)' }}
                  >
                    Fixes: {c}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6" style={{ borderTop: '2px solid var(--spot-gray)' }}>
        <button onClick={onBack} className="btn-bounce flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold" style={{ background: 'var(--white)', border: '2px solid var(--spot-gray)', color: 'var(--brown-muted)' }}>
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={() => selected && onNext(gaps, selected)}
          disabled={!selected}
          className="btn-bounce flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
          style={{
            background: selected ? 'var(--cash)' : 'var(--spot-gray)',
            color: selected ? '#fff' : 'var(--brown-faint)',
            boxShadow: selected ? '0 4px 14px rgba(34, 197, 94, 0.3)' : 'none',
          }}
        >
          Build My Spec <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
