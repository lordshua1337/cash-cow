'use client'

import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from 'react'
import type { TrendingMonetizableProduct } from '@/lib/sources/types'
import type { BuildSpec } from '@/lib/types'
import type { WorkflowState, WorkflowStep, CustomizeSubStep } from './state'
import { INITIAL_WORKFLOW_STATE } from './state'
import { getWorkflowState, saveWorkflowState, clearWorkflowState } from './storage'

interface WorkflowContextValue {
  readonly state: WorkflowState
  readonly selectProduct: (product: TrendingMonetizableProduct) => void
  readonly setAudience: (audience: string) => void
  readonly setDifferentiator: (diff: string) => void
  readonly toggleFeature: (feature: string) => void
  readonly setCustomFeatures: (features: string) => void
  readonly setTechPrefs: (prefs: 'simple' | 'custom') => void
  readonly setSpec: (spec: BuildSpec) => void
  readonly setStep: (step: WorkflowStep) => void
  readonly setSubStep: (subStep: CustomizeSubStep) => void
  readonly reset: () => void
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null)

export function WorkflowProvider({ children }: { readonly children: ReactNode }) {
  const [state, setState] = useState<WorkflowState>(INITIAL_WORKFLOW_STATE)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    setState(getWorkflowState())
    setHydrated(true)
  }, [])

  // Persist to localStorage on every state change (after hydration)
  useEffect(() => {
    if (hydrated) {
      saveWorkflowState(state)
    }
  }, [state, hydrated])

  const update = useCallback((partial: Partial<WorkflowState>) => {
    setState((prev) => ({ ...prev, ...partial }))
  }, [])

  const selectProduct = useCallback((product: TrendingMonetizableProduct) => {
    update({ selectedProduct: product })
  }, [update])

  const setAudience = useCallback((audience: string) => {
    update({ audience })
  }, [update])

  const setDifferentiator = useCallback((differentiator: string) => {
    update({ differentiator })
  }, [update])

  const toggleFeature = useCallback((feature: string) => {
    setState((prev) => {
      const has = prev.features.includes(feature)
      const features = has
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature]
      return { ...prev, features }
    })
  }, [])

  const setCustomFeatures = useCallback((customFeatures: string) => {
    update({ customFeatures })
  }, [update])

  const setTechPrefs = useCallback((techPrefs: 'simple' | 'custom') => {
    update({ techPrefs })
  }, [update])

  const setSpec = useCallback((spec: BuildSpec) => {
    update({ spec })
  }, [update])

  const setStep = useCallback((currentStep: WorkflowStep) => {
    update({ currentStep })
  }, [update])

  const setSubStep = useCallback((customizeSubStep: CustomizeSubStep) => {
    update({ customizeSubStep })
  }, [update])

  const reset = useCallback(() => {
    clearWorkflowState()
    setState(INITIAL_WORKFLOW_STATE)
  }, [])

  return (
    <WorkflowContext.Provider
      value={{
        state,
        selectProduct,
        setAudience,
        setDifferentiator,
        toggleFeature,
        setCustomFeatures,
        setTechPrefs,
        setSpec,
        setStep,
        setSubStep,
        reset,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}

export function useWorkflow(): WorkflowContextValue {
  const ctx = useContext(WorkflowContext)
  if (!ctx) throw new Error('useWorkflow must be used within WorkflowProvider')
  return ctx
}
