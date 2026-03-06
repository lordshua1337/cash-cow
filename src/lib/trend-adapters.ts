// Live trend signal adapters -- fetch real data from public APIs
// HackerNews and GitHub are free, no API keys required

import type { SignalSource } from '@/data/trends'

export interface LiveSignal {
  readonly source: SignalSource
  readonly score: number       // 0-100
  readonly velocity: number    // -10 to +10 (negative = declining)
  readonly mentions: number    // raw count
  readonly fetchedAt: string   // ISO date
}

// ---------------------------------------------------------------------------
// HackerNews Adapter (Algolia Search API -- free, no key)
// ---------------------------------------------------------------------------

interface HNSearchResult {
  readonly nbHits: number
  readonly hits: readonly { readonly points: number; readonly created_at: string }[]
}

export async function fetchHackerNewsSignal(keyword: string): Promise<LiveSignal> {
  const now = Math.floor(Date.now() / 1000)
  const weekAgo = now - 7 * 24 * 60 * 60
  const twoWeeksAgo = now - 14 * 24 * 60 * 60

  try {
    // This week's mentions
    const thisWeekUrl = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(keyword)}&tags=story&numericFilters=created_at_i>${weekAgo}&hitsPerPage=100`
    const lastWeekUrl = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(keyword)}&tags=story&numericFilters=created_at_i>${twoWeeksAgo},created_at_i<${weekAgo}&hitsPerPage=100`

    const [thisWeekRes, lastWeekRes] = await Promise.all([
      fetch(thisWeekUrl, { next: { revalidate: 3600 } }),
      fetch(lastWeekUrl, { next: { revalidate: 3600 } }),
    ])

    const thisWeek: HNSearchResult = await thisWeekRes.json()
    const lastWeek: HNSearchResult = await lastWeekRes.json()

    const thisCount = thisWeek.nbHits
    const lastCount = lastWeek.nbHits

    // Score: based on mention volume (0-100 scale)
    // 50+ mentions/week = 100, 0 = 0
    const score = Math.min(100, Math.round((thisCount / 50) * 100))

    // Velocity: week-over-week change
    const velocity = lastCount > 0
      ? Math.round(((thisCount - lastCount) / lastCount) * 10)
      : thisCount > 0 ? 5 : 0

    return {
      source: 'HackerNews',
      score,
      velocity: Math.max(-10, Math.min(10, velocity)),
      mentions: thisCount,
      fetchedAt: new Date().toISOString(),
    }
  } catch {
    return { source: 'HackerNews', score: 0, velocity: 0, mentions: 0, fetchedAt: new Date().toISOString() }
  }
}

// ---------------------------------------------------------------------------
// GitHub Adapter (Search API -- free, 10 requests/minute unauthenticated)
// ---------------------------------------------------------------------------

interface GitHubSearchResult {
  readonly total_count: number
  readonly items: readonly { readonly stargazers_count: number; readonly created_at: string; readonly pushed_at: string }[]
}

export async function fetchGitHubSignal(keyword: string): Promise<LiveSignal> {
  try {
    // Search repos created or pushed in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(keyword)}+pushed:>${thirtyDaysAgo}&sort=stars&order=desc&per_page=30`

    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.github.v3+json' },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return { source: 'GitHub', score: 0, velocity: 0, mentions: 0, fetchedAt: new Date().toISOString() }
    }

    const data: GitHubSearchResult = await res.json()
    const totalRepos = data.total_count

    // Score: based on active repo count (100+ active repos = 100)
    const score = Math.min(100, Math.round((totalRepos / 100) * 100))

    // Velocity: based on total stars in top results (rough activity proxy)
    const totalStars = data.items.reduce((sum, r) => sum + r.stargazers_count, 0)
    const velocity = totalStars > 10000 ? 8 : totalStars > 1000 ? 5 : totalStars > 100 ? 2 : 0

    return {
      source: 'GitHub',
      score,
      velocity: Math.max(-10, Math.min(10, velocity)),
      mentions: totalRepos,
      fetchedAt: new Date().toISOString(),
    }
  } catch {
    return { source: 'GitHub', score: 0, velocity: 0, mentions: 0, fetchedAt: new Date().toISOString() }
  }
}

// ---------------------------------------------------------------------------
// Aggregate: fetch all available signals for a keyword
// ---------------------------------------------------------------------------

export async function fetchLiveSignals(keyword: string): Promise<readonly LiveSignal[]> {
  const [hn, gh] = await Promise.all([
    fetchHackerNewsSignal(keyword),
    fetchGitHubSignal(keyword),
  ])

  return [hn, gh]
}
