import { NextResponse } from 'next/server'
import { z } from 'zod'
import { logError, checkRateLimit, recordAiRequest } from '@/lib/error-logger'
import { getUser } from '@/lib/auth/server'
import type { Calf } from '@/lib/types'

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || ''
const CLAUDE_MODEL = 'claude-sonnet-4-20250514'

const CustomBriefSchema = z.object({
  calf: z.object({
    productName: z.string(),
    oneLinePitch: z.string(),
    targetAudience: z.string(),
    niche: z.string(),
    coreFeatures: z.array(z.string()),
    differentiationAngle: z.string(),
    monetizationModel: z.string(),
    pricingRecommendation: z.number(),
    buildDaysMin: z.number(),
    buildDaysMax: z.number(),
    revenuePotentialMin: z.number(),
    revenuePotentialMax: z.number(),
    variationLevels: z.object({
      micro: z.object({ name: z.string(), features: z.array(z.string()), buildDays: z.number(), pricing: z.number() }),
      standard: z.object({ name: z.string(), features: z.array(z.string()), buildDays: z.number(), pricing: z.number() }),
      premium: z.object({ name: z.string(), features: z.array(z.string()), buildDays: z.number(), pricing: z.number() }),
    }),
  }).passthrough(),
  sections: z.array(z.string()).min(1),
  customSections: z.array(z.string()).optional().default([]),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = CustomBriefSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    if (!CLAUDE_API_KEY) {
      return NextResponse.json({ error: 'CLAUDE_API_KEY not configured' }, { status: 500 })
    }

    const user = await getUser()
    if (user?.id) {
      const allowed = await checkRateLimit(user.id, 'brief', 20)
      if (!allowed) {
        return NextResponse.json({ error: 'Daily brief limit reached. Try again tomorrow.' }, { status: 429 })
      }
      await recordAiRequest(user.id, 'brief')
    }

    const { calf, sections, customSections } = parsed.data
    const allSections = [...sections, ...customSections]

    const system = `You are a senior product architect. Write a customized build brief in markdown.

ONLY include these sections (as ## headers):
${allSections.map((s) => `- ${s}`).join('\n')}

Be specific, practical, and detailed for each section. Skip any sections not listed above.`

    const userPrompt = `Write a build brief for:

Product: ${calf.productName}
Pitch: ${calf.oneLinePitch}
Target: ${calf.targetAudience}
Niche: ${calf.niche}
Features: ${JSON.stringify(calf.coreFeatures)}
Differentiation: ${calf.differentiationAngle}
Monetization: ${calf.monetizationModel}
Pricing: $${calf.pricingRecommendation}/mo
Build: ${calf.buildDaysMin}-${calf.buildDaysMax} days
Revenue: $${calf.revenuePotentialMin}-$${calf.revenuePotentialMax}/mo
Variations: ${JSON.stringify(calf.variationLevels)}`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 4000,
        system,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Claude API error: ${res.status} ${err}`)
    }

    const data = await res.json()
    const content = data.content?.[0]
    if (content?.type !== 'text') throw new Error('Unexpected response format')

    return NextResponse.json({ brief: content.text })
  } catch (error) {
    logError('custom-brief-route', error)
    const message = error instanceof Error ? error.message : 'Custom brief generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
