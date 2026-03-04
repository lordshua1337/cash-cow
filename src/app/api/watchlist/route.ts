import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireUser } from '@/lib/auth/server'
import { adminClient } from '@/lib/supabase/client'
import { logError } from '@/lib/error-logger'

const WatchlistSchema = z.object({
  niche: z.string().min(2).max(200).trim(),
  refreshInterval: z.enum(['daily', 'weekly', 'monthly']).optional().default('weekly'),
})

export async function GET() {
  try {
    const user = await requireUser()

    const { data, error } = await adminClient
      .from('watchlists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ watchlists: data ?? [] })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Sign in to use watchlists' }, { status: 401 })
    }
    logError('watchlist-get', error)
    return NextResponse.json({ error: 'Failed to fetch watchlists' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser()
    const body = await request.json()
    const parsed = WatchlistSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { niche, refreshInterval } = parsed.data

    const { data, error } = await adminClient
      .from('watchlists')
      .upsert(
        { user_id: user.id, niche, refresh_interval: refreshInterval },
        { onConflict: 'user_id,niche' }
      )
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ watchlist: data })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Sign in to use watchlists' }, { status: 401 })
    }
    logError('watchlist-post', error)
    return NextResponse.json({ error: 'Failed to save watchlist' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireUser()
    const { searchParams } = new URL(request.url)
    const niche = searchParams.get('niche')

    if (!niche) {
      return NextResponse.json({ error: 'Missing niche parameter' }, { status: 400 })
    }

    const { error } = await adminClient
      .from('watchlists')
      .delete()
      .eq('user_id', user.id)
      .eq('niche', niche)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Sign in to use watchlists' }, { status: 401 })
    }
    logError('watchlist-delete', error)
    return NextResponse.json({ error: 'Failed to delete watchlist' }, { status: 500 })
  }
}
