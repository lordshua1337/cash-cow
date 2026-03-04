import { NextRequest, NextResponse } from 'next/server'

interface TrendAlertPayload {
  readonly source: string
  readonly timestamp: string
  readonly trendId: string
  readonly category: string
  readonly velocity: number
  readonly score: number
}

function isValidPayload(body: unknown): body is TrendAlertPayload {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  return (
    typeof b.source === 'string' &&
    typeof b.timestamp === 'string' &&
    typeof b.trendId === 'string' &&
    typeof b.category === 'string' &&
    typeof b.velocity === 'number' &&
    typeof b.score === 'number'
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!isValidPayload(body)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // During stub phase, just acknowledge receipt
    // In production, trigger ideation: await ideateFromTrend(body.trendId)
    return NextResponse.json(
      { status: 'received', processed: false, ideaCount: 0 },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}
