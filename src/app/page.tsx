'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import IdeaCard from '@/components/IdeaCard'
import type { ProductIdea, IdeaCategory } from '@/lib/types'
import { storeTempIdea } from '@/lib/favorites'

const CATEGORIES: { key: IdeaCategory; label: string }[] = [
  { key: 'all', label: 'All Ideas' },
  { key: 'ai-tools', label: 'AI Tools' },
  { key: 'productivity', label: 'Productivity' },
  { key: 'finance', label: 'Finance' },
  { key: 'health', label: 'Health' },
  { key: 'education', label: 'Education' },
  { key: 'marketing', label: 'Marketing' },
]

export default function HomePage() {
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

  function handleGetSpec(idea: ProductIdea) {
    storeTempIdea(idea)
    router.push(`/build/${idea.id}`)
  }

  const topPick = ideas[0] || null
  const moreIdeas = ideas.slice(1)

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <div className="cow-spots px-4 sm:px-6 pt-8 pb-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1
            className="animate-in text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Pick an idea. Get a build spec.{' '}
            <span style={{ color: 'var(--cash)' }}>Start building this weekend.</span>
          </h1>
          <p
            className="animate-in text-sm sm:text-base"
            style={{ color: 'var(--brown-muted)', animationDelay: '0.05s' }}
          >
            Real product ideas backed by trending signals. Each one comes with a step-by-step spec you can paste into Claude Code.
          </p>
        </div>
      </div>

      {/* Category chips */}
      <div className="px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className="btn-bounce px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              style={{
                background: activeCategory === cat.key ? 'var(--spot-black)' : 'var(--white)',
                color: activeCategory === cat.key ? 'var(--cream)' : 'var(--brown-muted)',
                border: `2px solid ${activeCategory === cat.key ? 'var(--spot-black)' : 'var(--spot-gray)'}`,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas */}
      <div className="px-4 sm:px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2
                size={32}
                className="animate-spin"
                style={{ color: 'var(--cash)' }}
              />
              <p className="text-sm" style={{ color: 'var(--brown-muted)' }}>
                Finding ideas based on today&apos;s trending signals...
              </p>
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-20">
              <p
                className="text-lg font-bold mb-2"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                No ideas found
              </p>
              <p className="text-sm" style={{ color: 'var(--brown-muted)' }}>
                Try a different category.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Top pick -- large featured card */}
              {topPick && (
                <div className="animate-in">
                  <IdeaCard idea={topPick} featured onGetSpec={handleGetSpec} />
                </div>
              )}

              {/* More ideas */}
              {moreIdeas.length > 0 && (
                <>
                  <h2
                    className="animate-in text-lg font-bold mt-2"
                    style={{
                      fontFamily: 'var(--font-fredoka), sans-serif',
                      color: 'var(--brown-muted)',
                      animationDelay: '0.1s',
                    }}
                  >
                    More ideas
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {moreIdeas.map((idea, i) => (
                      <div
                        key={idea.id}
                        className="animate-in"
                        style={{ animationDelay: `${0.05 * (i + 1)}s` }}
                      >
                        <IdeaCard idea={idea} onGetSpec={handleGetSpec} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
