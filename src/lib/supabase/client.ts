import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _adminClient: SupabaseClient | null = null
let _configured = false

function getAdminClient(): SupabaseClient | null {
  if (_configured) return _adminClient
  _configured = true

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    _adminClient = null
    return null
  }
  _adminClient = createClient(url, key)
  return _adminClient
}

// No-op stub that silently does nothing when Supabase is not configured
const NO_OP_PROXY: unknown = new Proxy(() => {}, {
  get: () => NO_OP_PROXY,
  apply: () => Promise.resolve({ data: null, error: null, count: null }),
})

export const adminClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getAdminClient()
    if (!client) return (NO_OP_PROXY as Record<string, unknown>)[prop as string] ?? NO_OP_PROXY
    const value = (client as unknown as Record<string, unknown>)[prop as string]
    return typeof value === 'function' ? (value as Function).bind(client) : value
  },
})
