'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Search } from 'lucide-react'
import { useWorkflow } from '@/lib/workflow/context'
import type { TrendingMonetizableProduct, ProductCategory } from '@/lib/sources/types'
import { CATEGORY_LABELS } from '@/lib/sources/types'
import ProductCard from '@/components/ProductCard'
import StepProgress from '@/components/StepProgress'

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategory[]

export default function DiscoverPage() {
  const router = useRouter()
  const { state, selectProduct, setStep } = useWorkflow()

  const [products, setProducts] = useState<TrendingMonetizableProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<ProductCategory>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setStep(1)
  }, [setStep])

  useEffect(() => {
    fetch('/api/discover')
      .then((r) => r.json())
      .then((d) => {
        if (d?.products?.length) setProducts(d.products)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleSelect(product: TrendingMonetizableProduct) {
    selectProduct(product)
  }

  function handleContinue() {
    if (!state.selectedProduct) return
    setStep(2)
    router.push('/workflow/customize')
  }

  const filtered = products.filter((p) => {
    const matchesCategory =
      category === 'all' ||
      p.topics.some((t) => t.toLowerCase().includes(category.replace('-', ' '))) ||
      p.revenueSignal.toLowerCase().includes(category)

    const matchesSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tagline.toLowerCase().includes(search.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="px-4 sm:px-6 pt-6 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <StepProgress current={1} />
          </div>

          {/* Header */}
          <div className="animate-in text-center mb-8">
            <h1
              className="text-3xl sm:text-4xl font-black mb-2 tracking-tight"
              style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
            >
              Pick your inspiration
            </h1>
            <p className="text-sm sm:text-base max-w-lg mx-auto" style={{ color: 'var(--brown-muted)' }}>
              These are real products people pay for. Pick one as your starting point -- you&apos;ll make it your own in the next step.
            </p>
          </div>

          {/* Search + Filters */}
          <div className="animate-in mb-6 space-y-3" style={{ animationDelay: '0.05s' }}>
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{
                background: 'var(--white)',
                border: '1.5px solid rgba(45, 35, 25, 0.06)',
              }}
            >
              <Search size={16} style={{ color: 'var(--brown-faint)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: 'var(--brown)' }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: category === cat ? 'var(--cash)' : 'var(--white)',
                    color: category === cat ? '#fff' : 'var(--brown-muted)',
                    border: `1.5px solid ${category === cat ? 'var(--cash)' : 'rgba(45, 35, 25, 0.06)'}`,
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <Loader2 size={32} className="animate-spin mx-auto mb-3" style={{ color: 'var(--cash)' }} />
              <p className="text-sm font-bold" style={{ color: 'var(--brown-muted)' }}>
                Loading trending products...
              </p>
            </div>
          )}

          {/* Products grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-in"
                  style={{ animationDelay: `${0.03 * Math.min(i, 12)}s` }}
                >
                  <ProductCard
                    product={product}
                    selected={state.selectedProduct?.id === product.id}
                    onSelect={handleSelect}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                No matches
              </p>
              <p className="text-sm" style={{ color: 'var(--brown-muted)' }}>
                Try a different category or clear your search.
              </p>
            </div>
          )}

          {/* Floating continue button */}
          {state.selectedProduct && (
            <div
              className="fixed bottom-0 left-0 right-0 p-4 z-50"
              style={{
                background: 'linear-gradient(to top, var(--cream) 60%, transparent)',
              }}
            >
              <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
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
                  <span className="text-sm font-bold truncate" style={{ color: 'var(--brown)' }}>
                    {state.selectedProduct.name}
                  </span>
                </div>
                <button
                  onClick={handleContinue}
                  className="btn-hover px-6 py-3 rounded-xl text-sm font-bold flex-shrink-0"
                  style={{
                    background: 'var(--cash)',
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
