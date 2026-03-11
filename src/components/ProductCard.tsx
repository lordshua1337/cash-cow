'use client'

import { Heart, ExternalLink, Star, ArrowUp, MessageSquare, Github } from 'lucide-react'
import type { TrendingProduct } from '@/lib/types'

interface ProductCardProps {
  readonly product: TrendingProduct
  readonly isSaved: boolean
  readonly onToggleSave: (product: TrendingProduct) => void
  readonly action?: {
    readonly label: string
    readonly onClick: (product: TrendingProduct) => void
  }
}

export default function ProductCard({ product, isSaved, onToggleSave, action }: ProductCardProps) {
  return (
    <div
      className="card-lift rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: 'var(--white)',
        border: '2px solid var(--spot-gray)',
        boxShadow: '0 4px 20px rgba(41, 37, 36, 0.06)',
      }}
    >
      {/* Header: source badge + score */}
      <div className="flex items-center justify-between">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
          style={{
            background: product.source === 'hackernews' ? 'var(--gold-soft)' : 'var(--blue-soft)',
            color: product.source === 'hackernews' ? 'var(--gold)' : 'var(--blue)',
          }}
        >
          {product.source === 'hackernews' ? (
            <>
              <ArrowUp size={12} />
              Hacker News
            </>
          ) : (
            <>
              <Github size={12} />
              GitHub
            </>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--brown-muted)' }}>
          <span className="inline-flex items-center gap-1">
            <Star size={12} style={{ color: 'var(--gold)' }} />
            {product.score.toLocaleString()}
          </span>
          {product.commentCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <MessageSquare size={12} />
              {product.commentCount.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Title + description */}
      <div className="flex-1">
        <h3
          className="text-lg font-bold mb-1 leading-tight"
          style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
        >
          {product.title}
        </h3>
        <p
          className="text-sm leading-relaxed line-clamp-2"
          style={{ color: 'var(--brown-muted)' }}
        >
          {product.description}
        </p>
      </div>

      {/* Category */}
      <div
        className="text-xs font-bold px-2 py-0.5 rounded self-start"
        style={{ background: 'var(--cream-dark)', color: 'var(--brown-muted)' }}
      >
        {product.category}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onToggleSave(product)}
          className="btn-bounce inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors"
          style={{
            background: isSaved ? 'var(--red-soft)' : 'var(--cream-dark)',
            color: isSaved ? 'var(--red)' : 'var(--brown-muted)',
            border: `1.5px solid ${isSaved ? 'rgba(239, 68, 68, 0.2)' : 'var(--spot-gray)'}`,
          }}
        >
          <Heart size={14} fill={isSaved ? 'var(--red)' : 'none'} />
          {isSaved ? 'Saved' : 'Save'}
        </button>

        {action && (
          <button
            onClick={() => action.onClick(product)}
            className="btn-bounce inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold"
            style={{
              background: 'var(--cash)',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.25)',
            }}
          >
            {action.label}
          </button>
        )}

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1 px-2 py-2 rounded-xl text-xs transition-colors"
          style={{ color: 'var(--brown-faint)' }}
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  )
}
