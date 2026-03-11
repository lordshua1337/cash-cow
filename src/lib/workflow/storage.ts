// localStorage wrapper for workflow wizard state

import type { WorkflowState } from './state'
import { INITIAL_WORKFLOW_STATE } from './state'

const STORAGE_KEY = 'cashcow-workflow'

export function getWorkflowState(): WorkflowState {
  if (typeof window === 'undefined') return INITIAL_WORKFLOW_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_WORKFLOW_STATE
    return JSON.parse(raw) as WorkflowState
  } catch {
    return INITIAL_WORKFLOW_STATE
  }
}

export function saveWorkflowState(state: WorkflowState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearWorkflowState(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
