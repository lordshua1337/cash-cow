'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Trash2, Zap, Clock, Calendar, CalendarRange } from 'lucide-react'
import type { ProductIdea } from '@/lib/types'
import { getFavorites, removeFavorite, getCachedSpec, removeCachedSpec, storeTempIdea } from '@/lib/favorites'

const COMPLEXITY_CONFIG = {
  weekend: { label: 'Weekend', icon: Clock, color: 'var(--cash)' },
  'few-weeks': { label: 'Few Weeks', icon: Calendar, color: 'var(--gold)' },
  'month-plus': { label: 'Month+', icon: CalendarRange, color: 'var(--blue)' },
} as const

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<ProductIdea[]>([])

  const sync = useCallback(() => {
    setFavorites(getFavorites())
  }, [])

  useEffect(() => {
    sync()
  }, [sync])

  function handleRemove(id: string) {
    removeFavorite(id)
    removeCachedSpec(id)
    sync()
  }

  function handleViewSpec(idea: ProductIdea) {
    storeTempIdea(idea)
    router.push(`/build/${idea.id}`)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="px-4 sm:px-6 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <h1
            className="animate-in text-3xl sm:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Your build queue
          </h1>
          <p
            className="animate-in text-sm sm:text-base mb-8"
            style={{ color: 'var(--brown-muted)', animationDelay: '0.05s' }}
          >
            Ideas you&apos;ve explored and specs you&apos;ve generated.
          </p>

          {favorites.length === 0 ? (
            <div
              className="animate-in text-center py-20 rounded-2xl"
              style={{
                background: 'var(--white)',
                border: '1.5px dashed rgba(45, 35, 25, 0.12)',
                animationDelay: '0.1s',
              }}
            >
              <Heart
                size={48}
                style={{ color: 'var(--brown-faint)', margin: '0 auto 16px', opacity: 0.4 }}
              />
              <p
                className="text-xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                No specs yet
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--brown-muted)' }}>
                Go find an idea to build -- specs are auto-saved when generated.
              </p>
              <button
                onClick={() => router.push('/ideas')}
                className="btn-hover inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold"
                style={{
                  background: 'var(--cash)',
                  color: '#fff',
                  boxShadow: '0 4px 14px rgba(34, 197, 94, 0.25)',
                }}
              >
                Find Ideas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((idea, i) => {
                const complexity = COMPLEXITY_CONFIG[idea.complexity]
                const hasSpec = !!getCachedSpec(idea.id)

                return (
                  <div
                    key={idea.id}
                    className="animate-in card rounded-2xl p-5 flex flex-col gap-3"
                    style={{
                      animationDelay: `${0.05 * i}s`,
                    }}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ background: 'var(--cream-dark)', color: complexity.color }}
                      >
                        <complexity.icon size={11} />
                        {complexity.label}
                      </span>
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ background: 'var(--cream-dark)', color: 'var(--brown-muted)' }}
                      >
                        {idea.category}
                      </span>
                      {hasSpec && (
                        <span
                          className="px-2.5 py-1 rounded-lg text-xs font-bold"
                          style={{ background: 'var(--cash-soft)', color: 'var(--cash)' }}
                        >
                          Spec Ready
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3
                        className="text-lg font-bold mb-1 leading-tight"
                        style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                      >
                        {idea.name}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--brown-muted)' }}>
                        {idea.pitch}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewSpec(idea)}
                        className="btn-hover inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold"
                        style={{
                          background: 'var(--cash)',
                          color: '#fff',
                          boxShadow: '0 2px 8px rgba(34, 197, 94, 0.2)',
                        }}
                      >
                        <Zap size={14} />
                        {hasSpec ? 'View Spec' : 'Get Spec'}
                      </button>
                      <button
                        onClick={() => handleRemove(idea.id)}
                        className="btn-hover inline-flex items-center justify-center w-9 h-9 rounded-xl"
                        style={{
                          background: 'var(--cream-dark)',
                          color: 'var(--brown-faint)',
                        }}
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
