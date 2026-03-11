import { NextResponse } from 'next/server'
import { callLLM } from '@/lib/ai/llm'
import type { BuildSpec } from '@/lib/types'

const SYSTEM_PROMPT = `You are a senior product strategist helping a solo builder create a MONETIZABLE product.

You will receive:
1. An inspiration product (name, tagline, revenue signal) -- this is what the user admires, NOT what they're cloning
2. Their target audience
3. What makes theirs different
4. Features they want
5. Tech preferences

Your job: Generate an ORIGINAL product spec that rides the same market wave as the inspiration but is UNIQUE. Focus heavily on HOW THIS MAKES MONEY.

Return ONLY valid JSON (no markdown, no code fences) matching this exact shape:

{
  "productName": "string - catchy, memorable name",
  "whatYoureBuilding": "string - 2-3 sentences, clear and exciting",
  "whoWantsThis": "string - specific person, their pain, why they'd pay",
  "whyThisCouldWork": "string - honest market assessment with revenue potential",
  "coreFeatures": ["string array - 5-8 MVP features"],
  "techStack": [{"tool": "string", "why": "string"}],
  "buildPlan": ["string array - 8-12 specific steps with file paths"],
  "v2Ideas": ["string array - 3-4 post-MVP features"],
  "risks": ["string array - 2-3 honest risks"],
  "complexity": "weekend | few-weeks | month-plus",
  "monetizationModel": "string - exactly how this makes money (subscription tiers, usage-based, marketplace cut, etc.)",
  "pricingStrategy": "string - specific pricing: free tier, $X/mo pro, $X/mo team. Include why these numbers make sense.",
  "revenueTimeline": "string - realistic month-by-month revenue projection for first 6 months",
  "customerAcquisition": "string - 3-4 specific channels to get first 100 paying customers"
}

Rules:
- This is NOT a clone of the inspiration product. It's ORIGINAL.
- Monetization must be specific: actual dollar amounts, tier names, conversion assumptions
- Revenue timeline must be realistic for a solo builder (not "10M ARR in year 1")
- Customer acquisition must be actionable TODAY (not "go viral")
- Build steps must include file paths, schemas, and component names
- Tech stack: Next.js + Supabase + Tailwind + Vercel unless user specified otherwise
- Be honest about risks`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      inspirationProduct,
      audience,
      differentiator,
      features,
      techPrefs,
    } = body

    if (!inspirationProduct?.name || !audience?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const techContext = techPrefs === 'simple'
      ? 'Use the simplest possible stack: Next.js + Supabase + Tailwind + Vercel.'
      : 'The user wants a custom stack -- suggest the best tools for this specific product.'

    const featureList = features?.length > 0
      ? `Features they want:\n${features.map((f: string) => `- ${f}`).join('\n')}`
      : 'No specific features requested -- suggest the best MVP features.'

    const userPrompt = `INSPIRATION PRODUCT:
Name: ${inspirationProduct.name}
Tagline: ${inspirationProduct.tagline}
Revenue Signal: ${inspirationProduct.revenueSignal}
Topics: ${inspirationProduct.topics?.join(', ') || 'N/A'}

USER'S VISION:
Target audience: ${audience}
What makes theirs different: ${differentiator || 'Not specified -- make it unique.'}
${featureList}
Tech: ${techContext}

Generate an ORIGINAL, MONETIZABLE product spec. This should NOT be a clone of ${inspirationProduct.name}. It should ride the same market wave but solve a different problem for the audience described above. Focus on HOW THIS MAKES MONEY.`

    const raw = await callLLM(SYSTEM_PROMPT, userPrompt, 6000)

    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const spec: BuildSpec = JSON.parse(cleaned)

    return NextResponse.json({ spec })
  } catch (err) {
    console.error('Customize spec error:', err)
    const message = err instanceof Error ? err.message : 'Failed to generate spec'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
