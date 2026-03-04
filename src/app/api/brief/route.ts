import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateBrief } from '@/lib/ai/claude'
import { logError, checkRateLimit, recordAiRequest } from '@/lib/error-logger'
import { getUser } from '@/lib/auth/server'
import { adminClient } from '@/lib/supabase/client'
import type { Calf, MarketSnapshot } from '@/lib/types'

const BriefSchema = z.object({
  calf: z.object({
    id: z.string(),
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
  snapshot: z.object({
    competitorLandscape: z.array(z.object({
      company: z.string(),
      pricing: z.string(),
    }).passthrough()),
  }).passthrough().nullable().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = BriefSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const user = await getUser()
    const userId = user?.id
    const calfId = parsed.data.calf.id

    if (userId) {
      const allowed = await checkRateLimit(userId, 'brief', 20)
      if (!allowed) {
        return NextResponse.json(
          { error: 'Daily brief limit reached (20/day). Try again tomorrow.' },
          { status: 429 }
        )
      }

      // Check cache
      try {
        const { data: cached } = await adminClient
          .from('briefs')
          .select('content')
          .eq('calf_id', calfId)
          .eq('user_id', userId)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (cached) {
          return NextResponse.json({ brief: cached.content, cached: true })
        }
      } catch {
        // Cache miss
      }
    }

    const brief = await generateBrief(
      parsed.data.calf as unknown as Calf,
      (parsed.data.snapshot as unknown as MarketSnapshot) ?? null
    )

    if (userId) {
      await recordAiRequest(userId, 'brief')

      try {
        await adminClient
          .from('briefs')
          .insert({ calf_id: calfId, user_id: userId, content: brief })
      } catch {
        // Non-critical
      }
    }

    return NextResponse.json({ brief })
  } catch (error) {
    logError('brief-route', error)
    const message = error instanceof Error ? error.message : 'Brief generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
