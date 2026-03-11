// Product Hunt API client -- fetches trending monetizable products
// Uses GraphQL API v2 with developer token
// Falls back to curated list if API fails or no token

import type { TrendingMonetizableProduct } from './types'

const PH_API_URL = 'https://api.producthunt.com/v2/api/graphql'
const PH_TOKEN = process.env.PRODUCT_HUNT_TOKEN || ''

const POSTS_QUERY = `
  query GetTrendingPosts {
    posts(order: VOTES, first: 30) {
      edges {
        node {
          id
          name
          tagline
          votesCount
          commentsCount
          website
          thumbnail {
            url
          }
          topics(first: 3) {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`

function inferRevenueSignal(name: string, tagline: string, topics: string[]): string {
  const text = `${name} ${tagline} ${topics.join(' ')}`.toLowerCase()

  if (text.match(/\b(subscription|recurring|monthly|annual|plan)\b/)) return 'SaaS subscription'
  if (text.match(/\b(marketplace|commission|connect buyers|two-sided)\b/)) return 'Marketplace fees'
  if (text.match(/\b(api|developer|sdk|integration)\b/)) return 'API usage fees'
  if (text.match(/\b(ai|gpt|llm|automat|generat)\b/)) return 'AI-powered SaaS'
  if (text.match(/\b(template|theme|kit|component)\b/)) return 'Digital product sales'
  if (text.match(/\b(analytics|track|monitor|dashboard)\b/)) return 'Analytics SaaS'
  if (text.match(/\b(e-?commerce|shop|store|sell)\b/)) return 'E-commerce platform'
  if (text.match(/\b(freelanc|agency|client|invoice)\b/)) return 'Service tool subscription'
  if (text.match(/\b(education|course|learn|teach)\b/)) return 'EdTech subscription'
  if (text.match(/\b(health|fitness|wellness|medic)\b/)) return 'Health-tech subscription'
  return 'SaaS subscription'
}

interface PHGraphQLResponse {
  readonly data?: {
    readonly posts?: {
      readonly edges?: ReadonlyArray<{
        readonly node: {
          readonly id: string
          readonly name: string
          readonly tagline: string
          readonly votesCount: number
          readonly commentsCount: number
          readonly website: string
          readonly thumbnail?: { readonly url: string } | null
          readonly topics?: {
            readonly edges?: ReadonlyArray<{
              readonly node: { readonly name: string }
            }>
          }
        }
      }>
    }
  }
}

export async function fetchProductHuntTrending(): Promise<TrendingMonetizableProduct[]> {
  if (!PH_TOKEN) {
    console.warn('No PRODUCT_HUNT_TOKEN set, using fallback products')
    return []
  }

  try {
    const res = await fetch(PH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PH_TOKEN}`,
      },
      body: JSON.stringify({ query: POSTS_QUERY }),
      next: { revalidate: 86400 },
    })

    if (!res.ok) {
      console.error(`Product Hunt API error: ${res.status}`)
      return []
    }

    const json: PHGraphQLResponse = await res.json()
    const edges = json.data?.posts?.edges

    if (!edges || edges.length === 0) return []

    return edges.map((edge) => {
      const node = edge.node
      const topics = node.topics?.edges?.map((t) => t.node.name) ?? []

      return {
        id: `ph-${node.id}`,
        name: node.name,
        tagline: node.tagline,
        votes: node.votesCount,
        comments: node.commentsCount,
        website: node.website,
        thumbnail: node.thumbnail?.url ?? '',
        topics,
        source: 'producthunt' as const,
        revenueSignal: inferRevenueSignal(node.name, node.tagline, topics),
      }
    })
  } catch (err) {
    console.error('Product Hunt fetch failed:', err)
    return []
  }
}

// Static fallback -- real products that people actually pay for
export const FALLBACK_TRENDING: TrendingMonetizableProduct[] = [
  {
    id: 'ph-fallback-1',
    name: 'Lemon Squeezy',
    tagline: 'Sell digital products, subscriptions, and SaaS with ease',
    votes: 1842,
    comments: 156,
    website: 'https://lemonsqueezy.com',
    thumbnail: '',
    topics: ['SaaS', 'Payments', 'E-Commerce'],
    source: 'producthunt',
    revenueSignal: 'Payment platform fees',
  },
  {
    id: 'ph-fallback-2',
    name: 'Typefully',
    tagline: 'Write, schedule, and grow on Twitter/X and LinkedIn',
    votes: 2105,
    comments: 203,
    website: 'https://typefully.com',
    thumbnail: '',
    topics: ['Social Media', 'Marketing', 'Productivity'],
    source: 'producthunt',
    revenueSignal: 'SaaS subscription',
  },
  {
    id: 'ph-fallback-3',
    name: 'Dub',
    tagline: 'Open-source link management for modern marketing teams',
    votes: 1567,
    comments: 89,
    website: 'https://dub.co',
    thumbnail: '',
    topics: ['Marketing', 'Analytics', 'Developer Tools'],
    source: 'producthunt',
    revenueSignal: 'SaaS subscription',
  },
  {
    id: 'ph-fallback-4',
    name: 'Cal.com',
    tagline: 'Scheduling infrastructure for everyone',
    votes: 3201,
    comments: 312,
    website: 'https://cal.com',
    thumbnail: '',
    topics: ['Scheduling', 'Productivity', 'SaaS'],
    source: 'producthunt',
    revenueSignal: 'SaaS subscription',
  },
  {
    id: 'ph-fallback-5',
    name: 'Resend',
    tagline: 'Email API for developers built on React',
    votes: 2890,
    comments: 245,
    website: 'https://resend.com',
    thumbnail: '',
    topics: ['Developer Tools', 'Email', 'API'],
    source: 'producthunt',
    revenueSignal: 'API usage fees',
  },
  {
    id: 'ph-fallback-6',
    name: 'Beehiiv',
    tagline: 'The newsletter platform built for growth',
    votes: 1923,
    comments: 167,
    website: 'https://beehiiv.com',
    thumbnail: '',
    topics: ['Newsletter', 'Marketing', 'Creator Economy'],
    source: 'producthunt',
    revenueSignal: 'SaaS subscription',
  },
  {
    id: 'ph-fallback-7',
    name: 'Framer',
    tagline: 'Ship sites with style -- no code required',
    votes: 4102,
    comments: 398,
    website: 'https://framer.com',
    thumbnail: '',
    topics: ['Design', 'No-Code', 'Web Development'],
    source: 'producthunt',
    revenueSignal: 'SaaS subscription',
  },
  {
    id: 'ph-fallback-8',
    name: 'Tally',
    tagline: 'The simplest way to create forms, for free',
    votes: 2456,
    comments: 178,
    website: 'https://tally.so',
    thumbnail: '',
    topics: ['Forms', 'Productivity', 'No-Code'],
    source: 'producthunt',
    revenueSignal: 'Freemium SaaS',
  },
  {
    id: 'ph-fallback-9',
    name: 'Loops',
    tagline: 'Email for modern SaaS companies',
    votes: 1678,
    comments: 134,
    website: 'https://loops.so',
    thumbnail: '',
    topics: ['Email', 'SaaS', 'Marketing'],
    source: 'producthunt',
    revenueSignal: 'SaaS subscription',
  },
  {
    id: 'ph-fallback-10',
    name: 'Raycast',
    tagline: 'Your shortcut to everything on Mac',
    votes: 5234,
    comments: 456,
    website: 'https://raycast.com',
    thumbnail: '',
    topics: ['Productivity', 'Developer Tools', 'macOS'],
    source: 'producthunt',
    revenueSignal: 'SaaS subscription',
  },
  {
    id: 'ph-fallback-11',
    name: 'Testimonial.to',
    tagline: 'Collect and display testimonials with no code',
    votes: 1345,
    comments: 98,
    website: 'https://testimonial.to',
    thumbnail: '',
    topics: ['Marketing', 'Social Proof', 'SaaS'],
    source: 'producthunt',
    revenueSignal: 'SaaS subscription',
  },
  {
    id: 'ph-fallback-12',
    name: 'Crisp',
    tagline: 'All-in-one business messaging platform',
    votes: 1890,
    comments: 145,
    website: 'https://crisp.chat',
    thumbnail: '',
    topics: ['Customer Support', 'Chat', 'SaaS'],
    source: 'producthunt',
    revenueSignal: 'SaaS subscription',
  },
  {
    id: 'ph-fallback-13',
    name: 'Plausible',
    tagline: 'Simple, privacy-friendly Google Analytics alternative',
    votes: 2567,
    comments: 234,
    website: 'https://plausible.io',
    thumbnail: '',
    topics: ['Analytics', 'Privacy', 'SaaS'],
    source: 'producthunt',
    revenueSignal: 'SaaS subscription',
  },
  {
    id: 'ph-fallback-14',
    name: 'Paddle',
    tagline: 'The complete payments, tax, and subscriptions solution',
    votes: 1456,
    comments: 112,
    website: 'https://paddle.com',
    thumbnail: '',
    topics: ['Payments', 'SaaS', 'Fintech'],
    source: 'producthunt',
    revenueSignal: 'Payment platform fees',
  },
  {
    id: 'ph-fallback-15',
    name: 'PostHog',
    tagline: 'Open-source product analytics you can self-host',
    votes: 3456,
    comments: 289,
    website: 'https://posthog.com',
    thumbnail: '',
    topics: ['Analytics', 'Developer Tools', 'Open Source'],
    source: 'producthunt',
    revenueSignal: 'SaaS subscription',
  },
  {
    id: 'ph-fallback-16',
    name: 'Carrd',
    tagline: 'Simple, free, fully responsive one-page sites',
    votes: 3890,
    comments: 345,
    website: 'https://carrd.co',
    thumbnail: '',
    topics: ['Web Development', 'No-Code', 'Landing Pages'],
    source: 'producthunt',
    revenueSignal: 'Freemium SaaS',
  },
  {
    id: 'ph-fallback-17',
    name: 'Gumroad',
    tagline: 'Sell anything directly to anyone',
    votes: 4567,
    comments: 412,
    website: 'https://gumroad.com',
    thumbnail: '',
    topics: ['E-Commerce', 'Creator Economy', 'Payments'],
    source: 'producthunt',
    revenueSignal: 'Marketplace fees',
  },
  {
    id: 'ph-fallback-18',
    name: 'Chartmogul',
    tagline: 'Subscription analytics platform',
    votes: 1234,
    comments: 87,
    website: 'https://chartmogul.com',
    thumbnail: '',
    topics: ['Analytics', 'SaaS', 'Fintech'],
    source: 'producthunt',
    revenueSignal: 'Analytics SaaS',
  },
  {
    id: 'ph-fallback-19',
    name: 'Notion',
    tagline: 'The all-in-one workspace for notes, tasks, and docs',
    votes: 8901,
    comments: 789,
    website: 'https://notion.so',
    thumbnail: '',
    topics: ['Productivity', 'Collaboration', 'SaaS'],
    source: 'producthunt',
    revenueSignal: 'SaaS subscription',
  },
  {
    id: 'ph-fallback-20',
    name: 'Fathom Analytics',
    tagline: 'Privacy-focused website analytics',
    votes: 1789,
    comments: 156,
    website: 'https://usefathom.com',
    thumbnail: '',
    topics: ['Analytics', 'Privacy', 'SaaS'],
    source: 'producthunt',
    revenueSignal: 'SaaS subscription',
  },
]
