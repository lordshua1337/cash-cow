'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Loader2, Users, AlertTriangle, TrendingUp } from 'lucide-react'
import type { WorkflowState } from '@/lib/workflow-state'
import type { MarketSnapshot } from '@/lib/types'

interface StepResearchProps {
  readonly state: WorkflowState
  readonly onNext: (snapshot: MarketSnapshot) => void
  readonly onBack: () => void
}

export default function StepResearch({ state, onNext, onBack }: StepResearchProps) {
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(state.snapshot)
  const [loading, setLoading] = useState(!state.snapshot)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!state.snapshot && state.niche) {
      doResearch()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function doResearch() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: state.niche }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Research failed')
      }
      const data = await res.json()
      setSnapshot(data.snapshot)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Research failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 size={40} className="animate-spin mx-auto mb-4" style={{ color: 'var(--cash)' }} />
        <h3
          className="text-xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
        >
          Researching &quot;{state.niche}&quot;...
        </h3>
        <p className="text-sm" style={{ color: 'var(--brown-muted)' }}>
          Digging into competitors, products, and user complaints. This takes 15-30 seconds.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">🐄💨</div>
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
          Whoops, the cow tripped
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--brown-muted)' }}>{error}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onBack}
            className="btn-bounce px-5 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: 'var(--white)', border: '2px solid var(--spot-gray)', color: 'var(--brown-muted)' }}
          >
            <ArrowLeft size={14} className="inline mr-1" /> Go Back
          </button>
          <button
            onClick={doResearch}
            className="btn-bounce px-5 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: 'var(--cash)', color: '#fff' }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!snapshot) return null

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🔬</div>
        <h2
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
        >
          The &quot;{state.niche}&quot; Landscape
        </h2>
        <p style={{ color: 'var(--brown-muted)' }}>
          Here&apos;s who&apos;s competing and what people are saying
        </p>
      </div>

      {/* Competitors */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
          <Users size={20} style={{ color: 'var(--cash)' }} />
          Competitors ({snapshot.competitorLandscape.length})
        </h3>
        <div className="grid gap-3">
          {snapshot.competitorLandscape.map((comp, i) => (
            <div
              key={i}
              className="rounded-xl p-4"
              style={{ background: 'var(--white)', border: '2px solid var(--spot-gray)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-bold">{comp.company}</div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ background: 'var(--cash-soft)', color: 'var(--cash)' }}
                >
                  {comp.pricing}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {comp.keyFeatures.slice(0, 4).map((f, j) => (
                  <span
                    key={j}
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ background: 'var(--cream-dark)', color: 'var(--brown-muted)' }}
                  >
                    {f}
                  </span>
                ))}
              </div>
              {comp.complaints.length > 0 && (
                <div className="text-xs mt-2" style={{ color: 'var(--red)' }}>
                  <AlertTriangle size={10} className="inline mr-1" />
                  {comp.complaints[0]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Complaint Clusters */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
          <AlertTriangle size={20} style={{ color: 'var(--gold)' }} />
          What People Hate ({snapshot.reviewComplaintClusters.length} themes)
        </h3>
        <div className="grid gap-3">
          {snapshot.reviewComplaintClusters.map((cluster, i) => (
            <div
              key={i}
              className="rounded-xl p-4"
              style={{ background: 'var(--white)', border: '2px solid var(--spot-gray)', borderLeftWidth: 4, borderLeftColor: 'var(--gold)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold">{cluster.complaintTheme}</div>
                <span className="text-xs font-bold" style={{ color: 'var(--gold)' }}>
                  {cluster.frequency}% frequency
                </span>
              </div>
              {cluster.exampleQuotes.slice(0, 2).map((q, j) => (
                <div key={j} className="text-sm italic mt-1" style={{ color: 'var(--brown-muted)' }}>
                  &quot;{q}&quot;
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      {snapshot.trendingProducts.length > 0 && (
        <div className="mb-8">
          <h3 className="flex items-center gap-2 text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
            <TrendingUp size={20} style={{ color: 'var(--cash)' }} />
            Trending Products ({snapshot.trendingProducts.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {snapshot.trendingProducts.map((p, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-lg text-sm"
                style={{ background: 'var(--white)', border: '1px solid var(--spot-gray)' }}
              >
                <span className="font-bold">{p.name}</span>
                <span className="text-xs ml-2" style={{ color: 'var(--brown-faint)' }}>
                  {p.rating}/5 ({p.reviewCount} reviews)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-6" style={{ borderTop: '2px solid var(--spot-gray)' }}>
        <button
          onClick={onBack}
          className="btn-bounce flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold"
          style={{ background: 'var(--white)', border: '2px solid var(--spot-gray)', color: 'var(--brown-muted)' }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={() => onNext(snapshot)}
          className="btn-bounce flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
          style={{ background: 'var(--cash)', color: '#fff', boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)' }}
        >
          Find the Gap <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
