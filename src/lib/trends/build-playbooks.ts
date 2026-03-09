import type { Trend } from '@/lib/trends/types'

export interface ProductIdea {
  readonly name: string
  readonly description: string
  readonly targetCustomer: string
  readonly revenueModel: string
  readonly estimatedMRR: string
  readonly difficulty: 'Low' | 'Medium' | 'High'
}

export interface BuildPlaybook {
  readonly trendId: string
  readonly verdict: 'Build Now' | 'Watch Closely' | 'Too Early' | 'Too Late' | 'High Risk'
  readonly verdictReason: string
  readonly productIdeas: readonly ProductIdea[]
  readonly targetMarket: string
  readonly timeToFirstRevenue: string
  readonly riskFactors: readonly string[]
  readonly buildAdvice: string
}

const playbooks: ReadonlyMap<string, BuildPlaybook> = new Map([
  ['trend-001', {
    trendId: 'trend-001',
    verdict: 'Build Now' as const,
    verdictReason: 'Massive demand, market leader not decided yet, 6-12 month window before commoditization.',
    productIdeas: [
      {
        name: 'Vertical AI Agent Platform',
        description: 'Pre-built AI agents for specific industries (real estate, legal, healthcare) that non-technical users can deploy.',
        targetCustomer: 'SMB owners in regulated industries',
        revenueModel: 'Monthly SaaS ($99-499/mo per agent)',
        estimatedMRR: '$50K-200K at 500 customers',
        difficulty: 'High' as const,
      },
      {
        name: 'Agent Monitoring Dashboard',
        description: 'Observability tool that tracks AI agent actions, costs, errors, and business outcomes in real-time.',
        targetCustomer: 'Engineering teams deploying AI agents',
        revenueModel: 'Usage-based ($0.001 per agent action logged)',
        estimatedMRR: '$30K-100K',
        difficulty: 'Medium' as const,
      },
      {
        name: 'AI Agent Marketplace',
        description: 'Curated marketplace where developers sell pre-configured agents for specific workflows.',
        targetCustomer: 'Business operators looking for ready-made automation',
        revenueModel: '15-30% marketplace commission',
        estimatedMRR: '$10K-80K',
        difficulty: 'Medium' as const,
      },
    ],
    targetMarket: 'SMBs and mid-market companies adopting AI automation for the first time.',
    timeToFirstRevenue: '3-4 months with an MVP focused on one vertical',
    riskFactors: [
      'OpenAI, Google, and Anthropic may build native agent platforms',
      'Requires reliable LLM infrastructure with tight error handling',
      'Customer support burden is high for non-technical users',
    ],
    buildAdvice: 'Pick ONE vertical (e.g. real estate agents). Build a single-purpose agent that does one thing extremely well. Expand to adjacent verticals after proving PMF.',
  }],
  ['trend-002', {
    trendId: 'trend-002',
    verdict: 'Build Now' as const,
    verdictReason: 'Fine-tuning costs dropped 60% in 12 months. No-code interfaces are the unlock for non-ML teams.',
    productIdeas: [
      {
        name: 'No-Code Fine-Tuning Studio',
        description: 'Drag-and-drop interface for uploading data, fine-tuning models, and deploying endpoints without code.',
        targetCustomer: 'Marketing teams, content agencies, customer support teams',
        revenueModel: 'Per-model pricing ($49-199 per fine-tune + hosting)',
        estimatedMRR: '$40K-150K',
        difficulty: 'High' as const,
      },
      {
        name: 'Training Data Curator',
        description: 'Tool that helps teams collect, clean, label, and validate training data from their existing documents.',
        targetCustomer: 'Any company wanting to fine-tune but struggling with data quality',
        revenueModel: 'SaaS ($99-299/mo)',
        estimatedMRR: '$20K-80K',
        difficulty: 'Medium' as const,
      },
    ],
    targetMarket: 'Non-technical teams at companies with 50-500 employees who want custom AI models.',
    timeToFirstRevenue: '4-6 months',
    riskFactors: [
      'OpenAI and Anthropic are making fine-tuning easier natively',
      'Data privacy concerns with customer training data',
      'GPU costs for running fine-tune jobs can eat margins',
    ],
    buildAdvice: 'Start with one model provider (OpenAI). Make the data upload and validation experience exceptional. The UX of data prep is the moat, not the fine-tuning itself.',
  }],
  ['trend-003', {
    trendId: 'trend-003',
    verdict: 'Too Early' as const,
    verdictReason: 'Enterprise trust in synthetic data is not there yet. Academic research is strong but commercial adoption is 18-24 months out.',
    productIdeas: [
      {
        name: 'Synthetic Data Quality Benchmark',
        description: 'Tool that generates synthetic datasets and provides quality scores showing parity with real data.',
        targetCustomer: 'ML teams needing training data for regulated industries',
        revenueModel: 'Enterprise contracts ($2K-10K/mo)',
        estimatedMRR: '$15K-60K',
        difficulty: 'High' as const,
      },
    ],
    targetMarket: 'Healthcare and autonomous vehicle companies with data scarcity problems.',
    timeToFirstRevenue: '8-12 months (long enterprise sales cycles)',
    riskFactors: [
      'Enterprise buyers need proof that synthetic data does not degrade model quality',
      'Regulatory uncertainty around training on generated data',
      'Requires deep domain expertise per vertical',
    ],
    buildAdvice: 'Wait 12 months. The benchmark studies are not convincing enough yet. When they are, move fast on the tooling layer.',
  }],
  ['trend-004', {
    trendId: 'trend-004',
    verdict: 'Watch Closely' as const,
    verdictReason: 'Massive market but capital-intensive. The infrastructure players are well-funded. Build on top of them, not against them.',
    productIdeas: [
      {
        name: 'AI Ad Creative Studio',
        description: 'Video ad generation tool that takes product photos and generates social media video ads in seconds.',
        targetCustomer: 'E-commerce brands and DTC marketers',
        revenueModel: 'Credits-based ($29-199/mo for X videos)',
        estimatedMRR: '$30K-120K',
        difficulty: 'Medium' as const,
      },
      {
        name: 'Training Video Generator',
        description: 'Convert SOPs and documentation into training videos with AI presenters and screen recordings.',
        targetCustomer: 'HR departments and corporate training teams',
        revenueModel: 'SaaS ($99-499/mo)',
        estimatedMRR: '$25K-100K',
        difficulty: 'Medium' as const,
      },
    ],
    targetMarket: 'Vertical niches where video creation is expensive but necessary (ads, training, real estate).',
    timeToFirstRevenue: '3-5 months using existing video APIs (Runway, Pika)',
    riskFactors: [
      'API costs from video generation providers are high',
      'Quality bar is rising fast -- today\'s impressive output is tomorrow\'s minimum',
      'Compute-heavy workloads can crush margins',
    ],
    buildAdvice: 'Don\'t build a general video generator. Pick one use case (ad creative for e-commerce) and make the workflow seamless from product photo to published ad.',
  }],
  ['trend-005', {
    trendId: 'trend-005',
    verdict: 'Too Early' as const,
    verdictReason: 'Hardware cycle dependent. Consumer devices with ML chips need 2-3 more years to reach critical mass.',
    productIdeas: [
      {
        name: 'Edge Model Optimizer',
        description: 'Tool that compresses and quantizes ML models for on-device deployment across mobile and IoT.',
        targetCustomer: 'Mobile app developers, IoT product teams',
        revenueModel: 'SaaS ($199-999/mo)',
        estimatedMRR: '$15K-50K',
        difficulty: 'High' as const,
      },
    ],
    targetMarket: 'Mobile developers building privacy-first AI features.',
    timeToFirstRevenue: '6-9 months',
    riskFactors: [
      'Apple and Google are building native ML optimization into their SDKs',
      'Fragmentation across chip architectures is a nightmare',
      'Small addressable market today',
    ],
    buildAdvice: 'Wait for the next iPhone/Pixel chip cycle. When on-device ML becomes standard hardware, the tooling market will explode. Build the developer tools then.',
  }],
  ['trend-006', {
    trendId: 'trend-006',
    verdict: 'Too Late' as const,
    verdictReason: 'Market leader position decided. Copilot, Cursor, and Claude Code dominate. New entrants are getting crushed.',
    productIdeas: [
      {
        name: 'AI Code Review Bot',
        description: 'Automated PR reviewer that catches bugs, suggests improvements, and enforces team conventions.',
        targetCustomer: 'Engineering managers at teams of 10-50 developers',
        revenueModel: 'Per-seat SaaS ($15-30/developer/mo)',
        estimatedMRR: '$20K-80K',
        difficulty: 'Medium' as const,
      },
    ],
    targetMarket: 'Engineering teams already using AI coding tools who want the review layer.',
    timeToFirstRevenue: '2-3 months',
    riskFactors: [
      'GitHub Copilot is adding review features natively',
      'Price compression as coding tools commoditize',
      'Developer fatigue with new AI tools',
    ],
    buildAdvice: 'Avoid this market. The window has closed. If you must build here, target the code review niche specifically, not code generation.',
  }],
  ['trend-007', {
    trendId: 'trend-007',
    verdict: 'Watch Closely' as const,
    verdictReason: 'Technically feasible but PMF is still being discovered. Best opportunities are where multiple modalities are required, not optional.',
    productIdeas: [
      {
        name: 'Medical Image + Notes Analyzer',
        description: 'Tool that combines medical imaging analysis with clinical notes to provide comprehensive diagnostic suggestions.',
        targetCustomer: 'Radiology practices, pathology labs',
        revenueModel: 'Per-scan pricing ($2-5 per analysis)',
        estimatedMRR: '$30K-100K',
        difficulty: 'High' as const,
      },
      {
        name: 'Content Accessibility Tool',
        description: 'Automatically generates alt-text, audio descriptions, and transcripts for all media types in one pass.',
        targetCustomer: 'Content teams at enterprises with compliance requirements',
        revenueModel: 'Usage-based ($0.10 per media asset processed)',
        estimatedMRR: '$10K-40K',
        difficulty: 'Low' as const,
      },
    ],
    targetMarket: 'Verticals where analyzing multiple data types simultaneously is a workflow requirement, not a nice-to-have.',
    timeToFirstRevenue: '4-6 months',
    riskFactors: [
      'API costs stack up when calling multiple modality endpoints',
      'Accuracy requirements are extremely high in healthcare',
      'General-purpose multimodal tools are being commoditized by big labs',
    ],
    buildAdvice: 'Find a use case where the user MUST combine modalities (medical imaging + notes, real estate photos + descriptions). Don\'t build a general multimodal tool.',
  }],
  ['trend-008', {
    trendId: 'trend-008',
    verdict: 'Build Now' as const,
    verdictReason: 'Stripe-for-X playbook is proven. Vertical SaaS platforms are integrating finance features and need infrastructure providers.',
    productIdeas: [
      {
        name: 'Lending-as-a-Service for Vertical SaaS',
        description: 'API that lets SaaS platforms offer loans to their SMB customers without becoming a bank.',
        targetCustomer: 'Vertical SaaS companies wanting to add financial products',
        revenueModel: 'Revenue share on loan origination (1-3%)',
        estimatedMRR: '$20K-100K',
        difficulty: 'High' as const,
      },
      {
        name: 'Invoice Factoring Widget',
        description: 'Embeddable component that lets platform users sell unpaid invoices for immediate cash.',
        targetCustomer: 'Freelance platforms, contractor marketplaces',
        revenueModel: 'Factoring fee (2-5% of invoice value)',
        estimatedMRR: '$15K-60K',
        difficulty: 'Medium' as const,
      },
    ],
    targetMarket: 'Vertical SaaS platforms serving SMBs who need cash flow solutions.',
    timeToFirstRevenue: '6-8 months (regulatory setup required)',
    riskFactors: [
      'Requires banking partner and compliance infrastructure',
      'OCC regulatory scrutiny on BaaS sponsors is increasing',
      'Credit risk management is operationally complex',
    ],
    buildAdvice: 'Partner with an established BaaS provider (Unit, Bond, Treasury Prime). Focus on one financial product for one vertical first.',
  }],
  ['trend-009', {
    trendId: 'trend-009',
    verdict: 'High Risk' as const,
    verdictReason: 'Regulatory headwinds are severe. CFPB scrutiny makes this a minefield for startups without legal teams.',
    productIdeas: [
      {
        name: 'Alternative Data Credit API',
        description: 'API that supplements FICO scores with behavioral signals from rent, utility, and subscription payments.',
        targetCustomer: 'Lenders, fintech companies',
        revenueModel: 'Per-query API pricing ($0.50-2.00 per credit check)',
        estimatedMRR: '$10K-40K',
        difficulty: 'High' as const,
      },
    ],
    targetMarket: 'Fintech lenders targeting thin-file borrowers (immigrants, young adults, gig workers).',
    timeToFirstRevenue: '12-18 months',
    riskFactors: [
      'Fair lending compliance is extremely complex',
      'CFPB can issue enforcement actions at any time',
      'Data sourcing agreements are difficult to secure',
      'Established credit bureaus are building their own alternative models',
    ],
    buildAdvice: 'Only enter this space if you have regulatory expertise on your team. The technology is the easy part -- the compliance is the moat.',
  }],
  ['trend-016', {
    trendId: 'trend-016',
    verdict: 'Build Now' as const,
    verdictReason: 'AI tutoring shows 2-sigma improvement in learning outcomes. Consumer direct-to-student is faster than B2B school procurement.',
    productIdeas: [
      {
        name: 'Subject-Specific AI Tutor',
        description: 'AI tutor focused on one subject (SAT math, AP Chemistry) with adaptive practice and explanations.',
        targetCustomer: 'High school students and parents',
        revenueModel: 'Subscription ($19-49/mo)',
        estimatedMRR: '$30K-150K',
        difficulty: 'Medium' as const,
      },
      {
        name: 'AI Teaching Assistant Platform',
        description: 'Tool for teachers that auto-grades assignments, generates personalized feedback, and identifies struggling students.',
        targetCustomer: 'K-12 teachers and school districts',
        revenueModel: 'Per-teacher SaaS ($15-30/teacher/mo)',
        estimatedMRR: '$20K-80K',
        difficulty: 'Medium' as const,
      },
    ],
    targetMarket: 'Parents of high school students willing to pay for tutoring alternatives.',
    timeToFirstRevenue: '3-4 months with a focused MVP',
    riskFactors: [
      'Khan Academy and others have strong head starts',
      'Parents are skeptical of AI teaching their kids',
      'Student engagement/retention is hard to maintain',
    ],
    buildAdvice: 'Target one standardized test (SAT, ACT, or specific AP exam). The scoring criteria are objective and measurable, making it easy to prove value.',
  }],
  ['trend-021', {
    trendId: 'trend-021',
    verdict: 'Build Now' as const,
    verdictReason: 'Low competition, clear pain point (maintaining brand consistency across AI-generated content), growing TAM.',
    productIdeas: [
      {
        name: 'Brand Voice Linter',
        description: 'Browser extension and API that checks AI-generated content against a company\'s brand voice guidelines.',
        targetCustomer: 'Marketing teams at companies using AI for content',
        revenueModel: 'SaaS ($49-199/mo per team)',
        estimatedMRR: '$15K-60K',
        difficulty: 'Low' as const,
      },
      {
        name: 'Content Style Guide Generator',
        description: 'Analyze a company\'s existing content and auto-generate a comprehensive style guide with AI enforcement.',
        targetCustomer: 'Content agencies and marketing departments',
        revenueModel: 'One-time + subscription ($199 setup + $49/mo)',
        estimatedMRR: '$10K-40K',
        difficulty: 'Low' as const,
      },
    ],
    targetMarket: 'Companies producing 50+ pieces of AI-generated content per month.',
    timeToFirstRevenue: '2-3 months',
    riskFactors: [
      'Grammarly and other writing tools may add brand voice features',
      'Hard to measure ROI precisely',
      'Small-ish TAM until AI content generation is even more widespread',
    ],
    buildAdvice: 'Start with a Chrome extension that works inside ChatGPT, Claude, and Google Docs. Make brand voice setup take under 5 minutes. Speed of setup is the differentiator.',
  }],
  ['trend-025', {
    trendId: 'trend-025',
    verdict: 'Build Now' as const,
    verdictReason: 'Green field market with compounding data moat. Every company using LLMs needs this. First-mover advantage is high.',
    productIdeas: [
      {
        name: 'LLM Cost & Quality Dashboard',
        description: 'Plug-and-play SDK that tracks every LLM API call: cost, latency, token usage, and output quality scores.',
        targetCustomer: 'Engineering teams with LLM-powered features in production',
        revenueModel: 'Usage-based ($0.001 per logged call + tiered plans)',
        estimatedMRR: '$20K-100K',
        difficulty: 'Medium' as const,
      },
      {
        name: 'Prompt Performance Tracker',
        description: 'A/B testing and version control for prompts with automatic regression detection.',
        targetCustomer: 'AI product teams iterating on prompts',
        revenueModel: 'SaaS ($99-499/mo)',
        estimatedMRR: '$15K-60K',
        difficulty: 'Medium' as const,
      },
    ],
    targetMarket: 'Engineering teams at companies spending $1K+ per month on LLM API calls.',
    timeToFirstRevenue: '3-4 months',
    riskFactors: [
      'Datadog and New Relic are entering this space',
      'Open-source alternatives (Langfuse, LangSmith) have traction',
      'LLM providers may build observability into their dashboards',
    ],
    buildAdvice: 'Build the open-source SDK, monetize the hosted dashboard. The data moat comes from cross-customer benchmarks. The more customers you have, the better your benchmark data.',
  }],
  ['trend-027', {
    trendId: 'trend-027',
    verdict: 'Build Now' as const,
    verdictReason: 'TikTok Shop proved the model. Infrastructure for brands managing social commerce operations is early and high-margin.',
    productIdeas: [
      {
        name: 'Social Commerce Analytics Hub',
        description: 'Unified dashboard tracking sales, engagement, and ROI across TikTok Shop, Instagram Shopping, and YouTube Shopping.',
        targetCustomer: 'E-commerce brands selling on 2+ social platforms',
        revenueModel: 'SaaS ($99-299/mo)',
        estimatedMRR: '$25K-100K',
        difficulty: 'Medium' as const,
      },
      {
        name: 'Livestream Selling Toolkit',
        description: 'All-in-one tool for running live shopping events: product overlay, real-time inventory, replay clips, and analytics.',
        targetCustomer: 'DTC brands doing live selling on social platforms',
        revenueModel: 'Per-event pricing ($49-149 per livestream)',
        estimatedMRR: '$15K-60K',
        difficulty: 'Medium' as const,
      },
    ],
    targetMarket: 'E-commerce brands with $500K+ annual revenue selling on social platforms.',
    timeToFirstRevenue: '4-5 months',
    riskFactors: [
      'Social platform API access can be revoked or restricted',
      'Shopify and BigCommerce are building native integrations',
      'Market is fragmented across platforms',
    ],
    buildAdvice: 'Start with TikTok Shop analytics only. It has the fastest growth and the worst native analytics tools. Expand to Instagram and YouTube after proving value.',
  }],
  ['trend-028', {
    trendId: 'trend-028',
    verdict: 'Watch Closely' as const,
    verdictReason: 'Brand buy-in is real (Patagonia, REI) but logistics are the hard part. Wait for standardization before building.',
    productIdeas: [
      {
        name: 'White-Label Trade-In Platform',
        description: 'Embeddable trade-in widget that brands add to their site to accept and resell used products.',
        targetCustomer: 'DTC brands with strong secondary market demand',
        revenueModel: 'Commission (8-15% of resale value)',
        estimatedMRR: '$15K-50K',
        difficulty: 'High' as const,
      },
    ],
    targetMarket: 'Premium DTC brands in apparel, outdoor gear, and electronics.',
    timeToFirstRevenue: '6-9 months (logistics partnerships required)',
    riskFactors: [
      'Physical logistics (receiving, grading, warehousing) are operationally complex',
      'Trove (acquired by Recurate) has a significant head start',
      'Return fraud is a real problem',
    ],
    buildAdvice: 'The software-only play is the grading and listing tool. Avoid touching physical logistics. Partner with 3PLs who handle the goods.',
  }],
  ['trend-029', {
    trendId: 'trend-029',
    verdict: 'Build Now' as const,
    verdictReason: 'AI product photography is 700x cheaper than studio photography. SMB adoption is just starting. Massive TAM.',
    productIdeas: [
      {
        name: 'AI Product Photo Studio',
        description: 'Upload a product photo, select a lifestyle scene, get studio-quality marketing images in seconds.',
        targetCustomer: 'Shopify sellers, Etsy sellers, Amazon FBA sellers',
        revenueModel: 'Credits-based ($9-49/mo for X images)',
        estimatedMRR: '$20K-100K',
        difficulty: 'Low' as const,
      },
      {
        name: 'Bulk Product Image Generator',
        description: 'Upload a CSV of products and get consistent, on-brand images for entire catalogs.',
        targetCustomer: 'E-commerce brands with 100+ SKUs',
        revenueModel: 'Per-image pricing ($0.10-0.50 per image)',
        estimatedMRR: '$15K-60K',
        difficulty: 'Medium' as const,
      },
    ],
    targetMarket: 'SMB e-commerce sellers who cannot afford professional product photography.',
    timeToFirstRevenue: '2-3 months',
    riskFactors: [
      'Canva and Shopify are adding AI image features',
      'Image quality must meet marketplace listing standards',
      'API costs from image generation providers',
    ],
    buildAdvice: 'Target Shopify App Store distribution. Make the first 5 images free. The conversion rate from free trial to paid is high when sellers see the quality.',
  }],
  ['trend-033', {
    trendId: 'trend-033',
    verdict: 'Too Early' as const,
    verdictReason: 'Technically promising but mainstream user adoption is 2+ years out. Gas sponsorship economics are not solved.',
    productIdeas: [
      {
        name: 'Gasless Wallet SDK',
        description: 'Drop-in SDK for apps to offer seedless, gasless crypto wallets to their users.',
        targetCustomer: 'Web3 game developers, NFT platforms',
        revenueModel: 'Per-transaction fee ($0.01-0.05 per sponsored tx)',
        estimatedMRR: '$5K-30K',
        difficulty: 'High' as const,
      },
    ],
    targetMarket: 'Web3 applications targeting non-crypto-native users.',
    timeToFirstRevenue: '6-9 months',
    riskFactors: [
      'Coinbase, MetaMask, and other incumbents are building smart wallets',
      'Gas sponsorship can be very expensive on Ethereum mainnet',
      'Regulatory classification of smart contract wallets is unclear',
    ],
    buildAdvice: 'Wait for the ERC-4337 ecosystem to mature. The early tooling is being built by well-funded companies (Alchemy, Biconomy). Enter when the standard stabilizes.',
  }],
  ['trend-034', {
    trendId: 'trend-034',
    verdict: 'Watch Closely' as const,
    verdictReason: 'BlackRock validation is real but regulatory risk is significant. Build the compliance/trading infrastructure, not the tokenization itself.',
    productIdeas: [
      {
        name: 'RWA Compliance Engine',
        description: 'Automated KYC/AML and securities compliance for tokenized real-world assets.',
        targetCustomer: 'Token issuers, real estate tokenization platforms',
        revenueModel: 'Per-transaction compliance check ($1-5)',
        estimatedMRR: '$10K-40K',
        difficulty: 'High' as const,
      },
    ],
    targetMarket: 'Institutional tokenization platforms needing regulatory compliance.',
    timeToFirstRevenue: '8-12 months',
    riskFactors: [
      'Regulatory landscape is actively shifting',
      'Requires securities law expertise',
      'Market is small today',
    ],
    buildAdvice: 'Only if you have deep regulatory expertise. The technology is straightforward -- the compliance moat is what matters.',
  }],
  ['trend-039', {
    trendId: 'trend-039',
    verdict: 'Build Now' as const,
    verdictReason: 'Clearest ROI story in AI. Vertical-specific copilots have higher value than generic tools. Long sales cycle but sticky revenue.',
    productIdeas: [
      {
        name: 'Industry-Specific AI Copilot',
        description: 'AI assistant trained on industry knowledge for a specific profession (insurance adjusters, property managers, etc).',
        targetCustomer: 'Mid-market companies in underserved verticals',
        revenueModel: 'Per-seat SaaS ($50-150/user/mo)',
        estimatedMRR: '$30K-150K',
        difficulty: 'Medium' as const,
      },
      {
        name: 'Copilot Builder Platform',
        description: 'No-code platform for companies to build their own internal AI copilot using their documents and workflows.',
        targetCustomer: 'Operations teams at 100-1000 employee companies',
        revenueModel: 'SaaS ($499-2499/mo)',
        estimatedMRR: '$25K-100K',
        difficulty: 'High' as const,
      },
    ],
    targetMarket: 'Mid-market companies (100-1000 employees) in industries underserved by Microsoft Copilot.',
    timeToFirstRevenue: '4-6 months',
    riskFactors: [
      'Microsoft Copilot is the 800-pound gorilla',
      'Enterprise sales cycles are long (3-9 months)',
      'Data privacy concerns with connecting internal systems',
    ],
    buildAdvice: 'Pick an industry Microsoft ignores (pest control, property management, insurance). Build deep domain knowledge into the copilot. The generic tools don\'t understand industry jargon.',
  }],
  ['trend-040', {
    trendId: 'trend-040',
    verdict: 'Build Now' as const,
    verdictReason: 'Unsexy industries have the best returns. Low digital penetration + high switching costs = incredible LTV/CAC.',
    productIdeas: [
      {
        name: 'Niche Industry SaaS',
        description: 'Purpose-built software for an underserved industry (marina management, pest control, funeral homes, etc).',
        targetCustomer: 'Small business owners in the target vertical',
        revenueModel: 'SaaS ($99-299/mo)',
        estimatedMRR: '$30K-150K',
        difficulty: 'Medium' as const,
      },
    ],
    targetMarket: 'Small businesses in industries with less than 20% software penetration.',
    timeToFirstRevenue: '4-6 months',
    riskFactors: [
      'Small TAM per vertical (but high LTV)',
      'Requires deep industry knowledge -- you need to talk to real operators',
      'Support burden is high for non-technical customers',
    ],
    buildAdvice: 'Spend 2 weeks talking to 20 business owners in your target industry before writing any code. Understand their exact workflow. Build exactly what they describe, nothing more.',
  }],
  ['trend-043', {
    trendId: 'trend-043',
    verdict: 'Watch Closely' as const,
    verdictReason: 'Regulatory mandates (SEC, EU CSRD) are creating forced demand. Compliance tooling is the immediate opportunity.',
    productIdeas: [
      {
        name: 'ESG Compliance Autopilot',
        description: 'Automated ESG data collection and report generation for SEC and CSRD compliance.',
        targetCustomer: 'Mid-market companies newly in scope for climate disclosure',
        revenueModel: 'Annual contract ($5K-25K/year)',
        estimatedMRR: '$15K-60K',
        difficulty: 'High' as const,
      },
    ],
    targetMarket: '50,000+ companies newly required to report climate data under CSRD.',
    timeToFirstRevenue: '6-9 months',
    riskFactors: [
      'Regulatory timelines can slip (SEC delays are common)',
      'Big 4 accounting firms are building competing tools',
      'Data collection from supply chains is extremely difficult',
    ],
    buildAdvice: 'Target mid-market companies (500-5000 employees) that cannot afford Big 4 consulting fees. The tool needs to make compliance feel like filling out a form, not hiring a consultant.',
  }],
])

export function getPlaybook(trendId: string): BuildPlaybook | undefined {
  return playbooks.get(trendId)
}

export function getPlaybookVerdict(trendId: string): BuildPlaybook['verdict'] | undefined {
  return playbooks.get(trendId)?.verdict
}

export function getAllPlaybookTrendIds(): readonly string[] {
  return Array.from(playbooks.keys())
}

// Build-Next Score: composite opportunity score
export function calculateBuildNextScore(trend: Trend): number {
  // Components (each 0-100):
  // 1. Momentum: trend_score weighted by stage
  const stageMultiplier: Record<string, number> = {
    'Emerging': 0.7,
    'Accelerating': 1.0,
    'Peaking': 0.5,
    'Saturating': 0.2,
    'Declining': 0.0,
  }
  const momentum = trend.trend_score * (stageMultiplier[trend.current_stage] ?? 0.5)

  // 2. Competition gap: low competition = high score
  const competitionScore: Record<string, number> = {
    'Low': 100,
    'Medium': 60,
    'High': 20,
  }
  const competition = competitionScore[trend.competition_density] ?? 50

  // 3. Monetization readiness
  const monetizationScore: Record<string, number> = {
    'Proven': 100,
    'Emerging': 70,
    'Unknown': 30,
    'None': 0,
  }
  const monetization = monetizationScore[trend.monetization_signal] ?? 30

  // 4. Confidence
  const confidence = trend.confidence_score

  // 5. Build feasibility (inverse of build time -- shorter = better)
  const buildDays = trend.time_to_build_days ?? 90
  const feasibility = Math.max(0, 100 - (buildDays / 2))

  // Weighted composite
  const score = (
    momentum * 0.30 +
    competition * 0.25 +
    monetization * 0.20 +
    confidence * 0.15 +
    feasibility * 0.10
  )

  return Math.round(score)
}

export function getVerdictColor(verdict: BuildPlaybook['verdict']): string {
  switch (verdict) {
    case 'Build Now': return '#22C55E'
    case 'Watch Closely': return '#FFD600'
    case 'Too Early': return '#00D4FF'
    case 'Too Late': return '#EF4444'
    case 'High Risk': return '#F97316'
    default: return 'var(--text-secondary)'
  }
}
