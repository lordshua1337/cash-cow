'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, RefreshCw } from 'lucide-react'
import IdeaCard from '@/components/IdeaCard'
import type { ProductIdea, IdeaCategory } from '@/lib/types'
import { storeTempIdea } from '@/lib/favorites'

const CATEGORIES: { key: IdeaCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ai-tools', label: 'AI Tools' },
  { key: 'productivity', label: 'Productivity' },
  { key: 'finance', label: 'Finance' },
  { key: 'health', label: 'Health' },
  { key: 'education', label: 'Education' },
  { key: 'marketing', label: 'Marketing' },
]

export default function IdeasPage() {
  const router = useRouter()
  const [ideas, setIdeas] = useState<ProductIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<IdeaCategory>('all')

  const fetchIdeas = useCallback(async (category: IdeaCategory) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== 'all') params.set('category', category)
      const res = await fetch(`/api/ideas?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch ideas')
      const data = await res.json()
      setIdeas(data.ideas || [])
    } catch (err) {
      console.error('Fetch error:', err)
      setIdeas([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIdeas('all')
  }, [fetchIdeas])

  function handleCategoryChange(category: IdeaCategory) {
    setActiveCategory(category)
    fetchIdeas(category)
  }

  function handleRemix(idea: ProductIdea) {
    storeTempIdea(idea)
    router.push(`/build/${idea.id}`)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <div className="px-4 sm:px-6 pt-8 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h1
                className="animate-in text-2xl sm:text-3xl font-bold mb-1"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                Fresh ideas
              </h1>
              <p className="animate-in text-sm" style={{ color: 'var(--brown-muted)', animationDelay: '0.05s' }}>
                Based on what&apos;s trending right now. Click any idea to remix it into your own.
              </p>
            </div>
            <button
              onClick={() => fetchIdeas(activeCategory)}
              disabled={loading}
              className="btn-hover inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold flex-shrink-0"
              style={{
                background: 'var(--white)',
                color: 'var(--brown-muted)',
                border: '1px solid rgba(45, 35, 25, 0.08)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              New batch
            </button>
          </div>

          {/* Category chips */}
          <div className="flex items-center gap-2 flex-wrap mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className="btn-hover px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: activeCategory === cat.key ? 'var(--cash)' : 'var(--white)',
                  color: activeCategory === cat.key ? '#fff' : 'var(--brown-muted)',
                  boxShadow: activeCategory === cat.key ? '0 2px 8px rgba(34, 197, 94, 0.2)' : 'var(--shadow-sm)',
                  border: `1px solid ${activeCategory === cat.key ? 'var(--cash)' : 'rgba(45, 35, 25, 0.06)'}`,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ideas grid */}
      <div className="px-4 sm:px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={28} className="animate-spin" style={{ color: 'var(--cash)' }} />
              <p className="text-sm" style={{ color: 'var(--brown-muted)' }}>
                Generating fresh ideas...
              </p>
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                No ideas found
              </p>
              <p className="text-sm" style={{ color: 'var(--brown-muted)' }}>Try a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {ideas.map((idea, i) => (
                <div key={idea.id} className="animate-in" style={{ animationDelay: `${Math.min(i * 0.03, 0.5)}s` }}>
                  <IdeaCard idea={idea} onRemix={handleRemix} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
