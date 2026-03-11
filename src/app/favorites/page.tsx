'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Hammer } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import type { TrendingProduct } from '@/lib/types'
import { getFavorites, removeFavorite } from '@/lib/favorites'

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<TrendingProduct[]>([])

  const sync = useCallback(() => {
    setFavorites(getFavorites())
  }, [])

  useEffect(() => {
    sync()
  }, [sync])

  function handleRemove(product: TrendingProduct) {
    removeFavorite(product.id)
    sync()
  }

  function handleBuild(product: TrendingProduct) {
    router.push(`/build/${product.id}`)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="px-4 sm:px-6 pt-8 pb-6">
        <div className="max-w-5xl mx-auto">
          <h1
            className="animate-in text-3xl sm:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Your saves
          </h1>
          <p
            className="animate-in text-sm sm:text-base mb-8"
            style={{ color: 'var(--brown-muted)', animationDelay: '0.05s' }}
          >
            Products you&apos;re interested in. Hit &quot;Build This&quot; to get a full spec.
          </p>

          {favorites.length === 0 ? (
            <div
              className="animate-in text-center py-20 rounded-2xl"
              style={{
                background: 'var(--white)',
                border: '2px dashed var(--spot-gray)',
                animationDelay: '0.1s',
              }}
            >
              <Heart
                size={48}
                style={{ color: 'var(--spot-gray)', margin: '0 auto 16px' }}
              />
              <p
                className="text-xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                No saves yet
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--brown-muted)' }}>
                Browse trending products and save the ones that catch your eye.
              </p>
              <button
                onClick={() => router.push('/')}
                className="btn-bounce inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold"
                style={{
                  background: 'var(--cash)',
                  color: '#fff',
                  boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
                }}
              >
                Browse Trending
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSaved={true}
                  onToggleSave={handleRemove}
                  action={{
                    label: 'Build This',
                    onClick: handleBuild,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
