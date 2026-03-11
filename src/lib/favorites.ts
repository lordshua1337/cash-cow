// localStorage wrapper for saved ideas and cached specs

import type { ProductIdea, BuildSpec } from './types'

const IDEAS_KEY = 'cashcow-favorites'
const SPECS_KEY = 'cashcow-specs'

// -- Ideas --

function readIdeas(): ProductIdea[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(IDEAS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ProductIdea[]
  } catch {
    return []
  }
}

function writeIdeas(items: ProductIdea[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(IDEAS_KEY, JSON.stringify(items))
}

export function getFavorites(): ProductIdea[] {
  return readIdeas()
}

export function addFavorite(idea: ProductIdea): ProductIdea[] {
  const current = readIdeas()
  if (current.some((p) => p.id === idea.id)) return current
  const updated = [...current, idea]
  writeIdeas(updated)
  return updated
}

export function removeFavorite(id: string): ProductIdea[] {
  const current = readIdeas()
  const updated = current.filter((p) => p.id !== id)
  writeIdeas(updated)
  return updated
}

export function isFavorite(id: string): boolean {
  return readIdeas().some((p) => p.id === id)
}

export function getFavoriteById(id: string): ProductIdea | undefined {
  return readIdeas().find((p) => p.id === id)
}

// -- Cached Specs --

function readSpecs(): Record<string, BuildSpec> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(SPECS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, BuildSpec>
  } catch {
    return {}
  }
}

function writeSpecs(specs: Record<string, BuildSpec>): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SPECS_KEY, JSON.stringify(specs))
}

export function getCachedSpec(ideaId: string): BuildSpec | undefined {
  return readSpecs()[ideaId]
}

export function cacheSpec(ideaId: string, spec: BuildSpec): void {
  const current = readSpecs()
  writeSpecs({ ...current, [ideaId]: spec })
}

export function removeCachedSpec(id: string): void {
  const current = readSpecs()
  const { [id]: _, ...rest } = current
  writeSpecs(rest)
}

// -- Temporary idea storage for passing between pages --

const TEMP_IDEA_KEY = 'cashcow-temp-idea'

export function storeTempIdea(idea: ProductIdea): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TEMP_IDEA_KEY, JSON.stringify(idea))
}

export function getTempIdea(): ProductIdea | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(TEMP_IDEA_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ProductIdea
  } catch {
    return null
  }
}
