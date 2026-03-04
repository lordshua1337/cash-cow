import { NextRequest, NextResponse } from 'next/server'

interface AdIntelPayload {
  readonly source: string
  readonly timestamp: string
  readonly competitorId: string
  readonly adPatterns: Record<string, unknown>
  readonly spend: number
}

function isValidPayload(body: unknown): body is AdIntelPayload {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  return (
    typeof b.source === 'string' &&
    typeof b.timestamp === 'string' &&
    typeof b.competitorId === 'string' &&
    typeof b.adPatterns === 'object' &&
    typeof b.spend === 'number'
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!isValidPayload(body)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // During stub phase, just acknowledge receipt
    // In production, analyze competitor ads: await analyzeCompetitorAds(body.competitorId, body.adPatterns)
    return NextResponse.json(
      { status: 'received', processed: false, analysisId: null },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}
