import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getRecommendations } from '@/lib/ai/recommendations'
import { logError, checkRateLimit, recordAiRequest } from '@/lib/error-logger'
import { getUser } from '@/lib/auth/server'
import type { Calf, MarketSnapshot } from '@/lib/types'

const RecommendationsSchema = z.object({
  calves: z.array(z.object({
    id: z.string(),
    productName: z.string(),
    niche: z.string(),
    status: z.string(),
    overallScore: z.number(),
    marketDemandScore: z.number(),
    competitionDensityScore: z.number(),
    revenuePotentialScore: z.number(),
    pricingRecommendation: z.number(),
  }).passthrough()),
  snapshots: z.array(z.object({
    niche: z.string(),
    trendingProducts: z.array(z.any()),
    competitorLandscape: z.array(z.any()),
    reviewComplaintClusters: z.array(z.any()),
  }).passthrough()),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = RecommendationsSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const user = await getUser()
    if (user?.id) {
      const allowed = await checkRateLimit(user.id, 'recommendations', 10)
      if (!allowed) {
        return NextResponse.json({ error: 'Daily recommendations limit reached. Try again tomorrow.' }, { status: 429 })
      }
      await recordAiRequest(user.id, 'recommendations')
    }

    const recommendations = await getRecommendations(
      parsed.data.calves as unknown as Calf[],
      parsed.data.snapshots as unknown as MarketSnapshot[]
    )
    return NextResponse.json({ recommendations })
  } catch (error) {
    logError('recommendations-route', error)
    const message = error instanceof Error ? error.message : 'Recommendations failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
