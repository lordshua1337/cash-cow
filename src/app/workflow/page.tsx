'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Stepper from '@/components/workflow/Stepper'
import StepDiscover from '@/components/workflow/StepDiscover'
import StepResearch from '@/components/workflow/StepResearch'
import StepGap from '@/components/workflow/StepGap'
import StepSpec from '@/components/workflow/StepSpec'
import StepShip from '@/components/workflow/StepShip'
import { loadWorkflow, updateWorkflow, resetWorkflow, type WorkflowState } from '@/lib/workflow-state'
import { ArrowLeft, RotateCcw } from 'lucide-react'

export default function WorkflowPage() {
  const [state, setState] = useState<WorkflowState | null>(null)

  useEffect(() => {
    setState(loadWorkflow())
  }, [])

  const goTo = useCallback((step: number, updates?: Partial<WorkflowState>) => {
    setState((prev) => {
      if (!prev) return prev
      const next = updateWorkflow({ ...updates, step })
      return next
    })
  }, [])

  const handleReset = useCallback(() => {
    const fresh = resetWorkflow()
    setState(fresh)
  }, [])

  if (!state) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--cream)' }}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">🐄</div>
          <div className="text-sm font-bold" style={{ color: 'var(--brown-muted)' }}>
            Grazing the pasture...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--cream)', color: 'var(--brown)' }} className="min-h-screen">
      {/* Top bar */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '2px solid var(--spot-gray)' }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold"
          style={{ color: 'var(--brown-muted)' }}
        >
          <ArrowLeft size={16} />
          <span className="text-lg" style={{ fontFamily: 'var(--font-fredoka), sans-serif', color: 'var(--brown)' }}>
            🐄 Cash Cow
          </span>
        </Link>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
          style={{ color: 'var(--brown-faint)', background: 'var(--white)', border: '1px solid var(--spot-gray)' }}
        >
          <RotateCcw size={12} />
          Start Over
        </button>
      </div>

      {/* Stepper */}
      <div className="px-6 py-4" style={{ background: 'var(--white)', borderBottom: '2px solid var(--spot-gray)' }}>
        <Stepper
          current={state.step}
          onStepClick={(step) => goTo(step)}
        />
      </div>

      {/* Step content */}
      <div className="px-6 py-8 max-w-4xl mx-auto">
        {state.step === 1 && (
          <StepDiscover
            state={state}
            onNext={(niche, trendName) => goTo(2, { niche, selectedTrendName: trendName })}
          />
        )}
        {state.step === 2 && (
          <StepResearch
            state={state}
            onNext={(snapshot) => goTo(3, { snapshot })}
            onBack={() => goTo(1)}
          />
        )}
        {state.step === 3 && (
          <StepGap
            state={state}
            onNext={(gaps, selectedGap) => goTo(4, { gaps, selectedGap })}
            onBack={() => goTo(2)}
          />
        )}
        {state.step === 4 && (
          <StepSpec
            state={state}
            onNext={(spec, productName) => goTo(5, { spec, specProductName: productName })}
            onBack={() => goTo(3)}
          />
        )}
        {state.step === 5 && (
          <StepShip
            state={state}
            onBack={() => goTo(4)}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  )
}
