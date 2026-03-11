'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Wand2, Blocks } from 'lucide-react'
import { useWorkflow } from '@/lib/workflow/context'
import type { CustomizeSubStep } from '@/lib/workflow/state'
import { SUGGESTED_FEATURES } from '@/lib/workflow/state'
import StepProgress from '@/components/StepProgress'

const SUB_STEPS: CustomizeSubStep[] = ['audience', 'differentiator', 'features', 'tech']
const SUB_STEP_INDEX: Record<CustomizeSubStep, number> = {
  audience: 0,
  differentiator: 1,
  features: 2,
  tech: 3,
}

export default function CustomizePage() {
  const router = useRouter()
  const {
    state,
    setStep,
    setSubStep,
    setAudience,
    setDifferentiator,
    toggleFeature,
    setCustomFeatures,
    setTechPrefs,
  } = useWorkflow()

  useEffect(() => {
    setStep(2)
  }, [setStep])

  // Guard: must have selected a product
  useEffect(() => {
    if (!state.selectedProduct) {
      router.push('/workflow')
    }
  }, [state.selectedProduct, router])

  if (!state.selectedProduct) return null

  const currentIdx = SUB_STEP_INDEX[state.customizeSubStep]

  function goBack() {
    if (currentIdx === 0) {
      router.push('/workflow')
    } else {
      setSubStep(SUB_STEPS[currentIdx - 1])
    }
  }

  function goNext() {
    if (currentIdx === SUB_STEPS.length - 1) {
      setStep(3)
      router.push('/workflow/spec')
    } else {
      setSubStep(SUB_STEPS[currentIdx + 1])
    }
  }

  function canContinue(): boolean {
    switch (state.customizeSubStep) {
      case 'audience':
        return state.audience.trim().length > 0
      case 'differentiator':
        return true // optional
      case 'features':
        return true // optional, suggestions pre-checked
      case 'tech':
        return true // always valid
    }
  }

  const features = SUGGESTED_FEATURES.default

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="px-4 sm:px-6 pt-6 pb-16">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <StepProgress current={2} />
          </div>

          {/* Inspiration context */}
          <div
            className="animate-in flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
            style={{
              background: 'var(--white)',
              border: '1.5px solid rgba(45, 35, 25, 0.06)',
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold"
              style={{
                background: 'var(--cash-soft)',
                color: 'var(--cash)',
                fontFamily: 'var(--font-fredoka), sans-serif',
              }}
            >
              {state.selectedProduct.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold" style={{ color: 'var(--brown-faint)' }}>
                Inspired by
              </p>
              <p className="text-sm font-bold truncate">{state.selectedProduct.name}</p>
            </div>
          </div>

          {/* Sub-step dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {SUB_STEPS.map((s, i) => (
              <div
                key={s}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background: i === currentIdx
                    ? 'var(--cash)'
                    : i < currentIdx
                      ? 'var(--cash-dark)'
                      : 'var(--cream-dark)',
                  width: i === currentIdx ? 20 : 8,
                }}
              />
            ))}
          </div>

          {/* Question card */}
          <div className="animate-in card rounded-2xl p-6 sm:p-8">
            {state.customizeSubStep === 'audience' && (
              <div>
                <h2
                  className="text-2xl sm:text-3xl font-black mb-2 tracking-tight"
                  style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  Who are you building this for?
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--brown-muted)' }}>
                  Be specific. &quot;Freelance designers who hate invoicing&quot; is better than &quot;small businesses.&quot;
                </p>
                <textarea
                  value={state.audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder={`e.g. "Solo founders who want to validate ideas before writing code" or "Content creators who need analytics across platforms"`}
                  className="w-full bg-transparent outline-none text-base resize-none rounded-xl px-4 py-3"
                  style={{
                    color: 'var(--brown)',
                    background: 'var(--cream)',
                    border: '1.5px solid rgba(45, 35, 25, 0.08)',
                    minHeight: '120px',
                  }}
                  rows={4}
                />
              </div>
            )}

            {state.customizeSubStep === 'differentiator' && (
              <div>
                <h2
                  className="text-2xl sm:text-3xl font-black mb-2 tracking-tight"
                  style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  What makes yours different?
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--brown-muted)' }}>
                  {state.selectedProduct.name} does &quot;{state.selectedProduct.tagline.toLowerCase()}&quot; -- what&apos;s YOUR angle?
                </p>
                <textarea
                  value={state.differentiator}
                  onChange={(e) => setDifferentiator(e.target.value)}
                  placeholder={`e.g. "Mine focuses on ${state.audience || 'my audience'} instead of general users" or "Mine is AI-powered and 10x simpler"`}
                  className="w-full bg-transparent outline-none text-base resize-none rounded-xl px-4 py-3"
                  style={{
                    color: 'var(--brown)',
                    background: 'var(--cream)',
                    border: '1.5px solid rgba(45, 35, 25, 0.08)',
                    minHeight: '120px',
                  }}
                  rows={4}
                />
                <p className="text-xs mt-3" style={{ color: 'var(--brown-faint)' }}>
                  Skip this if you&apos;re not sure yet -- the AI will suggest a unique angle.
                </p>
              </div>
            )}

            {state.customizeSubStep === 'features' && (
              <div>
                <h2
                  className="text-2xl sm:text-3xl font-black mb-2 tracking-tight"
                  style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  What features matter most?
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--brown-muted)' }}>
                  Pick the essentials for your MVP. You can always add more later.
                </p>
                <div className="space-y-2 mb-6">
                  {features.map((feature) => {
                    const isSelected = state.features.includes(feature)
                    return (
                      <button
                        key={feature}
                        onClick={() => toggleFeature(feature)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-bold transition-all"
                        style={{
                          background: isSelected ? 'var(--cash-soft)' : 'var(--cream)',
                          border: `1.5px solid ${isSelected ? 'var(--cash)' : 'rgba(45, 35, 25, 0.06)'}`,
                          color: isSelected ? 'var(--cash-dark)' : 'var(--brown-light)',
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isSelected ? 'var(--cash)' : 'var(--white)',
                            border: isSelected ? 'none' : '1.5px solid rgba(45, 35, 25, 0.12)',
                          }}
                        >
                          {isSelected && <Check size={12} color="#fff" strokeWidth={3} />}
                        </div>
                        {feature}
                      </button>
                    )
                  })}
                </div>
                <div>
                  <p className="text-xs font-bold mb-2" style={{ color: 'var(--brown-muted)' }}>
                    Anything else?
                  </p>
                  <textarea
                    value={state.customFeatures}
                    onChange={(e) => setCustomFeatures(e.target.value)}
                    placeholder="Add custom features, one per line..."
                    className="w-full bg-transparent outline-none text-sm resize-none rounded-xl px-4 py-3"
                    style={{
                      color: 'var(--brown)',
                      background: 'var(--cream)',
                      border: '1.5px solid rgba(45, 35, 25, 0.08)',
                      minHeight: '80px',
                    }}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {state.customizeSubStep === 'tech' && (
              <div>
                <h2
                  className="text-2xl sm:text-3xl font-black mb-2 tracking-tight"
                  style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  Any tech preferences?
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--brown-muted)' }}>
                  This affects what stack your build plan will use.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setTechPrefs('simple')}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl text-center transition-all"
                    style={{
                      background: state.techPrefs === 'simple' ? 'var(--cash-soft)' : 'var(--cream)',
                      border: `2px solid ${state.techPrefs === 'simple' ? 'var(--cash)' : 'rgba(45, 35, 25, 0.06)'}`,
                    }}
                  >
                    <Blocks
                      size={28}
                      style={{
                        color: state.techPrefs === 'simple' ? 'var(--cash)' : 'var(--brown-faint)',
                      }}
                    />
                    <div>
                      <p className="text-base font-bold mb-1" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                        Simple Stack
                      </p>
                      <p className="text-xs" style={{ color: 'var(--brown-muted)' }}>
                        Next.js + Supabase + Tailwind + Vercel. Battle-tested, fast to ship.
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => setTechPrefs('custom')}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl text-center transition-all"
                    style={{
                      background: state.techPrefs === 'custom' ? 'var(--cash-soft)' : 'var(--cream)',
                      border: `2px solid ${state.techPrefs === 'custom' ? 'var(--cash)' : 'rgba(45, 35, 25, 0.06)'}`,
                    }}
                  >
                    <Wand2
                      size={28}
                      style={{
                        color: state.techPrefs === 'custom' ? 'var(--cash)' : 'var(--brown-faint)',
                      }}
                    />
                    <div>
                      <p className="text-base font-bold mb-1" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                        Best Fit
                      </p>
                      <p className="text-xs" style={{ color: 'var(--brown-muted)' }}>
                        Let the AI pick the optimal stack for your specific product.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={goBack}
              className="btn-hover inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold"
              style={{ color: 'var(--brown-muted)' }}
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <button
              onClick={goNext}
              disabled={!canContinue()}
              className="btn-hover inline-flex items-center gap-1.5 px-6 py-3 rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: canContinue() ? 'var(--cash)' : 'var(--cream-dark)',
                color: canContinue() ? '#fff' : 'var(--brown-faint)',
                boxShadow: canContinue() ? '0 4px 14px rgba(34, 197, 94, 0.25)' : 'none',
              }}
            >
              {currentIdx === SUB_STEPS.length - 1 ? 'Generate Spec' : 'Continue'}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
