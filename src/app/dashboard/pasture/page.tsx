'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, TrendingUp, Users, AlertTriangle, Zap, ArrowRight, Star, ExternalLink, Shield } from 'lucide-react'
import { EXAMPLE_SNAPSHOTS, getCalvesBySnapshot } from '@/lib/mock-data'
import type { MarketSnapshot, Calf } from '@/lib/types'

export default function PasturePage() {
  const [selectedSnapshot, setSelectedSnapshot] = useState<MarketSnapshot | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    // Simulate search delay then show matching or first example
    setTimeout(() => {
      const match = EXAMPLE_SNAPSHOTS.find(
        (s) => s.niche.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSelectedSnapshot(match ?? EXAMPLE_SNAPSHOTS[0])
      setIsSearching(false)
    }, 1200)
  }

  const calves = selectedSnapshot ? getCalvesBySnapshot(selectedSnapshot.id) : []

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--text)' }}>
          The Pasture
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Graze trending markets. Find gaps. Milk profitable niches.
        </p>
      </div>

      {/* Search */}
      <div
        className="flex gap-3 mb-8 p-4 rounded-xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter a niche (e.g., AI Writing Tools, Meal Planning, Email Marketing...)"
            className="w-full pl-10 pr-4 py-3 rounded-lg text-sm"
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              outline: 'none',
            }}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="px-6 py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
          style={{ background: 'var(--amber)', color: '#FFFFFF' }}
        >
          {isSearching ? 'Researching...' : 'Research Niche'}
        </button>
      </div>

      {/* Example snapshots (shown when nothing selected) */}
      {!selectedSnapshot && (
        <div>
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-lg mb-6"
            style={{ background: 'var(--blue-soft)', border: '1px solid rgba(37, 99, 235, 0.2)' }}
          >
            <Shield size={14} style={{ color: 'var(--blue)' }} />
            <p className="text-sm" style={{ color: 'var(--blue)' }}>
              These are example market snapshots. Search your own niche above to get started.
            </p>
          </div>

          <h2 className="text-xl font-bold mb-4">Example Research</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXAMPLE_SNAPSHOTS.map((snapshot) => (
              <button
                key={snapshot.id}
                onClick={() => setSelectedSnapshot(snapshot)}
                className="text-left p-5 rounded-xl transition-all hover:scale-[1.01]"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <h3 className="font-bold text-base mb-1">{snapshot.niche}</h3>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span>{snapshot.trendingProducts.length} products</span>
                  <span>{snapshot.competitorLandscape.length} competitors</span>
                  <span>{snapshot.reviewComplaintClusters.length} complaint clusters</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Snapshot detail */}
      {selectedSnapshot && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black">{selectedSnapshot.niche}</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Market snapshot from {new Date(selectedSnapshot.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => setSelectedSnapshot(null)}
              className="text-sm px-4 py-2 rounded-lg"
              style={{ background: 'var(--bg-alt)', color: 'var(--text-secondary)' }}
            >
              Back to Markets
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Trending products */}
            <div
              className="p-5 rounded-xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} style={{ color: 'var(--amber)' }} />
                <h3 className="font-bold">Trending Products</h3>
              </div>
              <div className="space-y-3">
                {selectedSnapshot.trendingProducts.map((product, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2"
                    style={{ borderBottom: i < selectedSnapshot.trendingProducts.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {product.category} -- via {product.source}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Star size={12} style={{ color: 'var(--amber-light)' }} />
                        {product.rating}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {product.reviewCount.toLocaleString()} reviews
                      </span>
                      {product.dataSource === 'api_verified' && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold"
                          style={{ background: 'var(--green-soft)', color: 'var(--green)' }}
                        >
                          VERIFIED
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitors */}
            <div
              className="p-5 rounded-xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} style={{ color: 'var(--orange)' }} />
                <h3 className="font-bold">Competitor Landscape</h3>
              </div>
              <div className="space-y-4">
                {selectedSnapshot.competitorLandscape.map((comp, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold">{comp.company}</p>
                      <span className="text-xs font-medium" style={{ color: 'var(--amber)' }}>
                        {comp.pricing}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {comp.keyFeatures.map((f, j) => (
                        <span
                          key={j}
                          className="px-2 py-0.5 rounded text-[10px]"
                          style={{ background: 'var(--amber-soft)', color: 'var(--text-secondary)' }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span
                        className="px-1.5 py-0.5 rounded font-bold"
                        style={{
                          background: comp.dataSource === 'api_verified' ? 'var(--green-soft)' : 'var(--orange-soft)',
                          color: comp.dataSource === 'api_verified' ? 'var(--green)' : 'var(--orange)',
                        }}
                      >
                        {comp.dataSource === 'api_verified' ? 'API VERIFIED' : 'AI ESTIMATED'}
                      </span>
                      {comp.techStack && comp.techStack.length > 0 && (
                        <span style={{ color: 'var(--text-muted)' }}>
                          Tech: {comp.techStack.join(', ')}
                        </span>
                      )}
                      {comp.estimatedTraffic && (
                        <span style={{ color: 'var(--text-muted)' }}>
                          ~{(comp.estimatedTraffic.monthly / 1000000).toFixed(1)}M visits/mo
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Complaints */}
          <div
            className="p-5 rounded-xl mb-8"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} style={{ color: 'var(--red)' }} />
              <h3 className="font-bold">Common Complaints</h3>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                -- mined from G2, Reddit, Product Hunt
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedSnapshot.reviewComplaintClusters.map((cluster, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg"
                  style={{
                    background: 'var(--bg)',
                    borderLeft: '3px solid var(--orange)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold">{cluster.complaintTheme}</p>
                    <span className="text-xs font-bold" style={{ color: 'var(--orange)' }}>
                      {cluster.frequency}% of users
                    </span>
                  </div>
                  <div className="space-y-1.5 mb-2">
                    {cluster.exampleQuotes.map((quote, j) => (
                      <p key={j} className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>
                        &quot;{quote}&quot;
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span
                      className="px-1.5 py-0.5 rounded font-bold"
                      style={{
                        background: cluster.verified ? 'var(--green-soft)' : 'var(--orange-soft)',
                        color: cluster.verified ? 'var(--green)' : 'var(--orange)',
                      }}
                    >
                      {cluster.verified ? 'VERIFIED' : 'AI HYPOTHETICAL'}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Source: {cluster.source} ({cluster.sourceCount} reviews)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated ideas from this niche */}
          {calves.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} style={{ color: 'var(--amber)' }} />
                <h3 className="font-bold">Product Ideas from This Niche</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calves.map((calf) => (
                  <Link
                    key={calf.id}
                    href={`/dashboard/herd/${calf.id}`}
                    className="p-5 rounded-xl transition-all hover:scale-[1.01]"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{calf.productName}</h4>
                      <span className="text-lg font-black" style={{ color: 'var(--amber)' }}>
                        {calf.overallScore}
                      </span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {calf.oneLinePitch}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Build: <span style={{ color: 'var(--text)' }}>{calf.buildDaysMin}-{calf.buildDaysMax}d</span>
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Revenue: <span style={{ color: 'var(--green)' }}>${(calf.revenuePotentialMin / 1000).toFixed(0)}K-${(calf.revenuePotentialMax / 1000).toFixed(0)}K/mo</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <ArrowRight size={12} style={{ color: 'var(--amber)' }} />
                        <span style={{ color: 'var(--amber)' }}>View Brief</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Milk this niche CTA */}
          <div className="text-center">
            <Link
              href="/dashboard/herd"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:scale-105"
              style={{
                background: 'var(--amber)',
                color: '#FFFFFF',
                boxShadow: '0 0 30px rgba(217, 119, 6, 0.3)',
              }}
            >
              <Zap size={18} />
              View All Calves in The Herd
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
