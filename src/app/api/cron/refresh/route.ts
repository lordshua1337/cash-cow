import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/client'
import { researchNiche } from '@/lib/ai/claude'
import { logError } from '@/lib/error-logger'

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get watchlists that need refreshing
    const { data: watchlists, error: fetchError } = await adminClient
      .from('watchlists')
      .select('*')
      .or(
        'last_refreshed_at.is.null,' +
        'and(refresh_interval.eq.daily,last_refreshed_at.lt.' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() + '),' +
        'and(refresh_interval.eq.weekly,last_refreshed_at.lt.' + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() + '),' +
        'and(refresh_interval.eq.monthly,last_refreshed_at.lt.' + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() + ')'
      )

    if (fetchError) throw fetchError

    const results: Array<{ niche: string; status: string }> = []

    for (const watchlist of watchlists ?? []) {
      try {
        const snapshot = await researchNiche(watchlist.niche)

        // Save new snapshot
        await adminClient
          .from('snapshots')
          .upsert({
            id: snapshot.id,
            user_id: watchlist.user_id,
            niche: watchlist.niche,
            data: snapshot,
          })

        // Update last refreshed
        await adminClient
          .from('watchlists')
          .update({ last_refreshed_at: new Date().toISOString() })
          .eq('id', watchlist.id)

        results.push({ niche: watchlist.niche, status: 'refreshed' })
      } catch (error) {
        logError('cron-refresh-niche', error, watchlist.user_id)
        results.push({ niche: watchlist.niche, status: 'failed' })
      }
    }

    return NextResponse.json({
      processed: results.length,
      results,
    })
  } catch (error) {
    logError('cron-refresh', error)
    return NextResponse.json({ error: 'Cron refresh failed' }, { status: 500 })
  }
}
