// Trending monetizable product from Product Hunt or fallback

export interface TrendingMonetizableProduct {
  readonly id: string
  readonly name: string
  readonly tagline: string
  readonly votes: number
  readonly comments: number
  readonly website: string
  readonly thumbnail: string
  readonly topics: readonly string[]
  readonly source: 'producthunt'
  readonly revenueSignal: string
}

export type ProductCategory =
  | 'all'
  | 'saas'
  | 'ai'
  | 'marketplace'
  | 'mobile'
  | 'developer-tools'
  | 'productivity'
  | 'fintech'
  | 'ecommerce'
  | 'health'

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  all: 'All',
  saas: 'SaaS',
  ai: 'AI',
  marketplace: 'Marketplace',
  mobile: 'Mobile',
  'developer-tools': 'Dev Tools',
  productivity: 'Productivity',
  fintech: 'Fintech',
  ecommerce: 'E-Commerce',
  health: 'Health',
}
