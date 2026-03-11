'use client'

import { ChevronUp, MessageCircle, CircleDollarSign } from 'lucide-react'
import type { TrendingMonetizableProduct } from '@/lib/sources/types'

export default function ProductCard({
  product,
  selected,
  onSelect,
}: {
  readonly product: TrendingMonetizableProduct
  readonly selected: boolean
  readonly onSelect: (product: TrendingMonetizableProduct) => void
}) {
  return (
    <button
      onClick={() => onSelect(product)}
      className="card rounded-2xl p-5 text-left flex flex-col gap-3 group w-full"
      style={{
        borderColor: selected ? 'var(--cash)' : undefined,
        boxShadow: selected ? '0 4px 20px rgba(34, 197, 94, 0.12)' : undefined,
        background: selected ? 'rgba(34, 197, 94, 0.02)' : 'var(--white)',
      }}
    >
      {/* Top row: thumbnail + name */}
      <div className="flex items-start gap-3">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt=""
            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
            style={{ border: '1px solid rgba(45, 35, 25, 0.06)' }}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold"
            style={{
              background: 'var(--cash-soft)',
              color: 'var(--cash)',
              fontFamily: 'var(--font-fredoka), sans-serif',
            }}
          >
            {product.name.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3
            className="text-base font-bold leading-tight truncate"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            {product.name}
          </h3>
          <p
            className="text-sm leading-snug mt-0.5 line-clamp-2"
            style={{ color: 'var(--brown-muted)' }}
          >
            {product.tagline}
          </p>
        </div>
      </div>

      {/* Revenue signal */}
      <div
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold self-start"
        style={{ background: 'var(--cash-soft)', color: 'var(--cash-dark)' }}
      >
        <CircleDollarSign size={11} />
        {product.revenueSignal}
      </div>

      {/* Topics */}
      {product.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {product.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 rounded-md text-[10px] font-bold"
              style={{ background: 'var(--cream-dark)', color: 'var(--brown-faint)' }}
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Bottom stats */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1 text-xs font-bold"
            style={{ color: 'var(--brown-faint)' }}
          >
            <ChevronUp size={12} />
            {product.votes}
          </span>
          <span
            className="inline-flex items-center gap-1 text-xs font-bold"
            style={{ color: 'var(--brown-faint)' }}
          >
            <MessageCircle size={12} />
            {product.comments}
          </span>
        </div>
        <span
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-opacity"
          style={{
            background: selected ? 'var(--cash)' : 'var(--cash)',
            color: '#fff',
            opacity: selected ? 1 : 0.6,
          }}
        >
          {selected ? 'Selected' : 'Use as inspiration'}
        </span>
      </div>
    </button>
  )
}
