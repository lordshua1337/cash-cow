import { NextResponse } from 'next/server'
import { z } from 'zod'
import { forecastRevenue } from '@/lib/ai/forecast'
import { logError, checkRateLimit, recordAiRequest } from '@/lib/error-logger'
import { getUser } from '@/lib/auth/server'
import type { Calf } from '@/lib/types'

const ForecastSchema = z.object({
  calf: z.object({
    id: z.string(),
    productName: z.string(),
    pricingRecommendation: z.number(),
    monetizationModel: z.string(),
    targetAudience: z.string(),
    marketDemandScore: z.number(),
    competitionDensityScore: z.number(),
    revenuePotentialMin: z.number(),
    revenuePotentialMax: z.number(),
  }).passthrough(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = ForecastSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const user = await getUser()
    if (user?.id) {
      const allowed = await checkRateLimit(user.id, 'forecast', 20)
      if (!allowed) {
        return NextResponse.json({ error: 'Daily forecast limit reached. Try again tomorrow.' }, { status: 429 })
      }
      await recordAiRequest(user.id, 'forecast')
    }

    const forecast = await forecastRevenue(parsed.data.calf as unknown as Calf)
    return NextResponse.json({ forecast })
  } catch (error) {
    logError('forecast-route', error)
    const message = error instanceof Error ? error.message : 'Forecast failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
