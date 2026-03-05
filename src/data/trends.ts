// Trend Sniper data -- absorbed into Cash Cow
// Trending market opportunities from 5 signal sources

export type TrendCategory =
  | 'AI/ML'
  | 'Fintech'
  | 'Health'
  | 'Education'
  | 'Creator Tools'
  | 'Dev Tools'
  | 'E-Commerce'
  | 'Infrastructure'
  | 'Enterprise'

export type TrendStage = 'Emerging' | 'Accelerating' | 'Peaking' | 'Saturating' | 'Declining'

export type SignalSource = 'HackerNews' | 'GitHub' | 'Reddit' | 'GoogleTrends' | 'ProductHunt'

export interface MarketTrend {
  readonly id: string
  readonly name: string
  readonly category: TrendCategory
  readonly description: string
  readonly stage: TrendStage
  readonly score: number
  readonly confidence: number
  readonly competition: 'Low' | 'Medium' | 'High'
  readonly monetization: 'None' | 'Emerging' | 'Proven'
  readonly buildDays: number
  readonly signals: readonly { source: SignalSource; score: number; velocity: number }[]
  readonly verdict: 'Build Now' | 'Watch Closely' | 'Too Early' | 'Too Late' | 'High Risk'
  readonly verdictReason: string
}

export const STAGE_COLORS: Record<TrendStage, string> = {
  Emerging: '#00D4FF',
  Accelerating: '#22C55E',
  Peaking: '#FFD600',
  Saturating: '#FF9100',
  Declining: '#EF4444',
}

export const VERDICT_COLORS: Record<MarketTrend['verdict'], string> = {
  'Build Now': '#22C55E',
  'Watch Closely': '#FFD600',
  'Too Early': '#00D4FF',
  'Too Late': '#EF4444',
  'High Risk': '#FF9100',
}

export const TRENDS: readonly MarketTrend[] = [
  {
    id: 'trend-001',
    name: 'AI Agents',
    category: 'AI/ML',
    description: 'Autonomous AI systems that plan and execute multi-step tasks without human intervention.',
    stage: 'Accelerating',
    score: 88,
    confidence: 91,
    competition: 'High',
    monetization: 'Proven',
    buildDays: 45,
    signals: [
      { source: 'HackerNews', score: 92, velocity: 15 },
      { source: 'GitHub', score: 88, velocity: 22 },
      { source: 'Reddit', score: 85, velocity: 12 },
      { source: 'GoogleTrends', score: 90, velocity: 18 },
      { source: 'ProductHunt', score: 86, velocity: 10 },
    ],
    verdict: 'Build Now',
    verdictReason: 'Massive demand, market leader not decided yet. 6-12 month window before commoditization.',
  },
  {
    id: 'trend-002',
    name: 'LLM Fine-tuning Platforms',
    category: 'AI/ML',
    description: 'No-code platforms for fine-tuning language models on custom datasets.',
    stage: 'Accelerating',
    score: 72,
    confidence: 83,
    competition: 'Medium',
    monetization: 'Proven',
    buildDays: 60,
    signals: [
      { source: 'HackerNews', score: 75, velocity: 8 },
      { source: 'GitHub', score: 80, velocity: 14 },
      { source: 'Reddit', score: 68, velocity: 6 },
      { source: 'GoogleTrends', score: 70, velocity: 10 },
      { source: 'ProductHunt', score: 72, velocity: 5 },
    ],
    verdict: 'Build Now',
    verdictReason: 'Enterprise demand growing fast. SMBs underserved by current players.',
  },
  {
    id: 'trend-003',
    name: 'Synthetic Data Generation',
    category: 'AI/ML',
    description: 'AI-generated datasets for training models where real data is scarce or private.',
    stage: 'Emerging',
    score: 31,
    confidence: 67,
    competition: 'Low',
    monetization: 'Emerging',
    buildDays: 30,
    signals: [
      { source: 'HackerNews', score: 35, velocity: 5 },
      { source: 'GitHub', score: 40, velocity: 8 },
      { source: 'Reddit', score: 25, velocity: 3 },
      { source: 'GoogleTrends', score: 28, velocity: 4 },
      { source: 'ProductHunt', score: 30, velocity: 2 },
    ],
    verdict: 'Too Early',
    verdictReason: 'Promising but market needs 12-18 months to mature. Start building a moat now.',
  },
  {
    id: 'trend-004',
    name: 'AI Video Generation',
    category: 'AI/ML',
    description: 'Text-to-video and image-to-video models enabling instant video creation.',
    stage: 'Accelerating',
    score: 79,
    confidence: 88,
    competition: 'High',
    monetization: 'Proven',
    buildDays: 90,
    signals: [
      { source: 'HackerNews', score: 82, velocity: 20 },
      { source: 'GitHub', score: 75, velocity: 15 },
      { source: 'Reddit', score: 80, velocity: 18 },
      { source: 'GoogleTrends', score: 85, velocity: 22 },
      { source: 'ProductHunt', score: 78, velocity: 12 },
    ],
    verdict: 'High Risk',
    verdictReason: 'Dominated by well-funded players. Niche verticals still open.',
  },
  {
    id: 'trend-005',
    name: 'Embedded Finance APIs',
    category: 'Fintech',
    description: 'APIs that let any platform offer banking, lending, or insurance features.',
    stage: 'Peaking',
    score: 65,
    confidence: 85,
    competition: 'High',
    monetization: 'Proven',
    buildDays: 120,
    signals: [
      { source: 'HackerNews', score: 60, velocity: -2 },
      { source: 'GitHub', score: 65, velocity: 3 },
      { source: 'Reddit', score: 55, velocity: -1 },
      { source: 'GoogleTrends', score: 68, velocity: 1 },
      { source: 'ProductHunt', score: 62, velocity: 0 },
    ],
    verdict: 'Too Late',
    verdictReason: 'Market consolidating around Stripe/Plaid. Vertical niches may exist.',
  },
  {
    id: 'trend-006',
    name: 'AI Bookkeeping',
    category: 'Fintech',
    description: 'Automated categorization and reconciliation of financial transactions using AI.',
    stage: 'Emerging',
    score: 45,
    confidence: 72,
    competition: 'Low',
    monetization: 'Emerging',
    buildDays: 40,
    signals: [
      { source: 'HackerNews', score: 42, velocity: 8 },
      { source: 'GitHub', score: 38, velocity: 5 },
      { source: 'Reddit', score: 50, velocity: 10 },
      { source: 'GoogleTrends', score: 48, velocity: 12 },
      { source: 'ProductHunt', score: 44, velocity: 6 },
    ],
    verdict: 'Build Now',
    verdictReason: 'Massive underserved market. Small businesses hate their books. Low competition.',
  },
  {
    id: 'trend-007',
    name: 'AI Tutoring',
    category: 'Education',
    description: 'Personalized AI tutors that adapt to individual learning styles and pace.',
    stage: 'Accelerating',
    score: 74,
    confidence: 80,
    competition: 'Medium',
    monetization: 'Proven',
    buildDays: 50,
    signals: [
      { source: 'HackerNews', score: 70, velocity: 10 },
      { source: 'GitHub', score: 65, velocity: 8 },
      { source: 'Reddit', score: 78, velocity: 14 },
      { source: 'GoogleTrends', score: 80, velocity: 16 },
      { source: 'ProductHunt', score: 72, velocity: 9 },
    ],
    verdict: 'Build Now',
    verdictReason: 'Parents will pay. K-12 tutoring market is $10B+ and AI is just entering.',
  },
  {
    id: 'trend-008',
    name: 'Creator Analytics',
    category: 'Creator Tools',
    description: 'Cross-platform analytics dashboards for content creators and influencers.',
    stage: 'Peaking',
    score: 58,
    confidence: 77,
    competition: 'High',
    monetization: 'Proven',
    buildDays: 35,
    signals: [
      { source: 'HackerNews', score: 48, velocity: -3 },
      { source: 'GitHub', score: 52, velocity: 2 },
      { source: 'Reddit', score: 62, velocity: 4 },
      { source: 'GoogleTrends', score: 60, velocity: -1 },
      { source: 'ProductHunt', score: 68, velocity: 5 },
    ],
    verdict: 'Watch Closely',
    verdictReason: 'Crowded but most tools are bad. A genuinely good UX could still win.',
  },
  {
    id: 'trend-009',
    name: 'AI Code Review',
    category: 'Dev Tools',
    description: 'Automated code review tools that catch bugs, security issues, and style violations.',
    stage: 'Accelerating',
    score: 70,
    confidence: 85,
    competition: 'Medium',
    monetization: 'Proven',
    buildDays: 55,
    signals: [
      { source: 'HackerNews', score: 75, velocity: 12 },
      { source: 'GitHub', score: 82, velocity: 18 },
      { source: 'Reddit', score: 65, velocity: 8 },
      { source: 'GoogleTrends', score: 68, velocity: 10 },
      { source: 'ProductHunt', score: 70, velocity: 7 },
    ],
    verdict: 'Build Now',
    verdictReason: 'Developers hate manual code review. GitHub Copilot proved the market. Room for specialization.',
  },
  {
    id: 'trend-010',
    name: 'Micro-SaaS Templates',
    category: 'Dev Tools',
    description: 'Pre-built SaaS boilerplates with auth, billing, and deployment out of the box.',
    stage: 'Accelerating',
    score: 62,
    confidence: 78,
    competition: 'Medium',
    monetization: 'Proven',
    buildDays: 20,
    signals: [
      { source: 'HackerNews', score: 58, velocity: 6 },
      { source: 'GitHub', score: 72, velocity: 15 },
      { source: 'Reddit', score: 60, velocity: 8 },
      { source: 'GoogleTrends', score: 55, velocity: 5 },
      { source: 'ProductHunt', score: 65, velocity: 10 },
    ],
    verdict: 'Watch Closely',
    verdictReason: 'Saturating but new stacks (Next.js 16, Supabase) create fresh demand cycles.',
  },
  {
    id: 'trend-011',
    name: 'AI Health Coaching',
    category: 'Health',
    description: 'Personalized health and wellness coaching powered by AI and wearable data.',
    stage: 'Emerging',
    score: 42,
    confidence: 65,
    competition: 'Low',
    monetization: 'Emerging',
    buildDays: 45,
    signals: [
      { source: 'HackerNews', score: 38, velocity: 5 },
      { source: 'GitHub', score: 35, velocity: 4 },
      { source: 'Reddit', score: 48, velocity: 8 },
      { source: 'GoogleTrends', score: 50, velocity: 10 },
      { source: 'ProductHunt', score: 40, velocity: 3 },
    ],
    verdict: 'Watch Closely',
    verdictReason: 'Regulatory complexity but massive TAM. Start with wellness, not medical.',
  },
  {
    id: 'trend-012',
    name: 'AI-Powered E-commerce Search',
    category: 'E-Commerce',
    description: 'Natural language product search that understands intent, not just keywords.',
    stage: 'Accelerating',
    score: 68,
    confidence: 82,
    competition: 'Medium',
    monetization: 'Proven',
    buildDays: 40,
    signals: [
      { source: 'HackerNews', score: 65, velocity: 8 },
      { source: 'GitHub', score: 70, velocity: 12 },
      { source: 'Reddit', score: 62, velocity: 6 },
      { source: 'GoogleTrends', score: 72, velocity: 14 },
      { source: 'ProductHunt', score: 68, velocity: 9 },
    ],
    verdict: 'Build Now',
    verdictReason: 'Shopify ecosystem hungry for this. Plugin model means fast distribution.',
  },
  {
    id: 'trend-013',
    name: 'Internal Knowledge Bases',
    category: 'Enterprise',
    description: 'AI-powered internal wikis that answer questions from company documents.',
    stage: 'Accelerating',
    score: 76,
    confidence: 87,
    competition: 'High',
    monetization: 'Proven',
    buildDays: 50,
    signals: [
      { source: 'HackerNews', score: 78, velocity: 10 },
      { source: 'GitHub', score: 74, velocity: 8 },
      { source: 'Reddit', score: 72, velocity: 6 },
      { source: 'GoogleTrends', score: 80, velocity: 12 },
      { source: 'ProductHunt', score: 76, velocity: 11 },
    ],
    verdict: 'Watch Closely',
    verdictReason: 'Hot market. Notion AI and others moving fast. Vertical specialization is the play.',
  },
  {
    id: 'trend-014',
    name: 'AI Meeting Assistants',
    category: 'Enterprise',
    description: 'Real-time meeting transcription, summarization, and action item extraction.',
    stage: 'Peaking',
    score: 55,
    confidence: 90,
    competition: 'High',
    monetization: 'Proven',
    buildDays: 60,
    signals: [
      { source: 'HackerNews', score: 50, velocity: -5 },
      { source: 'GitHub', score: 55, velocity: 2 },
      { source: 'Reddit', score: 52, velocity: -2 },
      { source: 'GoogleTrends', score: 58, velocity: 0 },
      { source: 'ProductHunt', score: 60, velocity: -3 },
    ],
    verdict: 'Too Late',
    verdictReason: 'Otter, Fireflies, Granola have locked this market. Move on.',
  },
  {
    id: 'trend-015',
    name: 'Serverless GPU Platforms',
    category: 'Infrastructure',
    description: 'On-demand GPU compute for AI inference without managing servers.',
    stage: 'Accelerating',
    score: 71,
    confidence: 84,
    competition: 'Medium',
    monetization: 'Proven',
    buildDays: 90,
    signals: [
      { source: 'HackerNews', score: 78, velocity: 14 },
      { source: 'GitHub', score: 72, velocity: 10 },
      { source: 'Reddit', score: 65, velocity: 8 },
      { source: 'GoogleTrends', score: 68, velocity: 9 },
      { source: 'ProductHunt', score: 70, velocity: 7 },
    ],
    verdict: 'High Risk',
    verdictReason: 'Capital intensive. Replicate/Modal are well-funded. API wrapper play could work.',
  },
]

export function getTrendsByCategory(category: TrendCategory): readonly MarketTrend[] {
  return TRENDS.filter(t => t.category === category)
}

export function getTrendsByVerdict(verdict: MarketTrend['verdict']): readonly MarketTrend[] {
  return TRENDS.filter(t => t.verdict === verdict)
}

export function getTopTrends(count: number): readonly MarketTrend[] {
  return [...TRENDS].sort((a, b) => b.score - a.score).slice(0, count)
}

export function getCategories(): readonly TrendCategory[] {
  const cats = new Set(TRENDS.map(t => t.category))
  return [...cats] as readonly TrendCategory[]
}
