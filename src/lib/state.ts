import type { CalfStatus, Calf, MarketSnapshot } from './types'

const STORAGE_KEY = 'cash-cow-state'

export interface CalfOverride {
  readonly status?: CalfStatus
  readonly monthlyRevenue?: number
  readonly notes?: string
}

export interface AppState {
  readonly overrides: Record<string, CalfOverride>
  readonly savedNiches: readonly string[]
  readonly snapshots: readonly MarketSnapshot[]
  readonly calves: readonly Calf[]
}

function getDefaultState(): AppState {
  return {
    overrides: {},
    savedNiches: [],
    snapshots: [],
    calves: [],
  }
}

export function loadState(): AppState {
  if (typeof window === 'undefined') return getDefaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultState()
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      overrides: parsed.overrides ?? {},
      savedNiches: parsed.savedNiches ?? [],
      snapshots: parsed.snapshots ?? [],
      calves: parsed.calves ?? [],
    }
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

export function saveSnapshot(snapshot: MarketSnapshot): AppState {
  const state = loadState()
  const existing = state.snapshots.filter((s) => s.id !== snapshot.id)
  const newState: AppState = {
    ...state,
    snapshots: [...existing, snapshot],
  }
  saveState(newState)
  return newState
}

export function saveCalves(newCalves: readonly Calf[]): AppState {
  const state = loadState()
  const existingIds = new Set(newCalves.map((c) => c.id))
  const kept = state.calves.filter((c) => !existingIds.has(c.id))
  const newState: AppState = {
    ...state,
    calves: [...kept, ...newCalves],
  }
  saveState(newState)
  return newState
}

export function getSnapshots(): readonly MarketSnapshot[] {
  return loadState().snapshots
}

export function getCalves(): readonly Calf[] {
  return loadState().calves
}
