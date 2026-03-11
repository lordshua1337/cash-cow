// localStorage wrapper for saved products

import type { TrendingProduct } from './types'

const STORAGE_KEY = 'cashcow-favorites'

function readStore(): TrendingProduct[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as TrendingProduct[]
  } catch {
    return []
  }
}

function writeStore(items: TrendingProduct[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getFavorites(): TrendingProduct[] {
  return readStore()
}

export function addFavorite(product: TrendingProduct): TrendingProduct[] {
  const current = readStore()
  if (current.some((p) => p.id === product.id)) return current
  const updated = [...current, product]
  writeStore(updated)
  return updated
}

export function removeFavorite(id: string): TrendingProduct[] {
  const current = readStore()
  const updated = current.filter((p) => p.id !== id)
  writeStore(updated)
  return updated
}

export function isFavorite(id: string): boolean {
  return readStore().some((p) => p.id === id)
}

export function getFavoriteById(id: string): TrendingProduct | undefined {
  return readStore().find((p) => p.id === id)
}
