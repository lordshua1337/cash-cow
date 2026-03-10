// Workflow state management -- persists across steps via localStorage

import type { MarketSnapshot, Calf } from '@/lib/types'

export interface GapOpportunity {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly whyItMatters: string
  readonly complaintsAddressed: readonly string[]
  readonly competitorWeaknesses: readonly string[]
  readonly feasibilityScore: number
  readonly revenueScore: number
  readonly differentiationScore: number
}

export interface WorkflowState {
  readonly step: number
  readonly niche: string
  readonly selectedTrendName: string
  readonly snapshot: MarketSnapshot | null
  readonly gaps: readonly GapOpportunity[]
  readonly selectedGap: GapOpportunity | null
  readonly spec: string
  readonly specProductName: string
}

const STORAGE_KEY = 'cashcow_workflow'

const INITIAL_STATE: WorkflowState = {
  step: 1,
  niche: '',
  selectedTrendName: '',
  snapshot: null,
  gaps: [],
  selectedGap: null,
  spec: '',
  specProductName: '',
}

export function loadWorkflow(): WorkflowState {
  if (typeof window === 'undefined') return INITIAL_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_STATE
    return { ...INITIAL_STATE, ...JSON.parse(raw) }
  } catch {
    return INITIAL_STATE
  }
}

export function saveWorkflow(state: WorkflowState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function updateWorkflow(updates: Partial<WorkflowState>): WorkflowState {
  const current = loadWorkflow()
  const next = { ...current, ...updates }
  saveWorkflow(next)
  return next
}

export function resetWorkflow(): WorkflowState {
  saveWorkflow(INITIAL_STATE)
  return INITIAL_STATE
}
