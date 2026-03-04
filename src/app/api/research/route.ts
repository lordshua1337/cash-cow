import { NextResponse } from 'next/server'
import { z } from 'zod'
import { researchNiche, generateCalfIdeas } from '@/lib/ai/claude'
import { logError, checkRateLimit, recordAiRequest } from '@/lib/error-logger'
import { getUser } from '@/lib/auth/server'
import { adminClient } from '@/lib/supabase/client'

const ResearchSchema = z.object({
  niche: z.string().min(2).max(200).trim(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = ResearchSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { niche } = parsed.data
    const user = await getUser()
    const userId = user?.id

    // Rate limiting for authenticated users
    if (userId) {
      const allowed = await checkRateLimit(userId, 'research', 10)
      if (!allowed) {
        return NextResponse.json(
          { error: 'Daily research limit reached (10/day). Try again tomorrow.' },
          { status: 429 }
        )
      }
    }

    // Check cache for authenticated users
    if (userId) {
      try {
        const { data: cached } = await adminClient
          .from('snapshots')
          .select('*')
          .eq('user_id', userId)
          .eq('niche', niche)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (cached) {
          const snapshot = cached.data as Record<string, unknown>
          const { data: cachedCalves } = await adminClient
            .from('calves')
            .select('*')
            .eq('snapshot_id', cached.id)
            .eq('user_id', userId)

          const calves = (cachedCalves ?? []).map((c: Record<string, unknown>) => c.data)
          return NextResponse.json({ snapshot, calves, cached: true })
        }
      } catch {
        // Cache miss -- proceed with fresh research
      }
    }

    const snapshot = await researchNiche(niche)
    const calves = await generateCalfIdeas(snapshot)

    // Persist for authenticated users
    if (userId) {
      await recordAiRequest(userId, 'research')

      try {
        await adminClient
          .from('snapshots')
          .upsert({ id: snapshot.id, user_id: userId, niche, data: snapshot })

        for (const calf of calves) {
          await adminClient
            .from('calves')
            .upsert({ id: calf.id, user_id: userId, snapshot_id: snapshot.id, niche, data: calf })
        }
      } catch {
        // Persistence failure is non-critical
      }
    }

    return NextResponse.json({ snapshot, calves })
  } catch (error) {
    logError('research-route', error)
    const message = error instanceof Error ? error.message : 'Research failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
