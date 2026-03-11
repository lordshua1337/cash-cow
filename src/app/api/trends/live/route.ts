import { NextResponse, type NextRequest } from 'next/server'
import type { TrendingProduct } from '@/lib/types'

function categorize(text: string): string {
  const lower = text.toLowerCase()
  if (lower.match(/\b(ai|ml|llm|gpt|claude|openai|model|neural|machine.?learn)\b/)) return 'AI / ML'
  if (lower.match(/\b(dev|code|api|sdk|github|git|deploy|docker|ci|cd|debug|lint)\b/)) return 'Dev Tools'
  if (lower.match(/\b(design|figma|css|ui|ux|font|color|sketch|canvas)\b/)) return 'Design'
  if (lower.match(/\b(finance|payment|invoice|accounting|bank|crypto|trading|stock)\b/)) return 'Finance'
  if (lower.match(/\b(market|seo|email|campaign|ads|social|content|brand)\b/)) return 'Marketing'
  if (lower.match(/\b(health|fitness|meditation|sleep|habit|wellness|diet)\b/)) return 'Health'
  if (lower.match(/\b(learn|course|edu|teach|study|quiz|student)\b/)) return 'Education'
  if (lower.match(/\b(task|note|calendar|todo|productivity|time|focus|workflow)\b/)) return 'Productivity'
  return 'SaaS'
}

async function fetchHackerNews(): Promise<TrendingProduct[]> {
  try {
    const res = await fetch('https://hacker-news.firebaseio.com/v0/showstories.json', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []

    const ids: number[] = await res.json()
    const top30 = ids.slice(0, 30)

    const items = await Promise.all(
      top30.map(async (id) => {
        try {
          const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          if (!itemRes.ok) return null
          return itemRes.json()
        } catch {
          return null
        }
      })
    )

    return items
      .filter((item): item is {
        id: number
        title: string
        score: number
        url?: string
        text?: string
        descendants?: number
        time?: number
      } => item !== null && item.title && item.score > 5)
      .map((item) => ({
        id: `hn-${item.id}`,
        title: item.title.replace(/^(Show HN|Ask HN|Tell HN):\s*/i, '').trim(),
        description: item.text
          ? item.text.replace(/<[^>]*>/g, '').slice(0, 200)
          : item.title,
        url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
        source: 'hackernews' as const,
        score: Math.min(item.score, 999),
        commentCount: item.descendants || 0,
        timestamp: item.time ? new Date(item.time * 1000).toISOString() : new Date().toISOString(),
        category: categorize(item.title + ' ' + (item.text || '')),
      }))
  } catch {
    return []
  }
}

async function fetchGitHubTrending(): Promise<TrendingProduct[]> {
  try {
    const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const res = await fetch(
      `https://api.github.com/search/repositories?q=created:>${since}+stars:>50&sort=stars&order=desc&per_page=20`,
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
        next: { revalidate: 3600 },
      }
    )
    if (!res.ok) return []

    const data = await res.json()
    return (data.items || []).map((repo: {
      id: number
      name: string
      description: string | null
      stargazers_count: number
      html_url: string
      created_at: string
      watchers_count: number
    }) => ({
      id: `gh-${repo.id}`,
      title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      description: repo.description || repo.name,
      url: repo.html_url,
      source: 'github' as const,
      score: Math.min(repo.stargazers_count, 99999),
      commentCount: repo.watchers_count || 0,
      timestamp: repo.created_at || new Date().toISOString(),
      category: categorize(repo.name + ' ' + (repo.description || '')),
    }))
  } catch {
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sourceFilter = searchParams.get('source')
    const query = searchParams.get('q')?.toLowerCase()

    const [hnTrends, ghTrends] = await Promise.all([
      sourceFilter === 'github' ? Promise.resolve([]) : fetchHackerNews(),
      sourceFilter === 'hackernews' ? Promise.resolve([]) : fetchGitHubTrending(),
    ])

    let all = [...hnTrends, ...ghTrends].sort((a, b) => b.score - a.score)

    if (query) {
      all = all.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      )
    }

    return NextResponse.json({
      products: all.slice(0, 50),
      fetchedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Trends fetch error:', err)
    return NextResponse.json({ products: [], error: 'Failed to fetch trends' }, { status: 500 })
  }
}
