import type { CalfStatus } from './types'

const STORAGE_KEY = 'cash-cow-state'

export interface CalfOverride {
  readonly status?: CalfStatus
  readonly monthlyRevenue?: number
  readonly notes?: string
}

export interface AppState {
  readonly overrides: Record<string, CalfOverride>
  readonly savedNiches: readonly string[]
}

function getDefaultState(): AppState {
  return {
    overrides: {},
    savedNiches: [],
  }
}

export function loadState(): AppState {
  if (typeof window === 'undefined') return getDefaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultState()
    return JSON.parse(raw) as AppState
  } catch {
    return getDefaultState()
  }
}

function saveState(state: AppState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function updateCalfStatus(calfId: string, status: CalfStatus): AppState {
  const state = loadState()
  const existing = state.overrides[calfId] ?? {}
  const newState: AppState = {
    ...state,
    overrides: {
      ...state.overrides,
      [calfId]: { ...existing, status },
    },
  }
  saveState(newState)
  return newState
}

export function updateCalfRevenue(calfId: string, monthlyRevenue: number): AppState {
  const state = loadState()
  const existing = state.overrides[calfId] ?? {}
  const newState: AppState = {
    ...state,
    overrides: {
      ...state.overrides,
      [calfId]: { ...existing, monthlyRevenue },
    },
  }
  saveState(newState)
  return newState
}

export function updateCalfNotes(calfId: string, notes: string): AppState {
  const state = loadState()
  const existing = state.overrides[calfId] ?? {}
  const newState: AppState = {
    ...state,
    overrides: {
      ...state.overrides,
      [calfId]: { ...existing, notes },
    },
  }
  saveState(newState)
  return newState
}

export function addSavedNiche(niche: string): AppState {
  const state = loadState()
  if (state.savedNiches.includes(niche)) return state
  const newState: AppState = {
    ...state,
    savedNiches: [...state.savedNiches, niche],
  }
  saveState(newState)
  return newState
}

export function getCalfOverride(calfId: string): CalfOverride | undefined {
  const state = loadState()
  return state.overrides[calfId]
}
