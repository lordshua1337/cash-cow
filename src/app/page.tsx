'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Loader2, TrendingUp, RefreshCw } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import type { TrendingProduct, TrendSource } from '@/lib/types'
import { getFavorites, addFavorite, removeFavorite, isFavorite } from '@/lib/favorites'

type SourceTab = 'all' | TrendSource

export default function BrowsePage() {
  const [products, setProducts] = useState<TrendingProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSource, setActiveSource] = useState<SourceTab>('all')
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [fetchedAt, setFetchedAt] = useState('')

  const syncSavedIds = useCallback(() => {
    const favs = getFavorites()
    setSavedIds(new Set(favs.map((f) => f.id)))
  }, [])

  const fetchProducts = useCallback(async (source: SourceTab, query: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (source !== 'all') params.set('source', source)
      if (query.trim()) params.set('q', query.trim())

      const res = await fetch(`/api/trends/live?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()
      setProducts(data.products || [])
      setFetchedAt(data.fetchedAt || '')
    } catch (err) {
      console.error('Fetch error:', err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    syncSavedIds()
    fetchProducts('all', '')
  }, [syncSavedIds, fetchProducts])

  function handleSourceChange(source: SourceTab) {
    setActiveSource(source)
    fetchProducts(source, searchQuery)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    fetchProducts(activeSource, searchQuery)
  }

  function handleToggleSave(product: TrendingProduct) {
    if (isFavorite(product.id)) {
      removeFavorite(product.id)
    } else {
      addFavorite(product)
    }
    syncSavedIds()
  }

  const SOURCE_TABS: { key: SourceTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'hackernews', label: 'Hacker News' },
    { key: 'github', label: 'GitHub' },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Hero header */}
      <div className="cow-spots px-4 sm:px-6 pt-8 pb-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div
            className="animate-in inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{
              background: 'var(--gold-soft)',
              color: 'var(--gold)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}
          >
            <TrendingUp size={12} />
            Live from Hacker News + GitHub
          </div>

          <h1
            className="animate-in text-3xl sm:text-4xl font-bold mb-2"
            style={{
              fontFamily: 'var(--font-fredoka), sans-serif',
              animationDelay: '0.05s',
            }}
          >
            What&apos;s trending <span style={{ color: 'var(--cash)' }}>right now</span>
          </h1>
          <p
            className="animate-in text-sm sm:text-base mb-6"
            style={{ color: 'var(--brown-muted)', animationDelay: '0.1s' }}
          >
            Save anything that catches your eye. Build a spec for it when you&apos;re ready.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="animate-in max-w-lg mx-auto" style={{ animationDelay: '0.15s' }}>
            <div
              className="flex items-center gap-2 rounded-2xl px-4 py-3"
              style={{
                background: 'var(--white)',
                border: '2px solid var(--spot-gray)',
                boxShadow: '0 4px 20px rgba(41, 37, 36, 0.06)',
              }}
            >
              <Search size={18} style={{ color: 'var(--brown-faint)', flexShrink: 0 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: 'var(--brown)' }}
              />
              <button
                type="submit"
                className="btn-bounce px-4 py-1.5 rounded-xl text-xs font-bold"
                style={{ background: 'var(--cash)', color: '#fff' }}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Source tabs */}
      <div className="px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-2 flex-wrap">
          {SOURCE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleSourceChange(tab.key)}
              className="btn-bounce px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              style={{
                background: activeSource === tab.key ? 'var(--spot-black)' : 'var(--white)',
                color: activeSource === tab.key ? 'var(--cream)' : 'var(--brown-muted)',
                border: `2px solid ${activeSource === tab.key ? 'var(--spot-black)' : 'var(--spot-gray)'}`,
              }}
            >
              {tab.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            {fetchedAt && (
              <span className="text-xs" style={{ color: 'var(--brown-faint)' }}>
                Updated {new Date(fetchedAt).toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => fetchProducts(activeSource, searchQuery)}
              className="p-2 rounded-xl transition-colors"
              style={{ color: 'var(--brown-faint)' }}
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {savedIds.size > 0 && (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'var(--cash-soft)', color: 'var(--cash)' }}
            >
              {savedIds.size} saved
            </span>
          )}
        </div>
      </div>

      {/* Product grid */}
      <div className="px-4 sm:px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2
                size={32}
                className="animate-spin"
                style={{ color: 'var(--cash)' }}
              />
              <p className="text-sm" style={{ color: 'var(--brown-muted)' }}>
                Fetching trending products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                No products found
              </p>
              <p className="text-sm" style={{ color: 'var(--brown-muted)' }}>
                Try a different search or filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSaved={savedIds.has(product.id)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
