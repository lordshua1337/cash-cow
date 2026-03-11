'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Lightbulb,
  UsersRound,
  Flame,
  Grid3x3,
  Code2,
  Map,
  Telescope,
  ShieldAlert,
  CircleDollarSign,
  Receipt,
  BarChart3,
  Megaphone,
  Pencil,
  Send,
  RefreshCw,
  X,
} from 'lucide-react'
import { useWorkflow } from '@/lib/workflow/context'
import type { BuildSpec } from '@/lib/types'
import StepProgress from '@/components/StepProgress'

type SectionKey =
  | 'whatYoureBuilding'
  | 'whoWantsThis'
  | 'whyThisCouldWork'
  | 'monetizationModel'
  | 'pricingStrategy'
  | 'revenueTimeline'
  | 'customerAcquisition'
  | 'coreFeatures'
  | 'techStack'
  | 'buildPlan'
  | 'v2Ideas'
  | 'risks'

const SECTION_META: Record<SectionKey, { title: string; icon: React.ElementType; color: string; hint: string }> = {
  whatYoureBuilding: { title: "What You're Building", icon: Lightbulb, color: 'var(--cash)', hint: 'e.g. "Make it a Chrome extension instead"' },
  whoWantsThis: { title: 'Who Wants This', icon: UsersRound, color: 'var(--gold)', hint: 'e.g. "Target teachers, not designers"' },
  whyThisCouldWork: { title: 'Why This Could Work', icon: Flame, color: 'var(--gold)', hint: 'e.g. "Focus more on the pricing angle"' },
  monetizationModel: { title: 'How It Makes Money', icon: CircleDollarSign, color: 'var(--cash-dark)', hint: 'e.g. "Make it usage-based instead of subscription"' },
  pricingStrategy: { title: 'Pricing Strategy', icon: Receipt, color: 'var(--gold)', hint: 'e.g. "Add a free tier" or "Make it $29/mo instead"' },
  revenueTimeline: { title: 'Revenue Timeline', icon: BarChart3, color: 'var(--cash)', hint: 'e.g. "Be more aggressive" or "Plan for slower growth"' },
  customerAcquisition: { title: 'Getting Customers', icon: Megaphone, color: 'var(--blue)', hint: 'e.g. "Focus on Twitter/X marketing instead"' },
  coreFeatures: { title: 'Core Features', icon: Grid3x3, color: 'var(--cash)', hint: 'e.g. "Add Stripe billing" or "Remove the chat feature"' },
  techStack: { title: 'Tech Stack', icon: Code2, color: 'var(--brown-muted)', hint: 'e.g. "Use Firebase instead of Supabase"' },
  buildPlan: { title: 'Build Plan', icon: Map, color: 'var(--cash-dark)', hint: 'e.g. "Make it simpler, fewer steps"' },
  v2Ideas: { title: 'What V2 Looks Like', icon: Telescope, color: 'var(--blue)', hint: 'e.g. "Add a mobile app for V2"' },
  risks: { title: 'Honest Risks', icon: ShieldAlert, color: 'var(--gold)', hint: 'e.g. "What about competitors like X?"' },
}

export default function SpecPage() {
  const router = useRouter()
  const { state, setSpec, setStep } = useWorkflow()
  const hasStarted = useRef(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [remixing, setRemixing] = useState(false)
  const [remixCount, setRemixCount] = useState(0)
  const [changedSections, setChangedSections] = useState<Set<SectionKey>>(new Set())
  const [activeRemixSection, setActiveRemixSection] = useState<SectionKey | null>(null)
  const [sectionRemixInput, setSectionRemixInput] = useState('')
  const [globalRemixInput, setGlobalRemixInput] = useState('')
  const [globalRemixFocused, setGlobalRemixFocused] = useState(false)

  const remixInputRef = useRef<HTMLTextAreaElement>(null)
  const globalInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setStep(3)
  }, [setStep])

  useEffect(() => {
    if (!state.selectedProduct) {
      router.push('/workflow')
    }
  }, [state.selectedProduct, router])

  const generateSpec = useCallback(async () => {
    if (!state.selectedProduct || hasStarted.current) return
    hasStarted.current = true
    setLoading(true)
    setError('')

    try {
      const allFeatures = [
        ...state.features,
        ...state.customFeatures
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
      ]

      const res = await fetch('/api/customize-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inspirationProduct: state.selectedProduct,
          audience: state.audience,
          differentiator: state.differentiator,
          features: allFeatures,
          techPrefs: state.techPrefs,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to generate spec')
      }

      const data = await res.json()
      setSpec(data.spec)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      hasStarted.current = false
    } finally {
      setLoading(false)
    }
  }, [state, setSpec])

  useEffect(() => {
    if (state.selectedProduct && !state.spec && !loading && !error) {
      generateSpec()
    }
  }, [state.selectedProduct, state.spec, loading, error, generateSpec])

  async function handleRemix(instruction: string, sectionHint?: string) {
    if (!state.spec || !instruction.trim()) return
    setRemixing(true)
    setError('')
    setChangedSections(new Set())

    try {
      const res = await fetch('/api/remix-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spec: state.spec, instruction, section: sectionHint }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to remix')
      }
      const data = await res.json()
      const newSpec = data.spec as BuildSpec

      const changed = new Set<SectionKey>()
      const keys = Object.keys(SECTION_META) as SectionKey[]
      for (const key of keys) {
        const oldVal = state.spec[key as keyof BuildSpec]
        const newVal = newSpec[key as keyof BuildSpec]
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          changed.add(key)
        }
      }

      setSpec(newSpec)
      setChangedSections(changed)
      setRemixCount((c) => c + 1)
      setActiveRemixSection(null)
      setSectionRemixInput('')
      setGlobalRemixInput('')
      setTimeout(() => setChangedSections(new Set()), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Remix failed')
    } finally {
      setRemixing(false)
    }
  }

  function handleSectionClick(key: SectionKey) {
    if (remixing) return
    if (activeRemixSection === key) {
      setActiveRemixSection(null)
      setSectionRemixInput('')
    } else {
      setActiveRemixSection(key)
      setSectionRemixInput('')
      setTimeout(() => remixInputRef.current?.focus(), 50)
    }
  }

  function handleSectionRemixSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!sectionRemixInput.trim() || !activeRemixSection) return
    handleRemix(sectionRemixInput, SECTION_META[activeRemixSection].title)
  }

  function handleGlobalRemixSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!globalRemixInput.trim()) return
    handleRemix(globalRemixInput)
  }

  function handleContinue() {
    setStep(4)
    router.push('/workflow/export')
  }

  if (!state.selectedProduct) return null

  const spec = state.spec

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="px-4 sm:px-6 pt-6 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <StepProgress current={3} />
          </div>

          {/* Back */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/workflow/customize')}
              className="inline-flex items-center gap-1.5 text-sm font-bold"
              style={{ color: 'var(--brown-muted)' }}
            >
              <ArrowLeft size={14} />
              Back
            </button>
            {remixCount > 0 && (
              <span
                className="remix-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'var(--cash-soft)', color: 'var(--cash-dark)' }}
              >
                <RefreshCw size={12} />
                {remixCount} remix{remixCount !== 1 ? 'es' : ''}
              </span>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="animate-in card rounded-2xl p-12 text-center">
              <Loader2 size={40} className="animate-spin mx-auto mb-4" style={{ color: 'var(--cash)' }} />
              <p className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                Building your monetization-focused spec...
              </p>
              <p className="text-sm mb-1" style={{ color: 'var(--brown-muted)' }}>
                Crafting pricing, revenue projections, and acquisition strategy.
              </p>
              <p className="text-xs" style={{ color: 'var(--brown-faint)' }}>
                About 15 seconds. You&apos;ll be able to remix every section.
              </p>

              <div className="mt-8 space-y-4 text-left">
                {['Monetization Model', 'Pricing Strategy', 'Core Features', 'Build Plan'].map((s) => (
                  <div key={s} className="rounded-xl p-4" style={{ background: 'var(--cream)', border: '1px solid rgba(45, 35, 25, 0.04)' }}>
                    <div className="h-3 w-32 rounded mb-3" style={{ background: 'rgba(45, 35, 25, 0.06)' }} />
                    <div className="space-y-2">
                      <div className="h-2.5 rounded" style={{ background: 'rgba(45, 35, 25, 0.06)', width: '90%' }} />
                      <div className="h-2.5 rounded" style={{ background: 'rgba(45, 35, 25, 0.06)', width: '70%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-2xl p-6 mb-5" style={{ background: 'var(--red-soft)', border: '1.5px solid rgba(239, 68, 68, 0.15)' }}>
              <p className="font-bold mb-1" style={{ color: 'var(--red)' }}>Something went wrong</p>
              <p className="text-sm mb-4" style={{ color: 'var(--brown-muted)' }}>{error}</p>
              <button
                onClick={() => { hasStarted.current = false; setError(''); generateSpec() }}
                className="btn-hover px-4 py-2 rounded-xl text-sm font-bold"
                style={{ background: 'var(--red)', color: '#fff' }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Spec display */}
          {spec && (
            <div className="space-y-3">
              {/* Global remix bar */}
              <div
                className={`animate-in card rounded-2xl p-4 ${globalRemixFocused || globalRemixInput ? 'remix-bar-active' : ''}`}
                style={{ borderColor: globalRemixFocused || globalRemixInput ? 'var(--cash)' : undefined }}
              >
                <form onSubmit={handleGlobalRemixSubmit}>
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw size={14} style={{ color: 'var(--cash)' }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--brown-muted)' }}>
                      Remix this spec
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <textarea
                      ref={globalInputRef}
                      value={globalRemixInput}
                      onChange={(e) => setGlobalRemixInput(e.target.value)}
                      onFocus={() => setGlobalRemixFocused(true)}
                      onBlur={() => setGlobalRemixFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleGlobalRemixSubmit(e)
                        }
                      }}
                      placeholder={`Tell me what to change... "Make it usage-based pricing" or "Target restaurant owners instead"`}
                      className="flex-1 bg-transparent outline-none text-sm resize-none"
                      style={{ color: 'var(--brown)', minHeight: '40px', maxHeight: '120px' }}
                      rows={1}
                      disabled={remixing}
                    />
                    <button
                      type="submit"
                      disabled={!globalRemixInput.trim() || remixing}
                      className="btn-hover self-end inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: globalRemixInput.trim() ? 'var(--cash)' : 'var(--cream-dark)',
                        color: globalRemixInput.trim() ? '#fff' : 'var(--brown-faint)',
                      }}
                    >
                      {remixing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      Remix
                    </button>
                  </div>
                </form>
              </div>

              {remixing && (
                <div className="flex items-center justify-center gap-2 py-2">
                  <span className="w-2 h-2 rounded-full pulse-dot-1" style={{ background: 'var(--cash)' }} />
                  <span className="w-2 h-2 rounded-full pulse-dot-2" style={{ background: 'var(--cash)' }} />
                  <span className="w-2 h-2 rounded-full pulse-dot-3" style={{ background: 'var(--cash)' }} />
                  <span className="text-sm font-bold ml-1" style={{ color: 'var(--cash)' }}>Remixing...</span>
                </div>
              )}

              {/* Spec header */}
              <div className="animate-in card rounded-2xl p-6">
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  {spec.productName}
                </h2>
                <p className="text-xs" style={{ color: 'var(--brown-faint)' }}>
                  Click any section to remix it, or use the bar above for big changes.
                </p>
              </div>

              {/* Sections */}
              {(Object.keys(SECTION_META) as SectionKey[]).map((key) => {
                const value = spec[key as keyof BuildSpec]
                if (!value) return null // skip missing monetization fields on old specs

                const meta = SECTION_META[key]
                const isActive = activeRemixSection === key
                const isChanged = changedSections.has(key)
                const Icon = meta.icon

                return (
                  <div
                    key={key}
                    className={`card rounded-2xl p-5 ${remixing ? 'remix-shimmer' : 'section-remixable'} ${isChanged ? 'remix-changed' : ''}`}
                    style={{
                      borderColor: isActive ? 'var(--cash)' : undefined,
                      boxShadow: isActive ? '0 4px 20px rgba(34, 197, 94, 0.06)' : undefined,
                    }}
                  >
                    <div
                      className="flex items-center gap-2 mb-3 cursor-pointer group"
                      onClick={() => handleSectionClick(key)}
                    >
                      <Icon size={16} style={{ color: meta.color }} />
                      <h3 className="text-sm font-bold uppercase tracking-wider flex-1" style={{ color: 'var(--brown-muted)' }}>
                        {meta.title}
                      </h3>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'var(--cash-soft)', color: 'var(--cash)' }}
                      >
                        <Pencil size={10} />
                        Remix
                      </span>
                    </div>

                    <SectionContent sectionKey={key} spec={spec} />

                    {isActive && (
                      <form onSubmit={handleSectionRemixSubmit} className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(45, 35, 25, 0.06)' }}>
                        <div className="flex gap-2">
                          <textarea
                            ref={remixInputRef}
                            value={sectionRemixInput}
                            onChange={(e) => setSectionRemixInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSectionRemixSubmit(e)
                              }
                            }}
                            placeholder={meta.hint}
                            className="remix-input flex-1 bg-transparent outline-none text-sm resize-none rounded-xl px-3 py-2"
                            style={{
                              color: 'var(--brown)',
                              background: 'var(--cream)',
                              border: '1px solid rgba(45, 35, 25, 0.06)',
                              minHeight: '40px',
                            }}
                            rows={2}
                            disabled={remixing}
                          />
                          <div className="flex flex-col gap-1.5 self-end">
                            <button
                              type="submit"
                              disabled={!sectionRemixInput.trim() || remixing}
                              className="btn-hover inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-40"
                              style={{ background: 'var(--cash)', color: '#fff' }}
                            >
                              {remixing ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                              Go
                            </button>
                            <button
                              type="button"
                              onClick={() => { setActiveRemixSection(null); setSectionRemixInput('') }}
                              className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs"
                              style={{ color: 'var(--brown-faint)' }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                )
              })}

              {/* Continue to export */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleContinue}
                  className="btn-hover inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
                  style={{
                    background: 'var(--cash)',
                    color: '#fff',
                    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.25)',
                  }}
                >
                  Looks good -- export
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Section content renderer
function SectionContent({ sectionKey, spec }: { readonly sectionKey: SectionKey; readonly spec: BuildSpec }) {
  switch (sectionKey) {
    case 'whatYoureBuilding':
    case 'whoWantsThis':
    case 'whyThisCouldWork':
    case 'monetizationModel':
    case 'pricingStrategy':
    case 'revenueTimeline':
    case 'customerAcquisition':
      return (
        <p className="text-sm leading-relaxed" style={{ color: 'var(--brown-light)' }}>
          {spec[sectionKey] as string}
        </p>
      )
    case 'coreFeatures':
      return (
        <ul className="space-y-2">
          {spec.coreFeatures.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--brown-light)' }}>
              <span className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: 'var(--cash-soft)', color: 'var(--cash)' }}>
                {i + 1}
              </span>
              {f}
            </li>
          ))}
        </ul>
      )
    case 'techStack':
      return (
        <div className="space-y-2">
          {spec.techStack.map((t, i) => (
            <div key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--brown-light)' }}>
              <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0" style={{ background: 'var(--cream-dark)', color: 'var(--brown)' }}>
                {t.tool}
              </span>
              <span className="pt-0.5" style={{ color: 'var(--brown-muted)' }}>{t.why}</span>
            </div>
          ))}
        </div>
      )
    case 'buildPlan':
      return (
        <ol className="space-y-3">
          {spec.buildPlan.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--brown-light)' }}>
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--cash-soft)', color: 'var(--cash-dark)' }}>
                {i + 1}
              </span>
              <span className="pt-0.5 leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      )
    case 'v2Ideas':
      return (
        <ul className="space-y-2">
          {spec.v2Ideas.map((v, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--brown-light)' }}>
              <span className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: 'var(--blue-soft)', color: 'var(--blue)' }}>
                {i + 1}
              </span>
              {v}
            </li>
          ))}
        </ul>
      )
    case 'risks':
      return (
        <ul className="space-y-2">
          {spec.risks.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--brown-light)' }}>
              <ShieldAlert size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
              {r}
            </li>
          ))}
        </ul>
      )
  }
}
