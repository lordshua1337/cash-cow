'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, TrendingUp, Users, AlertTriangle, Zap, ArrowRight, Star, Shield, Loader, Bell, Check } from 'lucide-react'
import { EXAMPLE_SNAPSHOTS, getCalvesBySnapshot } from '@/lib/mock-data'
import { saveSnapshot, saveCalves, getSnapshots, getCalves } from '@/lib/state'
import type { MarketSnapshot, Calf } from '@/lib/types'

type SearchPhase = 'idle' | 'analyzing' | 'scoring' | 'done' | 'error'

export default function PasturePage() {
  const [selectedSnapshot, setSelectedSnapshot] = useState<MarketSnapshot | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchPhase, setSearchPhase] = useState<SearchPhase>('idle')
  const [searchError, setSearchError] = useState<string | null>(null)
  const [generatedCalves, setGeneratedCalves] = useState<readonly Calf[]>([])
  const [userSnapshots, setUserSnapshots] = useState<readonly MarketSnapshot[]>([])
  const [userCalves, setUserCalves] = useState<readonly Calf[]>([])
  const [watchedNiche, setWatchedNiche] = useState(false)
  const [watchLoading, setWatchLoading] = useState(false)

  useEffect(() => {
    setUserSnapshots(getSnapshots())
    setUserCalves(getCalves())
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearchPhase('analyzing')
    setSearchError(null)
    setSelectedSnapshot(null)
    setGeneratedCalves([])

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: searchQuery.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || `Research failed (${res.status})`)
      }

      setSearchPhase('scoring')
      const { snapshot, calves } = await res.json() as { snapshot: MarketSnapshot; calves: Calf[] }

      saveSnapshot(snapshot)
      saveCalves(calves)

      setSelectedSnapshot(snapshot)
      setGeneratedCalves(calves)
      setUserSnapshots(getSnapshots())
      setUserCalves(getCalves())
      setSearchPhase('done')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Research failed'
      setSearchError(message)
      setSearchPhase('error')
    }
  }

  const isSearching = searchPhase === 'analyzing' || searchPhase === 'scoring'

  const handleWatchNiche = async () => {
    if (!selectedSnapshot) return
    setWatchLoading(true)
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: selectedSnapshot.niche }),
      })
      if (res.ok) {
        setWatchedNiche(true)
      }
    } catch {
      // Watchlist requires auth -- fail silently
    } finally {
      setWatchLoading(false)
    }
  }

  const calvesForSnapshot = selectedSnapshot
    ? [
        ...generatedCalves.filter((c) => c.snapshotId === selectedSnapshot.id),
        ...userCalves.filter((c) => c.snapshotId === selectedSnapshot.id && !generatedCalves.some((g) => g.id === c.id)),
        ...getCalvesBySnapshot(selectedSnapshot.id),
      ].filter((calf, index, arr) => arr.findIndex((c) => c.id === calf.id) === index)
    : []

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
            onKeyDown={(e) => e.key === 'Enter' && !isSearching && handleSearch()}
            placeholder="Enter a niche (e.g., AI Writing Tools, Meal Planning, Email Marketing...)"
            className="w-full pl-10 pr-4 py-3 rounded-lg text-sm"
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              outline: 'none',
            }}
            disabled={isSearching}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="px-6 py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
          style={{ background: 'var(--cash)', color: '#FFFFFF' }}
        >
          {isSearching ? 'Researching...' : 'Research Niche'}
        </button>
      </div>

      {/* Loading state */}
      {isSearching && (
        <div
          className="flex flex-col items-center gap-4 py-16 mb-8 rounded-xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <Loader size={32} className="animate-spin" style={{ color: 'var(--cash)' }} />
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              {searchPhase === 'analyzing' ? 'Analyzing market...' : 'Scoring opportunities...'}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {searchPhase === 'analyzing'
                ? 'Researching trending products, competitors, and user complaints'
                : 'Generating product ideas and calculating scores'}
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {searchPhase === 'error' && searchError && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-lg mb-8"
          style={{ background: 'var(--red-soft)', border: '1px solid rgba(220, 38, 38, 0.2)' }}
        >
          <AlertTriangle size={14} style={{ color: 'var(--red)' }} />
          <p className="text-sm" style={{ color: 'var(--red)' }}>{searchError}</p>
        </div>
      )}

      {/* Example + user snapshots (shown when nothing selected and not searching) */}
      {!selectedSnapshot && !isSearching && (
        <div>
          {/* User's previous research */}
          {userSnapshots.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Your Research</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userSnapshots.map((snapshot) => (
                  <button
                    key={snapshot.id}
                    onClick={() => {
                      setSelectedSnapshot(snapshot)
                      setGeneratedCalves([])
                      setSearchPhase('done')
                    }}
                    className="text-left p-5 rounded-xl transition-all hover:scale-[1.01]"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderLeft: '3px solid var(--cash)',
                    }}
                  >
                    <h3 className="font-bold text-base mb-1">{snapshot.niche}</h3>
                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span>{snapshot.trendingProducts.length} products</span>
                      <span>{snapshot.competitorLandscape.length} competitors</span>
                      <span>{snapshot.reviewComplaintClusters.length} complaint clusters</span>
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      {new Date(snapshot.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div
            className="flex items-center gap-2 px-4 py-3 rounded-lg mb-6"
            style={{ background: 'var(--blue-soft)', border: '1px solid rgba(37, 99, 235, 0.2)' }}
          >
            <Shield size={14} style={{ color: 'var(--blue)' }} />
            <p className="text-sm" style={{ color: 'var(--blue)' }}>
              These are example market snapshots. Search your own niche above to get real AI-powered research.
            </p>
          </div>

          <h2 className="text-xl font-bold mb-4">Example Research</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXAMPLE_SNAPSHOTS.map((snapshot) => (
              <button
                key={snapshot.id}
                onClick={() => {
                  setSelectedSnapshot(snapshot)
                  setGeneratedCalves([])
                  setSearchPhase('idle')
                }}
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
      {selectedSnapshot && !isSearching && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black">{selectedSnapshot.niche}</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Market snapshot from {new Date(selectedSnapshot.createdAt).toLocaleDateString()}
                {!selectedSnapshot.isExample && !EXAMPLE_SNAPSHOTS.some((e) => e.id === selectedSnapshot.id) && (
                  <span
                    className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{ background: 'var(--cash-soft)', color: 'var(--cash)' }}
                  >
                    AI GENERATED
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleWatchNiche}
                disabled={watchLoading || watchedNiche}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                style={{
                  background: watchedNiche ? 'var(--green-soft)' : 'var(--cash-soft)',
                  color: watchedNiche ? 'var(--green)' : 'var(--cash)',
                  border: `1px solid ${watchedNiche ? 'rgba(5,150,105,0.2)' : 'rgba(34,197,94,0.2)'}`,
                }}
              >
                {watchedNiche ? <Check size={12} /> : <Bell size={12} />}
                {watchedNiche ? 'Watching' : 'Watch Niche'}
              </button>
              <button
                onClick={() => {
                  setSelectedSnapshot(null)
                  setGeneratedCalves([])
                  setSearchPhase('idle')
                  setWatchedNiche(false)
                }}
                className="text-sm px-4 py-2 rounded-lg"
                style={{ background: 'var(--bg-alt)', color: 'var(--text-secondary)' }}
              >
                Back to Markets
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Trending products */}
            <div
              className="p-5 rounded-xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} style={{ color: 'var(--cash)' }} />
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
                        <Star size={12} style={{ color: 'var(--cash-light)' }} />
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
                      {product.dataSource === 'ai_estimated' && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold"
                          style={{ background: 'var(--orange-soft)', color: 'var(--orange)' }}
                        >
                          AI EST.
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
                      <span className="text-xs font-medium" style={{ color: 'var(--cash)' }}>
                        {comp.pricing}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {comp.keyFeatures.map((f, j) => (
                        <span
                          key={j}
                          className="px-2 py-0.5 rounded text-[10px]"
                          style={{ background: 'var(--cash-soft)', color: 'var(--text-secondary)' }}
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
          {calvesForSnapshot.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} style={{ color: 'var(--cash)' }} />
                <h3 className="font-bold">Product Ideas from This Niche</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calvesForSnapshot.map((calf) => (
                  <Link
                    key={calf.id}
                    href={`/dashboard/herd/${calf.id}`}
                    className="p-5 rounded-xl transition-all hover:scale-[1.01]"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{calf.productName}</h4>
                      <span className="text-lg font-black" style={{ color: 'var(--cash)' }}>
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
                        <ArrowRight size={12} style={{ color: 'var(--cash)' }} />
                        <span style={{ color: 'var(--cash)' }}>View Brief</span>
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
                background: 'var(--cash)',
                color: '#FFFFFF',
                boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)',
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
