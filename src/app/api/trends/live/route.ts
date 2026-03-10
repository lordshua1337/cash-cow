import { NextResponse } from 'next/server'

interface TrendItem {
  name: string
  tagline: string
  category: string
  source: 'producthunt' | 'hackernews' | 'github'
  score: number
  url?: string
}

// Categorize based on keywords
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

async function fetchHackerNews(): Promise<TrendItem[]> {
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
      .filter((item): item is { title: string; score: number; url?: string; text?: string } =>
        item !== null && item.title && item.score > 5
      )
      .map((item) => ({
        name: item.title.replace(/^(Show HN|Ask HN|Tell HN):\s*/i, '').trim(),
        tagline: item.title,
        category: categorize(item.title + ' ' + (item.text || '')),
        source: 'hackernews' as const,
        score: Math.min(item.score, 999),
        url: item.url,
      }))
  } catch {
    return []
  }
}

async function fetchGitHubTrending(): Promise<TrendItem[]> {
  try {
    // Use GitHub search API for recently created popular repos
    const res = await fetch(
      'https://api.github.com/search/repositories?q=created:>2025-01-01+stars:>50&sort=stars&order=desc&per_page=20',
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
        next: { revalidate: 3600 },
      }
    )
    if (!res.ok) return []

    const data = await res.json()
    return (data.items || []).map((repo: {
      name: string
      description: string | null
      stargazers_count: number
      html_url: string
    }) => ({
      name: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      tagline: repo.description || repo.name,
      category: categorize(repo.name + ' ' + (repo.description || '')),
      source: 'github' as const,
      score: Math.min(repo.stargazers_count, 9999),
      url: repo.html_url,
    }))
  } catch {
    return []
  }
}

export async function GET() {
  try {
    const [hnTrends, ghTrends] = await Promise.all([
      fetchHackerNews(),
      fetchGitHubTrending(),
    ])

    // Combine and sort by score
    const all = [...hnTrends, ...ghTrends]
      .sort((a, b) => b.score - a.score)
      .slice(0, 40)

    return NextResponse.json({ trends: all, fetchedAt: new Date().toISOString() })
  } catch (err) {
    console.error('Trends fetch error:', err)
    return NextResponse.json({ trends: [], error: 'Failed to fetch trends' }, { status: 500 })
  }
}
