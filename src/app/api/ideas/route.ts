import { NextResponse, type NextRequest } from 'next/server'
import { callLLM } from '@/lib/ai/llm'
import { FALLBACK_IDEAS } from '@/lib/fallback-ideas'
import type { TrendingProduct, ProductIdea } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  'all': 'any category',
  'ai-tools': 'AI tools and automation',
  'productivity': 'productivity and workflow',
  'finance': 'finance, invoicing, and money management',
  'health': 'health, fitness, and wellness',
  'education': 'education and learning',
  'marketing': 'marketing, content, and growth',
}

function categorize(text: string): string {
  const lower = text.toLowerCase()
  if (lower.match(/\b(ai|ml|llm|gpt|claude|openai|model|neural|machine.?learn|automat)\b/)) return 'AI / ML'
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
      forks_count: number
    }) => ({
      id: `gh-${repo.id}`,
      title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      description: repo.description || repo.name,
      url: repo.html_url,
      source: 'github' as const,
      score: Math.min(repo.stargazers_count, 99999),
      commentCount: repo.forks_count || 0,
      timestamp: repo.created_at || new Date().toISOString(),
      category: categorize(repo.name + ' ' + (repo.description || '')),
    }))
  } catch {
    return []
  }
}

const IDEAS_SYSTEM_PROMPT = `You are a product advisor for solo non-technical founders who want to build and sell SaaS products.

You will receive trending data from Hacker News and GitHub. This data tells you WHAT SPACES ARE HOT right now -- what developers are building, what problems people are talking about, what categories have momentum. Use it as MARKET INTELLIGENCE only.

DO NOT generate ideas that clone, copy, or directly compete with the trending products. Instead:
1. Look at what categories and problem spaces are getting attention
2. Identify ADJACENT problems, UNDERSERVED audiences, or GAPS that the trending products don't address
3. Generate ORIGINAL product ideas that ride the same wave but solve DIFFERENT problems for DIFFERENT people

Example of what NOT to do: If a code editor is trending, don't suggest "build a code editor."
Example of what TO do: If a code editor is trending, notice that dev tools are hot, and suggest "a tool that helps non-technical founders write product specs that developers actually want to build from" -- adjacent space, different audience, different problem.

Return ONLY valid JSON (no markdown fences) matching this exact shape:
[
  {
    "id": "string - unique kebab-case slug",
    "name": "string - catchy product name (not a repo name)",
    "pitch": "string - one sentence: what it does for WHO",
    "category": "string - one of: AI Tools, Productivity, Finance, Health, Education, Marketing, Dev Tools, SaaS",
    "whyNow": "string - 1-2 sentences on why this is a good bet RIGHT NOW. Reference the market momentum you're seeing, not the trending products themselves.",
    "risk": "string - 1 honest sentence about the biggest risk",
    "complexity": "one of: weekend | few-weeks | month-plus"
  }
]

Rules:
- Generate exactly 20 ideas
- ZERO of the ideas should be clones of trending products. Every idea must be ORIGINAL.
- Each idea must have a SPECIFIC paying customer (not "businesses" -- "freelance designers who...")
- Be honest about risks -- "Crowded space", "Needs real users to validate", etc.
- Names should be catchy and memorable (InvoicePilot, not invoice-tracker)
- Pitches should be one clear sentence a friend would understand
- Complexity should be realistic for a solo builder using AI coding tools
- These are BUSINESS opportunities, not open source projects
- At least 6 ideas should be "weekend" complexity
- Spread ideas across ALL categories -- don't cluster in one area`

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const categoryLabel = CATEGORY_LABELS[category] || 'any category'

    // Fetch trending data as context
    const [hnTrends, ghTrends] = await Promise.all([
      fetchHackerNews(),
      fetchGitHubTrending(),
    ])

    const allTrends = [...hnTrends, ...ghTrends].sort((a, b) => b.score - a.score).slice(0, 20)

    // Summarize trending data as market signals, not product lists
    const categoryBuckets: Record<string, number> = {}
    const topicSignals: string[] = []

    for (const t of allTrends) {
      const cat = categorize(t.title + ' ' + t.description)
      categoryBuckets[cat] = (categoryBuckets[cat] || 0) + 1
      topicSignals.push(`${t.title}: ${t.description}`)
    }

    const hotCategories = Object.entries(categoryBuckets)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([cat, count]) => `${cat} (${count} trending)`)
      .join(', ')

    const sampleTopics = topicSignals.slice(0, 10).map((t) => `- ${t}`).join('\n')

    const userPrompt = `Here's what's hot in the market right now:

Hot categories: ${hotCategories}

Sample of what people are building and talking about:
${sampleTopics}

Using these as MARKET SIGNALS (not templates to copy), generate 20 ORIGINAL product ideas${category !== 'all' ? ` focused on ${categoryLabel}` : ''} that a solo non-technical founder could build and sell. Each idea should ride the momentum of what's hot but solve a DIFFERENT problem for a DIFFERENT audience than the trending products. Be honest about risks.`

    try {
      const raw = await callLLM(IDEAS_SYSTEM_PROMPT, userPrompt, 8000)
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const ideas: ProductIdea[] = JSON.parse(cleaned)

      // Validate we got an array of ideas
      if (!Array.isArray(ideas) || ideas.length === 0) {
        throw new Error('Invalid ideas response')
      }

      return NextResponse.json(
        { ideas },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
          },
        }
      )
    } catch (llmError) {
      console.error('LLM ideas generation failed, serving fallback:', llmError)

      // Filter fallback by category if needed
      const filtered = category === 'all'
        ? FALLBACK_IDEAS
        : FALLBACK_IDEAS.filter((idea) =>
            idea.category.toLowerCase().includes(category.replace('-', ' '))
          )

      const ideas = filtered.length > 0 ? filtered : FALLBACK_IDEAS

      return NextResponse.json({ ideas, fallback: true })
    }
  } catch (err) {
    console.error('Ideas fetch error:', err)
    return NextResponse.json({ ideas: FALLBACK_IDEAS, fallback: true })
  }
}
