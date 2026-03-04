import type { MarketSnapshot, Calf } from './types'

export const EXAMPLE_SNAPSHOTS: readonly MarketSnapshot[] = [
  {
    id: 'snap-ai-writing',
    userId: 'seed_data',
    niche: 'AI Writing Tools',
    createdAt: '2026-02-15T00:00:00Z',
    trendingProducts: [
      { name: 'Jasper', rating: 4.5, reviewCount: 2400, category: 'AI Writing', source: 'google', dataSource: 'api_verified', confidenceLevel: 'high' },
      { name: 'Copy.ai', rating: 4.3, reviewCount: 1800, category: 'AI Writing', source: 'product_hunt', dataSource: 'api_verified', confidenceLevel: 'high' },
      { name: 'Writesonic', rating: 4.2, reviewCount: 950, category: 'AI Writing', source: 'google', dataSource: 'api_verified', confidenceLevel: 'high' },
      { name: 'Rytr', rating: 4.0, reviewCount: 720, category: 'AI Writing', source: 'product_hunt', dataSource: 'api_verified', confidenceLevel: 'medium' },
      { name: 'Sudowrite', rating: 4.6, reviewCount: 310, category: 'AI Writing', source: 'product_hunt', dataSource: 'api_verified', confidenceLevel: 'high' },
    ],
    competitorLandscape: [
      { company: 'Jasper', pricing: '$39-125/mo', keyFeatures: ['Long-form content', 'Brand voice', 'SEO optimization', 'Team collaboration'], complaints: [], dataSource: 'api_verified', techStack: ['React', 'Node.js', 'GPT-4'], estimatedTraffic: { monthly: 4200000, source: 'similarweb' } },
      { company: 'Copy.ai', pricing: '$36-186/mo', keyFeatures: ['Workflows', 'Chat interface', '90+ templates', 'Brand voice'], complaints: [], dataSource: 'api_verified', techStack: ['Next.js', 'Python', 'GPT-4'] },
      { company: 'Writesonic', pricing: '$16-499/mo', keyFeatures: ['Article writer', 'Chatsonic', 'Brand voice', 'Bulk generation'], complaints: [], dataSource: 'api_verified' },
    ],
    reviewComplaintClusters: [
      { complaintTheme: 'Generic output that sounds robotic', frequency: 62, sentiment: 'negative', exampleQuotes: ['Content reads like it was written by a bot', 'Needs heavy editing to sound natural', 'My brand voice is completely lost'], source: 'g2', sourceCount: 340, verified: true },
      { complaintTheme: 'Pricing jumps dramatically at scale', frequency: 45, sentiment: 'negative', exampleQuotes: ['$39/mo for 20k words then $125/mo for unlimited is a huge leap', 'Enterprise pricing is not transparent'], source: 'g2', sourceCount: 180, verified: true },
      { complaintTheme: 'SEO recommendations are surface-level', frequency: 38, sentiment: 'negative', exampleQuotes: ['Just tells me to add keywords, nothing about search intent', 'Competing tools have much deeper SEO analysis'], source: 'reddit', sourceCount: 95, verified: true },
      { complaintTheme: 'No offline or API access for power users', frequency: 28, sentiment: 'negative', exampleQuotes: ['I need API access for my workflow but it costs $500+/mo', 'Would love a CLI version for batch processing'], source: 'reddit', sourceCount: 42, verified: true },
    ],
  },
  {
    id: 'snap-project-mgmt',
    userId: 'seed_data',
    niche: 'Project Management for Solopreneurs',
    createdAt: '2026-02-18T00:00:00Z',
    trendingProducts: [
      { name: 'Notion', rating: 4.7, reviewCount: 3200, category: 'Project Management', source: 'product_hunt', dataSource: 'api_verified', confidenceLevel: 'high' },
      { name: 'Linear', rating: 4.8, reviewCount: 1600, category: 'Project Management', source: 'product_hunt', dataSource: 'api_verified', confidenceLevel: 'high' },
      { name: 'Todoist', rating: 4.4, reviewCount: 2800, category: 'Task Management', source: 'google', dataSource: 'api_verified', confidenceLevel: 'high' },
      { name: 'ClickUp', rating: 4.2, reviewCount: 4100, category: 'Project Management', source: 'google', dataSource: 'api_verified', confidenceLevel: 'high' },
    ],
    competitorLandscape: [
      { company: 'Notion', pricing: '$0-15/user/mo', keyFeatures: ['Docs + DB', 'Templates', 'AI assistant', 'Flexible views'], complaints: [], dataSource: 'api_verified', techStack: ['React', 'Kotlin', 'PostgreSQL'], estimatedTraffic: { monthly: 28000000, source: 'similarweb' } },
      { company: 'Linear', pricing: '$0-8/user/mo', keyFeatures: ['Issue tracking', 'Cycles', 'Roadmaps', 'Git integration'], complaints: [], dataSource: 'api_verified', techStack: ['React', 'TypeScript', 'PostgreSQL'] },
      { company: 'Todoist', pricing: '$0-6/user/mo', keyFeatures: ['Natural language input', 'Filters', 'Labels', 'Integrations'], complaints: [], dataSource: 'api_verified' },
    ],
    reviewComplaintClusters: [
      { complaintTheme: 'Steep learning curve', frequency: 52, sentiment: 'negative', exampleQuotes: ['Took my team 3 weeks to get comfortable with Notion', 'Too many features for someone who just wants a to-do list'], source: 'g2', sourceCount: 420, verified: true },
      { complaintTheme: 'Overkill for solo use', frequency: 41, sentiment: 'negative', exampleQuotes: ['I am one person, I do not need enterprise project management', 'All these tools assume you have a team of 10+'], source: 'reddit', sourceCount: 210, verified: true },
      { complaintTheme: 'Slow performance with large databases', frequency: 35, sentiment: 'negative', exampleQuotes: ['My Notion workspace takes 5+ seconds to load pages', 'Database views hang with 1000+ entries'], source: 'g2', sourceCount: 155, verified: true },
    ],
  },
  {
    id: 'snap-fitness-tech',
    userId: 'seed_data',
    niche: 'AI Fitness & Meal Planning',
    createdAt: '2026-02-20T00:00:00Z',
    trendingProducts: [
      { name: 'MyFitnessPal', rating: 4.3, reviewCount: 5200, category: 'Fitness', source: 'google', dataSource: 'api_verified', confidenceLevel: 'high' },
      { name: 'Fitbod', rating: 4.6, reviewCount: 1400, category: 'Workout', source: 'product_hunt', dataSource: 'api_verified', confidenceLevel: 'high' },
      { name: 'MacroFactor', rating: 4.7, reviewCount: 620, category: 'Nutrition', source: 'product_hunt', dataSource: 'api_verified', confidenceLevel: 'high' },
      { name: 'Eat This Much', rating: 4.1, reviewCount: 380, category: 'Meal Planning', source: 'google', dataSource: 'api_verified', confidenceLevel: 'medium' },
      { name: 'Hevy', rating: 4.5, reviewCount: 890, category: 'Workout', source: 'product_hunt', dataSource: 'api_verified', confidenceLevel: 'high' },
    ],
    competitorLandscape: [
      { company: 'MyFitnessPal', pricing: '$0-19.99/mo', keyFeatures: ['Calorie tracking', 'Barcode scanner', 'Exercise logging', 'Community'], complaints: [], dataSource: 'api_verified', estimatedTraffic: { monthly: 12000000, source: 'similarweb' } },
      { company: 'Fitbod', pricing: '$12.99/mo', keyFeatures: ['AI workout plans', 'Progress tracking', 'Muscle recovery', 'Gym equipment detection'], complaints: [], dataSource: 'api_verified' },
      { company: 'MacroFactor', pricing: '$11.99/mo', keyFeatures: ['Adaptive nutrition', 'Food logger', 'Expenditure tracking', 'Coaching algorithms'], complaints: [], dataSource: 'api_verified' },
    ],
    reviewComplaintClusters: [
      { complaintTheme: 'Meal plans ignore dietary preferences and allergies', frequency: 48, sentiment: 'negative', exampleQuotes: ['Keeps suggesting foods I am allergic to even after I set restrictions', 'No good options for keto + dairy-free'], source: 'g2', sourceCount: 280, verified: true },
      { complaintTheme: 'Workout plans are generic, not personalized', frequency: 42, sentiment: 'negative', exampleQuotes: ['Same 3 exercises every push day regardless of my goals', 'Doesn\'t account for home gym equipment limitations'], source: 'reddit', sourceCount: 190, verified: true },
      { complaintTheme: 'No integration between nutrition and workout data', frequency: 35, sentiment: 'negative', exampleQuotes: ['I track food in one app and workouts in another', 'Would love AI that adjusts my meals based on my training'], source: 'reddit', sourceCount: 120, verified: true },
    ],
  },
  {
    id: 'snap-email-marketing',
    userId: 'seed_data',
    niche: 'Email Marketing Automation',
    createdAt: '2026-02-22T00:00:00Z',
    trendingProducts: [
      { name: 'Beehiiv', rating: 4.7, reviewCount: 920, category: 'Newsletter', source: 'product_hunt', dataSource: 'api_verified', confidenceLevel: 'high' },
      { name: 'ConvertKit', rating: 4.4, reviewCount: 2100, category: 'Email', source: 'google', dataSource: 'api_verified', confidenceLevel: 'high' },
      { name: 'Mailchimp', rating: 4.1, reviewCount: 6800, category: 'Email', source: 'google', dataSource: 'api_verified', confidenceLevel: 'high' },
      { name: 'Loops', rating: 4.6, reviewCount: 340, category: 'Email', source: 'product_hunt', dataSource: 'api_verified', confidenceLevel: 'medium' },
    ],
    competitorLandscape: [
      { company: 'Beehiiv', pricing: '$0-99/mo', keyFeatures: ['Newsletter hosting', 'Referral program', 'Ad network', 'Analytics'], complaints: [], dataSource: 'api_verified', techStack: ['React', 'Node.js', 'PostgreSQL'] },
      { company: 'ConvertKit', pricing: '$0-59/mo', keyFeatures: ['Creator-focused', 'Sequences', 'Landing pages', 'Commerce'], complaints: [], dataSource: 'api_verified' },
      { company: 'Mailchimp', pricing: '$0-350/mo', keyFeatures: ['Drag & drop', 'Automations', 'Segmentation', 'A/B testing'], complaints: [], dataSource: 'api_verified', estimatedTraffic: { monthly: 22000000, source: 'similarweb' } },
    ],
    reviewComplaintClusters: [
      { complaintTheme: 'Deliverability issues with Gmail/Outlook', frequency: 55, sentiment: 'negative', exampleQuotes: ['30% of my emails land in spam even with proper DKIM/SPF', 'Gmail tabs kill open rates'], source: 'g2', sourceCount: 510, verified: true },
      { complaintTheme: 'Expensive at scale with no revenue-share model', frequency: 40, sentiment: 'negative', exampleQuotes: ['$300/mo for 50k subscribers feels steep when I make $500/mo from newsletter', 'Pricing penalizes growth'], source: 'reddit', sourceCount: 185, verified: true },
      { complaintTheme: 'Poor content personalization', frequency: 32, sentiment: 'negative', exampleQuotes: ['Segments are basic, no real behavior-based targeting', 'I want to send different content to different reader interests automatically'], source: 'g2', sourceCount: 140, verified: true },
    ],
  },
]

export const MOCK_CALVES: readonly Calf[] = [
  {
    id: 'calf-brand-writer',
    userId: 'demo',
    niche: 'AI Writing Tools',
    createdAt: '2026-02-16T10:00:00Z',
    updatedAt: '2026-02-16T10:00:00Z',
    status: 'grazing',
    productName: 'VoiceCraft',
    oneLinePitch: 'AI writing assistant that actually sounds like your brand, not a robot.',
    targetAudience: 'Marketing teams at 10-200 person companies who publish 5+ pieces/week',
    coreFeatures: ['Brand voice training from existing content', 'Tone consistency scorer per paragraph', 'SEO optimization with search intent analysis', 'Team collaboration with approval workflows', 'API access for content pipeline integration'],
    differentiationAngle: 'Trains on YOUR content library instead of generic templates. Measures brand consistency like a spell-checker measures spelling.',
    monetizationModel: 'subscription',
    pricingRecommendation: 49,
    estimatedBuildDays: 21,
    buildDaysMin: 14,
    buildDaysMax: 32,
    buildDaysContext: 'For solo developer with Next.js + AI API experience',
    marketDemandScore: 78,
    marketDemandScoreVerified: 75,
    competitionDensityScore: 35,
    buildComplexityScore: 42,
    revenuePotentialScore: 72,
    revenuePotentialScoreVerified: 68,
    aiBuildabilityScore: 65,
    overallScore: 74,
    confidenceLevel: 'high',
    verificationPercentage: 85,
    revenuePotentialMin: 8000,
    revenuePotentialMax: 35000,
    revenuePotentialBasis: 'Based on 3 verified competitors (Jasper $39-125, Copy.ai $36-186, Writesonic $16-499)',
    whyWorksData: { trendVelocity: 'AI writing market growing 45% YoY, brand voice is top pain point', adSpendInsight: 'Competitors spending $200K+/mo on Google Ads targeting "brand voice"', complaintClusters: ['Generic output', 'No brand training', 'Missing SEO depth'] },
    whyMightFail: { risks: ['GPT-5 might add native brand voice', 'Jasper has 3yr head start', 'Enterprise sales cycle is long'], marketSaturation: false, buildComplexity: 'Medium -- core AI is API calls, brand training is the hard part' },
    variationLevels: { micro: { name: 'Chrome Extension', features: ['Tone checker', 'Quick rewrite', 'Brand score'], buildDays: 5, pricing: 9 }, standard: { name: 'Web App', features: ['Brand training', 'Tone scorer', 'SEO module', 'Team seats'], buildDays: 21, pricing: 49 }, premium: { name: 'Enterprise', features: ['API access', 'Custom models', 'SSO', 'Bulk generation', 'Compliance'], buildDays: 45, pricing: 199 } },
    snapshotId: 'snap-ai-writing',
  },
  {
    id: 'calf-solo-pm',
    userId: 'demo',
    niche: 'Project Management for Solopreneurs',
    createdAt: '2026-02-19T14:00:00Z',
    updatedAt: '2026-02-19T14:00:00Z',
    status: 'building',
    productName: 'SoloShip',
    oneLinePitch: 'Project management built for one-person businesses -- not stripped-down enterprise software.',
    targetAudience: 'Solo founders, freelancers, and indie hackers managing 2-5 projects simultaneously',
    coreFeatures: ['Single-view dashboard for all projects', 'AI daily priority suggestions', 'Revenue tracking per project', 'Time blocking with calendar sync', 'One-click weekly review generator'],
    differentiationAngle: 'Built from scratch for solo operators. No team features, no enterprise complexity. Just you, your projects, and what to work on today.',
    monetizationModel: 'subscription',
    pricingRecommendation: 12,
    estimatedBuildDays: 14,
    buildDaysMin: 10,
    buildDaysMax: 21,
    buildDaysContext: 'For solo developer with Next.js experience',
    marketDemandScore: 68,
    marketDemandScoreVerified: 65,
    competitionDensityScore: 55,
    buildComplexityScore: 28,
    revenuePotentialScore: 58,
    revenuePotentialScoreVerified: 55,
    aiBuildabilityScore: 80,
    overallScore: 66,
    confidenceLevel: 'high',
    verificationPercentage: 82,
    revenuePotentialMin: 3000,
    revenuePotentialMax: 15000,
    revenuePotentialBasis: 'Based on 3 verified competitors (Notion free-$15, Todoist free-$6, Linear free-$8)',
    monthlyRevenue: 0,
    whyWorksData: { trendVelocity: 'Solo-founder market exploding, 40M+ freelancers in US alone', adSpendInsight: 'Low ad spend in solo PM niche -- opportunity for organic growth', complaintClusters: ['Overkill for solo use', 'Steep learning curve', 'No revenue tracking'] },
    whyMightFail: { risks: ['Notion is free and good enough for most', 'Small TAM per user', 'Feature creep toward team tools'], marketSaturation: true, buildComplexity: 'Low -- CRUD with calendar integration' },
    variationLevels: { micro: { name: 'Task Board', features: ['Kanban', 'Daily priorities', 'Time tracking'], buildDays: 5, pricing: 5 }, standard: { name: 'Solo Suite', features: ['All projects dashboard', 'AI priorities', 'Revenue tracking', 'Calendar sync', 'Weekly review'], buildDays: 14, pricing: 12 }, premium: { name: 'Pro', features: ['Client portal', 'Invoicing', 'Financial reports', 'Automations', 'API'], buildDays: 30, pricing: 29 } },
    snapshotId: 'snap-project-mgmt',
  },
  {
    id: 'calf-fit-ai',
    userId: 'demo',
    niche: 'AI Fitness & Meal Planning',
    createdAt: '2026-02-21T09:00:00Z',
    updatedAt: '2026-02-21T09:00:00Z',
    status: 'grazing',
    productName: 'FuelStack',
    oneLinePitch: 'AI that syncs your workout and nutrition so every meal fuels your next session.',
    targetAudience: 'Intermediate gym-goers who track macros and want personalized meal plans that adapt to training',
    coreFeatures: ['AI meal plans based on workout schedule', 'Dietary restriction engine (keto, vegan, allergies)', 'Post-workout meal optimizer', 'Grocery list generator', 'Progress photos with body composition AI'],
    differentiationAngle: 'First app that connects workout data to meal planning. Other apps do one or the other -- FuelStack does both and adjusts automatically.',
    monetizationModel: 'subscription',
    pricingRecommendation: 15,
    estimatedBuildDays: 28,
    buildDaysMin: 18,
    buildDaysMax: 42,
    buildDaysContext: 'For solo developer -- meal database integration is the bottleneck',
    marketDemandScore: 72,
    marketDemandScoreVerified: 70,
    competitionDensityScore: 40,
    buildComplexityScore: 55,
    revenuePotentialScore: 65,
    revenuePotentialScoreVerified: 60,
    aiBuildabilityScore: 55,
    overallScore: 62,
    confidenceLevel: 'high',
    verificationPercentage: 78,
    revenuePotentialMin: 5000,
    revenuePotentialMax: 25000,
    revenuePotentialBasis: 'Based on 3 verified competitors (MyFitnessPal $0-20, Fitbod $13, MacroFactor $12)',
    whyWorksData: { trendVelocity: 'AI health market growing 38% YoY, integration is #1 pain point', adSpendInsight: 'Fitbod spends $150K/mo, MacroFactor growing fast via organic', complaintClusters: ['No nutrition-workout integration', 'Generic meal plans', 'Ignores allergies'] },
    whyMightFail: { risks: ['Apple Health + Shortcuts could replicate', 'Food database licensing is expensive', 'User retention drops after initial motivation'], marketSaturation: false, buildComplexity: 'High -- food DB, workout tracking, AI personalization' },
    variationLevels: { micro: { name: 'Meal Matcher', features: ['Post-workout meal suggestions', 'Macro calculator', 'Allergy filters'], buildDays: 7, pricing: 5 }, standard: { name: 'FuelStack', features: ['Full meal planning', 'Workout sync', 'Grocery lists', 'Diet engine', 'Progress tracking'], buildDays: 28, pricing: 15 }, premium: { name: 'Coach Mode', features: ['1:1 AI coaching', 'Body composition analysis', 'Supplement recs', 'Competition prep', 'API for wearables'], buildDays: 50, pricing: 39 } },
    snapshotId: 'snap-fitness-tech',
  },
  {
    id: 'calf-inbox-zero',
    userId: 'demo',
    niche: 'Email Marketing Automation',
    createdAt: '2026-02-23T11:00:00Z',
    updatedAt: '2026-02-23T11:00:00Z',
    status: 'milking',
    productName: 'ReaderPulse',
    oneLinePitch: 'Newsletter platform that personalizes every email based on what each subscriber actually reads.',
    targetAudience: 'Newsletter creators with 1K-50K subscribers who want better engagement without more writing',
    coreFeatures: ['Interest-based subscriber segmentation from reading behavior', 'Automatic content personalization per segment', 'Deliverability optimizer (send time, warmup, authentication)', 'Revenue-share pricing model', 'A/B testing with AI winner detection'],
    differentiationAngle: 'Revenue-share pricing so you only pay when your newsletter makes money. Plus behavior-based personalization that no competitor offers at this price point.',
    monetizationModel: 'subscription',
    pricingRecommendation: 29,
    estimatedBuildDays: 35,
    buildDaysMin: 24,
    buildDaysMax: 52,
    buildDaysContext: 'For solo developer -- email deliverability infrastructure is complex',
    marketDemandScore: 82,
    marketDemandScoreVerified: 80,
    competitionDensityScore: 45,
    buildComplexityScore: 60,
    revenuePotentialScore: 78,
    revenuePotentialScoreVerified: 75,
    aiBuildabilityScore: 50,
    overallScore: 70,
    confidenceLevel: 'high',
    verificationPercentage: 88,
    revenuePotentialMin: 10000,
    revenuePotentialMax: 45000,
    revenuePotentialBasis: 'Based on 3 verified competitors (Beehiiv $0-99, ConvertKit $0-59, Mailchimp $0-350)',
    monthlyRevenue: 2800,
    whyWorksData: { trendVelocity: 'Newsletter economy booming, $2.7B market by 2027', adSpendInsight: 'Beehiiv spending $100K+/mo on growth, ConvertKit $200K+/mo', complaintClusters: ['Deliverability issues', 'Expensive at scale', 'Poor personalization'] },
    whyMightFail: { risks: ['Deliverability requires dedicated IPs and reputation building', 'Revenue-share model caps upside', 'Big players could add personalization'], marketSaturation: false, buildComplexity: 'High -- email infrastructure, personalization engine, deliverability' },
    variationLevels: { micro: { name: 'Send Better', features: ['Send time optimizer', 'Subject line A/B', 'Deliverability check'], buildDays: 7, pricing: 9 }, standard: { name: 'ReaderPulse', features: ['Behavior segmentation', 'Content personalization', 'Deliverability suite', 'Revenue share', 'Analytics'], buildDays: 35, pricing: 29 }, premium: { name: 'Publisher', features: ['Ad marketplace', 'Multi-newsletter', 'Custom domains', 'API access', 'White-label'], buildDays: 60, pricing: 99 } },
    snapshotId: 'snap-email-marketing',
  },
  {
    id: 'calf-dev-tools',
    userId: 'demo',
    niche: 'AI Writing Tools',
    createdAt: '2026-02-17T16:00:00Z',
    updatedAt: '2026-02-17T16:00:00Z',
    status: 'grazing',
    productName: 'DocPilot',
    oneLinePitch: 'AI that writes and maintains your technical documentation by reading your actual codebase.',
    targetAudience: 'Dev teams at startups (5-50 engineers) who never have time to write docs',
    coreFeatures: ['Git-connected doc generation from code changes', 'API reference auto-generation', 'Changelog automation', 'Doc freshness alerts when code changes', 'Search-optimized developer portal'],
    differentiationAngle: 'Reads your git history and code to generate docs that stay up-to-date automatically. Other tools make YOU write docs -- DocPilot writes them for you.',
    monetizationModel: 'saas',
    pricingRecommendation: 79,
    estimatedBuildDays: 30,
    buildDaysMin: 20,
    buildDaysMax: 45,
    buildDaysContext: 'For developer familiar with Git APIs and AI',
    marketDemandScore: 70,
    marketDemandScoreVerified: 68,
    competitionDensityScore: 30,
    buildComplexityScore: 50,
    revenuePotentialScore: 75,
    revenuePotentialScoreVerified: 72,
    aiBuildabilityScore: 60,
    overallScore: 71,
    confidenceLevel: 'high',
    verificationPercentage: 80,
    revenuePotentialMin: 12000,
    revenuePotentialMax: 50000,
    revenuePotentialBasis: 'Based on dev tool pricing benchmarks ($50-200/team/mo for similar tools)',
    whyWorksData: { trendVelocity: 'Developer tools AI market surging, docs are universally hated task', adSpendInsight: 'GitBook, ReadMe spending on "API documentation" keywords', complaintClusters: ['Docs are always outdated', 'No one wants to write docs', 'Existing tools still require manual work'] },
    whyMightFail: { risks: ['GitHub Copilot could add doc generation', 'Requires deep code understanding', 'Enterprise sales cycle'], marketSaturation: false, buildComplexity: 'High -- code parsing, git integration, AI generation' },
    variationLevels: { micro: { name: 'Changelog Bot', features: ['Git-to-changelog', 'PR summaries', 'Slack notifications'], buildDays: 7, pricing: 19 }, standard: { name: 'DocPilot', features: ['Full doc generation', 'API refs', 'Freshness alerts', 'Dev portal', 'Search'], buildDays: 30, pricing: 79 }, premium: { name: 'Enterprise', features: ['Multi-repo', 'SSO', 'Custom themes', 'Audit logs', 'White-label'], buildDays: 60, pricing: 249 } },
    snapshotId: 'snap-ai-writing',
  },
]

// Brief markdown templates for each calf
export const MOCK_BRIEFS: Record<string, string> = {
  'calf-brand-writer': `## Vision & Target Audience

VoiceCraft is an AI writing assistant purpose-built for marketing teams who need to maintain brand voice consistency at scale. Unlike generic AI writers, VoiceCraft trains on YOUR content library to learn your brand's unique voice, tone, and vocabulary.

**Primary Target:** Marketing teams at 10-200 person companies publishing 5+ content pieces per week.

**Key Pain Point Solved:** Teams spend 40%+ of editing time fixing AI-generated content to match brand voice.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **AI:** Claude API for content generation, custom fine-tuning pipeline for brand voice
- **Backend:** Next.js API routes, PostgreSQL via Supabase
- **Infrastructure:** Vercel, Upstash Redis for rate limiting

## MVP Features

1. **Brand Voice Training** -- Upload 10+ existing content pieces. VoiceCraft analyzes vocabulary, sentence structure, tone patterns, and formality level to build a brand voice profile.

2. **Tone Consistency Scorer** -- Real-time scoring per paragraph showing how well the content matches your brand voice. Think Grammarly, but for brand consistency.

3. **SEO Optimization with Search Intent** -- Goes beyond keyword stuffing. Analyzes top 10 SERP results for your target keyword and suggests content structure, headers, and angles based on search intent.

4. **Team Collaboration** -- Approval workflows so editors can review AI-generated content before publishing. Comments, version history, and role-based access.

5. **API Access** -- REST API for integrating VoiceCraft into existing content pipelines (WordPress, Webflow, custom CMS).

## Data Model

- **BrandProfile:** voice_attributes, vocabulary_weights, tone_parameters, training_corpus_metadata
- **ContentDraft:** title, body, brand_score, seo_score, status, reviewer, created_by
- **TeamMember:** user_id, role, permissions, brand_profiles_access

## Revenue Model

- **Starter:** $29/mo -- 1 brand voice, 50K words/mo, 2 users
- **Growth:** $49/mo -- 3 brand voices, unlimited words, 5 users, API access
- **Enterprise:** $199/mo -- Unlimited voices, custom models, SSO, dedicated support

## Build Timeline

- Week 1-2: Brand voice training pipeline + API
- Week 3: Tone scoring engine + editor UI
- Week 4: SEO module + team features
- Week 5: API access + polish + launch prep

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| GPT-5 adds native brand voice | Deeper training on actual content, not just style prompts |
| Enterprise sales cycle | Start with self-serve for small teams, expand to enterprise later |
| Competitive market | Focus on brand voice accuracy as the #1 differentiator |`,

  'calf-solo-pm': `## Vision & Target Audience

SoloShip is project management software built exclusively for one-person businesses. Not a stripped-down version of enterprise tools -- built from scratch for how solo operators actually work.

**Primary Target:** Solo founders, freelancers, and indie hackers managing 2-5 projects simultaneously.

**Key Pain Point Solved:** Every PM tool assumes teams. Solopreneurs waste time in tools built for org charts they don't have.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **AI:** Claude API for daily priorities and weekly reviews
- **Calendar:** Google Calendar API integration

## MVP Features

1. **Single-View Dashboard** -- See all projects, today's tasks, revenue, and upcoming deadlines in one screen. No clicking through 5 views to understand your day.

2. **AI Daily Priorities** -- Each morning, SoloShip analyzes deadlines, project momentum, and revenue impact to suggest your top 3 tasks for the day.

3. **Revenue Tracking Per Project** -- Track how much each project earns. See which projects are worth your time and which are time sinks.

4. **Time Blocking with Calendar Sync** -- Drag tasks into time blocks that sync to Google Calendar. Guard your deep work time.

5. **One-Click Weekly Review** -- AI generates a weekly summary: what you accomplished, what slipped, revenue changes, and suggestions for next week.

## Revenue Model

- **Free:** 1 project, basic task management
- **Solo:** $12/mo -- unlimited projects, AI priorities, revenue tracking, calendar sync
- **Pro:** $29/mo -- client portal, invoicing, financial reports, automations, API

## Build Timeline

- Week 1: Dashboard + task management core
- Week 2: AI priorities + calendar sync
- Week 3: Revenue tracking + weekly reviews
- Week 4: Polish, mobile responsiveness, launch`,

  'calf-fit-ai': `## Vision & Target Audience

FuelStack is the first fitness app that truly connects your workout data to your nutrition plan. Every meal is designed to fuel your next session, recover from your last one, and hit your macro targets.

**Primary Target:** Intermediate gym-goers who track macros and want AI-personalized meal plans that adapt to training.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Supabase, food database API (Nutritionix or USDA)
- **AI:** Claude API for meal generation and workout analysis
- **Mobile:** PWA with offline support

## MVP Features

1. **AI Meal Plans Based on Workout Schedule** -- Tell FuelStack your training split. It generates daily meal plans with higher carbs on leg day, more protein post-push, lighter meals on rest days.

2. **Dietary Restriction Engine** -- Keto, vegan, paleo, allergies, intolerances -- all handled. No more "just remove the bread" suggestions.

3. **Post-Workout Meal Optimizer** -- Immediate post-workout nutrition recommendations based on the specific muscles trained and session intensity.

4. **Grocery List Generator** -- Weekly grocery list from your meal plan. Grouped by store section. Estimated cost.

5. **Progress Photos with Body Composition AI** -- Track visual progress with AI that estimates body fat percentage from photos (with appropriate disclaimers about accuracy).

## Revenue Model

- **Free:** Basic macro calculator + 3 meal suggestions/day
- **Standard:** $15/mo -- Full meal planning, workout sync, grocery lists
- **Coach Mode:** $39/mo -- AI coaching, body composition, supplement recs, wearable integration`,

  'calf-inbox-zero': `## Vision & Target Audience

ReaderPulse is a newsletter platform that personalizes every email based on what each subscriber actually reads. Plus a revenue-share pricing model so creators only pay when they earn.

**Primary Target:** Newsletter creators with 1K-50K subscribers wanting better engagement without writing more.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Email:** Resend API or custom SMTP, DKIM/SPF/DMARC setup
- **Backend:** Supabase (PostgreSQL + Auth)
- **AI:** Claude API for content personalization and A/B testing

## MVP Features

1. **Interest-Based Subscriber Segmentation** -- Track what links subscribers click, how far they scroll, and which topics they engage with. Auto-segment without manual tagging.

2. **Automatic Content Personalization** -- Send one newsletter that renders differently per segment. Tech readers see more code examples, business readers see more case studies.

3. **Deliverability Optimizer** -- AI-optimized send times per subscriber, automatic warmup for new domains, authentication checker, spam score preview.

4. **Revenue-Share Pricing** -- Base plan is free up to 1K subscribers. Above that, pay 5% of newsletter revenue instead of a flat monthly fee.

5. **A/B Testing with AI Winner Detection** -- Test subject lines, content blocks, and send times. AI declares a winner early using statistical significance, not arbitrary time limits.

## Revenue Model

- **Free:** Up to 1K subscribers, basic analytics
- **Growth:** 5% revenue share -- all features, unlimited subscribers
- **Publisher:** $99/mo flat -- for high-volume creators who prefer predictable costs`,

  'calf-dev-tools': `## Vision & Target Audience

DocPilot automatically writes and maintains your technical documentation by reading your actual codebase. Git-connected, always fresh, zero manual effort.

**Primary Target:** Dev teams at startups (5-50 engineers) who never have time to write docs.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Supabase, GitHub API, GitLab API
- **AI:** Claude API with extended context for code analysis
- **Search:** Algolia or Meilisearch for doc search

## MVP Features

1. **Git-Connected Doc Generation** -- Connect your repo. DocPilot reads your code, types, comments, and git history to generate comprehensive documentation automatically.

2. **API Reference Auto-Generation** -- Detects REST endpoints, GraphQL schemas, and TypeScript interfaces. Generates interactive API docs with request/response examples.

3. **Changelog Automation** -- Every merge to main generates a human-readable changelog entry from PR titles, descriptions, and diff analysis.

4. **Doc Freshness Alerts** -- When code changes but related docs don't, DocPilot alerts the team and suggests updates. No more "this doc is 6 months out of date."

5. **Search-Optimized Developer Portal** -- Auto-generated docs site with full-text search, syntax highlighting, and mobile-friendly design.

## Revenue Model

- **Starter:** $19/mo -- 1 repo, changelog + API refs
- **Team:** $79/mo -- 5 repos, full doc generation, freshness alerts, dev portal
- **Enterprise:** $249/mo -- unlimited repos, SSO, custom themes, audit logs`,
}

export function getExampleSnapshots(): readonly MarketSnapshot[] {
  return EXAMPLE_SNAPSHOTS
}

export function getExampleCalves(): readonly Calf[] {
  return MOCK_CALVES
}

export function getSnapshotById(id: string): MarketSnapshot | undefined {
  return EXAMPLE_SNAPSHOTS.find((s) => s.id === id)
}

export function getCalfById(id: string): Calf | undefined {
  return MOCK_CALVES.find((c) => c.id === id)
}

export function getCalvesBySnapshot(snapshotId: string): readonly Calf[] {
  return MOCK_CALVES.filter((c) => c.snapshotId === snapshotId)
}

export function getCalvesByStatus(status: string): readonly Calf[] {
  if (status === 'all') return MOCK_CALVES
  return MOCK_CALVES.filter((c) => c.status === status)
}

export function sortCalves(calves: readonly Calf[], sortBy: string): readonly Calf[] {
  const sorted = [...calves]
  switch (sortBy) {
    case 'overall_score':
      sorted.sort((a, b) => b.overallScore - a.overallScore)
      break
    case 'monthly_revenue':
      sorted.sort((a, b) => (b.monthlyRevenue ?? 0) - (a.monthlyRevenue ?? 0))
      break
    case 'created_at':
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    default:
      sorted.sort((a, b) => b.overallScore - a.overallScore)
  }
  return sorted
}
