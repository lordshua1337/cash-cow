'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Loader2, FileText } from 'lucide-react'
import type { WorkflowState } from '@/lib/workflow-state'

interface StepSpecProps {
  readonly state: WorkflowState
  readonly onNext: (spec: string, productName: string) => void
  readonly onBack: () => void
}

export default function StepSpec({ state, onNext, onBack }: StepSpecProps) {
  const [spec, setSpec] = useState(state.spec || '')
  const [productName, setProductName] = useState(state.specProductName || '')
  const [loading, setLoading] = useState(!state.spec)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!state.spec && state.snapshot && state.selectedGap) {
      generateSpec()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function generateSpec() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          snapshot: state.snapshot,
          gap: state.selectedGap,
          niche: state.niche,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Spec generation failed')
      }
      const data = await res.json()
      setSpec(data.spec || '')
      setProductName(data.productName || 'Your Product')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Spec generation failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 size={40} className="animate-spin mx-auto mb-4" style={{ color: 'var(--blue)' }} />
        <h3
          className="text-xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
        >
          Building your spec...
        </h3>
        <p className="text-sm" style={{ color: 'var(--brown-muted)' }}>
          AI is writing features, database schema, API routes, pricing -- the whole blueprint. Takes about 30 seconds.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
          Spec hit a snag
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--brown-muted)' }}>{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onBack} className="btn-bounce px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: 'var(--white)', border: '2px solid var(--spot-gray)', color: 'var(--brown-muted)' }}>
            <ArrowLeft size={14} className="inline mr-1" /> Go Back
          </button>
          <button onClick={generateSpec} className="btn-bounce px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: 'var(--blue)', color: '#fff' }}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">📋</div>
        <h2
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
        >
          Your build spec is ready
        </h2>
        <p style={{ color: 'var(--brown-muted)' }}>
          Full blueprint for <strong>{productName}</strong> -- review it, then ship it
        </p>
      </div>

      {/* Spec preview */}
      <div
        className="rounded-2xl overflow-hidden mb-8"
        style={{ background: 'var(--white)', border: '2px solid var(--spot-gray)' }}
      >
        <div
          className="flex items-center gap-2 px-5 py-3"
          style={{ background: 'var(--spot-black)', color: 'var(--cream)' }}
        >
          <FileText size={16} />
          <span className="text-sm font-bold">{productName} -- Build Spec</span>
          <span className="text-xs ml-auto" style={{ color: 'var(--brown-faint)' }}>
            {spec.split('\n').length} lines
          </span>
        </div>
        <div
          className="p-6 overflow-y-auto text-sm leading-relaxed"
          style={{
            maxHeight: 500,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            whiteSpace: 'pre-wrap',
            color: 'var(--brown-light)',
          }}
        >
          {spec}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6" style={{ borderTop: '2px solid var(--spot-gray)' }}>
        <button onClick={onBack} className="btn-bounce flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold" style={{ background: 'var(--white)', border: '2px solid var(--spot-gray)', color: 'var(--brown-muted)' }}>
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={() => onNext(spec, productName)}
          className="btn-bounce flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
          style={{ background: 'var(--cash)', color: '#fff', boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)' }}
        >
          Ship It <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
