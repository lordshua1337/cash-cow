import { adminClient } from '@/lib/supabase/client'

export function logError(context: string, error: unknown, userId?: string): void {
  const message = error instanceof Error ? error.message : String(error)
  const stack = error instanceof Error ? error.stack : undefined

  console.error(`[CashCow] ${context}:`, message)
  if (stack) console.error(stack)

  // Fire-and-forget to Supabase
  try {
    void adminClient
      .from('error_logs')
      .insert({ context, message, stack: stack ?? null, user_id: userId ?? null })
  } catch {
    // Supabase not configured -- console logging is sufficient
  }
}

export async function checkRateLimit(userId: string, requestType: string, dailyLimit = 10): Promise<boolean> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count } = await adminClient
      .from('ai_requests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('request_type', requestType)
      .gte('created_at', today.toISOString())

    return (count ?? 0) < dailyLimit
  } catch {
    // If rate limiting check fails, allow the request
    return true
  }
}

export async function recordAiRequest(userId: string, requestType: string): Promise<void> {
  try {
    await adminClient
      .from('ai_requests')
      .insert({ user_id: userId, request_type: requestType })
  } catch {
    // Non-critical -- don't block on logging failure
  }
}
