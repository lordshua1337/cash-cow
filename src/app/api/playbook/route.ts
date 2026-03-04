import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generatePlaybook } from '@/lib/ai/playbook'
import { logError, checkRateLimit, recordAiRequest } from '@/lib/error-logger'
import { getUser } from '@/lib/auth/server'
import type { Calf } from '@/lib/types'

const PlaybookSchema = z.object({
  calf: z.object({
    id: z.string(),
    productName: z.string(),
    targetAudience: z.string(),
    coreFeatures: z.array(z.string()),
    differentiationAngle: z.string(),
    variationLevels: z.object({
      micro: z.object({ name: z.string(), features: z.array(z.string()), buildDays: z.number(), pricing: z.number() }),
      standard: z.object({ name: z.string(), features: z.array(z.string()), buildDays: z.number(), pricing: z.number() }),
      premium: z.object({ name: z.string(), features: z.array(z.string()), buildDays: z.number(), pricing: z.number() }),
    }),
  }).passthrough(),
  variationLevel: z.enum(['micro', 'standard', 'premium']),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = PlaybookSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const user = await getUser()
    if (user?.id) {
      const allowed = await checkRateLimit(user.id, 'playbook', 20)
      if (!allowed) {
        return NextResponse.json({ error: 'Daily playbook limit reached. Try again tomorrow.' }, { status: 429 })
      }
      await recordAiRequest(user.id, 'playbook')
    }

    const playbook = await generatePlaybook(
      parsed.data.calf as unknown as Calf,
      parsed.data.variationLevel
    )
    return NextResponse.json({ playbook })
  } catch (error) {
    logError('playbook-route', error)
    const message = error instanceof Error ? error.message : 'Playbook generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
